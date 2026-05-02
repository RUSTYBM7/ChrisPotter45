import { useLocation } from "wouter";

export default function Footer() {
  const [, navigate] = useLocation();

  const scrollTo = (id: string) => {
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-white/5 py-10 md:py-12 bg-[#05070D]" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand */}
          <div>
            <button
              onClick={() => goTo("/")}
              className="text-sm font-bold tracking-[0.24em] uppercase text-white/60 hover:text-white transition-colors"
            >
              Chris Potter
            </button>
            <p className="text-[10px] tracking-widest uppercase text-white/18 mt-1">
              Actor · Director · Producer
            </p>
          </div>

          {/* Nav links */}
          <div className="flex flex-wrap gap-6 md:gap-8">
            {(["Work", "About", "Gallery"] as const).map((label) => (
              <button
                key={label}
                onClick={() => scrollTo(label.toLowerCase())}
                className="text-[9px] tracking-[0.2em] uppercase text-white/22 hover:text-white/45 transition-colors"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => goTo("/fanbase")}
              className="text-[9px] tracking-[0.2em] uppercase text-white/22 hover:text-white/45 transition-colors"
            >
              Fanbase
            </button>
            <button
              onClick={() => goTo("/contact")}
              className="text-[9px] tracking-[0.2em] uppercase text-white/22 hover:text-white/45 transition-colors"
            >
              Contact
            </button>
          </div>

          {/* Copyright */}
          <p className="text-[9px] tracking-wide text-white/18">
            &copy; {new Date().getFullYear()} Chris Potter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
