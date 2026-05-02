import { motion } from "framer-motion";
import HeroSocialBar from "@/components/shared/HeroSocialBar";

interface PageHeroProps {
  photo: string;
  photoPosition?: string;
  label: string;
  heading: string;
  subheading?: string;
  compact?: boolean;
}

export default function PageHero({
  photo,
  photoPosition = "center",
  label,
  heading,
  subheading,
  compact = false,
}: PageHeroProps) {
  return (
    <section
      className={`relative flex flex-col justify-end ${compact ? "min-h-[60vh]" : "min-h-screen"} pb-14 md:pb-20`}
      data-testid="page-hero"
    >
      <div className="absolute inset-0 overflow-hidden">
        <motion.img
          src={photo}
          alt="Chris Potter"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: photoPosition }}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090F] via-[#07090F]/55 to-[#07090F]/35" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090F]/70 via-transparent to-transparent" />
      </div>

      <HeroSocialBar />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-12 w-full pt-32 pl-20 md:pl-24">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-[10px] tracking-[0.24em] uppercase text-white/35 mb-5"
        >
          {label}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.55 }}
          className="text-[clamp(4rem,12vw,9rem)] font-black uppercase leading-[0.88] tracking-tight text-white"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          data-testid="page-hero-heading"
        >
          {heading}
        </motion.h1>
        {subheading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="mt-6 flex items-center gap-4"
          >
            <div className="w-8 h-px bg-white/30" />
            <p className="text-xs tracking-[0.22em] uppercase text-white/45">{subheading}</p>
          </motion.div>
        )}
      </div>
    </section>
  );
}
