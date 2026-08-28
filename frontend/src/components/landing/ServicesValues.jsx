import { useState, useEffect } from "react";
import { HandPlatter, Package, Truck, Users, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const resolveUrl = (url) => (url && url.startsWith("/api/") ? `${BACKEND_URL}${url}` : url);

const ICONS = { catering: HandPlatter, "general-supply": Package, logistics: Truck };

const ServiceModal = ({ service, onClose }) => {
  const { lang, t } = useLanguage();

  useEffect(() => {
    if (!service) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [service, onClose]);

  if (!service) return null;
  const description = lang === "id" ? service.description_id : service.description_en;
  const label = lang === "id" ? service.label_id || service.label : service.label;
  return (
    <div
      data-testid="service-detail-modal"
      className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-3xl w-full max-h-[88vh] overflow-y-auto rounded-lg shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#F5A742] text-white px-8 py-5 flex items-center justify-between z-10">
          <h3 data-testid="service-modal-title" className="font-heading font-extrabold text-2xl sm:text-3xl">{label}</h3>
          <button data-testid="service-modal-close" onClick={onClose} className="p-1 hover:bg-white/20 rounded-full transition-colors" aria-label="Close">
            <X size={26} />
          </button>
        </div>
        <div className="p-8">
          <p data-testid="service-modal-description" className="text-[#2b2b2b] text-lg leading-relaxed mb-8">{description}</p>
          {service.gallery?.length > 0 && (
            <>
              <h4 className="font-heading font-bold text-xl text-[#F5A742] mb-4">{t("modal_gallery")}</h4>
              <div data-testid="service-modal-gallery" className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {service.gallery.map((url, i) => (
                  <img key={i} src={resolveUrl(url)} alt={`${label} ${i + 1}`} loading="lazy" className="w-full aspect-[3/2] object-cover rounded shadow bg-gray-100" />
                ))}
              </div>
            </>
          )}
          {service.customers?.length > 0 && (
            <>
              <h4 className="font-heading font-bold text-xl text-[#F5A742] mb-4 flex items-center gap-2">
                <Users size={22} /> {t("modal_customers")}
              </h4>
              <ul data-testid="service-modal-customers" className="space-y-3">
                {service.customers.map((c, i) => (
                  <li key={i} className="flex gap-3 text-[#2b2b2b] text-base leading-relaxed">
                    <span className="text-[#F5A742] font-bold mt-0.5">✓</span>
                    {c}
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export const Services = ({ services = [] }) => {
  const { lang, t } = useLanguage();
  const [selected, setSelected] = useState(null);
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
                const Icon = ICONS[s.key];
                const label = lang === "id" ? s.label_id || s.label : s.label;
                return (
                  <button
                    key={s.key}
                    data-testid={`service-item-${s.key}`}
                    onClick={() => setSelected(s)}
                    className="flex flex-col items-center text-center gap-6 group cursor-pointer"
                  >
                    <span className="font-heading font-bold text-xl text-[#2b2b2b] group-hover:text-[#F5A742] transition-colors">{label}</span>
                    {s.key === "hvac" ? (
                      <img src="/images/hvac_logo.png" alt={label} className="w-28 h-28 object-contain transition-transform duration-300 group-hover:scale-110" />
                    ) : (
                      <span className="w-28 h-28 rounded-full bg-[#F5A742] flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        {Icon && <Icon size={52} strokeWidth={1.6} className="text-white" />}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            <p className="text-center text-sm text-[#9a9a9a] mt-10">{t("services_hint")}</p>
          </div>
        </div>
      </div>
      <ServiceModal service={selected} onClose={() => setSelected(null)} />
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
