import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import logo from "@/assets/logo.png";

export function Splash() {
 const [done, setDone] = useState(false);

 useEffect(() => {
 const t = setTimeout(() => setDone(true), 2600);
 return () => clearTimeout(t);
 }, []);

 return (
 <AnimatePresence>
 {!done && (
 <motion.div
 className="fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep"
 exit={{ opacity: 0, scale: 1.06, filter: "blur(12px)" }}
 transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
>
 <div className="surface-aurora absolute inset-0 opacity-60" />
 <div className="absolute inset-0 backdrop-blur-2xl" />
 {Array.from({ length: 22 }).map((_, i) => (
 <motion.span
 key={i}
 className="absolute h-1 w-1 rounded-full bg-gold"
 style={{ left: `${(i * 41) % 100}%`, top: `${(i * 67) % 100}%` }}
 animate={{ y: [0, -70, 0], opacity: [0, 1, 0] }}
 transition={{ duration: 3 + (i % 4), repeat: Infinity, delay: i * 0.12 }}
 />
 ))}

 <motion.div
 className="relative flex flex-col items-center gap-6 px-6 text-center"
 initial={{ opacity: 0, scale: 0.75, filter: "blur(20px)" }}
 animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
 transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
>
 <div className="relative rounded-full p-6">
 <div className="absolute inset-0 rounded-full bg-gold/30 blur-3xl animate-pulse" />
 <img
 src={logo}
 alt="Logo PKBM Zaid bin Tsabit"
 width={160}
 height={160}
 className="relative h-36 w-36 object-contain drop-shadow-[0_0_25px_rgba(234,179,8,0.5)]"
 />
 </div>
 <motion.p
 className="text-gold-gradient animate-shimmer text-2xl font-black tracking-[0.2em] uppercase sm:text-3xl"
 initial={{ opacity: 0, y: 14 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.5, duration: 1 }}
>
 PKBM ZAID BIN TSABIT
 </motion.p>
 <motion.p
 className="text-xs font-semibold tracking-[0.25em] text-primary-foreground/90 uppercase sm:text-sm"
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 transition={{ delay: 0.7, duration: 0.8 }}
>
 Pusat Kegiatan Belajar Masyarakat
 </motion.p>
 <motion.div
 className="h-0.5 w-48 bg-gradient-to-r from-transparent via-gold to-transparent"
 initial={{ scaleX: 0 }}
 animate={{ scaleX: 1 }}
 transition={{ delay: 0.9, duration: 1.2 }}
 />
 </motion.div>
 </motion.div>
 )}
 </AnimatePresence>
 );
}
