import React, { useState, useEffect } from 'react';
import { questionService } from '../services/questionService';

const QuestionForm = ({ question, onSuccess, onCancel }) => {
    const [formData, setFormData] = useState({
        category: '',
        questionText: '',
        optionA: '',
        optionB: '',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        explanation: '',
        difficultyLevel: 1,
        active: true
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (question) {
            setFormData({
                category: question.category || '',
                questionText: question.questionText || '',
                optionA: question.optionA || '',
                optionB: question.optionB || '',
                optionC: question.optionC || '',
                optionD: question.optionD || '',
                correctAnswer: question.correctAnswer || 'A',
                explanation: question.explanation || '',
                difficultyLevel: question.difficultyLevel || 1,
                active: question.active !== undefined ? question.active : true
            });
        }
    }, [question]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        console.log('Submitting question:', formData); // Debug log

        try {
            let result;
            if (question) {
                console.log('Updating existing question:', question.id);
                result = await questionService.updateQuestion(question.id, formData);
            } else {
                console.log('Creating new question');
                result = await questionService.createQuestion(formData);
            }
            
            console.log('Question saved successfully:', result);
            
            // Reset form
            if (!question) {
                setFormData({
                    category: '',
                    questionText: '',
                    optionA: '',
                    optionB: '',
                    optionC: '',
                    optionD: '',
                    correctAnswer: 'A',
                    explanation: '',
                    difficultyLevel: 1,
                    active: true
                });
            }
            
            // Call success callback
            if (onSuccess) {
                console.log('Calling onSuccess callback');
                onSuccess();
            } else {
                console.warn('onSuccess callback is not defined');
            }
        } catch (error) {
            console.error('Error saving question:', error);
            console.error('Error response:', error.response);
            setError(error.response?.data?.message || error.response?.data || 'Failed to save question');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="question-form-container">
            <h2>{question ? 'Edit Question' : 'Add New Question'}</h2>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="question-form">
                <div className="form-group">
                    <label>Category:</label>
                    <select 
                        name="category" 
                        value={formData.category} 
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Category</option>
                        <option value="Quantitative">Quantitative</option>
                        <option value="Logical">Logical</option>
                        <option value="Verbal">Verbal</option>
                        <option value="Technical">Technical</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Question Text:</label>
                    <textarea 
                        name="questionText" 
                        value={formData.questionText} 
                        onChange={handleChange}
                        required
                        rows="4"
                        placeholder="Enter your question here..."
                    />
                </div>

                <div className="form-group">
                    <label>Option A:</label>
                    <input 
                        type="text" 
                        name="optionA" 
                        value={formData.optionA} 
                        onChange={handleChange}
                        required
                        placeholder="Enter option A"
                    />
                </div>

                <div className="form-group">
                    <label>Option B:</label>
                    <input 
                        type="text" 
                        name="optionB" 
                        value={formData.optionB} 
                        onChange={handleChange}
                        required
                        placeholder="Enter option B"
                    />
                </div>

                <div className="form-group">
                    <label>Option C:</label>
                    <input 
                        type="text" 
                        name="optionC" 
                        value={formData.optionC} 
                        onChange={handleChange}
                        required
                        placeholder="Enter option C"
                    />
                </div>

                <div className="form-group">
                    <label>Option D:</label>
                    <input 
                        type="text" 
                        name="optionD" 
                        value={formData.optionD} 
                        onChange={handleChange}
                        required
                        placeholder="Enter option D"
                    />
                </div>

                <div className="form-group">
                    <label>Correct Answer:</label>
                    <select 
                        name="correctAnswer" 
                        value={formData.correctAnswer} 
                        onChange={handleChange}
                        required
                    >
                        <option value="A">A</option>
                        <option value="B">B</option>
                        <option value="C">C</option>
                        <option value="D">D</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Explanation:</label>
                    <textarea 
                        name="explanation" 
                        value={formData.explanation} 
                        onChange={handleChange}
                        rows="3"
                        placeholder="Optional explanation for the correct answer..."
                    />
                </div>

                <div className="form-group">
                    <label>Difficulty Level (1-5):</label>
                    <input 
                        type="number" 
                        name="difficultyLevel" 
                        value={formData.difficultyLevel} 
                        onChange={handleChange}
                        min="1" 
                        max="5"
                        required
                    />
                </div>

                <div className="form-group checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                        />
                        Active Question
                    </label>
                </div>

                <div className="form-actions">
                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? 'Saving...' : (question ? 'Update Question' : 'Add Question')}
                    </button>
                    <button type="button" onClick={onCancel} disabled={loading} className="btn-secondary">
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default QuestionForm;