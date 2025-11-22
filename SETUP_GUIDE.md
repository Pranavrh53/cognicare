# 🚀 Quick Setup Guide - CogniCare

## ⚠️ IMPORTANT: You're seeing a white screen because Firebase isn't configured yet!

Follow these steps to get CogniCare running:

---

## Step 1: Create Firebase Project (5 minutes)

### 1.1 Go to Firebase Console
- Open: https://console.firebase.google.com/
- Sign in with your Google account

### 1.2 Create New Project
1. Click **"Add project"** or **"Create a project"**
2. Enter project name: **CogniCare** (or any name you like)
3. Click **Continue**
4. Disable Google Analytics (optional, you can enable it if you want)
5. Click **Create project**
6. Wait for project creation (takes ~30 seconds)
7. Click **Continue**

---

## Step 2: Enable Required Services

### 2.1 Enable Authentication
1. In the left sidebar, click **"Authentication"**
2. Click **"Get started"**
3. Click on **"Email/Password"** in the Sign-in providers list
4. Toggle **"Email/Password"** to **ENABLED**
5. Click **"Save"**

### 2.2 Enable Firestore Database
1. In the left sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (for development)
4. Click **"Next"**
5. Choose your location (e.g., us-central)
6. Click **"Enable"**

### 2.3 Enable Storage
1. In the left sidebar, click **"Storage"**
2. Click **"Get started"**
3. Click **"Next"** (keep default security rules)
4. Choose your location (same as Firestore)
5. Click **"Done"**

---

## Step 3: Get Your Firebase Configuration

1. Click the **⚙️ gear icon** next to "Project Overview" in the left sidebar
2. Click **"Project settings"**
3. Scroll down to **"Your apps"** section
4. Click the **`</>`** (web) icon to add a web app
5. Enter app nickname: **CogniCare Web**
6. Click **"Register app"**
7. You'll see your Firebase configuration like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...",
  authDomain: "cognicare-xxxxx.firebaseapp.com",
  projectId: "cognicare-xxxxx",
  storageBucket: "cognicare-xxxxx.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef...",
  measurementId: "G-XXXXXXXXXX"
};
```

8. **COPY THESE VALUES** - you'll need them in the next step!

---

## Step 4: Update Your .env File

### 4.1 Open the .env file
- Location: `C:\Users\froze\.gemini\antigravity\scratch\cognicare\.env`
- Open it in any text editor (VS Code, Notepad, etc.)

### 4.2 Replace the placeholder values
Replace the demo values with your actual Firebase config:

```env
VITE_FIREBASE_API_KEY=AIzaSyC...  (your actual apiKey)
VITE_FIREBASE_AUTH_DOMAIN=cognicare-xxxxx.firebaseapp.com  (your actual authDomain)
VITE_FIREBASE_PROJECT_ID=cognicare-xxxxx  (your actual projectId)
VITE_FIREBASE_STORAGE_BUCKET=cognicare-xxxxx.appspot.com  (your actual storageBucket)
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789012  (your actual messagingSenderId)
VITE_FIREBASE_APP_ID=1:123456789012:web:abcdef...  (your actual appId)
VITE_FIREBASE_MEASUREMENT_ID=G-XXXXXXXXXX  (your actual measurementId)
```

### 4.3 Save the file
- Press **Ctrl+S** to save
- Make sure there are NO quotes around the values
- Make sure there are NO spaces before or after the `=` sign

---

## Step 5: Restart the Development Server

### 5.1 Stop the current server
- Go to your terminal where `npm run dev` is running
- Press **Ctrl+C** to stop it

### 5.2 Start the server again
```bash
npm run dev
```

### 5.3 Open your browser
- Go to: http://localhost:5173
- You should now see the beautiful CogniCare login page! 🎉

---

## Step 6: Test the Application

### 6.1 Create a test account
1. Click **"Sign up here"**
2. Fill in the form:
   - Name: **Test Patient**
   - Email: **patient@test.com**
   - Role: **Patient**
   - Password: **test123**
   - Confirm Password: **test123**
3. Click **"Create Account"**

### 6.2 You should see:
- The patient dashboard with stats
- Cognitive health score
- Upcoming tasks
- Recent activities

---

## 🎉 Success!

If you see the dashboard, congratulations! CogniCare is now running!

---

## 🐛 Troubleshooting

### Still seeing a white screen?

1. **Check browser console for errors:**
   - Press **F12** to open DevTools
   - Click the **Console** tab
   - Look for red error messages
   - Share the error message if you need help

2. **Verify .env file:**
   - Make sure the file is named exactly `.env` (not `.env.txt`)
   - Check that all values are filled in
   - No quotes around values
   - No extra spaces

3. **Clear browser cache:**
   - Press **Ctrl+Shift+R** to hard refresh
   - Or clear browser cache in settings

4. **Restart everything:**
   ```bash
   # Stop the server (Ctrl+C)
   # Then run:
   npm run dev
   ```

### Firebase errors?

1. **"Firebase: Error (auth/invalid-api-key)"**
   - Your API key is incorrect
   - Go back to Firebase Console and copy the correct key

2. **"Firebase: Error (auth/project-not-found)"**
   - Your project ID is incorrect
   - Double-check the projectId in Firebase Console

3. **"Firebase: Error (auth/operation-not-allowed)"**
   - Email/Password authentication is not enabled
   - Go to Firebase Console > Authentication > Sign-in method
   - Enable Email/Password

---

## 📝 Quick Reference

### Project Location
```
C:\Users\froze\.gemini\antigravity\scratch\cognicare
```

### Start Development Server
```bash
cd C:\Users\froze\.gemini\antigravity\scratch\cognicare
npm run dev
```

### Open Application
```
http://localhost:5173
```

### Firebase Console
```
https://console.firebase.google.com/
```

---

## 🎯 Next Steps After Setup

Once you have the app running:

1. ✅ Create test accounts for all three roles (Patient, Caregiver, Expert)
2. ✅ Explore the patient dashboard
3. ✅ Check out the navigation menu
4. 🚧 Start implementing additional features (tasks, games, etc.)

---

## 💡 Need Help?

If you're still stuck:
1. Check the browser console (F12) for errors
2. Verify your Firebase configuration
3. Make sure the .env file is saved correctly
4. Try restarting the dev server

**The white screen is 100% due to missing Firebase configuration. Once you complete Steps 1-5, it will work!**

---

Good luck! 🚀
