import React from 'react';
import { BarChart2 } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Line
} from 'recharts';

export function Production({ data }) {
  const { production } = data;

  return (
    <div className="p-6 h-full flex flex-col">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
          <BarChart2 className="text-amber-500" />
          Production Analytics
        </h2>
        <p className="text-sm text-slate-400 mt-1">Daily metrics and historical performance vs targets</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-0">

        {/* Daily Log */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col overflow-hidden h-full">
          <div className="p-4 border-b border-slate-800">
            <h3 className="text-lg font-semibold text-slate-200">Daily Production Log</h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-sm text-slate-400">
              <thead className="text-xs text-slate-300 uppercase bg-slate-800/50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 font-medium">Time</th>
                  <th className="px-4 py-3 font-medium">Tonnes Mined</th>
                  <th className="px-4 py-3 font-medium">Ore Grade</th>
                  <th className="px-4 py-3 font-medium">Waste (t)</th>
                  <th className="px-4 py-3 font-medium">Plant Thru.</th>
                </tr>
              </thead>
              <tbody>
                {production.dailyLog.map((log, idx) => (
                  <tr key={idx} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-slate-300">{log.time}</td>
                    <td className="px-4 py-3 text-amber-500">{log.tonnes.toLocaleString()}</td>
                    <td className="px-4 py-3">{log.grade.toFixed(2)}%</td>
                    <td className="px-4 py-3 text-slate-500">{log.waste.toLocaleString()}</td>
                    <td className="px-4 py-3 text-emerald-500">{log.throughput.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Monthly Chart */}
        <div className="bg-slate-900 border border-slate-800 rounded-lg flex flex-col p-4 h-full">
          <h3 className="text-lg font-semibold text-slate-200 mb-4">Monthly Production vs Target</h3>
          <div className="flex-1 min-h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={production.history3Months}
                margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#e2e8f0' }}
                  itemStyle={{ color: '#e2e8f0' }}
                />
                <Legend />
                <Bar dataKey="production" name="Actual Production" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
}
