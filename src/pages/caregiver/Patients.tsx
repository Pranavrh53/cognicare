import React, { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigation';
import { Search, Plus, MoreVertical, Phone, Mail, Calendar, Activity, X, Link, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { isCaregiverUser, isPatientUser } from '../../types/user';
import type { PatientUser } from '../../types/user';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import './Patients.css';

const Patients: React.FC = () => {
    const { currentUser, sendCaregiverRequest, addPatient } = useAuth();
    const [patients, setPatients] = useState<PatientUser[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [showAddPatientModal, setShowAddPatientModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [connectionMethod, setConnectionMethod] = useState<'code' | 'add'>('code');

    // Connection Form State (for existing patients)
    const [patientCode, setPatientCode] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<{ success: boolean, message: string } | null>(null);

    // Add Patient Form State (for new patients)
    const [newPatientData, setNewPatientData] = useState({
        name: '',
        email: '',
        condition: '',
        age: 0
    });

    useEffect(() => {
        loadPatients();
    }, [currentUser]);

    const loadPatients = async () => {
        if (!currentUser || !isCaregiverUser(currentUser)) return;

        try {
            // Get all patients connected to this caregiver
            const patientIds = currentUser.patients || [];

            if (patientIds.length === 0) {
                setPatients([]);
                return;
            }

            // Fetch patient details from Firestore
            const patientsData: PatientUser[] = [];
            for (const patientId of patientIds) {
                const q = query(collection(db, 'users'), where('__name__', '==', patientId));
                const querySnapshot = await getDocs(q);

                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.role === 'patient') {
                        patientsData.push({
                            id: doc.id,
                            ...data,
                            createdAt: data.createdAt?.toDate() || new Date(),
                            updatedAt: data.updatedAt?.toDate() || new Date(),
                            lastVisit: data.lastVisit?.toDate() || new Date()
                        } as PatientUser);
                    }
                });
            }

            setPatients(patientsData);
        } catch (error) {
            console.error('Error loading patients:', error);
        }
    };

    const handleConnectByCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientCode.trim() || !currentUser) return;

        setIsLoading(true);
        setConnectionStatus(null);

        try {
            await sendCaregiverRequest(patientCode.trim());
            setConnectionStatus({
                success: true,
                message: 'Connection request sent! Waiting for patient approval.'
            });

            setTimeout(() => {
                setShowConnectModal(false);
                setPatientCode('');
                setConnectionStatus(null);
            }, 2000);
        } catch (error: any) {
            console.error('Error sending connection request:', error);
            setConnectionStatus({
                success: false,
                message: error.message || 'Failed to send connection request.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddNewPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setIsLoading(true);
        setConnectionStatus(null);

        try {
            const newPatient = await addPatient(newPatientData);

            setConnectionStatus({
                success: true,
                message: `Patient ${newPatient.name} added successfully!`
            });

            // Refresh patient list
            await loadPatients();

            setTimeout(() => {
                setShowAddPatientModal(false);
                setNewPatientData({ name: '', email: '', condition: '', age: 0 });
                setConnectionStatus(null);
            }, 2000);
        } catch (error: any) {
            console.error('Error adding patient:', error);
            setConnectionStatus({
                success: false,
                message: error.message || 'Failed to add patient.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const filteredPatients = patients.filter(patient =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.condition.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-wrapper">
            <Navigation userRole="caregiver" />

            <div className="page-container">
                <div className="patients-header">
                    <div>
                        <h1 className="page-title">My Patients</h1>
                        <p className="page-subtitle">Manage your patient list and monitor their progress</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowConnectModal(true)}>
                        <Link size={20} />
                        Connect New Patient
                    </button>
                </div>

                {/* Search Bar */}
                <div className="search-bar-container">
                    <Search className="search-icon" size={20} />
                    <input
                        type="text"
                        placeholder="Search patients by name or condition..."
                        className="search-input"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Patients Grid */}
                <div className="patients-grid">
                    {filteredPatients.length > 0 ? (
                        filteredPatients.map((patient) => (
                            <div key={patient.id} className="patient-card card">
                                <div className="card-header">
                                    <div className="patient-profile">
                                        <div className="patient-avatar">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h3>{patient.name}</h3>
                                            <span className="patient-age">{patient.age} years • {patient.condition}</span>
                                        </div>
                                    </div>
                                    <button className="icon-btn">
                                        <MoreVertical size={20} />
                                    </button>
                                </div>

                                <div className="patient-stats">
                                    <div className="stat-item">
                                        <Activity size={16} />
                                        <span>Score: {patient.cognitiveScore}</span>
                                    </div>
                                    <div className="stat-item">
                                        <Calendar size={16} />
                                        <span>Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</span>
                                    </div>
                                </div>

                                <div className="patient-actions">
                                    <button className="action-btn">
                                        <Phone size={18} />
                                    </button>
                                    <button className="action-btn">
                                        <Mail size={18} />
                                    </button>
                                    <button className="btn btn-outline btn-sm" style={{ flex: 1 }}>
                                        View Profile
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state-container">
                            <p>No patients found. Click "Connect New Patient" to add someone.</p>
                        </div>
                    )}
                </div>

                {/* Connect Patient Modal */}
};

                export default Patients;
