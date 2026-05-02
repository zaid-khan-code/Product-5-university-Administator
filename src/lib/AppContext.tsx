"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { AppState, Service, Appointment, Transaction } from "./types";
import { initialMockData } from "./mockData";

interface AppContextType {
  state: AppState;
  setState: React.Dispatch<React.SetStateAction<AppState>>;
  updateService: (service: Service) => void;
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (appointment: Appointment) => void;
  cancelAppointment: (id: string) => void;
  addTransaction: (transaction: Transaction) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<AppState>(initialMockData);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("spa-salon-data");
    if (saved) {
      try {
        setState(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse local storage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("spa-salon-data", JSON.stringify(state));
    }
  }, [state, isLoaded]);

  const updateService = (updatedService: Service) => {
    setState((prev) => ({
      ...prev,
      services: prev.services.map((s) => (s.id === updatedService.id ? updatedService : s)),
    }));
  };

  const addAppointment = (appointment: Appointment) => {
    setState((prev) => ({
      ...prev,
      appointments: [...prev.appointments, appointment],
    }));
  };

  const updateAppointment = (appointment: Appointment) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === appointment.id ? appointment : a)),
    }));
  };

  const cancelAppointment = (id: string) => {
    setState((prev) => ({
      ...prev,
      appointments: prev.appointments.map((a) => (a.id === id ? { ...a, status: "cancelled" } : a)),
    }));
  };

  const addTransaction = (transaction: Transaction) => {
    setState((prev) => {
      // Update product stock if items sold
      const products = [...prev.products];
      transaction.items.forEach(item => {
        if (item.type === 'product') {
          const pIdx = products.findIndex(p => p.id === item.itemId);
          if (pIdx >= 0) {
            products[pIdx] = { ...products[pIdx], stock: Math.max(0, products[pIdx].stock - 1) };
          }
        }
      });

      // Update client loyalty points
      const clients = prev.clients.map(c =>
        c.id === transaction.clientId
          ? { ...c, loyaltyPoints: c.loyaltyPoints + transaction.pointsEarned - transaction.pointsRedeemed }
          : c
      );

      return {
        ...prev,
        transactions: [...prev.transactions, transaction],
        products,
        clients,
      };
    });
  };

  if (!isLoaded) return null;

  return (
    <AppContext.Provider
      value={{
        state,
        setState,
        updateService,
        addAppointment,
        updateAppointment,
        cancelAppointment,
        addTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
