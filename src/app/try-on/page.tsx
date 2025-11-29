// Save this as: src/app/try-on/page.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAvatar } from '../context/AvatarContext';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'dresses' | 'outerwear' | 'accessories';
  brand: string;
  price: number;
  image: string;
  thumbnailColor: string;
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  rpmOutfitId?: string;
  overlayImage?: string;
}

const CLOTHING_CATALOG: ClothingItem[] = [
  {
    id: 'shirt-001',
    name: 'Classic White Shirt',
    category: 'tops',
    brand: 'Vogue Essentials',
    price: 89.99,
    image: '/images/clothing/white-shirt.png',
    overlayImage: "/images/overlays/shirt1.png",
    thumbnailColor: '#FFFFFF',
    description: 'Timeless white button-down shirt in premium cotton',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' }
    ]
  },
  {
    id: 'blouse-001',
    name: 'Silk Blouse',
    category: 'tops',
    brand: 'Vogue Luxe',
    price: 129.99,
    image: '/images/clothing/silk-blouse.png',
    thumbnailColor: '#F5E6D3',
    description: 'Elegant silk blouse with pearl buttons',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Cream', hex: '#F5E6D3' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Emerald', hex: '#50C878' }
    ]
  },
  {
    id: 'dress-001',
    name: 'Evening Gown',
    category: 'dresses',
    brand: 'Vogue Couture',
    price: 299.99,
    image: '/images/clothing/evening-gown.png',
    thumbnailColor: '#000000',
    description: 'Stunning floor-length evening gown',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#FF0000' },
      { name: 'Gold', hex: '#FFD700' }
    ]
  },
  {
    id: 'jacket-001',
    name: 'Leather Jacket',
    category: 'outerwear',
    brand: 'Vogue Street',
    price: 249.99,
    image: '/images/clothing/leather-jacket.png',
    thumbnailColor: '#000000',
    description: 'Classic leather biker jacket',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#8B4513' },
      { name: 'Burgundy', hex: '#800020' }
    ]
  },
  {
    id: 'pants-001',
    name: 'Tailored Pants',
    category: 'bottoms',
    brand: 'Vogue Professional',
    price: 119.99,
    image: '/images/clothing/tailored-pants.png',
    thumbnailColor: '#36454F',
    description: 'Professional tailored trousers',
    sizes: ['26', '28', '30', '32', '34', '36'],
    colors: [
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Tan', hex: '#D2B48C' }
    ]
  }
];

export default function TryOnPage() {
  const router = useRouter();
  const { avatarUrl } = useAvatar();
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const avatarRef = useRef<THREE.Group | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const clothingPlaneRef = useRef<THREE.Mesh | null>(null);
  const mountedRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(false);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [autoRotate, setAutoRotate] = useState(false);
  const [showClothing, setShowClothing] = useState(false);

  // Sync state to ref
  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (!avatarUrl) {
      router.push('/avatar');
    }
  }, [avatarUrl, router]);

  // Initialize Three.js scene
  useEffect(() => {
    if (!containerRef.current || !avatarUrl || mountedRef.current) return;

    mountedRef.current = true;
    console.log('🎬 Initializing 3D scene...');

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a0b15);
    sceneRef.current = scene;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 2.5);
    camera.lookAt(0, 0.8, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: false,
  preserveDrawingBuffer: true,
});

// size & pixel ratio
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor(0x1a0b15);

// 🔥 important: make GLB look like RPM
// for new Three.js:
(renderer as any).outputColorSpace = THREE.SRGBColorSpace;

// tone mapping similar to RPM
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.1;

// optional but helps PBR materials
// renderer.physicallyCorrectLights = true;
// renderer.shadowMap.enabled = true; // if you add shadows later

    
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // brighter ambient
const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
scene.add(ambientLight);

// soft sky/ground light
const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
hemiLight.position.set(0, 3, 0);
scene.add(hemiLight);

// key light
const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
mainLight.position.set(3, 5, 5);
scene.add(mainLight);

// rim/back light for outline
const rimLight = new THREE.DirectionalLight(0xffffff, 0.8);
rimLight.position.set(-3, 4, -3);
scene.add(rimLight);


    const groundGeometry = new THREE.CircleGeometry(3, 32);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d1123,
      roughness: 1,
      metalness: 0
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    scene.add(ground);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 0.8, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 5;
    controls.maxPolarAngle = Math.PI / 2;
    controls.enablePan = false;
    controlsRef.current = controls;

    const loader = new GLTFLoader();
    console.log('📦 Loading avatar from:', avatarUrl);

    loader.load(
      avatarUrl,
      (gltf) => {
        if (!mountedRef.current) return;
        
        console.log('✅ Avatar loaded');
        
        const avatar = gltf.scene;
        avatar.traverse((child: any) => {
      if (child.isMesh && typeof child.name === 'string') {
        // Ready Player Me tops usually have names like "Wolf3D_Outfit_Top"
        if (child.name.includes('Outfit_Top')) {
          const mat = child.material as THREE.Material & { opacity?: number; transparent?: boolean };
          mat.transparent = true;
          (mat.opacity as number) = 0.15; // or 0 for fully invisible
        }
      }
    });
        const box = new THREE.Box3().setFromObject(avatar);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        avatar.position.x = -center.x;
        avatar.position.y = -box.min.y;
        avatar.position.z = -center.z;

        scene.add(avatar);
        avatarRef.current = avatar;

        const avatarHeight = size.y;
        const lookAtHeight = avatarHeight * 0.5;
        camera.lookAt(0, lookAtHeight, 0);
        controls.target.set(0, lookAtHeight, 0);
        controls.update();

        setIsLoading(false);
      },
      undefined,
      (error) => {
        console.error('❌ Error loading avatar:', error);
        setError('Failed to load avatar');
        setIsLoading(false);
      }
    );

    const animate = () => {
      if (!mountedRef.current) return;
      
      const animationId = requestAnimationFrame(animate);
      animationFrameRef.current = animationId;

      if (autoRotateRef.current && avatarRef.current) {
        avatarRef.current.rotation.y += 0.005;
      }

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current || !mountedRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      mountedRef.current = false;
      window.removeEventListener('resize', handleResize);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (controlsRef.current) {
        controlsRef.current.dispose();
      }
      
      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          if (object instanceof THREE.Mesh) {
            if (object.geometry) object.geometry.dispose();
            if (object.material) {
              if (Array.isArray(object.material)) {
                object.material.forEach(m => m.dispose());
              } else {
                object.material.dispose();
              }
            }
          }
        });
      }

      if (rendererRef.current) {
        rendererRef.current.dispose();
        const canvas = rendererRef.current.domElement;
        if (canvas && canvas.parentNode) {
          canvas.parentNode.removeChild(canvas);
        }
      }

      sceneRef.current = null;
      avatarRef.current = null;
      cameraRef.current = null;
      rendererRef.current = null;
    };
  }, [avatarUrl, router]);

  const applyClothingOverlay = (item: ClothingItem, color: string) => {
  if (!sceneRef.current || !avatarRef.current) return;

  // Remove previous overlay
  if (clothingPlaneRef.current) {
    sceneRef.current.remove(clothingPlaneRef.current);
    clothingPlaneRef.current.geometry.dispose();
    if (Array.isArray(clothingPlaneRef.current.material)) {
      clothingPlaneRef.current.material.forEach((m) => m.dispose());
    } else {
      clothingPlaneRef.current.material.dispose();
    }
    clothingPlaneRef.current = null;
  }

  const box = new THREE.Box3().setFromObject(avatarRef.current);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // Base dimensions + vertical offset by category
  let width = size.x * 0.6;
  let height = size.y * 0.4;
  let yOffset = size.y * 0.15;

  switch (item.category) {
    case 'tops':
      width = size.x * 0.55;
      height = size.y * 0.45;
      yOffset = size.y * 0.15;
      break;
    case 'bottoms':
      width = size.x * 0.5;
      height = size.y * 0.45;
      yOffset = -size.y * 0.1;
      break;
    case 'dresses':
      width = size.x * 0.6;
      height = size.y * 0.8;
      yOffset = 0;
      break;
    case 'outerwear':
      width = size.x * 0.6;
      height = size.y * 0.5;
      yOffset = size.y * 0.15;
      break;
    case 'accessories':
      width = size.x * 0.3;
      height = size.y * 0.2;
      yOffset = size.y * 0.35;
      break;
  }

  // Prefer overlayImage, then fallback to normal product image
  const texturePath = item.overlayImage || item.image;

  if (texturePath) {
    const textureLoader = new THREE.TextureLoader();
const texturePath = item.overlayImage || item.image; // prefer overlay

textureLoader.load(texturePath, (texture) => {
  const img = texture.image as HTMLImageElement;
  const aspect = img.width / img.height || 1;

  const planeWidth = width;
  const planeHeight = planeWidth / aspect;

  const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight);
  const material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    side: THREE.DoubleSide,
  });

  const clothingPlane = new THREE.Mesh(geometry, material);
  clothingPlane.position.set(center.x, center.y + yOffset, box.max.z + 0.02);

  sceneRef.current!.add(clothingPlane);
  clothingPlaneRef.current = clothingPlane;
  setShowClothing(true);
});

  } else {
    // No images at all, keep old colored overlay
    const geometry = new THREE.PlaneGeometry(width, height);
    const material = new THREE.MeshBasicMaterial({
      color: new THREE.Color(color),
      transparent: true,
      opacity: 0.75,
      side: THREE.DoubleSide,
    });
    const clothingPlane = new THREE.Mesh(geometry, material);
    clothingPlane.position.set(center.x, center.y + yOffset, box.max.z + 0.02);

    sceneRef.current.add(clothingPlane);
    clothingPlaneRef.current = clothingPlane;
    setShowClothing(true);
  }
};



  const handleSelectItem = (item: ClothingItem) => {
    setSelectedItem(item);
    setSelectedColor(item.colors[0].hex);
    setSelectedSize(item.sizes[0]);
    applyClothingOverlay(item, item.colors[0].hex);
  };

  const handleColorChange = (color: string) => {
    setSelectedColor(color);
    if (selectedItem) {
      applyClothingOverlay(selectedItem, color);
    }
  };

  const handleRemoveClothing = () => {
    if (clothingPlaneRef.current && sceneRef.current) {
      sceneRef.current.remove(clothingPlaneRef.current);
      clothingPlaneRef.current.geometry.dispose();
      if (Array.isArray(clothingPlaneRef.current.material)) {
        clothingPlaneRef.current.material.forEach(m => m.dispose());
      } else {
        clothingPlaneRef.current.material.dispose();
      }
      clothingPlaneRef.current = null;
      setShowClothing(false);
      setSelectedItem(null);
    }
  };

  const handleAddToCart = () => {
    if (!selectedItem || !selectedColor || !selectedSize) {
      alert('Please select color and size');
      return;
    }

    const cartItem = {
      itemId: selectedItem.id,
      name: selectedItem.name,
      brand: selectedItem.brand,
      price: selectedItem.price,
      color: selectedItem.colors.find(c => c.hex === selectedColor)?.name || 'Unknown',
      size: selectedSize,
      category: selectedItem.category,
      thumbnailColor: selectedItem.thumbnailColor,
      avatarUrl: avatarUrl,
      quantity: 1,
      addedAt: new Date().toISOString()
    };

    const existingCart = localStorage.getItem('vogueCart');
    const cart = existingCart ? JSON.parse(existingCart) : [];

    const existingIndex = cart.findIndex(
      (item: any) =>
        item.itemId === cartItem.itemId &&
        item.color === cartItem.color &&
        item.size === cartItem.size
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem('vogueCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    alert(`✅ Added ${selectedItem.name} to cart!`);
  };

  const handleCapturePhoto = () => {
    if (!rendererRef.current) return;
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `vogue-tryon-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  };

  const filteredCatalog = selectedCategory === 'all'
    ? CLOTHING_CATALOG
    : CLOTHING_CATALOG.filter(item => item.category === selectedCategory);

  const categories = [
    { id: 'all', label: 'All', icon: '👗' },
    { id: 'tops', label: 'Tops', icon: '👔' },
    { id: 'bottoms', label: 'Bottoms', icon: '👖' },
    { id: 'dresses', label: 'Dresses', icon: '👗' },
    { id: 'outerwear', label: 'Outerwear', icon: '🧥' },
    { id: 'accessories', label: 'Accessories', icon: '👒' }
  ];

  if (!avatarUrl) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Virtual Try-On
          </h1>
          <p className="text-gray-300">
            See how clothes look on your avatar in real-time
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr,400px] gap-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div 
              ref={containerRef}
              className="w-full h-[600px] rounded-xl overflow-hidden bg-gradient-to-br from-[#1a0b15] to-[#2d1123] relative"
            >
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-white">Loading avatar...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl z-10">
                  <div className="text-center p-6">
                    <p className="text-red-400 mb-4">{error}</p>
                    <button
                      onClick={() => router.push('/avatar')}
                      className="px-6 py-2 bg-white text-[#54162b] rounded-lg font-semibold hover:bg-gray-100"
                    >
                      Create New Avatar
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3 mt-4">
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  autoRotate
                    ? 'bg-purple-600 text-white'
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {autoRotate ? '⏸️ Stop Rotate' : '▶️ Auto-Rotate'}
              </button>
              
              <button
                onClick={handleCapturePhoto}
                className="px-4 py-2 rounded-lg bg-white/10 text-white hover:bg-white/20 font-medium"
              >
                📸 Capture Photo
              </button>

              {showClothing && (
                <button
                  onClick={handleRemoveClothing}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 font-medium"
                >
                  ✕ Remove Clothing
                </button>
              )}
            </div>

            {selectedItem && (
              <div className="mt-4 p-4 bg-white/10 rounded-xl border border-white/20">
                <h3 className="text-white font-bold text-lg mb-2">{selectedItem.name}</h3>
                <p className="text-gray-300 text-sm mb-3">{selectedItem.description}</p>
                
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-semibold">Color:</label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedItem.colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => handleColorChange(color.hex)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${
                            selectedColor === color.hex
                              ? 'border-white scale-110 shadow-lg'
                              : 'border-white/30 hover:border-white/50'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-semibold">Size:</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${
                            selectedSize === size
                              ? 'bg-white text-[#54162b]'
                              : 'bg-white/10 text-white hover:bg-white/20'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold rounded-xl transition-all transform hover:scale-105 shadow-lg"
                  >
                    Add to Cart - ${selectedItem.price.toFixed(2)}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-4">Clothing Catalog</h2>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-white text-[#54162b]'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span className="mr-1">{cat.icon}</span>
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
              {filteredCatalog.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectItem(item)}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    selectedItem?.id === item.id
                      ? 'bg-white/20 border-white shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                  }`}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-16 h-16 rounded-lg flex-shrink-0"
                      style={{ backgroundColor: item.thumbnailColor }}
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-white font-semibold truncate">{item.name}</h3>
                      <p className="text-gray-300 text-xs">{item.brand}</p>
                      <p className="text-purple-300 font-bold mt-1">
                        ${item.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-300 text-xs mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() => router.push('/cart')}
              className="w-full mt-4 py-3 bg-white text-[#54162b] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-lg"
            >
              View Cart 🛒
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}