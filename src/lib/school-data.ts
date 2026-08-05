export const SCHOOL = {
  name: "STPI Zaid bin Tsabit",
  short: "STPI ZBT",
  motto: "Mencetak Generasi Qurani yang Unggul dalam Teknologi dan Berakhlak Mulia.",
  address: "Jl. Pendidikan No. 17, Kota Bogor, Jawa Barat",
  phone: "+62 812-0000-1717",
  email: "info@stpizaidbintsabit.sch.id",
};

export type Jenjang = {
  slug: string;
  label: string;
  usia: string;
  tagline: string;
  deskripsi: string;
  program: string[];
  guru: { nama: string; peran: string }[];
  jadwal: { hari: string; kegiatan: string }[];
};

export const JENJANG: Jenjang[] = [
  {
    slug: "tk",
    label: "TK",
    usia: "Usia 4–6 Tahun",
    tagline: "Bermain, bertumbuh, mengenal Al-Qur'an",
    deskripsi:
      "Jenjang TK STPI Zaid bin Tsabit membangun fondasi karakter Qurani melalui pembelajaran berbasis bermain, sensorik, dan eksplorasi kreatif dalam lingkungan yang hangat dan aman.",
    program: ["Tahfidz Juz 30", "Iqra & Tahsin", "Sensory Play", "Bahasa Arab Dasar", "LEGO Education", "Seni & Motorik"],
    guru: [
      { nama: "Ustazah Nabila Rahma", peran: "Wali Kelas A" },
      { nama: "Ustazah Syifa Aulia", peran: "Guru Tahfidz" },
      { nama: "Ustazah Dinda Pratiwi", peran: "Guru Kreativitas" },
    ],
    jadwal: [
      { hari: "Senin – Kamis", kegiatan: "07.30 – 11.00 · Tahfidz, tematik, bermain terstruktur" },
      { hari: "Jumat", kegiatan: "07.30 – 10.00 · Praktik ibadah & outdoor day" },
    ],
  },
  {
    slug: "sd",
    label: "SD",
    usia: "Usia 6–12 Tahun",
    tagline: "Literasi kuat, hafalan kokoh, logika terasah",
    deskripsi:
      "Kurikulum SD memadukan kurikulum nasional, tahfidz terstruktur, dan literasi digital sejak dini, dengan pendampingan personal untuk setiap siswa.",
    program: ["Tahfidz 5 Juz", "Bahasa Arab & Inggris", "Coding Dasar", "Robotik", "Public Speaking", "Sains Terapan"],
    guru: [
      { nama: "Ustaz Fadhil Ramadhan", peran: "Koordinator Tahfidz" },
      { nama: "Ustazah Larasati", peran: "Guru Literasi" },
      { nama: "Ustaz Bayu Nugroho", peran: "Guru Coding & Robotik" },
    ],
    jadwal: [
      { hari: "Senin – Kamis", kegiatan: "07.00 – 14.30 · Tahfidz pagi, akademik, ekstra" },
      { hari: "Jumat", kegiatan: "07.00 – 11.30 · Tahsin, kajian, project day" },
    ],
  },
  {
    slug: "smp",
    label: "SMP",
    usia: "Usia 12–15 Tahun",
    tagline: "Berpikir kritis, berkarya digital",
    deskripsi:
      "Jenjang SMP menekankan kemandirian belajar, riset sederhana, dan penguasaan teknologi kreatif dengan pembinaan akhlak yang intensif.",
    program: ["Tahfidz 10 Juz", "AI & Data Dasar", "Multimedia", "Graphic Design", "Debat & Public Speaking", "Kewirausahaan"],
    guru: [
      { nama: "Ustaz Iqbal Maulana", peran: "Kepala Jenjang SMP" },
      { nama: "Ustazah Hanifah Zahra", peran: "Guru Bahasa Arab" },
      { nama: "Ustaz Rendra Wijaya", peran: "Guru Multimedia" },
    ],
    jadwal: [
      { hari: "Senin – Kamis", kegiatan: "06.45 – 15.30 · Tahfidz, akademik, studio kreatif" },
      { hari: "Jumat", kegiatan: "06.45 – 11.30 · Halaqah & pengembangan diri" },
    ],
  },
  {
    slug: "sma",
    label: "SMA",
    usia: "Usia 15–18 Tahun",
    tagline: "Siap kuliah, siap industri, siap memimpin",
    deskripsi:
      "SMA STPI Zaid bin Tsabit menyiapkan lulusan untuk universitas dalam dan luar negeri melalui peminatan sains, teknologi, dan studi Islam terapan.",
    program: ["Tahfidz 15–30 Juz", "UI/UX Design", "Video Editing", "Motion Graphic", "AI Engineering", "Olimpiade Sains"],
    guru: [
      { nama: "Ustaz Dr. Ahmad Fauzan", peran: "Kepala Jenjang SMA" },
      { nama: "Ustazah Nurul Izzah", peran: "Guru Sains" },
      { nama: "Ustaz Galih Prasetyo", peran: "Guru UI/UX & Motion" },
    ],
    jadwal: [
      { hari: "Senin – Kamis", kegiatan: "06.30 – 16.00 · Tahfidz, akademik, peminatan" },
      { hari: "Jumat", kegiatan: "06.30 – 11.30 · Kajian, mentoring karier" },
    ],
  },
];

export const PROGRAM_UNGGULAN = [
  { title: "Tahfidz Al-Qur'an", desc: "Target hafalan bertingkat dengan mutqin dan sanad." },
  { title: "Bahasa Arab", desc: "Percakapan aktif dan pemahaman kitab." },
  { title: "Bahasa Inggris", desc: "Kelas imersif dan persiapan TOEFL." },
  { title: "Coding", desc: "Web, Python, dan logika algoritma." },
  { title: "Robotik", desc: "Kompetisi robotik nasional & internasional." },
  { title: "Artificial Intelligence", desc: "Dasar AI, data, dan etika teknologi." },
  { title: "Multimedia", desc: "Produksi konten dan studio sekolah." },
  { title: "Public Speaking", desc: "Khitobah, debat, dan presentasi." },
  { title: "Tata Boga", desc: "Kuliner halal dan kewirausahaan." },
  { title: "LEGO Education", desc: "Belajar STEM lewat konstruksi." },
  { title: "UI/UX Design", desc: "Riset pengguna hingga prototipe." },
  { title: "Graphic Design", desc: "Branding dan desain visual." },
  { title: "Video Editing", desc: "Storytelling dan pascaproduksi." },
  { title: "Motion Graphic", desc: "Animasi 2D dan visual dinamis." },
];

export const STATS = [
  { label: "Siswa Aktif", value: 1840, suffix: "+" },
  { label: "Guru & Pendidik", value: 145, suffix: "" },
  { label: "Alumni", value: 5200, suffix: "+" },
  { label: "Prestasi", value: 320, suffix: "+" },
];

export const TIMELINE = [
  { year: "2005", title: "Pendirian", desc: "Yayasan mendirikan madrasah tahfidz dengan 32 santri pertama." },
  { year: "2010", title: "Jenjang Lengkap", desc: "Pembukaan TK dan SD terpadu berbasis tahfidz." },
  { year: "2016", title: "Kampus Baru", desc: "Peresmian kampus modern dengan laboratorium teknologi." },
  { year: "2020", title: "Transformasi Digital", desc: "Kelas coding, robotik, dan studio multimedia." },
  { year: "2026", title: "Kelas Dunia", desc: "Program AI, kemitraan internasional, dan akreditasi unggul." },
];

export const PRESTASI = [
  { year: "2026", title: "Juara 1 Olimpiade Robotik Nasional", level: "Nasional" },
  { year: "2025", title: "Medali Emas MTQ Pelajar", level: "Provinsi" },
  { year: "2025", title: "Best Design — Asia Youth Hackathon", level: "Internasional" },
  { year: "2024", title: "Juara Umum Musabaqah Hifzhil Qur'an", level: "Nasional" },
  { year: "2024", title: "Finalis Olimpiade Sains Nasional", level: "Nasional" },
  { year: "2023", title: "Juara 1 Film Pendek Pelajar", level: "Provinsi" },
];

export const GURU = [
  { nama: "Ustaz Dr. Ahmad Fauzan", peran: "Kepala Sekolah", bidang: "Pendidikan Islam" },
  { nama: "Ustazah Nurul Izzah, M.Pd", peran: "Wakil Kurikulum", bidang: "Sains" },
  { nama: "Ustaz Fadhil Ramadhan, Lc", peran: "Koordinator Tahfidz", bidang: "Al-Qur'an" },
  { nama: "Ustaz Bayu Nugroho, S.Kom", peran: "Kepala Lab Teknologi", bidang: "Coding & AI" },
];

export const BERITA = [
  { kategori: "Trending", title: "Tim Robotik STPI ZBT Melaju ke Kejuaraan Dunia", date: "2 Agustus 2026" },
  { kategori: "Terbaru", title: "Wisuda Tahfidz Angkatan XIX Diikuti 210 Santri", date: "28 Juli 2026" },
  { kategori: "Populer", title: "Kelas AI Dasar Kini Wajib untuk Seluruh Siswa SMA", date: "19 Juli 2026" },
  { kategori: "Event", title: "Open House & Virtual Tour Kampus 2026/2027", date: "10 Juli 2026" },
];

export const GALERI_FILTER = ["Semua", "Kegiatan", "Tahfidz", "Wisuda", "Perlombaan", "Study Tour"];

export const GALERI = [
  { judul: "Halaqah Pagi", kategori: "Tahfidz", h: "h-64" },
  { judul: "Wisuda Tahfidz XIX", kategori: "Wisuda", h: "h-80" },
  { judul: "Kompetisi Robotik", kategori: "Perlombaan", h: "h-56" },
  { judul: "Study Tour Bandung", kategori: "Study Tour", h: "h-72" },
  { judul: "Pekan Olahraga", kategori: "Kegiatan", h: "h-60" },
  { judul: "Setoran Hafalan", kategori: "Tahfidz", h: "h-72" },
  { judul: "Science Fair", kategori: "Kegiatan", h: "h-56" },
  { judul: "Lomba Kaligrafi", kategori: "Perlombaan", h: "h-64" },
  { judul: "Prosesi Wisuda SMA", kategori: "Wisuda", h: "h-80" },
];

export const KALENDER = [
  { tanggal: "12 Agu 2026", agenda: "Pembukaan PPDB Gelombang I", jenis: "PPDB" },
  { tanggal: "3 Sep 2026", agenda: "Ujian Tengah Semester", jenis: "Ujian" },
  { tanggal: "20 Okt 2026", agenda: "Libur Maulid Nabi", jenis: "Libur" },
  { tanggal: "14 Des 2026", agenda: "Tes Seleksi PPDB", jenis: "PPDB" },
  { tanggal: "9 Jan 2027", agenda: "Ujian Akhir Semester", jenis: "Ujian" },
  { tanggal: "22 Mei 2027", agenda: "Wisuda Tahfidz & Kelulusan", jenis: "Wisuda" },
];

export const ALUMNI = [
  { nama: "Aisyah Kamila", tahun: "2019", kini: "Mahasiswa Al-Azhar, Kairo", kata: "Tahfidz di sini membentuk disiplin yang saya bawa sampai kuliah di luar negeri." },
  { nama: "Rafi Hidayat", tahun: "2018", kini: "Software Engineer, Jakarta", kata: "Kelas coding SMA jadi pintu pertama saya masuk dunia teknologi." },
  { nama: "Zahra Nabilah", tahun: "2020", kini: "Mahasiswa ITB", kata: "Pembinaan olimpiade sangat serius dan personal." },
];

export const FAQ = [
  { q: "Kapan PPDB 2026/2027 dibuka?", a: "Gelombang I dibuka 12 Agustus 2026 dan ditutup setelah kuota terpenuhi." },
  { q: "Apakah tersedia program beasiswa?", a: "Ya, tersedia beasiswa tahfidz, prestasi akademik, dan beasiswa yatim/dhuafa." },
  { q: "Apakah sekolah menyediakan asrama?", a: "Asrama tersedia untuk jenjang SMP dan SMA dengan pembinaan 24 jam." },
  { q: "Bagaimana cara menjadwalkan kunjungan?", a: "Gunakan tombol Jadwalkan Kunjungan di beranda atau hubungi kami via WhatsApp." },
];
