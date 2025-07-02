import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { MOOD_OPTIONS, ACTIVITY_TAGS } from '../src/constants/moods';
import { MoodOption } from '../src/types';
import { useMoodData } from '../src/hooks/useMoodData';
import { MoodValidation, ErrorHandler } from '../src/utils/validation';

export default function LogMoodScreen() {
  const [selectedMood, setSelectedMood] = useState<MoodOption | null>(null);
  const [intensity, setIntensity] = useState<number>(5);
  const [note, setNote] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  const { saveMoodEntry } = useMoodData();

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSaveMood = async () => {
    setIsSaving(true);

    try {
      // Validate the mood entry
      const validationData = {
        emoji: selectedMood?.emoji,
        moodType: selectedMood?.type,
        intensity,
        note: note.trim(),
        tags: selectedTags,
      };

      const validation = MoodValidation.validateMoodEntry(validationData);
      
      if (!validation.isValid) {
        Alert.alert(
          'Validation Error', 
          validation.errors.join('\n'),
          [{ text: 'OK' }]
        );
        return;
      }

      const now = new Date();
      const moodEntry = {
        date: now.toISOString().split('T')[0], // YYYY-MM-DD format
        timestamp: now.getTime(),
        emoji: selectedMood!.emoji,
        moodType: selectedMood!.type,
        intensity,
        note: MoodValidation.sanitizeNote(note) || undefined,
        tags: selectedTags,
      };

      await saveMoodEntry(moodEntry);
      
      Alert.alert(
        'Mood Saved!', 
        'Your mood has been logged successfully.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          }
        ]
      );
    } catch (error) {
      const errorMessage = ErrorHandler.handleDatabaseError(error);
      Alert.alert(
        'Error', 
        errorMessage,
        [{ text: 'OK' }]
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How are you feeling?</Text>
          <Text style={styles.subtitle}>Select the emoji that best represents your mood</Text>
        </View>

        {/* Mood Selector */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>Choose Your Mood</Text>
          <View style={styles.moodGrid}>
            {MOOD_OPTIONS.map((mood) => (
              <TouchableOpacity
                key={mood.type}
                style={[
                  styles.moodOption,
                  selectedMood?.type === mood.type && styles.moodOptionSelected
                ]}
                onPress={() => setSelectedMood(mood)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={[
                  styles.moodLabel,
                  selectedMood?.type === mood.type && styles.moodLabelSelected
                ]}>
                  {mood.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Intensity Slider */}
        <View style={styles.intensitySection}>
          <Text style={styles.sectionTitle}>Intensity Level</Text>
          <Text style={styles.intensityValue}>{intensity}/10</Text>
          <Slider
            style={styles.slider}
            minimumValue={1}
            maximumValue={10}
            step={1}
            value={intensity}
            onValueChange={setIntensity}
            minimumTrackTintColor="#6B73FF"
            maximumTrackTintColor="#E1E5E9"
            thumbTintColor="#6B73FF"
          />
          <View style={styles.intensityLabels}>
            <Text style={styles.intensityLabel}>Low</Text>
            <Text style={styles.intensityLabel}>High</Text>
          </View>
        </View>

        {/* Note Input */}
        <View style={styles.noteSection}>
          <Text style={styles.sectionTitle}>Add a Note (Optional)</Text>
          <TextInput
            style={styles.noteInput}
            placeholder="What's on your mind? (200 characters max)"
            value={note}
            onChangeText={setNote}
            maxLength={200}
            multiline
            textAlignVertical="top"
          />
          <Text style={styles.characterCount}>{note.length}/200</Text>
        </View>

        {/* Activity Tags */}
        <View style={styles.tagsSection}>
          <Text style={styles.sectionTitle}>Activity Tags (Optional)</Text>
          <View style={styles.tagsGrid}>
            {ACTIVITY_TAGS.map((tag) => (
              <TouchableOpacity
                key={tag}
                style={[
                  styles.tag,
                  selectedTags.includes(tag) && styles.tagSelected
                ]}
                onPress={() => handleTagToggle(tag)}
              >
                <Text style={[
                  styles.tagText,
                  selectedTags.includes(tag) && styles.tagTextSelected
                ]}>
                  {tag}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            (!selectedMood || isSaving) && styles.saveButtonDisabled
          ]}
          onPress={handleSaveMood}
          disabled={!selectedMood || isSaving}
        >
          <MaterialIcons 
            name={isSaving ? "hourglass-empty" : "check-circle"} 
            size={24} 
            color={selectedMood && !isSaving ? "#FFFFFF" : "#CCCCCC"} 
          />
          <Text style={[
            styles.saveButtonText,
            (!selectedMood || isSaving) && styles.saveButtonTextDisabled
          ]}>
            {isSaving ? 'Saving...' : 'Save Mood'}
          </Text>
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  moodSection: {
    marginBottom: 30,
  },
  moodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  moodOption: {
    width: '18%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
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
  moodOptionSelected: {
    backgroundColor: '#6B73FF',
    transform: [{ scale: 1.05 }],
  },
  moodEmoji: {
    fontSize: 28,
    marginBottom: 4,
  },
  moodLabel: {
    fontSize: 10,
    color: '#2C2C2C',
    textAlign: 'center',
    fontWeight: '500',
  },
  moodLabelSelected: {
    color: '#FFFFFF',
  },
  intensitySection: {
    marginBottom: 30,
  },
  intensityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#6B73FF',
    textAlign: 'center',
    marginBottom: 16,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  intensityLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  intensityLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  noteSection: {
    marginBottom: 30,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  characterCount: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 8,
  },
  tagsSection: {
    marginBottom: 40,
  },
  tagsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagSelected: {
    backgroundColor: '#6B73FF',
  },
  tagText: {
    fontSize: 14,
    color: '#2C2C2C',
    fontWeight: '500',
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#6B73FF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    shadowColor: '#6B73FF',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#E1E5E9',
    shadowOpacity: 0.1,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 8,
  },
  saveButtonTextDisabled: {
    color: '#CCCCCC',
  },
}); 