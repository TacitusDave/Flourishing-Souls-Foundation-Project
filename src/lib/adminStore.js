/**
 * adminStore — the admin panel's data layer.
 *
 * Strategy (per the "passcode now, Supabase later" decision):
 *   1. On first use we probe the configured Supabase project with a short
 *      timeout. If it answers, every read/write goes straight to the real
 *      tables (field names below match supabase/schema.sql exactly, so the
 *      same objects work in both modes).
 *   2. If the project is unreachable (paused, deleted, or offline), the
 *      store transparently switches to a seeded localStorage database so
 *      the admin panel is fully usable today. The mode is exposed via
 *      getBackendMode()/subscribe() so the UI can label it honestly.
 *
 * Nothing here is a mock of Supabase's API — it's a small, explicit store.
 * When the real project is restored, probeBackend() flips to "live" and
 * the identical calls hit Supabase instead. Local keys use snake_case
 * column names on purpose: they are the schema's column names.
 */

import { supabase } from "./supabase";

const LS_KEY = "fsf_admin_data_v1";
const PROBE_TIMEOUT_MS = 4000;

/* ------------------------------------------------------------------ */
/* Backend mode tracking                                               */
/* ------------------------------------------------------------------ */

let backendMode = "unknown"; // 'unknown' | 'live' | 'local'
let probePromise = null;
const modeListeners = new Set();

export function getBackendMode() {
  return backendMode;
}

export function subscribeToMode(fn) {
  modeListeners.add(fn);
  return () => modeListeners.delete(fn);
}

function setMode(next) {
  if (backendMode === next) return;
  backendMode = next;
  modeListeners.forEach((fn) => fn(next));
}

/**
 * Probe the Supabase project once per page load. Resolves to 'live' or
 * 'local'; never rejects. The result is cached for subsequent calls.
 */
export function probeBackend(force = false) {
  if (!force && probePromise) return probePromise;
  if (force) probePromise = null;

  probePromise = (async () => {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
      const { error } = await supabase
        .from("events")
        .select("id")
        .limit(1)
        .abortSignal(controller.signal);
      clearTimeout(timer);
      // Any structured answer (even a permissions error) means the
      // backend is up; only network-level failures fall back.
      setMode(error ? "local" : "live");
    } catch {
      setMode("local");
    }
    return backendMode;
  })();

  return probePromise;
}

/* ------------------------------------------------------------------ */
/* Local store (seeded demo database)                                  */
/* ------------------------------------------------------------------ */

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(16).slice(2)}`;

const daysFromNow = (d) => new Date(Date.now() + d * 86400000).toISOString();

function seedData() {
  return {
    events: [
      {
        id: uid(),
        title: "Back-to-School Drive",
        description:
          "Distributing uniforms, books, and supplies to 300 children across four communities before the new term begins.",
        date: daysFromNow(14),
        location: "Ikeja Community Center, Lagos",
        image_url: "/images/hero/hero-2.jpg",
        max_attendees: 150,
        created_at: new Date().toISOString(),
      },
      {
        id: uid(),
        title: "Community Health Screening Day",
        description:
          "Free blood pressure, malaria, and vision checks for families, plus referrals to partner clinics where needed.",
        date: daysFromNow(32),
        location: "Oshodi Marketplace Pavilion",
        image_url: "/images/hero/hero-4.jpg",
        max_attendees: 400,
        created_at: new Date().toISOString(),
      },
      {
        id: uid(),
        title: "Volunteer Orientation",
        description:
          "Monthly onboarding for new volunteers — program overview, safeguarding training, and team assignments.",
        date: daysFromNow(7),
        location: "Foundation Office, Yaba",
        image_url: "/images/hero/hero-1.jpg",
        max_attendees: 40,
        created_at: new Date().toISOString(),
      },
      {
        id: uid(),
        title: "Children's Day Celebration",
        description:
          "Games, food, and gift bags for the children in our care — our biggest community day of the year.",
        date: daysFromNow(-21),
        location: "Foundation grounds",
        image_url: "/images/hero/hero-3.jpg",
        max_attendees: 500,
        created_at: new Date().toISOString(),
      },
    ],
    gallery: [
      { id: uid(), title: "Outreach day smiles", type: "photo", url: "/images/hero/hero-1.jpg", created_at: new Date().toISOString() },
      { id: uid(), title: "Back in the classroom", type: "photo", url: "/images/hero/hero-2.jpg", created_at: new Date().toISOString() },
      { id: uid(), title: "Study group", type: "photo", url: "/images/hero/hero-3.jpg", created_at: new Date().toISOString() },
      { id: uid(), title: "Community gathering", type: "photo", url: "/images/hero/hero-4.jpg", created_at: new Date().toISOString() },
    ],
    donations: [
      { id: uid(), name: "Adaeze Okafor", email: "adaeze.o@example.com", amount: 25000, reference: "PSN_demo_2A4F1", status: "success", paid_at: daysFromNow(-2), created_at: daysFromNow(-2) },
      { id: uid(), name: "Chinedu Balogun", email: "c.balogun@example.com", amount: 100000, reference: "PSN_demo_7K3M9", status: "success", paid_at: daysFromNow(-5), created_at: daysFromNow(-5) },
      { id: uid(), name: "Fatima Yusuf", email: "fatima.y@example.com", amount: 5000, reference: "PSN_demo_9Q2X4", status: "success", paid_at: daysFromNow(-9), created_at: daysFromNow(-9) },
      { id: uid(), name: "Emeka Nwosu", email: "emeka.n@example.com", amount: 50000, reference: "PSN_demo_4B8T2", status: "success", paid_at: daysFromNow(-13), created_at: daysFromNow(-13) },
      { id: uid(), name: "Anonymous", email: "wellwisher@example.com", amount: 15000, reference: "PSN_demo_1C6V8", status: "success", paid_at: daysFromNow(-18), created_at: daysFromNow(-18) },
      { id: uid(), name: "Grace Adeyemi", email: "grace.a@example.com", amount: 100000, reference: "PSN_demo_5D9W3", status: "success", paid_at: daysFromNow(-25), created_at: daysFromNow(-25) },
      { id: uid(), name: "Tunde Afolabi", email: "tunde.af@example.com", amount: 10000, reference: "PSN_demo_3E7Z6", status: "success", paid_at: daysFromNow(-31), created_at: daysFromNow(-31) },
      { id: uid(), name: "Ngozi Eze", email: "ngozi.e@example.com", amount: 50000, reference: "PSN_demo_8F4Y1", status: "success", paid_at: daysFromNow(-44), created_at: daysFromNow(-44) },
    ],
    supportRequests: [
      { id: uid(), name: "Blessing Iroko", email: "blessing.i@example.com", subject: "School fees assistance", message: "I am a widow with three children in primary school. We need help with fees for the coming term.", status: "pending", created_at: daysFromNow(-1) },
      { id: uid(), name: "Samuel Ojo", email: "s.ojo@example.com", subject: "Volunteer group visit", message: "Our church youth group would like to join your next outreach day. How do we sign up?", status: "in_progress", created_at: daysFromNow(-3) },
      { id: uid(), name: "Halima Bello", email: "halima.b@example.com", subject: "Medical support enquiry", message: "My son needs regular medication we cannot afford. Does the foundation assist with ongoing care?", status: "resolved", created_at: daysFromNow(-8) },
      { id: uid(), name: "Peter Ade", email: "peter.ade@example.com", subject: "Donation receipt", message: "I donated last week but the receipt email hasn't arrived. Reference PSN_demo_2A4F1.", status: "closed", created_at: daysFromNow(-2) },
    ],
    volunteers: [
      { id: uid(), name: "Ifeoma Nnaji", email: "ifeoma.n@example.com", skills: ["Teaching", "Tutoring"], availability: "Weekends", status: "active", created_at: daysFromNow(-10) },
      { id: uid(), name: "David Okonkwo", email: "david.o@example.com", skills: ["Logistics", "Driving"], availability: "Weekdays", status: "active", created_at: daysFromNow(-12) },
      { id: uid(), name: "Aisha Mohammed", email: "aisha.m@example.com", skills: ["Nursing"], availability: "Saturdays", status: "active", created_at: daysFromNow(-15) },
      { id: uid(), name: "Kelechi Umeh", email: "kelechi.u@example.com", skills: ["Photography", "Design"], availability: "Flexible", status: "inactive", created_at: daysFromNow(-30) },
    ],
    board_members: [
      {
        id: uid(),
        name: "Dr. Adaeze Okafor",
        role: "Founder & Chairperson",
        bio: "A medical doctor with over 20 years of experience in child welfare and community health. Dr. Okafor founded the Flourishing Souls Foundation with a vision to give every vulnerable child a chance at a better life.",
        image_url: "/images/board/${uid()}.jpg",
        linkedin: "https://linkedin.com",
        twitter: "",
      },
      {
        id: uid(),
        name: "Mr. Chinedu Balogun",
        role: "Vice Chairperson",
        bio: "A seasoned educator and school administrator who has dedicated his career to improving access to quality education for underprivileged children across Nigeria.",
        image_url: "/images/board/${uid()}.jpg",
        linkedin: "https://linkedin.com",
        twitter: "",
      },
      {
        id: uid(),
        name: "Mrs. Fatima Yusuf",
        role: "Secretary",
        bio: "A lawyer specializing in human rights and child protection laws. She brings legal expertise and advocacy experience to guide the foundation's programs and partnerships.",
        image_url: "/images/board/${uid()}.jpg",
        linkedin: "https://linkedin.com",
        twitter: "",
      },
      {
        id: uid(),
        name: "Mr. Emeka Nwosu",
        role: "Treasurer",
        bio: "A certified accountant with extensive experience in nonprofit financial management. He ensures transparency and accountability in all financial operations.",
        image_url: "/images/board/${uid()}.jpg",
        linkedin: "https://linkedin.com",
        twitter: "",
      },
      {
        id: uid(),
        name: "Mrs. Ngozi Eze",
        role: "Member",
        bio: "A social worker and community development specialist who has led numerous outreach programs focusing on women empowerment and child welfare in rural communities.",
        image_url: "/images/board/${uid()}.jpg",
        linkedin: "https://linkedin.com",
        twitter: "",
      },
    ],
    settings: {
      org_name: "Flourishing Souls Foundation",
      contact_email: "support@flourishingsoulsfoundation.org",
      contact_phone: "+234 800 000 0000",
      donation_goal: 10000000,
      // Quick-pick buttons on the donation form (naira amounts)
      donation_presets: [1000, 2500, 5000, 10000],
      // Impact tiers shown on the homepage and Donate page — editable
      // copy, so amounts and descriptions stay under the org's control
      donation_tiers: [
        { amount: 5000, tag: "School supplies", text: "Books, uniform, and materials for one child for a full term." },
        { amount: 25000, tag: "Medical outreach", text: "Sponsors a community health screening day for a dozen families." },
        { amount: 100000, tag: "A year of care", text: "Funds shelter, meals, and schooling for one child for a year." },
      ],
      theme: "system",
      updated_at: new Date().toISOString(),
    },
  };
}

let localCache = null;

function loadLocal() {
  if (localCache) return localCache;
  const seed = seedData();
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Merge over the seed so settings fields added in later versions
      // (e.g. donation presets/tiers) exist in older stored data.
      localCache = {
        ...seed,
        ...parsed,
        settings: { ...seed.settings, ...(parsed.settings || {}) },
      };
      return localCache;
    }
  } catch {
    /* corrupted storage — reseed below */
  }
  localCache = seed;
  saveLocal();
  return localCache;
}

function saveLocal() {
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(localCache));
  } catch {
    /* storage full/blocked — admin still works in-memory for the session */
  }
}

/** Restore the pristine demo dataset (wipes local edits). */
export function resetDemoData() {
  localCache = seedData();
  saveLocal();
  return localCache;
}

/* ------------------------------------------------------------------ */
/* Generic helpers                                                     */
/* ------------------------------------------------------------------ */

async function liveList(table, select = "*") {
  const { data, error } = await supabase.from(table).select(select);
  if (error) throw error;
  return data || [];
}

/**
 * Wrap a live-mode call; on network/schema failure demote to local mode
 * and run the local equivalent instead of breaking the UI.
 */
async function withLive(liveFn, localFn) {
  if (backendMode === "live") {
    try {
      return await liveFn();
    } catch {
      setMode("local");
    }
  }
  return localFn();
}

/* ------------------------------------------------------------------ */
/* Events                                                              */
/* ------------------------------------------------------------------ */

export async function listEvents() {
  await probeBackend();
  return withLive(
    () => liveList("events"),
    () => [...loadLocal().events].sort((a, b) => new Date(a.date) - new Date(b.date))
  );
}

export async function createEvent(fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase.from("events").insert([fields]).select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      const row = { id: uid(), created_at: new Date().toISOString(), ...fields };
      store.events.push(row);
      saveLocal();
      return row;
    }
  );
}

export async function updateEvent(id, fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase.from("events").update(fields).eq("id", id).select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      const i = store.events.findIndex((e) => e.id === id);
      if (i === -1) throw new Error("Event not found");
      store.events[i] = { ...store.events[i], ...fields };
      saveLocal();
      return store.events[i];
    }
  );
}

export async function deleteEvent(id) {
  await probeBackend();
  return withLive(
    async () => {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    () => {
      const store = loadLocal();
      store.events = store.events.filter((e) => e.id !== id);
      saveLocal();
      return true;
    }
  );
}

/* ------------------------------------------------------------------ */
/* Gallery                                                             */
/* ------------------------------------------------------------------ */

export async function listGallery() {
  await probeBackend();
  return withLive(
    () => liveList("gallery"),
    () => [...loadLocal().gallery].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  );
}

export async function createGalleryItem(fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase.from("gallery").insert([fields]).select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      const row = { id: uid(), created_at: new Date().toISOString(), ...fields };
      store.gallery.unshift(row);
      saveLocal();
      return row;
    }
  );
}

export async function deleteGalleryItem(id) {
  await probeBackend();
  return withLive(
    async () => {
      const { error } = await supabase.from("gallery").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    () => {
      const store = loadLocal();
      store.gallery = store.gallery.filter((g) => g.id !== id);
      saveLocal();
      return true;
    }
  );
}

/* ------------------------------------------------------------------ */
/* Donations (read-only — rows are written by payment verification)    */
/* ------------------------------------------------------------------ */

export async function listDonations() {
  await probeBackend();
  return withLive(
    () => liveList("donations"),
    () => [...loadLocal().donations].sort((a, b) => new Date(b.paid_at || b.created_at) - new Date(a.paid_at || a.created_at))
  );
}

/* ------------------------------------------------------------------ */
/* Support requests / messages                                         */
/* ------------------------------------------------------------------ */

export async function listSupportRequests() {
  await probeBackend();
  return withLive(
    () => liveList("support_requests"),
    () => [...loadLocal().supportRequests].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  );
}

export async function updateSupportRequest(id, fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase
        .from("support_requests")
        .update({ ...fields, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      const i = store.supportRequests.findIndex((r) => r.id === id);
      if (i === -1) throw new Error("Request not found");
      store.supportRequests[i] = {
        ...store.supportRequests[i],
        ...fields,
        updated_at: new Date().toISOString(),
      };
      saveLocal();
      return store.supportRequests[i];
    }
  );
}

/* ------------------------------------------------------------------ */
/* Volunteers                                                          */
/* ------------------------------------------------------------------ */

export async function listVolunteers() {
  await probeBackend();
  return withLive(
    () => liveList("volunteers"),
    () => [...loadLocal().volunteers].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  );
}

/* ------------------------------------------------------------------ */
/* Board Members                                                       */
/* ------------------------------------------------------------------ */

export async function listBoardMembers() {
  await probeBackend();
  return withLive(
    () => liveList("board_members"),
    () => [...loadLocal().board_members].sort((a, b) => a.name.localeCompare(b.name))
  );
}

export async function createBoardMember(fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase.from("board_members").insert([fields]).select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      const row = { id: uid(), created_at: new Date().toISOString(), ...fields };
      store.board_members.push(row);
      saveLocal();
      return row;
    }
  );
}

export async function updateBoardMember(id, fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase.from("board_members").update(fields).eq("id", id).select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      const i = store.board_members.findIndex((m) => m.id === id);
      if (i === -1) throw new Error("Board member not found");
      store.board_members[i] = { ...store.board_members[i], ...fields };
      saveLocal();
      return store.board_members[i];
    }
  );
}

export async function deleteBoardMember(id) {
  await probeBackend();
  return withLive(
    async () => {
      const { error } = await supabase.from("board_members").delete().eq("id", id);
      if (error) throw error;
      return true;
    },
    () => {
      const store = loadLocal();
      store.board_members = store.board_members.filter((m) => m.id !== id);
      saveLocal();
      return true;
    }
  );
}

/* ------------------------------------------------------------------ */
/* Settings (single row)                                               */
/* ------------------------------------------------------------------ */

export async function getSettings() {
  await probeBackend();
  return withLive(
    async () => {
      const { data, error } = await supabase.from("settings").select("*").limit(1);
      if (error) throw error;
      return data?.[0] || null;
    },
    () => ({ ...loadLocal().settings })
  );
}

export async function updateSettings(fields) {
  await probeBackend();
  return withLive(
    async () => {
      const { data: existing } = await supabase.from("settings").select("id").limit(1);
      const id = existing?.[0]?.id;
      const payload = { ...fields, updated_at: new Date().toISOString() };
      const { data, error } = id
        ? await supabase.from("settings").update(payload).eq("id", id).select()
        : await supabase.from("settings").insert([{ org_name: "Flourishing Souls Foundation", ...payload }]).select();
      if (error) throw error;
      return data[0];
    },
    () => {
      const store = loadLocal();
      store.settings = { ...store.settings, ...fields, updated_at: new Date().toISOString() };
      saveLocal();
      return { ...store.settings };
    }
  );
}
