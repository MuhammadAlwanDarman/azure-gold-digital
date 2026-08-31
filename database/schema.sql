-- ==========================================================
-- DATABASE SCHEMA: STPI & PKBM ZAID BIN TSABIT SAMARINDA
-- Engine: MySQL 8.0+ / MariaDB 10.4+
-- Charset: utf8mb4 / utf8mb4_unicode_ci
-- ==========================================================

CREATE DATABASE IF NOT EXISTS `stpi_zaid_bin_tsabit` 
DEFAULT CHARACTER SET utf8mb4 
COLLATE utf8mb4_unicode_ci;

USE `stpi_zaid_bin_tsabit`;

-- ----------------------------------------------------------
-- 1. TABEL PENGGUNA & AUTENTIKASI (users, sessions)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
    `id` VARCHAR(36) PRIMARY KEY,
    `name` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL UNIQUE,
    `password_hash` VARCHAR(255) NOT NULL,
    `role` ENUM('admin', 'orangtua', 'keuangan', 'guru') NOT NULL DEFAULT 'orangtua',
    `phone` VARCHAR(25) NULL,
    `avatar_url` VARCHAR(255) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_users_role` (`role`),
    INDEX `idx_users_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_sessions` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL,
    `token` VARCHAR(255) NOT NULL UNIQUE,
    `ip_address` VARCHAR(45) NULL,
    `user_agent` TEXT NULL,
    `expires_at` DATETIME NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
    INDEX `idx_sessions_token` (`token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 2. TABEL PENAGIHAN KHUSUS & DISTRACTION POPUP (Billing Notice)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `user_billings` (
    `id` VARCHAR(36) PRIMARY KEY,
    `user_id` VARCHAR(36) NOT NULL UNIQUE,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `penagih_name` VARCHAR(100) NOT NULL DEFAULT 'Unit Administrasi & Keuangan STPI',
    `penagih_kontak` VARCHAR(30) NULL,
    `telepon_orang_tua` VARCHAR(30) NULL,
    `pesan_penagih` TEXT NOT NULL,
    `tanggal_tagihan` DATE NULL,
    `rekening_tujuan` VARCHAR(255) NULL,
    `is_validated` BOOLEAN NOT NULL DEFAULT FALSE,
    `validated_at` DATETIME NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_billing_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `user_billing_items` (
    `id` VARCHAR(36) PRIMARY KEY,
    `billing_id` VARCHAR(36) NOT NULL,
    `nama_item` VARCHAR(150) NOT NULL,
    `nominal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `jatuh_tempo` DATE NULL,
    `kategori` VARCHAR(100) NULL DEFAULT 'SPP / Keuangan',
    `status` ENUM('Belum Lunas', 'Lunas') NOT NULL DEFAULT 'Belum Lunas',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_billing_items_parent` FOREIGN KEY (`billing_id`) 
        REFERENCES `user_billings` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 3. TABEL MASTER JENJANG & PROGRAM SEKOLAH
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `jenjang_pendidikan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(50) NOT NULL UNIQUE,
    `nama` VARCHAR(100) NOT NULL,
    `nama_en` VARCHAR(100) NULL,
    `rentang_usia` VARCHAR(50) NOT NULL,
    `tagline` VARCHAR(255) NULL,
    `deskripsi` TEXT NULL,
    `biaya_pendaftaran` DECIMAL(12,2) NOT NULL DEFAULT 0.00,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `bank_accounts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kategori` VARCHAR(150) NOT NULL,
    `bank_name` VARCHAR(100) NOT NULL DEFAULT 'Bank Syariah Indonesia (BSI)',
    `account_number` VARCHAR(50) NOT NULL,
    `account_name` VARCHAR(150) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. TABEL PPDB / SPMB (Pendaftaran Peserta Didik Baru)
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `ppdb_submissions` (
    `id` VARCHAR(36) PRIMARY KEY,
    `reg_no` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` VARCHAR(36) NULL,
    `jenjang` VARCHAR(50) NOT NULL, -- TK, SD, SMP Jalur 1, SMP Jalur 2, SMA Jalur 1, SMA Jalur 2
    
    -- 1. Data Identitas Calon Siswa
    `nama_lengkap` VARCHAR(150) NOT NULL,
    `nama_panggilan` VARCHAR(50) NULL,
    `nik_siswa` VARCHAR(20) NULL,
    `no_akta` VARCHAR(50) NULL,
    `no_kk` VARCHAR(20) NULL,
    `nisn` VARCHAR(20) NULL,
    `tempat_lahir` VARCHAR(100) NULL,
    `tanggal_lahir` DATE NOT NULL,
    `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') NOT NULL,
    `agama` VARCHAR(30) NOT NULL DEFAULT 'Islam',
    `suku` VARCHAR(50) NULL,
    `status_anak` VARCHAR(50) NULL, -- Kandung, Angkat, Tiri
    `anak_ke` INT NULL DEFAULT 1,
    `transportasi` VARCHAR(50) NULL,
    `tinggi_badan` INT NULL, -- dalam cm
    `berat_badan` INT NULL,  -- dalam kg
    `riwayat_penyakit` TEXT NULL,
    `asal_sekolah` VARCHAR(150) NULL,
    `npsn_asal` VARCHAR(20) NULL,
    `alamat` TEXT NOT NULL,

    -- 2. Data Ayah Kandung
    `nama_ayah` VARCHAR(150) NULL,
    `nik_ayah` VARCHAR(20) NULL,
    `tempat_lahir_ayah` VARCHAR(100) NULL,
    `tanggal_lahir_ayah` DATE NULL,
    `pendidikan_ayah` VARCHAR(50) NULL,
    `pekerjaan_ayah` VARCHAR(100) NULL,
    `penghasilan_ayah` VARCHAR(50) NULL,
    `telepon_ayah` VARCHAR(25) NULL,
    `kebutuhan_khusus_ayah` VARCHAR(100) NULL,

    -- 3. Data Ibu Kandung
    `nama_ibu` VARCHAR(150) NULL,
    `nik_ibu` VARCHAR(20) NULL,
    `tempat_lahir_ibu` VARCHAR(100) NULL,
    `tanggal_lahir_ibu` DATE NULL,
    `pendidikan_ibu` VARCHAR(50) NULL,
    `pekerjaan_ibu` VARCHAR(100) NULL,
    `penghasilan_ibu` VARCHAR(50) NULL,
    `telepon_ibu` VARCHAR(25) NULL,

    -- 4. Wali & Kontak Utama
    `wali` VARCHAR(150) NULL,
    `telepon` VARCHAR(25) NOT NULL,
    `email` VARCHAR(150) NOT NULL,

    -- 5. Status & Pembayaran Formulir
    `metode_pembayaran` VARCHAR(50) NOT NULL DEFAULT 'Transfer Bank BSI',
    `bukti_reg_url` TEXT NULL,
    `catatan_tambahan` TEXT NULL,
    `status_pendaftaran` ENUM('Draft', 'Menunggu Verifikasi', 'Terverifikasi', 'Lulus Seleksi', 'Ditolak') NOT NULL DEFAULT 'Draft',
    `status_pembayaran` ENUM('Belum Bayar', 'Menunggu Konfirmasi', 'Lunas') NOT NULL DEFAULT 'Belum Bayar',
    
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT `fk_ppdb_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_ppdb_reg_no` (`reg_no`),
    INDEX `idx_ppdb_status` (`status_pendaftaran`),
    INDEX `idx_ppdb_jenjang` (`jenjang`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Berkas Dokumen Pendukung PPDB
CREATE TABLE IF NOT EXISTS `ppdb_documents` (
    `id` VARCHAR(36) PRIMARY KEY,
    `submission_id` VARCHAR(36) NOT NULL,
    `doc_type` VARCHAR(50) NOT NULL, -- KK, Akta Lahir, KTP Ortu, Pas Foto, Ijazah, Surat Keterangan
    `file_name` VARCHAR(255) NOT NULL,
    `file_size` VARCHAR(50) NULL,
    `file_url` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ppdb_docs_submission` FOREIGN KEY (`submission_id`) 
        REFERENCES `ppdb_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabel Jadwal Tes & Observasi PPDB
CREATE TABLE IF NOT EXISTS `ppdb_jadwal_tes` (
    `id` VARCHAR(36) PRIMARY KEY,
    `submission_id` VARCHAR(36) NOT NULL UNIQUE,
    `tanggal` DATE NOT NULL,
    `waktu` VARCHAR(50) NOT NULL,
    `ruang` VARCHAR(100) NOT NULL,
    `lokasi` VARCHAR(255) NOT NULL DEFAULT 'Kampus STPI Zaid bin Tsabit Samarinda',
    `catatan_penguji` TEXT NULL,
    `status_kelulusan` ENUM('Pending', 'Lulus', 'Tidak Lulus', 'Cadangan') NOT NULL DEFAULT 'Pending',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ppdb_jadwal_submission` FOREIGN KEY (`submission_id`) 
        REFERENCES `ppdb_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 5. TABEL MASTER SISWA & KELAS AKTIF
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kelas` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `jenjang` VARCHAR(50) NOT NULL,
    `nama_kelas` VARCHAR(50) NOT NULL,
    `tahun_ajaran` VARCHAR(20) NOT NULL, -- e.g. 2025/2026, 2026/2027
    `wali_kelas` VARCHAR(150) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `siswa` (
    `id` VARCHAR(36) PRIMARY KEY,
    `nis` VARCHAR(30) NOT NULL UNIQUE,
    `nisn` VARCHAR(30) NULL,
    `nama_lengkap` VARCHAR(150) NOT NULL,
    `jenjang` VARCHAR(50) NOT NULL,
    `kelas_id` INT NULL,
    `user_id` VARCHAR(36) NULL, -- Akun login orang tua siswa ini
    `jenis_kelamin` ENUM('Laki-laki', 'Perempuan') NOT NULL,
    `status_siswa` ENUM('Aktif', 'Lulus', 'Pindah', 'Non-Aktif') NOT NULL DEFAULT 'Aktif',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_siswa_kelas` FOREIGN KEY (`kelas_id`) 
        REFERENCES `kelas` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT `fk_siswa_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_siswa_nis` (`nis`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 6. TABEL PEMBAYARAN SPP & TRANSAKSI KEUANGAN
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `spp_payments` (
    `id` VARCHAR(36) PRIMARY KEY,
    `id_transaksi` VARCHAR(50) NOT NULL UNIQUE,
    `nis` VARCHAR(30) NOT NULL,
    `nama_siswa` VARCHAR(150) NOT NULL,
    `jenjang` VARCHAR(50) NOT NULL,
    `kategori_pembayaran` VARCHAR(100) NOT NULL DEFAULT 'SPP Bulanan',
    `bulan_tagihan` JSON NOT NULL, -- Array JSON e.g. ["Agustus", "September"]
    `jumlah_nominal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `infaq_nominal` DECIMAL(12, 2) NOT NULL DEFAULT 0.00,
    `metode_pembayaran` VARCHAR(100) NOT NULL,
    `nama_pengirim` VARCHAR(150) NOT NULL,
    `bukti_transfer_url` TEXT NULL,
    `catatan` TEXT NULL,
    `status` ENUM('Menunggu Verifikasi', 'Lunas', 'Ditolak') NOT NULL DEFAULT 'Menunggu Verifikasi',
    `user_id` VARCHAR(36) NULL,
    `user_email` VARCHAR(150) NULL,
    `verified_by` VARCHAR(36) NULL,
    `verified_at` DATETIME NULL,
    `deleted_at` DATETIME NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_spp_user` FOREIGN KEY (`user_id`) 
        REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
    INDEX `idx_spp_id_transaksi` (`id_transaksi`),
    INDEX `idx_spp_nis` (`nis`),
    INDEX `idx_spp_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 7. TABEL ARTIKEL, BERITA, AGENDA & KALENDER AKADEMIK
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `artikel_berita` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `slug` VARCHAR(150) NOT NULL UNIQUE,
    `judul` VARCHAR(255) NOT NULL,
    `kategori` VARCHAR(50) NOT NULL DEFAULT 'Kegiatan',
    `ringkasan` TEXT NULL,
    `konten` LONGTEXT NOT NULL,
    `gambar_url` VARCHAR(255) NULL,
    `author_id` VARCHAR(36) NULL,
    `is_published` BOOLEAN NOT NULL DEFAULT TRUE,
    `published_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT `fk_artikel_author` FOREIGN KEY (`author_id`) 
        REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `agenda_kegiatan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `judul` VARCHAR(200) NOT NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_selesai` DATE NULL,
    `waktu` VARCHAR(50) NULL,
    `tempat` VARCHAR(150) NULL,
    `jenjang_terkait` VARCHAR(50) NULL, -- 'Semua', 'TK', 'SD', 'SMP', 'SMA'
    `deskripsi` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 8. TABEL PESAN KONTAK / KONSULTASI MASUK
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS `kontak_masuk` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telepon` VARCHAR(30) NULL,
    `subjek` VARCHAR(200) NULL,
    `pesan` TEXT NOT NULL,
    `status` ENUM('Baru', 'Dibaca', 'Dibalas') NOT NULL DEFAULT 'Baru',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
