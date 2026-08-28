import { Utensils, ShieldCheck, RefreshCw, TestTube } from "lucide-react";

const PROCESS_LEFT = [
  {
    title: "Test Food",
    icon: Utensils,
    text: "Agreed menu will be tested by representative client at main kitchen prior recipes standardization and calories measurement.",
  },
  {
    title: "Cycle Food",
    icon: RefreshCw,
    text: "The menu will be changed everyday.",
  },
];

const PROCESS_RIGHT = [
  {
    title: "Safety Food Control",
    icon: ShieldCheck,
    text: "Every single served menu has passed food safety supervision referring to HACCP application. Food safety samples will be available for client and the company.",
  },
  {
    title: "Laboratory Sampling",
    icon: TestTube,
    text: "Random sample food will be tested in the laboratory every 3 months.",
  },
];

const ProcessItem = ({ item, reverse }) => (
  <div data-testid={`process-item-${item.title.toLowerCase().replace(/\s+/g, "-")}`} className={`flex gap-6 items-start ${reverse ? "flex-row-reverse text-right" : ""}`}>
    <span className="shrink-0 w-24 h-24 border-2 border-[#F5A742] flex items-center justify-center">
      <item.icon size={44} strokeWidth={1.5} className="text-[#F5A742]" />
    </span>
    <div>
      <h3 className="font-heading font-bold text-xl text-[#2b2b2b] mb-2">{item.title}</h3>
      <p className="text-[#2b2b2b] leading-relaxed">{item.text}</p>
    </div>
  </div>
);

export const FoodProcess = () => (
  <section id="process" data-testid="food-process-section" className="relative bg-white py-24 overflow-hidden">
    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-[#F5A742] hidden xl:block" />
    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-2/3 bg-[#F5A742] hidden xl:block" />
    <div className="max-w-7xl mx-auto px-6 lg:px-16">
      <h2 data-testid="food-process-heading" className="font-heading font-extrabold text-4xl sm:text-5xl text-[#F5A742] text-center mb-20">
        STANDARD FOOD PROCESS
      </h2>
      <div className="grid lg:grid-cols-[1fr_auto_1fr] gap-12 items-center">
        <div className="space-y-16 order-2 lg:order-1">
          <ProcessItem item={PROCESS_LEFT[0]} reverse />
          <ProcessItem item={PROCESS_LEFT[1]} reverse />
        </div>
        <div className="order-1 lg:order-2 mx-auto">
          <img src="/images/food_trays.png" alt="Standard food trays" className="w-full max-w-sm shadow-lg" />
          <div className="h-4 bg-[#F5A742] max-w-sm" />
        </div>
        <div className="space-y-16 order-3">
          <ProcessItem item={PROCESS_RIGHT[0]} />
          <ProcessItem item={PROCESS_RIGHT[1]} />
        </div>
      </div>
    </div>
  </section>
);

export const GeneralSupply = () => (
  <section id="general-supply" data-testid="general-supply-section" className="relative min-h-[560px] flex items-center overflow-hidden">
    <img src="/images/warehouse.png" alt="Warehouse" className="absolute inset-0 w-full h-full object-cover" />
    <div className="relative max-w-7xl mx-auto px-6 lg:px-10 w-full flex justify-center lg:justify-end py-20">
      <div data-testid="general-supply-card" className="bg-[#F5A742]/95 text-white p-10 sm:p-14 max-w-xl shadow-2xl">
        <h2 className="font-heading font-extrabold text-4xl sm:text-5xl mb-6">GENERAL SUPPLY</h2>
        <p className="text-lg leading-relaxed">
          Is a process of activities for the fulfillment or provision of the
          needs and supply of goods under contract or direct purchase to meet
          the needs of the business, with the aim of obtaining goods at an
          accountable price, the appropriate amount and quality and the
          procurement on time.
        </p>
      </div>
    </div>
  </section>
);
