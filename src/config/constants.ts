// User IDs - Update these with actual Supabase user IDs after creating users
// You can find user IDs in Supabase Dashboard > Authentication > Users
export const USER_IDS = {
  MERT: '1c641c8f-64f6-4965-90c7-2f6ee6a3f9d8', // Ahmet Mert Koçlar
  MUSTAFA: '10735a94-9d94-4fed-b25b-d6603893ff73', // Mustafa Sune
} as const;

// Storage bucket names
export const STORAGE_BUCKETS = {
  CV_FILES: 'cv-files',
  PROJECT_IMAGES: 'project-images',
  PROFILE_IMAGES: 'profile-images',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PROJECTS: '/projects',
  LOGIN: '/login',
  ADMIN: '/admin',
  CV: (name: string) => `/cv/${name}`,
} as const;

// User names for CV routes
export const USER_NAMES = {
  MERT: 'mert',
  MUSTAFA: 'mustafa',
} as const;

