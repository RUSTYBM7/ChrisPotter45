import { useLocation } from "wouter";

export default function Footer() {
  const [, navigate] = useLocation();

  const scrollTo = (id: string) => {
    navigate("/");
    setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }), 300);
  };

  const goTo = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  return (
    <footer className="border-t border-white/5 pt-14 pb-10 bg-[#05070D]" data-testid="footer">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <button
              onClick={() => goTo("/")}
              className="text-sm font-bold tracking-[0.24em] uppercase text-white/65 hover:text-white transition-colors"
            >
              Chris Potter
            </button>
            <p className="text-[10px] tracking-widest uppercase text-white/18 mt-1.5 mb-4">
              Actor · Director · Producer
            </p>
            <p className="text-xs text-white/25 font-light leading-relaxed max-w-[200px]">
              Canadian actor and filmmaker. Best known as Tim Fleming in Heartland, now in its 18th season on CBC and Netflix.
            </p>
          </div>

          {/* Navigate */}
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase text-white/22 mb-4">Navigate</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Work", action: () => scrollTo("work") },
                { label: "About", action: () => scrollTo("about") },
                { label: "Gallery", action: () => scrollTo("gallery") },
                { label: "Filmography", action: () => scrollTo("filmography") },
              ].map(({ label, action }) => (
                <button key={label} onClick={action}
                  className="text-[10px] tracking-[0.16em] uppercase text-white/30 hover:text-white/60 transition-colors text-left">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Community */}
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase text-white/22 mb-4">Community</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Fanbase", path: "/fanbase" },
                { label: "Fan Portal", path: "/fan-portal" },
                { label: "Press Kit", path: "/press-kit" },
                { label: "Contact", path: "/contact" },
              ].map(({ label, path }) => (
                <button key={label} onClick={() => goTo(path)}
                  className="text-[10px] tracking-[0.16em] uppercase text-white/30 hover:text-white/60 transition-colors text-left">
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Connect */}
          <div>
            <p className="text-[9px] tracking-[0.22em] uppercase text-white/22 mb-4">Connect</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "Telegram", href: "https://t.me/officialaccunt12" },
                { label: "Facebook", href: "https://www.facebook.com/chrispotterofficialsite" },
                { label: "IMDb", href: "https://www.imdb.com/name/nm0693638/" },
                { label: "WhatsApp (T1+)", href: "https://wa.me/16304642733" },
              ].map(({ label, href }) => (
                <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                  className="text-[10px] tracking-[0.16em] uppercase text-white/30 hover:text-white/60 transition-colors">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="text-[9px] tracking-wide text-white/18">
            &copy; {new Date().getFullYear()} Chris Potter. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <a href="mailto:management@chrispotterofficial.site"
              className="text-[9px] tracking-wide text-white/18 hover:text-white/35 transition-colors">
              management@chrispotterofficial.site
            </a>
            <span className="text-white/10">·</span>
            <a href="mailto:fandom@chrispotterofficial.site"
              className="text-[9px] tracking-wide text-white/18 hover:text-white/35 transition-colors">
              fandom@chrispotterofficial.site
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
