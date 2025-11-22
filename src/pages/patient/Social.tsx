import React from 'react';
import Navigation from '../../components/common/Navigation';
import './PatientPages.css';

const Social: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="patient" />
            <div className="page-container">
                <h1>Social</h1>
                <p>Social features coming soon...</p>
            </div>
        </div>
    );
};

export default Social;
