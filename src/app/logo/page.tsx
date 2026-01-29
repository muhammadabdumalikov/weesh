'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

export default function LogoExportPage() {
  const [svgUrl, setSvgUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function buildSvg() {
      try {
        const fontRes = await fetch('/fonts/MoreSugar.ttf');
        if (!fontRes.ok) throw new Error('Font not found');
        const fontBlob = await fontRes.blob();
        const fontBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1] ?? '');
          };
          reader.onerror = reject;
          reader.readAsDataURL(fontBlob);
        });

        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200">
  <defs>
    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="#E6007A"/>
      <stop offset="100%" stop-color="#FF6600"/>
    </linearGradient>
    <style>
      @font-face {
        font-family: 'MoreSugar';
        src: url(data:application/x-font-ttf;base64,${fontBase64}) format('truetype');
        font-weight: normal;
        font-style: normal;
      }
    </style>
  </defs>
  <text x="24" y="134" font-family="MoreSugar" font-size="120" fill="url(#logoGradient)" letter-spacing="-0.1em">weesh</text>
</svg>`;

        if (cancelled) return;
        const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        setSvgUrl(url);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Failed to build SVG');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    buildSvg();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    return () => {
      if (svgUrl) URL.revokeObjectURL(svgUrl);
    };
  }, [svgUrl]);

  const handleDownloadSvg = useCallback(() => {
    if (!svgUrl) return;
    const a = document.createElement('a');
    a.href = svgUrl;
    a.download = 'weesh-logo.svg';
    a.click();
  }, [svgUrl]);

  return (
    <div className="min-h-screen bg-[#f7f7f7] p-8 flex flex-col items-center gap-8">
      <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
        ← Back
      </Link>

      <h1 className="text-xl text-gray-800">Logo export (SVG)</h1>

      {error && (
        <p className="text-red-600 text-sm max-w-md text-center">{error}</p>
      )}

      {/* Preview - SVG scales to any size without quality loss */}
      <div className="bg-white p-6 rounded-2xl shadow-sm">
        {svgUrl && (
          <img
            src={svgUrl}
            alt="weesh logo"
            className="max-w-full h-auto block"
            style={{ width: 400, height: 'auto' }}
          />
        )}
      </div>

      {svgUrl && (
        <button
          onClick={handleDownloadSvg}
          className="px-6 py-3 bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-xl hover:opacity-90 transition-opacity"
        >
          Download SVG
        </button>
      )}

      {loading && !error && (
        <p className="text-gray-500 text-sm">Preparing SVG…</p>
      )}
    </div>
  );
}
