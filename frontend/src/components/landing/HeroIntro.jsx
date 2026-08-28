export const Hero = () => (
  <section id="home" data-testid="hero-section" className="min-h-screen bg-white flex flex-col items-center justify-center relative overflow-hidden px-6">
    <div className="absolute top-0 left-0 w-40 h-3 bg-[#F5A742]" />
    <div className="absolute bottom-0 right-0 w-40 h-3 bg-[#F5A742]" />
    <img
      src="/images/logo_full.png"
      alt="Nusa Pratama Solution"
      data-testid="hero-logo"
      className="w-full max-w-2xl animate-fade-up"
    />
    <p
      data-testid="hero-tagline"
      className="mt-16 font-heading font-bold tracking-[0.35em] text-[#2b2b2b] text-lg sm:text-xl animate-fade-up-delay"
    >
      COMPANY PROFILE
    </p>
    <a
      href="#introduction"
      data-testid="hero-scroll-link"
      className="mt-10 text-sm text-[#9a9a9a] hover:text-[#F5A742] transition-colors animate-fade-up-delay"
    >
      Scroll to explore ↓
    </a>
  </section>
);

export const Introduction = () => (
  <section id="introduction" data-testid="introduction-section" className="relative bg-white py-24 overflow-hidden">
    <div className="absolute top-14 left-0 w-56 h-8 bg-[#F5A742]" />
    <div className="absolute right-0 top-1/2 -translate-y-1/2 bg-[#F5A742] text-white font-heading font-bold text-2xl px-4 py-8 tracking-widest [writing-mode:vertical-lr] rounded-l-md hidden md:block">
      L E G A L
    </div>
    <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-14 items-center">
      <div className="pt-10">
        <h2 data-testid="introduction-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] mb-8">
          INTRODUCTION
        </h2>
        <p className="text-[#2b2b2b] text-lg leading-relaxed mb-6">
          PT Nusa Pratama Solution is a national growing company with the
          business of catering, general supply and logistic services.
        </p>
        <p className="text-[#2b2b2b] text-lg leading-relaxed">
          Ready to serve both national and international scale of industrial
          sectors, mining, gas and oil company, offices, and any other event
          and functions needed by our customer (client).
        </p>
      </div>
      <div className="flex gap-4 justify-center md:pr-14">
        <img
          src="/images/legal_akta.png"
          alt="Akta Pendirian PT Nusa Pratama Solution"
          data-testid="legal-doc-akta"
          className="w-1/2 max-w-[240px] border-2 border-[#2b2b2b] shadow-lg object-contain bg-white"
        />
        <img
          src="/images/legal_nib.png"
          alt="NIB Perizinan Berusaha"
          data-testid="legal-doc-nib"
          className="w-1/2 max-w-[240px] border-2 border-[#2b2b2b] shadow-lg object-contain bg-white"
        />
      </div>
    </div>
  </section>
);

const MISSIONS = [
  "To provide excellent services.",
  "To produce halal, safe and healthy products.",
  "Prompt response to customer complaints.",
  "Continues improvement in order to deliver best quality products.",
];

export const VisionMission = () => (
  <section id="vision" data-testid="vision-mission-section" className="grid md:grid-cols-2 bg-white">
    <div className="relative min-h-[420px] md:min-h-[560px]">
      <img src="/images/vision_team.png" alt="Team collaboration" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 flex items-center justify-center p-8">
        <div data-testid="vision-card" className="bg-[#F5A742] text-white p-10 sm:p-12 max-w-md w-full shadow-xl">
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-5">VISION</h2>
          <p className="text-lg leading-relaxed">
            To be the best catering, general supply, and logistic services company.
          </p>
        </div>
      </div>
    </div>
    <div className="relative flex items-center py-20 px-8 sm:px-14">
      <div className="absolute right-0 top-0 w-8 h-40 bg-[#F5A742] hidden md:block" />
      <div data-testid="mission-content">
        <h2 className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] mb-8">MISSION</h2>
        <ul className="space-y-4">
          {MISSIONS.map((m, i) => (
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
