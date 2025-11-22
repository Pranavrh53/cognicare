import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup,
    type User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, updateDoc, orderBy, limit } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { isPatientUser, isCaregiverUser, isExpertUser } from '../types/user';
import type { User, UserRole, CaregiverUser } from '../types/user';
import type { Notification, CaregiverRequest, NotificationType } from '../types/notifications';

// Re-export type guards for convenience
export { isPatientUser, isCaregiverUser, isExpertUser };

interface AuthContextType {
    currentUser: User | null;
    firebaseUser: FirebaseUser | null;
    loading: boolean;
    signup: (email: string, password: string, name: string, role: UserRole, additionalData?: any) => Promise<void>;
    login: (email: string, password: string) => Promise<void>;
    signInWithGoogle: (role: UserRole) => Promise<void>;
    logout: () => Promise<void>;
    updateUserProfile: (updates: Partial<User>) => Promise<void>;
    // Caregiver request methods
    sendCaregiverRequest: (patientCode: string) => Promise<void>;
    respondToCaregiverRequest: (requestId: string, accept: boolean) => Promise<void>;
    getNotifications: () => Promise<Notification[]>;
    markNotificationAsRead: (notificationId: string) => Promise<void>;
    addPatient: (patientData: { name: string; email: string; condition: string; age: number }) => Promise<User>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
    const [loading, setLoading] = useState(true);

    const generateUniqueCode = async (): Promise<string> => {
        const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Removed easily confused characters
        let code: string;
        let codeExists: boolean;
        let attempts = 0;
        const MAX_ATTEMPTS = 10;

        do {
            // Generate a more unique code using crypto if available
            const randomValues = new Uint32Array(6);
            if (typeof window !== 'undefined' && window.crypto) {
                window.crypto.getRandomValues(randomValues);
            } else {
                // Fallback for non-browser environments
                randomValues.forEach((_, i) => {
                    randomValues[i] = Math.floor(Math.random() * characters.length);
                });
            }

            // Generate a random string
            const randomChars = Array.from(randomValues, num => 
                characters[num % characters.length]
            ).join('');

            // Add a timestamp component and random number to ensure uniqueness
            const timestamp = Date.now().toString(36).slice(-4);
            const randomSuffix = Math.floor(Math.random() * 1000).toString(36).padStart(3, '0');
            code = `P-${randomChars.slice(0, 4)}-${timestamp}-${randomSuffix}`;

            // Check if code already exists
            const q = query(collection(db, 'users'), where('uniqueCode', '==', code));
            const querySnapshot = await getDocs(q);
            codeExists = !querySnapshot.empty;
            
            attempts++;
            if (attempts >= MAX_ATTEMPTS) {
                throw new Error('Failed to generate a unique code after multiple attempts');
            }
        } while (codeExists);

        return code;
    };

    // Helper function to create user data based on role
    const createUserData = async (
        id: string,
        email: string,
        name: string,
        role: UserRole,
        additionalData: Record<string, any> = {}
    ): Promise<User> => {
        const baseUser = {
            id,
            email,
            name,
            role,
            photoURL: null as string | null,
            createdAt: new Date(),
            updatedAt: new Date(),
            ...additionalData
        };

        switch (role) {
            case 'patient':
                return {
                    ...baseUser,
                    role: 'patient',
                    uniqueCode: await generateUniqueCode(),
                    points: 0,
                    level: 1,
                    badges: [],
                    cognitiveScore: 0,
                    condition: additionalData?.condition || '',
                    age: additionalData?.age || 0,
                    mood: 'neutral',
                    lastVisit: new Date()
                };
            case 'caregiver':
                return {
                    ...baseUser,
                    role: 'caregiver',
                    uniqueCode: await generateUniqueCode(),
                    patients: [],
                    verified: true
                };
            case 'expert':
                return {
                    ...baseUser,
                    role: 'expert',
                    credentials: additionalData?.credentials || [],
                    specialization: additionalData?.specialization || [],
                    verified: false
                };
            case 'admin':
                return {
                    ...baseUser,
                    role: 'admin'
                };
            default:
                throw new Error(`Invalid user role: ${role}`);
        }
    };

    // Send a notification to a user
    const sendNotification = async (userId: string, type: NotificationType, message: string, data: any = {}) => {
        const notification: Omit<Notification, 'id'> = {
            userId,
            type,
            message,
            data,
            read: false,
            createdAt: new Date()
        };

        await addDoc(collection(db, 'notifications'), notification);

        // In a real app, you would also implement push notifications here
        // e.g., using Firebase Cloud Messaging (FCM)
    };

    // Send a caregiver request to a patient
    const sendCaregiverRequest = async (patientCode: string) => {
        if (!currentUser || currentUser.role !== 'caregiver') {
            throw new Error('Only caregivers can send requests');
        }

        // Find patient by code
        const q = query(collection(db, 'users'),
            where('uniqueCode', '==', patientCode),
            where('role', '==', 'patient')
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            throw new Error('No patient found with that code');
        }

        const patientDoc = querySnapshot.docs[0];
        const patient = patientDoc.data() as User;

        // Check if request already exists
        const existingRequestQuery = query(
            collection(db, 'caregiverRequests'),
            where('caregiverId', '==', currentUser.id),
            where('patientId', '==', patient.id),
            where('status', 'in', ['pending', 'accepted'])
        );

        const existingRequests = await getDocs(existingRequestQuery);
        if (!existingRequests.empty) {
            throw new Error('A request is already pending or accepted for this patient');
        }

        // Create request
        const request: Omit<CaregiverRequest, 'id'> = {
            caregiverId: currentUser.id,
            caregiverName: currentUser.name,
            patientId: patient.id,
            patientName: patient.name,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        await addDoc(collection(db, 'caregiverRequests'), request);

        // Send notification to patient
        await sendNotification(
            patient.id,
            'caregiver_request',
            `${currentUser.name} wants to be your caregiver`,
            {
                requesterId: currentUser.id,
                requesterName: currentUser.name,
                patientId: patient.id,
                patientName: patient.name
            }
        );
    };

    // Respond to a caregiver request
    const respondToCaregiverRequest = async (requestId: string, accept: boolean) => {
        if (!currentUser || currentUser.role !== 'patient') {
            throw new Error('Only patients can respond to caregiver requests');
        }

        const requestRef = doc(db, 'caregiverRequests', requestId);
        const requestDoc = await getDoc(requestRef);

        if (!requestDoc.exists()) {
            throw new Error('Request not found');
        }

        const request = requestDoc.data() as CaregiverRequest;

        if (request.patientId !== currentUser.id) {
            throw new Error('Not authorized to respond to this request');
        }

        if (request.status !== 'pending') {
            throw new Error('This request has already been processed');
        }

        const status = accept ? 'accepted' : 'rejected';
        await updateDoc(requestRef, {
            status,
            updatedAt: new Date()
        });

        // Update caregiver's patients list if accepted
        if (accept) {
            const caregiverRef = doc(db, 'users', request.caregiverId);
            const caregiverDoc = await getDoc(caregiverRef);
            if (caregiverDoc.exists()) {
                const caregiverData = caregiverDoc.data() as CaregiverUser;
                await updateDoc(caregiverRef, {
                    patients: [...(caregiverData.patients || []), currentUser.id]
                });
            }
        }

        // Send notification to caregiver
        await sendNotification(
            request.caregiverId,
            accept ? 'request_accepted' : 'request_denied',
            accept
                ? `${currentUser.name} accepted your caregiver request`
                : `${currentUser.name} declined your caregiver request`,
            {
                requesterId: currentUser.id,
                requesterName: currentUser.name,
                patientId: currentUser.id,
                patientName: currentUser.name
            }
        );
    };

    // Get user notifications
    const getNotifications = async (): Promise<Notification[]> => {
        if (!currentUser) return [];

        const q = query(
            collection(db, 'notifications'),
            where('userId', '==', currentUser.id),
            orderBy('createdAt', 'desc'),
            limit(50)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification));
    };

    // Mark notification as read
    const markNotificationAsRead = async (notificationId: string) => {
        const notificationRef = doc(db, 'notifications', notificationId);
        await updateDoc(notificationRef, { read: true });
    };

    const signup = async (
        email: string,
        password: string,
        name: string,
        role: UserRole,
        additionalData?: any
    ) => {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });

        // Create user data with proper typing based on role
        const userData = await createUserData(user.uid, email, name, role, {
            ...additionalData,
            photoURL: user.photoURL || null
        });

        await setDoc(doc(db, 'users', user.uid), userData);
        setCurrentUser(userData);
    };

    const login = async (email: string, password: string) => {
        await signInWithEmailAndPassword(auth, email, password);
    };

    const signInWithGoogle = async (role: UserRole) => {
        const provider = new GoogleAuthProvider();
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;

        // Check if user document already exists
        const userDoc = await getDoc(doc(db, 'users', user.uid));

        if (!userDoc.exists()) {
            // Create new user document for first-time Google sign-in
            const userData = await createUserData(
                user.uid,
                user.email!,
                user.displayName || 'User',
                role,
                {
                    photoURL: user.photoURL || null
                }
            );

            await setDoc(doc(db, 'users', user.uid), userData);
            setCurrentUser(userData);
        }
    };

    const logout = async () => {
        await signOut(auth);
        setCurrentUser(null);
    };

    const addPatient = async (patientData: {
        name: string;
        email: string;
        condition: string;
        age: number;
    }) => {
        if (!currentUser || currentUser.role !== 'caregiver') {
            throw new Error('Only caregivers can add patients');
        }

        // Generate a random password (this should be changed by the patient later)
        const tempPassword = Math.random().toString(36).slice(-8);

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                patientData.email,
                tempPassword
            );

            const user = userCredential.user;

            // Create patient data with all required fields using createUserData
            const patientUser = await createUserData(
                user.uid,
                patientData.email,
                patientData.name,
                'patient',
                {
                    condition: patientData.condition,
                    age: patientData.age,
                    caregiverId: currentUser.id,
                    mood: 'neutral'
                }
            );

            // Save to Firestore
            await setDoc(doc(db, 'users', user.uid), patientUser);

            // Add patient to caregiver's patients list
            const caregiverRef = doc(db, 'users', currentUser.id);
            const caregiverDoc = await getDoc(caregiverRef);
            const currentPatients = caregiverDoc.data()?.patients || [];
            const updatedPatients = [...currentPatients, user.uid];

            await updateDoc(caregiverRef, {
                patients: updatedPatients
            });

            // Update current user data
            if (currentUser.role === 'caregiver') {
                setCurrentUser({
                    ...currentUser,
                    patients: updatedPatients
                });
            }

            return patientUser;
        } catch (error) {
            console.error('Error adding patient:', error);
            throw error;
        }
    };

    const updateUserProfile = async (updates: Partial<User>) => {
        if (!currentUser) return;

        // Create a new object with the correct type
        const updatedUser = {
            ...currentUser,
            ...updates,
            updatedAt: new Date()
        } as User; // Assert the type back to User

        await setDoc(doc(db, 'users', currentUser.id), updatedUser, { merge: true });
        setCurrentUser(updatedUser);
    };

    // Helper function to safely convert Firestore timestamp to Date
    const toDate = (value: any): Date => {
        if (!value) return new Date();
        return value.toDate ? value.toDate() : new Date(value);
    };

    // Helper function to create a properly typed user object
    const createTypedUser = (data: any, userId: string, firebaseUser: FirebaseUser): User => {
        const baseUser = {
            id: userId,
            email: firebaseUser.email || '',
            name: firebaseUser.displayName || '',
            photoURL: firebaseUser.photoURL || null,
            role: data.role || 'patient',
            createdAt: toDate(data.createdAt),
            updatedAt: toDate(data.updatedAt)
        };

        switch (baseUser.role) {
            case 'patient':
                return {
                    ...baseUser,
                    role: 'patient',
                    uniqueCode: data.uniqueCode || '',
                    points: data.points || 0,
                    level: data.level || 1,
                    badges: data.badges || [],
                    cognitiveScore: data.cognitiveScore || 0,
                    condition: data.condition || '',
                    age: data.age || 0,
                    mood: data.mood || 'neutral',
                    lastVisit: toDate(data.lastVisit),
                    caregiverId: data.caregiverId || null
                };
            case 'caregiver':
                return {
                    ...baseUser,
                    role: 'caregiver',
                    uniqueCode: data.uniqueCode || '',
                    patients: data.patients || [],
                    verified: data.verified || false
                };
            case 'expert':
                return {
                    ...baseUser,
                    role: 'expert',
                    credentials: data.credentials || [],
                    specialization: data.specialization || [],
                    verified: data.verified || false
                };
            case 'admin':
                return {
                    ...baseUser,
                    role: 'admin'
                };
            default:
                throw new Error(`Invalid user role: ${baseUser.role}`);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            setFirebaseUser(firebaseUser);

            if (firebaseUser) {
                const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    const typedUser = createTypedUser(userData, firebaseUser.uid, firebaseUser);
                    setCurrentUser(typedUser);
                }
            } else {
                setCurrentUser(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextType = {
        currentUser,
        firebaseUser,
        loading,
        signup,
        login,
        signInWithGoogle,
        logout,
        updateUserProfile,
        sendCaregiverRequest,
        respondToCaregiverRequest,
        getNotifications,
        markNotificationAsRead,
        addPatient,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
