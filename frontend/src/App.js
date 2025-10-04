import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import AuthPage from './components/AuthPage';
import MainApp from './components/MainApp';
import './App.css';

const AppContent = () => {
    const { currentUser } = useAuth();

    return (
        <div className="App">
            {currentUser ? <MainApp /> : <AuthPage />}
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;