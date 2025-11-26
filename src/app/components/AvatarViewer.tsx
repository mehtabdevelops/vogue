'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export type AvatarTheme = 'street' | 'formal' | 'summer' | 'sport';

interface AvatarViewerProps {
  modelUrl: string;
  theme?: AvatarTheme;
}

const AvatarViewer: React.FC<AvatarViewerProps> = ({
  modelUrl,
  theme = 'street',
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // Theme colors – you can tweak these
    const themeConfig: Record<
      AvatarTheme,
      { background: number; ground: number }
    > = {
      street: { background: 0x120713, ground: 0x241020 },
      formal: { background: 0x14081e, ground: 0x251838 },
      summer: { background: 0x06151c, ground: 0x134746 },
      sport: { background: 0x070d16, ground: 0x15253d },
    };

    const cfg = themeConfig[theme];

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(cfg.background);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      mountEl.clientWidth / mountEl.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.6, 3);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountEl.appendChild(renderer.domElement);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(0xffffff, 1);
    dir.position.set(2, 4, 3);
    scene.add(dir);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.target.set(0, 1.5, 0);

    // Ground plate
    const groundGeo = new THREE.CircleGeometry(3, 64);
    const groundMat = new THREE.MeshStandardMaterial({
      color: cfg.ground,
      roughness: 0.9,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    // Load avatar GLB
    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        const model = gltf.scene;
        model.position.set(0, 0, 0);
        scene.add(model);
        setLoading(false);
      },
      undefined,
      (error) => {
        console.error('Error loading avatar model:', error);
        setLoading(false);
      }
    );

    // Resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      if (renderer.domElement && mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, theme]); // theme changes → rebuild scene with new colors

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 text-white text-sm">
          Loading avatar…
        </div>
      )}
    </div>
  );
};

export default AvatarViewer;
