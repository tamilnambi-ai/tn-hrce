'use client';

import { createContext, useContext, useState } from 'react';
import type { TempleAnnouncement } from '@/data/temples';

interface Value {
  isOpen: boolean;
  announcement: TempleAnnouncement | null;
  openFor: (a: TempleAnnouncement) => void;
  close:   () => void;
}

const DrawEntryContext = createContext<Value>({
  isOpen: false,
  announcement: null,
  openFor: () => {},
  close: () => {},
});

export function DrawEntryProvider({ children }: { children: React.ReactNode }) {
  const [announcement, setAnnouncement] = useState<TempleAnnouncement | null>(null);
  return (
    <DrawEntryContext.Provider
      value={{
        isOpen: announcement !== null,
        announcement,
        openFor: (a) => setAnnouncement(a),
        close:   () => setAnnouncement(null),
      }}
    >
      {children}
    </DrawEntryContext.Provider>
  );
}

export function useDrawEntry() {
  return useContext(DrawEntryContext);
}
