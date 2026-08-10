// paystack-webhook
//
// The real source of truth for donations - Paystack calls this directly
// (not the browser), so it covers users who close the tab mid-payment or
// whose client-side paystack-verify call never fires. Every request must
// carry a valid x-paystack-signature (HMAC-SHA512 of the raw body using
// the secret key) or it's rejected outright.
//
// Deploy: supabase functions deploy paystack-webhook --no-verify-jwt
// (--no-verify-jwt because Paystack's servers can't supply a Supabase JWT -
// the HMAC signature check below is what actually authenticates the caller)
// Register this function's URL as the webhook endpoint in the Paystack
// dashboard: Settings > API Keys & Webhooks.
// Secrets: supabase secrets set PAYSTACK_SECRET_KEY=sk_...

import { createClient } from "jsr:@supabase/supabase-js@2";

async function verifySignature(rawBody: string, signature: string, secret: string): Promise<boolean> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-512" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  const digest = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  // Constant-time-ish comparison (both are fixed-length hex digests)
  if (digest.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < digest.length; i++) diff |= digest.charCodeAt(i) ^ signature.charCodeAt(i);
  return diff === 0;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
  if (!secretKey) {
    return new Response("Server misconfigured", { status: 500 });
  }

  const signature = req.headers.get("x-paystack-signature");
  const rawBody = await req.text();

  if (!signature || !(await verifySignature(rawBody, signature, secretKey))) {
    return new Response("Invalid signature", { status: 400 });
  }

  const event = JSON.parse(rawBody);

  if (event.event === "charge.success") {
    const tx = event.data;
    const metadata = tx.metadata && typeof tx.metadata === "object" ? tx.metadata : {};

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { error: dbError } = await supabase.from("donations").upsert(
      {
        name: metadata.name || tx.customer?.email?.split("@")[0] || "Anonymous Donor",
        email: tx.customer?.email,
        phone: metadata.phone || null,
        amount: tx.amount / 100,
        reference: tx.reference,
        status: "success",
        channel: tx.channel || "paystack",
        organization: metadata.organization || null,
        metadata,
        paid_at: tx.paid_at,
      },
      { onConflict: "reference" }
    );

    if (dbError) {
      // Still return 200 would hide real failures from Paystack's retry
      // logic - return 500 so Paystack retries the delivery.
      return new Response(`DB error: ${dbError.message}`, { status: 500 });
    }
  }

  // Acknowledge all other event types without processing them - Paystack
  // sends many event kinds, we only act on charge.success.
  return new Response("OK", { status: 200 });
});
