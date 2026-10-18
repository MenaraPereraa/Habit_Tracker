# Habit Tracker

A mobile habit tracking app built with React Native & Expo that helps you create, manage, and maintain your daily, weekly, and monthly habits. This project was created for learning React Native and is not intended for production use.

> **Note:** User credentials and habit data are stored via a backend API. The app communicates with a remote server over ngrok tunnels during development, which means the API URL will change with each tunnel session. Update the `PUBLIC_URL` constants in the screen files before running.

## Features

- **Splash Screen**: Animated welcome screen with background image, option to sign in, sign up, or continue as guest
- **Authentication**: Sign up with full name, username, email & password; sign in with username & password
- **Home / Habit List**: View habits filtered by frequency (Daily, Weekly, Monthly) with color-coded cards
- **Add Habit**: Create a new habit with a name, frequency picker, color selector, and optional details
- **Edit Habit**: Update habit name, frequency, color, and details inline
- **Habit Details**: Read-only view of a habit's full information (name, details, frequency, color, created date)
- **Delete Habit**: Confirmation dialog before permanently removing a habit
- **Header**: Persistent header with time-based greeting, user avatar, and logout button

## Tech Stack

- **Framework**: React Native (Expo ~53)
- **Language**: TypeScript
- **Navigation**: React Navigation v7 (Native Stack)
- **Local Storage**: AsyncStorage
- **UI Components**: React Native Paper (FAB), React Native Alert Notification
- **Icons**: Expo Vector Icons (MaterialCommunityIcons, MaterialIcons)
- **HTTP Client**: Fetch API (axios also installed)
- **Backend**: Custom PHP/REST API (served via ngrok tunnel for development)

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- Android Studio / Xcode (for emulators) **or** the Expo Go app on a physical device
- A running instance of the Habit Tracker backend API

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MenaraPereraa/Habit_Tracker.git
   cd Habit_Tracker
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn
   ```

3. Update the API base URL:

   Open each screen file below and replace the `PUBLIC_URL` constant with your active ngrok (or production) URL:

   | File | Constant |
   |------|----------|
   | `src/Screens/Home.tsx` | `PUBLIC_URL` |
   | `src/Screens/AddHabit.tsx` | `PUBLIC_URL` |
   | `src/Screens/EditHabit.tsx` | `PUBLIC_URL` |
   | `src/Screens/HabitDetails.tsx` | `PUBLIC_URL` |
   | `src/Screens/Signin.tsx` | `PUBLIC_URL` |
   | `src/Screens/Signup.tsx` | `PUBLIC_URL` |

   ```ts
   const PUBLIC_URL = "https://your-ngrok-url.ngrok-free.app";
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   expo start
   ```

5. Run on a device or emulator:
   ```bash
   # Android
   npm run android

   # iOS
   npm run ios

   # Web (limited support)
   npm run web
   ```

## Project Structure

```
Habit_Tracker/
├── assets/
│   ├── habit-bg.jpg          # Splash screen background image
│   └── hfav.jpg              # App icon & header avatar
├── src/
│   ├── components/
│   │   └── header.tsx        # Persistent header (greeting, avatar, logout)
│   └── Screens/
│       ├── Splash.tsx        # Welcome / landing screen
│       ├── Signin.tsx        # Sign-in screen
│       ├── Signup.tsx        # Registration screen
│       ├── Home.tsx          # Habit list with frequency tabs
│       ├── AddHabit.tsx      # Add new habit form
│       ├── EditHabit.tsx     # Edit existing habit form
│       └── HabitDetails.tsx  # Read-only habit detail view
├── App.tsx                   # Root component & navigation stack
├── index.ts                  # Expo entry point
├── app.json                  # Expo configuration
├── package.json
└── tsconfig.json
```

## API Endpoints

The app communicates with a backend REST API. The following endpoints are used:

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/HabitTracker/NewAccount` | Register a new user |
| `POST` | `/HabitTracker/SignIn` | Authenticate a user |
| `POST` | `/HabitTracker/GetHabits` | Fetch habits by user & frequency |
| `GET` | `/HabitTracker/LoadDataFrequency` | Load available frequency options |
| `POST` | `/HabitTracker/SaveHabit` | Create a new habit |
| `POST` | `/HabitTracker/EditHabit` | Fetch or update an existing habit |
| `GET` | `/HabitTracker/ViewHabit` | Get full details of a habit |
| `POST` | `/HabitTracker/DeleteHabit` | Delete a habit |

## Customization

- **Colors**: Habit card colors are chosen from a 6-color palette (`#FFD7D7`, `#FFF3BA`, `#D0F4DE`, `#B3E5FC`, `#E2CFEA`, `#FFE0B2`). You can extend the `colorMap` array in the screen files.
- **Accent Color**: The primary accent is `#6B4E9A` (purple). Update it globally in `StyleSheet` objects across screen files.
- **App Icon & Splash**: Replace `assets/hfav.jpg` and `assets/habit-bg.jpg` with your own images.

## Deployment

This app is built with Expo and can be deployed using EAS Build:

1. Install EAS CLI:
   ```bash
   npm install -g eas-cli
   ```

2. Log in to your Expo account:
   ```bash
   eas login
   ```

3. Configure the build:
   ```bash
   eas build:configure
   ```

4. Build for Android or iOS:
   ```bash
   eas build --platform android
   eas build --platform ios
   ```

## License

This project is for personal and educational use only.
