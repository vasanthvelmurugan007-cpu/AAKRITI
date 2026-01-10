import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing';
import { Float, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import './LiquidShader'; // Ensure the material is registered

const FluidBackground = () => {
    const materialRef = useRef();

    useFrame(({ clock, pointer }) => {
        if (materialRef.current) {
            materialRef.current.uTime = clock.getElapsedTime();
            // Smoothly interpolate mouse position
            materialRef.current.uMouse.lerp(new THREE.Vector2(pointer.x * 0.5 + 0.5, pointer.y * 0.5 + 0.5), 0.1);
        }
    });

    return (
        <mesh scale={[20, 20, 1]}>
            <planeGeometry args={[1, 1, 128, 128]} />
            {/* @ts-ignore */}
            <liquidMaterial ref={materialRef} side={THREE.DoubleSide} />
        </mesh>
    );
};

const FloatingOrb = ({ position, color, scale = 1 }) => {
    return (
        <Float speed={2} rotationIntensity={1} floatIntensity={2}>
            <mesh position={position} scale={scale}>
                <sphereGeometry args={[1, 32, 32]} />
                <meshPhysicalMaterial
                    roughness={0}
                    transmission={1}
                    thickness={0.5}
                    color={color}
                    ior={1.5}
                    emissive={color}
                    emissiveIntensity={0.5}
                />
            </mesh>
        </Float>
    )
}

const Scene = () => {
    return (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
            <Canvas dpr={[1, 2]} gl={{ alpha: true, antialias: false, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.5 }}>
                <PerspectiveCamera makeDefault position={[0, 0, 5]} />

                {/* Ambient Visuals - Disabled for Aakriti Background */}
                {/* <FluidBackground /> */}

                {/* Floating Glass Orbs for Depth */}
                <FloatingOrb position={[-3, 1, 2]} color="#c9a875" scale={0.5} />
                <FloatingOrb position={[3, -2, 1]} color="#ffffff" scale={0.8} />

                {/* Post Processing */}
                <EffectComposer disableNormalPass>
                    <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.5} />
                    <Noise opacity={0.05} />
                    <Vignette eskil={false} offset={0.1} darkness={1.1} />
                </EffectComposer>
            </Canvas>
        </div>
    );
};

export default Scene;
