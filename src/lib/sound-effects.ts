import confetti from "canvas-confetti";

// Web Audio API sound generator for interactive UI sounds

let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
 if (typeof window === "undefined") return null;
 if (!sharedAudioCtx) {
 const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
 if (AudioCtx) {
 sharedAudioCtx = new AudioCtx();
 }
 }
 if (sharedAudioCtx && sharedAudioCtx.state === "suspended") {
 sharedAudioCtx.resume().catch(() => {});
 }
 return sharedAudioCtx;
}

/**
 * Fires festive confetti particle bursts
 */
export function fireCelebrationConfetti() {
 if (typeof window === "undefined") return;

 confetti({
 particleCount: 80,
 spread: 80,
 origin: { y: 0.6 },
 colors: ["#f59e0b", "#10b981", "#3b82f6", "#eab308", "#ec4899", "#8b5cf6"],
 zIndex: 9999,
 });

 setTimeout(() => {
 confetti({
 particleCount: 45,
 angle: 60,
 spread: 55,
 origin: { x: 0.1, y: 0.65 },
 colors: ["#f59e0b", "#10b981", "#eab308"],
 zIndex: 9999,
 });
 confetti({
 particleCount: 45,
 angle: 120,
 spread: 55,
 origin: { x: 0.9, y: 0.65 },
 colors: ["#3b82f6", "#10b981", "#f59e0b"],
 zIndex: 9999,
 });
 }, 180);
}

/**
 * Fires a grand fireworks stream confetti when SPP payment succeeds
 */
export function firePaymentSuccessConfetti() {
 if (typeof window === "undefined") return;

 const duration = 2.5 * 1000;
 const animationEnd = Date.now() + duration;
 const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

 function randomInRange(min: number, max: number) {
 return Math.random() * (max - min) + min;
 }

 const interval: any = setInterval(function () {
 const timeLeft = animationEnd - Date.now();

 if (timeLeft <= 0) {
 return clearInterval(interval);
 }

 const particleCount = 40 * (timeLeft / duration);
 confetti({
 ...defaults,
 particleCount,
 origin: { x: randomInRange(0.15, 0.35), y: Math.random() - 0.2 },
 colors: ["#10b981", "#f59e0b", "#3b82f6", "#ffd700"],
 });
 confetti({
 ...defaults,
 particleCount,
 origin: { x: randomInRange(0.65, 0.85), y: Math.random() - 0.2 },
 colors: ["#10b981", "#f59e0b", "#3b82f6", "#ffd700"],
 });
 }, 220);
}

/**
 * Plays a joyful celebration chime fanfare when switching to Celebration pose
 */
export function playCelebrationSound() {
 try {
 const ctx = getAudioContext();
 if (!ctx) return;

 const now = ctx.currentTime;
 const notes = [
 { freq: 523.25, time: 0, duration: 0.18 }, // C5
 { freq: 659.25, time: 0.1, duration: 0.18 }, // E5
 { freq: 783.99, time: 0.2, duration: 0.18 }, // G5
 { freq: 1046.5, time: 0.32, duration: 0.45 }, // C6
 { freq: 1318.51, time: 0.48, duration: 0.6 }, // E6
 ];

 notes.forEach((note) => {
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();

 osc.type = "triangle";
 osc.frequency.setValueAtTime(note.freq, now + note.time);

 gain.gain.setValueAtTime(0.01, now + note.time);
 gain.gain.exponentialRampToValueAtTime(0.4, now + note.time + 0.02);
 gain.gain.exponentialRampToValueAtTime(0.0001, now + note.time + note.duration);

 osc.connect(gain);
 gain.connect(ctx.destination);

 osc.start(now + note.time);
 osc.stop(now + note.time + note.duration + 0.05);
 });
 } catch (e) {
 console.error("Audio playback error:", e);
 }
}

/**
 * Plays a grand victory fanfare sound when SPP payment succeeds
 */
export function playPaymentSuccessSound() {
 try {
 const ctx = getAudioContext();
 if (!ctx) return;

 const now = ctx.currentTime;
 // Multi-harmonic victory fanfare (C Major chord progression + arpeggio)
 const melody = [
 { freq: 523.25, type: "triangle", time: 0, duration: 0.15 },
 { freq: 659.25, type: "triangle", time: 0.1, duration: 0.15 },
 { freq: 783.99, type: "triangle", time: 0.2, duration: 0.18 },
 { freq: 1046.5, type: "triangle", time: 0.32, duration: 0.35 },
 { freq: 1318.51, type: "sine", time: 0.45, duration: 0.6 },
 { freq: 1567.98, type: "sine", time: 0.55, duration: 0.75 },
 ];

 melody.forEach((m) => {
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();

 osc.type = m.type as OscillatorType;
 osc.frequency.setValueAtTime(m.freq, now + m.time);

 gain.gain.setValueAtTime(0.01, now + m.time);
 gain.gain.exponentialRampToValueAtTime(0.45, now + m.time + 0.02);
 gain.gain.exponentialRampToValueAtTime(0.0001, now + m.time + m.duration);

 osc.connect(gain);
 gain.connect(ctx.destination);

 osc.start(now + m.time);
 osc.stop(now + m.time + m.duration + 0.05);
 });
 } catch (e) {
 console.error("Audio playback error:", e);
 }
}

/**
 * Plays a subtle pop/click sound for pose & tablet interactions
 */
export function playPopSound() {
 try {
 const ctx = getAudioContext();
 if (!ctx) return;

 if (ctx.state === "suspended") {
 ctx.resume();
 }

 const now = ctx.currentTime;
 const osc = ctx.createOscillator();
 const gain = ctx.createGain();

 osc.type = "sine";
 osc.frequency.setValueAtTime(600, now);
 osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

 gain.gain.setValueAtTime(0.15, now);
 gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);

 osc.connect(gain);
 gain.connect(ctx.destination);

 osc.start(now);
 osc.stop(now + 0.06);
 } catch (e) {
 console.error("Audio playback error:", e);
 }
}
