import React, { useRef, useEffect } from 'react';
import { FilterType } from '../types/editor';

interface SkiaShaderRendererProps {
  filterType: FilterType;
  filterIntensity: number;
  width: number;
  height: number;
}

/**
 * Simulates Shopify React Native Skia GPU shader rendering
 * matching the SkSL fragment shader specification in SkiaShaderFilterView.js
 */
export const SkiaShaderRenderer: React.FC<SkiaShaderRendererProps> = ({
  filterType,
  filterIntensity,
  width,
  height,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (filterType !== 'NEON_GLOW') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let t = 0;

    const renderNeonShader = () => {
      t += 0.04;
      ctx.clearRect(0, 0, width, height);

      // Simulating SkSL High-pass threshold glow:
      // Vignette radial gradient with cyan chromatic dispersion
      const cx = width / 2;
      const cy = height / 2;
      const radius = Math.max(width, height) * 0.7;

      const radialGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, radius);
      const pulse = 0.2 + Math.sin(t) * 0.08;
      
      radialGrad.addColorStop(0, 'rgba(0, 242, 254, 0.02)');
      radialGrad.addColorStop(0.5, `rgba(0, 242, 254, ${0.12 * filterIntensity * pulse})`);
      radialGrad.addColorStop(0.85, `rgba(0, 242, 254, ${0.35 * filterIntensity})`);
      radialGrad.addColorStop(1, `rgba(2, 6, 23, ${0.65 * filterIntensity})`);

      ctx.fillStyle = radialGrad;
      ctx.fillRect(0, 0, width, height);

      // Scanline simulation from SkSL shader: sin(uv.y * 50.0)
      ctx.fillStyle = `rgba(0, 242, 254, ${0.05 * filterIntensity})`;
      const lineSpacing = 6;
      for (let y = 0; y < height; y += lineSpacing) {
        ctx.fillRect(0, y, width, 1);
      }

      // Neon Cyan corner accents
      ctx.strokeStyle = `rgba(0, 242, 254, ${0.45 * filterIntensity})`;
      ctx.lineWidth = 1.5;
      const borderLen = 24;
      
      // Top-Left corner
      ctx.beginPath();
      ctx.moveTo(10, 10 + borderLen);
      ctx.lineTo(10, 10);
      ctx.lineTo(10 + borderLen, 10);
      ctx.stroke();

      // Bottom-Right corner
      ctx.beginPath();
      ctx.moveTo(width - 10 - borderLen, height - 10);
      ctx.lineTo(width - 10, height - 10);
      ctx.lineTo(width - 10, height - 10 - borderLen);
      ctx.stroke();

      animationFrameId = requestAnimationFrame(renderNeonShader);
    };

    renderNeonShader();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [filterType, filterIntensity, width, height]);

  if (filterType === 'NORMAL') return null;

  if (filterType === 'NEON_GLOW') {
    return (
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="pointer-events-none absolute inset-0 z-10 mix-blend-screen"
      />
    );
  }

  // Grayscale & Sepia color matrix passes
  return (
    <div
      className="pointer-events-none absolute inset-0 z-10"
      style={{
        backgroundColor:
          filterType === 'SEPIA'
            ? `rgba(180, 120, 40, ${0.18 * filterIntensity})`
            : `rgba(100, 100, 110, ${0.12 * filterIntensity})`,
        mixBlendMode: filterType === 'SEPIA' ? 'color' : 'saturation',
      }}
    />
  );
};
