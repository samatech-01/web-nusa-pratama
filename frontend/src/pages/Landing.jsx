import { useEffect, useState } from "react";
import axios from "axios";
import { Navbar } from "@/components/landing/Navbar";
import { Hero, Introduction, VisionMission } from "@/components/landing/HeroIntro";
import { Services, Values } from "@/components/landing/ServicesValues";
import { FoodProcess, GeneralSupply } from "@/components/landing/ProcessSupply";
import { Logistic, Contact, Footer } from "@/components/landing/LogisticContact";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export default function Landing() {
  const [content, setContent] = useState({ services: [], settings: {} });

  useEffect(() => {
    axios.get(`${API}/content`).then((res) => setContent(res.data)).catch(() => {});
  }, []);

  return (
    <div data-testid="landing-page" className="font-body text-[#2b2b2b] antialiased">
      <Navbar />
      <Hero />
      <Introduction nibImageUrl={content.settings?.nib_image_url} />
      <VisionMission />
      <Services services={content.services} />
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
