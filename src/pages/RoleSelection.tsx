import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Brain, Heart, Stethoscope } from 'lucide-react';
import './Login.css';

const RoleSelection: React.FC = () => {
    const navigate = useNavigate();

    const roles = [
        {
            id: 'patient',
            title: 'Patient',
            description: 'Access your tasks, games, and connect with others',
            icon: Brain,
            gradient: 'patient-gradient'
        },
        {
            id: 'caregiver',
            title: 'Caregiver',
            description: 'Monitor and support your loved ones',
            icon: Heart,
            gradient: 'caregiver-gradient'
        },
        {
            id: 'expert',
            title: 'Expert',
            description: 'Provide professional guidance and insights',
            icon: Stethoscope,
            gradient: 'expert-gradient'
        }
    ];

    return (
        <div className="login-container">
            <div className="login-background">
                <div className="gradient-orb orb-1"></div>
                <div className="gradient-orb orb-2"></div>
                <div className="gradient-orb orb-3"></div>
            </div>

            <div className="login-content">
                <div className="login-header" style={{ marginBottom: '3rem' }}>
                    <h1 className="login-title" style={{ color: 'white' }}>Choose Your Role</h1>
                    <p className="login-subtitle">Select how you'd like to use CogniCare</p>
                </div>

                <div className="features-grid">
                    {roles.map((role) => {
                        const Icon = role.icon;
                        return (
                            <div
                                key={role.id}
                                className="feature-card glass-card animate-fade-in"
                                onClick={() => navigate('/signup')}
                                style={{ cursor: 'pointer' }}
                            >
                                <div className={`feature-icon ${role.gradient}`}>
                                    <Icon size={40} />
                                </div>
                                <h3>{role.title}</h3>
                                <p>{role.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default RoleSelection;
