import React from 'react';
import { Mountain, MapPin, Database } from 'lucide-react';

export function Geology({ data }) {
  const { geology } = data;

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'High': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Active Mining': return 'text-amber-500';
      case 'Development': return 'text-blue-500';
      case 'Exploration': return 'text-indigo-500';
      case 'Depleted': return 'text-slate-500';
      default: return 'text-slate-300';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Mountain className="text-indigo-500" />
            Geology & Ore Tracking
          </h2>
          <p className="text-sm text-slate-400 mt-1">Drill logs, assay results, and active ore zones</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* Drill Hole Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Database size={18} className="text-slate-400" />
              Recent Drill Hole Log
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-slate-800/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Hole ID</th>
                  <th className="px-4 py-3 font-medium text-right">Depth (m)</th>
                  <th className="px-4 py-3 font-medium">Ore Interval</th>
                  <th className="px-4 py-3 font-medium text-right">Assay Result</th>
                </tr>
              </thead>
              <tbody>
                {geology.drillHoles.map((hole) => (
                  <tr key={hole.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{hole.id}</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-300">{hole.depth}</td>
                    <td className="px-4 py-3 text-slate-400">{hole.interval}</td>
                    <td className="px-4 py-3 text-right font-mono text-amber-500 font-bold">{hole.assay}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Ore Zone Map (Text-based) */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <MapPin size={18} className="text-slate-400" />
              Ore Zone Summary
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
             <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-slate-800/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Zone</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Est. Tonnage</th>
                  <th className="px-4 py-3 font-medium">Avg Grade</th>
                  <th className="px-4 py-3 font-medium">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {geology.oreZones.map((zone, idx) => (
                  <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-200">{zone.zone}</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${getStatusColor(zone.status)}`}>
                        {zone.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono">{zone.tonnageEst}</td>
                    <td className="px-4 py-3 font-mono text-amber-500">{zone.grade}</td>
                    <td className="px-4 py-3">
                       <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getConfidenceColor(zone.confidence)}`}>
                        {zone.confidence}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
