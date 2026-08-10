import { describe, it, expect, vi, beforeEach } from 'vitest';

// Regression guard for the exact bug class this rebuild found repeatedly:
// components/lib functions silently querying the wrong table name
// (profiles vs users, support_requests vs support, event_registrations vs
// event_attendees vs attendance). Asserts every lib/api.js function hits
// the canonical table name from supabase/schema.sql.

const fromSpy = vi.fn();

vi.mock('./supabase', () => {
  const makeChain = () => {
    const chain = {
      select: vi.fn(() => chain),
      insert: vi.fn(() => chain),
      update: vi.fn(() => chain),
      delete: vi.fn(() => chain),
      upsert: vi.fn(() => chain),
      eq: vi.fn(() => chain),
      order: vi.fn(() => chain),
      single: vi.fn(() => Promise.resolve({ data: {}, error: null })),
      then: (resolve) => resolve({ data: [], error: null, count: 0 }),
    };
    return chain;
  };
  return {
    supabase: {
      from: (table) => {
        fromSpy(table);
        return makeChain();
      },
      auth: {
        getUser: vi.fn(() => Promise.resolve({ data: { user: { id: 'u1' } }, error: null })),
      },
    },
  };
});

let api;
beforeEach(async () => {
  fromSpy.mockClear();
  api = await import('./api.js');
});

describe('lib/api.js canonical table names', () => {
  it('users/profile functions query "profiles"', async () => {
    await api.getCurrentUserProfile();
    expect(fromSpy).toHaveBeenCalledWith('profiles');
    fromSpy.mockClear();

    await api.getAllUsers();
    expect(fromSpy).toHaveBeenCalledWith('profiles');
  });

  it('getAllDonations/getDonationsByUser query "donations"', async () => {
    await api.getAllDonations();
    expect(fromSpy).toHaveBeenCalledWith('donations');
    fromSpy.mockClear();

    await api.getDonationsByUser('a@b.com');
    expect(fromSpy).toHaveBeenCalledWith('donations');
  });

  it('event functions query "events" and "event_registrations", not event_attendees/attendance', async () => {
    await api.getAllEvents();
    expect(fromSpy).toHaveBeenCalledWith('events');
    fromSpy.mockClear();

    await api.registerForEvent({ user_id: 'u1', event_id: 'e1' });
    expect(fromSpy).toHaveBeenCalledWith('event_registrations');
    expect(fromSpy).not.toHaveBeenCalledWith('event_attendees');
    expect(fromSpy).not.toHaveBeenCalledWith('attendance');
  });

  it('volunteer functions query "volunteers"', async () => {
    await api.submitVolunteerRequest({ name: 'x' });
    expect(fromSpy).toHaveBeenCalledWith('volunteers');
  });

  it('support functions query "support_requests", not "support"', async () => {
    await api.submitSupportRequest({ name: 'x' });
    expect(fromSpy).toHaveBeenCalledWith('support_requests');
    expect(fromSpy).not.toHaveBeenCalledWith('support');
    fromSpy.mockClear();

    await api.getAllSupportRequests();
    expect(fromSpy).toHaveBeenCalledWith('support_requests');
  });

  it('does not export saveDonation/verifyDonation (writes are Edge-Function-only)', () => {
    expect(api.saveDonation).toBeUndefined();
    expect(api.verifyDonation).toBeUndefined();
  });
});
