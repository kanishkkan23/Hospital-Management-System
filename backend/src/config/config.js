import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://carepoint-hms.supabase.co',
    anonKey: process.env.SUPABASE_ANON_KEY || 'mock_anon_key',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock_service_key',
  },
  storage: {
    avatarsBucket: process.env.SUPABASE_STORAGE_AVATARS || 'avatars',
    reportsBucket: process.env.SUPABASE_STORAGE_REPORTS || 'lab-reports',
    documentsBucket: process.env.SUPABASE_STORAGE_DOCUMENTS || 'patient-documents',
  }
};

export default config;
