import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, GraduationCap, ImageIcon, Users } from "lucide-react";
import heroImg from "@/assets/hero-campus.jpg";
import { JENJANG, type Jenjang } from "@/lib/school-data";
import { AuroraBackground, Magnetic, Particles, Reveal, Stagger, StaggerItem, Tilt } from "@/components/site/effects";

export const Route = createFileRoute("/jenjang/$level")({
  loader: ({ params }) => {
    const jenjang = JENJANG.find((j) => j.slug === params.level);
    if (!jenjang) throw notFound();
    return { jenjang };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Jenjang tidak ditemukan — STPI Zaid bin Tsabit" }, { name: "robots", content: "noindex" }] };
    }
    const { jenjang } = loaderData;
    const title = `Jenjang ${jenjang.label} — STPI Zaid bin Tsabit`;
    return {
      meta: [
        { title },
        { name: "description", content: jenjang.deskripsi.slice(0, 155) },
        { property: "og:title", content: title },
        { property: "og:description", content: jenjang.tagline },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: JenjangPage,
});

function JenjangPage() {
  const { jenjang } = Route.useLoaderData() as { jenjang: Jenjang };

  return (
    <>
      <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-navy-deep pb-16 pt-40">
        <img src={heroImg} alt={`Suasana jenjang ${jenjang.label}`} width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-navy-deep/60" />
        <Particles count={24} />
        <div className="relative mx-auto w-full max-w-7xl px-5 text-primary-foreground">
          <Reveal variant="blur">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              {jenjang.usia}
            </span>
          </Reveal>
          <Reveal variant="up" delay={0.1}>
            <h1 className="mt-6 text-4xl font-extrabold sm:text-6xl">
              Jenjang <span className="text-gold-gradient animate-shimmer">{jenjang.label}</span>
            </h1>
          </Reveal>
          <Reveal variant="up" delay={0.18}>
            <p className="mt-4 max-w-2xl text-primary-foreground/75">{jenjang.deskripsi}</p>
          </Reveal>
          <Reveal variant="up" delay={0.26}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <Link
                  to="/ppdb"
                  className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold"
                >
                  PPDB {jenjang.label}
                </Link>
              </Magnetic>
              <Link to="/" className="glass rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide hover:text-gold">
                Kembali ke Beranda
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative overflow-hidden py-24">
        <AuroraBackground />
        <div className="relative mx-auto max-w-7xl px-5">
          <Reveal variant="up">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
              <GraduationCap className="h-6 w-6 text-gold" /> Program {jenjang.label}
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jenjang.program.map((p) => (
              <StaggerItem key={p}>
                <Tilt className="rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-2 hover:border-gold hover:shadow-luxe">
                  <p className="font-bold">{p}</p>
                  <p className="mt-2 text-sm text-muted-foreground">Pendampingan intensif dengan evaluasi berkala.</p>
                </Tilt>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="bg-mist py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal variant="up">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
              <Users className="h-6 w-6 text-gold" /> Guru Pengampu
            </h2>
          </Reveal>
          <Stagger className="mt-10 grid gap-6 sm:grid-cols-3">
            {jenjang.guru.map((g) => (
              <StaggerItem key={g.nama}>
                <div className="group overflow-hidden rounded-3xl border border-border bg-card transition-all hover:-translate-y-2 hover:shadow-luxe">
                  <img
                    src={heroImg}
                    alt={g.nama}
                    loading="lazy"
                    width={1920}
                    height={1088}
                    className="h-48 w-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0"
                  />
                  <div className="p-5">
                    <p className="font-bold">{g.nama}</p>
                    <p className="text-xs uppercase tracking-widest text-gold">{g.peran}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5">
          <Reveal variant="up">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
              <ImageIcon className="h-6 w-6 text-gold" /> Galeri {jenjang.label}
            </h2>
          </Reveal>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Reveal key={i} variant="scale" delay={i * 0.07}>
                <div className="overflow-hidden rounded-3xl">
                  <img
                    src={heroImg}
                    alt={`Galeri jenjang ${jenjang.label} ${i + 1}`}
                    loading="lazy"
                    width={1920}
                    height={1088}
                    className="h-52 w-full object-cover transition-transform duration-700 hover:scale-110"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-mist py-24">
        <div className="mx-auto max-w-4xl px-5">
          <Reveal variant="up">
            <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
              <CalendarDays className="h-6 w-6 text-gold" /> Jadwal Kegiatan
            </h2>
          </Reveal>
          <div className="mt-10 space-y-4">
            {jenjang.jadwal.map((j) => (
              <Reveal key={j.hari} variant="left">
                <div className="rounded-2xl border border-border bg-card p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-gold">{j.hari}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{j.kegiatan}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
