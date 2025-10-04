import React, { useState, useEffect } from 'react';
import { adminService } from '../services/adminService';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalQuestions: 0,
        activeQuestions: 0,
        totalUsers: 0,
        adminUsers: 0,
        regularUsers: 0,
        totalTests: 0,
        averageScore: 0
    });
    const [recentTests, setRecentTests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [questionsRes, systemRes, recentTestsRes] = await Promise.all([
                adminService.getQuestionStats(),
                adminService.getSystemStats(),
                adminService.getRecentTests()
            ]);

            setStats({
                totalQuestions: questionsRes.total || 0,
                activeQuestions: questionsRes.active || 0,
                totalUsers: systemRes.totalUsers || 0,
                adminUsers: systemRes.adminUsers || 0,
                regularUsers: systemRes.regularUsers || 0,
                totalTests: systemRes.totalTests || 0,
                averageScore: systemRes.averageScore || 0
            });

            setRecentTests(recentTestsRes || []);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportResults = async () => {
        try {
            const response = await adminService.exportResults();
            // Create and download CSV file
            const blob = new Blob([response.csvData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `test_results_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            alert(`Exported ${response.count} test results successfully!`);
        } catch (error) {
            console.error('Error exporting results:', error);
            alert('Error exporting results');
        }
    };

    if (loading) {
        return <div className="loading">Loading dashboard...</div>;
    }

    return (
        <div className="admin-dashboard">
            <h2>Admin Dashboard</h2>
            
            <div className="stats-grid">
                <div className="stat-card">
                    <h3>Total Questions</h3>
                    <p className="stat-number">{stats.totalQuestions}</p>
                    <small>Active: {stats.activeQuestions}</small>
                </div>
                <div className="stat-card">
                    <h3>Total Users</h3>
                    <p className="stat-number">{stats.totalUsers}</p>
                    <small>Admins: {stats.adminUsers}, Users: {stats.regularUsers}</small>
                </div>
                <div className="stat-card">
                    <h3>Total Tests</h3>
                    <p className="stat-number">{stats.totalTests}</p>
                </div>
                <div className="stat-card">
                    <h3>Average Score</h3>
                    <p className="stat-number">{stats.averageScore}%</p>
                </div>
            </div>

            <div className="dashboard-actions">
                <button onClick={exportResults} className="export-btn">
                    📊 Export All Results
                </button>
            </div>

            <div className="recent-tests">
                <h3>Recent Tests</h3>
                {recentTests.length > 0 ? (
                    <div className="table-container">
                        <table>
                            <thead>
                                <tr>
                                    <th>User</th>
                                    <th>Score</th>
                                    <th>Percentage</th>
                                    <th>Time Taken</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentTests.map(test => (
                                    <tr key={test.id}>
                                        <td>{test.user?.username || 'Unknown'}</td>
                                        <td>{test.score}/{test.totalQuestions}</td>
                                        <td>{test.percentage?.toFixed(1) || '0'}%</td>
                                        <td>{test.timeTaken}s</td>
                                        <td>{new Date(test.testDate).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p>No tests taken yet.</p>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;