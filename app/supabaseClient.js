import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zijykyypqpkpciiwapgv.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppanlreXlwcXBrcGNpaXdhcGd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDM3Nzc3MzAsImV4cCI6MjAxOTM1MzczMH0.nzGMLb3REuFPv6DbLN3RiFSbWgza7-zcUGZdbsC-LCc";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
