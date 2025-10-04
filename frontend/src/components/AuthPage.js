import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <div className="auth-page">
            <div className="auth-header">
                <h1>🎯 Aptitude Test System</h1>
                <p>Test your skills and improve your knowledge</p>
            </div>
            {isLogin ? (
                <Login switchToRegister={() => setIsLogin(false)} />
            ) : (
                <Register switchToLogin={() => setIsLogin(true)} />
            )}
        </div>
    );
};

export default AuthPage;