"use client";
import { useEffect } from "react";
import { initializeDB } from "@/lib/db";

export function ClientInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    initializeDB();
  }, []);

  return <>{children}</>;
}