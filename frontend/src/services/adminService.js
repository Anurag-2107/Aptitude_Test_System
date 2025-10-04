import api from './authService';

export const adminService = {
    // Debug authentication
    debugAuth: async () => {
        try {
            console.log('Debugging authentication...');
            const response = await api.get('/admin/debug/auth');
            console.log('Auth debug response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Auth debug error:', error);
            throw error;
        }
    },

    // Test endpoint without auth
    testNoAuth: async () => {
        try {
            console.log('Testing no-auth endpoint...');
            const response = await api.get('/admin/test/no-auth');
            console.log('No-auth test response:', response.data);
            return response.data;
        } catch (error) {
            console.error('No-auth test error:', error);
            throw error;
        }
    },

    // Get all test results
    getAllResults: async () => {
        try {
            console.log('Fetching all results...');
            const response = await api.get('/admin/results/all');
            console.log('All results response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching all results:', error);
            throw error;
        }
    },

    // Get all users
    getAllUsers: async () => {
        try {
            console.log('Fetching all users...');
            const response = await api.get('/admin/users');
            console.log('All users response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching all users:', error);
            throw error;
        }
    },

    // Export results
    exportResults: async () => {
        try {
            console.log('Exporting results...');
            const response = await api.get('/admin/results/export');
            console.log('Export response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error exporting results:', error);
            throw error;
        }
    },

    // Get question statistics
    getQuestionStats: async () => {
        try {
            console.log('Fetching question stats...');
            const response = await api.get('/admin/stats/questions');
            console.log('Question stats response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching question stats:', error);
            throw error;
        }
    },

    // Get system statistics
    getSystemStats: async () => {
        try {
            console.log('Fetching system stats...');
            const response = await api.get('/admin/stats/system');
            console.log('System stats response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching system stats:', error);
            throw error;
        }
    },

    // Get recent tests
    getRecentTests: async () => {
        try {
            console.log('Fetching recent tests...');
            const response = await api.get('/admin/results/recent');
            console.log('Recent tests response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching recent tests:', error);
            throw error;
        }
    },

    // Deactivate user
    deactivateUser: async (userId) => {
        try {
            console.log('Deactivating user:', userId);
            const response = await api.patch(`/admin/users/${userId}/deactivate`);
            console.log('Deactivate user response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error deactivating user:', error);
            throw error;
        }
    },

    // Activate user
    activateUser: async (userId) => {
        try {
            console.log('Activating user:', userId);
            const response = await api.patch(`/admin/users/${userId}/activate`);
            console.log('Activate user response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Error activating user:', error);
            throw error;
        }
    }
};