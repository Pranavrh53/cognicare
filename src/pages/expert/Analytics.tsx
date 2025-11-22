import React from 'react';
import Navigation from '../../components/common/Navigation';

const Analytics: React.FC = () => {
    return (
        <div className="page-wrapper">
            <Navigation userRole="expert" />
            <div className="page-container">
                <h1>Analytics & Insights</h1>
                <p>Analytics dashboard coming soon...</p>
            </div>
        </div>
    );
};

export default Analytics;
