import { useState, useEffect } from "react";
import { useLocation } from "wouter";

interface NavBarProps {
  alwaysDark?: boolean;
}

export default function NavBar({ alwaysDark = false }: NavBarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [location, navigate] = useLocation();

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", handle, { passive: true });
    handle();
    return () => window.removeEventListener("scroll", handle);
  }, []);

  const scrollTo = (id: string) => {
    setMenuOpen(false);
    if (location !== "/") {
      navigate("/");
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const goTo = (path: string) => {
    setMenuOpen(false);
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showDark = alwaysDark || scrolled;
  const isActive = (path: string) => location === path;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        showDark ? "bg-[#07090F]/92 backdrop-blur-md border-b border-white/5" : ""
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-12 h-16 md:h-20 flex items-center justify-between">
        <button
          onClick={() => goTo("/")}
          className="text-sm font-bold tracking-[0.22em] uppercase text-white hover:text-white/70 transition-colors"
        >
          Chris Potter
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-7 lg:gap-9">
          {(["Work", "About", "Gallery"] as const).map(label => (
            <button key={label}
              onClick={() => scrollTo(label.toLowerCase())}
              className="nav-link text-[11px] tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-200">
              {label}
            </button>
          ))}
          <button onClick={() => goTo("/fanbase")}
            className={`nav-link text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${isActive("/fanbase") ? "text-white" : "text-white/50 hover:text-white"}`}>
            Fanbase
          </button>
          <button onClick={() => goTo("/press-kit")}
            className={`nav-link text-[11px] tracking-[0.2em] uppercase transition-colors duration-200 ${isActive("/press-kit") ? "text-white" : "text-white/50 hover:text-white"}`}>
            Press
          </button>
          <button onClick={() => goTo("/contact")}
            className={`ml-1 px-5 py-2 border rounded text-[10px] tracking-[0.2em] uppercase transition-all duration-200 ${
              isActive("/contact")
                ? "border-white/40 text-white bg-white/8"
                : "border-white/15 text-white/55 hover:border-white/35 hover:text-white"
            }`}>
            Contact
          </button>
        </nav>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2 flex flex-col gap-[5px]" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
          <span className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
          <span className={`block w-5 h-[1px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-80" : "max-h-0"}`}>
        <div className="px-6 pb-8 pt-2 bg-[#07090F]/98 border-b border-white/5 flex flex-col gap-5">
          {["Work", "About", "Gallery"].map(label => (
            <button key={label} onClick={() => scrollTo(label.toLowerCase())}
              className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors text-left">{label}</button>
          ))}
          <button onClick={() => goTo("/fanbase")} className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors text-left">Fanbase</button>
          <button onClick={() => goTo("/press-kit")} className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors text-left">Press Kit</button>
          <button onClick={() => goTo("/contact")} className="text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors text-left">Contact</button>
        </div>
      </div>
    </header>
  );
}
