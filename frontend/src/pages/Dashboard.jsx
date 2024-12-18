import React, { useState, useEffect } from 'react';
import axiosInstance from '../../axios';
import { useAuth } from '../context/AuthContext';
import ProjectCreateModal from '../components/ProjectCreateModal';
import TaskCreateModal from '../components/TaskCreateModal';

const Dashboard = () => {
    const { user } = useAuth();
    const [projects, setProjects] = useState([]);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
    const [selectedProject, setSelectedProject] = useState(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const projectsResponse = await axiosInstance.get('/api/projects/');
                const tasksResponse = await axiosInstance.get('/api/tasks/');

                setProjects(projectsResponse.data);
                setTasks(tasksResponse.data);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch dashboard data');
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const handleProjectCreated = (newProject) => {
        setProjects(prev => [...prev, newProject]);
    };

    const handleTaskCreated = (newTask) => {
        setTasks(prev => [...prev, newTask]);
    };

    const handleUpdateTaskStatus = async (taskId, newStatus) => {
        try {
            const response = await axiosInstance.patch(`/api/tasks/${taskId}`, {
                status: newStatus
            });

            setTasks(prev =>
                prev.map(task =>
                    task._id === taskId ? response.data : task
                )
            );
        } catch (error) {
            console.error('Failed to update task status', error);
        }
    };

    const handleUpdateProjectStatus = async (projectId, newStatus) => {
        try {
            const response = await axiosInstance.patch(`/api/projects/${projectId}/status`, {
                status: newStatus
            });

            setProjects(prev =>
                prev.map(project =>
                    project._id === projectId ? response.data : project
                )
            );
        } catch (error) {
            console.error('Failed to update project status', error);
        }
    };

    if (loading) {
        return <div className="text-center py-10">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center py-10">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">
                Welcome, {user.name} ({user.role})
            </h1>

            {/* Projects Section */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold">
                        {user.role === 'teacher' ? 'Manage Projects' : 'My Projects'}
                    </h2>
                    {user.role === 'teacher' && (
                        <button
                            onClick={() => setIsProjectModalOpen(true)}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                        >
                            Create Project
                        </button>
                    )}
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map((project) => (
                        <div
                            key={project._id}
                            className="bg-white shadow rounded-lg p-6 hover:shadow-md transition-shadow"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-xl font-semibold">{project.title}</h3>
                                <span
                                    className={`px-3 py-1 rounded-full text-sm ${project.status === 'completed'
                                        ? 'bg-green-100 text-green-800'
                                        : project.status === 'in-progress'
                                            ? 'bg-yellow-100 text-yellow-800'
                                            : 'bg-gray-100 text-gray-800'
                                        }`}
                                >
                                    {project.status}
                                </span>
                            </div>
                            <p className="text-gray-600 mb-4">{project.description}</p>

                            <div className="mb-4">
                                <h4 className="font-medium mb-2">Tasks</h4>
                                {project.tasks && project.tasks.length > 0 ? (
                                    <ul className="space-y-2">
                                        {project.tasks.map((task) => (
                                            <li
                                                key={task._id}
                                                className="flex justify-between items-center"
                                            >
                                                <span>{task.title}</span>
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs ${task.status === 'completed'
                                                        ? 'bg-green-100 text-green-800'
                                                        : task.status === 'in-progress'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}
                                                >
                                                    {task.status}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-gray-500">No tasks yet</p>
                                )}
                            </div>

                            {user.role === 'teacher' && (
                                <div className="flex justify-between">
                                    <button
                                        onClick={() => {
                                            setSelectedProject(project._id);
                                            setIsTaskModalOpen(true);
                                        }}
                                        className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                                    >
                                        Add Task
                                    </button>
                                    {project.status !== 'completed' && (
                                        <button
                                            onClick={() => handleUpdateProjectStatus(project._id, 'completed')}
                                            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
                                        >
                                            Mark Complete
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Project Creation Modal */}
            <ProjectCreateModal
                isOpen={isProjectModalOpen}
                onClose={() => setIsProjectModalOpen(false)}
                onProjectCreated={handleProjectCreated}
            />

            {/* Task Creation Modal */}
            <TaskCreateModal
                isOpen={isTaskModalOpen}
                onClose={() => setIsTaskModalOpen(false)} 
                projectId={selectedProject} 
                onTaskCreated={handleTaskCreated}
            />
        </div>
    );
};

export default Dashboard;