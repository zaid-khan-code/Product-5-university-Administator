"use client";

import { useEffect, useState } from "react";
import { getDB, setDB } from "@/lib/db";
import { AdmissionApplication } from "@/lib/types";

export default function AdmissionsPage() {
  const [applications, setApplications] = useState<AdmissionApplication[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("All");

  const loadData = () => {
    setApplications(getDB<AdmissionApplication>('admissions'));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = (appId: string, newStatus: AdmissionApplication['status']) => {
    const allApps = getDB<AdmissionApplication>('admissions');
    const index = allApps.findIndex(a => a.id === appId);
    if (index > -1) {
      allApps[index].status = newStatus;
      setDB('admissions', allApps);
      loadData();
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Submitted': return 'bg-gray-100 text-gray-800';
      case 'Shortlisted': return 'bg-blue-100 text-blue-800';
      case 'Interview': return 'bg-purple-100 text-purple-800';
      case 'Admitted': return 'bg-green-100 text-green-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredApps = statusFilter === "All" ? applications : applications.filter(a => a.status === statusFilter);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <h1 className="text-3xl font-bold text-university-navy">Admissions Portal</h1>
        <select
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-university-navy bg-white"
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
        >
          <option value="All">All Statuses</option>
          <option value="Submitted">Submitted</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Interview">Interview</option>
          <option value="Admitted">Admitted</option>
          <option value="Rejected">Rejected</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredApps.map(app => (
          <div key={app.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{app.applicantName}</h2>
                <p className="text-sm text-gray-500">Applying for: {app.program}</p>
                <p className="text-xs text-gray-400 mt-1">App ID: {app.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                {app.status}
              </span>
            </div>

            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Document Checklist</h3>
              <ul className="space-y-2">
                {app.documents.map((doc, idx) => (
                  <li key={idx} className="flex items-center text-sm">
                    {doc.submitted ? (
                      <span className="text-green-500 mr-2">✓</span>
                    ) : (
                      <span className="text-red-500 mr-2">✗</span>
                    )}
                    <span className={doc.submitted ? 'text-gray-700' : 'text-gray-400'}>{doc.name}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-4">
              <label className="block text-xs font-medium text-gray-500 mb-1">Update Status</label>
              <select
                className="w-full text-sm px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-university-navy bg-gray-50"
                value={app.status}
                onChange={e => handleStatusChange(app.id, e.target.value as AdmissionApplication['status'])}
              >
                <option value="Submitted">Submitted</option>
                <option value="Shortlisted">Shortlisted</option>
                <option value="Interview">Interview</option>
                <option value="Admitted">Admitted</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>
          </div>
        ))}
        {filteredApps.length === 0 && (
          <div className="col-span-full p-8 text-center text-gray-500">No applications found.</div>
        )}
      </div>
    </div>
  );
}
