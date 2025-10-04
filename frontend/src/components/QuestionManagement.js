import React, { useState, useEffect } from 'react';
import QuestionManager from './QuestionManager';
import { questionService } from '../services/questionService';

const QuestionManagement = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manage'); // 'manage' or 'add'

  // Fetch questions on component mount
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const data = await questionService.getAllQuestions();
      setQuestions(data);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuestionAdded = () => {
    // Refresh questions list when a new question is added
    fetchQuestions();
    // Optionally switch to manage tab
    setActiveTab('manage');
  };

  const handleDeleteQuestion = async (id) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await questionService.deleteQuestion(id);
        setQuestions(prev => prev.filter(q => q.id !== id));
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading questions...</div>;
  }

  return (
    <div className="question-management">
      <div className="tabs">
        <button 
          className={activeTab === 'manage' ? 'active' : ''}
          onClick={() => setActiveTab('manage')}
        >
          Manage Questions ({questions.length})
        </button>
        <button 
          className={activeTab === 'add' ? 'active' : ''}
          onClick={() => setActiveTab('add')}
        >
          Add Question
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'manage' ? (
          <QuestionManager 
            questions={questions}
            onQuestionAdded={handleQuestionAdded}
            onDeleteQuestion={handleDeleteQuestion}
            onRefresh={fetchQuestions}
          />
        ) : (
          <QuestionForm 
            onSuccess={handleQuestionAdded}
            onCancel={() => setActiveTab('manage')}
          />
        )}
      </div>
    </div>
  );
};

export default QuestionManagement;