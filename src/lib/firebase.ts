import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  onSnapshot, 
  doc, 
  setDoc, 
  addDoc, 
  deleteDoc, 
  getDocs, 
  getDoc,
  serverTimestamp, 
  Firestore,
  writeBatch
} from 'firebase/firestore';
import { Course, PendingSubmission, UserCourseProgressMap } from '../types';
import firebaseConfig from '../../firebase-applet-config.json';

let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Named firestore database if provided in config
export const db: Firestore = firebaseConfig.firestoreDatabaseId && firebaseConfig.firestoreDatabaseId !== '(default)'
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

const COURSES_COLLECTION = 'courses';
const SUBMISSIONS_COLLECTION = 'pending_submissions';
const USER_PROGRESS_COLLECTION = 'user_progress';

/**
 * Seed initial courses into Firestore if the collection is currently empty
 */
export async function seedCoursesIfEmpty(initialCourses: Course[]): Promise<void> {
  try {
    // If admin explicitly cleared the db, don't re-seed automatically
    if (localStorage.getItem('bagiilmu_db_cleared_by_admin') === 'true') {
      console.log('Database was cleared by admin, skipping automatic seeding.');
      return;
    }

    const colRef = collection(db, COURSES_COLLECTION);
    const snapshot = await getDocs(colRef);
    if (snapshot.empty) {
      console.log('Seeding initial courses to Firestore...');
      const batch = writeBatch(db);
      for (const course of initialCourses) {
        const docRef = doc(db, COURSES_COLLECTION, course.id);
        batch.set(docRef, {
          ...course,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });
      }
      await batch.commit();
      console.log(`Successfully seeded ${initialCourses.length} courses to Firestore.`);
    }
  } catch (error) {
    console.warn('Firestore seeding check error:', error);
  }
}

/**
 * Subscribe to real-time courses updates from Firestore
 */
export function subscribeToCourses(
  onCoursesReceived: (courses: Course[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, COURSES_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const coursesList: Course[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        coursesList.push({
          id: docSnap.id,
          title: data.title || 'Untitled Course',
          provider: data.provider || 'OpenCourse Contributor',
          providerType: data.providerType,
          platform: data.platform || 'other',
          url: data.url || '#',
          image: data.image || '',
          imageAlt: data.imageAlt || (data.title || 'Course thumbnail'),
          category: data.category || 'all',
          categoryLabel: data.categoryLabel || 'General',
          level: data.level || 'Beginner',
          duration: data.duration || 'Self-paced',
          durationHours: data.durationHours,
          rating: typeof data.rating === 'number' ? data.rating : 4.8,
          reviewCount: data.reviewCount || '1.0k',
          hasCertificate: Boolean(data.hasCertificate),
          accessTier: data.accessTier || 'free_cert',
          accessBadgeText: data.accessBadgeText || '100% Free',
          description: data.description || '',
          skills: Array.isArray(data.skills) ? data.skills : [],
          featured: Boolean(data.featured)
        });
      });
      onCoursesReceived(coursesList);
    },
    (err) => {
      console.error('Firestore snapshot subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Add a new course to Firestore (admin restricted)
 */
export async function addCourseToFirestore(newCourse: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
  const colRef = collection(db, COURSES_COLLECTION);
  
  const coursePayload = {
    title: newCourse.title,
    provider: newCourse.provider,
    providerType: newCourse.providerType || 'tech_firm',
    platform: newCourse.platform,
    url: newCourse.url,
    image: newCourse.image,
    imageAlt: newCourse.imageAlt || newCourse.title,
    category: newCourse.category,
    categoryLabel: newCourse.categoryLabel,
    level: newCourse.level,
    duration: newCourse.duration,
    durationHours: newCourse.durationHours || 20,
    rating: newCourse.rating || 5.0,
    reviewCount: newCourse.reviewCount || 'Baru',
    hasCertificate: newCourse.hasCertificate,
    accessTier: newCourse.accessTier,
    accessBadgeText: newCourse.accessBadgeText,
    description: newCourse.description,
    skills: newCourse.skills || [],
    featured: Boolean(newCourse.featured),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  if (newCourse.id) {
    const docRef = doc(db, COURSES_COLLECTION, newCourse.id);
    await setDoc(docRef, coursePayload);
    return { ...newCourse, id: newCourse.id };
  } else {
    const docRef = await addDoc(colRef, coursePayload);
    return { ...newCourse, id: docRef.id };
  }
}

/**
 * Delete a course from Firestore (admin restricted)
 */
export async function deleteCourseFromFirestore(courseId: string): Promise<void> {
  const docRef = doc(db, COURSES_COLLECTION, courseId);
  await deleteDoc(docRef);
}

/**
 * Clear all courses from Firestore (admin restricted)
 */
export async function clearAllCourses(): Promise<void> {
  try {
    console.log('Attempting to clear all courses from Firestore...');
    const colRef = collection(db, COURSES_COLLECTION);
    const snapshot = await getDocs(colRef);
    
    if (snapshot.empty) {
      console.log('Collection is already empty.');
      return;
    }

    console.log(`Found ${snapshot.size} documents to delete.`);
    const batch = writeBatch(db);
    snapshot.forEach((docSnap) => {
      batch.delete(docSnap.ref);
    });
    
    await batch.commit();
    
    // Set a flag in localStorage to prevent re-seeding if we explicitly cleared
    localStorage.setItem('bagiilmu_db_cleared_by_admin', 'true');
    console.log('Successfully cleared all courses from Firestore.');
  } catch (error) {
    console.error('Error clearing database:', error);
    throw error;
  }
}

/**
 * Add a new Community Submission to Firestore (for User Role)
 */
export async function addPendingSubmissionToFirestore(
  submission: Omit<PendingSubmission, 'id'> & { id?: string }
): Promise<PendingSubmission> {
  const colRef = collection(db, SUBMISSIONS_COLLECTION);
  const payload = {
    ...submission,
    createdAt: serverTimestamp(),
  };

  if (submission.id) {
    const docRef = doc(db, SUBMISSIONS_COLLECTION, submission.id);
    await setDoc(docRef, payload);
    return { ...submission, id: submission.id };
  } else {
    const docRef = await addDoc(colRef, payload);
    return { ...submission, id: docRef.id };
  }
}

/**
 * Subscribe to Pending Submissions from Firestore
 */
export function subscribeToPendingSubmissions(
  onSubmissionsReceived: (submissions: PendingSubmission[]) => void,
  onError?: (err: Error) => void
): () => void {
  const colRef = collection(db, SUBMISSIONS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const submissionsList: PendingSubmission[] = [];
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        submissionsList.push({
          id: docSnap.id,
          author: data.author || 'Komunitas Pelajar',
          authorRole: data.authorRole || 'Community Member',
          avatar: data.avatar || 'KM',
          submittedTime: data.submittedTime || 'Baru saja',
          note: data.note || '',
          title: data.title || 'Untitled Submission',
          provider: data.provider || 'External Provider',
          platform: data.platform || 'other',
          url: data.url || '#',
          category: data.category || 'webdev',
          categoryLabel: data.categoryLabel || 'General',
          level: data.level || 'Intermediate',
          duration: data.duration || 'Self-paced',
          hasCertificate: Boolean(data.hasCertificate),
          accessTier: data.accessTier || 'free_cert',
          accessBadgeText: data.accessBadgeText || 'Free Access',
          description: data.description || '',
          skills: Array.isArray(data.skills) ? data.skills : [],
          status: data.status || 'pending',
          image: data.image || '',
        });
      });
      onSubmissionsReceived(submissionsList);
    },
    (err) => {
      console.error('Firestore pending submissions subscription error:', err);
      if (onError) onError(err);
    }
  );
}

/**
 * Update Submission Status in Firestore (Admin ACC / Reject)
 */
export async function updateSubmissionStatusInFirestore(
  submissionId: string,
  newStatus: 'approved' | 'rejected'
): Promise<void> {
  const docRef = doc(db, SUBMISSIONS_COLLECTION, submissionId);
  await setDoc(docRef, { status: newStatus, updatedAt: serverTimestamp() }, { merge: true });
}

/**
 * Save / Sync User Course Progress to Firestore
 */
export async function saveUserProgressToFirestore(
  userId: string,
  progressMap: UserCourseProgressMap
): Promise<void> {
  try {
    const docRef = doc(db, USER_PROGRESS_COLLECTION, userId);
    await setDoc(docRef, { progress: progressMap, updatedAt: serverTimestamp() }, { merge: true });
  } catch (err) {
    console.warn('Unable to sync progress to Firestore:', err);
  }
}

/**
 * Get User Course Progress from Firestore
 */
export async function getUserProgressFromFirestore(
  userId: string
): Promise<UserCourseProgressMap | null> {
  try {
    const docRef = doc(db, USER_PROGRESS_COLLECTION, userId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return (snap.data().progress as UserCourseProgressMap) || null;
    }
  } catch (err) {
    console.warn('Unable to get user progress from Firestore:', err);
  }
  return null;
}

const REGISTERED_USERS_COLLECTION = 'registered_users';

/**
 * Register a new user in Firestore
 */
export async function registerUserToFirestore(
  username: string,
  email: string,
  password: string,
  fullName: string
): Promise<{ 
  username: string; 
  email: string; 
  fullName: string; 
  avatarType?: 'initials' | 'character' | 'custom';
  characterId?: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist';
  avatarUrl?: string;
}> {
  const cleanUsername = username.trim().toLowerCase();
  const userDocRef = doc(db, REGISTERED_USERS_COLLECTION, cleanUsername);
  
  const userSnap = await getDoc(userDocRef);
  if (userSnap.exists()) {
    throw new Error('Username sudah terdaftar! Silakan gunakan username lain.');
  }

  const payload = {
    username: cleanUsername,
    email: email.trim(),
    password: password.trim(), // Storing as plaintext for educational app prototype
    fullName: fullName.trim(),
    createdAt: serverTimestamp(),
  };

  await setDoc(userDocRef, payload);
  return {
    username: cleanUsername,
    email: payload.email,
    fullName: payload.fullName,
    avatarType: 'initials',
    characterId: 'wizard',
    avatarUrl: '',
  };
}

/**
 * Authenticate a user from Firestore
 */
export async function authenticateUserInFirestore(
  username: string,
  password: string
): Promise<{ username: string; email: string; fullName: string; avatarType?: 'initials' | 'character' | 'custom'; characterId?: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist'; avatarUrl?: string }> {
  const cleanUsername = username.trim().toLowerCase();
  const userDocRef = doc(db, REGISTERED_USERS_COLLECTION, cleanUsername);
  
  const userSnap = await getDoc(userDocRef);
  if (!userSnap.exists()) {
    throw new Error('Username tidak ditemukan! Pastikan Anda sudah mendaftar.');
  }

  const data = userSnap.data();
  if (data.password !== password.trim()) {
    throw new Error('Password salah! Silakan coba lagi.');
  }

  return {
    username: data.username,
    email: data.email || '',
    fullName: data.fullName || data.username,
    avatarType: data.avatarType || 'initials',
    characterId: data.characterId || 'wizard',
    avatarUrl: data.avatarUrl || '',
  };
}

/**
 * Update user profile in Firestore
 */
export async function updateUserProfileInFirestore(
  username: string,
  updates: { fullName: string; email: string; avatarType?: 'initials' | 'character' | 'custom'; characterId?: 'wizard' | 'explorer' | 'analyst' | 'guardian' | 'artist'; avatarUrl?: string }
): Promise<void> {
  const cleanUsername = username.trim().toLowerCase();
  const userDocRef = doc(db, REGISTERED_USERS_COLLECTION, cleanUsername);
  await setDoc(userDocRef, updates, { merge: true });
}

