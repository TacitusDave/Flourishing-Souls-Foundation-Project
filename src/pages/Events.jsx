import React, { Suspense, useState, useCallback } from "react";
import { FiGrid, FiCalendar } from "react-icons/fi";
import { useEvents } from "../hooks/useEvents";
import EventCard from "../components/events/EventCard";

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

  return (
    <div>
      <header className="max-w-4xl mx-auto text-center mb-10">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-600 dark:text-brand-400">
          Get involved
        </p>
        <h1 className="mt-3 font-display text-3xl sm:text-4xl font-semibold text-neutral-900 dark:text-white">
          Upcoming Events
        </h1>
        <p className="mt-3 text-neutral-600 dark:text-neutral-400">
          Join us and make a difference — every event listed here is live, straight from
          our database.
        </p>
        <div className="mt-6 inline-flex rounded-xl border border-neutral-200 dark:border-neutral-700 p-1 bg-white dark:bg-neutral-900">
          <button
            type="button"
            onClick={() => setView("list")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === "list"
                ? "bg-brand-600 text-white"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <FiGrid /> List
          </button>
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              view === "calendar"
                ? "bg-brand-600 text-white"
                : "text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <FiCalendar /> Calendar
          </button>
        </div>
      </header>

      {view === "calendar" ? (
        <Suspense
          fallback={
            <div className="text-center py-16 text-neutral-500 dark:text-neutral-400">
              Loading calendar...
            </div>
          }
        >
          <Calendar />
        </Suspense>
      ) : loading ? (
        <div className="py-24 text-center text-neutral-500 dark:text-neutral-400">
          Loading events...
        </div>
      ) : error ? (
        <div className="py-8 text-center text-error-600 dark:text-error-400">{error}</div>
      ) : events.length === 0 ? (
        <div className="py-24 text-center text-neutral-400">No events scheduled right now — check back soon.</div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
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
