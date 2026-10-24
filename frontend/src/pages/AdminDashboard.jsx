import { useEffect, useState, useRef } from "react";
import { Navigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { LogOut, Upload, Trash2, Save, KeyRound, ExternalLink } from "lucide-react";
import { useAuth, authAxios, formatApiErrorDetail } from "@/context/AuthContext";
import { BACKEND_URL, API, resolveUrl } from "@/config";

const ServiceEditor = ({ service, onSaved }) => {
  const [form, setForm] = useState(service);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => setForm(service), [service]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const uploadImage = async (file) => {
    const fd = new FormData();
    fd.append("file", file);
    const { data } = await authAxios.post("/upload", fd);
    return data.url;
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      toast.info("Mengunggah foto...");
      const url = await uploadImage(file);
      set("gallery", [...(form.gallery || []), { url, caption_id: "", caption_en: "" }]);
      toast.success("Foto ditambahkan. Isi keterangan lalu klik Simpan.");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      e.target.value = "";
    }
  };

  const setCaption = (i, field, value) =>
    set("gallery", form.gallery.map((g, j) => (j === i ? { ...g, [field]: value } : g)));

  const save = async () => {
    setSaving(true);
    try {
      const { data } = await authAxios.put(`/services/${form.key}`, {
        description_en: form.description_en,
        description_id: form.description_id,
        customers: form.customers,
        gallery: form.gallery,
      });
      onSaved(data);
      toast.success("Perubahan disimpan");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div data-testid={`service-editor-${form.key}`} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-semibold mb-1.5">Deskripsi (Bahasa Indonesia)</label>
          <textarea
            data-testid="service-desc-id"
            value={form.description_id || ""}
            onChange={(e) => set("description_id", e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1.5">Description (English)</label>
          <textarea
            data-testid="service-desc-en"
            value={form.description_en || ""}
            onChange={(e) => set("description_en", e.target.value)}
            rows={5}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold mb-1.5">Pelanggan yang pernah ditangani (satu per baris)</label>
        <textarea
          data-testid="service-customers"
          value={(form.customers || []).join("\n")}
          onChange={(e) => set("customers", e.target.value.split("\n"))}
          rows={4}
          className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
          placeholder="PT Contoh Abadi — Balikpapan"
        />
      </div>
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-sm font-semibold">Galeri Foto Dokumentasi</label>
          <button
            data-testid="gallery-upload-button"
            onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 text-sm bg-[#2b2b2b] text-white px-4 py-2 rounded hover:bg-black transition-colors"
          >
            <Upload size={15} /> Upload Foto
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} data-testid="gallery-file-input" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {(form.gallery || []).map((g, i) => (
            <div key={g.url || `gallery-${i}`} className="border rounded-lg p-3 space-y-2 bg-gray-50">
              <div className="relative group">
                <img src={resolveUrl(g.url)} alt={`Galeri ${i + 1}`} className="w-full aspect-[3/2] object-cover rounded border" />
                <button
                  data-testid={`gallery-delete-${i}`}
                  onClick={() => set("gallery", form.gallery.filter((_, j) => j !== i))}
                  className="absolute top-1.5 right-1.5 bg-red-600 text-white p-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Hapus foto"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <input
                data-testid={`gallery-caption-id-${i}`}
                value={g.caption_id || ""}
                onChange={(e) => setCaption(i, "caption_id", e.target.value)}
                placeholder="Keterangan (Bahasa Indonesia)"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
              />
              <input
                data-testid={`gallery-caption-en-${i}`}
                value={g.caption_en || ""}
                onChange={(e) => setCaption(i, "caption_en", e.target.value)}
                placeholder="Caption (English)"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
              />
            </div>
          ))}
          {(form.gallery || []).length === 0 && (
            <p className="text-sm text-gray-400 col-span-full">Belum ada foto.</p>
          )}
        </div>
      </div>
      <button
        data-testid="service-save-button"
        onClick={save}
        disabled={saving}
        className="flex items-center gap-2 bg-[#F5A742] hover:bg-[#e0942f] text-white font-semibold px-6 py-2.5 rounded transition-colors disabled:opacity-60"
      >
        <Save size={16} /> {saving ? "Menyimpan..." : "Simpan Perubahan"}
      </button>
    </div>
  );
};

const NibEditor = ({ settings, onSaved }) => {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const { data } = await authAxios.post("/upload", fd);
      const { data: updated } = await authAxios.put("/settings", { nib_image_url: data.url });
      onSaved(updated);
      toast.success("Gambar NIB berhasil diganti");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div data-testid="nib-editor" className="bg-white rounded-lg shadow p-6">
      <h3 className="font-heading font-bold text-lg mb-4">Gambar NIB (Perizinan Berusaha)</h3>
      <div className="flex items-start gap-6 flex-wrap">
        <img
          src={resolveUrl(settings?.nib_image_url) || "/images/legal_nib.png"}
          alt="NIB saat ini"
          data-testid="nib-current-image"
          className="w-40 border shadow object-contain bg-white"
        />
        <div>
          <p className="text-sm text-gray-600 mb-4 max-w-sm">
            Gambar ini tampil di bagian Introduction pada landing page. Upload gambar baru untuk menggantinya (JPG/PNG, maks 8MB).
          </p>
          <button
            data-testid="nib-upload-button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-2 bg-[#F5A742] hover:bg-[#e0942f] text-white font-semibold px-5 py-2.5 rounded transition-colors disabled:opacity-60"
          >
            <Upload size={16} /> {uploading ? "Mengunggah..." : "Ganti Gambar NIB"}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} data-testid="nib-file-input" />
        </div>
      </div>
    </div>
  );
};

const PasswordEditor = () => {
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (next !== confirmPassword) {
      toast.error("Konfirmasi password baru tidak cocok.");
      return;
    }
    if (next.length < 8) {
      toast.error("Password baru minimal 8 karakter.");
      return;
    }
    setSaving(true);
    try {
      await authAxios.post("/auth/change-password", { current_password: current, new_password: next });
      toast.success("Password berhasil diubah");
      setCurrent("");
      setNext("");
      setConfirmPassword("");
    } catch (err) {
      toast.error(formatApiErrorDetail(err.response?.data?.detail));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} data-testid="password-editor" className="bg-white rounded-lg shadow p-6">
      <h3 className="font-heading font-bold text-lg mb-4 flex items-center gap-2">
        <KeyRound size={18} /> Ganti Password Admin
      </h3>
      <div className="grid sm:grid-cols-3 gap-4 mb-4">
        <input
          type="password"
          data-testid="password-current-input"
          value={current}
          onChange={(e) => setCurrent(e.target.value)}
          required
          placeholder="Password saat ini"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
        />
        <input
          type="password"
          data-testid="password-new-input"
          value={next}
          onChange={(e) => setNext(e.target.value)}
          required
          minLength={8}
          placeholder="Password baru (min. 8 karakter)"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
        />
        <input
          type="password"
          data-testid="password-confirm-input"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={8}
          placeholder="Ulangi password baru"
          className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#F5A742]"
        />
      </div>
      <button
        type="submit"
        data-testid="password-save-button"
        disabled={saving}
        className="bg-[#2b2b2b] hover:bg-black text-white text-sm font-semibold px-5 py-2.5 rounded transition-colors disabled:opacity-60"
      >
        {saving ? "Menyimpan..." : "Ubah Password"}
      </button>
    </form>
  );
};

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [services, setServices] = useState([]);
  const [settings, setSettings] = useState({});
  const [activeKey, setActiveKey] = useState("catering");

  useEffect(() => {
    let isMounted = true;
    authAxios
      .get("/content")
      .then((res) => {
        if (isMounted && res.data) {
          setServices(res.data.services || []);
          setSettings(res.data.settings || {});
        }
      })
      .catch((err) => {
        toast.error("Gagal memuat data konten dari server.");
      });

    return () => {
      isMounted = false;
    };
  }, []);

  if (user === null) return <div className="min-h-screen flex items-center justify-center font-body">Memuat...</div>;
  if (user === false) return <Navigate to="/admin/login" replace />;

  const active = services.find((s) => s.key === activeKey);

  return (
    <div className="min-h-screen bg-gray-100 font-body">
      <header className="bg-[#2b2b2b] text-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/images/logo_mark.png" alt="Logo" className="h-8" />
            <span className="font-heading font-semibold text-sm tracking-wider">ADMIN PANEL</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" data-testid="admin-view-site" className="flex items-center gap-1.5 text-sm text-white/80 hover:text-white">
              <ExternalLink size={15} /> Lihat Website
            </Link>
            <button
              data-testid="admin-logout-button"
              onClick={logout}
              className="flex items-center gap-1.5 text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded transition-colors"
            >
              <LogOut size={15} /> Keluar
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="font-heading font-bold text-xl mb-1">Konten Our Services</h2>
          <p className="text-sm text-gray-500 mb-6">Edit deskripsi (ID/EN), daftar pelanggan, dan galeri foto tiap layanan.</p>
          <div className="flex flex-wrap gap-2 mb-8">
            {services.map((s) => (
              <button
                key={s.key}
                data-testid={`service-tab-${s.key}`}
                onClick={() => setActiveKey(s.key)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  activeKey === s.key ? "bg-[#F5A742] text-white" : "bg-gray-100 text-[#2b2b2b] hover:bg-gray-200"
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {active && (
            <ServiceEditor
              service={active}
              onSaved={(updated) => setServices((list) => list.map((s) => (s.key === updated.key ? updated : s)))}
            />
          )}
        </div>

        <NibEditor settings={settings} onSaved={setSettings} />
        <PasswordEditor />
      </main>
    </div>
  );
}
