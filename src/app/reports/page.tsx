"use client";

import React, { useMemo } from "react";
import { useAppContext } from "@/lib/AppContext";
import {
  BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { DollarSign, TrendingUp, Users, Package } from "lucide-react";

export default function ReportsPage() {
  const { state } = useAppContext();

  // Calculate high-level stats
  const totalRevenue = useMemo(() => state.transactions.reduce((sum, tx) => sum + tx.total, 0), [state.transactions]);
  const totalAppointments = state.appointments.filter(a => a.status === 'completed').length;

  // Calculate daily revenue for chart
  const dailyRevenueData = useMemo(() => {
    const data: Record<string, number> = {};
    state.transactions.forEach(tx => {
      const date = tx.date.split('T')[0];
      data[date] = (data[date] || 0) + tx.total;
    });
    return Object.entries(data)
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [state.transactions]);

  // Calculate popular services (from completed appointments to show realistic demand)
  const popularServicesData = useMemo(() => {
    const counts: Record<string, number> = {};
    state.appointments.filter(a => a.status === 'completed' || a.status === 'booked').forEach(a => {
      counts[a.serviceId] = (counts[a.serviceId] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([id, count]) => {
        const service = state.services.find(s => s.id === id);
        return { name: service?.name || 'Unknown', count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // top 5
  }, [state.appointments, state.services]);

  // Calculate Therapist Utilization (based on appointments)
  const therapistUtilization = useMemo(() => {
    return state.therapists.map(t => {
      const count = state.appointments.filter(a => a.therapistId === t.id && a.status !== 'cancelled').length;
      return { name: t.name, appointments: count };
    }).sort((a, b) => b.appointments - a.appointments);
  }, [state.therapists, state.appointments]);

  // Revenue Breakdown: Service vs Retail
  const revenueBreakdown = useMemo(() => {
    let serviceRevenue = 0;
    let productRevenue = 0;
    state.transactions.forEach(tx => {
      tx.items.forEach(item => {
        if (item.type === 'service') serviceRevenue += item.price;
        if (item.type === 'product') productRevenue += item.price;
      });
    });
    return [
      { name: 'Services', value: serviceRevenue },
      { name: 'Retail', value: productRevenue }
    ];
  }, [state.transactions]);

  const COLORS = ['#B76E79', '#D4AF37', '#8CA3A3', '#F2C1D1', '#C6D8D3'];

  return (
    <div className="p-8 max-w-7xl mx-auto h-full overflow-y-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard & Reports</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-green-100 text-green-600 rounded-lg mr-4">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Total Revenue</div>
            <div className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-blue-100 text-blue-600 rounded-lg mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Completed Appts</div>
            <div className="text-2xl font-bold text-gray-900">{totalAppointments}</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-lg mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Avg Ticket Size</div>
            <div className="text-2xl font-bold text-gray-900">
              ${state.transactions.length > 0 ? (totalRevenue / state.transactions.length).toFixed(2) : '0.00'}
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-center">
          <div className="p-3 bg-orange-100 text-orange-600 rounded-lg mr-4">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-sm text-gray-500 font-medium">Low Stock Items</div>
            <div className="text-2xl font-bold text-gray-900">
              {state.products.filter(p => p.stock <= p.lowStockThreshold).length}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Daily Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Daily Revenue</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={dailyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="amount" fill="#B76E79" radius={[4, 4, 0, 0]} name="Revenue ($)" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Therapist Utilization Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Therapist Utilization (Appts)</h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={therapistUtilization} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" tick={{fontSize: 12}} />
                <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 12}} />
                <Tooltip />
                <Bar dataKey="appointments" fill="#8CA3A3" radius={[0, 4, 4, 0]} name="Appointments" />
              </RechartsBarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Popular Services Pie */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2 w-full text-left">Top Services</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={popularServicesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                  label={({name, percent}) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {popularServicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center">
          <h2 className="text-lg font-bold text-gray-900 mb-2 w-full text-left">Revenue Breakdown</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={revenueBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  <Cell fill="#D4AF37" />
                  <Cell fill="#B76E79" />
                </Pie>
                <Tooltip formatter={(value) => `$${value}`} />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
