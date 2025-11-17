// User types
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  cv_url: string | null;
  created_at: string;
  updated_at: string;
}

// CV Version types
export type CVFormat = 'pdf' | 'docx' | 'doc' | 'txt' | 'html';

export interface CVVersion {
  id: string;
  user_id: string;
  version: number;
  file_path: string;
  file_format: CVFormat;
  file_size: number;
  template_name?: string | null;
  is_active: boolean;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CVDownload {
  id: string;
  cv_version_id: string;
  user_id: string;
  ip_address?: string | null;
  user_agent?: string | null;
  downloaded_at: string;
}

export interface CVAnalytics {
  totalDownloads: number;
  downloadsLast7Days: number;
  downloadsLast30Days: number;
  downloadsByVersion: Array<{
    version: number;
    count: number;
  }>;
  downloadsByDate: Array<{
    date: string;
    count: number;
  }>;
  averageDownloadsPerDay: number;
}

// Project types
export type ProjectStatus = 'active' | 'completed' | 'in-development' | 'on-hold';
export type ProjectCategory = 'web' | 'mobile' | 'desktop' | 'api' | 'other';

export interface Project {
  id: string;
  title_tr: string;
  title_en: string;
  description_tr: string;
  description_en: string;
  tags: string[];
  image_url: string | null;
  live_url: string | null;
  github_url: string | null;
  category?: ProjectCategory;
  status?: ProjectStatus;
  star_count?: number;
  fork_count?: number;
  view_count?: number;
  featured?: boolean;
  display_order?: number;
  created_at: string;
  updated_at: string;
}

// About us types
export interface SocialLink {
  platform: string;
  url: string;
  icon?: string;
}

export interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  start_date: string;
  end_date: string | null;
  description_tr?: string;
  description_en?: string;
  location?: string;
}

export interface Experience {
  id?: string;
  company: string;
  position: string;
  start_date: string;
  end_date: string | null;
  description_tr: string;
  description_en: string;
  location?: string;
  current?: boolean;
}

export interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issue_date: string;
  expiry_date: string | null;
  credential_id?: string;
  credential_url?: string;
}

export interface Testimonial {
  id?: string;
  name: string;
  role: string;
  company?: string;
  content_tr: string;
  content_en: string;
  avatar_url?: string;
  rating?: number;
}

export interface AboutUs {
  user_id: string;
  bio_tr: string;
  bio_en: string;
  skills: string[];
  profile_image_url?: string;
  social_links?: SocialLink[];
  education?: Education[];
  experience?: Experience[];
  certifications?: Certification[];
  testimonials?: Testimonial[];
  contact_email?: string;
  contact_phone?: string;
  location?: string;
  updated_at: string;
}

// Site content types
export interface SiteContent {
  id: string;
  lang: 'tr' | 'en';
  section: string;
  key: string;
  value: string;
  updated_at: string;
}

// Site settings types
export interface SiteSettings {
  id: string;
  email: string | null;
  phone: string | null;
  location: string | null;
  created_at: string;
  updated_at: string;
}

// Blog types
export type BlogCategory = 'general' | 'tutorial' | 'project' | 'news' | 'tips' | 'other';

export interface BlogPost {
  id: string;
  title_tr: string;
  title_en: string;
  slug_tr: string;
  slug_en: string;
  excerpt_tr?: string | null;
  excerpt_en?: string | null;
  content_tr: string;
  content_en: string;
  featured_image_url?: string | null;
  download_url?: string | null;
  download_label_tr?: string | null;
  download_label_en?: string | null;
  category?: BlogCategory;
  tags: string[];
  published: boolean;
  published_at?: string | null;
  view_count?: number;
  author_id?: string | null;
  created_at: string;
  updated_at: string;
}

// Footer links types
export interface FooterLink {
  id: string;
  label_tr: string;
  label_en: string;
  path: string;
  order_index: number;
  is_external: boolean;
  created_at: string;
  updated_at: string;
}

// Social links types
export interface SocialLinkItem {
  id: string;
  platform: string;
  url: string;
  icon_name?: string | null;
  order_index: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Auth context types
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
}

// Theme context types
export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

