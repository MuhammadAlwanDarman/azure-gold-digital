import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "motion/react";
import {
  Archive,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Building2,
  CheckCircle2,
  Clock,
  Copy,
  CreditCard,
  Download,
  FileCheck,
  FileText,
  Filter,
  GraduationCap,
  Image as ImageIcon,
  Layers,
  Lock,
  LogIn,
  Printer,
  QrCode,
  Receipt,
  RotateCcw,
  Search,
  ShieldAlert,
  ShieldCheck,
  Shirt,
  Sparkles,
  Trash2,
  Truck,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  Utensils,
  Volume2,
  Wallet,
  X,
  XCircle,
  ZoomIn,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { AuroraBackground, Magnetic, Particles, Reveal, Stagger, StaggerItem, Tilt } from "@/components/site/effects";
import { MascotStage } from "@/components/site/MascotStage";
import { playPaymentSuccessSound, playCelebrationSound, firePaymentSuccessConfetti, fireCelebrationConfetti } from "@/lib/sound-effects";
import { SCHOOL } from "@/lib/school-data";
import {
  deleteSPPPayment,
  ensureUserAccountForPPDB,
  getCurrentSession,
  getSPPPayments,
  getSPPPaymentsByUser,
  KategoriPembayaran,
  restoreAllSPPPayments,
  restoreSPPPayment,
  SPPPayment,
  submitSPPPayment,
  subscribeToDB,
  trashSPPPayment,
  UserSession,
} from "@/lib/db";
import { uploadDocFile } from "@/lib/supabase";
import { useLanguage } from "@/lib/LanguageContext";
import { compressImageFile } from "@/lib/image-compression";

const ALLOWED_UPLOAD_MIME = ["image/jpeg", "image/png", "application/pdf"];
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** Kompres gambar jadi JPEG (hemat, patuh limit bucket); PDF diteruskan apa adanya. */
async function toUploadFile(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const dataUrl = await compressImageFile(file, 1400, 0.8);
    if (dataUrl.startsWith("data:image/jpeg")) {
      const blob = await (await fetch(dataUrl)).blob();
      const base = file.name.replace(/\.[^.]+$/, "") || "bukti";
      return new File([blob], `${base}.jpg`, { type: "image/jpeg" });
    }
  } catch {
    /* fallback ke file asli */
  }
  return file;
}

export const Route = createFileRoute("/spp")({
 head: () => ({
 meta: [
 { title: "Portal Keuangan & Pembayaran SPP Online — PKBM Zaid bin Tsabit" },
 {
 name: "description",
 content: "Portal Resmi Pembayaran SPP Bulanan, Uang Gedung, Seragam, Buku & Keuangan Online Sekolah Tahfizh Plus IT Zaid bin Tsabit.",
 },
 { property: "og:title", content: "Portal Keuangan Online — PKBM Zaid bin Tsabit" },
 { property: "og:description", content: "Layanan bayar SPP bulanan & keuangan sekolah praktis, transparan, dan terintegrasi." },
 { property: "og:type", content: "website" },
 ],
 }),
 component: SPPPage,
});

const BULAN_LIST = [
 { id: "Juli", label: "Juli" },
 { id: "Agustus", label: "Agustus" },
 { id: "September", label: "September" },
 { id: "Oktober", label: "Oktober" },
 { id: "November", label: "November" },
 { id: "Desember", label: "Desember" },
 { id: "Januari", label: "Januari" },
 { id: "Februari", label: "Februari" },
 { id: "Maret", label: "Maret" },
 { id: "April", label: "April" },
 { id: "Mei", label: "Mei" },
 { id: "Juni", label: "Juni" },
];

const SAMPLE_SISWA = [
  { nama: "Ahmad Fauzi", kelas: "Kelas 4A", jenjang: "SD", badge: "SD" },
  { nama: "Siti Maryam", kelas: "Kelas 8B", jenjang: "SMP Jalur 1", badge: "SMP-Diniyah" },
  { nama: "Muhammad Zaky", kelas: "Kelas 11 IPA", jenjang: "SMA Jalur 2", badge: "SMA-IT" },
  { nama: "Aisyah Humaira", kelas: "TK-B", jenjang: "TK", badge: "TK" },
  { nama: "Yusuf Al-Fatih", kelas: "Kelas 2B", jenjang: "SD", badge: "SD" },
  { nama: "Annisa Rahma", kelas: "Kelas 9A", jenjang: "SMP Jalur 2", badge: "SMP-IT" },
  { nama: "Abdullah Syakur", kelas: "Kelas 12 IPS", jenjang: "SMA Jalur 1", badge: "SMA-1" },
];

const KATEGORI_CONFIG: { id: any; label: string; icon: any; desc: string }[] = [
  { id: "SPP Bulanan", label: "SPP Bulanan", icon: CreditCard, desc: "Iuran rutin SPP reguler setiap bulan" },
  { id: "SPP Bulanan Boarding", label: "SPP Bulanan Boarding", icon: Building2, desc: "Iuran SPP & asrama santri boarding" },
  { id: "Biaya Pendidikan", label: "Biaya Pendidikan", icon: Layers, desc: "Biaya pendaftaran / sarana pendidikan" },
  { id: "Seragam & Atribut", label: "Seragam & Atribut", icon: Shirt, desc: "Paket seragam & atribut resmi Ananda" },
  { id: "Buku Paket & Kitab", label: "Buku Paket & Kitab", icon: BookOpen, desc: "Buku pembelajaran umum & kitab tahfizh" },
  { id: "Sampul Rapor", label: "Sampul Rapor", icon: FileCheck, desc: "Biaya sampul & berkas rapor Ananda" },
  { id: "Kegiatan & Eskul", label: "Kegiatan & Eskul", icon: Users, desc: "Outing class, ekstra, & kegiatan Ananda" },
  { id: "Ujian Pendidikan Kesetaraan", label: "Ujian Pendidikan Kesetaraan", icon: GraduationCap, desc: "Biaya pelaksanaan ujian UPK kesetaraan" },
  { id: "Lain-lain", label: "Keperluan Lain", icon: Receipt, desc: "Pembayaran administrasi khusus lainnya" },
];

function handlePrintKuitansi(item: SPPPayment) {
  const safeBulanTagihan = Array.isArray(item.bulanTagihan) && item.bulanTagihan.length > 0 ? item.bulanTagihan : [item.kategoriPembayaran || "Pembayaran"];
  const kategoriName = item.kategoriPembayaran || "SPP Bulanan";

  const printWindow = window.open("", "_blank");
  if (!printWindow) return;

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="id">
    <head>
      <meta charset="UTF-8">
      <title>Kuitansi Pembayaran - ${item.idTransaksi} - PKBM Zaid bin Tsabit</title>
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
          <div class="receipt-title">KUITANSI PEMBAYARAN SISWA SISWI RESMI</div>
        </div>
        <table class="meta-table">
          <tr><td class="meta-label">No. Transaksi:</td><td class="meta-value">${item.idTransaksi}</td></tr>
          <tr><td class="meta-label">Tanggal Transaksi:</td><td class="meta-value">${new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WITA</td></tr>
          <tr><td class="meta-label">Kelas / NIS:</td><td class="meta-value">${item.nis || "-"}</td></tr>
          <tr><td class="meta-label">Nama Siswa Siswi:</td><td class="meta-value">${item.namaSiswa || "-"}</td></tr>
          <tr><td class="meta-label">Jenjang:</td><td class="meta-value">${item.jenjang || "-"}</td></tr>
          <tr><td class="meta-label">Kategori:</td><td class="meta-value">${kategoriName}</td></tr>
          <tr><td class="meta-label">Metode Pembayaran:</td><td class="meta-value">${item.metodePembayaran || "Transfer"} (${item.namaPengirim || "-"})</td></tr>
        </table>
        <table class="fee-table">
          <thead>
            <tr>
              <th>Rincian Kategori & Item Pembayaran</th>
              <th style="text-align: right;">Nominal (Rp)</th>
            </tr>
          </thead>
          <tbody>
            ${
              item.kategoriPembayaran === "SPP Bulanan" || !item.kategoriPembayaran
                ? safeBulanTagihan.map((b) => `
                    <tr>
                      <td>Pembayaran SPP Bulan ${b}</td>
                      <td style="text-align: right; font-weight: 600;">Rp ${((item.jumlahNominal - (item.infaqNominal || 0)) / safeBulanTagihan.length).toLocaleString("id-ID")}</td>
                    </tr>
                  `).join("")
                : `
                    <tr>
                      <td>${kategoriName} — (${safeBulanTagihan.join(", ")})</td>
                      <td style="text-align: right; font-weight: 600;">Rp ${(item.jumlahNominal - (item.infaqNominal || 0)).toLocaleString("id-ID")}</td>
                    </tr>
                  `
            }
            ${item.infaqNominal && item.infaqNominal > 0 ? `<tr><td>Infaq & Donasi Sukarela</td><td style="text-align: right; font-weight: 600;">Rp ${item.infaqNominal.toLocaleString("id-ID")}</td></tr>` : ""}
            <tr class="total-row">
              <td style="padding: 12px 10px;">TOTAL KESELURUHAN DIBAYAR</td>
              <td style="text-align: right; padding: 12px 10px;">Rp ${item.jumlahNominal.toLocaleString("id-ID")}</td>
            </tr>
          </tbody>
        </table>
        <div style="text-align: center;"><div class="status-stamp">${item.status}</div></div>
        <div class="footer-note">Kuitansi ini diterbitkan secara elektronik dan sah sebagai bukti pembayaran resmi.</div>
      </div>
      <script>setTimeout(() => { window.print(); }, 500);</script>
    </body>
    </html>
  `;
  printWindow.document.write(htmlContent);
  printWindow.document.close();
}

function handlePrintRekap(payments: SPPPayment[]) {
 const printWindow = window.open("", "_blank");
 if (!printWindow) return;

 const totalLunas = payments.filter((p) => p.status === "Lunas").reduce((acc, p) => acc + p.jumlahNominal, 0);

 const htmlContent = `
 <!DOCTYPE html>
 <html lang="id">
 <head>
 <meta charset="UTF-8">
 <title>Laporan Rekap Pembayaran Keuangan PKBM Zaid bin Tsabit</title>
 <style>
 body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; color: #0f172a; background: #fff; }
 .header { text-align: center; border-bottom: 2px solid #0f172a; padding-bottom: 15px; margin-bottom: 20px; }
 .title { font-size: 20px; font-weight: 800; text-transform: uppercase; }
 .subtitle { font-size: 13px; color: #0284c7; font-weight: bold; margin-top: 4px; }
 .summary-box { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #cbd5e1; padding: 12px 20px; border-radius: 8px; margin-bottom: 20px; font-size: 13px; }
 table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 12px; }
 th { background: #0f172a; color: #fff; padding: 10px 8px; text-align: left; }
 td { border-bottom: 1px solid #e2e8f0; padding: 8px; }
 tr:nth-child(even) { background: #f8fafc; }
 .status-lunas { color: #16a34a; font-weight: bold; }
 .status-pending { color: #d97706; font-weight: bold; }
 .status-ditolak { color: #dc2626; font-weight: bold; }
 @media print {
 .no-print { display: none; }
 }
 </style>
 </head>
 <body>
 <div class="no-print" style="text-align: right; margin-bottom: 15px;">
 <button onclick="window.print()" style="background: #0284c7; color: white; border: none; padding: 8px 18px; border-radius: 20px; font-weight: bold; cursor: pointer;">️ Cetak / Simpan Rekap PDF</button>
 </div>
 <div class="header">
 <div class="title">SEKOLAH TAHFIZH PLUS IT ZAID BIN TSABIT</div>
 <div class="subtitle">REKAPITULASI TRANSAKSI PEMBAYARAN KEUANGAN SEKOLAH</div>
 <div style="font-size: 11px; color: #64748b; margin-top: 5px;">Dicetak pada: ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })} WITA</div>
 </div>

 <div class="summary-box">
 <div><strong>Total Transaksi Ditampilkan:</strong> ${payments.length} Data</div>
 <div><strong>Total Terkumpul (Lunas):</strong> <span style="color: #16a34a; font-weight: 800;">Rp ${totalLunas.toLocaleString("id-ID")}</span></div>
 </div>

 <table>
 <thead>
 <tr>
 <th>No. Transaksi</th>
 <th>NIS</th>
 <th>Nama Siswa Siswi</th>
 <th>Jenjang</th>
 <th>Kategori Pembayaran</th>
 <th>Keterangan</th>
 <th>Nominal (Rp)</th>
 <th>Metode</th>
 <th>Status</th>
 </tr>
 </thead>
 <tbody>
 ${payments
 .map(
 (p) => `
 <tr>
 <td style="font-family: monospace; font-weight: bold;">${p.idTransaksi}</td>
 <td>${p.nis}</td>
 <td><strong>${p.namaSiswa}</strong></td>
 <td>${p.jenjang}</td>
 <td style="color: #0284c7; font-weight: 600;">${p.kategoriPembayaran || "SPP Bulanan"}</td>
 <td>${p.bulanTagihan.join(", ")}</td>
 <td style="font-weight: bold;">Rp ${p.jumlahNominal.toLocaleString("id-ID")}</td>
 <td>${p.metodePembayaran}</td>
 <td class="${p.status === "Lunas" ? "status-lunas" : p.status === "Ditolak" ? "status-ditolak" : "status-pending"}">${p.status}</td>
 </tr>
 `
 )
 .join("")}
 </tbody>
 </table>

 <div style="margin-top: 40px; display: flex; justify-content: space-between; font-size: 12px; color: #475569;">
 <div>PKBM Zaid bin Tsabit — Samarinda</div>
 <div style="text-align: center;">
 <div>Samarinda, ${new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
 <div style="margin-top: 40px; font-weight: bold; color: #0f172a; border-bottom: 1px solid #0f172a; padding-bottom: 2px;">Bendahara Keuangan Sekolah</div>
 </div>
 </div>

 <script>
 setTimeout(() => { window.print(); }, 400);
 </script>
 </body>
 </html>
 `;

 printWindow.document.write(htmlContent);
 printWindow.document.close();
}

function SPPPage() {
  const { t } = useLanguage();
  const [session, setSession] = useState<UserSession | null>(null);
  const [copied, setCopied] = useState(false);

  // Form State
  const [namaSiswa, setNamaSiswa] = useState("");
  const [kelas, setKelas] = useState("");
  const [jenjang, setJenjang] = useState("SD");
  const [kategoriPembayaran, setKategoriPembayaran] = useState<string>("SPP Bulanan");
  const [selectedBulan, setSelectedBulan] = useState<string[]>(["Agustus"]);
  const [customNominal, setCustomNominal] = useState<number>(0);
  const [metode, setMetode] = useState("Bank Syariah Indonesia (BSI) — SPP SD (7797737757)");
  const [namaPengirim, setNamaPengirim] = useState("");
  const [catatan, setCatatan] = useState("");
  const [buktiUrl, setBuktiUrl] = useState("");
  const [buktiFile, setBuktiFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [successPayment, setSuccessPayment] = useState<SPPPayment | null>(null);
  const [zoomImg, setZoomImg] = useState<{ title: string; url: string } | null>(null);

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

  // Search & History Tab State
  const [searchNis, setSearchNis] = useState("");
  const [filterKategori, setFilterKategori] = useState<string>("Semua");
  const [filterJenjang, setFilterJenjang] = useState<string>("Semua");
  const [filterStatus, setFilterStatus] = useState<string>("Semua");
  const [historyList, setHistoryList] = useState<SPPPayment[]>([]);
  const [historyTab, setHistoryTab] = useState<"active" | "trash">("active");

  const loadPayments = async (currentSession: UserSession | null) => {
    if (!currentSession) {
      setHistoryList([]);
      return;
    }
    try {
      if (currentSession.role === "admin") {
        setHistoryList(await getSPPPayments());
      } else {
        setHistoryList(
          await getSPPPaymentsByUser(currentSession.userId, currentSession.email, currentSession.name, true)
        );
      }
    } catch (err) {
      console.error("Gagal memuat data pembayaran:", err);
    }
  };

  useEffect(() => {
    const sess = getCurrentSession();
    setSession(sess);
    loadPayments(sess);

    return subscribeToDB(() => {
      const updatedSess = getCurrentSession();
      setSession(updatedSess);
      loadPayments(updatedSess);
    });
  }, []);

  const handleQuickFillSiswa = (s: (typeof SAMPLE_SISWA)[0]) => {
    setNamaSiswa(s.nama);
    setKelas(s.kelas);
    setJenjang(s.jenjang);
  };

  const nominalInputRef = useRef<HTMLInputElement>(null);

  const handleKategoriChange = (kat: string) => {
    setKategoriPembayaran(kat);
    if (kat === "SPP Bulanan" || kat === "SPP Bulanan Boarding") {
      setTimeout(() => {
        nominalInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        nominalInputRef.current?.focus();
      }, 150);
    }
  };

  const handleTrashItem = async (id: string) => {
    try {
      await trashSPPPayment(id);
      await loadPayments(getCurrentSession() || session);
    } catch (err) {
      alert(t("Gagal memindahkan ke sampah: ", "Failed to move to trash: ") + (err as Error).message);
    }
  };

  const handleRestoreItem = async (id: string) => {
    try {
      await restoreSPPPayment(id);
      await loadPayments(getCurrentSession() || session);
    } catch (err) {
      alert(t("Gagal memulihkan data: ", "Failed to restore: ") + (err as Error).message);
    }
  };

  const handleRestoreAll = async () => {
    try {
      await restoreAllSPPPayments();
      await loadPayments(getCurrentSession() || session);
    } catch (err) {
      alert(t("Gagal memulihkan semua data: ", "Failed to restore all: ") + (err as Error).message);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    if (confirm(t("Apakah Anda yakin ingin menghapus permanen riwayat transaksi SPP ini?", "Are you sure you want to permanently delete this SPP transaction history?"))) {
      try {
        await deleteSPPPayment(id);
        await loadPayments(getCurrentSession() || session);
      } catch (err) {
        alert(t("Gagal menghapus data: ", "Failed to delete: ") + (err as Error).message);
      }
    }
  };

  const [infaqNominal, setInfaqNominal] = useState<number>(0);
  const [customInfaq, setCustomInfaq] = useState<string>("");

  const isSPP = kategoriPembayaran === "SPP Bulanan" || kategoriPembayaran === "SPP Bulanan Boarding";
  const sppNominal = isSPP ? (customNominal || 0) * selectedBulan.length : (customNominal || 0);
  const totalPembayaran = sppNominal + (infaqNominal || 0);

  const toggleBulan = (id: string) => {
    setSelectedBulan((prev) => {
      const next = prev.includes(id) ? prev.filter((b) => b !== id) : [...prev, id];
      const bulanOrder = BULAN_LIST.map((b) => b.id);
      return next.sort((a, b) => bulanOrder.indexOf(a) - bulanOrder.indexOf(b));
    });
  };

  const handleCopyAccount = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!ALLOWED_UPLOAD_MIME.includes(file.type)) {
      alert(t("Format berkas harus JPG, PNG, atau PDF.", "File must be JPG, PNG, or PDF."));
      e.target.value = "";
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      alert(t("Ukuran berkas maksimal 10 MB.", "Maximum file size is 10 MB."));
      e.target.value = "";
      return;
    }
    try {
      const prepared = await toUploadFile(file);
      setBuktiFile(prepared);
      setBuktiUrl(URL.createObjectURL(prepared));
    } catch (err) {
      console.error("Gagal memproses berkas:", err);
      alert(t("Gagal memproses berkas. Coba berkas lain.", "Failed to process file. Try another file."));
    }
  };

  const handleSubmitPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    if (!namaSiswa.trim() || !kelas.trim() || !namaPengirim.trim()) {
      alert(t("Mohon lengkapi Nama Siswa, Kelas Siswa, dan Nama Pengirim.", "Please complete Student Name, Student Class, and Sender Name."));
      return;
    }

    if (isSPP && selectedBulan.length === 0) {
      alert(t("Mohon pilih minimal satu bulan tagihan SPP.", "Please select at least one SPP target month."));
      return;
    }

    if (customNominal <= 0) {
      alert(t("Mohon isi nominal pembayaran.", "Please enter the payment amount."));
      return;
    }

    if (!buktiFile && !buktiUrl) {
      alert(t("Mohon unggah / lampirkan Foto Bukti Transfer pembayaran terlebih dahulu (Wajib).", "Please upload / attach Transfer Receipt photo first (Required)."));
      return;
    }

    setSubmitting(true);
    try {
      const tagihanInfo = isSPP ? selectedBulan : [kategoriPembayaran];
      const noteWithInfaq = infaqNominal > 0
        ? [catatan.trim(), `(Termasuk Infaq: Rp ${infaqNominal.toLocaleString("id-ID")})`].filter(Boolean).join(" — ")
        : catatan.trim() || undefined;

      // 1. Pastikan ada sesi (guest → buat akun Supabase otomatis).
      let curSession = getCurrentSession() || session;
      if (!curSession?.userId) {
        curSession = await ensureUserAccountForPPDB(
          namaPengirim.trim() || namaSiswa.trim() || "Wali Murid",
          `${kelas.trim() || Date.now()}@parent.pkbm`,
          ""
        );
      }

      // 2. Upload bukti transfer ke Supabase Storage (bucket privat).
      let buktiPath = "";
      if (buktiFile) {
        buktiPath = await uploadDocFile(buktiFile, curSession.userId);
      }

      const payload: Omit<SPPPayment, "id" | "idTransaksi" | "status" | "createdAt" | "updatedAt"> = {
        nis: kelas.trim(),
        namaSiswa: namaSiswa.trim(),
        jenjang,
        kategoriPembayaran,
        bulanTagihan: tagihanInfo,
        jumlahNominal: totalPembayaran,
        metodePembayaran: metode,
        namaPengirim: namaPengirim.trim(),
        buktiTransferUrl: buktiPath || undefined,
        catatan: noteWithInfaq,
        userId: curSession.userId,
        userEmail: curSession.email,
      };

      // HANYA SUBMIT SATU KALI (TIDAK ADA TRANSAKSI GANDA/DOUBLE)
      const payment = await submitSPPPayment(payload);

      setSuccessPayment(payment);
      await loadPayments(getCurrentSession() || session);
      playPaymentSuccessSound();
      firePaymentSuccessConfetti();

      // Reset form fields
      setNamaSiswa("");
      setKelas("");
      setNamaPengirim("");
      setCatatan("");
      setBuktiUrl("");
      setBuktiFile(null);
      setInfaqNominal(0);
      setCustomInfaq("");
      setCustomNominal(0);
    } catch (err) {
      console.error("Payment submission error:", err);
      alert(
        (err as Error).message ||
          t("Gagal mengirim pembayaran. Silakan coba lagi.", "Failed to submit payment. Please try again.")
      );
    } finally {
      setSubmitting(false);
    }
  };

 // Active payments filter
 const activePayments = historyList
 .filter((item) => !item.deletedAt)
 .filter((item) => {
 if (searchNis.trim()) {
 const q = searchNis.toLowerCase().trim();
 const matchNis = item.nis?.toLowerCase().includes(q);
 const matchNama = item.namaSiswa?.toLowerCase().includes(q);
 const matchId = item.idTransaksi?.toLowerCase().includes(q);
 const matchKat = (item.kategoriPembayaran || "SPP Bulanan").toLowerCase().includes(q);
 const matchPengirim = item.namaPengirim?.toLowerCase().includes(q);
 const matchStatus = item.status?.toLowerCase().includes(q);
 const matchJenjang = item.jenjang?.toLowerCase().includes(q);
 const matchKelas = item.kelas?.toLowerCase().includes(q);
 const matchBulan = Array.isArray(item.bulanTagihan) ? item.bulanTagihan.some((b) => b.toLowerCase().includes(q)) : false;

 if (!matchNis && !matchNama && !matchId && !matchKat && !matchPengirim && !matchStatus && !matchJenjang && !matchKelas && !matchBulan) {
 return false;
 }
 }
 if (filterKategori !== "Semua") {
 const kat = item.kategoriPembayaran || "SPP Bulanan";
 if (kat !== filterKategori) return false;
 }
 if (filterJenjang !== "Semua") {
 if (!item.jenjang?.toLowerCase().includes(filterJenjang.toLowerCase())) return false;
 }
 if (filterStatus !== "Semua") {
 if (item.status !== filterStatus) return false;
 }
 return true;
 });

 const trashedPayments = historyList
 .filter((item) => !!item.deletedAt)
 .filter((item) => {
 if (searchNis.trim()) {
 const q = searchNis.toLowerCase().trim();
 const matchNis = item.nis?.toLowerCase().includes(q);
 const matchNama = item.namaSiswa?.toLowerCase().includes(q);
 const matchId = item.idTransaksi?.toLowerCase().includes(q);
 const matchKat = (item.kategoriPembayaran || "SPP Bulanan").toLowerCase().includes(q);
 if (!matchNis && !matchNama && !matchId && !matchKat) return false;
 }
 if (filterKategori !== "Semua") {
 const kat = item.kategoriPembayaran || "SPP Bulanan";
 if (kat !== filterKategori) return false;
 }
 if (filterJenjang !== "Semua") {
 if (!item.jenjang?.toLowerCase().includes(filterJenjang.toLowerCase())) return false;
 }
 if (filterStatus !== "Semua") {
 if (item.status !== filterStatus) return false;
 }
 return true;
 });

 // Financial Stats Calculation
 const allActive = historyList.filter((item) => !item.deletedAt);
 const totalNominalLunas = allActive.filter((p) => p.status === "Lunas").reduce((acc, p) => acc + p.jumlahNominal, 0);
 const countLunas = allActive.filter((p) => p.status === "Lunas").length;
 const countPending = allActive.filter((p) => p.status === "Menunggu Verifikasi").length;

 return (
 <>
 {/* Banner Header */}
 <section className="relative flex min-h-[55vh] items-center overflow-hidden bg-navy-deep pb-16 pt-32 sm:pt-36">
 <Particles count={24} />
 <AuroraBackground />
 <div className="relative mx-auto w-full max-w-7xl px-5 text-primary-foreground">
 <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
 <div className="lg:col-span-7">
 <Reveal variant="blur">
 <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-emerald-400">
 {t("Portal Keuangan Resmi & SPP Online", "Official Financial & SPP Portal")}
 </span>
 </Reveal>
 <Reveal variant="up" delay={0.1}>
 <h1 className="mt-5 text-4xl font-extrabold sm:text-6xl leading-tight">
 {t("Pembayaran Keuangan & SPP", "Tuition & Finance Payment")}{" "}
 <span className="text-gold-gradient animate-shimmer">{t("Online", "Online")}</span>
 </h1>
 </Reveal>
 <Reveal variant="up" delay={0.18}>
 <p className="mt-4 max-w-2xl text-primary-foreground/80 leading-relaxed text-base sm:text-lg">
 {t(
 "Layanan resmi pembayaran SPP bulanan, Uang Gedung, Seragam, Buku, Katering & Infaq siswa siswi Sekolah Tahfizh Plus IT Zaid bin Tsabit secara cepat, praktis, dan transparan.",
 "Official portal for SPP tuition, enrollment fees, uniforms, books, catering, and voluntary infaq."
 )}
 </p>
 </Reveal>
 <Reveal variant="up" delay={0.25}>
 <div className="mt-8 flex flex-wrap items-center gap-3 text-xs font-semibold text-primary-foreground/90">
 <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/15">
 <CheckCircle2 className="h-4 w-4 text-emerald-400" />
 <span>{t("Verifikasi Admin", "Admin Verification")}</span>
 </div>
 <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/15">
 <ShieldCheck className="h-4 w-4 text-gold" />
 <span>Aman & Terpercaya</span>
 </div>
 <div className="flex items-center gap-2 rounded-xl bg-white/10 px-3.5 py-2 backdrop-blur-md border border-white/15">
 <Receipt className="h-4 w-4 text-blue-400" />
 <span>Cetak Kuitansi Rekap</span>
 </div>
 </div>
 </Reveal>
 </div>

 <div className="lg:col-span-5">
 <Reveal variant="blur" delay={0.2}>
 <MascotStage />
 </Reveal>
 </div>
 </div>
 </div>
 </section>

 {!session ? (
 <section id="spp-payment-section" className="py-24 bg-mist">
 <div className="mx-auto max-w-4xl px-5">
 <Reveal variant="blur">
 <div className="relative rounded-3xl border border-gold/30 bg-card/95 p-8 shadow-luxe backdrop-blur-md sm:p-12 text-center">
 <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-gold/15 text-gold border border-gold/40 shadow-gold">
 <Lock className="h-10 w-10 text-gold" />
 </div>

 <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-destructive/30 bg-destructive/10 px-3.5 py-1 text-xs font-bold text-destructive">
 <ShieldAlert className="h-3.5 w-3.5" />
 {t("Wajib Buat / Masuk Akun", "Account Required")}
 </span>

 <h2 className="mt-4 text-2xl font-extrabold text-foreground sm:text-3xl">
 {t("Harus Punya Akun Sebelum Mengakses Pembayaran SPP", "Must Have an Account Before Accessing SPP Payment")}
 </h2>

 <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-2xl mx-auto">
 {t(
 "Untuk melakukan transaksi pembayaran SPP bulanan, iuran sekolah, serta melihat riwayat transaksi siswa siswi, Anda diwajibkan untuk mendaftar atau masuk ke akun Orang Tua terlebih dahulu.",
 "To pay monthly SPP tuition, school fees, and view student transaction history, please sign in or register a Parent account first."
 )}
 </p>

 {/* Feature Benefit Breakdown */}
 <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
 <div className="rounded-2xl border border-border bg-background/50 p-4 transition-all hover:border-gold/50">
 <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/10 text-gold font-bold text-xs mb-2">
 01
 </div>
 <p className="text-xs font-bold text-foreground">{t("Riwayat Terdaftar", "Registered History")}</p>
 <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
 {t("Seluruh bukti pembayaran SPP tersimpan otomatis di akun Anda.", "All SPP payment receipts are saved automatically in your account.")}
 </p>
 </div>
 <div className="rounded-2xl border border-border bg-background/50 p-4 transition-all hover:border-gold/50">
 <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/10 text-gold font-bold text-xs mb-2">
 02
 </div>
 <p className="text-xs font-bold text-foreground">{t("Verifikasi Admin", "Admin Verification")}</p>
 <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
 {t("Status konfirmasi pembayaran diverifikasi langsung oleh Bendahara Admin.", "Payment status is verified directly by the Treasurer Admin.")}
 </p>
 </div>
 <div className="rounded-2xl border border-border bg-background/50 p-4 transition-all hover:border-gold/50">
 <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gold/10 text-gold font-bold text-xs mb-2">
 03
 </div>
 <p className="text-xs font-bold text-foreground">{t("Cetak Kuitansi", "Print Receipt")}</p>
 <p className="mt-1 text-[11px] text-muted-foreground leading-snug">
 {t("Unduh dan cetak kuitansi pembayaran resmi kapan saja.", "Download and print official payment receipts anytime.")}
 </p>
 </div>
 </div>

 {/* Action Buttons */}
 <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
 <Magnetic>
 <Link
 to="/masuk"
 search={{ tab: "daftar" }}
 className="light-sweep flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-gradient-to-r from-gold-soft to-gold px-8 py-4 text-sm font-extrabold uppercase tracking-wide text-navy-deep shadow-gold transition-all"
>
 <UserPlus className="h-4 w-4" />
 {t("Buat Akun Baru Sekarang", "Create New Account Now")}
 <ArrowRight className="h-4 w-4" />
 </Link>
 </Magnetic>
 <Magnetic>
 <Link
 to="/masuk"
 search={{ tab: "masuk" }}
 className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-full border border-border bg-background px-7 py-4 text-sm font-bold uppercase tracking-wide text-foreground transition-all hover:border-gold hover:text-gold"
>
 <LogIn className="h-4 w-4" />
 {t("Sudah Punya Akun? Masuk", "Already Have Account? Sign In")}
 </Link>
 </Magnetic>
 </div>
 </div>
 </Reveal>
 </div>
 </section>
 ) : (
 <>
 {/* Financial Summary Dashboard Stats */}
 <section className="relative -mt-8 z-10 mx-auto max-w-7xl px-5">
 <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
 <div className="rounded-3xl border border-gold/30 bg-card p-5 shadow-luxe flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold shrink-0">
 <Wallet className="h-6 w-6" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground font-semibold">
 {session?.role === "admin"
 ? t("Total Terkumpul (Lunas)", "Total Collected (Paid)")
 : t("Total Pembayaran Anda (Lunas)", "Your Total Payments (Paid)")}
 </p>
 <p className="text-xl font-black text-emerald-500 mt-0.5">
 Rp {totalNominalLunas.toLocaleString("id-ID")}
 </p>
 </div>
 </div>

 <div className="rounded-3xl border border-emerald-500/30 bg-card p-5 shadow-luxe flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500 shrink-0">
 <CheckCircle2 className="h-6 w-6" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground font-semibold">
 {session?.role === "admin"
 ? t("Transaksi Lunas", "Paid Transactions")
 : t("Transaksi Lunas Anda", "Your Paid Transactions")}
 </p>
 <p className="text-xl font-black text-foreground mt-0.5">
 {countLunas} <span className="text-xs font-normal text-muted-foreground">{t("Transaksi", "Items")}</span>
 </p>
 </div>
 </div>

 <div className="rounded-3xl border border-amber-500/30 bg-card p-5 shadow-luxe flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500 shrink-0">
 <Clock className="h-6 w-6" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground font-semibold">{t("Menunggu Verifikasi", "Pending Verification")}</p>
 <p className="text-xl font-black text-amber-500 mt-0.5">
 {countPending} <span className="text-xs font-normal text-muted-foreground">{t("Transaksi", "Items")}</span>
 </p>
 </div>
 </div>

 <div className="rounded-3xl border border-blue-500/30 bg-card p-5 shadow-luxe flex items-center gap-4">
 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 shrink-0">
 <Users className="h-6 w-6" />
 </div>
 <div>
 <p className="text-xs text-muted-foreground font-semibold">
 {session?.role === "admin"
 ? t("Total Pembayar Terdaftar", "Total Registered Payers")
 : t("Total Riwayat Transaksi", "Your Transaction Records")}
 </p>
 <p className="text-xl font-black text-foreground mt-0.5">
 {allActive.length} <span className="text-xs font-normal text-muted-foreground">{session?.role === "admin" ? t("Siswa Siswi", "Students") : t("Transaksi", "Records")}</span>
 </p>
 </div>
 </div>
 </div>
 </section>

 {/* Main Content Area */}
 <section id="spp-payment-section" className="relative overflow-hidden py-16 bg-background">
 <div className="mx-auto max-w-7xl px-5">
 <div className="grid gap-12 lg:grid-cols-12">
 {/* Form Column (Left 7 Cols) */}
 <div className="lg:col-span-7">
 <Reveal variant="left">
 <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-luxe">
 <div className="flex items-center justify-between border-b border-border pb-5 mb-6">
 <div className="flex items-center gap-3">
 <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gold/10 text-gold">
 <Receipt className="h-6 w-6" />
 </div>
 <div>
 <h2 className="text-xl font-extrabold text-foreground">
 {t("Form Bayar Keuangan & SPP", "School Payment Form")}
 </h2>
 <p className="text-xs text-muted-foreground">
 {t("Isi data siswa siswi, pilih kategori pembayaran, dan lakukan konfirmasi.", "Fill student details and select payment categories.")}
 </p>
 </div>
 </div>
 </div>

 <form onSubmit={handleSubmitPayment} className="space-y-6">
 {/* Step 1: Data Siswa */}
 <div className="space-y-4">
 <h3 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
 <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-navy text-[10px] font-black">1</span>
 {t("Data Siswa Siswi", "Student Details")}
 </h3>

 <div className="grid gap-4 sm:grid-cols-2">
 <div>
 <label className="block text-xs font-semibold text-foreground mb-1.5">
 {t("Nama Lengkap Siswa", "Full Student Name")} *
 </label>
 <input
 type="text"
 required
 placeholder="Nama Lengkap Siswa Siswi"
 value={namaSiswa}
 onChange={(e) => setNamaSiswa(e.target.value)}
 className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-foreground mb-1.5">
 {t("Kelas Siswa", "Student Class")} *
 </label>
 <input
 type="text"
 required
 placeholder="Contoh: Kelas 7A / Kelas B"
 value={kelas}
 onChange={(e) => setKelas(e.target.value)}
 className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
 />
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-foreground mb-1.5">
 {t("Jenjang Pendidikan", "Education Level")} *
 </label>
 <select
 value={jenjang}
 onChange={(e) => setJenjang(e.target.value)}
 className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
>
 <option value="TK">TK (Kindergarten)</option>
 <option value="Setara SD">Setara SD (Elementary)</option>
 <option value="Setara SMP Jalur 1">Setara SMP Jalur 1 (Full Diniyah + Komputer)</option>
 <option value="Setara SMP Jalur 2">Setara SMP Jalur 2 (Full Diniyah + Full IT)</option>
 <option value="Setara SMA Jalur 1">Setara SMA Jalur 1 (Full Diniyah + Komputer)</option>
 <option value="Setara SMA Jalur 2">Setara SMA Jalur 2 (Full Diniyah + Full IT)</option>
 </select>
 </div>
 </div>

        {/* Step 2: Kategori Pembayaran */}
        <div className="space-y-4 pt-4 border-t border-border">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-navy text-[10px] font-black">2</span>
            {t("Pilih Jenis / Kategori Pembayaran", "Select Payment Category")} *
          </h3>

          <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
            {KATEGORI_CONFIG.map((kat) => {
              const isSelected = kategoriPembayaran === kat.id;
              const IconComponent = kat.icon;
              return (
                <button
                  type="button"
                  key={kat.id}
                  onClick={() => handleKategoriChange(kat.id)}
                  className={`flex flex-col items-start justify-between rounded-2xl border p-3.5 text-left transition-all cursor-pointer ${
                    isSelected
                      ? "border-gold bg-gold/15 text-gold shadow-md font-bold ring-2 ring-gold/40"
                      : "border-border bg-background text-muted-foreground hover:border-foreground/30 hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <IconComponent className="h-4 w-4 text-gold shrink-0" />
                    <span className="text-xs">{kat.label}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground leading-tight line-clamp-1">{kat.desc}</span>
                </button>
              );
            })}
          </div>

          {/* Detail & Input Fields */}
          {isSPP ? (
            <div className="space-y-4 pt-2">
              {/* Nominal Per Bulan Input */}
              <div className="space-y-2 rounded-2xl border border-gold/40 bg-gold/5 p-4">
                <label className="block text-xs font-extrabold text-gold flex flex-wrap items-center justify-between gap-1">
                  <span>
                    {t(`Isi Nominal ${kategoriPembayaran} Per Bulan (Rp)`, `${kategoriPembayaran} Amount Per Month (Rp)`)} *
                  </span>
                  {customNominal > 0 && (
                    <span className="text-[11px] font-bold text-emerald-400">
                      Rp {customNominal.toLocaleString("id-ID")}/bulan
                    </span>
                  )}
                </label>
                <input
                  ref={nominalInputRef}
                  type="number"
                  required
                  min={1}
                  placeholder="Contoh: 750000"
                  value={customNominal === 0 ? "" : customNominal}
                  onChange={(e) => setCustomNominal(Number(e.target.value))}
                  className="w-full rounded-2xl border-2 border-gold/60 bg-background px-4 py-3 text-sm font-black text-foreground focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/40 transition-all"
                />
                <p className="text-[11px] text-muted-foreground">
                  {t("Sistem akan otomatis menghitung total berdasarkan jumlah bulan yang Anda pilih di bawah.", "The system will automatically calculate total based on target months selected below.")}
                </p>
              </div>

              {/* Month Selection Buttons */}
              <div className="space-y-3 pt-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-foreground">
                    {t("Pilih Bulan Tagihan SPP", "Select SPP Target Months")} *
                  </label>
                  {customNominal > 0 ? (
                    <span className="text-[11px] text-gold font-bold">
                      ({selectedBulan.length} bulan dipilih — otomatis dikalikan)
                    </span>
                  ) : (
                    <span className="text-[11px] text-amber-400 font-bold">
                      ⚠️ Isi nominal SPP di atas untuk memilih bulan
                    </span>
                  )}
                </div>

                {customNominal <= 0 && (
                  <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-3 text-xs text-amber-300 flex items-center gap-2">
                    <ShieldAlert className="h-4 w-4 shrink-0 text-amber-400" />
                    <span>{t("Pilihan bulan terkunci! Silakan isi nominal SPP per bulan di atas terlebih dahulu untuk memilih bulan tagihan.", "Month selection locked! Please enter SPP amount per month above first.")}</span>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {BULAN_LIST.map((b) => {
                    const isSelected = selectedBulan.includes(b.id);
                    const isLocked = customNominal <= 0;
                    return (
                      <button
                        type="button"
                        key={b.id}
                        disabled={isLocked}
                        onClick={() => {
                          if (isLocked) {
                            nominalInputRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
                            nominalInputRef.current?.focus();
                            return;
                          }
                          toggleBulan(b.id);
                        }}
                        className={`flex items-center justify-between rounded-xl border p-2.5 text-xs font-bold transition-all ${
                          isLocked
                            ? "border-border/40 bg-muted/30 text-muted-foreground/40 cursor-not-allowed opacity-60"
                            : isSelected
                            ? "border-gold bg-gold/15 text-gold shadow-sm ring-1 ring-gold/40"
                            : "border-border bg-background text-muted-foreground hover:border-foreground/30"
                        }`}
                      >
                        <span>{b.label}</span>
                        {isSelected && !isLocked && <CheckCircle2 className="h-3.5 w-3.5 text-gold shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            /* Manual Nominal Input Field for Non-SPP Categories */
            <div className="space-y-2 pt-2">
              <label className="block text-xs font-semibold text-foreground">
                {t(`Isi Nominal Pembayaran ${kategoriPembayaran} (Rp)`, `Payment Amount for ${kategoriPembayaran} (Rp)`)} *
              </label>
              <input
                type="number"
                required
                min={1}
                placeholder="Contoh: 500000"
                value={customNominal === 0 ? "" : customNominal}
                onChange={(e) => setCustomNominal(Number(e.target.value))}
                className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm font-bold text-foreground focus:border-gold focus:outline-none"
              />
            </div>
          )}

          {/* Dynamic Total Subtotal Box */}
          <div className="rounded-2xl border border-gold/40 bg-navy/90 p-4 text-primary-foreground flex items-center justify-between shadow-md">
            <div>
              <p className="text-xs text-primary-foreground/75 font-semibold">
                {t("Subtotal Pembayaran", "Payment Subtotal")} ({kategoriPembayaran})
              </p>
              <p className="text-xs text-gold mt-0.5">
                {isSPP
                  ? `${selectedBulan.length} Bulan (${selectedBulan.join(", ")}) x Rp ${(customNominal || 0).toLocaleString("id-ID")}`
                  : `Kategori: ${kategoriPembayaran}`}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-black text-gold">
                Rp {sppNominal.toLocaleString("id-ID")}
              </p>
            </div>
          </div>
        </div>

 {/* Step 3: Pilih Rekening Tujuan Transfer */}
 <div className="space-y-4 pt-4 border-t border-border">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
 <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-navy text-[10px] font-black">3</span>
 {t("Pilih Rekening Tujuan Transfer", "Select Target Bank Account for Transfer")} *
 </h3>
 {copied && (
 <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/30 animate-pulse">
 {t("Nomor Rekening Disalin!", "Account Number Copied!")}
 </span>
 )}
 </div>

 <p className="text-xs text-muted-foreground">
 {t(
 "Silakan pilih nomor rekening BSI resmi yang sesuai dengan unit / kategori pembayaran Anda di bawah ini:",
 "Please select the official BSI bank account corresponding to your unit / payment category below:"
 )}
 </p>

 <div className="grid gap-2.5">
 {SCHOOL.bankAccounts.map((acc) => {
 const valueString = `${acc.bank} — ${acc.category} (${acc.accountNumber})`;
 const isSelected = metode === valueString || (metode === "Transfer BSI" && acc.category.includes("SPP SD"));

 return (
 <div
 key={acc.accountNumber + acc.category}
 onClick={() => setMetode(valueString)}
 className={`relative flex cursor-pointer items-center justify-between rounded-2xl border p-3.5 text-xs transition-all ${
 isSelected
 ? "border-gold bg-gold/10 shadow-md ring-1 ring-gold/40"
 : "border-border bg-card hover:border-gold/50"
 }`}
>
 <div className="flex items-start gap-3">
 <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold text-xs ${
 isSelected ? "bg-gold text-navy-deep shadow-sm" : "bg-muted text-muted-foreground"
 }`}>
 <CreditCard className="h-4 w-4" />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <span className="font-extrabold text-foreground text-xs">{acc.category}</span>
 {isSelected && (
 <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold text-gold">
 <CheckCircle2 className="h-3 w-3 text-gold" /> {t("Dipilih", "Selected")}
 </span>
 )}
 </div>
 <p className="font-mono font-bold text-sm text-emerald-400 mt-1">
 {acc.bank} — <span className="text-foreground font-black">{acc.accountNumber}</span>
 </p>
 <p className="text-[11px] text-muted-foreground mt-0.5">a/n {acc.accountName}</p>
 </div>
 </div>

 <button
 type="button"
 onClick={(e) =>{
 e.stopPropagation();
 handleCopyAccount(acc.accountNumber);
 }}
 className="flex items-center gap-1 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:border-gold hover:text-gold transition-colors shrink-0"
 title={`Salin ${acc.accountNumber}`}
>
 <Copy className="h-3.5 w-3.5" />
 <span className="hidden sm:inline">{t("Salin No. Rek", "Copy No.")}</span>
 </button>
 </div>
 );
 })}
 </div>

 <div>
 <label className="block text-xs font-semibold text-foreground mb-1.5">
 {t("Nama Pengirim / Pemilik Rekening", "Sender Name / Account Holder")} *
 </label>
 <input
 type="text"
 required
 placeholder="Contoh: Rahmat Hidayat (Ayah)"
 value={namaPengirim}
 onChange={(e) => setNamaPengirim(e.target.value)}
 className="w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm text-foreground focus:border-gold focus:outline-none"
 />
 </div>

 <div>
 <label className="block text-xs font-semibold text-foreground mb-1.5">
 {t("Upload Bukti Transfer / Resi Pembayaran", "Upload Payment Receipt")}{" "}
 <span className="text-red-500 font-bold">* ({t("Wajib", "Required")})</span>
 </label>
 <div className="flex flex-wrap items-center gap-3">
 <label
 className={`flex cursor-pointer items-center gap-2 rounded-2xl border border-dashed px-4 py-3 text-xs font-bold transition-all ${
 buktiUrl
 ? "border-emerald-500/60 bg-emerald-500/10 text-emerald-400"
 : "border-red-500/60 bg-red-500/10 text-red-400 hover:bg-red-500/20 shadow-sm"
 }`}
>
 <Upload className="h-4 w-4" />
 <span>
 {buktiUrl
 ? t("Ganti Foto Resi", "Change Receipt Photo")
 : t("Pilih Foto Resi Transfer (Wajib)", "Choose Receipt Photo (Required)")}
 </span>
 <input type="file" accept="image/jpeg,image/png,application/pdf" onChange={handleFileUpload} required className="hidden" />
 </label>
 {buktiUrl ? (
 <div className="flex items-center gap-2 text-xs font-bold text-emerald-400">
 <CheckCircle2 className="h-4 w-4" /> {t("Foto Resi Terlampir", "Photo Attached")}
 </div>
 ) : (
 <span className="text-[11px] font-semibold text-red-400 flex items-center gap-1">
 ️ {t("Bukti transfer wajib diunggah", "Receipt photo is required")}
 </span>
 )}
 </div>
 </div>

 <div>
 <label className="block text-xs font-semibold text-foreground mb-1.5">
 {t("Catatan Tambahan (Opsional)", "Additional Notes (Optional)")}
 </label>
 <textarea
 rows={2}
 placeholder="Catatan pendaftaran atau konfirmasi pembayaran..."
 value={catatan}
 onChange={(e) => setCatatan(e.target.value)}
 className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-sm text-foreground focus:border-gold focus:outline-none"
 />
 </div>
 </div>

 {/* Step 4: Infaq Sukarela */}
 <div className="space-y-4 pt-4 border-t border-border">
 <div className="flex items-center justify-between">
 <h3 className="text-xs font-bold uppercase tracking-wider text-gold flex items-center gap-1.5">
 <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gold text-navy text-[10px] font-black">4</span>
 {t("Infaq & Donasi (Opsional)", "Infaq & Donation (Optional)")}
 </h3>
 <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase text-emerald-500 border border-emerald-500/20">
 {t("Sukarela", "Voluntary")}
 </span>
 </div>

 <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
 {[
 { val: 0, label: "Tanpa Infaq (Rp 0)" },
 { val: 50000, label: "Rp 50.000" },
 { val: 100000, label: "Rp 100.000" },
 { val: 200000, label: "Rp 200.000" },
 { val: 500000, label: "Rp 500.000" },
 ].map((item) => {
 const isSel = infaqNominal === item.val && !customInfaq;
 return (
 <button
 type="button"
 key={item.val}
 onClick={() =>{
 setInfaqNominal(item.val);
 setCustomInfaq("");
 }}
 className={`rounded-xl border p-2.5 text-xs font-bold transition-all ${
 isSel
 ? "border-gold bg-gold/10 text-gold shadow-sm"
 : "border-border bg-background text-muted-foreground hover:border-foreground/30"
 }`}
>
 {item.label}
 </button>
 );
 })}
 </div>

 {/* Custom Infaq Input */}
 <div>
 <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
 {t("Nominal Infaq Lainnya (Rp):", "Custom Infaq Amount (Rp):")}
 </label>
 <input
 type="number"
 placeholder="Contoh: 150000"
 value={customInfaq}
 onChange={(e) => {
 const val = e.target.value;
 setCustomInfaq(val);
 setInfaqNominal(val ? Number(val) : 0);
 }}
 className="w-full rounded-2xl border border-input bg-background px-4 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none"
 />
 </div>

 {/* Dynamic Grand Total Box */}
 <div className="rounded-2xl border border-gold/50 bg-gradient-to-r from-navy to-navy-deep p-4 text-primary-foreground flex items-center justify-between shadow-lg">
 <div>
 <p className="text-xs text-primary-foreground/75 font-semibold">
 {t("TOTAL KESELURUHAN DIBAYAR", "GRAND TOTAL AMOUNT")}
 </p>
 <p className="text-[11px] text-gold mt-0.5">
 {kategoriPembayaran}: Rp {sppNominal.toLocaleString("id-ID")}
 {infaqNominal > 0 ? ` + Infaq: Rp ${infaqNominal.toLocaleString("id-ID")}` : ""}
 </p>
 </div>
 <div className="text-right">
 <p className="text-2xl font-black text-gold">
 Rp {totalPembayaran.toLocaleString("id-ID")}
 </p>
 </div>
 </div>
 </div>

 <button
 type="submit"
 disabled={submitting}
 className="w-full rounded-2xl bg-gradient-to-r from-gold-soft to-gold py-4 text-sm font-extrabold uppercase tracking-wider text-navy-deep shadow-gold transition-transform hover:scale-[1.02] disabled:opacity-50"
>
 {submitting ? t("Memproses Pembayaran...", "Processing Payment...") : t("Kirim Konfirmasi Pembayaran Keuangan", "Submit Payment Confirmation")}
 </button>
 </form>
 </div>
 </Reveal>
 </div>

 {/* History & Status Column (Right 5 Cols) */}
 <div className="lg:col-span-5">
 <Reveal variant="right">
 <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-luxe">
 <div className="flex items-center justify-between border-b border-border pb-4 mb-6">
 <h3 className="text-lg font-extrabold text-foreground flex items-center gap-2">
 <FileCheck className="h-5 w-5 text-gold" />
 {session?.role === "admin" ? t("Semua Riwayat Pembayaran Siswa Siswi", "All Student Payment Records") : t("Riwayat Pembayaran Saya", "My Payment History")}
 </h3>

 <button
 type="button"
 onClick={() =>handlePrintRekap(activePayments)}
 className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-bold text-gold hover:bg-gold hover:text-navy transition-all"
 title={t("Cetak Rekap Laporan Keuangan PDF", "Print Financial Summary PDF")}
>
 <Printer className="h-3.5 w-3.5" />
 <span>{t("Cetak Rekap", "Print Report")}</span>
 </button>
 </div>

 {/* History Tab Selector */}
 <div className="flex border-b border-border mb-4 gap-2">
 <button
 type="button"
 onClick={() =>setHistoryTab("active")}
 className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
 historyTab === "active"
 ? "border-gold text-gold"
 : "border-transparent text-muted-foreground hover:text-foreground"
 }`}
>
 {session?.role === "admin" ? t("Semua Transaksi", "All Transactions") : t("Riwayat Saya", "My Records")} ({activePayments.length})
 </button>
 <button
 type="button"
 onClick={() =>setHistoryTab("trash")}
 className={`pb-2.5 px-3 text-xs font-bold transition-all border-b-2 ${
 historyTab === "trash"
 ? "border-red-500 text-red-500"
 : "border-transparent text-muted-foreground hover:text-foreground"
 }`}
>
 ️ {t("Sampah", "Trash")} ({trashedPayments.length})
 </button>
 </div>

 {/* Multi Filters & Search Form */}
 <div className="space-y-3 mb-5 rounded-2xl border border-border bg-card/60 p-4 backdrop-blur">
 <div className="relative flex items-center">
 <Search className="absolute left-3.5 h-4 w-4 text-muted-foreground pointer-events-none" />
 <input
 type="text"
 placeholder="Cari NIS, Nama Siswa Siswi, No Transaksi, Bulan..."
 value={searchNis}
 onChange={(e) => setSearchNis(e.target.value)}
 className="w-full rounded-2xl border border-input bg-background pl-10 pr-10 py-2.5 text-xs text-foreground focus:border-gold focus:outline-none transition-colors"
 />
 {searchNis && (
 <button
 type="button"
 onClick={() =>setSearchNis("")}
 className="absolute right-3 rounded-full p-1 text-muted-foreground hover:text-foreground"
 title="Hapus pencarian"
>
 <X className="h-3.5 w-3.5" />
 </button>
 )}
 </div>

 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
 <div>
 <label className="block text-[10px] font-bold text-muted-foreground mb-1">Jenjang:</label>
 <select
 value={filterJenjang}
 onChange={(e) => setFilterJenjang(e.target.value)}
 className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:border-gold focus:outline-none"
>
 <option value="Semua">Semua Jenjang</option>
 <option value="TK">TK</option>
 <option value="SD">SD</option>
 <option value="SMP">SMP</option>
 <option value="SMA">SMA</option>
 </select>
 </div>

 <div>
 <label className="block text-[10px] font-bold text-muted-foreground mb-1">Kategori:</label>
 <select
 value={filterKategori}
 onChange={(e) => setFilterKategori(e.target.value)}
 className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:border-gold focus:outline-none"
>
 <option value="Semua">Semua Kategori</option>
 <option value="SPP Bulanan">SPP Bulanan</option>
 <option value="SPP Bulanan Boarding">SPP Bulanan Boarding</option>
 <option value="Biaya Pendidikan">Biaya Pendidikan</option>
 <option value="Seragam & Atribut">Seragam & Atribut</option>
 <option value="Buku Paket & Kitab">Buku Paket & Kitab</option>
 <option value="Sampul Rapor">Sampul Rapor</option>
 <option value="Kegiatan & Eskul">Kegiatan & Eskul</option>
 <option value="Ujian Pendidikan Kesetaraan">Ujian Pendidikan Kesetaraan</option>
 <option value="Lain-lain">Keperluan Lain</option>
 </select>
 </div>

 <div>
 <label className="block text-[10px] font-bold text-muted-foreground mb-1">Status:</label>
 <select
 value={filterStatus}
 onChange={(e) => setFilterStatus(e.target.value)}
 className="w-full rounded-xl border border-input bg-background p-2 text-xs text-foreground focus:border-gold focus:outline-none"
>
 <option value="Semua">Semua Status</option>
 <option value="Lunas">Lunas</option>
 <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
 <option value="Ditolak">Ditolak</option>
 </select>
 </div>
 </div>

 {(searchNis || filterKategori !== "Semua" || filterStatus !== "Semua" || filterJenjang !== "Semua") && (
 <div className="flex items-center justify-between pt-1 text-[11px] border-t border-border/40">
 <span className="text-gold font-semibold">
 Menampilkan {historyTab === "active" ? activePayments.length : trashedPayments.length} hasil
 </span>
 <button
 type="button"
 onClick={() =>{
 setSearchNis("");
 setFilterKategori("Semua");
 setFilterJenjang("Semua");
 setFilterStatus("Semua");
 }}
 className="font-bold text-red-400 hover:text-red-300 underline underline-offset-2"
>
 Reset Filter
 </button>
 </div>
 )}
 </div>

 {/* TAB 1: Active History List */}
 {historyTab === "active" && (
 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
 {activePayments.length === 0 ? (
 <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
 {searchNis || filterKategori !== "Semua" || filterStatus !== "Semua" || filterJenjang !== "Semua" ? (
 <div className="space-y-3">
 <p>{t("Data transaksi pembayaran dengan filter tersebut tidak ditemukan.", "No payment records matching filters.")}</p>
 <button
 type="button"
 onClick={() =>{
 setSearchNis("");
 setFilterKategori("Semua");
 setFilterJenjang("Semua");
 setFilterStatus("Semua");
 }}
 className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold hover:bg-gold hover:text-navy-deep transition-all"
>
 Bersihkan Filter
 </button>
 </div>
 ) : (
 t("Belum ada riwayat pembayaran yang tercatat.", "No active payment history recorded yet.")
 )}
 </div>
 ) : (
 activePayments.map((item) => (
 <div
 key={item.id}
 className="rounded-2xl border border-border bg-background p-4 transition-all hover:border-gold/50 hover:shadow-sm"
>
 <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5 mb-2.5">
 <div>
 <span className="font-mono text-xs font-bold text-gold">{item.idTransaksi}</span>
 <p className="text-[11px] text-muted-foreground">NIS: {item.nis} · <strong className="text-foreground">{item.namaSiswa}</strong></p>
 </div>
 <span
 className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-extrabold uppercase ${
 item.status === "Lunas"
 ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
 : item.status === "Ditolak"
 ? "bg-red-500/10 text-red-500 border border-red-500/20"
 : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
 }`}
>
 {item.status === "Lunas" && <CheckCircle2 className="h-3 w-3" />}
 {item.status === "Menunggu Verifikasi" && <Clock className="h-3 w-3" />}
 {item.status === "Ditolak" && <XCircle className="h-3 w-3" />}
 {item.status}
 </span>
 </div>

 <div className="space-y-1 text-xs">
 <p><strong className="text-foreground">Kategori:</strong> <span className="font-bold text-blue-500">{item.kategoriPembayaran || "SPP Bulanan"}</span></p>
 <p><strong className="text-foreground">Jenjang:</strong> {item.jenjang}</p>
 <p><strong className="text-foreground">Rincian:</strong> {Array.isArray(item.bulanTagihan) && item.bulanTagihan.length > 0 ? item.bulanTagihan.join(", ") : (item.kategoriPembayaran || "-")}</p>
 <p><strong className="text-foreground">Nominal Total:</strong> <span className="font-bold text-emerald-500">Rp {item.jumlahNominal.toLocaleString("id-ID")}</span></p>
 <p><strong className="text-foreground">Metode:</strong> {item.metodePembayaran} ({item.namaPengirim})</p>
 </div>

 <div className="mt-3 flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/40 text-[11px]">
 <span className="text-muted-foreground">
 {new Date(item.createdAt).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}
 </span>
 <div className="flex flex-wrap items-center gap-1.5">
 <button
 type="button"
 onClick={() =>
 setZoomImg({
 title: `Bukti Pembayaran ${item.kategoriPembayaran || "Siswa Siswi"} — ${item.namaSiswa} (${item.idTransaksi})`,
 url: getSPPReceiptPreviewUrl(item),
 })
 }
 className="inline-flex items-center gap-1 rounded-full border border-sky-500/40 bg-sky-500/10 px-3 py-1 font-bold text-sky-600 dark:text-sky-400 hover:bg-sky-500 hover:text-white transition-all shadow-sm cursor-pointer"
 >
 <ImageIcon className="h-3 w-3" />
 <span>{t("Lihat Resi", "View Receipt")}</span>
 </button>
 <button
 type="button"
 onClick={() =>handlePrintKuitansi(item)}
 className="inline-flex items-center gap-1 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 font-bold text-gold hover:bg-gold hover:text-navy transition-all cursor-pointer"
 >
 <Printer className="h-3 w-3" />
 <span>{t("Kuitansi Digital", "Digital Receipt")}</span>
 </button>
 <button
 type="button"
 onClick={() =>handleTrashItem(item.id)}
 className="rounded-full border border-red-200 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors cursor-pointer"
 title={t("Pindahkan ke Sampah", "Move to Trash")}
 >
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 )}

 {/* TAB 2: Trash / Deleted List */}
 {historyTab === "trash" && (
 <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
 {trashedPayments.length> 0 && (
 <div className="flex items-center justify-between pb-2 text-xs border-b border-border/40">
 <span className="text-muted-foreground">{trashedPayments.length} {t("riwayat di tempat sampah", "item(s) in trash")}</span>
 <button
 type="button"
 onClick={handleRestoreAll}
 className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-3 py-1 font-bold text-emerald-500 hover:bg-emerald-500 hover:text-white transition-all text-[11px]"
>
 <RotateCcw className="h-3 w-3" />
 <span>{t("Pulihkan Semua", "Restore All")}</span>
 </button>
 </div>
 )}

 {trashedPayments.length === 0 ? (
 <div className="rounded-2xl border border-dashed border-border p-8 text-center text-xs text-muted-foreground">
 {t("Tempat sampah kosong. Belum ada riwayat yang dihapus.", "Trash is empty.")}
 </div>
 ) : (
 trashedPayments.map((item) => (
 <div
 key={item.id}
 className="rounded-2xl border border-red-500/30 bg-red-950/10 p-4 transition-all opacity-85 hover:opacity-100"
>
 <div className="flex items-center justify-between gap-2 border-b border-red-500/20 pb-2 mb-2">
 <div>
 <span className="font-mono text-xs font-bold text-red-400">{item.idTransaksi}</span>
 <p className="text-[11px] text-muted-foreground">NIS: {item.nis} · {item.namaSiswa}</p>
 </div>
 <span className="rounded-full bg-red-500/20 px-2 py-0.5 text-[9px] font-bold uppercase text-red-400">
 {t("Dihapus", "Deleted")}
 </span>
 </div>

 <div className="space-y-1 text-xs text-muted-foreground">
 <p><strong className="text-foreground">Kategori:</strong> {item.kategoriPembayaran || "SPP Bulanan"}</p>
 <p><strong className="text-foreground">Jenjang:</strong> {item.jenjang}</p>
 <p><strong className="text-foreground">Rincian:</strong> {item.bulanTagihan.join(", ")}</p>
 <p><strong className="text-foreground">Nominal:</strong> <span className="font-bold text-foreground">Rp {item.jumlahNominal.toLocaleString("id-ID")}</span></p>
 </div>

 <div className="mt-3 flex items-center justify-between pt-2 border-t border-red-500/20 text-[11px]">
 <span className="text-red-400/80">
 {t("Dihapus:", "Deleted:")} {new Date(item.deletedAt || item.updatedAt).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
 </span>
 <div className="flex items-center gap-1.5">
 <button
 type="button"
 onClick={() =>handleRestoreItem(item.id)}
 className="inline-flex items-center gap-1 rounded-full border border-emerald-500 bg-emerald-500/10 px-3 py-1 font-bold text-emerald-400 hover:bg-emerald-500 hover:text-navy transition-all"
>
 <RotateCcw className="h-3 w-3" />
 <span>{t("Pulihkan", "Restore")}</span>
 </button>
 <button
 type="button"
 onClick={() =>handlePermanentDelete(item.id)}
 className="rounded-full border border-red-500/40 bg-red-500/20 p-1.5 text-red-400 hover:bg-red-500 hover:text-white transition-all"
 title={t("Hapus Permanen", "Delete Permanently")}
>
 <Trash2 className="h-3.5 w-3.5" />
 </button>
 </div>
 </div>
 </div>
 ))
 )}
 </div>
 )}
 </div>
 </Reveal>
 </div>
 </div>
 </div>
 </section>
 </>
 )}

 {/* Success Modal */}
 <AnimatePresence>
 {successPayment && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-5 backdrop-blur-md">
 <motion.div
 initial={{ scale: 0.8, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.8, opacity: 0, y: 20 }}
 transition={{ type: "spring", stiffness: 300, damping: 25 }}
 className="relative max-w-md w-full overflow-hidden rounded-3xl border-2 border-gold/60 bg-gradient-to-b from-navy via-navy-deep to-slate-950 p-6 text-center text-primary-foreground shadow-2xl ring-4 ring-gold/20"
>
 {/* Celebration Glow & Sparkles Banner */}
 <div className="absolute -top-12 -left-12 h-32 w-32 rounded-full bg-gold/20 blur-3xl pointer-events-none" />
 <div className="absolute -bottom-12 -right-12 h-32 w-32 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />

 {/* Animated Celebration Badge */}
 <div className="relative mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-white mb-3 shadow-lg shadow-emerald-500/40 border-2 border-white/40 animate-bounce">
 <CheckCircle2 className="h-12 w-12" />
 </div>

 <div className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/15 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-gold mb-2 shadow-sm">
 <Sparkles className="h-3.5 w-3.5 text-gold animate-spin" />
 <span> BARAKALLAHU FIKUM! PEMBAYARAN SUKSES </span>
 </div>

 <h3 className="text-2xl font-extrabold text-white tracking-tight">
 {t("Konfirmasi Pembayaran Berhasil!", "Payment Submitted!")}
 </h3>
 <p className="text-xs text-primary-foreground/80 mt-1.5 leading-relaxed">
 Pembayaran Anda dengan No. Transaksi <strong className="text-gold font-mono font-bold">{successPayment.idTransaksi}</strong> telah terkirim &amp; dalam proses verifikasi admin.
 </p>

 {/* Transaction Summary Card */}
 <div className="my-4 rounded-2xl bg-white/5 p-4 text-left text-xs space-y-2 border border-white/10 shadow-inner">
 <p><strong className="text-gold">Kategori Pembayaran:</strong> {successPayment.kategoriPembayaran || "SPP Bulanan"}</p>
 <p><strong className="text-gold">Nama Siswa Siswi:</strong> {successPayment.namaSiswa}</p>
 <p><strong className="text-gold">Kelas Siswa Siswi:</strong> {successPayment.nis}</p>
 <p><strong className="text-gold">Jenjang:</strong> {successPayment.jenjang}</p>
 <p><strong className="text-gold">Rincian / Bulan:</strong> {successPayment.bulanTagihan.join(", ")}</p>
 <p><strong className="text-gold">Total Nominal:</strong> <span className="font-black text-emerald-400 text-sm">Rp {successPayment.jumlahNominal.toLocaleString("id-ID")}</span></p>
 </div>

 {/* Islamic Arabic Thank You & Prayer Box */}
 <div className="my-4 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/20 via-amber-500/10 to-emerald-500/20 p-4 text-center shadow-md">
 <p className="text-2xl font-bold text-gold font-serif" dir="rtl">
 شُكْرًا جَزِيْلًا
 </p>
 <p className="mt-1 text-xs font-extrabold text-emerald-300">
 Syukran Jazilan — Terima Kasih Banyak
 </p>
 <p className="mt-2 text-xs text-primary-foreground/90 leading-relaxed italic">
 "Semoga Aba &amp; Umma senantiasa dipermudah rezekinya oleh Allah Subhanahu wa Ta'ala, diberkahi usahanya, dan dibalas dengan kebaikan yang berlimpah. Aamiin Ya Rabbal 'Alamin."
 </p>
 </div>

 {/* Action Buttons */}
 <div className="space-y-2.5">
 <div className="flex gap-3">
 <button
 type="button"
 onClick={() =>handlePrintKuitansi(successPayment)}
 className="flex-1 rounded-2xl bg-gradient-to-r from-gold-soft to-gold py-3 text-xs font-extrabold uppercase tracking-wider text-navy-deep shadow-gold hover:scale-[1.02] transition-transform"
>
 <Printer className="h-4 w-4 inline mr-1" /> {t("Cetak Kuitansi", "Print Receipt")}
 </button>
 <button
 type="button"
 onClick={() =>setSuccessPayment(null)}
 className="rounded-2xl border border-white/20 px-4 py-3 text-xs font-bold text-white hover:bg-white/10 transition-colors"
>
 {t("Tutup", "Close")}
 </button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
      </AnimatePresence>

      {/* MODAL: Full-screen Image Zoom Modal with Fail-Safe Back Controls */}
      {zoomImg && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/90 p-3 sm:p-5 backdrop-blur-md transition-opacity"
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
                <span>{t("← Kembali / Tutup Resi", "← Back / Close Receipt")}</span>
              </button>

              <h4 className="text-xs sm:text-sm font-bold text-center truncate px-2 text-gold">{zoomImg.title}</h4>

              <div className="flex items-center gap-2 shrink-0">
                <a
                  href={zoomImg.url}
                  download={`Resi_Pembayaran_${Date.now()}.jpg`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-bold transition-all shadow-md cursor-pointer"
                  title="Unduh Resi Ini"
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
                <span>{t("Tutup Tampilan Resi", "Close Receipt View")}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
