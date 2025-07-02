import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Link } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useMoodData, useMoodStats } from '../src/hooks/useMoodData';
import { MoodEntry } from '../src/types';

export default function HomeScreen() {
  const [todaysMood, setTodaysMood] = useState<MoodEntry | null>(null);
  const [yesterdaysMood, setYesterdaysMood] = useState<MoodEntry | null>(null);
  
  const { getTodaysMood, moodEntries } = useMoodData();
  const { stats, loading: statsLoading } = useMoodStats();
  
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  useEffect(() => {
    const loadTodaysData = async () => {
      const todayMood = await getTodaysMood();
      setTodaysMood(todayMood);
      
      // Get yesterday's mood for display
      if (moodEntries.length > 0) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];
        const yesterdayEntry = moodEntries.find(entry => entry.date === yesterdayStr);
        setYesterdaysMood(yesterdayEntry || null);
      }
    };
    
    loadTodaysData();
  }, [moodEntries]);

  const hasMoodToday = todaysMood !== null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>MoodTracker AI</Text>
          <Text style={styles.subtitle}>How are you feeling today?</Text>
          <Text style={styles.date}>{currentDate}</Text>
        </View>

        {/* Streak Counter */}
        <View style={styles.streakContainer}>
          <MaterialIcons name="local-fire-department" size={24} color="#FF9500" />
          <Text style={styles.streakText}>
            {stats.currentStreak} day{stats.currentStreak !== 1 ? 's' : ''} streak!
          </Text>
        </View>

        {/* Main Action Button */}
        <View style={styles.actionContainer}>
          <Link href="/log-mood" asChild>
            <TouchableOpacity
              style={[
                styles.logButton,
                hasMoodToday && styles.logButtonComplete
              ]}
            >
              <MaterialIcons
                name={hasMoodToday ? "check-circle" : "add-circle"}
                size={32}
                color="#FFFFFF"
              />
              <Text style={styles.logButtonText}>
                {hasMoodToday ? "Mood Logged Today" : "Log Today's Mood"}
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Link href="/history" asChild>
            <TouchableOpacity style={styles.quickActionButton}>
              <MaterialIcons name="history" size={24} color="#6B73FF" />
              <Text style={styles.quickActionText}>View History</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity style={styles.quickActionButton}>
            <MaterialIcons name="insights" size={24} color="#6B73FF" />
            <Text style={styles.quickActionText}>AI Insights</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Mood */}
        {yesterdaysMood && (
          <View style={styles.recentMoodContainer}>
            <Text style={styles.sectionTitle}>Yesterday's Mood</Text>
            <View style={styles.recentMoodCard}>
              <Text style={styles.recentMoodEmoji}>{yesterdaysMood.emoji}</Text>
              <View style={styles.recentMoodContent}>
                <Text style={styles.recentMoodText}>
                  {yesterdaysMood.moodType.charAt(0).toUpperCase() + yesterdaysMood.moodType.slice(1)}
                </Text>
                {yesterdaysMood.note && (
                  <Text style={styles.recentMoodNote}>
                    "{yesterdaysMood.note}"
                  </Text>
                )}
              </View>
            </View>
          </View>
        )}

        {/* AI Insight Preview (Mock) */}
        <View style={styles.insightContainer}>
          <Text style={styles.sectionTitle}>Weekly Insight</Text>
          <View style={styles.insightCard}>
            <MaterialIcons name="psychology" size={20} color="#6B73FF" />
            <Text style={styles.insightText}>
              You've felt energetic 3 days in a row! 💪
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6B73FF',
    marginBottom: 4,
  },
  date: {
    fontSize: 14,
    color: '#8E8E93',
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  streakText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginLeft: 8,
  },
  actionContainer: {
    marginBottom: 30,
  },
  logButton: {
    backgroundColor: '#6B73FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 20,
    shadowColor: '#6B73FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  logButtonComplete: {
    backgroundColor: '#4ECDC4',
  },
  logButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  quickActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
    marginTop: 8,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 12,
  },
  recentMoodContainer: {
    marginBottom: 30,
  },
  recentMoodCard: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  recentMoodEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  recentMoodContent: {
    flex: 1,
  },
  recentMoodText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 4,
  },
  recentMoodNote: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
  },
  insightContainer: {
    marginBottom: 20,
  },
  insightCard: {
    backgroundColor: '#F0F1FF',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#6B73FF',
  },
  insightText: {
    fontSize: 14,
    color: '#2C2C2C',
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
}); 