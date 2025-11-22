# Where Patients See Caregiver Connection Requests

## 📍 Location: Patient Dashboard

When a caregiver sends a connection request, the patient will see it **prominently displayed at the top of their Dashboard**, right after they log in.

---

## Visual Flow

### Step 1: Caregiver Sends Request
```
Caregiver Dashboard → Patients Page → "Connect New Patient" button
→ Enter patient's unique code → "Send Request"
```

### Step 2: Patient Sees Request on Dashboard

When the patient logs in and goes to their Dashboard, they will see:

```
┌─────────────────────────────────────────────────────────┐
│  Patient Dashboard                                       │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Hello, John!                                            │
│  Ready to exercise your brain today?                     │
│                                                          │
│  ┌────────────────────────────────────────────────────┐ │
│  │  👤 New Connection Request                         │ │
│  │                                                     │ │
│  │  Sarah Smith wants to connect with you.            │ │
│  │                                                     │ │
│  │  [❌ Reject]  [✅ Approve]                          │ │
│  └────────────────────────────────────────────────────┘ │
│                                                          │
│  📊 Stats Overview                                       │
│  ┌──────────┬──────────┬──────────┐                    │
│  │Cognitive │  Points  │  Tasks   │                    │
│  │  Score   │          │   Done   │                    │
│  └──────────┴──────────┴──────────┘                    │
│                                                          │
│  📅 Today's Plan                                         │
│  ...                                                     │
└─────────────────────────────────────────────────────────┘
```

---

## Exact Location in Code

### File: `src/pages/patient/Dashboard.tsx`

**Lines 70-91** contain the connection request alert:

```tsx
{/* Connection Request Alert */}
{pendingRequests.length > 0 && (
    <div className="connection-alert card">
        <div className="alert-header">
            <UserPlus size={24} className="text-primary" />
            <h3>New Connection Request</h3>
        </div>
        {pendingRequests.map(req => (
            <div key={req.id} className="request-item">
                <p><strong>{req.caregiverName}</strong> wants to connect with you.</p>
                <div className="request-actions">
                    <button className="btn-reject" onClick={() => handleRequest(req.id, false)}>
                        <X size={18} /> Reject
                    </button>
                    <button className="btn-accept" onClick={() => handleRequest(req.id, true)}>
                        <Check size={18} /> Approve
                    </button>
                </div>
            </div>
        ))}
    </div>
)}
```

---

## How It Works

### 1. **Request Detection**
- When patient logs in, Dashboard fetches pending requests from Firestore
- Query: `caregiverRequests` collection where `patientId == currentUser.id` and `status == 'pending'`

### 2. **Display Alert**
- If there are pending requests, a prominent alert card appears at the top
- Shows caregiver's name
- Displays two action buttons: Reject and Approve

### 3. **Patient Actions**

#### Option A: Approve ✅
```
Patient clicks "Approve" button
→ Updates request status to 'accepted' in Firestore
→ Adds patient ID to caregiver's patients array
→ Sends notification to caregiver
→ Request disappears from patient's dashboard
→ Caregiver can now see patient in their patient list
```

#### Option B: Reject ❌
```
Patient clicks "Reject" button
→ Updates request status to 'rejected' in Firestore
→ Sends notification to caregiver
→ Request disappears from patient's dashboard
→ Caregiver does NOT get access to patient
```

---

## Testing Instructions

### Test the Connection Request Flow

**Step 1: Create Patient Account**
```bash
1. Go to http://localhost:5173/signup
2. Fill in form:
   - Name: John Doe
   - Email: john@test.com
   - Password: password123
   - Role: Patient
   - Age: 70
   - Condition: Alzheimer's Disease
3. Click "Sign Up"
```

**Step 2: Note Patient's Unique Code**
```bash
1. Login as john@test.com
2. Go to Dashboard
3. Scroll down to "Your Connection Code" section
4. Copy the code (e.g., P-ABCD-1234-XYZ)
```

**Step 3: Create Caregiver Account**
```bash
1. Open new incognito window
2. Go to http://localhost:5173/signup
3. Fill in form:
   - Name: Sarah Smith
   - Email: sarah@test.com
   - Password: password123
   - Role: Caregiver
4. Click "Sign Up"
```

**Step 4: Send Connection Request**
```bash
1. Login as sarah@test.com
2. Go to "Patients" page
3. Click "Connect New Patient"
4. Select "Connect by Code" tab
5. Enter John's code: P-ABCD-1234-XYZ
6. Click "Send Request"
7. You should see: "Connection request sent! Waiting for patient approval."
```

**Step 5: Patient Sees Request** ⭐ THIS IS WHERE IT APPEARS
```bash
1. Switch back to John's browser window (or refresh)
2. Go to Dashboard (if not already there)
3. AT THE TOP, you will see:
   
   ┌────────────────────────────────────────┐
   │ 👤 New Connection Request              │
   │                                        │
   │ Sarah Smith wants to connect with you. │
   │                                        │
   │ [❌ Reject]  [✅ Approve]              │
   └────────────────────────────────────────┘
```

**Step 6: Patient Approves**
```bash
1. Click "Approve" button
2. Request disappears from dashboard
3. Connection is established!
```

**Step 7: Verify Connection**
```bash
1. Switch to Sarah's browser window
2. Go to "Patients" page
3. John Doe should now appear in the patient list
4. Sarah can now assign tasks to John
```

---

## Key Features

### ✅ Real-time Updates
- Requests are fetched from Firestore on dashboard load
- When patient approves/rejects, dashboard refreshes automatically
- No page reload needed

### ✅ Prominent Display
- Alert appears at the very top of the dashboard
- Impossible to miss
- Clear call-to-action buttons

### ✅ Multiple Requests
- Can display multiple pending requests at once
- Each request has its own approve/reject buttons
- Requests are listed in order received

### ✅ User-Friendly
- Shows caregiver's name clearly
- Simple approve/reject options
- Immediate feedback when action is taken

---

## Styling

The connection request alert uses these CSS classes:

```css
.connection-alert {
  /* Prominent card at top of dashboard */
  background: white;
  border-left: 4px solid var(--primary-color);
  margin-bottom: 2rem;
}

.alert-header {
  /* Header with icon and title */
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.request-item {
  /* Individual request container */
  padding: 1rem;
  border-top: 1px solid #eee;
}

.request-actions {
  /* Button container */
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-reject {
  /* Reject button styling */
  background: #ef4444;
  color: white;
}

.btn-accept {
  /* Approve button styling */
  background: #10b981;
  color: white;
}
```

---

## Summary

**Where patients see connection requests:**
- ✅ **Patient Dashboard** (main page after login)
- ✅ **Top of the page** (above stats and tasks)
- ✅ **Prominent alert card** with caregiver's name
- ✅ **Clear action buttons** (Approve/Reject)

**When they see it:**
- ✅ Immediately after caregiver sends request
- ✅ Every time they visit dashboard until they respond
- ✅ Disappears after they approve or reject

**What happens when they approve:**
- ✅ Caregiver gets access to patient
- ✅ Patient appears in caregiver's patient list
- ✅ Caregiver can assign tasks
- ✅ Caregiver can monitor progress

The system is fully functional and ready to use! 🎉
