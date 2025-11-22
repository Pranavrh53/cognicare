export type NotificationType = 'caregiver_request' | 'request_accepted' | 'request_denied';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  message: string;
  data: {
    requesterId?: string;
    requesterName?: string;
    patientId?: string;
    patientName?: string;
  };
  read: boolean;
  createdAt: Date;
}

export interface CaregiverRequest {
  id: string;
  caregiverId: string;
  caregiverName: string;
  patientId: string;
  patientName: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  updatedAt: Date;
}
