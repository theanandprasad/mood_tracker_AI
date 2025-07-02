export interface MoodEntry {
  id: string;
  date: string;
  timestamp: number;
  emoji: string;
  moodType: string;
  intensity: number;
  note?: string;
  tags: string[];
  createdAt: number;
  updatedAt: number;
}

export interface MoodOption {
  emoji: string;
  label: string;
  type: string;
}

export interface AIInsight {
  id: string;
  insightText: string;
  insightType: string;
  dateRange: string;
  createdAt: number;
  isRead: boolean;
}

export interface UserPreferences {
  key: string;
  value: string;
  updatedAt: number;
}

export type ViewMode = 'list' | 'calendar';

export interface MoodStats {
  totalEntries: number;
  currentStreak: number;
  longestStreak: number;
  averageIntensity: number;
  mostCommonMood: string;
} 