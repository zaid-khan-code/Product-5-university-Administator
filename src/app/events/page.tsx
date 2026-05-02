"use client";

import { useEffect, useState } from "react";
import { getDB, setDB } from "@/lib/db";
import { Event } from "@/lib/types";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);

  const loadData = () => {
    setEvents(getDB<Event>('events').sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRegister = (eventId: string) => {
    const userId = prompt("Enter your Student/Faculty ID to register:");
    if (!userId) return;

    const allEvents = getDB<Event>('events');
    const index = allEvents.findIndex(e => e.id === eventId);

    if (index > -1) {
      if (allEvents[index].registeredAttendees.includes(userId)) {
        alert("You are already registered for this event.");
        return;
      }

      allEvents[index].registeredAttendees.push(userId);
      setDB('events', allEvents);
      loadData();
      alert("Successfully registered for event!");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-university-navy border-b pb-4">University Events Calendar</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map(event => {
          const eventDate = new Date(event.date);
          const isPast = eventDate < new Date();

          return (
            <div key={event.id} className={`bg-white rounded-lg shadow-sm border p-6 flex flex-col ${isPast ? 'border-gray-200 opacity-75' : 'border-university-maroon border-l-4'}`}>
              <div className="flex-1">
                <div className="flex items-center space-x-2 text-university-maroon font-bold mb-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{eventDate.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h2>
                <p className="text-gray-600 mb-4">{event.description}</p>

                <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 mb-4 flex items-center justify-between">
                  <span>Attendees</span>
                  <span className="font-bold bg-white px-2 py-1 rounded shadow-sm">{event.registeredAttendees.length}</span>
                </div>
              </div>

              {!isPast && (
                <button
                  onClick={() => handleRegister(event.id)}
                  className="w-full bg-university-navy text-white py-2 rounded font-medium hover:bg-blue-800 transition-colors mt-auto"
                >
                  Register Now
                </button>
              )}
              {isPast && (
                <div className="w-full bg-gray-100 text-gray-500 py-2 rounded text-center font-medium mt-auto">
                  Event Ended
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
