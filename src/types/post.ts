export interface Post {
    id: string;
    authorId: string;
    authorName: string;
    authorRole: 'patient' | 'caregiver';
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    likes: number;
    likedBy: string[];
    comments?: Comment[];
}

export interface CreatePostData {
    title: string;
    content: string;
}

export interface UpdatePostData {
    title?: string;
    content?: string;
}

export interface Comment {
    id: string;
    authorId: string;
    authorName: string;
    authorRole: 'patient' | 'caregiver';
    content: string;
    createdAt: Date;
    updatedAt: Date;
}
