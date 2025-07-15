# Tarot Journey - System Architecture Overview

## Overview

Tarot Journey is a comprehensive tarot reading and learning platform that combines traditional tarot wisdom with modern technology. The application is built as a full-stack web application with native mobile app capabilities, offering users daily readings, spread meditations, learning tracks, and personalized tarot guidance powered by AI.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS with custom theme system
- **UI Components**: Radix UI component library for consistent design
- **Build Tool**: Vite for fast development and optimized builds
- **Mobile Apps**: Capacitor for native iOS and Android applications

### Backend Architecture
- **Runtime**: Node.js with Express server
- **Language**: TypeScript for type safety
- **Authentication**: Passport.js with local strategy and session management
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Session Storage**: PostgreSQL-backed session store

### Data Storage Solutions
- **Primary Database**: PostgreSQL (Neon serverless)
- **Schema Management**: Drizzle Kit for migrations
- **File Storage**: Static files served from public directory
- **Caching**: File system cache for AI-generated content and audio

## Key Components

### Authentication and Authorization
- Session-based authentication with Passport.js
- Role-based access control (admin functionality)
- Password hashing with bcrypt
- Password reset functionality with time-limited tokens

### AI Integration
- **OpenAI GPT-4**: Card interpretations, meditations, and affirmations
- **DALL-E 3**: Dynamic card image generation
- **ElevenLabs**: Voice synthesis for guided meditations
- **Usage Tracking**: API cost monitoring and rate limiting

### Payment Processing
- **Stripe Integration**: Subscription management with 7-day free trial
- **Mobile IAP**: iOS App Store and Google Play Store integration
- **Webhook Handling**: Real-time subscription status updates

### Content Management
- **Card Database**: Comprehensive tarot card data with meanings
- **Learning Tracks**: Structured educational content
- **User Progress**: Spaced repetition system for learning
- **Journal System**: Personal reflection and note-taking

## Data Flow

### User Journey
1. **Registration/Login**: User creates account or authenticates
2. **Daily Practice**: Receives daily card and AI-generated interpretation
3. **Learning**: Progresses through structured tarot courses
4. **Readings**: Performs spread readings with AI guidance
5. **Journaling**: Records insights and personal reflections

### AI Content Generation
1. **Request**: User triggers content generation (reading, meditation, etc.)
2. **API Call**: Server makes request to appropriate AI service
3. **Processing**: AI generates personalized content based on context
4. **Caching**: Content cached to filesystem for performance
5. **Delivery**: Content served to user with audio/visual elements

### Mobile App Synchronization
1. **Build**: Web app compiled for mobile platforms
2. **Bundle**: Assets bundled locally with Capacitor
3. **API Integration**: Mobile apps connect to production API endpoints
4. **Offline Support**: Core functionality available without internet

## External Dependencies

### AI Services
- **OpenAI**: GPT-4 for text generation, DALL-E 3 for images
- **ElevenLabs**: Voice cloning and text-to-speech synthesis
- **Hugging Face**: Alternative image generation capabilities

### Infrastructure
- **Neon**: Serverless PostgreSQL database hosting
- **Stripe**: Payment processing and subscription management
- **Replit**: Development environment and deployment platform

### Mobile Platform Services
- **Apple App Store**: iOS app distribution and in-app purchases
- **Google Play Store**: Android app distribution and billing
- **Capacitor**: Cross-platform native app framework

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js runtime
- **Database**: Neon PostgreSQL with connection pooling
- **File Serving**: Express static middleware for assets
- **Hot Reload**: Vite development server with HMR

### Production Deployment
- **Build Process**: Vite production build with asset optimization
- **Mobile Apps**: Capacitor sync and platform-specific compilation
- **Database**: Automated migrations with Drizzle Kit
- **Environment**: Production configuration with secure API keys

### Mobile App Distribution
- **iOS**: Xcode project compilation and App Store submission
- **Android**: Gradle build system and Play Store deployment
- **Updates**: Over-the-air updates for web content, native updates for functionality

## Changelog
```
Changelog:
- June 23, 2025: Initial setup
- June 23, 2025: Fixed Jo BB admin account login and implemented permanent subscription override
  - Updated password to "jobbadmin2025" 
  - Added special subscription override for jo@jmvirtualbusinessservices.com.au
  - Subscription never expires and always shows as active
  - Updated subscription guard to bypass restrictions for Jo BB
- July 12, 2025: Fixed Celtic Cross layout and Josie voice system
  - Redesigned Celtic Cross spread from overlapping to clean 2x5 grid layout
  - Fixed Josie voice ID from LSufHJs05fSH7jJqUHhF to YIWKjkOTvYsv48VTI6gT
  - Verified ElevenLabs integration working with proper voice generation
  - Confirmed deployment configuration ready for production updates
  - Fixed Celtic Cross card generation to properly create all 10 unique cards
  - Enhanced CardImage component validation and error handling
  - Improved React keys and cache-busting to prevent duplicate image display
- July 12, 2025: Fixed deployment path issues and completed Voice Guided Reading system
  - Resolved broken path references for card-back.png by switching from Tailwind arbitrary values to inline styles
  - Fixed Voice Guided Reading card display logic to properly handle intro/cards/conclusion sequence
  - Enhanced audio management with proper music continuation and cleanup
  - Confirmed all core features working: authentication, voice synthesis, card displays, Celtic Cross spreads
  - Application fully ready for production deployment with all major bugs resolved
- July 12, 2025: Fixed app icons and PWA deployment issues
  - Created custom Tarot-themed app icon with mystical design (tarot card with eye and moon)
  - Generated multiple icon sizes (16x16, 32x32, 180x180, 192x192, 196x196, 512x512)
  - Added proper PWA manifest.json with complete app metadata
  - Fixed favicon and Apple touch icon references with cache-busting parameters
  - Corrected Josie voice ID from LSufHJs05fSH7jJqUHhF to YIWKjkOTvYsv48VTI6gT
  - Added service worker for PWA functionality and caching
  - Enhanced session configuration for production HTTPS deployment
  - All icons and PWA manifest properly configured for deployment updates
- July 12, 2025: Fixed authentication system for production deployment
  - Fixed session store configuration with proper table name and connection
  - Configured secure cookies and domain settings for tarotjourney.au deployment
  - Added custom domain detection for proper HTTPS cookie handling
  - Cleared session database and restarted with fresh configuration
  - Authentication system now ready for production custom domain deployment
- July 12, 2025: Verified authentication system ready for production deployment
  - Tested database connectivity and user authentication thoroughly
  - Confirmed Jo BB admin account login works correctly with proper credentials
  - Verified session cookie handling and persistence across requests
  - Fixed CORS configuration for proper cookie handling
  - Authentication system fully functional for tarotjourney.au deployment
- July 12, 2025: Fixed critical API configuration and mobile responsiveness issues
  - Resolved API base URL mismatch: changed from https://www.tarotjourney.au to https://tarotjourney.au
  - Updated WillMc password to bcrypt format with new password "password123"
  - Enhanced mobile viewport configuration and CSS for better mobile experience
  - Added improved error handling for network connectivity issues
  - Fixed mobile responsive design with proper touch handling and scrolling
  - Confirmed both WillMc and Jo BB login credentials working on deployed version
- July 15, 2025: Fixed deployment issues with card display, voice system, and mobile loading
  - Fixed Josie voice ID configuration (YIWKjkOTvYsv48VTI6gT) for all voice features
  - Added /api/speak endpoint for legacy compatibility with correct Josie voice
  - Fixed card image display issues with cache-busting and improved error handling
  - Removed all remaining www.tarotjourney.au references (replaced with tarotjourney.au)
  - Added mobile diagnostics page at /mobile-test for troubleshooting
  - Enhanced voice service with proper fallback and error handling
  - Fixed API configuration across all client components for mobile compatibility
- July 15, 2025: Fixed critical loading issues causing black/white screens and update loops
  - Added loading screen to prevent black/white screen flash during app initialization
  - Disabled problematic service worker and update notification components causing infinite loops
  - Enhanced service worker to skip caching API calls preventing stale authentication data
  - Fixed mobile app update notification that was causing reload loops
  - Added proper loading states with LoadingFallback component in React app
  - Updated cache names to force cache refresh and prevent stale content issues
```

## User Preferences
```
Preferred communication style: Simple, everyday language.
```

## Admin Access
```
Jo BB Admin Account:
- Username: "Jo BB"
- Email: jo@jmvirtualbusinessservices.com.au  
- Password: jobbadmin2025
- Special privileges: Permanent subscription access, never expires
- Implementation: Email-based overrides in subscription endpoints and guards
```