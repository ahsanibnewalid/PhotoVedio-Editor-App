import React from 'react';
import { 
  Cpu, 
  Layers, 
  Zap, 
  ShieldCheck, 
  HardDrive, 
  Terminal, 
  ArrowRight,
  Flame,
  CheckCircle2
} from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* 1. PIPELINE OVERVIEW HERO */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-zinc-900 to-[#0c0c0e] border border-zinc-800 shadow-xl">
        <div className="flex items-center gap-2 mb-3">
          <Zap size={20} className="text-cyan-400" />
          <h3 className="text-base font-extrabold text-white tracking-wide">
            Zero-Copy Android Hardware Acceleration Architecture
          </h3>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed max-w-3xl">
          Unlike standard hybrid video editors that suffer from slow JS bridge serialization and CPU memory copying,
          this architecture maintains a <strong>100% native pipeline</strong>. Video frames decode directly into an OpenGL ES
          <code className="text-cyan-400 mx-1">GL_TEXTURE_EXTERNAL_OES</code> texture, apply GPU Skia shaders, and stream into
          <code className="text-cyan-400 mx-1">MediaCodec</code> hardware encoder via native EGLSurfaces.
        </p>

        {/* Visual Pipeline Flowchart */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-3 items-center">
          
          {/* Step 1 */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mb-2">
              <HardDrive size={16} />
            </div>
            <span className="text-[11px] font-bold text-white">Media Asset</span>
            <span className="text-[10px] text-zinc-500 font-mono mt-0.5">MP4 / HEVC / SAF</span>
          </div>

          <div className="hidden md:flex justify-center text-zinc-600">
            <ArrowRight size={18} className="text-cyan-400 animate-pulse" />
          </div>

          {/* Step 2 */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-2">
              <Cpu size={16} />
            </div>
            <span className="text-[11px] font-bold text-white">MediaCodec Decoder</span>
            <span className="text-[10px] text-cyan-400 font-mono mt-0.5">ExoPlayer Surface</span>
          </div>

          <div className="hidden md:flex justify-center text-zinc-600">
            <ArrowRight size={18} className="text-cyan-400 animate-pulse" />
          </div>

          {/* Step 3 */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-cyan-500/30 shadow-[0_0_15px_rgba(0,242,254,0.1)] flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-300 flex items-center justify-center mb-2">
              <Flame size={16} />
            </div>
            <span className="text-[11px] font-bold text-cyan-300">Skia GPU Shaders</span>
            <span className="text-[10px] text-cyan-400 font-mono mt-0.5">SkSL Real-time 60FPS</span>
          </div>

          <div className="hidden md:flex justify-center text-zinc-600">
            <ArrowRight size={18} className="text-cyan-400 animate-pulse" />
          </div>

          {/* Step 4 */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center mb-2">
              <Layers size={16} />
            </div>
            <span className="text-[11px] font-bold text-white">Reanimated Timeline</span>
            <span className="text-[10px] text-amber-400 font-mono mt-0.5">Native UI Thread</span>
          </div>

          <div className="hidden md:flex justify-center text-zinc-600">
            <ArrowRight size={18} className="text-cyan-400 animate-pulse" />
          </div>

          {/* Step 5 */}
          <div className="p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center mb-2">
              <Zap size={16} />
            </div>
            <span className="text-[11px] font-bold text-white">MediaCodec HW Mux</span>
            <span className="text-[10px] text-purple-400 font-mono mt-0.5">18 Mbps 1080p 60fps</span>
          </div>

        </div>
      </div>

      {/* 2. THREE PILLARS SPECIFICATIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Pillar 1 */}
        <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400">
              <Cpu size={16} />
            </div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">
              1. Hardware Decoding & Skia
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-zinc-400 leading-normal">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
              <span>Uses Android <code>SurfaceView</code> and <code>useTextureView=true</code> to avoid Android bitmap copying.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
              <span>Compiles SkSL shaders directly on Adreno/Mali GPUs via <code>@shopify/react-native-skia</code>.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-cyan-400 mt-0.5 shrink-0" />
              <span>Color matrices for Grayscale and Sepia execute with 0ms frame drops.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 2 */}
        <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Zap size={16} />
            </div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">
              2. 60 FPS Reanimated Engine
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-zinc-400 leading-normal">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <span><code>PanGestureHandler</code> dispatches touch events directly on the Android UI Thread via worklets.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <span>Zero JS bridge roundtrips during playhead scrubbing and timeline pinch-to-zoom.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-amber-400 mt-0.5 shrink-0" />
              <span>Synchronous seek requests throttled with <code>runOnJS</code> callbacks.</span>
            </li>
          </ul>
        </div>

        {/* Pillar 3 */}
        <div className="p-5 rounded-xl bg-[#121215] border border-zinc-800 space-y-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <ShieldCheck size={16} />
            </div>
            <h4 className="text-xs font-bold uppercase text-white tracking-wider">
              3. Android 13+ Scoped Storage
            </h4>
          </div>
          <ul className="space-y-2 text-xs text-zinc-400 leading-normal">
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Integrated with Android Photo Picker for zero-permission user video selection.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Direct <code>content://</code> URI resolution via Android MediaStore and MediaMuxer.</span>
            </li>
            <li className="flex items-start gap-1.5">
              <CheckCircle2 size={13} className="text-emerald-400 mt-0.5 shrink-0" />
              <span>Clean Gradle <code>pickFirst</code> packaging rules resolving NDK <code>.so</code> conflicts.</span>
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
