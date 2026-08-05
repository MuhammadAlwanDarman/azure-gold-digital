import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { GraduationCap, Globe, Menu, Moon, Search, Sun, X } from "lucide-react";
import logo from "@/assets/logo.png";
import { JENJANG } from "@/lib/school-data";
import { Magnetic } from "./effects";

const LINKS = [
  { label: "Beranda", to: "/", hash: "" },
  { label: "Tentang", to: "/", hash: "#tentang" },
  { label: "Program", to: "/", hash: "#program" },
  { label: "Galeri", to: "/", hash: "#galeri" },
  { label: "Prestasi", to: "/", hash: "#prestasi" },
  { label: "Berita", to: "/", hash: "#berita" },
];

export function Navbar() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  const [mega, setMega] = useState(false);
  const [dark, setDark] = useState(false);
  const [lang, setLang] = useState<"ID" | "EN">("ID");
  const [search, setSearch] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

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
          <img src={logo} alt="Logo STPI Zaid bin Tsabit" width={44} height={44} className="h-11 w-11 object-contain drop-shadow-[0_0_12px_color-mix(in_oklab,var(--gold)_60%,transparent)]" />
          <span className="leading-tight">
            <span className="block text-sm font-extrabold tracking-[0.18em] text-primary-foreground uppercase">STPI</span>
            <span className="block text-[11px] font-medium tracking-[0.28em] text-gold uppercase">Zaid bin Tsabit</span>
          </span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {LINKS.map((l) => (
            <a
              key={l.label}
              href={`${l.hash || "/"}`}
              className="relative rounded-full px-3.5 py-2 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-gold"
            >
              {l.label}
            </a>
          ))}

          <div className="relative" onMouseEnter={() => setMega(true)} onMouseLeave={() => setMega(false)}>
            <button className="flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-medium text-primary-foreground/85 transition-colors hover:text-gold">
              <GraduationCap className="h-4 w-4" /> Jenjang
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
                        <p className="text-sm font-bold text-gold">{j.label}</p>
                        <p className="text-xs text-primary-foreground/70">{j.usia}</p>
                        <p className="mt-2 text-xs text-primary-foreground/60">{j.tagline}</p>
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
            aria-label="Cari"
            onClick={() => setSearch((s) => !s)}
            className="rounded-full border border-white/15 p-2 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
          >
            <Search className="h-4 w-4" />
          </button>
          <button
            aria-label="Ubah bahasa"
            onClick={() => setLang((l) => (l === "ID" ? "EN" : "ID"))}
            className="hidden items-center gap-1 rounded-full border border-white/15 px-3 py-2 text-xs font-semibold text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold sm:flex"
          >
            <Globe className="h-3.5 w-3.5" /> {lang}
          </button>
          <button
            aria-label="Mode gelap"
            onClick={() => setDark((d) => !d)}
            className="rounded-full border border-white/15 p-2 text-primary-foreground/80 transition-colors hover:border-gold hover:text-gold"
          >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <Link
            to="/masuk"
            className="hidden rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:border-gold hover:text-gold md:block"
          >
            Login
          </Link>
          <Magnetic className="hidden md:block">
            <Link
              to="/ppdb"
              className="light-sweep block rounded-full bg-gradient-to-r from-gold-soft to-gold px-5 py-2.5 text-xs font-extrabold tracking-wide text-navy-deep uppercase shadow-gold"
            >
              PPDB
            </Link>
          </Magnetic>
          <button
            aria-label="Menu"
            onClick={() => setOpen((o) => !o)}
            className="rounded-full border border-white/15 p-2 text-primary-foreground lg:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {search && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mx-auto max-w-7xl overflow-hidden px-5"
          >
            <input
              autoFocus
              placeholder="Cari program, berita, atau informasi PPDB…"
              className="mt-3 w-full rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm text-primary-foreground placeholder:text-primary-foreground/50 focus:border-gold focus:outline-none"
            />
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
              {LINKS.map((l) => (
                <a
                  key={l.label}
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
                  Jenjang {j.label}
                </Link>
              ))}
              <Link
                to="/ppdb"
                onClick={() => setOpen(false)}
                className="mt-2 rounded-xl bg-gold px-3 py-2.5 text-center text-sm font-bold text-navy-deep"
              >
                Daftar PPDB
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
