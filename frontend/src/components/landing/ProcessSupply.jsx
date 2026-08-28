import { Utensils, ShieldCheck, RefreshCw, TestTube } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const ProcessItem = ({ icon: Icon, title, text, reverse }) => (
  <div data-testid={`process-item-${title.toLowerCase().replace(/\s+/g, "-")}`} className={`flex gap-6 items-start ${reverse ? "flex-row-reverse text-right" : ""}`}>
    <span className="shrink-0 w-24 h-24 border-2 border-[#F5A742] flex items-center justify-center">
      <Icon size={44} strokeWidth={1.5} className="text-[#F5A742]" />
    </span>
    <div>
      <h3 className="font-heading font-bold text-xl text-[#2b2b2b] mb-2">{title}</h3>
      <p className="text-[#2b2b2b] leading-relaxed">{text}</p>
    </div>
  </div>
);

export const FoodProcess = () => {
  const { t } = useLanguage();
  return (
    <section id="process" data-testid="food-process-section" className="relative bg-white py-24 overflow-hidden">
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-[#F5A742] hidden xl:block" />
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-[#F5A742] hidden xl:block" />
      <div className="max-w-7xl mx-auto px-6 lg:px-16">
        <h2 data-testid="food-process-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] text-center mb-20">
          {t("process_heading")}
        </h2>
        <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
          <div className="space-y-16 order-2 lg:order-1">
            <ProcessItem icon={Utensils} title={t("process_test_title")} text={t("process_test_text")} reverse />
            <ProcessItem icon={RefreshCw} title={t("process_cycle_title")} text={t("process_cycle_text")} reverse />
          </div>
          <div className="order-1 lg:order-2 mx-auto">
            <img src="/images/food_trays.png" alt="Standard food trays" className="w-full max-w-sm shadow-lg" />
            <div className="h-4 bg-[#F5A742] max-w-sm" />
          </div>
          <div className="space-y-16 order-3">
            <ProcessItem icon={ShieldCheck} title={t("process_safety_title")} text={t("process_safety_text")} />
            <ProcessItem icon={TestTube} title={t("process_lab_title")} text={t("process_lab_text")} />
          </div>
        </div>
      </div>
    </section>
  );
};

export const GeneralSupply = () => {
  const { t } = useLanguage();
  return (
    <section id="general-supply" data-testid="general-supply-section" className="relative min-h-[560px] flex items-center overflow-hidden">
      <img src="/images/warehouse.png" alt="Warehouse" className="absolute inset-0 w-full h-full object-cover" />
      <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full flex justify-center lg:justify-end py-20">
        <div data-testid="general-supply-card" className="bg-[#F5A742]/95 text-white p-10 sm:p-14 max-w-xl shadow-2xl">
          <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-6">{t("supply_heading")}</h2>
          <p className="text-lg leading-relaxed">{t("supply_text")}</p>
        </div>
      </div>
    </section>
  );
};
