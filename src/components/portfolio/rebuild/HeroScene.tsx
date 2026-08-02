'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function RotatingWireframe() {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(({ clock, pointer }) => {
        if (!meshRef.current) return;
        const time = clock.getElapsedTime();

        // Slow base rotation
        meshRef.current.rotation.y = time * 0.1;
        meshRef.current.rotation.x = time * 0.05;

        // Subtle parallax tilt based on mouse position
        const targetRotX = (pointer.y * Math.PI) / 10;
        const targetRotY = (pointer.x * Math.PI) / 10;

        meshRef.current.rotation.x += (targetRotX - meshRef.current.rotation.x) * 0.05;
        meshRef.current.rotation.y += (targetRotY - meshRef.current.rotation.y) * 0.05;
    });

    return (
        <mesh ref={meshRef}>
            {/* Icosahedron provides a nice faceted crystal/geometric look */}
            <icosahedronGeometry args={[2, 0]} />
            {/* Wireframe material fitting the engineering aesthetic */}
            <meshBasicMaterial
                color="#4ee1ff" // signal cyan
                wireframe
                transparent
                opacity={0.15}
            />
        </mesh>
    );
}

export default function HeroScene() {
    return (
        <div className="absolute inset-0 z-0 pointer-events-none opacity-50">
            <Canvas
                camera={{ position: [0, 0, 5], fov: 45 }}
                gl={{ antialias: false, alpha: true }}
            >
                <RotatingWireframe />
            </Canvas>
        </div>
    );
}
