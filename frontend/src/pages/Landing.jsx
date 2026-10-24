import { useEffect, useState } from "react";
import axios from "axios";
import { API } from "@/config";
import { DEFAULT_SERVICES } from "@/data/defaultServices";
import { Navbar } from "@/components/landing/Navbar";
import { Hero, Introduction, VisionMission } from "@/components/landing/HeroIntro";
import { Services, Values } from "@/components/landing/ServicesValues";
import { FoodProcess, GeneralSupply } from "@/components/landing/ProcessSupply";
import { Logistic, Contact, Footer } from "@/components/landing/LogisticContact";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

export default function Landing() {
  const [content, setContent] = useState({
    services: DEFAULT_SERVICES,
    settings: { nib_image_url: "/images/legal_nib.png" },
  });

  useEffect(() => {
    let isMounted = true;
    axios
      .get(`${API}/content`)
      .then((res) => {
        if (isMounted && res.data && res.data.services && res.data.services.length > 0) {
          setContent(res.data);
        }
      })
      .catch((err) => {
        console.warn("Koneksi API backend tidak tersedia, menggunakan data default lokal.", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div data-testid="landing-page" className="font-body text-[#2b2b2b] antialiased">
      <Navbar />
      <Hero />
      <Introduction nibImageUrl={content.settings?.nib_image_url} />
      <VisionMission />
      <Services services={content.services && content.services.length > 0 ? content.services : DEFAULT_SERVICES} />
      <Values />
      <FoodProcess />
      <GeneralSupply />
      <Logistic />
      <Contact />
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
