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

      // console.log('RPM event:', json);

      // When iframe is ready, subscribe to all events
      if (json.eventName === 'v1.frame.ready') {
        setStatus('Ready Player Me loaded — customize your avatar.');

        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**',     // subscribe to all events
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
    <div className="min-h-screen bg-black text-white flex flex-col items-center p-6 gap-6">
      <h1 className="text-3xl font-bold mt-4 mb-2">Vogue – Create Your 3D Avatar</h1>

      <p className="text-gray-300 text-sm mb-2 text-center max-w-xl">
        Use the editor below to design your avatar. When you click “Done” inside
        Ready Player Me, we&apos;ll try to capture the 3D avatar URL automatically.
        If it doesn&apos;t appear, just paste the link from the box in the creator.
      </p>

      {/* Ready Player Me iframe */}
      <div className="w-full max-w-4xl aspect-[16/9] rounded-2xl overflow-hidden border border-white/10 shadow-xl">
        <iframe
          ref={iframeRef}
          src={RPM_FRAME_URL}
          allow="camera *; microphone *; clipboard-read; clipboard-write"
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>

      {/* Status + avatar URL + continue button */}
      <div className="w-full max-w-4xl mt-4 bg-white/5 rounded-xl p-4 flex flex-col gap-4">
        <p className="text-sm text-gray-300">
          Status: <span className="text-white">{status}</span>
        </p>

        {/* Auto / manual URL section */}
        <div className="space-y-2">
          <label className="text-xs text-gray-300">
            Avatar URL (auto-filled when export event fires, or paste from the Ready Player Me “Copy” field):
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 px-3 py-2 rounded bg-black/60 border border-white/20 text-xs text-white placeholder-gray-500"
              placeholder="https://models.readyplayer.me/....glb"
            />
            <button
              type="button"
              onClick={handleUseManualUrl}
              className="px-3 py-2 rounded bg-purple-600 hover:bg-purple-700 text-xs font-semibold"
            >
              Use This URL
            </button>
            {localAvatarUrl && (
              <button
                type="button"
                onClick={handleCopyUrl}
                className="px-3 py-2 rounded bg-blue-600 hover:bg-blue-700 text-xs"
              >
                Copy URL
              </button>
            )}
          </div>
        </div>

        {/* Continue button only once we have some URL */}
        {localAvatarUrl ? (
          <div className="flex justify-end">
            <Link
              href="/try-on"
              className="px-4 py-2 rounded bg-emerald-500 hover:bg-emerald-600 text-xs font-medium"
            >
              Continue to Try Outfits →
            </Link>
          </div>
        ) : (
          <p className="text-xs text-gray-400">
            After export, the URL should appear above. If it doesn&apos;t, copy the
            link from Ready Player Me and paste it into the field, then click
            &quot;Use This URL&quot;.
          </p>
        )}
      </div>
    </div>
  );
}
