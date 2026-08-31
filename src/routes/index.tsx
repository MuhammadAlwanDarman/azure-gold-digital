import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
 Award,
 BookOpenCheck,
 Calendar,
 CheckCircle2,
 ChevronDown,
 ChevronLeft,
 ChevronRight,
 Compass,
 Cpu,
 ExternalLink,
 GraduationCap,
 Instagram,
 LogIn,
 MapPin,
 Play,
 Quote,
 ShieldAlert,
 Sparkles,
 Star,
 Trophy,
 UserPlus,
 Users,
} from "lucide-react";
import heroImg from "@/assets/hero-campus.png";
import bangunanTkImg from "@/assets/bangunan-tk.png";
import kantorStpiImg from "@/assets/kantor-stpi.png";
import ruanganKelasItImg from "@/assets/ruangan-kelas-it.png";
import kantorTkImg from "@/assets/kantor-tk.png";
import profileVideo from "@/assets/stpi-profile.mp4";
import {
 ALUMNI,
 BERITA,
 GALERI,
 GALERI_FILTER,
 JENJANG,
 KALENDER,
 KALENDER_BULAN,
 PRESTASI,
 PROGRAM_UNGGULAN,
 SCHOOL,
 STATS,
 TIMELINE,
} from "@/lib/school-data";
import {
 AuroraBackground,
 Counter,
 Magnetic,
 Particles,
 Reveal,
 Stagger,
 StaggerItem,
 Tilt,
 useParallax,
 useScrollFade,
} from "@/components/site/effects";
import { useLanguage } from "@/lib/LanguageContext";
import { getCurrentSession, subscribeToDB, UserSession } from "@/lib/db";

export const Route = createFileRoute("/")({
 head: () => ({
 meta: [
 { title: "PKBM Zaid bin Tsabit — Pusat Kegiatan Belajar Masyarakat Teknologi Unggulan" },
 {
 name: "description",
 content:
 "PKBM Zaid bin Tsabit: pusat kegiatan belajar masyarakat modern jenjang TK, SD, SMP, SMA dengan program tahfizh, coding, robotik, dan AI. SPMB online kini dibuka.",
 },
 { property: "og:title", content: "PKBM Zaid bin Tsabit — Pusat Kegiatan Belajar Masyarakat Teknologi Unggulan" },
 {
 property: "og:description",
 content: "PKBM Zaid bin Tsabit: pusat kegiatan belajar masyarakat modern jenjang TK, SD, SMP, SMA dengan program tahfizh, coding, robotik, dan AI. SPMB online kini dibuka.",
 },
 { property: "og:type", content: "website" },
 { name: "twitter:card", content: "summary_large_image" },
 ],
 }),
 component: Home,
});

function SectionTitle({ eyebrow, title, desc }: { eyebrow: string; title: string; desc?: string }) {
 return (
 <div className="mx-auto max-w-2xl text-center">
 <Reveal variant="blur">
 <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
 <Sparkles className="h-3.5 w-3.5" /> {eyebrow}
 </span>
 </Reveal>
 <Reveal variant="up" delay={0.08}>
 <h2 className="mt-5 text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">{title}</h2>
 </Reveal>
 {desc && (
 <Reveal variant="up" delay={0.16}>
 <p className="mt-4 text-base text-muted-foreground">{desc}</p>
 </Reveal>
 )}
 </div>
 );
}

function Hero() {
 const ref = useRef<HTMLElement>(null);
 const { x, y } = useParallax(26);
 const fade = useScrollFade(ref);
 const { t } = useLanguage();
 const [session, setSession] = useState<UserSession | null>(null);

 useEffect(() => {
 setSession(getCurrentSession());
 return subscribeToDB(() => setSession(getCurrentSession()));
 }, []);

 return (
 <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-navy-deep">
 <motion.div className="absolute inset-0" style={{ x, y, scale: 1.08 }}>
 <img src={heroImg} alt="Gedung dan Gerbang PKBM Zaid bin Tsabit" width={1920} height={1088} className="h-full w-full object-cover" />
 </motion.div>
 <div className="absolute inset-0 bg-gradient-to-b from-navy-deep/85 via-navy-deep/70 to-navy-deep" />
 <div className="surface-aurora absolute inset-0 opacity-40" />
 <Particles count={30} />

 <motion.div style={fade} className="relative mx-auto w-full max-w-7xl px-5 pt-32 text-primary-foreground">
 <motion.span
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 2.9, duration: 0.8 }}
 className="glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold tracking-widest uppercase"
>
 <Star className="h-3.5 w-3.5 text-gold" /> {t("Terakreditasi B · Pusat Kegiatan Belajar Masyarakat", "Accredited B · Community Learning Center")}
 </motion.span>

 <motion.h1
 initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
 animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
 transition={{ delay: 3.05, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
 className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
>
 {t("Akhlak", "Quranic Character &")} <span className="text-gold-gradient animate-shimmer">{t("Qurani", "Quranic Ethics")}</span> {t("Skill Teknologi", "Technology Skills")}
 </motion.h1>

 <motion.p
 initial={{ opacity: 0, y: 26 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 3.35, duration: 0.9 }}
 className="mt-6 max-w-2xl text-base text-primary-foreground/75 sm:text-lg"
>
 {t(SCHOOL.motto, SCHOOL.mottoEn)}
 </motion.p>

 <motion.div
 initial={{ opacity: 0, y: 26 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 3.5, duration: 0.9 }}
 className="mt-9 flex flex-wrap gap-3"
>
 <Magnetic>
 <Link
 to="/ppdb"
 className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-7 py-4 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold"
>
 {t("Daftar Sekarang", "Apply Now")}
 </Link>
 </Magnetic>
 </motion.div>

 {/* Dynamic PPDB Account Requirement Banner */}
 {!session ? (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 3.6, duration: 0.8 }}
 className="mt-8 max-w-3xl rounded-3xl border border-gold/40 bg-navy-deep/90 p-5 shadow-2xl backdrop-blur-md"
>
 <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
 <div className="flex items-start gap-3.5">
 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gold/20 text-gold border border-gold/30">
 <UserPlus className="h-6 w-6" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="rounded-full bg-gold/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold">
 {t("Penting", "Notice")}
 </span>
 <p className="text-sm font-bold text-white">
 {t("Wajib Buat Akun Sebelum Mengisi Pendaftaran", "Must Create Account Before Registering")}
 </p>
 </div>
 <p className="mt-1 text-xs text-primary-foreground/75 leading-relaxed">
 {t(
 "Untuk mengisi pendaftaran SPMB Online, Anda harus **membuat akun orang tua terlebih dahulu** agar formulir & status seleksi tersimpan selamanya.",
 "To complete the SPMB Online registration, you must **create a parent account first** so your application & status are saved."
 )}
 </p>
 </div>
 </div>
 <div className="flex w-full sm:w-auto shrink-0 gap-2">
 <Link
 to="/masuk"
 search={{ tab: "daftar" }}
 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl bg-gold px-4 py-2.5 text-xs font-bold text-navy-deep hover:bg-gold-soft transition-colors shadow-gold"
>
 <UserPlus className="h-3.5 w-3.5" />
 {t("Buat Akun", "Create Account")}
 </Link>
 <Link
 to="/masuk"
 search={{ tab: "masuk" }}
 className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs font-semibold text-white hover:bg-white/20 transition-colors"
>
 <LogIn className="h-3.5 w-3.5" />
 {t("Masuk", "Log In")}
 </Link>
 </div>
 </div>
 </motion.div>
 ) : (
 <motion.div
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 3.6, duration: 0.8 }}
 className="mt-8 inline-flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-950/40 p-3 px-4.5 backdrop-blur-md"
>
 <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
 <div className="text-xs">
 <span className="font-bold text-emerald-300">
 {t("Akun Aktif", "Account Active")}: {session.name}
 </span>
 <span className="ml-2 text-primary-foreground/75">
 — {t("Anda sudah memiliki akun & siap mengisi Pendaftaran SPMB.", "You have an active account & are ready for SPMB registration.")}
 </span>
 </div>
 </motion.div>
 )}

 <motion.div
 initial={{ opacity: 0, y: 40 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.8, duration: 0.8 }}
 className="mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
>
 {STATS.map((s, i) => (
 <Tilt key={s.label} className="glass animate-float rounded-2xl p-4">
 <div style={{ animationDelay: `${i * 0.4}s` }}>
 <p className="text-2xl font-extrabold text-gold">
 <Counter to={s.value} suffix={s.suffix} />
 </p>
 <p className="mt-1 text-[11px] uppercase tracking-widest text-primary-foreground/60">{t(s.label, s.labelEn)}</p>
 </div>
 </Tilt>
 ))}
 </motion.div>

 <motion.a
 href="#tentang"
 animate={{ y: [0, 10, 0] }}
 transition={{ duration: 2, repeat: Infinity }}
 className="mt-14 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-primary-foreground/60"
>
 {t("Gulir", "Scroll")} <ChevronDown className="h-4 w-4 text-gold" />
 </motion.a>
 </motion.div>
 </section>
 );
}

function Tentang() {
 const { t } = useLanguage();
 const [isPlaying, setIsPlaying] = useState(false);
 const videoRef = useRef<HTMLVideoElement>(null);

 const handlePlay = () => {
 setIsPlaying(true);
 setTimeout(() => {
 if (videoRef.current) {
 videoRef.current.play().catch(() => {});
 }
 }, 50);
 };

 return (
 <section id="tentang" className="relative overflow-hidden py-28">
 <AuroraBackground />
 <div className="relative mx-auto max-w-7xl px-5">
 <SectionTitle
 eyebrow={t("Tentang Sekolah", "About School")}
 title={t("Warisan Ilmu, Masa Depan Teknologi", "Heritage of Knowledge, Future of Technology")}
 desc={t(
 "5 dekade membina siswa siswi berprestasi dengan hafalan kuat, akhlak mulia, dan keterampilan digital yang relevan.",
 "Five decades of nurturing accomplished students with strong memorization, noble character, and relevant digital skills."
 )}
 />

 <div className="mt-16 grid gap-10 lg:grid-cols-2">
 <Reveal variant="left">
 <div className="relative overflow-hidden rounded-3xl shadow-luxe bg-slate-900 border border-gold/30">
 {!isPlaying ? (
 <div
 onClick={handlePlay}
 className="group relative cursor-pointer overflow-hidden rounded-3xl h-[360px] sm:h-[440px] w-full"
 title="Klik untuk memutar Video Profil PKBM Zaid bin Tsabit"
>
 <img
 src={heroImg}
 alt="Profil kampus PKBM Zaid bin Tsabit"
 loading="lazy"
 width={1920}
 height={1088}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
 />
 <div className="absolute inset-0 flex flex-col items-center justify-center bg-navy-deep/45 backdrop-blur-[1px] transition-all group-hover:bg-navy-deep/30">
 <span className="glass flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground shadow-2xl transition-transform duration-300 group-hover:scale-110 ring-4 ring-gold/40">
 <Play className="h-8 w-8 text-gold ml-1 animate-pulse" />
 </span>
 <span className="mt-4 rounded-full bg-gold/90 px-4 py-1.5 text-xs font-extrabold text-navy-deep shadow-xl border border-white/40">
 {t("Klik untuk Memutar Video Profil", "Click to Play Profile Video")}
 </span>
 </div>
 </div>
 ) : (
 <video
 ref={videoRef}
 src={profileVideo}
 controls
 autoPlay
 playsInline
 className="h-[360px] sm:h-[440px] w-full rounded-3xl object-cover"
 />
 )}
 </div>
 </Reveal>

 <div className="space-y-6">
 {TIMELINE.map((item, i) => (
 <Reveal key={item.year} variant="right" delay={i * 0.08}>
 <div className="relative flex gap-5 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur transition-all hover:border-gold/60 hover:shadow-luxe">
 <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-xs font-extrabold text-gold">
 {item.year}
 </div>
 <div>
 <h3 className="font-bold">{t(item.title, item.titleEn)}</h3>
 <p className="mt-1 text-sm text-muted-foreground">{t(item.desc, item.descEn)}</p>
 </div>
 </div>
 </Reveal>
 ))}
 </div>
 </div>
 </div>
 </section>
 );
}

function JenjangSection() {
 const icons = [BookOpenCheck, Users, Cpu, Award];
 const { t } = useLanguage();

 return (
 <section id="jenjang" className="relative overflow-hidden bg-navy py-28 text-primary-foreground">
 <Particles count={22} />
 <div className="relative mx-auto max-w-7xl px-5">
 <div className="mx-auto max-w-2xl text-center">
 <Reveal variant="blur">
 <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
 <Compass className="h-3.5 w-3.5" /> {t("Jenjang Pendidikan", "Education Levels")}
 </span>
 </Reveal>
 <Reveal variant="up" delay={0.08}>
 <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">
 {t("Satu Kampus, Empat Jenjang Unggulan", "One Campus, Four Premier Education Levels")}
 </h2>
 </Reveal>
 </div>

 <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
 {JENJANG.map((j, i) => {
 const Icon = icons[i % icons.length]!;
 return (
 <StaggerItem key={j.slug}>
 <Tilt className="h-full">
 <Link
 to="/jenjang/$level"
 params={{ level: j.slug }}
 className="group relative block h-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-5 transition-all duration-500 hover:-translate-y-3 hover:border-gold/70 hover:shadow-gold flex flex-col justify-between"
>
 <div>
 <div className="relative h-44 w-full overflow-hidden rounded-2xl mb-4 border border-white/10">
 <img
 src={j.gambar}
 alt={`Jenjang ${j.label}`}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/30 to-transparent" />
 <div className="absolute bottom-3 left-3 flex items-center gap-2">
 <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold text-navy-deep font-extrabold shadow-md">
 <Icon className="h-4 w-4" />
 </div>
 <span className="rounded-full bg-black/60 backdrop-blur-md px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-gold border border-gold/30">
 {t(j.usia, j.usiaEn || j.usia)}
 </span>
 </div>
 </div>
 <h3 className="text-3xl font-extrabold text-white group-hover:text-gold transition-colors">{t(j.label, j.labelEn || j.label)}</h3>
 <p className="mt-2 text-sm text-primary-foreground/75 leading-relaxed">{t(j.tagline, j.taglineEn || j.tagline)}</p>
 </div>
 <span className="mt-5 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-gold transition-all group-hover:translate-x-1">
 {t("Lihat Detail Jenjang", "View Level Details")} &rarr;
 </span>
 </Link>
 </Tilt>
 </StaggerItem>
 );
 })}
 </Stagger>
 </div>
 </section>
 );
}

function Program() {
 const { t } = useLanguage();

 return (
 <section id="program" className="relative overflow-hidden py-28">
 <AuroraBackground />
 <div className="relative mx-auto max-w-7xl px-5">
 <SectionTitle
 eyebrow={t("Program Unggulan", "Featured Programs")}
 title={t("Kurikulum Qurani Berpadu Teknologi", "Quranic Curriculum Combined with Tech")}
 desc={t(
 "Empat belas program pilihan yang membentuk hafalan, karakter, dan keahlian digital siswa.",
 "Fourteen selected programs shaping memorization, character, and students' digital skills."
 )}
 />
 <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {PROGRAM_UNGGULAN.map((p) => (
 <StaggerItem key={p.title}>
 <Tilt className="group h-full rounded-3xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-2 hover:border-gold/70 hover:shadow-luxe flex flex-col justify-between">
 <div>
 <div className="relative flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl bg-white p-1.5 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:shadow-md border border-border">
 {p.icon ? (
 <img src={p.icon} alt={p.title} className="h-full w-full object-contain" />
 ) : (
 <Sparkles className="h-6 w-6 text-gold" />
 )}
 </div>
 <h3 className="mt-5 font-bold text-lg text-foreground group-hover:text-navy transition-colors">{t(p.title, p.titleEn)}</h3>
 <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(p.desc, p.descEn)}</p>
 </div>
 </Tilt>
 </StaggerItem>
 ))}
 </Stagger>
 </div>
 </section>
 );
}

function VirtualTour() {
 const [spot, setSpot] = useState(0);
 const { t } = useLanguage();

 const spots = [
 {
 name: t("Kantor PKBM ZAID BIN TSABIT", "PKBM ZAID BIN TSABIT Office"),
 desc: t("Pusat administrasi, layanan informasi, dan pelayanan utama PKBM Zaid bin Tsabit.", "Main administration center, information services, and management of PKBM Zaid bin Tsabit."),
 image: kantorStpiImg,
 },
 {
 name: t("Kantor TK Zaid Bin Tsabit", "TK Zaid Bin Tsabit Office"),
 desc: t("Pusat layanan informasi, administrasi, dan pelayanan jenjang TK PKBM Zaid bin Tsabit.", "Information service center, administration, and management for TK level at PKBM Zaid bin Tsabit."),
 image: kantorTkImg,
 },
 {
 name: t("Ruangan Kelas IT", "IT Classroom"),
 desc: t("Fasilitas laboratorium komputer dan ruangan kelas IT modern PKBM Zaid bin Tsabit.", "Computer lab and modern IT classroom facility at PKBM Zaid bin Tsabit."),
 image: ruanganKelasItImg,
 },
 ];

 return (
 <section id="tour" className="relative overflow-hidden bg-navy-deep py-28 text-primary-foreground">
 <Particles count={20} />
 <div className="relative mx-auto max-w-7xl px-5">
 <div className="grid items-center gap-12 lg:grid-cols-2">
 <Reveal variant="left">
 <h2 className="text-3xl font-extrabold sm:text-5xl">
 {t("Jelajahi Kampus Tanpa Meninggalkan Rumah", "Explore Campus Without Leaving Home")}
 </h2>
 <p className="mt-4 text-primary-foreground/70">
 {t("Klik titik interaktif untuk melihat detail setiap fasilitas unggulan kami.", "Click interactive hotspots to view details of our top facilities.")}
 </p>
 <div className="mt-8 space-y-3">
 {spots.map((s, i) => (
 <button
 key={s.name}
 onClick={() =>setSpot(i)}
 className={`w-full rounded-2xl border p-4 text-left transition-all ${
 spot === i ? "border-gold bg-gold/10" : "border-white/12 hover:border-gold/50"
 }`}
>
 <p className="text-sm font-bold">{s.name}</p>
 {spot === i && s.desc && <p className="mt-1 text-xs text-primary-foreground/70">{s.desc}</p>}
 </button>
 ))}
 </div>
 </Reveal>

 <Reveal variant="right">
 <Tilt className="relative overflow-hidden rounded-3xl border border-white/15 shadow-luxe">
 <img
 key={spot}
 src={spots[spot]?.image || heroImg}
 alt={spots[spot]?.name || "Tur virtual kampus"}
 loading="lazy"
 width={1920}
 height={1088}
 className="h-[26rem] w-full object-cover transition-all duration-500"
 />
 <div className="absolute inset-0 bg-navy-deep/20" />
 <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl p-4">
 <p className="text-sm font-bold text-gold">{spots[spot]!.name}</p>
 <p className="text-xs text-primary-foreground/80">{spots[spot]!.desc}</p>
 </div>
 </Tilt>
 </Reveal>
 </div>
 </div>
 </section>
 );
}

function Galeri() {
 const [filter, setFilter] = useState("Semua");
 const { t } = useLanguage();

 const items = GALERI.filter((g) => filter === "Semua" || g.kategori === filter);

 return (
 <section id="galeri" className="relative py-28">
 <div className="mx-auto max-w-7xl px-5">
 <SectionTitle eyebrow={t("Galeri", "Gallery")} title={t("Momen Terbaik Sekolah Kami", "Best Moments of Our School")} />
 <Reveal variant="up" className="mt-10 flex flex-wrap justify-center gap-2">
 <div className="flex flex-wrap justify-center gap-2">
 {GALERI_FILTER.map((f) => (
 <button
 key={f.id}
 onClick={() =>setFilter(f.id)}
 className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
 filter === f.id ? "border-gold bg-gold text-navy-deep" : "border-border hover:border-gold hover:text-gold"
 }`}
>
 {t(f.id, f.en)}
 </button>
 ))}
 </div>
 </Reveal>

 <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
 {items.map((g, i) => (
 <Reveal key={g.judul} variant="scale" delay={(i % 4) * 0.06} className="mb-5 break-inside-avoid">
 <div className={`group relative overflow-hidden rounded-3xl ${g.h}`}>
 <img
 src={g.gambar || heroImg}
 alt={g.judul}
 loading="lazy"
 width={1920}
 height={1088}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
 />
 <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent opacity-80" />
 <div className="absolute bottom-4 left-4 text-primary-foreground">
 <p className="text-xs uppercase tracking-widest text-gold">{t(g.kategori, g.kategoriEn)}</p>
 <p className="font-bold">{t(g.judul, g.judulEn)}</p>
 </div>
 </div>
 </Reveal>
 ))}
 </div>
 </div>
 </section>
 );
}

function Prestasi() {
 const [jenjangFilter, setJenjangFilter] = useState("Semua");
 const [levelFilter, setLevelFilter] = useState("Semua");
 const { t } = useLanguage();

 const jenjangCategories = [
 { id: "Semua", label: t("Semua Jenjang", "All Levels"), icon: "" },
 { id: "TK", label: t("Jenjang TK", "TK Kindergarten"), icon: "" },
 { id: "SD", label: t("Jenjang Setara SD", "Setara SD Elementary"), icon: "" },
 { id: "SMP & SMA", label: t("Jenjang Setara SMP & Setara SMA", "Setara SMP & Setara SMA"), icon: "" },
 ];

 const levelCategories = [
 { id: "Semua", label: t("Semua Tingkat", "All Tiers") },
 { id: "Internasional", label: t("Internasional", "International") },
 { id: "Nasional", label: t("Nasional", "National") },
 { id: "Provinsi", label: t("Provinsi", "Provincial") },
 { id: "Kota", label: t("Kota", "City Level") },
 { id: "Kecamatan", label: t("Kecamatan", "Sub-District") },
 ];

 const items = PRESTASI.filter((p) => {
 const matchJenjang = jenjangFilter === "Semua" || p.jenjang === jenjangFilter;
 const matchLevel = levelFilter === "Semua" || p.level === levelFilter;
 return matchJenjang && matchLevel;
 });

 return (
 <section id="prestasi" className="relative overflow-hidden bg-mist py-28">
 <AuroraBackground />
 <div className="relative mx-auto max-w-7xl px-5">
 <SectionTitle eyebrow={t("Prestasi", "Achievements")} title={t("Jejak Kemenangan Siswa Siswi Kami", "Our Students' Victory Record")} />

 {/* Tier 1: Filter Jenjang Utama */}
 <div className="mt-10 flex flex-wrap justify-center gap-2.5">
 {jenjangCategories.map((c) => (
 <button
 key={c.id}
 onClick={() =>setJenjangFilter(c.id)}
 className={`rounded-full border px-5 py-2.5 text-xs font-bold tracking-wider transition-all duration-300 ${
 jenjangFilter === c.id
 ? "border-gold bg-gold text-navy-deep shadow-luxe scale-105"
 : "border-border bg-card/60 hover:border-gold hover:text-gold"
 }`}
>
 {c.icon} {c.label}
 </button>
 ))}
 </div>

 {/* Tier 2: Sub-filter Tingkat Kejuaraan (Bercabang) */}
 <div className="mt-4 flex flex-wrap items-center justify-center gap-2 rounded-2xl bg-card/80 p-3 max-w-3xl mx-auto border border-border shadow-sm backdrop-blur-sm">
 <span className="text-[11px] font-extrabold uppercase tracking-widest text-gold px-2 shrink-0">
 {t("Tingkat Kejuaraan:", "Award Level:")}
 </span>
 {levelCategories.map((l) => (
 <button
 key={l.id}
 onClick={() =>setLevelFilter(l.id)}
 className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all ${
 levelFilter === l.id
 ? "bg-gold/20 text-gold font-bold border border-gold/40 shadow-sm"
 : "text-muted-foreground hover:text-gold hover:bg-white/5"
 }`}
>
 {l.label}
 </button>
 ))}
 </div>

 {/* Container Daftar Prestasi / Empty State */}
 <div className="relative mx-auto mt-14 max-w-3xl min-h-[160px]">
 {items.length === 0 ? (
 <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-card/40 py-14 text-center">
 <Trophy className="h-10 w-10 text-gold/40 mb-3" />
 <p className="text-sm font-bold text-foreground">
 {t("Belum ada data kejuaraan untuk kombinasi kategori ini.", "No competition records found for this category combination.")}
 </p>
 <button
 onClick={() =>{
 setJenjangFilter("Semua");
 setLevelFilter("Semua");
 }}
 className="mt-4 rounded-full bg-gold/15 px-4 py-1.5 text-xs font-bold text-gold hover:bg-gold hover:text-navy-deep transition-all"
>
 {t("Reset Filter", "Reset Filter")}
 </button>
 </div>
 ) : (
 <>
 <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold via-gold/40 to-transparent md:left-1/2" />
 {items.map((p, i) => (
 <Reveal key={p.title + p.year + i} variant={i % 2 ? "right" : "left"} delay={i * 0.04}>
 <div className="relative mb-6 ml-12 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-gold hover:shadow-luxe md:ml-0 md:w-1/2 md:odd:mr-auto md:odd:pr-10 md:even:ml-auto md:even:pl-10">
 <span className="absolute -left-[2.15rem] top-6 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep md:hidden">
 <Trophy className="h-3 w-3" />
 </span>
 <div className="flex flex-wrap items-center gap-2">
 <span className="rounded-full bg-gold/15 px-2.5 py-0.5 text-[10px] font-extrabold text-gold uppercase tracking-wider border border-gold/30">
 {p.jenjang}
 </span>
 <span className="rounded-full bg-navy-deep/10 dark:bg-white/10 px-2.5 py-0.5 text-[10px] font-bold text-foreground uppercase tracking-wider border border-border">
 {t(p.level, p.levelEn)}
 </span>
 {p.year && (
 <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-auto">
 {p.year}
 </span>
 )}
 </div>
 <p className="mt-2.5 font-bold text-sm text-foreground leading-snug">{t(p.title, p.titleEn)}</p>
 </div>
 </Reveal>
 ))}
 </>
 )}
 </div>
 </div>
 </section>
 );
}



function Berita() {
 const { t } = useLanguage();

 return (
 <section id="berita" className="relative overflow-hidden bg-mist py-28">
 <div className="mx-auto max-w-7xl px-5">
 <SectionTitle eyebrow={t("Berita & Agenda", "News & Events")} title={t("Kabar Terbaru dari Kampus", "Latest News from Campus")} />
 <div className="mt-14 grid gap-6 lg:grid-cols-3">
 <div className="lg:col-span-2 space-y-5">
 {BERITA.map((b, i) => (
 <Reveal key={b.title} variant="up" delay={i * 0.06}>
 <article className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 transition-all hover:border-gold hover:shadow-luxe sm:flex-row">
 <div className="h-36 w-full overflow-hidden rounded-2xl sm:w-52">
 <img
 src={b.gambar || heroImg}
 alt={b.title}
 loading="lazy"
 width={1920}
 height={1088}
 className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 </div>
 <div className="flex-1">
 <span className="rounded-full bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
 {t(b.kategori, b.kategoriEn)}
 </span>
 <h3 className="mt-3 text-lg font-bold leading-snug">{t(b.title, b.titleEn)}</h3>
 {b.desc && (
 <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{t(b.desc, b.descEn)}</p>
 )}
 {b.date && (
 <p className="mt-2 text-xs text-muted-foreground">{t(b.date, b.dateEn)}</p>
 )}

 {b.linkUrl && (
 <a
 href={b.linkUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="mt-3.5 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold-soft to-gold px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all"
>
 <span>{t(b.linkText || "Daftar Sekarang", b.linkTextEn || "Register Now")}</span>
 <ExternalLink className="h-3.5 w-3.5" />
 </a>
 )}
 </div>
 </article>
 </Reveal>
 ))}
 </div>

 <Reveal variant="right">
 <AcademicCalendarWidget />
 </Reveal>
 </div>
 </div>
 </section>
 );
}

function AcademicCalendarWidget() {
 const { t } = useLanguage();
 const [activeBulanIdx, setActiveBulanIdx] = useState(0);
 const [showOnlyEvents, setShowOnlyEvents] = useState(false);
 const scrollRef = useRef<HTMLDivElement>(null);
 const isMouseDownRef = useRef(false);
 const startXRef = useRef(0);
 const scrollLeftRef = useRef(0);

 const scrollMonths = (direction: "left" | "right") => {
 if (scrollRef.current) {
 const scrollAmount = direction === "left" ? -140 : 140;
 scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
 }
 };

 const handleMouseDown = (e: React.MouseEvent) => {
 if (!scrollRef.current) return;
 isMouseDownRef.current = true;
 startXRef.current = e.pageX - scrollRef.current.offsetLeft;
 scrollLeftRef.current = scrollRef.current.scrollLeft;
 };

 const handleMouseLeaveOrUp = () => {
 isMouseDownRef.current = false;
 };

 const handleMouseMove = (e: React.MouseEvent) => {
 if (!isMouseDownRef.current || !scrollRef.current) return;
 e.preventDefault();
 const x = e.pageX - scrollRef.current.offsetLeft;
 const walk = (x - startXRef.current) * 1.5;
 scrollRef.current.scrollLeft = scrollLeftRef.current - walk;
 };

 const handleWheel = (e: React.WheelEvent) => {
 if (scrollRef.current && e.deltaY !== 0) {
 scrollRef.current.scrollLeft += e.deltaY * 0.8;
 }
 };

 useEffect(() => {
 if (scrollRef.current) {
 const activeBtn = scrollRef.current.children[activeBulanIdx] as HTMLElement;
 if (activeBtn) {
 activeBtn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
 }
 }
 }, [activeBulanIdx]);

 const currentBulan = KALENDER_BULAN[activeBulanIdx] || KALENDER_BULAN[0];
 const agendasList = currentBulan?.agendas || [];
 const filteredAgendas = showOnlyEvents
 ? agendasList.filter((a) => a.jenis !== "Minggu" && a.jenis !== "Efektif")
 : agendasList;

 const getJenisBadge = (jenis: string) => {
 switch (jenis) {
 case "Libur":
 return "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30";
 case "Ujian":
 return "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30";
 case "Raport":
 return "bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 border-indigo-500/30";
 case "Efektif":
 return "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30";
 default:
 return "bg-slate-500/10 text-slate-500 dark:text-slate-400 border-slate-500/20";
 }
 };

 return (
 <div className="rounded-3xl border border-border bg-card p-6 shadow-sm">
 <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
 <h3 className="flex items-center gap-2 font-bold text-base">
 <Calendar className="h-4 w-4 text-gold" /> {t("Kalender Akademik", "Academic Calendar")}
 </h3>
 <button
 onClick={() =>setShowOnlyEvents(!showOnlyEvents)}
 className={`rounded-full px-3 py-1 text-[10px] font-extrabold transition-all border ${
 showOnlyEvents
 ? "bg-gold text-navy-deep border-gold shadow-sm"
 : "bg-muted text-muted-foreground hover:bg-gold/20"
 }`}
>
 {showOnlyEvents
 ? t(" Libur & Ujian Saja", " Holidays & Exams Only")
 : t("Filter Libur/Ujian", "Filter Holidays/Exams")}
 </button>
 </div>

 {/* Month Selector Pills Container with Scroll Buttons & Drag */}
 <div className="relative mt-3 flex items-center gap-1">
 <button
 onClick={() =>scrollMonths("left")}
 className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/90 text-foreground transition-all hover:bg-gold hover:text-navy-deep hover:scale-110 shadow-sm"
 title={t("Geser bulan ke kiri", "Scroll months left")}
 aria-label="Scroll left"
>
 <ChevronLeft className="h-4 w-4" />
 </button>

 <div
 ref={scrollRef}
 onMouseDown={handleMouseDown}
 onMouseUp={handleMouseLeaveOrUp}
 onMouseLeave={handleMouseLeaveOrUp}
 onMouseMove={handleMouseMove}
 onWheel={handleWheel}
 className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none select-none cursor-grab active:cursor-grabbing"
>
 {KALENDER_BULAN.map((b, idx) => (
 <button
 key={b.bulan + idx}
 onClick={() =>setActiveBulanIdx(idx)}
 className={`shrink-0 rounded-full px-3 py-1 text-xs font-bold transition-all ${
 activeBulanIdx === idx
 ? "bg-navy text-gold shadow-md dark:bg-gold dark:text-navy-deep"
 : "bg-muted text-muted-foreground hover:bg-muted/80"
 }`}
>
 {t(b.bulan, b.bulanEn)}
 </button>
 ))}
 </div>

 <button
 onClick={() =>scrollMonths("right")}
 className="z-10 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border bg-muted/90 text-foreground transition-all hover:bg-gold hover:text-navy-deep hover:scale-110 shadow-sm"
 title={t("Geser bulan ke kanan", "Scroll months right")}
 aria-label="Scroll right"
>
 <ChevronRight className="h-4 w-4" />
 </button>
 </div>

 {/* Agendas List */}
 <ul className="mt-2 space-y-2 max-h-[380px] overflow-y-auto pr-1">
 {filteredAgendas.map((k, i) => (
 <li
 key={k.agenda + k.tanggal + i}
 className="group rounded-2xl border border-border/80 p-3 transition-all hover:border-gold/60 hover:bg-gold/5"
>
 <div className="flex items-center justify-between gap-2">
 <span className="text-[11px] font-extrabold tracking-wider text-gold">
 {t(k.tanggal, k.tanggalEn)}
 </span>
 <span
 className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase border ${getJenisBadge(
 k.jenis
 )}`}
>
 {t(k.jenis, k.jenisEn)}
 </span>
 </div>
 <p className="mt-1 text-xs sm:text-sm font-semibold text-foreground leading-snug">
 {t(k.agenda, k.agendaEn)}
 </p>
 </li>
 ))}
 </ul>
 </div>
 );
}



function Alumni() {
 const { t } = useLanguage();

 return (
 <section className="py-28 bg-gradient-to-b from-transparent via-gold/5 to-transparent">
 <div className="mx-auto max-w-7xl px-5">
 <SectionTitle
 eyebrow={t("Jejak Alumni", "Alumni Placements")}
 title={t("Ke Mana Lulusan Kami Melangkah", "Where Our Graduates Go")}
 desc={t("Alumni PKBM Zaid bin Tsabit berhasil menembus berbagai perguruan tinggi negeri, swasta, & ma'had unggulan.", "PKBM Zaid bin Tsabit graduates successfully enter leading state universities, private campuses, and Islamic institutes.")}
 />
 <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
 {ALUMNI.map((a) => (
 <StaggerItem key={a.nama}>
 <div className={`group relative h-full flex flex-col justify-between rounded-3xl border p-7 transition-all duration-300 hover:-translate-y-2 ${
 a.isMore
 ? "border-gold/50 bg-gradient-to-br from-gold/15 via-navy/30 to-card shadow-gold"
 : "border-border bg-card/90 hover:border-gold/60 hover:shadow-luxe"
 }`}>
 <div>
 <div className="flex items-center justify-between">
 <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-gold">
 <GraduationCap className="h-3.5 w-3.5" />
 {a.kampus}
 </span>
 <span className="text-[11px] font-bold text-muted-foreground">{a.tahun}</span>
 </div>

 <h3 className="mt-5 text-xl font-black text-foreground group-hover:text-gold transition-colors">
 {a.nama}
 </h3>
 
 <p className="mt-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
 {t(a.kini, a.kiniEn)}
 </p>

 <p className="mt-4 text-xs text-muted-foreground leading-relaxed italic">
 "{t(a.kata, a.kataEn)}"
 </p>
 </div>

 <div className="mt-6 border-t border-border/60 pt-4 flex items-center justify-between text-xs">
 <span className="font-extrabold text-gold">{a.jurusan}</span>
 <Award className="h-4 w-4 text-gold/60 group-hover:text-gold transition-colors" />
 </div>
 </div>
 </StaggerItem>
 ))}
 </Stagger>
 </div>
 </section>
 );
}

function CtaKunjungan() {
 const { t } = useLanguage();

 return (
 <section id="kunjungan" className="relative overflow-hidden py-24">
 <div className="mx-auto max-w-7xl px-5">
 <Reveal variant="scale">
 <div className="relative overflow-hidden rounded-[2rem] bg-navy-deep p-10 text-center text-primary-foreground shadow-luxe md:p-16">
 <div className="surface-aurora absolute inset-0 opacity-60" />
 <Particles count={22} />
 <div className="relative">
 <h2 className="text-3xl font-extrabold sm:text-5xl">
 {t("Siap Bergabung Bersama Kami?", "Ready to Join Us?")}
 </h2>
 <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
 {t(
 "Daftarkan putra-putri Anda sekarang di PKBM Zaid bin Tsabit.",
 "Register your children now at PKBM Zaid bin Tsabit."
 )}
 </p>
 <div className="mt-9 flex flex-wrap justify-center gap-3">
 <Magnetic>
 <Link
 to="/ppdb"
 className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold"
>
 {t("Mulai SPMB Online", "Start SPMB Online")}
 </Link>
 </Magnetic>
 </div>
 </div>
 </div>
 </Reveal>
 </div>
 </section>
 );
}

function Marquee() {
 const items = ["Tahfizh", "Robotik", "Artificial Intelligence", "UI/UX", "Bahasa Arab", "Multimedia", "Olimpiade Sains"];
 return (
 <div className="overflow-hidden border-y border-border bg-card py-5">
 <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
 {[...items, ...items, ...items].map((item, i) => (
 <span key={i} className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
 {item} <span className="text-gold"></span>
 </span>
 ))}
 </div>
 </div>
 );
}

function Home() {
 return (
 <>
 <Hero />
 <Marquee />
 <Tentang />
 <JenjangSection />
 <Program />
 <VirtualTour />
 <Galeri />
 <Prestasi />
 <Berita />
 <Alumni />
 <CtaKunjungan />
 </>
 );
}
