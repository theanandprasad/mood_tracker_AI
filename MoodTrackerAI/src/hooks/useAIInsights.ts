import { useState, useEffect } from 'react';
import { AIInsight } from '../types';
import { aiService } from '../services/aiService';
import { databaseService } from '../services/database';

export const useAIInsights = () => {
  const [insights, setInsights] = useState<AIInsight[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const dbInsights = await databaseService.getAIInsights(5);
      setInsights(dbInsights);
      setError(null);
    } catch (err) {
      setError('Failed to load insights');
      console.error('Error loading insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const generateNewInsights = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const newInsights = await aiService.generateInsights();
      
      if (newInsights.length > 0) {
        setLastGenerated(new Date());
        await loadInsights(); // Refresh the insights list
        return newInsights;
      } else {
        setError('No insights generated');
        return [];
      }
    } catch (err) {
      setError('Failed to generate insights');
      console.error('Error generating insights:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getLatestInsight = async (): Promise<string | null> => {
    try {
      return await aiService.getLatestInsight();
    } catch (err) {
      console.error('Error getting latest insight:', err);
      return null;
    }
  };

  const markInsightAsRead = async (insightId: string) => {
    try {
      await databaseService.markInsightAsRead(insightId);
      await loadInsights(); // Refresh the list
    } catch (err) {
      console.error('Error marking insight as read:', err);
    }
  };

  const shouldGenerateNewInsights = (): boolean => {
    if (!lastGenerated) return true;
    
    // Generate new insights once per day
    const oneDayAgo = new Date();
    oneDayAgo.setDate(oneDayAgo.getDate() - 1);
    
    return lastGenerated < oneDayAgo;
  };

  useEffect(() => {
    loadInsights();
  }, []);

  return {
    insights,
    loading,
    error,
    lastGenerated,
    generateNewInsights,
    getLatestInsight,
    markInsightAsRead,
    shouldGenerateNewInsights,
    refreshInsights: loadInsights,
  };
}; 