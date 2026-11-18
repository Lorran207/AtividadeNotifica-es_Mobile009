import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

export const isSupabaseConfigured = true;

export const supabase = createClient(
  'https://yrjfcondclcrfumozgnu.supabase.co',
  'sb_publishable_zUi9CTEKyXOcQ3RZk0hjDA_pYa2JHGq'
);
