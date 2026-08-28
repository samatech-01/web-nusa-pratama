import { Navbar } from "@/components/landing/Navbar";
import { Hero, Introduction, VisionMission } from "@/components/landing/HeroIntro";
import { Services, Values } from "@/components/landing/ServicesValues";
import { FoodProcess, GeneralSupply } from "@/components/landing/ProcessSupply";
import { Logistic, Contact, Footer } from "@/components/landing/LogisticContact";

export default function Landing() {
  return (
    <div data-testid="landing-page" className="font-body text-[#2b2b2b] antialiased">
      <Navbar />
      <Hero />
      <Introduction />
      <VisionMission />
      <Services />
      <Values />
      <FoodProcess />
      <GeneralSupply />
      <Logistic />
      <Contact />
      <Footer />
    </div>
  );
}
