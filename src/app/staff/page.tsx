"use client";

import React from "react";
import { useAppContext } from "@/lib/AppContext";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Briefcase, Percent } from "lucide-react";

export default function StaffPage() {
  const { state } = useAppContext();
  const todayStr = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Staff Directory</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {state.therapists.map(therapist => {
          const todaysAppointments = state.appointments.filter(
            a => a.therapistId === therapist.id && a.date === todayStr && a.status !== 'cancelled'
          );

          return (
            <div key={therapist.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
              <div className="bg-gradient-to-r from-beige-100 to-roseGold-100 px-6 py-8 text-center border-b border-gray-100">
                <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center shadow-sm mb-4">
                  <span className="text-2xl font-bold text-roseGold-500">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-900">{therapist.name}</h2>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <div className="flex items-center text-gray-500 mb-2">
                    <Briefcase className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium uppercase tracking-wider">Specialties</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map(spec => (
                      <span key={spec} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md capitalize">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <CalendarIcon className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">Today&apos;s Appointments</span>
                    </div>
                    <span className="font-semibold bg-roseGold-100 text-roseGold-700 px-2 py-1 rounded-full text-xs">
                      {todaysAppointments.length}
                    </span>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-50">
                  <div className="flex items-center justify-between text-gray-700">
                    <div className="flex items-center">
                      <Percent className="w-4 h-4 text-gray-400 mr-2" />
                      <span className="text-sm">Commission Rate</span>
                    </div>
                    <span className="font-semibold">
                      {(therapist.commissionRate * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
