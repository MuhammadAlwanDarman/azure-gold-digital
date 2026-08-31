import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
 ArrowRight,
 Check,
 CheckCircle2,
 Copy,
 CreditCard,
 FileText,
 Home,
 Image as ImageIcon,
 Lock,
 LogIn,
 Pencil,
 RotateCcw,
 ShieldAlert,
 Sparkles,
 Upload,
 UserPlus,
 UserRound,
 Users,
 Wallet,
} from "lucide-react";
import { JENJANG } from "@/lib/school-data";
import { AuroraBackground, Magnetic, Particles, Reveal } from "@/components/site/effects";
import { ensureUserAccountForPPDB, getCurrentSession, savePPDBSubmission, subscribeToDB, UploadedDocFile, UserSession } from "@/lib/db";
import { useLanguage } from "@/lib/LanguageContext";
import { compressImageFile } from "@/lib/image-compression";

export const Route = createFileRoute("/ppdb")({
 head: () => ({
 meta: [
 { title: "SPMB Online — PKBM Zaid bin Tsabit" },
 {
 name: "description",
 content: "Daftar online jenjang TK, SD, SMP, dan SMA PKBM Zaid bin Tsabit. Form biodata lengkap & dokumen tersimpan otomatis.",
 },
 { property: "og:title", content: "SPMB Online — PKBM Zaid bin Tsabit" },
 { property: "og:description", content: "Formulir pendaftaran siswa baru yang cepat, aman, dan tersimpan otomatis." },
 { property: "og:type", content: "website" },
 { name: "twitter:card", content: "summary_large_image" },
 ],
 }),
 component: PpdbPage,
});

const getDraftKey = (userId?: string) => `spmb_draft_user_${userId || "guest"}`;

type Form = {
 jenjang: string;

 // 1. Data Identitas Calon Siswa
 nama: string;
 namaPanggilan: string;
 nikSiswa: string;
 noAkta: string;
 noKk: string;
 nisn: string;
 tempatLahir: string;
 lahir: string;
 jenisKelamin: string;
 agama: string;
 suku: string;
 statusAnak: string;
 anakKe: string;
 transportasi: string;
 tinggiBadan: string;
 beratBadan: string;
 riwayatPenyakit: string;
 asalSekolah: string;
 npsnAsal: string;
 alamat: string;

 // 2. Data Ayah Kandung
 namaAyah: string;
 nikAyah: string;
 tempatLahirAyah: string;
 tanggalLahirAyah: string;
 pendidikanAyah: string;
 pekerjaanAyah: string;
 penghasilanAyah: string;
 teleponAyah: string;
 kebutuhanKhususAyah: string;

 // 3. Data Ibu Kandung
 namaIbu: string;
 nikIbu: string;
 tempatLahirIbu: string;
 tanggalLahirIbu: string;
 pendidikanIbu: string;
 pekerjaanIbu: string;
 penghasilanIbu: string;
 teleponIbu: string;

 // Wali & Kontak
 wali: string;
 telepon: string;
 email: string;

 dokumen: string[];
 dokumenFiles?: UploadedDocFile[];
 metode: string;
 buktiRegUrl?: string;
 catatanTambahan: string;
};

const EMPTY: Form = {
 jenjang: "",

 // Siswa
 nama: "",
 namaPanggilan: "",
 nikSiswa: "",
 noAkta: "",
 noKk: "",
 nisn: "",
 tempatLahir: "",
 lahir: "",
 jenisKelamin: "",
 agama: "Islam",
 suku: "",
 statusAnak: "Anak Kandung",
 anakKe: "1",
 transportasi: "Sepeda Motor / Mobil",
 tinggiBadan: "",
 beratBadan: "",
 riwayatPenyakit: "",
 asalSekolah: "",
 npsnAsal: "",
 alamat: "",

 // Ayah
 namaAyah: "",
 nikAyah: "",
 tempatLahirAyah: "",
 tanggalLahirAyah: "",
 pendidikanAyah: "",
 pekerjaanAyah: "",
 penghasilanAyah: "",
 teleponAyah: "",
 kebutuhanKhususAyah: "Tidak ada",

 // Ibu
 namaIbu: "",
 nikIbu: "",
 tempatLahirIbu: "",
 tanggalLahirIbu: "",
 pendidikanIbu: "",
 pekerjaanIbu: "",
 penghasilanIbu: "Ibu Rumah Tangga (Rp 0)",
 teleponIbu: "",

 // Wali
 wali: "",
 telepon: "",
 email: "",

 dokumen: [],
 dokumenFiles: [],
 metode: "Transfer Bank BSI (Bank Syariah Indonesia)",
 buktiRegUrl: "",
 catatanTambahan: "",
};

const getAsalSekolahInfo = (_jenjang: string) => {
 return {
 label: "Asal Sekolah Sebelumnya *",
 placeholder: "Nama Sekolah Asal",
 npsnLabel: "NPSN Asal Sekolah (Jika Ada)",
 npsnPlaceholder: "8 Digit NPSN Sekolah Asal (Jika Ada)",
 };
};

function PpdbPage() {
 const [step, setStep] = useState(0);
 const [maxStepReached, setMaxStepReached] = useState(0);
 const [form, setForm] = useState<Form>(EMPTY);
 const [saved, setSaved] = useState(false);
 const [copiedAcc, setCopiedAcc] = useState(false);
 const [submittedRegNo, setSubmittedRegNo] = useState<string>("");
 const [session, setSession] = useState<UserSession | null>(() => getCurrentSession());
 const { t } = useLanguage();

 useEffect(() => {
    setMaxStepReached((prev) => Math.max(prev, step));
  }, [step]);

 const steps = [
 t("Jenjang", "Level"),
 t("Identitas Siswa", "Student Data"),
 t("Data Ayah", "Father Data"),
 t("Data Ibu", "Mother Data"),
 t("Dokumen & Foto", "Upload Files"),
 t("Konfirmasi", "Review"),
 t("Pembayaran", "Payment"),
 t("Selesai", "Completed"),
 ];

 const dokumenList = [
 { id: "Kartu Keluarga", label: t("Kartu Keluarga (KK)", "Family Card (KK)"), desc: t("16 Digit No. KK sesuai dokumen resmi", "16 Digit Family Card No.") },
 { id: "Akta Kelahiran", label: t("Akta Kelahiran", "Birth Certificate"), desc: t("Sesuai No. Registrasi Akta Lahir", "Birth Certificate Registration No.") },
 { id: "Pas Foto", label: t("Pas Foto Calon Siswa", "Student Photo"), desc: t("Foto formal latar biru/merah", "Formal photo blue/red background") },
 { id: "Foto Rumah", label: t("Foto Depan / Tampak Rumah", "Front View Photo of Home"), desc: t("Foto bagian depan tempat tinggal calon siswa", "Front view photo of current residence") },
 { id: "Bukti Follow Sosmed", label: t("Bukti Screenshot Follow Social Media Sekolah", "Screenshot Proof of Following School Social Media"), desc: t("Screenshot bukti follow Instagram/TikTok/YouTube sekolah", "Screenshot proof of following school social media") },
 ];

  useEffect(() => {
    const cur = getCurrentSession();
    setSession(cur);
    if (cur?.userId) {
      const key = getDraftKey(cur.userId);
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          setForm({ ...EMPTY, ...parsed, wali: parsed.wali || cur.name, email: parsed.email || cur.email });
        } catch {
          setForm({ ...EMPTY, wali: cur.name, email: cur.email });
          setStep(0);
          setMaxStepReached(0);
        }
      } else {
        setForm({ ...EMPTY, wali: cur.name, email: cur.email });
        setStep(0);
        setMaxStepReached(0);
      }
    } else {
      setForm(EMPTY);
      setStep(0);
      setMaxStepReached(0);
    }
  }, [session?.userId]);

  useEffect(() => {
    const unsubscribe = subscribeToDB(() => {
      const updated = getCurrentSession();
      setSession((prev) => {
        if (prev?.userId !== updated?.userId || prev?.email !== updated?.email) {
          return updated;
        }
        return prev;
      });
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!session?.userId) return;
    const key = getDraftKey(session.userId);
    const timer = setTimeout(() => {
      if (form.jenjang || form.nama) {
        localStorage.setItem(key, JSON.stringify(form));
        setSaved(true);
        const s = setTimeout(() => setSaved(false), 1400);
        return () => clearTimeout(s);
      }
    }, 600);
    return () => clearTimeout(timer);
  }, [form, session]);

 // Scroll to top smoothly when stepping forward or backward in PPDB form
 useEffect(() => {
 if (typeof window !== "undefined") {
 window.scrollTo({ top: 120, behavior: "smooth" });
 }
 }, [step]);

 const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
 
 // Validation per step
 const valid =
 (step === 0 && !!form.jenjang) ||
 (step === 1 && !!form.nama && !!form.namaPanggilan && !!form.nikSiswa && !!form.tempatLahir && !!form.lahir && !!form.jenisKelamin && !!form.asalSekolah && !!form.alamat) ||
 (step === 2 && !!form.namaAyah && !!form.pekerjaanAyah && form.teleponAyah.length>= 8) ||
 (step === 3 && !!form.namaIbu && !!form.pekerjaanIbu) ||
 (step === 4 && (form.dokumen.length >= 2 || (form.dokumenFiles?.length || 0) >= 2)) ||
 step === 5 ||
 (step === 6 && !!form.buktiRegUrl) ||
 step === 7;

 const isStepCompleted = (stepIdx: number) => {
    if (stepIdx === 0) return !!form.jenjang;
    if (stepIdx === 1) return !!form.nama && !!form.namaPanggilan && !!form.nikSiswa && !!form.tempatLahir && !!form.lahir && !!form.jenisKelamin && !!form.alamat;
    if (stepIdx === 2) return !!form.namaAyah && !!form.pekerjaanAyah && form.teleponAyah.length >= 8;
    if (stepIdx === 3) return !!form.namaIbu && !!form.pekerjaanIbu;
    if (stepIdx === 4) return (form.dokumen.length >= 2 || (form.dokumenFiles?.length || 0) >= 2);
    if (stepIdx === 5) return isStepCompleted(0) && isStepCompleted(1) && isStepCompleted(2) && isStepCompleted(3) && isStepCompleted(4) && maxStepReached >= 6;
    if (stepIdx === 6) return !!form.buktiRegUrl && maxStepReached >= 7;
    if (stepIdx === 7) return step === 7;
    return false;
  };

  const isStepUnlocked = (targetStep: number) => {
    if (targetStep === 0) return true;
    if (targetStep === 7) return step === 7;
    if (targetStep <= maxStepReached) return true;
    for (let k = 0; k < targetStep; k++) {
      if (!isStepCompleted(k)) return false;
    }
    return true;
  };

 return (
 <main className="relative min-h-screen overflow-hidden bg-mist pb-24 pt-36">
 <AuroraBackground />
 <div className="relative mx-auto max-w-4xl px-5">
 <Reveal variant="blur">
 <div className="text-center">
 <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
 SPMB Online 2026/2027
 </span>
 <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">{t("Formulir Pendaftaran Siswa Baru", "New Student Registration Form")}</h1>
 <p className="mt-3 text-sm text-muted-foreground">
 {t("Formulir lengkap calon siswa, data orang tua, dan dokumen terunggah aman di akun Anda.", "Complete registration form for student, parents, and documents saved securely to your account.")}
 </p>
 {session && (
 <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/90 to-slate-900 p-5 md:p-6 text-white shadow-xl backdrop-blur-md">
 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
 <div className="flex items-start gap-3">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
 <CheckCircle2 className="h-6 w-6" />
 </div>
 <div>
 <p className="text-sm font-extrabold text-emerald-300">
 {t("Anda sudah memiliki akun & siap mengisi Pendaftaran SPMB.", "You already have an account & are ready to fill out the SPMB Registration.")}
 </p>
 <p className="mt-1 text-xs text-slate-300 leading-relaxed">
 {t("Terhubung sebagai:", "Connected as:")} <strong className="text-emerald-200">{session.name}</strong> ({session.email}). {t("Selain pendaftaran SPMB, Anda juga dapat melakukan Pembayaran SPP Bulanan yang telah disediakan secara online.", "Besides SPMB registration, you can also pay monthly SPP online.")}
 </p>
 </div>
 </div>

 <Link
 to="/spp"
 className="shrink-0 inline-flex items-center gap-2 rounded-full border border-gold bg-gold/20 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-gold hover:bg-gold hover:text-navy transition-all shadow-md"
>
 <CreditCard className="h-4 w-4" />
 <span>{t("Bayar SPP Sekarang", "Pay SPP Now")}</span>
 </Link>
 </div>
 </div>
 )}
 </div>
 </Reveal>

 {!session ? (
 <motion.div
 initial={{ opacity: 0, y: 30 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ duration: 0.5 }}
 className="relative mt-10 rounded-3xl border border-gold/30 bg-card/95 p-8 shadow-luxe backdrop-blur-md sm:p-12"
>
 <div className="text-center">
 <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold border border-gold/30">
 <Lock className="h-8 w-8 text-gold" />
 </div>
 <h2 className="mt-4 text-2xl font-black text-foreground">
 {t("Silakan Masuk Akun Terlebih Dahulu", "Please Log In to Your Account First")}
 </h2>
 <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
 {t("Untuk menjaga keamanan data pribadi calon siswa & orang tua, pendaftaran SPMB Online mewajibkan login akun pendaftar.", "To protect personal candidate & parent data, SPMB Registration requires logging in first.")}
 </p>

 <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
 <Link
 to="/masuk"
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-navy px-8 py-3.5 text-xs font-extrabold uppercase tracking-wider text-gold hover:bg-navy-deep transition-all shadow-lg"
>
 <UserRound className="h-4 w-4" />
 <span>{t("Masuk Akun / Login", "Log In Account")}</span>
 </Link>
 <Link
 to="/masuk"
 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-xs font-bold uppercase tracking-wider text-foreground hover:bg-muted transition-all"
>
 <span>{t("Daftar Akun Baru", "Register New Account")}</span>
 </Link>
 </div>
 </div>
 </motion.div>
 ) : (
 <>
 <div className="mt-12">
 <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-none">
 {steps.map((s, i) => {
 const unlocked = isStepUnlocked(i);
 const completed = isStepCompleted(i);

 return (
 <button
 type="button"
 key={s + i}
 disabled={!unlocked}
 onClick={() =>{
 if (unlocked) setStep(i);
 }}
 title={
 unlocked
 ? t(`Buka Langkah ${i + 1}: ${s}`, `Open Step ${i + 1}: ${s}`)
 : t(`Lengkapi langkah sebelumnya terlebih dahulu untuk membuka ${s}`, `Complete previous steps first to unlock ${s}`)
 }
 className={`flex flex-1 flex-col items-center gap-1.5 min-w-[60px] group focus:outline-none ${
 unlocked ? "cursor-pointer" : "cursor-not-allowed opacity-50"
 }`}
>
 <div
 className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${
 i === step
 ? "bg-gold text-navy-deep shadow-gold ring-4 ring-gold/30 scale-105"
 : completed
 ? "bg-emerald-600 text-white shadow-md group-hover:scale-110"
 : unlocked
 ? "bg-card text-foreground border border-gold/50 group-hover:border-gold group-hover:scale-110"
 : "bg-muted/40 text-muted-foreground border border-border"
 }`}
>
 {completed && i !== step ? <Check className="h-3.5 w-3.5" /> : i + 1}
 </div>
 <span
 className={`text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider text-center truncate max-w-[80px] transition-colors ${
 i === step
 ? "text-gold font-black"
 : completed
 ? "text-emerald-700 dark:text-emerald-400 font-bold"
 : unlocked
 ? "text-foreground group-hover:text-gold"
 : "text-muted-foreground/60"
 }`}
>
 {s}
 </span>
 </button>
 );
 })}
 </div>
 <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-card">
 <motion.div
 className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold"
 animate={{ width: `${(step / (steps.length - 1)) * 100}%` }}
 transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
 />
 </div>
 </div>

 <div className="relative mt-8 rounded-3xl border border-border bg-card p-6 shadow-luxe sm:p-10">
 <AnimatePresence mode="wait">
 <motion.div
 key={step}
 initial={{ opacity: 0, x: 40, filter: "blur(8px)" }}
 animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
 exit={{ opacity: 0, x: -40, filter: "blur(8px)" }}
 transition={{ duration: 0.4 }}
>
 {step === 0 && (
 <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border pb-3">
          <div>
            <h2 className="text-xl font-bold">{t("Pilih Jenjang Pendidikan", "Select Education Level")}</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {t("Pilih jenjang sekolah yang dituju oleh calon siswa siswi.", "Select target school level for the student.")}
            </p>
          </div>
          {(form.jenjang || form.nama) && (
            <button
              type="button"
              onClick={() => {
                if (confirm(t("Kosongkan form dan mulai pendaftaran baru dari awal?", "Clear form and start a fresh application from scratch?"))) {
                  if (session?.userId) {
                    localStorage.removeItem(getDraftKey(session.userId));
                  }
                  setForm({ ...EMPTY, wali: session?.name || "", email: session?.email || "" });
                  setStep(0);
                  setMaxStepReached(0);
                }
              }}
              className="self-start sm:self-auto inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-red-500 hover:border-red-400 transition-colors shadow-sm"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t("Reset / Pendaftaran Baru", "Reset / Fresh Form")}</span>
            </button>
          )}
        </div>
 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 {JENJANG.map((j) => (
 <button
 key={j.slug}
 onClick={() =>set("jenjang", j.label)}
 className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 ${
 form.jenjang === j.label ? "border-gold bg-gold/10 shadow-gold" : "border-border"
 }`}
>
 <p className="text-lg font-extrabold">{t(j.label, j.labelEn || j.label)}</p>
 <p className="text-xs uppercase tracking-widest text-muted-foreground">{t(j.usia, j.usiaEn || j.usia)}</p>
 </button>
 ))}
 </div>
 </div>
 )}

 {step === 1 && (
 <div>
 <h2 className="flex items-center gap-2 text-xl font-bold">
 <UserRound className="h-5 w-5 text-gold" /> 1. {t("Data Identitas Calon Siswa", "Student Identity Data")}
 </h2>
 <p className="mt-1 text-xs text-muted-foreground">
 {t("Isi data pribadi calon siswa dengan teliti sesuai dokumen resmi.", "Fill in candidate student personal details carefully according to official docs.")}
 </p>

 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 <label className="text-sm sm:col-span-2">
 <span className="font-semibold">{t("Nama Lengkap Siswa *", "Full Name of Student *")}</span>
 <span className="ml-2 text-xs text-muted-foreground">(Sesuai Akta Kelahiran)</span>
 <input
 type="text"
 placeholder="Sesuai Akta Kelahiran"
 value={form.nama}
 onChange={(e) => set("nama", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Nama Panggilan *", "Nickname *")}</span>
 <input
 type="text"
 placeholder="Contoh: Rayyan"
 value={form.namaPanggilan}
 onChange={(e) => set("namaPanggilan", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("NIK Siswa (16 Digit) *", "Student NIK (16 Digits) *")}</span>
 <input
 type="text"
 maxLength={16}
 placeholder="16 Digit Angka NIK"
 value={form.nikSiswa}
 onChange={(e) => set("nikSiswa", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("No. Registrasi Akta Lahir", "Birth Certificate Reg No.")}</span>
 <input
 type="text"
 placeholder="No Reg pada Akta Kelahiran"
 value={form.noAkta}
 onChange={(e) => set("noAkta", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("No. Kartu Keluarga (KK)", "Family Card No. (KK)")}</span>
 <input
 type="text"
 maxLength={16}
 placeholder="16 Digit No. KK"
 value={form.noKk}
 onChange={(e) => set("noKk", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("NISN (Jika Ada)", "NISN (If Any)")}</span>
 <input
 type="text"
 maxLength={10}
 placeholder="10 Digit NISN dari TK/PAUD"
 value={form.nisn}
 onChange={(e) => set("nisn", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tempat Lahir *", "Place of Birth *")}</span>
 <input
 type="text"
 placeholder="Kota Tempat Lahir"
 value={form.tempatLahir}
 onChange={(e) => set("tempatLahir", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tanggal Lahir *", "Date of Birth *")}</span>
 <input
 type="date"
 value={form.lahir}
 onChange={(e) => set("lahir", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Jenis Kelamin *", "Gender *")}</span>
 <select
 value={form.jenisKelamin}
 onChange={(e) => set("jenisKelamin", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
>
 <option value="">-- Pilih Jenis Kelamin --</option>
 <option value="Laki-Laki">Laki-Laki (Boys)</option>
 <option value="Perempuan">Perempuan (Girls)</option>
 </select>
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Agama *", "Religion *")}</span>
 <input
 type="text"
 value={form.agama}
 onChange={(e) => set("agama", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Suku", "Ethnic Origin")}</span>
 <input
 type="text"
 placeholder="Contoh: Banjar / Jawa / Bugis"
 value={form.suku}
 onChange={(e) => set("suku", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Status Anak", "Child Status")}</span>
 <select
 value={form.statusAnak}
 onChange={(e) => set("statusAnak", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
>
 <option value="Anak Kandung">Anak Kandung</option>
 <option value="Anak Angkat">Anak Angkat</option>
 <option value="Anak Tiri">Anak Tiri</option>
 </select>
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Anak Ke-Berapa", "Child Order")}</span>
 <input
 type="number"
 min={1}
 placeholder="1"
 value={form.anakKe}
 onChange={(e) => set("anakKe", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Mode Transportasi ke Sekolah", "Transportation Mode")}</span>
 <input
 type="text"
 placeholder="Sepeda Motor / Mobil / Jalan Kaki"
 value={form.transportasi}
 onChange={(e) => set("transportasi", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tinggi Badan (cm)", "Height (cm)")}</span>
 <input
 type="text"
 placeholder="TB (cm)"
 value={form.tinggiBadan}
 onChange={(e) => set("tinggiBadan", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Berat Badan (kg)", "Weight (kg)")}</span>
 <input
 type="text"
 placeholder="BB (kg)"
 value={form.beratBadan}
 onChange={(e) => set("beratBadan", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm sm:col-span-2">
 <span className="font-semibold">{t("Riwayat Penyakit (Jika Ada)", "Medical History (If Any)")}</span>
 <input
 type="text"
 placeholder="Alergi / Asma / Dsb"
 value={form.riwayatPenyakit}
 onChange={(e) => set("riwayatPenyakit", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 {(() => {
 const asalInfo = getAsalSekolahInfo(form.jenjang);
 return (
 <>
 <label className="text-sm">
 <span className="font-semibold">{t(asalInfo.label, asalInfo.label)}</span>
 <input
 type="text"
 placeholder={asalInfo.placeholder}
 value={form.asalSekolah}
 onChange={(e) => set("asalSekolah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t(asalInfo.npsnLabel, asalInfo.npsnLabel)}</span>
 <input
 type="text"
 placeholder={asalInfo.npsnPlaceholder}
 value={form.npsnAsal}
 onChange={(e) => set("npsnAsal", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>
 </>
 );
 })()}

 <label className="text-sm sm:col-span-2">
 <span className="font-semibold">{t("Alamat Lengkap Tempat Tinggal *", "Full Address *")}</span>
 <textarea
 rows={3}
 placeholder="Jalan, RT/RW, Kelurahan, Kecamatan, Kota"
 value={form.alamat}
 onChange={(e) => set("alamat", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>
 </div>
 </div>
 )}

 {step === 2 && (
 <div>
 <h2 className="flex items-center gap-2 text-xl font-bold">
 <Users className="h-5 w-5 text-gold" /> 2. {t("Data Ayah Kandung", "Father Data")}
 </h2>
 <p className="mt-1 text-xs text-muted-foreground">
 {t("Isi data diri ayah kandung calon siswa.", "Fill in father details.")}
 </p>

 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 <label className="text-sm sm:col-span-2">
 <span className="font-semibold">{t("Nama Ayah Kandung *", "Father Full Name *")}</span>
 <input
 type="text"
 placeholder="Nama Lengkap Ayah"
 value={form.namaAyah}
 onChange={(e) => {
 set("namaAyah", e.target.value);
 if (!form.wali) set("wali", e.target.value);
 }}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("NIK Ayah", "Father NIK")}</span>
 <input
 type="text"
 maxLength={16}
 placeholder="16 Digit NIK Ayah"
 value={form.nikAyah}
 onChange={(e) => set("nikAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tempat Lahir Ayah", "Father Place of Birth")}</span>
 <input
 type="text"
 placeholder="Kota"
 value={form.tempatLahirAyah}
 onChange={(e) => set("tempatLahirAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tanggal Lahir Ayah", "Father Date of Birth")}</span>
 <input
 type="date"
 value={form.tanggalLahirAyah}
 onChange={(e) => set("tanggalLahirAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Pendidikan Terakhir Ayah", "Father Education Level")}</span>
 <select
 value={form.pendidikanAyah}
 onChange={(e) => set("pendidikanAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
>
 <option value="">-- Pilih Pendidikan --</option>
 <option value="SD/MI">SD / MI</option>
 <option value="SMP/MTs">SMP / MTs</option>
 <option value="SMA/MA">SMA / MA</option>
 <option value="D3/D4">D3 / D4</option>
 <option value="S1/Sarjana">S1 / Sarjana</option>
 <option value="S2/Magister">S2 / Magister</option>
 <option value="S3/Doktor">S3 / Doktor</option>
 <option value="Lainnya">Lainnya</option>
 </select>
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Pekerjaan Ayah *", "Father Occupation *")}</span>
 <input
 type="text"
 placeholder="PNS / Swasta / Wiraswasta"
 value={form.pekerjaanAyah}
 onChange={(e) => set("pekerjaanAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Penghasilan Ayah per Bulan", "Father Monthly Income")}</span>
 <select
 value={form.penghasilanAyah}
 onChange={(e) => set("penghasilanAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
>
 <option value="< Rp 3.000.000">&lt; Rp 3.000.000</option>
 <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
 <option value="Rp 5.000.000 - Rp 10.000.000">Rp 5.000.000 - Rp 10.000.000</option>
 <option value="> Rp 10.000.000">&gt; Rp 10.000.000</option>
 </select>
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("No. WhatsApp / HP Ayah *", "Father WhatsApp No. *")}</span>
 <input
 type="tel"
 placeholder="08xxxxxxxxxx (Untuk konfirmasi SPMB)"
 value={form.teleponAyah}
 onChange={(e) => {
 set("teleponAyah", e.target.value);
 set("telepon", e.target.value);
 }}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm sm:col-span-2">
 <span className="font-semibold">{t("Berkebutuhan Khusus Ayah", "Special Needs (Father)")}</span>
 <input
 type="text"
 placeholder="Tidak ada / Sebutkan"
 value={form.kebutuhanKhususAyah}
 onChange={(e) => set("kebutuhanKhususAyah", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>
 </div>
 </div>
 )}

 {step === 3 && (
 <div>
 <h2 className="flex items-center gap-2 text-xl font-bold">
 <Users className="h-5 w-5 text-gold" /> 3. {t("Data Ibu Kandung", "Mother Data")}
 </h2>
 <p className="mt-1 text-xs text-muted-foreground">
 {t("Isi data diri ibu kandung calon siswa.", "Fill in mother details.")}
 </p>

 <div className="mt-6 grid gap-4 sm:grid-cols-2">
 <label className="text-sm sm:col-span-2">
 <span className="font-semibold">{t("Nama Ibu Kandung *", "Mother Full Name *")}</span>
 <input
 type="text"
 placeholder="Nama Lengkap Ibu"
 value={form.namaIbu}
 onChange={(e) => set("namaIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("NIK Ibu", "Mother NIK")}</span>
 <input
 type="text"
 maxLength={16}
 placeholder="16 Digit NIK Ibu"
 value={form.nikIbu}
 onChange={(e) => set("nikIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tempat Lahir Ibu", "Mother Place of Birth")}</span>
 <input
 type="text"
 placeholder="Kota"
 value={form.tempatLahirIbu}
 onChange={(e) => set("tempatLahirIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Tanggal Lahir Ibu", "Mother Date of Birth")}</span>
 <input
 type="date"
 value={form.tanggalLahirIbu}
 onChange={(e) => set("tanggalLahirIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Pendidikan Terakhir Ibu", "Mother Education Level")}</span>
 <select
 value={form.pendidikanIbu}
 onChange={(e) => set("pendidikanIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
>
 <option value="">-- Pilih Pendidikan --</option>
 <option value="SD/MI">SD / MI</option>
 <option value="SMP/MTs">SMP / MTs</option>
 <option value="SMA/MA">SMA / MA</option>
 <option value="D3/D4">D3 / D4</option>
 <option value="S1/Sarjana">S1 / Sarjana</option>
 <option value="S2/Magister">S2 / Magister</option>
 <option value="S3/Doktor">S3 / Doktor</option>
 <option value="Lainnya">Lainnya</option>
 </select>
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Pekerjaan Ibu *", "Mother Occupation *")}</span>
 <input
 type="text"
 placeholder="Ibu Rumah Tangga / PNS / Swasta"
 value={form.pekerjaanIbu}
 onChange={(e) => set("pekerjaanIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("Penghasilan Ibu per Bulan", "Mother Monthly Income")}</span>
 <select
 value={form.penghasilanIbu}
 onChange={(e) => set("penghasilanIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
>
 <option value="Ibu Rumah Tangga (Rp 0)">Ibu Rumah Tangga (Rp 0)</option>
 <option value="< Rp 3.000.000">&lt; Rp 3.000.000</option>
 <option value="Rp 3.000.000 - Rp 5.000.000">Rp 3.000.000 - Rp 5.000.000</option>
 <option value="> Rp 5.000.000">&gt; Rp 5.000.000</option>
 </select>
 </label>

 <label className="text-sm">
 <span className="font-semibold">{t("No. HP Ibu", "Mother Phone No.")}</span>
 <input
 type="tel"
 placeholder="08xxxxxxxxxx"
 value={form.teleponIbu}
 onChange={(e) => set("teleponIbu", e.target.value)}
 className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
 />
 </label>
 </div>
 </div>
 )}

 {step === 4 && (
 <div>
 <div className="flex flex-wrap items-center justify-between gap-2">
 <div>
 <h2 className="flex items-center gap-2 text-xl font-bold">
 <Upload className="h-5 w-5 text-gold" /> 4. {t("Unggah Berkas Syarat & Foto", "Upload Required Files & Photos")}
 </h2>
 <p className="text-xs text-muted-foreground mt-1">
 {t(
 "Unggah berkas KK, Akta, Pasfoto, Foto Rumah, dan Screenshot Follow Social Media Sekolah.",
 "Upload KK, Birth Certificate, Photo, Home Photo, and School Social Media Follow Screenshot."
 )}
 </p>
 </div>
 <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold">
 {(form.dokumenFiles?.length || 0) + (form.dokumen.length)} {t("dari", "of")} {dokumenList.length} {t("terunggah", "uploaded")}
 </span>
 </div>

 <div className="mt-6 space-y-3">
 {dokumenList.map((d) => {
              const uploadedInfo = form.dokumen.find((item) => item.startsWith(d.id));
              const docFile = form.dokumenFiles?.find((item) => item.id === d.id);
              const isUploaded = !!uploadedInfo || !!docFile;

              return (
                <div
                  key={d.id}
                  className={`flex flex-col gap-3 rounded-2xl border border-dashed p-4 transition-all ${
                    isUploaded ? "border-emerald-500/50 bg-emerald-50/40 dark:bg-emerald-950/20" : "border-border hover:border-gold"
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${isUploaded ? "bg-emerald-600 text-white" : "bg-muted text-gold"}`}>
                        {isUploaded ? <Check className="h-5 w-5" /> : d.id === "Foto Rumah" ? <Home className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">{d.label}</p>
                        {isUploaded ? (
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-0.5">
                            {docFile ? `${docFile.name} (${docFile.size || "Terlampir"})` : uploadedInfo?.replace(`${d.id} - `, "")}
                          </p>
                        ) : (
                          <p className="text-[11px] text-muted-foreground">{d.desc}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="file"
                        id={`file-input-${d.id.replace(/\s+/g, "-")}`}
                        accept="image/*,application/pdf"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const sizeStr = file.size > 1024 * 1024 ? `${(file.size / (1024 * 1024)).toFixed(1)} MB` : `${Math.round(file.size / 1024)} KB`;
                          const label = `${d.id} - ${file.name} (${sizeStr})`;
                          
                          let url = "";
                          try {
                            url = await compressImageFile(file, 900, 0.75);
                          } catch {
                            const reader = new FileReader();
                            url = await new Promise((res) => {
                              reader.onload = () => res(reader.result as string);
                              reader.readAsDataURL(file);
                            });
                          }

                          const docObj: UploadedDocFile = {
                            id: d.id,
                            name: file.name,
                            size: sizeStr,
                            url,
                          };

                          setForm((f) => ({
                            ...f,
                            dokumen: [...f.dokumen.filter((x) => !x.startsWith(d.id)), label],
                            dokumenFiles: [...(f.dokumenFiles || []).filter((x) => x.id !== d.id), docObj],
                          }));
                        }}
                      />
                      {isUploaded ? (
                        <button
                          type="button"
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              dokumen: f.dokumen.filter((x) => !x.startsWith(d.id)),
                              dokumenFiles: (f.dokumenFiles || []).filter((x) => x.id !== d.id),
                            }))
                          }
                          className="rounded-xl border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100"
                        >
                          {t("Hapus", "Remove")}
                        </button>
                      ) : (
                        <label
                          htmlFor={`file-input-${d.id.replace(/\s+/g, "-")}`}
                          className="cursor-pointer rounded-xl bg-navy px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-gold hover:bg-navy/90 shadow-sm"
                        >
                          {t("Pilih File / Foto", "Choose Photo")}
                        </label>
                      )}
                    </div>
                  </div>

                  {docFile?.url && (
                    <div className="mt-2 flex items-center gap-3 p-2 rounded-xl bg-black/5 border border-border max-w-sm">
                      <img src={docFile.url} alt={d.label} className="h-16 w-16 object-cover rounded-lg border border-border" />
                      <div className="text-xs">
                        <span className="font-bold text-emerald-600 dark:text-emerald-400 block">Foto Berhasil Dilampirkan</span>
                        <span className="text-[11px] text-muted-foreground">{docFile.name}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
 </div>
 </div>
 )}

  {step === 5 && (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-border pb-3">
        <div>
          <h2 className="text-xl font-bold">5. {t("Konfirmasi & Cross Cek Data Pendaftaran", "Review & Cross-Check Application Data")}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {t("Periksa kembali seluruh data. Klik tombol 'Ubah' pada bagian mana pun jika ingin memperbaiki data.", "Review all data. Click 'Edit' on any section to cross-check and modify.")}
          </p>
        </div>
        <span className="rounded-full bg-gold/10 px-3 py-1 text-xs font-bold text-gold border border-gold/30 shrink-0">
          {t("Siap Lanjut Pembayaran", "Ready for Payment")}
        </span>
      </div>

      <div className="mt-6 space-y-4">
        <div className="rounded-2xl border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Jenjang Pendidikan Dituju
            </h3>
            <button
              type="button"
              onClick={() => setStep(0)}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Pencil className="h-3 w-3" /> {t("Ubah Jenjang", "Change Level")}
            </button>
          </div>
          <p className="mt-2 text-sm font-extrabold text-foreground">{form.jenjang || "—"}</p>
        </div>

        <div className="rounded-2xl border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <UserRound className="h-3.5 w-3.5" /> 1. Data Identitas Calon Siswa
            </h3>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Pencil className="h-3 w-3" /> {t("Ubah Data Siswa", "Edit Student Data")}
            </button>
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
            <div><dt className="text-muted-foreground">Nama Lengkap:</dt><dd className="font-bold">{form.nama}</dd></div>
            <div><dt className="text-muted-foreground">Nama Panggilan:</dt><dd className="font-bold">{form.namaPanggilan || "—"}</dd></div>
            <div><dt className="text-muted-foreground">NIK Siswa:</dt><dd className="font-bold">{form.nikSiswa || "—"}</dd></div>
            <div><dt className="text-muted-foreground">No. Akta Lahir:</dt><dd className="font-bold">{form.noAkta || "—"}</dd></div>
            <div><dt className="text-muted-foreground">No. KK:</dt><dd className="font-bold">{form.noKk || "—"}</dd></div>
            <div><dt className="text-muted-foreground">Tempat / Tgl Lahir:</dt><dd className="font-bold">{form.tempatLahir}, {form.lahir}</dd></div>
            <div><dt className="text-muted-foreground">Jenis Kelamin / Agama:</dt><dd className="font-bold">{form.jenisKelamin} / {form.agama}</dd></div>
            <div><dt className="text-muted-foreground">Asal Sekolah (TK/RA):</dt><dd className="font-bold">{form.asalSekolah}</dd></div>
            <div className="sm:col-span-2"><dt className="text-muted-foreground">Alamat Tinggal:</dt><dd className="font-bold">{form.alamat}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> 2. Data Ayah Kandung
            </h3>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Pencil className="h-3 w-3" /> {t("Ubah Data Ayah", "Edit Father Data")}
            </button>
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
            <div><dt className="text-muted-foreground">Nama Ayah:</dt><dd className="font-bold">{form.namaAyah}</dd></div>
            <div><dt className="text-muted-foreground">Pekerjaan Ayah:</dt><dd className="font-bold">{form.pekerjaanAyah}</dd></div>
            <div><dt className="text-muted-foreground">Penghasilan Ayah:</dt><dd className="font-bold">{form.penghasilanAyah}</dd></div>
            <div><dt className="text-muted-foreground">No. WhatsApp Ayah:</dt><dd className="font-bold">{form.teleponAyah}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <Users className="h-3.5 w-3.5" /> 3. Data Ibu Kandung
            </h3>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Pencil className="h-3 w-3" /> {t("Ubah Data Ibu", "Edit Mother Data")}
            </button>
          </div>
          <dl className="mt-3 grid gap-2 sm:grid-cols-2 text-xs">
            <div><dt className="text-muted-foreground">Nama Ibu:</dt><dd className="font-bold">{form.namaIbu}</dd></div>
            <div><dt className="text-muted-foreground">Pekerjaan Ibu:</dt><dd className="font-bold">{form.pekerjaanIbu}</dd></div>
            <div><dt className="text-muted-foreground">Penghasilan Ibu:</dt><dd className="font-bold">{form.penghasilanIbu}</dd></div>
            <div><dt className="text-muted-foreground">No. HP Ibu:</dt><dd className="font-bold">{form.teleponIbu || "—"}</dd></div>
          </dl>
        </div>

        <div className="rounded-2xl border border-border p-4 bg-muted/20">
          <div className="flex items-center justify-between">
            <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
              {t("Dokumen Terunggah", "Uploaded Files")}
            </dt>
            <button
              type="button"
              onClick={() => setStep(4)}
              className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline"
            >
              <Pencil className="h-3 w-3" /> {t("Ubah Dokumen", "Edit Uploaded Files")}
            </button>
          </div>
          <dd className="mt-2 space-y-1">
            {!(form.dokumenFiles?.length || 0) && form.dokumen.length === 0 ? (
              <p className="text-xs text-muted-foreground">{t("Belum ada dokumen yang diunggah.", "No files uploaded.")}</p>
            ) : (
              (form.dokumenFiles || []).map((doc, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                  <Check className="h-3.5 w-3.5" /> {doc.id} - {doc.name}
                </div>
              ))
            )}
          </dd>
        </div>
      </div>
    </div>
  )}

 {step === 6 && (() => {
 const isTkSd = ["TK", "SD"].includes((form.jenjang || "").toUpperCase());
 const nominalStr = isTkSd ? "Rp 100.000" : "Rp 200.000";
 const jenjangLabel = (form.jenjang || "Sekolah").toUpperCase();

 return (
 <div>
 <h2 className="flex items-center gap-2 text-xl font-bold">
 <Wallet className="h-5 w-5 text-gold" /> 6. {t("Pembayaran Formulir Registrasi & Unggah Struk", "Registration Form Payment & Proof")}
 </h2>
 <p className="mt-2 text-sm text-muted-foreground flex flex-wrap items-center gap-2">
 <span>
 {t(
 `Biaya formulir & registrasi pendaftaran SPMB jenjang ${jenjangLabel} adalah:`,
 `SPMB registration fee for level ${jenjangLabel} is:`
 )}
 </span>
 <span className="font-extrabold text-gold text-base font-mono bg-gold/20 px-3.5 py-1 rounded-full border border-gold/40 shadow-sm">
 {nominalStr}
 </span>
 <span className="text-xs text-muted-foreground">{t("(sekali bayar).", "(one-time fee).")}</span>
 </p>
 <div className="mt-6 grid gap-3 sm:grid-cols-2">
 {[
 { id: "Transfer Bank BSI", label: "Transfer Bank BSI", desc: "BSI 7293687476 a/n Sitti Hamidah" },
 { id: "M-Banking / ATM BSI", label: "M-Banking / ATM BSI", desc: "Transfer ke No. Rekening 7293687476 a/n Sitti Hamidah" },
 ].map((m) => (
 <button
 type="button"
 key={m.id}
 onClick={() =>set("metode", m.id)}
 className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
 form.metode === m.id ? "border-gold bg-gold/10 shadow-gold ring-1 ring-gold/40" : "border-border bg-card hover:border-gold/50"
 }`}
>
 <div className="flex items-center gap-2 font-bold text-sm text-foreground">
 <CreditCard className="h-4 w-4 text-gold" /> {m.label}
 </div>
 <span className="mt-1 text-xs text-muted-foreground">{m.desc}</span>
 </button>
 ))}
 </div>

 <div className="mt-6 rounded-3xl border border-emerald-500/40 bg-gradient-to-br from-emerald-950 via-slate-900 to-navy-deep p-6 text-xs space-y-4 shadow-2xl text-white">
 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-emerald-500/30 pb-4">
 <div className="flex items-center gap-2.5">
 <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
 <Wallet className="h-5 w-5" />
 </div>
 <div>
 <span className="font-extrabold text-emerald-300 text-xs uppercase tracking-wider block">Total Biaya Pendaftaran</span>
 <span className="text-slate-300 text-[11px]">Jenjang {jenjangLabel} (Sekali Bayar)</span>
 </div>
 </div>
 <span className="font-black text-slate-950 font-mono text-xl bg-gold px-4 py-1.5 rounded-xl shadow-md border border-gold/60">
 {nominalStr}
 </span>
 </div>

 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
 <div className="space-y-1">
 <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3 py-0.5 text-[11px] font-bold text-emerald-300 border border-emerald-500/30">
 <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
 {t("Rekening Resmi Pembayaran SPMB (Semua Jenjang)", "Official SPMB Payment Account (All Levels)")}
 </div>
 <div className="mt-2">
 <p className="text-white font-extrabold text-base sm:text-lg tracking-wide">Bank Syariah Indonesia (BSI)</p>
 <p className="font-mono text-2xl sm:text-3xl font-black text-gold tracking-widest mt-0.5 select-all">
 7293687476
 </p>
 <p className="text-slate-200 font-medium text-xs sm:text-sm mt-1">
 Atas Nama: <strong className="text-white font-black">Sitti Hamidah</strong>
 </p>
 </div>
 </div>

 <button
 type="button"
 onClick={() =>{
 navigator.clipboard.writeText("7293687476");
 setCopiedAcc(true);
 setTimeout(() => setCopiedAcc(false), 2500);
 }}
 className={`inline-flex items-center gap-2 rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-wider transition-all self-start sm:self-center shrink-0 shadow-lg ${
 copiedAcc
 ? "bg-emerald-500 text-white shadow-emerald-500/30 scale-105"
 : "bg-gold text-slate-950 hover:bg-yellow-400 shadow-gold/20 hover:scale-105 active:scale-95"
 }`}
>
 {copiedAcc ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
 <span>{copiedAcc ? t("No. Rekening Tersalin!", "Account Number Copied!") : t("Salin No. Rekening", "Copy Account Number")}</span>
 </button>
 </div>

 <div className="border-t border-emerald-500/30 pt-3 text-[11px] text-slate-300 space-y-1">
 <p className="flex items-center gap-1.5 font-medium">
 <span className="text-gold font-bold"></span>
 {t("Catatan: Pembayaran SPMB semua jenjang (TK, SD, SMP, SMA) dilakukan via Transfer Bank BSI ke nomor rekening di atas.", "Note: SPMB payments for all levels are made via BSI Bank Transfer to the account above.")}
 </p>
 </div>
 </div>

 <div className="mt-6 rounded-2xl border border-border bg-card p-6 text-center space-y-3">
 <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold/10 text-gold border border-gold/30">
 <ImageIcon className="h-7 w-7 text-gold" />
 </div>
 <div>
 <p className="text-sm font-bold text-foreground">
 {form.buktiRegUrl ? t("Foto Bukti Transfer Terlampir", "Receipt Photo Attached") : t("Unggah Foto / Screenshot Struk Transfer Pembayaran", "Upload Payment Receipt Photo")}
 </p>
 <p className="text-xs text-muted-foreground mt-0.5">
 {t("Format: JPG, PNG, atau WEBP. Maksimal 5MB.", "Formats: JPG, PNG, or WEBP. Max 5MB.")}
 </p>
 </div>

 <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-gold hover:bg-navy-deep transition-all shadow-md">
 <Upload className="h-4 w-4" />
 <span>{form.buktiRegUrl ? t("Ganti Foto Struk", "Change Receipt Photo") : t("Pilih Foto Struk Transfer", "Select Receipt Photo")}</span>
 <input
 type="file"
 accept="image/*"
 onChange={async (e) => {
 const file = e.target.files?.[0];
 if (!file) return;
 try {
 const compressed = await compressImageFile(file, 900, 0.75);
 set("buktiRegUrl", compressed);
 } catch {
 const reader = new FileReader();
 reader.onload = () => set("buktiRegUrl", reader.result as string);
 reader.readAsDataURL(file);
 }
 }}
 className="hidden"
 />
 </label>

 {!form.buktiRegUrl && (
 <p className="mt-2 text-xs font-extrabold text-destructive">
 * {t("Unggah Foto / Struk Pembayaran WAJIB Diisi", "Upload Receipt Photo is MANDATORY")}
 </p>
 )}

 {form.buktiRegUrl && (
 <div className="mt-3 mx-auto max-w-sm overflow-hidden rounded-2xl border border-emerald-500/40 p-2 bg-emerald-950/20">
 <img src={form.buktiRegUrl} alt="Resi Transfer" className="max-h-44 w-full object-contain rounded-xl" />
 <span className="mt-2 block text-xs font-bold text-emerald-400">✓ Bukti Transfer Siap Dikirim</span>
 </div>
 )}

 {/* Catatan Tambahan (Opsional) */}
 <div className="mt-5 text-left border-t border-border/50 pt-4">
 <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
 <FileText className="h-3.5 w-3.5 text-gold" />
 <span>{t("Catatan Tambahan (Opsional)", "Additional Notes (Optional)")}</span>
 </label>
 <textarea
 rows={2}
 placeholder={t("Tuliskan catatan khusus atau pesan untuk panitia pendaftaran...", "Write any special notes or requests for the admission committee...")}
 value={form.catatanTambahan}
 onChange={(e) => set("catatanTambahan", e.target.value)}
 className="w-full rounded-2xl border border-border bg-background p-3 text-xs focus:border-gold focus:outline-none"
 />
 </div>
 </div>
 </div>
 );
 })()}

 {step === 7 && (
 <div className="relative text-center">
 <Particles count={26} />
 <motion.div
 initial={{ scale: 0 }}
 animate={{ scale: 1 }}
 transition={{ type: "spring", stiffness: 180, damping: 12 }}
 className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gold text-navy-deep"
>
 <Check className="h-10 w-10" />
 </motion.div>
 <h2 className="mt-6 text-2xl font-extrabold">{t("Pendaftaran Berhasil Terkirim!", "Registration Successfully Submitted!")}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {t("Nomor pendaftaran Anda:", "Your registration number:")} <span className="font-bold text-gold text-lg">{submittedRegNo || "ZBT-2026-BERHASIL"}</span>
        </p>
 
 <div className="mx-auto mt-6 max-w-lg rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-gold/10 to-transparent p-5 text-center shadow-lg">
 <p className="text-2xl font-bold text-gold font-serif" dir="rtl">
 شُكْرًا جَزِيْلًا
 </p>
 <p className="mt-1 text-xs font-extrabold text-emerald-400">
 Syukran Jazilan — Terima Kasih Banyak
 </p>
 <p className="mt-2 text-xs font-foreground/90 leading-relaxed italic">
 "Semoga Aba & Umma senantiasa dipermudah rezekinya oleh Allah Subhanahu wa Ta'ala, diberkahi usahanya, dan dibalas dengan kebaikan yang berlimpah. Aamiin Ya Rabbal 'Alamin."
 </p>
 </div>

 <p className="mt-4 text-xs text-muted-foreground">
 {t(
 "Data biodata calon siswa, wali, dan dokumen telah tersimpan aman. Pantau status seleksi & verifikasi di Dashboard Orang Tua.",
 "Candidate student data, parents, and uploaded files are saved safely. Track status in Parent Dashboard."
 )}
 </p>
 <Link
 to="/masuk"
 className="mt-6 inline-block rounded-full bg-navy px-8 py-3.5 text-sm font-bold uppercase tracking-wide text-gold shadow-gold hover:scale-105 transition-all"
>
 {t("Buka Dashboard Orang Tua", "Open Parent Dashboard")}
 </Link>
 </div>
 )}
 </motion.div>
 </AnimatePresence>

 {step < 7 && (
 <div className="mt-10 flex items-center justify-between gap-3">
 <button
 onClick={() =>setStep((s) => Math.max(0, s - 1))}
 disabled={step === 0}
 className="rounded-full border border-border px-6 py-3 text-sm font-bold uppercase tracking-wide disabled:opacity-40"
>
 {t("Kembali", "Back")}
 </button>
 <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
 {saved ? t("Draft tersimpan", "Draft saved") : ""}
 </span>
 <Magnetic>
 <button
 onClick={() =>{
 if (!valid) return;
            if (step === 6) {
              try {
                let activeSession = getCurrentSession();
                if (!activeSession) {
                  activeSession = ensureUserAccountForPPDB(
                    form.wali || form.namaAyah || form.namaIbu || "Orang Tua",
                    form.email || session?.email || `${form.teleponAyah || form.telepon || Date.now()}@parent.pkbm`,
                    form.teleponAyah || form.telepon
                  );
                }
                const userId = activeSession.userId;
                const userEmail = activeSession.email;

                const savedSubmission = savePPDBSubmission({
                  userId,
                  userEmail,
                  jenjang: form.jenjang,
                  nama: form.nama,
                  namaPanggilan: form.namaPanggilan,
                  nikSiswa: form.nikSiswa,
                  noAkta: form.noAkta,
                  noKk: form.noKk,
                  nisn: form.nisn,
                  tempatLahir: form.tempatLahir,
                  lahir: form.lahir,
                  jenisKelamin: form.jenisKelamin,
                  agama: form.agama,
                  suku: form.suku,
                  statusAnak: form.statusAnak,
                  anakKe: form.anakKe,
                  transportasi: form.transportasi,
                  tinggiBadan: form.tinggiBadan,
                  beratBadan: form.beratBadan,
                  riwayatPenyakit: form.riwayatPenyakit,
                  asalSekolah: form.asalSekolah,
                  npsnAsal: form.npsnAsal,
                  alamat: form.alamat,

                  namaAyah: form.namaAyah,
                  nikAyah: form.nikAyah,
                  tempatLahirAyah: form.tempatLahirAyah,
                  tanggalLahirAyah: form.tanggalLahirAyah,
                  pendidikanAyah: form.pendidikanAyah,
                  pekerjaanAyah: form.pekerjaanAyah,
                  penghasilanAyah: form.penghasilanAyah,
                  teleponAyah: form.teleponAyah,
                  kebutuhanKhususAyah: form.kebutuhanKhususAyah,

                  namaIbu: form.namaIbu,
                  nikIbu: form.nikIbu,
                  tempatLahirIbu: form.tempatLahirIbu,
                  tanggalLahirIbu: form.tanggalLahirIbu,
                  pendidikanIbu: form.pendidikanIbu,
                  pekerjaanIbu: form.pekerjaanIbu,
                  penghasilanIbu: form.penghasilanIbu,
                  teleponIbu: form.teleponIbu,

                  wali: form.wali || form.namaAyah || activeSession.name || "Orang Tua",
                  telepon: form.teleponAyah || form.telepon,
                  email: form.email || activeSession.email,
                  dokumen: form.dokumen,
                  dokumenFiles: form.dokumenFiles || [],
                  metode: form.metode || "Transfer Bank BSI",
                  buktiRegUrl: form.buktiRegUrl,
                  catatanTambahan: form.catatanTambahan.trim() || undefined,
                  statusPendaftaran: "Menunggu Verifikasi",
                  statusPembayaran: form.buktiRegUrl ? "Menunggu Konfirmasi" : "Belum Bayar",
                });

                if (savedSubmission?.regNo) {
                  setSubmittedRegNo(savedSubmission.regNo);
                }
              } catch (err) {
                console.error("Error saving SPMB submission:", err);
              } finally {
                const curSession = getCurrentSession();
                if (curSession?.userId) {
                  localStorage.removeItem(getDraftKey(curSession.userId));
                }
                if (session?.userId) {
                  localStorage.removeItem(getDraftKey(session.userId));
                }
                localStorage.removeItem("ppdb-draft-zbt-v2");
                setStep(7);
              }
              return;
            }
 setStep((s) => s + 1);
 }}
 disabled={!valid}
 className="light-sweep rounded-full bg-gradient-to-r from-gold-soft to-gold px-7 py-3 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold disabled:opacity-40"
>
 {step === 5
 ? t("Lanjut ke Pembayaran Form", "Proceed to Payment")
 : step === 6
 ? t("Kirim Pendaftaran & Selesaikan", "Submit & Complete Registration")
 : t("Lanjutkan", "Continue")}
 </button>
 </Magnetic>
 </div>
 )}
 </div>
 </>
 )}
 </div>
 </main>
 );
}
