
export interface GeneratedImage {
  url: string;
  prompt: string;
  timestamp: number;
}

export enum EraType {
  REVIEW = 'Review (The Past)',
  OUTLOOK = 'Outlook (The Future)'
}

export interface TechElement {
  label: string;
  icon: string;
}
