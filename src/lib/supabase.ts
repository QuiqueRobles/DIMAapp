import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hdjxzlniglvsaridyynv.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhkanh6bG5pZ2x2c2FyaWR5eW52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjkzNTAzMTcsImV4cCI6MjA0NDkyNjMxN30.gjLGC4yyc4XZyjZscxw6Vt4Yuhcj3-NBWaCjPk8iRIM'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);