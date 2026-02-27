# ⚡ VoltLink Mobile App

VoltLink is a premium, glassmorphic EV charging and fleet management application built with **Expo SDK 54** and **React Native**. It offers a seamless experience for both individual EV owners (B2C) and professional fleet drivers.

---

## ✨ Features

### 🚗 Driver Dashboard (Fleet)
- **Real-time Battery Monitoring** — Visual state-of-charge tracking
- **AI-Powered Recommendations** — Smart charging station suggestions based on battery levels, route, and preferences
- **Session Management** — Live charging session tracking with real-time stats
- **Booking System** — Reserve charging slots directly from the app
- **Charging History** — View past sessions and analytics

### 💳 B2C Customer Experience
- **VoltCredits System** — Earn and spend credits for charging sessions
- **Discover Stations** — Find and explore nearby charging stations
- **Transaction History** — Track your earnings and usage with a detailed log
- **Session Tracking** — Monitor active and past charging sessions

### 🎨 Design & UX
- **Glassmorphic UI** — High-end visual aesthetic with real-time blur effects
- **Dynamic Themes** — Fully supported Dark and Light modes
- **Floating Tab Navigation** — Custom tab bar for easy access to core features
- **Smooth Animations** — Polished transitions and micro-interactions

---

## 🛠 Tech Stack

| Technology | Usage |
|---|---|
| [Expo SDK 54](https://expo.dev/) | Framework |
| React Native | Cross-platform mobile UI |
| Expo Router | File-based navigation & routing |
| Zustand | Lightweight state management |
| Lucide React Native | Iconography |
| Expo Blur | Glassmorphic blur effects |
| Expo Linear Gradient | Gradient backgrounds |
| React Native Maps | Map integration |
| React Native Reanimated | Performant animations |
| TypeScript | Type safety |

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- **Node.js** — v18 or later (LTS recommended)
- **npm** — comes with Node.js (or use **yarn** if preferred)
- **Expo CLI** — installed globally or used via `npx`
- **Expo Go** app on your mobile device (for testing on a physical device)
- *(Optional)* Android Studio / Xcode for emulator/simulator testing

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd voltlink-mobile
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start the Development Server

```bash
npx expo start --clear
```

This will start the Metro Bundler and display a QR code in the terminal.

### 4. Run on Your Device / Emulator

| Platform | How to Run |
|---|---|
| **iOS Simulator** | Press `i` in the terminal |
| **Android Emulator** | Press `a` in the terminal |
| **Physical Device** | Scan the QR code with the **Expo Go** app |
| **Web Browser** | Press `w` in the terminal |

### 5. Build for Production (Optional)

```bash
# Create a production build for Android
npx eas build --platform android

# Create a production build for iOS
npx eas build --platform ios
```

> **Note:** Production builds require an [Expo Application Services (EAS)](https://expo.dev/eas) account.

---

## 📁 Project Structure

```
voltlink-mobile/
├── app/                        # Screens & Routing (Expo Router)
│   ├── index.tsx               # Role selection landing page
│   ├── _layout.tsx             # Root layout with role-based navigation
│   ├── (driver)/               # Fleet driver screens
│   │   ├── _layout.tsx         #   Tab navigation layout
│   │   ├── dashboard.tsx       #   Driver dashboard (home)
│   │   ├── recommendations.tsx #   AI-powered charging suggestions
│   │   ├── booking.tsx         #   Slot booking
│   │   ├── session.tsx         #   Live charging session
│   │   ├── history.tsx         #   Past session history
│   │   └── profile.tsx         #   Driver profile
│   └── (b2c)/                  # B2C customer screens
│       ├── _layout.tsx         #   Tab navigation layout
│       ├── dashboard.tsx       #   Customer dashboard (home)
│       ├── discover.tsx        #   Discover charging stations
│       ├── booking.tsx         #   Slot booking
│       ├── session.tsx         #   Live charging session
│       ├── credits.tsx         #   VoltCredits & transactions
│       └── profile.tsx         #   Customer profile
│
├── components/                 # Reusable UI Components
│   ├── ui/                     #   Core building blocks
│   │   ├── GlassCard.tsx       #     Glassmorphic card component
│   │   ├── GlassButton.tsx     #     Styled action button
│   │   ├── MetricCard.tsx      #     Dashboard metric display
│   │   └── SectionHeader.tsx   #     Section title component
│   ├── navigation/             #   Custom floating tab bar
│   ├── charging/               #   Charging-related components
│   ├── vehicle/                #   Vehicle info components
│   ├── profile/                #   Profile components
│   └── feedback/               #   Feedback / rating components
│
├── store/                      # Zustand State Management
│   ├── roleStore.ts            #   Active role (driver / b2c)
│   └── themeStore.ts           #   Theme preference (dark / light)
│
├── services/                   # API & Service Layer
│   ├── api.service.ts          #   Base API configuration
│   ├── driver.service.ts       #   Driver-specific API calls
│   └── b2c.service.ts          #   B2C-specific API calls
│
├── mock/                       # Mock Data (for development)
│   ├── driver.mock.ts          #   Driver mock data
│   ├── b2c.mock.ts             #   B2C mock data
│   └── stations.mock.ts        #   Charging station mock data
│
├── types/                      # TypeScript Type Definitions
│   ├── vehicle.types.ts        #   Vehicle-related types
│   └── station.types.ts        #   Station-related types
│
├── utils/                      # Utilities & Constants
│   ├── theme.ts                #   Colors, spacing, typography
│   └── mock-flag.ts            #   Toggle mock data on/off
│
├── assets/                     # Static Assets
│   ├── icons/                  #   App icons & logos
│   └── images/                 #   Image assets
│
├── app.json                    # Expo configuration
├── babel.config.js             # Babel configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── package-lock.json           # Dependency lock file
```

---

## 🔧 Available Scripts

| Script | Command | Description |
|---|---|---|
| Start | `npm start` | Start the Expo development server |
| Android | `npm run android` | Start on Android emulator |
| iOS | `npm run ios` | Start on iOS simulator |
| Web | `npm run web` | Start in web browser |

---

## 🧭 App Flow

1. **Role Selection** — On launch, the user picks their role: **Driver** or **B2C Customer**.
2. **Dashboard** — The appropriate dashboard loads based on the selected role.
3. **Navigation** — A floating tab bar provides access to all major screens (Dashboard, Booking, Session, History/Credits, Profile).
4. **Charging Flow** — Users can discover stations → book a slot → start/monitor a session → view history.

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

Built with ⚡ for the future of Electric Mobility.
