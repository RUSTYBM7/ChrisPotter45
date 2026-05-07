import { useState } from "react";
import { FaTelegram, FaWhatsapp, FaFacebook, FaImdb } from "react-icons/fa";
import { useLocation } from "wouter";

export default function HeroSocialBar() {
  const [whatsappOpen, setWhatsappOpen] = useState(false);
  const [, navigate] = useLocation();

  return (
    <div className="absolute left-6 md:left-10 bottom-8 md:bottom-10 z-20 flex flex-row items-end gap-3">

      {/* Telegram */}
      <a
        href="https://t.me/officialaccunt12"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="group w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaTelegram className="text-white/50 group-hover:text-[#26A5E4] transition-colors" style={{ fontSize: 14 }} />
      </a>

      {/* WhatsApp — locked, tap shows badge-required popup */}
      <div className="relative flex flex-col items-center">
        {/* Popup — visible on hover (desktop) or tap (mobile) */}
        <div className={`absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 transition-all duration-200 z-30 ${whatsappOpen ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-1 pointer-events-none"}`}>
          <div className="bg-[#0E1119]/90 border border-amber-400/20 backdrop-blur-xl rounded-xl px-4 py-3 flex flex-col items-center gap-2 whitespace-nowrap shadow-xl shadow-black/50">
            <div className="flex items-center gap-1.5">
              <svg viewBox="0 0 10 12" className="w-2.5 h-3 text-amber-400/80 flex-shrink-0" fill="currentColor">
                <path d="M8.5 5H8V3.5a3 3 0 0 0-6 0V5H1.5A.5.5 0 0 0 1 5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 8.5 5zM3.5 3.5a1.5 1.5 0 0 1 3 0V5h-3V3.5z" />
              </svg>
              <p className="text-[9px] tracking-[0.18em] uppercase text-amber-400/80 font-semibold">Tier 1 Badge Required</p>
            </div>
            <p className="text-[9px] text-white/40 leading-relaxed text-center max-w-[140px]">Join the Fanbase and earn your Pioneer Badge to unlock WhatsApp access.</p>
            <button
              onClick={() => { setWhatsappOpen(false); navigate("/fanbase"); window.scrollTo({ top: 0, behavior: "instant" }); }}
              className="pointer-events-auto mt-0.5 px-4 py-1.5 bg-white/8 border border-white/12 rounded-full text-[8px] tracking-[0.18em] uppercase text-white/60 hover:bg-white/15 hover:text-white transition-colors"
            >
              Join Fanbase
            </button>
          </div>
          {/* Arrow pointing down */}
          <div className="flex justify-center -mt-px">
            <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-amber-400/20" />
          </div>
        </div>

        <button
          onClick={() => setWhatsappOpen(o => !o)}
          aria-label="WhatsApp — Tier 1 Badge Required"
          className="group relative w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center hover:border-white/22 hover:bg-white/[0.08] transition-all duration-200"
        >
          <FaWhatsapp className="text-white/35 group-hover:text-[#25D366]/70 transition-colors" style={{ fontSize: 14 }} />
          {/* Lock overlay */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#07090F]/80 border border-white/15 flex items-center justify-center">
            <svg viewBox="0 0 10 12" className="w-1.5 h-2 text-amber-400/60" fill="currentColor">
              <path d="M8.5 5H8V3.5a3 3 0 0 0-6 0V5H1.5A.5.5 0 0 0 1 5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 8.5 5zM3.5 3.5a1.5 1.5 0 0 1 3 0V5h-3V3.5z" />
            </svg>
          </span>
        </button>

      </div>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/chrispotterofficialsite"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="group w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaFacebook className="text-white/50 group-hover:text-[#1877F2] transition-colors" style={{ fontSize: 14 }} />
      </a>

      {/* IMDb */}
      <a
        href="https://www.imdb.com/name/nm0693638/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="IMDb"
        className="group w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaImdb className="text-white/50 group-hover:text-[#F5C518] transition-colors" style={{ fontSize: 14 }} />
      </a>

      {/* Short horizontal divider to the right */}
      <div className="self-center w-6 h-px bg-gradient-to-r from-white/12 to-transparent" />
    </div>
  );
}
