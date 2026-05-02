import { useState } from "react";
import { FaTelegram, FaWhatsapp, FaFacebook, FaImdb } from "react-icons/fa";
import { useLocation } from "wouter";

export default function HeroSocialBar() {
  const [whatsappHover, setWhatsappHover] = useState(false);
  const [, navigate] = useLocation();

  return (
    <div className="absolute left-6 md:left-10 bottom-16 md:bottom-20 z-20 flex flex-col items-center gap-3">

      {/* Telegram */}
      <a
        href="https://t.me/chrispotter23"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="group relative w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaTelegram className="text-white/50 group-hover:text-white transition-colors" style={{ fontSize: 14 }} />
        <span className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] tracking-[0.18em] uppercase text-white/0 group-hover:text-white/40 transition-all duration-200 pointer-events-none">
          Telegram
        </span>
      </a>

      {/* WhatsApp — locked */}
      <div
        className="relative"
        onMouseEnter={() => setWhatsappHover(true)}
        onMouseLeave={() => setWhatsappHover(false)}
      >
        <a
          href="https://wa.me/16304642733"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="WhatsApp — Tier 1 Badge Required"
          className="group relative w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm flex items-center justify-center hover:border-white/25 hover:bg-white/[0.09] transition-all duration-200"
        >
          <FaWhatsapp className="text-white/35 group-hover:text-white/55 transition-colors" style={{ fontSize: 14 }} />

          {/* Lock overlay */}
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-black/60 border border-white/15 flex items-center justify-center backdrop-blur-sm">
            <svg viewBox="0 0 10 12" className="w-2 h-2.5 text-white/55" fill="currentColor">
              <path d="M8.5 5H8V3.5a3 3 0 0 0-6 0V5H1.5A.5.5 0 0 0 1 5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 8.5 5zM3.5 3.5a1.5 1.5 0 0 1 3 0V5h-3V3.5z" />
            </svg>
          </span>
        </a>

        {/* Tier tooltip */}
        <div className={`absolute left-11 top-1/2 -translate-y-1/2 transition-all duration-200 pointer-events-none ${whatsappHover ? "opacity-100" : "opacity-0"}`}>
          <div className="whitespace-nowrap flex items-center gap-2">
            <div className="w-px h-3 bg-white/20" />
            <div className="bg-black/70 border border-white/12 backdrop-blur-md rounded-full px-2.5 py-1">
              <p className="text-[9px] tracking-[0.16em] uppercase text-white/55">Tier 1 Badge Required</p>
            </div>
          </div>
        </div>

        {/* Persistent mini tag */}
        <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-amber-500/20 border border-amber-500/30 rounded-full px-1.5 py-px">
          <span className="text-[7px] tracking-wide uppercase text-amber-400/70 font-semibold whitespace-nowrap">T1+</span>
        </div>
      </div>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/share/1JReFApieZ/?mibextid=wwXIfr"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Facebook"
        className="group relative w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaFacebook className="text-white/50 group-hover:text-white transition-colors" style={{ fontSize: 14 }} />
        <span className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] tracking-[0.18em] uppercase text-white/0 group-hover:text-white/40 transition-all duration-200 pointer-events-none">
          Facebook
        </span>
      </a>

      {/* IMDb */}
      <a
        href="https://www.imdb.com/name/nm0693638/"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="IMDb"
        className="group relative w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaImdb className="text-white/50 group-hover:text-white transition-colors" style={{ fontSize: 14 }} />
        <span className="absolute left-11 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] tracking-[0.18em] uppercase text-white/0 group-hover:text-white/40 transition-all duration-200 pointer-events-none">
          IMDb
        </span>
      </a>

      {/* Vertical label */}
      <div className="mt-2 flex flex-col items-center gap-1.5">
        <div className="w-px h-8 bg-gradient-to-b from-white/12 to-transparent" />
        <p
          className="text-[8px] tracking-[0.22em] uppercase text-white/18"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          Channels
        </p>
      </div>
    </div>
  );
}
