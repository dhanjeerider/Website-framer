export interface MockupConfig {
  url: string;
  timestamp: number;
}

export enum DeviceType {
  DESKTOP = 'DESKTOP',
  LAPTOP = 'LAPTOP',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE'
}

export interface GeneratedContent {
  headline: string;
  description: string;
  tags: string[];
}