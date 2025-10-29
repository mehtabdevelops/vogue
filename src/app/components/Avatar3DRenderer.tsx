'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Avatar3DRendererProps {
  avatarData: any;
  onExport?: (data: Blob) => void;
  allowInteraction?: boolean;
  showControls?: boolean;
}

const Avatar3DRenderer: React.FC<Avatar3DRendererProps> = ({
  avatarData,
  onExport,
  allowInteraction = true,
  showControls = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0b15);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.5, 3);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 0.8);
    keyLight.position.set(2, 3, 2);
    scene.add(keyLight);

    // Controls
    let controls: OrbitControls | null = null;
    if (allowInteraction) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
    }

    // Create simple avatar
    const avatarGroup = new THREE.Group();

    // Head
    const headGeometry = new THREE.SphereGeometry(0.35, 32, 32);
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color('#C88F6B'),
      roughness: 0.7,
    });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    avatarGroup.add(head);

    // Eyes
    const eyeGeometry = new THREE.SphereGeometry(0.06, 16, 16);
    const eyeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    
    const leftEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    leftEye.position.set(-0.15, 0.1, 0.25);
    avatarGroup.add(leftEye);

    const rightEye = new THREE.Mesh(eyeGeometry, eyeMaterial);
    rightEye.position.set(0.15, 0.1, 0.25);
    avatarGroup.add(rightEye);

    scene.add(avatarGroup);
    setIsLoading(false);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (controls) {
        controls.update();
      }

      if (rotationSpeed !== 0) {
        avatarGroup.rotation.y += rotationSpeed;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!mountRef.current) return;
      
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [avatarData, allowInteraction, rotationSpeed]);

  const exportAvatar = () => {
    // Simple export implementation
    if (onExport) {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      if (context) {
        context.fillStyle = '#1a0b15';
        context.fillRect(0, 0, 512, 512);
        context.fillStyle = '#C88F6B';
        context.arc(256, 256, 100, 0, 2 * Math.PI);
        context.fill();
        
        canvas.toBlob((blob) => {
          if (blob) onExport(blob);
        });
      }
    }
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
            <p>Loading 3D avatar...</p>
          </div>
        </div>
      )}

      {showControls && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/50 backdrop-blur-lg rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-white text-xs mb-1 block">Auto-rotate</label>
              <input
                type="range"
                min="-0.05"
                max="0.05"
                step="0.01"
                value={rotationSpeed}
                onChange={(e) => setRotationSpeed(parseFloat(e.target.value))}
                className="w-full"
              />
            </div>

            <button
              onClick={exportAvatar}
              className="bg-purple-600 text-white text-sm px-3 py-1 rounded hover:bg-purple-700"
            >
              Export
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Avatar3DRenderer;