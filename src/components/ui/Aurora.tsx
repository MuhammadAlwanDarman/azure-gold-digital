import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface AuroraProps {
 colorStops?: string[];
 amplitude?: number;
 blend?: number;
 speed?: number;
 className?: string;
}

export function Aurora({
 colorStops = ["#3B82F6", "#EAB308", "#ffffff"],
 amplitude = 1.0,
 blend = 0.5,
 speed = 1.0,
 className = "absolute inset-0 pointer-events-none",
}: AuroraProps) {
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const container = containerRef.current;
 if (!container) return;

 const width = container.clientWidth || window.innerWidth;
 const height = container.clientHeight || window.innerHeight;

 // Scene & Camera
 const scene = new THREE.Scene();
 const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

 // Renderer
 const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
 renderer.setSize(width, height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 container.appendChild(renderer.domElement);

 // Convert hex color stops to Three.js Colors
 const parsedColors = colorStops.map((c) => new THREE.Color(c));
 const c1 = parsedColors[0] ?? new THREE.Color("#3B82F6");
 const c2 = parsedColors[1] ?? new THREE.Color("#EAB308");
 const c3 = parsedColors[2] ?? new THREE.Color("#ffffff");

 // Shader Material
 const material = new THREE.ShaderMaterial({
 uniforms: {
 uTime: { value: 0 },
 uResolution: { value: new THREE.Vector2(width, height) },
 uColor1: { value: c1 },
 uColor2: { value: c2 },
 uColor3: { value: c3 },
 uAmplitude: { value: amplitude },
 uBlend: { value: blend },
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
 uniform vec3 uColor3;
 uniform float uAmplitude;
 uniform float uBlend;
 varying vec2 vUv;

 // Simplex noise helper functions
 vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
 float snoise(vec2 v){
 const vec4 C = vec4(0.211324865405187, 0.366025403784439,
 -0.577350269189626, 0.024390243902439);
 vec2 i = floor(v + dot(v, C.yy) );
 vec2 x0 = v - i + dot(i, C.xx);
 vec2 i1;
 i1 = (x0.x> x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
 vec4 x12 = x0.xyxy + C.xxzz;
 x12.xy -= i1;
 i = mod(i, 289.0);
 vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 ))
 + i.x + vec3(0.0, i1.x, 1.0 ));
 vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
 m = m*m ;
 m = m*m ;
 vec3 x = 2.0 * fract(p * C.www) - 1.0;
 vec3 h = abs(x) - 0.5;
 vec3 ox = floor(x + 0.5);
 vec3 a0 = x - ox;
 m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
 vec3 g;
 g.x = a0.x * x0.x + h.x * x0.y;
 g.yz = a0.yz * x12.xz + h.yz * x12.yw;
 return 130.0 * dot(m, g);
 }

 void main() {
 vec2 st = vUv;
 float t = uTime * 0.4;

 // Multi-layered fluid waves
 float n1 = snoise(vec2(st.x * 2.0 + t * 0.3, st.y * 1.5 - t * 0.2)) * uAmplitude;
 float n2 = snoise(vec2(st.x * 3.5 - t * 0.5, st.y * 2.5 + t * 0.4)) * 0.5 * uAmplitude;
 float n3 = snoise(vec2(st.x * 1.2 + t * 0.1, st.y * 3.0 + t * 0.6)) * 0.25 * uAmplitude;

 float noiseSum = (n1 + n2 + n3);
 float wave = sin(st.y * 4.0 + noiseSum * 3.0 + t) * 0.5 + 0.5;

 // Color interpolations
 vec3 colorA = mix(uColor1, uColor2, wave);
 vec3 finalColor = mix(colorA, uColor3, smoothstep(0.3, 0.9, wave * uBlend + noiseSum * 0.2));

 // Soft radial glow vignette
 float dist = distance(st, vec2(0.5, 0.5));
 float alpha = smoothstep(1.2, 0.2, dist) * 0.85;

 gl_FragColor = vec4(finalColor, alpha);
 }
 `,
 transparent: true,
 depthWrite: false,
 });

 const geometry = new THREE.PlaneGeometry(2, 2);
 const quad = new THREE.Mesh(geometry, material);
 scene.add(quad);

 let animationId: number;
 let clock = new THREE.Clock();

 const animate = () => {
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

 window.addEventListener("resize", handleResize);

 return () => {
 cancelAnimationFrame(animationId);
 window.removeEventListener("resize", handleResize);
 geometry.dispose();
 material.dispose();
 renderer.dispose();
 if (container.contains(renderer.domElement)) {
 container.removeChild(renderer.domElement);
 }
 };
 }, [colorStops, amplitude, blend, speed]);

 return <div ref={containerRef} className={className} />;
}
