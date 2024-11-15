
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://fuwpynywldgbvoycjfqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1d3B5bnl3bGRnYnZveWNqZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODc3MTUsImV4cCI6MjA0NjU2MzcxNX0.c5J9CLU1kZF9l_Uc50Fejatqly6aKIMj6TCvT6f6NPg';

export const supabase = createClient(supabaseUrl, supabaseKey);
        