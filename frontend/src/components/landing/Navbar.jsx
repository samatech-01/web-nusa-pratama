import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

const LINKS = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#introduction" },
  { label: "Vision & Mission", href: "#vision" },
  { label: "Services", href: "#services" },
  { label: "Our Value", href: "#value" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 sm:h-20">
        <a href="#home" data-testid="navbar-logo" className="flex items-center gap-3">
          <img src="/images/logo_mark.png" alt="Nusa Pratama Solution" className="h-9 w-auto" />
          <span className="hidden sm:block font-heading font-semibold tracking-[0.18em] text-sm text-[#2b2b2b]">
            NUSA PRATAMA SOLUTION
          </span>
        </a>
        <div className="hidden lg:flex items-center gap-8">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className="text-sm font-medium text-[#2b2b2b] hover:text-[#F5A742] transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            data-testid="nav-cta-button"
            className="bg-[#F5A742] hover:bg-[#e0942f] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
          >
            Get in Touch
          </a>
        </div>
        <button
          data-testid="mobile-menu-toggle"
          className="lg:hidden p-2 text-[#2b2b2b]"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>
      {open && (
        <div data-testid="mobile-menu" className="lg:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-sm font-medium text-[#2b2b2b] hover:text-[#F5A742]"
            >
              {l.label}
            </a>
          ))}
        </div>
      )}
    </nav>
  );
};
