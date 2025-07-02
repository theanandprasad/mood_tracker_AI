import { useState, useEffect } from 'react';
import { MoodEntry } from '../types';
import { databaseService } from '../services/database';

export const useMoodData = () => {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMoodEntries = async () => {
    try {
      setLoading(true);
      const entries = await databaseService.getMoodEntries();
      setMoodEntries(entries);
      setError(null);
    } catch (err) {
      setError('Failed to load mood entries');
      console.error('Error loading mood entries:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveMoodEntry = async (moodData: Omit<MoodEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const id = await databaseService.saveMoodEntry(moodData);
      await loadMoodEntries(); // Refresh the list
      return id;
    } catch (err) {
      setError('Failed to save mood entry');
      console.error('Error saving mood entry:', err);
      throw err;
    }
  };

  const getTodaysMood = async (): Promise<MoodEntry | null> => {
    try {
      const today = new Date().toISOString().split('T')[0];
      return await databaseService.getMoodEntryByDate(today);
    } catch (err) {
      console.error('Error getting today\'s mood:', err);
      return null;
    }
  };

  useEffect(() => {
    loadMoodEntries();
  }, []);

  return {
    moodEntries,
    loading,
    error,
    saveMoodEntry,
    getTodaysMood,
    refreshData: loadMoodEntries,
  };
};

export const useMoodStats = () => {
  const [stats, setStats] = useState({
    totalEntries: 0,
    currentStreak: 0,
    mostCommonMood: '😊',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [totalEntries, currentStreak, mostCommonMood] = await Promise.all([
        databaseService.getTotalEntries(),
        databaseService.getStreakCount(),
        databaseService.getMostCommonMood(),
      ]);

      setStats({ totalEntries, currentStreak, mostCommonMood });
      setError(null);
    } catch (err) {
      setError('Failed to load mood statistics');
      console.error('Error loading mood stats:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  return {
    stats,
    loading,
    error,
    refreshStats: loadStats,
  };
}; 