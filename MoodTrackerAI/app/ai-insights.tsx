import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAIInsights } from '../src/hooks/useAIInsights';
import { aiService } from '../src/services/aiService';
import { MoodValidation, ErrorHandler } from '../src/utils/validation';

export default function AIInsightsScreen() {
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSavingKey, setIsSavingKey] = useState(false);

  const {
    insights,
    loading,
    error,
    generateNewInsights,
    markInsightAsRead,
    shouldGenerateNewInsights,
  } = useAIInsights();

  const handleGenerateInsights = async () => {
    setIsGenerating(true);
    try {
      const newInsights = await generateNewInsights();
      if (newInsights.length > 0) {
        Alert.alert(
          'Success!',
          `Generated ${newInsights.length} new insight${newInsights.length === 1 ? '' : 's'}!`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'No new insights',
          'Not enough mood data or insights already generated today.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      const errorMessage = ErrorHandler.handleNetworkError(error);
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveApiKey = async () => {
    const validation = MoodValidation.validateApiKey(apiKey);
    
    if (!validation.isValid) {
      Alert.alert(
        'Invalid API Key',
        validation.errors.join('\n'),
        [{ text: 'OK' }]
      );
      return;
    }

    setIsSavingKey(true);
    try {
      await aiService.setApiKey(apiKey);
      setShowApiKeyInput(false);
      setApiKey('');
      Alert.alert(
        'Success!',
        'OpenAI API key saved successfully. You can now generate AI insights!',
        [{ text: 'OK' }]
      );
    } catch (error) {
      const errorMessage = ErrorHandler.handleGenericError(error);
      Alert.alert('Error', errorMessage, [{ text: 'OK' }]);
    } finally {
      setIsSavingKey(false);
    }
  };

  const renderInsight = (insight: any, index: number) => (
    <TouchableOpacity
      key={insight.id}
      style={[styles.insightCard, !insight.isRead && styles.insightUnread]}
      onPress={() => markInsightAsRead(insight.id)}
    >
      <View style={styles.insightHeader}>
        <MaterialIcons 
          name="psychology" 
          size={20} 
          color="#6B73FF" 
        />
        <View style={styles.insightMeta}>
          <Text style={styles.insightType}>
            {insight.insightType.charAt(0).toUpperCase() + insight.insightType.slice(1)} Insight
          </Text>
          <Text style={styles.insightDate}>
            {new Date(insight.createdAt).toLocaleDateString()}
          </Text>
        </View>
        {!insight.isRead && (
          <View style={styles.unreadDot} />
        )}
      </View>
      
      <Text style={styles.insightText}>{insight.insightText}</Text>
      
      {insight.dateRange && (
        <Text style={styles.dateRange}>
          Based on: {insight.dateRange}
        </Text>
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>AI Insights</Text>
          <Text style={styles.subtitle}>
            Personalized insights powered by AI to help you understand your mood patterns
          </Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.button, styles.primaryButton]}
            onPress={handleGenerateInsights}
            disabled={isGenerating}
          >
            <MaterialIcons 
              name={isGenerating ? "hourglass-empty" : "auto-awesome"} 
              size={20} 
              color="#FFFFFF" 
            />
            <Text style={styles.buttonText}>
              {isGenerating ? 'Generating...' : 'Generate New Insights'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.secondaryButton]}
            onPress={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            <MaterialIcons name="key" size={20} color="#6B73FF" />
            <Text style={styles.secondaryButtonText}>
              {showApiKeyInput ? 'Cancel' : 'Configure API Key'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* API Key Input */}
        {showApiKeyInput && (
          <View style={styles.apiKeySection}>
            <Text style={styles.apiKeyTitle}>OpenAI API Key</Text>
            <Text style={styles.apiKeyDescription}>
              Enter your OpenAI API key to enable AI-powered insights. 
              Your key is stored securely on your device.
            </Text>
            
            <TextInput
              style={styles.apiKeyInput}
              placeholder="sk-..."
              value={apiKey}
              onChangeText={setApiKey}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity
              style={[styles.button, styles.saveButton]}
              onPress={handleSaveApiKey}
              disabled={isSavingKey || !apiKey.trim()}
            >
              <MaterialIcons 
                name={isSavingKey ? "hourglass-empty" : "save"} 
                size={20} 
                color="#FFFFFF" 
              />
              <Text style={styles.buttonText}>
                {isSavingKey ? 'Saving...' : 'Save API Key'}
              </Text>
            </TouchableOpacity>
            
            <Text style={styles.helpText}>
              Get your API key from OpenAI Platform: platform.openai.com
            </Text>
          </View>
        )}

        {/* Insights List */}
        <View style={styles.insightsSection}>
          <Text style={styles.sectionTitle}>
            Your Insights ({insights.length})
          </Text>
          
          {loading && (
            <View style={styles.loadingContainer}>
              <MaterialIcons name="hourglass-empty" size={24} color="#6B73FF" />
              <Text style={styles.loadingText}>Loading insights...</Text>
            </View>
          )}
          
          {error && (
            <View style={styles.errorContainer}>
              <MaterialIcons name="error-outline" size={24} color="#FF6B6B" />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}
          
          {!loading && !error && insights.length === 0 && (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="psychology" size={48} color="#E1E5E9" />
              <Text style={styles.emptyTitle}>No insights yet</Text>
              <Text style={styles.emptyText}>
                Start logging your moods to get personalized AI insights!
              </Text>
            </View>
          )}
          
          {insights.length > 0 && (
            <View style={styles.insightsList}>
              {insights.map(renderInsight)}
            </View>
          )}
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
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    lineHeight: 22,
  },
  actionButtons: {
    gap: 12,
    marginBottom: 30,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#6B73FF',
    shadowColor: '#6B73FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  secondaryButton: {
    backgroundColor: '#F0F1FF',
    borderWidth: 1,
    borderColor: '#6B73FF',
  },
  saveButton: {
    backgroundColor: '#4ECDC4',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    color: '#6B73FF',
    fontSize: 16,
    fontWeight: '600',
  },
  apiKeySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  apiKeyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 8,
  },
  apiKeyDescription: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 16,
  },
  apiKeyInput: {
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: '#2C2C2C',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E1E5E9',
  },
  helpText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    marginTop: 8,
  },
  insightsSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C2C2C',
    marginBottom: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B73FF',
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  errorText: {
    fontSize: 16,
    color: '#FF6B6B',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C2C2C',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
  },
  insightsList: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  insightUnread: {
    borderLeftWidth: 4,
    borderLeftColor: '#6B73FF',
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  insightMeta: {
    flex: 1,
    marginLeft: 12,
  },
  insightType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B73FF',
  },
  insightDate: {
    fontSize: 12,
    color: '#8E8E93',
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6B73FF',
  },
  insightText: {
    fontSize: 16,
    color: '#2C2C2C',
    lineHeight: 22,
    marginBottom: 8,
  },
  dateRange: {
    fontSize: 12,
    color: '#8E8E93',
    fontStyle: 'italic',
  },
}); 