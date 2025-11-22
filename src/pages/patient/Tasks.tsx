import React, { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigation';
import { CheckCircle, Circle, Clock, AlertCircle } from 'lucide-react';
import { dataService } from '../../services/mockDataService';
import type { Task } from '../../services/mockDataService';
import './Tasks.css';

const Tasks: React.FC = () => {
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [tasks, setTasks] = useState<Task[]>([]);
    const [points, setPoints] = useState(0);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = () => {
        // In a real app, we'd get the current user ID from auth
        // For demo, we assume we are 'p1'
        const patientTasks = dataService.getTasksForPatient('p1');
        setTasks(patientTasks);

        // Calculate total points from completed tasks
        const totalPoints = patientTasks
            .filter(t => t.completed)
            .reduce((acc, t) => acc + t.points, 0);
        setPoints(totalPoints);
    };

    const toggleTask = (taskId: string) => {
        dataService.toggleTaskCompletion(taskId);
        loadTasks(); // Refresh state
    };

    const filteredTasks = tasks.filter(task => {
        if (filter === 'all') return true;
        if (filter === 'pending') return !task.completed;
        if (filter === 'completed') return task.completed;
        return true;
    });

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'var(--error)';
            case 'medium': return 'var(--warning)';
            case 'low': return 'var(--success)';
            default: return 'var(--neutral-400)';
        }
    };

    return (
        <div className="page-wrapper">
            <Navigation userRole="patient" />

            <div className="page-container">
                <div className="tasks-header">
                    <div>
                        <h1 className="page-title">My Tasks</h1>
                        <p className="page-subtitle">Keep up the great work! You've earned {points} points.</p>
                    </div>

                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
                            onClick={() => setFilter('all')}
                        >
                            All Tasks
                        </button>
                        <button
                            className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
                            onClick={() => setFilter('pending')}
                        >
                            Pending
                        </button>
                        <button
                            className={`filter-tab ${filter === 'completed' ? 'active' : ''}`}
                            onClick={() => setFilter('completed')}
                        >
                            Completed
                        </button>
                    </div>
                </div>

                <div className="tasks-list">
                    {filteredTasks.length === 0 ? (
                        <div className="empty-state">
                            <CheckCircle size={48} />
                            <h3>No tasks found</h3>
                            <p>You're all caught up!</p>
                        </div>
                    ) : (
                        filteredTasks.map((task) => (
                            <div key={task.id} className={`task-card card ${task.completed ? 'completed' : ''}`}>
                                <button
                                    className={`status-toggle ${task.completed ? 'checked' : ''}`}
                                    onClick={() => toggleTask(task.id)}
                                >
                                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>

                                <div className="task-content">
                                    <div className="task-header-row">
                                        <span className="task-category">{task.category}</span>
                                        <span
                                            className="task-priority"
                                            style={{ color: getPriorityColor(task.priority) }}
                                        >
                                            <AlertCircle size={14} />
                                            {task.priority} Priority
                                        </span>
                                    </div>

                                    <h3 className="task-title">{task.title}</h3>
                                    <p className="task-description">{task.description}</p>

                                    <div className="task-footer">
                                        <div className="task-meta">
                                            <Clock size={16} />
                                            <span>Due: {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <span className="task-points">+{task.points} pts</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default Tasks;
