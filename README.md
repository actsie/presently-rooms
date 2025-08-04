# Presently - A Gentle Virtual Coworking Space

Presently is a calming virtual coworking space designed for users who may feel overwhelmed. It offers three types of rooms - Silent, Lo-fi, and Check-in - each tailored to different energy levels and support needs.

## Features

- **3-Question Onboarding**: Quick, gentle questions to match users with the right room
- **Silent Rooms**: Focused work with breathing guides and timers
- **Lo-fi Rooms**: Ambient music to keep you company
- **Check-in Rooms**: Optional voice/video with bubble-style UI
- **Gentle UX**: No pressure to turn on camera/mic, easy room switching
- **Reassuring Microcopy**: Supportive messages throughout the experience

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up Daily.co (for video/voice features):
   - Sign up at [Daily.co](https://daily.co)
   - Create a room or get your domain
   - Copy `.env.example` to `.env`
   - Add your Daily room URL to `.env`

3. Start the development server:
```bash
npm start
```

## Technology Stack

- React with TypeScript
- Styled Components for styling
- Framer Motion for animations
- Daily.co for video/voice
- React Router for navigation

## Room Types

### Silent Room 🤫
- Timer for focused work sessions
- Optional breathing guide
- No audio/video features

### Lo-fi Room 🎵
- Gentle background music player
- Volume controls
- Community presence indicators

### Check-in Room 💬
- Optional voice and video
- Bubble-style video display
- Gentle check-in prompts
- Easy mic/camera toggles

## Design Philosophy

Presently is built with emotional safety in mind:
- Never forces users to turn on camera or mic
- Provides reassuring messages throughout
- Makes it easy to switch to a quieter room
- Uses calming colors and gentle animations
- Respects user preferences and energy levels

## Development

```bash
# Run in development mode
npm start

# Build for production
npm run build

# Run tests
npm test
```

## Environment Variables

- `REACT_APP_DAILY_ROOM_URL`: Your Daily.co room URL for video/voice features
- `REACT_APP_DAILY_API_KEY`: (Optional) Daily API key for dynamic room creation
