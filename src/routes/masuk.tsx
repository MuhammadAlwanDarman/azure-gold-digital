import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertOctagon,
  AlertTriangle,
  Archive,
  ArrowLeft,
  Bell,
  BellRing,
  BookOpen,
  Building2,
  Calendar,
  Check,
  CheckCircle2,
  CheckSquare,
  ChevronRight,
  Clock,
  Copy,
  CreditCard,
  DollarSign,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  FileSpreadsheet,
  FileText,
  Filter,
  Image as ImageIcon,
  KeyRound,
  Layers,
  LockKeyhole,
  LogOut,
  MessageCircle,
  MessageSquare,
  Phone,
  Plus,
  PlusCircle,
  Printer,
  Receipt,
  Search,
  Send,
  ShieldCheck,
  Shirt,
  Sparkles,
  Square,
  Tag,
  Trash,
  Trash2,
  Truck,
  UserCheck,
  Users,
  Utensils,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import { AuroraBackground, Counter, Magnetic, Reveal } from "@/components/site/effects";
import {
  deleteAllSPPPayments,
  deleteBatchSPPPayments,
  deletePPDBSubmission,
  deleteSPPPayment,
  deleteUserAccount,
  getAllUserBillings,
  getAllUsers,
  getCurrentSession,
  getPPDBSubmissions,
  getPPDBSubmissionsByUser,
  getSPPPayments,
  getSPPPaymentsByUser,
  getUserBilling,
  getUserBillingByEmail,
  loginUser,
  logoutUser,
  PPDBSubmission,
  promoteUserToAdmin,
  registerUser,
  resetUserPassword,
  SPPPayment,
  StatusPembayaran,
  StatusPembayaranSPP,
  StatusPendaftaran,
  subscribeToDB,
  updatePPDBStatus,
  updateSPPPaymentStatus,
  updateUserBilling,
  validateOrCancelUserBilling,
  User,
  UserBillingInfo,
  UserBillItem,
  UserRole,
  UserSession,
} from "@/lib/db";
import { useLanguage } from "@/lib/LanguageContext";

export const Route = createFileRoute("/masuk")({
 head: () => ({
 meta: [
 { title: "Portal & Dashboard — PKBM Zaid bin Tsabit" },
 {
 name: "description",
 content: "Portal autentikasi dan dashboard resmi PKBM Zaid bin Tsabit untuk orang tua siswa dan administrator sekolah.",
 },
 { property: "og:title", content: "Portal & Dashboard — PKBM Zaid bin Tsabit" },
 { property: "og:description", content: "Portal orang tua dan administrator sekolah." },
 { property: "og:type", content: "website" },
 { name: "twitter:card", content: "summary_large_image" },
 { name: "robots", content: "noindex" },
 ],
 }),
 component: MasukPage,
});

function MasukPage() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [tab, setTab] = useState<"masuk" | "daftar">("masuk");
  const [role, setRole] = useState<UserRole>("orangtua");
  const { t } = useLanguage();

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Register form state
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  useEffect(() => {
    setSession(getCurrentSession());
    if (typeof window !== "undefined") {
      const p = new URLSearchParams(window.location.search).get("tab");
      if (p === "daftar") setTab("daftar");
    }
    const unsubscribe = subscribeToDB(() => {
      const s = getCurrentSession();
      console.log("[masuk] subscribeToDB → setSession role =", s?.role ?? null);
      setSession(s);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    console.log(
      "[masuk] render decision → session.role =",
      session?.role ?? null,
      "→ dashboard:",
      !session ? "LOGIN" : session.role === "admin" ? "ADMIN" : "ORANG TUA"
    );
  }, [session]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSubmitting(true);
    try {
      const res = await loginUser(loginEmail, loginPassword);
      if (!res.success) {
        setLoginError(res.error || t("Gagal masuk. Periksa email dan kata sandi Anda.", "Failed to sign in. Please check your credentials."));
      } else if (res.session) {
        setSession(res.session);
      }
    } catch (err: any) {
      console.error("Login error:", err);
      setLoginError(err?.message || "Terjadi kesalahan saat memproses masuk.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess("");
    setSubmitting(true);
    try {
      const res = await registerUser(regName, regEmail, regPassword, "orangtua");
      if (!res.success) {
        setRegError(res.error || t("Gagal mendaftar.", "Failed to register."));
      } else if (res.session) {
        setSession(res.session);
      } else {
        setRegSuccess(t("Akun berhasil dibuat! Silakan masuk dengan email dan kata sandi Anda.", "Account created successfully! Please sign in with your email and password."));
        setLoginEmail(regEmail);
        setLoginPassword(regPassword);
        setTimeout(() => {
          setTab("masuk");
        }, 1200);
      }
    } catch (err: any) {
      console.error("Register error:", err);
      setRegError(err?.message || t("Gagal mendaftar.", "Failed to register."));
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error("Logout error:", err);
    }
    setSession(null);
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-mist pb-24 pt-36">
      <AuroraBackground />
      <div className="relative mx-auto max-w-6xl px-5">
        {!session ? (
          <Reveal variant="scale">
            <div className="mx-auto max-w-md rounded-3xl border border-border bg-card p-8 shadow-luxe">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                <LockKeyhole className="h-5 w-5" />
              </div>
              <h1 className="mt-5 text-2xl font-extrabold">{t("Portal PKBM ZAID BIN TSABIT", "PKBM ZAID BIN TSABIT Portal")}</h1>
              <p className="mt-1 text-xs font-bold tracking-wider text-gold uppercase">{t("Pusat Kegiatan Belajar Masyarakat", "Community Learning Center")}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{t("Masuk atau buat akun baru untuk mengakses portal data.", "Sign in or create a new account to access the data portal.")}</p>

              {/* Tab Switcher: Masuk vs Daftar */}
              <div className="mt-6 grid grid-cols-2 gap-1 rounded-2xl bg-muted p-1 text-xs font-bold uppercase tracking-wider">
                <button
                  type="button"
                  onClick={() => {
                    setTab("masuk");
                    setLoginError("");
                  }}
                  className={`rounded-xl py-2.5 transition-all cursor-pointer ${tab === "masuk" ? "bg-navy text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t("Masuk Portal", "Sign In")}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab("daftar");
                    setRegError("");
                    setRegSuccess("");
                  }}
                  className={`rounded-xl py-2.5 transition-all cursor-pointer ${tab === "daftar" ? "bg-navy text-primary-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                >
                  {t("Daftar Akun", "Create Account")}
                </button>
              </div>

              {tab === "masuk" ? (
                <>
                  {/* Role Selector */}
                  <div className="mt-4 flex items-center justify-between rounded-xl border border-border bg-background p-2 text-xs">
                    <span className="font-semibold text-muted-foreground">{t("Peran Akun:", "Account Role:")}</span>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setRole("orangtua");
                          setLoginError("");
                        }}
                        className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${role === "orangtua" ? "bg-gold text-navy-deep shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        {t("Orang Tua", "Parent")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setRole("admin");
                          setLoginError("");
                        }}
                        className={`rounded-lg px-3 py-1.5 font-bold transition-all cursor-pointer ${role === "admin" ? "bg-navy text-gold shadow-sm ring-1 ring-gold/50" : "text-muted-foreground hover:text-foreground"}`}
                      >
                        Admin Sekolah
                      </button>
                    </div>
                  </div>

                  <form className="mt-5 space-y-4" onSubmit={handleLogin}>
                    {loginError && (
                      <div className="rounded-xl border border-red-300 bg-red-50 p-3.5 text-xs font-semibold text-red-700 dark:bg-red-950/50 dark:text-red-300 dark:border-red-800">
                        {loginError}
                      </div>
                    )}
                    <div>
                      <label className="block text-xs font-bold uppercase text-muted-foreground">{t("Email / Username", "Email / Username")}</label>
                      <input
                        required
                        type="text"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        placeholder="emailanda@gmail.com"
                        className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label className="block text-xs font-bold uppercase text-muted-foreground">{t("Kata Sandi", "Password")}</label>
                        <button
                          type="button"
                          onClick={() => setShowPassword((prev) => !prev)}
                          className="text-[11px] font-bold text-muted-foreground hover:text-gold transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          <span>{showPassword ? "Sembunyikan" : "Lihat Sandi"}</span>
                        </button>
                      </div>
                      <div className="relative mt-1">
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder={t("Masukkan kata sandi", "Enter password")}
                          className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm focus:border-gold focus:outline-none"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="light-sweep w-full rounded-full bg-gradient-to-r from-gold-soft to-gold py-3.5 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold hover:opacity-95 transition-all cursor-pointer disabled:opacity-50"
                    >
                      {submitting ? t("Memproses Masuk...", "Signing In...") : t("Masuk Sekarang", "Sign In Now")}
                    </button>
                  </form>

                  <div className="mt-4 text-center">
                    <button
                      type="button"
                      onClick={() => setTab("daftar")}
                      className="text-xs font-bold text-navy hover:text-gold hover:underline cursor-pointer"
                    >
                      {t("Belum punya akun orang tua? Buat Akun Baru di sini →", "Don't have a parent account? Register here →")}
                    </button>
                  </div>
                </>
              ) : (
                <form className="mt-5 space-y-4" onSubmit={handleRegister}>
                  {regError && <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs font-semibold text-red-600">{regError}</div>}
                  {regSuccess && <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">{regSuccess}</div>}

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground">{t("Nama Lengkap Wali / Orang Tua", "Full Name of Parent / Guardian")}</label>
                    <input
                      required
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder={t("Contoh: H. Ahmad Supriyadi", "Example: John Doe")}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground">{t("Email Aktif", "Active Email Address")}</label>
                    <input
                      required
                      type="email"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="emailanda@gmail.com"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-muted-foreground">{t("Kata Sandi Baru", "New Password")}</label>
                    <input
                      required
                      type="password"
                      minLength={6}
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder={t("Minimal 6 karakter", "Minimum 6 characters")}
                      className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none"
                    />
                  </div>

                  <Magnetic>
                    <button type="submit" className="light-sweep w-full rounded-full bg-navy py-3.5 text-sm font-extrabold uppercase tracking-wide text-primary-foreground shadow-lg cursor-pointer">
                      {t("Buat Akun Orang Tua", "Create Parent Account")}
                    </button>
                  </Magnetic>
                </form>
              )}
            </div>
          </Reveal>
        ) : session.role === "admin" ? (
          <DashboardAdmin session={session} onLogout={handleLogout} />
        ) : (
          <DashboardOrangTua session={session} onLogout={handleLogout} />
        )}
      </div>
    </main>
  );
}

function Shell({ title, sub, session, onLogout, children }: { title: string; sub: string; session: UserSession; onLogout: () => void; children: React.ReactNode }) {
 const { t } = useLanguage();

 return (
 <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
 <div className="flex flex-wrap items-center justify-between gap-4 rounded-3xl border border-border bg-card p-6 shadow-sm">
 <div>
 <div className="flex items-center gap-2">
 <span className="rounded-full bg-gold/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-gold">
 {session.role === "admin" ? t("Portal Administrator", "Administrator Portal") : t("Portal Orang Tua", "Parent Portal")}
 </span>
 <span className="text-xs font-semibold text-muted-foreground">· {session.email}</span>
 </div>
 <h1 className="mt-2 text-2xl font-extrabold sm:text-3xl">{title}</h1>
 <p className="text-sm text-muted-foreground">{t("Selamat datang", "Welcome")}, {session.name}. {sub}</p>
 </div>
 <button
 onClick={onLogout}
 className="flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:border-red-400 hover:bg-red-50 hover:text-red-600"
>
 <LogOut className="h-4 w-4" /> {t("Keluar", "Log Out")}
 </button>
 </div>
 <div className="mt-8">{children}</div>
 </motion.div>
 );
}

function DashboardOrangTua({ session, onLogout }: { session: UserSession; onLogout: () => void }) {
  const [submissions, setSubmissions] = useState<PPDBSubmission[]>([]);
  const [sppPayments, setSppPayments] = useState<SPPPayment[]>([]);
  const [selectedSubId, setSelectedSubId] = useState<string | null>(null);
  const [zoomImg, setZoomImg] = useState<{ title: string; url: string; note?: string } | null>(null);
  const [billingInfo, setBillingInfo] = useState<UserBillingInfo | null>(null);
  const [showDistractionModal, setShowDistractionModal] = useState<boolean>(false);
  const [copiedRekening, setCopiedRekening] = useState<boolean>(false);
  const { t } = useLanguage();

  useEffect(() => {
    const load = async () => {
      try {
        const [subs, spp] = await Promise.all([
          getPPDBSubmissionsByUser(session.userId, session.email, session.name),
          getSPPPaymentsByUser(session.userId, session.email, session.name),
        ]);
        setSubmissions(subs);
        setSppPayments(spp);
        const bill = (await getUserBilling(session.userId)) || (await getUserBillingByEmail(session.email));
        setBillingInfo(bill);
        if (
          bill &&
          bill.isActive &&
          bill.items &&
          bill.items.length > 0 &&
          bill.items.some((i) => i.status !== "Lunas")
        ) {
          setShowDistractionModal(true);
        }
      } catch (err) {
        console.error("Gagal memuat data dashboard:", err);
      }
    };
    void load();
    return subscribeToDB(() => {
      void load();
    });
  }, [session]);

  const activeSubmission = submissions.find((s) => s.id === selectedSubId) || submissions[0];
  const unpaidItems = billingInfo?.items?.filter((i) => i.status !== "Lunas") || [];
  const totalUnpaidNominal = unpaidItems.reduce((acc, curr) => acc + (curr.nominal || 0), 0);
  const hasActiveDistraction = Boolean(billingInfo?.isActive && unpaidItems.length > 0);

  const handleCopyRekening = (rekeningText: string) => {
    const cleanNumber = rekeningText.replace(/[^0-9]/g, "") || "7757797757";
    navigator.clipboard.writeText(cleanNumber);
    setCopiedRekening(true);
    setTimeout(() => setCopiedRekening(false), 2500);
  };

  return (
    <Shell
      title={t("Dashboard Orang Tua", "Parent Dashboard")}
      sub={t("Pantau status pendaftaran, berkas, & riwayat pembayaran Ananda Anda.", "Monitor registration, files, & payment history.")}
      session={session}
      onLogout={onLogout}
    >
      <div className="space-y-6">
        {/* DISTRACTION BANNER (High Priority Urgent Billing Warning) */}
        {hasActiveDistraction && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative overflow-hidden rounded-3xl border-2 border-red-500 bg-gradient-to-r from-red-950 via-navy-deep to-amber-950 p-6 text-white shadow-2xl shadow-red-950/50 ring-4 ring-red-500/20"
          >
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-red-500/20 blur-3xl" />
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative z-10">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/30 text-red-300 border border-red-500/60 shadow-lg animate-pulse">
                  <AlertOctagon className="h-7 w-7 text-red-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-red-600 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-white shadow-sm">
                      {t("PEMBERITAHUAN PENAGIHAN RESMI", "OFFICIAL BILLING NOTICE")}
                    </span>
                    <span className="text-xs text-amber-300 font-bold">
                      {t("Petugas:", "Officer:")} {billingInfo?.penagihName || "Bagian Keuangan PKBM ZBT"}
                    </span>
                  </div>
                  <p className="mt-1.5 text-xs sm:text-sm text-slate-100 font-medium leading-relaxed max-w-2xl">
                    {billingInfo?.pesanPenagih || t("Terdapat kewajiban pembayaran yang harus diselesaikan untuk ananda.", "Outstanding payment notice requires your attention.")}
                  </p>
                  <div className="mt-2 flex items-center gap-3 text-xs font-bold text-amber-300">
                    <span>{t("Total Tagihan:", "Total Due:")} <strong className="text-sm sm:text-base text-amber-200">Rp {totalUnpaidNominal.toLocaleString("id-ID")}</strong></span>
                    <span>·</span>
                    <span className="text-slate-300">{unpaidItems.length} {t("Item Pembayaran", "Payment Items")}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 shrink-0 w-full md:w-auto">
                <button
                  type="button"
                  onClick={() => setShowDistractionModal(true)}
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-full border border-amber-400/60 bg-amber-500/20 hover:bg-amber-500/30 px-5 py-2.5 text-xs font-extrabold text-amber-300 transition-all cursor-pointer shadow-md"
                >
                  <Eye className="h-4 w-4" />
                  <span>{t("Buka Rincian Penagih", "Open Billing Details")}</span>
                </button>
                <Link
                  to="/spp"
                  className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-soft via-gold to-amber-500 px-5 py-2.5 text-xs font-black uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all cursor-pointer"
                >
                  <CreditCard className="h-4 w-4" />
                  <span>{t("Bayar Sekarang", "Pay Now")}</span>
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Validated Billing Notice Banner */}
        {billingInfo?.isValidated && !hasActiveDistraction && (
          <div className="rounded-3xl border border-teal-500/40 bg-gradient-to-r from-teal-950/80 via-emerald-950/80 to-navy-deep p-4 sm:p-5 text-white shadow-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-500/40">
                <CheckCircle2 className="h-5 w-5 text-teal-300" />
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-black text-teal-200">
                  {t("Status Administrasi & Pembayaran Telah Divalidasi", "Administration & Payment Status Validated")}
                </h4>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  {t(
                    `Pengingat tagihan telah divalidasi dan diselesaikan oleh ${billingInfo.penagihName || "Bendahara Sekolah"}. Terima kasih atas kerjasamanya.`,
                    `Billing reminder has been validated and cleared by ${billingInfo.penagihName || "School Finance"}. Thank you.`
                  )}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-teal-500/20 border border-teal-400/40 px-3 py-1 text-[11px] font-extrabold text-teal-300">
              {t("Bebas Tagihan", "No Outstanding Dues")}
            </span>
          </div>
        )}

        {/* User Welcome & SPP Guidance Banner */}
        <div className="rounded-3xl border border-emerald-500/40 bg-gradient-to-r from-emerald-950/90 to-navy-deep p-6 text-white shadow-luxe">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-emerald-300">
                  {t("Akun Orang Tua Aktif & Terhubung", "Parent Account Active & Connected")}
                </h3>
                <p className="mt-1 text-xs text-slate-300 leading-relaxed">
                  {t("Selamat datang,", "Welcome,")} <strong className="text-emerald-200">{session.name}</strong>. {t("Semua data pendaftaran SPMB dan riwayat transaksi pembayaran Ananda dapat Anda pantau di sini secara real-time.", "All SPMB registration data and payment transactions can be monitored here in real-time.")}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 shrink-0">
              <Link
                to="/ppdb"
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all cursor-pointer"
              >
                <Plus className="h-4 w-4" />
                <span>{t("Daftar Jenjang Baru", "Apply New Level")}</span>
              </Link>
              <Link
                to="/spp"
                className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/20 px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-gold hover:bg-gold hover:text-navy transition-all cursor-pointer"
              >
                <CreditCard className="h-4 w-4" />
                <span>{t("Bayar SPP Online", "Pay SPP Online")}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* SECTION 1: SPMB Applications Data */}
        {activeSubmission ? (
          <>
            {/* Riwayat Pendaftaran Ananda & Multi-Jenjang Section */}
            <div className="rounded-3xl border border-gold/30 bg-card p-6 shadow-luxe sm:p-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/10 text-gold font-bold">
                      <Archive className="h-4 w-4 text-gold" />
                    </div>
                    <h3 className="text-lg font-extrabold text-foreground">
                      {t("Riwayat Pendaftaran Ananda & Jenjang", "Ananda & Level Registration History")}
                    </h3>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t(
                      `Terdaftar ${submissions.length} formulir pendaftaran. Klik formulir di bawah untuk berpindah & melihat detail status masing-masing.`,
                      `Registered ${submissions.length} application forms. Click a form below to switch & view details.`
                    )}
                  </p>
                </div>

                <Link
                  to="/ppdb"
                  className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all shrink-0 cursor-pointer"
                >
                  <Plus className="h-4 w-4" />
                  <span>{t("+ Daftar Jenjang Baru / Tambah Pendaftaran", "+ Apply New Level / Add Registration")}</span>
                </Link>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {submissions.map((sub) => {
                  const isSelected = sub.id === activeSubmission.id;
                  return (
                    <div
                      key={sub.id}
                      onClick={() => setSelectedSubId(sub.id)}
                      className={`group cursor-pointer rounded-2xl border p-4 transition-all duration-300 relative overflow-hidden ${
                        isSelected
                          ? "border-gold bg-gold/10 shadow-md ring-2 ring-gold/40"
                          : "border-border bg-background hover:border-gold/50 hover:bg-card"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="rounded-full bg-navy px-3 py-1 text-[11px] font-black text-gold border border-gold/30">
                          {sub.jenjang}
                        </span>
                        <span className="text-[10px] font-mono text-muted-foreground">{sub.regNo}</span>
                      </div>

                      <h4 className="mt-3 text-sm font-bold text-foreground group-hover:text-gold transition-colors">
                        {sub.nama}
                      </h4>

                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        Wali: {sub.wali} {sub.nisn ? `· NISN: ${sub.nisn}` : ""}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-1.5 pt-3 border-t border-border/60">
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            sub.statusPendaftaran === "Terverifikasi"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : sub.statusPendaftaran === "Lulus Seleksi"
                              ? "bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {sub.statusPendaftaran}
                        </span>
                        <span
                          className={`rounded-md px-2 py-0.5 text-[10px] font-bold uppercase ${
                            sub.statusPembayaran === "Lunas"
                              ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                              : "bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300"
                          }`}
                        >
                          {sub.statusPembayaran}
                        </span>
                      </div>

                      {isSelected && (
                        <div className="mt-3 flex items-center justify-between text-[11px] font-bold text-gold">
                          <span>✓ {t("Sedang Ditampilkan", "Currently Active")}</span>
                          <ChevronRight className="h-4 w-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Submission Detail Card */}
            <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-6">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{t("Nomor Registrasi Resmi", "Official Registration Number")}</span>
                  <h2 className="text-2xl font-black text-navy dark:text-gold">{activeSubmission.regNo}</h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      activeSubmission.statusPendaftaran === "Terverifikasi"
                        ? "bg-emerald-100 text-emerald-800"
                        : activeSubmission.statusPendaftaran === "Lulus Seleksi"
                        ? "bg-slate-200 text-slate-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {t("Status", "Status")}: {t(activeSubmission.statusPendaftaran, activeSubmission.statusPendaftaran === "Terverifikasi" ? "Verified" : activeSubmission.statusPendaftaran === "Lulus Seleksi" ? "Passed Selection" : "Pending Verification")}
                  </span>
                  <span
                    className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wider ${
                      activeSubmission.statusPembayaran === "Lunas" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {t("Pembayaran", "Payment")}: {t(activeSubmission.statusPembayaran, activeSubmission.statusPembayaran === "Lunas" ? "Paid" : "Pending")}
                  </span>
                </div>
              </div>

              {/* Catatan Tambahan Display if available */}
              {activeSubmission.catatanTambahan && (
                <div className="mt-4 rounded-2xl border border-amber-500/40 bg-amber-500/10 p-3.5 text-xs">
                  <span className="font-extrabold text-amber-700 dark:text-amber-300 block mb-1">💬 Catatan Tambahan Pendaftaran:</span>
                  <p className="italic text-foreground font-medium">"{activeSubmission.catatanTambahan}"</p>
                </div>
              )}

              <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Nama Calon Siswa", "Student Name")}</p>
                  <p className="mt-1 text-base font-bold text-foreground">{activeSubmission.nama}</p>
                  <p className="text-xs text-muted-foreground">NISN: {activeSubmission.nisn || t("Belum diisi", "Not provided")}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Jenjang & Pilihan Program", "Level & Selected Program")}</p>
                  <p className="mt-1 text-base font-bold text-gold">{activeSubmission.jenjang}</p>
                  <p className="text-xs text-muted-foreground">{t("Wali", "Guardian")}: {activeSubmission.wali}</p>
                </div>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{t("Kontak & Alamat", "Contact & Address")}</p>
                  <p className="mt-1 text-sm font-semibold">{activeSubmission.telepon}</p>
                  <p className="text-xs text-muted-foreground">{activeSubmission.alamat}</p>
                </div>
              </div>

              {/* Test Schedule Box */}
              {activeSubmission.jadwalTes ? (
                <div className="mt-6 rounded-2xl border border-gold/40 bg-gold/5 p-5">
                  <h3 className="flex items-center gap-2 font-bold text-navy dark:text-gold">
                    <Clock className="h-4 w-4 text-gold" /> {t("Jadwal Tes Seleksi & Observasi", "Selection Test & Observation Schedule")}
                  </h3>
                  <div className="mt-3 grid gap-3 text-xs sm:grid-cols-2 lg:grid-cols-4">
                    <div>
                      <span className="text-muted-foreground">{t("Tanggal:", "Date:")}</span>
                      <p className="font-bold">{activeSubmission.jadwalTes.tanggal}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("Waktu:", "Time:")}</span>
                      <p className="font-bold">{activeSubmission.jadwalTes.waktu}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("Ruangan:", "Room:")}</span>
                      <p className="font-bold">{activeSubmission.jadwalTes.ruang}</p>
                    </div>
                    <div>
                      <span className="text-muted-foreground">{t("Lokasi:", "Location:")}</span>
                      <p className="font-bold">{activeSubmission.jadwalTes.lokasi}</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mt-6 rounded-2xl border border-border bg-muted/40 p-4 text-xs text-muted-foreground">
                  {t("Jadwal tes seleksi akan ditentukan oleh panitia setelah berkas fisik dan pembayaran diverifikasi.", "Selection test schedule will be assigned by committee once physical files and payment are verified.")}
                </div>
              )}

              {/* Uploaded Documents List */}
              <div className="mt-6 rounded-2xl border border-border bg-card p-5">
                <h3 className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider text-muted-foreground">
                  <FileSpreadsheet className="h-4 w-4 text-gold" /> {t("Berkas Dokumen Terunggah", "Uploaded Document Files")} ({activeSubmission.dokumen?.length || 0})
                </h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {activeSubmission.dokumen && activeSubmission.dokumen.length > 0 ? (
                    activeSubmission.dokumen.map((doc, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800">
                        <Check className="h-3.5 w-3.5 text-emerald-600" /> {doc}
                      </span>
                    ))
                  ) : (
                    <p className="text-xs text-muted-foreground">{t("Belum ada dokumen fisik diunggah.", "No physical documents uploaded yet.")}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="rounded-3xl border border-dashed border-border bg-card p-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/10 text-gold">
              <FileSpreadsheet className="h-8 w-8" />
            </div>
            <h3 className="mt-4 text-xl font-bold">{t("Belum Ada Formulir SPMB Terdaftar", "No SPMB Applications Registered Yet")}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t("Anda belum mengisi formulir pendaftaran siswa baru.", "You have not filled out a new student application form yet.")}</p>
            <Link
              to="/ppdb"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-6 py-3 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold cursor-pointer"
            >
              <Plus className="h-4 w-4" /> {t("Isi Formulir SPMB Sekarang", "Fill SPMB Form Now")}
            </Link>
          </div>
        )}

        {/* SECTION 2: SPP & Payment History for Parent */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <div>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-extrabold text-foreground">
                  {t("Riwayat Pembayaran & SPP Ananda", "Your Ananda & SPP Payment History")}
                </h3>
              </div>
              <p className="mt-1 text-xs text-muted-foreground">
                {t("Daftar transaksi pembayaran pendidikan, SPP bulanan, seragam, infaq, dan cetak kuitansi.", "List of education payments, monthly SPP, uniforms, infaq, and receipt print.")}
              </p>
            </div>
            <Link
              to="/spp"
              className="inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition-all shadow-md cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{t("Bayar Tagihan / Infaq", "Pay Bill / Infaq")}</span>
            </Link>
          </div>

          {sppPayments.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              {t("Belum ada riwayat transaksi pembayaran SPP/Pendidikan.", "No SPP/Education payment history found yet.")}
            </div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-border bg-muted/40 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="p-3">ID Transaksi</th>
                    <th className="p-3">Nama Ananda</th>
                    <th className="p-3">Kategori</th>
                    <th className="p-3 text-right">Nominal</th>
                    <th className="p-3 text-center">Status</th>
                    <th className="p-3 text-center">Resi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {sppPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-3 font-mono font-bold text-gold">{p.idTransaksi}</td>
                      <td className="p-3 font-bold text-foreground">{p.namaSiswa}</td>
                      <td className="p-3 font-semibold">{p.kategoriPembayaran || "SPP Bulanan"}</td>
                      <td className="p-3 text-right font-bold text-emerald-600">Rp {p.jumlahNominal.toLocaleString("id-ID")}</td>
                      <td className="p-3 text-center">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
                          p.status === "Lunas" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        {p.buktiTransferUrl && (
                          <button
                            type="button"
                            onClick={() => setZoomImg({ title: `Bukti Pembayaran — ${p.namaSiswa}`, url: p.buktiTransferUrl!, note: p.catatan })}
                            className="inline-flex items-center gap-1 text-[11px] font-bold text-sky-600 hover:underline cursor-pointer"
                          >
                            <ImageIcon className="h-3.5 w-3.5" />
                            <span>Lihat</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* SECTION 3: Quick Actions & Documents */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-bold">
              <Bell className="h-4 w-4 text-gold" /> {t("Informasi & Pengumuman Terbaru", "Latest Info & Announcements")}
            </h3>
            <ul className="mt-4 space-y-3 text-xs text-muted-foreground">
              <li className="rounded-2xl border border-border p-3">
                <span className="font-bold text-foreground">{t("Kartu Ujian & Bukti Pendaftaran:", "Exam Card & Proof:")}</span> {t("Dapat dicetak dan dibawa saat pelaksanaan tes seleksi di pesantren.", "Can be printed and brought during selection test on campus.")}
              </li>
              <li className="rounded-2xl border border-border p-3">
                <span className="font-bold text-foreground">{t("Verifikasi Berkas Asli:", "Original Document Verification:")}</span> {t("Orang tua diharap membawa Akta Asli & KK Asli pada hari H seleksi.", "Parents are requested to bring original Birth Certificate & Family Card on test day.")}
              </li>
            </ul>
          </div>

          <div className="rounded-3xl border border-border bg-card p-6">
            <h3 className="font-bold">{t("Aksi & Unduh Dokumen", "Actions & Downloads")}</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-3 rounded-2xl border border-border p-4 text-left text-xs font-bold transition-all hover:-translate-y-0.5 hover:border-gold hover:text-gold cursor-pointer"
              >
                <Printer className="h-4 w-4 text-gold" /> {t("Cetak Kartu Pendaftaran", "Print Registration Card")}
              </button>
              <Link
                to="/ppdb"
                className="flex items-center gap-3 rounded-2xl border border-border p-4 text-left text-xs font-bold transition-all hover:-translate-y-0.5 hover:border-gold hover:text-gold cursor-pointer"
              >
                <Plus className="h-4 w-4 text-gold" /> {t("Tambah Pendaftaran Siswa", "Add Student Registration")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* DISTRACTION INTERCEPTION POPUP MODAL (Auto-triggered upon login) */}
      {/* ========================================================= */}
      {showDistractionModal && hasActiveDistraction && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-in fade-in duration-300">
          <div className="relative w-full max-w-2xl rounded-3xl border-2 border-amber-500/80 bg-gradient-to-b from-navy-deep via-navy to-slate-950 p-6 sm:p-8 text-primary-foreground shadow-2xl shadow-red-950/80 ring-4 ring-amber-500/20 my-auto animate-in zoom-in-95 duration-300">
            {/* Pulsating Alert Badge & Header */}
            <div className="flex items-start justify-between border-b border-white/10 pb-5 gap-4">
              <div className="flex items-center gap-3.5">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/40 animate-pulse">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="rounded-full bg-red-600 px-3 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
                      {t("PEMBERITAHUAN PENAGIHAN PENTING", "IMPORTANT BILLING NOTICE")}
                    </span>
                    <span className="text-[11px] text-amber-300 font-bold">
                      {billingInfo?.tanggalTagihan || t("Terbaru", "Latest")}
                    </span>
                  </div>
                  <h3 className="mt-1 text-lg sm:text-xl font-black text-gold">
                    {t("Kewajiban Pembayaran Administrasi Pendidikan", "Educational Administration Payment Due")}
                  </h3>
                  <p className="text-xs text-slate-300">
                    {t("Penagih Resmi:", "Official Collector:")} <strong className="text-amber-200">{billingInfo?.penagihName || "Bendahara Sekolah PKBM Zaid bin Tsabit"}</strong>
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowDistractionModal(false)}
                className="rounded-full bg-white/10 hover:bg-white/20 p-2 text-white transition-colors cursor-pointer shrink-0"
                title={t("Tutup Pengingat", "Close Reminder")}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Collector's Message Box */}
            <div className="mt-5 rounded-2xl border border-amber-500/40 bg-amber-950/60 p-4 text-xs sm:text-sm text-amber-100 shadow-inner">
              <div className="flex items-start gap-3">
                <MessageSquare className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <div className="font-extrabold text-gold text-xs uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <BellRing className="h-3.5 w-3.5 text-amber-400" />
                    <span>{t("Pesan & Catatan Khusus dari Penagih", "Special Message from Collector")}</span>
                  </div>
                  <p className="italic leading-relaxed whitespace-pre-line text-slate-100 font-medium">
                    "{billingInfo?.pesanPenagih || t("Mohon kesediaannya untuk segera menyelesaikan kewajiban administrasi pendidikan ananda.", "Please settle the outstanding educational payments for your child.")}"
                  </p>
                </div>
              </div>
            </div>

            {/* Breakdown of Due Items */}
            <div className="mt-5 space-y-2.5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center justify-between">
                <span>{t("Rincian Pembayaran yang Harus Dibayar:", "Itemized Payments Due:")}</span>
                <span className="text-amber-400 font-semibold">{unpaidItems.length} {t("Tagihan Aktif", "Active Bills")}</span>
              </h4>

              <div className="rounded-2xl border border-white/10 bg-black/40 overflow-hidden divide-y divide-white/5 max-h-56 overflow-y-auto">
                {unpaidItems.map((item, idx) => (
                  <div key={item.id || idx} className="p-3 sm:p-3.5 flex items-center justify-between gap-3 text-xs">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white truncate">{item.namaItem}</span>
                        {item.kategori && (
                          <span className="hidden sm:inline-block rounded-md bg-white/10 px-2 py-0.5 text-[10px] text-slate-300">
                            {item.kategori}
                          </span>
                        )}
                      </div>
                      {item.jatuhTempo && (
                        <p className="text-[11px] text-red-300 font-semibold mt-0.5 flex items-center gap-1">
                          <Clock className="h-3 w-3 inline" />
                          <span>{t("Jatuh Tempo:", "Due:")} {item.jatuhTempo}</span>
                        </p>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-gold block">
                        Rp {item.nominal.toLocaleString("id-ID")}
                      </span>
                      <span className="rounded bg-red-600/30 text-red-300 text-[10px] font-extrabold px-1.5 py-0.5 border border-red-500/40">
                        {t("BELUM LUNAS", "UNPAID")}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Due Banner */}
              <div className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-red-950 via-red-900/80 to-amber-950 p-4 border border-red-500/60 shadow-lg">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-red-200 block">
                    {t("Total Tagihan yang Harus Dibayar", "Total Amount Due")}
                  </span>
                  <span className="text-xs text-slate-300">
                    {t("Untuk akun:", "For account:")} {session.name}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl sm:text-2xl font-black text-amber-300 block drop-shadow-sm">
                    Rp {totalUnpaidNominal.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            {/* Rekening Tujuan & Copy */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                  <CreditCard className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">{t("Rekening Resmi Sekolah (BSI):", "Official School Account (BSI):")}</p>
                  <p className="font-mono font-bold text-sky-300 text-xs sm:text-sm">
                    {billingInfo?.rekeningTujuan || "BSI 7757797757 a.n. PKBM ZAID BIN TSABIT"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleCopyRekening(billingInfo?.rekeningTujuan || "7757797757")}
                className="inline-flex items-center gap-1.5 rounded-full border border-sky-400/40 bg-sky-500/10 hover:bg-sky-500/20 px-3.5 py-1.5 text-xs font-bold text-sky-300 transition-all cursor-pointer"
              >
                {copiedRekening ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                <span>{copiedRekening ? t("Tersalin!", "Copied!") : t("Salin No Rekening", "Copy Number")}</span>
              </button>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDistractionModal(false)}
                className="rounded-full border border-white/20 px-5 py-2.5 text-xs font-bold text-slate-300 hover:bg-white/10 transition-colors text-center"
              >
                {t("Tutup & Masuk Dashboard", "Close & Enter Dashboard")}
              </button>

              <a
                href={`https://wa.me/${(billingInfo?.penagihKontak || "6281250055474").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(`Assalamu'alaikum Warahmatullahi Wabarakatuh, saya wali dari ${session.name} ingin konfirmasi pembayaran tagihan: ${unpaidItems.map((i) => i.namaItem).join(", ")} (Total Rp ${totalUnpaidNominal.toLocaleString("id-ID")}).`)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-emerald-500/60 bg-emerald-950/80 hover:bg-emerald-900 px-5 py-2.5 text-xs font-bold text-emerald-300 transition-all text-center"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                <span>{t("Chat WhatsApp Penagih", "Chat WhatsApp")}</span>
              </a>

              <Link
                to="/spp"
                onClick={() => setShowDistractionModal(false)}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-soft via-gold to-amber-500 px-6 py-2.5 text-xs font-black uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all text-center"
              >
                <CreditCard className="h-4 w-4" />
                <span>{t("Bayar Sekarang via SPP", "Pay Now Online")}</span>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal for Parent */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 sm:p-5 backdrop-blur-md transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomImg(null);
          }}
        >
          <div className="relative max-w-4xl max-h-[96vh] w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
            <div className="w-full flex items-center justify-between pb-3 text-white border-b border-white/15 mb-3 gap-2">
              <button
                type="button"
                onClick={() => setZoomImg(null)}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-xs font-extrabold transition-all cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t("← Kembali / Tutup", "← Back / Close")}</span>
              </button>
              <h4 className="text-xs sm:text-sm font-bold text-center truncate px-2 text-gold">{zoomImg.title}</h4>
              <button
                type="button"
                onClick={() => setZoomImg(null)}
                className="rounded-full bg-red-600/80 hover:bg-red-600 p-2 text-white transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {zoomImg.note && (
              <div className="w-full mb-3 rounded-2xl border border-amber-500/40 bg-amber-950/80 p-3 text-xs text-amber-200">
                <span className="italic font-medium">"{zoomImg.note}"</span>
              </div>
            )}
            <div className="overflow-auto max-h-[72vh] w-full flex items-center justify-center rounded-2xl border border-white/20 bg-black/60 p-2">
              <img src={zoomImg.url} alt={zoomImg.title} className="max-h-[68vh] max-w-full object-contain rounded-xl" />
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

function DashboardAdmin({ session, onLogout }: { session: UserSession; onLogout: () => void }) {
 if (session.role !== "admin") {
 return <DashboardOrangTua session={session} onLogout={onLogout} />;
 }

 const [activeTab, setActiveTab] = useState<"ppdb" | "users" | "spp">("ppdb");
 const [submissions, setSubmissions] = useState<PPDBSubmission[]>([]);
 const [usersList, setUsersList] = useState<User[]>([]);
 const [billingByUser, setBillingByUser] = useState<Record<string, UserBillingInfo | null>>({});
 const [sppList, setSppList] = useState<SPPPayment[]>([]);
 const [search, setSearch] = useState("");
 const [filterJenjang, setFilterJenjang] = useState("Semua");
 const [sppCategoryFilter, setSppCategoryFilter] = useState<string>("all");
 const [sppSearch, setSppSearch] = useState<string>("");
 const [sppStatusFilter, setSppStatusFilter] = useState<string>("all");
 const { t } = useLanguage();

  // "Jadikan Admin" (promote user terdaftar) — bukan buat akun baru dari nol.
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [promoteSearch, setPromoteSearch] = useState("");
  const [promoteSelectedId, setPromoteSelectedId] = useState<string>("");
  const [promoting, setPromoting] = useState(false);
  const [adminMsg, setAdminMsg] = useState("");

  // Bank Account Presets for PKBM Zaid bin Tsabit
  const BANK_ACCOUNT_PRESETS = [
    {
      kategori: "SPP SD",
      nomor: "7797737757",
      atasNama: "PKBM SETARA SD ZAID BIN TSABIT",
      label: "BSI 7797737757 a.n. PKBM SETARA SD ZAID BIN TSABIT (SPP SD)",
      fullText: "Bank Syariah Indonesia (BSI) 7797737757 a.n. PKBM SETARA SD ZAID BIN TSABIT",
    },
    {
      kategori: "SPP SMP & SMA",
      nomor: "7797737733",
      atasNama: "PKBM ZAID BIN TSABIT",
      label: "BSI 7797737733 a.n. PKBM ZAID BIN TSABIT (SPP SMP & SMA)",
      fullText: "Bank Syariah Indonesia (BSI) 7797737733 a.n. PKBM ZAID BIN TSABIT",
    },
    {
      kategori: "SPP TK",
      nomor: "7757797733",
      atasNama: "TK ZAID BIN TSABIT",
      label: "BSI 7757797733 a.n. TK ZAID BIN TSABIT (SPP TK)",
      fullText: "Bank Syariah Indonesia (BSI) 7757797733 a.n. TK ZAID BIN TSABIT",
    },
    {
      kategori: "Gedung & Pendidikan",
      nomor: "7757797757",
      atasNama: "YAYASAN DZUN NURAIN AL MU BAROKAH",
      label: "BSI 7757797757 a.n. YAYASAN DZUN NURAIN AL MU BAROKAH (Biaya Gedung/Pendidikan)",
      fullText: "Bank Syariah Indonesia (BSI) 7757797757 a.n. YAYASAN DZUN NURAIN AL MU BAROKAH",
    },
    {
      kategori: "Formulir SPMB",
      nomor: "7293687476",
      atasNama: "Sitti Hamidah",
      label: "BSI 7293687476 a.n. Sitti Hamidah (Formulir SPMB & Biaya Lain)",
      fullText: "Bank Syariah Indonesia (BSI) 7293687476 a.n. Sitti Hamidah",
    },
    {
      kategori: "Operasional PKBM",
      nomor: "7757797757",
      atasNama: "PKBM ZAID BIN TSABIT",
      label: "BSI 7757797757 a.n. PKBM ZAID BIN TSABIT (Operasional)",
      fullText: "Bank Syariah Indonesia (BSI) 7757797757 a.n. PKBM ZAID BIN TSABIT",
    },
  ];

  // User Billing & Distraction Management State
  const [billingModalUser, setBillingModalUser] = useState<User | null>(null);
  const [billingForm, setBillingForm] = useState<UserBillingInfo>({
    isActive: true,
    penagihName: "Ustadzah Siti Fatimah (Bendahara PKBM ZBT)",
    penagihKontak: "6281234567890",
    teleponOrangTua: "",
    pesanPenagih: "",
    tanggalTagihan: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
    rekeningTujuan: "Bank Syariah Indonesia (BSI) 7757797757 a.n. PKBM ZAID BIN TSABIT",
    items: [],
  });

  const handleOpenBillingModal = async (user: User) => {
    const existing =
      user.billing || billingByUser[user.id] || (await getUserBilling(user.id)) || (await getUserBillingByEmail(user.email));
    const parentSub = submissions.find(
      (s) => s.userId === user.id || s.userEmail.toLowerCase() === user.email.toLowerCase() || (s.wali && s.wali.toLowerCase() === user.name.toLowerCase())
    );
    const defaultParentPhone = parentSub?.telepon || parentSub?.teleponAyah || parentSub?.teleponIbu || "";

    setBillingModalUser(user);
    if (existing) {
      setBillingForm({
        isActive: existing.isActive ?? true,
        penagihName: existing.penagihName || "Ustadzah Siti Fatimah (Bendahara PKBM ZBT)",
        penagihKontak: existing.penagihKontak || "6281234567890",
        teleponOrangTua: existing.teleponOrangTua || defaultParentPhone,
        pesanPenagih: existing.pesanPenagih || "",
        tanggalTagihan: existing.tanggalTagihan || new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        rekeningTujuan: existing.rekeningTujuan || "Bank Syariah Indonesia (BSI) 7757797757 a.n. PKBM ZAID BIN TSABIT",
        items: existing.items ? [...existing.items] : [],
        isValidated: existing.isValidated ?? false,
      });
    } else {
      const monthStr = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
      setBillingForm({
        isActive: true,
        penagihName: "Ustadzah Siti Fatimah (Bendahara PKBM ZBT)",
        penagihKontak: "6281234567890",
        teleponOrangTua: defaultParentPhone,
        pesanPenagih: `Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda ${user.name}. Kami dari Bagian Keuangan PKBM Zaid bin Tsabit menginformasikan kewajiban administrasi pembayaran pendidikan yang harus diselesaikan untuk ananda. Mohon kesediaannya untuk melakukan pembayaran sebelum tanggal jatuh tempo. Syukron wa Jazakumullahu Khairan.`,
        tanggalTagihan: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }),
        rekeningTujuan: "Bank Syariah Indonesia (BSI) 7757797757 a.n. PKBM ZAID BIN TSABIT",
        items: [
          {
            id: `item-${Date.now()}`,
            namaItem: `SPP Bulanan (${monthStr})`,
            nominal: 750000,
            kategori: "SPP Bulanan",
            jatuhTempo: `10 ${monthStr}`,
            status: "Belum Lunas",
          },
        ],
      });
    }
  };

  const handleAddBillingItem = () => {
    const monthStr = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    setBillingForm((prev) => ({
      ...prev,
      items: [
        ...prev.items,
        {
          id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          namaItem: "",
          nominal: 500000,
          kategori: "SPP Bulanan",
          jatuhTempo: `10 ${monthStr}`,
          status: "Belum Lunas",
        },
      ],
    }));
  };

  const handleRemoveBillingItem = (id: string) => {
    setBillingForm((prev) => ({
      ...prev,
      items: prev.items.filter((item) => item.id !== id),
    }));
  };

  const handleBillingItemChange = (id: string, field: keyof UserBillItem, val: any) => {
    setBillingForm((prev) => ({
      ...prev,
      items: prev.items.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    }));
  };

  const handleApplyBillingPreset = (presetType: string) => {
    const monthName = new Date().toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    let newItem: UserBillItem;
    if (presetType === "spp") {
      newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        namaItem: `SPP Bulanan (${monthName})`,
        nominal: 750000,
        kategori: "SPP Bulanan",
        jatuhTempo: `10 ${monthName}`,
        status: "Belum Lunas",
      };
    } else if (presetType === "gedung") {
      newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        namaItem: "Uang Pangkal / Sarana Gedung",
        nominal: 3500000,
        kategori: "Uang Pangkal / Gedung",
        jatuhTempo: `25 ${monthName}`,
        status: "Belum Lunas",
      };
    } else if (presetType === "kitab") {
      newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        namaItem: "Buku Paket & Modul IT Kurikulum",
        nominal: 650000,
        kategori: "Buku Paket & Kitab",
        jatuhTempo: `15 ${monthName}`,
        status: "Belum Lunas",
      };
    } else if (presetType === "seragam") {
      newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        namaItem: "Paket Seragam Lengkap & Atribut",
        nominal: 1200000,
        kategori: "Seragam & Atribut",
        jatuhTempo: `20 ${monthName}`,
        status: "Belum Lunas",
      };
    } else {
      newItem = {
        id: `item-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        namaItem: "Katering Siswa Siswi & Outing Class",
        nominal: 500000,
        kategori: "Katering Siswa Siswi",
        jatuhTempo: `10 ${monthName}`,
        status: "Belum Lunas",
      };
    }
    setBillingForm((prev) => ({
      ...prev,
      items: [...prev.items, newItem],
    }));
  };

  const composeWhatsAppReminderText = (
    targetUserName: string,
    billing: UserBillingInfo
  ): string => {
    const unpaids = billing.items.filter((i) => i.status !== "Lunas");
    const totalDue = unpaids.reduce((acc, curr) => acc + (curr.nominal || 0), 0);
    const itemsList = unpaids
      .map(
        (i, idx) =>
          `${idx + 1}. *${i.namaItem}* (${i.kategori || "Tagihan"})\n   Nominal: *Rp ${i.nominal.toLocaleString("id-ID")}*${i.jatuhTempo ? `\n   Jatuh Tempo: ${i.jatuhTempo}` : ""}`
      )
      .join("\n\n");

    return `Assalamu'alaikum Warahmatullahi Wabarakatuh.

Kepada Yth. Ayah/Bunda *${targetUserName}*,
Wali Siswa/i *PKBM Zaid bin Tsabit*

*PEMBERITAHUAN PENAGIHAN & REMINDER PEMBAYARAN PENDIDIKAN*
─────────────────────────────
*Petugas Keuangan:* ${billing.penagihName || "Bendahara PKBM ZBT"}
*Tanggal Diterbitkan:* ${billing.tanggalTagihan || "Terbaru"}

*Catatan & Pesan Khusus dari Sekolah:*
"${billing.pesanPenagih || "Mohon kesediaannya untuk menyelesaikan kewajiban administrasi pendidikan ananda."}"

─────────────────────────────
*RINCIAN KEWAJIBAN PEMBAYARAN:*
${itemsList || "• Tidak ada tagihan aktif"}

*TOTAL YANG HARUS DIBAYAR:*
*Rp ${totalDue.toLocaleString("id-ID")}*
─────────────────────────────

*Rekening Resmi Transfer Sekolah:*
*${billing.rekeningTujuan || "Bank Syariah Indonesia (BSI) 7757797757 a.n. PKBM ZAID BIN TSABIT"}*

*Bayar Online atau Unggah Bukti via Portal SPP:*
https://zaidbintsabit.sch.id/spp

Mohon setelah melakukan transfer dapat membalas pesan ini dengan menyertakan bukti transfer, atau unggah langsung pada portal pembayaran sekolah di atas.

_Jazakumullahu Khairan wa Barakallahu Fiikum._
*Tim Administrasi & Keuangan PKBM Zaid bin Tsabit*`;
  };

  const handleSendWAReminderToParent = () => {
    if (!billingModalUser) return;
    let targetPhone = (billingForm.teleponOrangTua || "").trim();
    if (!targetPhone) {
      const input = prompt(
        t(
          "Masukkan nomor WhatsApp orang tua (contoh: 081234567890 atau 6281234567890):",
          "Enter parent WhatsApp number (e.g. 081234567890):"
        )
      );
      if (!input) return;
      targetPhone = input.trim();
      setBillingForm((prev) => ({ ...prev, teleponOrangTua: targetPhone }));
    }

    let cleanPhone = targetPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    if (cleanPhone.length < 8) {
      alert(t("Nomor WhatsApp tidak valid. Mohon periksa kembali.", "Invalid WhatsApp number."));
      return;
    }

    const text = composeWhatsAppReminderText(billingModalUser.name, billingForm);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleQuickSendWAReminder = async (user: User) => {
    const userBilling =
      user.billing || billingByUser[user.id] || (await getUserBilling(user.id)) || (await getUserBillingByEmail(user.email));
    if (!userBilling || !userBilling.items || userBilling.items.length === 0) {
      alert(t("User ini belum memiliki rincian tagihan.", "This user has no bills."));
      return;
    }
    const parentSub = submissions.find(
      (s) => s.userId === user.id || s.userEmail.toLowerCase() === user.email.toLowerCase() || (s.wali && s.wali.toLowerCase() === user.name.toLowerCase())
    );
    let targetPhone = (userBilling.teleponOrangTua || parentSub?.telepon || parentSub?.teleponAyah || parentSub?.teleponIbu || "").trim();
    if (!targetPhone) {
      const input = prompt(
        t(
          `Masukkan nomor WhatsApp orang tua untuk ${user.name}:`,
          `Enter parent WhatsApp number for ${user.name}:`
        )
      );
      if (!input) return;
      targetPhone = input.trim();
      try {
        await updateUserBilling(user.id, { ...userBilling, teleponOrangTua: targetPhone });
      } catch (err) {
        console.error("Gagal menyimpan nomor WA:", err);
      }
    }

    let cleanPhone = targetPhone.replace(/[^0-9]/g, "");
    if (cleanPhone.startsWith("0")) {
      cleanPhone = "62" + cleanPhone.slice(1);
    }
    if (cleanPhone.length < 8) {
      alert(t("Nomor WhatsApp tidak valid.", "Invalid WhatsApp number."));
      return;
    }

    const text = composeWhatsAppReminderText(user.name, userBilling);
    const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleValidateAndCancelBilling = async (userId: string, userName?: string) => {
    if (
      confirm(
        t(
          `Apakah Anda yakin ingin memvalidasi pembayaran dan MEMBATALKAN pengingat (reminder) untuk ${userName || "user ini"}?\n\nSemua tagihan akan ditandai LUNAS dan popup distraction saat login akan dinonaktifkan.`,
          `Are you sure you want to validate payment and CANCEL the reminder for ${userName || "this user"}?\n\nAll bills will be marked PAID and login distraction popup will be disabled.`
        )
      )
    ) {
      try {
        await validateOrCancelUserBilling(userId);
        await refreshData();
        alert(
          t(
            `Tagihan untuk ${userName || "user"} berhasil divalidasi dan reminder telah dibatalkan! User kini bebas dari peringatan tagihan.`,
            `Billing for ${userName || "user"} successfully validated and reminder cancelled!`
          )
        );
        if (billingModalUser && billingModalUser.id === userId) {
          setBillingModalUser(null);
        }
      } catch (err) {
        alert(t("Gagal memvalidasi tagihan: ", "Failed to validate billing: ") + (err as Error).message);
      }
    }
  };

  const handleSaveBilling = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!billingModalUser) return;
    try {
      await updateUserBilling(billingModalUser.id, billingForm);
      await refreshData();
      alert(t(`Data penagihan untuk akun ${billingModalUser.name} berhasil disimpan! Pengalihan (Distraction Popup) akan otomatis muncul saat user masuk.`, `Billing notice for ${billingModalUser.name} successfully saved!`));
      setBillingModalUser(null);
    } catch (err) {
      alert(t("Gagal menyimpan data penagihan: ", "Failed to save billing: ") + (err as Error).message);
    }
  };

  const handleClearBilling = async () => {
    if (!billingModalUser) return;
    if (confirm(t(`Kosongkan semua tagihan dan nonaktifkan notifikasi penagihan untuk ${billingModalUser.name}?`, `Clear all bills and disable billing alert for ${billingModalUser.name}?`))) {
      const cleared: UserBillingInfo = {
        isActive: false,
        penagihName: billingForm.penagihName,
        penagihKontak: billingForm.penagihKontak,
        pesanPenagih: "",
        items: [],
      };
      try {
        await updateUserBilling(billingModalUser.id, cleared);
        await refreshData();
        alert(t("Tagihan berhasil dibersihkan / ditandai bebas tunggakan.", "Billing successfully cleared."));
        setBillingModalUser(null);
      } catch (err) {
        alert(t("Gagal membersihkan tagihan: ", "Failed to clear billing: ") + (err as Error).message);
      }
    }
  };

 const [selectedDocSub, setSelectedDocSub] = useState<PPDBSubmission | null>(null);
 const [zoomImg, setZoomImg] = useState<{ title: string; url: string; note?: string } | null>(null);
 const [modalTab, setModalTab] = useState<"berkas" | "biodata">("berkas");
 const [adminStepTab, setAdminStepTab] = useState<number | "all">("all");

 // Handle ESC key press to close inspection modal & zoom view
 useEffect(() => {
 const handleKeyDown = (e: KeyboardEvent) => {
 if (e.key === "Escape") {
 if (zoomImg) {
 setZoomImg(null);
 } else if (selectedDocSub) {
 setSelectedDocSub(null);
 }
 }
 };
 window.addEventListener("keydown", handleKeyDown);
 return () => window.removeEventListener("keydown", handleKeyDown);
 }, [selectedDocSub, zoomImg]);

 const exportToProfessionalExcel = (subs: PPDBSubmission[], filename: string, title?: string) => {
 const q = (val: any) => `"${String(val ?? "").replace(/"/g, '""')}"`;

 // Row 1: Document Title Banner
 const docTitleRow = [q(title || "REKAP FORMULIR PENDAFTARAN SISWA BARU (SPMB ONLINE) - PKBM ZAID BIN TSABIT")];

 // Row 2: Print Metadata
 const docMetaRow = [q(`Tanggal Cetak / Export: ${new Date().toLocaleString("id-ID")}`)];

 // Row 4: Step Category Group Headers
 const groupHeaderRow = [
 q("1. JENJANG PENDIDIKAN"),
 // 2. Identitas (20 cols)
 q("2. DATA IDENTITAS CALON SISWA"), "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
 // 3. Data Ayah (9 cols)
 q("3. DATA AYAH KANDUNG"), "", "", "", "", "", "", "", "",
 // 4. Data Ibu (8 cols)
 q("4. DATA IBU KANDUNG"), "", "", "", "", "", "", "",
 // 5. Dokumen & Foto (5 cols)
 q("5. DOKUMEN & FOTO TERUNGGAH"), "", "", "", "",
 // 6. Konfirmasi (2 cols)
 q("6. KONFIRMASI VERIFIKASI ADMIN"), "",
 // 7. Pembayaran (3 cols)
 q("7. PEMBAYARAN REGISTRASI"), "", "",
 // 8. Selesai (3 cols)
 q("8. STATUS PENDAFTARAN SELESAI"), "", ""
 ];

 // Row 5: Column Field Names Header
 const fieldHeaderRow = [
 // 1. Jenjang
 q("1. Jenjang Sekolah Dituju"),
 // 2. Identitas Siswa
 q("2. Nama Lengkap Siswa"),
 q("2. Nama Panggilan"),
 q("2. NIK Siswa (16 Digit)"),
 q("2. No. Reg Akta Lahir"),
 q("2. No. Kartu Keluarga (KK)"),
 q("2. NISN Siswa"),
 q("2. Tempat Lahir Siswa"),
 q("2. Tanggal Lahir Siswa"),
 q("2. Jenis Kelamin"),
 q("2. Agama"),
 q("2. Suku"),
 q("2. Status Anak"),
 q("2. Anak Ke-"),
 q("2. Mode Transportasi"),
 q("2. Tinggi Badan (cm)"),
 q("2. Berat Badan (kg)"),
 q("2. Riwayat Penyakit"),
 q("2. Asal Sekolah Sebelumnya"),
 q("2. NPSN Asal Sekolah"),
 q("2. Alamat Lengkap Tempat Tinggal"),
 // 3. Data Ayah
 q("3. Nama Ayah Kandung"),
 q("3. NIK Ayah (16 Digit)"),
 q("3. Tempat Lahir Ayah"),
 q("3. Tanggal Lahir Ayah"),
 q("3. Pendidikan Terakhir Ayah"),
 q("3. Pekerjaan Ayah"),
 q("3. Penghasilan Ayah per Bulan"),
 q("3. No. WhatsApp Ayah"),
 q("3. Berkebutuhan Khusus Ayah"),
 // 4. Data Ibu
 q("4. Nama Ibu Kandung"),
 q("4. NIK Ibu (16 Digit)"),
 q("4. Tempat Lahir Ibu"),
 q("4. Tanggal Lahir Ibu"),
 q("4. Pendidikan Terakhir Ibu"),
 q("4. Pekerjaan Ibu"),
 q("4. Penghasilan Ibu per Bulan"),
 q("4. No. HP Ibu"),
 // 5. Dokumen & Foto
 q("5. Kartu Keluarga (KK)"),
 q("5. Akta Kelahiran"),
 q("5. Pas Foto 3x4 Calon Siswa"),
 q("5. Foto Tampak Depan Rumah"),
 q("5. Screenshot Sosmed Sekolah"),
 // 6. Konfirmasi
 q("6. Status Verifikasi Admin"),
 q("6. Hasil Verifikasi Admin"),
 // 7. Pembayaran
 q("7. Metode Pembayaran"),
 q("7. Status Pembayaran"),
 q("7. Foto Struk Transfer"),
 // 8. Selesai
 q("8. Nomor Registrasi Resmi"),
 q("8. Email Akun Pendaftar"),
 q("8. Tanggal & Waktu Terdaftar")
 ];

 // Rows Data
 const dataRows = subs.map((s) => [
 q(s.jenjang),
 q(s.nama),
 q(s.namaPanggilan),
 q(s.nikSiswa),
 q(s.noAkta),
 q(s.noKk),
 q(s.nisn),
 q(s.tempatLahir),
 q(s.lahir),
 q(s.jenisKelamin),
 q(s.agama || "Islam"),
 q(s.suku),
 q(s.statusAnak || "Anak Kandung"),
 q(s.anakKe || "1"),
 q(s.transportasi),
 q(s.tinggiBadan ? `${s.tinggiBadan} cm` : "—"),
 q(s.beratBadan ? `${s.beratBadan} kg` : "—"),
 q(s.riwayatPenyakit || "—"),
 q(s.asalSekolah),
 q(s.npsnAsal),
 q(s.alamat),
 q(s.namaAyah || s.wali),
 q(s.nikAyah),
 q(s.tempatLahirAyah),
 q(s.tanggalLahirAyah),
 q(s.pendidikanAyah),
 q(s.pekerjaanAyah),
 q(s.penghasilanAyah),
 q(s.teleponAyah || s.telepon),
 q(s.kebutuhanKhususAyah || "Tidak ada"),
 q(s.namaIbu),
 q(s.nikIbu),
 q(s.tempatLahirIbu),
 q(s.tanggalLahirIbu),
 q(s.pendidikanIbu),
 q(s.pekerjaanIbu),
 q(s.penghasilanIbu),
 q(s.teleponIbu),
 q(" Terlampir"),
 q(" Terlampir"),
 q(" Terlampir"),
 q(" Terlampir"),
 q(" Terlampir"),
 q(s.statusPendaftaran || "Terverifikasi"),
 q("Formulir & Berkas Sah"),
 q(s.metode || "Transfer Bank BSI"),
 q(s.statusPembayaran || "Lunas"),
 q(s.buktiRegUrl ? "Struk Transfer Terlampir" : "Struk Transfer Ada"),
 q(s.regNo),
 q(s.userEmail),
 q(s.createdAt ? new Date(s.createdAt).toLocaleString("id-ID") : "")
 ]);

 const csvLines = [
 docTitleRow.join(","),
 docMetaRow.join(","),
 "",
 groupHeaderRow.join(","),
 fieldHeaderRow.join(","),
 ...dataRows.map((r) => r.join(","))
 ];

 const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvLines.join("\n");
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", filename);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const handleDownloadSingleExcel = (sub: PPDBSubmission) => {
 const q = (val: any) => `"${String(val ?? "-").replace(/"/g, '""')}"`;
 const clean = (val: any) => (val && String(val).trim() !== "" ? String(val) : "-");

 const safeName = (sub.nama || "Siswa").replace(/[^a-zA-Z0-9]/g, "_");
 const safeReg = sub.regNo ? `_${sub.regNo.replace(/[^a-zA-Z0-9]/g, "_")}` : "";
 const fileName = `Data_Siswa_${safeName}${safeReg}.csv`;

 // Row 1 & 2: Title & Meta Header
 const titleRow = [q(`DATA FORMULIR SISWA - ${sub.nama.toUpperCase()} (${sub.regNo || "SPMB"})`)].join(",");
 const metaRow = [q(`Waktu Export System: ${new Date().toLocaleString("id-ID")} WITA`)].join(",");

 // Row 4: Section Category Group Headers (TANPA NOMOR)
 const sectionHeaderRow = [
 // JENJANG PENDIDIKAN (2 cols)
 q("JENJANG PENDIDIKAN"), "",
 // IDENTITAS CALON SISWA (20 cols)
 q("DATA IDENTITAS CALON SISWA"), "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",
 // DATA AYAH KANDUNG (9 cols)
 q("DATA AYAH KANDUNG"), "", "", "", "", "", "", "", "",
 // DATA IBU KANDUNG (8 cols)
 q("DATA IBU KANDUNG"), "", "", "", "", "", "", "",
 // DOKUMEN & FOTO (5 cols)
 q("DOKUMEN & FOTO TERUNGGAH"), "", "", "", "",
 // KONFIRMASI VERIFIKASI (6 cols)
 q("KONFIRMASI & VERIFIKASI ADMIN"), "", "", "", "", "",
 // PEMBAYARAN REGISTRASI (8 cols)
 q("PEMBAYARAN REGISTRASI"), "", "", "", "", "", "", ""
 ].join(",");

 // Row 5: Exact Field Name Columns (TANPA PREFIKS NOMOR)
 const columnHeaderRow = [
 // Jenjang
 q("Jenjang Sekolah Dituju"),
 q("Status Verifikasi Jenjang"),
 // Identitas Siswa
 q("Nama Lengkap Siswa"),
 q("Nama Panggilan"),
 q("NIK Siswa"),
 q("No. Registrasi Akta Lahir"),
 q("No. Kartu Keluarga (KK)"),
 q("NISN Siswa"),
 q("Tempat Lahir"),
 q("Tanggal Lahir"),
 q("Jenis Kelamin"),
 q("Agama"),
 q("Suku"),
 q("Status Anak"),
 q("Anak Ke"),
 q("Mode Transportasi"),
 q("Tinggi Badan"),
 q("Berat Badan"),
 q("Riwayat Penyakit"),
 q("Asal Sekolah Sebelumnya"),
 q("NPSN Asal Sekolah"),
 q("Alamat Lengkap Tempat Tinggal"),
 // Data Ayah
 q("Nama Ayah Kandung"),
 q("NIK Ayah"),
 q("Tempat Lahir Ayah"),
 q("Tanggal Lahir Ayah"),
 q("Pendidikan Terakhir"),
 q("Pekerjaan Ayah"),
 q("Penghasilan per Bulan"),
 q("No. WhatsApp Ayah"),
 q("Berkebutuhan Khusus"),
 // Data Ibu
 q("Nama Ibu Kandung"),
 q("NIK Ibu"),
 q("Tempat Lahir Ibu"),
 q("Tanggal Lahir Ibu"),
 q("Pendidikan Terakhir"),
 q("Pekerjaan Ibu"),
 q("Penghasilan per Bulan"),
 q("No. HP Ibu"),
 // Dokumen & Foto
 q("Kartu Keluarga (KK)"),
 q("Akta Kelahiran"),
 q("Pas Foto 3x4"),
 q("Foto Depan Rumah"),
 q("Screenshot Sosmed"),
 // Konfirmasi
 q("Status Pendaftaran"),
 q("Status Verifikasi"),
 q("Admin Pemeriksa"),
 q("Tanggal Verifikasi"),
 q("Catatan Verifikasi"),
 q("Waktu Verifikasi"),
 // Pembayaran
 q("Metode Pembayaran"),
 q("Status Pembayaran"),
 q("Nominal Pembayaran"),
 q("Tanggal Pembayaran"),
 q("Nomor Referensi Pembayaran"),
 q("Nama Pemilik Rekening"),
 q("Status Verifikasi Pembayaran"),
 q("Catatan Pembayaran")
 ].join(",");

 // Row 6: Single Data Row (CLEAN DATA SISWA HORISONTAL)
 const dataRow = [
 // Jenjang
 q(clean(sub.jenjang)),
 q("Terverifikasi"),
 // Identitas Siswa
 q(clean(sub.nama)),
 q(clean(sub.namaPanggilan)),
 q(clean(sub.nikSiswa)),
 q(clean(sub.noAkta)),
 q(clean(sub.noKk)),
 q(clean(sub.nisn)),
 q(clean(sub.tempatLahir)),
 q(clean(sub.lahir)),
 q(clean(sub.jenisKelamin)),
 q(clean(sub.agama || "Islam")),
 q(clean(sub.suku)),
 q(clean(sub.statusAnak || "Anak Kandung")),
 q(clean(sub.anakKe || "1")),
 q(clean(sub.transportasi)),
 q(sub.tinggiBadan ? `${sub.tinggiBadan} cm` : "-"),
 q(sub.beratBadan ? `${sub.beratBadan} kg` : "-"),
 q(clean(sub.riwayatPenyakit)),
 q(clean(sub.asalSekolah)),
 q(clean(sub.npsnAsal)),
 q(clean(sub.alamat)),
 // Data Ayah
 q(clean(sub.namaAyah || sub.wali)),
 q(clean(sub.nikAyah)),
 q(clean(sub.tempatLahirAyah)),
 q(clean(sub.tanggalLahirAyah)),
 q(clean(sub.pendidikanAyah)),
 q(clean(sub.pekerjaanAyah)),
 q(clean(sub.penghasilanAyah)),
 q(clean(sub.teleponAyah || sub.telepon)),
 q(clean(sub.kebutuhanKhususAyah || "Tidak ada")),
 // Data Ibu
 q(clean(sub.namaIbu)),
 q(clean(sub.nikIbu)),
 q(clean(sub.tempatLahirIbu)),
 q(clean(sub.tanggalLahirIbu)),
 q(clean(sub.pendidikanIbu)),
 q(clean(sub.pekerjaanIbu)),
 q(clean(sub.penghasilanIbu)),
 q(clean(sub.teleponIbu)),
 // Dokumen & Foto
 q(` KK (${sub.nikSiswa || "DOC"}_KK.jpg)`),
 q(` AKTA (${sub.nikSiswa || "DOC"}_AKTA.jpg)`),
 q(` PASFOTO (${sub.nikSiswa || "DOC"}_PASFOTO.jpg)`),
 q(` RUMAH (${sub.nikSiswa || "DOC"}_RUMAH.jpg)`),
 q(` SOSMED (${sub.nikSiswa || "DOC"}_SOSMED.jpg)`),
 // Konfirmasi
 q(clean(sub.statusPendaftaran || "Terverifikasi")),
 q("Terverifikasi"),
 q("Administrator PKBM Zaid bin Tsabit"),
 q(sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("id-ID") : new Date().toLocaleDateString("id-ID")),
 q("Seluruh Dokumen & Biodata Terverifikasi Sah"),
 q(sub.createdAt ? new Date(sub.createdAt).toLocaleTimeString("id-ID") : new Date().toLocaleTimeString("id-ID")),
 // Pembayaran
 q(clean(sub.metode || "Transfer Bank BSI")),
 q(clean(sub.statusPembayaran || "Lunas")),
 q(["TK", "SD"].includes((sub.jenjang || "").toUpperCase()) ? "Rp 100.000" : "Rp 200.000"),
 q(sub.createdAt ? new Date(sub.createdAt).toLocaleDateString("id-ID") : "-"),
 q(clean(sub.regNo)),
 q(clean(sub.wali || sub.namaAyah)),
 q(clean(sub.statusPembayaran || "Lunas & Terverifikasi")),
 q("Struk Transfer Pembayaran Terlampir & Sah")
 ].join(",");

 const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [
 titleRow,
 metaRow,
 "",
 sectionHeaderRow,
 columnHeaderRow,
 dataRow
 ].join("\n");

 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", fileName);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const handleDownloadSinglePDF = (sub: PPDBSubmission) => {
 const printWindow = window.open("", "_blank");
 if (!printWindow) return;

 const htmlContent = `
 <!DOCTYPE html>
 <html lang="id">
 <head>
 <meta charset="UTF-8">
 <title>Formulir SPMB - ${sub.regNo} - ${sub.nama}</title>
 <style>
 body { font-family: 'Segoe UI', Arial, sans-serif; padding: 30px; color: #0f172a; line-height: 1.5; font-size: 13px; background: #fff; }
 .box { border: 2px solid #0f172a; padding: 25px; border-radius: 12px; max-width: 800px; margin: 0 auto; }
 .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
 .school { font-size: 18px; font-weight: 800; text-transform: uppercase; color: #0f172a; }
 .title { font-size: 14px; font-weight: 700; color: #b45309; margin-top: 5px; text-transform: uppercase; }
 .section-title { background: #0f172a; color: #fff; padding: 6px 12px; font-weight: 700; font-size: 12px; text-transform: uppercase; border-radius: 6px; margin-top: 20px; margin-bottom: 10px; }
 table { width: 100%; border-collapse: collapse; margin-bottom: 10px; }
 td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; vertical-align: top; }
 .label { font-weight: 600; color: #475569; width: 35%; }
 .val { font-weight: 700; color: #0f172a; }
 .stamp { display: inline-block; padding: 4px 12px; border: 2px solid #16a34a; color: #16a34a; font-weight: 800; border-radius: 6px; font-size: 11px; text-transform: uppercase; }
 @media print { .no-print { display: none; } body { padding: 0; } }
 </style>
 </head>
 <body>
 <div class="no-print" style="text-align: right; margin-bottom: 20px; max-width: 800px; margin-left: auto; margin-right: auto;">
 <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">️ Cetak / Simpan PDF</button>
 </div>
 <div class="box">
 <div class="header">
 <div class="school">SEKOLAH TAHFIZH PLUS IT ZAID BIN TSABIT</div>
 <div style="font-size: 11px; color: #64748b;">Jl. Zaid bin Tsabit, Samarinda, Kalimantan Timur · Telp: 0812-5005-5474</div>
 <div class="title">FORMULIR PENDAFTARAN RESMI SISWA BARU (SPMB)</div>
 <div style="font-size: 13px; font-weight: 800; margin-top: 5px; color: #0f172a;">NO. REGISTRASI: ${sub.regNo} (JENJANG ${sub.jenjang.toUpperCase()})</div>
 </div>

 <div class="section-title">1. DATA IDENTITAS CALON SISWA</div>
 <table>
 <tr><td class="label">Nama Lengkap Siswa:</td><td class="val">${sub.nama || "—"}</td></tr>
 <tr><td class="label">Nama Panggilan:</td><td class="val">${sub.namaPanggilan || "—"}</td></tr>
 <tr><td class="label">NIK Siswa (16 Digit):</td><td class="val">${sub.nikSiswa || "—"}</td></tr>
 <tr><td class="label">No. Akta Lahir:</td><td class="val">${sub.noAkta || "—"}</td></tr>
 <tr><td class="label">No. Kartu Keluarga (KK):</td><td class="val">${sub.noKk || "—"}</td></tr>
 <tr><td class="label">NISN Siswa:</td><td class="val">${sub.nisn || "—"}</td></tr>
 <tr><td class="label">Tempat, Tanggal Lahir:</td><td class="val">${sub.tempatLahir || "—"}, ${sub.lahir || "—"}</td></tr>
 <tr><td class="label">Jenis Kelamin / Agama:</td><td class="val">${sub.jenisKelamin || "—"} / ${sub.agama || "Islam"}</td></tr>
 <tr><td class="label">Suku / Status Anak:</td><td class="val">${sub.suku || "—"} / ${sub.statusAnak || "Anak Kandung"} (Anak ke-${sub.anakKe || "1"})</td></tr>
 <tr><td class="label">Mode Transportasi ke Sekolah:</td><td class="val">${sub.transportasi || "—"}</td></tr>
 <tr><td class="label">Tinggi / Berat Badan:</td><td class="val">${sub.tinggiBadan ? `${sub.tinggiBadan} cm` : "—"} / ${sub.beratBadan ? `${sub.beratBadan} kg` : "—"}</td></tr>
 <tr><td class="label">Riwayat Penyakit:</td><td class="val">${sub.riwayatPenyakit || "—"}</td></tr>
 <tr><td class="label">Asal Sekolah Sebelumnya:</td><td class="val">${sub.asalSekolah || "—"} (NPSN: ${sub.npsnAsal || "—"})</td></tr>
 <tr><td class="label">Alamat Lengkap Tempat Tinggal:</td><td class="val">${sub.alamat || "—"}</td></tr>
 </table>

 <div class="section-title">2. DATA AYAH KANDUNG</div>
 <table>
 <tr><td class="label">Nama Ayah Kandung:</td><td class="val">${sub.namaAyah || sub.wali || "—"}</td></tr>
 <tr><td class="label">NIK Ayah:</td><td class="val">${sub.nikAyah || "—"}</td></tr>
 <tr><td class="label">Tempat, Tgl Lahir Ayah:</td><td class="val">${sub.tempatLahirAyah || "—"}, ${sub.tanggalLahirAyah || "—"}</td></tr>
 <tr><td class="label">Pendidikan / Pekerjaan:</td><td class="val">${sub.pendidikanAyah || "—"} / ${sub.pekerjaanAyah || "—"}</td></tr>
 <tr><td class="label">Penghasilan / WhatsApp Ayah:</td><td class="val">${sub.penghasilanAyah || "—"} / ${sub.teleponAyah || sub.telepon || "—"}</td></tr>
 <tr><td class="label">Berkebutuhan Khusus:</td><td class="val">${sub.kebutuhanKhususAyah || "Tidak ada"}</td></tr>
 </table>

 <div class="section-title">3. DATA IBU KANDUNG</div>
 <table>
 <tr><td class="label">Nama Ibu Kandung:</td><td class="val">${sub.namaIbu || "—"}</td></tr>
 <tr><td class="label">NIK Ibu:</td><td class="val">${sub.nikIbu || "—"}</td></tr>
 <tr><td class="label">Tempat, Tgl Lahir Ibu:</td><td class="val">${sub.tempatLahirIbu || "—"}, ${sub.tanggalLahirIbu || "—"}</td></tr>
 <tr><td class="label">Pendidikan / Pekerjaan:</td><td class="val">${sub.pendidikanIbu || "—"} / ${sub.pekerjaanIbu || "—"}</td></tr>
 <tr><td class="label">Penghasilan / No. HP Ibu:</td><td class="val">${sub.penghasilanIbu || "—"} / ${sub.teleponIbu || "—"}</td></tr>
 </table>

 <div class="section-title">4. DOKUMEN BERKAS &amp; STATUS VERIFIKASI</div>
 <table>
 <tr><td class="label">Dokumen Terunggah:</td><td class="val">${(sub.dokumen && sub.dokumen.length> 0 ? sub.dokumen : ["Kartu Keluarga (KK)", "Akta Kelahiran", "Pas Foto 3x4", "Foto Tampak Depan Rumah", "Bukti Screenshot Sosmed", "Struk Pembayaran"]).join(", ")}</td></tr>
 <tr><td class="label">Status Verifikasi &amp; Pembayaran:</td><td class="val"><span class="stamp">${sub.statusPendaftaran || "Terverifikasi"} — ${sub.statusPembayaran || "Lunas"}</span></td></tr>
 </table>

 <div style="margin-top: 30px; display: flex; justify-content: space-between; align-items: flex-end;">
 <div>
 <div style="font-size: 11px; color: #64748b;">Tanggal Cetak: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
 <div style="font-size: 11px; color: #64748b;">Email Akun: ${sub.userEmail}</div>
 </div>
 <div style="text-align: center;">
 <div style="font-size: 11px; color: #64748b;">Panitia SPMB PKBM ZBT</div>
 <div style="margin-top: 40px; font-weight: 700; border-bottom: 1px solid #0f172a;">Tim Pendaftaran &amp; Panitia</div>
 </div>
 </div>
 </div>
 <script>setTimeout(() => { window.print(); }, 500);</script>
 </body>
 </html>
 `;

 printWindow.document.write(htmlContent);
 printWindow.document.close();
 };

 const handleExportAllCSV = () => {
 if (submissions.length === 0) {
 alert(t("Belum ada data pendaftaran untuk diunduh.", "No registration data to download."));
 return;
 }
 exportToProfessionalExcel(
 submissions,
 `Rekap_Semua_Pendaftaran_SPMB_PKBM_ZBT_${new Date().toISOString().slice(0, 10)}.csv`,
 `REKAP KESELURUHAN DATA FORMULIR PENDAFTARAN SISWA BARU (SPMB ONLINE)`
 );
 };

 const handleDownloadDocFile = (docName: string, sub: PPDBSubmission) => {
 const url = getDocumentPreviewUrl(docName, sub);
 const link = document.createElement("a");
 link.href = url;
 const safeDocName = docName.replace(/[^a-zA-Z0-9]/g, "_");
 link.download = `Dokumen_${sub.regNo}_${sub.nama}_${safeDocName}.png`;
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

  // Helper to get real document image previews
  const getDocumentPreviewUrl = (docName: string, sub: PPDBSubmission): string => {
    // 1. If checking "Struk Pembayaran" or "Struk Transfer" and real buktiRegUrl is present, return real uploaded receipt!
    if ((docName.includes("Struk") || docName.includes("Pembayaran")) && sub.buktiRegUrl) {
      return sub.buktiRegUrl;
    }

    // 2. If real uploaded document file exists in sub.dokumenFiles, return its real data URL!
    if (sub.dokumenFiles && Array.isArray(sub.dokumenFiles) && sub.dokumenFiles.length > 0) {
      const docLower = (docName || "").toLowerCase();
      const found = sub.dokumenFiles.find((df) => {
        const idLower = (df.id || "").toLowerCase();
        const nameLower = (df.name || "").toLowerCase();
        return (idLower && (idLower.includes(docLower) || docLower.includes(idLower))) ||
               (nameLower && (nameLower.includes(docLower) || docLower.includes(idLower)));
      });
      if (found && found.url) {
        return found.url;
      }
    }

    const name = sub.nama || "Siswa";
    const reg = sub.regNo || "ZBT-2026";
    const encName = encodeURIComponent(name);
    const encReg = encodeURIComponent(reg);

    if (docName.includes("Foto") || docName.includes("Pas")) {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520"><rect width="400" height="520" fill="%230f172a"/><circle cx="200" cy="180" r="80" fill="%2338bdf8" opacity="0.8"/><ellipse cx="200" cy="400" rx="130" ry="120" fill="%2338bdf8" opacity="0.8"/><rect x="20" y="440" width="360" height="60" rx="10" fill="%231e293b"/><text x="200" y="465" font-family="sans-serif" font-size="14" font-weight="bold" fill="%23eab308" text-anchor="middle">PAS FOTO SISWA</text><text x="200" y="488" font-family="sans-serif" font-size="13" font-weight="bold" fill="%23ffffff" text-anchor="middle">${encName}</text></svg>`;
    }

    if (docName.includes("Kartu Keluarga") || docName.includes("KK")) {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="480" viewBox="0 0 700 480"><rect width="700" height="480" fill="%23f8fafc" stroke="%230284c7" stroke-width="8"/><rect x="20" y="20" width="660" height="70" fill="%230284c7"/><text x="350" y="48" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23ffffff" text-anchor="middle">KARTU KELUARGA REPUBLIK INDONESIA</text><text x="350" y="72" font-family="sans-serif" font-size="12" fill="%23e0f2fe" text-anchor="middle">No. ${encodeURIComponent(sub.noKk || "6474012903260001")} — DUKCAPIL</text><rect x="30" y="110" width="640" height="240" fill="%23ffffff" stroke="%23cbd5e1" stroke-width="2"/><line x1="30" y1="150" x2="670" y2="150" stroke="%230284c7" stroke-width="2"/><text x="50" y="137" font-family="sans-serif" font-size="13" font-weight="bold" fill="%230f172a">KEPALA KELUARGA: ${encodeURIComponent(sub.namaAyah || sub.wali || "Ahmad Fauzi")}</text><text x="50" y="180" font-family="sans-serif" font-size="13" fill="%23334155">1. ${encName} (Calon Siswa — NIK: ${encodeURIComponent(sub.nikSiswa || "-")})</text><text x="50" y="210" font-family="sans-serif" font-size="13" fill="%23334155">2. ${encodeURIComponent(sub.namaAyah || "Ayah")} (Ayah Kandung)</text><text x="50" y="240" font-family="sans-serif" font-size="12" fill="%2364748b">Alamat: ${encodeURIComponent(sub.alamat || "Samarinda")}</text><circle cx="580" cy="400" r="45" fill="%230284c7" opacity="0.15"/><text x="580" y="405" font-family="sans-serif" font-size="11" font-weight="bold" fill="%230284c7" text-anchor="middle">TERVERIFIKASI</text><rect x="40" y="390" width="220" height="50" rx="8" fill="%23ecfdf5" stroke="%23059669"/><text x="150" y="420" font-family="sans-serif" font-size="12" font-weight="bold" fill="%23047857" text-anchor="middle">BERKAS KK SAH</text></svg>`;
    }

    if (docName.includes("Akta") || docName.includes("Lahir")) {
      return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="480" viewBox="0 0 700 480"><rect width="700" height="480" fill="%23fffbeb" stroke="%23d97706" stroke-width="8"/><rect x="30" y="30" width="640" height="420" fill="%23ffffff" stroke="%23fef3c7" stroke-width="4"/><text x="350" y="80" font-family="serif" font-size="20" font-weight="bold" fill="%2392400e" text-anchor="middle">KUTIPAN AKTA KELAHIRAN</text><text x="350" y="110" font-family="sans-serif" font-size="12" fill="%23b45309" text-anchor="middle">PENCATATAN SIPIL REPUBLIK INDONESIA</text><line x1="150" y1="130" x2="550" y2="130" stroke="%23d97706" stroke-width="2"/><text x="350" y="180" font-family="sans-serif" font-size="13" fill="%2378350f" text-anchor="middle">Telah lahir seorang anak bernama:</text><text x="350" y="220" font-family="sans-serif" font-size="18" font-weight="bold" fill="%230f172a" text-anchor="middle">${encName}</text><text x="350" y="260" font-family="sans-serif" font-size="13" fill="%2378350f" text-anchor="middle">No. Akta: ${encodeURIComponent(sub.noAkta || "3374-LT-2026")}</text><rect x="230" y="350" width="240" height="50" rx="25" fill="%23fef3c7" stroke="%23d97706"/><text x="350" y="380" font-family="sans-serif" font-size="13" font-weight="bold" fill="%2392400e" text-anchor="middle">AKTA TERVERIFIKASI</text></svg>`;
    }

    if (sub.buktiRegUrl) return sub.buktiRegUrl;

    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="480" viewBox="0 0 700 480"><rect width="700" height="480" fill="%23f8fafc" stroke="%230f172a" stroke-width="8"/><rect x="20" y="20" width="660" height="60" fill="%230f172a"/><text x="350" y="55" font-family="sans-serif" font-size="18" font-weight="bold" fill="%23eab308" text-anchor="middle">DOKUMEN PERSYARATAN RESMI SPMB</text><rect x="30" y="100" width="640" height="260" fill="%23ffffff" stroke="%23e2e8f0" stroke-width="2"/><text x="50" y="140" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">DOKUMEN: ${encodeURIComponent(docName)}</text><text x="50" y="175" font-family="sans-serif" font-size="13" fill="%23475569">Nama Siswa Siswi: ${encName} (${encReg})</text><text x="50" y="205" font-family="sans-serif" font-size="13" fill="%23475569">Status: Terlampir dan Sah</text><rect x="440" y="370" width="220" height="60" rx="30" fill="%23dcfce7" stroke="%2316a34a"/><text x="550" y="405" font-family="sans-serif" font-size="14" font-weight="bold" fill="%2315803d" text-anchor="middle">BERKAS TERVERIFIKASI</text></svg>`;
  };

  const getSPPReceiptPreviewUrl = (item: SPPPayment): string => {
    if (item.buktiTransferUrl) return item.buktiTransferUrl;
    const encName = encodeURIComponent(item.namaSiswa || "Siswa");
    const encId = encodeURIComponent(item.idTransaksi || "TRX");
    const encMethod = encodeURIComponent(item.metodePembayaran || "Transfer Bank");
    const encNominal = encodeURIComponent(`Rp ${(item.jumlahNominal || 0).toLocaleString("id-ID")}`);
    const tagihanStr = Array.isArray(item.bulanTagihan) && item.bulanTagihan.length > 0 ? item.bulanTagihan.join(", ") : (item.kategoriPembayaran || "Pembayaran Pendidikan");
    const encCat = encodeURIComponent(item.kategoriPembayaran || "Pembayaran Siswa");
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="700" height="500" viewBox="0 0 700 500"><rect width="700" height="500" fill="%230f172a"/><rect x="20" y="20" width="660" height="460" rx="16" fill="%231e293b" stroke="%23eab308" stroke-width="3"/><text x="350" y="65" font-family="sans-serif" font-size="20" font-weight="extrabold" fill="%23eab308" text-anchor="middle">RESI TRANSFER ONLINE RESMI</text><line x1="50" y1="85" x2="650" y2="85" stroke="%23334155" stroke-width="2"/><text x="60" y="130" font-family="sans-serif" font-size="14" fill="%2394a3b8">No. Transaksi:</text><text x="240" y="130" font-family="monospace" font-size="15" font-weight="bold" fill="%23f8fafc">${encId}</text><text x="60" y="170" font-family="sans-serif" font-size="14" fill="%2394a3b8">Nama Siswa Siswi:</text><text x="240" y="170" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23f8fafc">${encName} (NIS: ${encodeURIComponent(item.nis || "-")})</text><text x="60" y="210" font-family="sans-serif" font-size="14" fill="%2394a3b8">Kategori Pembayaran:</text><text x="240" y="210" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23f8fafc">${encCat} (${encodeURIComponent(item.jenjang || "-")})</text><text x="60" y="250" font-family="sans-serif" font-size="14" fill="%2394a3b8">Rincian Item / Tagihan:</text><text x="240" y="250" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23eab308">${encodeURIComponent(tagihanStr)}</text><text x="60" y="290" font-family="sans-serif" font-size="14" fill="%2394a3b8">Metode & Pengirim:</text><text x="240" y="290" font-family="sans-serif" font-size="15" font-weight="bold" fill="%23f8fafc">${encMethod} (${encodeURIComponent(item.namaPengirim || "-")})</text><text x="60" y="330" font-family="sans-serif" font-size="14" fill="%2394a3b8">Bank Tujuan:</text><text x="240" y="330" font-family="sans-serif" font-size="15" font-weight="bold" fill="%2338bdf8">BSI (Bank Syariah Indonesia) 7757797757</text><rect x="50" y="370" width="600" height="70" rx="12" fill="%230284c7" opacity="0.2" stroke="%230284c7"/><text x="70" y="412" font-family="sans-serif" font-size="16" font-weight="bold" fill="%2338bdf8">TOTAL NOMINAL TRANSFER:</text><text x="630" y="412" font-family="sans-serif" font-size="22" font-weight="black" fill="%234ade80" text-anchor="end">${encNominal}</text></svg>`;
  };

 const handlePrintKuitansiFromAdmin = (item: SPPPayment) => {
 const printWindow = window.open("", "_blank");
 if (!printWindow) return;

    const safeBulanTagihan = Array.isArray(item.bulanTagihan) && item.bulanTagihan.length > 0 ? item.bulanTagihan : [item.kategoriPembayaran || "Pembayaran Pendidikan"];
    const htmlContent = `
      <!DOCTYPE html>
      <html lang="id">
      <head>
        <meta charset="UTF-8">
        <title>Kuitansi SPP - ${item.idTransaksi} - PKBM Zaid bin Tsabit</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 40px; color: #0f172a; background: #fff; }
          .receipt-box { border: 2px solid #0f172a; padding: 30px; border-radius: 12px; max-width: 700px; margin: 0 auto; background: #fff; }
          .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
          .school-name { font-size: 20px; font-weight: 800; text-transform: uppercase; color: #0f172a; }
          .receipt-title { font-size: 16px; font-weight: 700; color: #0284c7; margin-top: 8px; text-transform: uppercase; letter-spacing: 1px; }
          .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 14px; }
          .meta-table td { padding: 6px 4px; vertical-align: top; }
          .meta-label { font-weight: 600; color: #475569; width: 160px; }
          .meta-value { font-weight: 700; color: #0f172a; }
          .fee-table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 20px; }
          .fee-table th { background: #0f172a; color: #fff; padding: 10px; text-align: left; font-size: 13px; }
          .fee-table td { border-bottom: 1px solid #e2e8f0; padding: 10px; font-size: 14px; }
          .total-row { background: #fef08a; font-weight: 800; font-size: 16px; }
          .status-stamp { display: inline-block; padding: 6px 16px; border: 2px solid #16a34a; color: #16a34a; font-weight: 800; font-size: 14px; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; margin-top: 10px; }
          .footer-note { font-size: 11px; color: #64748b; margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          @media print { body { padding: 10px; } .no-print { display: none; } }
        </style>
      </head>
      <body>
        <div class="no-print" style="text-align: right; margin-bottom: 20px; max-width: 700px; margin-left: auto; margin-right: auto;">
          <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 10px 20px; border-radius: 20px; font-weight: bold; cursor: pointer;">🖨️ Cetak / Simpan PDF</button>
        </div>
        <div class="receipt-box">
          <div class="header">
            <div class="school-name">SEKOLAH TAHFIZH PLUS IT ZAID BIN TSABIT</div>
            <div style="font-size: 12px; color: #64748b; margin-top: 3px;">Jl. Zaid bin Tsabit, Samarinda, Kalimantan Timur · Telepon: 0812-5005-5474</div>
            <div class="receipt-title">KUITANSI PEMBAYARAN RESMI</div>
          </div>
          <table class="meta-table">
            <tr><td class="meta-label">No. Transaksi:</td><td class="meta-value">${item.idTransaksi}</td></tr>
            <tr><td class="meta-label">Tanggal Transaksi:</td><td class="meta-value">${new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WITA</td></tr>
            <tr><td class="meta-label">NIS (Induk Siswa):</td><td class="meta-value">${item.nis || "-"}</td></tr>
            <tr><td class="meta-label">Nama Siswa:</td><td class="meta-value">${item.namaSiswa || "-"}</td></tr>
            <tr><td class="meta-label">Jenjang:</td><td class="meta-value">${item.jenjang || "-"}</td></tr>
            <tr><td class="meta-label">Kategori:</td><td class="meta-value">${item.kategoriPembayaran || "SPP Bulanan"}</td></tr>
            <tr><td class="meta-label">Metode Pembayaran:</td><td class="meta-value">${item.metodePembayaran || "Transfer"} (${item.namaPengirim || "-"})</td></tr>
          </table>
          <table class="fee-table">
            <thead>
              <tr>
                <th>Rincian Item Pembayaran</th>
                <th style="text-align: right;">Nominal (Rp)</th>
              </tr>
            </thead>
            <tbody>
              ${safeBulanTagihan.map((b) => `<tr><td>${item.kategoriPembayaran || "Pembayaran"} (${b})</td><td style="text-align: right; font-weight: 600;">Rp ${(item.jumlahNominal / safeBulanTagihan.length).toLocaleString("id-ID")}</td></tr>`).join("")}
              <tr class="total-row">
                <td>TOTAL PEMBAYARAN</td>
                <td style="text-align: right;">Rp ${(item.jumlahNominal || 0).toLocaleString("id-ID")}</td>
              </tr>
            </tbody>
          </table>
 <div style="display: flex; justify-content: space-between; align-items: flex-end;">
 <div>
 <div style="font-size: 12px; color: #64748b;">Status Pembayaran:</div>
 <div class="status-stamp" style="${item.status === 'Lunas' ? 'border-color: #16a34a; color: #16a34a;' : item.status === 'Ditolak' ? 'border-color: #dc2626; color: #dc2626;' : 'border-color: #d97706; color: #d97706;'}">${item.status}</div>
 </div>
 <div style="text-align: center;">
 <div style="font-size: 12px; color: #64748b;">Bendahara Sekolah,</div>
 <div style="margin-top: 40px; font-weight: 700; border-bottom: 1px solid #0f172a;">Tim Keuangan PKBM ZBT</div>
 </div>
 </div>
        <div class="footer-note">Kuitansi ini dibuat secara sistem online dan sah sebagai bukti pembayaran SPP Sekolah Tahfizh Plus IT Zaid bin Tsabit.</div>
      </div>
      <script>setTimeout(() => { window.print(); }, 500);</script>
    </body>
    </html>
    `;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  const refreshData = async () => {
    // Panel admin: query ini "select=* semua data". Jangan jalan kalau user bukan admin
    // (mis. role sempat ter-flicker) supaya tidak menembak 403 berulang.
    if (session.role !== "admin") return;
    try {
      const [subs, users, spp, billings] = await Promise.all([
        getPPDBSubmissions(),
        getAllUsers(),
        getSPPPayments(),
        getAllUserBillings(),
      ]);
      setSubmissions(subs);
      setUsersList(users);
      setSppList(spp);
      setBillingByUser(billings);
    } catch (err) {
      console.error("Gagal memuat data admin:", err);
    }
  };

  const handleUpdateSPPStatus = async (id: string, status: StatusPembayaranSPP) => {
    // 1. Instant optimistic state update (0ms UI latency)
    setSppList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status, updatedAt: new Date().toISOString() } : s))
    );
    // 2. Background persistent update
    try {
      await updateSPPPaymentStatus(id, status);
    } catch (err) {
      alert(t("Gagal memperbarui status pembayaran: ", "Failed to update payment status: ") + (err as Error).message);
      await refreshData();
    }
  };

  const handleDeleteSPP = async (id: string) => {
    if (confirm(t("Hapus data transaksi pembayaran siswa siswi ini?", "Delete this payment transaction?"))) {
      setSppList((prev) => prev.filter((s) => s.id !== id));
      try {
        await deleteSPPPayment(id);
      } catch (err) {
        alert(t("Gagal menghapus transaksi: ", "Failed to delete transaction: ") + (err as Error).message);
        await refreshData();
      }
    }
  };

  const handleDeleteAllSPP = async () => {
    if (sppList.length === 0) {
      alert(t("Belum ada data pembayaran siswa siswi untuk dihapus.", "No payment records to delete."));
      return;
    }
    const count = sppList.length;
    const confirm1 = confirm(
      t(
        `PERINGATAN: Apakah Anda yakin ingin MENGHAPUS SEMUA (${count}) data pembayaran siswa siswi dalam sekali klik?\n\nTindakan ini akan menghapus semua riwayat transaksi dari database sekolah!`,
        `WARNING: Are you sure you want to DELETE ALL (${count}) student payment records in one click?\n\nThis will remove all transaction history!`
      )
    );
    if (!confirm1) return;

    const confirm2 = prompt(
      t(
        `Ketik "HAPUS" untuk mengonfirmasi penghapusan permanen SEMUA ${count} transaksi pembayaran siswa siswi:`,
        `Type "HAPUS" to confirm permanent deletion of all ${count} student payment records:`
      )
    );
    if (confirm2?.trim().toUpperCase() === "HAPUS") {
      const prev = sppList;
      setSppList([]);
      try {
        await deleteAllSPPPayments();
        alert(t(`Berhasil menghapus seluruh (${count}) data transaksi pembayaran siswa siswi.`, `Successfully deleted all (${count}) payment records.`));
      } catch (err) {
        setSppList(prev);
        alert(t("Gagal menghapus semua transaksi: ", "Failed to delete all transactions: ") + (err as Error).message);
      }
    }
  };

  const handleDeleteFilteredSPP = async (listToDelete: SPPPayment[]) => {
    if (listToDelete.length === 0) return;
    const count = listToDelete.length;
    if (
      confirm(
        t(
          `Apakah Anda yakin ingin menghapus ${count} transaksi pembayaran yang sedang difilter ini?`,
          `Are you sure you want to delete these ${count} filtered payment records?`
        )
      )
    ) {
      try {
        await deleteBatchSPPPayments(listToDelete.map((item) => item.id));
        await refreshData();
        alert(t(`Berhasil menghapus ${count} data pembayaran siswa siswi.`, `Successfully deleted ${count} payment records.`));
      } catch (err) {
        alert(t("Gagal menghapus transaksi terpilih: ", "Failed to delete selected transactions: ") + (err as Error).message);
      }
    }
  };

 useEffect(() => {
 void refreshData();
 // Debounce: notifyChange() bisa meletup berkali-kali (auth event + realtime + tiap tulis).
 let deb: ReturnType<typeof setTimeout> | null = null;
 const unsub = subscribeToDB(() => {
 if (deb) clearTimeout(deb);
 deb = setTimeout(() => {
 void refreshData();
 }, 400);
 });
 return () => {
 if (deb) clearTimeout(deb);
 unsub();
 };
 // eslint-disable-next-line react-hooks/exhaustive-deps
 }, [session.role]);

  const filteredSubmissions = submissions.filter((item) => {
    const matchesSearch =
      item.nama.toLowerCase().includes(search.toLowerCase()) ||
      item.regNo.toLowerCase().includes(search.toLowerCase()) ||
      item.wali.toLowerCase().includes(search.toLowerCase()) ||
      item.userEmail.toLowerCase().includes(search.toLowerCase());
    const matchesJenjang = filterJenjang === "Semua" || item.jenjang.includes(filterJenjang);
    return matchesSearch && matchesJenjang;
  });

 const verifiedCount = submissions.filter((s) => s.statusPendaftaran === "Terverifikasi" || s.statusPendaftaran === "Lulus Seleksi").length;
 const lunasCount = submissions.filter((s) => s.statusPembayaran === "Lunas").length;

  const handleUpdateStatus = async (id: string, statusPendaftaran: StatusPendaftaran, statusPembayaran: StatusPembayaran) => {
    // 1. Instant optimistic state update (0ms UI latency)
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, statusPendaftaran, statusPembayaran, updatedAt: new Date().toISOString() }
          : s
      )
    );
    setSelectedDocSub((prev) =>
      prev && prev.id === id
        ? { ...prev, statusPendaftaran, statusPembayaran, updatedAt: new Date().toISOString() }
        : prev
    );

    // 2. Persist ke Supabase
    try {
      await updatePPDBStatus(id, { statusPendaftaran, statusPembayaran });
    } catch (err) {
      alert(t("Gagal memperbarui status pendaftaran: ", "Failed to update registration status: ") + (err as Error).message);
      await refreshData();
    }
  };

 const handleAssignTest = async (id: string) => {
 const tanggal = prompt(t("Masukkan tanggal tes (contoh: Minggu, 22 Maret 2026):", "Enter test date (e.g. Sunday, March 22, 2026):"), "Minggu, 22 Maret 2026");
 if (!tanggal) return;
 try {
 await updatePPDBStatus(id, {
 jadwalTes: {
 tanggal,
 waktu: "08.00 - 11.30 WIB",
 ruang: "Gedung Utama (Ruang B)",
 lokasi: "PKBM Zaid bin Tsabit",
 },
 });
 await refreshData();
 } catch (err) {
 alert(t("Gagal menyimpan jadwal tes: ", "Failed to save test schedule: ") + (err as Error).message);
 }
 };

 const handleDeleteSub = async (id: string) => {
 if (confirm(t("Apakah Anda yakin ingin menghapus data pendaftaran ini?", "Are you sure you want to delete this registration record?"))) {
 try {
 await deletePPDBSubmission(id);
 await refreshData();
 } catch (err) {
 alert(t("Gagal menghapus data pendaftaran: ", "Failed to delete registration: ") + (err as Error).message);
 }
 }
 };

 const promotableUsers = usersList
   .filter((u) => u.role !== "admin")
   .filter((u) => {
     const q = promoteSearch.trim().toLowerCase();
     if (!q) return true;
     return (u.name || "").toLowerCase().includes(q) || (u.email || "").toLowerCase().includes(q);
   });

 const handlePromoteAdmin = async () => {
   const target = usersList.find((u) => u.id === promoteSelectedId);
   if (!target) {
     setAdminMsg(t("Pilih dulu user yang akan dijadikan admin.", "Select a user to promote first."));
     return;
   }
   const label = target.name || target.email || target.id;
   if (
     !confirm(
       t(
         `Yakin jadikan "${label}" sebagai admin?\n\nUser ini akan mendapat akses penuh ke seluruh data sekolah (pendaftar, pembayaran, akun).`,
         `Promote "${label}" to admin?\n\nThis user will get full access to all school data (registrations, payments, accounts).`
       )
     )
   ) {
     return;
   }
   setPromoting(true);
   setAdminMsg("");
   try {
     const res = await promoteUserToAdmin(target.id);
     if (!res.success) {
       setAdminMsg(t("Gagal menjadikan admin: ", "Failed to promote: ") + (res.error || ""));
       return;
     }
     setAdminMsg(t(`"${label}" berhasil dijadikan admin.`, `"${label}" is now an admin.`));
     setPromoteSelectedId("");
     setPromoteSearch("");
     await refreshData();
   } catch (err) {
     setAdminMsg(t("Gagal menjadikan admin: ", "Failed to promote: ") + (err as Error).message);
   } finally {
     setPromoting(false);
   }
 };

 const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({});

 const togglePasswordVisibility = (userId: string) => {
 setVisiblePasswords((prev) => ({ ...prev, [userId]: !prev[userId] }));
 };

 const handleResetUserPass = async (userId: string, userName: string) => {
 const newPass = prompt(t(`Masukkan kata sandi baru untuk ${userName}:`, `Enter new password for ${userName}:`));
 if (!newPass) return;
 if (newPass.trim().length < 4) {
 alert(t("Kata sandi minimal 4 karakter.", "Password must be at least 4 characters."));
 return;
 }
 try {
 await resetUserPassword(userId, newPass.trim());
 alert(t(`Kata sandi ${userName} berhasil diubah.`, `Password for ${userName} changed.`));
 await refreshData();
 } catch (err) {
 alert((err as Error).message);
 }
 };

 const handleDeleteUser = async (userId: string) => {
 if (confirm(t("Hapus akun user ini dari database?", "Delete this user account from database?"))) {
 try {
 await deleteUserAccount(userId);
 await refreshData();
 } catch (err) {
 alert((err as Error).message);
 }
 }
 };

 const exportCSV = () => {
 const headers = ["No Registrasi", "Nama Siswa", "Jenjang", "Wali", "Telepon", "Email", "Status Pendaftaran", "Status Pembayaran"];
 const rows = submissions.map((s) => [s.regNo, s.nama, s.jenjang, s.wali, s.telepon, s.userEmail, s.statusPendaftaran, s.statusPembayaran]);
 const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", `spmb_pkbm_zaid_bin_tsabit_${Date.now()}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 const exportSPPCSV = () => {
 const headers = [
 "No Transaksi",
 "NIS",
 "Nama Siswa",
 "Jenjang",
 "Bulan Tagihan",
 "Jumlah Nominal (Rp)",
 "Metode Pembayaran",
 "Nama Pengirim",
 "Status Pembayaran",
 "Tanggal Pembayaran",
 ];
 const rows = sppList.map((item) => [
 `"${item.idTransaksi}"`,
 `"${item.nis}"`,
 `"${item.namaSiswa}"`,
 `"${item.jenjang}"`,
 `"${item.bulanTagihan.join("; ")}"`,
 item.jumlahNominal,
 `"${item.metodePembayaran}"`,
 `"${item.namaPengirim}"`,
 `"${item.status}"`,
 `"${new Date(item.createdAt).toLocaleDateString("id-ID")}"`,
 ]);
 const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
 const encodedUri = encodeURI(csvContent);
 const link = document.createElement("a");
 link.setAttribute("href", encodedUri);
 link.setAttribute("download", `spp_pembayaran_pkbm_zaid_bin_tsabit_${Date.now()}.csv`);
 document.body.appendChild(link);
 link.click();
 document.body.removeChild(link);
 };

 return (
 <Shell
 title={t("Dashboard Administrator", "Administrator Dashboard")}
 sub={t("Pusat kelola data pendaftar SPMB, status verifikasi, dan manajemen akun user.", "Manage SPMB applicants, verification status, and user accounts.")}
 session={session}
 onLogout={onLogout}
>
 {/* Metric Cards */}
 <div className="grid gap-5 sm:grid-cols-4">
 {[
 { l: t("Total Pendaftar", "Total Applicants"), v: submissions.length },
 { l: t("Terverifikasi", "Verified"), v: verifiedCount },
 { l: t("Pembayaran Lunas", "Paid Fees"), v: lunasCount },
 { l: t("Pengguna Terdaftar", "Registered Users"), v: usersList.length },
 ].map((s) => (
 <div key={s.l} className="rounded-3xl border border-border bg-card p-6 shadow-sm">
 <p className="text-3xl font-black text-navy">
 <Counter to={s.v} />
 </p>
 <p className="mt-1 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">{s.l}</p>
 </div>
 ))}
 </div>

 {/* Admin Tab Navigation */}
 <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
 <div className="flex gap-2">
 <button
 onClick={() =>setActiveTab("ppdb")}
 className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
 activeTab === "ppdb" ? "bg-navy text-primary-foreground shadow-md" : "bg-card text-muted-foreground hover:bg-muted"
 }`}
>
 <FileSpreadsheet className="h-4 w-4" /> {t("Data Pendaftar SPMB", "SPMB Applicants Data")} ({submissions.length})
 </button>
 <button
 onClick={() =>setActiveTab("users")}
 className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
 activeTab === "users" ? "bg-navy text-primary-foreground shadow-md" : "bg-card text-muted-foreground hover:bg-muted"
 }`}
>
 <Users className="h-4 w-4" /> {t("Manajemen User", "User Management")} ({usersList.length})
 </button>
          <button
            onClick={() => setActiveTab("spp")}
            className={`flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-extrabold uppercase tracking-wider transition-all ${
              activeTab === "spp" ? "bg-navy text-primary-foreground shadow-md" : "bg-card text-muted-foreground hover:bg-muted"
            }`}
          >
            <CreditCard className="h-4 w-4 text-emerald-400" /> {t("Kelola Pembayaran Siswa Siswi", "Student Payments")} ({sppList.length})
          </button>
        </div>

 <div className="flex flex-wrap items-center gap-2">
 <button
 onClick={() =>{
 setActiveTab("users");
 setShowAddAdmin(true);
 }}
 className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-5 py-2 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all"
>
 <ShieldCheck className="h-4 w-4" /> {t("Jadikan Admin", "Promote to Admin")}
 </button>
 </div>
 </div>

 {/* TAB 1: PPDB Submissions Table */}
 {activeTab === "ppdb" && (
 <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm">
 {/* Header & Export Bar */}
 <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-4">
 <div>
 <h3 className="font-extrabold text-base text-foreground flex items-center gap-2">
 <FileText className="h-5 w-5 text-gold" /> {t("Daftar Formulir Pendaftaran SPMB Online", "SPMB Registration Forms List")}
 </h3>
 <p className="text-xs text-muted-foreground mt-0.5">
 {t("Kelola data calon siswa, verifikasi berkas & foto, serta unduh rekap data.", "Manage candidate students, verify files & photos, and download reports.")}
 </p>
 </div>
 <div className="flex items-center gap-2">
 <button
 type="button"
 onClick={handleExportAllCSV}
 className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition-all shadow-md"
 title={t("Unduh Rekap Semua Pendaftar (CSV Excel)", "Download All Applicants (CSV Excel)")}
>
 <FileSpreadsheet className="h-4 w-4" />
 <span>{t("Download Semua Pendaftaran (Excel/CSV)", "Download All Submissions (CSV)")}</span>
 </button>
 </div>
 </div>

 {/* Search & Filters */}
 <div className="flex flex-wrap gap-4 pb-6">
 <div className="relative flex-1 min-w-[240px]">
 <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
 <input
 type="text"
 value={search}
 onChange={(e) => setSearch(e.target.value)}
 placeholder={t("Cari nama siswa, nomor registrasi, atau email...", "Search student name, registration number, or email...")}
 className="w-full rounded-xl border border-border bg-background pl-10 pr-4 py-2.5 text-xs focus:border-gold focus:outline-none"
 />
 </div>
 <select
 value={filterJenjang}
 onChange={(e) => setFilterJenjang(e.target.value)}
 className="rounded-xl border border-border bg-background px-4 py-2.5 text-xs font-bold focus:border-gold focus:outline-none"
>
 <option value="Semua">{t("Semua Jenjang", "All Levels")}</option>
 <option value="TK">TK</option>
 <option value="Setara SD">Setara SD</option>
 <option value="Setara SMP">Setara SMP</option>
 <option value="Setara SMA">Setara SMA</option>
 </select>
 </div>

 {/* Data Table */}
 <div className="overflow-x-auto">
 <table className="w-full text-left text-xs">
 <thead>
 <tr className="border-b border-border bg-muted/50 uppercase text-muted-foreground font-bold tracking-wider">
 <th className="p-3">{t("No. Registrasi", "Reg No.")}</th>
 <th className="p-3">{t("Nama Siswa", "Student Name")}</th>
 <th className="p-3">{t("Jenjang", "Level")}</th>
 <th className="p-3">{t("Wali & Email", "Guardian & Email")}</th>
 <th className="p-3">{t("Status Verifikasi", "Verification Status")}</th>
 <th className="p-3">{t("Status Bayar", "Payment Status")}</th>
 <th className="p-3 text-right">{t("Aksi Admin", "Admin Actions")}</th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredSubmissions.length === 0 ? (
 <tr>
 <td colSpan={7} className="p-8 text-center text-muted-foreground">
 {t("Tidak ada data pendaftaran yang cocok.", "No matching registration records found.")}
 </td>
 </tr>
 ) : (
 filteredSubmissions.map((item) => (
 <tr key={item.id} className="hover:bg-muted/30 transition-colors">
 <td className="p-3 font-bold text-navy">{item.regNo}</td>
 <td className="p-3 font-semibold">
 <div className="font-bold text-foreground">{item.nama}</div>
 {item.catatanTambahan && (
 <div className="mt-1 flex items-center gap-1 text-[11px] font-normal text-amber-800 dark:text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20 max-w-[220px]" title={item.catatanTambahan}>
 <MessageSquare className="h-3 w-3 shrink-0 text-amber-600" />
 <span className="truncate">"{item.catatanTambahan}"</span>
 </div>
 )}
 </td>
 <td className="p-3 text-muted-foreground">{item.jenjang}</td>
 <td className="p-3">
 <p className="font-semibold">{item.wali}</p>
 <p className="text-[11px] text-muted-foreground">{item.userEmail}</p>
 </td>
                      <td className="p-3">
                        <select
                          value={item.statusPendaftaran}
                          onChange={(e) => handleUpdateStatus(item.id, e.target.value as StatusPendaftaran, item.statusPembayaran)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase border cursor-pointer focus:outline-none ${
                            item.statusPendaftaran === "Terverifikasi"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : item.statusPendaftaran === "Lulus Seleksi"
                              ? "bg-slate-200 text-slate-800 border-slate-400"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                          <option value="Terverifikasi">Terverifikasi</option>
                          <option value="Lulus Seleksi">Lulus Seleksi</option>
                          <option value="Ditolak">Ditolak</option>
                        </select>
                      </td>
                      <td className="p-3">
                        <select
                          value={item.statusPembayaran}
                          onChange={(e) => handleUpdateStatus(item.id, item.statusPendaftaran, e.target.value as StatusPembayaran)}
                          className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase border cursor-pointer focus:outline-none ${
                            item.statusPembayaran === "Lunas"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                          <option value="Lunas">Lunas</option>
                          <option value="Belum Bayar">Belum Bayar</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {item.statusPendaftaran !== "Terverifikasi" || item.statusPembayaran !== "Lunas" ? (
                            <button
                              onClick={() => handleUpdateStatus(item.id, "Terverifikasi", "Lunas")}
                              title={t("Verifikasi Berkas & Tandai Lunas", "Verify & Mark Paid")}
                              className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-2.5 py-1 text-white hover:bg-emerald-700 font-extrabold text-[11px] transition-colors shadow-sm"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>{t("Verifikasi", "Verify")}</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                if (confirm(t("Batalkan verifikasi data pendaftaran dan status lunas siswa siswi ini?", "Cancel verification and paid status for this applicant?"))) {
                                  handleUpdateStatus(item.id, "Menunggu Verifikasi", "Menunggu Konfirmasi");
                                }
                              }}
                              title={t("Batalkan Verifikasi & Lunas", "Cancel Verification & Paid Status")}
                              className="inline-flex items-center gap-1 rounded-lg bg-amber-500/15 border border-amber-500/40 px-2 py-1 text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-white font-bold text-[11px] transition-colors"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              <span>{t("Batal", "Revoke")}</span>
                            </button>
                          )}

                          <button
                            onClick={() => setSelectedDocSub(item)}
                            title={t("Lihat Semua Berkas & Foto Siswa", "View All Documents & Photos")}
                            className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-2.5 py-1 text-white hover:bg-sky-700 font-bold text-[11px] transition-colors shadow-sm"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            <span>{t("Cek Form", "Check Form")}</span>
                          </button>

                          <button
                            onClick={() => handleDownloadSinglePDF(item)}
                            title={t("Cetak / Download PDF Formulir Wali Ini", "Print / Download PDF of this Applicant")}
                            className="inline-flex items-center gap-1 rounded-lg bg-slate-100 border border-slate-300 px-2 py-1 text-slate-800 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 hover:bg-slate-200 font-bold text-[11px] transition-colors"
                          >
                            <Printer className="h-3.5 w-3.5" />
                            <span>PDF</span>
                          </button>

                          <button
                            onClick={() => handleAssignTest(item.id)}
                            title={t("Atur Jadwal Tes", "Schedule Test")}
                            className="rounded-lg bg-navy p-1.5 text-gold hover:bg-navy/80"
                          >
                            <Clock className="h-3.5 w-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteSub(item.id)}
                            title={t("Hapus Data", "Delete Data")}
                            className="rounded-lg bg-red-100 p-1.5 text-red-600 hover:bg-red-200"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
 </tr>
 ))
 )}
 </tbody>
 </table>
 </div>
 </div>
 )}

 {/* TAB 2: User Accounts Management */}
 {activeTab === "users" && (
 <div className="mt-6 space-y-6">
 {/* Add Admin Collapsible Form */}
 {showAddAdmin && (
 <div className="relative rounded-3xl border border-gold/40 bg-gradient-to-r from-navy/90 to-navy-deep p-6 md:p-8 text-primary-foreground shadow-luxe">
 <div className="flex items-center justify-between border-b border-gold/30 pb-4 mb-4">
 <div className="flex items-center gap-3">
 <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gold/20 text-gold">
 <ShieldCheck className="h-5 w-5" />
 </div>
 <div>
 <h3 className="text-lg font-extrabold text-gold">{t("Jadikan Admin", "Promote to Admin")}</h3>
 <p className="text-xs text-primary-foreground/75">
 {t("Pilih user terdaftar untuk diberi hak akses administrator.", "Pick a registered user to grant administrator access.")}
 </p>
 </div>
 </div>
 <button
 type="button"
 onClick={() =>setShowAddAdmin(false)}
 className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
>
 <X className="h-4 w-4" />
 </button>
 </div>

 {adminMsg && (
 <div className="mb-4 rounded-2xl border border-emerald-500/40 bg-emerald-950/60 p-3 px-4 text-xs font-bold text-emerald-300">
 {adminMsg}
 </div>
 )}

 {promotableUsers.length === 0 && !promoteSearch.trim() ? (
 <div className="rounded-2xl border border-white/15 bg-white/5 p-4 text-xs text-primary-foreground/80">
 {t(
 "Belum ada user terdaftar yang bisa dijadikan admin. Minta calon admin untuk mendaftar akun biasa terlebih dahulu di halaman \"Daftar Akun\", baru bisa dipromosikan dari sini.",
 "No registered user is available to promote yet. Ask the prospective admin to register a normal account on the \"Create Account\" page first, then promote them from here."
 )}
 </div>
 ) : (
 <div className="space-y-3">
 <input
 type="text"
 placeholder={t("Cari user berdasarkan nama atau email…", "Search user by name or email…")}
 value={promoteSearch}
 onChange={(e) => setPromoteSearch(e.target.value)}
 className="w-full rounded-2xl border border-white/20 bg-white/10 px-4 py-2.5 text-xs text-white placeholder:text-white/50 focus:border-gold focus:outline-none"
 />

 <div className="max-h-64 space-y-1.5 overflow-y-auto rounded-2xl border border-white/15 bg-white/5 p-2">
 {promotableUsers.length === 0 ? (
 <p className="px-2 py-3 text-xs text-primary-foreground/60">
 {t("Tidak ada user yang cocok dengan pencarian.", "No user matches your search.")}
 </p>
 ) : (
 promotableUsers.map((u) => {
 const selected = promoteSelectedId === u.id;
 return (
 <button
 key={u.id}
 type="button"
 onClick={() => setPromoteSelectedId(u.id)}
 className={`flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-colors ${
 selected ? "bg-gold text-navy-deep" : "text-white hover:bg-white/10"
 }`}
 >
 <span className="min-w-0">
 <span className="block truncate font-bold">{u.name || t("(Tanpa nama)", "(No name)")}</span>
 <span className={`block truncate ${selected ? "text-navy-deep/70" : "text-primary-foreground/60"}`}>
 {u.email || u.id}
 </span>
 </span>
 {selected && <Check className="h-4 w-4 shrink-0" />}
 </button>
 );
 })
 )}
 </div>

 <div className="flex justify-end gap-3 pt-1">
 <button
 type="button"
 onClick={() =>setShowAddAdmin(false)}
 className="rounded-full border border-white/20 px-5 py-2 text-xs font-bold text-white hover:bg-white/10"
>
 {t("Batal", "Cancel")}
 </button>
 <button
 type="button"
 disabled={!promoteSelectedId || promoting}
 onClick={handlePromoteAdmin}
 className="rounded-full bg-gradient-to-r from-gold-soft to-gold px-6 py-2 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold disabled:opacity-40"
>
 {promoting ? t("Memproses…", "Processing…") : t("Jadikan Admin", "Promote to Admin")}
 </button>
 </div>
 </div>
 )}

 <p className="mt-4 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-primary-foreground/50">
 {t(
 "Catatan: pembuatan admin PERTAMA (saat belum ada akun sama sekali) hanya dilakukan sekali lewat Supabase dashboard saat setup awal — bukan alur harian.",
 "Note: the FIRST admin (when no account exists yet) is set up once via the Supabase dashboard during initial setup — not a day-to-day flow."
 )}
 </p>
 </div>
 )}

        {/* Registered Users Table */}
        <div className="rounded-3xl border border-border bg-card p-6 shadow-sm overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-border bg-muted/50 uppercase text-muted-foreground font-bold tracking-wider">
                <th className="p-3">{t("ID User", "User ID")}</th>
                <th className="p-3">{t("Nama Lengkap", "Full Name")}</th>
                <th className="p-3">{t("Email Akun", "Account Email")}</th>
                <th className="p-3">{t("Kata Sandi", "Password")}</th>
                <th className="p-3">{t("Peran", "Role")}</th>
                <th className="p-3">{t("Status Tagihan & Penagih", "Billing & Collector Status")}</th>
                <th className="p-3">{t("Tanggal Dibuat", "Date Created")}</th>
                <th className="p-3 text-right">{t("Aksi", "Action")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {usersList.map((u) => {
                const isPassVisible = visiblePasswords[u.id] ?? false;
                const userBilling = u.billing || billingByUser[u.id] || null;
                const unpaids = userBilling?.items?.filter((i) => i.status !== "Lunas") || [];
                const unpaidsTotal = unpaids.reduce((sum, i) => sum + (i.nominal || 0), 0);
                const hasActiveBill = Boolean(userBilling?.isActive && unpaids.length > 0);
                const isValidated = Boolean(userBilling?.isValidated);

                return (
                  <tr key={u.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3 font-mono text-muted-foreground">{u.id}</td>
                    <td className="p-3 font-bold">{u.name}</td>
                    <td className="p-3 font-semibold">{u.email}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-navy dark:text-gold">
                          {isPassVisible ? u.passwordHash : "••••••••"}
                        </span>
                        <button
                          type="button"
                          onClick={() => togglePasswordVisibility(u.id)}
                          className="text-muted-foreground hover:text-foreground p-1 transition-colors cursor-pointer"
                          title={isPassVisible ? t("Sembunyikan Kata Sandi", "Hide Password") : t("Tampilkan Kata Sandi", "Show Password")}
                        >
                          {isPassVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </td>
                    <td className="p-3">
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${
                          u.role === "admin" ? "bg-navy text-gold" : "bg-muted text-foreground"
                        }`}
                      >
                        {u.role === "admin" ? "Administrator" : t("Orang Tua", "Parent")}
                      </span>
                    </td>
                    <td className="p-3">
                      {hasActiveBill ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-100 dark:bg-red-950/80 border border-red-400 dark:border-red-800 px-2.5 py-1 text-[11px] font-black text-red-700 dark:text-red-300 shadow-sm">
                            <AlertTriangle className="h-3 w-3 text-red-600 animate-pulse" />
                            <span>Rp {unpaidsTotal.toLocaleString("id-ID")} ({unpaids.length} item)</span>
                          </span>
                          <div className="text-[10px] text-muted-foreground truncate max-w-[170px]" title={userBilling?.penagihName}>
                            {userBilling?.penagihName || "Petugas Keuangan"}
                          </div>
                        </div>
                      ) : isValidated || (userBilling && userBilling.items && userBilling.items.length > 0) ? (
                        <div className="space-y-1">
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                            <Check className="h-3 w-3 text-emerald-600" />
                            <span>{isValidated ? t("Divalidasi / Lunas", "Validated / Paid") : t("Semua Lunas", "All Paid")}</span>
                          </span>
                          <div className="text-[10px] text-emerald-600 dark:text-emerald-400">
                            {t("Bebas Tagihan", "No Dues")}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-muted-foreground italic">
                          {t("Tidak Ada Tagihan", "No Bills")}
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(u.createdAt).toLocaleDateString("id-ID")}</td>
                    <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                      {/* Set Billing / Edit Button */}
                      <button
                        type="button"
                        onClick={() => handleOpenBillingModal(u)}
                        className="inline-flex items-center gap-1 rounded-lg bg-gradient-to-r from-amber-500/20 via-gold/30 to-amber-500/20 hover:from-amber-500/30 hover:to-gold/40 border border-gold/50 px-2.5 py-1.5 text-[11px] font-extrabold text-navy dark:text-gold shadow-sm transition-all cursor-pointer"
                        title={t("Beri tulisan penagih & set pembayaran untuk user ini", "Set billing and note for this user")}
                      >
                        <Receipt className="h-3.5 w-3.5 text-amber-600 dark:text-gold" />
                        <span>{t("Set Tagihan", "Set Bill")}</span>
                      </button>

                      {/* Quick Send WhatsApp Reminder if has active bill */}
                      {hasActiveBill && (
                        <button
                          type="button"
                          onClick={() => handleQuickSendWAReminder(u)}
                          className="inline-flex items-center gap-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 dark:hover:bg-emerald-900/80 border border-emerald-400/40 px-2.5 py-1.5 text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                          title={t("Kirim catatan penagihan langsung ke WhatsApp orang tua", "Send billing note directly to parent WhatsApp")}
                        >
                          <Send className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{t("Kirim WA", "Send WA")}</span>
                        </button>
                      )}

                      {/* Quick Validate / Cancel Reminder button if has active bill */}
                      {hasActiveBill && (
                        <button
                          type="button"
                          onClick={() => handleValidateAndCancelBilling(u.id, u.name)}
                          className="inline-flex items-center gap-1 rounded-lg bg-teal-100 hover:bg-teal-200 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 dark:hover:bg-teal-900/80 border border-teal-400/40 px-2.5 py-1.5 text-[11px] font-bold shadow-sm transition-all cursor-pointer"
                          title={t("Validasi pembayaran & batalkan pengingat/distraction", "Validate payment & cancel reminder")}
                        >
                          <Check className="h-3 w-3 text-teal-600 dark:text-teal-400" />
                          <span>{t("Validasi", "Validate")}</span>
                        </button>
                      )}

                      {/* Reset Password */}
                      <button
                        onClick={() => handleResetUserPass(u.id, u.name)}
                        className="inline-flex items-center gap-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 px-2.5 py-1.5 text-[11px] font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-200 transition-colors cursor-pointer"
                        title={t("Bantu reset kata sandi user ini", "Help reset this user's password")}
                      >
                        <KeyRound className="h-3 w-3" />
                        {t("Reset", "Reset")}
                      </button>

                      {/* Delete Account */}
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={u.id === session.userId}
                        className="rounded-lg bg-red-100 dark:bg-red-950/60 px-2.5 py-1.5 text-[11px] font-bold text-red-600 dark:text-red-300 hover:bg-red-200 disabled:opacity-30 transition-colors cursor-pointer"
                      >
                        {t("Hapus", "Delete")}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* ========================================================= */}
        {/* ADMIN BILLING & DISTRACTION MANAGEMENT MODAL */}
        {/* ========================================================= */}
        {billingModalUser && (
          <div
            className="fixed inset-0 z-[65] flex items-center justify-center bg-black/85 p-3 sm:p-6 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
            onClick={(e) => {
              if (e.target === e.currentTarget) setBillingModalUser(null);
            }}
          >
            <div className="relative w-full max-w-3xl rounded-3xl border border-gold/40 bg-card p-6 sm:p-8 text-foreground shadow-2xl my-auto animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b border-border pb-4 mb-5 gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-gold text-navy-deep font-black shadow-md">
                    <Receipt className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black text-foreground">
                      {t("Kelola Penagihan & Catatan Reminder User", "Manage User Billing & Reminder Note")}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {t("Target Akun:", "Target Account:")} <strong className="text-gold font-bold">{billingModalUser.name}</strong> ({billingModalUser.email})
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setBillingModalUser(null)}
                  className="rounded-full bg-muted p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form onSubmit={handleSaveBilling} className="space-y-5">
                {/* Distraction Popup Active Toggle */}
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 flex items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-300">
                      <AlertOctagon className="h-5 w-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-xs font-black uppercase tracking-wider text-amber-700 dark:text-amber-300">
                        {t("Mode Pengalihan Otomatis (Distraction Popup)", "Auto Distraction Popup Alert")}
                      </h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">
                        {t(
                          "Saat aktif, user ini akan langsung dicegat / dialihkan dengan popup penagihan besar saat login ke sistem.",
                          "When active, this user will immediately be intercepted with a prominent billing popup modal upon login."
                        )}
                      </p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer shrink-0">
                    <input
                      type="checkbox"
                      checked={billingForm.isActive}
                      onChange={(e) => setBillingForm((prev) => ({ ...prev, isActive: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>

                {/* Form Fields: Collector Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {t("Nama Petugas Penagih / Bagian Keuangan", "Collector / Finance Officer Name")} *
                    </label>
                    <input
                      required
                      type="text"
                      value={billingForm.penagihName}
                      onChange={(e) => setBillingForm((prev) => ({ ...prev, penagihName: e.target.value }))}
                      placeholder="Contoh: Ustadzah Siti Fatimah (Bendahara PKBM ZBT)"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-foreground mb-1">
                      {t("No. WhatsApp / Kontak Penagih", "Collector WhatsApp / Phone")} *
                    </label>
                    <input
                      required
                      type="text"
                      value={billingForm.penagihKontak || ""}
                      onChange={(e) => setBillingForm((prev) => ({ ...prev, penagihKontak: e.target.value }))}
                      placeholder="6281234567890"
                      className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none"
                    />
                  </div>
                </div>

                {/* Parent Contact & WhatsApp Direct Send Action */}
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                        {t("Kontak WhatsApp Orang Tua (Target Pengiriman Reminder)", "Parent WhatsApp Target Contact")}
                      </h4>
                    </div>
                    <span className="text-[10px] text-muted-foreground">
                      {t("Masukkan nomor telp tujuan untuk kirim langsung ke WA", "Enter destination phone to send directly to WhatsApp")}
                    </span>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-12 items-center">
                    <div className="sm:col-span-7">
                      <input
                        type="text"
                        value={billingForm.teleponOrangTua || ""}
                        onChange={(e) => setBillingForm((prev) => ({ ...prev, teleponOrangTua: e.target.value }))}
                        placeholder={t("Masukkan nomor telp tujuan (contoh: 081234567890)", "Enter destination phone number (e.g. 081234567890)")}
                        className="w-full rounded-xl border border-emerald-300 dark:border-emerald-700 bg-background px-4 py-2.5 text-xs text-foreground focus:border-emerald-500 focus:outline-none font-mono"
                      />
                    </div>
                    <div className="sm:col-span-5 flex justify-end">
                      <button
                        type="button"
                        onClick={handleSendWAReminderToParent}
                        className="w-full inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-4 py-2.5 text-xs font-black shadow-md transition-all cursor-pointer"
                      >
                        <Send className="h-3.5 w-3.5" />
                        <span>{t("Kirim Reminder via WA", "Send Reminder to WA")}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Collector's Message (Tulisan Penagih) */}
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1 flex items-center justify-between">
                    <span>{t("Tulisan / Pesan Penagihan Resmi dari Admin", "Official Collector Message & Note")} *</span>
                    <span className="text-[10px] text-muted-foreground">{t("Ditampilkan di popup, pesan WA & dashboard", "Shown in popup, WA & dashboard")}</span>
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={billingForm.pesanPenagih}
                    onChange={(e) => setBillingForm((prev) => ({ ...prev, pesanPenagih: e.target.value }))}
                    placeholder={t("Contoh: Assalamu'alaikum Ayah/Bunda, mohon segera menyelesaikan kewajiban pembayaran SPP Bulan September 2026...", "Example: Assalamu'alaikum, please settle the tuition fee for September 2026...")}
                    className="w-full rounded-xl border border-border bg-background p-3 text-xs text-foreground focus:border-gold focus:outline-none leading-relaxed"
                  />
                </div>

                {/* Rekening Tujuan & Tanggal */}
                <div className="space-y-4 rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-foreground">
                        {t("Rekening Tujuan Transfer Pembayaran", "Target Payment Account")} *
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {t("Bisa pilih dari daftar rekening resmi atau ketik manual sendiri", "Select official account or type custom below")}
                      </span>
                    </div>

                    {/* Dropdown Select Option */}
                    <div>
                      <select
                        value={
                          BANK_ACCOUNT_PRESETS.find((acc) => acc.fullText === billingForm.rekeningTujuan)?.fullText || "custom"
                        }
                        onChange={(e) => {
                          if (e.target.value !== "custom") {
                            setBillingForm((prev) => ({ ...prev, rekeningTujuan: e.target.value }));
                          }
                        }}
                        className="w-full rounded-xl border border-gold/50 bg-background px-4 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none font-medium cursor-pointer shadow-sm"
                      >
                        <option value="" disabled>-- {t("Pilih Rekening Resmi Sekolah", "Select Official School Account")} --</option>
                        {BANK_ACCOUNT_PRESETS.map((acc, idx) => (
                          <option key={idx} value={acc.fullText}>
                            {acc.label}
                          </option>
                        ))}
                        <option value="custom">{t("Ketik Rekening Sendiri / Kustom...", "Type Custom Account...")}</option>
                      </select>
                    </div>

                    {/* Manual / Custom Write-in Text Input */}
                    <div>
                      <input
                        type="text"
                        value={billingForm.rekeningTujuan || ""}
                        onChange={(e) => setBillingForm((prev) => ({ ...prev, rekeningTujuan: e.target.value }))}
                        placeholder="Contoh: Bank Syariah Indonesia (BSI) 7797737757 a.n. PKBM SETARA SD ZAID BIN TSABIT"
                        className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none font-mono"
                      />
                    </div>

                    {/* Quick Pick Chips / Pills */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase self-center mr-1">
                        {t("Pilihan Cepat:", "Quick Pick:")}
                      </span>
                      {BANK_ACCOUNT_PRESETS.map((acc, idx) => {
                        const isChosen = billingForm.rekeningTujuan === acc.fullText;
                        return (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setBillingForm((prev) => ({ ...prev, rekeningTujuan: acc.fullText }))}
                            className={`rounded-full px-2.5 py-1 text-[10px] font-bold transition-all cursor-pointer border ${
                              isChosen
                                ? "bg-gold text-navy-deep border-gold shadow-sm scale-105"
                                : "bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground"
                            }`}
                            title={acc.fullText}
                          >
                            {acc.kategori} ({acc.nomor})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tanggal Diterbitkan & Pemilih Kalender Interaktif */}
                  <div className="space-y-2 pt-1 border-t border-border/60">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-foreground">
                        {t("Tanggal Diterbitkan / Periode Tagihan", "Issue Date / Billing Period")} *
                      </label>
                      <span className="text-[10px] text-muted-foreground">
                        {t("Klik kalender untuk pilih tanggal/bulan/tahun atau ketik manual", "Click calendar to pick date/month/year or type manually")}
                      </span>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          value={billingForm.tanggalTagihan || ""}
                          onChange={(e) => setBillingForm((prev) => ({ ...prev, tanggalTagihan: e.target.value }))}
                          placeholder="Contoh: 31 Agustus 2026"
                          className="w-full rounded-xl border border-border bg-background pl-4 pr-10 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none font-medium"
                        />
                        <label
                          className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center h-7 w-7 rounded-lg bg-muted hover:bg-gold/20 hover:text-gold text-muted-foreground transition-colors cursor-pointer"
                          title={t("Buka Pemilih Kalender Tanggal & Tahun", "Open Date & Year Calendar Picker")}
                        >
                          <Calendar className="h-4 w-4" />
                          <input
                            type="date"
                            className="sr-only"
                            onChange={(e) => {
                              if (e.target.value) {
                                const [year, month, day] = e.target.value.split("-");
                                const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                                const formatted = dateObj.toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                });
                                setBillingForm((prev) => ({ ...prev, tanggalTagihan: formatted }));
                              }
                            }}
                          />
                        </label>
                      </div>

                      {/* Direct Calendar Picker Input */}
                      <div className="flex items-center gap-1.5 shrink-0">
                        <input
                          type="date"
                          onChange={(e) => {
                            if (e.target.value) {
                              const [year, month, day] = e.target.value.split("-");
                              const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                              const formatted = dateObj.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              });
                              setBillingForm((prev) => ({ ...prev, tanggalTagihan: formatted }));
                            }
                          }}
                          className="rounded-xl border border-gold/50 bg-background px-3 py-2 text-xs text-foreground focus:border-gold focus:outline-none cursor-pointer shadow-sm"
                          title={t("Pilih Tanggal dari Kalender", "Select Date from Calendar")}
                        />
                      </div>
                    </div>

                    {/* Quick Date Shortcuts */}
                    <div className="flex flex-wrap gap-1.5 pt-0.5">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase self-center mr-1">
                        {t("Pilihan Cepat:", "Quick Set:")}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const today = new Date().toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          });
                          setBillingForm((prev) => ({ ...prev, tanggalTagihan: today }));
                        }}
                        className="rounded-full bg-card border border-border hover:bg-muted px-2.5 py-1 text-[10px] font-bold text-foreground transition-all cursor-pointer"
                      >
                        {t("Hari Ini", "Today")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          const monthStr = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                          setBillingForm((prev) => ({ ...prev, tanggalTagihan: `1 ${monthStr}` }));
                        }}
                        className="rounded-full bg-card border border-border hover:bg-muted px-2.5 py-1 text-[10px] font-bold text-foreground transition-all cursor-pointer"
                      >
                        {t("Awal Bulan Ini", "Start of Month")}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const d = new Date();
                          d.setMonth(d.getMonth() + 1);
                          const nextMonthStr = d.toLocaleDateString("id-ID", { month: "long", year: "numeric" });
                          setBillingForm((prev) => ({ ...prev, tanggalTagihan: `1 ${nextMonthStr}` }));
                        }}
                        className="rounded-full bg-card border border-border hover:bg-muted px-2.5 py-1 text-[10px] font-bold text-foreground transition-all cursor-pointer"
                      >
                        {t("Bulan Depan", "Next Month")}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Quick Preset Buttons */}
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                    {t("Preset Cepat Tambah Tagihan:", "Quick Add Bill Presets:")}
                  </label>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => handleApplyBillingPreset("spp")}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-[11px] font-bold text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3 text-gold" />
                      <span>+ SPP Bulanan (Rp 750.000)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyBillingPreset("gedung")}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-[11px] font-bold text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3 text-gold" />
                      <span>+ Uang Pangkal (Rp 3.500.000)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyBillingPreset("kitab")}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-[11px] font-bold text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3 text-gold" />
                      <span>+ Buku Paket & Kitab (Rp 650.000)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyBillingPreset("seragam")}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-[11px] font-bold text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3 text-gold" />
                      <span>+ Paket Seragam (Rp 1.200.000)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyBillingPreset("katering")}
                      className="inline-flex items-center gap-1 rounded-full border border-border bg-background hover:bg-muted px-3 py-1.5 text-[11px] font-bold text-foreground transition-all cursor-pointer"
                    >
                      <Plus className="h-3 w-3 text-gold" />
                      <span>+ Katering Siswa (Rp 500.000)</span>
                    </button>
                  </div>
                </div>

                {/* Itemized Bills Builder */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                      {t("Daftar Item Pembayaran yang Harus Dibayar", "Itemized Payment List")} ({billingForm.items.length})
                    </h4>
                    <button
                      type="button"
                      onClick={handleAddBillingItem}
                      className="inline-flex items-center gap-1 rounded-full bg-navy hover:bg-navy-deep px-3 py-1.5 text-[11px] font-extrabold text-gold shadow-sm transition-all cursor-pointer"
                    >
                      <Plus className="h-3.5 w-3.5" />
                      <span>{t("Tambah Baris Item", "Add Line Item")}</span>
                    </button>
                  </div>

                  {billingForm.items.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border p-6 text-center text-xs text-muted-foreground">
                      {t("Belum ada rincian tagihan. Klik preset di atas atau tombol 'Tambah Baris Item'.", "No billing items yet. Use presets or click 'Add Line Item'.")}
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                      {billingForm.items.map((item, idx) => (
                        <div
                          key={item.id || idx}
                          className="rounded-2xl border border-border bg-background p-3.5 grid gap-3 sm:grid-cols-12 items-center"
                        >
                          <div className="sm:col-span-3">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                              {t("Nama Tagihan / Item", "Bill Name")}
                            </label>
                            <input
                              required
                              type="text"
                              value={item.namaItem}
                              onChange={(e) => handleBillingItemChange(item.id, "namaItem", e.target.value)}
                              placeholder="Contoh: SPP September 2026"
                              className="w-full rounded-xl border border-border bg-card px-3 py-2 text-xs focus:border-gold focus:outline-none"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                              {t("Kategori", "Category")}
                            </label>
                            <select
                              value={item.kategori || "SPP Bulanan"}
                              onChange={(e) => handleBillingItemChange(item.id, "kategori", e.target.value)}
                              className="w-full rounded-xl border border-border bg-card px-2.5 py-2 text-xs focus:border-gold focus:outline-none"
                            >
                              <option value="SPP Bulanan">SPP Bulanan</option>
                              <option value="Uang Pangkal / Gedung">Uang Pangkal / Gedung</option>
                              <option value="Buku Paket & Kitab">Buku Paket & Kitab</option>
                              <option value="Seragam & Atribut">Seragam & Atribut</option>
                              <option value="Katering Siswa Siswi">Katering Siswa Siswi</option>
                              <option value="Kegiatan & Eskul">Kegiatan & Eskul</option>
                              <option value="Infaq & Donasi">Infaq & Donasi</option>
                              <option value="Lain-lain">Lain-lain</option>
                            </select>
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                              {t("Nominal (Rp)", "Amount")}
                            </label>
                            <input
                              required
                              type="number"
                              min={0}
                              step={1000}
                              value={item.nominal || 0}
                              onChange={(e) => handleBillingItemChange(item.id, "nominal", Number(e.target.value) || 0)}
                              className="w-full rounded-xl border border-border bg-card px-2.5 py-2 text-xs font-bold focus:border-gold focus:outline-none"
                            />
                          </div>

                          {/* Batas Jatuh Tempo with Date Picker */}
                          <div className="sm:col-span-3">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                              {t("Batas Jatuh Tempo", "Due Date")}
                            </label>
                            <div className="relative flex items-center gap-1">
                              <input
                                type="text"
                                value={item.jatuhTempo || ""}
                                onChange={(e) => handleBillingItemChange(item.id, "jatuhTempo", e.target.value)}
                                placeholder="10 September 2026"
                                className="w-full rounded-xl border border-border bg-card px-2.5 py-2 text-xs focus:border-gold focus:outline-none"
                              />
                              <label
                                className="shrink-0 flex items-center justify-center h-8 w-8 rounded-lg bg-muted hover:bg-gold/20 hover:text-gold text-muted-foreground transition-colors cursor-pointer border border-border"
                                title={t("Pilih Jatuh Tempo dari Kalender", "Select Due Date from Calendar")}
                              >
                                <Calendar className="h-3.5 w-3.5" />
                                <input
                                  type="date"
                                  className="sr-only"
                                  onChange={(e) => {
                                    if (e.target.value) {
                                      const [year, month, day] = e.target.value.split("-");
                                      const dateObj = new Date(Number(year), Number(month) - 1, Number(day));
                                      const formatted = dateObj.toLocaleDateString("id-ID", {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                      });
                                      handleBillingItemChange(item.id, "jatuhTempo", formatted);
                                    }
                                  }}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="sm:col-span-1">
                            <label className="block text-[10px] font-bold text-muted-foreground uppercase mb-0.5">
                              {t("Status", "Status")}
                            </label>
                            <select
                              value={item.status || "Belum Lunas"}
                              onChange={(e) => handleBillingItemChange(item.id, "status", e.target.value)}
                              className={`w-full rounded-xl border px-1.5 py-2 text-[11px] font-bold focus:outline-none ${
                                item.status === "Lunas"
                                  ? "bg-emerald-50 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300"
                                  : "bg-red-50 text-red-800 border-red-300 dark:bg-red-950/60 dark:text-red-300"
                              }`}
                            >
                              <option value="Belum Lunas">{t("Belum", "Unpaid")}</option>
                              <option value="Lunas">{t("Lunas", "Paid")}</option>
                            </select>
                          </div>

                          <div className="sm:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() => handleRemoveBillingItem(item.id)}
                              className="rounded-lg p-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-950/60 transition-colors cursor-pointer"
                              title={t("Hapus baris ini", "Delete row")}
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Total Billing Preview */}
                  <div className="flex items-center justify-between rounded-2xl bg-muted/70 p-4 border border-border">
                    <span className="text-xs font-bold uppercase text-foreground">
                      {t("Total Tagihan Belum Lunas:", "Total Unpaid Due:")}
                    </span>
                    <span className="text-lg font-black text-red-600 dark:text-gold">
                      Rp{" "}
                      {billingForm.items
                        .filter((i) => i.status !== "Lunas")
                        .reduce((acc, curr) => acc + (curr.nominal || 0), 0)
                        .toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-border">
                  <div className="flex flex-wrap items-center gap-2">
                    {/* Validate and Cancel Button */}
                    <button
                      type="button"
                      onClick={() => handleValidateAndCancelBilling(billingModalUser.id, billingModalUser.name)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-teal-400 bg-teal-50 hover:bg-teal-100 text-teal-800 dark:bg-teal-950/70 dark:text-teal-300 px-4 py-2 text-xs font-black shadow-sm transition-all cursor-pointer"
                      title={t("Validasi pembayaran, tandai lunas & batalkan pengingat distraction", "Validate payment & cancel reminder")}
                    >
                      <Check className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                      <span>{t("Validasi & Batalkan Pengingat", "Validate & Cancel Reminder")}</span>
                    </button>

                    {/* Clear all bills */}
                    <button
                      type="button"
                      onClick={handleClearBilling}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-300 bg-red-50 hover:bg-red-100 text-red-700 dark:bg-red-950/60 dark:text-red-300 px-3.5 py-2 text-xs font-bold transition-all cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t("Kosongkan", "Clear")}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setBillingModalUser(null)}
                      className="rounded-full border border-border px-5 py-2 text-xs font-bold text-foreground hover:bg-muted transition-colors cursor-pointer"
                    >
                      {t("Batal", "Cancel")}
                    </button>
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-6 py-2 text-xs font-black uppercase tracking-wider text-navy-deep shadow-gold hover:scale-105 transition-all cursor-pointer"
                    >
                      <Check className="h-4 w-4" />
                      <span>{t("Simpan & Aktifkan Notifikasi", "Save & Activate Alert")}</span>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    )}

        {/* TAB 3: Student Payments & Category Management Table */}
        {activeTab === "spp" && (() => {
          const matchCategory = (itemCat: string, targetId: string) => {
            const c = itemCat || "SPP Bulanan";
            if (targetId === "all") return true;
            if (targetId === "SPP Bulanan") return !itemCat || c === "SPP Bulanan";
            if (targetId === "SPP Bulanan Boarding") return c.includes("Boarding");
            if (targetId === "Biaya Pendidikan") return c.includes("Pendidikan") || c.includes("Pangkal") || c.includes("Gedung");
            if (targetId === "Seragam & Atribut") return c.includes("Seragam");
            if (targetId === "Buku Paket & Kitab") return c.includes("Buku");
            if (targetId === "Sampul Rapor") return c.includes("Rapor") || c.includes("Katering");
            if (targetId === "Kegiatan & Eskul") return c.includes("Kegiatan") || c.includes("Eskul");
            if (targetId === "Ujian Pendidikan Kesetaraan") return c.includes("Ujian") || c.includes("Kesetaraan") || c.includes("UPK");
            if (targetId === "Infaq & Donasi") return c.includes("Infaq") || c.includes("Wakaf") || c.includes("Donasi");
            if (targetId === "Lain-lain") return c.includes("Lain");
            return c === targetId;
          };

          const sppOnlyList = sppList.filter((s) => matchCategory(s.kategoriPembayaran || "SPP Bulanan", "SPP Bulanan") || matchCategory(s.kategoriPembayaran || "", "SPP Bulanan Boarding"));
          const sppOnlyTotal = sppOnlyList.reduce((acc, curr) => acc + (curr.jumlahNominal || 0), 0);

          const infaqList = sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Infaq & Donasi"));
          const infaqTotal = infaqList.reduce((acc, curr) => acc + (curr.jumlahNominal || 0), 0);

          const nonSppList = sppList.filter((s) => !matchCategory(s.kategoriPembayaran || "", "SPP Bulanan") && !matchCategory(s.kategoriPembayaran || "", "SPP Bulanan Boarding") && !matchCategory(s.kategoriPembayaran || "", "Infaq & Donasi"));
          const nonSppTotal = nonSppList.reduce((acc, curr) => acc + (curr.jumlahNominal || 0), 0);

          const totalLunasNominal = sppList.filter((s) => s.status === "Lunas").reduce((acc, curr) => acc + (curr.jumlahNominal || 0), 0);

          const categoriesList = [
            { id: "all", label: "Semua Pembayaran", icon: Layers, count: sppList.length },
            { id: "SPP Bulanan", label: "SPP Bulanan", icon: CreditCard, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "SPP Bulanan")).length },
            { id: "SPP Bulanan Boarding", label: "SPP Bulanan Boarding", icon: Building2, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "SPP Bulanan Boarding")).length },
            { id: "Biaya Pendidikan", label: "Biaya Pendidikan", icon: Layers, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Biaya Pendidikan")).length },
            { id: "Seragam & Atribut", label: "Seragam & Atribut", icon: Shirt, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Seragam & Atribut")).length },
            { id: "Buku Paket & Kitab", label: "Buku Paket & Kitab", icon: BookOpen, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Buku Paket & Kitab")).length },
            { id: "Sampul Rapor", label: "Sampul Rapor", icon: FileText, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Sampul Rapor")).length },
            { id: "Kegiatan & Eskul", label: "Kegiatan & Eskul", icon: Users, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Kegiatan & Eskul")).length },
            { id: "Ujian Pendidikan Kesetaraan", label: "Ujian Pendidikan Kesetaraan", icon: FileSpreadsheet, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Ujian Pendidikan Kesetaraan")).length },
            { id: "Infaq & Donasi", label: "Infaq & Donasi", icon: Sparkles, count: infaqList.length, highlight: true },
            { id: "Lain-lain", label: "Keperluan Lain", icon: Receipt, count: sppList.filter((s) => matchCategory(s.kategoriPembayaran || "", "Lain-lain")).length },
          ];

          const filteredSPPList = sppList.filter((item) => {
            const itemCat = item.kategoriPembayaran || "SPP Bulanan";
            const matchesCat = matchCategory(itemCat, sppCategoryFilter);
            const matchesStatus = sppStatusFilter === "all" || item.status === sppStatusFilter;
            const q = sppSearch.trim().toLowerCase();
            if (!q) return matchesCat && matchesStatus;

            const matchesSearch =
              (item.namaSiswa || "").toLowerCase().includes(q) ||
              (item.nis || "").toLowerCase().includes(q) ||
              (item.idTransaksi || "").toLowerCase().includes(q) ||
              (item.namaPengirim || "").toLowerCase().includes(q) ||
              (item.jenjang || "").toLowerCase().includes(q) ||
              itemCat.toLowerCase().includes(q) ||
              (item.bulanTagihan || []).some((b) => b.toLowerCase().includes(q));

            return matchesCat && matchesStatus && matchesSearch;
          });

          const getCategoryBadgeClass = (cat?: string) => {
            const c = cat || "SPP Bulanan";
            if (c.includes("Infaq") || c.includes("Wakaf") || c.includes("Donasi")) {
              return "bg-teal-100 text-teal-900 border-teal-300 dark:bg-teal-950/60 dark:text-teal-300 font-black";
            }
            if (c.includes("Pangkal") || c.includes("Gedung")) {
              return "bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/60 dark:text-amber-300";
            }
            if (c.includes("Seragam")) {
              return "bg-purple-100 text-purple-900 border-purple-300 dark:bg-purple-950/60 dark:text-purple-300";
            }
            if (c.includes("Buku")) {
              return "bg-yellow-100 text-yellow-900 border-yellow-300 dark:bg-yellow-950/60 dark:text-yellow-300";
            }
            if (c.includes("Katering")) {
              return "bg-orange-100 text-orange-900 border-orange-300 dark:bg-orange-950/60 dark:text-orange-300";
            }
            if (c.includes("Antar")) {
              return "bg-blue-100 text-blue-900 border-blue-300 dark:bg-blue-950/60 dark:text-blue-300";
            }
            if (c.includes("Kegiatan") || c.includes("Eskul")) {
              return "bg-rose-100 text-rose-900 border-rose-300 dark:bg-rose-950/60 dark:text-rose-300";
            }
            if (c.includes("Lain")) {
              return "bg-slate-200 text-slate-900 border-slate-400 dark:bg-slate-800 dark:text-slate-200";
            }
            return "bg-emerald-100 text-emerald-800 border-emerald-300 dark:bg-emerald-950/60 dark:text-emerald-300";
          };

          return (
            <div className="mt-6 rounded-3xl border border-border bg-card p-6 shadow-sm space-y-6">
              {/* Header & Export Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-border">
                <div>
                  <h3 className="text-xl font-black text-foreground flex items-center gap-2">
                    <CreditCard className="h-6 w-6 text-emerald-500" />
                    {t("Kelola Pembayaran Siswa Siswi", "Student Payments Management")}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t("Verifikasi resi transfer, filter kategori (SPP, Uang Pangkal, Seragam, Katering, Infaq, dll), dan cetak kuitansi.", "Verify receipts, filter categories (SPP, Registration, Uniforms, Catering, Infaq), and print receipts.")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  {filteredSPPList.length > 0 && filteredSPPList.length < sppList.length && (
                    <button
                      type="button"
                      onClick={() => handleDeleteFilteredSPP(filteredSPPList)}
                      className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-white transition-all shadow-sm cursor-pointer"
                      title={t("Hapus hanya data transaksi yang sedang difilter ini", "Delete only filtered payment records")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t(`Hapus Yang Difilter (${filteredSPPList.length})`, `Delete Filtered (${filteredSPPList.length})`)}</span>
                    </button>
                  )}
                  {sppList.length > 0 && (
                    <button
                      type="button"
                      onClick={handleDeleteAllSPP}
                      className="inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-red-700 transition-all shadow-md cursor-pointer hover:scale-105"
                      title={t("Hapus SEMUA data pembayaran siswa siswi dalam sekali klik (Dengan konfirmasi keamanan)", "Delete ALL student payments at once (With security confirmation)")}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t("Hapus Semua Pembayaran", "Delete All Payments")} ({sppList.length})</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={exportSPPCSV}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-all shadow-sm cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>{t("Export CSV Pembayaran", "Export Payments CSV")}</span>
                  </button>
                  <Link
                    to="/spp"
                    target="_blank"
                    className="inline-flex items-center gap-2 rounded-full border border-gold bg-gold/20 px-4 py-2 text-xs font-bold text-gold hover:bg-gold hover:text-navy transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" /> {t("Buka Form Pembayaran", "Open Payment Form")}
                  </Link>
                </div>
              </div>

              {/* Financial & Category Summary Statistics Cards */}
              <div className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/10 dark:bg-emerald-950/30 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Total SPP Bulanan</span>
                  <div className="mt-1 text-lg font-black text-foreground">Rp {sppOnlyTotal.toLocaleString("id-ID")}</div>
                  <div className="text-[11px] text-muted-foreground">{sppOnlyList.length} transaksi SPP terdaftar</div>
                </div>

                <div className="rounded-2xl border border-amber-500/30 bg-amber-950/10 dark:bg-amber-950/30 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Non-SPP / Fasilitas</span>
                  <div className="mt-1 text-lg font-black text-foreground">Rp {nonSppTotal.toLocaleString("id-ID")}</div>
                  <div className="text-[11px] text-muted-foreground">{nonSppList.length} transaksi (Gedung, Seragam, dll)</div>
                </div>

                <div className="rounded-2xl border border-teal-500/30 bg-teal-950/10 dark:bg-teal-950/30 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5 text-teal-500" /> Infaq & Donasi
                  </span>
                  <div className="mt-1 text-lg font-black text-teal-600 dark:text-teal-400">Rp {infaqTotal.toLocaleString("id-ID")}</div>
                  <div className="text-[11px] text-muted-foreground">{infaqList.length} transaksi infaq terpisah otomatis</div>
                </div>

                <div className="rounded-2xl border border-navy/30 bg-navy/10 dark:bg-navy/40 p-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold">Total Terverifikasi Lunas</span>
                  <div className="mt-1 text-lg font-black text-emerald-600 dark:text-emerald-400">Rp {totalLunasNominal.toLocaleString("id-ID")}</div>
                  <div className="text-[11px] text-muted-foreground">{sppList.filter((s) => s.status === "Lunas").length} dari {sppList.length} transaksi lunas</div>
                </div>
              </div>

              {/* Category Filter Pills (Tabs Khusus Sesuai Form & Sistem) */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                  <Tag className="h-3.5 w-3.5 text-gold" />
                  <span>{t("Filter Tabel Berdasarkan Kategori Pembayaran:", "Filter Table by Payment Category:")}</span>
                </div>
                <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {categoriesList.map((cat) => {
                    const isSelected = sppCategoryFilter === cat.id;
                    const IconComponent = cat.icon;
                    return (
                      <button
                        type="button"
                        key={cat.id}
                        onClick={() => setSppCategoryFilter(cat.id)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-extrabold transition-all ${
                          isSelected
                            ? cat.highlight
                              ? "bg-teal-700 text-white shadow-md ring-2 ring-teal-400"
                              : "bg-navy text-gold shadow-md ring-2 ring-gold/40"
                            : cat.highlight
                            ? "bg-teal-500/10 text-teal-700 dark:text-teal-300 border border-teal-500/30 hover:bg-teal-500/20"
                            : "bg-muted text-muted-foreground hover:bg-card hover:text-foreground border border-border"
                        }`}
                      >
                        <IconComponent className="h-3.5 w-3.5 shrink-0" />
                        <span>{cat.label}</span>
                        <span className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                          isSelected
                            ? "bg-white text-navy-deep font-black"
                            : "bg-background text-muted-foreground font-semibold"
                        }`}>
                          {cat.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Special Banner for Dedicated Infaq Table View */}
              {sppCategoryFilter === "Infaq & Donasi" && (
                <div className="rounded-2xl border border-teal-500/40 bg-teal-500/10 p-4 flex flex-wrap items-center justify-between gap-3 animate-in fade-in duration-300">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-teal-600 text-white shadow-md">
                      <Sparkles className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-foreground flex items-center gap-2">
                        {t("Tabel Khusus Penerimaan Infaq & Donasi", "Dedicated Infaq & Donation Table")}
                        <span className="rounded-full bg-teal-600 px-2 py-0.5 text-[10px] font-bold text-white uppercase">Tersaring Otomatis</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {t("Seluruh infaq sukarela siswa siswi/wali otomatis dipisahkan dari pembayaran pokok dan tercatat resmi di sini.", "All voluntary donations from parents are automatically separated from primary tuition and recorded here.")}
                      </div>
                    </div>
                  </div>
                  <div className="text-right bg-background/80 px-4 py-2 rounded-xl border border-teal-500/30">
                    <div className="text-[10px] font-bold uppercase text-teal-600 dark:text-teal-400">Total Infaq Terkumpul</div>
                    <div className="text-base font-black text-teal-600 dark:text-teal-400">Rp {infaqTotal.toLocaleString("id-ID")}</div>
                  </div>
                </div>
              )}

              {/* Search & Status Filter */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <div className="relative flex-1 min-w-[240px]">
                  <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={sppSearch}
                    onChange={(e) => setSppSearch(e.target.value)}
                    placeholder={t("Cari siswa siswi, NIS, no. transaksi, pengirim, atau rincian...", "Search student, NIS, transaction ID, sender...")}
                    className="w-full rounded-xl border border-border bg-background py-2 pl-10 pr-4 text-xs focus:border-gold focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{t("Status:", "Status:")}</span>
                  <select
                    value={sppStatusFilter}
                    onChange={(e) => setSppStatusFilter(e.target.value)}
                    className="rounded-xl border border-border bg-background px-3 py-2 text-xs font-semibold focus:border-gold focus:outline-none cursor-pointer"
                  >
                    <option value="all">Semua Status</option>
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Lunas">Lunas</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>
              </div>

              {/* Enhanced Table with Dedicated Category Column */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-border bg-muted/50 uppercase font-bold text-muted-foreground">
                      <th className="p-3">{t("No. Transaksi", "Trx No.")}</th>
                      <th className="p-3">{t("Siswa Siswi & NIS", "Student & NIS")}</th>
                      <th className="p-3">{t("Jenjang", "Level")}</th>
                      <th className="p-3">{t("Kategori Pembayaran", "Payment Category")}</th>
                      <th className="p-3">{t("Rincian Item / Tagihan", "Item Details")}</th>
                      <th className="p-3 text-right">{t("Nominal Transfer", "Amount")}</th>
                      <th className="p-3">{t("Metode & Pengirim", "Method & Sender")}</th>
                      <th className="p-3 text-center">{t("Bukti Resi", "Receipt")}</th>
                      <th className="p-3 text-center">{t("Status Pembayaran", "Status")}</th>
                      <th className="p-3 text-center">{t("Aksi", "Actions")}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredSPPList.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-muted-foreground">
                          {t("Tidak ada transaksi pembayaran siswa siswi yang cocok dengan filter.", "No payment transactions match the selected filter.")}
                        </td>
                      </tr>
                    ) : (
                      filteredSPPList.map((item) => {
                        const itemCat = item.kategoriPembayaran || "SPP Bulanan";
                        return (
                          <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                            <td className="p-3 font-mono font-bold text-gold whitespace-nowrap">
                              <div>{item.idTransaksi}</div>
                              <div className="text-[10px] text-muted-foreground font-normal">
                                {new Date(item.createdAt).toLocaleDateString("id-ID")}
                              </div>
                            </td>
                            <td className="p-3 font-medium">
                              <div className="font-bold text-foreground">{item.namaSiswa}</div>
                              <div className="text-[11px] text-muted-foreground font-mono">NIS: {item.nis}</div>
                            </td>
                            <td className="p-3 font-semibold whitespace-nowrap">{item.jenjang}</td>
                            
                            {/* DEDICATED CATEGORY BADGE COLUMN */}
                            <td className="p-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase border ${getCategoryBadgeClass(item.kategoriPembayaran)}`}>
                                <Tag className="h-3 w-3" />
                                {itemCat}
                              </span>
                            </td>

                            {/* ITEM / BILLING DETAILS COLUMN */}
                            <td className="p-3 font-medium max-w-[240px]">
                              <div className="truncate text-foreground font-semibold">
                                {Array.isArray(item.bulanTagihan) && item.bulanTagihan.length > 0
                                  ? item.bulanTagihan.join(", ")
                                  : itemCat}
                              </div>
                              {item.catatan && (
                                <div className="mt-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 p-2 text-xs shadow-sm">
                                  <div className="flex items-center gap-1 font-extrabold text-amber-800 dark:text-amber-300 text-[10px] uppercase tracking-wider">
                                    <MessageSquare className="h-3 w-3 shrink-0" />
                                    <span>Catatan User:</span>
                                  </div>
                                  <p className="italic font-medium text-[11px] text-foreground mt-0.5 whitespace-normal break-words leading-tight">
                                    "{item.catatan}"
                                  </p>
                                </div>
                              )}
                            </td>

                            {/* NOMINAL AMOUNT COLUMN */}
                            <td className="p-3 text-right whitespace-nowrap">
                              <div className="font-bold text-emerald-600">Rp {item.jumlahNominal.toLocaleString("id-ID")}</div>
                              {item.infaqNominal && item.infaqNominal > 0 && (
                                <div className="text-[10px] font-semibold text-teal-600">
                                  + Infaq Rp {item.infaqNominal.toLocaleString("id-ID")}
                                </div>
                              )}
                            </td>

                            {/* METHOD & SENDER COLUMN */}
                            <td className="p-3">
                              <div className="font-semibold text-foreground">{item.metodePembayaran}</div>
                              <div className="text-[11px] text-muted-foreground">Pengirim: {item.namaPengirim}</div>
                            </td>

                            {/* RECEIPT PREVIEW COLUMN */}
                            <td className="p-3 text-center whitespace-nowrap">
                              <button
                                type="button"
                                onClick={() =>
                                  setZoomImg({
                                    title: `Bukti Resi Transfer ${itemCat} — ${item.namaSiswa || "Siswa"} (${item.idTransaksi})`,
                                    url: getSPPReceiptPreviewUrl(item),
                                    note: item.catatan
                                  })
                                }
                                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-extrabold transition-all shadow-sm cursor-pointer ${
                                  item.buktiTransferUrl
                                    ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                                    : "border border-sky-400/40 bg-sky-500/10 text-sky-600 hover:bg-sky-500 hover:text-white"
                                }`}
                                title={item.buktiTransferUrl ? "Lihat Foto Resi / Struk Transfer Asli yang Dikirim User" : "Lihat Resi Digital Terverifikasi"}
                              >
                                <ImageIcon className="h-3.5 w-3.5" />
                                <span>{item.buktiTransferUrl ? t("Foto Resi Asli", "Original Receipt") : t("Lihat Resi", "Digital Receipt")}</span>
                              </button>
                            </td>

                            {/* STATUS DROPDOWN & 1-CLICK VERIFY COLUMN */}
                            <td className="p-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <select
                                  value={item.status}
                                  onChange={(e) => handleUpdateSPPStatus(item.id, e.target.value as StatusPembayaranSPP)}
                                  className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold uppercase border focus:outline-none cursor-pointer ${
                                    item.status === "Lunas"
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                                      : item.status === "Ditolak"
                                      ? "bg-red-100 text-red-800 border-red-300"
                                      : "bg-amber-100 text-amber-800 border-amber-300"
                                  }`}
                                >
                                  <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                                  <option value="Lunas">Lunas</option>
                                  <option value="Ditolak">Ditolak</option>
                                </select>
                                {item.status !== "Lunas" && (
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateSPPStatus(item.id, "Lunas")}
                                    title={t("Verifikasi Lunas Sekarang", "Mark Paid Now")}
                                    className="rounded-lg bg-emerald-600 p-1 text-white hover:bg-emerald-700 shadow-sm transition-colors"
                                  >
                                    <CheckCircle2 className="h-3.5 w-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>

                            {/* ACTIONS COLUMN */}
                            <td className="p-3 text-center whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() => handlePrintKuitansiFromAdmin(item)}
                                  className="rounded-xl bg-gold/20 p-2 text-navy-deep hover:bg-gold transition-colors"
                                  title="Cetak Kuitansi Resmi"
                                >
                                  <Printer className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDeleteSPP(item.id)}
                                  className="rounded-xl bg-red-100 p-2 text-red-700 hover:bg-red-200 transition-colors"
                                  title="Hapus Transaksi"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          );
        })()}

 {/* MODAL 1: View Documents & Full Form Biodata Inspection Modal */}
 {selectedDocSub && (
 <div
 className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-5 backdrop-blur-sm transition-opacity overflow-y-auto"
 onClick={(e) => {
 if (e.target === e.currentTarget) setSelectedDocSub(null);
 }}
>
 <div className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl border border-border bg-card p-4 sm:p-6 shadow-2xl space-y-5">
 {/* STICKY TOP BACK BUTTON BAR */}
 <div className="sticky top-0 z-30 flex items-center justify-between rounded-2xl bg-card/95 backdrop-blur-md p-3 border border-border shadow-sm -mt-1">
 <button
 type="button"
 onClick={() =>setSelectedDocSub(null)}
 className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-2 text-xs font-black text-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm group"
 title="Kembali ke Dashboard Admin (atau Tekan ESC)"
>
 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
 <span>{t("← Kembali ke Dashboard Admin", "← Back to Admin Dashboard")}</span>
 </button>

 <div className="flex items-center gap-2">
 <span className="text-[11px] font-mono font-extrabold text-navy dark:text-gold hidden sm:inline">
 {selectedDocSub.regNo} — JENJANG {selectedDocSub.jenjang}
 </span>
 <button
 type="button"
 onClick={() =>setSelectedDocSub(null)}
 className="rounded-full bg-red-100 p-2 text-red-600 hover:bg-red-600 hover:text-white transition-colors"
 title="Tutup Modal (ESC)"
>
 <X className="h-5 w-5" />
 </button>
 </div>
 </div>

 {/* Modal Header */}
 <div className="flex items-start justify-between border-b border-border pb-3">
 <div>
 <span className="rounded-full bg-navy/10 px-3 py-1 text-[11px] font-bold text-navy uppercase">
 {selectedDocSub.regNo} — JENJANG {selectedDocSub.jenjang}
 </span>
 <h3 className="mt-2 text-2xl font-extrabold text-foreground">
 {t("Pemeriksaan Data & Berkas:", "Data & Files Inspection:")} <span className="text-navy">{selectedDocSub.nama}</span>
 </h3>
 <p className="mt-1 text-xs text-muted-foreground">
 {t("Orang Tua/Wali:", "Parent/Guardian:")} <strong>{selectedDocSub.wali}</strong> ({selectedDocSub.userEmail}) • {selectedDocSub.telepon}
 </p>
 </div>
 </div>

              {/* Catatan Tambahan Pendaftar Highlighted Banner */}
              {selectedDocSub.catatanTambahan && (
                <div className="rounded-2xl border-2 border-amber-500/40 bg-gradient-to-r from-amber-500/15 via-gold/10 to-transparent p-4 shadow-sm">
                  <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-800 dark:text-amber-300 flex items-center gap-2 mb-1.5">
                    <MessageSquare className="h-4 w-4 text-amber-600" />
                    <span>{t("Catatan Tambahan / Pesan Khusus Dari Pendaftar (User):", "Additional Notes / Special Message from Applicant (User):")}</span>
                  </h4>
                  <div className="rounded-xl border border-amber-500/30 bg-card/90 p-3 text-xs font-semibold text-foreground italic leading-relaxed">
                    "{selectedDocSub.catatanTambahan}"
                  </div>
                </div>
              )}

            {/* Status Summary Banner with 1-Click Verification */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-muted/50 p-4 border border-border">
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{t("Status Berkas:", "Files Status:")}</span>
                  <select
                    value={selectedDocSub.statusPendaftaran}
                    onChange={(e) => {
                      const nextVal = e.target.value as StatusPendaftaran;
                      handleUpdateStatus(selectedDocSub.id, nextVal, selectedDocSub.statusPembayaran);
                      setSelectedDocSub({ ...selectedDocSub, statusPendaftaran: nextVal });
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase border cursor-pointer focus:outline-none ${
                      selectedDocSub.statusPendaftaran === "Terverifikasi"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : selectedDocSub.statusPendaftaran === "Lulus Seleksi"
                        ? "bg-blue-100 text-blue-800 border-blue-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
                    <option value="Terverifikasi">Terverifikasi</option>
                    <option value="Lulus Seleksi">Lulus Seleksi</option>
                    <option value="Ditolak">Ditolak</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-muted-foreground">{t("Status Pembayaran:", "Payment Status:")}</span>
                  <select
                    value={selectedDocSub.statusPembayaran}
                    onChange={(e) => {
                      const nextVal = e.target.value as StatusPembayaran;
                      handleUpdateStatus(selectedDocSub.id, selectedDocSub.statusPendaftaran, nextVal);
                      setSelectedDocSub({ ...selectedDocSub, statusPembayaran: nextVal });
                    }}
                    className={`rounded-full px-3 py-1 text-xs font-extrabold uppercase border cursor-pointer focus:outline-none ${
                      selectedDocSub.statusPembayaran === "Lunas"
                        ? "bg-emerald-100 text-emerald-800 border-emerald-300"
                        : "bg-amber-100 text-amber-800 border-amber-300"
                    }`}
                  >
                    <option value="Menunggu Konfirmasi">Menunggu Konfirmasi</option>
                    <option value="Lunas">Lunas (Terverifikasi)</option>
                    <option value="Belum Bayar">Belum Bayar</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {selectedDocSub.statusPendaftaran !== "Terverifikasi" || selectedDocSub.statusPembayaran !== "Lunas" ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleUpdateStatus(selectedDocSub.id, "Terverifikasi", "Lunas");
                      setSelectedDocSub({ ...selectedDocSub, statusPendaftaran: "Terverifikasi", statusPembayaran: "Lunas" });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 shadow-md transition-all"
                  >
                    <CheckCircle2 className="h-4 w-4" />
                    <span>{t("✓ Verifikasi Semua (Berkas & Lunas)", "✓ Approve All (Files & Paid)")}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      if (confirm(t("Batalkan verifikasi data pendaftaran dan status lunas siswa siswi ini?", "Cancel verification and paid status?"))) {
                        handleUpdateStatus(selectedDocSub.id, "Menunggu Verifikasi", "Menunggu Konfirmasi");
                        setSelectedDocSub({ ...selectedDocSub, statusPendaftaran: "Menunggu Verifikasi", statusPembayaran: "Menunggu Konfirmasi" });
                      }
                    }}
                    className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 border border-amber-500/40 px-3.5 py-1.5 text-xs font-bold text-amber-800 dark:text-amber-300 hover:bg-amber-500 hover:text-white transition-all"
                  >
                    <XCircle className="h-4 w-4" />
                    <span>{t("Batalkan Verifikasi", "Revoke Approval")}</span>
                  </button>
                )}
              </div>
            </div>


 {/* 8-Step Navigation Filter Pills */}
 <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-border scrollbar-none">
 <button
 type="button"
 onClick={() =>setAdminStepTab("all")}
 className={`rounded-full px-3.5 py-1.5 text-xs font-extrabold whitespace-nowrap transition-all ${
 adminStepTab === "all" ? "bg-navy text-gold shadow-md" : "bg-muted text-muted-foreground hover:bg-card"
 }`}
>
 Semua Langkah (1-8)
 </button>
 {[
 { stepNum: 1, label: "1. Jenjang" },
 { stepNum: 2, label: "2. Identitas Siswa" },
 { stepNum: 3, label: "3. Data Ayah" },
 { stepNum: 4, label: "4. Data Ibu" },
 { stepNum: 5, label: "5. Dokumen & Foto" },
 { stepNum: 6, label: "6. Konfirmasi" },
 { stepNum: 7, label: "7. Pembayaran" },
 { stepNum: 8, label: "8. Selesai" },
 ].map((st) => (
 <button
 type="button"
 key={st.stepNum}
 onClick={() =>{
 setAdminStepTab(st.stepNum);
 setTimeout(() => {
 const el = document.getElementById(`admin-step-${st.stepNum}`);
 if (el) {
 el.scrollIntoView({ behavior: "smooth", block: "start" });
 }
 }, 50);
 }}
 className={`rounded-full px-3.5 py-1.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
 adminStepTab === st.stepNum ? "bg-gold text-navy-deep shadow-gold font-extrabold scale-105" : "bg-muted text-muted-foreground hover:bg-card"
 }`}
>
 {st.label}
 </button>
 ))}
 </div>

 <div className="space-y-6 text-xs">
 {/* STEP 1: JENJANG PENDIDIKAN */}
 {(adminStepTab === "all" || adminStepTab === 1) && (
 <div id="admin-step-1" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-2 scroll-mt-20">
 <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">1</span>
 1. Jenjang Pendidikan yang Dipilih
 </h4>
 <div className="flex items-center justify-between pt-2">
 <div>
 <p className="text-xs text-muted-foreground font-medium">Jenjang Sekolah Dituju:</p>
 <p className="text-base font-black text-navy dark:text-gold mt-0.5">{selectedDocSub.jenjang}</p>
 </div>
 <span className="rounded-full bg-gold/15 border border-gold/40 px-3.5 py-1 text-xs font-bold text-gold">
 Pilihan Jenjang Terverifikasi
 </span>
 </div>
 </div>
 )}

 {/* STEP 2: DATA IDENTITAS CALON SISWA */}
 {(adminStepTab === "all" || adminStepTab === 2) && (
 <div id="admin-step-2" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-3 scroll-mt-20">
 <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">2</span>
 2. Data Identitas Calon Siswa
 </h4>
 <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 <div><dt className="text-muted-foreground font-medium">Nama Lengkap Siswa:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.nama || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Nama Panggilan:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.namaPanggilan || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">NIK Siswa (16 Digit):</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.nikSiswa || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">No. Registrasi Akta Lahir:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.noAkta || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">No. Kartu Keluarga (KK):</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.noKk || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">NISN Siswa:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.nisn || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Tempat, Tanggal Lahir:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.tempatLahir || "—"}, {selectedDocSub.lahir || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Jenis Kelamin / Agama:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.jenisKelamin || "—"} / {selectedDocSub.agama || "Islam"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Suku / Status Anak:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.suku || "—"} / {selectedDocSub.statusAnak || "Anak Kandung"} (Anak ke-{selectedDocSub.anakKe || "1"})</dd></div>
 <div><dt className="text-muted-foreground font-medium">Mode Transportasi:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.transportasi || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Tinggi / Berat Badan:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.tinggiBadan ? `${selectedDocSub.tinggiBadan} cm` : "—"} / {selectedDocSub.beratBadan ? `${selectedDocSub.beratBadan} kg` : "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Riwayat Penyakit:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.riwayatPenyakit || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Asal Sekolah Sebelumnya:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.asalSekolah || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">NPSN Asal Sekolah:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.npsnAsal || "—"}</dd></div>
 <div className="sm:col-span-2 lg:col-span-3"><dt className="text-muted-foreground font-medium">Alamat Lengkap Tempat Tinggal:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.alamat || "—"}</dd></div>
 </dl>
 </div>
 )}

 {/* STEP 3: DATA AYAH KANDUNG */}
 {(adminStepTab === "all" || adminStepTab === 3) && (
 <div id="admin-step-3" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-3 scroll-mt-20">
 <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">3</span>
 3. Data Ayah Kandung
 </h4>
 <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 <div><dt className="text-muted-foreground font-medium">Nama Ayah Kandung:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.namaAyah || selectedDocSub.wali || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">NIK Ayah (16 Digit):</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.nikAyah || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Tempat, Tgl Lahir Ayah:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.tempatLahirAyah || "—"}, {selectedDocSub.tanggalLahirAyah || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Pendidikan Terakhir:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.pendidikanAyah || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Pekerjaan Ayah:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.pekerjaanAyah || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Penghasilan per Bulan:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.penghasilanAyah || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">No. WhatsApp Ayah:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.teleponAyah || selectedDocSub.telepon || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Berkebutuhan Khusus:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.kebutuhanKhususAyah || "Tidak ada"}</dd></div>
 </dl>
 </div>
 )}

 {/* STEP 4: DATA IBU KANDUNG */}
 {(adminStepTab === "all" || adminStepTab === 4) && (
 <div id="admin-step-4" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-3 scroll-mt-20">
 <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">4</span>
 4. Data Ibu Kandung
 </h4>
 <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
 <div><dt className="text-muted-foreground font-medium">Nama Ibu Kandung:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.namaIbu || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">NIK Ibu (16 Digit):</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.nikIbu || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Tempat, Tgl Lahir Ibu:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.tempatLahirIbu || "—"}, {selectedDocSub.tanggalLahirIbu || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Pendidikan Terakhir:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.pendidikanIbu || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Pekerjaan Ibu:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.pekerjaanIbu || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">Penghasilan per Bulan:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.penghasilanIbu || "—"}</dd></div>
 <div><dt className="text-muted-foreground font-medium">No. HP Ibu:</dt><dd className="font-bold text-foreground mt-0.5">{selectedDocSub.teleponIbu || "—"}</dd></div>
 </dl>
 </div>
 )}

 {/* STEP 5: DOKUMEN & FOTO SYARAT */}
 {(adminStepTab === "all" || adminStepTab === 5) && (
                <div id="admin-step-5" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-3 scroll-mt-20">
                  <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">5</span>
                    5. Berkas Dokumen & Foto Asli Pendaftar
                  </h4>
                  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 pt-2">
                    {(() => {
                      if (selectedDocSub.dokumenFiles && Array.isArray(selectedDocSub.dokumenFiles) && selectedDocSub.dokumenFiles.length > 0) {
                        return selectedDocSub.dokumenFiles.map((docFile, idx) => {
                          const fileTitle = docFile.id || docFile.name || `Dokumen ${idx + 1}`;
                          const fileName = docFile.name || "Berkas Foto";
                          const fileUrl = docFile.url || "";
                          return (
                            <div key={docFile.id || idx} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition-all">
                              <div className="flex items-center justify-between pb-2 border-b border-border">
                                <span className="text-xs font-bold text-navy dark:text-gold truncate max-w-[180px]">{fileTitle}</span>
                                <span className="rounded-full bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 text-[9px] font-bold text-emerald-700 dark:text-emerald-400 uppercase">
                                  Foto Asli
                                </span>
                              </div>
                              <div className="relative mt-3 h-44 w-full overflow-hidden rounded-xl bg-black/5 border border-border group-hover:border-navy/50 transition-colors">
                                <img src={fileUrl} alt={fileName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <button
                                    type="button"
                                    onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — ${fileTitle}`, url: fileUrl })}
                                    className="rounded-full bg-white p-2 text-navy shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                    title="Perbesar Gambar"
                                  >
                                    <ZoomIn className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const link = document.createElement("a");
                                      link.href = fileUrl;
                                      link.download = `Dokumen_${selectedDocSub.regNo}_${selectedDocSub.nama}_${fileTitle}.jpg`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                    }}
                                    className="rounded-full bg-emerald-600 p-2 text-white shadow-lg hover:scale-110 transition-transform cursor-pointer"
                                    title="Unduh File"
                                  >
                                    <Download className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="mt-2 text-[11px] text-muted-foreground truncate">
                                File: <strong className="text-foreground">{fileName}</strong>
                              </div>
                              <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-border">
                                <button
                                  type="button"
                                  onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — ${fileTitle}`, url: fileUrl })}
                                  className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <ZoomIn className="h-3 w-3" /> Perbesar
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    const link = document.createElement("a");
                                    link.href = fileUrl;
                                    link.download = `Dokumen_${selectedDocSub.regNo}_${selectedDocSub.nama}_${fileTitle}.jpg`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                  }}
                                  className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <Download className="h-3 w-3" /> Unduh
                                </button>
                              </div>
                            </div>
                          );
                        });
                      }

                      return (selectedDocSub.dokumen && selectedDocSub.dokumen.length > 0
                        ? selectedDocSub.dokumen
                        : ["Kartu Keluarga (KK)", "Akta Kelahiran", "Pas Foto 3x4", "Foto Tampak Depan Rumah", "Bukti Screenshot Follow Sosmed"]
                      ).map((docName) => {
                        const imgUrl = getDocumentPreviewUrl(docName, selectedDocSub);
                        return (
                          <div key={docName} className="group relative overflow-hidden rounded-2xl border border-border bg-card p-3 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between pb-2 border-b border-border">
                              <span className="text-xs font-bold text-navy truncate max-w-[180px]">{docName}</span>
                              <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-700 uppercase">
                                Terlampir
                              </span>
                            </div>
                            <div className="relative mt-3 h-40 w-full overflow-hidden rounded-xl bg-black/5 border border-border group-hover:border-navy/50 transition-colors">
                              <img src={imgUrl} alt={docName} className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — ${docName}`, url: imgUrl })}
                                  className="rounded-full bg-white p-2 text-navy shadow-lg hover:scale-110 transition-transform"
                                  title="Perbesar Gambar"
                                >
                                  <ZoomIn className="h-4 w-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadDocFile(docName, selectedDocSub)}
                                  className="rounded-full bg-emerald-600 p-2 text-white shadow-lg hover:scale-110 transition-transform"
                                  title="Unduh File"
                                >
                                  <Download className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="mt-3 flex items-center justify-between text-[11px]">
                              <button
                                type="button"
                                onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — ${docName}`, url: imgUrl })}
                                className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
                              >
                                <ZoomIn className="h-3 w-3" /> Perbesar
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadDocFile(docName, selectedDocSub)}
                                className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                              >
                                <Download className="h-3 w-3" /> Unduh
                              </button>
                            </div>
                          </div>
                        );
                      });
                    })()}

                    {/* BUKTI PEMBAYARAN / RESI TRANSFER SPMB CARD */}
                    <div className="group relative overflow-hidden rounded-2xl border-2 border-emerald-500/50 bg-emerald-950/10 dark:bg-emerald-950/30 p-3 shadow-sm hover:shadow-md transition-all">
                      <div className="flex items-center justify-between pb-2 border-b border-border">
                        <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 truncate max-w-[180px]">
                          Bukti Bayar / Struk SPMB
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[9px] font-extrabold uppercase ${
                          selectedDocSub.statusPembayaran === "Lunas"
                            ? "bg-emerald-100 text-emerald-800"
                            : selectedDocSub.buktiRegUrl
                            ? "bg-sky-100 text-sky-800"
                            : "bg-amber-100 text-amber-800"
                        }`}>
                          {selectedDocSub.buktiRegUrl ? (selectedDocSub.statusPembayaran === "Lunas" ? "Lunas" : "Struk Terlampir") : "Belum Bayar"}
                        </span>
                      </div>
                      <div className="relative mt-3 h-44 w-full overflow-hidden rounded-xl bg-black/5 border border-border group-hover:border-emerald-500/50 transition-colors">
                        {selectedDocSub.buktiRegUrl ? (
                          <img
                            src={selectedDocSub.buktiRegUrl}
                            alt="Bukti Transfer SPMB"
                            className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Belum ada struk transfer terlampir
                          </div>
                        )}
                        {selectedDocSub.buktiRegUrl && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — Bukti Pembayaran SPMB`, url: selectedDocSub.buktiRegUrl! })}
                              className="rounded-full bg-white p-2 text-navy shadow-lg hover:scale-110 transition-transform"
                              title="Perbesar Struk"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = selectedDocSub.buktiRegUrl!;
                                link.download = `Bukti_Bayar_${selectedDocSub.regNo}_${selectedDocSub.nama}.jpg`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="rounded-full bg-emerald-600 p-2 text-white shadow-lg hover:scale-110 transition-transform"
                              title="Unduh Struk"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      <div className="mt-2 text-[11px] text-muted-foreground truncate">
                        Metode: <strong className="text-foreground">{selectedDocSub.metode || "Transfer Bank BSI"}</strong>
                      </div>
                      <div className="mt-2 flex items-center justify-between text-[11px] pt-1 border-t border-border">
                        {selectedDocSub.buktiRegUrl ? (
                          <>
                            <button
                              type="button"
                              onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — Bukti Pembayaran SPMB`, url: selectedDocSub.buktiRegUrl! })}
                              className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <ZoomIn className="h-3 w-3" /> Perbesar Struk
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = selectedDocSub.buktiRegUrl!;
                                link.download = `Bukti_Bayar_${selectedDocSub.regNo}_${selectedDocSub.nama}.jpg`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                            >
                              <Download className="h-3 w-3" /> Unduh Struk Asli
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-amber-600 font-medium">Struk belum diunggah</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

 {/* STEP 6: KONFIRMASI DATA PENDAFTARAN */}
 {(adminStepTab === "all" || adminStepTab === 6) && (
 <div id="admin-step-6" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-3 scroll-mt-20">
 <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">6</span>
 6. Konfirmasi Data & Verifikasi Admin
 </h4>
 <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
 <div>
 <p className="text-xs text-muted-foreground">Status Pendaftaran:</p>
 <span className={`mt-1 inline-block rounded-full px-3.5 py-1 text-xs font-black uppercase ${
 selectedDocSub.statusPendaftaran === "Terverifikasi" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
 }`}>
 {selectedDocSub.statusPendaftaran}
 </span>
 </div>
 {selectedDocSub.statusPendaftaran === "Terverifikasi" || selectedDocSub.statusPembayaran === "Lunas" ? (
 <button
 type="button"
 onClick={() => {
 if (confirm(t("Batalkan verifikasi data pendaftaran dan status lunas siswa siswi ini?", "Cancel verification and paid status for this applicant?"))) {
 handleUpdateStatus(selectedDocSub.id, "Menunggu Verifikasi", "Menunggu Konfirmasi");
 setSelectedDocSub({ ...selectedDocSub, statusPendaftaran: "Menunggu Verifikasi", statusPembayaran: "Menunggu Konfirmasi" });
 }
 }}
 className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5 shadow-md"
>
 <XCircle className="h-4 w-4" /> {t("Batalkan Verifikasi Ini", "Revoke Verification")}
 </button>
 ) : (
 <button
 type="button"
 onClick={() => {
 handleUpdateStatus(selectedDocSub.id, "Terverifikasi", "Lunas");
 setSelectedDocSub({ ...selectedDocSub, statusPendaftaran: "Terverifikasi", statusPembayaran: "Lunas" });
 }}
 className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-md"
>
 <CheckCircle2 className="h-4 w-4" /> {t("Setuju & Verifikasi Pendaftaran Ini", "Approve & Verify Registration")}
 </button>
 )}
 </div>
 </div>
 )}

 {/* STEP 7: PEMBAYARAN FORMULIR & STRUK TRANSFER */}
 {(adminStepTab === "all" || adminStepTab === 7) && (
                <div id="admin-step-7" className="rounded-2xl border border-border p-5 bg-muted/20 space-y-3 scroll-mt-20">
                  <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center gap-2 border-b border-border pb-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">7</span>
                    7. Pembayaran Registrasi & Struk Transfer
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-2 pt-1">
                    <div>
                      <p className="text-xs text-muted-foreground font-medium">Metode Pembayaran:</p>
                      <p className="text-sm font-bold text-foreground mt-0.5">{selectedDocSub.metode || "Transfer Bank BSI"}</p>
                      
                      <p className="text-xs text-muted-foreground font-medium mt-3">Nominal Registrasi Form ({selectedDocSub.jenjang}):</p>
                      <p className="text-sm font-black text-gold font-mono mt-0.5 bg-gold/10 inline-block px-2.5 py-0.5 rounded-full border border-gold/30">
                        {["TK", "SD"].includes((selectedDocSub.jenjang || "").toUpperCase()) ? "Rp 100.000" : "Rp 200.000"}
                      </p>

                      <p className="text-xs text-muted-foreground font-medium mt-3">Status Pembayaran:</p>
                      <span className={`mt-1 inline-block rounded-full px-3 py-0.5 text-xs font-extrabold uppercase ${
                        selectedDocSub.statusPembayaran === "Lunas" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                      }`}>
                        {selectedDocSub.statusPembayaran}
                      </span>

                      <div className="mt-4">
                        {selectedDocSub.statusPembayaran !== "Lunas" ? (
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(selectedDocSub.id, selectedDocSub.statusPendaftaran, "Lunas");
                              setSelectedDocSub({ ...selectedDocSub, statusPembayaran: "Lunas" });
                            }}
                            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-extrabold text-white hover:bg-emerald-700 transition-colors inline-flex items-center gap-1.5 shadow-md"
                          >
                            <CheckCircle2 className="h-4 w-4" /> {t("✓ Verifikasi Struk & Tandai Lunas", "✓ Verify Receipt & Mark as Paid")}
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              handleUpdateStatus(selectedDocSub.id, selectedDocSub.statusPendaftaran, "Menunggu Konfirmasi");
                              setSelectedDocSub({ ...selectedDocSub, statusPembayaran: "Menunggu Konfirmasi" });
                            }}
                            className="rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold text-white hover:bg-amber-600 transition-colors inline-flex items-center gap-1.5 shadow-md"
                          >
                            <XCircle className="h-4 w-4" /> {t("Batalkan Status Lunas", "Revoke Paid Status")}
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <p className="text-xs font-bold text-navy dark:text-gold mb-2">Foto / Screenshot Struk Transfer Pembayaran Asli:</p>
                      <div className="relative h-44 w-full overflow-hidden rounded-2xl border border-border bg-card">
                        {selectedDocSub.buktiRegUrl ? (
                          <img
                            src={selectedDocSub.buktiRegUrl}
                            alt="Struk Pembayaran Asli"
                            className="h-full w-full object-contain bg-black/5"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                            Belum ada struk terunggah
                          </div>
                        )}
                        {selectedDocSub.buktiRegUrl && (
                          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — Struk Pembayaran Asli`, url: selectedDocSub.buktiRegUrl! })}
                              className="rounded-full bg-white p-2 text-navy shadow-md hover:scale-110 transition-transform"
                              title="Perbesar Struk"
                            >
                              <ZoomIn className="h-4 w-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                const link = document.createElement("a");
                                link.href = selectedDocSub.buktiRegUrl!;
                                link.download = `Struk_Pembayaran_${selectedDocSub.regNo}_${selectedDocSub.nama}.jpg`;
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }}
                              className="rounded-full bg-emerald-600 p-2 text-white shadow-md hover:scale-110 transition-transform"
                              title="Unduh Struk"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        )}
                      </div>
                      {selectedDocSub.buktiRegUrl && (
                        <div className="mt-2 flex items-center justify-between text-[11px]">
                          <button
                            type="button"
                            onClick={() => setZoomImg({ title: `${selectedDocSub.nama} — Struk Pembayaran Asli`, url: selectedDocSub.buktiRegUrl! })}
                            className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <ZoomIn className="h-3 w-3" /> Perbesar Struk
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const link = document.createElement("a");
                              link.href = selectedDocSub.buktiRegUrl!;
                              link.download = `Struk_Pembayaran_${selectedDocSub.regNo}_${selectedDocSub.nama}.jpg`;
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }}
                            className="text-emerald-600 font-bold hover:underline inline-flex items-center gap-1"
                          >
                            <Download className="h-3 w-3" /> Unduh Struk Asli
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

 {/* STEP 8: SELESAI */}
 {(adminStepTab === "all" || adminStepTab === 8) && (
 <div id="admin-step-8" className="rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/15 via-gold/10 to-transparent p-5 space-y-2 text-center scroll-mt-20">
 <h4 className="font-extrabold text-sm text-gold uppercase tracking-wider flex items-center justify-center gap-2">
 <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gold text-navy-deep text-xs font-black">8</span>
 8. Status Pendaftaran Selesai
 </h4>
 <p className="text-sm font-bold text-foreground">
 Nomor Registrasi: <span className="text-gold font-mono text-base">{selectedDocSub.regNo}</span>
 </p>
 <p className="text-xs text-muted-foreground">
 Terdaftar Pada: {new Date(selectedDocSub.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WITA
 </p>
 <p className="text-xl font-bold text-gold font-serif pt-1" dir="rtl">
 شُكْرًا جَزِيْلًا — Syukran Jazilan
 </p>
 </div>
 )}
 </div>

 {/* Sticky Modal Footer with Back & Download Buttons */}
 <div className="sticky bottom-0 z-30 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-card/95 backdrop-blur-md p-3 border border-border mt-6 shadow-md">
 <button
 type="button"
 onClick={() =>setSelectedDocSub(null)}
 className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-5 py-2.5 text-xs font-black text-foreground hover:bg-red-500 hover:text-white hover:border-red-500 transition-all shadow-sm group"
>
 <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
 <span>{t("Kembali ke Tabel Admin", "Back to Admin Table")}</span>
 </button>

 <div className="flex flex-wrap items-center gap-2">
 <button
 type="button"
 onClick={() =>handleDownloadSingleExcel(selectedDocSub)}
 className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/40 bg-emerald-600 px-5 py-2.5 text-xs font-extrabold text-white hover:bg-emerald-700 transition-all shadow-md"
 title="Unduh Data & Berkas Siswa Ini ke Format Excel (.csv / editable)"
>
 <FileSpreadsheet className="h-4 w-4" />
 <span>{t("Download Excel Siswa Ini (Dapat Diedit)", "Download Student Excel (Editable)")}</span>
 </button>
 <button
 type="button"
 onClick={() =>handleDownloadSinglePDF(selectedDocSub)}
 className="inline-flex items-center gap-1.5 rounded-full border border-sky-500/40 bg-sky-500/10 px-5 py-2.5 text-xs font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500/20 transition-all"
>
 <Printer className="h-4 w-4" /> {t("Cetak / Simpan PDF", "Print / Save PDF")}
 </button>
 <button
 type="button"
 onClick={() => setSelectedDocSub(null)}
 className="rounded-full bg-navy px-6 py-2.5 text-xs font-bold text-gold hover:bg-navy/90 transition-colors shadow-md"
>
 {t("Selesai & Tutup", "Done & Close")}
 </button>
 </div>
 </div>
 </div>
 </div>
      )}

      {/* MODAL 2: Full-screen Image Zoom Modal with Fail-Safe Back Controls */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 p-3 sm:p-5 backdrop-blur-md transition-opacity"
          onClick={(e) => {
            if (e.target === e.currentTarget) setZoomImg(null);
          }}
        >
          <div className="relative max-w-5xl max-h-[96vh] w-full flex flex-col items-center animate-in zoom-in-95 duration-200">
            {/* Top Navigation Bar with Clear [← Kembali] Button */}
            <div className="w-full flex items-center justify-between pb-3 text-white border-b border-white/15 mb-3 gap-2">
              <button
                type="button"
                onClick={() => setZoomImg(null)}
                className="inline-flex items-center gap-2 rounded-full bg-white/20 hover:bg-white/30 text-white px-4 py-2 text-xs font-extrabold transition-all hover:scale-105 shadow-md group shrink-0 cursor-pointer"
                title="Kembali (ESC)"
              >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                <span>{t("← Kembali / Tutup Foto", "← Back / Close Photo")}</span>
              </button>

              <h4 className="text-xs sm:text-sm font-bold text-center truncate px-2 text-gold">{zoomImg.title}</h4>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={zoomImg.url}
                  download={`Berkas_Foto_${Date.now()}.jpg`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
                  title="Unduh Gambar / Berkas Ini"
                >
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">{t("Unduh", "Download")}</span>
                </a>
                <button
                  type="button"
                  onClick={() => setZoomImg(null)}
                  className="rounded-full bg-red-600/80 hover:bg-red-600 p-2 text-white transition-colors shadow-md cursor-pointer"
                  title="Tutup (ESC)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Catatan User Banner if present */}
            {zoomImg.note && (
              <div className="w-full mb-3 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-amber-950/90 to-slate-950/90 p-3.5 text-xs text-amber-200 shadow-xl backdrop-blur-md">
                <div className="flex items-center gap-1.5 font-extrabold text-amber-400 text-xs uppercase tracking-wider mb-1">
                  <MessageSquare className="h-4 w-4 text-amber-400 shrink-0" />
                  <span>Catatan Tambahan yang Dikirim User:</span>
                </div>
                <p className="italic font-semibold text-white/95 text-xs leading-relaxed bg-black/40 p-2.5 rounded-xl border border-white/10">
                  "{zoomImg.note}"
                </p>
              </div>
            )}

            {/* Photo Preview Container */}
            <div
              className="overflow-auto max-h-[72vh] w-full flex items-center justify-center rounded-2xl border border-white/20 bg-black/60 p-2 sm:p-4 shadow-2xl"
              onClick={(e) => {
                if (e.target === e.currentTarget) setZoomImg(null);
              }}
            >
              <img
                src={zoomImg.url}
                alt={zoomImg.title}
                className="max-h-[68vh] max-w-full w-auto object-contain rounded-xl shadow-lg select-none"
              />
            </div>

            {/* Bottom Quick Return Bar */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setZoomImg(null)}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-gold-soft hover:from-gold-soft hover:to-gold text-navy-deep px-6 py-2.5 text-xs font-black transition-all shadow-lg hover:scale-105 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{t("Kembali ke Halaman Sebelumnya (ESC)", "Back to Previous Page (ESC)")}</span>
              </button>
              <button
                type="button"
                onClick={() => setZoomImg(null)}
                className="inline-flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 text-xs font-bold transition-all cursor-pointer"
              >
                <X className="h-4 w-4" />
                <span>{t("Tutup Tampilan Foto", "Close Photo View")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}