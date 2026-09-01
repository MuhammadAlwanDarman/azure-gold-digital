import type { Session } from "@supabase/supabase-js";
import { supabase, signDocUrls } from "@/lib/supabase";

// =================================================================
// DATA LAYER — sekarang di atas Supabase (Postgres + Auth + Storage).
// Semua fungsi async (return Promise). Nama export dipertahankan supaya
// pemanggil (routes/masuk, ppdb, spp, index, Navbar) tidak berubah kontrak.
// =================================================================

export type UserRole = "orangtua" | "admin";

export interface UserBillItem {
  id: string;
  namaItem: string;
  nominal: number;
  jatuhTempo?: string;
  kategori?: string;
  status?: "Belum Lunas" | "Lunas";
}

export interface UserBillingInfo {
  isActive: boolean;
  penagihName: string;
  penagihKontak?: string;
  teleponOrangTua?: string;
  pesanPenagih: string;
  tanggalTagihan?: string;
  items: UserBillItem[];
  rekeningTujuan?: string;
  isValidated?: boolean;
  validatedAt?: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  billing?: UserBillingInfo;
}

export interface JadwalTes {
  tanggal: string;
  waktu: string;
  ruang: string;
  lokasi: string;
}

export type StatusPendaftaran = "Draft" | "Menunggu Verifikasi" | "Terverifikasi" | "Lulus Seleksi" | "Ditolak";
export type StatusPembayaran = "Belum Bayar" | "Menunggu Konfirmasi" | "Lunas";

export interface UploadedDocFile {
  id: string;
  name: string;
  size?: string;
  url: string;
  /** key/path objek di Supabase Storage (untuk regenerate signed URL). */
  path?: string;
  /** dipakai sementara di form sebelum di-upload. */
  file?: File;
}

export interface PPDBSubmission {
  id: string;
  regNo: string;
  userId: string;
  userEmail: string;
  jenjang: string;

  nama: string;
  namaPanggilan?: string;
  nikSiswa?: string;
  noAkta?: string;
  noKk?: string;
  nisn: string;
  tempatLahir?: string;
  lahir: string;
  jenisKelamin?: string;
  agama?: string;
  suku?: string;
  statusAnak?: string;
  anakKe?: string;
  transportasi?: string;
  tinggiBadan?: string;
  beratBadan?: string;
  riwayatPenyakit?: string;
  asalSekolah?: string;
  npsnAsal?: string;
  alamat: string;

  namaAyah?: string;
  nikAyah?: string;
  tempatLahirAyah?: string;
  tanggalLahirAyah?: string;
  pendidikanAyah?: string;
  pekerjaanAyah?: string;
  penghasilanAyah?: string;
  teleponAyah?: string;
  kebutuhanKhususAyah?: string;

  namaIbu?: string;
  nikIbu?: string;
  tempatLahirIbu?: string;
  tanggalLahirIbu?: string;
  pendidikanIbu?: string;
  pekerjaanIbu?: string;
  penghasilanIbu?: string;
  teleponIbu?: string;

  wali: string;
  telepon: string;
  email: string;

  dokumen: string[];
  dokumenFiles?: UploadedDocFile[];
  metode: string;
  buktiRegUrl?: string;
  catatanTambahan?: string;
  statusPendaftaran: StatusPendaftaran;
  statusPembayaran: StatusPembayaran;
  jadwalTes?: JadwalTes;
  createdAt: string;
  updatedAt: string;
}

export interface UserSession {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
  token: string;
}

export type StatusPembayaranSPP = "Menunggu Verifikasi" | "Lunas" | "Ditolak";

export type KategoriPembayaran =
  | "SPP Bulanan"
  | "Uang Pangkal / Gedung"
  | "Seragam & Atribut"
  | "Buku Paket & Kitab"
  | "Katering Siswa Siswi"
  | "Katering Santri"
  | "Antar Jemput"
  | "Infaq & Wakaf"
  | "Infaq & Donasi"
  | "Kegiatan & Eskul"
  | "Lain-lain";

export interface SPPPayment {
  id: string;
  idTransaksi: string;
  nis: string;
  namaSiswa: string;
  jenjang: string;
  kategoriPembayaran?: KategoriPembayaran | string;
  bulanTagihan: string[];
  jumlahNominal: number;
  metodePembayaran: string;
  namaPengirim: string;
  buktiTransferUrl?: string | undefined;
  catatan?: string | undefined;
  status: StatusPembayaranSPP;
  userId?: string | undefined;
  userEmail?: string | undefined;
  deletedAt?: string | undefined;
  infaqNominal?: number | undefined;
  createdAt: string;
  updatedAt: string;
}

// =================================================================
// EVENT BUS — refresh instan di dalam tab setelah tiap tulis.
// (Realtime lintas-tab/device ditangani supabase channel di subscribeToDB.)
// =================================================================

const DB_CHANGE_EVENT = "pkbm_db_changed";

function notifyChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(DB_CHANGE_EVENT));
  }
}

export function subscribeToDB(callback: () => void): () => void {
  if (typeof window === "undefined") return () => {};

  window.addEventListener(DB_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);

  const { data: authSub } = supabase.auth.onAuthStateChange(() => callback());

  const channel = supabase
    .channel(`zbt-db-${Math.random().toString(36).slice(2)}`)
    .on("postgres_changes", { event: "*", schema: "public", table: "ppdb_submissions" }, () => callback())
    .on("postgres_changes", { event: "*", schema: "public", table: "spp_payments" }, () => callback())
    .on("postgres_changes", { event: "*", schema: "public", table: "user_billings" }, () => callback())
    .subscribe();

  return () => {
    window.removeEventListener(DB_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
    try {
      authSub.subscription.unsubscribe();
    } catch {
      /* ignore */
    }
    try {
      supabase.removeChannel(channel);
    } catch {
      /* ignore */
    }
  };
}

/** Legacy: bersihkan sisa data localStorage lama sekali. */
export function tryEmergencyStorageCleanup(): void {
  if (typeof window === "undefined") return;
  try {
    ["pkbm_db_users_v1", "pkbm_db_ppdb_v1", "pkbm_db_spp_v2", "pkbm_db_session_v1"].forEach((k) =>
      localStorage.removeItem(k)
    );
  } catch {
    /* ignore */
  }
}

// =================================================================
// SESSION CACHE — getCurrentSession() tetap sinkron; cache di-refresh
// oleh onAuthStateChange + getSession() awal.
// =================================================================

let cachedSession: UserSession | null = null;

function mapSession(s: Session, parts: { name: string; role: UserRole }): UserSession {
  return {
    userId: s.user.id,
    name: parts.name,
    email: s.user.email ?? "",
    role: parts.role,
    token: s.access_token,
  };
}

function metaName(s: Session): string {
  const m = s.user.user_metadata as Record<string, unknown>;
  const n = m?.["name"];
  return typeof n === "string" && n.trim() ? n : s.user.email ?? "Pengguna";
}

/** Normalisasi nilai role apa pun jadi "admin" | "orangtua" (tahan spasi/kapital/enum). */
function normalizeRole(raw: unknown): UserRole {
  return String(raw ?? "").trim().toLowerCase() === "admin" ? "admin" : "orangtua";
}

/** Role dari JWT: cek user_metadata DAN app_metadata (tergantung cara akun dibuat). */
function metaRole(s: Session): UserRole {
  const um = (s.user.user_metadata ?? {}) as Record<string, unknown>;
  const am = (s.user.app_metadata ?? {}) as Record<string, unknown>;
  if (normalizeRole(um["role"]) === "admin") return "admin";
  if (normalizeRole(am["role"]) === "admin") return "admin";
  return "orangtua";
}

/**
 * Sumber OTORITATIF untuk role & nama: tabel `profiles`.
 * Return null kalau baris tidak ada / RLS memblokir SELECT — dengan log yang jelas
 * supaya penyebabnya kelihatan (bukan diam-diam jadi 'orangtua').
 */
async function fetchProfile(userId: string): Promise<{ name: string; role: UserRole } | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("name, role")
      .eq("id", userId)
      .maybeSingle();

    console.log("[db] fetchProfile", { userId, data, error: error?.message ?? null });

    if (error) {
      console.error(
        "[db] Gagal membaca tabel `profiles` (kemungkinan belum ada RLS policy SELECT untuk `authenticated`):",
        error.message,
        "→ create policy \"profiles self read\" on public.profiles for select to authenticated using (auth.uid() = id);"
      );
      return null;
    }
    if (!data) {
      console.warn(
        `[db] Baris \`profiles\` untuk user ${userId} tidak terbaca (0 baris). ` +
          "Pastikan baris profiles ada DAN ada policy SELECT: " +
          'create policy "profiles self read" on public.profiles for select to authenticated using (auth.uid() = id);'
      );
      return null;
    }
    const role = normalizeRole((data as Record<string, unknown>)["role"]);
    console.log("[db] fetchProfile OK →", { rawRole: (data as Record<string, unknown>)["role"], role });
    return {
      name: ((data as Record<string, unknown>)["name"] as string) || "",
      role,
    };
  } catch (e) {
    console.error("[db] Exception saat membaca `profiles`:", e);
    return null;
  }
}

/**
 * Refresh cache sesi dari state auth. SATU kali tulis + notify, SETELAH role
 * otoritatif diketahui — tidak pernah menulis sesi "provisional" yang bisa
 * menurunkan role admin ke orangtua di tengah proses.
 */
async function hydrateFromSupabase(supaSession: Session | null): Promise<void> {
  if (!supaSession || !supaSession.user) {
    cachedSession = null;
    notifyChange();
    return;
  }

  const uid = supaSession.user.id;
  const prof = await fetchProfile(uid);

  // Untuk user yang sama, jangan pernah menurunkan role/nama yang sudah diketahui
  // benar hanya karena fetch profiles gagal sesaat.
  const prev = cachedSession && cachedSession.userId === uid ? cachedSession : null;
  const role: UserRole = prof?.role ?? prev?.role ?? metaRole(supaSession);
  const name = prof?.name || prev?.name || metaName(supaSession);

  cachedSession = mapSession(supaSession, { name, role });
  console.log("[db] hydrateFromSupabase → cachedSession.role =", role, {
    fromProfiles: prof?.role ?? null,
    fromPrev: prev?.role ?? null,
    fromMeta: metaRole(supaSession),
  });
  notifyChange();
}

if (typeof window !== "undefined") {
  supabase.auth.getSession().then(({ data }) => hydrateFromSupabase(data.session));
  supabase.auth.onAuthStateChange((_event, session) => {
    hydrateFromSupabase(session);
  });
}

export function getCurrentSession(): UserSession | null {
  return cachedSession;
}

// =================================================================
// HELPERS
// =================================================================

function translateAuthError(msg: string): string {
  const m = (msg || "").toLowerCase();
  if (m.includes("invalid login credentials")) return "Email atau kata sandi salah.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "Email sudah terdaftar. Silakan masuk atau gunakan email lain.";
  if (m.includes("email not confirmed"))
    return "Email belum dikonfirmasi. Nonaktifkan 'Confirm email' di Supabase Auth atau cek email Anda.";
  if (m.includes("password should be at least")) return "Kata sandi minimal 6 karakter.";
  if (m.includes("unable to validate email address") || m.includes("invalid email"))
    return "Format email tidak valid.";
  if (m.includes("signups not allowed")) return "Pendaftaran akun sedang dinonaktifkan di server.";
  return msg || "Terjadi kesalahan autentikasi.";
}

function generatePassword(): string {
  const rnd =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `Zbt-${rnd}-${Math.random().toString(36).slice(2, 8)}A1`;
}

function toIntOrNull(v: unknown): number | null {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? Math.trunc(n) : null;
}

function orNull<T>(v: T | undefined | null | ""): T | null {
  return v === undefined || v === null || v === "" ? null : v;
}

function normJenisKelamin(v: unknown): string | null {
  if (typeof v !== "string" || !v.trim()) return null;
  const s = v.trim().toLowerCase();
  if (s.startsWith("l")) return "Laki-laki";
  if (s.startsWith("p")) return "Perempuan";
  return v.trim();
}

// =================================================================
// MAPPERS
// =================================================================

/* eslint-disable @typescript-eslint/no-explicit-any */

function rowToPPDB(r: any, urlMap: Record<string, string>): PPDBSubmission {
  const docsRaw: any[] = Array.isArray(r.ppdb_documents) ? r.ppdb_documents : [];
  const jadwalRaw = Array.isArray(r.ppdb_jadwal_tes) ? r.ppdb_jadwal_tes[0] : r.ppdb_jadwal_tes;

  const dokumenFiles: UploadedDocFile[] = docsRaw
    .filter((d) => d && d.file_url)
    .map((d) => ({
      id: String(d.id ?? d.file_url),
      name: d.file_name ?? d.doc_type ?? "Dokumen",
      size: d.file_size ?? undefined,
      url: urlMap[d.file_url] ?? "",
      path: d.file_url,
    }));

  const dokumen: string[] = docsRaw.map((d) => d.doc_type).filter((x: unknown): x is string => Boolean(x));

  const out: Record<string, unknown> = {
    id: String(r.id),
    regNo: r.reg_no ?? "",
    userId: r.user_id ?? "",
    userEmail: r.email ?? "",
    jenjang: r.jenjang ?? "",

    nama: r.nama_lengkap ?? "",
    namaPanggilan: r.nama_panggilan ?? undefined,
    nikSiswa: r.nik_siswa ?? undefined,
    noAkta: r.no_akta ?? undefined,
    noKk: r.no_kk ?? undefined,
    nisn: r.nisn ?? "",
    tempatLahir: r.tempat_lahir ?? undefined,
    lahir: r.tanggal_lahir ?? "",
    jenisKelamin: r.jenis_kelamin ?? undefined,
    agama: r.agama ?? undefined,
    suku: r.suku ?? undefined,
    statusAnak: r.status_anak ?? undefined,
    anakKe: r.anak_ke !== null && r.anak_ke !== undefined ? String(r.anak_ke) : undefined,
    transportasi: r.transportasi ?? undefined,
    tinggiBadan: r.tinggi_badan !== null && r.tinggi_badan !== undefined ? String(r.tinggi_badan) : undefined,
    beratBadan: r.berat_badan !== null && r.berat_badan !== undefined ? String(r.berat_badan) : undefined,
    riwayatPenyakit: r.riwayat_penyakit ?? undefined,
    asalSekolah: r.asal_sekolah ?? undefined,
    npsnAsal: r.npsn_asal ?? undefined,
    alamat: r.alamat ?? "",

    namaAyah: r.nama_ayah ?? undefined,
    nikAyah: r.nik_ayah ?? undefined,
    tempatLahirAyah: r.tempat_lahir_ayah ?? undefined,
    tanggalLahirAyah: r.tanggal_lahir_ayah ?? undefined,
    pendidikanAyah: r.pendidikan_ayah ?? undefined,
    pekerjaanAyah: r.pekerjaan_ayah ?? undefined,
    penghasilanAyah: r.penghasilan_ayah ?? undefined,
    teleponAyah: r.telepon_ayah ?? undefined,
    kebutuhanKhususAyah: r.kebutuhan_khusus_ayah ?? undefined,

    namaIbu: r.nama_ibu ?? undefined,
    nikIbu: r.nik_ibu ?? undefined,
    tempatLahirIbu: r.tempat_lahir_ibu ?? undefined,
    tanggalLahirIbu: r.tanggal_lahir_ibu ?? undefined,
    pendidikanIbu: r.pendidikan_ibu ?? undefined,
    pekerjaanIbu: r.pekerjaan_ibu ?? undefined,
    penghasilanIbu: r.penghasilan_ibu ?? undefined,
    teleponIbu: r.telepon_ibu ?? undefined,

    wali: r.wali ?? "",
    telepon: r.telepon ?? "",
    email: r.email ?? "",

    dokumen,
    dokumenFiles,
    metode: r.metode_pembayaran ?? "",
    buktiRegUrl: r.bukti_reg_url ? urlMap[r.bukti_reg_url] ?? "" : undefined,
    catatanTambahan: r.catatan_tambahan ?? undefined,
    statusPendaftaran: (r.status_pendaftaran ?? "Menunggu Verifikasi") as StatusPendaftaran,
    statusPembayaran: (r.status_pembayaran ?? "Belum Bayar") as StatusPembayaran,
    jadwalTes: jadwalRaw
      ? {
          tanggal: jadwalRaw.tanggal ?? "",
          waktu: jadwalRaw.waktu ?? "",
          ruang: jadwalRaw.ruang ?? "",
          lokasi: jadwalRaw.lokasi ?? "",
        }
      : undefined,
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? r.created_at ?? "",
  };

  return out as unknown as PPDBSubmission;
}

type PPDBInput = Omit<PPDBSubmission, "id" | "regNo" | "createdAt" | "updatedAt">;

function ppdbToRow(d: PPDBInput, regNo: string): Record<string, unknown> {
  return {
    reg_no: regNo,
    user_id: orNull(d.userId),
    jenjang: d.jenjang,

    nama_lengkap: d.nama,
    nama_panggilan: orNull(d.namaPanggilan),
    nik_siswa: orNull(d.nikSiswa),
    no_akta: orNull(d.noAkta),
    no_kk: orNull(d.noKk),
    nisn: orNull(d.nisn),
    tempat_lahir: orNull(d.tempatLahir),
    tanggal_lahir: orNull(d.lahir),
    jenis_kelamin: normJenisKelamin(d.jenisKelamin),
    agama: d.agama || "Islam",
    suku: orNull(d.suku),
    status_anak: orNull(d.statusAnak),
    anak_ke: toIntOrNull(d.anakKe),
    transportasi: orNull(d.transportasi),
    tinggi_badan: toIntOrNull(d.tinggiBadan),
    berat_badan: toIntOrNull(d.beratBadan),
    riwayat_penyakit: orNull(d.riwayatPenyakit),
    asal_sekolah: orNull(d.asalSekolah),
    npsn_asal: orNull(d.npsnAsal),
    alamat: d.alamat,

    nama_ayah: orNull(d.namaAyah),
    nik_ayah: orNull(d.nikAyah),
    tempat_lahir_ayah: orNull(d.tempatLahirAyah),
    tanggal_lahir_ayah: orNull(d.tanggalLahirAyah),
    pendidikan_ayah: orNull(d.pendidikanAyah),
    pekerjaan_ayah: orNull(d.pekerjaanAyah),
    penghasilan_ayah: orNull(d.penghasilanAyah),
    telepon_ayah: orNull(d.teleponAyah),
    kebutuhan_khusus_ayah: orNull(d.kebutuhanKhususAyah),

    nama_ibu: orNull(d.namaIbu),
    nik_ibu: orNull(d.nikIbu),
    tempat_lahir_ibu: orNull(d.tempatLahirIbu),
    tanggal_lahir_ibu: orNull(d.tanggalLahirIbu),
    pendidikan_ibu: orNull(d.pendidikanIbu),
    pekerjaan_ibu: orNull(d.pekerjaanIbu),
    penghasilan_ibu: orNull(d.penghasilanIbu),
    telepon_ibu: orNull(d.teleponIbu),

    wali: orNull(d.wali),
    telepon: d.telepon,
    email: d.email,

    metode_pembayaran: d.metode || "Transfer Bank BSI",
    bukti_reg_url: orNull(d.buktiRegUrl),
    catatan_tambahan: orNull(d.catatanTambahan),
    status_pendaftaran: d.statusPendaftaran || "Menunggu Verifikasi",
    status_pembayaran: d.statusPembayaran || "Belum Bayar",
  };
}

function rowToSPP(r: any, urlMap: Record<string, string>): SPPPayment {
  let bulan: string[] = [];
  if (Array.isArray(r.bulan_tagihan)) bulan = r.bulan_tagihan.map((x: unknown) => String(x));
  else if (typeof r.bulan_tagihan === "string") {
    try {
      const parsed = JSON.parse(r.bulan_tagihan);
      if (Array.isArray(parsed)) bulan = parsed.map((x) => String(x));
    } catch {
      bulan = r.bulan_tagihan ? [r.bulan_tagihan] : [];
    }
  }

  const out: Record<string, unknown> = {
    id: String(r.id),
    idTransaksi: r.id_transaksi ?? "",
    nis: r.nis ?? "",
    namaSiswa: r.nama_siswa ?? "",
    jenjang: r.jenjang ?? "",
    kategoriPembayaran: r.kategori_pembayaran ?? "SPP Bulanan",
    bulanTagihan: bulan,
    jumlahNominal: Number(r.jumlah_nominal ?? 0),
    metodePembayaran: r.metode_pembayaran ?? "",
    namaPengirim: r.nama_pengirim ?? "",
    buktiTransferUrl: r.bukti_transfer_url ? urlMap[r.bukti_transfer_url] ?? "" : undefined,
    catatan: r.catatan ?? undefined,
    status: (r.status ?? "Menunggu Verifikasi") as StatusPembayaranSPP,
    userId: r.user_id ?? undefined,
    userEmail: r.user_email ?? undefined,
    deletedAt: r.deleted_at ?? undefined,
    infaqNominal:
      r.infaq_nominal !== null && r.infaq_nominal !== undefined ? Number(r.infaq_nominal) : undefined,
    createdAt: r.created_at ?? "",
    updatedAt: r.updated_at ?? r.created_at ?? "",
  };
  return out as unknown as SPPPayment;
}

type SPPInput = Omit<SPPPayment, "id" | "idTransaksi" | "status" | "createdAt" | "updatedAt">;

function sppToRow(d: SPPInput, idTransaksi: string): Record<string, unknown> {
  return {
    id_transaksi: idTransaksi,
    nis: d.nis,
    nama_siswa: d.namaSiswa,
    jenjang: d.jenjang,
    kategori_pembayaran: d.kategoriPembayaran || "SPP Bulanan",
    bulan_tagihan: Array.isArray(d.bulanTagihan) ? d.bulanTagihan : [],
    jumlah_nominal: d.jumlahNominal ?? 0,
    infaq_nominal: d.infaqNominal ?? 0,
    metode_pembayaran: d.metodePembayaran,
    nama_pengirim: d.namaPengirim,
    bukti_transfer_url: orNull(d.buktiTransferUrl),
    catatan: orNull(d.catatan),
    status: "Menunggu Verifikasi",
    user_id: orNull(d.userId),
    user_email: orNull(d.userEmail),
  };
}

function rowToBilling(b: any, items: any[]): UserBillingInfo {
  const out: Record<string, unknown> = {
    isActive: Boolean(b.is_active),
    penagihName: b.penagih_name ?? "",
    penagihKontak: b.penagih_kontak ?? undefined,
    teleponOrangTua: b.telepon_orang_tua ?? undefined,
    pesanPenagih: b.pesan_penagih ?? "",
    tanggalTagihan: b.tanggal_tagihan ?? undefined,
    items: (items ?? []).map((it) => ({
      id: String(it.id),
      namaItem: it.nama_item ?? "",
      nominal: Number(it.nominal ?? 0),
      jatuhTempo: it.jatuh_tempo ?? undefined,
      kategori: it.kategori ?? undefined,
      status: it.status ?? undefined,
    })),
    rekeningTujuan: b.rekening_tujuan ?? undefined,
    isValidated: b.is_validated ?? undefined,
    validatedAt: b.validated_at ?? undefined,
    updatedAt: b.updated_at ?? undefined,
  };
  return out as unknown as UserBillingInfo;
}

// =================================================================
// GUEST CLAIM — sekarang no-op (guest selalu dibuatkan akun auth dulu).
// =================================================================

export async function claimGuestSubmissions(
  _userId: string,
  _userEmail: string,
  _userName?: string
): Promise<void> {
  return;
}

export async function claimGuestSPPPayments(_userId: string, _userEmail: string): Promise<void> {
  return;
}

// =================================================================
// AUTH
// =================================================================

export async function ensureUserAccountForPPDB(
  name: string,
  email: string,
  phone?: string
): Promise<UserSession> {
  const existing = getCurrentSession();
  if (existing) return existing;

  const safeName = (name || "").trim() || "Orang Tua";
  const rawEmail = (email || "").trim().toLowerCase();
  const password = generatePassword();

  const firstEmail = rawEmail || `guest-${Date.now()}@zbt-guest.local`;
  let res = await supabase.auth.signUp({
    email: firstEmail,
    password,
    options: { data: { name: safeName } },
  });

  if (res.error) {
    const retryEmail = `guest-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@zbt-guest.local`;
    res = await supabase.auth.signUp({
      email: retryEmail,
      password,
      options: { data: { name: safeName } },
    });
    if (res.error) throw new Error(translateAuthError(res.error.message));
  }

  const user = res.data.user;
  if (user) {
    const { error: pErr } = await supabase.from("profiles").upsert(
      { id: user.id, name: safeName, role: "orangtua", phone: phone || null, email: user.email ?? null },
      { onConflict: "id" }
    );
    if (pErr) {
      console.error(
        "[db] Gagal upsert `profiles` untuk akun guest (cek RLS INSERT + trigger handle_new_user):",
        pErr.message
      );
    }
  }

  if (!res.data.session) {
    throw new Error(
      "Akun dibuat tetapi sesi belum aktif. Nonaktifkan 'Confirm email' di Supabase Auth lalu coba lagi."
    );
  }

  const session = mapSession(res.data.session, { name: safeName, role: "orangtua" });
  cachedSession = session;
  notifyChange();
  return session;
}

export async function registerUser(
  name: string,
  email: string,
  password: string,
  role: UserRole = "orangtua"
): Promise<{ success: boolean; error?: string; user?: User | undefined; session?: UserSession | undefined }> {
  const safeName = (name || "").trim();
  const normalizedEmail = (email || "").trim().toLowerCase();

  const { data, error } = await supabase.auth.signUp({
    email: normalizedEmail,
    password,
    options: { data: { name: safeName, role } },
  });

  if (error) return { success: false, error: translateAuthError(error.message) };

  const user = data.user;
  if (user) {
    const { error: pErr } = await supabase
      .from("profiles")
      .upsert({ id: user.id, name: safeName, role, email: user.email ?? null }, { onConflict: "id" });
    if (pErr) {
      console.error(
        "[db] Gagal upsert `profiles` saat registrasi (cek RLS INSERT pada profiles + trigger handle_new_user):",
        pErr.message
      );
    }
  }

  let session: UserSession | undefined;
  if (data.session) {
    session = mapSession(data.session, { name: safeName, role });
    cachedSession = session;
    notifyChange();
  }

  const mappedUser: User | undefined = user
    ? {
        id: user.id,
        name: safeName,
        email: user.email ?? normalizedEmail,
        passwordHash: "",
        role,
        createdAt: user.created_at ?? new Date().toISOString(),
      }
    : undefined;

  return { success: true, user: mappedUser, session };
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ success: boolean; error?: string; session?: UserSession }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: (email || "").trim().toLowerCase(),
    password: password || "",
  });

  if (error || !data.session) {
    return { success: false, error: translateAuthError(error?.message ?? "Gagal masuk.") };
  }

  // Ambil role OTORITATIF dari `profiles` DAN tunggu selesai sebelum return,
  // supaya keputusan redirect di UI langsung memakai role yang benar.
  const prof = await fetchProfile(data.session.user.id);
  const role: UserRole = prof?.role ?? metaRole(data.session);
  const name = prof?.name || metaName(data.session);

  const session = mapSession(data.session, { name, role });
  cachedSession = session;
  console.log("[db] loginUser RETURN → role =", role, {
    userId: session.userId,
    email: session.email,
    fromProfiles: prof?.role ?? null,
    fromMeta: metaRole(data.session),
    user_metadata: data.session.user.user_metadata,
    app_metadata: data.session.user.app_metadata,
  });
  notifyChange();
  return { success: true, session };
}

export async function logoutUser(): Promise<void> {
  await supabase.auth.signOut();
  cachedSession = null;
  notifyChange();
}

export async function getAllUsers(): Promise<User[]> {
  const { data, error } = await supabase.from("profiles").select("*");
  if (error) {
    console.error("[db] getAllUsers gagal baca `profiles` (cek RLS SELECT admin / is_admin()):", error.message);
    return [];
  }
  if (!data) return [];
  return data.map((p: any) => ({
    id: String(p.id),
    name: p.name ?? "",
    email: p.email ?? "", // kolom denormalisasi di profiles (diisi trigger handle_new_user)
    passwordHash: "",
    role: normalizeRole(p.role),
    createdAt: p.created_at ?? "",
  }));
}

/**
 * Promote user yang SUDAH terdaftar jadi admin (ubah kolom `profiles.role`).
 * Bisa jalan penuh dari app: RLS policy "profiles admin update" mengizinkan
 * admin yang login meng-UPDATE row profiles siapa pun. Beda dari "buat akun
 * admin dari nol" yang tidak bisa (signUp menggeser sesi admin aktif).
 */
export async function promoteUserToAdmin(
  userId: string
): Promise<{ success: boolean; error?: string }> {
  if (!userId) return { success: false, error: "User tidak valid." };
  const { error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId);
  if (error) {
    console.error("[db] promoteUserToAdmin gagal (cek RLS 'profiles admin update'):", error.message);
    return { success: false, error: error.message };
  }
  notifyChange();
  return { success: true };
}

export async function deleteUserAccount(_userId: string): Promise<boolean> {
  throw new Error(
    "Hapus akun pengguna harus dilakukan lewat dashboard Supabase (Authentication → Users)."
  );
}

export async function resetUserPassword(_userId: string, _newPass: string): Promise<boolean> {
  throw new Error(
    "Reset kata sandi pengguna lain harus dilakukan lewat dashboard Supabase (Authentication → Users)."
  );
}

// =================================================================
// BILLING
// =================================================================

export async function updateUserBilling(userId: string, billing: UserBillingInfo): Promise<boolean> {
  const now = new Date().toISOString();
  const { data: billingRow, error } = await supabase
    .from("user_billings")
    .upsert(
      {
        user_id: userId,
        is_active: billing.isActive,
        penagih_name: billing.penagihName || "Unit Administrasi & Keuangan STPI",
        penagih_kontak: orNull(billing.penagihKontak),
        telepon_orang_tua: orNull(billing.teleponOrangTua),
        pesan_penagih: billing.pesanPenagih || "",
        tanggal_tagihan: orNull(billing.tanggalTagihan),
        rekening_tujuan: orNull(billing.rekeningTujuan),
        is_validated: billing.isValidated ?? false,
        validated_at: orNull(billing.validatedAt),
        updated_at: now,
      },
      { onConflict: "user_id" }
    )
    .select()
    .single();

  if (error || !billingRow) throw new Error(error?.message ?? "Gagal menyimpan tagihan.");

  await supabase.from("user_billing_items").delete().eq("billing_id", billingRow.id);

  const items = billing.items ?? [];
  if (items.length > 0) {
    const { error: itemErr } = await supabase.from("user_billing_items").insert(
      items.map((it) => ({
        billing_id: billingRow.id,
        nama_item: it.namaItem,
        nominal: it.nominal ?? 0,
        jatuh_tempo: orNull(it.jatuhTempo),
        kategori: orNull(it.kategori),
        status: it.status ?? "Belum Lunas",
      }))
    );
    if (itemErr) throw new Error(itemErr.message);
  }

  notifyChange();
  return true;
}

export async function getUserBilling(userId: string): Promise<UserBillingInfo | null> {
  if (!userId) return null;
  const { data: b, error } = await supabase
    .from("user_billings")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error || !b) return null;

  const { data: items } = await supabase.from("user_billing_items").select("*").eq("billing_id", b.id);
  return rowToBilling(b, items ?? []);
}

/** Ambil semua tagihan user sekaligus (dipakai panel admin, hindari await di render). */
export async function getAllUserBillings(): Promise<Record<string, UserBillingInfo>> {
  const { data: billings, error } = await supabase.from("user_billings").select("*");
  if (error || !billings || billings.length === 0) return {};

  const { data: items } = await supabase.from("user_billing_items").select("*");
  const itemsByBilling = new Map<string, any[]>();
  (items ?? []).forEach((it: any) => {
    const arr = itemsByBilling.get(it.billing_id) ?? [];
    arr.push(it);
    itemsByBilling.set(it.billing_id, arr);
  });

  const out: Record<string, UserBillingInfo> = {};
  billings.forEach((b: any) => {
    if (b.user_id) out[String(b.user_id)] = rowToBilling(b, itemsByBilling.get(b.id) ?? []);
  });
  return out;
}

export async function getUserBillingByEmail(email: string): Promise<UserBillingInfo | null> {
  const target = (email || "").trim().toLowerCase();
  if (!target) return null;
  if (cachedSession && cachedSession.email.toLowerCase() === target) {
    return getUserBilling(cachedSession.userId);
  }
  // Anon key tidak bisa resolve email -> user_id lawan auth.users.
  return null;
}

export async function validateOrCancelUserBilling(userId: string): Promise<boolean> {
  const { data: b } = await supabase
    .from("user_billings")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();
  if (!b) return false;

  const now = new Date().toISOString();
  const { error } = await supabase
    .from("user_billings")
    .update({ is_active: false, is_validated: true, validated_at: now, updated_at: now })
    .eq("id", b.id);
  if (error) throw new Error(error.message);

  await supabase.from("user_billing_items").update({ status: "Lunas" }).eq("billing_id", b.id);
  notifyChange();
  return true;
}

// =================================================================
// PPDB
// =================================================================

const PPDB_SELECT = "*, ppdb_documents(*), ppdb_jadwal_tes(*)";

async function signPPDBRows(rows: any[]): Promise<Record<string, string>> {
  const paths: string[] = [];
  rows.forEach((r) => {
    if (r.bukti_reg_url) paths.push(r.bukti_reg_url);
    (Array.isArray(r.ppdb_documents) ? r.ppdb_documents : []).forEach((d: any) => {
      if (d && d.file_url) paths.push(d.file_url);
    });
  });
  return signDocUrls(paths);
}

export async function getPPDBSubmissions(): Promise<PPDBSubmission[]> {
  const { data, error } = await supabase
    .from("ppdb_submissions")
    .select(PPDB_SELECT)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  const urlMap = await signPPDBRows(data);
  return data.map((r) => rowToPPDB(r, urlMap));
}

export async function getPPDBSubmissionsByUser(
  userId: string,
  userEmail: string,
  _userName?: string
): Promise<PPDBSubmission[]> {
  const safeUserId = (userId || "").trim();
  const safeEmail = (userEmail || "").trim().toLowerCase();
  const filters: string[] = [];
  if (safeUserId) filters.push(`user_id.eq.${safeUserId}`);
  if (safeEmail) filters.push(`email.eq.${safeEmail}`);
  if (filters.length === 0) return [];

  const { data, error } = await supabase
    .from("ppdb_submissions")
    .select(PPDB_SELECT)
    .or(filters.join(","))
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  const urlMap = await signPPDBRows(data);
  return data.map((r) => rowToPPDB(r, urlMap));
}

export async function savePPDBSubmission(data: PPDBInput): Promise<PPDBSubmission> {
  const regNo = `ZBT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
  const row = ppdbToRow(data, regNo);

  const { data: inserted, error } = await supabase
    .from("ppdb_submissions")
    .insert(row)
    .select()
    .single();
  if (error || !inserted) throw new Error(error?.message ?? "Gagal menyimpan pendaftaran.");

  const files = data.dokumenFiles ?? [];
  const fileKeys = files.map((f) => f.id).filter((x): x is string => Boolean(x));
  const docRows: Record<string, unknown>[] = files.map((f) => ({
    submission_id: inserted.id,
    doc_type: f.id || f.name,
    file_name: f.name,
    file_size: orNull(f.size),
    file_url: f.path ?? f.url ?? "",
  }));
  (data.dokumen ?? []).forEach((name) => {
    const covered = fileKeys.some(
      (k) => name === k || name.startsWith(`${k} `) || name.startsWith(`${k}-`)
    );
    if (!covered) {
      docRows.push({
        submission_id: inserted.id,
        doc_type: name,
        file_name: name,
        file_size: null,
        file_url: "",
      });
    }
  });

  let insertedDocs: any[] = [];
  if (docRows.length > 0) {
    const { data: dRows, error: docErr } = await supabase
      .from("ppdb_documents")
      .insert(docRows)
      .select();
    if (docErr) console.warn("Gagal menyimpan dokumen PPDB:", docErr.message);
    else insertedDocs = dRows ?? [];
  }

  notifyChange();

  const urlMap = await signDocUrls([
    (row["bukti_reg_url"] as string | null) ?? "",
    ...docRows.map((d) => (d["file_url"] as string) ?? ""),
  ]);
  return rowToPPDB({ ...inserted, ppdb_documents: insertedDocs, ppdb_jadwal_tes: [] }, urlMap);
}

export async function updatePPDBStatus(
  id: string,
  updates: {
    statusPendaftaran?: StatusPendaftaran;
    statusPembayaran?: StatusPembayaran;
    jadwalTes?: JadwalTes;
  }
): Promise<boolean> {
  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.statusPendaftaran) patch["status_pendaftaran"] = updates.statusPendaftaran;
  if (updates.statusPembayaran) patch["status_pembayaran"] = updates.statusPembayaran;

  if (Object.keys(patch).length > 1) {
    const { error } = await supabase.from("ppdb_submissions").update(patch).eq("id", id);
    if (error) throw new Error(error.message);
  }

  if (updates.jadwalTes) {
    const j = updates.jadwalTes;
    const { error: jErr } = await supabase.from("ppdb_jadwal_tes").upsert(
      {
        submission_id: id,
        tanggal: j.tanggal,
        waktu: j.waktu,
        ruang: j.ruang,
        lokasi: j.lokasi,
      },
      { onConflict: "submission_id" }
    );
    if (jErr) throw new Error(jErr.message);
  }

  notifyChange();
  return true;
}

export async function deletePPDBSubmission(id: string): Promise<boolean> {
  const { error } = await supabase.from("ppdb_submissions").delete().eq("id", id);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

// =================================================================
// SPP
// =================================================================

async function signSPPRows(rows: any[]): Promise<Record<string, string>> {
  return signDocUrls(rows.map((r) => r.bukti_transfer_url).filter(Boolean));
}

export async function getSPPPayments(): Promise<SPPPayment[]> {
  const { data, error } = await supabase
    .from("spp_payments")
    .select("*")
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  const urlMap = await signSPPRows(data);
  return data.map((r) => rowToSPP(r, urlMap));
}

export async function getSPPPaymentsByNIS(nis: string): Promise<SPPPayment[]> {
  const { data, error } = await supabase
    .from("spp_payments")
    .select("*")
    .eq("nis", nis)
    .order("created_at", { ascending: false });
  if (error || !data) return [];
  const urlMap = await signSPPRows(data);
  return data.map((r) => rowToSPP(r, urlMap));
}

export async function getSPPPaymentsByUser(
  userId: string,
  userEmail: string,
  _userName?: string,
  includeDeleted: boolean = true
): Promise<SPPPayment[]> {
  const safeUserId = (userId || "").trim();
  const safeEmail = (userEmail || "").trim().toLowerCase();
  const filters: string[] = [];
  if (safeUserId) filters.push(`user_id.eq.${safeUserId}`);
  if (safeEmail) filters.push(`user_email.eq.${safeEmail}`);
  if (filters.length === 0) return [];

  const { data, error } = await supabase
    .from("spp_payments")
    .select("*")
    .or(filters.join(","))
    .order("created_at", { ascending: false });
  if (error || !data) return [];

  const rows = includeDeleted ? data : data.filter((r) => !r.deleted_at);
  const urlMap = await signSPPRows(rows);
  return rows.map((r) => rowToSPP(r, urlMap));
}

export async function submitSPPPayment(data: SPPInput): Promise<SPPPayment> {
  const kat = String(data.kategoriPembayaran ?? "");
  const isInf = kat.includes("Infaq") || kat.includes("Wakaf") || kat.includes("Donasi");
  const prefix = isInf ? "INF" : "SPP";
  const now = new Date();
  const idTransaksi = `${prefix}-${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}-${Math.floor(
    100 + Math.random() * 899
  )}`;

  const row = sppToRow(data, idTransaksi);
  const { data: inserted, error } = await supabase
    .from("spp_payments")
    .insert(row)
    .select()
    .single();
  if (error || !inserted) throw new Error(error?.message ?? "Gagal menyimpan pembayaran.");

  notifyChange();
  const urlMap = await signDocUrls([inserted.bukti_transfer_url]);
  return rowToSPP(inserted, urlMap);
}

export async function updateSPPPaymentStatus(id: string, status: StatusPembayaranSPP): Promise<boolean> {
  const { error } = await supabase
    .from("spp_payments")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

export async function trashSPPPayment(id: string): Promise<boolean> {
  const now = new Date().toISOString();
  const { error } = await supabase
    .from("spp_payments")
    .update({ deleted_at: now, updated_at: now })
    .eq("id", id);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

export async function restoreSPPPayment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from("spp_payments")
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .eq("id", id);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

export async function restoreAllSPPPayments(): Promise<boolean> {
  const { error } = await supabase
    .from("spp_payments")
    .update({ deleted_at: null, updated_at: new Date().toISOString() })
    .not("deleted_at", "is", null);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

export async function deleteSPPPayment(id: string): Promise<boolean> {
  const { error } = await supabase.from("spp_payments").delete().eq("id", id);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

export async function deleteAllSPPPayments(): Promise<boolean> {
  const { error } = await supabase.from("spp_payments").delete().not("id", "is", null);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}

export async function deleteBatchSPPPayments(ids: string[]): Promise<boolean> {
  if (!ids || ids.length === 0) return true;
  const { error } = await supabase.from("spp_payments").delete().in("id", ids);
  if (error) throw new Error(error.message);
  notifyChange();
  return true;
}
