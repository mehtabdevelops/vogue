'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAvatar } from '../context/AvatarContext';

export default function AvatarDiagnosticPage() {
  const { avatarUrl } = useAvatar();
  const [localStorageUrl, setLocalStorageUrl] = useState<string | null>(null);
  const [contextUrl, setContextUrl] = useState<string | null>(null);
  const [diagnostics, setDiagnostics] = useState<any>({});

  useEffect(() => {
    // Check localStorage directly
    const storedUrl = localStorage.getItem('vogue_avatar_url');
    setLocalStorageUrl(storedUrl);
    setContextUrl(avatarUrl);

    // Run diagnostics
    const diag: any = {
      localStorage: {
        exists: !!storedUrl,
        value: storedUrl || 'NOT SET',
        isValid: storedUrl?.startsWith('http') || false
      },
      context: {
        exists: !!avatarUrl,
        value: avatarUrl || 'NOT SET',
        isValid: avatarUrl?.startsWith('http') || false
      },
      matching: storedUrl === avatarUrl
    };

    // Check all possible storage keys
    const allKeys = Object.keys(localStorage);
    const avatarKeys = allKeys.filter(key => 
      key.toLowerCase().includes('avatar') || 
      key.toLowerCase().includes('rpm') ||
      key.toLowerCase().includes('ready')
    );

    diag.allAvatarKeys = avatarKeys.map(key => ({
      key,
      value: localStorage.getItem(key)
    }));

    setDiagnostics(diag);
  }, [avatarUrl]);

  const handleClearStorage = () => {
    if (confirm('Clear all avatar data? You will need to create a new avatar.')) {
      localStorage.removeItem('vogue_avatar_url');
      window.location.reload();
    }
  };

  const handleSetTestUrl = () => {
    const testUrl = prompt('Paste your Ready Player Me avatar URL:');
    if (testUrl && testUrl.startsWith('http')) {
      localStorage.setItem('vogue_avatar_url', testUrl);
      window.location.reload();
    } else {
      alert('Invalid URL. Must start with http:// or https://');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b15] via-[#2d1123] to-[#54162b] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white mb-2">
            🔍 Avatar Diagnostic Tool
          </h1>
          <p className="text-gray-300 mb-8">
            This page helps identify why your avatar isn't loading
          </p>

          {/* Status Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className={`p-4 rounded-xl border-2 ${
              diagnostics.localStorage?.exists 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-red-500/20 border-red-500'
            }`}>
              <div className="text-2xl mb-2">
                {diagnostics.localStorage?.exists ? '✅' : '❌'}
              </div>
              <div className="text-white font-bold">localStorage</div>
              <div className="text-sm text-gray-300">
                {diagnostics.localStorage?.exists ? 'Has URL' : 'No URL found'}
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              diagnostics.context?.exists 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-red-500/20 border-red-500'
            }`}>
              <div className="text-2xl mb-2">
                {diagnostics.context?.exists ? '✅' : '❌'}
              </div>
              <div className="text-white font-bold">Context</div>
              <div className="text-sm text-gray-300">
                {diagnostics.context?.exists ? 'Has URL' : 'No URL found'}
              </div>
            </div>

            <div className={`p-4 rounded-xl border-2 ${
              diagnostics.matching 
                ? 'bg-green-500/20 border-green-500' 
                : 'bg-yellow-500/20 border-yellow-500'
            }`}>
              <div className="text-2xl mb-2">
                {diagnostics.matching ? '✅' : '⚠️'}
              </div>
              <div className="text-white font-bold">Sync</div>
              <div className="text-sm text-gray-300">
                {diagnostics.matching ? 'In sync' : 'Out of sync'}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="space-y-6">
            <div className="bg-black/40 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">
                📋 Stored Avatar URL (localStorage)
              </h2>
              {localStorageUrl ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-2xl flex-shrink-0">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">Key: vogue_avatar_url</p>
                      <p className="text-white text-sm break-all font-mono bg-black/40 p-2 rounded">
                        {localStorageUrl}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-3">
                    <a
                      href={localStorageUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
                    >
                      Test URL in New Tab
                    </a>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(localStorageUrl);
                        alert('URL copied!');
                      }}
                      className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-medium"
                    >
                      Copy URL
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-2xl flex-shrink-0">✗</span>
                  <div>
                    <p className="text-red-300 font-semibold">No URL stored in localStorage</p>
                    <p className="text-gray-400 text-sm mt-1">
                      This means the avatar was never saved, or storage was cleared.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="bg-black/40 rounded-xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4">
                🔄 Context Avatar URL
              </h2>
              {contextUrl ? (
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-green-400 text-2xl flex-shrink-0">✓</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-400 mb-1">From AvatarContext</p>
                      <p className="text-white text-sm break-all font-mono bg-black/40 p-2 rounded">
                        {contextUrl}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex items-start gap-2">
                  <span className="text-red-400 text-2xl flex-shrink-0">✗</span>
                  <div>
                    <p className="text-red-300 font-semibold">No URL in context</p>
                    <p className="text-gray-400 text-sm mt-1">
                      The AvatarContext doesn't have the URL. This might be a context issue.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* All Avatar Keys */}
            {diagnostics.allAvatarKeys && diagnostics.allAvatarKeys.length > 0 && (
              <div className="bg-black/40 rounded-xl p-6 border border-white/10">
                <h2 className="text-xl font-bold text-white mb-4">
                  🔑 All Avatar-Related Storage Keys
                </h2>
                <div className="space-y-2">
                  {diagnostics.allAvatarKeys.map((item: any, idx: number) => (
                    <div key={idx} className="bg-black/40 p-3 rounded">
                      <p className="text-xs text-gray-400">{item.key}</p>
                      <p className="text-white text-sm font-mono break-all mt-1">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Problem Detection */}
            <div className="bg-yellow-500/20 rounded-xl p-6 border-2 border-yellow-500">
              <h2 className="text-xl font-bold text-yellow-300 mb-4">
                🔍 Problem Detection
              </h2>
              <div className="space-y-3 text-sm">
                {!diagnostics.localStorage?.exists && (
                  <div className="flex items-start gap-2">
                    <span className="text-red-400">❌</span>
                    <div>
                      <p className="text-white font-semibold">No localStorage URL</p>
                      <p className="text-gray-300">
                        The avatar URL was never saved. You need to create an avatar at /avatar
                      </p>
                    </div>
                  </div>
                )}

                {!diagnostics.context?.exists && diagnostics.localStorage?.exists && (
                  <div className="flex items-start gap-2">
                    <span className="text-yellow-400">⚠️</span>
                    <div>
                      <p className="text-white font-semibold">Context not synced</p>
                      <p className="text-gray-300">
                        localStorage has URL but context doesn't. Try refreshing the page.
                      </p>
                    </div>
                  </div>
                )}

                {diagnostics.localStorage?.exists && !diagnostics.localStorage?.isValid && (
                  <div className="flex items-start gap-2">
                    <span className="text-red-400">❌</span>
                    <div>
                      <p className="text-white font-semibold">Invalid URL format</p>
                      <p className="text-gray-300">
                        The stored URL doesn't start with http/https. It's corrupted.
                      </p>
                    </div>
                  </div>
                )}

                {diagnostics.localStorage?.exists && 
                 diagnostics.context?.exists && 
                 diagnostics.localStorage?.isValid && 
                 diagnostics.context?.isValid && 
                 diagnostics.matching && (
                  <div className="flex items-start gap-2">
                    <span className="text-green-400">✅</span>
                    <div>
                      <p className="text-white font-semibold">Everything looks good!</p>
                      <p className="text-gray-300">
                        Avatar URL is stored and synced correctly. If try-on still doesn't work, 
                        the issue might be with the GLB file or network.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link
              href="/avatar"
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-center"
            >
              🧑 Create/Update Avatar
            </Link>

            <button
              onClick={handleSetTestUrl}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold"
            >
              📝 Manually Set URL
            </button>

            <Link
              href="/try-on"
              className={`px-6 py-3 rounded-xl font-bold text-center ${
                diagnostics.localStorage?.exists
                  ? 'bg-green-600 hover:bg-green-700 text-white'
                  : 'bg-gray-600 cursor-not-allowed text-gray-300'
              }`}
            >
              👗 Go to Try-On
            </Link>

            <button
              onClick={handleClearStorage}
              className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold"
            >
              🗑️ Clear Avatar Data
            </button>
          </div>

          {/* Quick Fixes */}
          <div className="mt-8 bg-blue-500/20 rounded-xl p-6 border border-blue-500">
            <h3 className="text-lg font-bold text-blue-300 mb-3">💡 Quick Fixes</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-blue-400">1.</span>
                <span>Go to /avatar and create a new avatar (or edit existing)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">2.</span>
                <span>Wait for "Avatar exported!" message to appear</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">3.</span>
                <span>If no message appears, manually copy the GLB URL and click "Use This URL"</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">4.</span>
                <span>Come back to this page to verify URL is saved</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400">5.</span>
                <span>If verified, go to /try-on and avatar should load</span>
              </li>
            </ul>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <Link
              href="/"
              className="text-gray-300 hover:text-white underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}