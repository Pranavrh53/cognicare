import React, { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigation';
import { Search, Plus, MoreVertical, Phone, Mail, Calendar, Activity, X, Link, UserPlus, Loader2 } from 'lucide-react';
import { dataService } from '../../services/mockDataService';
import type { Patient } from '../../services/mockDataService';
import './Patients.css';

const Patients: React.FC = () => {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showConnectModal, setShowConnectModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Connection Form State
    const [patientEmail, setPatientEmail] = useState('');
    const [connectionStatus, setConnectionStatus] = useState<{ success: boolean, message: string } | null>(null);
    const [foundPatient, setFoundPatient] = useState<Patient | null>(null);

    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = () => {
        const data = dataService.getPatientsForCaregiver('c1');
        setPatients(data);
    };

    const handleSearchPatient = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!patientEmail.trim()) return;
        
        setIsLoading(true);
        setConnectionStatus(null);
        
        try {
            // In a real app, this would be an API call to search for a patient by email
            const patient = dataService.findPatientByEmail(patientEmail);
            
            if (patient) {
                setFoundPatient(patient);
                setConnectionStatus({ 
                    success: true, 
                    message: 'Patient found! Send a connection request.' 
                });
            } else {
                setFoundPatient(null);
                setConnectionStatus({ 
                    success: false, 
                    message: 'No patient found with that email.' 
                });
            }
        } catch (error) {
            console.error('Error searching for patient:', error);
            setConnectionStatus({ 
                success: false, 
                message: 'An error occurred while searching for the patient.' 
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendRequest = async () => {
        if (!foundPatient) return;
        
        setIsLoading(true);
        
        try {
            // In a real app, this would be an API call to send a connection request
            const result = dataService.sendConnectionRequestByEmail(
                'c1', // Current caregiver ID (Sarah)
                'Sarah (Caregiver)', // Caregiver name
                patientEmail
            );
            
            setConnectionStatus(result);
            
            if (result.success) {
                setTimeout(() => {
                    setShowConnectModal(false);
                    setPatientEmail('');
                    setConnectionStatus(null);
                    setFoundPatient(null);
                    // Refresh patient list
                    loadPatients();
                }, 2000);
            }
        } catch (error) {
            console.error('Error sending connection request:', error);
            setConnectionStatus({ 
                success: false, 
                message: 'Failed to send connection request. Please try again.' 
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
                {showConnectModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Connect with Patient</h3>
                                <button 
                                    className="close-btn" 
                                    onClick={() => {
                                        setShowConnectModal(false);
                                        setPatientEmail('');
                                        setConnectionStatus(null);
                                        setFoundPatient(null);
                                    }}
                                    disabled={isLoading}
                                >
                                    <X size={20} />
                                </button>
                            </div>
                            <form onSubmit={handleSearchPatient} className="connect-form">
                                <div className="form-group">
                                    <label htmlFor="patientEmail">Patient's Email</label>
                                    <div className="search-container">
                                        <input
                                            type="email"
                                            id="patientEmail"
                                            placeholder="Enter patient's email address"
                                            value={patientEmail}
                                            onChange={(e) => setPatientEmail(e.target.value)}
                                            required
                                            disabled={isLoading || !!foundPatient}
                                        />
                                        <button 
                                            type="submit" 
                                            className="search-btn"
                                            disabled={isLoading || !patientEmail.trim() || !!foundPatient}
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : <Search size={18} />}
                                        </button>
                                    </div>
                                </div>
                                
                                {foundPatient && (
                                    <div className="patient-found">
                                        <div className="patient-info">
                                            <div className="patient-avatar">
                                                {foundPatient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4>{foundPatient.name}</h4>
                                                <p>{foundPatient.email}</p>
                                                <p className="text-sm text-gray-600">{foundPatient.condition}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                {connectionStatus && (
                                    <div className={`status-message ${connectionStatus.success ? 'success' : 'error'}`}>
                                        {connectionStatus.message}
                                    </div>
                                )}
                                
                                <div className="modal-actions">
                                    <button 
                                        type="button" 
                                        className="btn btn-outline" 
                                        onClick={() => {
                                            setShowConnectModal(false);
                                            setPatientEmail('');
                                            setConnectionStatus(null);
                                            setFoundPatient(null);
                                        }}
                                        disabled={isLoading}
                                    >
                                        Cancel
                                    </button>
                                    
                                    {foundPatient ? (
                                        <button 
                                            type="button" 
                                            className="btn btn-primary"
                                            onClick={handleSendRequest}
                                            disabled={isLoading}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <Loader2 className="animate-spin mr-2" size={18} />
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <UserPlus className="mr-2" size={18} />
                                                    Send Request
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <button 
                                            type="submit" 
                                            className="btn btn-primary"
                                            disabled={isLoading || !patientEmail.trim()}
                                        >
                                            {isLoading ? (
                                                <Loader2 className="animate-spin mr-2" size={18} />
                                            ) : (
                                                <Search className="mr-2" size={18} />
                                            )}
                                            Search Patient
                                        </button>
                                    )}
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Patients;
