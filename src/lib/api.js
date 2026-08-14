/**
 * @file src/lib/api.js
 * @description
 * Centralized, production-grade API abstraction for real-time data, user actions,
 * donations, events, gallery, and other core resources.
 *
 * Interacts with Supabase (for DB/auth/storage/etc) and Paystack (for payments).
 * No stubs, mocks or simulations — all requests are real and effect persistent data.
 */

import { supabase } from './supabase'; // See: src/lib/supabase.js

// ========== USERS & AUTH ==========

/**
 * Fetch the current authenticated user's profile from Supabase (always fresh).
 * @returns {Promise<Object|null>}
 */
export async function getCurrentUserProfile() {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) throw new Error(error.message);
  if (!user) return null;
  const { data: profile, error: dbError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();
  if (dbError) throw new Error(dbError.message);
  return profile;
}

/**
 * Fetch all users (admin only).
 * @returns {Promise<Array>}
 */
export async function getAllUsers() {
  const { data, error } = await supabase.from('profiles').select('*');
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Update a user's role (admin only).
 * @param {string} userId
 * @param {string} newRole
 * @returns {Promise<Object>}
 */
export async function updateUserRole(userId, newRole) {
  const { data, error } = await supabase
    .from('profiles')
    .update({ role: newRole })
    .eq('id', userId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

// ========== DONATIONS & PAYMENTS ==========
// Writing a donation row happens server-side only, via the paystack-verify
// and paystack-webhook Edge Functions (supabase/functions/) using the
// service-role key. There is no client insert policy on `donations` (see
// supabase/schema.sql) and no insert helper here on purpose - a browser
// reporting "this donation succeeded" is not something this app trusts.

/**
 * Fetch all donations (admin only).
 * @returns {Promise<Array>}
 */
export async function getAllDonations() {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetch donations for a given user's email.
 * @param {string} email
 * @returns {Promise<Array>}
 */
export async function getDonationsByUser(email) {
  const { data, error } = await supabase
    .from('donations')
    .select('*')
    .eq('email', email)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// ========== EVENTS ==========

/**
 * Fetch all events.
 * @returns {Promise<Array>}
 */
export async function getAllEvents() {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .order('date', { ascending: true });
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Fetch details for a single event.
 * @param {string|number} eventId
 * @returns {Promise<Object>}
 */
export async function getEventById(eventId) {
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('id', eventId)
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Register current user for an event.
 * @param {Object} registration
 * @param {string} registration.user_id
 * @param {string|number} registration.event_id
 * @returns {Promise<Object>}
 */
export async function registerForEvent({ user_id, event_id }) {
  const { data, error } = await supabase
    .from('event_registrations')
    .insert([{ user_id, event_id }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Unregister current user from event.
 * @param {string} userId
 * @param {string|number} eventId
 * @returns {Promise<void>}
 */
export async function unregisterFromEvent(userId, eventId) {
  const { error } = await supabase
    .from('event_registrations')
    .delete()
    .eq('user_id', userId)
    .eq('event_id', eventId);
  if (error) throw new Error(error.message);
}

/**
 * Fetch all registrations for a user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
export async function getUserEventRegistrations(userId) {
  const { data, error } = await supabase
    .from('event_registrations')
    .select('*, events(*)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// ========== GALLERY ==========
// Gallery read/write lives in src/hooks/useGallery.js (single source of truth
// for the gallery-media storage bucket + gallery table), not here.

// ========== VOLUNTEERS ==========

/**
 * Submit a volunteer request.
 * @param {Object} request
 * @returns {Promise<Object>}
 */
export async function submitVolunteerRequest(request) {
  const { data, error } = await supabase
    .from('volunteers')
    .insert([request])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get all volunteer requests (admin).
 * @returns {Promise<Array>}
 */
export async function getAllVolunteers() {
  const { data, error } = await supabase
    .from('volunteers')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// ========== SUPPORT REQUESTS ==========

/**
 * Submit a support request.
 * @param {Object} req
 * @returns {Promise<Object>}
 */
export async function submitSupportRequest(req) {
  const { data, error } = await supabase
    .from('support_requests')
    .insert([req])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

/**
 * Get all support requests (admin).
 * @returns {Promise<Array>}
 */
export async function getAllSupportRequests() {
  const { data, error } = await supabase
    .from('support_requests')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

// ========== ADMIN DASHBOARD ==========

/**
 * Simple aggregation: get dashboard stats.
 * @returns {Promise<Object>}
 */
export async function getDashboardStats() {
  // Parallel count queries for main entities
  const [{ count: users }, { count: donations }, { count: events }, { count: volunteers }, { count: supports }] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('donations').select('*', { count: 'exact', head: true }),
    supabase.from('events').select('*', { count: 'exact', head: true }),
    supabase.from('volunteers').select('*', { count: 'exact', head: true }),
    supabase.from('support_requests').select('*', { count: 'exact', head: true }),
  ]);
  return { users, donations, events, volunteers, supports };
}

// ========== UTILS ==========

/**
 * Generic error handler for API functions to log & throw.
 * @param {Error} err
 * @param {string} context
 */
export function handleApiError(err, context = 'API') {
  // Send to external logging e.g., Sentry if available
  console.error(`[${context}]`, err);
  throw err;
}

