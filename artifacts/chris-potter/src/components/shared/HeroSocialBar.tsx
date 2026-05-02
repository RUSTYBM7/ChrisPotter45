import { useState } from "react";
import { FaTelegram, FaWhatsapp, FaFacebook, FaImdb } from "react-icons/fa";

export default function HeroSocialBar() {
  const [whatsappHover, setWhatsappHover] = useState(false);

  return (
    <div className="absolute left-6 md:left-10 bottom-8 md:bottom-10 z-20 flex flex-row items-end gap-3">

      {/* Telegram */}
      <a
        href="https://t.me/chrispotter23"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Telegram"
        className="group w-9 h-9 rounded-full border border-white/15 bg-white/[0.06] backdrop-blur-sm flex items-center justify-center hover:border-white/35 hover:bg-white/[0.12] transition-all duration-200"
      >
        <FaTelegram className="text-white/50 group-hover:text-[#26A5E4] transition-colors" style={{ fontSize: 14 }} />
      </a>

      {/* WhatsApp — locked */}
      <div
        className="relative flex flex-col items-center"
        onMouseEnter={() => setWhatsappHover(true)}
        onMouseLeave={() => setWhatsappHover(false)}
      >
        {/* Tier tooltip (appears above on hover) */}
        <div className={`absolute bottom-full mb-2 transition-all duration-200 pointer-events-none ${whatsappHover ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"}`}>
          <div className="bg-black/75 border border-white/12 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-1.5 whitespace-nowrap">
            <svg viewBox="0 0 10 12" className="w-2 h-2.5 text-amber-400/70 flex-shrink-0" fill="currentColor">
              <path d="M8.5 5H8V3.5a3 3 0 0 0-6 0V5H1.5A.5.5 0 0 0 1 5.5v5a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-5A.5.5 0 0 0 8.5 5zM3.5 3.5a1.5 1.5 0 0 1 3 0V5h-3V3.5z" />
            </svg>
            <p className="text-[9px] tracking-[0.14em] uppercase text-white/55">Tier 1 Badge Required</p>
          </div>
        </div>

        <a
          href="https://wa.me/16304642733"
          target="_blank"
          rel="noopener noreferrer"
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
        </a>

        {/* Persistent T1+ pill below */}
        <div className="mt-1.5 bg-amber-500/15 border border-amber-500/25 rounded-full px-1.5 py-px">
          <span className="text-[7px] tracking-wide uppercase text-amber-400/65 font-semibold whitespace-nowrap">T1+</span>
        </div>
      </div>

      {/* Facebook */}
      <a
        href="https://www.facebook.com/share/1JReFApieZ/?mibextid=wwXIfr"
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
