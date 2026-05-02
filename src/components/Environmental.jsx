import React from 'react';
import { Leaf, Wind, Droplets, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';

export function Environmental({ data }) {
  const { environmental } = data;

  const getStatusIcon = (status) => {
    if (status === 'Normal' || status === 'Compliant' || status === 'Stable') {
      return <CheckCircle size={16} className="text-emerald-500" />;
    }
    return <AlertTriangle size={16} className="text-amber-500" />;
  };

  const getStatusColor = (status) => {
    if (status === 'Normal' || status === 'Compliant' || status === 'Stable') {
      return 'text-emerald-500';
    }
    return 'text-amber-500';
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <Leaf className="text-emerald-500" />
          Environmental Monitoring
        </h2>
        <p className="text-sm text-slate-400 mt-1">Air quality, water management, and waste dumping compliance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Dust Monitoring */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <Wind size={20} className="text-slate-400" />
            <h3 className="text-lg font-semibold text-slate-200">Dust Monitoring</h3>
          </div>
          <div className="p-4 space-y-4">
            {environmental.dustMonitoring.map((sensor, idx) => (
              <div key={idx} className="bg-slate-800/40 border border-slate-700/50 rounded-lg p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-slate-200">{sensor.location}</p>
                  <p className="text-sm text-slate-400 mt-1">PM10 Level: <span className="font-mono text-slate-300">{sensor.level}</span></p>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1.5">
                    {getStatusIcon(sensor.status)}
                    <span className={`text-sm font-bold ${getStatusColor(sensor.status)}`}>{sensor.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Water Discharge */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <Droplets size={20} className="text-blue-400" />
            <h3 className="text-lg font-semibold text-slate-200">Water Discharge</h3>
          </div>
          <div className="p-5 flex flex-col gap-6">
            <div className="flex justify-between items-center bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg">
              <span className="text-slate-400 font-medium">Status</span>
              <div className="flex items-center gap-2">
                 {getStatusIcon(environmental.waterDischarge.status)}
                 <span className={`font-bold ${getStatusColor(environmental.waterDischarge.status)}`}>
                   {environmental.waterDischarge.status}
                 </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Volume Today</p>
                <p className="text-2xl font-mono text-slate-200">{environmental.waterDischarge.volumeToday}</p>
              </div>
              <div className="bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">pH Level</p>
                <p className="text-2xl font-mono text-slate-200">{environmental.waterDischarge.ph}</p>
              </div>
              <div className="col-span-2 bg-slate-800/30 border border-slate-700/50 p-4 rounded-lg text-center">
                <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">Total Suspended Solids (TSS)</p>
                <p className="text-xl font-mono text-slate-200">{environmental.waterDischarge.tss}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Waste Dump Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800 flex items-center gap-2">
            <Trash2 size={20} className="text-amber-600" />
            <h3 className="text-lg font-semibold text-slate-200">Waste Dump Status</h3>
          </div>
          <div className="p-5 flex flex-col gap-6">
             <div className="flex justify-between items-center bg-slate-800/40 border border-slate-700/50 p-4 rounded-lg">
              <span className="text-slate-400 font-medium">Stability</span>
              <div className="flex items-center gap-2">
                 {getStatusIcon(environmental.wasteDump.stability)}
                 <span className={`font-bold ${getStatusColor(environmental.wasteDump.stability)}`}>
                   {environmental.wasteDump.stability}
                 </span>
              </div>
            </div>

            <div className="bg-slate-800/30 border border-slate-700/50 p-5 rounded-lg flex flex-col justify-center items-center gap-3">
               <p className="text-sm text-slate-400 font-medium">Used Capacity</p>

               <div className="relative w-32 h-32 flex items-center justify-center">
                 <svg className="w-full h-full transform -rotate-90">
                   <circle cx="64" cy="64" r="56" fill="none" stroke="#1e293b" strokeWidth="12" />
                   <circle
                     cx="64"
                     cy="64"
                     r="56"
                     fill="none"
                     stroke="#f59e0b"
                     strokeWidth="12"
                     strokeDasharray={`${2 * Math.PI * 56}`}
                     strokeDashoffset={`${2 * Math.PI * 56 * (1 - parseInt(environmental.wasteDump.capacity) / 100)}`}
                     className="transition-all duration-1000 ease-out"
                   />
                 </svg>
                 <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-slate-100">{environmental.wasteDump.capacity}</span>
                 </div>
               </div>
            </div>

            <div className="text-center">
              <p className="text-xs text-slate-500">Last Survey Date</p>
              <p className="text-sm font-mono text-slate-300 mt-1">{environmental.wasteDump.lastSurvey}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
