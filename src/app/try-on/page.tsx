// FORCE COLOR VERSION - Removes textures so colors show up!
// Save this as: src/app/try-on/page.tsx

'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAvatar } from '../context/AvatarContext';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getRecommendationsForItem } from "../../../services/recommendationService";


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
}

// EXPANDED CLOTHING CATALOG - 35+ Items
// Copy this into your src/app/try-on/page.tsx file, replacing the existing CLOTHING_CATALOG array

export const CLOTHING_CATALOG: ClothingItem[] = [
  // ========== TOPS (10 items) ==========
  {
    id: 'shirt-001',
    name: 'Classic White Shirt',
    category: 'tops',
    brand: 'Vogue Essentials',
    price: 89.99,
    image: '/images/clothing/white-shirt.png',
    thumbnailColor: '#FFFFFF',
    description: 'Timeless white button-down shirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Red', hex: '#FF0000' }
    ]
  },
  {
    id: 'tshirt-001',
    name: 'Premium Cotton Tee',
    category: 'tops',
    brand: 'Vogue Basics',
    price: 45.99,
    image: '/images/clothing/cotton-tee.png',
    thumbnailColor: '#808080',
    description: 'Soft premium cotton t-shirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Grey', hex: '#808080' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Olive', hex: '#556B2F' }
    ]
  },
  {
    id: 'hoodie-001',
    name: 'Classic Hoodie',
    category: 'tops',
    brand: 'Vogue Street',
    price: 79.99,
    image: '/images/clothing/hoodie.png',
    thumbnailColor: '#2C2C2C',
    description: 'Comfortable pullover hoodie',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#2C2C2C' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Forest Green', hex: '#228B22' }
    ]
  },
  {
    id: 'polo-001',
    name: 'Polo Shirt',
    category: 'tops',
    brand: 'Vogue Sport',
    price: 65.99,
    image: '/images/clothing/polo.png',
    thumbnailColor: '#003366',
    description: 'Classic polo shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Navy', hex: '#003366' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#DC143C' }
    ]
  },
  {
    id: 'tshirt-002',
    name: 'Graphic Tee',
    category: 'tops',
    brand: 'Vogue Street',
    price: 39.99,
    image: '/images/clothing/graphic-tee.png',
    thumbnailColor: '#000000',
    description: 'Bold graphic print t-shirt',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Red', hex: '#DC143C' },
      { name: 'Royal Blue', hex: '#4169E1' }
    ]
  },
  {
    id: 'sweater-001',
    name: 'Cable Knit Sweater',
    category: 'tops',
    brand: 'Vogue Knits',
    price: 125.99,
    image: '/images/clothing/cable-sweater.png',
    thumbnailColor: '#8B4513',
    description: 'Cozy cable knit wool sweater',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Camel', hex: '#8B4513' },
      { name: 'Cream', hex: '#F5F5DC' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Forest Green', hex: '#228B22' }
    ]
  },
  {
    id: 'vneck-001',
    name: 'V-Neck Sweater',
    category: 'tops',
    brand: 'Vogue Essentials',
    price: 95.99,
    image: '/images/clothing/vneck.png',
    thumbnailColor: '#696969',
    description: 'Elegant v-neck sweater',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#696969' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'longsleeve-001',
    name: 'Long Sleeve Henley',
    category: 'tops',
    brand: 'Vogue Casual',
    price: 55.99,
    image: '/images/clothing/henley.png',
    thumbnailColor: '#A9A9A9',
    description: 'Classic henley with button placket',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Heather Grey', hex: '#A9A9A9' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'tank-001',
    name: 'Athletic Tank Top',
    category: 'tops',
    brand: 'Vogue Active',
    price: 29.99,
    image: '/images/clothing/tank.png',
    thumbnailColor: '#FFFFFF',
    description: 'Breathable athletic tank',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Navy', hex: '#000080' }
    ]
  },
  {
    id: 'flannel-001',
    name: 'Flannel Shirt',
    category: 'tops',
    brand: 'Vogue Outdoors',
    price: 75.99,
    image: '/images/clothing/flannel.png',
    thumbnailColor: '#8B0000',
    description: 'Classic plaid flannel shirt',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Red Plaid', hex: '#8B0000' },
      { name: 'Blue Plaid', hex: '#000080' },
      { name: 'Green Plaid', hex: '#006400' },
      { name: 'Black Plaid', hex: '#000000' }
    ]
  },

  // ========== OUTERWEAR (7 items) ==========
  {
    id: 'jacket-001',
    name: 'Leather Jacket',
    category: 'outerwear',
    brand: 'Vogue Rebel',
    price: 349.99,
    image: '/images/clothing/leather-jacket.png',
    thumbnailColor: '#000000',
    description: 'Classic leather biker jacket',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Brown', hex: '#654321' },
      { name: 'Burgundy', hex: '#800020' }
    ]
  },
  {
    id: 'jacket-002',
    name: 'Denim Jacket',
    category: 'outerwear',
    brand: 'Vogue Denim',
    price: 129.99,
    image: '/images/clothing/denim-jacket.png',
    thumbnailColor: '#4682B4',
    description: 'Classic denim jacket',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Light Blue', hex: '#4682B4' },
      { name: 'Dark Blue', hex: '#191970' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'blazer-001',
    name: 'Tailored Blazer',
    category: 'outerwear',
    brand: 'Vogue Professional',
    price: 299.99,
    image: '/images/clothing/blazer.png',
    thumbnailColor: '#191970',
    description: 'Sharp tailored blazer',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#191970' },
      { name: 'Black', hex: '#000000' },
      { name: 'Charcoal', hex: '#36454F' },
      { name: 'Camel', hex: '#C19A6B' }
    ]
  },
  {
    id: 'bomber-001',
    name: 'Bomber Jacket',
    category: 'outerwear',
    brand: 'Vogue Street',
    price: 179.99,
    image: '/images/clothing/bomber.png',
    thumbnailColor: '#2F4F4F',
    description: 'Classic bomber jacket',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' }
    ]
  },
  {
    id: 'parka-001',
    name: 'Winter Parka',
    category: 'outerwear',
    brand: 'Vogue Winter',
    price: 399.99,
    image: '/images/clothing/parka.png',
    thumbnailColor: '#000000',
    description: 'Heavy-duty winter parka',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Grey', hex: '#808080' }
    ]
  },
  {
    id: 'windbreaker-001',
    name: 'Windbreaker Jacket',
    category: 'outerwear',
    brand: 'Vogue Active',
    price: 89.99,
    image: '/images/clothing/windbreaker.png',
    thumbnailColor: '#FF4500',
    description: 'Lightweight windbreaker',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Orange', hex: '#FF4500' },
      { name: 'Royal Blue', hex: '#4169E1' },
      { name: 'Black', hex: '#000000' },
      { name: 'Yellow', hex: '#FFD700' }
    ]
  },
  {
    id: 'peacoat-001',
    name: 'Wool Peacoat',
    category: 'outerwear',
    brand: 'Vogue Classic',
    price: 279.99,
    image: '/images/clothing/peacoat.png',
    thumbnailColor: '#000080',
    description: 'Traditional wool peacoat',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Navy', hex: '#000080' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Camel', hex: '#C19A6B' }
    ]
  },

  // ========== BOTTOMS (8 items) ==========
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
      { name: 'Black', hex: '#000000' },
      { name: 'Tan', hex: '#D2B48C' }
    ]
  },
  {
    id: 'jeans-001',
    name: 'Slim Fit Jeans',
    category: 'bottoms',
    brand: 'Vogue Denim',
    price: 99.99,
    image: '/images/clothing/slim-jeans.png',
    thumbnailColor: '#1E3A8A',
    description: 'Modern slim fit jeans',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Dark Blue', hex: '#1E3A8A' },
      { name: 'Black', hex: '#000000' },
      { name: 'Light Blue', hex: '#4682B4' }
    ]
  },
  {
    id: 'chinos-001',
    name: 'Chino Pants',
    category: 'bottoms',
    brand: 'Vogue Casual',
    price: 79.99,
    image: '/images/clothing/chinos.png',
    thumbnailColor: '#D2B48C',
    description: 'Comfortable chino pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Khaki', hex: '#D2B48C' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'jeans-002',
    name: 'Straight Leg Jeans',
    category: 'bottoms',
    brand: 'Vogue Denim',
    price: 109.99,
    image: '/images/clothing/straight-jeans.png',
    thumbnailColor: '#4682B4',
    description: 'Classic straight leg denim',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Medium Blue', hex: '#4682B4' },
      { name: 'Dark Blue', hex: '#191970' },
      { name: 'Black', hex: '#000000' },
      { name: 'Light Wash', hex: '#87CEEB' }
    ]
  },
  {
    id: 'shorts-001',
    name: 'Casual Shorts',
    category: 'bottoms',
    brand: 'Vogue Summer',
    price: 59.99,
    image: '/images/clothing/shorts.png',
    thumbnailColor: '#D2B48C',
    description: 'Comfortable summer shorts',
    sizes: ['28', '30', '32', '34', '36'],
    colors: [
      { name: 'Khaki', hex: '#D2B48C' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Grey', hex: '#808080' },
      { name: 'Olive', hex: '#556B2F' }
    ]
  },
  {
    id: 'joggers-001',
    name: 'Athletic Joggers',
    category: 'bottoms',
    brand: 'Vogue Active',
    price: 69.99,
    image: '/images/clothing/joggers.png',
    thumbnailColor: '#2F4F4F',
    description: 'Comfortable athletic joggers',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Charcoal', hex: '#2F4F4F' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Grey', hex: '#808080' }
    ]
  },
  {
    id: 'cargo-001',
    name: 'Cargo Pants',
    category: 'bottoms',
    brand: 'Vogue Utility',
    price: 89.99,
    image: '/images/clothing/cargo.png',
    thumbnailColor: '#556B2F',
    description: 'Functional cargo pants',
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: [
      { name: 'Olive', hex: '#556B2F' },
      { name: 'Black', hex: '#000000' },
      { name: 'Khaki', hex: '#D2B48C' },
      { name: 'Grey', hex: '#808080' }
    ]
  },
  {
    id: 'sweatpants-001',
    name: 'Comfort Sweatpants',
    category: 'bottoms',
    brand: 'Vogue Lounge',
    price: 65.99,
    image: '/images/clothing/sweatpants.png',
    thumbnailColor: '#696969',
    description: 'Ultra-soft sweatpants',
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Grey', hex: '#696969' },
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' }
    ]
  },

  // ========== DRESSES (4 items) ==========
  {
    id: 'dress-001',
    name: 'Summer Maxi Dress',
    category: 'dresses',
    brand: 'Vogue Summer',
    price: 149.99,
    image: '/images/clothing/maxi-dress.png',
    thumbnailColor: '#FF6B9D',
    description: 'Flowing summer maxi dress',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Coral', hex: '#FF6B9D' },
      { name: 'Sky Blue', hex: '#87CEEB' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Mint', hex: '#98FF98' }
    ]
  },
  {
    id: 'dress-002',
    name: 'Cocktail Dress',
    category: 'dresses',
    brand: 'Vogue Evening',
    price: 249.99,
    image: '/images/clothing/cocktail-dress.png',
    thumbnailColor: '#000000',
    description: 'Elegant cocktail dress',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Emerald', hex: '#50C878' }
    ]
  },
  {
    id: 'dress-003',
    name: 'Casual Sundress',
    category: 'dresses',
    brand: 'Vogue Casual',
    price: 89.99,
    image: '/images/clothing/sundress.png',
    thumbnailColor: '#FFD700',
    description: 'Light and breezy sundress',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Yellow', hex: '#FFD700' },
      { name: 'Coral', hex: '#FF7F50' },
      { name: 'Lavender', hex: '#E6E6FA' },
      { name: 'White', hex: '#FFFFFF' }
    ]
  },
  {
    id: 'dress-004',
    name: 'Shirt Dress',
    category: 'dresses',
    brand: 'Vogue Chic',
    price: 129.99,
    image: '/images/clothing/shirt-dress.png',
    thumbnailColor: '#4682B4',
    description: 'Classic shirt dress style',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Denim Blue', hex: '#4682B4' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Black', hex: '#000000' },
      { name: 'Olive', hex: '#556B2F' }
    ]
  },

  // ========== ACCESSORIES (3 items) ==========
  {
    id: 'scarf-001',
    name: 'Silk Scarf',
    category: 'accessories',
    brand: 'Vogue Luxury',
    price: 79.99,
    image: '/images/clothing/scarf.png',
    thumbnailColor: '#8B4513',
    description: 'Elegant silk scarf',
    sizes: ['One Size'],
    colors: [
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Navy', hex: '#000080' },
      { name: 'Camel', hex: '#C19A6B' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  {
    id: 'belt-001',
    name: 'Leather Belt',
    category: 'accessories',
    brand: 'Vogue Essentials',
    price: 59.99,
    image: '/images/clothing/belt.png',
    thumbnailColor: '#654321',
    description: 'Premium leather belt',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Brown', hex: '#654321' },
      { name: 'Black', hex: '#000000' },
      { name: 'Tan', hex: '#D2B48C' }
    ]
  },
  {
    id: 'tie-001',
    name: 'Silk Tie',
    category: 'accessories',
    brand: 'Vogue Professional',
    price: 45.99,
    image: '/images/clothing/tie.png',
    thumbnailColor: '#191970',
    description: 'Classic silk tie',
    sizes: ['One Size'],
    colors: [
      { name: 'Navy', hex: '#191970' },
      { name: 'Burgundy', hex: '#800020' },
      { name: 'Black', hex: '#000000' },
      { name: 'Grey', hex: '#808080' }
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
  const clothingMeshesRef = useRef<THREE.Mesh[]>([]);
  const controlsRef = useRef<OrbitControls | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const mountedRef = useRef<boolean>(false);
  const autoRotateRef = useRef<boolean>(false);
  const originalMaterialsRef = useRef<Map<string, THREE.Material | THREE.Material[]>>(new Map());

  // 🔥 Step 9 additions
  const [scale, setScale] = useState(1);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [autoRotate, setAutoRotate] = useState(false);
  const [showClothing, setShowClothing] = useState(false);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (!avatarUrl) {
      router.push('/avatar');
    }
  }, [avatarUrl, router]);

  const storeOriginalMaterials = useCallback((avatar: THREE.Group) => {
    avatar.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Clone the material properly
        if (Array.isArray(child.material)) {
          const materials = child.material as THREE.Material[];
          originalMaterialsRef.current.set(child.uuid, materials.map(m => m.clone()));
        } else {
          originalMaterialsRef.current.set(child.uuid, (child.material as THREE.Material).clone());
        }
        console.log(`💾 Stored original material for: ${child.name}`);
      }
    });
  }, []);

  // FORCE COLOR - Remove textures and apply pure color!
  const applyClothingToAvatar = useCallback((item: ClothingItem, color: string) => {
    if (!avatarRef.current) {
      console.warn('⚠️ Avatar not loaded yet');
      return;
    }

    console.log('🎨 FORCING color:', item.name, 'Color:', color);
    let materialApplied = false;

    avatarRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const meshName = child.name;
        let shouldApplyMaterial = false;

        switch (item.category) {
          case 'tops':
          case 'outerwear':
            shouldApplyMaterial = meshName === 'Wolf3D_Outfit_Top';
            break;

          case 'bottoms':
            shouldApplyMaterial = meshName === 'Wolf3D_Outfit_Bottom';
            break;

          case 'dresses':
            shouldApplyMaterial =
              meshName === 'Wolf3D_Outfit_Top' ||
              meshName === 'Wolf3D_Outfit_Bottom';
            break;
        }

        if (shouldApplyMaterial) {
          materialApplied = true;

          // Track clothing mesh for fit adjustments
          clothingMeshesRef.current.push(child);

          const newMaterial = new THREE.MeshStandardMaterial({
            color: new THREE.Color(color),
            roughness: 0.8,
            metalness: 0.1,
            side: THREE.FrontSide,
            map: null,
          });

          if (!Array.isArray(child.material)) {
            child.material.dispose();
          }

          child.material = newMaterial;
          child.material.needsUpdate = true;
        }

      }
    });

    if (!materialApplied) {
      console.warn(`❌ No matching mesh found for category: ${item.category}`);
    } else {
      setShowClothing(true);
    }
  }, []);

  const restoreOriginalMaterials = useCallback(() => {
    if (!avatarRef.current) return;

    avatarRef.current.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const originalMaterial = originalMaterialsRef.current.get(child.uuid);
        if (originalMaterial) {
          // Dispose current material
          if (Array.isArray(child.material)) {
            const materials = child.material as THREE.Material[];
            materials.forEach(m => m.dispose());
          } else {
            (child.material as THREE.Material).dispose();
          }

          // Restore original (clone it again to avoid reference issues)
          if (Array.isArray(originalMaterial)) {
            const origMaterials = originalMaterial as THREE.Material[];
            child.material = origMaterials.map(m => m.clone());
          } else {
            child.material = (originalMaterial as THREE.Material).clone();
          }

          child.material.needsUpdate = true;
          console.log(`🔄 Restored original material for: ${child.name}`);
        }
      }
    });

    setShowClothing(false);
  }, []);
  useEffect(() => {
    clothingMeshesRef.current.forEach((mesh) => {
      mesh.scale.set(scale, scale, scale);
      mesh.position.set(offsetX, offsetY, mesh.position.z);
    });
  }, [scale, offsetX, offsetY]);

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

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x1a0b15);
    (renderer as any).outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 0.7);
    hemiLight.position.set(0, 3, 0);
    scene.add(hemiLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.6);
    mainLight.position.set(3, 5, 5);
    scene.add(mainLight);

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

        console.log('✅ Avatar loaded successfully');

        const avatar = gltf.scene;
        storeOriginalMaterials(avatar);

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

      originalMaterialsRef.current.forEach((material) => {
        if (Array.isArray(material)) {
          const materials = material as THREE.Material[];
          materials.forEach(m => m.dispose());
        } else {
          (material as THREE.Material).dispose();
        }
      });
      originalMaterialsRef.current.clear();

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
  }, [avatarUrl, router, storeOriginalMaterials]);

  const handleSelectItem = useCallback((item: ClothingItem) => {
    setSelectedItem(item);
    setSelectedColor(item.colors[0].hex);
    setSelectedSize(item.sizes[0]);
    applyClothingToAvatar(item, item.colors[0].hex);
  }, [applyClothingToAvatar]);

  const handleColorChange = useCallback((color: string) => {
    setSelectedColor(color);
    if (selectedItem) {
      applyClothingToAvatar(selectedItem, color);
    }
  }, [selectedItem, applyClothingToAvatar]);

  const handleRemoveClothing = useCallback(() => {
    restoreOriginalMaterials();
    clothingMeshesRef.current = [];

    setSelectedItem(null);
    setSelectedColor('');
    setSelectedSize('');
  }, [restoreOriginalMaterials]);

  const handleAddToCart = useCallback(() => {
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
  }, [selectedItem, selectedColor, selectedSize, avatarUrl]);

  const handleCapturePhoto = useCallback(() => {
    if (!rendererRef.current) return;
    const dataURL = rendererRef.current.domElement.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `vogue-tryon-${Date.now()}.png`;
    link.href = dataURL;
    link.click();
  }, []);

  const filteredCatalog = useMemo(() =>
    selectedCategory === 'all'
      ? CLOTHING_CATALOG
      : CLOTHING_CATALOG.filter(item => item.category === selectedCategory),
    [selectedCategory]
  );

  const recommendations = useMemo(() => {
    if (!selectedItem) return [];
    return getRecommendationsForItem(selectedItem.id, 4);
  }, [selectedItem]);


  const categories = [
    { id: 'all', label: 'All', icon: '👗' },
    { id: 'tops', label: 'Tops', icon: '👕' },
    { id: 'outerwear', label: 'Jackets', icon: '🧥' },
    { id: 'bottoms', label: 'Bottoms', icon: '👖' },
    { id: 'dresses', label: 'Dresses', icon: '👗' },
    { id: 'accessories', label: 'Accessories', icon: '👔' }
  ];
  if (!avatarUrl) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Virtual Try-On Studio
          </h1>
          <p className="text-gray-300">
            Browse {CLOTHING_CATALOG.length} clothing items - Pure color mode
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
                    <p className="text-white">Loading your avatar...</p>
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
                className={`px-4 py-2 rounded-lg font-medium transition-all ${autoRotate
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
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="text-white font-bold text-lg">{selectedItem.name}</h3>
                    <p className="text-purple-300 text-sm">{selectedItem.brand}</p>
                  </div>
                  <p className="text-white font-bold text-xl">${selectedItem.price.toFixed(2)}</p>
                </div>
                <p className="text-gray-300 text-sm mb-3">{selectedItem.description}</p>

                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-300 mb-2 font-semibold">
                      Color: {selectedItem.colors.find(c => c.hex === selectedColor)?.name}
                    </label>
                    <div className="flex gap-2 flex-wrap">
                      {selectedItem.colors.map((color) => (
                        <button
                          key={color.hex}
                          onClick={() => handleColorChange(color.hex)}
                          className={`w-10 h-10 rounded-lg border-2 transition-all ${selectedColor === color.hex
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
                          className={`px-4 py-2 rounded-lg font-medium transition-all ${selectedSize === size
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
            <h2 className="text-2xl font-bold text-white mb-4">
              Clothing Catalog
              <span className="text-sm font-normal text-gray-300 ml-2">
                ({filteredCatalog.length} items)
              </span>
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-4">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${selectedCategory === cat.id
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
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedItem?.id === item.id
                      ? 'bg-white/20 border-white shadow-lg'
                      : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/40'
                    }`}
                >
                  <div className="flex gap-3">
                    <div
                      className="w-16 h-16 rounded-lg flex-shrink-0 border border-white/20"
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