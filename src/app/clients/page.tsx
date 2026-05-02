"use client";

import React, { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Search, Phone, Mail, Award, Clock, Heart, AlertCircle, ShoppingBag } from "lucide-react";

export default function ClientsPage() {
  const { state } = useAppContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const filteredClients = state.clients.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.phone.includes(searchTerm) ||
    c.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedClient = state.clients.find(c => c.id === selectedClientId);

  return (
    <div className="flex h-full bg-white">
      {/* Sidebar List */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Clients</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search clients..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-roseGold-500 focus:border-roseGold-500 outline-none"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ul className="divide-y divide-gray-100">
            {filteredClients.map(client => (
              <li
                key={client.id}
                className={`p-4 cursor-pointer hover:bg-beige-50 transition-colors ${selectedClientId === client.id ? 'bg-beige-100 border-l-4 border-roseGold-500' : ''}`}
                onClick={() => setSelectedClientId(client.id)}
              >
                <div className="font-semibold text-gray-900">{client.name}</div>
                <div className="text-sm text-gray-500">{client.phone}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Detail View */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        {selectedClient ? (
          <div className="p-8 max-w-3xl mx-auto space-y-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedClient.name}</h2>
                <div className="flex items-center space-x-4 text-gray-600">
                  <span className="flex items-center"><Phone className="w-4 h-4 mr-1" /> {selectedClient.phone}</span>
                  <span className="flex items-center"><Mail className="w-4 h-4 mr-1" /> {selectedClient.email}</span>
                </div>
              </div>
              <div className="text-center bg-roseGold-50 p-4 rounded-lg border border-roseGold-100">
                <Award className="w-8 h-8 text-roseGold-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-roseGold-600">{selectedClient.loyaltyPoints}</div>
                <div className="text-xs font-semibold text-roseGold-400 uppercase tracking-wide">Points</div>
              </div>
            </div>

            {selectedClient.notes && (
              <div className="bg-yellow-50 p-4 rounded-xl border border-yellow-200 flex items-start">
                <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-yellow-800 mb-1">Important Notes</h3>
                  <p className="text-yellow-700 text-sm">{selectedClient.notes}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-6">
              {/* Visit History */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-gray-400" /> Visit History
                </h3>
                <ul className="space-y-4">
                  {state.appointments
                    .filter(a => a.clientId === selectedClient.id && a.status === 'completed')
                    .slice(0, 5)
                    .map(appt => {
                      const service = state.services.find(s => s.id === appt.serviceId);
                      return (
                        <li key={appt.id} className="text-sm">
                          <div className="font-medium text-gray-900">{service?.name}</div>
                          <div className="text-gray-500">{appt.date} at {appt.startTime}</div>
                        </li>
                      );
                  })}
                  {state.appointments.filter(a => a.clientId === selectedClient.id && a.status === 'completed').length === 0 && (
                    <li className="text-sm text-gray-500">No past visits found.</li>
                  )}
                </ul>
              </div>

              {/* Favorites & Purchases */}
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Heart className="w-5 h-5 mr-2 text-red-400" /> Favorite Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedClient.favoriteServices.map(id => {
                      const service = state.services.find(s => s.id === id);
                      return service ? (
                        <span key={id} className="bg-pink-50 text-pink-700 px-3 py-1 rounded-full text-sm font-medium border border-pink-100">
                          {service.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2 text-blue-400" /> Product Purchases
                  </h3>
                  <ul className="space-y-3">
                    {state.transactions
                      .filter(t => t.clientId === selectedClient.id)
                      .flatMap(t => t.items.filter(i => i.type === 'product'))
                      .slice(0, 3)
                      .map((item, idx) => {
                        const product = state.products.find(p => p.id === item.itemId);
                        return product ? (
                          <li key={idx} className="text-sm flex justify-between">
                            <span className="text-gray-900 font-medium">{product.name}</span>
                            <span className="text-gray-500">${item.price}</span>
                          </li>
                        ) : null;
                      })}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            Select a client from the list to view their profile
          </div>
        )}
      </div>
    </div>
  );
}
