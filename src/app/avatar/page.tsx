'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAvatar } from '../context/AvatarContext';

const RPM_SUBDOMAIN = 'vogue-4sveh7';
const RPM_ORIGIN = `https://${RPM_SUBDOMAIN}.readyplayer.me`;
const RPM_FRAME_URL = `${RPM_ORIGIN}/avatar?frameApi`;

function parseRpmMessage(event: MessageEvent<any>): any | null {
  let data: any = event.data;
  if (!data) return null;

  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return null;
    }
  }
  return data;
}

export default function AvatarPageImproved() {
  const router = useRouter();
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [localAvatarUrl, setLocalAvatarUrl] = useState<string | null>(null);
  const [manualUrl, setManualUrl] = useState('');
  const [status, setStatus] = useState<string>('Loading Ready Player Me...');
  const { setAvatarUrl, avatarUrl: contextAvatarUrl } = useAvatar();
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  // Load existing avatar URL on mount
  useEffect(() => {
    const storedUrl = localStorage.getItem('vogue_avatar_url');
    console.log('🔍 Checking for existing avatar URL:', storedUrl);
    
    if (storedUrl) {
      setLocalAvatarUrl(storedUrl);
      setManualUrl(storedUrl);
      setStatus('Avatar already created! You can edit it or create a new one.');
      console.log('✅ Avatar URL loaded from storage');
    } else {
      console.log('ℹ️ No existing avatar URL found');
    }
  }, []);

  useEffect(() => {
    function handleMessage(event: MessageEvent<any>) {
      if (!event.origin.endsWith('.readyplayer.me')) return;

      const json = parseRpmMessage(event);
      if (!json || json.source !== 'readyplayerme') return;

      console.log('📨 RPM Message:', json.eventName, json);

      if (json.eventName === 'v1.frame.ready') {
        setStatus('✅ Ready Player Me loaded — customize your avatar.');
        console.log('✅ RPM iframe ready');

        iframeRef.current?.contentWindow?.postMessage(
          JSON.stringify({
            target: 'readyplayerme',
            type: 'subscribe',
            eventName: 'v1.**',
          }),
          '*'
        );
      }

      if (json.eventName === 'v1.avatar.exported') {
        const url = json.data?.url as string | undefined;
        console.log('🎉 Avatar exported! URL:', url);
        
        if (url) {
          saveAvatarUrl(url);
        } else {
          setStatus('⚠️ Avatar exported but no URL found. Please copy manually.');
          setSaveStatus('error');
        }
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [setAvatarUrl]);

  const saveAvatarUrl = (url: string) => {
    try {
      setSaveStatus('saving');
      setStatus('💾 Saving avatar URL...');
      console.log('💾 Saving avatar URL:', url);

      // Save to state
      setLocalAvatarUrl(url);
      setManualUrl(url);

      // Save to localStorage
      localStorage.setItem('vogue_avatar_url', url);
      console.log('✅ Saved to localStorage');

      // Save to context
      setAvatarUrl(url);
      console.log('✅ Saved to context');

      // Verify save
      const verified = localStorage.getItem('vogue_avatar_url');
      if (verified === url) {
        setStatus('✅ Avatar saved successfully! Ready for try-on.');
        setSaveStatus('saved');
        console.log('✅ Save verified!');
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('❌ Error saving avatar:', error);
      setStatus('❌ Error saving avatar. Please try manual save.');
      setSaveStatus('error');
    }
  };

  const handleCopyUrl = async () => {
    if (!localAvatarUrl) return;
    try {
      await navigator.clipboard.writeText(localAvatarUrl);
      setStatus('✅ URL copied to clipboard!');
    } catch {
      setStatus('❌ Copy failed. Try manually selecting and copying.');
    }
  };

  const handleUseManualUrl = () => {
    const trimmed = manualUrl.trim();
    console.log('📝 Manual URL input:', trimmed);

    if (!trimmed) {
      alert('Please paste a URL first');
      return;
    }

    if (!trimmed.startsWith('http')) {
      alert('Invalid URL. Must start with http:// or https://');
      return;
    }

    if (!trimmed.includes('.glb')) {
      alert('URL should be a .glb file from Ready Player Me');
      return;
    }

    saveAvatarUrl(trimmed);
  };

  const handleTestUrl = () => {
    if (!localAvatarUrl) {
      alert('No avatar URL to test');
      return;
    }

    console.log('🧪 Testing URL:', localAvatarUrl);
    window.open(localAvatarUrl, '_blank');
  };

  const handleVerify = () => {
    const stored = localStorage.getItem('vogue_avatar_url');
    const context = contextAvatarUrl;

    console.log('🔍 Verification:');
    console.log('  localStorage:', stored);
    console.log('  context:', context);
    console.log('  local state:', localAvatarUrl);

    if (stored && stored === context && stored === localAvatarUrl) {
      alert('✅ Avatar is properly saved everywhere!');
      setStatus('✅ Verified! Avatar is ready.');
    } else {
      alert(`⚠️ Sync issue detected:\nlocalStorage: ${stored ? 'Yes' : 'No'}\nContext: ${context ? 'Yes' : 'No'}\nMatch: ${stored === context ? 'Yes' : 'No'}`);
      setStatus('⚠️ Sync issue. Try refreshing or manual save.');
    }
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
              Your digital identity for virtual try-ons
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

          <div className="text-xs text-gray-300 bg-blue-500/20 border border-blue-500/50 rounded-lg p-3">
            <p className="font-semibold text-blue-300 mb-1">💡 How to save your avatar:</p>
            <ul className="space-y-1 ml-4 list-disc">
              <li>Customize avatar in Ready Player Me</li>
              <li>It will auto-save when you're done</li>
              <li>OR copy the GLB link and paste on the right →</li>
              <li>Click "Use This URL" to save manually</li>
            </ul>
          </div>
        </div>

        {/* RIGHT: Status, URL, controls */}
        <div className="bg-black/40 rounded-2xl border border-white/15 p-5 flex flex-col gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">
              Avatar Status
            </h2>
            <p className="text-gray-300 text-sm">
              Save your avatar to use in try-on
            </p>
          </div>

          {/* Status Message */}
          <div className={`p-4 rounded-xl border-2 ${
            saveStatus === 'saved' 
              ? 'bg-green-500/20 border-green-500'
              : saveStatus === 'error'
              ? 'bg-red-500/20 border-red-500'
              : saveStatus === 'saving'
              ? 'bg-yellow-500/20 border-yellow-500'
              : 'bg-white/10 border-white/20'
          }`}>
            <p className="text-sm text-white">
              {status}
            </p>
          </div>

          {/* Manual URL Input */}
          <div className="space-y-2">
            <label className="text-xs text-gray-300 font-semibold">
              Avatar URL (paste from Ready Player Me):
            </label>
            <textarea
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/30 font-mono resize-none"
              placeholder="https://models.readyplayer.me/....glb"
              rows={3}
            />
            
            <button
              type="button"
              onClick={handleUseManualUrl}
              disabled={!manualUrl.trim()}
              className="w-full px-4 py-3 rounded-lg bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-sm font-bold text-white transition-all"
            >
              💾 Use This URL
            </button>
          </div>

          {/* Action Buttons */}
          {localAvatarUrl && (
            <div className="space-y-2 pt-3 border-t border-white/10">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={handleCopyUrl}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  📋 Copy
                </button>

                <button
                  onClick={handleTestUrl}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white"
                >
                  🧪 Test
                </button>

                <button
                  onClick={handleVerify}
                  className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-white col-span-2"
                >
                  🔍 Verify Save
                </button>
              </div>

              <div className="text-[10px] text-gray-400 break-all bg-black/40 rounded-lg px-3 py-2 border border-white/10 max-h-20 overflow-y-auto">
                <span className="font-semibold text-white">Saved:</span>{' '}
                {localAvatarUrl}
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="space-y-3 pt-3 border-t border-white/10">
            {localAvatarUrl ? (
              <>
                <Link
                  href="/try-on"
                  className="block w-full px-6 py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-center font-bold text-white transform hover:scale-105 transition-all shadow-lg text-lg"
                >
                  <span className="text-2xl mr-2">👗</span>
                  Try On Outfits Now!
                </Link>

                <Link
                  href="/diagnostic"
                  className="block text-center text-xs text-gray-300 hover:text-white underline"
                >
                  🔍 Run Diagnostic Check
                </Link>
              </>
            ) : (
              <div className="text-center">
                <p className="text-sm text-gray-300 mb-2">
                  Create and save your avatar first
                </p>
                <Link
                  href="/diagnostic"
                  className="text-xs text-blue-300 hover:text-blue-200 underline"
                >
                  Having issues? Run diagnostic
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}