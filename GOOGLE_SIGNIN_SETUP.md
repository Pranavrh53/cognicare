# Firebase Google Sign-In Setup Guide

## Issues Fixed

### 1. ERR_BLOCKED_BY_CLIENT Error
✅ **Fixed**: Wrapped Firebase Analytics in a try-catch block to prevent the app from breaking when analytics is blocked by ad blockers or browser extensions.

### 2. Google Sign-In Implementation
✅ **Added**: Complete Google Sign-In functionality with:
- Google authentication provider
- Role selection modal
- User document creation in Firestore
- Integration in both Login and Signup pages

## Firebase Console Setup Required

To complete the Google Sign-In setup, you need to enable it in the Firebase Console:

### Step 1: Enable Google Sign-In Provider
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project: **cognicare-eed08**
3. Navigate to **Authentication** → **Sign-in method**
4. Click on **Google** in the providers list
5. Click **Enable**
6. Enter a **Project support email** (your email)
7. Click **Save**

### Step 2: Add Authorized Domains (if needed)
1. In the **Authentication** section, go to **Settings** → **Authorized domains**
2. Make sure `localhost` is in the list (it should be by default)
3. When deploying, add your production domain here

### Step 3: Verify Firestore Rules
Make sure your Firestore security rules allow user document creation:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Add other collection rules as needed
  }
}
```

## How It Works

### Login/Signup Flow
1. User clicks "Continue with Google" button
2. Role selection modal appears
3. User selects their role (Patient, Caregiver, or Expert)
4. Google Sign-In popup opens
5. User authenticates with Google
6. App creates/updates user document in Firestore with selected role
7. User is redirected to their role-specific dashboard

### Features
- ✅ Email/Password authentication
- ✅ Google Sign-In authentication
- ✅ Role-based user creation
- ✅ Automatic user document creation in Firestore
- ✅ Beautiful UI with glassmorphism effects
- ✅ Error handling for blocked analytics

## Testing

1. Make sure your dev server is running: `npm run dev`
2. Navigate to the login page
3. Click "Continue with Google"
4. Select a role
5. Sign in with your Google account
6. You should be redirected to the appropriate dashboard

## Troubleshooting

### If Google Sign-In doesn't work:
1. Check browser console for errors
2. Verify Google provider is enabled in Firebase Console
3. Make sure popup blockers are disabled
4. Check that your Firebase API key is correct in `.env`

### If ERR_BLOCKED_BY_CLIENT persists:
1. Disable ad blockers temporarily
2. Try a different browser
3. The app should still work - analytics is optional

## Next Steps

- [ ] Enable Google Sign-In in Firebase Console (see Step 1 above)
- [ ] Test login with Google
- [ ] Test signup with Google
- [ ] Verify user documents are created in Firestore
- [ ] Add additional OAuth providers if needed (GitHub, Facebook, etc.)
