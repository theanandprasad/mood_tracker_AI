import * as SQLite from 'expo-sqlite';
import { MoodEntry, UserPreferences } from '../types';

class DatabaseService {
  private db: SQLite.SQLiteDatabase | null = null;

  async initialize(): Promise<void> {
    try {
      this.db = await SQLite.openDatabaseAsync('mood_tracker.db');
      await this.createTables();
    } catch (error) {
      console.error('Database initialization failed:', error);
      throw error;
    }
  }

  private async createTables(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    // Create mood_entries table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS mood_entries (
        id TEXT PRIMARY KEY,
        date TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        emoji TEXT NOT NULL,
        mood_type TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        note TEXT,
        tags TEXT,
        created_at INTEGER NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Create user_preferences table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS user_preferences (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        updated_at INTEGER NOT NULL
      );
    `);

    // Create AI insights table
    await this.db.execAsync(`
      CREATE TABLE IF NOT EXISTS ai_insights (
        id TEXT PRIMARY KEY,
        insight_text TEXT NOT NULL,
        insight_type TEXT NOT NULL,
        date_range TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        is_read BOOLEAN DEFAULT FALSE
      );
    `);

    // Create index for better query performance
    await this.db.execAsync(`
      CREATE INDEX IF NOT EXISTS idx_mood_entries_date ON mood_entries(date);
    `);
  }

  async saveMoodEntry(moodData: Omit<MoodEntry, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `mood_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();
    const tagsJson = JSON.stringify(moodData.tags);

    await this.db.runAsync(
      `INSERT INTO mood_entries (id, date, timestamp, emoji, mood_type, intensity, note, tags, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, moodData.date, moodData.timestamp, moodData.emoji, moodData.moodType, moodData.intensity, moodData.note || null, tagsJson, now, now]
    );

    return id;
  }

  async getMoodEntries(limit?: number): Promise<MoodEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const query = `
      SELECT * FROM mood_entries 
      ORDER BY timestamp DESC 
      ${limit ? `LIMIT ${limit}` : ''}
    `;

    const result = await this.db.getAllAsync(query);
    
    return result.map((row: any) => ({
      id: row.id,
      date: row.date,
      timestamp: row.timestamp,
      emoji: row.emoji,
      moodType: row.mood_type,
      intensity: row.intensity,
      note: row.note,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }

  async getMoodEntryByDate(date: string): Promise<MoodEntry | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      'SELECT * FROM mood_entries WHERE date = ? ORDER BY timestamp DESC LIMIT 1',
      [date]
    );

    if (!result) return null;

    const row = result as any;
    return {
      id: row.id,
      date: row.date,
      timestamp: row.timestamp,
      emoji: row.emoji,
      moodType: row.mood_type,
      intensity: row.intensity,
      note: row.note,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async getStreakCount(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let currentDate = new Date();

    // Check each day backwards until we find a gap
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0];
      const entry = await this.getMoodEntryByDate(dateStr);
      
      if (entry) {
        streak++;
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        // If today has no entry, don't break the streak yet
        if (dateStr === today) {
          currentDate.setDate(currentDate.getDate() - 1);
          continue;
        }
        break;
      }
    }

    return streak;
  }

  async getTotalEntries(): Promise<number> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync('SELECT COUNT(*) as count FROM mood_entries');
    return (result as any)?.count || 0;
  }

  async getMostCommonMood(): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(`
      SELECT emoji, COUNT(*) as count 
      FROM mood_entries 
      GROUP BY emoji 
      ORDER BY count DESC 
      LIMIT 1
    `);

    return (result as any)?.emoji || '😊';
  }

  async cleanupOldEntries(): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const twoYearsAgo = Date.now() - (2 * 365 * 24 * 60 * 60 * 1000);
    await this.db.runAsync('DELETE FROM mood_entries WHERE created_at < ?', [twoYearsAgo]);
  }

  async setUserPreference(key: string, value: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    const now = Date.now();
    await this.db.runAsync(
      'INSERT OR REPLACE INTO user_preferences (key, value, updated_at) VALUES (?, ?, ?)',
      [key, value, now]
    );
  }

  async getUserPreference(key: string): Promise<string | null> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getFirstAsync(
      'SELECT value FROM user_preferences WHERE key = ?',
      [key]
    );

    return (result as any)?.value || null;
  }

  async saveAIInsight(insightText: string, insightType: string, dateRange: string): Promise<string> {
    if (!this.db) throw new Error('Database not initialized');

    const id = `insight_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const now = Date.now();

    await this.db.runAsync(
      'INSERT INTO ai_insights (id, insight_text, insight_type, date_range, created_at, is_read) VALUES (?, ?, ?, ?, ?, ?)',
      [id, insightText, insightType, dateRange, now, false]
    );

    return id;
  }

  async getAIInsights(limit: number = 5): Promise<any[]> {
    if (!this.db) throw new Error('Database not initialized');

    const result = await this.db.getAllAsync(
      'SELECT * FROM ai_insights ORDER BY created_at DESC LIMIT ?',
      [limit]
    );

    return result.map((row: any) => ({
      id: row.id,
      insightText: row.insight_text,
      insightType: row.insight_type,
      dateRange: row.date_range,
      createdAt: row.created_at,
      isRead: row.is_read === 1,
    }));
  }

  async markInsightAsRead(insightId: string): Promise<void> {
    if (!this.db) throw new Error('Database not initialized');

    await this.db.runAsync(
      'UPDATE ai_insights SET is_read = ? WHERE id = ?',
      [true, insightId]
    );
  }

  async getWeeklyMoodData(): Promise<MoodEntry[]> {
    if (!this.db) throw new Error('Database not initialized');

    const oneWeekAgo = Date.now() - (7 * 24 * 60 * 60 * 1000);
    const result = await this.db.getAllAsync(
      'SELECT * FROM mood_entries WHERE created_at >= ? ORDER BY timestamp DESC',
      [oneWeekAgo]
    );

    return result.map((row: any) => ({
      id: row.id,
      date: row.date,
      timestamp: row.timestamp,
      emoji: row.emoji,
      moodType: row.mood_type,
      intensity: row.intensity,
      note: row.note,
      tags: JSON.parse(row.tags || '[]'),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  }
}

// Export singleton instance
export const databaseService = new DatabaseService(); 