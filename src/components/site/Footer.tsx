import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { SCHOOL, JENJANG } from "@/lib/school-data";
import logo from "@/assets/logo.png";
import { Particles } from "./effects";
import { useLanguage } from "@/lib/LanguageContext";

export function Footer() {
 const { t } = useLanguage();
 const [waInput, setWaInput] = useState("");

 const handleWaSubmit = (e: React.FormEvent) => {
 e.preventDefault();
 if (!waInput.trim()) return;
 const cleanPhone = SCHOOL.phone.replace(/[^0-9]/g, "");
 const formattedPhone = cleanPhone.startsWith("0") ? `62${cleanPhone.slice(1)}` : cleanPhone;
 const waText = encodeURIComponent(waInput.trim());
 window.open(`https://wa.me/${formattedPhone}?text=${waText}`, "_blank");
 };

 return (
 <footer className="relative overflow-hidden bg-navy-deep text-primary-foreground">
 <div aria-hidden className="absolute inset-x-0 -top-1 h-24 overflow-hidden">
 <svg viewBox="0 0 1440 120" preserveAspectRatio="none" className="h-full w-[200%] animate-marquee">
 <path
 d="M0,60 C240,120 480,0 720,60 C960,120 1200,0 1440,60 L1440,120 L0,120 Z"
 fill="color-mix(in oklab, var(--navy) 85%, transparent)"
 />
 </svg>
 </div>
 <Particles count={18} />

 <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-28">
 <div className="glass rounded-3xl p-6 md:p-8">
 <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
 <div>
 <h3 className="text-xl font-extrabold">{t("Berlangganan Kabar Sekolah & Hubungi Admin", "School Updates & Contact Admin")}</h3>
 <p className="text-sm text-primary-foreground/70">
 {t("Ketik pesan Anda dan langsung terhubung dengan WhatsApp Admin Sekolah.", "Type your message to connect directly with School Admin WhatsApp.")}
 </p>
 </div>
 <form className="flex w-full max-w-md gap-2" onSubmit={handleWaSubmit}>
 <input
 type="text"
 required
 value={waInput}
 onChange={(e) => setWaInput(e.target.value)}
 placeholder={t("Ketik pesan Anda untuk Admin WA...", "Type your message for Admin WA...")}
 className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm placeholder:text-primary-foreground/50 focus:border-gold focus:outline-none"
 />
 <button type="submit" className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-navy-deep transition-transform hover:scale-105 shrink-0">
 {t("Kirim WA", "Send WA")}
 </button>
 </form>
 </div>
 </div>

 <div className="mt-12 grid gap-10 md:grid-cols-4">
 <div>
 <div className="flex items-center gap-3">
 <img src={logo} alt="Logo sekolah" loading="lazy" width={48} height={48} className="h-12 w-12 object-contain" />
 <span className="text-sm font-extrabold uppercase tracking-[0.18em]">{SCHOOL.short}</span>
 </div>
 <p className="mt-4 text-sm text-primary-foreground/70">{t(SCHOOL.motto, SCHOOL.mottoEn)}</p>
 <div className="mt-5 flex gap-3">
 {[
 { Icon: Instagram, href: SCHOOL.instagramUrl, label: "Instagram" },
 { Icon: Facebook, href: SCHOOL.facebookUrl, label: "Facebook" },
 { Icon: Youtube, href: SCHOOL.youtubeUrl, label: "Youtube" },
 ].map(({ Icon, href, label }, i) => (
 <a
 key={i}
 href={href}
 target={href !== "#" ? "_blank" : undefined}
 rel={href !== "#" ? "noopener noreferrer" : undefined}
 className="rounded-full border border-white/20 p-2.5 transition-colors hover:border-gold hover:text-gold"
 aria-label={label}
>
 <Icon className="h-4 w-4" />
 </a>
 ))}
 </div>
 </div>

 <div>
 <h4 className="text-sm font-bold uppercase tracking-widest text-gold">{t("Jenjang", "Levels")}</h4>
 <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
 {JENJANG.map((j) => (
 <li key={j.slug}>
 <Link to="/jenjang/$level" params={{ level: j.slug }} className="hover:text-gold">
 {t(`Jenjang ${j.label}`, `${j.label} Level`)}
 </Link>
 </li>
 ))}
 <li className="pt-1 border-t border-white/10">
 <Link to="/spp" className="font-bold text-emerald-400 hover:text-gold">
 {t("Pembayaran SPP Online", "Online SPP Payment")}
 </Link>
 </li>
 </ul>
 </div>

 <div>
 <h4 className="text-sm font-bold uppercase tracking-widest text-gold">{t("Kontak", "Contact")}</h4>
 <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
 <li>
 <a
 href={SCHOOL.mapsUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="flex gap-2 transition-colors hover:text-gold"
>
 <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {t(SCHOOL.address, SCHOOL.addressEn)}
 </a>
 </li>
 <li className="flex gap-2">
 <Phone className="h-4 w-4 shrink-0 text-gold" /> {SCHOOL.phone}
 </li>
 <li className="flex gap-2">
 <Mail className="h-4 w-4 shrink-0 text-gold" /> {SCHOOL.email}
 </li>
 </ul>
 </div>

 <div>
 <h4 className="text-sm font-bold uppercase tracking-widest text-gold">{t("Peta Lokasi Google Maps", "Google Maps Location")}</h4>
 <div className="mt-4 overflow-hidden rounded-2xl border border-white/15 shadow-sm">
 <iframe
 title="Peta Lokasi PKBM Zaid bin Tsabit Samarinda"
 src={SCHOOL.mapsEmbed}
 loading="lazy"
 allowFullScreen
 className="h-36 w-full grayscale transition-all duration-500 hover:grayscale-0"
 />
 </div>
 <a
 href={SCHOOL.mapsUrl}
 target="_blank"
 rel="noopener noreferrer"
 className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold hover:underline"
>
 <MapPin className="h-3.5 w-3.5" /> {t("Buka Lokasi di Google Maps", "Open Location in Google Maps")} &rarr;
 </a>
 </div>
 </div>

 <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-primary-foreground/50">
 {new Date().getFullYear()} {t(SCHOOL.name, SCHOOL.nameEn)}. {t("Seluruh hak cipta dilindungi.", "All rights reserved.")}
 </div>
 </div>
 </footer>
 );
}
