import React, { useState, useEffect, useRef } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import mascotSalamImg from "@/assets/mascot_salam.png";
import mascotTunjukImg from "@/assets/mascot_tunjuk.png";
import mascotSelebrasiImg from "@/assets/mascot_selebrasi.png";
import { playCelebrationSound, playPopSound, fireCelebrationConfetti } from "@/lib/sound-effects";

interface MascotStageProps {
 onSelectAction?: (action: string) => void;
 className?: string;
}

interface TabletView {
 badge: string;
 title: string;
 sub: string;
 detail: string;
 speech: string;
}

const DEFAULT_TABLET_VIEW: TabletView = {
 badge: "SPP ONLINE",
 title: "Status: Siap Bayar ",
 sub: "TK, SD, SMP, SMA",
 detail: "Klik Ganti View ",
 speech: "Ada yang ingin ditanyakan seputar SPP? Pak Guru siap membantu!",
};

const TABLET_VIEWS: TabletView[] = [
 DEFAULT_TABLET_VIEW,
 {
 badge: "BANK & QRIS",
 title: "BSI & Mandiri ",
 sub: "Verifikasi Admin Resmi",
 detail: "Transfer / QRIS ",
 speech: "Pembayaran SPP bisa via Transfer BSI, Mandiri, BCA, atau QRIS instan!",
 },
 {
 badge: "KATEGORI",
 title: "SPP, Gedung & Buku ",
 sub: "Seragam & Katering Siswa Siswi",
 detail: "Lengkap & Praktis ",
 speech: "Anda bisa bayar SPP bulanan, Uang Gedung, Seragam, Buku, katering & Infaq!",
 },
 {
 badge: "BEASISWA",
 title: "Diskon & Beasiswa ",
 sub: "Siswa Siswi Berprestasi Tahfizh",
 detail: "Cek Syarat & Ketentuan ",
 speech: "Semoga Allah melimpahkan rezeki yang halal dan berkah bagi Ayah & Bunda!",
 },
];

export const MascotStage: React.FC<MascotStageProps> = ({ onSelectAction, className = "" }) => {
 const containerRef = useRef<HTMLDivElement>(null);

 // States
 const [pose, setPose] = useState<"wave" | "point" | "celebrate">("wave");
 const [tabletIdx, setTabletIdx] = useState(0);
 const [speechText, setSpeechText] = useState(DEFAULT_TABLET_VIEW.speech);
 const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });

 // 3D Parallax on Mouse Move
 const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
 if (!containerRef.current) return;
 const rect = containerRef.current.getBoundingClientRect();
 const centerX = rect.left + rect.width / 2;
 const centerY = rect.top + rect.height / 2;

 const mouseX = e.clientX - centerX;
 const mouseY = e.clientY - centerY;

 // Calculate rotation limits (-12deg to +12deg)
 const rotateY = (mouseX / (rect.width / 2)) * 14;
 const rotateX = -(mouseY / (rect.height / 2)) * 10;

 const offsetX = (mouseX / (rect.width / 2)) * 5;
 const offsetY = (mouseY / (rect.height / 2)) * 4;

 setTilt({
 rotateX: Math.max(-12, Math.min(12, rotateX)),
 rotateY: Math.max(-14, Math.min(14, rotateY)),
 translateX: Math.max(-8, Math.min(8, offsetX * 0.8)),
 translateY: Math.max(-6, Math.min(6, offsetY * 0.8)),
 });
 };

 const handleMouseLeave = () => {
 setTilt({ rotateX: 0, rotateY: 0, translateX: 0, translateY: 0 });
 };

 // Tablet click handler
 const handleNextTabletView = (e: React.MouseEvent) => {
 e.stopPropagation();
 playPopSound();
 const nextIdx = (tabletIdx + 1) % TABLET_VIEWS.length;
 setTabletIdx(nextIdx);
 const targetView = TABLET_VIEWS[nextIdx] ?? DEFAULT_TABLET_VIEW;
 setSpeechText(targetView.speech);
 };

 // Scroll to SPP payment section helper
 const scrollToPaymentSection = () => {
 const el = document.getElementById("spp-payment-section") || document.getElementById("spp-form");
 if (el) {
 el.scrollIntoView({ behavior: "smooth", block: "start" });
 } else {
 window.location.href = "/spp#spp-payment-section";
 }
 };

 // Pose button handlers
 const handlePoseChange = (newPose: "wave" | "point" | "celebrate", customSpeech: string) => {
 setPose(newPose);
 setSpeechText(customSpeech);
 if (newPose === "celebrate") {
 playCelebrationSound();
 fireCelebrationConfetti();
 } else {
 playPopSound();
 }
 if (newPose === "point") {
 scrollToPaymentSection();
 }
 if (onSelectAction) onSelectAction(newPose);
 };

 const currentTablet: TabletView = TABLET_VIEWS[tabletIdx] ?? DEFAULT_TABLET_VIEW;

 const mascotImages = {
 wave: mascotSalamImg,
 point: mascotTunjukImg,
 celebrate: mascotSelebrasiImg,
 };
 const activeMascotImg = mascotImages[pose];

 // Dynamic Mascot Pose Style Offsets
 const poseTransform =
 pose === "wave"
 ? "translateY(0px) scale(1) rotate(0deg)"
 : pose === "point"
 ? "translateY(-4px) scale(1.02) rotate(-2deg)"
 : "translateY(-8px) scale(1.04) rotate(2deg)";

 return (
 <div
 ref={containerRef}
 id="mascot-hero-stage"
 className={`relative mx-auto w-full max-w-lg select-none transition-all duration-300 ease-out ${className}`}
 onMouseMove={handleMouseMove}
 onMouseLeave={handleMouseLeave}
>
 {/* Background Glowing Aura */}
 <div className="absolute -inset-4 rounded-[3rem] bg-gradient-to-r from-blue-500/20 via-amber-400/20 to-emerald-400/20 blur-2xl opacity-70 animate-pulse" />

 {/* 3D Tilt Card Shell */}
 <div
 id="mascot-stage-card"
 className="relative mx-auto w-full transition-transform duration-300 ease-out"
 style={{
 transform: `perspective(1000px) rotateY(${tilt.rotateY}deg) rotateX(${tilt.rotateX}deg)`,
 }}
>
 <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-white/95 via-amber-50/50 to-blue-50/70 p-6 shadow-2xl ring-1 ring-white/80 backdrop-blur-xl dark:from-slate-900/95 dark:via-slate-800/80 dark:to-navy-deep/90 dark:ring-white/10 dark:text-white">
 
 {/* Top Badge Bar */}
 <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 pb-3 dark:border-slate-700/60">
 <div className="flex items-center gap-2">
 <span className="relative flex h-3 w-3">
 <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
 <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
 </span>
 <span className="text-xs font-bold tracking-wide text-slate-700 dark:text-slate-200">
 Pak Guru SPP
 </span>
 </div>
 <div className="flex items-center gap-1.5 rounded-full bg-blue-100/80 px-3 py-1 text-[11px] font-semibold text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/40">
 <Sparkles className="h-3 w-3 text-amber-500" />
 <span>Interaktif</span>
 </div>
 </div>

 {/* Speech Bubble */}
 <div
 id="mascot-speech-bubble"
 className="relative mt-4 z-20 transition-all duration-300 transform"
 style={{ opacity: 1 }}
>
 <div className={`relative rounded-2xl bg-white/95 p-4 shadow-xl text-slate-800 backdrop-blur-md dark:bg-slate-800/95 dark:text-slate-100 transition-all duration-500 ${
 pose === "celebrate" 
 ? "ring-2 ring-gold shadow-gold animate-pulse" 
 : "ring-1 ring-blue-100 dark:ring-slate-700"
 }`}>
 <div className="flex items-start gap-3">
 <div className={`grid h-8 w-8 shrink-0 place-items-center rounded-xl font-bold text-xs shadow-md transition-all ${
 pose === "celebrate"
 ? "bg-gradient-to-r from-amber-500 to-emerald-500 text-white shadow-amber-500/40 animate-bounce"
 : "bg-blue-600 text-white shadow-blue-500/30"
 }`}>
 {pose === "celebrate" ? "" : "‍"}
 </div>
 <div className="flex-1">
 <p
 id="mascot-speech-text"
 className="text-xs sm:text-sm font-semibold leading-relaxed text-slate-700 dark:text-slate-200"
>
 {speechText}
 </p>
 </div>
 </div>
 {/* Bubble Tail */}
 <div className="absolute -bottom-2 left-8 h-4 w-4 rotate-45 bg-white ring-r ring-b ring-blue-100 dark:bg-slate-800 dark:ring-slate-700" />
 </div>
 </div>

 {/* Character Viewport Stage */}
 <div
 id="mascot-character-viewport"
 className="relative mt-2 flex h-[380px] sm:h-[420px] w-full items-center justify-center overflow-hidden"
>
 {/* Floating Decorative 3D Spheres */}
 <div className="absolute top-6 left-4 h-10 w-10 rounded-full bg-gradient-to-tr from-yellow-400 to-amber-300 blur-[1px] shadow-lg shadow-amber-400/40 animate-bounce" style={{ animationDuration: "4s" }} />
 <div className="absolute bottom-12 right-6 h-14 w-14 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-400 blur-[1px] shadow-lg shadow-blue-500/40 animate-bounce" style={{ animationDuration: "5s", animationDelay: "1s" }} />
 <div className="absolute top-1/3 right-4 h-6 w-6 rounded-full bg-emerald-400/60 blur-[1px] animate-pulse" />
 {/* Mascot Character Image & Layers */}
 <div
 id="mascot-rig-wrapper"
 onClick={() => {
 handlePoseChange(
 "point",
 "Silakan isi form NIS & data siswa siswi di bawah untuk bayar SPP, Uang Gedung, atau Seragam! "
 );
 }}
 title="Klik Mascot Pak Guru untuk menuju Form Pembayaran SPP"
 className="relative h-full w-full flex items-center justify-center transition-all duration-700 transform cursor-pointer group"
 style={{
 transform: `translateX(${tilt.translateX}px) translateY(${tilt.translateY}px) ${poseTransform}`,
 opacity: 1,
 transition: "transform 1.2s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.8s",
 }}
>
 {/* Main 3D Render Image Layer */}
 <img
 id="mascot-main-img"
 key={pose}
 src={activeMascotImg}
 alt={`3D Mascot Pak Guru SPP - ${pose}`}
 className="h-[92%] w-auto object-contain drop-shadow-2xl transition-all duration-300 pointer-events-none select-none group-hover:scale-105 animate-fade-in"
 style={{ opacity: 1 }}
 />

 {/* Dynamic Pupil Overlay (Eyes tracking cursor) */}
 <div
 id="mascot-eye-left"
 className="absolute h-2.5 w-2.5 rounded-full bg-slate-900 transition-transform duration-75 pointer-events-none opacity-0"
 style={{ top: "24%", left: "47%" }}
 />
 <div
 id="mascot-eye-right"
 className="absolute h-2.5 w-2.5 rounded-full bg-slate-900 transition-transform duration-75 pointer-events-none opacity-0"
 style={{ top: "24%", left: "52%" }}
 />

 {/* Eyelid Overlay for Natural Blinking */}
 <div
 id="mascot-eyelids"
 className="absolute h-4 w-12 bg-[#e2be9b] transition-all duration-100 rounded-full opacity-0 pointer-events-none"
 style={{ top: "23%", left: "45%", transform: "scale(1, 0)" }}
 />

 {/* Interactive Tablet Display Overlay */}
 <div
 id="mascot-tablet-trigger"
 onClick={handleNextTabletView}
 title="Klik tablet untuk mengganti informasi"
 className="absolute z-30 cursor-pointer rounded-2xl bg-slate-900/90 p-2.5 text-white shadow-xl shadow-blue-900/40 border border-amber-300/60 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:border-amber-400"
 style={{ bottom: "22%", right: "14%", width: "140px" }}
>
 <div className="flex items-center justify-between text-[9px] font-bold text-amber-300 mb-1 border-b border-slate-700 pb-1">
 <span id="tablet-badge">{currentTablet.badge}</span>
 <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 animate-ping" />
 </div>
 <p id="tablet-title" className="text-[11px] font-extrabold text-white leading-tight">
 {currentTablet.title}
 </p>
 <p id="tablet-sub" className="text-[9px] text-slate-300 mt-0.5 font-medium">
 {currentTablet.sub}
 </p>
 <div className="mt-1.5 flex items-center justify-between text-[8px] text-emerald-300 bg-slate-800/80 px-1.5 py-0.5 rounded">
 <span id="tablet-detail">{currentTablet.detail}</span>
 <RefreshCw className="h-2.5 w-2.5 text-amber-300" />
 </div>
 </div>
 </div>

 {/* Floor Shadow Effect */}
 <div
 id="mascot-shadow"
 className="absolute bottom-2 h-4 w-48 rounded-full bg-slate-900/20 blur-md transition-all duration-300 dark:bg-black/50"
 style={{
 transform: `scale(${1 - Math.abs(tilt.rotateX) * 0.02})`,
 opacity: 0.2,
 }}
 />
 </div>

 {/* Bottom Action Controls */}
 <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-white/80 p-3 shadow-sm ring-1 ring-slate-100 dark:bg-slate-800/80 dark:ring-slate-700">
 <div className="flex items-center gap-2">
 <button
 id="btn-pose-wave"
 onClick={() =>
 handlePoseChange(
 "wave",
 "Assalamu'alaikum Ayah & Bunda! Selamat datang di Portal Pembayaran SPP PKBM Zaid bin Tsabit "
 )
 }
 className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
 pose === "wave"
 ? "bg-blue-600 text-white shadow-md shadow-blue-500/30"
 : "bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-950/60 dark:text-blue-300"
 }`}
>
 Menyapa
 </button>
 <button
 id="btn-pose-point"
 onClick={() =>
 handlePoseChange(
 "point",
 "Silakan isi form NIS & data siswa siswi di bawah untuk bayar SPP, Uang Gedung, atau Seragam! "
 )
 }
 className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
 pose === "point"
 ? "bg-amber-500 text-white shadow-md shadow-amber-500/30"
 : "bg-slate-100 text-slate-700 hover:bg-amber-100 hover:text-amber-700 dark:bg-slate-700 dark:text-slate-200"
 }`}
>
 Tunjuk SPP
 </button>
 <button
 id="btn-pose-celebrate"
 onClick={() =>
 handlePoseChange(
 "celebrate",
 "Barakallahu fiikum! Pembayaran Anda membantu mencetak generasi Qur'ani yang unggul & bertakwa "
 )
 }
 className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
 pose === "celebrate"
 ? "bg-emerald-600 text-white shadow-md shadow-emerald-500/30"
 : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300"
 }`}
>
 Celebration
 </button>
 </div>
 <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500">
 Gerakkan Kursor 
 </span>
 </div>

 {/* Quote Doa Card (Integrated) */}
 <div className="mt-4 rounded-2xl bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 p-4 text-white shadow-lg">
 <div className="flex items-center gap-2 text-xs font-bold text-amber-300 mb-1">
 <Sparkles className="h-4 w-4" />
 <span>Doa &amp; Harapan Sekolah</span>
 </div>
 <p className="text-xs leading-relaxed font-medium text-white/95">
 "Semoga Allah ﷻ melimpahkan rezeki yang halal dan berkah bagi Abah dan Umahat. Aamiin."
 </p>
 </div>

 </div>
 </div>
 </div>
 );
};
