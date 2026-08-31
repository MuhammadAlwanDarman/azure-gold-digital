# 🗄️ Dokumentasi Database MySQL — STPI & PKBM Zaid bin Tsabit

File database ini dirancang khusus untuk memenuhi seluruh kebutuhan sistem informasi **Sekolah Tahfizh Plus IT (STPI) & PKBM Zaid bin Tsabit Samarinda**, mencakup:
- **PPDB / SPMB Online** (Pendaftaran Siswa Baru, Biodata Lengkap Ayah/Ibu/Wali, Upload Berkas, Jadwal Tes & Observasi).
- **Pembayaran SPP & Keuangan** (SPP Bulanan, Uang Pangkal, Seragam, Infaq/Wakaf, Verifikasi Pembayaran & Rekening Resmi).
- **Penagihan Khusus / Billing Notice** (Pemberitahuan/peringatan tagihan aktif untuk akun orang tua).
- **Akun & Autentikasi** (Admin, Keuangan, Guru, Orang Tua).
- **Master Siswa, Kelas & Jenjang** (TK, SD, SMP, SMA).
- **Berita, Agenda Kegiatan & Pesan Kontak Masuk**.

---

## 📁 Struktur File Database

| File | Keterangan |
|------|------------|
| [`database/stpi_zaid_bin_tsabit.sql`](file:///c:/Website%20STPI%20ZAID%20BIN%20TSABIT/azure-gold-digital/database/stpi_zaid_bin_tsabit.sql) | **File All-in-One** (Membuat Database + Tabel Schema + Data Awal / Seed). Siap langsung diimport. |
| [`database/schema.sql`](file:///c:/Website%20STPI%20ZAID%20BIN%20TSABIT/azure-gold-digital/database/schema.sql) | DDL struktur tabel murni (CREATE TABLE, INDEX, FOREIGN KEYS). |
| [`database/seed.sql`](file:///c:/Website%20STPI%20ZAID%20BIN%20TSABIT/azure-gold-digital/database/seed.sql) | Data dummy awal (Admin, Siswa, Rekening Bank, PPDB, Transaksi SPP). |

---

## 📊 Daftar Tabel & Relasi (ERD)

```
[users] (1) ───< (N) [user_sessions]
   │
   ├── (1) ───< (1) [user_billings] (1) ───< (N) [user_billing_items]
   │
   ├── (1) ───< (N) [ppdb_submissions] (1) ───< (N) [ppdb_documents]
   │                      │
   │                      └── (1) ───< (1) [ppdb_jadwal_tes]
   │
   ├── (1) ───< (N) [siswa] >─── (N) [kelas]
   │
   └── (1) ───< (N) [spp_payments]
```

### Rincian Tabel:
1. **`users`**: Data login dan hak akses (`admin`, `keuangan`, `guru`, `orangtua`).
2. **`user_sessions`**: Token sesi login web.
3. **`user_billings` & `user_billing_items`**: Pengaturan notifikasi tagihan khusus (distraction popup/tagihan mendesak per user).
4. **`jenjang_pendidikan`**: Master jenjang TK, SD, SMP, SMA beserta biaya pendaftaran.
5. **`bank_accounts`**: Daftar rekening bank resmi sekolah (BSI Formulir, SPP TK, SPP SD, SPP SMP/SMA, Yayasan).
6. **`ppdb_submissions`**: Formulir pendaftaran siswa baru lengkap (Data Siswa, Ortu, Wali, Alamat, Status Pendaftaran & Pembayaran).
7. **`ppdb_documents`**: Arsip berkas upload calon siswa (KK, Akta, KTP, Foto).
8. **`ppdb_jadwal_tes`**: Penjadwalan tes observasi & wawancara beserta ruang & hasil kelulusan.
9. **`kelas` & `siswa`**: Master kelas aktif & data siswa terdaftar.
10. **`spp_payments`**: Riwayat transaksi pembayaran SPP & keuangan (status Menunggu Verifikasi / Lunas).
11. **`artikel_berita` & `agenda_kegiatan`**: Pengumuman, prestasi, dan kalender kegiatan sekolah.
12. **`kontak_masuk`**: Formulir kritik, saran, & konsultasi dari pengunjung web.

---

## 🚀 Cara Import ke MySQL

### Cara 1: Lewat phpMyAdmin (XAMPP / Laragon / cPanel)
1. Buka browser dan masuk ke **phpMyAdmin** (`http://localhost/phpmyadmin`).
2. Klik tab menu **Import** di bagian atas.
3. Klik **Choose File / Browse**, lalu pilih file:
   `c:\Website STPI ZAID BIN TSABIT\azure-gold-digital\database\stpi_zaid_bin_tsabit.sql`
4. Klik tombol **Import / Kirim** di bagian bawah.
5. Database `stpi_zaid_bin_tsabit` beserta seluruh tabel dan data seed berhasil dibuat!

### Cara 2: Lewat Command Line (Terminal / CMD / PowerShell)
```bash
mysql -u root -p < "c:\Website STPI ZAID BIN TSABIT\azure-gold-digital\database\stpi_zaid_bin_tsabit.sql"
```

### Cara 3: Lewat MySQL Workbench / DBeaver / Navicat
1. Buka MySQL Workbench / DBeaver.
2. Buka file `database/stpi_zaid_bin_tsabit.sql` (`File` > `Open SQL Script`).
3. Tekan ikon **Execute / Run** (⚡).

---

## 🔐 Akun Default untuk Pengujian

| Role | Email | Password Default | Keterangan |
|------|-------|------------------|------------|
| **Admin** | `admin@zaidbintsabit.sch.id` | `password` | Superadmin Manajemen Sekolah & PPDB |
| **Keuangan** | `keuangan@zaidbintsabit.sch.id` | `password` | Bagian Verifikasi SPP & Penagihan |
| **Orang Tua 1** | `fauzi.parent@gmail.com` | `password` | Akun Wali Siswa SD (Ahmad Fauzi) |
| **Orang Tua 2** | `maryam.parent@gmail.com` | `password` | Akun Wali Siswa SMP (Siti Maryam) |
| **Orang Tua 3** | `zaky.parent@gmail.com` | `password` | Akun Wali Siswa SMA (Muhammad Zaky) |
