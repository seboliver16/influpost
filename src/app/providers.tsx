"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/hooks/useAuth";
import { Toaster } from "react-hot-toast";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      {children}
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: "#1f2937",
            color: "#f9fafb",
            border: "1px solid #374151",
            borderRadius: "12px",
          },
        }}
      />
    </AuthProvider>
  );
}
