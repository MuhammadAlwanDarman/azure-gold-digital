import { useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Award,
  BookOpenCheck,
  Calendar,
  ChevronDown,
  Compass,
  Cpu,
  MapPin,
  Play,
  Quote,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";
import {
  ALUMNI,
  BERITA,
  GALERI,
  GALERI_FILTER,
  GURU,
  JENJANG,
  KALENDER,
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "STPI Zaid bin Tsabit — Sekolah Islam Teknologi Unggulan" },
      {
        name: "description",
        content:
          "STPI Zaid bin Tsabit: sekolah Islam modern jenjang TK, SD, SMP, SMA dengan program tahfidz, coding, robotik, dan AI. PPDB online kini dibuka.",
      },
      { property: "og:title", content: "STPI Zaid bin Tsabit — Sekolah Islam Teknologi Unggulan" },
      {
        property: "og:description",
        content: "Mencetak Generasi Qurani yang Unggul dalam Teknologi dan Berakhlak Mulia. TK · SD · SMP · SMA.",
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

  return (
    <section ref={ref} className="relative flex min-h-screen items-center overflow-hidden bg-navy-deep">
      <motion.div className="absolute inset-0" style={{ x, y, scale: 1.08 }}>
        <img src={heroImg} alt="Kampus STPI Zaid bin Tsabit saat senja" width={1920} height={1088} className="h-full w-full object-cover" />
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
          <Star className="h-3.5 w-3.5 text-gold" /> Terakreditasi A · Sekolah Islam Teknologi
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(16px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 3.05, duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-4xl text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl"
        >
          Sekolah <span className="text-gold-gradient animate-shimmer">Qurani</span> Berkelas Dunia untuk Generasi Teknologi
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.35, duration: 0.9 }}
          className="mt-6 max-w-2xl text-base text-primary-foreground/75 sm:text-lg"
        >
          {SCHOOL.motto}
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
              Daftar Sekarang
            </Link>
          </Magnetic>
          <Magnetic>
            <a
              href="#kunjungan"
              className="glass block rounded-full px-7 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:text-gold"
            >
              Jadwalkan Kunjungan
            </a>
          </Magnetic>
          <Magnetic>
            <a
              href="#brosur"
              className="block rounded-full border border-white/25 px-7 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:border-gold hover:text-gold"
            >
              Download Brosur
            </a>
          </Magnetic>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3.7, duration: 1 }}
          className="mt-14 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4"
        >
          {STATS.map((s, i) => (
            <Tilt key={s.label} className="glass animate-float rounded-2xl p-4" >
              <div style={{ animationDelay: `${i * 0.4}s` }}>
                <p className="text-2xl font-extrabold text-gold">
                  <Counter to={s.value} suffix={s.suffix} />
                </p>
                <p className="mt-1 text-[11px] uppercase tracking-widest text-primary-foreground/60">{s.label}</p>
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
          Gulir <ChevronDown className="h-4 w-4 text-gold" />
        </motion.a>
      </motion.div>
    </section>
  );
}

function Tentang() {
  return (
    <section id="tentang" className="relative overflow-hidden py-28">
      <AuroraBackground />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionTitle
          eyebrow="Tentang Sekolah"
          title="Warisan Ilmu, Masa Depan Teknologi"
          desc="Dua dekade membina santri berprestasi dengan hafalan kuat, akhlak mulia, dan keterampilan digital yang relevan."
        />

        <div className="mt-16 grid gap-10 lg:grid-cols-2">
          <Reveal variant="left">
            <Tilt className="group relative overflow-hidden rounded-3xl shadow-luxe">
              <img
                src={heroImg}
                alt="Profil kampus STPI Zaid bin Tsabit"
                loading="lazy"
                width={1920}
                height={1088}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-navy-deep/40">
                <span className="glass flex h-20 w-20 items-center justify-center rounded-full text-primary-foreground">
                  <Play className="h-7 w-7 text-gold" />
                </span>
              </div>
            </Tilt>
          </Reveal>

          <div className="space-y-6">
            {TIMELINE.map((t, i) => (
              <Reveal key={t.year} variant="right" delay={i * 0.08}>
                <div className="relative flex gap-5 rounded-2xl border border-border bg-card/70 p-5 backdrop-blur transition-all hover:border-gold/60 hover:shadow-luxe">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-navy text-xs font-extrabold text-gold">
                    {t.year}
                  </div>
                  <div>
                    <h3 className="font-bold">{t.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
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
  return (
    <section id="jenjang" className="relative overflow-hidden bg-navy py-28 text-primary-foreground">
      <Particles count={22} />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal variant="blur">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              <Compass className="h-3.5 w-3.5" /> Jenjang Pendidikan
            </span>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">Satu Kampus, Empat Jenjang Unggulan</h2>
          </Reveal>
        </div>

        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {JENJANG.map((j, i) => {
            const Icon = icons[i % icons.length];
            return (
              <StaggerItem key={j.slug}>
                <Tilt className="h-full">
                  <Link
                    to="/jenjang/$level"
                    params={{ level: j.slug }}
                    className="group relative block h-full overflow-hidden rounded-3xl border border-white/12 bg-white/5 p-7 transition-all duration-500 hover:-translate-y-3 hover:border-gold/70 hover:shadow-gold"
                  >
                    <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold/15 blur-2xl transition-all duration-500 group-hover:bg-gold/30" />
                    <Icon className="h-9 w-9 text-gold transition-transform duration-500 group-hover:rotate-12" />
                    <h3 className="mt-6 text-3xl font-extrabold">{j.label}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gold/80">{j.usia}</p>
                    <p className="mt-4 text-sm text-primary-foreground/70">{j.tagline}</p>
                    <span className="mt-6 inline-block text-xs font-bold uppercase tracking-widest text-gold opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                      Lihat halaman →
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
  return (
    <section id="program" className="relative overflow-hidden py-28">
      <AuroraBackground />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionTitle
          eyebrow="Program Unggulan"
          title="Kurikulum Qurani Berpadu Teknologi"
          desc="Empat belas program pilihan yang membentuk hafalan, karakter, dan keahlian digital siswa."
        />
        <Stagger className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {PROGRAM_UNGGULAN.map((p) => (
            <StaggerItem key={p.title}>
              <Tilt className="group h-full rounded-3xl border border-border bg-card p-6 transition-all duration-500 hover:-translate-y-2 hover:border-gold/70 hover:shadow-luxe">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold transition-transform duration-500 group-hover:rotate-12">
                  <Sparkles className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-bold">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
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
  const spots = [
    { name: "Masjid Kampus", desc: "Pusat halaqah dan tahfidz harian dengan kapasitas 800 jamaah." },
    { name: "Lab Robotik & AI", desc: "Perangkat robotik, 3D printing, dan workstation AI." },
    { name: "Studio Multimedia", desc: "Green screen, ruang audio, dan suite editing profesional." },
    { name: "Perpustakaan Digital", desc: "12.000 judul buku dan akses jurnal internasional." },
  ];

  return (
    <section id="tour" className="relative overflow-hidden bg-navy-deep py-28 text-primary-foreground">
      <Particles count={20} />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal variant="left">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              Virtual Tour 360°
            </span>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">Jelajahi Kampus Tanpa Meninggalkan Rumah</h2>
            <p className="mt-4 text-primary-foreground/70">
              Klik titik interaktif untuk melihat detail setiap fasilitas unggulan kami.
            </p>
            <div className="mt-8 space-y-3">
              {spots.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setSpot(i)}
                  className={`w-full rounded-2xl border p-4 text-left transition-all ${
                    spot === i ? "border-gold bg-gold/10" : "border-white/12 hover:border-gold/50"
                  }`}
                >
                  <p className="text-sm font-bold">{s.name}</p>
                  {spot === i && <p className="mt-1 text-xs text-primary-foreground/70">{s.desc}</p>}
                </button>
              ))}
            </div>
          </Reveal>

          <Reveal variant="right">
            <Tilt className="relative overflow-hidden rounded-3xl border border-white/15 shadow-luxe">
              <img src={heroImg} alt="Tur virtual kampus" loading="lazy" width={1920} height={1088} className="h-[26rem] w-full object-cover" />
              <div className="absolute inset-0 bg-navy-deep/30" />
              {spots.map((s, i) => (
                <button
                  key={s.name}
                  onClick={() => setSpot(i)}
                  aria-label={s.name}
                  style={{ left: `${18 + i * 21}%`, top: `${30 + (i % 2) * 30}%` }}
                  className={`absolute h-5 w-5 -translate-x-1/2 rounded-full ring-4 transition-all ${
                    spot === i ? "bg-gold ring-gold/40" : "bg-white ring-white/30"
                  }`}
                />
              ))}
              <div className="glass absolute bottom-4 left-4 right-4 rounded-2xl p-4">
                <p className="text-sm font-bold text-gold">{spots[spot].name}</p>
                <p className="text-xs text-primary-foreground/80">{spots[spot].desc}</p>
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
  const items = GALERI.filter((g) => filter === "Semua" || g.kategori === filter);

  return (
    <section id="galeri" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Galeri" title="Momen Terbaik Sekolah Kami" />
        <Reveal variant="up" className="mt-10 flex flex-wrap justify-center gap-2">
          <div className="flex flex-wrap justify-center gap-2">
            {GALERI_FILTER.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                  filter === f ? "border-gold bg-gold text-navy-deep" : "border-border hover:border-gold hover:text-gold"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {items.map((g, i) => (
            <Reveal key={g.judul} variant="scale" delay={(i % 4) * 0.06} className="mb-5 break-inside-avoid">
              <div className={`group relative overflow-hidden rounded-3xl ${g.h}`}>
                <img
                  src={heroImg}
                  alt={g.judul}
                  loading="lazy"
                  width={1920}
                  height={1088}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-115"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/90 via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-4 left-4 text-primary-foreground">
                  <p className="text-xs uppercase tracking-widest text-gold">{g.kategori}</p>
                  <p className="font-bold">{g.judul}</p>
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
  const [filter, setFilter] = useState("Semua");
  const levels = ["Semua", "Provinsi", "Nasional", "Internasional"];
  const items = PRESTASI.filter((p) => filter === "Semua" || p.level === filter);

  return (
    <section id="prestasi" className="relative overflow-hidden bg-mist py-28">
      <AuroraBackground />
      <div className="relative mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Prestasi" title="Jejak Kemenangan Santri Kami" />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {levels.map((l) => (
            <button
              key={l}
              onClick={() => setFilter(l)}
              className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                filter === l ? "border-gold bg-gold text-navy-deep" : "border-border hover:border-gold hover:text-gold"
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        <div className="relative mx-auto mt-14 max-w-3xl">
          <div className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-gold via-gold/40 to-transparent md:left-1/2" />
          {items.map((p, i) => (
            <Reveal key={p.title} variant={i % 2 ? "right" : "left"} delay={i * 0.05}>
              <div className="relative mb-6 ml-12 rounded-2xl border border-border bg-card p-5 shadow-sm transition-all hover:border-gold hover:shadow-luxe md:ml-0 md:w-1/2 md:odd:mr-auto md:odd:pr-10 md:even:ml-auto md:even:pl-10">
                <span className="absolute -left-[2.15rem] top-6 flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep md:hidden">
                  <Trophy className="h-3 w-3" />
                </span>
                <p className="text-xs font-bold uppercase tracking-widest text-gold">
                  {p.year} · {p.level}
                </p>
                <p className="mt-2 font-bold">{p.title}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-16 grid gap-5 sm:grid-cols-3">
          {[
            { l: "Prestasi Nasional", v: 128 },
            { l: "Prestasi Internasional", v: 24 },
            { l: "Hafidz 30 Juz", v: 412 },
          ].map((s, i) => (
            <Reveal key={s.l} variant="scale" delay={i * 0.08}>
              <div className="rounded-3xl border border-border bg-card p-8 text-center">
                <p className="text-4xl font-extrabold text-navy">
                  <Counter to={s.v} />
                </p>
                <p className="mt-2 text-xs uppercase tracking-widest text-muted-foreground">{s.l}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Guru() {
  return (
    <section id="guru" className="py-28">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Tenaga Pendidik" title="Dibimbing Guru Terbaik" />
        <Stagger className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {GURU.map((g) => (
            <StaggerItem key={g.nama}>
              <Tilt className="group overflow-hidden rounded-3xl border border-border bg-card transition-all duration-500 hover:-translate-y-2 hover:shadow-luxe">
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={heroImg}
                    alt={g.nama}
                    loading="lazy"
                    width={1920}
                    height={1088}
                    className="h-full w-full object-cover grayscale transition-all duration-700 group-hover:scale-110 group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 translate-y-full bg-navy-deep/80 p-3 text-center text-xs uppercase tracking-widest text-gold transition-transform duration-500 group-hover:translate-y-0">
                    Instagram · LinkedIn
                  </div>
                </div>
                <div className="p-5">
                  <p className="font-bold">{g.nama}</p>
                  <p className="text-xs uppercase tracking-widest text-gold">{g.peran}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{g.bidang}</p>
                </div>
              </Tilt>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}

function Berita() {
  return (
    <section id="berita" className="relative overflow-hidden bg-mist py-28">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Berita & Agenda" title="Kabar Terbaru dari Kampus" />
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            {BERITA.map((b, i) => (
              <Reveal key={b.title} variant="up" delay={i * 0.06}>
                <article className="group flex flex-col gap-5 rounded-3xl border border-border bg-card p-5 transition-all hover:border-gold hover:shadow-luxe sm:flex-row">
                  <div className="h-36 w-full overflow-hidden rounded-2xl sm:w-52">
                    <img
                      src={heroImg}
                      alt={b.title}
                      loading="lazy"
                      width={1920}
                      height={1088}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div>
                    <span className="rounded-full bg-navy px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-gold">
                      {b.kategori}
                    </span>
                    <h3 className="mt-3 text-lg font-bold leading-snug">{b.title}</h3>
                    <p className="mt-2 text-xs text-muted-foreground">{b.date}</p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal variant="right">
            <div className="rounded-3xl border border-border bg-card p-6">
              <h3 className="flex items-center gap-2 font-bold">
                <Calendar className="h-4 w-4 text-gold" /> Kalender Akademik
              </h3>
              <ul className="mt-5 space-y-3">
                {KALENDER.map((k) => (
                  <li key={k.agenda} className="rounded-2xl border border-border p-3 transition-colors hover:border-gold">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-gold">
                      {k.tanggal} · {k.jenis}
                    </p>
                    <p className="text-sm">{k.agenda}</p>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function PetaPrestasi() {
  const [prov, setProv] = useState("Jawa Barat");
  const data: Record<string, string> = {
    "Jawa Barat": "42 medali · Robotik, MTQ, Sains",
    "DKI Jakarta": "27 medali · Hackathon & Debat",
    "Jawa Timur": "18 medali · Olimpiade Sains",
    "Sumatera Utara": "11 medali · Tahfidz Nasional",
  };

  return (
    <section className="relative overflow-hidden bg-navy py-28 text-primary-foreground">
      <Particles count={18} />
      <div className="relative mx-auto max-w-7xl px-5">
        <div className="mx-auto max-w-2xl text-center">
          <Reveal variant="blur">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              <MapPin className="h-3.5 w-3.5" /> Peta Prestasi
            </span>
          </Reveal>
          <Reveal variant="up" delay={0.08}>
            <h2 className="mt-5 text-3xl font-extrabold sm:text-5xl">Prestasi Siswa di Seluruh Indonesia</h2>
          </Reveal>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Object.keys(data).map((p) => (
            <button
              key={p}
              onClick={() => setProv(p)}
              className={`rounded-3xl border p-6 text-left transition-all hover:-translate-y-1 ${
                prov === p ? "border-gold bg-gold/10 shadow-gold" : "border-white/12 bg-white/5"
              }`}
            >
              <p className="font-bold">{p}</p>
              <p className="mt-2 text-xs text-primary-foreground/70">{data[p]}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Alumni() {
  return (
    <section className="py-28">
      <div className="mx-auto max-w-7xl px-5">
        <SectionTitle eyebrow="Alumni" title="Ke Mana Lulusan Kami Melangkah" />
        <Stagger className="mt-16 grid gap-6 md:grid-cols-3">
          {ALUMNI.map((a) => (
            <StaggerItem key={a.nama}>
              <div className="h-full rounded-3xl border border-border bg-card p-7 transition-all hover:-translate-y-2 hover:border-gold hover:shadow-luxe">
                <Quote className="h-7 w-7 text-gold" />
                <p className="mt-4 text-sm text-muted-foreground">"{a.kata}"</p>
                <div className="mt-6 border-t border-border pt-4">
                  <p className="font-bold">{a.nama}</p>
                  <p className="text-xs text-muted-foreground">
                    Angkatan {a.tahun} · {a.kini}
                  </p>
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
  return (
    <section id="kunjungan" className="relative overflow-hidden py-24">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal variant="scale">
          <div className="relative overflow-hidden rounded-[2rem] bg-navy-deep p-10 text-center text-primary-foreground shadow-luxe md:p-16">
            <div className="surface-aurora absolute inset-0 opacity-60" />
            <Particles count={22} />
            <div className="relative">
              <h2 className="text-3xl font-extrabold sm:text-5xl">Siap Bergabung Tahun Ajaran 2026/2027?</h2>
              <p className="mx-auto mt-4 max-w-xl text-primary-foreground/75">
                Daftarkan putra-putri Anda, jadwalkan kunjungan kampus, atau unduh brosur lengkap kami.
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-3">
                <Magnetic>
                  <Link
                    to="/ppdb"
                    className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold"
                  >
                    Mulai PPDB Online
                  </Link>
                </Magnetic>
                <a
                  id="brosur"
                  href="#"
                  className="glass rounded-full px-8 py-4 text-sm font-bold uppercase tracking-wide transition-colors hover:text-gold"
                >
                  Download Brosur
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Marquee() {
  const items = ["Tahfidz", "Robotik", "Artificial Intelligence", "UI/UX", "Bahasa Arab", "Multimedia", "Olimpiade Sains"];
  return (
    <div className="overflow-hidden border-y border-border bg-card py-5">
      <div className="animate-marquee flex w-max gap-12 whitespace-nowrap">
        {[...items, ...items, ...items].map((t, i) => (
          <span key={i} className="text-sm font-bold uppercase tracking-[0.3em] text-muted-foreground">
            {t} <span className="text-gold">✦</span>
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
      <Guru />
      <Berita />
      <PetaPrestasi />
      <Alumni />
      <CtaKunjungan />
    </>
  );
}
