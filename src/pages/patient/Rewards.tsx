import React from 'react';
import Navigation from '../../components/common/Navigation';
import { Award, Lock } from 'lucide-react';
import './Rewards.css';

const Rewards: React.FC = () => {
    const userProgress = {
        level: 5,
        currentPoints: 2450,
        nextLevelPoints: 3000,
        totalBadges: 8
    };

    const badges = [
        {
            id: '1',
            name: 'Early Bird',
            description: 'Completed 5 morning tasks in a row',
            icon: '🌅',
            earned: true,
            date: 'Oct 15, 2023'
        },
        {
            id: '2',
            name: 'Memory Master',
            description: 'Scored 100% on a memory game',
            icon: '🧠',
            earned: true,
            date: 'Nov 2, 2023'
        },
        {
            id: '3',
            name: 'Social Butterfly',
            description: 'Commented on 10 community posts',
            icon: '🦋',
            earned: true,
            date: 'Nov 10, 2023'
        },
        {
            id: '4',
            name: 'Streak Keeper',
            description: 'Maintained a 7-day activity streak',
            icon: '🔥',
            earned: true,
            date: 'Nov 20, 2023'
        },
        {
            id: '5',
            name: 'Puzzle Whiz',
            description: 'Solved a hard puzzle in under 5 minutes',
            icon: '🧩',
            earned: false,
            progress: 60
        },
        {
            id: '6',
            name: 'Photo Collector',
            description: 'Upload 20 memories to your board',
            icon: '📸',
            earned: false,
            progress: 35
        }
    ];

    const progressPercent = (userProgress.currentPoints / userProgress.nextLevelPoints) * 100;

    return (
        <div className="page-wrapper">
            <Navigation userRole="patient" />

            <div className="page-container">
                <div className="rewards-header">
                    <div>
                        <h1 className="page-title">My Rewards</h1>
                        <p className="page-subtitle">Track your progress and achievements</p>
                    </div>
                </div>

                {/* Level Progress Card */}
                <div className="level-card card">
                    <div className="level-info">
                        <div className="level-badge">
                            <span className="level-label">LEVEL</span>
                            <span className="level-number">{userProgress.level}</span>
                        </div>
                        <div className="points-info">
                            <h3>Keep it up!</h3>
                            <p>You need <strong>{userProgress.nextLevelPoints - userProgress.currentPoints}</strong> more points to reach Level {userProgress.level + 1}</p>
                        </div>
                    </div>

                    <div className="level-progress-container">
                        <div className="progress-labels">
                            <span>{userProgress.currentPoints} pts</span>
                            <span>{userProgress.nextLevelPoints} pts</span>
                        </div>
                        <div className="main-progress-bar">
                            <div
                                className="main-progress-fill"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <div className="shimmer"></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Badges Grid */}
                <h2 className="section-title">
                    <Award size={24} />
                    Badges Collection
                </h2>

                <div className="badges-grid">
                    {badges.map((badge) => (
                        <div key={badge.id} className={`badge-card card ${badge.earned ? 'earned' : 'locked'}`}>
                            <div className="badge-icon-container">
                                <span className="badge-icon">{badge.icon}</span>
                                {!badge.earned && (
                                    <div className="lock-overlay">
                                        <Lock size={16} />
                                    </div>
                                )}
                            </div>

                            <div className="badge-content">
                                <h3>{badge.name}</h3>
                                <p>{badge.description}</p>

                                {badge.earned ? (
                                    <span className="earned-date">Earned on {badge.date}</span>
                                ) : (
                                    <div className="badge-progress">
                                        <div className="mini-progress-bar">
                                            <div
                                                className="mini-progress-fill"
                                                style={{ width: `${badge.progress}%` }}
                                            ></div>
                                        </div>
                                        <span>{badge.progress}%</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Rewards;
