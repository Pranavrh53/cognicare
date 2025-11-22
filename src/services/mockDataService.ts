import { v4 as uuidv4 } from 'uuid';

// ------------------- Types -------------------

export type UserRole = 'patient' | 'caregiver';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface Patient extends User {
  caregiverId?: string;
}

export interface Caregiver extends User {}

export interface ConnectionRequest {
  id: string;
  caregiverId: string;
  caregiverName: string;
  patientId: string;
  status: 'pending' | 'accepted' | 'rejected';
  timestamp: string;
}

// ------------------ DataService ------------------

export class DataService {
  private patients: Patient[] = [];
  private caregivers: Caregiver[] = [];
  private connectionRequests: ConnectionRequest[] = [];

  constructor() {
    this.loadAll();
  }

  // ------------ Local Storage Helpers ----------------

  private loadAll() {
    const savedPatients = localStorage.getItem('patients');
    const savedCaregivers = localStorage.getItem('caregivers');
    const savedRequests = localStorage.getItem('connectionRequests');

    this.patients = savedPatients ? JSON.parse(savedPatients) : [];
    this.caregivers = savedCaregivers ? JSON.parse(savedCaregivers) : [];
    this.connectionRequests = savedRequests ? JSON.parse(savedRequests) : [];
  }

  private savePatients() {
    localStorage.setItem('patients', JSON.stringify(this.patients));
  }

  private saveCaregivers() {
    localStorage.setItem('caregivers', JSON.stringify(this.caregivers));
  }

  private saveRequests() {
    localStorage.setItem('connectionRequests', JSON.stringify(this.connectionRequests));
  }

  // ------------ USERS ----------------

  addPatient(patient: Patient): Patient {
    this.patients.push(patient);
    this.savePatients();
    return patient;
  }

  addCaregiver(caregiver: Caregiver): Caregiver {
    this.caregivers.push(caregiver);
    this.saveCaregivers();
    return caregiver;
  }

  getPatients() {
    return this.patients;
  }

  getCaregivers() {
    return this.caregivers;
  }

  getPendingRequestsForPatient(patientId: string) {
    return this.connectionRequests.filter((r) => r.patientId === patientId && r.status === 'pending');
  }

  getPendingRequestsForCaregiver(caregiverId: string) {
    return this.connectionRequests.filter((r) => r.caregiverId === caregiverId && r.status === 'pending');
  }

  // ------------ Connection by Code ----------------

  sendConnectionRequest(
    caregiverId: string,
    caregiverName: string,
    connectionCode: string
  ): { success: boolean; message: string } {
    const patient = this.patients.find((p) => p.id === connectionCode);

    if (!patient) {
      return { success: false, message: 'Invalid connection code.' };
    }

    if (patient.caregiverId === caregiverId) {
      return { success: false, message: 'You are already connected.' };
    }

    const existingRequest = this.connectionRequests.find(
      (r) => r.caregiverId === caregiverId && r.patientId === patient.id && r.status === 'pending'
    );

    if (existingRequest) {
      return { success: false, message: 'Request already pending.' };
    }

    const newRequest: ConnectionRequest = {
      id: uuidv4(),
      caregiverId,
      caregiverName,
      patientId: patient.id,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    this.connectionRequests.push(newRequest);
    this.saveRequests();

    return { success: true, message: 'Connection request sent successfully.' };
  }

  // ------------ Connection by Email ----------------

  findPatientByEmail(email: string): Patient | undefined {
    return this.patients.find((p) => p.email.toLowerCase() === email.toLowerCase());
  }

  sendConnectionRequestByEmail(
    caregiverId: string,
    caregiverName: string,
    patientEmail: string
  ): { success: boolean; message: string } {
    const patient = this.findPatientByEmail(patientEmail);

    if (!patient) {
      return { success: false, message: 'No patient found with that email.' };
    }

    if (patient.caregiverId === caregiverId) {
      return { success: false, message: 'You are already connected to this patient.' };
    }

    const existingRequest = this.connectionRequests.find(
      (r) => r.caregiverId === caregiverId && r.patientId === patient.id && r.status === 'pending'
    );

    if (existingRequest) {
      return { success: false, message: 'A request is already pending.' };
    }

    const newRequest: ConnectionRequest = {
      id: uuidv4(),
      caregiverId,
      caregiverName,
      patientId: patient.id,
      status: 'pending',
      timestamp: new Date().toISOString(),
    };

    this.connectionRequests.push(newRequest);
    this.saveRequests();

    return { success: true, message: `Request sent to ${patient.name}.` };
  }

  // ------------ Accept / Reject Requests ----------------

  updateRequestStatus(requestId: string, status: 'accepted' | 'rejected') {
    const request = this.connectionRequests.find((r) => r.id === requestId);

    if (request) {
      request.status = status;
      this.saveRequests();

      if (status === 'accepted') {
        const patient = this.patients.find((p) => p.id === request.patientId);
        if (patient) {
          patient.caregiverId = request.caregiverId;
          this.savePatients();
        }
      }
    }
  }
}
