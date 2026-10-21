export type AspectRatioType = '9:16' | '16:9' | '1:1' | '4:5';

export type FilterType = 'NORMAL' | 'GRAYSCALE' | 'SEPIA' | 'NEON_GLOW' | 'VIGNETTE' | 'HIGH_CONTRAST';

export type LutPresetType = 'NONE' | 'TEAL_ORANGE' | 'MOODY_WARM' | 'FILM_GRAIN' | 'MATRIX_GREEN' | 'ANAMORPHIC_VIGNETTE' | 'AUTO_CINEMATIC';

export interface VideoClipSegment {
  id: string;
  name: string;
  startTime: number;
  endTime: number;
  duration: number;
  color: string;
}

export interface TextOverlayItem {
  id: string;
  text: string;
  startTime: number;
  endTime: number;
  xPercent: number; // 0 to 100
  yPercent: number; // 0 to 100
  fontSize: number;
  color: string;
  glow: boolean;
  layerPosition: 'BEHIND_SUBJECT' | 'IN_FRONT_OF_SUBJECT';
}

export interface OverlayCutoutItem {
  id: string;
  name: string;
  type: 'AI_CUTOUT' | 'STICKER' | 'PIP';
  startTime: number;
  endTime: number;
  maskActive: boolean;
  depthOfFieldBlur: number; // 0 to 20px blur for background behind cutout
  subjectGlow: boolean;
  glowColor: string;
  xPercent: number;
  yPercent: number;
  scale: number;
}

export interface AudioTrackItem {
  id: string;
  title: string;
  startTime: number;
  duration: number;
  volume: number; // 0 to 1.5
  fadeInSeconds: number;
  fadeOutSeconds: number;
  muted: boolean;
}

export interface ExportSettings {
  resolution: '1080p' | '720p' | '4k';
  frameRate: 30 | 60;
  bitrateMbps: number;
  codec: 'H264_HW' | 'HEVC_HW';
}

export interface ExportPreset {
  id: string;
  name: string;
  description: string;
  resolution: '720p' | '1080p' | '4k';
  frameRate: 30 | 60;
  bitrateMbps: number;
  codec: 'H264_HW' | 'HEVC_HW';
  targetPlatform: 'reels' | 'youtube' | 'shorts' | 'twitter' | 'custom';
  isCustom?: boolean;
}

export interface TimelineSnapshot {
  videoClips: VideoClipSegment[];
  textOverlays: TextOverlayItem[];
  overlayCutouts: OverlayCutoutItem[];
  audioTrack: AudioTrackItem;
  activeFilter: FilterType;
  activeLut: LutPresetType;
  filterIntensity: number;
  playbackSpeed: number;
  aspectRatio: AspectRatioType;
  anamorphicLetterbox: boolean; // 2.39:1 Cinema Bars
  depthOfFieldBlur: number;
  actionDescription: string;
  timestamp: number;
}
