import { MoodOption } from '../types';

export const MOOD_OPTIONS: MoodOption[] = [
  { emoji: '😊', label: 'Happy', type: 'happy' },
  { emoji: '😔', label: 'Sad', type: 'sad' },
  { emoji: '😰', label: 'Anxious', type: 'anxious' },
  { emoji: '😴', label: 'Tired', type: 'tired' },
  { emoji: '😡', label: 'Angry', type: 'angry' },
  { emoji: '😐', label: 'Neutral', type: 'neutral' },
  { emoji: '😌', label: 'Calm', type: 'calm' },
  { emoji: '🤔', label: 'Confused', type: 'confused' },
  { emoji: '💪', label: 'Energetic', type: 'energetic' },
  { emoji: '🥳', label: 'Excited', type: 'excited' },
];

export const ACTIVITY_TAGS = [
  'Work',
  'Exercise', 
  'Social', 
  'Sleep', 
  'Weather',
  'Health', 
  'Family', 
  'Food', 
  'Travel', 
  'Hobbies',
];

export const COLORS = {
  primary: '#6B73FF',
  secondary: '#FFD93D',
  success: '#4ECDC4',
  warning: '#FF9500',
  error: '#FF6B6B',
  background: '#FAFAFA',
  text: '#2C2C2C',
  textSecondary: '#8E8E93',
  white: '#FFFFFF',
  lightGray: '#E1E5E9',
  lightBlue: '#F0F1FF',
};

export const INTENSITY_COLORS = {
  high: '#4ECDC4',    // 8-10
  medium: '#FFD93D',  // 6-7
  low: '#FF9500',     // 4-5
  veryLow: '#FF6B6B', // 1-3
};

export const getIntensityColor = (intensity: number): string => {
  if (intensity >= 8) return INTENSITY_COLORS.high;
  if (intensity >= 6) return INTENSITY_COLORS.medium;
  if (intensity >= 4) return INTENSITY_COLORS.low;
  return INTENSITY_COLORS.veryLow;
}; 