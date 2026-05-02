import React from 'react';
import { Target, Truck, Users, ShieldAlert, Mountain } from 'lucide-react';

export function OperationsOverview({ data }) {
  const { overview } = data;

  const metrics = [
    {
      label: 'Production Today',
      value: `${overview.productionToday.toLocaleString()} t`,
      target: `${overview.targetToday.toLocaleString()} t`,
      icon: Target,
      color: 'text-amber-500',
      bg: 'bg-amber-500/10'
    },
    {
      label: 'Equipment Utilization',
      value: `${overview.equipmentUtilization}%`,
      target: 'Target: 85%',
      icon: Truck,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Active Workforce',
      value: overview.activeWorkforce,
      target: 'Underground',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Safety Incidents',
      value: overview.safetyIncidentsThisMonth,
      target: 'This Month',
      icon: ShieldAlert,
      color: overview.safetyIncidentsThisMonth > 0 ? 'text-rose-500' : 'text-emerald-500',
      bg: overview.safetyIncidentsThisMonth > 0 ? 'bg-rose-500/10' : 'bg-emerald-500/10'
    },
    {
      label: 'Avg. Ore Grade',
      value: `${overview.oreGrade}% Cu`,
      target: 'Target: 1.40%',
      icon: Mountain,
      color: 'text-indigo-500',
      bg: 'bg-indigo-500/10'
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-slate-100">Operations Overview</h2>
        <div className="text-sm text-slate-400 bg-slate-800 px-3 py-1 rounded-full flex items-center space-x-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Updates Active</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 mb-8">
        {metrics.map((metric, idx) => {
          const Icon = metric.icon;
          return (
            <div key={idx} className="bg-slate-900 border border-slate-800 rounded-lg p-4 flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${metric.bg}`}>
                  <Icon className={metric.color} size={20} />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-400 font-medium">{metric.label}</p>
                <p className="text-2xl font-bold text-slate-100 mt-1">{metric.value}</p>
                <p className="text-xs text-slate-500 mt-1">{metric.target}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Current Shift Summary</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-slate-400">Production Progress</span>
                <span className="text-amber-500 font-medium">
                  {Math.round((overview.productionToday / overview.targetToday) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div
                  className="bg-amber-500 h-2 rounded-full"
                  style={{ width: `${Math.min(100, (overview.productionToday / overview.targetToday) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
           <h3 className="text-lg font-semibold text-slate-200 mb-4">Quick Actions</h3>
           <div className="grid grid-cols-2 gap-3">
             <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded text-sm transition-colors border border-slate-700">
               Log Incident
             </button>
             <button className="bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 px-4 rounded text-sm transition-colors border border-slate-700">
               Create Work Order
             </button>
           </div>
        </div>
      </div>
    </div>
  );
}
