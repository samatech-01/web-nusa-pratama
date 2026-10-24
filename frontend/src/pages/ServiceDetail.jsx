import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  Clock,
  Award,
  Sparkles,
  ChevronRight,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { API, resolveUrl } from "@/config";
import { DEFAULT_SERVICES } from "@/data/defaultServices";
import { Navbar } from "@/components/landing/Navbar";
import { Footer } from "@/components/landing/LogisticContact";
import { WhatsAppButton } from "@/components/landing/WhatsAppButton";

// Feature highlights based on service key
const SERVICE_FEATURES = {
  catering: [
    {
      title_id: "Standar Keamanan Pangan HACCP",
      title_en: "HACCP Food Safety Standards",
      desc_id: "Seluruh pengolahan makanan disupervisi ketat sesuai protokol Hazard Analysis Critical Control Point.",
      desc_en: "All food preparation is strictly supervised following HACCP protocols.",
    },
    {
      title_id: "Uji Laboratorium Berkala 3 Bulan",
      title_en: "Quarterly Laboratory Testing",
      desc_id: "Pengambilan sampel makanan secara acak diuji di laboratorium independen setiap 3 bulan demi jaminan higienitas.",
      desc_en: "Random food samples tested in an independent lab every 3 months for hygiene assurance.",
    },
    {
      title_id: "Siklus Menu Berganti Setiap Hari",
      title_en: "Daily Rotating Menu Cycles",
      desc_id: "Menu variatif dan bergizi seimbang, berganti setiap hari agar karyawan tidak merasa jenuh.",
      desc_en: "Diverse, nutritious menus rotating daily to ensure employee satisfaction.",
    },
    {
      title_id: "100% Halal & Bahan Segar",
      title_en: "100% Halal & Fresh Ingredients",
      desc_id: "Hanya menggunakan bahan pangan segar berkualitas dari pemasok bersertifikasi halal resmi.",
      desc_en: "Exclusively using fresh, quality ingredients from certified halal suppliers.",
    },
  ],
  "general-supply": [
    {
      title_id: "Harga Akuntabel & Transparan",
      title_en: "Accountable & Transparent Pricing",
      desc_id: "Memberikan penawaran harga terbaik yang transparan dan dapat dipertanggungjawabkan dalam audit korporat.",
      desc_en: "Providing transparent and accountable pricing suitable for corporate audits.",
    },
    {
      title_id: "Jaminan Kualitas & Standar K3",
      title_en: "Quality Assurance & OHS Standards",
      desc_id: "Seluruh peralatan kerja dan safety wear (PPE) berstandar SNI dan standar keselamatan industri migas/tambang.",
      desc_en: "All equipment and PPE meet national and international mining/oil safety standards.",
    },
    {
      title_id: "Pengadaan Tepat Waktu (On-Time)",
      title_en: "On-Time Procurement",
      desc_id: "Sistem logistik dan rantai pasok terintegrasi memastikan barang sampai di lokasi sesuai jadwal proyek.",
      desc_en: "Integrated supply chain ensures goods arrive at project sites on schedule.",
    },
    {
      title_id: "Fleksibilitas Kontrak & Pembelian",
      title_en: "Flexible Contracts & Direct Orders",
      desc_id: "Melayani kontrak jangka panjang maupun pengadaan langsung (*spot order*) sesuai kebutuhan operasional.",
      desc_en: "Supporting long-term contracts as well as direct purchase orders as needed.",
    },
  ],
  logistics: [
    {
      title_id: "Sortasi Akurat Berbasis Area",
      title_en: "Accurate Area-Based Sorting",
      desc_id: "Penyortiran paket teliti berdasarkan jenis barang, urgensi, dan zonasi area pengiriman.",
      desc_en: "Meticulous package sorting based on item category, urgency, and destination zones.",
    },
    {
      title_id: "Armada Pengiriman Siap Site",
      title_en: "Site-Ready Delivery Fleet",
      desc_id: "Armada transportasi yang terawat siap menjangkau medan perkotaan hingga pelosok site pertambangan.",
      desc_en: "Well-maintained fleet ready to reach urban areas as well as remote mining sites.",
    },
    {
      title_id: "Keamanan Paket Maksimal",
      title_en: "Maximum Package Security",
      desc_id: "Protokol pengamanan fisik dan kurir berdedikasi menjaga integritas barang sampai di tangan penerima.",
      desc_en: "Physical security protocols and dedicated couriers protect package integrity until handover.",
    },
    {
      title_id: "Bukti Serah Terima Resmi (POD)",
      title_en: "Proof of Delivery (POD)",
      desc_id: "Pencatatan real-time dan tanda terima sah untuk setiap paket yang diserahkan.",
      desc_en: "Real-time recording and authorized proof of delivery for every package.",
    },
  ],
  hvac: [
    {
      title_id: "Instalasi AC Komersial & Industri",
      title_en: "Commercial & Industrial Installation",
      desc_id: "Pemasangan sistem VRV/VRF, Split Duct, Chiller, dan AC Cassette untuk gedung kantor dan pabrik.",
      desc_en: "Expert installation of VRV/VRF, Split Duct, Chillers, and Cassette ACs for buildings and facilities.",
    },
    {
      title_id: "Perawatan Rooftop AHU & Ventilasi",
      title_en: "Rooftop AHU & Ventilation Maintenance",
      desc_id: "Servis berkala sistem tata udara sentral, pembersihan filter, dan pengecekan tekanan refrigeran.",
      desc_en: "Regular servicing of central air handlers, filter cleaning, and refrigerant pressure checks.",
    },
    {
      title_id: "Teknisi Tersertifikasi & Berpengalaman",
      title_en: "Certified & Experienced Technicians",
      desc_id: "Dikerjakan oleh teknisi ahli yang terlatih standar keselamatan kerja (K3) industri.",
      desc_en: "Handled by skilled technicians trained in industrial safety and technical standards.",
    },
    {
      title_id: "Efisiensi Energi & Respon Cepat",
      title_en: "Energy Efficiency & Rapid Response",
      desc_id: "Optimalisasi konsumsi listrik pendingin dan kesiapan tanggap darurat untuk gangguan sistem pendingin.",
      desc_en: "Cooling power optimization and emergency support for system breakdowns.",
    },
  ],
};

// Workflows
const WORKFLOWS = [
  {
    step: "01",
    title_id: "Konsultasi & Kebutuhan",
    title_en: "Consultation & Scope",
    desc_id: "Diskusikan kebutuhan spesifik, jadwal, dan estimasi kapasitas bersama tim konsultan kami.",
    desc_en: "Discuss your project scope, timeline, and capacity requirements with our consultants.",
  },
  {
    step: "02",
    title_id: "Survei & Penawaran Resmi",
    title_en: "Survey & Quotation",
    desc_id: "Survei lokasi (jika diperlukan) dan penerbitan proposal teknis serta komersial yang akuntabel.",
    desc_en: "Site survey (if required) followed by an accountable commercial and technical proposal.",
  },
  {
    step: "03",
    title_id: "Eksekusi Berstandar K3",
    title_en: "Execution & Safety",
    desc_id: "Pelaksanaan layanan oleh tim terlatih dengan kepatuhan penuh terhadap standar mutu dan keselamatan.",
    desc_en: "Service delivery by trained personnel adhering strictly to quality and safety standards.",
  },
  {
    step: "04",
    title_id: "Quality Control & Evaluasi",
    title_en: "Quality Control & Review",
    desc_id: "Monitoring berkelanjutan, laporan berkala, dan penanganan feedback secara tanggap.",
    desc_en: "Continuous monitoring, regular reports, and prompt handling of client feedback.",
  },
];

export default function ServiceDetail() {
  const { serviceKey } = useParams();
  const { lang, t } = useLanguage();

  const [allServices, setAllServices] = useState(DEFAULT_SERVICES);
  const [service, setService] = useState(null);
  const [activePhoto, setActivePhoto] = useState(null);

  useEffect(() => {
    // Scroll to top when page opens or parameter changes
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Fetch from backend, fallback to default
    axios
      .get(`${API}/content`)
      .then((res) => {
        if (res.data?.services?.length > 0) {
          setAllServices(res.data.services);
        }
      })
      .catch(() => {
        // Keep using DEFAULT_SERVICES
      });
  }, [serviceKey]);

  useEffect(() => {
    if (!serviceKey) return;
    const found = allServices.find(
      (s) => s.key.toLowerCase() === serviceKey.toLowerCase()
    );
    if (found) {
      setService(found);
    } else {
      // If service key is not found, fallback to first service
      setService(allServices[0] || null);
    }
  }, [serviceKey, allServices]);

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center font-body text-[#2b2b2b]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#F5A742] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-semibold text-gray-500">Memuat detail layanan...</p>
        </div>
      </div>
    );
  }

  const label = lang === "id" ? service.label_id || service.label : service.label;
  const description = lang === "id" ? service.description_id : service.description_en;
  const features = SERVICE_FEATURES[service.key] || SERVICE_FEATURES.catering;
  const otherServices = allServices.filter((s) => s.key !== service.key);

  const whatsappMessage = encodeURIComponent(
    `Halo PT Nusa Pratama Solution, saya ingin konsultasi dan meminta informasi penawaran untuk layanan ${label}.`
  );

  return (
    <div className="min-h-screen bg-gray-50 font-body text-[#2b2b2b] antialiased">
      {/* Top Navbar */}
      <Navbar />

      {/* Hero Header Section */}
      <section className="relative pt-32 pb-20 bg-[#2b2b2b] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img src="/images/building_bg.png" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F5A742] opacity-10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 lg:px-10">
          {/* Breadcrumb & Back */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-gray-300 mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 hover:text-[#F5A742] transition-colors py-1 px-2.5 rounded bg-white/5 hover:bg-white/10"
            >
              <ArrowLeft size={16} />
              <span>{lang === "id" ? "Kembali ke Beranda" : "Back to Home"}</span>
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <Link to="/#services" className="hover:text-white transition-colors">
              {lang === "id" ? "Layanan Kami" : "Our Services"}
            </Link>
            <ChevronRight size={14} className="text-gray-500" />
            <span className="text-[#F5A742] font-semibold">{label}</span>
          </div>

          <div className="grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 bg-[#F5A742]/20 border border-[#F5A742] text-[#F5A742] px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
                <Sparkles size={14} />
                <span>PT Nusa Pratama Solution Service Portfolio</span>
              </div>
              <h1 className="font-heading font-extrabold text-4xl sm:text-5xl lg:text-6xl text-white leading-tight">
                {label}
              </h1>
              <p className="text-lg sm:text-xl text-gray-200 leading-relaxed max-w-3xl">
                {description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <a
                  href={`https://wa.me/628115444877?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 bg-[#F5A742] hover:bg-[#e0942f] text-white font-heading font-bold px-7 py-3.5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
                >
                  <MessageSquare size={18} />
                  <span>{lang === "id" ? "Konsultasi via WhatsApp" : "Consult via WhatsApp"}</span>
                </a>
                <a
                  href="mailto:pt.nusapratamasolution@gmail.com"
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-lg border border-white/20 transition-colors"
                >
                  <Mail size={18} />
                  <span>{lang === "id" ? "Kirim Email Resmi" : "Send Official Email"}</span>
                </a>
              </div>
            </div>

            {/* Quick Badge Box */}
            <div className="lg:col-span-4 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-6 sm:p-8 space-y-5 text-white">
              <h3 className="font-heading font-bold text-xl text-[#F5A742] border-b border-white/15 pb-3">
                {lang === "id" ? "Keunggulan Layanan" : "Key Strengths"}
              </h3>
              <div className="space-y-4 text-sm text-gray-200">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="text-[#F5A742] shrink-0 mt-0.5" size={20} />
                  <span>{lang === "id" ? "Kepatuhan Regulasi & Standar K3 Nasional" : "Full Compliance with Industrial OHS"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="text-[#F5A742] shrink-0 mt-0.5" size={20} />
                  <span>{lang === "id" ? "Respon Cepat & Layanan Berkelanjutan" : "Fast Response & Ongoing Service"}</span>
                </div>
                <div className="flex items-start gap-3">
                  <Award className="text-[#F5A742] shrink-0 mt-0.5" size={20} />
                  <span>{lang === "id" ? "Tenaga Kerja Terampil & Teruji" : "Skilled & Tested Workforce"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Details */}
      <main className="max-w-7xl mx-auto px-6 lg:px-10 py-20 space-y-24">
        {/* Section 1: Key Features / Scope */}
        <section className="space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl text-[#2b2b2b]">
              {lang === "id" ? "Spesifikasi & Standar Mutu" : "Specifications & Quality Standards"}
            </h2>
            <p className="text-gray-600 text-base sm:text-lg">
              {lang === "id"
                ? "Komitmen kami untuk memberikan kualitas terbaik, akuntabel, dan mengutamakan keselamatan kerja."
                : "Our commitment to delivering superior quality, transparency, and safety."}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-200/80 hover:shadow-md hover:border-[#F5A742] transition-all space-y-3"
              >
                <div className="w-10 h-10 rounded-lg bg-[#F5A742]/10 text-[#F5A742] font-bold flex items-center justify-center font-heading">
                  {idx + 1}
                </div>
                <h3 className="font-heading font-bold text-lg text-[#2b2b2b]">
                  {lang === "id" ? item.title_id : item.title_en}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === "id" ? item.desc_id : item.desc_en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 2: Photo Documentation Gallery */}
        {service.gallery?.length > 0 && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b pb-4">
              <div>
                <h2 className="font-heading font-extrabold text-3xl text-[#2b2b2b]">
                  {t("modal_gallery")}
                </h2>
                <p className="text-gray-500 text-sm mt-1">
                  {lang === "id"
                    ? "Dokumentasi visual aktivitas dan implementasi layanan di lapangan"
                    : "Visual documentation of our activities and on-site implementation"}
                </p>
              </div>
              <span className="text-sm font-semibold text-[#F5A742] bg-[#F5A742]/10 px-3 py-1 rounded-full">
                {service.gallery.length} {lang === "id" ? "Foto Dokumentasi" : "Photos"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {service.gallery.map((g, i) => {
                const caption =
                  (lang === "id" ? g.caption_id : g.caption_en) ||
                  g.caption_id ||
                  g.caption_en;
                return (
                  <div
                    key={i}
                    onClick={() => setActivePhoto(resolveUrl(g.url))}
                    className="group bg-white rounded-xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all cursor-pointer"
                  >
                    <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                      <img
                        src={resolveUrl(g.url)}
                        alt={caption || `${label} ${i + 1}`}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-medium text-sm gap-1.5">
                        <ExternalLink size={16} /> {lang === "id" ? "Perbesar Foto" : "View Photo"}
                      </div>
                    </div>
                    {caption && (
                      <div className="p-4">
                        <p className="text-sm text-gray-700 leading-snug line-clamp-2">
                          {caption}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section 3: Workflow / Standard Operating Procedure */}
        <section className="bg-white rounded-2xl p-8 sm:p-12 shadow-sm border border-gray-200">
          <div className="max-w-2xl mx-auto text-center space-y-3 mb-12">
            <h2 className="font-heading font-extrabold text-3xl text-[#2b2b2b]">
              {lang === "id" ? "Alur Kerjasama & Pelaksanaan" : "Workflow & Execution Steps"}
            </h2>
            <p className="text-gray-600 text-sm sm:text-base">
              {lang === "id"
                ? "Tahapan terstruktur untuk menjamin kepuasan klien dan kelancaran operasional bisnis Anda."
                : "A structured process to ensure client satisfaction and seamless business execution."}
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {WORKFLOWS.map((step, idx) => (
              <div key={idx} className="relative space-y-3">
                <span className="text-4xl font-extrabold font-heading text-[#F5A742]/40 block">
                  {step.step}
                </span>
                <h4 className="font-heading font-bold text-lg text-[#2b2b2b]">
                  {lang === "id" ? step.title_id : step.title_en}
                </h4>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {lang === "id" ? step.desc_id : step.desc_en}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: Customers We Have Served */}
        {service.customers?.length > 0 && (
          <section className="space-y-6">
            <div className="border-b pb-4">
              <h2 className="font-heading font-extrabold text-3xl text-[#2b2b2b]">
                {t("modal_customers")}
              </h2>
              <p className="text-gray-500 text-sm mt-1">
                {lang === "id"
                  ? "Klien dan sektor industri yang telah mempercayakan pengadaannya kepada kami"
                  : "Clients and industrial sectors that have trusted our capabilities"}
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {service.customers.map((c, i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl p-5 border border-gray-200/80 shadow-sm flex items-center gap-3.5"
                >
                  <div className="w-8 h-8 rounded-full bg-[#F5A742]/15 text-[#F5A742] flex items-center justify-center shrink-0">
                    <CheckCircle2 size={18} />
                  </div>
                  <span className="text-[#2b2b2b] font-medium text-sm sm:text-base leading-snug">
                    {c}
                  </span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section 5: Consultation CTA Banner */}
        <section className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#2b2b2b] to-[#3a3a3a] text-white p-8 sm:p-14 shadow-xl">
          <div className="relative z-10 max-w-3xl space-y-6">
            <h2 className="font-heading font-extrabold text-3xl sm:text-4xl leading-tight">
              {lang === "id"
                ? `Siap Mengoptimalkan Kebutuhan ${label} Perusahaan Anda?`
                : `Ready to Optimize Your Company's ${label} Needs?`}
            </h2>
            <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
              {lang === "id"
                ? "Hubungi perwakilan kami sekarang untuk mendapatkan survei lokasi, konsultasi teknis, dan surat penawaran harga terbaik."
                : "Contact our team now for site surveys, technical consultations, and our best formal quotation."}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a
                href={`https://wa.me/628115444877?text=${whatsappMessage}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#F5A742] hover:bg-[#e0942f] text-white font-heading font-bold px-8 py-3.5 rounded-lg shadow-lg transition-transform hover:-translate-y-0.5"
              >
                <Phone size={18} />
                <span>{lang === "id" ? "Hubungi Sekarang" : "Contact Now"}</span>
              </a>
              <Link
                to="/#contact"
                className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-medium px-6 py-3.5 rounded-lg border border-white/20 transition-colors"
              >
                <span>{lang === "id" ? "Lihat Alamat & Kontak" : "View Address & Contact"}</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Section 6: Other Services Navigation */}
        <section className="space-y-8 pt-8">
          <div className="flex items-center justify-between border-b pb-4">
            <h3 className="font-heading font-bold text-2xl text-[#2b2b2b]">
              {lang === "id" ? "Jelajahi Layanan Kami Lainnya" : "Explore Our Other Services"}
            </h3>
            <Link to="/#services" className="text-sm font-semibold text-[#F5A742] hover:underline">
              {lang === "id" ? "Semua Layanan →" : "All Services →"}
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {otherServices.map((other) => {
              const otherLabel =
                lang === "id" ? other.label_id || other.label : other.label;
              return (
                <Link
                  key={other.key}
                  to={`/services/${other.key}`}
                  className="group bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:border-[#F5A742] hover:shadow-md transition-all space-y-3"
                >
                  <h4 className="font-heading font-bold text-lg text-[#2b2b2b] group-hover:text-[#F5A742] transition-colors flex items-center justify-between">
                    <span>{otherLabel}</span>
                    <ChevronRight size={18} className="text-gray-400 group-hover:text-[#F5A742] group-hover:translate-x-1 transition-transform" />
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                    {lang === "id" ? other.description_id : other.description_en}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>
      </main>

      {/* Lightbox Modal for Photo */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <img
              src={activePhoto}
              alt="Enlarged view"
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setActivePhoto(null)}
              className="absolute -top-10 right-0 text-white hover:text-[#F5A742] font-semibold text-sm flex items-center gap-1.5"
            >
              ✕ {lang === "id" ? "Tutup" : "Close"}
            </button>
          </div>
        </div>
      )}

      {/* Footer & Floating WhatsApp */}
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
