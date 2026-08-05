import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowUp, Bot, MessageCircle, Send, X } from "lucide-react";
import { FAQ } from "@/lib/school-data";

export function FloatingActions() {
  const [top, setTop] = useState(false);
  const [chat, setChat] = useState(false);

  useEffect(() => {
    const onScroll = () => setTop(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <div className="fixed bottom-6 right-5 z-[85] flex flex-col items-end gap-3">
        <AnimatePresence>
          {chat && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.94 }}
              className="w-[20rem] overflow-hidden rounded-3xl border border-border bg-card shadow-luxe"
            >
              <div className="flex items-center justify-between bg-navy px-4 py-3 text-primary-foreground">
                <span className="flex items-center gap-2 text-sm font-bold">
                  <Bot className="h-4 w-4 text-gold" /> Asisten STPI ZBT
                </span>
                <button onClick={() => setChat(false)} aria-label="Tutup chat">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="max-h-64 space-y-3 overflow-y-auto p-4 text-sm">
                <p className="rounded-2xl bg-muted p-3 text-muted-foreground">
                  Assalamu'alaikum! Ada yang bisa kami bantu seputar PPDB, program, atau kunjungan sekolah?
                </p>
                {FAQ.slice(0, 3).map((f) => (
                  <button
                    key={f.q}
                    className="w-full rounded-2xl border border-border p-3 text-left text-xs transition-colors hover:border-gold hover:bg-muted"
                  >
                    {f.q}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-border p-3">
                <input
                  placeholder="Tulis pertanyaan…"
                  className="w-full rounded-full bg-muted px-4 py-2 text-sm focus:outline-none"
                />
                <button className="rounded-full bg-gold p-2 text-navy-deep" aria-label="Kirim">
                  <Send className="h-4 w-4" />
                </button>
              </div>
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
              aria-label="Kembali ke atas"
              className="rounded-full border border-border bg-card p-3 shadow-luxe transition-transform hover:-translate-y-1"
            >
              <ArrowUp className="h-4 w-4" />
            </motion.button>
          )}
        </AnimatePresence>

        <button
          onClick={() => setChat((c) => !c)}
          aria-label="Buka asisten"
          className="rounded-full bg-navy p-3.5 text-primary-foreground shadow-luxe transition-transform hover:scale-110"
        >
          <Bot className="h-5 w-5 text-gold" />
        </button>

        <a
          href="https://wa.me/6281200001717"
          target="_blank"
          rel="noreferrer"
          aria-label="Hubungi via WhatsApp"
          className="animate-float rounded-full bg-[oklch(0.72_0.17_150)] p-3.5 text-white shadow-luxe transition-transform hover:scale-110"
        >
          <MessageCircle className="h-5 w-5" />
        </a>
      </div>
    </>
  );
}
