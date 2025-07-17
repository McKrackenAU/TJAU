# Tarot Journey - Production Deployment Guide

## Current Status
✅ Development environment fully functional with all features working:
- Authentication system (Jo BB: jobbadmin2025, WillMc: password123)
- Voice synthesis with Josie voice (YIWKjkOTvYsv48VTI6gT)
- Celtic Cross spreads and card displays
- Oracle of Illusion deck with authentic artwork
- PWA functionality and mobile optimization

## Deployment Instructions for Fresh Environment

### 1. Create New Replit
- Fork/duplicate this working development environment
- Or create new Replit and copy all files

### 2. Required Environment Variables
```
DATABASE_URL=<your_neon_database_url>
ELEVENLABS_API_KEY=<your_elevenlabs_key>
OPENAI_API_KEY=<your_openai_key>
OPENAI_API_KEY_TWO=<backup_openai_key>
SESSION_SECRET=<secure_random_string>
STRIPE_SECRET_KEY=<your_stripe_key>
STRIPE_WEBHOOK_SECRET=<your_webhook_secret>
```

### 3. Database Setup
```bash
npm run db:push
```

### 4. Domain Configuration
- Update custom domain to point to new deployment
- Ensure HTTPS is enabled
- Configure proper CORS settings

### 5. Verification Steps
1. Test authentication with Jo BB account
2. Test voice synthesis on Voice tab
3. Test Celtic Cross spread generation
4. Test card image displays
5. Test mobile PWA functionality

## Key Files for Production
- `server/routes.ts` - Main API endpoints with voice emergency fallback
- `server/voice-fallback.ts` - Emergency voice service for production
- `shared/schema.ts` - Database schema
- `client/src/` - React frontend with PWA
- `public/authentic-cards/` - Complete card image collection

## Known Working Configuration
- Node.js with Express server
- PostgreSQL database (Neon)
- ElevenLabs voice synthesis
- Stripe payments
- PWA with service worker

## Post-Deployment
1. Test all voice features immediately
2. Verify card images display correctly
3. Confirm authentication flow
4. Test subscription system
5. Update DNS to point to new deployment

---
Generated: July 16, 2025
Development Environment: ✅ Fully Functional
Ready for Production Deployment: ✅ Yes