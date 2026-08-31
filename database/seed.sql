-- ==========================================================
-- SEED DATA: STPI & PKBM ZAID BIN TSABIT SAMARINDA
-- ==========================================================

USE `stpi_zaid_bin_tsabit`;

-- 1. DATA USER & ADMIN
INSERT INTO `users` (`id`, `name`, `email`, `password_hash`, `role`, `phone`) VALUES
('usr-admin-01', 'Administrator STPI', 'admin@zaidbintsabit.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', '081250055474'),
('usr-keuangan-01', 'Bendahara Keuangan', 'keuangan@zaidbintsabit.sch.id', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'keuangan', '081250055474'),
('usr-01', 'Rahmat Hidayat (Ortu Ahmad)', 'fauzi.parent@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'orangtua', '081234567891'),
('usr-02', 'Ibrahim (Ortu Maryam)', 'maryam.parent@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'orangtua', '081234567892'),
('usr-03', 'Zulkifli (Ortu Zaky)', 'zaky.parent@gmail.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'orangtua', '081234567893')
ON DUPLICATE KEY UPDATE `name`=VALUES(`name`);

-- 2. DATA REKENING BANK RESMI
INSERT INTO `bank_accounts` (`kategori`, `bank_name`, `account_number`, `account_name`) VALUES
('Formulir SPMB (Semua Jenjang)', 'Bank Syariah Indonesia (BSI)', '7293687476', 'Sitti Hamidah'),
('SPP TK', 'Bank Syariah Indonesia (BSI)', '7757797733', 'TK ZAID BIN TSABIT'),
('SPP SD', 'Bank Syariah Indonesia (BSI)', '7797737757', 'PKBM SETARA SD ZAID BIN TSABIT'),
('SPP SMP & SMA', 'Bank Syariah Indonesia (BSI)', '7797737733', 'PKBM ZAID BIN TSABIT'),
('Biaya Pendidikan, Sampul Rapor & Ujian Kesetaraan', 'Bank Syariah Indonesia (BSI)', '7757797757', 'YAYASAN DZUN NURAIN AL MU BAROKAH'),
('Uang Saku, Assessment & Lain-lain', 'Bank Syariah Indonesia (BSI)', '7293687476', 'Sitti Hamidah');

-- 3. DATA MASTER JENJANG PENDIDIKAN
INSERT INTO `jenjang_pendidikan` (`slug`, `nama`, `nama_en`, `rentang_usia`, `tagline`, `deskripsi`, `biaya_pendaftaran`) VALUES
('tk', 'TK Islam Zaid bin Tsabit', 'Kindergarten', '4 - 6 Tahun', 'Bermain, bertumbuh, mengenal Al-Qur\'an', 'Jenjang TK PKBM Zaid bin Tsabit membangun fondasi karakter Qurani melalui pembelajaran berbasis bermain.', 250000.00),
('sd', 'Setara SD Zaid bin Tsabit', 'Setara SD (Elementary)', '6 - 12 Tahun', 'Literasi kuat, hafalan kokoh, logika terasah', 'Kurikulum SD memadukan kurikulum nasional, tahfizh terstruktur, dan literasi digital sejak dini.', 300000.00),
('smp', 'Setara SMP Tahfizh & IT', 'Setara SMP (Junior High)', '12 - 15 Tahun', 'Tahfizh mutqin, siap tantangan era digital', 'Pembelajaran berbasis proyek IT, robotik, bahasa Arab & Inggris aktif dengan asrama/fullday.', 350000.00),
('sma', 'Setara SMA IT & Pre-University', 'Setara SMA (Senior High)', '15 - 18 Tahun', 'Kemandirian global, penguasaan skill masa depan', 'Fokus pada keahlian software engineering, kecerdasan buatan, multimedia, dan persiapan perguruan tinggi.', 350000.00);

-- 4. DATA KELAS
INSERT INTO `kelas` (`jenjang`, `nama_kelas`, `tahun_ajaran`, `wali_kelas`) VALUES
('TK', 'TK A - Abu Bakar', '2025/2026', 'Ustadzah Fatimah, S.Pd'),
('TK', 'TK B - Umar bin Khattab', '2025/2026', 'Ustadzah Aisyah, S.Pd'),
('SD', '1 SD - Utsman bin Affan', '2025/2026', 'Ustadz Abdullah, S.Pd.I'),
('SD', '2 SD - Ali bin Abi Thalib', '2025/2026', 'Ustadz Salman, S.Pd'),
('SMP Jalur 1', '7 SMP - Al-Khawarizmi', '2025/2026', 'Ustadz Ridwan, S.Kom'),
('SMA Jalur 1', '10 SMA - Ibnu Sina', '2025/2026', 'Ustadz Farhan, S.Kom');

-- 5. DATA SISWA AKTIF
INSERT INTO `siswa` (`id`, `nis`, `nisn`, `nama_lengkap`, `jenjang`, `kelas_id`, `user_id`, `jenis_kelamin`, `status_siswa`) VALUES
('sis-001', '20261001', '0123456781', 'Ahmad Fauzi', 'SD', 3, 'usr-01', 'Laki-laki', 'Aktif'),
('sis-002', '20261002', '0123456782', 'Siti Maryam', 'SMP Jalur 1', 5, 'usr-02', 'Perempuan', 'Aktif'),
('sis-003', '20261003', '0123456783', 'Muhammad Zaky', 'SMA Jalur 1', 6, 'usr-03', 'Laki-laki', 'Aktif');

-- 6. DATA PPDB SUBMISSIONS
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

-- 7. DATA JADWAL TES PPDB
INSERT INTO `ppdb_jadwal_tes` (`id`, `submission_id`, `tanggal`, `waktu`, `ruang`, `lokasi`, `status_kelulusan`) VALUES
('jdt-001', 'ppdb-001', '2026-06-15', '08:30 - 10:00 WITA', 'Ruang Observasi TK A', 'Gedung TK STPI Samarinda', 'Lulus'),
('jdt-002', 'ppdb-002', '2026-06-16', '09:00 - 11:30 WITA', 'Lab Komputer & Halaqah 1', 'Kampus Utama STPI Zaid bin Tsabit', 'Lulus');

-- 8. DATA PEMBAYARAN SPP & KEUANGAN
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

-- 9. DATA BILLING NOTICE (Contoh Simulasi Tagihan)
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

-- 10. DATA ARTIKEL & AGENDA
INSERT INTO `artikel_berita` (`slug`, `judul`, `kategori`, `ringkasan`, `konten`, `author_id`) VALUES
('prestasi-o2sn-nasional', 'Siswa STPI Zaid bin Tsabit Raih Juara 3 O2SN Tingkat Nasional', 'Prestasi', 'Alhamdulillah siswa STPI berhasil menorehkan prestasi gemilang tingkat nasional.', 'Konten lengkap liputan kemenangan lomba...', 'usr-admin-01'),
('bootcamp-robotic-ai-2026', 'Bootcamp Robotic & Artificial Intelligence 2026', 'Kegiatan', 'Pelatihan intensif coding, robotika, dan teknologi AI bagi santri SMP dan SMA.', 'Kegiatan berlangsung selama 3 hari bertempat di Lab Komputer STPI...', 'usr-admin-01');

INSERT INTO `agenda_kegiatan` (`judul`, `tanggal_mulai`, `tanggal_selesai`, `waktu`, `tempat`, `jenjang_terkait`, `deskripsi`) VALUES
('Ujian Tengah Semester Ganjil', '2026-09-20', '2026-09-25', '07:30 - 12:00 WITA', 'Kampus STPI', 'Semua', 'Pelaksanaan UTS tahun ajaran 2026/2027.'),
('Outing Class & Edukasi Lingkungan', '2026-10-05', '2026-10-05', '08:00 - 14:00 WITA', 'Kebun Raya Samarinda', 'TK', 'Eksplorasi alam dan pengenalan ciptaan Allah SWT.');
