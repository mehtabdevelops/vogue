'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AvatarViewer, { AvatarTheme } from '../components/AvatarViewer';
import { useAvatar } from '../context/AvatarContext';

type Outfit = {
  id: AvatarTheme;
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
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit>(OUTFITS[0]);

  if (!avatarUrl) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center py-12 px-4">
        <div className="max-w-md w-full bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 text-center">
          <h1 className="text-2xl font-bold text-white mb-3">No avatar yet</h1>
          <p className="text-gray-300 text-sm mb-6">
            Create your 3D avatar first, then come back here to try on outfits.
          </p>
          <Link
            href="/avatar"
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-white text-[#54162b] font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all text-sm"
          >
            Go to Avatar Creator
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center py-12 px-4">
      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-[2fr,1fr] gap-8 items-stretch">
        {/* LEFT: Avatar + selected outfit info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                Try On Outfits
              </h1>
              <p className="text-gray-300 text-sm">
                See your Vogue avatar in different vibes and styles.
              </p>
            </div>
            <Link
              href="/avatar"
              className="text-xs text-gray-300 hover:text-white underline"
            >
              Edit Avatar
            </Link>
          </div>

          <div className="w-full h-[420px] md:h-[480px] bg-black/40 rounded-xl border border-white/15 overflow-hidden shadow-xl">
            <AvatarViewer
              modelUrl={avatarUrl}
              theme={selectedOutfit.id}
            />
          </div>

          <div className="mt-4 text-xs text-gray-300">
            <p className="mb-1">
              <span className="font-semibold">Selected outfit:</span>{' '}
              {selectedOutfit.name} — {selectedOutfit.style}
            </p>
            <p className="text-gray-300">{selectedOutfit.description}</p>
            <div className="flex flex-wrap gap-1 mt-2">
              {selectedOutfit.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Outfit Library */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-7 border border-white/20 flex flex-col">
          <h2 className="text-2xl font-bold text-white mb-2">Outfit Library</h2>
          <p className="text-gray-300 text-sm mb-4">
            Choose an outfit to change the scene mood around your avatar.
            Later, this will map to actual 3D clothing in Vogue&apos;s AR view.
          </p>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1 custom-scrollbar">
            {OUTFITS.map((outfit) => (
              <button
                key={outfit.id}
                type="button"
                onClick={() => setSelectedOutfit(outfit)}
                className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                  selectedOutfit.id === outfit.id
                    ? 'bg-[#a020f0] text-white border-[#c56cff]'
                    : 'bg-black/40 hover:bg-black/60 text-gray-100 border-white/10'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-semibold">{outfit.name}</span>
                  <span className="text-[10px] uppercase tracking-wide text-gray-200">
                    {outfit.style}
                  </span>
                </div>
                <p className="text-xs text-gray-200 mt-1">
                  {outfit.description}
                </p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {outfit.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-100"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/15 text-[11px] text-gray-300">
            <p className="font-semibold mb-1">What&apos;s next for Vogue:</p>
            <p className="text-gray-300">
              Each outfit here will later connect to a clothing preset or mesh,
              so your avatar actually changes clothes in 3D, not just the scene mood.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TryOnPage;
