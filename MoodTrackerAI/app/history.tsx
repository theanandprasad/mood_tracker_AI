import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  FlatList,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useMoodData, useMoodStats } from '../src/hooks/useMoodData';
import { getIntensityColor } from '../src/constants/moods';
import { MoodEntry, ViewMode } from '../src/types';
import { formatDateForDisplay } from '../src/utils/dateUtils';
import { CalendarView } from '../src/components/CalendarView';

export default function HistoryScreen() {
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const { moodEntries, loading } = useMoodData();
  const { stats } = useMoodStats();





  const renderMoodEntry = ({ item }: { item: MoodEntry }) => (
    <View style={styles.moodEntryCard}>
      <View style={styles.moodEntryHeader}>
        <View style={styles.moodEntryLeft}>
          <Text style={styles.moodEmoji}>{item.emoji}</Text>
          <View style={styles.moodEntryInfo}>
            <Text style={styles.moodType}>{item.moodType}</Text>
            <Text style={styles.moodDate}>{formatDateForDisplay(item.date)}</Text>
          </View>
        </View>
        <View style={styles.intensityContainer}>
          <View style={[
            styles.intensityBadge,
            { backgroundColor: getIntensityColor(item.intensity) }
          ]}>
            <Text style={styles.intensityText}>{item.intensity}</Text>
          </View>
        </View>
      </View>
      
      {item.note && (
        <Text style={styles.moodNote}>{item.note}</Text>
      )}
      
      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );

  const handleDatePress = (date: string, entry?: MoodEntry) => {
    if (entry) {
      // Could show a detailed view or edit modal here
      console.log('Date pressed:', date, entry);
    }
  };

  const renderCalendarView = () => (
    <CalendarView 
      moodEntries={moodEntries} 
      onDatePress={handleDatePress}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with View Toggle */}
      <View style={styles.header}>
        <Text style={styles.title}>Mood History</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('list')}
          >
            <MaterialIcons 
              name="list" 
              size={20} 
              color={viewMode === 'list' ? '#FFFFFF' : '#6B73FF'} 
            />
            <Text style={[
              styles.toggleText,
              viewMode === 'list' && styles.toggleTextActive
            ]}>
              List
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'calendar' && styles.toggleButtonActive
            ]}
            onPress={() => setViewMode('calendar')}
          >
            <MaterialIcons 
              name="calendar-today" 
              size={20} 
              color={viewMode === 'calendar' ? '#FFFFFF' : '#6B73FF'} 
            />
            <Text style={[
              styles.toggleText,
              viewMode === 'calendar' && styles.toggleTextActive
            ]}>
              Calendar
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats Summary */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.totalEntries}</Text>
          <Text style={styles.statLabel}>Total Entries</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.currentStreak}</Text>
          <Text style={styles.statLabel}>Day Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{stats.mostCommonMood}</Text>
          <Text style={styles.statLabel}>Most Common</Text>
        </View>
      </View>

      {/* Content */}
      {viewMode === 'list' ? (
        <FlatList
          data={moodEntries}
          renderItem={renderMoodEntry}
          keyExtractor={(item) => item.id}
          style={styles.moodList}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        renderCalendarView()
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C2C',
  },
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#E1E5E9',
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleButtonActive: {
    backgroundColor: '#6B73FF',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B73FF',
    marginLeft: 4,
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  statsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 20,
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    flex: 1,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B73FF',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
  },
  moodList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  moodEntryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  moodEntryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  moodEntryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  moodEntryInfo: {
    flex: 1,
  },
  moodType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2C',
    textTransform: 'capitalize',
  },
  moodDate: {
    fontSize: 14,
    color: '#8E8E93',
  },
  intensityContainer: {
    alignItems: 'flex-end',
  },
  intensityBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intensityText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  moodNote: {
    fontSize: 14,
    color: '#2C2C2C',
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#F0F1FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#6B73FF',
    fontWeight: '500',
  },
}); 