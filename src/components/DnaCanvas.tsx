'use client';

import React, { useMemo, useRef, useEffect, Suspense, Component, ErrorInfo, ReactNode } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment } from '@react-three/drei';

function DnaGltfModel({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  const { viewport } = useThree();
  const modelRef = useRef<THREE.Group>(null);

  // Clone scene so we can mutate materials safely
  const clonedScene = useMemo(() => {
    const clone = scene.clone();
    
    // Strand A: Metallic reflective orange
    const orangeMetallicMaterial = new THREE.MeshStandardMaterial({
      color: '#d97757',
      emissive: '#d97757',
      emissiveIntensity: 0.1,
      metalness: 0.85,
      roughness: 0.25,
    });
    
    // Strand B: Flat matte dark (slightly lighter than pure black to avoid getting lost in shadow)
    const darkMatteMaterial = new THREE.MeshStandardMaterial({
      color: '#232527',
      metalness: 0.1,
      roughness: 0.9,
    });

    let meshIndex = 0;
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        // The GLTF meshes from Sketchfab often named Object_2, Object_3
        // If they match perfectly, we assign A/B. Otherwise we fallback to alternating
        if (mesh.name === 'Object_2' || meshIndex % 2 === 0) {
          mesh.material = orangeMetallicMaterial;
        } else {
          mesh.material = darkMatteMaterial;
        }
        meshIndex++;
      }
    });

    return clone;
  }, [scene]);

  /**
   * FIX: Compute bounding box from ONLY visible Mesh geometry.
   *
   * The GLTF from Sketchfab wraps meshes in empty Group/Object3D nodes whose
   * transforms inflate the scene-level bounding box far beyond the actual
   * visible geometry. Box3.setFromObject() includes ALL descendants including
   * those phantom nodes — which is why scaling by that box always undershoots.
   *
   * Solution: traverse and union only the geometry-level bounding boxes of
   * real Mesh children, ignoring empty Groups. This gives the true visual
   * extents of the helix.
   */
  const { scale, centerOffset } = useMemo(() => {
    // Force update world matrices so geometry bounding boxes are in world space
    clonedScene.updateMatrixWorld(true);

    const meshBox = new THREE.Box3();
    clonedScene.traverse((child) => {
      const mesh = child as THREE.Mesh;
      if (mesh.isMesh && mesh.geometry) {
        mesh.geometry.computeBoundingBox();
        const geomBox = mesh.geometry.boundingBox!.clone();
        geomBox.applyMatrix4(mesh.matrixWorld);
        meshBox.union(geomBox);
      }
    });

    const size = meshBox.getSize(new THREE.Vector3());
    const center = meshBox.getCenter(new THREE.Vector3());

    // Scale so real mesh height fills 95 % of the viewport
    const targetHeight = viewport.height * 2.2;
    const computedScale = size.y === 0 ? 1 : targetHeight / size.y;

    return {
      scale: computedScale,
      // Offset so the real mesh center sits at world origin, not the phantom box center
      centerOffset: new THREE.Vector3(-center.x, -center.y, -center.z),
    };
  }, [clonedScene, viewport.height]);

  // Apply the corrected center offset
  useEffect(() => {
    clonedScene.position.copy(centerOffset);
  }, [clonedScene, centerOffset]);

  useFrame((_state, delta) => {
    // 3. Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (modelRef.current && !prefersReducedMotion) {
      modelRef.current.rotation.y += delta * 0.3; // Slow, ambient rotation
    }
  });

  return (
    // Uniform scale so the model retains its natural, undistorted proportions
    <group ref={modelRef} scale={scale}>
      <primitive object={clonedScene} />
    </group>
  );
}

// 4. Preload the .gltf file so it begins downloading immediately
useGLTF.preload('/dna/scene.gltf');

// 5. Error Boundary for Canvas and GLTF Loading
class CanvasErrorBoundary extends Component<{ children: ReactNode, fallback: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode, fallback: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.error("WebGL / GLTF Error:", error);
  }

  render() {
    if (this.state.hasError) return this.props.fallback;
    return this.props.children;
  }
}

export default function DnaCanvas({ fallbackSvg }: { fallbackSvg: ReactNode }) {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 opacity-80">
      {/* If WebGL crashes or GLTF is 404/corrupt, this falls back gracefully */}
      <CanvasErrorBoundary fallback={<div className="absolute inset-0 opacity-50">{fallbackSvg}</div>}>
        {/*
          Camera z=6, FOV=52: pulled back far enough for the full-height mesh.
          Previous z=5.2/FOV=45 was clipping the bottom because the mesh
          was taller than the frustum after the bounding-box fix.
        */}
        <Canvas camera={{ position: [0, 0, 6], fov: 52 }} dpr={[1, 2]} gl={{ alpha: true }}>
          <ambientLight intensity={0.5} />
          {/* Rim light to make the metallic strand pop */}
          <directionalLight position={[10, 10, -5]} intensity={2} color="#ffffff" />
          <directionalLight position={[-10, 10, 10]} intensity={1} color="#d97757" />
          {/* Suspense boundary hides loading spinner, keeps layout stable, and pops in smoothly */}
          <Suspense fallback={null}>
            {/* Environment preset provides reflections for the metalness to catch */}
            <Environment preset="studio" />
            <DnaGltfModel url="/dna/scene.gltf" />
          </Suspense>
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
