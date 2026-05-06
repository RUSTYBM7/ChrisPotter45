import { FaTelegram, FaWhatsapp, FaFacebook, FaImdb } from "react-icons/fa";

const socials = [
  {
    label: "Telegram",
    Icon: FaTelegram,
    href: "https://t.me/officialaccunt12",
    hoverColor: "#26A5E4",
  },
  {
    label: "WhatsApp",
    Icon: FaWhatsapp,
    href: "https://wa.me/16304642733",
    hoverColor: "#25D366",
  },
  {
    label: "Facebook",
    Icon: FaFacebook,
    href: "https://www.facebook.com/profile.php?id=61589438727256&mibextid=wwXIfr&mibextid=wwXIfr",
    hoverColor: "#1877F2",
  },
  {
    label: "IMDb",
    Icon: FaImdb,
    href: "https://www.imdb.com/name/nm0693638/",
    hoverColor: "#F5C518",
  },
];

export default function SocialSidebar() {
  return (
    <div
      className="fixed bottom-7 left-6 z-40 flex flex-row gap-3.5 items-center"
      data-testid="social-sidebar"
    >
      {socials.map(({ label, Icon, href, hoverColor }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={label}
          className="social-icon-btn group w-9 h-9 rounded-full border border-white/12 bg-white/[0.04] flex items-center justify-center hover:border-white/30 hover:bg-white/[0.1] transition-all duration-200"
          data-testid={`social-${label.toLowerCase()}`}
          style={{ "--hover-color": hoverColor } as React.CSSProperties}
        >
          <Icon
            className="w-[15px] h-[15px] text-white/40 group-hover:text-white transition-colors duration-200"
            style={{ fontSize: 15 }}
          />
        </a>
      ))}

      {/* Connecting line to the right */}
      <div className="w-8 h-px bg-gradient-to-r from-white/10 to-transparent hidden md:block" />
    </div>
  );
}
