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
  serverTimestamp, 
  Firestore,
  writeBatch
} from 'firebase/firestore';
import { Course } from '../types';
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
