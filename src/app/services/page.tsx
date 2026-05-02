"use client";

import React, { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { Service, ServiceCategory } from "@/lib/types";
import { Edit2, Save, X } from "lucide-react";

export default function ServicesPage() {
  const { state, updateService } = useAppContext();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{ price: number; duration: number }>({ price: 0, duration: 0 });

  const categories: ServiceCategory[] = ["hair", "facial", "massage", "nail", "waxing"];

  const startEdit = (service: Service) => {
    setEditingId(service.id);
    setEditForm({ price: service.price, duration: service.duration });
  };

  const saveEdit = (service: Service) => {
    updateService({ ...service, price: editForm.price, duration: editForm.duration });
    setEditingId(null);
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Services Menu</h1>

      <div className="space-y-12">
        {categories.map(category => {
          const categoryServices = state.services.filter(s => s.category === category);
          if (categoryServices.length === 0) return null;

          return (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="bg-beige-100 px-6 py-4 border-b border-gray-100">
                <h2 className="text-xl font-bold text-roseGold-600 capitalize">{category} Services</h2>
              </div>
              <ul className="divide-y divide-gray-100">
                {categoryServices.map(service => (
                  <li key={service.id} className="p-6 hover:bg-gray-50 transition-colors flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{service.category}</p>
                    </div>

                    {editingId === service.id ? (
                      <div className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg border">
                        <div>
                          <label className="text-xs text-gray-500 block">Duration (min)</label>
                          <input
                            type="number"
                            className="w-20 border rounded p-1 text-sm bg-white text-gray-900"
                            value={editForm.duration}
                            onChange={e => setEditForm({...editForm, duration: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-500 block">Price ($)</label>
                          <input
                            type="number"
                            className="w-20 border rounded p-1 text-sm bg-white text-gray-900"
                            value={editForm.price}
                            onChange={e => setEditForm({...editForm, price: parseInt(e.target.value) || 0})}
                          />
                        </div>
                        <div className="flex space-x-2 pt-4">
                          <button onClick={() => saveEdit(service)} className="text-green-600 hover:text-green-700">
                            <Save className="w-5 h-5" />
                          </button>
                          <button onClick={() => setEditingId(null)} className="text-red-500 hover:text-red-600">
                            <X className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-8">
                        <div className="text-right">
                          <div className="font-medium text-gray-900">{service.duration} mins</div>
                          <div className="text-roseGold-500 font-bold text-lg">${service.price}</div>
                        </div>
                        <button
                          onClick={() => startEdit(service)}
                          className="p-2 text-gray-400 hover:text-roseGold-500 hover:bg-beige-100 rounded-full transition-colors"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
