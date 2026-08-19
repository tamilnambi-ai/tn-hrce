'use client';

import { createContext, useContext, useState, useEffect, useSyncExternalStore } from 'react';

// ── Available Tamil Nadu cities ───────────────────────────────────────────────
export interface City {
  id: string;
  name: string;
  nameTa: string;
}

export const CITIES: City[] = [
  { id: 'chennai',     name: 'Chennai',     nameTa: 'சென்னை'       },
  { id: 'trichy',      name: 'Trichy',      nameTa: 'திருச்சி'     },
  { id: 'madurai',     name: 'Madurai',     nameTa: 'மதுரை'        },
  { id: 'coimbatore',  name: 'Coimbatore',  nameTa: 'கோவை'         },
  { id: 'salem',       name: 'Salem',       nameTa: 'சேலம்'        },
  { id: 'tirunelveli', name: 'Tirunelveli', nameTa: 'திருநெல்வேலி' },
];

const STORAGE_KEY = 'hrce_city';
const CHANGE_EVENT = 'hrce_city_change';

interface CityContextValue {
  city: City;
  setCity: (c: City) => void;
  cities: City[];
  hydrated: boolean;         // true after first mount
  showWelcome: boolean;      // true until user picks a city this session
  dismissWelcome: () => void;
}

const CityContext = createContext<CityContextValue>({
  city:    CITIES[0],
  setCity: () => {},
  cities:  CITIES,
  hydrated: false,
  showWelcome: false,
  dismissWelcome: () => {},
});

// ── External store — reads localStorage synchronously ─────────────────────────
function subscribe(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

function getSnapshot(): string {
  return localStorage.getItem(STORAGE_KEY) ?? CITIES[0].id;
}

function getServerSnapshot(): string {
  return CITIES[0].id;   // SSR default — swap happens once during hydration
}

export function CityProvider({ children }: { children: React.ReactNode }) {
  const cityId = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const city = CITIES.find((c) => c.id === cityId) ?? CITIES[0];

  const [hydrated, setHydrated] = useState(false);
  // Welcome popup — shows on every fresh mount until dismissed (no storage).
  const [showWelcome, setShowWelcome] = useState(true);
  useEffect(() => { setHydrated(true); }, []);

  function setCity(c: City) {
    localStorage.setItem(STORAGE_KEY, c.id);
    window.dispatchEvent(new Event(CHANGE_EVENT));
    // Scroll back to hero so users always see the change from a consistent
    // starting point — prevents the "jerk" of layout shift while mid-scroll.
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function dismissWelcome() { setShowWelcome(false); }

  return (
    <CityContext.Provider value={{ city, setCity, cities: CITIES, hydrated, showWelcome, dismissWelcome }}>
      {children}
    </CityContext.Provider>
  );
}

export function useCity() {
  return useContext(CityContext);
}
