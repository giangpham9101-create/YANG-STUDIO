import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import gsap from 'gsap';

const ASCII_CHARS = ['@', '#', '*', '+', '.'];

const vertexShader = `
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uDensity;
  uniform float uShake;
  
  attribute float aLuminance;
  attribute float aIsGallery;
  
  varying float vLuminance;
  varying float vIsGallery;
  varying vec2 vUv;

  void main() {
    vLuminance = aLuminance;
    vIsGallery = aIsGallery;
    vUv = uv;

    vec3 pos = position;
    
    // Screen Shake Effect
    if (uShake > 0.0) {
      float shakeX = (fract(sin(uTime * 100.0) * 43758.5453) - 0.5) * uShake;
      float shakeY = (fract(cos(uTime * 120.0) * 12345.6789) - 0.5) * uShake;
      pos.x += shakeX;
      pos.y += shakeY;
    }

    // 3D Wave Distortion
    float wave = sin(pos.x * 0.5 + uTime * 2.0) * 0.2 + cos(pos.y * 0.5 + uTime * 1.5) * 0.2;
    pos.z += wave;

    // Interactive Cursor Displacement
    float dist = distance(pos.xy, uMouse);
    float force = 1.0 - smoothstep(0.0, 3.0, dist);
    vec2 dir = normalize(pos.xy - uMouse);
    pos.xy += dir * force * 1.5;
    pos.z += force * 2.0;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_PointSize = (20.0 / -mvPosition.z) * (uDensity / 50.0);
    gl_Position = projectionMatrix * mvPosition;
  }
`;

const fragmentShader = `
  uniform sampler2D uAsciiTex;
  varying float vLuminance;
  varying float vIsGallery;

  void main() {
    // Map luminance to ASCII character index
    float charIndex = floor(vLuminance * 4.99);
    float uStart = charIndex / 5.0;
    vec2 charUv = vec2(uStart + gl_PointCoord.x / 5.0, gl_PointCoord.y);
    
    vec4 texColor = texture2D(uAsciiTex, charUv);
    if (texColor.a < 0.5) discard;

    // Dual-Tone Styling
    vec3 color = (vIsGallery > 0.5) ? vec3(0.82, 1.0, 0.0) : vec3(1.0, 1.0, 1.0); // Acid Green vs White
    gl_FragColor = vec4(color, 1.0);
  }
`;

function AsciiParticles({ density }: { density: number }) {
  const meshRef = useRef<THREE.Points>(null);
  const { viewport, mouse } = useThree();
  const [asciiTex, setAsciiTex] = useState<THREE.Texture | null>(null);

  // Generate ASCII Texture
  useEffect(() => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 512;
    canvas.height = 128;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 80px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    ASCII_CHARS.forEach((char, i) => {
      ctx.fillText(char, (i + 0.5) * (canvas.width / 5), canvas.height / 2);
    });

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.NearestFilter;
    tex.magFilter = THREE.NearestFilter;
    setAsciiTex(tex);
  }, []);

  // Create Particle Geometry from Text
  const geometry = useMemo(() => {
    // Check if font is loaded (optional but helpful)
    // document.fonts.check('bold 40px "FSEX300"')
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.BufferGeometry();

    canvas.width = 400;
    canvas.height = 200;
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'white';
    ctx.font = 'bold 40px "FSEX300", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    
    ctx.fillText('PROJECT', canvas.width / 2, 60);
    ctx.fillText('GALLERY', canvas.width / 2, 140);

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const positions: number[] = [];
    const luminances: number[] = [];
    const isGallery: number[] = [];

    const step = Math.max(1, Math.floor(10 - (density / 10)));
    
    for (let y = 0; y < canvas.height; y += step) {
      for (let x = 0; x < canvas.width; x += step) {
        const i = (y * canvas.width + x) * 4;
        if (imageData.data[i] > 128) {
          positions.push((x - canvas.width / 2) * 0.05, (canvas.height / 2 - y) * 0.05, 0);
          luminances.push(Math.random());
          isGallery.push(y > canvas.height / 2 ? 1 : 0);
        }
      }
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geo.setAttribute('aLuminance', new THREE.Float32BufferAttribute(luminances, 1));
    geo.setAttribute('aIsGallery', new THREE.Float32BufferAttribute(isGallery, 1));
    
    return geo;
  }, [density]);

  // Clean up geometry when density changes
  useEffect(() => {
    return () => {
      geometry.dispose();
    };
  }, [geometry]);

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) },
    uAsciiTex: { value: null as THREE.Texture | null },
    uDensity: { value: density },
    uShake: { value: 0 }
  }), []);

  useEffect(() => {
    uniforms.uAsciiTex.value = asciiTex;
    return () => {
      if (asciiTex) asciiTex.dispose();
    };
  }, [asciiTex, uniforms]);

  useEffect(() => {
    uniforms.uDensity.value = density;
  }, [density, uniforms]);

  const targetMouse = useRef(new THREE.Vector2(0, 0));
  const currentMouse = useRef(new THREE.Vector2(0, 0));

  useFrame((state) => {
    if (!meshRef.current) return;
    uniforms.uTime.value = state.clock.elapsedTime;

    // Smooth mouse tracking
    targetMouse.current.set(mouse.x * viewport.width / 2, mouse.y * viewport.height / 2);
    currentMouse.current.lerp(targetMouse.current, 0.1);
    uniforms.uMouse.value.copy(currentMouse.current);

    // Subtle Screen Shake on Hover
    const distToCenter = currentMouse.current.length();
    const isHovering = distToCenter < 5.0; // Adjust threshold based on text size
    const targetShake = isHovering ? 0.3 : 0.0;
    uniforms.uShake.value = THREE.MathUtils.lerp(uniforms.uShake.value, targetShake, 0.1);
  });

  return (
    <points ref={meshRef} geometry={geometry}>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </points>
  );
}

function AsciiWaveText({ density }: { density: number }) {
  return (
    <div className="w-full h-[400px] relative z-0 pointer-events-none">
      <Canvas key="ascii-wave-canvas" camera={{ position: [0, 0, 10], fov: 45 }}>
        <AsciiParticles density={density} />
      </Canvas>
    </div>
  );
}

export default React.memo(AsciiWaveText);
