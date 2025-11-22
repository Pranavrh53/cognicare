import React from 'react';
import Navigation from '../../components/common/Navigation';

const Consultations: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="expert" />
            <div className="page-container">
                <h1>Consultations</h1>
                <p>Consultation management coming soon...</p>
            </div>
        </div>
    );
};

export default Consultations;
