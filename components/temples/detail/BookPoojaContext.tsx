'use client';

import { createContext, useContext, useState } from 'react';

interface Value {
  isOpen: boolean;
  open:   () => void;
  close:  () => void;
}

const BookPoojaContext = createContext<Value>({ isOpen: false, open: () => {}, close: () => {} });

export function BookPoojaProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <BookPoojaContext.Provider value={{ isOpen, open: () => setOpen(true), close: () => setOpen(false) }}>
      {children}
    </BookPoojaContext.Provider>
  );
}

export function useBookPooja() {
  return useContext(BookPoojaContext);
}
