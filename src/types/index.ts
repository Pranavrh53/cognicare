export type UserRole = 'patient' | 'caregiver' | 'expert';

export interface User {
    id: string;
    email: string;
    name: string;
    role: UserRole;
    photoURL?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface Patient extends User {
    role: 'patient';
    caregiverId?: string;
    uniqueCode: string;
    points: number;
    level: number;
    badges: Badge[];
    cognitiveScore: number;
    mood?: string;
}

export interface Caregiver extends User {
    role: 'caregiver';
    patients: string[];
    uniqueCode: string;
    verified: boolean;
}

export interface Expert extends User {
    role: 'expert';
    credentials: string[];
    specialization: string[];
    verified: boolean;
    verificationDate?: Date;
}

export interface Task {
    id: string;
    patientId: string;
    caregiverId: string;
    title: string;
    description: string;
    dueDate: Date;
    completed: boolean;
    completedAt?: Date;
    points: number;
    category: 'daily' | 'therapy' | 'exercise' | 'medication' | 'other';
    recurrence?: 'daily' | 'weekly' | 'monthly';
    reminder: boolean;
    reminderTime?: Date;
}

export interface Routine {
    id: string;
    patientId: string;
    caregiverId: string;
    name: string;
    tasks: string[];
    schedule: {
        days: number[];
        time: string;
    };
    active: boolean;
}

export interface Badge {
    id: string;
    name: string;
    description: string;
    icon: string;
    earnedAt: Date;
    category: 'tasks' | 'games' | 'social' | 'streak' | 'special';
}

export interface Reward {
    id: string;
    patientId: string;
    type: 'points' | 'badge' | 'level';
    value: number | Badge;
    reason: string;
    earnedAt: Date;
}

export interface MemoryBoard {
    id: string;
    patientId: string;
    title: string;
    description?: string;
    images: MemoryImage[];
    emotion?: 'happy' | 'sad' | 'neutral' | 'excited' | 'calm';
    createdAt: Date;
    updatedAt: Date;
}

export interface MemoryImage {
    id: string;
    url: string;
    caption?: string;
    tags: string[];
    uploadedBy: string;
    uploadedAt: Date;
    recognizedFaces?: string[];
}

export interface SocialPost {
    id: string;
    authorId: string;
    authorName: string;
    authorRole: UserRole;
    content: string;
    images?: string[];
    likes: string[];
    comments: Comment[];
    groupId?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    content: string;
    createdAt: Date;
}

export interface Group {
    id: string;
    name: string;
    description: string;
    type: 'patient' | 'caregiver' | 'mixed';
    category: string;
    members: string[];
    moderators: string[];
    createdAt: Date;
}

export interface Game {
    id: string;
    name: string;
    description: string;
    category: 'memory' | 'attention' | 'problem-solving' | 'language' | 'visual-spatial';
    difficulty: 'easy' | 'medium' | 'hard';
    icon: string;
    thumbnail: string;
    points: number;
    estimatedTime: number;
}

export interface GameSession {
    id: string;
    patientId: string;
    gameId: string;
    score: number;
    accuracy: number;
    reactionTime: number;
    completed: boolean;
    startedAt: Date;
    completedAt?: Date;
    cognitiveMetrics: {
        memoryScore?: number;
        attentionScore?: number;
        problemSolvingScore?: number;
    };
}

export interface DailyChallenge {
    id: string;
    patientId: string;
    caregiverId: string;
    images: string[];
    correctAnswers: string[];
    userAnswers?: string[];
    completed: boolean;
    date: Date;
    points: number;
}

export interface ProgressReport {
    id: string;
    patientId: string;
    period: 'daily' | 'weekly' | 'monthly';
    startDate: Date;
    endDate: Date;
    tasksCompleted: number;
    totalTasks: number;
    gamesPlayed: number;
    averageCognitiveScore: number;
    moodTrend: string[];
    pointsEarned: number;
    generatedAt: Date;
}

export interface Consultation {
    id: string;
    caregiverId: string;
    expertId?: string;
    patientId: string;
    subject: string;
    description: string;
    status: 'pending' | 'in-progress' | 'resolved';
    messages: ConsultationMessage[];
    createdAt: Date;
    resolvedAt?: Date;
}

export interface ConsultationMessage {
    id: string;
    senderId: string;
    senderName: string;
    senderRole: UserRole;
    content: string;
    attachments?: string[];
    createdAt: Date;
}

export interface Notification {
    id: string;
    userId: string;
    type: 'task' | 'reminder' | 'social' | 'reward' | 'consultation' | 'system';
    title: string;
    message: string;
    read: boolean;
    actionUrl?: string;
    createdAt: Date;
}

export interface Analytics {
    patientId: string;
    cognitiveHealthIndex: number;
    taskCompletionRate: number;
    routineAdherence: number;
    socialEngagement: number;
    gamePerformanceTrend: number[];
    anomalies: Anomaly[];
    recommendations: string[];
    lastUpdated: Date;
}

export interface Anomaly {
    type: 'cognitive-decline' | 'mood-change' | 'routine-disruption' | 'social-withdrawal';
    severity: 'low' | 'medium' | 'high';
    description: string;
    detectedAt: Date;
    metrics: Record<string, number>;
}
