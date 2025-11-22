import React from 'react';
import Navigation from '../../components/common/Navigation';

const Consultation: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="caregiver" />
            <div className="page-container">
                <h1>Expert Consultations</h1>
                <p>Consultation system coming soon...</p>
            </div>
        </div>
    );
};

export default Consultation;
