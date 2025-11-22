import React, { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigation';
import { Users, Activity, Bell, TrendingUp, Clock, CheckCircle } from 'lucide-react';
import { dataService } from '../../services/mockDataService';
import type { Patient } from '../../services/mockDataService';
import './Dashboard.css';

const Dashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalPatients: 0,
        activeTasks: 0,
        completionRate: 0,
        avgCognitiveScore: 0
    });

    const [patients, setPatients] = useState<Patient[]>([]);
    const [recentActivities, setRecentActivities] = useState<any[]>([]);

    useEffect(() => {
        // Load data for demo caregiver 'c1'
        const dashboardStats = dataService.getCaregiverDashboardStats('c1');
        setStats(dashboardStats);

        setPatients(dataService.getPatientsForCaregiver('c1'));
        setRecentActivities(dataService.getRecentActivities('c1'));
    }, []);

    return (
        <div className="page-wrapper">
            <Navigation userRole="caregiver" />

            <div className="page-container">
                <header className="dashboard-header">
                    <div>
                        <h1 className="page-title">Welcome back, Sarah</h1>
                        <p className="page-subtitle">Here's what's happening with your patients today.</p>
                    </div>
                    <div className="header-actions">
                        <button className="notification-btn">
                            <Bell size={20} />
                            <span className="notification-badge">3</span>
                        </button>
                        <div className="date-display">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                        </div>
                    </div>
                </header>

                {/* Stats Grid */}
                <div className="stats-grid">
                    <div className="stat-card card">
                        <div className="stat-icon-bg blue">
                            <Users size={24} className="text-blue-600" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Total Patients</span>
                            <span className="stat-value">{stats.totalPatients}</span>
                            <span className="stat-trend positive">
                                <TrendingUp size={14} /> +1 this week
                            </span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-bg green">
                            <CheckCircle size={24} className="text-green-600" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Task Completion</span>
                            <span className="stat-value">{stats.completionRate}%</span>
                            <span className="stat-trend positive">
                                <TrendingUp size={14} /> +5% vs last week
                            </span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-bg purple">
                            <Activity size={24} className="text-purple-600" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Avg Cognitive Score</span>
                            <span className="stat-value">{stats.avgCognitiveScore}</span>
                            <span className="stat-trend neutral">
                                Stable
                            </span>
                        </div>
                    </div>

                    <div className="stat-card card">
                        <div className="stat-icon-bg orange">
                            <Clock size={24} className="text-orange-600" />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">Pending Tasks</span>
                            <span className="stat-value">{stats.activeTasks}</span>
                            <span className="stat-sub">Requires attention</span>
                        </div>
                    </div>
                </div>

                <div className="dashboard-content-grid">
                    {/* Patient Overview */}
                    <div className="content-section card">
                        <div className="section-header">
                            <h2>Patient Overview</h2>
                            <button className="btn-link">View All</button>
                        </div>
                        <div className="patient-list">
                            {patients.map((patient) => (
                                <div key={patient.id} className="patient-item">
                                    <div className="patient-info">
                                        <div className="patient-avatar">
                                            {patient.name.charAt(0)}
                                        </div>
                                        <div>
                                            <h4>{patient.name}</h4>
                                            <span className="patient-status">{patient.condition}</span>
                                        </div>
                                    </div>
                                    <div className="patient-metrics">
                                        <div className="metric">
                                            <span className="metric-label">Score</span>
                                            <span className="metric-val">{patient.cognitiveScore}</span>
                                        </div>
                                        <div className="metric">
                                            <span className="metric-label">Status</span>
                                            <span className={`status-tag ${patient.status}`}>{patient.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {patients.length === 0 && (
                                <div className="empty-list-message">
                                    No patients assigned yet.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="content-section card">
                        <div className="section-header">
                            <h2>Recent Activity</h2>
                        </div>
                        <div className="activity-list">
                            {recentActivities.length > 0 ? (
                                recentActivities.map((activity) => (
                                    <div key={activity.id} className="activity-item">
                                        <div className={`activity-icon ${activity.type}`}>
                                            {activity.type === 'game' ? <Activity size={18} /> : <CheckCircle size={18} />}
                                        </div>
                                        <div className="activity-details">
                                            <p className="activity-text">
                                                <strong>Patient</strong> {activity.title}
                                                {activity.score && <span className="activity-score"> (+{activity.score} pts)</span>}
                                            </p>
                                            <span className="activity-time">
                                                {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="empty-list-message">
                                    No recent activities.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
