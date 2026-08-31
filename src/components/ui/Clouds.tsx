import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface CloudsProps {
 cloudColor?: string;
 skyColor?: string;
 speed?: number;
 density?: number;
 className?: string;
}

export function Clouds({
 cloudColor = "#ffffff",
 skyColor = "#0284c7",
 speed = 0.4,
 density = 0.6,
 className = "absolute inset-0 pointer-events-none",
}: CloudsProps) {
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const container = containerRef.current;
 if (!container) return;

 let isVisible = true;
 let animationId: number;

 const width = container.clientWidth || window.innerWidth;
 const height = container.clientHeight || window.innerHeight;

 // Scene & Camera
 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

 // Renderer with optimized pixel ratio & performance flags
 const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
 renderer.setSize(width, height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
 container.appendChild(renderer.domElement);

 const cCloud = new THREE.Color(cloudColor);
 const cSky = new THREE.Color(skyColor);

 // Optimized Shader Material with 3 FBM iterations instead of 5
 const material = new THREE.ShaderMaterial({
 uniforms: {
 uTime: { value: 0 },
 uResolution: { value: new THREE.Vector2(width, height) },
 uCloudColor: { value: cCloud },
 uSkyColor: { value: cSky },
 uDensity: { value: density },
 },
 vertexShader: `
 varying vec2 vUv;
 void main() {
 vUv = uv;
 gl_Position = vec4(position, 1.0);
 }
 `,
 fragmentShader: `
 uniform float uTime;
 uniform vec2 uResolution;
 uniform vec3 uCloudColor;
 uniform vec3 uSkyColor;
 uniform float uDensity;
 varying vec2 vUv;

 float hash(vec2 p) {
 p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
 return fract(sin(p.x + p.y) * 43758.5453123);
 }

 float noise(vec2 p) {
 vec2 i = floor(p);
 vec2 f = fract(p);
 vec2 u = f * f * (3.0 - 2.0 * f);
 return mix(
 mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
 mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
 u.y
 );
 }

 float fbm(vec2 p) {
 float v = 0.0;
 float a = 0.5;
 vec2 shift = vec2(100.0);
 mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
 for (int i = 0; i < 3; ++i) {
 v += a * noise(p);
 p = rot * p * 2.0 + shift;
 a *= 0.5;
 }
 return v;
 }

 void main() {
 vec2 st = vUv;
 st.x *= uResolution.x / uResolution.y;

 float t = uTime * 0.12;
 vec2 q = vec2(fbm(st + 0.1 * t), fbm(st + vec2(1.0)));
 vec2 r = vec2(fbm(st + 1.0 * q + vec2(1.7, 9.2) + 0.12 * t), fbm(st + 1.0 * q + vec2(8.3, 2.8) + 0.1 * t));

 float f = fbm(st + r);

 float cloudMask = smoothstep(0.35, 0.75, f * uDensity + q.x * 0.3);
 vec3 col = mix(uSkyColor, uCloudColor, cloudMask);
 col = mix(col, vec3(1.0, 0.95, 0.8), pow(r.x, 2.0) * 0.25);

 float alpha = clamp(cloudMask * 0.8 + 0.1, 0.0, 0.85);
 gl_FragColor = vec4(col, alpha);
 }
 `,
 transparent: true,
 depthWrite: false,
 });

 const geometry = new THREE.PlaneGeometry(2, 2);
 const quad = new THREE.Mesh(geometry, material);
 scene.add(quad);

 let clock = new THREE.Clock();

 // IntersectionObserver to pause shader loop when offscreen
 const observer = new IntersectionObserver(
 ([entry]) => {
 isVisible = entry?.isIntersecting ?? true;
 if (isVisible && !animationId) {
 animate();
 }
 },
 { threshold: 0.05 }
 );
 observer.observe(container);

 const animate = () => {
 if (!isVisible) {
 animationId = 0;
 return;
 }
 animationId = requestAnimationFrame(animate);

 if (material.uniforms["uTime"]) {
 material.uniforms["uTime"].value = clock.getElapsedTime() * speed;
 }
 renderer.render(scene, camera);
 };

 animate();

 const handleResize = () => {
 if (!container) return;
 const w = container.clientWidth;
 const h = container.clientHeight;
 if (material.uniforms["uResolution"]) {
 (material.uniforms["uResolution"].value as THREE.Vector2).set(w, h);
 }
 renderer.setSize(w, h);
 };

 window.addEventListener("resize", handleResize, { passive: true });

 return () => {
 observer.disconnect();
 if (animationId) cancelAnimationFrame(animationId);
 window.removeEventListener("resize", handleResize);
 geometry.dispose();
 material.dispose();
 renderer.dispose();
 if (container.contains(renderer.domElement)) {
 container.removeChild(renderer.domElement);
 }
 };
 }, [cloudColor, skyColor, speed, density]);

 return <div ref={containerRef} className={className} />;
}
