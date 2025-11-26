'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// ---- Avatar data model ----
type FaceShape = 'round' | 'oval' | 'square';
type HairStyle = 'short' | 'medium' | 'long' | 'bun' | 'buzz';
type Accessory = 'glasses' | 'earrings' | 'hat';

export interface AvatarData {
  skinTone?: string;
  eyeColor?: string;
  hairColor?: string;
  hairStyle?: HairStyle;
  faceShape?: FaceShape;
  hasBeard?: boolean;
  accessories?: Accessory[];
}

interface Avatar3DRendererProps {
  avatarData: AvatarData;
  onExport?: (data: Blob) => void;
  allowInteraction?: boolean;
  showControls?: boolean;
}

const Avatar3DRenderer: React.FC<Avatar3DRendererProps> = ({
  avatarData,
  onExport,
  allowInteraction = true,
  showControls = true,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const avatarGroupRef = useRef<THREE.Group | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [rotationSpeed, setRotationSpeed] = useState(0);
  const rotationSpeedRef = useRef(0);

  useEffect(() => {
    rotationSpeedRef.current = rotationSpeed;
  }, [rotationSpeed]);

  useEffect(() => {
    const mountEl = mountRef.current;
    if (!mountEl) return;

    // ---- Scene ----
    const scene = new THREE.Scene();
    // slightly lighter background
    scene.background = new THREE.Color(0x140812);
    sceneRef.current = scene;

    // ---- Camera ----
    const camera = new THREE.PerspectiveCamera(
      45,
      mountEl.clientWidth / mountEl.clientHeight,
      0.1,
      1000
    );
    // closer & more centered on face
    camera.position.set(0, 0.8, 1.9);
    cameraRef.current = camera;

    // ---- Renderer ----
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    });
    renderer.setSize(mountEl.clientWidth, mountEl.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountEl.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // ---- Lights (brighter, 3-point style) ----
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.1);
    keyLight.position.set(2, 3, 2);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffb0ff, 0.5);
    fillLight.position.set(-2, 1, 1);
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0x88ccff, 0.6);
    rimLight.position.set(0, 2, -2);
    scene.add(rimLight);

    // ---- Controls (optional) ----
    let controls: OrbitControls | null = null;
    if (allowInteraction) {
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.08;
      controls.minPolarAngle = Math.PI / 3;
      controls.maxPolarAngle = (2 * Math.PI) / 3;
    }

    // ---- Avatar group ----
    const avatarGroup = new THREE.Group();
    avatarGroup.position.y = 0.1; // lift whole avatar a bit
    avatarGroupRef.current = avatarGroup;

    const data: AvatarData = avatarData || {};
    const skinColor = data.skinTone || '#C88F6B';
    const eyeColor = data.eyeColor || '#2C2C2C';
    const hairColor = data.hairColor || '#1C1410';
    const accessories = data.accessories || [];

    // ---------- HEAD ----------
    const headRadius =
      data.faceShape === 'square'
        ? 0.33
        : data.faceShape === 'oval'
        ? 0.36
        : 0.35;

    const headGeometry = new THREE.SphereGeometry(headRadius, 48, 48);
    const skinMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(skinColor),
      roughness: 0.4,
      metalness: 0.1,
      clearcoat: 0.3,
      clearcoatRoughness: 0.8,
    });
    const head = new THREE.Mesh(headGeometry, skinMaterial);
    head.position.y = 0.35;
    avatarGroup.add(head);

    // ---------- NECK & SHOULDERS ----------
    const neckGeo = new THREE.CylinderGeometry(0.12, 0.1, 0.18, 16);
    const neck = new THREE.Mesh(neckGeo, skinMaterial);
    neck.position.set(0, 0.12, 0);
    avatarGroup.add(neck);

    const bodyGeo = new THREE.CylinderGeometry(0.45, 0.5, 0.6, 24);
    const bodyMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#5B3FFF'), // “shirt”
      roughness: 0.6,
      metalness: 0.1,
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.set(0, -0.2, 0);
    avatarGroup.add(body);

    // ---------- EYES (big & cute) ----------
    const eyeWhiteGeo = new THREE.SphereGeometry(0.08, 24, 24);
    const eyeWhiteMat = new THREE.MeshPhongMaterial({ color: 0xffffff });

    const irisGeo = new THREE.SphereGeometry(0.05, 24, 24);
    const irisMat = new THREE.MeshPhongMaterial({
      color: new THREE.Color(eyeColor),
    });

    const pupilGeo = new THREE.SphereGeometry(0.025, 16, 16);
    const pupilMat = new THREE.MeshPhongMaterial({ color: 0x000000 });

    const eyeY = 0.42;
    const eyeZ = 0.25;
    const eyeXOffset = 0.16;

    function makeEye(sign: 1 | -1) {
      const group = new THREE.Group();

      const white = new THREE.Mesh(eyeWhiteGeo, eyeWhiteMat);
      white.position.set(sign * eyeXOffset, 0, 0);
      group.add(white);

      const iris = new THREE.Mesh(irisGeo, irisMat);
      iris.position.set(sign * eyeXOffset, 0, 0.04);
      group.add(iris);

      const pupil = new THREE.Mesh(pupilGeo, pupilMat);
      pupil.position.set(sign * eyeXOffset, 0, 0.07);
      group.add(pupil);

      group.position.set(0, eyeY, eyeZ);
      return group;
    }

    avatarGroup.add(makeEye(-1));
    avatarGroup.add(makeEye(1));

    // ---------- EYEBROWS ----------
    const browGeo = new THREE.BoxGeometry(0.16, 0.02, 0.02);
    const browMat = new THREE.MeshBasicMaterial({ color: 0x1a0a05 });

    const leftBrow = new THREE.Mesh(browGeo, browMat);
    leftBrow.position.set(-eyeXOffset, eyeY + 0.07, eyeZ + 0.03);
    leftBrow.rotation.z = 0.12;
    avatarGroup.add(leftBrow);

    const rightBrow = new THREE.Mesh(browGeo, browMat);
    rightBrow.position.set(eyeXOffset, eyeY + 0.07, eyeZ + 0.03);
    rightBrow.rotation.z = -0.12;
    avatarGroup.add(rightBrow);

    // ---------- NOSE ----------
    const noseGeo = new THREE.ConeGeometry(0.05, 0.11, 16);
    const noseMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(skinColor),
    });
    const nose = new THREE.Mesh(noseGeo, noseMat);
    nose.position.set(0, 0.32, 0.27);
    nose.rotation.x = Math.PI / 2;
    avatarGroup.add(nose);

    // ---------- MOUTH (wider, smiley) ----------
    const mouthGeo = new THREE.RingGeometry(0.07, 0.085, 24, 1, Math.PI * 0.1, Math.PI * 0.8);
    const mouthMat = new THREE.MeshBasicMaterial({
      color: 0x8b3b32,
      side: THREE.DoubleSide,
    });
    const mouth = new THREE.Mesh(mouthGeo, mouthMat);
    mouth.position.set(0, 0.24, 0.27);
    mouth.rotation.y = Math.PI;
    avatarGroup.add(mouth);

    // ---------- HAIR ----------
    if (data.hairStyle) {
      const hairMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hairColor),
        roughness: 0.4,
        metalness: 0.2,
      });

      // main cap
      const hairCapGeo = new THREE.SphereGeometry(
        headRadius + 0.02,
        48,
        48,
        0,
        Math.PI * 2,
        0,
        Math.PI / 2
      );
      const hairCap = new THREE.Mesh(hairCapGeo, hairMat);
      hairCap.position.y = 0.45;
      avatarGroup.add(hairCap);

      if (data.hairStyle === 'bun') {
        const bunGeo = new THREE.SphereGeometry(0.18, 24, 24);
        const bun = new THREE.Mesh(bunGeo, hairMat);
        bun.position.set(0, 0.7, -0.05);
        avatarGroup.add(bun);
      }

      if (data.hairStyle === 'long') {
        const hairBackGeo = new THREE.CylinderGeometry(0.32, 0.28, 0.7, 24);
        const hairBack = new THREE.Mesh(hairBackGeo, hairMat);
        hairBack.position.set(0, 0.1, -0.08);
        avatarGroup.add(hairBack);
      }
    }

    // ---------- BEARD ----------
    if (data.hasBeard) {
      const beardGeo = new THREE.SphereGeometry(
        headRadius + 0.01,
        32,
        32,
        0,
        Math.PI * 2,
        Math.PI / 2,
        Math.PI / 2
      );
      const beardMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color(hairColor),
      });
      const beard = new THREE.Mesh(beardGeo, beardMat);
      beard.position.y = 0.26;
      avatarGroup.add(beard);
    }

    // ---------- GLASSES ----------
    if (accessories.includes('glasses')) {
      const ringGeo = new THREE.RingGeometry(0.09, 0.1, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0x000000,
        side: THREE.DoubleSide,
      });

      const leftRing = new THREE.Mesh(ringGeo, ringMat);
      leftRing.position.set(-eyeXOffset, eyeY, eyeZ + 0.02);
      leftRing.rotation.y = Math.PI;
      avatarGroup.add(leftRing);

      const rightRing = new THREE.Mesh(ringGeo, ringMat);
      rightRing.position.set(eyeXOffset, eyeY, eyeZ + 0.02);
      rightRing.rotation.y = Math.PI;
      avatarGroup.add(rightRing);

      const bridgeGeo = new THREE.BoxGeometry(0.08, 0.015, 0.01);
      const bridgeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const bridge = new THREE.Mesh(bridgeGeo, bridgeMat);
      bridge.position.set(0, eyeY, eyeZ + 0.02);
      avatarGroup.add(bridge);
    }

    scene.add(avatarGroup);
    setIsLoading(false);

    // ---- Animation loop ----
    const animate = () => {
      animationFrameIdRef.current = requestAnimationFrame(animate);

      if (controls) controls.update();
      if (avatarGroupRef.current) {
        avatarGroupRef.current.rotation.y += rotationSpeedRef.current;
      }

      renderer.render(scene, camera);
    };
    animate();

    // ---- Resize handler ----
    const handleResize = () => {
      const mount = mountRef.current;
      if (!mount || !cameraRef.current || !rendererRef.current) return;

      const { clientWidth, clientHeight } = mount;
      const cam = cameraRef.current;
      const rend = rendererRef.current;

      cam.aspect = clientWidth / clientHeight;
      cam.updateProjectionMatrix();
      rend.setSize(clientWidth, clientHeight);
    };

    window.addEventListener('resize', handleResize);

    // ---- Cleanup ----
    return () => {
      window.removeEventListener('resize', handleResize);

      if (animationFrameIdRef.current !== null) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((obj) => {
          const mesh = obj as THREE.Mesh;
          if (mesh.isMesh) {
            if (mesh.geometry) mesh.geometry.dispose();
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((m) => m.dispose());
            } else if (mesh.material) {
              mesh.material.dispose();
            }
          }
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        if (rendererRef.current.domElement && mountRef.current) {
          mountRef.current.removeChild(rendererRef.current.domElement);
        }
      }

      sceneRef.current = null;
      cameraRef.current = null;
      avatarGroupRef.current = null;
      rendererRef.current = null;
    };
  }, [avatarData, allowInteraction]);

  const exportAvatar = () => {
    if (!onExport || !rendererRef.current) return;
    const canvas = rendererRef.current.domElement;

    canvas.toBlob((blob) => {
      if (blob) {
        onExport(blob);
      }
    }, 'image/png');
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mountRef} className="w-full h-full" />

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4" />
            <p>Loading 3D avatar...</p>
          </div>
        </div>
      )}

      {showControls && !isLoading && (
        <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-lg rounded-xl p-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 items-center">
            <div className="col-span-2 sm:col-span-3">
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
              className="bg-purple-600 text-white text-sm px-3 py-2 rounded hover:bg-purple-700"
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
