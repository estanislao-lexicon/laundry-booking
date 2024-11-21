
import { createClient } from "@supabase/supabase-js";

// Es
const supabaseUrl = 'https://fuwpynywldgbvoycjfqx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ1d3B5bnl3bGRnYnZveWNqZnF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5ODc3MTUsImV4cCI6MjA0NjU2MzcxNX0.c5J9CLU1kZF9l_Uc50Fejatqly6aKIMj6TCvT6f6NPg';

// My stuff
const supabaseUrlpt = 'https://dtpatbzxwqzmwhmrdinf.supabase.co';
const supabaseKeypt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR0cGF0Ynp4d3F6bXdobXJkaW5mIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzIxMTQ2NTQsImV4cCI6MjA0NzY5MDY1NH0.XesACcib0m8omZVFVUWSNhMJ8MytFkjsyo8JLLc24w4';


export const supabase = createClient(supabaseUrlpt, supabaseKeypt);
        
