import { Course } from '../types';
import { 
  isSupabaseConfigured, 
  subscribeToSupabaseCourses, 
  addCourseToSupabase, 
  deleteCourseFromSupabase, 
  clearAllCoursesSupabase, 
  seedSupabaseIfEmpty 
} from './supabase';
import { 
  subscribeToCourses as subscribeToFirestoreCourses, 
  addCourseToFirestore, 
  deleteCourseFromFirestore, 
  clearAllCourses as clearAllFirestoreCourses, 
  seedCoursesIfEmpty as seedFirestoreIfEmpty,
  addPendingSubmissionToFirestore,
  subscribeToPendingSubmissions,
  updateSubmissionStatusInFirestore,
  saveUserProgressToFirestore,
  getUserProgressFromFirestore,
  registerUserToFirestore,
  authenticateUserInFirestore,
  updateUserProfileInFirestore
} from './firebase';

export { isSupabaseConfigured };

export { 
  addPendingSubmissionToFirestore, 
  subscribeToPendingSubmissions, 
  updateSubmissionStatusInFirestore, 
  saveUserProgressToFirestore,
  getUserProgressFromFirestore,
  registerUserToFirestore,
  authenticateUserInFirestore,
  updateUserProfileInFirestore
};

export async function seedCoursesIfEmptyDb(initialCourses: Course[]): Promise<void> {
  if (isSupabaseConfigured) {
    return seedSupabaseIfEmpty(initialCourses);
  }
  return seedFirestoreIfEmpty(initialCourses);
}

export function subscribeToCoursesDb(
  onCoursesReceived: (courses: Course[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (isSupabaseConfigured) {
    return subscribeToSupabaseCourses(onCoursesReceived, onError);
  }
  return subscribeToFirestoreCourses(onCoursesReceived, onError);
}

export async function addCourseToDb(newCourse: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
  if (isSupabaseConfigured) {
    return addCourseToSupabase(newCourse);
  }
  return addCourseToFirestore(newCourse);
}

export async function deleteCourseFromDb(courseId: string): Promise<void> {
  if (isSupabaseConfigured) {
    return deleteCourseFromSupabase(courseId);
  }
  return deleteCourseFromFirestore(courseId);
}

export async function clearAllCoursesDb(): Promise<void> {
  if (isSupabaseConfigured) {
    return clearAllCoursesSupabase();
  }
  return clearAllFirestoreCourses();
}
