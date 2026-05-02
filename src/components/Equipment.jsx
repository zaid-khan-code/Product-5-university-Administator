import React from 'react';
import { Truck, Search, Filter } from 'lucide-react';

export function Equipment({ data }) {
  const { equipment } = data;

  const getStatusColor = (status) => {
    switch (status) {
      case 'operating': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'idle': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'maintenance': return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      case 'breakdown': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Truck className="text-amber-500" />
            Equipment Fleet
          </h2>
          <p className="text-sm text-slate-400 mt-1">Live tracking and status of all mining equipment</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
            <input
              type="text"
              placeholder="Search equipment..."
              className="bg-slate-900 border border-slate-700 text-slate-200 text-sm rounded-lg pl-9 pr-4 py-2 focus:outline-none focus:border-amber-500"
            />
          </div>
          <button className="bg-slate-800 border border-slate-700 text-slate-300 p-2 rounded-lg hover:bg-slate-700 transition-colors">
            <Filter size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-lg overflow-hidden flex flex-col">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-800/50 border-b border-slate-800">
              <tr>
                <th className="px-4 py-3 font-medium">ID / Model</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Location</th>
                <th className="px-4 py-3 font-medium">Hours Today</th>
                <th className="px-4 py-3 font-medium">Fuel Level</th>
              </tr>
            </thead>
            <tbody>
              {equipment.map((eq) => (
                <tr key={eq.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-slate-200">{eq.id}</div>
                    <div className="text-xs">{eq.model}</div>
                  </td>
                  <td className="px-4 py-3">{eq.type}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium border capitalize ${getStatusColor(eq.status)}`}>
                      {eq.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{eq.location}</td>
                  <td className="px-4 py-3 font-mono">{eq.hoursRunToday.toFixed(1)}h</td>
                  <td className="px-4 py-3">
                    {eq.fuelLevel !== null ? (
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-800 rounded-full h-1.5">
                          <div
                            className={`h-1.5 rounded-full ${eq.fuelLevel < 20 ? 'bg-rose-500' : 'bg-amber-500'}`}
                            style={{ width: `${Math.max(0, Math.min(100, eq.fuelLevel))}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-mono">{Math.round(eq.fuelLevel)}%</span>
                      </div>
                    ) : (
                      <span className="text-slate-600 italic">N/A</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
