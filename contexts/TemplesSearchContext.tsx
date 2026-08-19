'use client';

/**
 * Shared search state for the /temples page.
 * Header renders the input; TemplesListingPage reads the query.
 */

import { createContext, useContext, useState } from 'react';

interface Value {
  query: string;
  setQuery: (q: string) => void;
}

const TemplesSearchContext = createContext<Value>({
  query: '',
  setQuery: () => {},
});

export function TemplesSearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  return (
    <TemplesSearchContext.Provider value={{ query, setQuery }}>
      {children}
    </TemplesSearchContext.Provider>
  );
}

export function useTemplesSearch() {
  return useContext(TemplesSearchContext);
}
