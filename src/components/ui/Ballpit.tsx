import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface BallpitProps {
 count?: number;
 gravity?: number;
 friction?: number;
 wallBounce?: number;
 followCursor?: boolean;
 colors?: string[];
 minSize?: number;
 maxSize?: number;
 className?: string;
}

export function Ballpit({
 count = 35,
 gravity = 0.015,
 friction = 0.99,
 wallBounce = 0.8,
 followCursor = true,
 colors = ["#38bdf8", "#0284c7", "#0ea5e9", "#eab308", "#60a5fa"],
 minSize = 0.35,
 maxSize = 0.85,
 className = "absolute inset-0 z-0 pointer-events-none",
}: BallpitProps) {
 const containerRef = useRef<HTMLDivElement>(null);

 useEffect(() => {
 const container = containerRef.current;
 if (!container) return;

 let isVisible = true;
 let animationId: number;

 const width = container.clientWidth || window.innerWidth;
 const height = container.clientHeight || 500;

 // Scene, Camera, Renderer
 const scene = new THREE.Scene();
 const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
 camera.position.z = 15;

 const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: "high-performance" });
 renderer.setSize(width, height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
 container.appendChild(renderer.domElement);

 // Lights
 const ambientLight = new THREE.AmbientLight(0xffffff, 1.4);
 scene.add(ambientLight);

 const dirLight1 = new THREE.DirectionalLight(0xfffaed, 2.0);
 dirLight1.position.set(10, 15, 10);
 scene.add(dirLight1);

 // Optimized sphere geometry (16x16 segments for 4x performance boost)
 const geometry = new THREE.SphereGeometry(1, 16, 16);

 // Shared materials by color
 const defaultColor = new THREE.Color("#eab308");
 const threeColors = (colors.length> 0 ? colors : ["#eab308"]).map((c) => new THREE.Color(c));
 const materialsMap = threeColors.map(
 (col) =>
 new THREE.MeshStandardMaterial({
 color: col,
 roughness: 0.2,
 metalness: 0.5,
 })
 );

 // Balls state
 interface BallData {
 mesh: THREE.Mesh;
 radius: number;
 vx: number;
 vy: number;
 vz: number;
 }

 const balls: BallData[] = [];

 // Boundaries derived from view frustum at Z=0
 const aspect = width / height;
 const vFOV = (camera.fov * Math.PI) / 180;
 const maxY = Math.tan(vFOV / 2) * camera.position.z;
 const maxX = maxY * aspect;
 const maxZ = 3;
 const minZ = -5;

 for (let i = 0; i < count; i++) {
 const radius = minSize + Math.random() * (maxSize - minSize);
 const material = materialsMap[i % materialsMap.length] ?? new THREE.MeshStandardMaterial({ color: defaultColor });

 const mesh = new THREE.Mesh(geometry, material);
 mesh.scale.set(radius, radius, radius);

 mesh.position.x = (Math.random() - 0.5) * (maxX * 1.5);
 mesh.position.y = (Math.random() - 0.5) * (maxY * 1.5);
 mesh.position.z = minZ + Math.random() * (maxZ - minZ);

 scene.add(mesh);

 balls.push({
 mesh,
 radius,
 vx: (Math.random() - 0.5) * 0.06,
 vy: (Math.random() - 0.5) * 0.06,
 vz: (Math.random() - 0.5) * 0.03,
 });
 }

 // Mouse tracking
 const mouse = { x: 0, y: 0, targetX: 0, targetY: 0, active: false };

 const handleMouseMove = (e: MouseEvent) => {
 if (!isVisible) return;
 const rect = container.getBoundingClientRect();
 const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
 const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
 mouse.targetX = x * maxX;
 mouse.targetY = y * maxY;
 mouse.active = true;
 };

 const handleMouseLeave = () => {
 mouse.active = false;
 };

 window.addEventListener("mousemove", handleMouseMove, { passive: true });
 container.addEventListener("mouseleave", handleMouseLeave, { passive: true });

 // IntersectionObserver to pause render loop when offscreen
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

 // Animation Loop
 const animate = () => {
 if (!isVisible) {
 animationId = 0;
 return;
 }
 animationId = requestAnimationFrame(animate);

 // Smooth mouse lerp
 mouse.x += (mouse.targetX - mouse.x) * 0.1;
 mouse.y += (mouse.targetY - mouse.y) * 0.1;

 // Update positions & physics
 for (let i = 0; i < balls.length; i++) {
 const ball = balls[i];
 if (!ball) continue;

 ball.vy -= gravity * 0.01;
 ball.vx *= friction;
 ball.vy *= friction;
 ball.vz *= friction;

 if (followCursor && mouse.active) {
 const dx = ball.mesh.position.x - mouse.x;
 const dy = ball.mesh.position.y - mouse.y;
 const distSq = dx * dx + dy * dy;
 if (distSq < 16 && distSq> 0.01) {
 const force = (16 - distSq) * 0.003;
 ball.vx += (dx / Math.sqrt(distSq)) * force;
 ball.vy += (dy / Math.sqrt(distSq)) * force;
 }
 }

 ball.mesh.position.x += ball.vx;
 ball.mesh.position.y += ball.vy;
 ball.mesh.position.z += ball.vz;

 const boundsX = maxX - ball.radius;
 const boundsY = maxY - ball.radius;

 if (ball.mesh.position.x> boundsX) {
 ball.mesh.position.x = boundsX;
 ball.vx = -ball.vx * wallBounce;
 } else if (ball.mesh.position.x < -boundsX) {
 ball.mesh.position.x = -boundsX;
 ball.vx = -ball.vx * wallBounce;
 }

 if (ball.mesh.position.y> boundsY) {
 ball.mesh.position.y = boundsY;
 ball.vy = -ball.vy * wallBounce;
 } else if (ball.mesh.position.y < -boundsY) {
 ball.mesh.position.y = -boundsY;
 ball.vy = -ball.vy * wallBounce;
 }

 if (ball.mesh.position.z> maxZ) {
 ball.mesh.position.z = maxZ;
 ball.vz = -ball.vz * wallBounce;
 } else if (ball.mesh.position.z < minZ) {
 ball.mesh.position.z = minZ;
 ball.vz = -ball.vz * wallBounce;
 }
 }

 // Ball-to-ball collisions
 for (let i = 0; i < balls.length; i++) {
 for (let j = i + 1; j < balls.length; j++) {
 const b1 = balls[i];
 const b2 = balls[j];
 if (!b1 || !b2) continue;

 const dx = b2.mesh.position.x - b1.mesh.position.x;
 const dy = b2.mesh.position.y - b1.mesh.position.y;
 const dz = b2.mesh.position.z - b1.mesh.position.z;
 const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);
 const minDist = b1.radius + b2.radius;

 if (dist < minDist && dist> 0.001) {
 const overlap = (minDist - dist) * 0.5;
 const nx = dx / dist;
 const ny = dy / dist;
 const nz = dz / dist;

 b1.mesh.position.x -= nx * overlap;
 b1.mesh.position.y -= ny * overlap;
 b1.mesh.position.z -= nz * overlap;

 b2.mesh.position.x += nx * overlap;
 b2.mesh.position.y += ny * overlap;
 b2.mesh.position.z += nz * overlap;
 }
 }
 }

 renderer.render(scene, camera);
 };

 animate();

 const handleResize = () => {
 if (!container) return;
 const w = container.clientWidth;
 const h = container.clientHeight;
 camera.aspect = w / h;
 camera.updateProjectionMatrix();
 renderer.setSize(w, h);
 };

 window.addEventListener("resize", handleResize, { passive: true });

 return () => {
 observer.disconnect();
 if (animationId) cancelAnimationFrame(animationId);
 window.removeEventListener("mousemove", handleMouseMove);
 container.removeEventListener("mouseleave", handleMouseLeave);
 window.removeEventListener("resize", handleResize);

 balls.forEach((b) => scene.remove(b.mesh));
 materialsMap.forEach((m) => m.dispose());
 geometry.dispose();
 renderer.dispose();

 if (container.contains(renderer.domElement)) {
 container.removeChild(renderer.domElement);
 }
 };
 }, [count, gravity, friction, wallBounce, followCursor, colors, minSize, maxSize]);

 return <div ref={containerRef} className={className} />;
}
