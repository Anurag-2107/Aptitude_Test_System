import api from './authService';

export const testService = {
    // Get test questions
    getTestQuestions: async () => {
        try {
            const response = await api.get('/test/questions');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Submit test
    submitTest: async (submissionData) => {
        try {
            const response = await api.post('/test/submit', submissionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get user results
    getUserResults: async () => {
        try {
            const response = await api.get('/test/results');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};