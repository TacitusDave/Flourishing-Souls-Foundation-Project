// Shared CORS headers for donation-related Edge Functions.
// paystack-webhook does not use this (Paystack's servers call it directly,
// not a browser, so no CORS preflight applies there).
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};
