"use client";

import React, { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Award, Package, Plus, Search } from "lucide-react";

export default function MembershipsPage() {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredMemberships = state.memberships.filter(m => {
    const client = state.clients.find(c => c.id === m.clientId);
    return client?.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="p-8 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Memberships & Packages</h1>
        <button className="flex items-center px-4 py-2 bg-roseGold-500 text-white rounded-lg hover:bg-roseGold-600 font-medium transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Sell Membership
        </button>
      </div>

      <div className="mb-6 relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search by client name..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-roseGold-500 focus:border-roseGold-500 outline-none"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex-1">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-beige-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Client</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plan Name</th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status / Remaining</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMemberships.length > 0 ? filteredMemberships.map((membership) => {
              const client = state.clients.find(c => c.id === membership.clientId);
              const isPackage = membership.type === "package";

              return (
                <tr key={membership.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{client?.name}</div>
                    <div className="text-sm text-gray-500">{client?.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                      isPackage ? 'bg-blue-100 text-blue-800' : 'bg-roseGold-100 text-roseGold-800'
                    }`}>
                      {isPackage ? <Package className="w-3 h-3 mr-1" /> : <Award className="w-3 h-3 mr-1" />}
                      {membership.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {membership.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {isPackage ? (
                      <div className="flex items-center">
                        <span className="font-bold text-gray-900 mr-2">{membership.sessionsRemaining}</span> sessions left
                      </div>
                    ) : (
                      <span className="text-green-600 font-medium">Active</span>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  No memberships or packages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
