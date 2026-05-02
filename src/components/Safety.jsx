import React from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Eye, BookOpen } from 'lucide-react';

export function Safety({ data }) {
  const { safety } = data;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'High': return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
      case 'Medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'Low': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-500 bg-slate-500/10 border-slate-500/20';
    }
  };

  const getStatusIcon = (status) => {
    if (status === 'Closed') return <CheckCircle size={14} className="text-emerald-500" />;
    return <AlertTriangle size={14} className="text-amber-500" />;
  };

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6 flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="text-rose-500" />
            Safety & Compliance
          </h2>
          <p className="text-sm text-slate-400 mt-1">Incident tracking, observations, and training</p>
        </div>
        <button className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          Report Incident
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

        {/* Main Incident Log (takes 2 columns on large screens) */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-200">Incident Log</h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {safety.incidents.map((incident) => (
              <div key={incident.id} className="bg-slate-800/40 border border-slate-700 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full mt-1 ${getSeverityColor(incident.severity)}`}>
                    <ShieldAlert size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-200">{incident.id}</span>
                      <span className="text-slate-500 text-sm">•</span>
                      <span className="text-slate-400 text-sm font-mono">{incident.date}</span>
                    </div>
                    <h4 className="text-base font-medium text-slate-300">{incident.type}</h4>
                    <p className="text-sm text-slate-500 mt-1">Location: <span className="text-slate-300">{incident.location}</span></p>
                  </div>
                </div>
                <div className="flex md:flex-col items-center md:items-end justify-between gap-2 md:w-48 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getSeverityColor(incident.severity)}`}>
                    {incident.severity} Severity
                  </span>
                  <div className="flex items-center gap-1.5 text-sm">
                    {getStatusIcon(incident.status)}
                    <span className={incident.status === 'Closed' ? 'text-emerald-500' : 'text-amber-500'}>
                      {incident.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {safety.incidents.length === 0 && (
              <div className="text-center py-8 text-slate-500">No incidents recorded.</div>
            )}
          </div>
        </div>

        {/* Right Sidebar for Metrics */}
        <div className="flex flex-col gap-6 h-full">
          {/* Safety Observations */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <Eye className="text-indigo-500" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Safety Observations</h3>
            </div>
            <p className="text-3xl font-bold text-slate-100 mt-2">{safety.observations}</p>
            <p className="text-sm text-slate-500 mt-1">Reported this month</p>
            <button className="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-slate-300 py-2 rounded text-sm transition-colors border border-slate-700">
              Submit Observation
            </button>
          </div>

          {/* Training Compliance */}
          <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col flex-1 min-h-[250px] p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-emerald-500/10 rounded-lg">
                <BookOpen className="text-emerald-500" size={20} />
              </div>
              <h3 className="text-lg font-semibold text-slate-200">Training Compliance</h3>
            </div>
            <div className="space-y-4 overflow-y-auto pr-2">
              {Object.entries(safety.trainingCompliance).map(([dept, percent]) => (
                <div key={dept}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-300">{dept}</span>
                    <span className={percent === 100 ? 'text-emerald-500' : 'text-amber-500'}>
                      {percent}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${percent === 100 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
