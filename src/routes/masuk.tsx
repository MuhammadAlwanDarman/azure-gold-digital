import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { BarChart3, Bell, Download, FileSpreadsheet, LockKeyhole, Printer, ShieldCheck } from "lucide-react";
import { AuroraBackground, Counter, Magnetic, Reveal } from "@/components/site/effects";

export const Route = createFileRoute("/masuk")({
  head: () => ({
    meta: [
      { title: "Masuk Dashboard — STPI Zaid bin Tsabit" },
      {
        name: "description",
        content: "Portal orang tua dan admin STPI Zaid bin Tsabit: status pendaftaran, pembayaran, jadwal tes, dan pengelolaan data.",
      },
      { property: "og:title", content: "Masuk Dashboard — STPI Zaid bin Tsabit" },
      { property: "og:description", content: "Portal orang tua dan administrator sekolah." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MasukPage,
});

function MasukPage() {
  const [role, setRole] = useState<"orangtua" | "admin">("orangtua");
  const [masuk, setMasuk] = useState(false);

  return (
    <main className="relative min-h-screen overflow-hidden bg-mist pb-24 pt-36">
      <AuroraBackground />
      <div className="relative mx-auto max-w-5xl px-5">
        {!masuk ? (
          <Reveal variant="scale">
            <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-luxe">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">Masuk Portal</h1>
              <p className="mt-1 text-sm text-muted-foreground">Pilih peran dan masuk untuk melihat dashboard.</p>

              <div className="mt-6 grid grid-cols-2 gap-2 rounded-full bg-muted p-1">
                {(["orangtua", "admin"] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    className={`rounded-full py-2 text-xs font-bold uppercase tracking-widest transition-all ${
                      role === r ? "bg-navy text-primary-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {r === "orangtua" ? "Orang Tua" : "Admin"}
                  </button>
                ))}
              </div>

              <form
                className="mt-6 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setMasuk(true);
                }}
              >
                <input
                  required
                  type="email"
                  placeholder="Email"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <input
                  required
                  type="password"
                  placeholder="Kata sandi"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                />
                <Magnetic>
                  <button className="light-sweep w-full rounded-full bg-gradient-to-r from-gold-soft to-gold py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold">
                    Masuk
                  </button>
                </Magnetic>
              </form>
              <p className="mt-4 text-center text-[11px] text-muted-foreground">
                Demo antarmuka. Autentikasi aman dapat diaktifkan berikutnya.
              </p>
            </div>
          </Reveal>
        ) : role === "orangtua" ? (
          <DashboardOrangTua onLogout={() => setMasuk(false)} />
        ) : (
          <DashboardAdmin onLogout={() => setMasuk(false)} />
        )}
      </div>
    </main>
  );
}

function Shell({ title, sub, onLogout, children }: { title: string; sub: string; onLogout: () => void; children: React.ReactNode }) {
  return (
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold">{title}</h1>
          <p className="text-sm text-muted-foreground">{sub}</p>
        </div>
        <button onClick={onLogout} className="rounded-full border border-border px-5 py-2.5 text-xs font-bold uppercase tracking-widest hover:border-gold">
          Keluar
        </button>
      </div>
      <div className="mt-8">{children}</div>
    </motion.div>
  );
}

function DashboardOrangTua({ onLogout }: { onLogout: () => void }) {
  return (
    <Shell title="Dashboard Orang Tua" sub="Pantau proses pendaftaran putra-putri Anda." onLogout={onLogout}>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { l: "Status Pendaftaran", v: "Terverifikasi", c: "text-gold" },
          { l: "Status Pembayaran", v: "Lunas", c: "text-gold" },
          { l: "Jadwal Tes", v: "14 Des 2026 · 08.00", c: "" },
        ].map((s) => (
          <div key={s.l} className="rounded-3xl border border-border bg-card p-6">
            <p className="text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{s.l}</p>
            <p className={`mt-2 text-lg font-extrabold ${s.c}`}>{s.v}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 font-bold">
            <Bell className="h-4 w-4 text-gold" /> Pengumuman
          </h2>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="rounded-2xl border border-border p-3">Kartu ujian dapat diunduh mulai 1 Desember 2026.</li>
            <li className="rounded-2xl border border-border p-3">Wawancara orang tua dijadwalkan setelah tes tulis.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-bold">Dokumen & Riwayat</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { l: "Download Kartu Ujian", i: Download },
              { l: "Cetak Formulir", i: Printer },
              { l: "Riwayat Pembayaran", i: FileSpreadsheet },
              { l: "Bukti Verifikasi", i: ShieldCheck },
            ].map((a) => (
              <button
                key={a.l}
                className="flex items-center gap-3 rounded-2xl border border-border p-4 text-left text-sm font-semibold transition-all hover:-translate-y-1 hover:border-gold"
              >
                <a.i className="h-4 w-4 text-gold" /> {a.l}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function DashboardAdmin({ onLogout }: { onLogout: () => void }) {
  const bars = [42, 68, 55, 82, 74, 96];
  return (
    <Shell title="Dashboard Admin" sub="Kelola siswa, guru, konten, dan PPDB." onLogout={onLogout}>
      <div className="grid gap-5 sm:grid-cols-4">
        {[
          { l: "Pendaftar", v: 642 },
          { l: "Terverifikasi", v: 418 },
          { l: "Lunas", v: 377 },
          { l: "Siswa Aktif", v: 1840 },
        ].map((s) => (
          <div key={s.l} className="rounded-3xl border border-border bg-card p-6">
            <p className="text-3xl font-extrabold text-navy">
              <Counter to={s.v} />
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">{s.l}</p>
          </div>
        ))}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <div className="rounded-3xl border border-border bg-card p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-4 w-4 text-gold" /> Pendaftar per Bulan
          </h2>
          <div className="mt-6 flex h-44 items-end gap-3">
            {bars.map((b, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${b}%` }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                className="w-full rounded-t-xl bg-gradient-to-t from-navy to-gold"
              />
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6">
          <h2 className="font-bold">Kelola</h2>
          <div className="mt-4 grid gap-2">
            {["Siswa", "Guru", "Berita", "Prestasi", "Banner", "Jadwal", "PPDB"].map((m) => (
              <button
                key={m}
                className="rounded-2xl border border-border px-4 py-2.5 text-left text-sm font-semibold transition-colors hover:border-gold hover:text-gold"
              >
                {m}
              </button>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="flex-1 rounded-full bg-navy py-2.5 text-xs font-bold uppercase tracking-widest text-primary-foreground">
              Export Excel
            </button>
            <button className="flex-1 rounded-full border border-border py-2.5 text-xs font-bold uppercase tracking-widest">
              Export PDF
            </button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
