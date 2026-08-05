import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";

/* ---------- Scroll reveal ---------- */

type RevealVariant = "up" | "left" | "right" | "scale" | "blur" | "rotate";

const variants: Record<RevealVariant, { hidden: Record<string, number | string>; shown: Record<string, number | string> }> = {
  up: { hidden: { opacity: 0, y: 42 }, shown: { opacity: 1, y: 0 } },
  left: { hidden: { opacity: 0, x: -48 }, shown: { opacity: 1, x: 0 } },
  right: { hidden: { opacity: 0, x: 48 }, shown: { opacity: 1, x: 0 } },
  scale: { hidden: { opacity: 0, scale: 0.9 }, shown: { opacity: 1, scale: 1 } },
  blur: { hidden: { opacity: 0, filter: "blur(14px)", y: 24 }, shown: { opacity: 1, filter: "blur(0px)", y: 0 } },
  rotate: { hidden: { opacity: 0, rotate: -4, y: 30 }, shown: { opacity: 1, rotate: 0, y: 0 } },
};

export function Reveal({
  children,
  variant = "up",
  delay = 0,
  className,
}: {
  children: ReactNode;
  variant?: RevealVariant;
  delay?: number;
  className?: string;
}) {
  const v = variants[variant];
  return (
    <motion.div
      className={className}
      initial={v.hidden}
      whileInView={v.shown}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ shown: { transition: { staggerChildren: 0.09 } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      className={className}
      variants={{ hidden: { opacity: 0, y: 34, filter: "blur(8px)" }, shown: { opacity: 1, y: 0, filter: "blur(0px)" } }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Number counter ---------- */

export function Counter({ to, suffix = "", duration = 1800 }: { to: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setValue(Math.round(to * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to, duration]);

  return (
    <span ref={ref}>
      {value.toLocaleString("id-ID")}
      {suffix}
    </span>
  );
}

/* ---------- Magnetic button wrapper ---------- */

export function Magnetic({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 15 });
  const sy = useSpring(y, { stiffness: 200, damping: 15 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        x.set((e.clientX - (r.left + r.width / 2)) * 0.28);
        y.set((e.clientY - (r.top + r.height / 2)) * 0.28);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Tilt / 3D card ---------- */

export function Tilt({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ rotateX: rx, rotateY: ry, transformPerspective: 1000 }}
      onMouseMove={(e) => {
        const r = ref.current?.getBoundingClientRect();
        if (!r) return;
        rx.set(-((e.clientY - r.top) / r.height - 0.5) * 10);
        ry.set(((e.clientX - r.left) / r.width - 0.5) * 12);
      }}
      onMouseLeave={() => {
        rx.set(0);
        ry.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ---------- Backgrounds ---------- */

export function AuroraBackground({ dark = false }: { dark?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="surface-aurora absolute inset-0 opacity-70" />
      <div
        className={`animate-blob absolute -left-32 top-10 h-[26rem] w-[26rem] rounded-full blur-3xl ${
          dark ? "bg-gold/15" : "bg-gold/20"
        }`}
      />
      <div
        className="animate-blob absolute -right-24 bottom-0 h-[30rem] w-[30rem] rounded-full bg-navy-soft/25 blur-3xl"
        style={{ animationDelay: "-6s" }}
      />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,color-mix(in_oklab,var(--navy)_7%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklab,var(--navy)_7%,transparent)_1px,transparent_1px)] bg-[size:64px_64px] opacity-40 [mask-image:radial-gradient(70%_60%_at_50%_40%,black,transparent)]" />
    </div>
  );
}

export function Particles({ count = 26, className = "" }: { count?: number; className?: string }) {
  const dots = Array.from({ length: count }, (_, i) => ({
    left: (i * 37) % 100,
    top: (i * 61) % 100,
    size: 2 + ((i * 7) % 5),
    dur: 8 + ((i * 3) % 10),
    delay: (i % 9) * 0.7,
  }));

  return (
    <div aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {dots.map((d, i) => (
        <motion.span
          key={i}
          className="absolute rounded-full bg-gold/60"
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          animate={{ y: [0, -40, 0], opacity: [0, 0.9, 0] }}
          transition={{ duration: d.dur, delay: d.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}

/* ---------- Cursor glow + trail ---------- */

export function CursorGlow() {
  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 400, damping: 30 });
  const sy = useSpring(y, { stiffness: 400, damping: 30 });
  const tx = useSpring(x, { stiffness: 90, damping: 18 });
  const ty = useSpring(y, { stiffness: 90, damping: 18 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y]);

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[90] hidden md:block">
      <motion.div
        className="absolute h-2 w-2 rounded-full bg-gold"
        style={{ x: sx, y: sy, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="absolute h-10 w-10 rounded-full border border-gold/50 bg-gold/10 blur-[1px]"
        style={{ x: tx, y: ty, translateX: "-50%", translateY: "-50%" }}
      />
    </div>
  );
}

/* ---------- Scroll progress bar ---------- */

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 22 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed left-0 top-0 z-[95] h-[3px] w-full origin-left bg-gradient-to-r from-gold via-gold-soft to-gold"
    />
  );
}

/* ---------- Parallax helper ---------- */

export function useParallax(strength = 20) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      x.set((e.clientX / window.innerWidth - 0.5) * strength);
      y.set((e.clientY / window.innerHeight - 0.5) * strength);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [x, y, strength]);

  return { x: sx, y: sy };
}

export function useScrollFade(ref: React.RefObject<HTMLElement | null>) {
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  return {
    opacity: useTransform(scrollYProgress, [0, 0.8], [1, 0]),
    y: useTransform(scrollYProgress, [0, 1], [0, 120]),
  };
}
