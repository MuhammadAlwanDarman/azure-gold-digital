import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, Mail, MapPin, Phone, Youtube } from "lucide-react";
import { SCHOOL, JENJANG } from "@/lib/school-data";
import logo from "@/assets/logo.png";
import { Particles } from "./effects";

export function Footer() {
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
              <h3 className="text-xl font-extrabold">Berlangganan Kabar Sekolah</h3>
              <p className="text-sm text-primary-foreground/70">Info PPDB, prestasi, dan agenda langsung ke email Anda.</p>
            </div>
            <form className="flex w-full max-w-md gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                required
                placeholder="Email Anda"
                className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 text-sm placeholder:text-primary-foreground/50 focus:border-gold focus:outline-none"
              />
              <button className="rounded-full bg-gold px-5 py-3 text-sm font-bold text-navy-deep transition-transform hover:scale-105">
                Kirim
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
            <p className="mt-4 text-sm text-primary-foreground/70">{SCHOOL.motto}</p>
            <div className="mt-5 flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="rounded-full border border-white/20 p-2.5 transition-colors hover:border-gold hover:text-gold"
                  aria-label="Sosial media"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold">Jenjang</h4>
            <ul className="mt-4 space-y-2 text-sm text-primary-foreground/70">
              {JENJANG.map((j) => (
                <li key={j.slug}>
                  <Link to="/jenjang/$level" params={{ level: j.slug }} className="hover:text-gold">
                    Jenjang {j.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold">Kontak</h4>
            <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
              <li className="flex gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" /> {SCHOOL.address}
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
            <h4 className="text-sm font-bold uppercase tracking-widest text-gold">Lokasi</h4>
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/15">
              <iframe
                title="Peta lokasi sekolah"
                src="https://www.google.com/maps?q=Bogor&output=embed"
                loading="lazy"
                className="h-40 w-full grayscale transition-all duration-500 hover:grayscale-0"
              />
            </div>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} {SCHOOL.name}. Seluruh hak cipta dilindungi.
        </div>
      </div>
    </footer>
  );
}
