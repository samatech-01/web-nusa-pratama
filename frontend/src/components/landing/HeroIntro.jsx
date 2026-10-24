import { useLanguage } from "@/context/LanguageContext";
import { resolveUrl } from "@/config";

export const Hero = () => {
  const { t } = useLanguage();
  return (
    <section
      id="home"
      data-testid="hero-section"
      className="min-h-screen bg-[#2b2b2b] text-white flex flex-col items-center justify-center relative overflow-hidden px-6 pt-20"
    >
      {/* Background image & gradient overlay identik dengan halaman layanan */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <img src="/images/building_bg.png" alt="" className="w-full h-full object-cover" />
      </div>

      {/* Amber glow effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5A742] opacity-15 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F5A742] opacity-10 rounded-full blur-3xl -ml-20 -mb-20 pointer-events-none" />

      {/* Main hero content */}
      <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-10 sm:gap-16 animate-fade-up -mt-10">
        <img
          src="/images/logo_mark.png"
          alt="Nusa Pratama Solution"
          data-testid="hero-logo"
          className="w-44 sm:w-60 lg:w-72 [filter:drop-shadow(0_20px_40px_rgba(0,0,0,0.6))]"
        />
        <h1
          data-testid="hero-company-name"
          className="font-heading font-extrabold text-white tracking-[0.28em] text-3xl sm:text-4xl lg:text-5xl leading-[1.6] text-center sm:text-left drop-shadow-md"
        >
          NUSA<br />PRATAMA<br />SOLUTION
        </h1>
      </div>

      <p
        data-testid="hero-tagline"
        className="relative z-10 text-center font-heading font-bold tracking-[0.25em] text-[#F5A742] text-lg sm:text-xl animate-fade-up-delay mt-16 sm:mt-20"
      >
        {t("hero_tagline")}
      </p>
    </section>
  );
};

export const Introduction = ({ nibImageUrl }) => {
  const { t } = useLanguage();
  return (
    <section id="introduction" data-testid="introduction-section" className="relative bg-white py-24 overflow-hidden">
      <div className="absolute top-14 left-0 w-56 h-8 bg-[#F5A742]" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#F5A742] text-white font-heading font-bold text-2xl px-4 py-8 tracking-widest [writing-mode:vertical-lr] rounded-l-md hidden md:block">
        L E G A L
      </div>
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-14 items-center">
        <div className="pt-10">
          <h2 data-testid="introduction-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] mb-8">
            {t("intro_heading")}
          </h2>
          <p className="text-[#2b2b2b] text-lg leading-relaxed mb-6">{t("intro_p1")}</p>
          <p className="text-[#2b2b2b] text-lg leading-relaxed">{t("intro_p2")}</p>
        </div>
        <div className="flex gap-4 justify-center md:pr-14">
          <img
            src="/images/legal_akta.png"
            alt="Akta Pendirian PT Nusa Pratama Solution"
            data-testid="legal-doc-akta"
            className="w-1/2 max-w-[240px] border-2 border-[#2b2b2b] shadow-lg object-contain bg-white"
          />
          <img
            src={resolveUrl(nibImageUrl) || "/images/legal_nib.png"}
            alt="NIB Perizinan Berusaha"
            data-testid="legal-doc-nib"
            className="w-1/2 max-w-[240px] border-2 border-[#2b2b2b] shadow-lg object-contain bg-white"
          />
        </div>
      </div>
    </section>
  );
};

export const VisionMission = () => {
  const { t } = useLanguage();
  const missions = [t("mission_1"), t("mission_2"), t("mission_3"), t("mission_4")];
  return (
    <section id="vision" data-testid="vision-mission-section" className="grid md:grid-cols-2 bg-white">
      <div className="relative min-h-[420px] md:min-h-[560px]">
        <img src="/images/vision_team.png" alt="Team collaboration" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center p-8">
          <div data-testid="vision-card" className="bg-[#F5A742] text-white p-10 sm:p-12 max-w-md w-full shadow-xl">
            <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-5">{t("vision_heading")}</h2>
            <p className="text-lg leading-relaxed">{t("vision_text")}</p>
          </div>
        </div>
      </div>
      <div className="relative flex items-center py-20 px-8 sm:px-14">
        <div className="absolute right-0 top-0 w-8 h-40 bg-[#F5A742] hidden md:block" />
        <div data-testid="mission-content">
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] mb-8">{t("mission_heading")}</h2>
          <ul className="space-y-4">
            {missions.map((m, i) => (
              <li key={i} className="flex gap-3 text-lg text-[#2b2b2b] leading-relaxed">
                <span className="text-[#F5A742] font-bold mt-1">•</span>
                {m}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
