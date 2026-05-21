"use client";

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";

interface AuthHydrationProviderProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Hydration shield wrapper for Zustand persisted stores.
 * Prevents Next.js Server-Side Rendering mismatch errors by delaying child mounts
 * until Zustand finishes reading localStorage on the client.
 */
export const AuthHydrationProvider: React.FC<AuthHydrationProviderProps> = ({
  children,
  fallback = null,
}) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // 1. Check if store has already hydrated
    if (useAuthStore.persist.hasHydrated()) {
      setIsHydrated(true);
      return;
    }

    // 2. Otherwise, listen for hydration to finish
    const unsubscribe = useAuthStore.persist.onFinishHydration(() => {
      setIsHydrated(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!isHydrated) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};
