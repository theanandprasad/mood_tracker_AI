import * as SecureStore from 'expo-secure-store';
import { MoodEntry } from '../types';
import { databaseService } from './database';

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

class AIService {
  private readonly apiUrl = 'https://api.openai.com/v1/chat/completions';
  private readonly maxRequestsPerDay = 10;
  private readonly requestCountKey = 'ai_requests_count';
  private readonly lastRequestDateKey = 'ai_last_request_date';

  async getApiKey(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync('openai_api_key');
    } catch (error) {
      console.error('Error retrieving API key:', error);
      return null;
    }
  }

  async setApiKey(apiKey: string): Promise<void> {
    try {
      await SecureStore.setItemAsync('openai_api_key', apiKey);
    } catch (error) {
      console.error('Error storing API key:', error);
      throw new Error('Failed to store API key');
    }
  }

  async checkRateLimit(): Promise<boolean> {
    try {
      const today = new Date().toDateString();
      const lastRequestDate = await databaseService.getUserPreference(this.lastRequestDateKey);
      const requestCount = await databaseService.getUserPreference(this.requestCountKey);

      if (lastRequestDate !== today) {
        // Reset counter for new day
        await databaseService.setUserPreference(this.requestCountKey, '0');
        await databaseService.setUserPreference(this.lastRequestDateKey, today);
        return true;
      }

      const count = parseInt(requestCount || '0', 10);
      return count < this.maxRequestsPerDay;
    } catch (error) {
      console.error('Error checking rate limit:', error);
      return false;
    }
  }

  async incrementRequestCount(): Promise<void> {
    try {
      const requestCount = await databaseService.getUserPreference(this.requestCountKey);
      const count = parseInt(requestCount || '0', 10);
      await databaseService.setUserPreference(this.requestCountKey, (count + 1).toString());
    } catch (error) {
      console.error('Error incrementing request count:', error);
    }
  }

  createPrompt(weeklyData: MoodEntry[]): string {
    if (weeklyData.length === 0) {
      return '';
    }

    const moodSummary = weeklyData.map(entry => {
      const tags = entry.tags?.length > 0 ? ` (${entry.tags.join(', ')})` : '';
      const note = entry.note ? ` - "${entry.note}"` : '';
      return `${entry.emoji} ${entry.moodType} (${entry.intensity}/10)${tags}${note}`;
    }).join('\n');

    return `System: You are a supportive mental wellness assistant analyzing mood patterns.
Context: Weekly mood data with emojis, intensity, and optional notes.
Task: Generate 1-2 encouraging insights about mood patterns.
Tone: Warm, supportive, and actionable.
Length: Maximum 100 characters per insight.

User's mood data from the past week:
${moodSummary}

Please provide 1-2 encouraging insights about their mood patterns. Focus on positive trends, correlations with activities, or supportive observations. Keep each insight under 100 characters.`;
  }

  async callOpenAI(prompt: string): Promise<string[]> {
    const apiKey = await this.getApiKey();
    if (!apiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data: OpenAIResponse = await response.json();
    const content = data.choices[0]?.message?.content || '';
    
    // Split by lines and filter out empty lines
    const insights = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0 && line.length <= 100);

    return insights.slice(0, 2); // Maximum 2 insights
  }

  getLocalFallbackInsights(weeklyData: MoodEntry[]): string[] {
    if (weeklyData.length === 0) {
      return ['Start logging your moods to get personalized insights! 🌟'];
    }

    const insights: string[] = [];
    const moods = weeklyData.map(entry => entry.moodType);
    const intensities = weeklyData.map(entry => entry.intensity);
    const avgIntensity = intensities.reduce((a, b) => a + b, 0) / intensities.length;

    // Streak insight
    if (weeklyData.length >= 3) {
      insights.push(`You've been consistent with tracking - ${weeklyData.length} entries this week! 📊`);
    }

    // Intensity insight
    if (avgIntensity >= 7) {
      insights.push('Your mood has been quite positive this week! 😊');
    } else if (avgIntensity >= 5) {
      insights.push('You\'re maintaining balanced emotions. Keep it up! ⚖️');
    } else {
      insights.push('Remember: it\'s okay to have challenging days. You\'re not alone 💙');
    }

    // Activity correlation insight
    const allTags = weeklyData.flatMap(entry => entry.tags || []);
    const tagCounts = allTags.reduce((acc, tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const mostCommonTag = Object.entries(tagCounts).sort(([,a], [,b]) => b - a)[0];
    if (mostCommonTag && mostCommonTag[1] >= 2) {
      insights.push(`${mostCommonTag[0]} seems to be a recurring theme this week 🔄`);
    }

    return insights.slice(0, 2);
  }

  async generateInsights(): Promise<string[]> {
    try {
      // Check if we have enough data (minimum 7 days as per PRD)
      const weeklyData = await databaseService.getWeeklyMoodData();
      
      if (weeklyData.length < 3) {
        return this.getLocalFallbackInsights(weeklyData);
      }

      // Check rate limiting
      const canMakeRequest = await this.checkRateLimit();
      if (!canMakeRequest) {
        console.log('Rate limit reached, using local fallback');
        return this.getLocalFallbackInsights(weeklyData);
      }

      // Try OpenAI API
      try {
        const prompt = this.createPrompt(weeklyData);
        const insights = await this.callOpenAI(prompt);
        await this.incrementRequestCount();
        
        // Save insights to database
        const dateRange = `${weeklyData[weeklyData.length - 1]?.date} to ${weeklyData[0]?.date}`;
        for (const insight of insights) {
          await databaseService.saveAIInsight(insight, 'weekly', dateRange);
        }
        
        return insights;
      } catch (apiError) {
        console.log('OpenAI API failed, using local fallback:', apiError);
        return this.getLocalFallbackInsights(weeklyData);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
      return ['Unable to generate insights right now. Try again later! 🔄'];
    }
  }

  async getLatestInsight(): Promise<string | null> {
    try {
      const insights = await databaseService.getAIInsights(1);
      return insights[0]?.insightText || null;
    } catch (error) {
      console.error('Error getting latest insight:', error);
      return null;
    }
  }
}

export const aiService = new AIService(); 