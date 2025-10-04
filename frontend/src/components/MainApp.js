import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import QuestionList from './QuestionList';
import QuestionForm from './QuestionForm';
import TakeTest from "./TakeTest";
import Results from './Results';
import AdminDashboard from './AdminDashboard';

const MainApp = () => {
    const { currentUser, logout } = useAuth();
    const [currentView, setCurrentView] = useState('dashboard');
    const [editingQuestion, setEditingQuestion] = useState(null);
    const [questions, setQuestions] = useState([]);

    // Set initial view based on user role
    useEffect(() => {
        if (currentUser?.role === 'ADMIN') {
            setCurrentView('dashboard');
        } else {
            setCurrentView('test');
        }
    }, [currentUser]);

    const handleLogout = () => {
        logout();
    };

    const getNavItems = () => {
        const baseItems = [
            { key: 'test', label: 'Take Test' },
            { key: 'results', label: 'My Results' }
        ];

        if (currentUser?.role === 'ADMIN') {
            return [
                { key: 'dashboard', label: 'Dashboard' },
                { key: 'manage', label: 'Manage Questions' },
                { key: 'add', label: 'Add Question' },
                ...baseItems
            ];
        }

        return baseItems;
    };

    const handleQuestionSuccess = () => {
        setEditingQuestion(null);
        setCurrentView('manage');
    };

    const handleQuestionCancel = () => {
        setEditingQuestion(null);
        setCurrentView('manage');
    };

    return (
        <div className="main-app">
            <header className="main-header">
                <div className="header-content">
                    <h1>🎯 Aptitude Test System</h1>
                    <div className="user-info">
                        <span>
                            Welcome, {currentUser?.username} ({currentUser?.role})
                        </span>
                        <button onClick={handleLogout} className="logout-btn">
                            Logout
                        </button>
                    </div>
                </div>
                
                <nav className="main-nav">
                    {getNavItems().map(item => (
                        <button
                            key={item.key}
                            className={currentView === item.key ? 'active' : ''}
                            onClick={() => {
                                setEditingQuestion(null);
                                setCurrentView(item.key);
                            }}
                        >
                            {item.label}
                        </button>
                    ))}
                </nav>
            </header>

            <main className="main-content">
                {currentView === 'dashboard' && currentUser?.role === 'ADMIN' && (
                    <AdminDashboard />
                )}
                {currentView === 'manage' && currentUser?.role === 'ADMIN' && (
                    <QuestionList 
                        onEdit={(question) => {
                            setEditingQuestion(question);
                            setCurrentView('add');
                        }}
                    />
                )}
                {currentView === 'add' && currentUser?.role === 'ADMIN' && (
                    <QuestionForm 
                        question={editingQuestion}
                        onSuccess={handleQuestionSuccess}
                        onCancel={handleQuestionCancel}
                    />
                )}

                {/* ✅ NEW: Render TakeTest for students (and also visible for admins in nav) */}
                {currentView === 'test' && (
                    <TakeTest />
                )}

                {currentView === 'results' && (
                    <Results />
                )}
            </main>
        </div>
    );
};

export default MainApp;
