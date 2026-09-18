'use client';

import React, { useRef, useEffect } from 'react';
import { Eye, Activity } from 'lucide-react';
import { MatchData } from '../lib/sports-api';

export interface DigitalTwinPitchProps {
  match?: Partial<MatchData>;
}

export const DigitalTwinPitch: React.FC<DigitalTwinPitchProps> = ({ match }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const home = match?.homeTeam || 'Home';
  const away = match?.awayTeam || 'Away';

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const render = () => {
      t += 0.03;
      const width = canvas.width;
      const height = canvas.height;

      // Clear Canvas
      ctx.clearRect(0, 0, width, height);

      // Draw Pitch Background
      ctx.fillStyle = '#061a12';
      ctx.fillRect(0, 0, width, height);

      // Draw Pitch Lines
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1.5;

      // Outer boundary
      ctx.strokeRect(8, 8, width - 16, height - 16);

      // Center Line & Circle
      ctx.beginPath();
      ctx.moveTo(width / 2, 8);
      ctx.lineTo(width / 2, height - 8);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(width / 2, height / 2, 28, 0, Math.PI * 2);
      ctx.stroke();

      // Penalty Boxes
      ctx.strokeRect(8, height / 2 - 28, 38, 56);
      ctx.strokeRect(width - 46, height / 2 - 28, 38, 56);

      // Draw Attack Heatmap Vector
      const currentBallX = width * (0.55 + Math.sin(t) * 0.35);
      const currentBallY = height * (0.5 + Math.cos(t * 1.4) * 0.3);

      // Heatmap Glow
      const gradient = ctx.createRadialGradient(currentBallX, currentBallY, 2, currentBallX, currentBallY, 35);
      gradient.addColorStop(0, 'rgba(234, 179, 8, 0.6)');
      gradient.addColorStop(0.5, 'rgba(220, 38, 38, 0.25)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(currentBallX, currentBallY, 35, 0, Math.PI * 2);
      ctx.fill();

      // Ball Indicator
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#10b981';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.arc(currentBallX, currentBallY, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;

      // Attack Direction Line
      ctx.strokeStyle = 'rgba(234, 179, 8, 0.8)';
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      ctx.moveTo(currentBallX, currentBallY);
      ctx.lineTo(width - 12, height / 2 + Math.sin(t * 2) * 16);
      ctx.stroke();
      ctx.setLineDash([]);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="w-full rounded-2xl bg-neutral-950/90 border border-stadiumGreen/40 p-3 sm:p-4 font-mono text-xs shadow-xl space-y-2.5">
      <div className="flex items-center justify-between border-b border-white/10 pb-2">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-xl bg-stadiumGreen/20 text-stadiumGreen border border-stadiumGreen/40 animate-pulse">
            <Eye className="w-3.5 h-3.5" />
          </span>
          <div>
            <h4 className="font-black text-white text-xs flex items-center space-x-1.5">
              <span>2.5D DIGITAL TWIN: {home.toUpperCase()} ATTACK</span>
              <span className="px-1.5 py-0.2 rounded bg-gold text-black font-black text-[9px]">LIVE RADAR</span>
            </h4>
          </div>
        </div>

        <span className="text-[10px] text-stadiumGreen font-black">POISSON: +0.48 xG</span>
      </div>

      {/* Canvas Pitch */}
      <div className="relative rounded-xl overflow-hidden border border-stadiumGreen/30 shadow-inner">
        <canvas
          ref={canvasRef}
          width={500}
          height={160}
          className="w-full h-36 object-cover block"
        />
        
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 border border-white/10 text-[9px] font-black text-white flex items-center space-x-1">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-ping"></span>
          <span>FINAL THIRD ATTACK</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-1.5 text-center text-[9px]">
        <div className="p-1.5 rounded-lg bg-black/50 border border-white/5">
          <span className="text-gray-400 block font-sans">Territory</span>
          <span className="font-black text-stadiumGreen font-mono">68% Opp. Half</span>
        </div>
        <div className="p-1.5 rounded-lg bg-black/50 border border-white/5">
          <span className="text-gray-400 block font-sans">Box Pressure</span>
          <span className="font-black text-gold font-mono">14 Entries</span>
        </div>
        <div className="p-1.5 rounded-lg bg-black/50 border border-white/5">
          <span className="text-gray-400 block font-sans">Shot xG</span>
          <span className="font-black text-cyan-400 font-mono">0.18 / Shot</span>
        </div>
      </div>
    </div>
  );
};
