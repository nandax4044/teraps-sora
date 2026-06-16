/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import CaseOpeningGame from './components/CaseOpeningGame';
import keysData from './keys.json';
import {
  Gift,
  Maximize2,
  Minimize2,
} from 'lucide-react';

export const PngEmoji = ({ src, alt, className = "w-4 h-4 inline-block object-contain" }: { src: string; alt: string; className?: string }) => {
  const [hasError, setHasError] = useState(false);
  
  if (hasError) {
    return <span className="inline-block font-sans">{alt}</span>;
  }
  
  return (
    <img 
      src={src} 
      alt={alt} 
      className={`${className} align-middle inline-block`}
      onError={() => setHasError(true)} 
    />
  );
};

export default function App() {
  // --- Game Authorization Gate states ---
  const [isAuthorized, setIsAuthorized] = useState<boolean>(() => {
    return sessionStorage.getItem('authorized_key_passed') === 'true';
  });
  const [keyValue, setKeyValue] = useState<string>('');
  const [keyError, setKeyError] = useState<boolean>(false);

  const [isFullscreen, setIsFullscreen] = useState(false);

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = keyValue.trim();
    if (keysData.validKeys.includes(trimmed)) {
      setIsAuthorized(true);
      sessionStorage.setItem('authorized_key_passed', 'true');
      setKeyError(false);
    } else {
      setKeyError(true);
      setTimeout(() => setKeyError(false), 900);
    }
  };

  const toggleFullscreen = () => {
    const appEl = document.getElementById('outer-shell');
    if (!appEl) return;

    if (!document.fullscreenElement) {
      appEl.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        setIsFullscreen(!isFullscreen);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  // Fullscreen container check
  React.useEffect(() => {
    const onFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFsChange);
    return () => document.removeEventListener('fullscreenchange', onFsChange);
  }, []);

  if (!isAuthorized) {
    return (
      <div 
        className="min-h-screen text-white flex items-center justify-center font-sans p-6 select-none relative overflow-hidden"
        style={{
          background: "linear-gradient(rgba(31, 22, 150, 0.45), rgba(7, 6, 20, 0.7)), url('/background.png') center / cover no-repeat fixed"
        }}
      >
        {/* Ambient background glow orb */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full bg-sky-500/5 blur-[80px] pointer-events-none" />
        
        <form onSubmit={handleKeySubmit} className="flex flex-col items-center gap-5 z-10 bg-slate-900/80 border border-sky-400/30 p-8 rounded-2xl backdrop-blur-md shadow-2xl shadow-sky-900/20">
          <label className="text-sm font-semibold text-white tracking-wider font-mono">
            MASUKKAN KEY
          </label>
          <input
            type="password"
            value={keyValue}
            onChange={(e) => setKeyValue(e.target.value)}
            className={`w-64 bg-sky-950/40 border ${
              keyError ? 'border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.25)] animate-shake' : 'border-sky-400/30 focus:border-sky-400/60 focus:shadow-[0_0_15px_rgba(56,189,248,0.2)]'
            } rounded-xl py-3 px-4 font-mono text-center text-sm transition-all text-sky-300 placeholder-sky-800 outline-none`}
            placeholder="••••••••"
            autoFocus
          />
          <button
            type="submit"
            className="w-64 py-3 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-white font-black font-display text-sm rounded-xl tracking-wide transition-all shadow-lg shadow-sky-900/40 hover:shadow-sky-500/25 cursor-pointer active:scale-95"
          >
            ENTER
          </button>
        </form>
      </div>
    );
  }

  return (
    <div
      id="outer-shell"
      style={{ 
        fontFamily: "Nunito, sans-serif",
        background: isFullscreen 
          ? "linear-gradient(rgba(10, 10, 16, 0.45), rgba(10, 10, 16, 0.7)), url('/background.png') center / cover no-repeat fixed"
          : "linear-gradient(rgba(15, 15, 26, 0.35), rgba(15, 15, 26, 0.6)), url('/background.png') center / cover no-repeat fixed"
      }}
      className={`min-h-screen text-white selection:bg-sky-500 selection:text-white flex flex-col relative overflow-x-hidden ${
        isFullscreen ? 'p-6 justify-center' : ''
      }`}
    >
      {/* Dynamic Background visual blur orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] aspect-square rounded-full bg-sky-900/10 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] aspect-square rounded-full bg-sky-900/10 blur-[150px] pointer-events-none" />

      {/* TOP HEADER BRAND BAR */}
      {!isFullscreen && (
        <header className="glass-white py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-40 rounded-b-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
              <Gift className="w-5.5 h-5.5 text-sky-400 animate-pulse" />
            </div>
            <div>
              <h1 className="font-display font-black text-lg md:text-xl text-white">
                TeraPS Gacha
              </h1>
              <p className="text-[10px] text-white font-mono tracking-wider">
                
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Immersive widget toggle button */}
            <button
              onClick={toggleFullscreen}
              className="p-2 rounded-xl border bg-white/5 border-white/10 text-white hover:text-white hover:bg-white/10 transition-all cursor-pointer"
              title="Mode Fokus / Layar Penuh"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          </div>
        </header>
      )}

      {/* MAIN LAYOUT BODY */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        <div className="col-span-12 w-full animate-fade-in">
          <CaseOpeningGame />
        </div>
      </main>

      {/* FOOTER */}
      {!isFullscreen && (
        <footer className="glass-white py-4 text-center text-[10px] text-white font-mono mt-auto relative z-10 rounded-t-2xl">
          TeraPS Gacha &copy; 2026 &bull; dibuat oleh nanda, discord @kanandax_
        </footer>
      )}
    </div>
  );
}
