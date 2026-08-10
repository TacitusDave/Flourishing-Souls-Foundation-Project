// paystack-verify
//
// Called by the client immediately after Paystack's inline popup reports
// success, with only { reference }. Everything else about the donation
// (amount, email, status, paid_at, and the name/phone/organization that
// were attached as metadata when the transaction was created) comes from
// Paystack's own verify response - never from what the client claims.
// This is what closes the gap in the old flow, where the client called
// saveDonation() directly with self-reported data and nothing checked it
// against Paystack at all.
//
// Deploy: supabase functions deploy paystack-verify
// Secrets: supabase secrets set PAYSTACK_SECRET_KEY=sk_...

import { createClient } from "jsr:@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const PAYSTACK_BASE_URL = "https://api.paystack.co";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { reference } = await req.json();
    if (!reference || typeof reference !== "string") {
      return new Response(JSON.stringify({ error: "Missing or invalid reference" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const secretKey = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!secretKey) {
      return new Response(JSON.stringify({ error: "Server misconfigured: missing Paystack secret" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify against Paystack - this is the actual security check.
    const verifyResp = await fetch(
      `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
      { headers: { Authorization: `Bearer ${secretKey}` } }
    );
    const verifyResult = await verifyResp.json();

    if (!verifyResp.ok || !verifyResult.status) {
      return new Response(
        JSON.stringify({ error: verifyResult.message || "Could not verify transaction with Paystack" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const tx = verifyResult.data;
    if (tx.status !== "success") {
      return new Response(JSON.stringify({ error: `Transaction not successful (status: ${tx.status})` }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const metadata = tx.metadata && typeof tx.metadata === "object" ? tx.metadata : {};

    // Service-role client bypasses RLS - this is the only path allowed to
    // write to `donations` (see supabase/schema.sql: no client insert policy).
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { data: donation, error: dbError } = await supabase
      .from("donations")
      .upsert(
        {
          name: metadata.name || tx.customer?.email?.split("@")[0] || "Anonymous Donor",
          email: tx.customer?.email,
          phone: metadata.phone || null,
          amount: tx.amount / 100, // kobo -> naira
          reference: tx.reference,
          status: "success",
          channel: tx.channel || "paystack",
          organization: metadata.organization || null,
          metadata,
          paid_at: tx.paid_at,
        },
        { onConflict: "reference" }
      )
      .select()
      .single();

    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ donation }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err instanceof Error ? err.message : "Unexpected error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
