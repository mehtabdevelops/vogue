'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useAvatar } from '../context/AvatarContext';

// 👇 Only your subdomain, no https, no /avatar
const RPM_SUBDOMAIN = 'vogue-4sveh7';

const RPM_ORIGIN = `https://${RPM_SUBDOMAIN}.readyplayer.me`;
const RPM_FRAME_URL = `${RPM_ORIGIN}/avatar?frameApi`;

// Helper: parse message.data which might be a JSON string or an object
function parseRpmMessage(event: MessageEvent<any>): any | null {
  let data: any = event.data;
  if (!data) return null;

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      // not JSON, ignore
      return null;
    }
  }
  return data;
}

export default function AvatarPage() {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [status, setStatus] = useState<string>('Loading Ready Player Me...');
  const { setAvatarUrl } = useAvatar();

  useEffect(() => {
    function handleMessage(event: MessageEvent<any>) {
      // Only messages coming from Ready Player Me
      if (!event.origin.endsWith('.readyplayer.me')) return;

      const json = parseRpmMessage(event);
      if (!json) return;

      // RPM uses source: 'readyplayerme'
      if (json.source !== 'readyplayerme') return;

      // When iframe is ready, subscribe to all events
      if (json.eventName === 'v1.frame.ready') {
        setStatus('Ready Player Me loaded — customize your avatar.');

        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**', // subscribe to all events
          }),
          '*'
        );
      }

      // When avatar is exported, we get url in json.data.url
      if (json.eventName === 'v1.avatar.exported') {
        const url = json.data?.url as string | undefined;
        if (url) {
          setLocalAvatarUrl(url);
          setManualUrl(url);
          setAvatarUrl(url); // save globally
          setStatus('Avatar exported! You can continue to try outfits.');
        } else {
          setStatus('Avatar exported but no URL found in payload.');
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAvatarUrl]);

  const handleCopyUrl = async () => {
    if (!localAvatarUrl) return;
    try {
      await navigator.clipboard.writeText(localAvatarUrl);
      setStatus('Copied to clipboard! ✅');
    } catch {
      setStatus('Copy failed. Try manually.');
    }
  };

  // Fallback: user pastes the URL from the RPM “Copy” box
  const handleUseManualUrl = () => {
    const trimmed = manualUrl.trim();
    if (!trimmed.startsWith('http')) {
      alert('Please paste a valid URL (should start with http)');
      return;
    }
    setLocalAvatarUrl(trimmed);
    setAvatarUrl(trimmed);
    setStatus('Avatar URL set from pasted link. You can continue to try outfits.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] flex items-center justify-center py-12 px-4">
      <div className="max-w-5xl w-full bg-white/10 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-white/20 grid grid-cols-1 lg:grid-cols-[3fr,2fr] gap-8">
        {/* LEFT: Title + iframe */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Create Your 3D Avatar
            </h1>
            <p className="text-gray-300 text-sm md:text-base">
              This is your digital identity in Vogue. Customize your Ready Player Me
              avatar — we&apos;ll use it for virtual try-ons and AR looks.
            </p>
          </div>

          <div className="w-full aspect-[16/9] rounded-xl overflow-hidden border border-white/15 shadow-xl bg-black/40">
            <iframe
              ref={iframeRef}
              src={RPM_FRAME_URL}
              allow="camera *; microphone *; clipboard-read; clipboard-write"
              style={{ width: '100%', height: '100%', border: 'none' }}
            />
          </div>

          <p className="text-xs text-gray-300">
            Use the controls inside Ready Player Me. When you&apos;re done, either
            let it export automatically or copy the avatar link into the field on the
            right.
          </p>
        </div>

        {/* RIGHT: Status, URL, continue */}
        <div className="bg-black/40 rounded-2xl border border-white/15 p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Avatar Export
            </h2>
            <p className="text-gray-300 text-sm">
              We store the 3D model link so your avatar can appear on the try-on screen.
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-300">
              Status:{' '}
              <span className="text-white font-medium">
                {status}
              </span>
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-xs text-gray-300">
              Avatar URL (auto-filled when export event fires, or paste from the
              Ready Player Me &quot;Copy&quot; field):
            </label>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                value={manualUrl}
                onChange={(e) => setManualUrl(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30"
                placeholder="https://models.readyplayer.me/....glb"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={handleUseManualUrl}
                className="px-4 py-2 rounded-lg bg-white text-[#54162b] text-xs font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all"
              >
                Use This URL
              </button>

              {localAvatarUrl && (
                <button
                  type="button"
                  onClick={handleCopyUrl}
                  className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-xs font-semibold"
                >
                  Copy URL
                </button>
              )}
            </div>
          </div>

          <div className="mt-2 pt-3 border-t border-white/10 flex flex-col gap-3">
            {localAvatarUrl ? (
              <>
                <div className="text-[11px] text-gray-300 break-all bg-black/40 rounded-lg px-3 py-2 border border-white/10">
                  <span className="font-semibold text-white">Current avatar URL:</span>{' '}
                  {localAvatarUrl}
                </div>
                <div className="flex justify-end">
                  <Link
                    href="/try-on"
                    className="px-5 py-2.5 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white transform hover:scale-105 transition-all"
                  >
                    Continue to Try Outfits →
                  </Link>
                </div>
              </>
            ) : (
              <p className="text-[11px] text-gray-300">
                After export, the URL should appear above. If it doesn&apos;t, copy
                the link from Ready Player Me and paste it here, then click
                &quot;Use This URL&quot;.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
