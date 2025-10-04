import React, { useState, useEffect } from 'react';
import QuestionList from '../QuestionList';
import QuestionForm from './QuestionForm';
import { questionService } from '../services/questionService';

const QuestionManager = () => {
  const [questions, setQuestions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      console.log('Fetching questions...');
      const data = await questionService.getAllQuestions();
      console.log('Fetched questions:', data);
      setQuestions(data);
      setMessage('');
    } catch (error) {
      console.error('Error fetching questions:', error);
      setMessage('Error loading questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(id);
        setQuestions(prev => prev.filter(q => q.id !== id));
        setMessage('Question deleted successfully');
      } catch (error) {
        console.error('Error deleting question:', error);
        setMessage('Error deleting question');
      }
    }
  };

  const handleFormSuccess = () => {
    console.log('Form success - refreshing questions...');
    // Refresh questions and show success message
    fetchQuestions();
    setShowForm(false);
    setEditingQuestion(null);
    setMessage('Question saved successfully!');
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
    setMessage('');
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchQuestions();
  };

  if (loading) {
    return <div className="loading">Loading questions...</div>;
  }

  return (
    <div className="question-manager">
      <div className="header">
        <h1>Question Management</h1>
        <div className="actions">
          <button onClick={handleRefresh} className="btn-secondary">
            Refresh List
          </button>
          <button onClick={handleAddQuestion} className="btn-primary">
            Add New Question
          </button>
        </div>
      </div>

      {message && (
        <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {showForm ? (
        <QuestionForm
          question={editingQuestion}
          onSuccess={handleFormSuccess}
          onCancel={handleCancel}
        />
      ) : (
        <QuestionList
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      )}
    </div>
  );
};

export default QuestionManager;