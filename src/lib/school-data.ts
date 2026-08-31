import tkImg from "@/assets/tk.png";
import sdImg from "@/assets/sd.png";
import smpdansmaImg from "@/assets/smpdansma.png";
import wisudaTkImg from "@/assets/wisuda-tk.png";
import zaidMengajarImg from "@/assets/zaid-mengajar.png";
import sdPerformanceImg from "@/assets/sd-performance.jpg";
import bazarImg from "@/assets/kegiatan-bazar.jpg";
import umkmFestImg from "@/assets/umkm-fest-ramadhan.jpg";
import pekanOlahragaImg from "@/assets/pekan-olahraga-smp-sma.jpg";
import pekanOlahragaTkImg from "@/assets/pekan-olahraga-tk.jpg";
import menjahitImg from "@/assets/kegiatan-menjahit.jpg";
import outingClassTkImg from "@/assets/outing-class-tk.jpg";
import apelPagiImg from "@/assets/apel-pagi-sd-smp-sma.png";
import publicSpeakingImg from "@/assets/public-speaking.png";
import pembelajaranItSmpSmaImg from "@/assets/pembelajaran-it-smp-sma.jpg";
import kunjunganKominfoImg from "@/assets/kunjungan-kominfo-smp-sma.jpg";
import kunjunganPolrestaTkImg from "@/assets/kunjungan-polresta-tk.jpg";
import bootcampRoboticImg from "@/assets/bootcamp-robotic.jpg";
import tahfidzHalaqahPagiImg from "@/assets/tahfidz-halaqah-pagi.png";
import lombaMewarnaiImg from "@/assets/lomba-mewarnai.jpg";
import cookingClassImg from "@/assets/cooking-class-smp-sma.jpg";
import kajianSiswiSmpSmaImg from "@/assets/kajian-siswi-smp-sma.jpg";
import memanahImg from "@/assets/kegiatan-memanah-sd-smp-sma.png";
import animationFacelessImg from "@/assets/animation-faceless-design.png";
import digitalProductPreneurImg from "@/assets/digital-product-preneur.png";
import zbtPodcastImg from "@/assets/zbt-podcast.png";
import ihtAntiBullyingImg from "@/assets/iht-anti-bullying.png";

import iconTahfidz from "@/assets/program-icons/tahfidz.png";
import iconBahasaArab from "@/assets/program-icons/bahasa-arab.png";
import iconBahasaInggris from "@/assets/program-icons/bahasa-inggris.png";
import iconCoding from "@/assets/program-icons/coding.png";
import iconRobotik from "@/assets/program-icons/robotik.png";
import iconAi from "@/assets/program-icons/ai.png";
import iconMultimedia from "@/assets/program-icons/multimedia.png";
import iconPublicSpeaking from "@/assets/program-icons/public-speaking.png";
import iconTataBoga from "@/assets/program-icons/tata-boga.png";
import iconLego from "@/assets/program-icons/lego.png";
import iconUiUx from "@/assets/program-icons/uiux.png";
import iconGraphicDesign from "@/assets/program-icons/graphic-design.png";

export const SCHOOL = {
 name: "Sekolah Tahfizh Plus IT Zaid bin Tsabit",
 nameEn: "Zaid bin Tsabit Tahfizh Plus IT School",
 short: "PKBM Zaid bin Tsabit",
 motto: "Mencetak Generasi Qurani yang Unggul dalam Teknologi dan Berakhlak Mulia.",
 mottoEn: "Shaping a Quranic Generation Superior in Technology and Noble in Character.",
 address: "PKBM ZAID BIN TSABIT SAMARINDA",
 addressEn: "PKBM ZAID BIN TSABIT SAMARINDA",
 phone: "0812-5005-5474",
 email: "stpizaidbintsabit2025@gmail.com",
 instagramUrl:
 "https://www.instagram.com/stpi.zaidbintsabit?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==",
 facebookUrl: "https://www.facebook.com/share/19JBxm5S9d/?mibextid=wwXIfr",
 youtubeUrl: "https://youtube.com/@zaidkidsfriends?si=6oZYriVMZ5Jsf1eB",
 mapsUrl:
 "https://www.google.com/maps/place/Sekolah+Tahfizh+Plus+IT+Zaid+bin+Tsabit/@-0.5286116,117.1654377,17z/data=!3m1!4b1!4m6!3m5!1s0x2df67fb7065a3e9d:0x73c54d69ca84c6e9!8m2!3d-0.5286116!4d117.1654377!16s%2Fg%2F11t7knv03n?hl=id-ID",
 mapsEmbed: "https://maps.google.com/maps?q=-0.5286116,117.1654377&hl=id&z=17&output=embed",
 bankInfo: {
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7293687476",
 accountName: "Sitti Hamidah",
 },
 bankAccounts: [
 {
 category: "Formulir SPMB (Semua Jenjang)",
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7293687476",
 accountName: "Sitti Hamidah",
 },
 {
 category: "SPP TK",
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7757797733",
 accountName: "TK ZAID BIN TSABIT",
 },
 {
 category: "SPP SD",
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7797737757",
 accountName: "PKBM SETARA SD ZAID BIN TSABIT",
 },
 {
 category: "SPP SMP & SMA",
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7797737733",
 accountName: "PKBM ZAID BIN TSABIT",
 },
 {
 category: "Biaya Pendidikan, Sampul Rapor & Ujian Pendidikan Kesetaraan",
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7757797757",
 accountName: "YAYASAN DZUN NURAIN AL MU BAROKAH",
 },
 {
 category: "Uang Saku, Assessment & Lain-lain",
 bank: "Bank Syariah Indonesia (BSI)",
 accountNumber: "7293687476",
 accountName: "Sitti Hamidah",
 },
 ],
};

export type ProgramDetail = {
 nama: string;
 namaEn?: string;
 deskripsi: string;
 deskripsiEn?: string;
};

export type Jenjang = {
 slug: string;
 label: string;
 labelEn?: string;
 usia: string;
 usiaEn?: string;
 tagline: string;
 taglineEn?: string;
 deskripsi: string;
 deskripsiEn?: string;
 gambar: string;
 galeriImages?: string[];
 program: string[];
 programEn?: string[];
 programDetails?: ProgramDetail[];
 guru?: { nama: string; peran: string; peranEn?: string }[];
 jadwal: { hari: string; hariEn?: string; kegiatan: string; kegiatanEn?: string }[];
 instagramHandle: string;
 instagramUrl: string;
 prestasi?: { title: string; titleEn?: string; level: string; levelEn?: string }[];
};

export const JENJANG: Jenjang[] = [
 {
 slug: "tk",
 label: "TK",
 labelEn: "Kindergarten",
 usia: "Usia 4–6 Tahun",
 usiaEn: "Ages 4–6 Years",
 tagline: "Bermain, bertumbuh, mengenal Al-Qur'an",
 taglineEn: "Play, grow, and discover the Holy Quran",
 deskripsi:
 "Jenjang TK PKBM Zaid bin Tsabit membangun fondasi karakter Qurani melalui pembelajaran berbasis bermain, sensorik, dan eksplorasi kreatif dalam lingkungan yang hangat dan aman.",
 deskripsiEn:
 "PKBM Zaid bin Tsabit Kindergarten builds a Quranic character foundation through play-based learning, sensory experiences, and creative exploration in a warm and safe environment.",
 gambar: tkImg,
 galeriImages: [kunjunganPolrestaTkImg, outingClassTkImg, pekanOlahragaTkImg, bazarImg, wisudaTkImg],
 program: [
 "Adab Islami",
 "Tahfizh Juz 30",
 "Tahsin Iqra Utsmani",
 "Outing Class & Edukasi Outdoor TK",
 "Bazar Entrepreneur Siswa Siswi",
 "Rabu Kreatif",
 "Calistung",
 "Jumat Bakat",
 "Futsal",
 ],
 programEn: [
 "Islamic Etiquette",
 "Tahfizh Juz 30",
 "Tahsin Iqra Utsmani",
 "Creative Wednesday",
 "Basic Literacy & Numeracy",
 "Talent Friday",
 "Futsal",
 ],
 programDetails: [
 {
 nama: "Adab Islami",
 namaEn: "Islamic Etiquette",
 deskripsi: "Menerapkan Adab Islami Harian",
 deskripsiEn: "Practicing daily Islamic etiquette and manners.",
 },
 {
 nama: "Tahfizh Juz 30",
 namaEn: "Tahfizh Juz 30",
 deskripsi: "Metode talaqqi dengan muroja'ah setiap hari",
 deskripsiEn: "Talaqqi method with daily memorization review (muroja'ah).",
 },
 {
 nama: "Tahsin Iqra Utsmani",
 namaEn: "Tahsin Iqra Utsmani",
 deskripsi: "Mengaji dari jilid 1 sd jilid 6",
 deskripsiEn: "Quran reading guidance from Volume 1 to Volume 6.",
 },
 {
 nama: "Rabu Kreatif",
 namaEn: "Creative Wednesday",
 deskripsi: "Mengasah kreativitas dan membangun Kemandirian",
 deskripsiEn: "Sharpening creativity and building child independence.",
 },
 {
 nama: "Calistung",
 namaEn: "Basic Literacy & Numeracy",
 deskripsi: "Mengenal abjad, suku kata, berhitung dan menulis",
 deskripsiEn: "Learning letters, syllables, counting, and writing.",
 },
 {
 nama: "Jumat Bakat",
 namaEn: "Talent Friday",
 deskripsi:
 "1. Tahsin Intensif: Meningkatkan kualitas bacaan Al-Qur'an.\n2. Teknik Mewarnai Gradasi: Melatih kreativitas, ketelitian, dan kemampuan memadukan warna untuk menghasilkan gambar yang lebih indah.",
 deskripsiEn:
 "1. Intensive Tahsin: Enhancing Quran recitation quality.\n2. Gradated Coloring Technique: Training creativity, precision, and color blending skills for beautiful artwork.",
 },
 {
 nama: "Outing Class & Edukasi Outdoor TK",
 namaEn: "TK Outing Class & Outdoor Education",
 deskripsi: "Kegiatan edukasi luar kelas untuk memberikan pengalaman belajar nyata, eksplorasi lingkungan alam, dan melatih kemandirian serta sosialisasi anak.",
 deskripsiEn: "Outdoor educational visits providing real-life learning experiences, environmental exploration, and fostering child independence and social skills.",
 },
 {
 nama: "Futsal",
 namaEn: "Futsal",
 deskripsi: "Mengembangkan bakat, kesehatan, disiplin, sportivitas.",
 deskripsiEn: "Developing sports talent, physical health, discipline, and sportsmanship.",
 },
 ],
 jadwal: [
 { hari: "Senin – Kamis", hariEn: "Monday – Thursday", kegiatan: "07.30 – 11.00 · Tahfizh, tematik, bermain terstruktur", kegiatanEn: "07.30 – 11.00 · Tahfizh, thematic, structured play" },
 { hari: "Jumat", hariEn: "Friday", kegiatan: "07.30 – 10.00 · Praktik ibadah & outdoor day", kegiatanEn: "07.30 – 10.00 · Worship practice & outdoor day" },
 ],
 instagramHandle: "@tk.zaidbintsabit",
 instagramUrl: "https://www.instagram.com/tk.zaidbintsabit",
 prestasi: [
 { title: "Juara 3 O2SN Tingkat Nasional", titleEn: "3rd Place National O2SN", level: "Nasional", levelEn: "National" },
 { title: "Juara 1 Lomba Tahfizh Tingkat Kota", titleEn: "1st Place City Level Tahfizh Contest", level: "Kota", levelEn: "City Level" },
 { title: "Juara 1, 2 & 3 Lomba Mewarnai Tingkat Kota", titleEn: "1st, 2nd & 3rd Place City Level Coloring Contest", level: "Kota", levelEn: "City Level" },
 { title: "Juara 2 Lomba Finger Printing Tingkat Kecamatan", titleEn: "2nd Place Sub-District Finger Printing Contest", level: "Kecamatan", levelEn: "Sub-District" },
 ],
 },
 {
 slug: "sd",
 label: "Setara SD",
 labelEn: "Setara SD (Elementary)",
 usia: "Usia 6–12 Tahun",
 usiaEn: "Ages 6–12 Years",
 tagline: "Literasi kuat, hafalan kokoh, logika terasah",
 taglineEn: "Strong literacy, solid memorization, sharpened logic",
 deskripsi:
 "Kurikulum SD memadukan kurikulum nasional, tahfizh terstruktur, dan literasi digital sejak dini, dengan pendampingan personal untuk setiap siswa.",
 deskripsiEn:
 "Elementary curriculum integrates the national curriculum, structured tahfizh, and early digital literacy with personal guidance for every student.",
 gambar: sdImg,
 galeriImages: [lombaMewarnaiImg, memanahImg, publicSpeakingImg, sdPerformanceImg, apelPagiImg, bazarImg],
 program: [
 "Adab Islami",
 "Tahfizh Juz 30",
 "Tahsin Iqra Utsmani",
 "Penampilan Performa & Perkembangan Siswa",
 "Bazar Entrepreneur Siswa Siswi",
 "Rabu Experiment",
 "Outing Class/bulan",
 "Jumat Kreatif",
 "Futsal",
 "Kelas Bahasa",
 "Kelas IT",
 ],
 programEn: [
 "Islamic Etiquette",
 "Tahfizh Juz 30",
 "Tahsin Iqra Utsmani",
 "Wednesday Experiment",
 "Monthly Outing Class",
 "Creative Friday",
 "Futsal",
 "Language Class",
 "IT Class",
 ],
 programDetails: [
 {
 nama: "Adab Islami",
 namaEn: "Islamic Etiquette",
 deskripsi: "Menerapkan Adab Islami Harian",
 deskripsiEn: "Practicing daily Islamic etiquette and manners.",
 },
 {
 nama: "Tahfizh Juz 30",
 namaEn: "Tahfizh Juz 30",
 deskripsi: "Metode talaqqi dengan muroja'ah setiap hari",
 deskripsiEn: "Talaqqi method with daily memorization review (muroja'ah).",
 },
 {
 nama: "Tahsin Iqra Utsmani",
 namaEn: "Tahsin Iqra Utsmani",
 deskripsi: "Mengaji dari jilid 1 sd jilid 6",
 deskripsiEn: "Quran reading guidance from Volume 1 to Volume 6.",
 },
 {
 nama: "Rabu Experiment",
 namaEn: "Wednesday Experiment",
 deskripsi: "Menumbuhkan rasa ingin tahu dan membiasakan memecahkan masalah",
 deskripsiEn: "Fostering curiosity and developing problem-solving habits.",
 },
 {
 nama: "Outing Class/bulan",
 namaEn: "Monthly Outing Class",
 deskripsi: "Menambah pengalaman belajar di luar kelas.",
 deskripsiEn: "Enriching learning experiences outside the classroom.",
 },
 {
 nama: "Jumat Kreatif",
 namaEn: "Creative Friday",
 deskripsi: "Mengasah kreativitas dan membangun Kemandirian",
 deskripsiEn: "Sharpening creativity and building independence.",
 },
 {
 nama: "Futsal",
 namaEn: "Futsal",
 deskripsi: "Mengembangkan bakat, kesehatan, disiplin, sportivitas.",
 deskripsiEn: "Developing sports talent, physical health, discipline, and sportsmanship.",
 },
 {
 nama: "Kelas Bahasa",
 namaEn: "Language Class",
 deskripsi: "Meningkatkan kemampuan berkomunikasi dalam bahasa Arab dan Inggris.",
 deskripsiEn: "Enhancing communication skills in Arabic and English languages.",
 },
 {
 nama: "Kelas IT",
 namaEn: "IT Class",
 deskripsi: "Menghasilkan karya digital berupa desain dan game",
 deskripsiEn: "Producing digital creations such as graphic design and games.",
 },
 ],
 jadwal: [
 { hari: "Senin – Kamis", hariEn: "Monday – Thursday", kegiatan: "07.00 – 14.30 · Tahfizh pagi, akademik, ekstra", kegiatanEn: "07.00 – 14.30 · Morning Tahfizh, academics, extracurriculars" },
 { hari: "Jumat", hariEn: "Friday", kegiatan: "07.00 – 11.30 · Tahsin, kajian, project day", kegiatanEn: "07.00 – 11.30 · Recitation, Islamic study, project day" },
 ],
 instagramHandle: "@stpi.sd.zaidbintsabit",
 instagramUrl: "https://www.instagram.com/stpi.sd.zaidbintsabit",
 prestasi: [
 { title: "Juara 1 Lomba Tahfizh Tingkat Kota", titleEn: "1st Place City Level Tahfizh Contest", level: "Kota", levelEn: "City Level" },
 { title: "Juara 1 Lomba Renang Tingkat Kota", titleEn: "1st Place City Level Swimming Competition", level: "Kota", levelEn: "City Level" },
 ],
 },
 {
 slug: "smp",
 label: "Setara SMP",
 labelEn: "Setara SMP (Junior High)",
 usia: "Usia 12–15 Tahun",
 usiaEn: "Ages 12–15 Years",
 tagline: "Berpikir kritis, berkarya digital",
 taglineEn: "Critical thinking, digital creation",
 deskripsi:
 "Jenjang SMP menekankan kemandirian belajar, riset sederhana, dan penguasaan teknologi kreatif dengan pembinaan akhlak yang intensif.",
 deskripsiEn:
 "Junior High School emphasizes independent learning, basic research, and creative technology mastery alongside intensive character building.",
 gambar: smpdansmaImg,
 galeriImages: [cookingClassImg, animationFacelessImg, memanahImg, kajianSiswiSmpSmaImg, tahfidzHalaqahPagiImg, pembelajaranItSmpSmaImg, kunjunganKominfoImg, publicSpeakingImg, apelPagiImg],
 program: [
 "Jalur 1 — Full Diniyah + Komputer Dasar",
 "Jalur 2 — Full Diniyah + Full Ilmu Teknologi",
 "Program Zaid Mengajar (Mengajar ke Sekolah-Sekolah Luar)",
 "Pelatihan Menjahit & Tata Busana",
 ],
 programEn: [
 "Track 1 — Full Diniyah + Basic Computer",
 "Track 2 — Full Diniyah + Full IT & Technology",
 "Zaid Mengajar Program (Teaching Outreach to External Schools)",
 "Sewing & Fashion Design",
 ],
 programDetails: [
 {
 nama: "Jalur 1 — Full Diniyah + Komputer Dasar (Non Asrama / PP)",
 namaEn: "Track 1 — Full Diniyah + Basic Computer (Non-Boarding)",
 deskripsi:
 "Materi: Tahfizh, Diniyah, Mapel Umum, dan Komputer Dasar.\n\nFasilitas & Keunggulan:\n• Pembelajaran Diniyah & Tahfizh Intensif\n• Komputer Dasar & Pembentukan Akhlak Islami\n• Lingkungan belajar nyaman & kondusif\n• Tidak ada biaya daftar ulang saat naik kelas (SPP Tetap)\n• Sudah termasuk: Seragam lengkap, Buku pelajaran, & Al-Qur'an",
 deskripsiEn:
 "Curriculum: Tahfizh, Diniyah, General Subjects, Basic Computer.\n\nFeatures & Advantages:\n• Intensive Diniyah & Tahfizh learning\n• Basic Computer & Islamic character building\n• Comfortable & conducive learning environment\n• No re-registration fee for class promotion (Fixed SPP)\n• Includes: Complete uniforms, text books, & Al-Quran",
 },
 {
 nama: "Jalur 2 — Full Diniyah + Full Ilmu Teknologi (Non Asrama / PP)",
 namaEn: "Track 2 — Full Diniyah + Full IT & Tech (Non-Boarding)",
 deskripsi:
 "Materi: Tahfizh, Diniyah, Mapel Umum, dan Full Ilmu Teknologi.\n\nFasilitas & Keunggulan:\n• Pembelajaran Diniyah, Tahfizh & Full Ilmu Teknologi\n• Proyek & Praktik IT Berkelanjutan\n• Free WiFi khusus area belajar IT\n\nPersyaratan & Ketentuan:\n• Minimal Spek Laptop: RAM 4 GB, SSD 128 GB\n• Ketentuan: Tidak diperkenankan membawa HP",
 deskripsiEn:
 "Curriculum: Tahfizh, Diniyah, General Subjects, Full IT & Tech.\n\nFeatures & Advantages:\n• Diniyah, Tahfizh & Full IT Projects\n• Continuous IT Practice & Free Study WiFi\n\nRequirements & Rules:\n• Min. Laptop Spec: RAM 4 GB, SSD 128 GB\n• Rule: Mobile phones strictly not allowed",
 },
 {
 nama: "Program Zaid Mengajar ke Sekolah-Sekolah Luar",
 namaEn: "Zaid Mengajar Program (Teaching External Schools)",
 deskripsi:
 "Program kunjungan dan edukasi di mana siswa siswi SMP PKBM Zaid bin Tsabit hadir langsung mengajar Tahfizh Al-Qur'an, komputer dasar, dan motivasi belajar ke sekolah-sekolah luar di Samarinda sebagai wadah pembentukan karakter kepemimpinan, keberanian, dan syiar Islam.",
 deskripsiEn:
 "Educational outreach program where SMP students directly teach Tahfizh Al-Quran, basic computer skills, and study motivation to external schools in Samarinda for leadership and da'wah.",
 },
 {
 nama: "Kegiatan Menjahit & Tata Busana",
 namaEn: "Sewing & Fashion Design",
 deskripsi: "Kegiatan keterampilan menjahit, tata busana dasar, dan kreasi tekstil untuk membekali kemandirian dan wirausaha siswi.",
 deskripsiEn: "Training in basic sewing skills, fashion design, and textile creations for student independence and entrepreneurship.",
 },
 ],
 jadwal: [
 { hari: "Senin – Kamis", hariEn: "Monday – Thursday", kegiatan: "06.45 – 15.30 · Tahfizh, akademik, studio kreatif", kegiatanEn: "06.45 – 15.30 · Tahfizh, academics, creative studio" },
 { hari: "Jumat", hariEn: "Friday", kegiatan: "06.45 – 11.30 · Halaqah & pengembangan diri", kegiatanEn: "06.45 – 11.30 · Halaqah & personal development" },
 ],
 instagramHandle: "@stpi.zaidbintsabit",
 instagramUrl: "https://www.instagram.com/stpi.zaidbintsabit",
 prestasi: [
 { title: "Juara 1 Komik Digital Tingkat Nasional", titleEn: "1st Place National Digital Comic Competition", level: "Nasional", levelEn: "National" },
 ],
 },
 {
 slug: "sma",
 label: "Setara SMA",
 labelEn: "Setara SMA (Senior High)",
 usia: "Usia 15–18 Tahun",
 usiaEn: "Ages 15–18 Years",
 tagline: "Siap kuliah, siap industri, siap memimpin",
 taglineEn: "Ready for university, industry, and leadership",
 deskripsi:
 "SMA PKBM Zaid bin Tsabit menyiapkan lulusan untuk universitas dalam dan luar negeri melalui peminatan sains, teknologi, dan studi Islam terapan.",
 deskripsiEn:
 "Senior High School prepares graduates for top domestic and international universities through science, technology, and applied Islamic studies.",
 gambar: smpdansmaImg,
 galeriImages: [cookingClassImg, animationFacelessImg, memanahImg, kajianSiswiSmpSmaImg, tahfidzHalaqahPagiImg, pembelajaranItSmpSmaImg, kunjunganKominfoImg, publicSpeakingImg, apelPagiImg],
 program: [
 "Jalur 1 — Full Diniyah + Komputer Dasar",
 "Jalur 2 — Full Diniyah + Full Ilmu Teknologi",
 "Program Zaid Mengajar (Mengajar ke Sekolah-Sekolah Luar)",
 "Kegiatan Menjahit & Tata Busana",
 ],
 programEn: [
 "Track 1 — Full Diniyah + Basic Computer",
 "Track 2 — Full Diniyah + Full IT & Technology",
 "Zaid Mengajar Program (IT & Tahfizh Teaching at External Schools)",
 "Sewing & Fashion Design",
 ],
 programDetails: [
 {
 nama: "Jalur 1 — Full Diniyah + Komputer Dasar (Non Asrama / PP)",
 namaEn: "Track 1 — Full Diniyah + Basic Computer (Non-Boarding)",
 deskripsi:
 "Materi: Tahfizh, Diniyah, Mapel Umum, dan Komputer Dasar.\n\nFasilitas & Keunggulan:\n• Pembelajaran Diniyah & Tahfizh Intensif\n• Komputer Dasar & Pembentukan Akhlak Islami\n• Lingkungan belajar nyaman & kondusif\n• Tidak ada biaya daftar ulang saat naik kelas (SPP Tetap)\n• Sudah termasuk: Seragam lengkap, Buku pelajaran, & Al-Qur'an",
 deskripsiEn:
 "Curriculum: Tahfizh, Diniyah, General Subjects, Basic Computer.\n\nFeatures & Advantages:\n• Intensive Diniyah & Tahfizh learning\n• Basic Computer & Islamic character building\n• Comfortable & conducive learning environment\n• No re-registration fee for class promotion (Fixed SPP)\n• Includes: Complete uniforms, text books, & Al-Quran",
 },
 {
 nama: "Jalur 2 — Full Diniyah + Full Ilmu Teknologi (Non Asrama / PP)",
 namaEn: "Track 2 — Full Diniyah + Full IT & Tech (Non-Boarding)",
 deskripsi:
 "Materi: Tahfizh, Diniyah, Mapel Umum, dan Full Ilmu Teknologi.\n\nFasilitas & Keunggulan:\n• Pembelajaran Diniyah, Tahfizh & Full Ilmu Teknologi\n• Proyek & Praktik IT Berkelanjutan\n• Free WiFi khusus area belajar IT\n\nPersyaratan & Ketentuan:\n• Minimal Spek Laptop: RAM 4 GB, SSD 128 GB\n• Ketentuan: Tidak diperkenankan membawa HP",
 deskripsiEn:
 "Curriculum: Tahfizh, Diniyah, General Subjects, Full IT & Tech.\n\nFeatures & Advantages:\n• Diniyah, Tahfizh & Full IT Projects\n• Continuous IT Practice & Free Study WiFi\n\nRequirements & Rules:\n• Min. Laptop Spec: RAM 4 GB, SSD 128 GB\n• Rule: Mobile phones strictly not allowed",
 },
 {
 nama: "Program Zaid Mengajar ke Sekolah-Sekolah Luar",
 namaEn: "Zaid Mengajar Program (IT & Tahfizh Teaching at External Schools)",
 deskripsi:
 "Siswa siswi SMA bertindak sebagai instruktur dan fasilitator pelatihan IT (Graphic Design, Coding, AI Dasar) serta pengajaran Al-Qur'an langsung ke sekolah-sekolah luar dan madrasah sekitar, mengasah keahlian komunikasi publik, kepemimpinan, dan kemanfaatan ilmu secara nyata.",
 deskripsiEn:
 "SMA students act as instructors and facilitators for IT workshops (Graphic Design, Coding, Basic AI) and Quranic teaching directly at external schools and surrounding madrasahs.",
 },
 {
 nama: "Kegiatan Menjahit & Tata Busana",
 namaEn: "Sewing & Fashion Design",
 deskripsi: "Kegiatan keterampilan menjahit, tata busana dasar, dan kreasi tekstil untuk membekali kemandirian dan wirausaha siswi.",
 deskripsiEn: "Training in basic sewing skills, fashion design, and textile creations for student independence and entrepreneurship.",
 },
 ],
 jadwal: [
 { hari: "Senin – Kamis", hariEn: "Monday – Thursday", kegiatan: "06.30 – 16.00 · Tahfizh, akademik, peminatan", kegiatanEn: "06.30 – 16.00 · Tahfizh, academics, specializations" },
 { hari: "Jumat", hariEn: "Friday", kegiatan: "06.30 – 11.30 · Kajian, mentoring karier", kegiatanEn: "06.30 – 11.30 · Islamic study, career mentoring" },
 ],
 instagramHandle: "@stpi.zaidbintsabit",
 instagramUrl: "https://www.instagram.com/stpi.zaidbintsabit",
 prestasi: [
 { title: "Juara 1 Komik Digital Tingkat Nasional", titleEn: "1st Place National Digital Comic Competition", level: "Nasional", levelEn: "National" },
 ],
 },
];

export const PROGRAM_UNGGULAN = [
 { title: "Zaid Mengajar", titleEn: "Zaid Mengajar Outreach", desc: "Program siswa siswi SMP & SMA mengajar Tahfizh & IT ke sekolah-sekolah luar.", descEn: "SMP & SMA student program teaching Quran & IT to external schools.", icon: iconPublicSpeaking },
 { title: "Tahfizh Al-Qur'an", titleEn: "Quran Memorization", desc: "Target hafalan bertingkat dengan mutqin.", descEn: "Multi-tiered memorization target with fluency.", icon: iconTahfidz },
 { title: "Bahasa Arab", titleEn: "Arabic Language", desc: "Percakapan aktif dan pemahaman kitab.", descEn: "Active conversation and Islamic literature comprehension.", icon: iconBahasaArab },
 { title: "Bahasa Inggris", titleEn: "English Language", desc: "English for Young Learners and English Conversation.", descEn: "English for Young Learners and English Conversation.", icon: iconBahasaInggris },
 { title: "Coding", titleEn: "Coding", desc: "Web, Python, dan logika algoritma.", descEn: "Web development, Python, and algorithmic logic.", icon: iconCoding },
 { title: "Robotik", titleEn: "Robotics", desc: "Kompetisi robotik nasional & internasional.", descEn: "National & international robotics competitions.", icon: iconRobotik },
 { title: "Artificial Intelligence", titleEn: "Artificial Intelligence", desc: "Dasar AI, data, dan etika teknologi.", descEn: "AI fundamentals, data science, and technology ethics.", icon: iconAi },
 { title: "Multimedia", titleEn: "Multimedia", desc: "Produksi konten dan studio sekolah.", descEn: "Content production and school media studio.", icon: iconMultimedia },
 { title: "Public Speaking", titleEn: "Public Speaking", desc: "Khitobah, debat, dan presentasi.", descEn: "Public speaking, speech, debate, and presentation.", icon: iconPublicSpeaking },
 { title: "Tata Boga", titleEn: "Culinary Arts", desc: "Kuliner halal dan kewirausahaan.", descEn: "Halal culinary arts and food entrepreneurship.", icon: iconTataBoga },
 { title: "LEGO Education", titleEn: "LEGO Education", desc: "Belajar STEM lewat konstruksi.", descEn: "STEM learning through creative construction.", icon: iconLego },
 { title: "UI/UX Design", titleEn: "UI/UX Design", desc: "Riset pengguna hingga prototipe.", descEn: "User research to interactive prototyping.", icon: iconUiUx },
 { title: "Graphic Design", titleEn: "Graphic Design", desc: "Branding dan desain visual.", descEn: "Branding and visual design.", icon: iconGraphicDesign },
 { title: "Video Editing", titleEn: "Video Editing", desc: "Storytelling dan pascaproduksi.", descEn: "Storytelling and video post-production.", icon: iconMultimedia },
 { title: "Motion Graphic", titleEn: "Motion Graphics", desc: "Animasi 2D dan visual dinamis.", descEn: "2D animation and dynamic motion visuals.", icon: iconGraphicDesign },
];

export const STATS = [
 { label: "Siswa Aktif", labelEn: "Active Students", value: 100, suffix: "+" },
 { label: "Guru & Pendidik", labelEn: "Teachers & Staff", value: 30, suffix: "+" },
 { label: "Alumni", labelEn: "Alumni", value: 200, suffix: "+" },
 { label: "Prestasi", labelEn: "Awards & Honors", value: 100, suffix: "+" },
];

export const TIMELINE = [
 { year: "2020", title: "Pendirian TK", titleEn: "TK Kindergarten Establishment", desc: "Resmi mendirikan jenjang Taman Kanak-Kanak (TK) Zaid bin Tsabit.", descEn: "Officially established Zaid bin Tsabit Kindergarten (TK)." },
 { year: "2022", title: "Pendirian SMP & SMA", titleEn: "SMP & SMA Establishment", desc: "Pembukaan jenjang Sekolah Menengah Pertama (SMP) dan Sekolah Menengah Atas (SMA) PKBM.", descEn: "Opening of PKBM Junior High (SMP) and Senior High School (SMA)." },
 { year: "2024", title: "Pendirian SD", titleEn: "SD Elementary Establishment", desc: "Pembukaan jenjang Sekolah Dasar (SD) Zaid bin Tsabit.", descEn: "Opening of Zaid bin Tsabit Elementary School (SD)." },
 { year: "2025", title: "Akreditasi B", titleEn: "Grade B Accreditation", desc: "Pencapaian Akreditasi B resmi untuk meningkatkan kualitas mutu pendidikan.", descEn: "Achievement of official Grade B Accreditation enhancing educational quality." },
 { year: "2026", title: "Podcast, Coding & Robotik", titleEn: "Podcast, Coding & Robotics", desc: "Pengembangan fasilitas Studio Podcast serta kurikulum unggulan Coding dan Robotik.", descEn: "Development of Podcast Studio facilities and flagship Coding and Robotics curriculum." },
];

export const PRESTASI = [
 { year: "", title: "Juara 1 Komik Digital Tingkat Nasional", titleEn: "1st Place National Digital Comic Competition", level: "Nasional", levelEn: "National", jenjang: "SMP & SMA", jenjangEn: "SMP & SMA" },
 { year: "", title: "Juara 3 O2SN Tingkat Nasional", titleEn: "3rd Place National O2SN", level: "Nasional", levelEn: "National", jenjang: "TK", jenjangEn: "TK Kindergarten" },
{ year: "", title: "Juara 1 Lomba Tahfizh Tingkat Kota", titleEn: "1st Place City Level Tahfizh Contest", level: "Kota", levelEn: "City Level", jenjang: "SD", jenjangEn: "SD Elementary" },
 { year: "", title: "Juara 1 Lomba Renang Tingkat Kota", titleEn: "1st Place City Level Swimming Competition", level: "Kota", levelEn: "City Level", jenjang: "SD", jenjangEn: "SD Elementary" },
 { year: "", title: "Juara 1 Lomba Tahfizh Tingkat Kota", titleEn: "1st Place City Level Tahfizh Contest", level: "Kota", levelEn: "City Level", jenjang: "TK", jenjangEn: "TK Kindergarten" },
 { year: "", title: "Juara 1, 2 & 3 Lomba Mewarnai Tingkat Kota", titleEn: "1st, 2nd & 3rd Place City Level Coloring Contest", level: "Kota", levelEn: "City Level", jenjang: "TK", jenjangEn: "TK Kindergarten" },
 { year: "", title: "Juara 2 Lomba Finger Printing Tingkat Kecamatan", titleEn: "2nd Place Sub-District Finger Printing Contest", level: "Kecamatan", levelEn: "Sub-District", jenjang: "TK", jenjangEn: "TK Kindergarten" },
 { year: "", title: "Medali Emas MTQ Pelajar", titleEn: "Gold Medal Student MTQ Quran Recitation", level: "Provinsi", levelEn: "Provincial", jenjang: "SD", jenjangEn: "SD Elementary" },
 { year: "", title: "Juara Umum Musabaqah Hifzhil Qur'an", titleEn: "Grand Champion Quran Memorization Contest", level: "Nasional", levelEn: "National", jenjang: "SD", jenjangEn: "SD Elementary" },
];

export const BERITA = [
  {
    kategori: "Terbaru",
    kategoriEn: "Latest",
    title: "IHT (In House Training) Anti Bullying Tutor PKBM Zaid bin Tsabit",
    titleEn: "In House Training (IHT) Anti-Bullying for PKBM Zaid bin Tsabit Tutors",
    desc: "Edukasi guru dan tutor menghadapi & mengatasi permasalahan peserta didik usia Remaja dan PAUD untuk menciptakan lingkungan belajar yang aman, nyaman, dan bebas perundungan.",
    descEn: "Teacher and tutor training on managing and addressing challenges of teenage and early childhood students to build a safe, supportive, and bully-free school environment.",
    date: "24 Juni 2024",
    dateEn: "June 24, 2024",
    gambar: ihtAntiBullyingImg,
  },
  {
    kategori: "Trending",
    kategoriEn: "Trending",
    title: "PKBM Bootcamp Robotic",
    titleEn: "PKBM Robotic Bootcamp",
    desc: "Pendaftaran Bootcamp Robotik & Coding PKBM Zaid bin Tsabit kini resmi dibuka. Silakan klik link pendaftaran di bawah ini:",
    descEn: "PKBM Zaid bin Tsabit Robotics & Coding Bootcamp registration is officially open. Click the registration link below:",
    date: "",
    dateEn: "",
    linkUrl: "https://robotic.stpizaidbintsabit.my.id/",
    linkText: "Daftar PKBM Bootcamp Robotic",
    linkTextEn: "Register PKBM Robotic Bootcamp",
    gambar: bootcampRoboticImg,
  },
  {
    kategori: "Populer",
    kategoriEn: "Popular",
    title: "Digital Product Preneur",
    titleEn: "Digital Product Preneur",
    desc: "Program kewirausahaan digital bagi siswa siswi untuk merancang, mengembangkan, dan memasarkan produk digital kreatif berbasis teknologi modern.",
    descEn: "Digital entrepreneurship program for students to design, develop, and market creative digital products based on modern technology.",
    date: "",
    dateEn: "",
    gambar: digitalProductPreneurImg,
  },
  {
    kategori: "Populer",
    kategoriEn: "Popular",
    title: "Animation Faceless & Design Class",
    titleEn: "Animation Faceless & Design Class",
    desc: "Kelas kreatif pembuatan video animasi faceless dan desain visual edukatif yang syar'i untuk mengasah bakat multimedia siswa siswi.",
    descEn: "Creative class for faceless video animation and educational visual design to hone students' multimedia skills.",
    date: "",
    dateEn: "",
    gambar: animationFacelessImg,
  },
  {
    kategori: "Populer",
    kategoriEn: "Popular",
    title: "ZBT Podcast",
    titleEn: "ZBT Podcast",
    desc: "Ruang bincang inspiratif dan podcast siswa siswi PKBM Zaid bin Tsabit.",
    descEn: "Inspiring talkshow and podcast by PKBM Zaid bin Tsabit students.",
    date: "",
    dateEn: "",
    gambar: zbtPodcastImg,
  },
];

export const GALERI_FILTER = [
 { id: "Semua", en: "All" },
 { id: "Kegiatan", en: "Activities" },
 { id: "Tahfizh", en: "Tahfizh" },
 { id: "Wisuda", en: "Graduation" },
 { id: "Perlombaan", en: "Competitions" },
 { id: "Study Tour", en: "Study Tour" },
];

export const GALERI = [
 { judul: "IHT (In House Training) Anti Bullying Tutor PKBM Zaid bin Tsabit", judulEn: "In House Training (IHT) Anti-Bullying for Tutors", kategori: "Kegiatan", kategoriEn: "Activities", gambar: ihtAntiBullyingImg, h: "h-80" },
 { judul: "Cooking Class & Praktik Tata Boga Siswi (SMP & SMA)", judulEn: "Cooking Class & Culinary Practice (SMP & SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: cookingClassImg, h: "h-80" },
 { judul: "Kajian Rutin Siswi (SMP & SMA)", judulEn: "Islamic Study Circle for Female Students (SMP & SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: kajianSiswiSmpSmaImg, h: "h-80" },
 { judul: "Pembelajaran IT & Praktik Komputer Siswi SMP & SMA", judulEn: "IT Learning & Computer Lab Practice (SMP & SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: pembelajaranItSmpSmaImg, h: "h-80" },
 { judul: "Public Speaking & Native Speaker SD, SMP & SMA", judulEn: "Public Speaking & Native Speaker (SD, SMP, SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: publicSpeakingImg, h: "h-80" },
 { judul: "Apel Pagi & Pembinaan Karakter Siswa Siswi SD, SMP & SMA", judulEn: "Morning Assembly & Character Building (SD, SMP, SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: apelPagiImg, h: "h-80" },
 { judul: "Outing Class & Edukasi Outdoor TK", judulEn: "TK Outdoor Education & Outing Class", kategori: "Kegiatan", kategoriEn: "Activities", gambar: outingClassTkImg, h: "h-80" },
 { judul: "Kegiatan Menjahit & Tata Busana Siswa Siswi", judulEn: "Student Sewing & Fashion Design", kategori: "Kegiatan", kategoriEn: "Activities", gambar: menjahitImg, h: "h-80" },
 { judul: "UMKM Fest Road to Ramadhan", judulEn: "UMKM Fest Road to Ramadhan Event", kategori: "Perlombaan", kategoriEn: "Competitions", gambar: umkmFestImg, h: "h-80" },
 { judul: "Kegiatan Bazar Entrepreneur Siswa Siswi", judulEn: "Student Entrepreneurship School Bazaar", kategori: "Kegiatan", kategoriEn: "Activities", gambar: bazarImg, h: "h-80" },
 { judul: "Penampilan Performa & Perkembangan Siswa SD", judulEn: "SD Student Performance & Progress Presentation", kategori: "Kegiatan", kategoriEn: "Activities", gambar: sdPerformanceImg, h: "h-80" },
 { judul: "Zaid Mengajar — Edukasi & Mengajar ke Sekolah-Sekolah Luar", judulEn: "Zaid Mengajar — Teaching at External Schools", kategori: "Kegiatan", kategoriEn: "Activities", gambar: zaidMengajarImg, h: "h-80" },
 { judul: "Halaqah Pagi & Tahfizh Al-Qur'an Siswa Siswi", judulEn: "Morning Halaqah & Tahfizh Al-Quran", kategori: "Tahfizh", kategoriEn: "Tahfizh", gambar: tahfidzHalaqahPagiImg, h: "h-80" },
 { judul: "Pelepasan & Wisuda TK", judulEn: "TK Zaid bin Tsabit Graduation", kategori: "Wisuda", kategoriEn: "Graduation", gambar: wisudaTkImg, h: "h-80" },
 { judul: "Kunjungan Edukasi & Study Tour Polresta Samarinda — Jenjang TK", judulEn: "Educational Visit & Study Tour to Samarinda Police HQ — TK Kindergarten", kategori: "Study Tour", kategoriEn: "Study Tour", gambar: kunjunganPolrestaTkImg, h: "h-80" },
 { judul: "Kunjungan Edukasi & Study Tour Dinas Kominfo Kota Samarinda (SMP & SMA)", judulEn: "Educational Visit & Study Tour to Samarinda Kominfo Office (SMP & SMA)", kategori: "Study Tour", kategoriEn: "Study Tour", gambar: kunjunganKominfoImg, h: "h-80" },
 { judul: "Pekan Olahraga Siswa Siswi SMP & SMA", judulEn: "SMP & SMA Student Sports Week", kategori: "Kegiatan", kategoriEn: "Activities", gambar: pekanOlahragaImg, h: "h-80" },
 { judul: "Pekan Olahraga Siswa Siswi TK", judulEn: "TK Student Sports Week", kategori: "Kegiatan", kategoriEn: "Activities", gambar: pekanOlahragaTkImg, h: "h-80" },
 { judul: "Kegiatan Ekstrakurikuler Memanah (SD, SMP & SMA)", judulEn: "Archery Extracurricular Activity (SD, SMP & SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: memanahImg, h: "h-80" },
 { judul: "Animation Faceless & Design Class (SMP & SMA)", judulEn: "Animation Faceless & Design Class (SMP & SMA)", kategori: "Kegiatan", kategoriEn: "Activities", gambar: animationFacelessImg, h: "h-80" },
 { judul: "Lomba Mewarnai Siswa Siswi SD", judulEn: "SD Student Coloring Contest", kategori: "Perlombaan", kategoriEn: "Competitions", gambar: lombaMewarnaiImg, h: "h-80" },
];

export interface KalenderAgenda {
 tanggal: string;
 tanggalEn: string;
 agenda: string;
 agendaEn: string;
 jenis: "Libur" | "Ujian" | "Raport" | "Efektif" | "Minggu";
 jenisEn: string;
}

export interface KalenderBulan {
 bulan: string;
 bulanEn: string;
 agendas: KalenderAgenda[];
}

export const KALENDER_BULAN: KalenderBulan[] = [
 {
 bulan: "Juli",
 bulanEn: "July",
 agendas: [
 { tanggal: "1–11 Juli", tanggalEn: "1–11 Jul", agenda: "Libur Akhir Tahun Pelajaran", agendaEn: "Year-End School Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "12 Juli", tanggalEn: "12 Jul", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "13–18 Juli", tanggalEn: "13–18 Jul", agenda: "Hari Efektif KBM", agendaEn: "Effective School Days", jenis: "Efektif", jenisEn: "Effective Days" },
 { tanggal: "19 Juli", tanggalEn: "19 Jul", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "20–25 Juli", tanggalEn: "20–25 Jul", agenda: "Hari Efektif KBM", agendaEn: "Effective School Days", jenis: "Efektif", jenisEn: "Effective Days" },
 { tanggal: "26 Juli", tanggalEn: "26 Jul", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "27–31 Juli", tanggalEn: "27–31 Jul", agenda: "Hari Efektif KBM", agendaEn: "Effective School Days", jenis: "Efektif", jenisEn: "Effective Days" },
 ],
 },
 {
 bulan: "Agustus",
 bulanEn: "August",
 agendas: [
 { tanggal: "2 Agustus", tanggalEn: "2 Aug", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "9 Agustus", tanggalEn: "9 Aug", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "16 Agustus", tanggalEn: "16 Aug", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "17 Agustus", tanggalEn: "17 Aug", agenda: "Libur Hari Kemerdekaan RI", agendaEn: "Indonesian Independence Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "23 Agustus", tanggalEn: "23 Aug", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "25 Agustus", tanggalEn: "25 Aug", agenda: "Libur Maulid Nabi Muhammad SAW", agendaEn: "Prophet Muhammad's Birthday Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "30 Agustus", tanggalEn: "30 Aug", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 ],
 },
 {
 bulan: "September",
 bulanEn: "September",
 agendas: [
 { tanggal: "6 September", tanggalEn: "6 Sep", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "13 September", tanggalEn: "13 Sep", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "20 September", tanggalEn: "20 Sep", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "27 September", tanggalEn: "27 Sep", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 ],
 },
 {
 bulan: "Oktober",
 bulanEn: "October",
 agendas: [
 { tanggal: "4 Oktober", tanggalEn: "4 Oct", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "11 Oktober", tanggalEn: "11 Oct", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "18 Oktober", tanggalEn: "18 Oct", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "25 Oktober", tanggalEn: "25 Oct", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 ],
 },
 {
 bulan: "November",
 bulanEn: "November",
 agendas: [
 { tanggal: "1 November", tanggalEn: "1 Nov", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "8 November", tanggalEn: "8 Nov", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "15 November", tanggalEn: "15 Nov", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "22 November", tanggalEn: "22 Nov", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "29 November", tanggalEn: "29 Nov", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "30 November", tanggalEn: "30 Nov", agenda: "Asesmen Sumatif Semester Ganjil", agendaEn: "Odd Semester Summative Assessment", jenis: "Ujian", jenisEn: "Exams" },
 ],
 },
 {
 bulan: "Desember",
 bulanEn: "December",
 agendas: [
 { tanggal: "6 Desember", tanggalEn: "6 Dec", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "13 Desember", tanggalEn: "13 Dec", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "18 Desember", tanggalEn: "18 Dec", agenda: "Pembagian Raport", agendaEn: "Report Card Distribution", jenis: "Raport", jenisEn: "Report Card" },
 { tanggal: "19 Desember", tanggalEn: "19 Dec", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "20 Desember", tanggalEn: "20 Dec", agenda: "Mulai Libur Semester", agendaEn: "Start of Semester Break", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "21–31 Desember", tanggalEn: "21–31 Dec", agenda: "Libur Semester", agendaEn: "Semester Break Holiday", jenis: "Libur", jenisEn: "Holiday" },
 ],
 },
 {
 bulan: "Januari",
 bulanEn: "January",
 agendas: [
 { tanggal: "1 Januari", tanggalEn: "1 Jan", agenda: "Libur Tahun Baru Masehi", agendaEn: "New Year's Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "2 Januari", tanggalEn: "2 Jan", agenda: "Libur Semester", agendaEn: "Semester Break Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "3 Januari", tanggalEn: "3 Jan", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "4 Januari", tanggalEn: "4 Jan", agenda: "Hari Efektif KBM", agendaEn: "Effective School Days", jenis: "Efektif", jenisEn: "Effective Days" },
 { tanggal: "5 Januari", tanggalEn: "5 Jan", agenda: "Libur Isra Mi'raj Nabi Muhammad SAW", agendaEn: "Isra Mi'raj Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "10 Januari", tanggalEn: "10 Jan", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "17 Januari", tanggalEn: "17 Jan", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "24 Januari", tanggalEn: "24 Jan", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "31 Januari", tanggalEn: "31 Jan", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 ],
 },
 {
 bulan: "Februari",
 bulanEn: "February",
 agendas: [
 { tanggal: "6 Februari", tanggalEn: "6 Feb", agenda: "Libur Tahun Baru Imlek", agendaEn: "Chinese New Year Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "7 Februari", tanggalEn: "7 Feb", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "8–10 Februari", tanggalEn: "8–10 Feb", agenda: "Libur Awal Puasa Ramadhan", agendaEn: "Ramadhan Fasting Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "11–13 Februari", tanggalEn: "11–13 Feb", agenda: "Hari Efektif KBM", agendaEn: "Effective School Days", jenis: "Efektif", jenisEn: "Effective Days" },
 { tanggal: "14 Februari", tanggalEn: "14 Feb", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "21 Februari", tanggalEn: "21 Feb", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "28 Februari", tanggalEn: "28 Feb", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 ],
 },
 {
 bulan: "Maret",
 bulanEn: "March",
 agendas: [
 { tanggal: "7 Maret", tanggalEn: "7 Mar", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "8 Maret", tanggalEn: "8 Mar", agenda: "Libur Puasa Ramadhan", agendaEn: "Ramadhan Fasting Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "9 Maret", tanggalEn: "9 Mar", agenda: "Libur Hari Raya Nyepi", agendaEn: "Nyepi Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "10–11 Maret", tanggalEn: "10–11 Mar", agenda: "Libur Hari Raya Idul Fitri", agendaEn: "Idul Fitri Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "12–13 Maret", tanggalEn: "12–13 Mar", agenda: "Libur Puasa Ramadhan", agendaEn: "Ramadhan Fasting Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "14 Maret", tanggalEn: "14 Mar", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "21 Maret", tanggalEn: "21 Mar", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "26 Maret", tanggalEn: "26 Mar", agenda: "Libur Wafat Isa Al Masih", agendaEn: "Good Friday Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "28 Maret", tanggalEn: "28 Mar", agenda: "Libur Hari Paskah", agendaEn: "Easter Holiday", jenis: "Libur", jenisEn: "Holiday" },
 ],
 },
 {
 bulan: "April",
 bulanEn: "April",
 agendas: [
 { tanggal: "3 April", tanggalEn: "3 Apr", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "4 April", tanggalEn: "4 Apr", agenda: "Hari Efektif KBM", agendaEn: "Effective School Days", jenis: "Efektif", jenisEn: "Effective Days" },
 { tanggal: "5 April", tanggalEn: "5 Apr", agenda: "Tes Kemampuan Akademik (SMP)", agendaEn: "SMP Academic Ability Test", jenis: "Ujian", jenisEn: "Exams" },
 { tanggal: "11 April", tanggalEn: "11 Apr", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "18 April", tanggalEn: "18 Apr", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "19 April", tanggalEn: "19 Apr", agenda: "Tes Kemampuan Akademik (SD)", agendaEn: "SD Academic Ability Test", jenis: "Ujian", jenisEn: "Exams" },
 { tanggal: "25 April", tanggalEn: "25 Apr", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 ],
 },
 {
 bulan: "Mei",
 bulanEn: "May",
 agendas: [
 { tanggal: "1 Mei", tanggalEn: "1 May", agenda: "Libur Hari Buruh Internasional", agendaEn: "International Labor Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "2 Mei", tanggalEn: "2 May", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "3 Mei", tanggalEn: "3 May", agenda: "Asesmen Sumatif Kelas 6, 9, dan 12", agendaEn: "Grade 6, 9 & 12 Summative Assessment", jenis: "Ujian", jenisEn: "Exams" },
 { tanggal: "6 Mei", tanggalEn: "6 May", agenda: "Libur Kenaikan Isa Al Masih", agendaEn: "Ascension Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "9 Mei", tanggalEn: "9 May", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "17 Mei", tanggalEn: "17 May", agenda: "Libur Hari Raya Idul Adha", agendaEn: "Idul Adha Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "20 Mei", tanggalEn: "20 May", agenda: "Libur Hari Raya Waisak", agendaEn: "Vesak Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "23 Mei", tanggalEn: "23 May", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "30 Mei", tanggalEn: "30 May", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "31 Mei", tanggalEn: "31 May", agenda: "Asesmen Sumatif Semester Genap", agendaEn: "Even Semester Summative Assessment", jenis: "Ujian", jenisEn: "Exams" },
 ],
 },
 {
 bulan: "Juni",
 bulanEn: "June",
 agendas: [
 { tanggal: "1 Juni", tanggalEn: "1 Jun", agenda: "Libur Hari Lahir Pancasila", agendaEn: "Pancasila Day Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "5 Juni", tanggalEn: "5 Jun", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "6 Juni", tanggalEn: "6 Jun", agenda: "Tahun Baru Islam (Hari Minggu)", agendaEn: "Islamic New Year Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "13 Juni", tanggalEn: "13 Jun", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "18 Juni", tanggalEn: "18 Jun", agenda: "Pembagian Raport", agendaEn: "Report Card Distribution", jenis: "Raport", jenisEn: "Report Card" },
 { tanggal: "19 Juni", tanggalEn: "19 Jun", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "20–25 Juni", tanggalEn: "20–25 Jun", agenda: "Libur Semester", agendaEn: "Semester Break Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "26 Juni", tanggalEn: "26 Jun", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "27–30 Juni", tanggalEn: "27–30 Jun", agenda: "Libur Semester", agendaEn: "Semester Break Holiday", jenis: "Libur", jenisEn: "Holiday" },
 ],
 },
 {
 bulan: "Juli Akhir",
 bulanEn: "July (End)",
 agendas: [
 { tanggal: "1–3 Juli", tanggalEn: "1–3 Jul", agenda: "Libur Semester", agendaEn: "Semester Break Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "4 Juli", tanggalEn: "4 Jul", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "5–10 Juli", tanggalEn: "5–10 Jul", agenda: "Libur Semester", agendaEn: "Semester Break Holiday", jenis: "Libur", jenisEn: "Holiday" },
 { tanggal: "11 Juli", tanggalEn: "11 Jul", agenda: "Minggu", agendaEn: "Sunday", jenis: "Minggu", jenisEn: "Sunday" },
 { tanggal: "12–31 Juli", tanggalEn: "12–31 Jul", agenda: "Libur Akhir Tahun Pelajaran / Libur Ajaran Baru", agendaEn: "Year-End School Holiday", jenis: "Libur", jenisEn: "Holiday" },
 ],
 },
];

export const KALENDER = KALENDER_BULAN.flatMap((b) =>
 b.agendas.map((a) => ({
 tanggal: a.tanggal,
 tanggalEn: a.tanggalEn,
 agenda: a.agenda,
 agendaEn: a.agendaEn,
 jenis: a.jenis,
 jenisEn: a.jenisEn,
 bulan: b.bulan,
 }))
);

export const ALUMNI = [
 {
 nama: "Vanessa Kayla",
 kampus: "UNMUL",
 jurusan: "Jurusan Management",
 kini: "UNMUL — Jurusan Management",
 kiniEn: "Mulawarman University — Management Major",
 tahun: "Alumni SMA",
 kata: "Diterima dan melanjutkan pendidikan tinggi di Universitas Mulawarman (UNMUL) Jurusan Management.",
 kataEn: "Accepted and pursuing higher education at Mulawarman University in Management.",
 },
 {
 nama: "Safa",
 kampus: "UMKT",
 jurusan: "Perguruan Tinggi",
 kini: "UMKT (Universitas Muhammadiyah Kaltim)",
 kiniEn: "UMKT (Muhammadiyah University of East Kalimantan)",
 tahun: "Alumni SMA",
 kata: "Diterima dan menempuh perkuliahan di Universitas Muhammadiyah Kalimantan Timur (UMKT).",
 kataEn: "Accepted and studying at Muhammadiyah University of East Kalimantan (UMKT).",
 },
 {
 nama: "Helva Dinda",
 kampus: "UNMUL",
 jurusan: "Jurusan PAUD",
 kini: "UNMUL — Jurusan PAUD",
 kiniEn: "Mulawarman University — Early Childhood Education",
 tahun: "Alumni SMA",
 kata: "Diterima di Universitas Mulawarman (UNMUL) Program Studi Pendidikan Anak Dini Usia (PAUD).",
 kataEn: "Accepted at Mulawarman University in Early Childhood Education (PAUD).",
 },
 {
 nama: "Athalia",
 kampus: "POLNES",
 jurusan: "Jurusan Akuntansi",
 kini: "POLNES — Jurusan Akuntansi",
 kiniEn: "POLNES — Accounting Major",
 tahun: "Alumni SMA",
 kata: "Menempuh pendidikan vokasi di Politeknik Negeri Samarinda (POLNES) Jurusan Akuntansi.",
 kataEn: "Pursuing higher education at Samarinda State Polytechnic (POLNES) in Accounting.",
 },
 {
 nama: "Kayla Marsya",
 kampus: "STDI Jember",
 jurusan: "Jurusan Bahasa Arab",
 kini: "STDI Jember — Jurusan Bahasa Arab",
 kiniEn: "STDI Jember — Arabic Language Major",
 tahun: "Alumni SMA",
 kata: "Melanjutkan studi di STDI Imam Syafi'i Jember Jurusan Bahasa Arab.",
 kataEn: "Continuing higher studies at STDI Imam Syafi'i Jember in Arabic Language.",
 },
 {
 nama: "Dan Lain-Lain...",
 kampus: "Perguruan Tinggi Unggulan",
 jurusan: "Berbagai Program Studi",
 kini: "Alumni Tersebar di Berbagai Kampus & Lembaga Pendidikan",
 kiniEn: "Graduates Studying Across Top Universities & Institutions",
 tahun: "Alumni",
 isMore: true,
 kata: "Serta banyak alumni PKBM Zaid bin Tsabit lainnya yang telah sukses melangkah ke berbagai perguruan tinggi favorit.",
 kataEn: "And many more PKBM Zaid bin Tsabit graduates studying across various prestigious universities.",
 },
];

export const FAQ = [
 { q: "Kapan SPMB dibuka?", qEn: "When do admissions open?", a: "Gelombang I dibuka 12 Agustus dan ditutup setelah kuota terpenuhi.", aEn: "Phase I opens on August 12 and closes once quota is filled." },
 { q: "Apakah tersedia program beasiswa?", qEn: "Are scholarships available?", a: "Ya, tersedia beasiswa tahfizh, prestasi akademik, dan beasiswa yatim/dhuafa.", aEn: "Yes, scholarships are available for tahfizh, academic achievement, and financial aid." },
 { q: "Apakah sekolah menyediakan asrama?", qEn: "Does the school provide boarding facilities?", a: "Asrama tersedia untuk jenjang SMP dan SMA dengan pembinaan 24 jam.", aEn: "Boarding is available for Junior & Senior High students with 24-hour supervision." },
 { q: "Bagaimana cara melakukan pendaftaran SPMB?", qEn: "How do I register for SPMB?", a: "Pendaftaran dapat dilakukan secara online melalui tombol SPMB di website ini atau hubungi admin via WhatsApp.", aEn: "Registration can be done online via the SPMB button on this website or by contacting admin via WhatsApp." },
];
