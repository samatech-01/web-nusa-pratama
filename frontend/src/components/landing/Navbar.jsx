import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Globe } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { lang, toggle, t } = useLanguage();
  const location = useLocation();

  const isSubPage = location.pathname !== "/";
  const isLightNav = scrolled || isSubPage;

  const LINKS = [
    { label: t("nav_home"), href: "/#home", id: "home" },
    { label: t("nav_about"), href: "/#introduction", id: "about" },
    { label: t("nav_vision"), href: "/#vision", id: "vision" },
    { label: t("nav_services"), href: "/#services", id: "services" },
    { label: t("nav_value"), href: "/#value", id: "value" },
    { label: t("nav_contact"), href: "/#contact", id: "contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      data-testid="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isLightNav
          ? "bg-white/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex items-center justify-between h-16 sm:h-20">
        <Link to="/" data-testid="navbar-logo" className="flex items-center gap-3">
          <img src="/images/logo_mark.png" alt="Nusa Pratama Solution" className="h-9 w-auto" />
          <span
            className={`hidden sm:block font-heading font-semibold tracking-[0.18em] text-sm transition-colors ${
              isLightNav ? "text-[#2b2b2b]" : "text-white"
            }`}
          >
            NUSA PRATAMA SOLUTION
          </span>
        </Link>
        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <a
              key={l.id}
              href={l.href}
              data-testid={`nav-link-${l.id}`}
              className={`text-sm font-medium transition-colors ${
                isLightNav
                  ? "text-[#2b2b2b] hover:text-[#F5A742]"
                  : "text-white/90 hover:text-[#F5A742]"
              }`}
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={toggle}
            data-testid="language-toggle"
            className="flex items-center gap-1.5 border border-[#F5A742] text-[#F5A742] hover:bg-[#F5A742] hover:text-white text-xs font-bold px-3 py-1.5 rounded-full transition-colors"
          >
            <Globe size={14} />
            {lang === "id" ? "EN" : "ID"}
          </button>
          <a
            href="/#contact"
            data-testid="nav-cta-button"
            className="bg-[#F5A742] hover:bg-[#e0942f] text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors shadow-sm"
          >
            {t("nav_cta")}
          </a>
        </div>
        <div className="lg:hidden flex items-center gap-2">
          <button
            onClick={() => {
              toggle();
              setOpen(false);
            }}
            data-testid="language-toggle-mobile"
            className="flex items-center gap-1 border border-[#F5A742] text-[#F5A742] text-xs font-bold px-2.5 py-1.5 rounded-full"
          >
            <Globe size={13} />
            {lang === "id" ? "EN" : "ID"}
          </button>
          <button
            data-testid="mobile-menu-toggle"
            className={`p-2 transition-colors ${
              isLightNav ? "text-[#2b2b2b]" : "text-white"
            }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      {open && (
        <div data-testid="mobile-menu" className="lg:hidden bg-white shadow-lg px-6 py-4 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a
              key={l.id}
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
