-- ==============================================================================
-- DATABASE LENGKAP: STPI & PKBM ZAID BIN TSABIT SAMARINDA (SCHEMA + DUMMY DATA)
-- Engine: MySQL 8.0+ / MariaDB 10.4+
-- ==============================================================================

SET FOREIGN_KEY_CHECKS = 0;
DROP DATABASE IF EXISTS `stpi_zaid_bin_tsabit`;
CREATE DATABASE `stpi_zaid_bin_tsabit` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `stpi_zaid_bin_tsabit`;
SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------
-- 1. TABEL PENGGUNA & AUTENTIKASI
-- ----------------------------------------------------------
CREATE TABLE `users` (
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

CREATE TABLE `user_sessions` (
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
-- 2. TABEL PENAGIHAN KHUSUS & DISTRACTION POPUP
-- ----------------------------------------------------------
CREATE TABLE `user_billings` (
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

CREATE TABLE `user_billing_items` (
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
-- 3. TABEL MASTER JENJANG & BANK RESMI
-- ----------------------------------------------------------
CREATE TABLE `jenjang_pendidikan` (
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

CREATE TABLE `bank_accounts` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `kategori` VARCHAR(150) NOT NULL,
    `bank_name` VARCHAR(100) NOT NULL DEFAULT 'Bank Syariah Indonesia (BSI)',
    `account_number` VARCHAR(50) NOT NULL,
    `account_name` VARCHAR(150) NOT NULL,
    `is_active` BOOLEAN NOT NULL DEFAULT TRUE,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------
-- 4. TABEL PPDB / SPMB (PENDAFTARAN SISWA BARU)
-- ----------------------------------------------------------
CREATE TABLE `ppdb_submissions` (
    `id` VARCHAR(36) PRIMARY KEY,
    `reg_no` VARCHAR(50) NOT NULL UNIQUE,
    `user_id` VARCHAR(36) NULL,
    `jenjang` VARCHAR(50) NOT NULL,
    
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
    `status_anak` VARCHAR(50) NULL,
    `anak_ke` INT NULL DEFAULT 1,
    `transportasi` VARCHAR(50) NULL,
    `tinggi_badan` INT NULL,
    `berat_badan` INT NULL,
    `riwayat_penyakit` TEXT NULL,
    `asal_sekolah` VARCHAR(150) NULL,
    `npsn_asal` VARCHAR(20) NULL,
    `alamat` TEXT NOT NULL,

    `nama_ayah` VARCHAR(150) NULL,
    `nik_ayah` VARCHAR(20) NULL,
    `tempat_lahir_ayah` VARCHAR(100) NULL,
    `tanggal_lahir_ayah` DATE NULL,
    `pendidikan_ayah` VARCHAR(50) NULL,
    `pekerjaan_ayah` VARCHAR(100) NULL,
    `penghasilan_ayah` VARCHAR(50) NULL,
    `telepon_ayah` VARCHAR(25) NULL,
    `kebutuhan_khusus_ayah` VARCHAR(100) NULL,

    `nama_ibu` VARCHAR(150) NULL,
    `nik_ibu` VARCHAR(20) NULL,
    `tempat_lahir_ibu` VARCHAR(100) NULL,
    `tanggal_lahir_ibu` DATE NULL,
    `pendidikan_ibu` VARCHAR(50) NULL,
    `pekerjaan_ibu` VARCHAR(100) NULL,
    `penghasilan_ibu` VARCHAR(50) NULL,
    `telepon_ibu` VARCHAR(25) NULL,

    `wali` VARCHAR(150) NULL,
    `telepon` VARCHAR(25) NOT NULL,
    `email` VARCHAR(150) NOT NULL,

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

CREATE TABLE `ppdb_documents` (
    `id` VARCHAR(36) PRIMARY KEY,
    `submission_id` VARCHAR(36) NOT NULL,
    `doc_type` VARCHAR(50) NOT NULL,
    `file_name` VARCHAR(255) NOT NULL,
    `file_size` VARCHAR(50) NULL,
    `file_url` TEXT NOT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT `fk_ppdb_docs_submission` FOREIGN KEY (`submission_id`) 
        REFERENCES `ppdb_submissions` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `ppdb_jadwal_tes` (
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
-- 5. TABEL MASTER SISWA & KELAS
-- ----------------------------------------------------------
CREATE TABLE `kelas` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `jenjang` VARCHAR(50) NOT NULL,
    `nama_kelas` VARCHAR(50) NOT NULL,
    `tahun_ajaran` VARCHAR(20) NOT NULL,
    `wali_kelas` VARCHAR(150) NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `siswa` (
    `id` VARCHAR(36) PRIMARY KEY,
    `nis` VARCHAR(30) NOT NULL UNIQUE,
    `nisn` VARCHAR(30) NULL,
    `nama_lengkap` VARCHAR(150) NOT NULL,
    `jenjang` VARCHAR(50) NOT NULL,
    `kelas_id` INT NULL,
    `user_id` VARCHAR(36) NULL,
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
-- 6. TABEL PEMBAYARAN SPP & TRANSAKSI
-- ----------------------------------------------------------
CREATE TABLE `spp_payments` (
    `id` VARCHAR(36) PRIMARY KEY,
    `id_transaksi` VARCHAR(50) NOT NULL UNIQUE,
    `nis` VARCHAR(30) NOT NULL,
    `nama_siswa` VARCHAR(150) NOT NULL,
    `jenjang` VARCHAR(50) NOT NULL,
    `kategori_pembayaran` VARCHAR(100) NOT NULL DEFAULT 'SPP Bulanan',
    `bulan_tagihan` JSON NOT NULL,
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
-- 7. TABEL ARTIKEL, BERITA & AGENDA
-- ----------------------------------------------------------
CREATE TABLE `artikel_berita` (
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

CREATE TABLE `agenda_kegiatan` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `judul` VARCHAR(200) NOT NULL,
    `tanggal_mulai` DATE NOT NULL,
    `tanggal_selesai` DATE NULL,
    `waktu` VARCHAR(50) NULL,
    `tempat` VARCHAR(150) NULL,
    `jenjang_terkait` VARCHAR(50) NULL,
    `deskripsi` TEXT NULL,
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `kontak_masuk` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `nama` VARCHAR(150) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `telepon` VARCHAR(30) NULL,
    `subjek` VARCHAR(200) NULL,
    `pesan` TEXT NOT NULL,
    `status` ENUM('Baru', 'Dibaca', 'Dibalas') NOT NULL DEFAULT 'Baru',
    `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ==============================================================================
-- INSERT SEED DATA
-- ==============================================================================

-- 1. Users
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`) VALUES
('usr-admin-01', 'Administrator STPI', 'admin@zaidbintsabit.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081250055474'),
('usr-keuangan-01', 'Bendahara Keuangan', 'keuangan@zaidbintsabit.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'keuangan', '081250055474'),
('usr-01', 'Rahmat Hidayat (Ortu Ahmad)', 'fauzi.parent@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'orangtua', '081234567891'),
('usr-02', 'Ibrahim (Ortu Maryam)', 'maryam.parent@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'orangtua', '081234567892'),
('usr-03', 'Zulkifli (Ortu Zaky)', 'zaky.parent@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'orangtua', '081234567893');

-- 2. Bank Accounts
INSERT INTO `bank_accounts` (`kategori`, `bank_name`, `account_number`, `account_name`) VALUES
('Formulir SPMB (Semua Jenjang)', 'Bank Syariah Indonesia (BSI)', '7293687476', 'Sitti Hamidah'),
('SPP TK', 'Bank Syariah Indonesia (BSI)', '7757797733', 'TK ZAID BIN TSABIT'),
('SPP SD', 'Bank Syariah Indonesia (BSI)', '7797737757', 'PKBM SETARA SD ZAID BIN TSABIT'),
('SPP SMP & SMA', 'Bank Syariah Indonesia (BSI)', '7797737733', 'PKBM ZAID BIN TSABIT'),
('Biaya Pendidikan, Sampul Rapor & Ujian Kesetaraan', 'Bank Syariah Indonesia (BSI)', '7757797757', 'YAYASAN DZUN NURAIN AL MU BAROKAH'),
('Uang Saku, Assessment & Lain-lain', 'Bank Syariah Indonesia (BSI)', '7293687476', 'Sitti Hamidah');

-- 3. Jenjang
INSERT INTO `jenjang_pendidikan` (`slug`, `nama`, `nama_en`, `rentang_usia`, `tagline`, `deskripsi`, `biaya_pendaftaran`) VALUES
('tk', 'TK Islam Zaid bin Tsabit', 'Kindergarten', '4 - 6 Tahun', 'Bermain, bertumbuh, mengenal Al-Qur\'an', 'Jenjang TK PKBM Zaid bin Tsabit membangun fondasi karakter Qurani melalui pembelajaran berbasis bermain.', 250000.00),
('sd', 'Setara SD Zaid bin Tsabit', 'Setara SD (Elementary)', '6 - 12 Tahun', 'Literasi kuat, hafalan kokoh, logika terasah', 'Kurikulum SD memadukan kurikulum nasional, tahfizh terstruktur, dan literasi digital sejak dini.', 300000.00),
('smp', 'Setara SMP Tahfizh & IT', 'Setara SMP (Junior High)', '12 - 15 Tahun', 'Tahfizh mutqin, siap tantangan era digital', 'Pembelajaran berbasis proyek IT, robotik, bahasa Arab & Inggris aktif dengan asrama/fullday.', 350000.00),
('sma', 'Setara SMA IT & Pre-University', 'Setara SMA (Senior High)', '15 - 18 Tahun', 'Kemandirian global, penguasaan skill masa depan', 'Fokus pada keahlian software engineering, kecerdasan buatan, multimedia, dan persiapan perguruan tinggi.', 350000.00);

-- 4. Kelas
INSERT INTO `kelas` (`jenjang`, `nama_kelas`, `tahun_ajaran`, `wali_kelas`) VALUES
('TK', 'TK A - Abu Bakar', '2025/2026', 'Ustadzah Fatimah, S.Pd'),
('TK', 'TK B - Umar bin Khattab', '2025/2026', 'Ustadzah Aisyah, S.Pd'),
('SD', '1 SD - Utsman bin Affan', '2025/2026', 'Ustadz Abdullah, S.Pd.I'),
('SD', '2 SD - Ali bin Abi Thalib', '2025/2026', 'Ustadz Salman, S.Pd'),
('SMP Jalur 1', '7 SMP - Al-Khawarizmi', '2025/2026', 'Ustadz Ridwan, S.Kom'),
('SMA Jalur 1', '10 SMA - Ibnu Sina', '2025/2026', 'Ustadz Farhan, S.Kom');

-- 5. Siswa
INSERT INTO `siswa` (`id`, `nis`, `nisn`, `nama_lengkap`, `jenjang`, `kelas_id`, `user_id`, `jenis_kelamin`, `status_siswa`) VALUES
('sis-001', '20261001', '0123456781', 'Ahmad Fauzi', 'SD', 3, 'usr-01', 'Laki-laki', 'Aktif'),
('sis-002', '20261002', '0123456782', 'Siti Maryam', 'SMP Jalur 1', 5, 'usr-02', 'Perempuan', 'Aktif'),
('sis-003', '20261003', '0123456783', 'Muhammad Zaky', 'SMA Jalur 1', 6, 'usr-03', 'Laki-laki', 'Aktif');

-- 6. PPDB
INSERT INTO `ppdb_submissions` (
    `id`, `reg_no`, `user_id`, `jenjang`,
    `nama_lengkap`, `nama_panggilan`, `nik_siswa`, `no_akta`, `no_kk`, `nisn`,
    `tempat_lahir`, `tanggal_lahir`, `jenis_kelamin`, `agama`, `suku`, `status_anak`, `anak_ke`, `transportasi`,
    `tinggi_badan`, `berat_badan`, `riwayat_penyakit`, `asal_sekolah`, `alamat`,
    `nama_ayah`, `nik_ayah`, `pekerjaan_ayah`, `penghasilan_ayah`, `telepon_ayah`,
    `nama_ibu`, `nik_ibu`, `pekerjaan_ibu`, `penghasilan_ibu`, `telepon_ibu`,
    `wali`, `telepon`, `email`,
    `metode_pembayaran`, `status_pendaftaran`, `status_pembayaran`, `catatan_tambahan`
) VALUES
(
    'ppdb-001', 'REG-2026-TK-001', 'usr-01', 'TK',
    'Ahmad Fauzi', 'Fauzi', '6472010101180001', 'AKTA-6472-001', '6472010101150001', '0123456781',
    'Samarinda', '2020-05-12', 'Laki-laki', 'Islam', 'Banjar', 'Kandung', 1, 'Antar Jemput Ortu',
    110, 18, 'Tidak Ada', 'PAUD Permata Hati', 'Jl. DI Panjaitan No. 45, Mugirejo, Samarinda',
    'Rahmat Hidayat', '6472010101800001', 'Karyawan Swasta', 'Rp 5.000.000 - Rp 10.000.000', '081234567891',
    'Nurul Hidayah', '6472010101850002', 'Ibu Rumah Tangga', '< Rp 2.000.000', '081234567894',
    'Rahmat Hidayat (Ayah)', '081234567891', 'fauzi.parent@gmail.com',
    'Transfer Bank BSI', 'Terverifikasi', 'Lunas', 'Pilihan kelas pagi'
),
(
    'ppdb-002', 'REG-2026-SMP-002', 'usr-02', 'SMP Jalur 1',
    'Siti Maryam', 'Maryam', '6472010202120002', 'AKTA-6472-002', '6472010202100002', '0123456782',
    'Samarinda', '2013-08-20', 'Perempuan', 'Islam', 'Jawa', 'Kandung', 2, 'Sepeda Motor',
    145, 38, 'Alergi Dingin', 'SDIT Zaid bin Tsabit', 'Jl. Sentosa No. 12, Sungai Pinang, Samarinda',
    'Ibrahim', '6472010202750001', 'Wiraswasta', '> Rp 10.000.000', '081234567892',
    'Khadijah', '6472010202780002', 'Guru', 'Rp 3.000.000 - Rp 5.000.000', '081234567895',
    'Ibrahim (Ayah)', '081234567892', 'maryam.parent@gmail.com',
    'Transfer Bank BSI', 'Lulus Seleksi', 'Lunas', 'Santri Asrama'
);

INSERT INTO `ppdb_jadwal_tes` (`id`, `submission_id`, `tanggal`, `waktu`, `ruang`, `lokasi`, `status_kelulusan`) VALUES
('jdt-001', 'ppdb-001', '2026-06-15', '08:30 - 10:00 WITA', 'Ruang Observasi TK A', 'Gedung TK STPI Samarinda', 'Lulus'),
('jdt-002', 'ppdb-002', '2026-06-16', '09:00 - 11:30 WITA', 'Lab Komputer & Halaqah 1', 'Kampus Utama STPI Zaid bin Tsabit', 'Lulus');

-- 7. SPP
INSERT INTO `spp_payments` (
    `id`, `id_transaksi`, `nis`, `nama_siswa`, `jenjang`, `kategori_pembayaran`, 
    `bulan_tagihan`, `jumlah_nominal`, `infaq_nominal`, `metode_pembayaran`, 
    `nama_pengirim`, `status`, `user_id`, `user_email`, `created_at`
) VALUES
('spp-001', 'SPP-202608-01', '20261001', 'Ahmad Fauzi', 'SD', 'SPP Bulanan', 
 JSON_ARRAY('Agustus'), 750000.00, 50000.00, 'Transfer BSI', 
 'Rahmat Hidayat', 'Lunas', 'usr-01', 'fauzi.parent@gmail.com', '2026-08-01 08:30:00'),

('spp-002', 'SPP-202608-02', '20261002', 'Siti Maryam', 'SMP Jalur 1', 'Uang Pangkal / Gedung', 
 JSON_ARRAY('Daftar Ulang'), 3500000.00, 0.00, 'Transfer BSI', 
 'Ibrahim', 'Lunas', 'usr-02', 'maryam.parent@gmail.com', '2026-08-05 10:15:00'),

('spp-003', 'SPP-202608-03', '20261003', 'Muhammad Zaky', 'SMA Jalur 1', 'SPP Bulanan', 
 JSON_ARRAY('Agustus', 'September'), 2300000.00, 0.00, 'Virtual Account BSI', 
 'Zulkifli (Ayah Zaky)', 'Menunggu Verifikasi', 'usr-03', 'zaky.parent@gmail.com', '2026-08-10 14:15:00');

-- 8. Billing
INSERT INTO `user_billings` (
    `id`, `user_id`, `is_active`, `penagih_name`, `penagih_kontak`, `telepon_orang_tua`, 
    `pesan_penagih`, `tanggal_tagihan`, `rekening_tujuan`, `is_validated`
) VALUES
(
    'bil-001', 'usr-03', TRUE, 'Unit Administrasi & Keuangan STPI', '0812-5005-5474', '081234567893',
    'Mohon konfirmasi pelunasan SPP dan Buku Paket untuk semester ganjil.', '2026-08-10',
    'BSI 7797737733 a.n PKBM ZAID BIN TSABIT', FALSE
);

INSERT INTO `user_billing_items` (`id`, `billing_id`, `nama_item`, `nominal`, `jatuh_tempo`, `kategori`, `status`) VALUES
('bit-001', 'bil-001', 'SPP Bulan Agustus & September', 2300000.00, '2026-08-15', 'SPP Bulanan', 'Belum Lunas'),
('bit-002', 'bil-001', 'Buku Paket Modul IT & Kitab', 450000.00, '2026-08-20', 'Buku Paket', 'Belum Lunas');
