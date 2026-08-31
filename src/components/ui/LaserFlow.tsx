import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface LaserFlowProps {
 color?: string;
 secondaryColor?: string;
 speed?: number;
 beamCount?: number;
 className?: string;
}

export function LaserFlow({
 color = "#38bdf8",
 secondaryColor = "#eab308",
 speed = 1.0,
 beamCount = 10,
 className = "absolute inset-0 pointer-events-none",
}: LaserFlowProps) {
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

 // Renderer
 const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
 renderer.setSize(width, height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
 container.appendChild(renderer.domElement);

 const c1 = new THREE.Color(color);
 const c2 = new THREE.Color(secondaryColor);

 const material = new THREE.ShaderMaterial({
 uniforms: {
 uTime: { value: 0 },
 uResolution: { value: new THREE.Vector2(width, height) },
 uColor1: { value: c1 },
 uColor2: { value: c2 },
 uBeamCount: { value: beamCount },
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
 uniform vec3 uColor1;
 uniform vec3 uColor2;
 uniform float uBeamCount;
 varying vec2 vUv;

 float hash(float n) { return fract(sin(n) * 43758.5453123); }

 void main() {
 vec2 st = vUv;
 float time = uTime * 0.8;

 vec2 p = st * 2.0 - 1.0;
 p.x *= uResolution.x / uResolution.y;

 vec3 finalColor = vec3(0.0);

 for (float i = 0.0; i < 12.0; i += 1.0) {
 if (i>= uBeamCount) break;

 float seed = i * 1.345;
 float yPos = sin(time * 0.5 + seed) * 0.7;
 float intensity = 0.002 / abs(p.y - yPos + sin(p.x * 3.0 + time * 2.0 + seed) * 0.15);

 vec3 beamColor = mix(uColor1, uColor2, sin(time + seed) * 0.5 + 0.5);
 finalColor += beamColor * intensity * (0.6 + 0.4 * sin(p.x * 10.0 - time * 4.0));
 }

 float gridX = abs(sin(p.x * 20.0 + time));
 float gridY = abs(sin((p.y + 1.0) * 15.0 - time * 2.0));
 float grid = smoothstep(0.96, 1.0, gridX) + smoothstep(0.96, 1.0, gridY);
 finalColor += uColor1 * grid * 0.08 * (1.0 - abs(p.y));

 float alpha = clamp(length(finalColor), 0.0, 0.9);
 gl_FragColor = vec4(finalColor, alpha);
 }
 `,
 transparent: true,
 depthWrite: false,
 });

 const geometry = new THREE.PlaneGeometry(2, 2);
 const quad = new THREE.Mesh(geometry, material);
 scene.add(quad);

 let clock = new THREE.Clock();

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
 }, [color, secondaryColor, speed, beamCount]);

 return <div ref={containerRef} className={className} />;
}
