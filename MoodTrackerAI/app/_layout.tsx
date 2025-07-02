import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import { databaseService } from '../src/services/database';

export default function RootLayout() {
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        await databaseService.initialize();
        // Clean up old entries (2+ years)
        await databaseService.cleanupOldEntries();
        setIsDbReady(true);
      } catch (error) {
        console.error('Failed to initialize database:', error);
        // Still allow app to continue with fallback behavior
        setIsDbReady(true);
      }
    };

    initializeDatabase();
  }, []);

  if (!isDbReady) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" backgroundColor="#FAFAFA" />
        <Text style={styles.loadingText}>Loading MoodTracker AI...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="dark" backgroundColor="#FAFAFA" />
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#FAFAFA',
          },
          headerTintColor: '#2C2C2C',
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      >
        <Stack.Screen
          name="index"
          options={{
            title: 'MoodTracker AI',
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="log-mood"
          options={{
            title: 'Log Your Mood',
            presentation: 'modal',
          }}
        />
        <Stack.Screen
          name="history"
          options={{
            title: 'Mood History',
          }}
        />
      </Stack>
    </>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#FAFAFA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#6B73FF',
    fontWeight: '600',
  },
}); 