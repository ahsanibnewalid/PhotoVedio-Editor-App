import React, { useState, useEffect } from 'react';
import { 
  X, 
  Cpu, 
  HardDrive, 
  CheckCircle2, 
  Sparkles, 
  Layers, 
  Film, 
  Download, 
  Share2,
  FileCode2
} from 'lucide-react';
import { ExportSettings, FilterType, AspectRatioType } from '../types/editor';

interface ExportStudioModalUIProps {
  isOpen: boolean;
  onClose: () => void;
  aspectRatio: AspectRatioType;
  currentFilter: FilterType;
  duration: number;
}

export const ExportStudioModalUI: React.FC<ExportStudioModalUIProps> = ({
  isOpen,
  onClose,
  aspectRatio,
  currentFilter,
  duration,
}) => {
  const [resolution, setResolution] = useState<'1080p' | '720p' | '4k'>('1080p');
  const [frameRate, setFrameRate] = useState<30 | 60>(60);
  const [codec, setCodec] = useState<'H264_HW' | 'HEVC_HW'>('H264_HW');
  const [bitrate, setBitrate] = useState<number>(18); // Mbps

  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<string>('Idle');
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [outputFile, setOutputFile] = useState<string>('');

  // Handle resolution change to automatically adjust optimal bitrate
  const handleResolutionChange = (res: '1080p' | '720p' | '4k') => {
    setResolution(res);
    if (res === '1080p') setBitrate(18);
    else if (res === '720p') setBitrate(10);
    else if (res === '4k') setBitrate(35);
  };

  // Run hardware-accelerated MediaCodec export simulation
  const startHardwareExport = () => {
    setIsExporting(true);
    setProgress(0);
    setIsCompleted(false);

    const stages = [
      { pct: 15, msg: 'Initializing Android MediaCodec surface decoder...' },
      { pct: 35, msg: `Compiling Skia ${currentFilter} GPU shader pipelines...` },
      { pct: 60, msg: `Rendering composition frames at ${frameRate} FPS on EGLSurface...` },
      { pct: 85, msg: 'Muxing AVC video and AAC audio tracks via MediaMuxer...' },
      { pct: 100, msg: 'Finalizing MP4 container into Scoped Storage...' },
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      currentStep += 1;
      const stage = stages.find(s => currentStep * 4 <= s.pct) || stages[stages.length - 1];
      setCurrentStage(stage.msg);
      setProgress(Math.min(100, currentStep * 4));

      if (currentStep * 4 >= 100) {
        clearInterval(interval);
        const timestamp = Date.now().toString().slice(-6);
        setOutputFile(`/storage/emulated/0/Movies/CapCut_${resolution}_${frameRate}fps_${timestamp}.mp4`);
        setIsExporting(false);
        setIsCompleted(true);
      }
    }, 120);
  };

  const handleReset = () => {
    setIsExporting(false);
    setProgress(0);
    setIsCompleted(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl bg-[#121215] border border-zinc-800 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/80 bg-[#09090b]">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Cpu size={18} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">
                Android Hardware Export Studio
              </h3>
              <p className="text-[11px] text-zinc-400 font-mono">
                MediaCodec Surface-to-Surface Pipeline
              </p>
            </div>
          </div>
          <button
            onClick={handleReset}
            disabled={isExporting}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {!isExporting && !isCompleted ? (
            <>
              {/* Composition Summary Pill */}
              <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Aspect Ratio</span>
                  <span className="text-xs font-bold text-cyan-400">{aspectRatio}</span>
                </div>
                <div className="border-x border-zinc-800">
                  <span className="block text-[10px] text-zinc-500 uppercase font-semibold">Duration</span>
                  <span className="text-xs font-bold text-zinc-200 font-mono">{duration.toFixed(1)}s</span>
                </div>
                <div>
                  <span className="block text-[10px] text-zinc-500 uppercase font-semibold">GPU Shader</span>
                  <span className="text-xs font-bold text-emerald-400">{currentFilter}</span>
                </div>
              </div>

              {/* 1. Resolution Selector */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Target Resolution
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['720p', '1080p', '4k'] as const).map((res) => (
                    <button
                      key={res}
                      onClick={() => handleResolutionChange(res)}
                      className={`py-2.5 px-3 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                        resolution === res
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                          : 'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <span className="text-xs font-bold uppercase">{res}</span>
                      <span className="text-[10px] text-zinc-500 font-mono">
                        {res === '1080p' ? '1080x1920' : res === '720p' ? '720x1280' : '2160x3840'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. Framerate (30 vs 60 FPS) */}
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  Rendering Frame Rate
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {([30, 60] as const).map((fps) => (
                    <button
                      key={fps}
                      onClick={() => setFrameRate(fps)}
                      className={`py-2.5 px-4 rounded-xl border flex items-center justify-between transition ${
                        frameRate === fps
                          ? 'border-cyan-400 bg-cyan-500/10 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.15)]'
                          : 'border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 text-zinc-400'
                      }`}
                    >
                      <div className="text-left">
                        <span className="block text-xs font-bold">{fps} FPS</span>
                        <span className="text-[10px] text-zinc-500">
                          {fps === 60 ? 'Smooth 60 FPS Native' : 'Standard 30 FPS'}
                        </span>
                      </div>
                      {fps === 60 && (
                        <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                          PRO
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Hardware Codec Parameters */}
              <div className="p-3.5 rounded-xl bg-[#09090b] border border-zinc-800 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-zinc-300 font-semibold">
                    <HardDrive size={14} className="text-cyan-400" />
                    <span>Android MediaCodec Profile</span>
                  </div>
                  <span className="text-[11px] font-mono text-cyan-400 font-bold">
                    OMX.qcom.video.encoder.avc
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1 border-t border-zinc-800/80">
                  <span>Target Bitrate:</span>
                  <span className="font-mono text-zinc-200 font-semibold">{bitrate} Mbps CBR</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-zinc-400">
                  <span>Input Buffer:</span>
                  <span className="font-mono text-emerald-400 font-medium">COLOR_FormatSurface (Zero-Copy)</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                onClick={startHardwareExport}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-[#00f2fe] hover:brightness-110 active:scale-[0.99] text-zinc-950 text-xs font-black tracking-wide uppercase shadow-[0_0_20px_rgba(0,242,254,0.35)] transition flex items-center justify-center gap-2"
              >
                <Cpu size={16} />
                <span>Start Hardware Encode ({frameRate} FPS)</span>
              </button>
            </>
          ) : isExporting ? (
            /* Progress State */
            <div className="py-8 flex flex-col items-center text-center space-y-5">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-2 border-zinc-800 border-t-cyan-400 animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-mono font-bold text-cyan-400">
                    {progress}%
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <h4 className="text-sm font-bold text-white">
                  Rendering Composition ({resolution} • {frameRate} FPS)
                </h4>
                <p className="text-xs text-zinc-400 font-mono h-5">
                  {currentStage}
                </p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-zinc-900 h-2 rounded-full overflow-hidden border border-zinc-800">
                <div
                  className="h-full bg-gradient-to-r from-cyan-500 to-[#00f2fe] transition-all duration-150 shadow-[0_0_10px_#00f2fe]"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full text-[10px] text-zinc-500 font-mono px-1">
                <span>GPU Shading: ACTIVE</span>
                <span>HW Accel: ENABLED</span>
              </div>
            </div>
          ) : (
            /* Completed State */
            <div className="py-6 flex flex-col items-center text-center space-y-4">
              <div className="p-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={40} />
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-white">
                  Hardware Export Successful!
                </h4>
                <p className="text-xs text-zinc-400">
                  Rendered at 60 FPS using MediaCodec hardware encoder.
                </p>
              </div>

              {/* Output path box */}
              <div className="w-full p-3 rounded-xl bg-[#09090b] border border-zinc-800 text-left space-y-1">
                <div className="text-[10px] uppercase font-bold text-zinc-500 tracking-wider">
                  Android Scoped Storage Location
                </div>
                <div className="text-[11px] font-mono text-cyan-400 break-all select-all">
                  {outputFile}
                </div>
              </div>

              <div className="flex gap-2 w-full pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition"
                >
                  Return to Editor
                </button>
                <a
                  href="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
                  download="CapCut_Exported_60FPS.mp4"
                  target="_blank"
                  rel="noreferrer"
                  className="flex-1 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 text-xs font-bold flex items-center justify-center gap-1.5 transition"
                >
                  <Download size={14} />
                  <span>Download MP4</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
