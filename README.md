# 🧠 CogniCare - Unified Digital Caregiving Platform

![CogniCare](https://img.shields.io/badge/CogniCare-v1.0.0-blue)
![React](https://img.shields.io/badge/React-19.2.0-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-3178c6)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-ffca28)

A comprehensive digital platform designed to empower patients, support caregivers, and enable expert professionals in providing better cognitive care.

## 🌟 Features

### 👤 Patient Portal
- **Task Management**: Visual task board with reminders and timelines
- **Gamification**: Earn points, badges, and level up for completing tasks
- **Cognitive Games**: AI/ML-recommended games to support memory and awareness
- **Daily Challenges**: Photo recognition challenges uploaded by caregivers
- **Memory Boards**: Upload photos, add notes, and express feelings
- **Social Platform**: Share experiences, encouragement, and tips with other patients
- **Rewards System**: Points, badges, and tokens for task completion

### 👨‍⚕️ Caregiver Portal
- **Patient Management**: Connect with patients using unique codes
- **Task Assignment**: Create and assign tasks and therapy routines
- **Progress Tracking**: Monitor completion, mood logs, and reward status
- **Analytics Dashboard**: View progress graphs and behavioral trends
- **Social Platform**: Share strategies and best practices with other caregivers
- **Expert Consultation**: Request advice from verified professionals

### 🩺 Expert Portal
- **Credential Verification**: Admin-approved professional verification
- **Patient Review**: Access dashboards, progress reports, and data summaries
- **Consultation System**: Provide guidance based on observed patterns
- **AI/ML Analytics**: View trends, cognitive scores, and routine patterns
- **Professional Insights**: Offer therapy suggestions and improvement recommendations

## 🤖 AI/ML Integration

- **Facial Recognition**: Auto-tag family photos for memory boards
- **Activity Prediction**: Predict missed tasks and auto-adjust reminders
- **Cognitive Performance Scoring**: Generate "Cognitive Health Index" from game logs
- **Anomaly Detection**: Identify sudden drops in memory, mood, or routine adherence
- **Speech-to-Text**: Hands-free task and note creation for caregivers
- **Game Recommendation Engine**: AI suggests optimal cognitive activities

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Firebase account

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cognicare
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Authentication (Email/Password)
   - Enable Firestore Database
   - Enable Storage
   - Copy your Firebase configuration

4. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Firebase credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
cognicare/
├── src/
│   ├── components/
│   │   ├── common/          # Shared components (Navigation, etc.)
│   │   ├── patient/         # Patient-specific components
│   │   ├── caregiver/       # Caregiver-specific components
│   │   └── expert/          # Expert-specific components
│   ├── pages/
│   │   ├── patient/         # Patient portal pages
│   │   ├── caregiver/       # Caregiver portal pages
│   │   └── expert/          # Expert portal pages
│   ├── contexts/            # React contexts (Auth, etc.)
│   ├── services/            # API and service functions
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   ├── config/              # Configuration files
│   ├── games/               # Cognitive games
│   └── assets/              # Images, icons, etc.
├── public/                  # Static assets
└── package.json
```

## 🎨 Design System

CogniCare features a modern, premium design with:

- **Vibrant Color Palettes**: Curated HSL colors for a premium feel
- **Glassmorphism**: Frosted glass effects for modern UI
- **Smooth Animations**: Micro-interactions for enhanced UX
- **Gradient Backgrounds**: Dynamic, eye-catching gradients
- **Responsive Design**: Mobile-first, fully responsive layouts
- **Custom Typography**: Google Fonts (Inter, Poppins)

## 🔐 User Roles

### Patient
- Personal dashboard with tasks and routines
- Cognitive games and daily challenges
- Social interaction with other patients
- Memory boards and emotion tracking
- Rewards and gamification system

### Caregiver
- Patient management and monitoring
- Task and routine assignment
- Progress analytics and reports
- Community support network
- Expert consultation requests

### Expert
- Professional credential verification
- Patient data review and analysis
- Consultation management
- AI/ML analytics access
- Therapy recommendations

## 🛠️ Technologies Used

- **Frontend**: React 19, TypeScript
- **Routing**: React Router DOM
- **Authentication**: Firebase Auth
- **Database**: Firebase Firestore
- **Storage**: Firebase Storage
- **State Management**: Zustand
- **Charts**: Recharts
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Styling**: Custom CSS with CSS Variables
- **Build Tool**: Vite

## 📊 Key Features Implementation Status

- ✅ Authentication System
- ✅ Role-based Access Control
- ✅ Patient Dashboard
- ✅ Navigation System
- ✅ Design System
- 🚧 Task Management (In Progress)
- 🚧 Cognitive Games (In Progress)
- 🚧 Daily Challenges (In Progress)
- 🚧 Social Platform (In Progress)
- 🚧 Analytics Dashboard (In Progress)
- 🚧 AI/ML Integration (Planned)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Built with ❤️ by the CogniCare Team

## 📧 Contact

For questions or support, please contact: support@cognicare.com

---

**CogniCare** - Empowering minds, connecting hearts 🧠💙
