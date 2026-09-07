export type Category = 
  | 'all' 
  | 'webdev' 
  | 'security' 
  | 'ai' 
  | 'design' 
  | 'cloud' 
  | 'mobile' 
  | 'product';

export type AccessTier = 
  | 'free_cert' 
  | 'audit_only' 
  | 'oer' 
  | 'financial_aid';

export interface Course {
  id: string;
  title: string;
  provider: string;
  providerType?: 'university' | 'tech_firm' | 'community';
  platform: string;
  url: string;
  image: string;
  imageAlt: string;
  category: Category;
  categoryLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  durationHours?: number;
  rating: number;
  reviewCount: string;
  hasCertificate: boolean;
  accessTier: AccessTier;
  accessBadgeText: string;
  description: string;
  skills: string[];
  featured?: boolean;
}

export type SubFilter = 'all' | 'cert_only' | 'top_rated';

export type CourseLearningStatus = 'unstarted' | 'in_progress' | 'completed';

export type UserCourseProgressMap = Record<string, CourseLearningStatus>;

export interface PendingSubmission {
  id: string;
  author: string;
  authorRole: string;
  avatar: string;
  submittedTime: string;
  note: string;
  title: string;
  provider: string;
  platform: string;
  url: string;
  category: Category;
  categoryLabel: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  duration: string;
  hasCertificate: boolean;
  accessTier: 'free_cert' | 'audit_only' | 'oer';
  accessBadgeText: string;
  description: string;
  skills: string[];
  status: 'pending' | 'approved' | 'rejected';
  image?: string;
  createdAt?: string;
}

export interface CuratorFormData {
  title: string;
  platform: string;
  url: string;
  instructor: string;
  language: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All Levels';
  accessTier: '100% Free with Certificate' | 'Free Audit Only / No Free Certificate' | 'Open Educational Resource (OER)' | 'Financial Aid Available';
  noCreditCardConfirmed: boolean;
  accessDuration: 'lifetime' | 'promo';
  primaryCategory: string;
  duration: string;
  isSelfPaced: boolean;
  skills: string[];
  description: string;
  thumbnailUrl: string;
  thumbnailFilename: string;
  thumbnailDimensions?: string;
  thumbnailSize?: string;
}
