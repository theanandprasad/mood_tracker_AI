# MoodTracker AI - Product Requirements Document (PRD)

## 1. Executive Summary

**App Name:** MoodTracker AI  
**Platform:** iOS & Android (React Native with Expo)  
**Target Launch:** Q2 2024  
**Version:** 1.0.0  

MoodTracker AI is a minimalist daily mood tracking application that combines simple user input with AI-powered insights to help users understand their emotional patterns and mental well-being trends over time.

## 2. App Overview

### 2.1 Mission Statement
To provide users with a simple, intuitive way to track their daily emotional state while leveraging AI to deliver meaningful insights about their mood patterns and mental well-being.

### 2.2 Core Value Proposition
- **Simplicity First:** Quick daily mood logging in under 30 seconds
- **AI-Powered Insights:** Intelligent analysis of mood trends and patterns
- **Privacy-Focused:** Local data storage with optional cloud backup
- **Beautiful Design:** Minimalist, calming interface that encourages daily use

### 2.3 Key Success Metrics
- Daily Active Users (DAU) retention > 60% after 30 days
- Average session time: 2-3 minutes
- Daily mood logging rate > 80% for active users
- User satisfaction score > 4.5/5

## 3. Target Audience

### 3.1 Primary Users
- **Age:** 18-45 years old
- **Demographics:** Health-conscious individuals interested in mental wellness
- **Behavior:** Regular smartphone users, familiar with wellness apps
- **Pain Points:** Difficulty tracking emotional patterns, lack of insight into mood triggers

### 3.2 User Personas

**Sarah (26, Marketing Professional)**
- Works in high-stress environment
- Interested in mental health awareness
- Uses wellness apps regularly
- Values data-driven insights about her well-being

**Mark (34, Parent)**
- Balancing work and family life
- Wants to understand his emotional patterns
- Prefers simple, quick solutions
- Values privacy and data security

## 4. Feature Requirements

### 4.1 Core Features (MVP)

#### 4.1.1 Home Screen & Mood Logging
**Requirement ID:** F001  
**Priority:** High  

**Functional Requirements:**
- Display current date and motivational greeting
- Large, prominent "Log Today's Mood" button
- Show streak counter (consecutive days logged)
- Quick access to mood history
- Visual indicator if mood already logged today

**Acceptance Criteria:**
- User can log mood in maximum 3 taps
- Home screen loads in < 2 seconds
- Streak counter updates in real-time
- Clear visual feedback for successful mood log

#### 4.1.2 Mood Input Interface
**Requirement ID:** F002  
**Priority:** High  

**Functional Requirements:**
- Emoji picker with 8-12 mood categories:
  - 😊 Happy/Joyful
  - 😔 Sad/Down
  - 😰 Anxious/Stressed
  - 😴 Tired/Exhausted
  - 😡 Angry/Frustrated
  - 😐 Neutral/Okay
  - 😌 Calm/Peaceful
  - 🤔 Confused/Uncertain
  - 💪 Energetic/Motivated
  - 🥳 Excited/Celebratory

- Text input field (optional, 200 character limit)
- Mood intensity slider (1-10 scale)
- Quick tags for common activities/triggers:
  - Work, Exercise, Social, Sleep, Weather, Health, Family, etc.

**Acceptance Criteria:**
- Emoji selection is intuitive and responsive
- Text input auto-saves as user types
- Intensity slider provides haptic feedback
- Tags can be multi-selected
- All inputs are optional except emoji selection

#### 4.1.3 Local Data Storage
**Requirement ID:** F003  
**Priority:** High  

**Functional Requirements:**
- Store mood logs locally using AsyncStorage/SQLite
- Data structure includes:
  - Date/timestamp
  - Selected emoji/mood
  - Intensity rating (1-10)
  - Optional text note
  - Selected tags
  - Unique entry ID

**Acceptance Criteria:**
- Data persists between app sessions
- Maximum storage: 2MB for mood data
- Data remains available offline
- Automatic cleanup of entries older than 2 years

#### 4.1.4 AI-Powered Mood Analysis
**Requirement ID:** F004  
**Priority:** High  

**Functional Requirements:**
- Integration with OpenAI GPT-4 API or similar
- Weekly mood summary generation
- Pattern recognition and insights:
  - Mood trends over time
  - Correlation with activities/tags
  - Streak identification
  - Emotional pattern insights

**AI Insight Examples:**
- "You've felt energetic 3 days in a row! 💪"
- "Your mood tends to improve on days when you exercise 🏃‍♀️"
- "You've been feeling calmer this week compared to last week 😌"
- "Consider what made Tuesday so great - you rated it 9/10! ⭐"

**Acceptance Criteria:**
- AI insights generated based on minimum 7 days of data
- Insights are positive and encouraging in tone
- Maximum 2-3 insights shown per week
- Fallback to generic encouragement if insufficient data

#### 4.1.5 Mood History & Calendar View
**Requirement ID:** F005  
**Priority:** Medium  

**Functional Requirements:**
- Calendar view showing mood emojis for each logged day
- List view with chronological mood entries
- Filter options:
  - Date range
  - Mood type
  - Intensity level
  - Tags
- Search functionality for text notes

**Acceptance Criteria:**
- Calendar loads current month by default
- Smooth scrolling between months
- Tap on calendar day shows detailed entry
- List view supports infinite scroll
- Search returns relevant results within 1 second

### 4.2 Secondary Features (Post-MVP)

#### 4.2.1 Mood Trends & Analytics
- Graphical mood trends over time
- Weekly/monthly mood averages
- Export data functionality
- Comparative analytics (week over week, month over month)

#### 4.2.2 Notifications & Reminders
- Customizable daily mood logging reminders
- Weekly insight notifications
- Streak celebration notifications
- Smart reminder timing based on user behavior

#### 4.2.3 Customization Options
- Custom emoji sets
- Theme selection (light/dark/colorful)
- Personalized tags
- Reminder timing preferences

## 5. Technology Stack

### 5.1 Frontend Framework
- **React Native** with **Expo SDK 50+**
- **TypeScript** for type safety
- **Expo Router** for navigation

### 5.2 UI/UX Libraries
- **Expo Vector Icons** for iconography
- **React Native Reanimated 3** for smooth animations
- **React Native Gesture Handler** for touch interactions
- **Expo Haptics** for tactile feedback

### 5.3 Data Storage
- **Expo SQLite** for local database
- **AsyncStorage** for app preferences
- **Expo SecureStore** for sensitive data

### 5.4 AI Integration
- **OpenAI GPT-4 API** for mood analysis
- **Expo Constants** for API key management
- Custom prompt engineering for mood insights

### 5.5 Additional Libraries
- **React Hook Form** for form management
- **Date-fns** for date manipulation
- **React Native Calendar Strip** for calendar UI
- **Expo Font** for custom typography

### 5.6 Development Tools
- **Expo CLI** for development workflow
- **EAS Build** for app compilation
- **EAS Submit** for app store deployment
- **Expo Development Build** for testing

## 6. UI/UX Requirements

### 6.1 Design Principles
- **Minimalist:** Clean, uncluttered interface
- **Calming:** Soft colors, gentle animations
- **Accessible:** WCAG 2.1 AA compliance
- **Consistent:** Unified design language throughout

### 6.2 Color Palette
- **Primary:** Soft blue (#6B73FF)
- **Secondary:** Warm yellow (#FFD93D)
- **Success:** Gentle green (#4ECDC4)
- **Warning:** Soft orange (#FF9500)
- **Error:** Muted red (#FF6B6B)
- **Background:** Off-white (#FAFAFA)
- **Text:** Dark gray (#2C2C2C)

### 6.3 Typography
- **Primary Font:** SF Pro Display (iOS) / Roboto (Android)
- **Header Size:** 24px, Semi-bold
- **Body Size:** 16px, Regular
- **Caption Size:** 14px, Medium

### 6.4 Animation Guidelines
- **Duration:** 200-300ms for micro-interactions
- **Easing:** Ease-out for natural feel
- **Feedback:** Immediate visual response to user actions
- **Loading:** Skeleton screens for content loading

## 7. Data Architecture

### 7.1 Local Database Schema

```sql
-- Mood Entries Table
CREATE TABLE mood_entries (
  id TEXT PRIMARY KEY,
  date TEXT NOT NULL,
  timestamp INTEGER NOT NULL,
  emoji TEXT NOT NULL,
  mood_type TEXT NOT NULL,
  intensity INTEGER NOT NULL,
  note TEXT,
  tags TEXT, -- JSON array
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

-- User Preferences Table
CREATE TABLE user_preferences (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at INTEGER NOT NULL
);

-- AI Insights Table
CREATE TABLE ai_insights (
  id TEXT PRIMARY KEY,
  insight_text TEXT NOT NULL,
  insight_type TEXT NOT NULL,
  date_range TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  is_read BOOLEAN DEFAULT FALSE
);
```

### 7.2 Data Flow
1. **User Input** → Local SQLite Database
2. **Weekly Data** → AI Analysis API
3. **AI Response** → Local Storage
4. **User Request** → Local Query → UI Display

## 8. AI Integration Details

### 8.1 API Integration
- **Provider:** OpenAI GPT-4 API
- **Rate Limiting:** Maximum 10 requests per day per user
- **Error Handling:** Graceful fallback to local insights
- **Privacy:** Data sent only in anonymized format

### 8.2 Prompt Engineering
```
System: You are a supportive mental wellness assistant analyzing mood patterns.
Context: Weekly mood data with emojis, intensity, and optional notes.
Task: Generate 1-2 encouraging insights about mood patterns.
Tone: Warm, supportive, and actionable.
Length: Maximum 100 characters per insight.
```

### 8.3 Local AI Fallbacks
- Pre-written insight templates
- Pattern-based local analysis
- Encouraging messages for streak milestones

## 9. Development Phases

### 9.1 Phase 1: Foundation (Weeks 1-3)
**Goal:** Core app structure and basic mood logging

**Deliverables:**
- Project setup with Expo
- Basic navigation structure
- Home screen UI
- Mood input interface
- Local data storage implementation

**Success Criteria:**
- Users can log mood with emoji and text
- Data persists locally
- Basic navigation works smoothly

### 9.2 Phase 2: Core Features (Weeks 4-6)
**Goal:** Complete MVP functionality

**Deliverables:**
- Mood history and calendar view
- Basic AI integration
- Data validation and error handling
- App icons and splash screen

**Success Criteria:**
- Complete mood logging workflow
- Historical data visualization
- Basic AI insights generation
- App ready for internal testing

### 9.3 Phase 3: Polish & Testing (Weeks 7-8)
**Goal:** Production-ready app

**Deliverables:**
- UI/UX polish and animations
- Performance optimization
- Comprehensive testing
- App store preparation

**Success Criteria:**
- Smooth, bug-free user experience
- Performance metrics met
- Ready for app store submission

### 9.4 Phase 4: Launch & Iteration (Weeks 9-12)
**Goal:** App store launch and user feedback integration

**Deliverables:**
- App store submission
- User feedback collection
- Bug fixes and improvements
- Analytics implementation

**Success Criteria:**
- Successfully launched on both platforms
- User acquisition starts
- Feedback loop established

## 10. Technical Architecture

### 10.1 App Structure
```
src/
├── components/          # Reusable UI components
├── screens/            # Screen components
├── navigation/         # Navigation configuration
├── services/           # API and data services
├── utils/              # Helper functions
├── types/              # TypeScript type definitions
├── constants/          # App constants
└── hooks/              # Custom React hooks
```

### 10.2 State Management
- **React Context** for global app state
- **React Hook Form** for form state
- **Local state** for component-specific data

### 10.3 Performance Considerations
- **Lazy loading** for screens
- **Image optimization** for emojis
- **Database indexing** for quick queries
- **Memory management** for large datasets

## 11. Security & Privacy

### 11.1 Data Privacy
- All mood data stored locally by default
- Optional cloud backup with encryption
- No personal data sent to AI service
- GDPR compliance for EU users

### 11.2 Security Measures
- API keys stored in Expo SecureStore
- Input validation for all user data
- SQL injection prevention
- Rate limiting for AI requests

## 12. Testing Strategy

### 12.1 Unit Testing
- **Jest** for utility functions
- **React Testing Library** for components
- Minimum 80% code coverage

### 12.2 Integration Testing
- Database operations
- AI service integration
- Navigation flows

### 12.3 E2E Testing
- **Detox** for critical user journeys
- Mood logging workflow
- Data persistence testing

## 13. Launch Strategy

### 13.1 Soft Launch
- Internal team testing (Week 9)
- Beta testing with 50 users (Week 10)
- Bug fixes and improvements (Week 11)

### 13.2 App Store Launch
- iOS App Store submission (Week 12)
- Google Play Store submission (Week 12)
- Launch preparation and marketing

### 13.3 Success Metrics
- **Week 1:** 100 downloads
- **Month 1:** 1,000 active users
- **Month 3:** 5,000 active users
- **Month 6:** 10,000 active users

## 14. Future Roadmap

### 14.1 Version 1.1 (Q3 2024)
- Mood sharing with friends/family
- Advanced analytics and insights
- Widget for quick mood logging
- Backup and sync across devices

### 14.2 Version 1.2 (Q4 2024)
- Integration with health apps
- Meditation/breathing exercises
- Mood-based music recommendations
- Professional mental health resources

### 14.3 Version 2.0 (Q1 2025)
- AI mood prediction
- Personalized recommendations
- Community features
- Premium subscription tier

## 15. Budget & Resources

### 15.1 Development Costs
- **Developer Time:** 12 weeks × $75/hour × 40 hours = $36,000
- **AI API Costs:** ~$50/month (estimated)
- **App Store Fees:** $99 (iOS) + $25 (Android)
- **Design Assets:** $500

### 15.2 Ongoing Costs
- **AI API:** $50-200/month (usage-based)
- **App Store Maintenance:** $99/year (iOS)
- **Server Costs:** $0 (local storage)

## 16. Risk Assessment

### 16.1 Technical Risks
- **AI API Reliability:** Mitigation through local fallbacks
- **Performance Issues:** Mitigation through optimization
- **Data Loss:** Mitigation through backup systems

### 16.2 Business Risks
- **User Adoption:** Mitigation through user research
- **Competition:** Mitigation through unique AI features
- **Privacy Concerns:** Mitigation through transparent policies

---

**Document Version:** 1.0  
**Last Updated:** January 2024  
**Next Review:** February 2024  

**Stakeholders:**
- Product Owner: [Name]
- Lead Developer: [Name]
- UI/UX Designer: [Name]
- QA Lead: [Name] 