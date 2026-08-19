'use client';

import { useEffect, useState } from 'react';
import { MapPin, Sparkles, X, ArrowLeft, ChevronRight } from 'lucide-react';
import { useCity, type City, CITIES } from '@/contexts/CityContext';

// Welcome popup shown on every fresh mount. Bilingual (Tamil primary, English secondary).
// User picks a city → sets it in CityContext → popup closes.
// Close button defaults to Chennai.

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1768406091087-7fb0d03f6064?w=900&h=360&fit=crop&q=80&auto=format';

// Additional TN cities — static only, clicks are no-ops.
// Marked as "Coming soon" so users understand why they don't load.
const EXTRA_CITIES: { name: string; nameTa: string }[] = [
  { name: 'Vellore',      nameTa: 'வேலூர்'          },
  { name: 'Kanchipuram',  nameTa: 'காஞ்சிபுரம்'     },
  { name: 'Erode',        nameTa: 'ஈரோடு'           },
  { name: 'Thanjavur',    nameTa: 'தஞ்சாவூர்'       },
  { name: 'Karur',        nameTa: 'கரூர்'           },
  { name: 'Dindigul',     nameTa: 'திண்டுக்கல்'    },
  { name: 'Cuddalore',    nameTa: 'கடலூர்'          },
  { name: 'Villupuram',   nameTa: 'விழுப்புரம்'    },
  { name: 'Kanyakumari',  nameTa: 'கன்னியாகுமரி'   },
  { name: 'Nagercoil',    nameTa: 'நாகர்கோவில்'    },
];

export default function WelcomeModal() {
  const { city: currentCity, cities, setCity, showWelcome, dismissWelcome, hydrated } = useCity();
  const [showAll, setShowAll] = useState(false);

  // Lock body scroll while open
  useEffect(() => {
    if (!showWelcome || !hydrated) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [showWelcome, hydrated]);

  // Reset "show all" view whenever the modal reopens
  useEffect(() => {
    if (!showWelcome) setShowAll(false);
  }, [showWelcome]);

  if (!hydrated || !showWelcome) return null;

  function pick(c: City) {
    setCity(c);
    dismissWelcome();
  }

  function handleClose() {
    setCity(CITIES[0]);   // default to Chennai
    dismissWelcome();
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="welcome-title"
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-welcomeIn"
    >
      {/* Backdrop — no dismiss on click */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal card */}
      <div className="relative w-full max-w-[560px] max-h-[92vh] overflow-y-auto bg-white rounded-3xl shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        {/* Close button (defaults to Chennai) */}
        <button
          onClick={handleClose}
          aria-label="Close (default to Chennai)"
          className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-sm text-neutral-700 hover:bg-white hover:text-[--color-site-name] transition-all shadow-md"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Hero image */}
        <div className="relative h-[180px] md:h-[220px] w-full overflow-hidden rounded-t-3xl">
          <img src={HERO_IMAGE} alt="Tamil Nadu Temple" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-1.5 text-white/90 mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span className="text-[11px] font-bold uppercase tracking-widest">
                <span className="ta-text">வணக்கம்</span> · Welcome
              </span>
            </div>
            <h2 id="welcome-title" className="text-white text-[22px] md:text-[26px] font-bold leading-tight ta-text">
              தமிழ்நாடு இந்துசமய அறநிலையத்துறை
              <span className="block text-[16px] md:text-[18px] font-semibold opacity-90 mt-0.5" style={{ fontFamily: 'DM Sans, system-ui, sans-serif' }}>
                Tamil Nadu HR&amp;CE
              </span>
            </h2>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-7">
          {!showAll ? (
            <>
              {/* Brief — Tamil first, English second */}
              <p className="text-[14px] text-[--color-text-primary] leading-relaxed ta-text">
                தமிழ்நாட்டின் கோயில்கள், திருவிழாக்கள், சுற்றுலா தொகுப்புகள் மற்றும்
                புனித பாரம்பரியத்தை ஆராயுங்கள். உங்கள் நகர கோயில் நிகழ்வுகளுடன் இணைந்திருங்கள்.
              </p>
              <p className="text-[13px] text-[--color-text-secondary] leading-relaxed mt-2">
                Explore temples, festivals, tour packages, and sacred heritage across
                Tamil Nadu. Book pujas, offer donations, and stay connected with
                temple events in your city.
              </p>

              {/* City picker — 6 core */}
              <div className="mt-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="w-4 h-4 text-[--color-site-name]" />
                  <p className="text-[13px] font-bold text-[--color-text-primary]">
                    <span className="ta-text">உங்கள் நகரத்தை தேர்ந்தெடுக்கவும்</span>
                    <span className="ml-2 text-[12px] font-semibold text-[--color-text-secondary]">
                      · Select your city
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {cities.map((c) => {
                    const isCurrent = c.id === currentCity.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => pick(c)}
                        className={`group relative flex flex-col items-start gap-0.5 px-4 py-3 rounded-xl border-2 transition-all duration-150 text-left
                          ${isCurrent
                            ? 'border-[--color-site-name] bg-red-50'
                            : 'border-[--color-border] bg-white hover:border-[--color-site-name] hover:bg-red-50/40'
                          }`}
                      >
                        <span className={`text-[14px] font-bold ta-text ${isCurrent ? 'text-[--color-site-name]' : 'text-[--color-text-primary] group-hover:text-[--color-site-name]'} transition-colors`}>
                          {c.nameTa}
                        </span>
                        <span className="text-[12px] text-[--color-text-secondary]">
                          {c.name}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Show all cities — wide button */}
                <button
                  onClick={() => setShowAll(true)}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-dashed border-[--color-border] text-[--color-text-primary] hover:border-[--color-site-name] hover:text-[--color-site-name] hover:bg-red-50/40 transition-all group"
                >
                  <span className="text-[13px] font-bold ta-text">அனைத்து நகரங்களையும் காட்டு</span>
                  <span className="text-[12px] font-semibold text-[--color-text-secondary] group-hover:text-[--color-site-name] transition-colors">
                    · Show all cities
                  </span>
                  <ChevronRight className="w-4 h-4 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all" />
                </button>

                <p className="text-[11px] text-[--color-text-secondary] mt-4 text-center">
                  <span className="ta-text">தலைப்பில் நகரத்தை எப்போது வேண்டுமானாலும் மாற்றலாம்.</span>
                  <span className="ml-1">You can change your city anytime from the header.</span>
                </p>
              </div>
            </>
          ) : (
            /* ── All cities view ─────────────────────────────────────────── */
            <>
              <button
                onClick={() => setShowAll(false)}
                className="flex items-center gap-1.5 text-[13px] font-semibold text-[--color-text-secondary] hover:text-[--color-site-name] transition-colors mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="ta-text">பின்செல்</span>
                <span>· Back</span>
              </button>

              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-4 h-4 text-[--color-site-name]" />
                <p className="text-[13px] font-bold text-[--color-text-primary]">
                  <span className="ta-text">அனைத்து நகரங்களும்</span>
                  <span className="ml-2 text-[12px] font-semibold text-[--color-text-secondary]">
                    · All cities
                  </span>
                </p>
              </div>

              {/* Available cities */}
              <div className="mb-5">
                <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-widest mb-2">
                  <span className="ta-text">கிடைக்கின்றது</span> · Available
                </p>
                <div className="divide-y divide-[--color-border] border border-[--color-border] rounded-xl overflow-hidden">
                  {cities.map((c) => {
                    const isCurrent = c.id === currentCity.id;
                    return (
                      <button
                        key={c.id}
                        onClick={() => pick(c)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors ${isCurrent ? 'bg-red-50' : 'hover:bg-neutral-50'}`}
                      >
                        <div>
                          <span className={`text-[14px] font-bold ta-text block ${isCurrent ? 'text-[--color-site-name]' : 'text-[--color-text-primary]'}`}>
                            {c.nameTa}
                          </span>
                          <span className="text-[12px] text-[--color-text-secondary]">{c.name}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-[--color-site-name]' : 'text-neutral-300'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Coming soon cities — no-op clicks */}
              <div>
                <p className="text-[11px] font-bold text-[--color-text-secondary] uppercase tracking-widest mb-2">
                  <span className="ta-text">விரைவில்</span> · Coming soon
                </p>
                <div className="divide-y divide-[--color-border] border border-[--color-border] rounded-xl overflow-hidden opacity-60">
                  {EXTRA_CITIES.map((c) => (
                    <div
                      key={c.name}
                      className="w-full flex items-center justify-between px-4 py-2.5 cursor-not-allowed"
                    >
                      <div>
                        <span className="text-[14px] font-bold ta-text block text-[--color-text-primary]">
                          {c.nameTa}
                        </span>
                        <span className="text-[12px] text-[--color-text-secondary]">{c.name}</span>
                      </div>
                      <span className="text-[10px] font-semibold text-[--color-text-secondary] uppercase tracking-wider bg-neutral-100 px-2 py-0.5 rounded-full">
                        Soon
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
