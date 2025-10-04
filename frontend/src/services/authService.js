import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

// Create axios instance for API calls
const api = axios.create({
    baseURL: 'http://localhost:8080/api',
});

// Add token to requests automatically
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('role');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authService = {
    login: async (username, password) => {
        try {
            const response = await api.post(`${API_URL}/login`, { // Use 'api' instead of 'axios'
                username,
                password
            });
            
            // Store token if your backend returns one
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
            }
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
            if (response.data.role) {
                localStorage.setItem('role', response.data.role);
            }
            
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    register: async (userData) => {
        try {
            const response = await api.post(`${API_URL}/register`, userData); // Use 'api' instead of 'axios'
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Optional: Add logout method
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        window.location.href = '/';
    }
};

export default api;