"use client";

import { useEffect, useState } from "react";
import { getDB } from "@/lib/db";
import { FeeAccount, Student } from "@/lib/types";

export default function FinancePage() {
  const [accounts, setAccounts] = useState<FeeAccount[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [viewStudentId, setViewStudentId] = useState("");

  useEffect(() => {
    setAccounts(getDB<FeeAccount>('feeAccounts'));
    setStudents(getDB<Student>('students'));
  }, []);

  const activeAccount = accounts.find(a => a.studentId === viewStudentId);
  const activeStudent = students.find(s => s.id === viewStudentId);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-university-navy border-b pb-4">Finance Department</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Tuition Structure Reference */}
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-university-maroon mb-4">Standard Fee Structure</h2>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Undergraduate Tuition</span>
                <span className="font-semibold">$10,000 / sem</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Graduate Tuition</span>
                <span className="font-semibold">$12,500 / sem</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Technology Fee</span>
                <span className="font-semibold">$250 / sem</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span className="text-gray-600">Library Fee</span>
                <span className="font-semibold">$100 / sem</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Student Account View */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold text-university-navy mb-4">Student Account Statement</h2>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Select Student</label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-university-navy bg-white"
                value={viewStudentId}
                onChange={e => setViewStudentId(e.target.value)}
              >
                <option value="">Search for student account...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                ))}
              </select>
            </div>

            {activeStudent && activeAccount ? (
              <div className="space-y-6">
                <div className="flex justify-between items-center bg-gray-50 p-4 rounded border">
                  <div>
                    <h3 className="font-bold text-lg">{activeStudent.name}</h3>
                    <p className="text-sm text-gray-500">Student ID: {activeStudent.id}</p>
                    {activeStudent.financialHold && (
                      <span className="inline-block mt-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-bold rounded">ACCOUNT HOLD</span>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500 uppercase tracking-wider font-semibold">Current Balance</p>
                    <p className={`text-3xl font-bold ${activeAccount.balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      ${activeAccount.balance.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Transaction History</h4>
                  <table className="w-full text-sm text-left border">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="py-2 px-3">Date</th>
                        <th className="py-2 px-3">Description</th>
                        <th className="py-2 px-3">Type</th>
                        <th className="py-2 px-3 text-right">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {activeAccount.transactions.map((t, idx) => (
                        <tr key={idx}>
                          <td className="py-2 px-3 text-gray-500">{new Date(t.date).toLocaleDateString()}</td>
                          <td className="py-2 px-3">{t.description}</td>
                          <td className="py-2 px-3">
                            <span className={`px-2 py-1 rounded text-xs ${
                              t.type === 'Charge' ? 'bg-red-50 text-red-700' :
                              t.type === 'Scholarship' ? 'bg-purple-50 text-purple-700' : 'bg-green-50 text-green-700'
                            }`}>
                              {t.type}
                            </span>
                          </td>
                          <td className={`py-2 px-3 text-right font-medium ${
                            t.type === 'Charge' ? 'text-red-600' : 'text-green-600'
                          }`}>
                            {t.type === 'Charge' ? '+' : '-'}${t.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : viewStudentId ? (
              <p className="text-red-500 text-center py-4">No account found for this student.</p>
            ) : (
              <p className="text-gray-500 text-center py-8 border-2 border-dashed rounded">Select a student to view their financial statement.</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
