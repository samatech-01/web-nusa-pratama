import { Package, Warehouse, Truck, HeartHandshake, MapPin, Mail, Phone } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const STEP_ICONS = [Package, Warehouse, Truck, HeartHandshake];

export const Logistic = () => {
  const { t } = useLanguage();
  return (
    <section id="logistic" data-testid="logistic-section" className="relative overflow-hidden">
      <div className="absolute inset-0">
        <img src="/images/boxes_bg.png" alt="" className="w-full h-1/2 object-cover" />
        <div className="absolute bottom-0 w-full h-1/2 bg-[#F5A742]" />
      </div>
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 py-24">
        <h2 data-testid="logistic-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-white text-center mb-20 drop-shadow-lg">
          {t("logistic_heading")}
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
          {STEP_ICONS.map((Icon, i) => (
            <div key={i} data-testid={`logistic-step-${i + 1}`} className="flex flex-col items-center text-center gap-8">
              <span className="w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white shadow-xl flex items-center justify-center">
                <Icon size={64} strokeWidth={1.3} className="text-[#F5A742]" />
              </span>
              <p className="text-white text-base sm:text-lg leading-relaxed max-w-[260px]">{t(`logistic_${i + 1}`)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Contact = () => {
  const { t } = useLanguage();
  return (
    <section id="contact" data-testid="contact-section" className="bg-white py-24">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 grid md:grid-cols-2 gap-16 items-center">
        <div>
          <h2 data-testid="contact-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] mb-10">
            {t("contact_heading")}
          </h2>
          <div className="space-y-6 text-lg text-[#2b2b2b]">
            <div className="flex gap-4 items-start" data-testid="contact-address">
              <MapPin className="text-[#F5A742] mt-1 shrink-0" size={24} />
              <p className="leading-relaxed">
                Jalan Pattimura Perumahan Sosial Blok 02 Nomor 39<br />
                Desa/Kelurahan Batu Ampar<br />
                Kecamatan Balikpapan Utara<br />
                Kota Balikpapan<br />
                Provinsi Kalimantan Timur
              </p>
            </div>
            <div className="flex gap-4 items-center" data-testid="contact-email">
              <Mail className="text-[#F5A742] shrink-0" size={24} />
              <a href="mailto:pt.nusapratamasolution@gmail.com" className="hover:text-[#F5A742] transition-colors break-all">
                pt.nusapratamasolution@gmail.com
              </a>
            </div>
            <div className="flex gap-4 items-center" data-testid="contact-phone">
              <Phone className="text-[#F5A742] shrink-0" size={24} />
              <a href="tel:+6282253706473" className="hover:text-[#F5A742] transition-colors">
                +62 8225 370 6473
              </a>
            </div>
          </div>
          <img src="/images/qr_code.png" alt="QR code" data-testid="contact-qr" className="mt-10 w-32 h-32" />
        </div>
        <div className="flex justify-center">
          <img src="/images/logo_full.png" alt="Nusa Pratama Solution" className="w-full max-w-md" />
        </div>
      </div>
    </section>
  );
};

export const Footer = () => {
  const { t } = useLanguage();
  return (
    <footer data-testid="footer" className="bg-[#2b2b2b] text-white/80 py-6">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm">
        <p>© {new Date().getFullYear()} PT Nusa Pratama Solution. {t("footer_rights")}</p>
        <p className="tracking-widest font-heading">CATERING • GENERAL SUPPLY • LOGISTICS • HVAC</p>
      </div>
    </footer>
  );
};
