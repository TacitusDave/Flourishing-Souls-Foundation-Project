import React, { Suspense, useState, useCallback } from "react";
import { FiGrid, FiCalendar } from "react-icons/fi";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/events/EventCard";
import SEO from "../components/common/SEO";

const Calendar = React.lazy(() => import("../components/events/Calendar"));

function Events() {
  const {
    events,
    loading,
    error,
    registerForEvent,
    unregisterFromEvent,
    isUserRegistered,
  } = useEvents();
  const [view, setView] = useState("list"); // "list" | "calendar"
  const [pendingId, setPendingId] = useState(null);
  // Current time isn't safe to read during render (React purity rule) —
  // resolve the upcoming count in an effect instead.
  const [upcomingCount, setUpcomingCount] = useState(0);

  const handleRegister = useCallback(
    async (event) => {
      setPendingId(event.id);
      await registerForEvent(event.id);
      setPendingId(null);
    },
    [registerForEvent]
  );

  const handleUnregister = useCallback(
    async (event) => {
      setPendingId(event.id);
      await unregisterFromEvent(event.id);
      setPendingId(null);
    },
    [unregisterFromEvent]
  );

  React.useEffect(() => {
    const now = Date.now();
    setUpcomingCount(
      events.filter((e) => e.date && new Date(e.date).getTime() > now).length
    );
  }, [events]);

  return (
    <div className="pb-16">
      <SEO
        path="/events"
        title="Events"
        description="Upcoming events from Flourishing Souls Foundation — outreach days, community programs, and ways to get involved."
      />
      <header className="reveal mx-auto max-w-3xl text-center mb-12">
        <p className="eyebrow eyebrow--center">Get involved</p>
        <h1 className="mt-3 font-display text-4xl sm:text-5xl text-neutral-900 dark:text-white">
          Upcoming events
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg leading-8 text-neutral-500 dark:text-neutral-400">
          Join us and make a difference — every event listed here is live, straight
          from our database.
        </p>
        {upcomingCount > 0 && (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-4 py-1.5 text-xs font-medium text-neutral-600 dark:text-neutral-300">
            <span className="h-1.5 w-1.5 rounded-full bg-success-500" />
            {upcomingCount} upcoming {upcomingCount === 1 ? "event" : "events"} open for registration
          </p>
        )}

        {/* Segmented view toggle */}
        <div className="mt-8 inline-flex rounded-full border border-neutral-200 dark:border-neutral-700 p-1 bg-white dark:bg-neutral-900 shadow-warm-sm">
          {[
            { key: "list", label: "List", icon: FiGrid },
            { key: "calendar", label: "Calendar", icon: FiCalendar },
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setView(key)}
              aria-pressed={view === key}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-medium transition ${
                view === key
                  ? "bg-brand-600 text-white shadow-warm-sm"
                  : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </header>

      {view === "calendar" ? (
        <Suspense
          fallback={
            <div className="py-24 text-center text-neutral-500 dark:text-neutral-400">
              Loading calendar…
            </div>
          }
        >
          <Calendar />
        </Suspense>
      ) : loading ? (
        /* Skeleton cards while events load */
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-neutral-100 dark:border-neutral-800 overflow-hidden"
            >
              <div className="h-40 bg-neutral-100 dark:bg-neutral-800" />
              <div className="space-y-3 p-5">
                <div className="h-4 w-3/4 rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-3 w-1/2 rounded bg-neutral-100 dark:bg-neutral-800" />
                <div className="h-9 w-full rounded-xl bg-neutral-100 dark:bg-neutral-800" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="mx-auto max-w-md rounded-2xl border border-error-200 dark:border-error-900 bg-error-50 dark:bg-error-950/40 p-6 text-center">
          <p className="font-display text-lg text-error-700 dark:text-error-300">
            We couldn't load events right now
          </p>
          <p className="mt-1.5 text-sm text-error-600/80 dark:text-error-400/70">{error}</p>
        </div>
      ) : events.length === 0 ? (
        <div className="py-24 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900">
            <FiCalendar className="h-6 w-6 text-neutral-400" />
          </div>
          <p className="mt-4 font-display text-lg text-neutral-900 dark:text-white">
            No events scheduled right now
          </p>
          <p className="mt-1 text-sm text-neutral-400">Check back soon — new events are added regularly.</p>
        </div>
      ) : (
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              canRegister
              userRegistered={isUserRegistered(event.id)}
              registering={pendingId === event.id}
              unregistering={pendingId === event.id}
              onRegister={handleRegister}
              onUnregister={handleUnregister}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Events;
