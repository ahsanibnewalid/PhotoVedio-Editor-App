import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, 
  Pause, 
  Scissors, 
  Gauge, 
  Sparkles, 
  Type, 
  Download, 
  RotateCcw,
  Volume2,
  VolumeX,
  Smartphone,
  Maximize2,
  Sliders,
  FolderOpen,
  Plus,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { AspectRatioType, FilterType, VideoClipSegment, TextOverlayItem } from '../types/editor';
import { SAMPLE_MEDIA_LIST, SampleMediaItem } from '../utils/sampleMedia';
import { SkiaShaderRenderer } from './SkiaShaderRenderer';
import { InteractiveTimeline } from './InteractiveTimeline';
import { ExportStudioModalUI } from './ExportStudioModalUI';

interface NativeEditorSimulatorProps {
  onOpenCodeInspector?: () => void;
}

export const NativeEditorSimulator: React.FC<NativeEditorSimulatorProps> = ({
  onOpenCodeInspector,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Active Media selection
  const [activeMedia, setActiveMedia] = useState<SampleMediaItem>(SAMPLE_MEDIA_LIST[0]);
  const [customVideoUrl, setCustomVideoUrl] = useState<string | null>(null);

  // Playback state
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(15.0);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);

  // Editor layout settings
  const [aspectRatio, setAspectRatio] = useState<AspectRatioType>('9:16');
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);

  // Tools & Shader filters
  const [activeTool, setActiveTool] = useState<'split' | 'speed' | 'filter' | 'text' | 'media' | null>('filter');
  const [activeFilter, setActiveFilter] = useState<FilterType>('NEON_GLOW');
  const [filterIntensity, setFilterIntensity] = useState<number>(1.0);

  // Video Clips Segments (Split/Trim)
  const [videoClips, setVideoClips] = useState<VideoClipSegment[]>([
    { id: 'clip-1', name: 'Scene 01 (Intro)', startTime: 0, endTime: 7.5, duration: 7.5, color: '#00f2fe' },
    { id: 'clip-2', name: 'Scene 02 (Action)', startTime: 7.5, endTime: 15.0, duration: 7.5, color: '#38bdf8' },
  ]);
  const [selectedClipId, setSelectedClipId] = useState<string | null>('clip-1');

  // Text Overlays
  const [textOverlays, setTextOverlays] = useState<TextOverlayItem[]>([
    {
      id: 'txt-1',
      text: 'CYBER CITY 2026',
      startTime: 0.5,
      endTime: 6.0,
      xPercent: 50,
      yPercent: 30,
      fontSize: 22,
      color: '#ffffff',
      glow: true,
    },
    {
      id: 'txt-2',
      text: '#NEON_REEL',
      startTime: 6.5,
      endTime: 14.0,
      xPercent: 50,
      yPercent: 75,
      fontSize: 16,
      color: '#00f2fe',
      glow: true,
    }
  ]);
  const [editingText, setEditingText] = useState<string>('CYBER CITY 2026');

  // Export Modal state
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Telemetry 60 FPS simulator
  const [currentFps, setCurrentFps] = useState<number>(60.0);

  // Sync video duration on load
  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const dur = videoRef.current.duration || 15.0;
      setTotalDuration(dur);
      // Reset clips to match total duration
      setVideoClips([
        { id: 'clip-1', name: `${activeMedia.title} (Part A)`, startTime: 0, endTime: dur / 2, duration: dur / 2, color: '#00f2fe' },
        { id: 'clip-2', name: `${activeMedia.title} (Part B)`, startTime: dur / 2, endTime: dur, duration: dur / 2, color: '#38bdf8' },
      ]);
    }
  };

  // Video Time Update
  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      // Slight simulated jitter around 60.0 for realistic hardware monitoring (59.8 - 60.1 FPS)
      setCurrentFps(59.7 + Math.random() * 0.4);
    }
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setCurrentTime(0);
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().catch(e => console.log('Play interrupted', e));
      setIsPlaying(true);
    }
  };

  const handleSeek = useCallback((newTime: number) => {
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
  }, []);

  const handleSpeedChange = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
  };

  // Split clip at playhead
  const handleSplitClip = () => {
    const targetClipIndex = videoClips.findIndex(
      clip => currentTime > clip.startTime + 0.5 && currentTime < clip.endTime - 0.5
    );

    if (targetClipIndex === -1) return;

    const target = videoClips[targetClipIndex];
    const firstHalf: VideoClipSegment = {
      ...target,
      id: `${target.id}_a`,
      endTime: currentTime,
      duration: currentTime - target.startTime,
      name: `${target.name} [Trim A]`,
    };

    const secondHalf: VideoClipSegment = {
      ...target,
      id: `${target.id}_b`,
      startTime: currentTime,
      duration: target.endTime - currentTime,
      name: `${target.name} [Trim B]`,
      color: '#06b6d4',
    };

    const updated = [...videoClips];
    updated.splice(targetClipIndex, 1, firstHalf, secondHalf);
    setVideoClips(updated);
    setSelectedClipId(secondHalf.id);
  };

  // Switch Media Clip
  const handleSelectMedia = (item: SampleMediaItem) => {
    setActiveMedia(item);
    setCustomVideoUrl(null);
    setActiveFilter(item.recommendedFilter);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  // Custom user video upload
  const handleCustomFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setCustomVideoUrl(url);
      setIsPlaying(false);
      setCurrentTime(0);
    }
  };

  // Text overlay updater
  const handleUpdateActiveText = (newVal: string) => {
    setEditingText(newVal);
    setTextOverlays(prev => [
      {
        ...prev[0],
        text: newVal,
      },
      ...prev.slice(1)
    ]);
  };

  // Dimensions based on aspect ratio
  const getViewportDimensions = () => {
    if (aspectRatio === '9:16') {
      return isPhoneFrame 
        ? { width: 220, height: 390 } 
        : { width: 260, height: 462 };
    } else if (aspectRatio === '16:9') {
      return isPhoneFrame 
        ? { width: 340, height: 191 } 
        : { width: 440, height: 248 };
    } else {
      // 1:1 Square
      return isPhoneFrame 
        ? { width: 280, height: 280 } 
        : { width: 340, height: 340 };
    }
  };

  const viewportDims = getViewportDimensions();

  // Format time MM:SS.SS
  const formatTimecode = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    const ms = Math.floor((sec % 1) * 100);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col bg-[#09090b] rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl select-none">
      
      {/* 1. TOP APP BAR */}
      <div className="h-14 px-4 bg-[#0c0c0e] border-b border-zinc-800 flex items-center justify-between">
        
        {/* Left: Project title & Hardware Badge */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f2fe]" />
            <h2 className="text-sm font-bold text-white tracking-tight">
              NeonReel_Android_01
            </h2>
          </div>
          
          <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-cyan-500/10 border border-cyan-500/30">
            <span className="text-[10px] font-mono font-bold text-cyan-400">
              {currentFps.toFixed(1)} FPS
            </span>
            <span className="text-[9px] text-zinc-400 uppercase font-semibold">
              MediaCodec HW
            </span>
          </div>
        </div>

        {/* Center: Aspect Ratio Selector */}
        <div className="flex items-center bg-zinc-900/90 p-1 rounded-xl border border-zinc-800">
          {(['9:16', '16:9', '1:1'] as const).map((ratio) => (
            <button
              key={ratio}
              onClick={() => setAspectRatio(ratio)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${
                aspectRatio === ratio
                  ? 'bg-zinc-800 text-cyan-400 shadow-sm border border-zinc-700'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {ratio}
            </button>
          ))}
        </div>

        {/* Right: Phone Frame Toggle & Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400 hover:text-white transition"
            title={isPhoneFrame ? 'Switch to Studio View' : 'Switch to Android Device Frame'}
          >
            {isPhoneFrame ? <Maximize2 size={16} /> : <Smartphone size={16} />}
          </button>

          <button
            onClick={() => setIsExportModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 active:scale-95 text-zinc-950 text-xs font-extrabold tracking-wide shadow-[0_0_15px_rgba(0,242,254,0.35)] transition"
          >
            <Download size={14} />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* 2. PREVIEW MONITOR AREA */}
      <div className="relative flex-1 min-h-[380px] lg:min-h-[440px] bg-[#050507] flex items-center justify-center p-4 overflow-hidden">
        
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[radial-gradient(#18181b_1px,transparent_1px)] [background-size:16px_16px] opacity-40" />

        {/* Device Frame or Direct Canvas */}
        <div 
          className={`relative transition-all duration-300 flex items-center justify-center ${
            isPhoneFrame 
              ? 'p-2 rounded-[36px] bg-[#1a1a1f] border-4 border-zinc-700 shadow-2xl ring-1 ring-zinc-800' 
              : 'rounded-xl overflow-hidden shadow-2xl border border-zinc-800'
          }`}
        >
          {/* Android Punch-hole Camera (when in phone frame) */}
          {isPhoneFrame && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rounded-full bg-black border border-zinc-700/60" />
          )}

          {/* Viewport Canvas Wrapper */}
          <div
            className="relative rounded-[24px] overflow-hidden bg-black flex items-center justify-center shadow-inner"
            style={{
              width: `${viewportDims.width}px`,
              height: `${viewportDims.height}px`,
            }}
          >
            {/* HTML5 Video Element (simulating react-native-video) */}
            <video
              ref={videoRef}
              src={customVideoUrl || activeMedia.videoUrl}
              poster={activeMedia.posterUrl}
              onLoadedMetadata={handleLoadedMetadata}
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleVideoEnded}
              muted={isAudioMuted}
              playsInline
              loop
              className="absolute inset-0 w-full h-full object-cover"
              style={{
                filter: 
                  activeFilter === 'GRAYSCALE'
                    ? `grayscale(${100 * filterIntensity}%) contrast(1.1)`
                    : activeFilter === 'SEPIA'
                    ? `sepia(${100 * filterIntensity}%) saturate(1.2)`
                    : activeFilter === 'NEON_GLOW'
                    ? `contrast(1.25) saturate(1.4) brightness(1.05)`
                    : 'none',
              }}
            />

            {/* Skia GPU Shader Filter Overlay */}
            <SkiaShaderRenderer
              filterType={activeFilter}
              filterIntensity={filterIntensity}
              width={viewportDims.width}
              height={viewportDims.height}
            />

            {/* Active Subtitle / Text Sticker Overlays */}
            {textOverlays.map((txt) => {
              if (currentTime >= txt.startTime && currentTime <= txt.endTime) {
                return (
                  <div
                    key={txt.id}
                    className="absolute z-20 pointer-events-none transition-all duration-150 transform -translate-x-1/2 -translate-y-1/2"
                    style={{
                      left: `${txt.xPercent}%`,
                      top: `${txt.yPercent}%`,
                    }}
                  >
                    <div className="px-3 py-1 rounded bg-black/60 backdrop-blur-sm border border-cyan-400/40 shadow-lg">
                      <span
                        className="font-black tracking-wider text-center block uppercase"
                        style={{
                          fontSize: `${txt.fontSize}px`,
                          color: txt.color,
                          textShadow: txt.glow ? '0 0 10px #00f2fe, 0 0 20px #00f2fe' : 'none',
                        }}
                      >
                        {txt.text}
                      </span>
                    </div>
                  </div>
                );
              }
              return null;
            })}

            {/* Center Play / Pause Floating Trigger */}
            <button
              onClick={togglePlayPause}
              className="absolute z-30 p-3.5 rounded-full bg-black/65 hover:bg-black/80 border border-cyan-400/40 text-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.3)] transition transform hover:scale-105 active:scale-95"
            >
              {isPlaying ? <Pause size={22} /> : <Play size={22} className="ml-0.5" />}
            </button>

            {/* Bottom Timecode & Ratio HUD badge */}
            <div className="absolute bottom-2.5 inset-x-3 z-20 flex items-center justify-between pointer-events-none">
              <div className="px-2 py-0.5 rounded-full bg-black/80 backdrop-blur-md border border-zinc-800 text-[10px] font-mono text-white/90">
                {formatTimecode(currentTime)} / {formatTimecode(totalDuration)}
              </div>

              <div className="px-2 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-[9px] font-bold text-cyan-300">
                {activeFilter}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MULTI-TRACK INTERACTIVE TIMELINE */}
      <InteractiveTimeline
        currentTime={currentTime}
        totalDuration={totalDuration}
        onSeek={handleSeek}
        videoClips={videoClips}
        textOverlays={textOverlays}
        selectedClipId={selectedClipId}
        onSelectClip={setSelectedClipId}
        onSplitClip={handleSplitClip}
        isAudioMuted={isAudioMuted}
        onToggleMute={() => setIsAudioMuted(!isAudioMuted)}
      />

      {/* 4. BOTTOM EDITING TOOLBAR */}
      <div className="bg-[#09090b] border-t border-zinc-800">
        
        {/* Main Tool Categories */}
        <div className="h-14 px-3 flex items-center justify-around">
          
          {/* Split */}
          <button
            onClick={handleSplitClip}
            className="flex flex-col items-center justify-center gap-1 text-zinc-400 hover:text-cyan-400 transition"
          >
            <Scissors size={18} className="text-cyan-400" />
            <span className="text-[10px] font-bold">Split</span>
          </button>

          {/* Speed */}
          <button
            onClick={() => setActiveTool(activeTool === 'speed' ? null : 'speed')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTool === 'speed' ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Gauge size={18} />
            <span className="text-[10px] font-bold">Speed ({playbackSpeed}x)</span>
          </button>

          {/* Filters */}
          <button
            onClick={() => setActiveTool(activeTool === 'filter' ? null : 'filter')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTool === 'filter' ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Sparkles size={18} />
            <span className="text-[10px] font-bold">GPU Filters</span>
          </button>

          {/* Text */}
          <button
            onClick={() => setActiveTool(activeTool === 'text' ? null : 'text')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTool === 'text' ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Type size={18} />
            <span className="text-[10px] font-bold">Text</span>
          </button>

          {/* Media / Clips */}
          <button
            onClick={() => setActiveTool(activeTool === 'media' ? null : 'media')}
            className={`flex flex-col items-center justify-center gap-1 transition ${
              activeTool === 'media' ? 'text-cyan-400' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <FolderOpen size={18} />
            <span className="text-[10px] font-bold">Media</span>
          </button>
        </div>

        {/* Sub-tool panels */}
        {activeTool === 'speed' && (
          <div className="p-3 bg-[#121215] border-t border-zinc-800/80 flex items-center justify-center gap-2 animate-in slide-in-from-bottom-2">
            {[0.5, 1.0, 2.0, 4.0].map((rate) => (
              <button
                key={rate}
                onClick={() => handleSpeedChange(rate)}
                className={`px-4 py-1.5 rounded-lg text-xs font-bold font-mono transition ${
                  playbackSpeed === rate
                    ? 'bg-cyan-400 text-zinc-950 shadow-[0_0_10px_rgba(0,242,254,0.3)]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300'
                }`}
              >
                {rate}x {rate === 0.5 ? '(Slow-mo)' : rate === 4.0 ? '(Hyper)' : ''}
              </button>
            ))}
          </div>
        )}

        {activeTool === 'filter' && (
          <div className="p-3 bg-[#121215] border-t border-zinc-800/80 space-y-2.5 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">
                Shopify Skia Shaders (Android GPU)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-zinc-500 font-mono">Intensity</span>
                <input
                  type="range"
                  min="0.2"
                  max="1.5"
                  step="0.1"
                  value={filterIntensity}
                  onChange={(e) => setFilterIntensity(parseFloat(e.target.value))}
                  className="w-20 accent-cyan-400 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {(['NORMAL', 'NEON_GLOW', 'GRAYSCALE', 'SEPIA'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`py-2 px-1 rounded-xl border text-center transition flex flex-col items-center gap-1 ${
                    activeFilter === filter
                      ? 'border-cyan-400 bg-cyan-500/15 text-cyan-300 shadow-[0_0_12px_rgba(0,242,254,0.2)]'
                      : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-850 text-zinc-400'
                  }`}
                >
                  <span className="text-[11px] font-bold">
                    {filter === 'NEON_GLOW' ? 'Neon Glow' : filter === 'GRAYSCALE' ? 'Grayscale' : filter === 'SEPIA' ? 'Sepia' : 'Normal'}
                  </span>
                  <span className="text-[9px] text-zinc-500 font-mono">
                    {filter === 'NEON_GLOW' ? 'SkSL Bloom' : filter === 'NORMAL' ? 'Raw 60FPS' : 'Matrix'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeTool === 'text' && (
          <div className="p-3 bg-[#121215] border-t border-zinc-800/80 space-y-2 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">
                Text Caption Overlay
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                Hardware font renderer
              </span>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={editingText}
                onChange={(e) => handleUpdateActiveText(e.target.value)}
                placeholder="Enter caption text..."
                className="flex-1 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition font-mono uppercase"
              />
              <button
                onClick={() => {
                  const newId = `txt-${Date.now()}`;
                  setTextOverlays(prev => [
                    ...prev,
                    {
                      id: newId,
                      text: editingText || 'NEW CAPTION',
                      startTime: currentTime,
                      endTime: Math.min(totalDuration, currentTime + 3.0),
                      xPercent: 50,
                      yPercent: 50,
                      fontSize: 20,
                      color: '#ffffff',
                      glow: true,
                    }
                  ]);
                }}
                className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-zinc-950 text-xs font-bold flex items-center gap-1 transition"
              >
                <Plus size={14} />
                <span>Add at {currentTime.toFixed(1)}s</span>
              </button>
            </div>
          </div>
        )}

        {activeTool === 'media' && (
          <div className="p-3 bg-[#121215] border-t border-zinc-800/80 space-y-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase text-zinc-400 tracking-wider">
                Select Native Asset / Clip
              </span>

              {/* Upload user file */}
              <label className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-medium cursor-pointer transition border border-zinc-700">
                <FolderOpen size={13} className="text-cyan-400" />
                <span>Pick Custom Video</span>
                <input
                  type="file"
                  accept="video/*,image/*"
                  onChange={handleCustomFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {SAMPLE_MEDIA_LIST.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelectMedia(item)}
                  className={`p-2 rounded-xl border text-left transition relative overflow-hidden flex flex-col gap-1 ${
                    activeMedia.id === item.id && !customVideoUrl
                      ? 'border-cyan-400 bg-cyan-500/10 shadow-[0_0_10px_rgba(0,242,254,0.2)]'
                      : 'border-zinc-800 bg-zinc-900 hover:bg-zinc-800'
                  }`}
                >
                  <div className="text-xs font-bold text-white truncate">
                    {item.title}
                  </div>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    {item.tag}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Export Studio Modal */}
      <ExportStudioModalUI
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        aspectRatio={aspectRatio}
        currentFilter={activeFilter}
        duration={totalDuration}
      />
    </div>
  );
};
