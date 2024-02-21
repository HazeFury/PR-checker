import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://voucbfuysxiwlwvbgcfu.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdWNiZnV5c3hpd2x3dmJnY2Z1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDgzNzI5MjMsImV4cCI6MjAyMzk0ODkyM30.xmj1gVwnoXFfCItBk7GVeXfu384eBLI9S-sNu4_4G7c",
);

export default supabase;
