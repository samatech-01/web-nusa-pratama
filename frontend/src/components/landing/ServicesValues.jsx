import { HandPlatter, Package, Truck } from "lucide-react";

const SERVICES = [
  { label: "Catering", icon: HandPlatter },
  { label: "General Supply", icon: Package },
  { label: "Logistics", icon: Truck },
  { label: "HVAC", image: "/images/hvac_logo.png" },
];

export const Services = () => (
  <section id="services" data-testid="services-section" className="relative py-28 overflow-hidden">
    <img src="/images/building_bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
    <div className="absolute inset-0 bg-[#fdf3df]/40" />
    <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
      <div className="grid lg:grid-cols-[300px_1fr] shadow-2xl">
        <div className="bg-[#F5A742] flex items-center justify-center py-14 px-8">
          <h2 data-testid="services-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-white leading-tight">
            OUR<br />SERVICES
          </h2>
        </div>
        <div className="bg-white grid grid-cols-2 lg:grid-cols-4 gap-10 items-start py-16 px-8 sm:px-12">
          {SERVICES.map((s) => (
            <div key={s.label} data-testid={`service-item-${s.label.toLowerCase().replace(/\s+/g, "-")}`} className="flex flex-col items-center text-center gap-6 group">
              <span className="font-heading font-bold text-xl text-[#2b2b2b]">{s.label}</span>
              {s.image ? (
                <img src={s.image} alt={s.label} className="w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-110" />
              ) : (
                <span className="w-28 h-28 rounded-full bg-[#F5A742] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <s.icon size={52} strokeWidth={1.6} className="text-white" />
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const VALUES = [
  { img: "/images/value_3.png", text: "Best services and best product for customer satisfaction." },
  { img: "/images/value_4.png", text: "Obey the rules comply to the company regulation." },
  { img: "/images/value_2.png", text: "Halal for every food standard process, delivery equipment, procurement of goods and service." },
  { img: "/images/value_1.png", text: "Working with honest, disciplined and responsible attitudes." },
];

export const Values = () => (
  <section id="value" data-testid="values-section" className="bg-white">
    <div className="h-8 bg-[#F5A742]" />
    <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
      <h2 data-testid="values-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] text-center mb-16">
        OUR VALUE
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {VALUES.map((v, i) => (
          <div key={i} data-testid={`value-card-${i + 1}`} className="group">
            <div className="relative">
              <span className="absolute top-0 left-0 bg-[#F5A742] text-white font-heading font-bold text-2xl w-14 h-14 flex items-center justify-center z-10">
                {i + 1}
              </span>
              <img src={v.img} alt={`Value ${i + 1}`} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
            </div>
            <p className="mt-5 text-lg text-[#2b2b2b] leading-relaxed">{v.text}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
