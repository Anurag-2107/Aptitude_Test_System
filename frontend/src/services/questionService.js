import api from './authService';

export const questionService = {
    // Get all questions (admin only)
    getAllQuestions: async () => {
        try {
            const response = await api.get('/questions');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get active questions only
    getActiveQuestions: async () => {
        try {
            const response = await api.get('/questions/active');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Get question by ID
    getQuestionById: async (id) => {
        try {
            const response = await api.get(`/questions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Create new question
    createQuestion: async (questionData) => {
        try {
            const response = await api.post('/questions', questionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Update question
    updateQuestion: async (id, questionData) => {
        try {
            const response = await api.put(`/questions/${id}`, questionData);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Delete question
    deleteQuestion: async (id) => {
        try {
            const response = await api.delete(`/questions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Deactivate question
    deactivateQuestion: async (id) => {
        try {
            const response = await api.patch(`/questions/${id}/deactivate`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    // Activate question
    activateQuestion: async (id) => {
        try {
            const response = await api.patch(`/questions/${id}/activate`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};