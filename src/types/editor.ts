export type AspectRatioType = '9:16' | '16:9' | '1:1';

export type FilterType = 'NORMAL' | 'GRAYSCALE' | 'SEPIA' | 'NEON_GLOW';

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
}

export interface AudioTrackItem {
  id: string;
  title: string;
  duration: number;
  volume: number;
  muted: boolean;
}

export interface ExportSettings {
  resolution: '1080p' | '720p' | '4k';
  frameRate: 30 | 60;
  bitrateMbps: number;
  codec: 'H264_HW' | 'HEVC_HW';
}
