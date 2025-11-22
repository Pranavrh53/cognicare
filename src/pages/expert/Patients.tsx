import React from 'react';
import Navigation from '../../components/common/Navigation';

const Patients: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="expert" />
            <div className="page-container">
                <h1>Patient Overview</h1>
                <p>Patient data coming soon...</p>
            </div>
        </div>
    );
};

export default Patients;
