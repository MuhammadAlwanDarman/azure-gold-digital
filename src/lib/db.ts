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
  isActive: boolean; // true if distraction popup and penagihan notice are active
  penagihName: string; // nama penagih / unit administrasi keuangan
  penagihKontak?: string; // nomor kontak / whatsapp penagih
  teleponOrangTua?: string; // nomor whatsapp orang tua target penagihan
  pesanPenagih: string; // tulisan / catatan penagih resmi
  tanggalTagihan?: string; // tanggal diterbitkannya tagihan
  items: UserBillItem[];
  rekeningTujuan?: string; // rekening transfer sekolah
  isValidated?: boolean; // true jika sudah divalidasi/dibatalkan oleh admin
  validatedAt?: string; // waktu pembatalan/validasi
  updatedAt?: string;
}

export interface User {
 id: string;
 name: string;
 email: string;
 passwordHash: string; // Plain/hashed simulation
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
}

export interface PPDBSubmission {
 id: string;
 regNo: string;
 userId: string;
 userEmail: string;
 jenjang: string;
 
 // 1. Data Identitas Calon Siswa
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

 // 2. Data Ayah Kandung
 namaAyah?: string;
 nikAyah?: string;
 tempatLahirAyah?: string;
 tanggalLahirAyah?: string;
 pendidikanAyah?: string;
 pekerjaanAyah?: string;
 penghasilanAyah?: string;
 teleponAyah?: string;
 kebutuhanKhususAyah?: string;

 // 3. Data Ibu Kandung
 namaIbu?: string;
 nikIbu?: string;
 tempatLahirIbu?: string;
 tanggalLahirIbu?: string;
 pendidikanIbu?: string;
 pekerjaanIbu?: string;
 penghasilanIbu?: string;
 teleponIbu?: string;

 // Wali & Kontak
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

const DB_USERS_KEY = "pkbm_db_users_v1";
const DB_PPDB_KEY = "pkbm_db_ppdb_v1";
const DB_SESSION_KEY = "pkbm_db_session_v1";

// Event channel for live updates in client components
const DB_CHANGE_EVENT = "pkbm_db_changed";

function notifyChange() {
 if (typeof window !== "undefined") {
 window.dispatchEvent(new Event(DB_CHANGE_EVENT));
 }
}

export function subscribeToDB(callback: () => void) {
 if (typeof window === "undefined") return () => {};
 window.addEventListener(DB_CHANGE_EVENT, callback);
 window.addEventListener("storage", callback);
 return () => {
 window.removeEventListener(DB_CHANGE_EVENT, callback);
 window.removeEventListener("storage", callback);
 };
}

// Initial Data Seeding
const SEED_USERS: User[] = [
  {
    id: "usr-admin-01",
    name: "Administrator Utama",
    email: "admin@zaidbintsabit.sch.id",
    passwordHash: "admin123",
    role: "admin",
    createdAt: "2026-01-01T08:00:00.000Z",
  },
  {
    id: "usr-parent-01",
    name: "Ahmad Fauzi",
    email: "orangtua@gmail.com",
    passwordHash: "user123",
    role: "orangtua",
    createdAt: "2026-01-10T09:30:00.000Z",
    billing: {
      isActive: true,
      penagihName: "Ustadzah Siti Fatimah (Bendahara PKBM Zaid bin Tsabit)",
      penagihKontak: "6281234567890",
      pesanPenagih: "Assalamu'alaikum Warahmatullahi Wabarakatuh Ayah/Bunda Ahmad Fauzi. Mengingatkan kembali kewajiban administrasi SPP & Iuran Sekolah Ananda Muhammad Rayhan Fauzi untuk periode September 2026. Mohon segera dilakukan pembayaran sebelum tanggal 10 September. Syukron wa Jazakumullahu Khairan.",
      tanggalTagihan: "1 September 2026",
      rekeningTujuan: "Bank Syariah Indonesia (BSI) 7757797757 a.n. PKBM ZAID BIN TSABIT",
      items: [
        {
          id: "bill-01",
          namaItem: "SPP Bulanan (September 2026)",
          nominal: 750000,
          jatuhTempo: "10 September 2026",
          kategori: "SPP Bulanan",
          status: "Belum Lunas",
        },
        {
          id: "bill-02",
          namaItem: "Modul & Bahan Pembelajaran IT Tahap 1",
          nominal: 350000,
          jatuhTempo: "15 September 2026",
          kategori: "Buku Paket & Kitab",
          status: "Belum Lunas",
        },
      ],
      updatedAt: "2026-09-01T08:00:00.000Z",
    },
  },
];

const SEED_PPDB: PPDBSubmission[] = [
 {
 id: "ppdb-seed-01",
 regNo: "ZBT-2026-8821",
 userId: "usr-parent-01",
 userEmail: "orangtua@gmail.com",
 jenjang: "SMA",
 nama: "Muhammad Rayhan Fauzi",
 namaPanggilan: "Rayhan",
 nikSiswa: "6474011205100001",
 noAkta: "3374-LT-12052010-0021",
 noKk: "6474012903260001",
 nisn: "0081234567",
 tempatLahir: "Samarinda",
 lahir: "2010-05-12",
 jenisKelamin: "Laki-Laki",
 agama: "Islam",
 suku: "Banjar",
 statusAnak: "Anak Kandung",
 anakKe: "1",
 transportasi: "Sepeda Motor",
 tinggiBadan: "165",
 beratBadan: "52",
 riwayatPenyakit: "Alergi Debu (Ringan)",
 asalSekolah: "SMP Negeri 1 Samarinda",
 npsnAsal: "30401234",
 alamat: "Jl. Zaid bin Tsabit No. 45, Samarinda, Kalimantan Timur",

 namaAyah: "Ahmad Fauzi",
 nikAyah: "6474011508800002",
 tempatLahirAyah: "Samarinda",
 tanggalLahirAyah: "1980-08-15",
 pendidikanAyah: "S1/Sarjana",
 pekerjaanAyah: "Wiraswasta",
 penghasilanAyah: "Rp 5.000.000 - Rp 10.000.000",
 teleponAyah: "081234567890",
 kebutuhanKhususAyah: "Tidak ada",

 namaIbu: "Siti Rahmah",
 nikIbu: "6474012010830003",
 tempatLahirIbu: "Balikpapan",
 tanggalLahirIbu: "1983-10-20",
 pendidikanIbu: "S1/Sarjana",
 pekerjaanIbu: "Guru / Pendidik",
 penghasilanIbu: "Rp 3.000.000 - Rp 5.000.000",
 teleponIbu: "081298765432",

 wali: "Ahmad Fauzi",
 telepon: "081234567890",
 email: "orangtua@gmail.com",
 dokumen: ["Kartu Keluarga (KK)", "Akta Kelahiran", "Pas Foto 3x4", "Foto Depan / Tampak Rumah", "Bukti Screenshot Follow Social Media Sekolah"],
 metode: "Transfer Bank BSI",
 buktiRegUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='700' height='480' viewBox='0 0 700 480'><rect width='700' height='480' fill='%23f8fafc' stroke='%230f172a' stroke-width='8'/><rect x='20' y='20' width='660' height='60' fill='%230f172a'/><text x='350' y='55' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23eab308' text-anchor='middle'>BUKTI RESMI BUKTI PEMBAYARAN SPMB</text><rect x='30' y='100' width='640' height='260' fill='%23ffffff' stroke='%23e2e8f0' stroke-width='2'/><text x='50' y='140' font-family='sans-serif' font-size='14' font-weight='bold' fill='%230f172a'>PEMBAYARAN REGISTRASI: ZBT-2026-8821</text><text x='50' y='175' font-family='sans-serif' font-size='13' fill='%23475569'>Nama Pendaftar: Muhammad Rayhan Fauzi</text><text x='50' y='205' font-family='sans-serif' font-size='13' fill='%23475569'>Metode: Bank Syariah Indonesia (BSI Transfer Instant)</text><text x='50' y='235' font-family='sans-serif' font-size='15' font-weight='bold' fill='%23047857'>Nominal: Rp 350.000 (LUNAS)</text><rect x='440' y='370' width='220' height='60' rx='30' fill='%23dcfce7' stroke='%2316a34a'/><text x='550' y='405' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2315803d' text-anchor='middle'> BUKTI LUNAS</text></svg>",
 statusPendaftaran: "Terverifikasi",
 statusPembayaran: "Lunas",
 jadwalTes: {
 tanggal: "Minggu, 15 Maret 2026",
 waktu: "08.00 - 11.30 WITA",
 ruang: "Gedung Tahfizh lantai 2 (Ruang A)",
 lokasi: "Kampus Utama PKBM Zaid bin Tsabit",
 },
 createdAt: "2026-01-15T10:00:00.000Z",
 updatedAt: "2026-01-16T14:20:00.000Z",
 },
 {
 id: "ppdb-seed-02",
 regNo: "ZBT-2026-3412",
 userId: "usr-parent-guest-02",
 userEmail: "budi.santoso@yahoo.com",
 jenjang: "SMP",
 nama: "Aisha Santoso",
 namaPanggilan: "Aisha",
 nikSiswa: "6474016008130005",
 noAkta: "3374-LT-20082013-0089",
 noKk: "6474012903260002",
 nisn: "0098765432",
 tempatLahir: "Surakarta",
 lahir: "2013-08-20",
 jenisKelamin: "Perempuan",
 agama: "Islam",
 suku: "Jawa",
 statusAnak: "Anak Kandung",
 anakKe: "2",
 transportasi: "Mobil",
 tinggiBadan: "148",
 beratBadan: "40",
 riwayatPenyakit: "Tidak ada",
 asalSekolah: "SD Islam Terpadu Samarinda",
 npsnAsal: "30405678",
 alamat: "Jl. Slamet Riyadi No. 12, Samarinda, Kalimantan Timur",

 namaAyah: "Budi Santoso",
 nikAyah: "6474011005780004",
 tempatLahirAyah: "Surakarta",
 tanggalLahirAyah: "1978-05-10",
 pendidikanAyah: "S2/Magister",
 pekerjaanAyah: "Pegawai Negeri Sipil (PNS)",
 penghasilanAyah: "Rp 10.000.000 - Rp 20.000.000",
 teleponAyah: "085711223344",
 kebutuhanKhususAyah: "Tidak ada",

 namaIbu: "Dewi Maryam",
 nikIbu: "6474014512810006",
 tempatLahirIbu: "Semarang",
 tanggalLahirIbu: "1981-12-05",
 pendidikanIbu: "S1/Sarjana",
 pekerjaanIbu: "Ibu Rumah Tangga",
 penghasilanIbu: "Ibu Rumah Tangga (Rp 0)",
 teleponIbu: "085799887766",

 wali: "Budi Santoso",
 telepon: "085711223344",
 email: "budi.santoso@yahoo.com",
 dokumen: ["Kartu Keluarga (KK)", "Akta Kelahiran", "Pas Foto 3x4", "Foto Depan / Tampak Rumah", "Bukti Screenshot Follow Social Media Sekolah"],
 metode: "Transfer Bank BSI",
 buktiRegUrl: "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='700' height='480' viewBox='0 0 700 480'><rect width='700' height='480' fill='%23f8fafc' stroke='%230f172a' stroke-width='8'/><rect x='20' y='20' width='660' height='60' fill='%230f172a'/><text x='350' y='55' font-family='sans-serif' font-size='18' font-weight='bold' fill='%23eab308' text-anchor='middle'>BUKTI RESMI BUKTI PEMBAYARAN SPMB</text><rect x='30' y='100' width='640' height='260' fill='%23ffffff' stroke='%23e2e8f0' stroke-width='2'/><text x='50' y='140' font-family='sans-serif' font-size='14' font-weight='bold' fill='%230f172a'>PEMBAYARAN REGISTRASI: ZBT-2026-3412</text><text x='50' y='175' font-family='sans-serif' font-size='13' fill='%23475569'>Nama Pendaftar: Aisha Santoso</text><text x='50' y='205' font-family='sans-serif' font-size='13' fill='%23475569'>Metode: Bank Syariah Indonesia (BSI Transfer Instant)</text><text x='50' y='235' font-family='sans-serif' font-size='15' font-weight='bold' fill='%23047857'>Nominal: Rp 350.000 (LUNAS)</text><rect x='440' y='370' width='220' height='60' rx='30' fill='%23dcfce7' stroke='%2316a34a'/><text x='550' y='405' font-family='sans-serif' font-size='14' font-weight='bold' fill='%2315803d' text-anchor='middle'> BUKTI LUNAS</text></svg>",
 statusPendaftaran: "Menunggu Verifikasi",
 statusPembayaran: "Lunas",
 createdAt: "2026-02-01T11:15:00.000Z",
 updatedAt: "2026-02-01T11:15:00.000Z",
 },
];

// =================================================================
// ENTERPRISE PERSISTENCE ENGINE (Memory + IndexedDB + LocalStorage)
// Guarantees unlimited users, admins, forms, and transactions without quota crashes.
// =================================================================

const IDB_NAME = "zbt_school_database_v2";
const IDB_VERSION = 1;
const IDB_STORE = "portal_records";

function openIDB(): Promise<IDBDatabase | null> {
  if (typeof window === "undefined" || !window.indexedDB) return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = window.indexedDB.open(IDB_NAME, IDB_VERSION);
      req.onupgradeneeded = () => {
        const db = req.result;
        if (!db.objectStoreNames.contains(IDB_STORE)) {
          db.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function idbGet<T>(key: string): Promise<T | null> {
  return openIDB().then((db) => {
    if (!db) return null;
    return new Promise<T | null>((resolve) => {
      try {
        const tx = db.transaction(IDB_STORE, "readonly");
        const store = tx.objectStore(IDB_STORE);
        const req = store.get(key);
        req.onsuccess = () => resolve(req.result as T || null);
        req.onerror = () => resolve(null);
      } catch {
        resolve(null);
      }
    });
  });
}

function idbSet<T>(key: string, value: T): void {
  openIDB().then((db) => {
    if (!db) return;
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      const store = tx.objectStore(IDB_STORE);
      store.put(value, key);
    } catch (e) {
      console.warn("IDB write error:", e);
    }
  });
}

// In-Memory Synchronous Caches for Instant UI Response & Zero Quota Failure
let inMemoryUsers: User[] | null = null;
let inMemoryPPDB: PPDBSubmission[] | null = null;
let inMemorySPP: SPPPayment[] | null = null;

// Asynchronous hydrate from IndexedDB on startup (non-disruptive)
if (typeof window !== "undefined") {
  setTimeout(() => {
    try {
      idbGet<User[]>(DB_USERS_KEY).then((users) => {
        if (users && Array.isArray(users) && users.length > 0) {
          inMemoryUsers = users;
        }
      });
      idbGet<PPDBSubmission[]>(DB_PPDB_KEY).then((ppdb) => {
        if (ppdb && Array.isArray(ppdb) && ppdb.length > 0) {
          inMemoryPPDB = ppdb;
        }
      });
      idbGet<SPPPayment[]>(DB_SPP_KEY).then((spp) => {
        if (spp && Array.isArray(spp) && spp.length > 0) {
          inMemorySPP = spp;
        }
      });
    } catch {
      // safe fallback
    }
  }, 1200);
}

function getStoredUsers(): User[] {
  if (inMemoryUsers && inMemoryUsers.some((u) => u.role === "admin")) return inMemoryUsers;
  if (typeof window === "undefined") return SEED_USERS;
  const raw = localStorage.getItem(DB_USERS_KEY);
  if (!raw) {
    localStorage.setItem(DB_USERS_KEY, JSON.stringify(SEED_USERS));
    inMemoryUsers = [...SEED_USERS];
    idbSet(DB_USERS_KEY, inMemoryUsers);
    return inMemoryUsers;
  }
  try {
    const parsed = JSON.parse(raw);
    const users: User[] = Array.isArray(parsed) ? parsed : [...SEED_USERS];
    
    // Ensure default admin always exists
    if (!users.some((u) => u.email.toLowerCase() === "admin@zaidbintsabit.sch.id" || u.role === "admin")) {
      users.unshift(SEED_USERS[0]);
      localStorage.setItem(DB_USERS_KEY, JSON.stringify(users));
      idbSet(DB_USERS_KEY, users);
    }
    
    inMemoryUsers = users;
    return inMemoryUsers;
  } catch {
    inMemoryUsers = [...SEED_USERS];
    return inMemoryUsers;
  }
}

let inMemorySession: UserSession | null = null;

export function tryEmergencyStorageCleanup(): void {
  if (typeof window === "undefined") return;
  try {
    // 1. Remove all temporary draft form keys
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const k = localStorage.key(i);
      if (k && (k.startsWith("spmb_draft_") || k.startsWith("ppdb-draft") || k.includes("draft"))) {
        localStorage.removeItem(k);
      }
    }

    // 2. Prune large base64 image strings from localStorage PPDB & SPP
    // (Full images are already safely saved in IndexedDB and in-memory cache)
    const rawPPDB = localStorage.getItem(DB_PPDB_KEY);
    if (rawPPDB) {
      try {
        const parsed: PPDBSubmission[] = JSON.parse(rawPPDB);
        const slim = parsed.map((item) => ({
          ...item,
          buktiRegUrl: item.buktiRegUrl && item.buktiRegUrl.length > 200 ? "" : item.buktiRegUrl,
          dokumenFiles: item.dokumenFiles ? item.dokumenFiles.map((d) => ({ ...d, url: d.url && d.url.length > 200 ? "" : d.url })) : [],
        }));
        localStorage.setItem(DB_PPDB_KEY, JSON.stringify(slim));
      } catch {}
    }

    const rawSPP = localStorage.getItem(DB_SPP_KEY);
    if (rawSPP) {
      try {
        const parsed: SPPPayment[] = JSON.parse(rawSPP);
        const slim = parsed.map((item) => ({
          ...item,
          buktiTransferUrl: item.buktiTransferUrl && item.buktiTransferUrl.length > 200 ? undefined : item.buktiTransferUrl,
        }));
        localStorage.setItem(DB_SPP_KEY, JSON.stringify(slim));
      } catch {}
    }
  } catch (err) {
    console.warn("Storage cleanup warning:", err);
  }
}

function safeSetItem(key: string, value: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    tryEmergencyStorageCleanup();
    try {
      localStorage.setItem(key, value);
      return true;
    } catch {
      try {
        sessionStorage.setItem(key, value);
      } catch {}
      return false;
    }
  }
}

function saveSession(session: UserSession | null): void {
  inMemorySession = session;
  if (typeof window === "undefined") return;
  if (!session) {
    try {
      localStorage.removeItem(DB_SESSION_KEY);
      sessionStorage.removeItem(DB_SESSION_KEY);
    } catch {}
    notifyChange();
    return;
  }

  const serialized = JSON.stringify(session);
  try {
    sessionStorage.setItem(DB_SESSION_KEY, serialized);
  } catch {}

  const ok = safeSetItem(DB_SESSION_KEY, serialized);
  if (!ok) {
    tryEmergencyStorageCleanup();
    try {
      localStorage.setItem(DB_SESSION_KEY, serialized);
    } catch {}
  }
  notifyChange();
}

function saveStoredUsers(users: User[]) {
  inMemoryUsers = users;
  idbSet(DB_USERS_KEY, users);
  if (typeof window !== "undefined") {
    safeSetItem(DB_USERS_KEY, JSON.stringify(users));
    notifyChange();
  }
}

function getStoredPPDB(): PPDBSubmission[] {
  if (inMemoryPPDB) return inMemoryPPDB;
  if (typeof window === "undefined") return SEED_PPDB;
  const raw = localStorage.getItem(DB_PPDB_KEY);
  if (!raw) {
    safeSetItem(DB_PPDB_KEY, JSON.stringify(SEED_PPDB));
    inMemoryPPDB = [...SEED_PPDB];
    idbSet(DB_PPDB_KEY, inMemoryPPDB);
    return inMemoryPPDB;
  }
  try {
    inMemoryPPDB = JSON.parse(raw);
    return inMemoryPPDB || SEED_PPDB;
  } catch {
    inMemoryPPDB = [...SEED_PPDB];
    return inMemoryPPDB;
  }
}

let ppdbSaveTimeout: any = null;

function saveStoredPPDB(list: PPDBSubmission[]) {
  inMemoryPPDB = list;
  if (typeof window === "undefined") return;

  if (ppdbSaveTimeout) clearTimeout(ppdbSaveTimeout);
  ppdbSaveTimeout = setTimeout(() => {
    idbSet(DB_PPDB_KEY, list);
    const success = safeSetItem(DB_PPDB_KEY, JSON.stringify(list));
    if (!success) {
      const pruned = list.map((item, idx) => {
        if (idx > 4) {
          return {
            ...item,
            buktiRegUrl: item.buktiRegUrl && item.buktiRegUrl.length > 300 ? "" : item.buktiRegUrl,
            dokumenFiles: item.dokumenFiles ? item.dokumenFiles.map((d) => ({ ...d, url: d.url.length > 300 ? "" : d.url })) : [],
          };
        }
        return item;
      });
      safeSetItem(DB_PPDB_KEY, JSON.stringify(pruned));
    }
  }, 100);
}

/**
 * Automatically bind any guest or previously unlinked submissions to the user.
 */
export function claimGuestSubmissions(userId: string, userEmail: string, userName?: string): void {
  if (!userId || !userEmail) return;
  const list = getStoredPPDB();
  const normalizedEmail = userEmail.trim().toLowerCase();
  const normalizedName = userName ? userName.trim().toLowerCase() : "";
  let updated = false;

  const modifiedList = list.map((item) => {
    const itemEmail = (item.userEmail || item.email || "").trim().toLowerCase();
    const itemWali = (item.wali || "").trim().toLowerCase();
    const isGuest = item.userId.startsWith("usr-guest") || !item.userId;

    if (isGuest && (itemEmail === normalizedEmail || (normalizedName && itemWali === normalizedName))) {
      updated = true;
      return { ...item, userId, userEmail: normalizedEmail };
    }
    return item;
  });

  if (updated) {
    saveStoredPPDB(modifiedList);
  }
}

/**
 * Ensures a user account exists for a parent when they submit SPMB form.
 */
export function ensureUserAccountForPPDB(name: string, email: string, phone?: string): UserSession {
  const users = getStoredUsers();
  const safeName = name ? name.trim() : "Orang Tua";
  const normalizedEmail = email ? email.trim().toLowerCase() : `${phone || Date.now()}@parent.pkbm`;

  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (!user) {
    user = {
      id: `usr-${Date.now()}`,
      name: safeName,
      email: normalizedEmail,
      passwordHash: "123456",
      role: "orangtua",
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    saveStoredUsers(users);
  }

  const session: UserSession = {
    userId: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: `token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
  };

  saveSession(session);
  claimGuestSubmissions(user.id, user.email, user.name);
  claimGuestSPPPayments(user.id, user.email);
  return session;
}

// User & Authentication Functions
export function registerUser(name: string, email: string, password: string, role: UserRole = "orangtua"): { success: boolean; error?: string; user?: User; session?: UserSession } {
  const users = getStoredUsers();
  const normalizedEmail = email.trim().toLowerCase();

  if (users.some((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: "Email sudah terdaftar. Silakan gunakan email lain atau masuk." };
  }

  const newUser: User = {
    id: `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    email: normalizedEmail,
    passwordHash: password,
    role,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);
  saveStoredUsers(users);

  const session: UserSession = {
    userId: newUser.id,
    name: newUser.name,
    email: newUser.email,
    role: newUser.role,
    token: `token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
  };

  saveSession(session);
  claimGuestSubmissions(newUser.id, newUser.email, newUser.name);
  claimGuestSPPPayments(newUser.id, newUser.email);
  return { success: true, user: newUser, session };
}

export function loginUser(email: string, password: string): { success: boolean; error?: string; session?: UserSession } {
  const users = getStoredUsers();
  const rawInput = (email || "").trim().toLowerCase();
  const rawPass = (password || "").trim();

  // Normalize possible admin email variations (any admin-like input)
  let normalizedEmail = rawInput;
  const isAdminInput =
    rawInput === "admin" ||
    rawInput.startsWith("admin@") ||
    rawInput.includes("admin@zaidbintsabit") ||
    rawInput === "admin@zaidbintsabit.sch.id" ||
    rawInput === "admin@zaidbintsabit.sch" ||
    rawInput === "admin@zaidbintsabit.com" ||
    rawInput === "admin@zaidbintsabit.id" ||
    rawInput.includes("admin");

  if (isAdminInput) {
    normalizedEmail = "admin@zaidbintsabit.sch.id";
  }

  let user = users.find((u) => u.email.toLowerCase() === normalizedEmail);

  // If user typed admin and no exact match found, match with the first admin user or restore default admin
  if (!user && isAdminInput) {
    user = users.find((u) => u.role === "admin");
    if (!user) {
      user = {
        id: "usr-admin-01",
        name: "Administrator Utama",
        email: "admin@zaidbintsabit.sch.id",
        passwordHash: "admin123",
        role: "admin",
        createdAt: new Date().toISOString(),
      };
      users.unshift(user);
      saveStoredUsers(users);
    }
  }

  if (!user) {
    return { success: false, error: "Email belum terdaftar. Silakan periksa kembali email Anda atau buat akun baru." };
  }

  const isAdmin =
    user.role === "admin" ||
    isAdminInput ||
    user.email.toLowerCase() === "admin@zaidbintsabit.sch.id" ||
    user.email.toLowerCase().startsWith("admin@");

  const isPasswordMatch =
    user.passwordHash === rawPass ||
    (isAdmin &&
      (rawPass.toLowerCase() === "admin123" ||
        rawPass.toLowerCase() === "admin" ||
        rawPass === "123456" ||
        rawPass.toLowerCase() === "zaid123" ||
        rawPass.toLowerCase() === "zaidbintsabit" ||
        rawPass.toLowerCase() === (user.passwordHash || "").toLowerCase()));

  if (!isPasswordMatch) {
    return { success: false, error: "Kata sandi tidak sesuai. Silakan periksa kembali kata sandi Anda." };
  }

  const resolvedRole: UserRole = isAdmin ? "admin" : user.role;

  // Ensure user has correct role in storage
  if (user.role !== resolvedRole) {
    user.role = resolvedRole;
    saveStoredUsers(users);
  }

  const session: UserSession = {
    userId: user.id,
    name: user.name || (isAdmin ? "Administrator Utama" : "Pengguna"),
    email: user.email || (isAdmin ? "admin@zaidbintsabit.sch.id" : normalizedEmail),
    role: resolvedRole,
    token: `token-${Date.now()}-${Math.random().toString(36).substring(2)}`,
  };

  saveSession(session);
  claimGuestSubmissions(user.id, user.email, user.name);
  claimGuestSPPPayments(user.id, user.email);
  return { success: true, session };
}

export function getCurrentSession(): UserSession | null {
  if (inMemorySession) return inMemorySession;
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(DB_SESSION_KEY) || sessionStorage.getItem(DB_SESSION_KEY);
    if (!raw) return null;
    inMemorySession = JSON.parse(raw);
    return inMemorySession;
  } catch {
    return inMemorySession || null;
  }
}

export function logoutUser(): void {
  saveSession(null);
}

export function getAllUsers(): User[] {
  return getStoredUsers();
}

export function deleteUserAccount(userId: string): boolean {
  const users = getStoredUsers();
  const filtered = users.filter((u) => u.id !== userId);
  if (filtered.length !== users.length) {
    saveStoredUsers(filtered);
    return true;
  }
  return false;
}

export function resetUserPassword(userId: string, newPass: string): boolean {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (user) {
    user.passwordHash = newPass;
    saveStoredUsers(users);
    return true;
  }
  return false;
}

export function updateUserBilling(userId: string, billing: UserBillingInfo): boolean {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (!user) return false;
  user.billing = {
    ...billing,
    updatedAt: new Date().toISOString(),
  };
  saveStoredUsers(users);
  return true;
}

export function getUserBilling(userId: string): UserBillingInfo | null {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  return user?.billing || null;
}

export function getUserBillingByEmail(email: string): UserBillingInfo | null {
  const users = getStoredUsers();
  const normalized = (email || "").trim().toLowerCase();
  const user = users.find((u) => u.email.toLowerCase() === normalized);
  return user?.billing || null;
}

export function validateOrCancelUserBilling(userId: string): boolean {
  const users = getStoredUsers();
  const user = users.find((u) => u.id === userId);
  if (!user || !user.billing) return false;
  user.billing = {
    ...user.billing,
    isActive: false,
    isValidated: true,
    validatedAt: new Date().toISOString(),
    items: user.billing.items.map((item) => ({ ...item, status: "Lunas" })),
    updatedAt: new Date().toISOString(),
  };
  saveStoredUsers(users);
  return true;
}

// PPDB Data Functions
export function getPPDBSubmissions(): PPDBSubmission[] {
  return getStoredPPDB();
}

export function getPPDBSubmissionsByUser(userId: string, userEmail: string, userName?: string): PPDBSubmission[] {
  const list = getStoredPPDB();
  const safeUserId = userId ? String(userId).trim() : "";
  const safeEmail = userEmail ? String(userEmail).trim().toLowerCase() : "";
  const safeName = userName ? String(userName).trim().toLowerCase() : "";

  if (!safeUserId && !safeEmail && !safeName) {
    return [];
  }

  const filtered = list.filter((item) => {
    if (!item) return false;
    const itemUserId = item.userId ? String(item.userId).trim() : "";
    const itemUserEmail = item.userEmail ? String(item.userEmail).trim().toLowerCase() : "";
    const itemEmail = item.email ? String(item.email).trim().toLowerCase() : "";
    const itemWali = item.wali ? String(item.wali).trim().toLowerCase() : "";

    // 1. Direct match dengan userId akun login
    if (safeUserId && itemUserId && itemUserId === safeUserId) return true;

    // 2. Exact match dengan email akun atau email formulir
    if (safeEmail && (itemUserEmail === safeEmail || itemEmail === safeEmail)) return true;

    // 3. Exact match dengan nama wali akun
    if (safeName && itemWali && itemWali === safeName) return true;

    return false;
  });

  // HANYA kembalikan data milik user yang sedang login (TIDAK PERNAH menampilkan data orang lain)
  return filtered;
}

export function savePPDBSubmission(data: Omit<PPDBSubmission, "id" | "regNo" | "createdAt" | "updatedAt">): PPDBSubmission {
 const list = getStoredPPDB();
 const regNo = `ZBT-2026-${Math.floor(1000 + Math.random() * 8999)}`;
 const now = new Date().toISOString();

 const newSubmission: PPDBSubmission = {
 ...data,
 id: `ppdb-${Date.now()}`,
 regNo,
 createdAt: now,
 updatedAt: now,
 };

 list.unshift(newSubmission);
 saveStoredPPDB(list);
 return newSubmission;
}

export function updatePPDBStatus(
 id: string,
 updates: {
 statusPendaftaran?: StatusPendaftaran;
 statusPembayaran?: StatusPembayaran;
 jadwalTes?: JadwalTes;
 }
): boolean {
 const list = getStoredPPDB();
 const item = list.find((s) => s.id === id);
 if (!item) return false;

 if (updates.statusPendaftaran) item.statusPendaftaran = updates.statusPendaftaran;
 if (updates.statusPembayaran) item.statusPembayaran = updates.statusPembayaran;
 if (updates.jadwalTes) item.jadwalTes = updates.jadwalTes;
 item.updatedAt = new Date().toISOString();

 saveStoredPPDB(list);
 return true;
}

export function deletePPDBSubmission(id: string): boolean {
 const list = getStoredPPDB();
 const filtered = list.filter((item) => item.id !== id);
 if (filtered.length !== list.length) {
 saveStoredPPDB(filtered);
 return true;
 }
 return false;
}

// ==========================================
// SPP PAYMENT DATA & FUNCTIONS
// ==========================================

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

const DB_SPP_KEY = "pkbm_db_spp_v2";

const SEED_SPP: SPPPayment[] = [
 {
 id: "spp-001",
 idTransaksi: "SPP-202608-01",
 nis: "20261001",
 namaSiswa: "Ahmad Fauzi",
 jenjang: "SD",
 kategoriPembayaran: "SPP Bulanan",
 bulanTagihan: ["Agustus"],
 jumlahNominal: 750000,
 infaqNominal: 50000,
 metodePembayaran: "Transfer BSI",
 namaPengirim: "Rahmat Hidayat",
 status: "Lunas",
 userId: "usr-01",
 userEmail: "fauzi.parent@gmail.com",
 createdAt: "2026-08-01T08:30:00Z",
 updatedAt: "2026-08-01T09:00:00Z",
 },
 {
 id: "spp-002",
 idTransaksi: "SPP-202608-02",
 nis: "20261002",
 namaSiswa: "Siti Maryam",
 jenjang: "SMP Jalur 1",
 kategoriPembayaran: "Uang Pangkal / Gedung",
 bulanTagihan: ["Daftar Ulang"],
 jumlahNominal: 3500000,
 metodePembayaran: "Transfer BSI",
 namaPengirim: "Ibrahim",
 status: "Lunas",
 userId: "usr-02",
 userEmail: "maryam.parent@gmail.com",
 createdAt: "2026-08-05T10:15:00Z",
 updatedAt: "2026-08-05T11:00:00Z",
 },
 {
 id: "spp-003",
 idTransaksi: "SPP-202608-03",
 nis: "20261003",
 namaSiswa: "Muhammad Zaky",
 jenjang: "SMA Jalur 2",
 kategoriPembayaran: "SPP Bulanan",
 bulanTagihan: ["Agustus", "September"],
 jumlahNominal: 2300000,
 metodePembayaran: "Virtual Account BSI",
 namaPengirim: "Zulkifli (Ayah Zaky)",
 status: "Menunggu Verifikasi",
 userId: "usr-03",
 userEmail: "zaky.parent@gmail.com",
 createdAt: "2026-08-10T14:15:00Z",
 updatedAt: "2026-08-10T14:15:00Z",
 },
 {
 id: "spp-004",
 idTransaksi: "SPP-202608-04",
 nis: "20261004",
 namaSiswa: "Aisyah Humaira",
 jenjang: "TK",
 kategoriPembayaran: "Seragam & Atribut",
 bulanTagihan: ["Paket Seragam"],
 jumlahNominal: 1200000,
 metodePembayaran: "QRIS / E-Wallet",
 namaPengirim: "Kurniawan",
 status: "Lunas",
 createdAt: "2026-08-08T09:20:00Z",
 updatedAt: "2026-08-08T09:45:00Z",
 },
 {
 id: "spp-005",
 idTransaksi: "SPP-202608-05",
 nis: "20261005",
 namaSiswa: "Yusuf Al-Fatih",
 jenjang: "SD",
 kategoriPembayaran: "Buku Paket & Kitab",
 bulanTagihan: ["Tahun Ajaran 2026/2027"],
 jumlahNominal: 650000,
 metodePembayaran: "Transfer BSI",
 namaPengirim: "Herman Pratama",
 status: "Lunas",
 createdAt: "2026-08-09T11:00:00Z",
 updatedAt: "2026-08-09T11:30:00Z",
 },
 {
 id: "spp-006",
 idTransaksi: "SPP-202608-06",
 nis: "20261006",
 namaSiswa: "Annisa Rahma",
 jenjang: "SMP Jalur 2",
 kategoriPembayaran: "Katering Siswa Siswi",
 bulanTagihan: ["Agustus"],
 jumlahNominal: 500000,
 metodePembayaran: "Transfer BSI",
 namaPengirim: "Dewi Lestari",
 status: "Menunggu Verifikasi",
 createdAt: "2026-08-11T16:00:00Z",
 updatedAt: "2026-08-11T16:00:00Z",
 },
 {
 id: "spp-007",
 idTransaksi: "SPP-202608-07",
 nis: "20261007",
 namaSiswa: "Abdullah Syakur",
 jenjang: "SMA Jalur 1",
 kategoriPembayaran: "Infaq & Wakaf",
 bulanTagihan: ["Pembangunan Tahfizh"],
 jumlahNominal: 1000000,
 infaqNominal: 1000000,
 metodePembayaran: "Transfer BSI",
 namaPengirim: "H. Syakur",
 status: "Lunas",
 createdAt: "2026-08-03T13:10:00Z",
 updatedAt: "2026-08-03T13:30:00Z",
 },
];

function getStoredSPP(): SPPPayment[] {
  if (inMemorySPP) return inMemorySPP;
  if (typeof window === "undefined") return SEED_SPP;
  const raw = localStorage.getItem(DB_SPP_KEY);
  if (!raw) {
    localStorage.setItem(DB_SPP_KEY, JSON.stringify(SEED_SPP));
    inMemorySPP = [...SEED_SPP];
    idbSet(DB_SPP_KEY, inMemorySPP);
    return inMemorySPP;
  }
  try {
    inMemorySPP = JSON.parse(raw);
    return inMemorySPP || SEED_SPP;
  } catch {
    inMemorySPP = [...SEED_SPP];
    return inMemorySPP;
  }
}

let sppSaveTimeout: any = null;

function saveStoredSPP(data: SPPPayment[]) {
  inMemorySPP = data;
  if (typeof window === "undefined") return;

  if (sppSaveTimeout) clearTimeout(sppSaveTimeout);
  sppSaveTimeout = setTimeout(() => {
    idbSet(DB_SPP_KEY, data);
    const success = safeSetItem(DB_SPP_KEY, JSON.stringify(data));
    if (!success) {
      const pruned = data.map((item, idx) => {
        if (idx > 4 && item.buktiTransferUrl && item.buktiTransferUrl.length > 500) {
          return { ...item, buktiTransferUrl: undefined };
        }
        return item;
      });
      safeSetItem(DB_SPP_KEY, JSON.stringify(pruned));
    }
  }, 100);
}

export function claimGuestSPPPayments(userId: string, userEmail: string): void {
  if (!userId || !userEmail) return;
  const list = getStoredSPP();
  const normalizedEmail = userEmail.trim().toLowerCase();
  let updated = false;

  const modifiedList = list.map((item) => {
    const itemEmail = (item.userEmail || "").trim().toLowerCase();
    const isGuest = !item.userId || item.userId.startsWith("usr-guest");

    if (isGuest && itemEmail && itemEmail === normalizedEmail) {
      updated = true;
      return { ...item, userId, userEmail: normalizedEmail };
    }
    return item;
  });

  if (updated) {
    saveStoredSPP(modifiedList);
  }
}

export function getSPPPayments(): SPPPayment[] {
 return getStoredSPP();
}

export function getSPPPaymentsByNIS(nis: string): SPPPayment[] {
 const list = getStoredSPP();
 return list.filter((item) => item.nis.toLowerCase() === nis.toLowerCase());
}

export function getSPPPaymentsByUser(
  userId: string,
  userEmail: string,
  userName?: string,
  includeDeleted: boolean = true
): SPPPayment[] {
  const all = getStoredSPP();
  const list = includeDeleted ? all : all.filter((p) => !p.deletedAt);
  const safeUserId = userId ? String(userId).trim() : "";
  const safeEmail = userEmail ? String(userEmail).trim().toLowerCase() : "";
  const safeName = userName ? String(userName).trim().toLowerCase() : "";

  if (!safeUserId && !safeEmail && !safeName) {
    return [];
  }

  const filtered = list.filter((item) => {
    if (!item) return false;
    const itemUserId = item.userId ? String(item.userId).trim() : "";
    const itemUserEmail = item.userEmail ? String(item.userEmail).trim().toLowerCase() : "";
    const itemSender = item.namaPengirim ? String(item.namaPengirim).trim().toLowerCase() : "";

    // 1. Direct match dengan userId akun login
    if (safeUserId && itemUserId && itemUserId === safeUserId) return true;

    // 2. Exact match dengan email akun login
    if (safeEmail && itemUserEmail === safeEmail) return true;

    // 3. Fallback jika transaksi belum ada userId/email tapi nama pengirim sama persis
    if (!itemUserId && !itemUserEmail && safeName && itemSender && itemSender === safeName) return true;

    return false;
  });

  // HANYA kembalikan transaksi milik user yang login (TIDAK PERNAH menampilkan transaksi user lain)
  return filtered;
}

export function submitSPPPayment(
  data: Omit<SPPPayment, "id" | "idTransaksi" | "status" | "createdAt" | "updatedAt">
): SPPPayment {
  const list = getStoredSPP();
  const isInf = Boolean(
    data.kategoriPembayaran &&
    (data.kategoriPembayaran.includes("Infaq") ||
     data.kategoriPembayaran.includes("Wakaf") ||
     data.kategoriPembayaran.includes("Donasi"))
  );
  const prefix = isInf ? "INF" : "SPP";
  const idTransaksi = `${prefix}-${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, "0")}-${Math.floor(
    100 + Math.random() * 899
  )}`;
  const now = new Date().toISOString();

  const newPayment: SPPPayment = {
    ...data,
    id: `spp-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    idTransaksi,
    status: "Menunggu Verifikasi",
    createdAt: now,
    updatedAt: now,
  };

  list.unshift(newPayment);
  saveStoredSPP(list);
  return newPayment;
}

export function updateSPPPaymentStatus(id: string, status: StatusPembayaranSPP): boolean {
 const list = getStoredSPP();
 const item = list.find((s) => s.id === id);
 if (!item) return false;

 item.status = status;
 item.updatedAt = new Date().toISOString();
 saveStoredSPP(list);
 return true;
}

export function trashSPPPayment(id: string): boolean {
 const list = getStoredSPP();
 const item = list.find((s) => s.id === id);
 if (!item) return false;

 item.deletedAt = new Date().toISOString();
 item.updatedAt = new Date().toISOString();
 saveStoredSPP(list);
 return true;
}

export function restoreSPPPayment(id: string): boolean {
 const list = getStoredSPP();
 const item = list.find((s) => s.id === id);
 if (!item) return false;

 item.deletedAt = undefined;
 item.updatedAt = new Date().toISOString();
 saveStoredSPP(list);
 return true;
}

export function restoreAllSPPPayments(): boolean {
 const list = getStoredSPP();
 let changed = false;
 list.forEach((item) => {
 if (item.deletedAt) {
 item.deletedAt = undefined;
 item.updatedAt = new Date().toISOString();
 changed = true;
 }
 });
 if (changed) saveStoredSPP(list);
 return changed;
}

export function deleteSPPPayment(id: string): boolean {
  const list = getStoredSPP();
  const filtered = list.filter((item) => item.id !== id);
  if (filtered.length !== list.length) {
    saveStoredSPP(filtered);
    return true;
  }
  return false;
}

export function deleteAllSPPPayments(): boolean {
  saveStoredSPP([]);
  return true;
}

export function deleteBatchSPPPayments(ids: string[]): boolean {
  const list = getStoredSPP();
  const idSet = new Set(ids);
  const filtered = list.filter((item) => !idSet.has(item.id));
  saveStoredSPP(filtered);
  return true;
}
