import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { MoodEntry } from '../types';
import { getIntensityColor } from '../constants/moods';

interface CalendarViewProps {
  moodEntries: MoodEntry[];
  onDatePress?: (date: string, entry?: MoodEntry) => void;
}

interface CalendarDay {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  moodEntry?: MoodEntry;
  isToday: boolean;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ moodEntries, onDatePress }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<CalendarDay[]>([]);

  const screenWidth = Dimensions.get('window').width;
  const daySize = (screenWidth - 60) / 7; // Account for padding

  useEffect(() => {
    generateCalendarDays();
  }, [currentDate, moodEntries]);

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week (0 = Sunday, 1 = Monday, etc.)
    const startDayOfWeek = firstDay.getDay();
    
    const days: CalendarDay[] = [];
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    
    // Add previous month's days to fill the first week
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateStr = date.toISOString().split('T')[0];
      const moodEntry = moodEntries.find(entry => entry.date === dateStr);
      
      days.push({
        date: dateStr,
        dayNumber: date.getDate(),
        isCurrentMonth: false,
        moodEntry,
        isToday: dateStr === todayStr,
      });
    }
    
    // Add current month's days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const moodEntry = moodEntries.find(entry => entry.date === dateStr);
      
      days.push({
        date: dateStr,
        dayNumber: day,
        isCurrentMonth: true,
        moodEntry,
        isToday: dateStr === todayStr,
      });
    }
    
    // Add next month's days to fill the last week (if needed)
    const totalCells = Math.ceil(days.length / 7) * 7;
    for (let day = 1; days.length < totalCells; day++) {
      const date = new Date(year, month + 1, day);
      const dateStr = date.toISOString().split('T')[0];
      const moodEntry = moodEntries.find(entry => entry.date === dateStr);
      
      days.push({
        date: dateStr,
        dayNumber: day,
        isCurrentMonth: false,
        moodEntry,
        isToday: dateStr === todayStr,
      });
    }
    
    setCalendarDays(days);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatMonthYear = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric',
    });
  };

  const renderDay = (day: CalendarDay) => {
    const dayStyle = [
      styles.dayCell,
      { width: daySize, height: daySize },
      !day.isCurrentMonth && styles.dayInactive,
      day.isToday && styles.dayToday,
    ];

    const dayTextStyle = [
      styles.dayText,
      !day.isCurrentMonth && styles.dayTextInactive,
      day.isToday && styles.dayTextToday,
    ];

    return (
      <TouchableOpacity
        key={day.date}
        style={dayStyle}
        onPress={() => onDatePress?.(day.date, day.moodEntry)}
        activeOpacity={0.7}
      >
        <Text style={dayTextStyle}>{day.dayNumber}</Text>
        {day.moodEntry && (
          <View style={styles.moodIndicator}>
            <Text style={styles.moodEmoji}>{day.moodEntry.emoji}</Text>
            <View
              style={[
                styles.intensityDot,
                { backgroundColor: getIntensityColor(day.moodEntry.intensity) },
              ]}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <View style={styles.container}>
      {/* Calendar Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('prev')}
        >
          <MaterialIcons name="chevron-left" size={24} color="#6B73FF" />
        </TouchableOpacity>
        
        <Text style={styles.monthText}>{formatMonthYear(currentDate)}</Text>
        
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigateMonth('next')}
        >
          <MaterialIcons name="chevron-right" size={24} color="#6B73FF" />
        </TouchableOpacity>
      </View>

      {/* Week Days Header */}
      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <View key={day} style={[styles.weekDayCell, { width: daySize }]}>
            <Text style={styles.weekDayText}>{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <ScrollView contentContainerStyle={styles.calendarGrid}>
        <View style={styles.weeksContainer}>
          {Array.from({ length: Math.ceil(calendarDays.length / 7) }, (_, weekIndex) => (
            <View key={weekIndex} style={styles.weekRow}>
              {calendarDays
                .slice(weekIndex * 7, (weekIndex + 1) * 7)
                .map(renderDay)}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Legend */}
      <View style={styles.legend}>
        <Text style={styles.legendTitle}>Mood Intensity:</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(9) }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(6) }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(4) }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: getIntensityColor(2) }]} />
            <Text style={styles.legendText}>Very Low</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  navButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F0F1FF',
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
  },
  weekDaysContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  weekDayCell: {
    alignItems: 'center',
  },
  weekDayText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#8E8E93',
  },
  calendarGrid: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  weeksContainer: {
    gap: 4,
  },
  weekRow: {
    flexDirection: 'row',
    gap: 4,
  },
  dayCell: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  dayInactive: {
    backgroundColor: '#F8F8F8',
  },
  dayToday: {
    backgroundColor: '#6B73FF',
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C2C2C',
  },
  dayTextInactive: {
    color: '#CCCCCC',
  },
  dayTextToday: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  moodIndicator: {
    position: 'absolute',
    bottom: 4,
    alignItems: 'center',
  },
  moodEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  intensityDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  legend: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E1E5E9',
  },
  legendTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 12,
    color: '#8E8E93',
  },
}); 