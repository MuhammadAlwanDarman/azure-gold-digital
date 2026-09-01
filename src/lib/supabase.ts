import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
const supabaseAnonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Fail loud in dev so a missing .env is obvious instead of silently breaking every query.
  throw new Error(
    "Supabase belum dikonfigurasi. Pastikan VITE_SUPABASE_URL dan VITE_SUPABASE_ANON_KEY ada di file .env"
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storageKey: "zbt_supabase_auth",
  },
});

export type SupabaseClient = typeof supabase;

// =================================================================
// STORAGE — bucket "ppdb-documents" (PRIVATE)
// File diakses lewat signed URL (expiry 1 jam), bukan public URL.
// Konvensi path: {user_id}/{uuid}-{namafile}
// =================================================================

export const PPDB_BUCKET = "ppdb-documents";
const DEFAULT_SIGNED_TTL = 3600; // 1 jam

function sanitizeFileName(name: string): string {
  const dot = name.lastIndexOf(".");
  const base = (dot > 0 ? name.slice(0, dot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const ext = (dot > 0 ? name.slice(dot + 1) : "").toLowerCase().replace(/[^a-z0-9]/g, "");
  const safeBase = base || "file";
  return ext ? `${safeBase}.${ext}` : safeBase;
}

function randomId(): string {
  try {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

/** True kalau string sudah berupa URL/embed yang bisa dipakai langsung (data lama / seed). */
function isDirectUrl(value: string): boolean {
  return /^(https?:|data:|blob:)/i.test(value);
}

/**
 * Upload satu file ke bucket privat. Mengembalikan PATH/KEY objek (bukan URL).
 * Path inilah yang disimpan ke kolom file_url / bukti_reg_url / bukti_transfer_url.
 */
export async function uploadDocFile(file: File | Blob, userId: string): Promise<string> {
  const safeUser = (userId || "anon").trim() || "anon";
  const originalName =
    typeof (file as File).name === "string" && (file as File).name ? (file as File).name : "upload";
  const key = `${safeUser}/${randomId()}-${sanitizeFileName(originalName)}`;

  const { error } = await supabase.storage.from(PPDB_BUCKET).upload(key, file, {
    contentType: (file as File).type || "application/octet-stream",
    upsert: false,
  });

  if (error) {
    throw new Error(`Gagal mengunggah berkas: ${error.message}`);
  }
  return key;
}

/** Generate signed URL untuk 1 path. Path kosong / sudah URL langsung dilewatkan apa adanya. */
export async function signDocUrl(
  path: string | null | undefined,
  expiresIn: number = DEFAULT_SIGNED_TTL
): Promise<string> {
  if (!path) return "";
  if (isDirectUrl(path)) return path;

  const { data, error } = await supabase.storage.from(PPDB_BUCKET).createSignedUrl(path, expiresIn);
  if (error || !data?.signedUrl) return "";
  return data.signedUrl;
}

/**
 * Batch signed URL untuk banyak path sekaligus (dipakai saat membaca list).
 * Mengembalikan map { path -> signedUrl }. Path yang sudah berupa URL langsung
 * dipetakan ke dirinya sendiri.
 */
export async function signDocUrls(
  paths: Array<string | null | undefined>,
  expiresIn: number = DEFAULT_SIGNED_TTL
): Promise<Record<string, string>> {
  const out: Record<string, string> = {};
  const toSign = new Set<string>();

  for (const p of paths) {
    if (!p) continue;
    if (isDirectUrl(p)) {
      out[p] = p;
    } else {
      toSign.add(p);
    }
  }

  const unique = Array.from(toSign);
  const CHUNK = 100;
  for (let i = 0; i < unique.length; i += CHUNK) {
    const slice = unique.slice(i, i + CHUNK);
    const { data, error } = await supabase.storage
      .from(PPDB_BUCKET)
      .createSignedUrls(slice, expiresIn);
    if (error || !data) continue;
    data.forEach((entry) => {
      if (entry.path && entry.signedUrl) {
        out[entry.path] = entry.signedUrl;
      }
    });
  }

  return out;
}
