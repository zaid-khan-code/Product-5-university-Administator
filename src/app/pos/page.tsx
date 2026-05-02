"use client";

import React, { useState } from "react";
import { useAppContext } from "@/lib/AppContext";
import { CreditCard, Plus, Trash2, CheckCircle } from "lucide-react";
import { Transaction } from "@/lib/types";

export default function POSPage() {
  const { state, addTransaction } = useAppContext();
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [cart, setCart] = useState<{ type: 'service' | 'product', id: string, therapistId?: string }[]>([]);
  const [discount, setDiscount] = useState(0);
  const [usePoints, setUsePoints] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const client = state.clients.find(c => c.id === selectedClientId);

  const addToCart = (type: 'service' | 'product', id: string, therapistId?: string) => {
    setCart([...cart, { type, id, therapistId }]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartItems = cart.map(item => {
    if (item.type === 'service') {
      const s = state.services.find(x => x.id === item.id);
      return { ...item, name: s?.name, price: s?.price || 0 };
    } else {
      const p = state.products.find(x => x.id === item.id);
      return { ...item, name: p?.name, price: p?.price || 0 };
    }
  });

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const pointsDiscount = (usePoints && client) ? Math.min(client.loyaltyPoints * 0.1, subtotal) : 0; // 10 points = $1
  const total = Math.max(0, subtotal - discount - pointsDiscount);

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const tx: Transaction = {
      id: `tx_${Date.now()}`,
      date: new Date().toISOString(),
      clientId: selectedClientId || null,
      items: cartItems.map(i => ({ type: i.type, itemId: i.id, price: i.price, therapistId: i.therapistId })),
      total,
      discount: discount + pointsDiscount,
      pointsEarned: Math.floor(total * 0.5), // earn 1 point per $2
      pointsRedeemed: usePoints ? (pointsDiscount * 10) : 0
    };

    addTransaction(tx);
    setCheckoutComplete(true);
  };

  const reset = () => {
    setSelectedClientId("");
    setCart([]);
    setDiscount(0);
    setUsePoints(false);
    setCheckoutComplete(false);
  };

  if (checkoutComplete) {
    return (
      <div className="p-8 h-full flex items-center justify-center">
        <div className="bg-white p-12 rounded-xl shadow-lg text-center max-w-md w-full">
          <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Payment Successful</h2>
          <p className="text-gray-500 mb-8">Receipt has been issued.</p>
          <button
            onClick={reset}
            className="w-full bg-roseGold-500 text-white font-bold py-3 rounded-lg hover:bg-roseGold-600 transition-colors"
          >
            New Transaction
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto h-full flex flex-col md:flex-row gap-8">
      {/* Left side: Selection */}
      <div className="w-full md:w-2/3 space-y-6 flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900">Point of Sale</h1>

        {/* Client Selection */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
          <label className="block text-sm font-bold text-gray-700 mb-2">Select Client (Optional)</label>
          <select
            className="w-full border-gray-300 rounded-lg p-3 border focus:ring-2 focus:ring-roseGold-500"
            value={selectedClientId}
            onChange={e => setSelectedClientId(e.target.value)}
          >
            <option value="">Walk-in Customer</option>
            {state.clients.map(c => <option key={c.id} value={c.id}>{c.name} - {c.phone}</option>)}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6 flex-1 overflow-hidden">
          {/* Services List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="bg-beige-100 p-4 border-b font-bold text-gray-800">Add Service</div>
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {state.services.map(s => (
                <div key={s.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500">${s.price}</div>
                  </div>
                  <button
                    onClick={() => addToCart('service', s.id, state.therapists[0].id)} // Default to first therapist for simplicity in POS
                    className="p-1.5 bg-beige-200 text-roseGold-700 rounded hover:bg-roseGold-100"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Products List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            <div className="bg-beige-100 p-4 border-b font-bold text-gray-800">Add Product</div>
            <div className="p-4 overflow-y-auto flex-1 space-y-2">
              {state.products.map(p => (
                <div key={p.id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg border border-gray-100">
                  <div>
                    <div className="font-medium text-gray-900 text-sm">{p.name}</div>
                    <div className="text-xs text-gray-500">${p.price} | Stock: {p.stock}</div>
                  </div>
                  <button
                    disabled={p.stock <= 0}
                    onClick={() => addToCart('product', p.id)}
                    className="p-1.5 bg-beige-200 text-roseGold-700 rounded hover:bg-roseGold-100 disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Cart & Checkout */}
      <div className="w-full md:w-1/3 bg-white rounded-xl shadow-lg border border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900 flex items-center">
            <CreditCard className="w-6 h-6 mr-2 text-roseGold-500" />
            Current Ticket
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center text-gray-400 py-8">Cart is empty</div>
          ) : (
            cartItems.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center group">
                <div>
                  <div className="font-medium text-gray-900">{item.name}</div>
                  <div className="text-xs text-gray-500 capitalize">{item.type}</div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="font-medium text-gray-900">${item.price.toFixed(2)}</div>
                  <button onClick={() => removeFromCart(idx)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50 space-y-4 rounded-b-xl">
          {client && (
            <div className="bg-white p-3 rounded-lg border border-roseGold-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Loyalty Points: {client.loyaltyPoints}</span>
                <label className="flex items-center space-x-2 text-sm text-gray-600">
                  <input type="checkbox" checked={usePoints} onChange={e => setUsePoints(e.target.checked)} className="rounded text-roseGold-500 focus:ring-roseGold-500" />
                  <span>Use Points (-${((client.loyaltyPoints * 0.1)).toFixed(2)} max)</span>
                </label>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Manual Discount ($)</span>
            <input
              type="number"
              className="w-20 border rounded p-1 text-right text-sm"
              value={discount}
              onChange={e => setDiscount(Number(e.target.value) || 0)}
              min="0"
            />
          </div>

          {(discount > 0 || pointsDiscount > 0) && (
            <div className="flex justify-between items-center text-green-600">
              <span className="text-sm">Total Discount</span>
              <span className="font-medium">-${(discount + pointsDiscount).toFixed(2)}</span>
            </div>
          )}

          <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
            <span className="text-xl font-bold text-gray-900">Total</span>
            <span className="text-2xl font-bold text-roseGold-600">${total.toFixed(2)}</span>
          </div>

          <button
            disabled={cart.length === 0}
            onClick={handleCheckout}
            className="w-full mt-4 bg-gray-900 text-white font-bold py-3 rounded-lg hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
}
