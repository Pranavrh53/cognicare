import React from 'react';
import Navigation from '../../components/common/Navigation';

const Social: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="caregiver" />
            <div className="page-container">
                <h1>Community</h1>
                <p>Community features coming soon...</p>
            </div>
        </div>
    );
};

export default Social;
