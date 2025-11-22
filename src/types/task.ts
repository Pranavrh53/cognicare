// Task types for the application

export type TaskCategory = 'medication' | 'exercise' | 'mental' | 'social' | 'diet';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
    id: string;
    title: string;
    description: string;
    patientId: string;
    patientName?: string; // Denormalized for easier display
    caregiverId: string;
    category: TaskCategory;
    priority: TaskPriority;
    points: number;
    dueDate: Date;
    completed: boolean;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateTaskData {
    title: string;
    description: string;
    patientId: string;
    category: TaskCategory;
    priority: TaskPriority;
    points: number;
    dueDate: Date;
}
