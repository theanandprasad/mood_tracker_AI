export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

export class MoodValidation {
  static validateMoodEntry(data: {
    emoji?: string;
    moodType?: string;
    intensity?: number;
    note?: string;
    tags?: string[];
  }): ValidationResult {
    const errors: string[] = [];

    // Required fields
    if (!data.emoji || !data.moodType) {
      errors.push('Please select a mood emoji');
    }

    if (data.intensity === undefined || data.intensity === null) {
      errors.push('Please set an intensity level');
    }

    // Intensity validation
    if (data.intensity !== undefined && (data.intensity < 1 || data.intensity > 10)) {
      errors.push('Intensity must be between 1 and 10');
    }

    // Note validation
    if (data.note && data.note.length > 200) {
      errors.push('Note must be 200 characters or less');
    }

    // Tags validation
    if (data.tags && data.tags.length > 10) {
      errors.push('Maximum 10 tags allowed');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  static sanitizeNote(note: string): string {
    return note.trim().slice(0, 200);
  }

  static validateApiKey(apiKey: string): ValidationResult {
    const errors: string[] = [];

    if (!apiKey || apiKey.trim().length === 0) {
      errors.push('API key is required');
    }

    if (apiKey && !apiKey.startsWith('sk-')) {
      errors.push('Invalid OpenAI API key format');
    }

    if (apiKey && apiKey.length < 20) {
      errors.push('API key appears to be too short');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export class ErrorHandler {
  static handleDatabaseError(error: any): string {
    console.error('Database error:', error);
    
    if (error.message?.includes('no such table')) {
      return 'Database not properly initialized. Please restart the app.';
    }
    
    if (error.message?.includes('UNIQUE constraint')) {
      return 'This entry already exists.';
    }
    
    if (error.message?.includes('disk full')) {
      return 'Not enough storage space available.';
    }
    
    return 'A database error occurred. Please try again.';
  }

  static handleNetworkError(error: any): string {
    console.error('Network error:', error);
    
    if (error.message?.includes('Network request failed')) {
      return 'No internet connection available.';
    }
    
    if (error.message?.includes('timeout')) {
      return 'Request timed out. Please check your connection.';
    }
    
    if (error.message?.includes('401')) {
      return 'Invalid API key. Please check your OpenAI API key.';
    }
    
    if (error.message?.includes('429')) {
      return 'API rate limit exceeded. Please try again later.';
    }
    
    if (error.message?.includes('500')) {
      return 'Server error. Please try again later.';
    }
    
    return 'Network error. Please check your connection and try again.';
  }

  static handleGenericError(error: any): string {
    console.error('Generic error:', error);
    
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
}