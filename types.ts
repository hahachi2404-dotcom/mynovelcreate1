export interface Chapter {
  id: string;
  title: string;
  summary: string;
  content: string;
  isGenerated: boolean;
  isGenerating: boolean;
}

export interface NovelConfig {
  title: string;
  genre: string;
  style: string;
  keywords: string;
  targetAudience: string;
}

export interface OutlineItem {
  title: string;
  summary: string;
}

export type ViewState = 'setup' | 'writing';
