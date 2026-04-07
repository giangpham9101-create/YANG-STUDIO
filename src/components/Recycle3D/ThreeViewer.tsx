import React, { useRef, useMemo, useImperativeHandle, forwardRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, PerspectiveCamera, Environment, Center, AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import * as THREE from "three";
// @ts-ignore
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { Material } from "../../pages/Workshop";

interface ThreeViewerProps {
  paths: any[];
  material: Material;
  isSmooth: boolean;
}

export interface ThreeViewerRef {
  exportSTL: () => void;
}

const ExtrudedPaths = ({ paths, material, isSmooth }: ThreeViewerProps) => {
  const groupRef = useRef<THREE.Group>(null);

  const geometries = useMemo(() => {
    if (!paths || paths.length === 0) return [];

    return paths.map((pathData) => {
      const shape = new THREE.Shape();
      const pathArray = pathData.path;

      if (!pathArray || pathArray.length === 0) return null;

      // Fabric.js paths are centered around their own bounding box, 
      // but we want to preserve their relative positions if possible.
      // For now, let's just draw them as they are.
      pathArray.forEach((segment: any[]) => {
        const command = segment[0];
        switch (command) {
          case "M":
            shape.moveTo(segment[1], -segment[2]);
            break;
          case "L":
            shape.lineTo(segment[1], -segment[2]);
            break;
          case "Q":
            shape.quadraticCurveTo(segment[1], -segment[2], segment[3], -segment[4]);
            break;
          case "C":
            shape.bezierCurveTo(segment[1], -segment[2], segment[3], -segment[4], segment[5], -segment[6]);
            break;
          case "Z":
            shape.closePath();
            break;
        }
      });

      const extrudeSettings = {
        steps: 2,
        depth: 20,
        bevelEnabled: true,
        bevelThickness: 2,
        bevelSize: 2,
        bevelOffset: 0,
        bevelSegments: 1,
      };

      const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
      
      // Auto-Scaling: Scale to fit 50mm x 50mm x 50mm bounding box
      geometry.computeBoundingBox();
      const box = geometry.boundingBox;
      if (box) {
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 50 / maxDim;
        geometry.scale(scale, scale, scale);
      }

      // Center the geometry
      geometry.center();
      
      return geometry;
    }).filter(Boolean);
  }, [paths]);

  return (
    <group ref={groupRef}>
      {geometries.map((geo, i) => (
        <mesh key={i} geometry={geo as THREE.BufferGeometry}>
          <meshStandardMaterial 
            color={material.color} 
            roughness={material.roughness} 
            metalness={material.metalness}
            flatShading={!isSmooth}
          >
            {/* Subtle noise for recycled look */}
            <canvasTexture 
              attach="map" 
              image={(() => {
                const canvas = document.createElement("canvas");
                canvas.width = 64;
                canvas.height = 64;
                const ctx = canvas.getContext("2d")!;
                for (let x = 0; x < 64; x++) {
                  for (let y = 0; y < 64; y++) {
                    const val = Math.random() * 255;
                    ctx.fillStyle = `rgba(${val},${val},${val},0.1)`;
                    ctx.fillRect(x, y, 1, 1);
                  }
                }
                return canvas;
              })()}
              wrapS={THREE.RepeatWrapping}
              wrapT={THREE.RepeatWrapping}
              repeat={[5, 5]}
            />
          </meshStandardMaterial>
        </mesh>
      ))}
    </group>
  );
};

const Scene = forwardRef(({ paths, material, isSmooth }: ThreeViewerProps, ref) => {
  const { scene } = useThree();
  
  useImperativeHandle(ref, () => ({
    exportSTL: () => {
      const exporter = new STLExporter();
      const result = exporter.parse(scene);
      const blob = new Blob([result], { type: "application/octet-stream" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "recycle3d_print.stl";
      link.click();
    }
  }));

  return (
    <>
      <PerspectiveCamera makeDefault position={[100, 100, 100]} fov={50} />
      <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} />
      
      <ambientLight intensity={0.5} />
      <pointLight position={[100, 100, 100]} intensity={1} castShadow />
      <spotLight position={[-100, 100, 100]} angle={0.15} penumbra={1} intensity={1} castShadow />

      <Center top>
        <ExtrudedPaths paths={paths} material={material} isSmooth={isSmooth} />
      </Center>

      <gridHelper args={[200, 20, "#333", "#222"]} position={[0, -1, 0]} />
      
      <Environment preset="city" />
      
      <AccumulativeShadows temporal frames={100} color="black" colorBlend={0.5} opacity={0.7} scale={200}>
        <RandomizedLight amount={8} radius={50} ambient={0.5} intensity={1} position={[50, 50, 50]} bias={0.001} />
      </AccumulativeShadows>
    </>
  );
});

const ThreeViewer = forwardRef<ThreeViewerRef, ThreeViewerProps>((props, ref) => {
  return (
    <div className="w-full h-full">
      <Canvas shadows dpr={[1, 2]}>
        <Scene {...props} ref={ref} />
      </Canvas>
    </div>
  );
});

export default ThreeViewer;
