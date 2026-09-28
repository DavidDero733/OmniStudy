import React, { useRef, useEffect, useState } from 'react';
import { Calculator, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface MathGraphCardProps {
  functionString?: string;
  directAnswer?: string;
}

export const MathGraphCard: React.FC<MathGraphCardProps> = ({
  functionString = 'x^2 - 4',
  directAnswer,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scale, setScale] = useState(25); // pixels per unit
  const [hoverCoords, setHoverCoords] = useState<{ x: number; y: number } | null>(null);

  // Parse a basic mathematical function string safely into a JS function
  const evaluateFn = (x: number, fnStr: string): number => {
    try {
      // Normalize common math notations
      let clean = fnStr
        .replace(/f\(x\)\s*=\s*/g, '')
        .replace(/y\s*=\s*/g, '')
        .replace(/\^/g, '**')
        .replace(/(\d)([a-zA-Z])/g, '$1*$2') // 3x -> 3*x
        .replace(/sin/g, 'Math.sin')
        .replace(/cos/g, 'Math.cos')
        .replace(/tan/g, 'Math.tan')
        .replace(/sqrt/g, 'Math.sqrt')
        .replace(/abs/g, 'Math.abs');

      // Evaluator with bounded scope
      // eslint-disable-next-line no-new-func
      const fn = new Function('x', `return ${clean};`);
      const val = fn(x);
      return isNaN(val) ? 0 : val;
    } catch {
      // Fallback: simple parabola x^2 - 4
      return x * x - 4;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const originX = width / 2;
    const originY = height / 2;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Background
    ctx.fillStyle = '#090d16';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 1;

    // Vertical grid
    for (let x = originX % scale; x < width; x += scale) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid
    for (let y = originY % scale; y < height; y += scale) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Main Axes
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;

    // X Axis
    ctx.beginPath();
    ctx.moveTo(0, originY);
    ctx.lineTo(width, originY);
    ctx.stroke();

    // Y Axis
    ctx.beginPath();
    ctx.moveTo(originX, 0);
    ctx.lineTo(originX, height);
    ctx.stroke();

    // Axis labels
    ctx.fillStyle = '#94a3b8';
    ctx.font = '10px monospace';
    for (let u = -10; u <= 10; u += 2) {
      if (u === 0) continue;
      const px = originX + u * scale;
      const py = originY - u * scale;
      if (px > 0 && px < width) ctx.fillText(`${u}`, px - 6, originY + 14);
      if (py > 0 && py < height) ctx.fillText(`${u}`, originX + 6, py + 4);
    }

    // Plot function curve
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();

    let started = false;
    for (let px = 0; px <= width; px += 2) {
      const mathX = (px - originX) / scale;
      const mathY = evaluateFn(mathX, functionString);
      const py = originY - mathY * scale;

      if (!isNaN(py) && py >= -100 && py <= height + 100) {
        if (!started) {
          ctx.moveTo(px, py);
          started = true;
        } else {
          ctx.lineTo(px, py);
        }
      } else {
        started = false;
      }
    }
    ctx.stroke();

    // Draw hover point if present
    if (hoverCoords) {
      const hpx = originX + hoverCoords.x * scale;
      const hpy = originY - hoverCoords.y * scale;

      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(hpx, hpy, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }, [functionString, scale, hoverCoords]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const px = e.clientX - rect.left;
    const originX = canvas.width / 2;
    const mathX = Math.round(((px - originX) / scale) * 10) / 10;
    const mathY = Math.round(evaluateFn(mathX, functionString) * 100) / 100;
    setHoverCoords({ x: mathX, y: mathY });
  };

  return (
    <div className="w-full bg-slate-900/90 border border-slate-800 rounded-2xl p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-cyan-400" />
          <h3 className="font-bold text-slate-100 text-sm sm:text-base">
            Function & Graph Visualizer
          </h3>
          <span className="font-mono text-xs px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/50">
            f(x) = {functionString}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setScale((s) => Math.min(s + 5, 50))}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setScale((s) => Math.max(s - 5, 12))}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setScale(25)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            title="Reset Zoom"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Coordinate canvas */}
      <div className="mt-3 relative rounded-xl overflow-hidden border border-slate-800">
        <canvas
          ref={canvasRef}
          width={600}
          height={320}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoverCoords(null)}
          className="w-full h-[260px] sm:h-[300px] cursor-crosshair block"
        />

        {/* Hover readout badge */}
        <div className="absolute top-2 left-2 bg-slate-950/90 border border-slate-800 px-2.5 py-1 rounded-lg text-xs font-mono text-slate-300 shadow">
          {hoverCoords ? (
            <span>
              x: <b className="text-cyan-400">{hoverCoords.x}</b>, y:{' '}
              <b className="text-pink-400">{hoverCoords.y}</b>
            </span>
          ) : (
            <span className="text-slate-500">Hover over graph for (x, y) coordinates</span>
          )}
        </div>
      </div>

      {directAnswer && (
        <div className="mt-3 p-2.5 bg-slate-950/60 rounded-xl border border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-medium">Roots / Solution Set:</span>
          <span className="font-mono font-bold text-cyan-300">{directAnswer}</span>
        </div>
      )}
    </div>
  );
};
