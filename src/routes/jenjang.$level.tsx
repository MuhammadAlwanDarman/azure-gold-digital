import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { CalendarDays, CheckCircle2, Copy, Download, ExternalLink, FileText, GraduationCap, ImageIcon, Instagram, Trophy } from "lucide-react";
import heroImg from "@/assets/hero-campus.png";
import goldTexture from "@/assets/gold-texture.png";
import { JENJANG, SCHOOL, type Jenjang } from "@/lib/school-data";
import { AuroraBackground, Magnetic, Particles, Reveal, Stagger, StaggerItem, Tilt } from "@/components/site/effects";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/jenjang/$level")({
 loader: ({ params }) => {
 const jenjang = JENJANG.find((j) => j.slug === params.level);
 if (!jenjang) throw notFound();
 return { jenjang };
 },
 head: ({ loaderData }) => {
 if (!loaderData) {
 return { meta: [{ title: "Jenjang tidak ditemukan — PKBM Zaid bin Tsabit" }, { name: "robots", content: "noindex" }] };
 }
 const { jenjang } = loaderData;
 const title = `Jenjang ${jenjang.label} — PKBM Zaid bin Tsabit`;
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

function handleDownloadBrosur(jenjang: Jenjang) {
 const printWindow = window.open("", "_blank");
 if (!printWindow) return;

 const htmlContent = `
 <!DOCTYPE html>
 <html lang="id">
 <head>
 <meta charset="UTF-8">
 <title>Brosur Resmi SPMB - Jenjang ${jenjang.label} - PKBM Zaid bin Tsabit</title>
 <style>
 body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #0f172a; background: #fff; }
 .header { text-align: center; border-bottom: 4px solid #0284c7; padding-bottom: 20px; margin-bottom: 30px; }
 .logo-title { font-size: 24px; font-weight: 800; color: #0f172a; text-transform: uppercase; letter-spacing: 1px; }
 .sub-title { font-size: 14px; color: #64748b; margin-top: 5px; }
 .badge { display: inline-block; background: #eab308; color: #0f172a; padding: 6px 16px; border-radius: 20px; font-weight: bold; font-size: 14px; margin-top: 15px; }
 .section-title { font-size: 18px; font-weight: 700; color: #0284c7; border-left: 4px solid #eab308; padding-left: 12px; margin-top: 30px; margin-bottom: 15px; }
 .desc { font-size: 14px; line-height: 1.6; color: #334155; }
 .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 15px; }
 .card { background: #f8fafc; border: 1px solid #e2e8f0; padding: 15px; border-radius: 12px; }
 .card-title { font-weight: 700; color: #0f172a; font-size: 15px; }
 .card-desc { font-size: 13px; color: #64748b; margin-top: 5px; }
 .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e2e8f0; font-size: 12px; text-align: center; color: #64748b; }
 @media print {
 body { padding: 20px; }
 .no-print { display: none; }
 }
 </style>
 </head>
 <body>
 <div class="no-print" style="text-align: right; margin-bottom: 20px;">
 <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">️ Cetak / Simpan sebagai PDF</button>
 </div>

 <div class="header">
 <div class="logo-title">SEKOLAH TAHFIZH PLUS IT ZAID BIN TSABIT</div>
 <div class="sub-title">Mencetak Generasi Qurani yang Unggul dalam Teknologi dan Berakhlak Mulia</div>
 <div class="badge">BROSUR RESMI SPMB 2026/2027 — JENJANG ${jenjang.label.toUpperCase()} (${jenjang.usia})</div>
 </div>

 <div class="section-title">Tentang Jenjang ${jenjang.label}</div>
 <p class="desc">${jenjang.deskripsi}</p>

 <div class="section-title">Program Unggulan ${jenjang.label}</div>
 <div class="grid">
 ${(jenjang.programDetails || jenjang.program.map((p) => ({ nama: p, deskripsi: "Pendampingan intensif dengan evaluasi berkala." }))).map((p) => `
 <div class="card">
 <div class="card-title">${p.nama}</div>
 <div class="card-desc">${p.deskripsi}</div>
 </div>
 `).join("")}
 </div>

 <div class="section-title">Jadwal Kegiatan Pembelajaran</div>
 <div class="grid">
 ${jenjang.jadwal.map((j) => `
 <div class="card">
 <div class="card-title">${j.hari}</div>
 <div class="card-desc">${j.kegiatan}</div>
 </div>
 `).join("")}
 </div>

 <div class="section-title">Informasi Rekening Pembayaran Resmi</div>
 <div style="background: #f0fdf4; border: 2px dashed #16a34a; padding: 15px; border-radius: 10px; margin-top: 15px; margin-bottom: 20px;">
 <div style="font-weight: 800; color: #166534; font-size: 15px;">${SCHOOL.bankInfo.bank}</div>
 <div style="font-size: 22px; font-weight: 900; color: #0f172a; margin: 6px 0;">No. Rekening: ${SCHOOL.bankInfo.accountNumber}</div>
 <div style="font-size: 13px; color: #334155;">Atas Nama: <strong>${SCHOOL.bankInfo.accountName}</strong></div>
 </div>

 <div class="footer">
 <p><strong>Sekolah Tahfizh Plus IT Zaid bin Tsabit</strong></p>
 <p>Telepon/WA: ${SCHOOL.phone} | Email: ${SCHOOL.email} | Instagram: ${jenjang.instagramHandle}</p>
 <p>Pendaftaran Online SPMB: https://zaidbintsabit.sch.id/ppdb</p>
 </div>

 <script>
 setTimeout(() => { window.print(); }, 500);
 </script>
 </body>
 </html>
 `;

 printWindow.document.write(htmlContent);
 printWindow.document.close();
}

function JenjangPage() {
 const { jenjang } = Route.useLoaderData() as { jenjang: Jenjang };
 const { t } = useLanguage();
 const [copied, setCopied] = useState(false);

 const handleCopyAccount = (num: string) => {
 navigator.clipboard.writeText(num);
 setCopied(true);
 setTimeout(() => setCopied(false), 2500);
 };

 return (
 <>
 <section className="relative flex min-h-[75vh] items-end overflow-hidden bg-navy-deep pb-16 pt-40">
 <img src={jenjang.gambar} alt={`Suasana jenjang ${jenjang.label}`} width={1920} height={1088} className="absolute inset-0 h-full w-full object-cover" />
 <div className="absolute inset-0 bg-gradient-to-t from-navy-deep via-navy-deep/80 to-navy-deep/60" />
 <Particles count={24} />
 <div className="relative mx-auto w-full max-w-7xl px-5 text-primary-foreground">
 <Reveal variant="blur">
 <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
 {t(jenjang.usia, jenjang.usiaEn || jenjang.usia)}
 </span>
 </Reveal>
 <Reveal variant="up" delay={0.1}>
 <h1 className="mt-6 text-4xl font-extrabold sm:text-6xl">
 {t("Jenjang", "Level")} <span className="text-gold-gradient animate-shimmer">{t(jenjang.label, jenjang.labelEn || jenjang.label)}</span>
 </h1>
 </Reveal>
 <Reveal variant="up" delay={0.18}>
 <p className="mt-4 max-w-2xl text-primary-foreground/75">{t(jenjang.deskripsi, jenjang.deskripsiEn || jenjang.deskripsi)}</p>
 </Reveal>
 <Reveal variant="up" delay={0.26}>
 <div className="mt-8 flex flex-wrap items-center gap-3">
 <Magnetic>
 <Link
 to="/ppdb"
 className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-7 py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold"
>
 SPMB {t(jenjang.label, jenjang.labelEn || jenjang.label)}
 </Link>
 </Magnetic>
 <Magnetic>
 <button
 type="button"
 onClick={() => handleDownloadBrosur(jenjang)}
 className="flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-6 py-3.5 text-sm font-bold text-gold shadow-luxe transition-all hover:scale-105 hover:bg-gold hover:text-navy-deep"
>
 <Download className="h-4 w-4" />
 <span>{t("Cetak Brosur", "Print Brochure")}</span>
 </button>
 </Magnetic>
 <Magnetic>
 <a
 href={jenjang.instagramUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="flex items-center gap-2 rounded-full border border-pink-500/40 bg-gradient-to-r from-purple-600/40 via-pink-600/40 to-amber-500/40 px-6 py-3.5 text-sm font-bold text-white shadow-luxe transition-all hover:scale-105 hover:border-pink-400"
>
 <Instagram className="h-4 w-4 text-pink-300 shrink-0" />
 <span>{t("Follow Instagram", "Follow Instagram")} <strong className="text-gold">{jenjang.instagramHandle}</strong></span>
 <ExternalLink className="h-3.5 w-3.5 text-white/70" />
 </a>
 </Magnetic>
 <Link to="/" className="glass rounded-full px-7 py-3.5 text-sm font-bold uppercase tracking-wide hover:text-gold">
 {t("Kembali ke Beranda", "Back to Home")}
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
 <GraduationCap className="h-6 w-6 text-gold" /> {t(`Program ${jenjang.label}`, `${jenjang.labelEn || jenjang.label} Programs`)}
 </h2>
 </Reveal>
 <Stagger className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
 {jenjang.program.map((p, idx) => {
 const detail = jenjang.programDetails?.[idx];
 const title = t(detail?.nama || p, detail?.namaEn || jenjang.programEn?.[idx] || p);
 const desc = detail
 ? t(detail.deskripsi, detail.deskripsiEn || detail.deskripsi)
 : t("Pendampingan intensif dengan evaluasi berkala.", "Intensive guidance with periodic evaluations.");

 return (
 <StaggerItem key={p}>
 <Tilt className="flex h-full flex-col rounded-3xl border border-border bg-card p-6 transition-all hover:-translate-y-2 hover:border-gold hover:shadow-luxe">
 <p className="text-lg font-bold text-gold">{title}</p>
 <p className="mt-2 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">{desc}</p>
 </Tilt>
 </StaggerItem>
 );
 })}
 </Stagger>
 </div>
 </section>

 {/* Official Bank Account Details Card */}
 <section className="relative overflow-hidden py-16 bg-navy-deep text-primary-foreground">
 <div className="relative z-10 mx-auto max-w-4xl px-5">
 <Reveal variant="up" delay={0.25}>
 <div className="mt-10 overflow-hidden rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/80 via-teal-950/60 to-navy-deep p-6 md:p-8 backdrop-blur-md shadow-luxe">
 <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
 <div>
 <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-3.5 py-1 text-xs font-extrabold uppercase tracking-wider text-emerald-300 border border-emerald-500/30">
 <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
 {t("Rekening Transfer Pembayaran Resmi", "Official Bank Transfer Account")}
 </div>
 <h3 className="mt-3 text-xl font-extrabold text-white sm:text-2xl">
 {SCHOOL.bankInfo.bank}
 </h3>
 <div className="mt-2 flex items-center gap-3">
 <span className="font-mono text-2xl sm:text-3xl font-black text-gold tracking-widest">
 {SCHOOL.bankInfo.accountNumber}
 </span>
 </div>
 <p className="mt-1 text-xs sm:text-sm text-primary-foreground/80">
 Atas Nama: <strong className="text-white font-bold">{SCHOOL.bankInfo.accountName}</strong>
 </p>
 </div>

 <button
 type="button"
 onClick={() =>handleCopyAccount(SCHOOL.bankInfo.accountNumber)}
 className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold transition-all hover:scale-105 shrink-0"
>
 <Copy className="h-4 w-4 shrink-0" />
 <span>{copied ? t("Tersalin!", "Copied!") : t("Salin No. Rekening", "Copy Account No")}</span>
 </button>
 </div>

 {/* Comprehensive Bank Accounts Breakdown */}
 <div className="mt-8 border-t border-emerald-500/30 pt-6">
 <h4 className="text-xs font-extrabold uppercase tracking-wider text-gold mb-3">
 {t("Rincian Nomor Rekening BSI Berdasarkan Kategori Pembayaran:", "BSI Account Breakdown by Payment Category:")}
 </h4>
 <div className="grid gap-2.5 sm:grid-cols-2">
 {SCHOOL.bankAccounts.map((acc) => (
 <div
 key={acc.accountNumber + acc.category}
 className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 p-3 text-xs backdrop-blur-sm transition-all hover:border-gold/50"
>
 <div>
 <span className="font-bold text-gold">{acc.category}</span>
 <p className="font-mono font-bold text-white mt-0.5">
 {acc.bank} — <span className="text-emerald-300 font-extrabold">{acc.accountNumber}</span>
 </p>
 <p className="text-[11px] text-slate-300">a/n {acc.accountName}</p>
 </div>
 <button
 type="button"
 onClick={() =>handleCopyAccount(acc.accountNumber)}
 className="rounded-xl border border-white/20 bg-white/10 p-2 text-white hover:border-gold hover:text-gold transition-all shrink-0"
 title={`Salin ${acc.accountNumber}`}
>
 <Copy className="h-3.5 w-3.5" />
 </button>
 </div>
 ))}
 </div>
 </div>
 </div>
 </Reveal>
 </div>
 </section>

 {/* Jejak Kemenangan & Prestasi Siswa Siswi */}
 {jenjang.prestasi && jenjang.prestasi.length > 0 && (
 <section className="relative overflow-hidden bg-navy-deep text-primary-foreground py-20 border-y border-white/10">
 <Particles count={15} />
 <div className="relative z-10 mx-auto max-w-7xl px-5">
 <Reveal variant="up">
 <div className="flex items-center gap-3">
 <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gold/20 text-gold border border-gold/30 shadow-lg">
 <Trophy className="h-6 w-6" />
 </div>
 <div>
 <h2 className="text-2xl font-extrabold sm:text-3xl text-white">
 {t(`Jejak Kemenangan Siswa Siswi ${jenjang.label}`, `${jenjang.label} Student Victory Record`)}
 </h2>
 <p className="text-xs text-primary-foreground/70 mt-1">
 {t("Daftar kejuaraan dan penghargaan resmi yang berhasil diraih siswa siswi.", "Official awards and competition championships won by our students.")}
 </p>
 </div>
 </div>
 </Reveal>

 <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 {jenjang.prestasi.map((p, idx) => (
 <StaggerItem key={idx}>
 <div className="group relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur-sm transition-all duration-300 hover:border-gold hover:bg-white/10 hover:-translate-y-1 shadow-sm hover:shadow-luxe">
 <span className="inline-flex items-center gap-1.5 rounded-full bg-gold/20 px-3 py-1 text-[10px] font-extrabold uppercase tracking-widest text-gold border border-gold/30">
 {t(p.level, p.levelEn || p.level)}
 </span>
 <h3 className="mt-3 font-bold text-sm text-white leading-snug group-hover:text-gold transition-colors">
 {t(p.title, p.titleEn || p.title)}
 </h3>
 </div>
 </StaggerItem>
 ))}
 </Stagger>
 </div>
 </section>
 )}

 <section className="py-24">
 <div className="mx-auto max-w-7xl px-5">
 <div className="flex flex-wrap items-center justify-between gap-4">
 <Reveal variant="up">
 <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
 <ImageIcon className="h-6 w-6 text-gold" /> {t(`Galeri ${jenjang.label}`, `${jenjang.labelEn || jenjang.label} Gallery`)}
 </h2>
 </Reveal>
 <a
 href={jenjang.instagramUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-2 rounded-full border border-pink-500/40 bg-pink-500/10 px-4 py-2 text-xs font-bold text-pink-500 transition-colors hover:bg-pink-500 hover:text-white"
>
 <Instagram className="h-4 w-4" /> {t("Lihat lebih banyak di", "See more on")} {jenjang.instagramHandle} &rarr;
 </a>
 </div>
 <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
 {(jenjang.galeriImages || Array.from({ length: 4 })).map((imgItem, i) => (
 <Reveal key={i} variant="scale" delay={i * 0.07}>
 <a
 href={jenjang.instagramUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="group relative block overflow-hidden rounded-3xl"
>
 <img
 src={typeof imgItem === "string" ? imgItem : jenjang.gambar}
 alt={`Galeri jenjang ${jenjang.label} ${i + 1}`}
 loading="lazy"
 width={1920}
 height={1088}
 className="h-52 w-full object-cover transition-transform duration-700 group-hover:scale-110"
 />
 <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
 <span className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#f09433] to-[#bc1888] px-4 py-2 text-xs font-bold text-white shadow-lg">
 <Instagram className="h-4 w-4 text-white shrink-0" />
 {jenjang.instagramHandle}
 </span>
 </div>
 </a>
 </Reveal>
 ))}
 </div>
 </div>
 </section>

 <section className="bg-mist py-24">
 <div className="mx-auto max-w-4xl px-5">
 <Reveal variant="up">
 <h2 className="flex items-center gap-3 text-2xl font-extrabold sm:text-3xl">
 <CalendarDays className="h-6 w-6 text-gold" /> {t("Jadwal Kegiatan", "Activity Schedule")}
 </h2>
 </Reveal>
 <div className="mt-10 space-y-4">
 {jenjang.jadwal.map((j) => (
 <Reveal key={j.hari} variant="left">
 <div className="rounded-2xl border border-border bg-card p-5">
 <p className="text-xs font-bold uppercase tracking-widest text-gold">{t(j.hari, j.hariEn || j.hari)}</p>
 <p className="mt-1 text-sm text-muted-foreground">{t(j.kegiatan, j.kegiatanEn || j.kegiatan)}</p>
 </div>
 </Reveal>
 ))}
 </div>
 </div>
 </section>
 </>
 );
}
