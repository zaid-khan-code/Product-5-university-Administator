import React from 'react';
import { Users, Clock, ClipboardList } from 'lucide-react';

export function Workforce({ data }) {
  const { workforce } = data;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="text-blue-500" />
            Workforce Management
          </h2>
          <p className="text-sm text-slate-400 mt-1">Active shift: <span className="text-amber-500 font-medium">{workforce.activeShift}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* Workers Underground */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <Users size={18} className="text-slate-400" />
              Active Workers Underground
            </h3>
            <span className="bg-blue-500/10 text-blue-500 text-xs font-bold px-2 py-1 rounded-full border border-blue-500/20">
              {workforce.workersUnderground.length} Online
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-slate-800/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Worker</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Zone</th>
                  <th className="px-4 py-3 font-medium text-right">Entry Time</th>
                </tr>
              </thead>
              <tbody>
                {workforce.workersUnderground.map((worker) => (
                  <tr key={worker.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-200">{worker.name}</div>
                      <div className="text-xs text-slate-500">{worker.id}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{worker.role}</td>
                    <td className="px-4 py-3">
                      <span className="bg-slate-800 px-2 py-1 rounded text-xs border border-slate-700">
                        {worker.zone}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono flex items-center justify-end gap-1">
                      <Clock size={14} className="text-slate-500" />
                      {worker.entryTime}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Shift Handover Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col p-4 h-full">
          <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
              <ClipboardList size={18} className="text-slate-400" />
              Shift Handover Log
            </h3>
            <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded text-sm transition-colors border border-slate-700">
              + New Log
            </button>
          </div>
          <div className="flex-1 overflow-auto space-y-4">
            {workforce.handoverLog.map((log, idx) => (
              <div key={idx} className="bg-slate-800/50 border border-slate-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className={`text-xs font-bold px-2 py-1 rounded-full ${log.shift === 'Day' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'}`}>
                    {log.shift} Shift
                  </span>
                  <span className="text-xs text-slate-500 font-mono">{log.date}</span>
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mt-2">{log.note}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
