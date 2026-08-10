/**
 * Seed script - creates the minimum data this app needs to be usable
 * locally: one settings row (Settings.jsx expects exactly one to exist)
 * and a couple of sample events (so /events and the calendar aren't empty
 * during manual QA). Does not seed donations/volunteers/support requests -
 * those represent real people and shouldn't have fabricated rows even in
 * a dev database.
 *
 * Requires the service role key (bypasses RLS) - never commit it, never
 * run this against production without knowing exactly what it inserts.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.js
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.');
  console.error('Usage: SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed.js');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function seedSettings() {
  const { data: existing } = await supabase.from('settings').select('id').limit(1).maybeSingle();
  if (existing) {
    console.log('settings: row already exists, skipping');
    return;
  }
  const { error } = await supabase.from('settings').insert([
    {
      org_name: 'Flourishing Souls Foundation',
      contact_email: 'support@flourishingsoulsfoundation.org',
      contact_phone: '',
      donation_goal: 1000000,
      theme: 'system',
    },
  ]);
  if (error) throw error;
  console.log('settings: seeded 1 row');
}

async function seedEvents() {
  const { count } = await supabase.from('events').select('*', { count: 'exact', head: true });
  if (count > 0) {
    console.log(`events: ${count} already present, skipping`);
    return;
  }
  const now = Date.now();
  const day = 24 * 60 * 60 * 1000;
  const { error } = await supabase.from('events').insert([
    {
      title: 'Community Outreach Day',
      description: 'A day of food distribution, health screening, and school-supply handouts.',
      date: new Date(now + 14 * day).toISOString(),
      location: 'Community Center',
    },
    {
      title: 'Volunteer Orientation',
      description: 'Meet the team and learn how our programs run before your first shift.',
      date: new Date(now + 21 * day).toISOString(),
      location: 'Foundation Office',
    },
  ]);
  if (error) throw error;
  console.log('events: seeded 2 rows');
}

async function main() {
  await seedSettings();
  await seedEvents();
  console.log('Done.');
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
