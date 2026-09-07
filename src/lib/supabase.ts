import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Course } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

/**
 * Helper mapper from PostgreSQL / Supabase row to Course TypeScript object
 */
export function mapRowToCourse(item: any): Course {
  return {
    id: String(item.id),
    title: item.title || 'Untitled Course',
    provider: item.provider || 'OpenCourse Contributor',
    providerType: item.provider_type || item.providerType || 'tech_firm',
    platform: item.platform || 'other',
    url: item.url || '#',
    image: item.image || '',
    imageAlt: item.image_alt || item.imageAlt || item.title || '',
    category: item.category || 'all',
    categoryLabel: item.category_label || item.categoryLabel || 'General',
    level: item.level || 'Beginner',
    duration: item.duration || 'Self-paced',
    durationHours: Number(item.duration_hours || item.durationHours || 20),
    rating: Number(item.rating || 4.8),
    reviewCount: item.review_count || item.reviewCount || '1.0k',
    hasCertificate: Boolean(item.has_certificate ?? item.hasCertificate),
    accessTier: item.access_tier || item.accessTier || 'free_cert',
    accessBadgeText: item.access_badge_text || item.accessBadgeText || '100% Free',
    description: item.description || '',
    skills: Array.isArray(item.skills) ? item.skills : [],
    featured: Boolean(item.featured),
  };
}

/**
 * Seed initial courses into Supabase if empty
 */
export async function seedSupabaseIfEmpty(initialCourses: Course[]): Promise<void> {
  if (!supabase) return;
  try {
    if (localStorage.getItem('bagiilmu_db_cleared_by_admin') === 'true') {
      return;
    }

    const { count, error } = await supabase
      .from('courses')
      .select('*', { count: 'exact', head: true });

    if (!error && (count === 0 || count === null)) {
      console.log('Seeding initial courses to Supabase...');
      const payload = initialCourses.map((c) => ({
        id: c.id,
        title: c.title,
        provider: c.provider,
        provider_type: c.providerType || 'tech_firm',
        platform: c.platform,
        url: c.url,
        image: c.image,
        image_alt: c.imageAlt || c.title,
        category: c.category,
        category_label: c.categoryLabel,
        level: c.level,
        duration: c.duration,
        duration_hours: c.durationHours || 20,
        rating: c.rating || 5.0,
        review_count: c.reviewCount || '1.0k',
        has_certificate: c.hasCertificate,
        access_tier: c.accessTier,
        access_badge_text: c.accessBadgeText,
        description: c.description,
        skills: c.skills || [],
        featured: Boolean(c.featured),
      }));

      await supabase.from('courses').upsert(payload);
      console.log('Supabase seeding complete.');
    }
  } catch (err) {
    console.warn('Supabase seeding check error:', err);
  }
}

/**
 * Subscribe to real-time courses updates from Supabase
 */
export function subscribeToSupabaseCourses(
  onCoursesReceived: (courses: Course[]) => void,
  onError?: (err: Error) => void
): () => void {
  if (!supabase) {
    if (onError) onError(new Error('Supabase client is not configured'));
    return () => {};
  }

  // Fetch initial data
  supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false })
    .then(({ data, error }) => {
      if (error) {
        console.error('Error fetching courses from Supabase:', error);
        if (onError) onError(error as any);
      } else if (data) {
        onCoursesReceived(data.map(mapRowToCourse));
      }
    });

  // Realtime subscription
  const channel = supabase
    .channel('public:courses')
    .on(
      'postgres_changes',
      { event: '*', schema: 'public', table: 'courses' },
      async () => {
        const { data } = await supabase!
          .from('courses')
          .select('*')
          .order('created_at', { ascending: false });
        if (data) {
          onCoursesReceived(data.map(mapRowToCourse));
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

/**
 * Add a new course to Supabase
 */
export async function addCourseToSupabase(newCourse: Omit<Course, 'id'> & { id?: string }): Promise<Course> {
  if (!supabase) throw new Error('Supabase is not configured');

  const row = {
    ...(newCourse.id ? { id: newCourse.id } : {}),
    title: newCourse.title,
    provider: newCourse.provider,
    provider_type: newCourse.providerType || 'tech_firm',
    platform: newCourse.platform,
    url: newCourse.url,
    image: newCourse.image,
    image_alt: newCourse.imageAlt || newCourse.title,
    category: newCourse.category,
    category_label: newCourse.categoryLabel,
    level: newCourse.level,
    duration: newCourse.duration,
    duration_hours: newCourse.durationHours || 20,
    rating: newCourse.rating || 5.0,
    review_count: newCourse.reviewCount || 'Baru',
    has_certificate: newCourse.hasCertificate,
    access_tier: newCourse.accessTier,
    access_badge_text: newCourse.accessBadgeText,
    description: newCourse.description,
    skills: newCourse.skills || [],
    featured: Boolean(newCourse.featured),
  };

  const { data, error } = await supabase
    .from('courses')
    .upsert([row])
    .select()
    .single();

  if (error) {
    console.error('Supabase insert error:', error);
    throw error;
  }

  return mapRowToCourse(data);
}

/**
 * Delete a course from Supabase
 */
export async function deleteCourseFromSupabase(courseId: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.from('courses').delete().eq('id', courseId);
  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
}

/**
 * Clear all courses from Supabase
 */
export async function clearAllCoursesSupabase(): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured');

  const { error } = await supabase.from('courses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) {
    console.error('Supabase clear error:', error);
    throw error;
  }
  localStorage.setItem('bagiilmu_db_cleared_by_admin', 'true');
}
