import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    nav_home: "Home",
    nav_about: "About",
    nav_vision: "Vision & Mission",
    nav_services: "Services",
    nav_value: "Our Value",
    nav_contact: "Contact",
    nav_cta: "Get in Touch",
    hero_tagline: "COMPANY PROFILE",
    hero_scroll: "Scroll to explore ↓",
    intro_heading: "INTRODUCTION",
    intro_p1: "PT Nusa Pratama Solution is a national growing company with the business of catering, general supply and logistic services.",
    intro_p2: "Ready to serve both national and international scale of industrial sectors, mining, gas and oil company, offices, and any other event and functions needed by our customer (client).",
    vision_heading: "VISION",
    vision_text: "To be the best catering, general supply, and logistic services company.",
    mission_heading: "MISSION",
    mission_1: "To provide excellent services.",
    mission_2: "To produce halal, safe and healthy products.",
    mission_3: "Prompt response to customer complaints.",
    mission_4: "Continues improvement in order to deliver best quality products.",
    services_heading_1: "OUR",
    services_heading_2: "SERVICES",
    services_hint: "Click an icon for details",
    modal_gallery: "Documentation Gallery",
    modal_customers: "Customers We Have Served",
    values_heading: "OUR VALUE",
    value_1: "Best services and best product for customer satisfaction.",
    value_2: "Obey the rules comply to the company regulation.",
    value_3: "Halal for every food standard process, delivery equipment, procurement of goods and service.",
    value_4: "Working with honest, disciplined and responsible attitudes.",
    process_heading: "STANDARD FOOD PROCESS",
    process_test_title: "Test Food",
    process_test_text: "Agreed menu will be tested by representative client at main kitchen prior recipes standardization and calories measurement.",
    process_cycle_title: "Cycle Food",
    process_cycle_text: "The menu will be changed everyday.",
    process_safety_title: "Safety Food Control",
    process_safety_text: "Every single served menu has passed food safety supervision referring to HACCP application. Food safety samples will be available for client and the company.",
    process_lab_title: "Laboratory Sampling",
    process_lab_text: "Random sample food will be tested in the laboratory every 3 months.",
    supply_heading: "GENERAL SUPPLY",
    supply_text: "Is a process of activities for the fulfillment or provision of the needs and supply of goods under contract or direct purchase to meet the needs of the business, with the aim of obtaining goods at an accountable price, the appropriate amount and quality and the procurement on time.",
    logistic_heading: "LOGISTIC",
    logistic_1: "The package is handed over to our retail shipping services.",
    logistic_2: "The package will be sorted by the type of goods and delivery area.",
    logistic_3: "The courier will send the package safely until destination.",
    logistic_4: "Package is accepted by the receiver on time.",
    contact_heading: "CONTACT US",
    footer_rights: "All rights reserved.",
    wa_tooltip: "Chat with us on WhatsApp",
  },
  id: {
    nav_home: "Beranda",
    nav_about: "Tentang",
    nav_vision: "Visi & Misi",
    nav_services: "Layanan",
    nav_value: "Nilai Kami",
    nav_contact: "Kontak",
    nav_cta: "Hubungi Kami",
    hero_tagline: "PROFIL PERUSAHAAN",
    hero_scroll: "Gulir untuk menjelajah ↓",
    intro_heading: "PENDAHULUAN",
    intro_p1: "PT Nusa Pratama Solution adalah perusahaan nasional yang terus berkembang dengan bidang usaha katering, general supply, dan jasa logistik.",
    intro_p2: "Siap melayani skala nasional maupun internasional untuk sektor industri, pertambangan, perusahaan migas, perkantoran, serta berbagai acara dan kegiatan yang dibutuhkan oleh pelanggan (klien) kami.",
    vision_heading: "VISI",
    vision_text: "Menjadi perusahaan katering, general supply, dan jasa logistik terbaik.",
    mission_heading: "MISI",
    mission_1: "Memberikan pelayanan yang prima.",
    mission_2: "Menghasilkan produk yang halal, aman, dan sehat.",
    mission_3: "Tanggap dalam merespon keluhan pelanggan.",
    mission_4: "Perbaikan berkelanjutan untuk menghadirkan produk dengan kualitas terbaik.",
    services_heading_1: "LAYANAN",
    services_heading_2: "KAMI",
    services_hint: "Klik ikon untuk melihat detail",
    modal_gallery: "Galeri Dokumentasi",
    modal_customers: "Pelanggan yang Pernah Kami Layani",
    values_heading: "NILAI KAMI",
    value_1: "Pelayanan dan produk terbaik demi kepuasan pelanggan.",
    value_2: "Taat aturan dan patuh pada regulasi perusahaan.",
    value_3: "Halal dalam setiap proses standar makanan, peralatan pengiriman, pengadaan barang dan jasa.",
    value_4: "Bekerja dengan sikap jujur, disiplin, dan bertanggung jawab.",
    process_heading: "STANDAR PROSES MAKANAN",
    process_test_title: "Uji Makanan",
    process_test_text: "Menu yang disepakati akan diuji oleh perwakilan klien di dapur utama sebelum standarisasi resep dan pengukuran kalori.",
    process_cycle_title: "Siklus Menu",
    process_cycle_text: "Menu akan diganti setiap hari.",
    process_safety_title: "Kontrol Keamanan Pangan",
    process_safety_text: "Setiap menu yang disajikan telah lolos pengawasan keamanan pangan mengacu pada penerapan HACCP. Sampel keamanan pangan tersedia untuk klien dan perusahaan.",
    process_lab_title: "Sampling Laboratorium",
    process_lab_text: "Sampel makanan acak akan diuji di laboratorium setiap 3 bulan.",
    supply_heading: "GENERAL SUPPLY",
    supply_text: "Merupakan proses kegiatan pemenuhan atau penyediaan kebutuhan dan pasokan barang berdasarkan kontrak maupun pembelian langsung untuk memenuhi kebutuhan bisnis, dengan tujuan memperoleh barang dengan harga yang akuntabel, jumlah dan kualitas yang tepat, serta pengadaan yang tepat waktu.",
    logistic_heading: "LOGISTIK",
    logistic_1: "Paket diserahkan ke jasa pengiriman ritel kami.",
    logistic_2: "Paket akan disortir berdasarkan jenis barang dan area pengiriman.",
    logistic_3: "Kurir akan mengirim paket dengan aman sampai tujuan.",
    logistic_4: "Paket diterima oleh penerima tepat waktu.",
    contact_heading: "HUBUNGI KAMI",
    footer_rights: "Hak cipta dilindungi.",
    wa_tooltip: "Chat dengan kami di WhatsApp",
  },
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem("np_lang") || "id");
  const toggle = () => {
    const next = lang === "id" ? "en" : "id";
    setLang(next);
    localStorage.setItem("np_lang", next);
  };
  const t = (key) => translations[lang][key] || key;
  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
