'use client';

import React from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body className="min-h-screen bg-[#05070B] text-white flex items-center justify-center p-4 font-sans">
        <div className="max-w-md w-full p-6 rounded-3xl bg-[#0E131F] border border-white/10 text-center space-y-4">
          <h2 className="text-lg font-black text-[#00FFA3]">MIVAJ SPORTS CRITICAL RECOVERY</h2>
          <p className="text-xs text-gray-400">A fatal client error was intercepted. Click below to reload the app shell.</p>
          {error?.message && (
            <p className="text-[10px] text-red-400 font-mono bg-black/60 p-2 rounded-xl border border-red-500/20 text-left overflow-x-auto whitespace-pre-wrap">
              {error.message}
            </p>
          )}
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-[#00FFA3] text-black font-black text-xs"
          >
            Reload Arena ➔
          </button>
        </div>
      </body>
    </html>
  );
}
