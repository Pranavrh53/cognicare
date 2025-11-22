import React from 'react';
import Navigation from '../../components/common/Navigation';

const Dashboard: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="expert" />
            <div className="page-container">
                <h1>Expert Dashboard</h1>
                <p>Expert dashboard coming soon...</p>
            </div>
        </div>
    );
};

export default Dashboard;
