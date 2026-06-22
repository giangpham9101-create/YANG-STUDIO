import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/src/lib/utils";

interface LiquidImageRevealProps {
  src: string;
  alt?: string;
  className?: string;
}

export default function LiquidImageReveal({
  src,
  alt = "Liquid Reveal Image",
  className,
}: LiquidImageRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!containerRef.current || !canvasRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // ── 1. INITIALIZE THREE.JS SETUP ─────────────────────────────
    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();

    // Use Orthographic Camera for a flat 2D projection
    const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    // ── 2. CREATE 2D CANVAS FOR DISPLACEMENT TRACKING ────────────
    const dispCanvas = document.createElement("canvas");
    dispCanvas.width = 256;
    dispCanvas.height = 256;
    const dispCtx = dispCanvas.getContext("2d")!;

    // Initial background of displacement map (pure black = zero distortion, zero reveal)
    dispCtx.fillStyle = "black";
    dispCtx.fillRect(0, 0, dispCanvas.width, dispCanvas.height);

    const displacementTexture = new THREE.CanvasTexture(dispCanvas);
    displacementTexture.minFilter = THREE.LinearFilter;
    displacementTexture.magFilter = THREE.LinearFilter;

    // ── 3. LOAD TEXTURE & SHADER SETUP ───────────────────────────
    const textureLoader = new THREE.TextureLoader();
    const imageResolution = new THREE.Vector2(1, 1);

    const mainTexture = textureLoader.load(src, (texture) => {
      // Set aspect ratio when loaded
      imageResolution.set(texture.image.width, texture.image.height);
      if (material) {
        material.uniforms.u_imageResolution.value.copy(imageResolution);
      }
    });
    mainTexture.minFilter = THREE.LinearFilter;
    mainTexture.magFilter = THREE.LinearFilter;

    const material = new THREE.ShaderMaterial({
      uniforms: {
        u_texture: { value: mainTexture },
        u_displacement: { value: displacementTexture },
        u_resolution: { value: new THREE.Vector2(width, height) },
        u_imageResolution: { value: imageResolution },
      },
      vertexShader: `
        varying vec2 v_uv;
        void main() {
          v_uv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D u_texture;
        uniform sampler2D u_displacement;
        uniform vec2 u_resolution;
        uniform vec2 u_imageResolution;
        varying vec2 v_uv;

        void main() {
          // Object-Fit: Cover math
          float screenAspect = u_resolution.x / u_resolution.y;
          float imageAspect = u_imageResolution.x / u_imageResolution.y;
          
          vec2 ratio = vec2(
            min(screenAspect / imageAspect, 1.0),
            min(imageAspect / screenAspect, 1.0)
          );
          vec2 coverUv = (v_uv - 0.5) * ratio + 0.5;

          // Read displacement map
          vec4 disp = texture2D(u_displacement, v_uv);

          // Liquid distortion offset based on Red channel
          vec2 distortedUv = coverUv + vec2(disp.r * 0.05, disp.r * -0.05);
          
          // Clamp to avoid edge wrap artifacts
          distortedUv = clamp(distortedUv, vec2(0.001), vec2(0.999));

          // Sample color
          vec4 color = texture2D(u_texture, distortedUv);

          // Convert to Grayscale
          float gray = dot(color.rgb, vec3(0.299, 0.587, 0.114));
          vec4 grayscale = vec4(vec3(gray), color.a);

          // Blend grayscale and color based on Green channel (reveal)
          float reveal = smoothstep(0.0, 0.8, disp.g);
          
          gl_FragColor = mix(grayscale, color, reveal);
        }
      `,
      depthTest: false,
      depthWrite: false,
      transparent: true,
    });

    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // ── 4. INTERACTIVE GLOBAL EVENT LISTENERS ────────────────────
    const mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    const prevMouse = { x: 0, y: 0 };
    let isHovered = false;
    let velocity = 0;
    let revealRadius = 0;

    const handlePointerMove = (e: PointerEvent) => {
      const clientX = e.clientX;
      const clientY = e.clientY;

      // Map viewport coordinates directly to canvas (0 to 256)
      mouse.targetX = (clientX / window.innerWidth) * dispCanvas.width;
      mouse.targetY = (clientY / window.innerHeight) * dispCanvas.height;

      // If we weren't hovering, activate hover
      if (!isHovered) {
        isHovered = true;
      }
    };

    const handlePointerEnter = () => {
      isHovered = true;
    };

    const handlePointerLeave = () => {
      isHovered = false;
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerenter", handlePointerEnter);
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("mouseleave", handlePointerLeave);

    // ── 5. RENDER & FADE ANIMATION LOOP ──────────────────────────
    let animationId: number;

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      // We fade the canvas using normal blending to slowly wipe out previous frames
      dispCtx.globalCompositeOperation = "source-over";
      dispCtx.fillStyle = "rgba(0, 0, 0, 0.05)";
      dispCtx.fillRect(0, 0, dispCanvas.width, dispCanvas.height);

      // Switch to additive screen blending to mix Red (distortion) and Green (reveal) channels
      dispCtx.globalCompositeOperation = "screen";

      // Interpolate mouse coordinates for smooth inertia
      mouse.x += (mouse.targetX - mouse.x) * 0.12;
      mouse.y += (mouse.targetY - mouse.y) * 0.12;

      // Interpolate the reveal circle radius (localized to 75 units)
      if (isHovered) {
        revealRadius += (75 - revealRadius) * 0.08;
      } else {
        revealRadius += (0 - revealRadius) * 0.08;
      }

      // Draw Green channel (Color Reveal) circle at the current mouse position
      if (revealRadius > 0.1) {
        const revealGrad = dispCtx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          revealRadius
        );
        // Only Green channel has values, Red and Blue are 0
        revealGrad.addColorStop(0, "rgba(0, 255, 0, 1.0)");
        revealGrad.addColorStop(0.5, "rgba(0, 255, 0, 0.8)");
        revealGrad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

        dispCtx.fillStyle = revealGrad;
        dispCtx.beginPath();
        dispCtx.arc(mouse.x, mouse.y, revealRadius, 0, Math.PI * 2);
        dispCtx.fill();
      }

      // Draw Red channel (Distortion) circle at the current mouse position
      if (isHovered) {
        const dx = mouse.x - prevMouse.x;
        const dy = mouse.y - prevMouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        velocity += (dist - velocity) * 0.1;

        const distortRadius = Math.max(12, Math.min(45, 12 + velocity * 1.5));
        const distortionForce = Math.min(255, Math.floor(velocity * 8));

        const distortGrad = dispCtx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          distortRadius
        );
        // Only Red channel has values, Green and Blue are 0
        distortGrad.addColorStop(0, `rgba(${distortionForce}, 0, 0, 1.0)`);
        distortGrad.addColorStop(1.0, "rgba(0, 0, 0, 0.0)");

        dispCtx.fillStyle = distortGrad;
        dispCtx.beginPath();
        dispCtx.arc(mouse.x, mouse.y, distortRadius, 0, Math.PI * 2);
        dispCtx.fill();
      }

      // Record current positions for next frame
      prevMouse.x = mouse.x;
      prevMouse.y = mouse.y;

      // Signal Three.js that the displacement texture updated
      displacementTexture.needsUpdate = true;

      // Render Three.js scene
      renderer.render(scene, camera);
    };

    animate();

    // ── 6. RESPONSIVE RESIZE HANDLING ────────────────────────────
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = entry.contentRect.width;
        height = entry.contentRect.height;
        renderer.setSize(width, height);
        if (material) {
          material.uniforms.u_resolution.value.set(width, height);
        }
      }
    });

    resizeObserver.observe(container);

    // ── 7. CLEANUP ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerenter", handlePointerEnter);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("mouseleave", handlePointerLeave);
      resizeObserver.disconnect();
      
      geometry.dispose();
      material.dispose();
      mainTexture.dispose();
      displacementTexture.dispose();
      renderer.dispose();
    };
  }, [src]);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full relative touch-none select-none", className)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />
      {/* Fallback accessibility image */}
      <img src={src} alt={alt} className="sr-only" />
    </div>
  );
}
