import React, { useState, useRef, useEffect } from 'react';
import { Check, X, Crop, RotateCcw } from 'lucide-react';

interface ImageCropModalProps {
  imageSrc: string;
  isOpen: boolean;
  onClose: () => void;
  onCropComplete: (croppedBase64: string) => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageSrc,
  isOpen,
  onClose,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (isOpen) {
      setCrop({ x: 10, y: 10, width: 80, height: 80 });
    }
  }, [isOpen, imageSrc]);

  if (!isOpen) return null;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const yPct = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setDragStart({ x: xPct, y: yPct });
    setCrop({ x: xPct, y: yPct, width: 0, height: 0 });
    setIsDragging(true);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const currentY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    const left = Math.min(dragStart.x, currentX);
    const top = Math.min(dragStart.y, currentY);
    const width = Math.abs(currentX - dragStart.x);
    const height = Math.abs(currentY - dragStart.y);

    setCrop({
      x: left,
      y: top,
      width: Math.max(5, width),
      height: Math.max(5, height),
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleApplyCrop = () => {
    if (!imgRef.current) return;
    const image = imgRef.current;
    const canvas = document.createElement('canvas');

    const naturalWidth = image.naturalWidth;
    const naturalHeight = image.naturalHeight;

    const sourceX = (crop.x / 100) * naturalWidth;
    const sourceY = (crop.y / 100) * naturalHeight;
    const sourceW = (crop.width / 100) * naturalWidth;
    const sourceH = (crop.height / 100) * naturalHeight;

    canvas.width = Math.max(50, sourceW);
    canvas.height = Math.max(50, sourceH);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      sourceX,
      sourceY,
      sourceW,
      sourceH,
      0,
      0,
      canvas.width,
      canvas.height
    );

    const croppedDataUrl = canvas.toDataURL('image/png');
    onCropComplete(croppedDataUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-4xl w-full p-5 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Crop className="h-5 w-5 text-indigo-400" />
            <h3 className="font-semibold text-slate-100 text-sm sm:text-base">
              Crop Question Area
            </h3>
            <span className="text-xs text-slate-400 hidden sm:inline">
              Drag over the specific IXL problem or quiz question to isolate it
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Canvas / Image workspace */}
        <div className="relative my-4 flex-1 min-h-[300px] max-h-[60vh] overflow-hidden flex items-center justify-center bg-slate-950 rounded-xl select-none">
          <div
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative cursor-crosshair inline-block max-w-full max-h-[58vh]"
          >
            <img
              ref={imgRef}
              src={imageSrc}
              alt="To crop"
              className="max-h-[58vh] max-w-full object-contain pointer-events-none"
            />

            {/* Dark overlay with transparent cutout */}
            <div
              className="absolute border-2 border-indigo-400 bg-indigo-500/10 pointer-events-none rounded shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]"
              style={{
                left: `${crop.x}%`,
                top: `${crop.y}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
              }}
            >
              <div className="absolute top-1 left-1 bg-indigo-600 text-white font-mono text-[9px] px-1 py-0.5 rounded shadow">
                Question Target
              </div>
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-3 border-t border-slate-800">
          <button
            type="button"
            onClick={() => setCrop({ x: 5, y: 5, width: 90, height: 90 })}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-all"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Crop</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:bg-slate-800 rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyCrop}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-md shadow-indigo-600/25 transition-all"
            >
              <Check className="h-4 w-4" />
              <span>Apply & Solve</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
