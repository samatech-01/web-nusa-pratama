import { useState } from "react";
import { Link } from "react-router-dom";
import { HandPlatter, Package, Truck, Wind, Briefcase, ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Robust mapping for service keys
const getServiceIcon = (key = "") => {
  const normalizedKey = key.toLowerCase().replace(/[-_]/g, "");
  if (normalizedKey.includes("cater") || normalizedKey.includes("katering")) return HandPlatter;
  if (normalizedKey.includes("supply") || normalizedKey.includes("general")) return Package;
  if (normalizedKey.includes("logistic") || normalizedKey.includes("logistik")) return Truck;
  if (normalizedKey.includes("hvac") || normalizedKey.includes("ac")) return Wind;
  return Briefcase;
};

export const Services = ({ services = [] }) => {
  const { lang, t } = useLanguage();
  const [hvacImageError, setHvacImageError] = useState(false);

  return (
    <section id="services" data-testid="services-section" className="relative py-28 overflow-hidden">
      <img src="/images/building_bg.png" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-[#fdf3df]/40" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid lg:grid-cols-[300px_1fr] shadow-2xl">
          <div className="bg-[#F5A742] flex items-center justify-center py-14 px-8">
            <h2 data-testid="services-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-white leading-tight">
              {t("services_heading_1")}<br />{t("services_heading_2")}
            </h2>
          </div>
          <div className="bg-white py-16 px-8 sm:px-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 items-start">
              {services.map((s) => {
                const isHvac = (s.key || "").toLowerCase().includes("hvac");
                const Icon = getServiceIcon(s.key);
                const label = lang === "id" ? s.label_id || s.label : s.label;

                return (
                  <Link
                    key={s.key}
                    to={`/services/${s.key}`}
                    data-testid={`service-item-${s.key}`}
                    className="flex flex-col items-center text-center gap-5 group cursor-pointer"
                  >
                    <span className="font-heading font-bold text-xl text-[#2b2b2b] group-hover:text-[#F5A742] transition-colors">
                      {label}
                    </span>
                    <span className="w-28 h-28 rounded-full bg-[#F5A742] flex items-center justify-center transition-transform duration-300 group-hover:scale-110 shadow-md overflow-hidden relative">
                      {isHvac && !hvacImageError ? (
                        <img
                          src="/images/hvac_logo.png"
                          alt={label}
                          onError={() => setHvacImageError(true)}
                          className="w-full h-full object-cover scale-[1.12]"
                        />
                      ) : (
                        Icon && <Icon size={52} strokeWidth={1.6} className="text-white" />
                      )}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#F5A742] group-hover:text-[#e0942f] transition-all transform group-hover:translate-x-1">
                      <span>{lang === "id" ? "Lihat Detail" : "View Details"}</span>
                      <ArrowRight size={13} />
                    </span>
                  </Link>
                );
              })}
            </div>
            <p className="text-center text-sm text-[#9a9a9a] mt-10">
              {lang === "id" ? "Klik ikon layanan untuk informasi dan spesifikasi detail" : t("services_hint")}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

const VALUE_IMAGES = ["/images/value_3.png", "/images/value_4.png", "/images/value_2.png", "/images/value_1.png"];

export const Values = () => {
  const { t } = useLanguage();
  return (
    <section id="value" data-testid="values-section" className="bg-white">
      <div className="h-8 bg-[#F5A742]" />
      <div className="max-w-7xl mx-auto px-6 lg:px-10 py-20">
        <h2 data-testid="values-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] text-center mb-16">
          {t("values_heading")}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {VALUE_IMAGES.map((img, i) => (
            <div key={i} data-testid={`value-card-${i + 1}`} className="group">
              <div className="relative">
                <span className="absolute top-0 left-0 bg-[#F5A742] text-white font-heading font-bold text-2xl w-14 h-14 flex items-center justify-center z-10">
                  {i + 1}
                </span>
                <img src={img} alt={`Value ${i + 1}`} className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-[1.02]" />
              </div>
              <p className="mt-5 text-lg text-[#2b2b2b] leading-relaxed">{t(`value_${i + 1}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
