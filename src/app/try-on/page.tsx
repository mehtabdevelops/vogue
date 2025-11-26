'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AvatarViewer from '../components/AvatarViewer';
import { useAvatar } from '../context/AvatarContext';

type Outfit = {
  id: 'street' | 'formal' | 'summer' | 'sport';
  name: string;
  style: string;
  description: string;
  tags: string[];
};

const OUTFITS: Outfit[] = [
  {
    id: 'street',
    name: 'Streetwear Set',
    style: 'Casual / Urban',
    description: 'Oversized hoodie, tapered cargos, and chunky sneakers.',
    tags: ['oversized', 'casual', 'hoodie'],
  },
  {
    id: 'formal',
    name: 'Formal Night',
    style: 'Elegant',
    description: 'Slim-fit blazer, tailored pants, and loafers.',
    tags: ['slim', 'formal', 'blazer'],
  },
  {
    id: 'summer',
    name: 'Summer Chill',
    style: 'Light / Breezy',
    description: 'Relaxed shirt, shorts, and slip-ons.',
    tags: ['relaxed', 'summer'],
  },
  {
    id: 'sport',
    name: 'Performance Fit',
    style: 'Athleisure',
    description: 'Moisture-wicking tee with stretch joggers.',
    tags: ['sport', 'gym'],
  },
];

const TryOnPage = () => {
  const { avatarUrl } = useAvatar();
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(OUTFITS[0]);

  if (!avatarUrl) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 gap-4">
        <h1 className="text-2xl font-bold mb-2">No avatar yet</h1>
        <p className="text-gray-300 text-sm mb-4 text-center max-w-md">
          Create your 3D avatar first, then come back here to try outfits.
        </p>
        <Link
          href="/avatar"
          className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-700 text-sm"
        >
          Go to Avatar Creator
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col lg:flex-row p-6 gap-6">
      {/* Left: 3D avatar */}
      <div className="flex-1 flex flex-col items-center">
        <div className="w-full flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Try On Outfits</h1>
          <Link
            href="/avatar"
            className="text-xs text-gray-300 hover:text-white underline"
          >
            Edit Avatar
          </Link>
        </div>

        <div className="w-full max-w-xl h-[500px] bg-white/5 rounded-2xl border border-white/10 overflow-hidden shadow-xl">
          <AvatarViewer
            modelUrl={avatarUrl}
            theme={selectedOutfit?.id ?? 'street'}
          />
        </div>

        {selectedOutfit && (
          <div className="mt-3 text-xs text-gray-300 w-full max-w-xl">
            <p className="mb-1">
              <span className="font-semibold">Selected outfit:</span>{' '}
              {selectedOutfit.name} — {selectedOutfit.style}
            </p>
            <p className="text-gray-400">{selectedOutfit.description}</p>
          </div>
        )}
      </div>

      {/* Right: Outfit picker */}
      <div className="w-full lg:w-80 bg-white/5 rounded-2xl border border-white/10 p-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold mb-1">Outfit Library</h2>
        <p className="text-xs text-gray-400 mb-2">
          Choose an outfit to preview how it would feel on your avatar. Right now
          this changes the scene theme; later this will drive real 3D clothing.
        </p>

        <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
          {OUTFITS.map(outfit => (
            <button
              key={outfit.id}
              type="button"
              onClick={() => setSelectedOutfit(outfit)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                selectedOutfit?.id === outfit.id
                  ? 'bg-purple-600 text-white'
                  : 'bg-white/10 hover:bg-white/20 text-gray-100'
              }`}
            >
              <div className="flex justify-between items-center">
                <span className="font-semibold">{outfit.name}</span>
                <span className="text-[10px] uppercase tracking-wide text-gray-200">
                  {outfit.style}
                </span>
              </div>
              <p className="text-xs text-gray-200 mt-1">{outfit.description}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {outfit.tags.map(tag => (
                  <span
                    key={tag}
                    className="text-[10px] px-2 py-0.5 rounded-full bg-black/40 text-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {selectedOutfit && (
          <div className="mt-3 pt-3 border-t border-white/10 text-xs text-gray-300">
            <p className="mb-1 font-semibold">What will change later:</p>
            <p className="text-gray-400">
              This selection will map to a specific clothing rig / GLB attached to your
              Ready Player Me avatar so the outfit actually changes in 3D.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TryOnPage;
