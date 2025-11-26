'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

type AvatarContextValue = {
  avatarUrl: string | null;
  setAvatarUrl: (url: string | null) => void;
};

const AvatarContext = createContext<AvatarContextValue | undefined>(undefined);

const STORAGE_KEY = 'vogue_avatar_url';

export function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null);

  // Load from localStorage on first mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setAvatarUrlState(stored);
    }
  }, []);

  const setAvatarUrl = (url: string | null) => {
    setAvatarUrlState(url);
    if (typeof window !== 'undefined') {
      if (url) {
        window.localStorage.setItem(STORAGE_KEY, url);
      } else {
        window.localStorage.removeItem(STORAGE_KEY);
      }
    }
  };

  return (
    <AvatarContext.Provider value={{ avatarUrl, setAvatarUrl }}>
      {children}
    </AvatarContext.Provider>
  );
}

export function useAvatar() {
  const ctx = useContext(AvatarContext);
  if (!ctx) {
    throw new Error('useAvatar must be used within an AvatarProvider');
  }
  return ctx;
}
