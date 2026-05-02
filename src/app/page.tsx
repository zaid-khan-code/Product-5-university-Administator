"use client";

import React, { useState } from "react";
import { format, addDays, subDays, startOfDay } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useAppContext } from "@/lib/AppContext";
import { Appointment } from "@/lib/types";
import clsx from "clsx";

const timeSlots = Array.from({ length: 9 }, (_, i) => `${(i + 9).toString().padStart(2, '0')}:00`);

export default function CalendarPage() {
  const { state, addAppointment, updateAppointment, cancelAppointment } = useAppContext();
  const [currentDate, setCurrentDate] = useState(startOfDay(new Date()));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const dateStr = format(currentDate, "yyyy-MM-dd");

  const handlePrevDay = () => setCurrentDate(subDays(currentDate, 1));
  const handleNextDay = () => setCurrentDate(addDays(currentDate, 1));

  const openNewAppointment = (therapistId: string, time: string) => {
    setSelectedAppointment({
      id: "",
      clientId: "",
      therapistId,
      serviceId: "",
      date: dateStr,
      startTime: time,
      status: "booked"
    });
    setIsModalOpen(true);
  };

  const getServiceColor = (category: string) => {
    switch (category) {
      case 'hair': return 'bg-blue-100 border-blue-300 text-blue-800';
      case 'facial': return 'bg-green-100 border-green-300 text-green-800';
      case 'massage': return 'bg-purple-100 border-purple-300 text-purple-800';
      case 'nail': return 'bg-pink-100 border-pink-300 text-pink-800';
      case 'waxing': return 'bg-orange-100 border-orange-300 text-orange-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Calendar</h1>
        <div className="flex items-center space-x-4 bg-white rounded-lg shadow p-2">
          <button onClick={handlePrevDay} className="p-2 hover:bg-beige-100 rounded-full"><ChevronLeft className="w-5 h-5 text-gray-600" /></button>
          <span className="text-lg font-medium text-gray-800 min-w-[140px] text-center">
            {format(currentDate, "EEEE, MMM d")}
          </span>
          <button onClick={handleNextDay} className="p-2 hover:bg-beige-100 rounded-full"><ChevronRight className="w-5 h-5 text-gray-600" /></button>
        </div>
      </header>

      <div className="flex-1 overflow-auto bg-white rounded-xl shadow border border-gray-200">
        <div className="flex border-b border-gray-200 sticky top-0 bg-gray-50 z-10">
          <div className="w-24 flex-shrink-0 border-r border-gray-200" />
          {state.therapists.map(therapist => (
            <div key={therapist.id} className="flex-1 min-w-[200px] border-r border-gray-200 p-4 text-center font-semibold text-gray-700">
              {therapist.name}
            </div>
          ))}
        </div>

        <div className="relative">
          {timeSlots.map(time => (
            <div key={time} className="flex border-b border-gray-100 h-24">
              <div className="w-24 flex-shrink-0 border-r border-gray-200 p-2 text-sm text-gray-500 font-medium">
                {time}
              </div>
              {state.therapists.map(therapist => {
                const appt = state.appointments.find(a =>
                  a.therapistId === therapist.id &&
                  a.date === dateStr &&
                  a.startTime === time &&
                  a.status !== 'cancelled'
                );

                if (appt) {
                  const service = state.services.find(s => s.id === appt.serviceId);
                  const client = state.clients.find(c => c.id === appt.clientId);
                  const height = service ? (service.duration / 60) * 96 : 96; // 96px = 1 hour height

                  return (
                    <div key={`${therapist.id}-${time}`} className="flex-1 min-w-[200px] border-r border-gray-200 p-1 relative">
                      <div
                        onClick={() => { setSelectedAppointment(appt); setIsModalOpen(true); }}
                        className={clsx(
                          "absolute left-1 right-1 rounded-md p-2 border cursor-pointer hover:opacity-90 shadow-sm z-10",
                          service ? getServiceColor(service.category) : "bg-gray-100"
                        )}
                        style={{ height: `${height - 8}px` }}
                      >
                        <div className="font-semibold text-sm truncate">{client?.name}</div>
                        <div className="text-xs truncate">{service?.name}</div>
                        {appt.status === "completed" && <div className="text-xs font-bold mt-1 uppercase">✓ Completed</div>}
                      </div>
                    </div>
                  );
                }

                // Check if this slot is covered by a previous long appointment
                const isCovered = state.appointments.some(a => {
                   if (a.therapistId !== therapist.id || a.date !== dateStr || a.status === 'cancelled') return false;
                   const srv = state.services.find(s => s.id === a.serviceId);
                   if (!srv) return false;
                   const startHour = parseInt(a.startTime.split(':')[0]);
                   const currHour = parseInt(time.split(':')[0]);
                   const durationHrs = srv.duration / 60;
                   return currHour > startHour && currHour < startHour + durationHrs;
                });

                if (isCovered) {
                  return <div key={`${therapist.id}-${time}`} className="flex-1 min-w-[200px] border-r border-gray-200" />;
                }

                return (
                  <div
                    key={`${therapist.id}-${time}`}
                    className="flex-1 min-w-[200px] border-r border-gray-200 hover:bg-beige-50 cursor-pointer group relative"
                    onClick={() => openNewAppointment(therapist.id, time)}
                  >
                    <Plus className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-400 opacity-0 group-hover:opacity-100 w-6 h-6" />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && selectedAppointment && (
        <AppointmentModal
          appointment={selectedAppointment}
          onClose={() => setIsModalOpen(false)}
          onSave={(appt) => {
            if (appt.id) updateAppointment(appt);
            else addAppointment({ ...appt, id: `a_${Date.now()}` });
            setIsModalOpen(false);
          }}
          onCancel={() => {
            if (selectedAppointment.id) cancelAppointment(selectedAppointment.id);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
}

function AppointmentModal({ appointment, onClose, onSave, onCancel }: {
  appointment: Appointment,
  onClose: () => void,
  onSave: (a: Appointment) => void,
  onCancel: () => void
}) {
  const { state } = useAppContext();
  const [formData, setFormData] = useState(appointment);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{formData.id ? 'Edit Appointment' : 'New Appointment'}</h2>
          <button onClick={onClose}><X className="text-gray-500 hover:text-gray-700" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
            <select
              required
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-roseGold-500 focus:border-roseGold-500 text-gray-900 bg-white"
              value={formData.clientId}
              onChange={e => setFormData({...formData, clientId: e.target.value})}
            >
              <option value="">Select a client</option>
              {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} ({c.phone})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Therapist</label>
            <select
              required
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-roseGold-500 focus:border-roseGold-500 text-gray-900 bg-white"
              value={formData.therapistId}
              onChange={e => setFormData({...formData, therapistId: e.target.value})}
            >
              {state.therapists.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
            <select
              required
              className="w-full border-gray-300 rounded-md shadow-sm p-2 border focus:ring-roseGold-500 focus:border-roseGold-500 text-gray-900 bg-white"
              value={formData.serviceId}
              onChange={e => setFormData({...formData, serviceId: e.target.value})}
            >
              <option value="">Select a service</option>
              {state.services.map(s => <option key={s.id} value={s.id}>{s.name} ({s.duration}m) - ${s.price}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="date"
                required
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
              <input
                type="time"
                required
                step="900"
                className="w-full border-gray-300 rounded-md shadow-sm p-2 border text-gray-900 bg-white"
                value={formData.startTime}
                onChange={e => setFormData({...formData, startTime: e.target.value})}
              />
            </div>
          </div>

          <div className="pt-4 flex justify-between">
            {formData.id ? (
              <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-red-600 bg-red-50 hover:bg-red-100 rounded-md font-medium">
                Cancel Appointment
              </button>
            ) : <div />}
            <div className="space-x-3">
              <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md font-medium">
                Close
              </button>
              <button type="submit" className="px-4 py-2 text-sm text-white bg-roseGold-500 hover:bg-roseGold-600 rounded-md font-medium">
                Save
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
