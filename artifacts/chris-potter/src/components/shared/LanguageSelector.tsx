import { useState, useRef, useEffect } from "react";

const LANGUAGES = [
  { code: "en",    label: "English",    flag: "🇬🇧" },
  { code: "fr",    label: "Français",   flag: "🇫🇷" },
  { code: "es",    label: "Español",    flag: "🇪🇸" },
  { code: "de",    label: "Deutsch",    flag: "🇩🇪" },
  { code: "it",    label: "Italiano",   flag: "🇮🇹" },
  { code: "pt",    label: "Português",  flag: "🇵🇹" },
  { code: "zh-CN", label: "中文",       flag: "🇨🇳" },
  { code: "ja",    label: "日本語",      flag: "🇯🇵" },
  { code: "ko",    label: "한국어",      flag: "🇰🇷" },
  { code: "ar",    label: "العربية",    flag: "🇸🇦" },
  { code: "ru",    label: "Русский",    flag: "🇷🇺" },
  { code: "hi",    label: "हिन्दी",      flag: "🇮🇳" },
  { code: "nl",    label: "Nederlands", flag: "🇳🇱" },
  { code: "sv",    label: "Svenska",    flag: "🇸🇪" },
  { code: "no",    label: "Norsk",      flag: "🇳🇴" },
  { code: "da",    label: "Dansk",      flag: "🇩🇰" },
  { code: "pl",    label: "Polski",     flag: "🇵🇱" },
  { code: "tr",    label: "Türkçe",     flag: "🇹🇷" },
  { code: "uk",    label: "Українська", flag: "🇺🇦" },
  { code: "vi",    label: "Tiếng Việt", flag: "🇻🇳" },
  { code: "th",    label: "ภาษาไทย",     flag: "🇹🇭" },
  { code: "id",    label: "Indonesia",  flag: "🇮🇩" },
];

function getCurrent(): string {
  const m = document.cookie.match(/googtrans=\/en\/([^;]+)/);
  return m ? m[1] : "en";
}

function applyLanguage(code: string) {
  if (code === "en") {
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:01 GMT; path=/; domain=" + location.hostname;
  } else {
    document.cookie = `googtrans=/en/${code}; path=/`;
    document.cookie = `googtrans=/en/${code}; path=/; domain=${location.hostname}`;
  }
  const select = document.querySelector<HTMLSelectElement>(".goog-te-combo");
  if (select) {
    select.value = code === "en" ? "" : code;
    select.dispatchEvent(new Event("change"));
  } else {
    window.location.reload();
  }
}

export default function LanguageSelector() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("en");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setActive(getCurrent());
  }, []);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const current = LANGUAGES.find(l => l.code === active) ?? LANGUAGES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        aria-label="Translate site"
        title="Translate"
        className="flex items-center gap-1.5 p-2 rounded-full text-white/40 hover:text-white/80 transition-colors duration-200"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        <span className="text-[9px] tracking-[0.15em] uppercase hidden md:inline">{current.flag}</span>
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-48 bg-[#0E1119]/96 backdrop-blur-xl border border-white/8 rounded-xl shadow-2xl shadow-black/60 overflow-hidden z-[999]">
          <p className="text-[8px] tracking-[0.22em] uppercase text-white/25 px-4 pt-3.5 pb-2">Select Language</p>
          <div className="max-h-64 overflow-y-auto">
            {LANGUAGES.map(lang => (
              <button
                key={lang.code}
                onClick={() => { applyLanguage(lang.code); setActive(lang.code); setOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-150 ${
                  active === lang.code
                    ? "bg-white/8 text-white"
                    : "text-white/45 hover:bg-white/[0.05] hover:text-white/75"
                }`}
              >
                <span className="text-base leading-none">{lang.flag}</span>
                <span className="text-xs tracking-[0.04em]">{lang.label}</span>
                {active === lang.code && (
                  <svg className="ml-auto w-3 h-3 text-white/60 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
