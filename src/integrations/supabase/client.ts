// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://illihxhtrykatjrqjilo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlsbGloeGh0cnlrYXRqcnFqaWxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkwODY0MDAsImV4cCI6MjA2NDY2MjQwMH0.MzxnHOqoV-P-JnBbLAeWgiYVNgZZZDKapOcMbMIC-Lo";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);