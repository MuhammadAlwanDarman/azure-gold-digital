import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Bot, ExternalLink, MessageCircle, RefreshCw, Send, Sparkles, User, X } from "lucide-react";
import { FAQ, JENJANG, SCHOOL } from "@/lib/school-data";
import { useLanguage } from "@/lib/LanguageContext";
import { Link } from "@tanstack/react-router";

interface ChatMessage {
 id: string;
 sender: "bot" | "user";
 text: string;
 time: string;
 link?: { label: string; url: string; isExternal?: boolean } | undefined;
}

export function FloatingActions() {
 const [top, setTop] = useState(false);
 const [chatOpen, setChatOpen] = useState(false);
 const [input, setInput] = useState("");
 const [isTyping, setIsTyping] = useState(false);
 const { t, lang } = useLanguage();
 const messagesEndRef = useRef<HTMLDivElement>(null);

 const getInitialMessages = (): ChatMessage[] => [
 {
 id: "welcome",
 sender: "bot",
 text: t(
 "Assalamu'alaikum! Selamat datang di Sekolah Tahfizh Plus IT Zaid bin Tsabit. Saya Asisten AI ZBT. Ada yang bisa saya bantu terkait SPMB, Jenjang TK/SD/SMP/SMA, atau Program Unggulan?",
 "Assalamu'alaikum! Welcome to Zaid bin Tsabit Tahfizh Plus IT School. I am ZBT AI Assistant. How can I help you regarding SPMB admissions, levels (TK/SD/SMP/SMA), or featured programs?"
 ),
 time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
 },
 ];

 const [messages, setMessages] = useState<ChatMessage[]>(getInitialMessages);

 useEffect(() => {
 const onScroll = () => setTop(window.scrollY> 600);
 window.addEventListener("scroll", onScroll, { passive: true });
 return () => window.removeEventListener("scroll", onScroll);
 }, []);

 useEffect(() => {
 if (chatOpen) {
 messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
 }
 }, [messages, isTyping, chatOpen]);

 const handleReset = () => {
 setMessages(getInitialMessages());
 };

 const generateBotReply = (userQuery: string): { text: string; link?: { label: string; url: string; isExternal?: boolean } } => {
 const q = userQuery.toLowerCase();

 if (q.includes("ppdb") || q.includes("spmb") || q.includes("daftar") || q.includes("pendaftaran") || q.includes("syarat") || q.includes("register") || q.includes("admission")) {
 return {
 text: t(
 "Pendaftaran SPMB Gelombang I dibuka mulai 12 Agustus. Alur pendaftaran:\n1. Buat akun & isi formulir online\n2. Unggah berkas (KK, Akta, Pasfoto)\n3. Ikuti tes pemetaan & wawancara\n4. Pengumuman & Daftar Ulang.",
 "SPMB Phase I admissions open on August 12. Steps:\n1. Create account & fill online form\n2. Upload documents (ID, Birth Certificate, Photo)\n3. Placement test & interview\n4. Results & Re-registration."
 ),
 link: { label: t("Ke Halaman SPMB Online", "Go to Online SPMB"), url: "/ppdb" },
 };
 }

 if (q.includes("biaya") || q.includes("spp") || q.includes("uang") || q.includes("beasiswa") || q.includes("fee") || q.includes("scholarship")) {
 return {
 text: t(
 "Informasi rincian biaya pendaftaran & SPP tersedia secara transparan pada formulir SPMB. Kami juga menyediakan Beasiswa Tahfizh, Prestasi Akademik, serta Beasiswa Dhuafa/Yatim.",
 "Registration fee and tuition details are available transparently in the SPMB form. We also provide Tahfizh, Academic Achievement, and Financial Aid scholarships."
 ),
 link: { label: t("Cek Syarat & Formulir SPMB", "Check Requirements & SPMB"), url: "/ppdb" },
 };
 }

 if (q.includes("masing") || q.includes("jelaskan jenjang") || q.includes("semua jenjang")) {
 return {
 text: t(
 "Berikut 4 Jenjang Pendidikan di PKBM Zaid bin Tsabit:\n\n1. TK (Usia 4–6 Thn): Adab Islami, Tahfizh, Tahsin Iqra, Rabu Kreatif, Calistung, Jumat Bakat & Futsal.\n2. Setara SD (Usia 6–12 Thn): Tahfizh, Coding Dasar, Robotik & Public Speaking.\n3. Setara SMP (Usia 12–15 Thn): Tahfizh, AI Dasar, Multimedia & Asrama 24 Jam.\n4. Setara SMA (Usia 15–18 Thn): Tahfizh, UI/UX, Motion Graphic & AI Engineering.",
 "Here are the 4 Education Levels at PKBM Zaid bin Tsabit:\n\n1. TK Kindergarten (Ages 4–6): Islamic Etiquette, Tahfizh, Tahsin Iqra, Creative Wednesday, Calistung, Talent Friday & Futsal.\n2. Setara SD Elementary (Ages 6–12): Tahfizh, Basic Coding, Robotics & Public Speaking.\n3. Setara SMP Junior High (Ages 12–15): Tahfizh, Basic AI, Multimedia & 24-hr Boarding.\n4. Setara SMA Senior High (Ages 15–18): Tahfizh, UI/UX, Motion Graphics & AI Engineering."
 ),
 };
 }

 if (q.includes("tk") || q.includes("kindergarten")) {
 const tk = JENJANG.find((j) => j.slug === "tk")!;
 return {
 text: t(
 `Jenjang TK PKBM Zaid bin Tsabit (${tk.usia}): ${tk.tagline}. Program unggulan: Adab Islami, Tahfizh, Tahsin Iqra Utsmani, Rabu Kreatif, Calistung, Jumat Bakat, dan Futsal. Instagram resmi: ${tk.instagramHandle}`,
 `TK Kindergarten (${tk.usia}): ${tk.taglineEn}. Key programs: Islamic Etiquette, Tahfizh, Tahsin Iqra Utsmani, Creative Wednesday, Calistung, Talent Friday, and Futsal. Official Instagram: ${tk.instagramHandle}`
 ),
 link: { label: t("Lihat Detail Jenjang TK", "View TK Details"), url: "/jenjang/tk" },
 };
 }

 if (q.includes("sd") || q.includes("elementary")) {
 const sd = JENJANG.find((j) => j.slug === "sd")!;
 return {
 text: t(
 `Jenjang Setara SD PKBM Zaid bin Tsabit (${sd.usia}): ${sd.tagline}. Program Tahfizh Al-Qur'an, Coding Dasar, Robotik, Public Speaking, dan Bahasa Arab/Inggris. Instagram resmi: ${sd.instagramHandle}`,
 `Setara SD Elementary (${sd.usia}): ${sd.taglineEn}. Tahfizh Quran program, Basic Coding, Robotics, Public Speaking, and Arabic/English. Official Instagram: ${sd.instagramHandle}`
 ),
 link: { label: t("Lihat Detail Jenjang Setara SD", "View Setara SD Details"), url: "/jenjang/sd" },
 };
 }

 if (q.includes("smp") || q.includes("junior")) {
 const smp = JENJANG.find((j) => j.slug === "smp")!;
 return {
 text: t(
 `Jenjang Setara SMP PKBM Zaid bin Tsabit (${smp.usia}): ${smp.tagline}. Program Tahfizh Al-Qur'an, AI & Data Dasar, Multimedia, Graphic Design, serta fasilitas Asrama/Boarding 24 jam. Instagram resmi: ${smp.instagramHandle}`,
 `Setara SMP Junior High (${smp.usia}): ${smp.taglineEn}. Tahfizh Quran program, Basic AI & Data, Multimedia, and 24-hour Boarding facility. Official Instagram: ${smp.instagramHandle}`
 ),
 link: { label: t("Lihat Detail Jenjang Setara SMP", "View Setara SMP Details"), url: "/jenjang/smp" },
 };
 }

 if (q.includes("sma") || q.includes("senior")) {
 const sma = JENJANG.find((j) => j.slug === "sma")!;
 return {
 text: t(
 `Jenjang Setara SMA PKBM Zaid bin Tsabit (${sma.usia}): ${sma.tagline}. Program Tahfizh Al-Qur'an, UI/UX Design, Video Editing, Motion Graphics, AI Engineering, dan persiapan Olimpiade. Instagram resmi: ${sma.instagramHandle}`,
 `Setara SMA Senior High (${sma.usia}): ${sma.taglineEn}. Tahfizh Quran program, UI/UX Design, Video Editing, Motion Graphics, AI Engineering, and Science Olympiad. Official Instagram: ${sma.instagramHandle}`
 ),
 link: { label: t("Lihat Detail Jenjang Setara SMA", "View Setara SMA Details"), url: "/jenjang/sma" },
 };
 }

 if (q.includes("lokasi") || q.includes("alamat") || q.includes("dimana") || q.includes("location") || q.includes("address") || q.includes("maps")) {
 return {
 text: t(
 `Alamat Kampus: ${SCHOOL.address}. Anda dapat mengunjungi lokasi kami langsung atau melakukan Virtual Tour di beranda.`,
 `Campus Address: ${SCHOOL.addressEn}. You are welcome to visit our campus directly or take a Virtual Tour on the home page.`
 ),
 link: { label: t("Buka Google Maps", "Open Google Maps"), url: SCHOOL.mapsUrl, isExternal: true },
 };
 }

 if (q.includes("wa") || q.includes("whatsapp") || q.includes("kontak") || q.includes("telepon") || q.includes("contact") || q.includes("phone")) {
 return {
 text: t(
 `Anda dapat menghubungi Layanan Informasi & Hubungan Masyarakat kami via WhatsApp di ${SCHOOL.phone} (Senin–Sabtu, 08.00–16.00 WITA).`,
 `You can reach our Information & Admissions Helpdesk via WhatsApp at ${SCHOOL.phone} (Monday–Saturday, 08:00–16:00 WITA).`
 ),
 link: { label: t("Chat via WhatsApp", "Chat via WhatsApp"), url: `https://wa.me/6281250055474`, isExternal: true },
 };
 }

 if (q.includes("asrama") || q.includes("boarding") || q.includes("pondok") || q.includes("pesantren")) {
 return {
 text: t(
 "Fasilitas Asrama/Boarding School tersedia khusus untuk jenjang SMP dan SMA dengan pengawasan 24 jam oleh ustadz/ustadzah pembina halaqah.",
 "Boarding School facilities are available for Junior (SMP) and Senior High (SMA) students with 24-hour guidance by assigned Tahfizh mentors."
 ),
 };
 }

 if (q.includes("program") || q.includes("tahfidz") || q.includes("tahfizh") || q.includes("coding") || q.includes("ai") || q.includes("robotik")) {
 return {
 text: t(
 "Program Unggulan PKBM Zaid bin Tsabit:\n1. Tahfizh Al-Qur'an (Target hingga 30 Juz)\n2. Bahasa Arab & Inggris Imersif\n3. Coding, Web & Python Logic\n4. Robotik & STEM Education\n5. Artificial Intelligence (AI) & Data\n6. Multimedia, Motion Graphic & UI/UX Design\n7. Public Speaking & Kewirausahaan.",
 "PKBM Zaid bin Tsabit Featured Programs:\n1. Quranic Tahfizh (Target up to 30 Juz)\n2. Immersive Arabic & English\n3. Coding, Web & Python Logic\n4. Robotics & STEM Education\n5. Artificial Intelligence (AI) & Data\n6. Multimedia, Motion Graphics & UI/UX Design\n7. Public Speaking & Entrepreneurship."
 ),
 };
 }

 // Default friendly response
 return {
 text: t(
 "Terima kasih atas pertanyaan Anda. Untuk informasi lebih lanjut mengenai pendaftaran, silakan kunjungi halaman SPMB Online atau hubungi panitia via WhatsApp.",
 "Thank you for reaching out. For detailed registration guidelines, please visit the Online SPMB page or contact our team via WhatsApp."
 ),
 link: { label: t("Chat WhatsApp Panitia", "Contact Admissions WhatsApp"), url: "https://wa.me/6281250055474", isExternal: true },
 };
 };

 const handleSend = (textToSend?: string) => {
 const msgText = (textToSend || input).trim();
 if (!msgText || isTyping) return;

 const userMsg: ChatMessage = {
 id: Date.now().toString(),
 sender: "user",
 text: msgText,
 time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
 };

 setMessages((prev) => [...prev, userMsg]);
 if (!textToSend) setInput("");
 setIsTyping(true);

 setTimeout(() => {
 const replyData = generateBotReply(msgText);
 const botMsg: ChatMessage = {
 id: (Date.now() + 1).toString(),
 sender: "bot",
 text: replyData.text,
 time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
 link: replyData.link,
 };
 setMessages((prev) => [...prev, botMsg]);
 setIsTyping(false);
 }, 600);
 };

 const quickQuestions = [
 { label: t("Syarat SPMB", "Admission Requirements"), query: "syarat spmb" },
 { label: t("Apa saja program sekolah ini?", "What programs does this school offer?"), query: "apa saja program sekolah ini" },
 { label: t("Jelaskan masing-masing jenjang", "Explain each education level"), query: "jelaskan masing masing jenjang" },
 { label: t("Asrama & Lokasi", "Boarding & Location"), query: "asrama dan lokasi" },
 ];

 return (
 <>
 <div className="fixed bottom-6 right-5 z-[85] flex flex-col items-end gap-3">
 <AnimatePresence>
 {chatOpen && (
 <motion.div
 initial={{ opacity: 0, y: 20, scale: 0.94 }}
 animate={{ opacity: 1, y: 0, scale: 1 }}
 exit={{ opacity: 0, y: 20, scale: 0.94 }}
 className="flex h-[28rem] w-[22rem] flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-luxe sm:w-[24rem]"
>
 {/* Header */}
 <div className="flex items-center justify-between bg-navy px-4 py-3.5 text-primary-foreground border-b border-white/10">
 <div className="flex items-center gap-2.5">
 <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold border border-gold/40">
 <Bot className="h-4 w-4" />
 <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-navy" />
 </div>
 <div>
 <h3 className="text-xs font-extrabold tracking-wide text-white">
 {t("Asisten AI PKBM ZBT", "PKBM ZBT AI Assistant")}
 </h3>
 <p className="text-[10px] text-gold">{t("Online · Siap Membantu", "Online · Ready to Help")}</p>
 </div>
 </div>
 <div className="flex items-center gap-1">
 <button
 onClick={handleReset}
 title={t("Reset percakapan", "Reset chat")}
 className="rounded-lg p-1.5 text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-white"
>
 <RefreshCw className="h-3.5 w-3.5" />
 </button>
 <button
 onClick={() =>setChatOpen(false)}
 aria-label={t("Tutup chat", "Close chat")}
 className="rounded-lg p-1.5 text-primary-foreground/70 transition-colors hover:bg-white/10 hover:text-white"
>
 <X className="h-4 w-4" />
 </button>
 </div>
 </div>

 {/* Messages Area */}
 <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
 {messages.map((m) => (
 <div
 key={m.id}
 className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
>
 <div className="flex items-start gap-2 max-w-[88%]">
 {m.sender === "bot" && (
 <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-navy text-gold">
 <Bot className="h-3.5 w-3.5" />
 </div>
 )}
 <div>
 <div
 className={`rounded-2xl px-3.5 py-2.5 leading-relaxed whitespace-pre-line ${
 m.sender === "user"
 ? "bg-gradient-to-r from-gold to-gold-soft text-navy-deep font-semibold shadow-sm"
 : "bg-muted text-foreground border border-border"
 }`}
>
 {m.text}
 </div>

 {m.link && (
 <div className="mt-2">
 {m.link.isExternal ? (
 <a
 href={m.link.url}
 target="_blank"
 rel="noopener noreferrer"
 className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold transition-colors hover:bg-gold hover:text-navy-deep"
>
 {m.link.label} <ExternalLink className="h-3 w-3" />
 </a>
 ) : (
 <Link
 to={m.link.url}
 onClick={() => setChatOpen(false)}
 className="inline-flex items-center gap-1.5 rounded-xl border border-gold/40 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold transition-colors hover:bg-gold hover:text-navy-deep"
>
 {m.link.label} &rarr;
 </Link>
 )}
 </div>
 )}
 <span className="mt-1 block text-[9px] text-muted-foreground">
 {m.time}
 </span>
 </div>
 </div>
 </div>
 ))}

 {isTyping && (
 <div className="flex items-center gap-2">
 <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy text-gold">
 <Bot className="h-3.5 w-3.5" />
 </div>
 <div className="rounded-2xl bg-muted px-4 py-2.5 text-xs text-muted-foreground flex items-center gap-1">
 <span>{t("Asisten sedang mengetik", "Assistant is typing")}</span>
 <span className="animate-bounce">.</span>
 <span className="animate-bounce delay-100">.</span>
 <span className="animate-bounce delay-200">.</span>
 </div>
 </div>
 )}
 <div ref={messagesEndRef} />
 </div>

 {/* Quick Questions Chips */}
 {messages.length < 4 && (
 <div className="border-t border-border bg-muted/30 p-2.5">
 <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
 {t("Pertanyaan Populer:", "Popular Questions:")}
 </p>
 <div className="flex flex-wrap gap-1.5">
 {quickQuestions.map((qq) => (
 <button
 key={qq.query}
 onClick={() =>handleSend(qq.query)}
 className="rounded-full border border-border bg-card px-2.5 py-1 text-[10px] font-semibold text-foreground transition-colors hover:border-gold hover:text-gold"
>
 {qq.label}
 </button>
 ))}
 </div>
 </div>
 )}

 {/* Input Area */}
 <form
 onSubmit={(e) => {
 e.preventDefault();
 handleSend();
 }}
 className="flex items-center gap-2 border-t border-border p-3 bg-card"
>
 <input
 type="text"
 value={input}
 onChange={(e) => setInput(e.target.value)}
 placeholder={t("Tulis pertanyaan Anda…", "Type your question…")}
 className="w-full rounded-full border border-border bg-muted px-4 py-2 text-xs text-foreground focus:border-gold focus:outline-none"
 />
 <button
 type="submit"
 disabled={!input.trim() || isTyping}
 className="rounded-full bg-gold p-2 text-navy-deep transition-all hover:scale-105 disabled:opacity-40"
 aria-label={t("Kirim", "Send")}
>
 <Send className="h-4 w-4" />
 </button>
 </form>
 </motion.div>
 )}
 </AnimatePresence>

 <AnimatePresence>
 {top && (
 <motion.button
 initial={{ opacity: 0, scale: 0.6 }}
 animate={{ opacity: 1, scale: 1 }}
 exit={{ opacity: 0, scale: 0.6 }}
 onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
 aria-label={t("Kembali ke atas", "Scroll to top")}
 className="rounded-full border border-border bg-card p-3 shadow-luxe transition-transform hover:-translate-y-1"
>
 <ArrowUp className="h-4 w-4" />
 </motion.button>
 )}
 </AnimatePresence>

 <button
 onClick={() =>setChatOpen((c) => !c)}
 aria-label={t("Buka asisten", "Open assistant")}
 className="relative rounded-full bg-navy p-3.5 text-primary-foreground shadow-luxe transition-transform hover:scale-110"
>
 <Bot className="h-5 w-5 text-gold" />
 <span className="absolute -right-0.5 -top-0.5 flex h-3 w-3">
 <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
 <span className="relative inline-flex h-3 w-3 rounded-full bg-gold" />
 </span>
 </button>

 <a
 href="https://wa.me/6281250055474"
 target="_blank"
 rel="noreferrer"
 aria-label={t("Hubungi via WhatsApp", "Contact via WhatsApp")}
 className="animate-float rounded-full bg-[oklch(0.72_0.17_150)] p-3.5 text-white shadow-luxe transition-transform hover:scale-110"
>
 <MessageCircle className="h-5 w-5" />
 </a>
 </div>
 </>
 );
}
