import React from 'react';
import { Wrench, Clock, AlertCircle } from 'lucide-react';

export function Maintenance({ data }) {
  const { maintenance } = data;

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <Wrench className="text-slate-400" />
            Maintenance & Repairs
          </h2>
          <p className="text-sm text-slate-400 mt-1">Active work orders and equipment downtime</p>
        </div>
        <button className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700">
          + New Work Order
        </button>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden flex-1 min-h-0">
        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <AlertCircle size={18} className="text-amber-500" />
            Work Order Queue
          </h3>
          <div className="flex gap-2">
            <span className="bg-slate-800 px-2.5 py-1 rounded-full text-xs font-medium border border-slate-700 text-slate-300">
              Total: {maintenance.workOrders.length}
            </span>
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-sm text-slate-400">
            <thead className="text-xs text-slate-300 uppercase bg-slate-800/80 sticky top-0 backdrop-blur-sm">
              <tr>
                <th className="px-4 py-3 font-medium">WO ID</th>
                <th className="px-4 py-3 font-medium">Equipment</th>
                <th className="px-4 py-3 font-medium">Issue</th>
                <th className="px-4 py-3 font-medium">Priority</th>
                <th className="px-4 py-3 font-medium">Technician</th>
                <th className="px-4 py-3 font-medium text-right">Est. Downtime</th>
                <th className="px-4 py-3 font-medium text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {maintenance.workOrders.map((wo) => (
                <tr key={wo.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-200">{wo.id}</td>
                  <td className="px-4 py-3 text-amber-500 font-medium">{wo.equipment}</td>
                  <td className="px-4 py-3 text-slate-300">{wo.issue}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold border ${getPriorityColor(wo.priority)}`}>
                      {wo.priority}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={wo.technician === 'Unassigned' ? 'text-rose-400 italic' : 'text-slate-300'}>
                      {wo.technician}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1.5 font-mono text-slate-300">
                      <Clock size={14} className="text-slate-500" />
                      {wo.estDowntime}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <button className="text-xs bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 px-3 py-1.5 rounded transition-colors border border-indigo-500/20">
                      Update
                    </button>
                  </td>
                </tr>
              ))}
              {maintenance.workOrders.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-4 py-8 text-center text-slate-500">
                    No active work orders.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
