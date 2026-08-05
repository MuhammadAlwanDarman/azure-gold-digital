import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Check, CreditCard, FileText, Upload, UserRound, Wallet } from "lucide-react";
import { JENJANG } from "@/lib/school-data";
import { AuroraBackground, Magnetic, Particles, Reveal } from "@/components/site/effects";

export const Route = createFileRoute("/ppdb")({
  head: () => ({
    meta: [
      { title: "PPDB Online 2026/2027 — STPI Zaid bin Tsabit" },
      {
        name: "description",
        content: "Daftar online jenjang TK, SD, SMP, dan SMA STPI Zaid bin Tsabit. Proses enam langkah, draft tersimpan otomatis.",
      },
      { property: "og:title", content: "PPDB Online 2026/2027 — STPI Zaid bin Tsabit" },
      { property: "og:description", content: "Formulir pendaftaran siswa baru yang cepat, aman, dan tersimpan otomatis." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: PpdbPage,
});

const STEPS = ["Pilih Jenjang", "Biodata", "Dokumen", "Konfirmasi", "Pembayaran", "Selesai"];
const DOKUMEN = ["Kartu Keluarga", "Akta Kelahiran", "Pas Foto", "Rapor Terakhir", "Sertifikat Prestasi"];
const STORAGE_KEY = "ppdb-draft-zbt";

type Form = {
  jenjang: string;
  nama: string;
  nisn: string;
  lahir: string;
  wali: string;
  telepon: string;
  email: string;
  alamat: string;
  dokumen: string[];
  metode: string;
};

const EMPTY: Form = {
  jenjang: "",
  nama: "",
  nisn: "",
  lahir: "",
  wali: "",
  telepon: "",
  email: "",
  alamat: "",
  dokumen: [],
  metode: "QRIS",
};

function PpdbPage() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);
  const [saved, setSaved] = useState(false);
  const [regNo] = useState(() => `ZBT-2026-${Math.floor(1000 + Math.random() * 8999)}`);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setForm({ ...EMPTY, ...JSON.parse(raw) });
      } catch {
        /* ignore corrupt draft */
      }
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
      setSaved(true);
      const s = setTimeout(() => setSaved(false), 1400);
      return () => clearTimeout(s);
    }, 600);
    return () => clearTimeout(t);
  }, [form]);

  const set = (k: keyof Form, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const valid =
    (step === 0 && !!form.jenjang) ||
    (step === 1 && !!form.nama && !!form.wali && /^\S+@\S+\.\S+$/.test(form.email) && form.telepon.length >= 9) ||
    (step === 2 && form.dokumen.length >= 3) ||
    step === 3 ||
    step === 4 ||
    step === 5;

  return (
    <main className="relative min-h-screen overflow-hidden bg-mist pb-24 pt-36">
      <AuroraBackground />
      <div className="relative mx-auto max-w-4xl px-5">
        <Reveal variant="blur">
          <div className="text-center">
            <span className="rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-gold">
              PPDB Online 2026/2027
            </span>
            <h1 className="mt-5 text-3xl font-extrabold sm:text-5xl">Formulir Pendaftaran Siswa Baru</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Enam langkah singkat. Draft Anda tersimpan otomatis di perangkat ini.
            </p>
          </div>
        </Reveal>

        <div className="mt-12">
          <div className="flex items-center justify-between gap-1">
            {STEPS.map((s, i) => (
              <div key={s} className="flex flex-1 flex-col items-center gap-2">
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-500 ${
                    i <= step ? "bg-gold text-navy-deep shadow-gold" : "bg-card text-muted-foreground"
                  }`}
                >
                  {i < step ? <Check className="h-4 w-4" /> : i + 1}
                </div>
                <span className="hidden text-[10px] font-semibold uppercase tracking-widest text-muted-foreground sm:block">
                  {s}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-card">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-gold-soft to-gold"
              animate={{ width: `${(step / (STEPS.length - 1)) * 100}%` }}
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
                  <h2 className="text-xl font-bold">Pilih Jenjang</h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {JENJANG.map((j) => (
                      <button
                        key={j.slug}
                        onClick={() => set("jenjang", j.label)}
                        className={`rounded-2xl border p-5 text-left transition-all hover:-translate-y-1 ${
                          form.jenjang === j.label ? "border-gold bg-gold/10 shadow-gold" : "border-border"
                        }`}
                      >
                        <p className="text-lg font-extrabold">{j.label}</p>
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">{j.usia}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {step === 1 && (
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <UserRound className="h-5 w-5 text-gold" /> Biodata Calon Siswa
                  </h2>
                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    {(
                      [
                        ["nama", "Nama Lengkap", "text"],
                        ["nisn", "NISN", "text"],
                        ["lahir", "Tanggal Lahir", "date"],
                        ["wali", "Nama Orang Tua/Wali", "text"],
                        ["telepon", "Nomor WhatsApp", "tel"],
                        ["email", "Email", "email"],
                      ] as const
                    ).map(([k, label, type]) => (
                      <label key={k} className="text-sm">
                        <span className="font-semibold">{label}</span>
                        <input
                          type={type}
                          value={form[k]}
                          onChange={(e) => set(k, e.target.value)}
                          className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                        />
                      </label>
                    ))}
                    <label className="text-sm sm:col-span-2">
                      <span className="font-semibold">Alamat</span>
                      <textarea
                        rows={3}
                        value={form.alamat}
                        onChange={(e) => set("alamat", e.target.value)}
                        className="mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                    </label>
                  </div>
                  {!valid && <p className="mt-4 text-xs text-destructive">Lengkapi nama, wali, email valid, dan nomor WhatsApp.</p>}
                </div>
              )}

              {step === 2 && (
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Upload className="h-5 w-5 text-gold" /> Unggah Dokumen
                  </h2>
                  <div className="mt-6 space-y-3">
                    {DOKUMEN.map((d) => {
                      const done = form.dokumen.includes(d);
                      return (
                        <button
                          key={d}
                          onClick={() =>
                            setForm((f) => ({
                              ...f,
                              dokumen: done ? f.dokumen.filter((x) => x !== d) : [...f.dokumen, d],
                            }))
                          }
                          className={`flex w-full items-center justify-between rounded-2xl border border-dashed p-4 text-left text-sm transition-all ${
                            done ? "border-gold bg-gold/10" : "border-border hover:border-gold"
                          }`}
                        >
                          <span className="flex items-center gap-3">
                            <FileText className="h-4 w-4 text-gold" /> {d}
                          </span>
                          <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            {done ? "Terunggah" : "Pilih file"}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {!valid && <p className="mt-4 text-xs text-destructive">Unggah minimal 3 dokumen.</p>}
                </div>
              )}

              {step === 3 && (
                <div>
                  <h2 className="text-xl font-bold">Konfirmasi Data</h2>
                  <dl className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ["Jenjang", form.jenjang],
                      ["Nama", form.nama],
                      ["NISN", form.nisn],
                      ["Tanggal Lahir", form.lahir],
                      ["Wali", form.wali],
                      ["WhatsApp", form.telepon],
                      ["Email", form.email],
                      ["Dokumen", `${form.dokumen.length} berkas`],
                    ].map(([k, v]) => (
                      <div key={k} className="rounded-2xl border border-border p-4">
                        <dt className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{k}</dt>
                        <dd className="mt-1 text-sm font-semibold">{v || "—"}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              )}

              {step === 4 && (
                <div>
                  <h2 className="flex items-center gap-2 text-xl font-bold">
                    <Wallet className="h-5 w-5 text-gold" /> Pembayaran Formulir
                  </h2>
                  <p className="mt-2 text-sm text-muted-foreground">Biaya pendaftaran Rp350.000 (sekali bayar).</p>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {["QRIS", "Transfer Bank", "Virtual Account", "E-Wallet"].map((m) => (
                      <button
                        key={m}
                        onClick={() => set("metode", m)}
                        className={`flex items-center gap-3 rounded-2xl border p-4 text-sm font-semibold transition-all ${
                          form.metode === m ? "border-gold bg-gold/10 shadow-gold" : "border-border hover:border-gold"
                        }`}
                      >
                        <CreditCard className="h-4 w-4 text-gold" /> {m}
                      </button>
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Status pembayaran akan diperbarui otomatis setelah gerbang pembayaran diaktifkan.
                  </p>
                </div>
              )}

              {step === 5 && (
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
                  <h2 className="mt-6 text-2xl font-extrabold">Pendaftaran Berhasil!</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Nomor pendaftaran Anda: <span className="font-bold text-foreground">{regNo}</span>
                  </p>
                  <div className="mx-auto mt-6 grid h-32 w-32 grid-cols-8 gap-0.5 rounded-xl bg-card p-2 shadow-luxe">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <span key={i} className={`rounded-[1px] ${(i * 7) % 3 === 0 ? "bg-navy" : "bg-transparent"}`} />
                    ))}
                  </div>
                  <p className="mt-4 text-xs text-muted-foreground">
                    Konfirmasi dikirim ke email dan WhatsApp Anda. Pantau status di dashboard orang tua.
                  </p>
                  <Link
                    to="/masuk"
                    className="mt-6 inline-block rounded-full bg-navy px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-primary-foreground"
                  >
                    Buka Dashboard
                  </Link>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {step < 5 && (
            <div className="mt-10 flex items-center justify-between gap-3">
              <button
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0}
                className="rounded-full border border-border px-6 py-3 text-sm font-bold uppercase tracking-wide disabled:opacity-40"
              >
                Kembali
              </button>
              <span className="text-[11px] uppercase tracking-widest text-muted-foreground">
                {saved ? "Draft tersimpan" : ""}
              </span>
              <Magnetic>
                <button
                  onClick={() => valid && setStep((s) => s + 1)}
                  disabled={!valid}
                  className="light-sweep rounded-full bg-gradient-to-r from-gold-soft to-gold px-7 py-3 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold disabled:opacity-40"
                >
                  {step === 4 ? "Bayar & Selesaikan" : "Lanjutkan"}
                </button>
              </Magnetic>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
