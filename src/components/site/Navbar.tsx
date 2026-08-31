import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, Globe, Instagram, Menu, Moon, Search, Sun, X, ArrowRight, BookOpen, Sparkles, FileText, Compass, Award, Calendar } from "lucide-react";
import logo from "@/assets/logo.png";
import { BERITA, JENJANG, PROGRAM_UNGGULAN } from "@/lib/school-data";
import { getCurrentSession, subscribeToDB, UserSession } from "@/lib/db";
import { Magnetic } from "./effects";
import { useLanguage } from "@/lib/LanguageContext";

export function Navbar() {
 const [solid, setSolid] = useState(false);
 const [open, setOpen] = useState(false);
 const [mega, setMega] = useState(false);
 const [dark, setDark] = useState(false);
 const { lang, toggleLang, t } = useLanguage();
 const [search, setSearch] = useState(false);
 const [query, setQuery] = useState("");
 const [session, setSession] = useState<UserSession | null>(null);

 const links = [
 { label: t("Beranda", "Home"), hash: "" },
 { label: t("Tentang", "About"), hash: "#tentang" },
 { label: t("Program", "Programs"), hash: "#program" },
 { label: t("Galeri", "Gallery"), hash: "#galeri" },
 { label: t("Prestasi", "Achievements"), hash: "#prestasi" },
 { label: t("Berita", "News"), hash: "#berita" },
 ];

 useEffect(() => {
 setSession(getCurrentSession());
 return subscribeToDB(() => setSession(getCurrentSession()));
 }, []);

 useEffect(() => {
 const onScroll = () => setSolid(window.scrollY> 40);
 onScroll();
 window.addEventListener("scroll", onScroll, { passive: true });
 return () => window.removeEventListener("scroll", onScroll);
 }, []);

 useEffect(() => {
 document.documentElement.classList.toggle("dark", dark);
 }, [dark]);

 useEffect(() => {
 const onKeyDown = (e: KeyboardEvent) => {
 if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
 e.preventDefault();
 setSearch((prev) => !prev);
 }
 if (e.key === "Escape") {
 setSearch(false);
 }
 };
 window.addEventListener("keydown", onKeyDown);
 return () => window.removeEventListener("keydown", onKeyDown);
 }, []);

 // Search Items Registry
 const searchableItems = [
 {
 id: "ppdb",
 title: "Pendaftaran SPMB Online",
 titleEn: "SPMB Online Registration",
 category: "Pendaftaran",
 categoryEn: "Registration",
 desc: "Formulir pendaftaran siswa siswi baru TK, SD, SMP, & SMA online",
 descEn: "Online registration form for TK, SD, SMP, & SMA new students",
 url: "/ppdb",
 badge: "SPMB",
 icon: Sparkles,
 },
 {
 id: "spp",
 title: "Pembayaran SPP & Biaya Pendidikan",
 titleEn: "SPP & School Fee Payment",
 category: "Layanan",
 categoryEn: "Services",
 desc: "Cek tagihan SPP, konfirmasi transfer, & invoice online",
 descEn: "Check SPP bills, transfer confirmation, & online invoices",
 url: "/spp",
 badge: "SPP",
 icon: FileText,
 },
 {
 id: "masuk",
 title: "Portal Masuk & Login User/Admin",
 titleEn: "Sign In & User/Admin Portal",
 category: "Portal",
 categoryEn: "Portal",
 desc: "Login akun siswa siswi, orang tua/wali, atau admin sekolah",
 descEn: "Login for student, parent, or school admin account",
 url: "/masuk",
 badge: "Portal",
 icon: GraduationCap,
 },
 {
 id: "kalender",
 title: "Kalender Akademik & Agenda Sekolah",
 titleEn: "Academic Calendar & School Schedule",
 category: "Informasi",
 categoryEn: "Information",
 desc: "Jadwal libur, ujian, & agenda kegiatan harian siswa siswi",
 descEn: "Holidays, exam schedules, & daily student activities",
 url: "/#kalender",
 badge: "Jadwal",
 icon: Calendar,
 },
 {
 id: "galeri",
 title: "Galeri Dokumentasi & Momen Siswa Siswi",
 titleEn: "Photo Gallery & Student Highlights",
 category: "Dokumentasi",
 categoryEn: "Documentation",
 desc: "Kumpulan foto kegiatan outdoor, wisuda, & perlombaan",
 descEn: "Collection of outdoor activities, graduation & competition photos",
 url: "/#galeri",
 badge: "Galeri",
 icon: Compass,
 },
 {
 id: "prestasi",
 title: "Prestasi & Penghargaan Siswa Siswi PKBM",
 titleEn: "Student Achievements & Awards",
 category: "Prestasi",
 categoryEn: "Achievements",
 desc: "Juara nasional komik digital, O2SN, MTQ, & tahfizh",
 descEn: "National digital comic champions, O2SN, MTQ & tahfizh",
 url: "/#prestasi",
 badge: "Prestasi",
 icon: Award,
 },
 {
 id: "tour",
 title: "Virtual Tour Kampus 360°",
 titleEn: "360° Campus Virtual Tour",
 category: "Fasilitas",
 categoryEn: "Facilities",
 desc: "Jelajahi bangunan TK, kantor PKBM, & lingkungan sekolah",
 descEn: "Explore TK building, PKBM office & school facilities",
 url: "/#tour",
 badge: "Tour 360°",
 icon: Compass,
 },
 ...JENJANG.map((j) => ({
 id: `jenjang-${j.slug}`,
 title: `Jenjang Pendidikan ${j.label}`,
 titleEn: `Education Level ${j.label}`,
 category: "Jenjang",
 categoryEn: "Education Level",
 desc: `${j.usia} — ${j.tagline}`,
 descEn: `${j.usiaEn || j.usia} — ${j.taglineEn || j.tagline}`,
 url: `/jenjang/${j.slug}`,
 badge: j.label,
 icon: GraduationCap,
 })),
 ...PROGRAM_UNGGULAN.map((p, idx) => ({
 id: `program-${idx}`,
 title: p.judul,
 titleEn: p.judulEn || p.judul,
 category: "Program Unggulan",
 categoryEn: "Flagship Program",
 desc: p.deskripsi,
 descEn: p.deskripsiEn || p.deskripsi,
 url: "/#program",
 badge: "Program",
 icon: BookOpen,
 })),
 ...BERITA.map((b, idx) => ({
 id: `berita-${idx}`,
 title: b.title,
 titleEn: b.titleEn || b.title,
 category: "Berita & Pengumuman",
 categoryEn: "News & Announcements",
 desc: b.desc,
 descEn: b.descEn || b.desc,
 url: b.linkUrl || "/#berita",
 badge: "Berita",
 icon: Sparkles,
 })),
 ];

 const filteredResults = query.trim()
 ? searchableItems.filter((item) => {
 const q = query.toLowerCase();
 return (
 item.title.toLowerCase().includes(q) ||
 item.titleEn.toLowerCase().includes(q) ||
 item.desc.toLowerCase().includes(q) ||
 item.descEn.toLowerCase().includes(q) ||
 item.category.toLowerCase().includes(q)
 );
 })
 : searchableItems.slice(0, 6);

 return (
 <motion.header
 initial={{ y: -80, opacity: 0 }}
 animate={{ y: 0, opacity: 1 }}
 transition={{ delay: 2.7, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
 className={`fixed inset-x-0 top-0 z-[80] transition-all duration-500 ${
 solid ? "glass-dark py-2 shadow-luxe" : "bg-transparent py-4"
 }`}
>
 <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5">
 <Link to="/" className="flex items-center gap-3">
 <img src={logo} alt="Logo PKBM Zaid bin Tsabit" width={44} height={44} className="h-11 w-11 object-contain drop-shadow-[0_0_12px_color-mix(in_oklab,var(--gold)_60%,transparent)]" />
 <span className="leading-tight">
 <span className="block text-sm font-extrabold tracking-[0.18em] text-primary-foreground uppercase">PKBM</span>
 <span className="block text-[11px] font-medium tracking-[0.28em] text-gold uppercase">Zaid bin Tsabit</span>
 </span>
 </Link>

 <div className="hidden items-center gap-1 lg:flex">
 {links.map((l) => (
 <a
 key={l.hash}
 href={`${l.hash || "/"}`}
 className="relative rounded-full px-3.5 py-2 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-gold"
>
 {l.label}
 </a>
 ))}

 <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
 <button className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-gold">
 <GraduationCap className="h-4 w-4" /> {t("Jenjang", "Levels")}
 </button>
 <AnimatePresence>
 {mega && (
 <motion.div
 initial={{ opacity: 0, y: 12, filter: "blur(8px)" }}
 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
 exit={{ opacity: 0, y: 8, filter: "blur(6px)" }}
 transition={{ duration: 0.28 }}
 className="glass-dark absolute left-1/2 top-full w-[38rem] -translate-x-1/2 rounded-3xl p-4 shadow-luxe"
>
 <div className="grid grid-cols-2 gap-2">
 {JENJANG.map((j) => (
 <Link
 key={j.slug}
 to="/jenjang/$level"
 params={{ level: j.slug }}
 className="group rounded-2xl border border-white/10 p-4 transition-all hover:border-gold/60 hover:bg-white/5"
>
 <p className="text-sm font-bold text-gold">{t(`Jenjang ${j.label}`, `${j.label} Level`)}</p>
 <p className="text-xs text-primary-foreground/70">{t(j.usia, j.usiaEn || j.usia)}</p>
 <p className="mt-2 text-xs text-primary-foreground/60">{t(j.tagline, j.taglineEn || j.tagline)}</p>
 </Link>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>

 <div className="flex items-center gap-2">
 <button
 aria-label={t("Cari", "Search")}
 title={t("Cari", "Search")}
 onClick={() =>setSearch(true)}
 className="flex items-center gap-2 rounded-full border border-white/15 px-3 py-2 text-xs font-medium text-primary-foreground/80 transition-all hover:border-gold hover:text-gold hover:bg-white/5"
>
 <Search className="h-4 w-4" />
 <span className="hidden sm:inline-block">{t("Cari…", "Search…")}</span>
 </button>
 <button
 aria-label={t("Ubah bahasa", "Change language")}
 onClick={toggleLang}
 className="flex items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
>
 <Globe className="h-3.5 w-3.5" /> {lang}
 </button>
 <button
 aria-label={t("Mode gelap", "Dark mode")}
 onClick={() =>setDark((d) => !d)}
 className="rounded-full border border-white/15 p-2 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
>
 {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
 </button>
 <Link
 to="/spp"
 className="hidden rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 hover:bg-emerald-500 hover:text-navy transition-all md:block"
>
 {t("Pembayaran SPP/ DLL", "Pay SPP / Fees")}
 </Link>
 {!session && (
 <Link
 to="/masuk"
 search={{ tab: "daftar" }}
 className="hidden rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-xs font-bold text-gold transition-colors hover:bg-gold hover:text-navy-deep md:block"
>
 {t("Daftar Akun", "Register Account")}
 </Link>
 )}
 <Link
 to="/masuk"
 className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:border-gold hover:text-gold md:block"
>
 {session
 ? session.role === "admin"
 ? t("Dashboard Admin", "Admin Dashboard")
 : t("Dashboard User", "User Dashboard")
 : t("Masuk Portal", "Sign In")}
 </Link>
 <Magnetic className="hidden md:block">
 <Link
 to="/ppdb"
 className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-5 py-2.5 text-xs font-extrabold tracking-wide text-navy-deep uppercase shadow-gold"
>
 SPMB
 </Link>
 </Magnetic>
 <button
 aria-label="Menu"
 onClick={() =>setOpen((o) => !o)}
 className="rounded-full border border-white/15 p-2 text-primary-foreground lg:hidden"
>
 {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
 </button>
 </div>
 </nav>

 {/* Interactive Command Palette Search Modal */}
 <AnimatePresence>
 {search && (
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={() => setSearch(false)}
 className="fixed inset-0 z-[100] flex items-start justify-center bg-black/75 p-4 pt-16 sm:pt-24 backdrop-blur-md"
>
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: -20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: -20 }}
 transition={{ duration: 0.2 }}
 onClick={(e) => e.stopPropagation()}
 className="relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/20 bg-slate-900/95 p-5 text-white shadow-2xl backdrop-blur-2xl"
>
 {/* Input Header */}
 <div className="flex items-center gap-3 border-b border-white/10 pb-4">
 <Search className="h-5 w-5 text-gold shrink-0" />
 <input
 autoFocus
 value={query}
 onChange={(e) => setQuery(e.target.value)}
 placeholder={t("Ketik pencarian: program, SPP, SPMB, jenjang, berita…", "Type to search: program, SPP, SPMB, level, news…")}
 className="w-full bg-transparent text-sm sm:text-base text-white placeholder:text-slate-400 focus:outline-none"
 />
 {query && (
 <button
 onClick={() =>setQuery("")}
 className="rounded-full p-1 text-slate-400 hover:bg-white/10 hover:text-white"
>
 <X className="h-4 w-4" />
 </button>
 )}
 <button
 onClick={() =>setSearch(false)}
 className="rounded-xl border border-white/15 px-2.5 py-1 text-xs font-semibold text-slate-300 hover:bg-white/10 hover:text-white"
>
 ESC
 </button>
 </div>

 {/* Category Label */}
 <div className="mt-4 flex items-center justify-between px-1">
 <span className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
 {query.trim()
 ? t(`Hasil Pencarian (${filteredResults.length})`, `Search Results (${filteredResults.length})`)
 : t("Rekomendasi Utama", "Quick Suggestions")}
 </span>
 <span className="text-[11px] text-slate-500 hidden sm:inline-block">
 {t("Gunakan pencarian cepat PKBM", "Fast PKBM Search")}
 </span>
 </div>

 {/* Results List */}
 <div className="mt-3 max-h-[60vh] space-y-2 overflow-y-auto pr-1">
 {filteredResults.length> 0 ? (
 filteredResults.map((item) => {
 const ItemIcon = item.icon || BookOpen;
 return (
 <a
 key={item.id}
 href={item.url}
 onClick={() => {
 setSearch(false);
 setQuery("");
 }}
 className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-3.5 transition-all hover:border-gold/60 hover:bg-gold/10"
>
 <div className="flex items-center gap-3 min-w-0">
 <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/10 text-gold group-hover:bg-gold group-hover:text-slate-950 transition-colors">
 <ItemIcon className="h-5 w-5" />
 </div>
 <div className="min-w-0">
 <div className="flex items-center gap-2 flex-wrap">
 <p className="text-sm font-bold text-white group-hover:text-gold transition-colors truncate">
 {t(item.title, item.titleEn)}
 </p>
 <span className="rounded-full border border-gold/30 bg-gold/10 px-2 py-0.5 text-[10px] font-extrabold text-gold uppercase">
 {t(item.badge, item.categoryEn)}
 </span>
 </div>
 <p className="mt-0.5 text-xs text-slate-300 truncate">
 {t(item.desc, item.descEn)}
 </p>
 </div>
 </div>
 <ArrowRight className="h-4 w-4 text-slate-400 shrink-0 group-hover:translate-x-1 group-hover:text-gold transition-all ml-2" />
 </a>
 );
 })
 ) : (
 <div className="py-12 text-center text-slate-400">
 <Search className="mx-auto h-8 w-8 text-slate-500 opacity-50" />
 <p className="mt-3 text-sm font-semibold text-slate-300">
 {t(`Tidak ada hasil untuk "${query}"`, `No results found for "${query}"`)}
 </p>
 <p className="mt-1 text-xs text-slate-500">
 {t("Coba kata kunci lain seperti: SPP, SPMB, TK, Coding, Tahfizh", "Try searching: SPP, SPMB, TK, Coding, Tahfizh")}
 </p>
 </div>
 )}
 </div>
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>

 <AnimatePresence>
 {open && (
 <motion.div
 initial={{ opacity: 0, y: -12 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, y: -12 }}
 className="glass-dark mx-4 mt-3 rounded-3xl p-4 lg:hidden"
>
 <div className="flex flex-col gap-1">
 {links.map((l) => (
 <a
 key={l.hash}
 href={l.hash || "/"}
 onClick={() => setOpen(false)}
 className="rounded-xl px-3 py-2.5 text-sm text-primary-foreground/85 hover:bg-white/5 hover:text-gold"
>
 {l.label}
 </a>
 ))}
 {JENJANG.map((j) => (
 <Link
 key={j.slug}
 to="/jenjang/$level"
 params={{ level: j.slug }}
 onClick={() => setOpen(false)}
 className="rounded-xl px-3 py-2.5 text-sm text-primary-foreground/85 hover:bg-white/5 hover:text-gold"
>
 {t(`Jenjang ${j.label}`, `${j.label} Level`)}
 </Link>
 ))}
 <div className="mt-2 flex items-center justify-between border-t border-white/10 pt-3">
 <span className="text-xs text-primary-foreground/70">{t("Bahasa", "Language")}</span>
 <button
 onClick={toggleLang}
 className="flex items-center gap-1 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-bold text-gold"
>
 <Globe className="h-3.5 w-3.5" /> {lang === "ID" ? "Bahasa Indonesia" : "English"}
 </button>
 </div>
 <Link
 to="/spp"
 onClick={() => setOpen(false)}
 className="mt-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2.5 text-center text-sm font-bold text-emerald-400"
>
 {t("Pembayaran SPP/ DLL", "Pay SPP / Fees")}
 </Link>
 <Link
 to="/ppdb"
 onClick={() => setOpen(false)}
 className="mt-2 rounded-xl bg-gold px-3 py-2.5 text-center text-sm font-bold text-navy-deep"
>
 {t("Daftar SPMB", "Apply SPMB")}
 </Link>
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </motion.header>
 );
}

