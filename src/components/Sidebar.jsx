import React from 'react';
import {
  Activity,
  Truck,
  BarChart2,
  Users,
  ShieldAlert,
  Mountain,
  Wrench,
  Leaf
} from 'lucide-react';

const navItems = [
  { id: 'overview', label: 'Operations Overview', icon: Activity },
  { id: 'equipment', label: 'Equipment', icon: Truck },
  { id: 'production', label: 'Production', icon: BarChart2 },
  { id: 'workforce', label: 'Workforce', icon: Users },
  { id: 'safety', label: 'Safety', icon: ShieldAlert },
  { id: 'geology', label: 'Geology', icon: Mountain },
  { id: 'maintenance', label: 'Maintenance', icon: Wrench },
  { id: 'environmental', label: 'Environmental', icon: Leaf },
];

export function Sidebar({ activeTab, setActiveTab }) {
  return (
    <div className="w-64 bg-slate-900 border-r border-slate-800 text-slate-300 flex flex-col h-screen shrink-0">
      <div className="p-4 border-b border-slate-800 flex items-center space-x-2">
        <div className="w-8 h-8 bg-amber-500 rounded flex items-center justify-center text-slate-900 font-bold">
          AM
        </div>
        <div>
          <h1 className="text-lg font-bold text-slate-100">Apex Mining Co.</h1>
          <p className="text-xs text-amber-500">Live Dashboard</p>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <li key={item.id} className="px-2">
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-500 font-medium'
                      : 'hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'text-amber-500' : 'text-slate-500'} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800 text-xs text-slate-500">
        System Status: <span className="text-emerald-500 font-medium">Online</span>
      </div>
    </div>
  );
}
