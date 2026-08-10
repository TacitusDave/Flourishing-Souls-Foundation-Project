/**
 * Paystack client-side utilities.
 *
 * Everything that needs the secret key (initialize/verify transactions,
 * webhook signature verification) lives server-side now, in
 * supabase/functions/paystack-verify and supabase/functions/paystack-webhook.
 * This file only holds what's safe to ship to the browser.
 */

/**
 * Get Paystack public key for client-side Inline widget usage.
 * @returns {string}
 */
export function getPaystackPublicKey() {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PAYSTACK_PUBLIC_KEY) {
    return import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;
  }
  throw new Error('Paystack public key is not set in environment variables');
}

/**
 * Validate the format of a Paystack reference string.
 * @param {string} reference
 * @returns {boolean}
 */
export function isValidPaystackReference(reference) {
  if (typeof reference !== 'string') return false;
  return /^[\w-]+$/.test(reference) && reference.length >= 10;
}
