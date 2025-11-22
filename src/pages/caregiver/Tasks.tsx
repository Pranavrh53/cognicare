import React, { useState, useEffect } from 'react';
import Navigation from '../../components/common/Navigation';
import { CheckSquare, Plus, Calendar, User, Clock, AlertCircle, X } from 'lucide-react';
import { dataService } from '../../services/mockDataService';
import type { Task, Patient } from '../../services/mockDataService';
import './CaregiverTasks.css';

const Tasks: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [patients, setPatients] = useState<Patient[]>([]);
    const [showAssignModal, setShowAssignModal] = useState(false);

    // Form State
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        patientId: '',
        category: 'medication' as const,
        priority: 'medium' as const,
        points: 50,
        dueDate: ''
    });

    useEffect(() => {
        // Load data for demo caregiver 'c1'
        const caregiverPatients = dataService.getPatientsForCaregiver('c1');
        setPatients(caregiverPatients);

        // Load all tasks for these patients
        const allTasks = caregiverPatients.flatMap(p => dataService.getTasksForPatient(p.id));
        setTasks(allTasks);

        // Set default patient selection
        if (caregiverPatients.length > 0) {
            setNewTask(prev => ({ ...prev, patientId: caregiverPatients[0].id }));
        }
    }, []);

    const handleAssignTask = (e: React.FormEvent) => {
        e.preventDefault();

        dataService.assignTask({
            title: newTask.title,
            description: newTask.description,
            patientId: newTask.patientId,
            category: newTask.category,
            priority: newTask.priority,
            points: Number(newTask.points),
            dueDate: new Date(newTask.dueDate).toISOString(),
            completed: false,
            assignedBy: 'c1'
        });

        // Refresh list
        const allTasks = patients.flatMap(p => dataService.getTasksForPatient(p.id));
        setTasks(allTasks);
        setShowAssignModal(false);

        // Reset form but keep patient selection
        setNewTask(prev => ({
            ...prev,
            title: '',
            description: '',
            points: 50,
            dueDate: ''
        }));
    };

    const getPatientName = (id: string) => {
        return patients.find(p => p.id === id)?.name || 'Unknown Patient';
    };

    return (
        <div className="page-wrapper">
            <Navigation userRole="caregiver" />

            <div className="page-container">
                <div className="tasks-header">
                    <div>
                        <h1 className="page-title">Task Management</h1>
                        <p className="page-subtitle">Assign and track patient tasks</p>
                    </div>
                    <button className="btn btn-primary" onClick={() => setShowAssignModal(true)}>
                        <Plus size={20} />
                        Assign New Task
                    </button>
                </div>

                {/* Tasks List */}
                <div className="tasks-list-container">
                    {tasks.length === 0 ? (
                        <div className="empty-state">
                            <CheckSquare size={48} />
                            <h3>No tasks assigned yet</h3>
                            <p>Click the button above to assign a task to a patient.</p>
                        </div>
                    ) : (
                        <div className="tasks-table-card card">
                            <table className="tasks-table">
                                <thead>
                                    <tr>
                                        <th>Task</th>
                                        <th>Patient</th>
                                        <th>Due Date</th>
                                        <th>Priority</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {tasks.map((task) => (
                                        <tr key={task.id}>
                                            <td>
                                                <div className="task-cell-main">
                                                    <span className="task-title">{task.title}</span>
                                                    <span className="task-desc">{task.description}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="patient-cell">
                                                    <User size={16} />
                                                    {getPatientName(task.patientId)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-cell">
                                                    <Calendar size={16} />
                                                    {new Date(task.dueDate).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`priority-badge ${task.priority}`}>
                                                    {task.priority}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${task.completed ? 'completed' : 'pending'}`}>
                                                    {task.completed ? 'Completed' : 'Pending'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Assign Task Modal */}
                {showAssignModal && (
                    <div className="modal-overlay">
                        <div className="modal-content card">
                            <div className="modal-header">
                                <h2>Assign New Task</h2>
                                <button className="close-btn" onClick={() => setShowAssignModal(false)}>
                                    <X size={24} />
                                </button>
                            </div>

                            <form onSubmit={handleAssignTask} className="assign-task-form">
                                <div className="form-group">
                                    <label>Assign To</label>
                                    <select
                                        value={newTask.patientId}
                                        onChange={e => setNewTask({ ...newTask, patientId: e.target.value })}
                                        required
                                    >
                                        {patients.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Task Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={newTask.title}
                                        onChange={e => setNewTask({ ...newTask, title: e.target.value })}
                                        placeholder="e.g. Afternoon Walk"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Description</label>
                                    <textarea
                                        required
                                        value={newTask.description}
                                        onChange={e => setNewTask({ ...newTask, description: e.target.value })}
                                        placeholder="Details about the task..."
                                        rows={3}
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Category</label>
                                        <select
                                            value={newTask.category}
                                            onChange={e => setNewTask({ ...newTask, category: e.target.value as any })}
                                        >
                                            <option value="medication">Medication</option>
                                            <option value="exercise">Exercise</option>
                                            <option value="mental">Mental Exercise</option>
                                            <option value="social">Social Activity</option>
                                            <option value="diet">Diet/Nutrition</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label>Priority</label>
                                        <select
                                            value={newTask.priority}
                                            onChange={e => setNewTask({ ...newTask, priority: e.target.value as any })}
                                        >
                                            <option value="low">Low</option>
                                            <option value="medium">Medium</option>
                                            <option value="high">High</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Due Date</label>
                                        <input
                                            type="datetime-local"
                                            required
                                            value={newTask.dueDate}
                                            onChange={e => setNewTask({ ...newTask, dueDate: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Points Reward</label>
                                        <input
                                            type="number"
                                            required
                                            min="10"
                                            step="10"
                                            value={newTask.points}
                                            onChange={e => setNewTask({ ...newTask, points: Number(e.target.value) })}
                                        />
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn btn-outline" onClick={() => setShowAssignModal(false)}>
                                        Cancel
                                    </button>
                                    <button type="submit" className="btn btn-primary">
                                        Assign Task
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tasks;
