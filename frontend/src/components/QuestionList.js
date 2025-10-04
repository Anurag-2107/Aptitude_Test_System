import React, { useState, useEffect } from 'react';
import { questionService } from '../services/questionService';

const QuestionList = ({ onEdit, onDelete }) => {
  const [questions, setQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [viewingQuestion, setViewingQuestion] = useState(null);

  // Fetch questions when component mounts
  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await questionService.getAllQuestions();
      setQuestions(data);
      setSelectedQuestions([]); // Clear selection when data refreshes
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions');
    } finally {
      setLoading(false);
    }
  };

  // Handle individual question selection
  const handleSelectQuestion = (questionId) => {
    setSelectedQuestions(prev => {
      if (prev.includes(questionId)) {
        return prev.filter(id => id !== questionId);
      } else {
        return [...prev, questionId];
      }
    });
  };

  // Handle select all/none
  const handleSelectAll = () => {
    if (selectedQuestions.length === questions.length) {
      // If all are selected, deselect all
      setSelectedQuestions([]);
    } else {
      // Select all questions
      const allQuestionIds = questions.map(q => q.id);
      setSelectedQuestions(allQuestionIds);
    }
  };

  // Handle view question details
  const handleViewQuestion = (question) => {
    setViewingQuestion(question);
  };

  // Close view modal
  const handleCloseView = () => {
    setViewingQuestion(null);
  };

  // Handle bulk deletion
  const handleBulkDelete = async () => {
    if (selectedQuestions.length === 0) {
      alert('Please select at least one question to delete.');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedQuestions.length} question(s)?`)) {
      try {
        // Delete all selected questions
        const deletePromises = selectedQuestions.map(id => 
          questionService.deleteQuestion(id)
        );
        
        await Promise.all(deletePromises);
        
        // Refresh the list after bulk deletion
        fetchQuestions();
        
        alert(`Successfully deleted ${selectedQuestions.length} question(s).`);
        
      } catch (error) {
        console.error('Error deleting questions:', error);
        alert('Failed to delete some questions');
      }
    }
  };

  if (loading) {
    return (
      <div className="question-list">
        <h2>Manage Questions</h2>
        <div className="loading">Loading questions...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="question-list">
        <h2>Manage Questions</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchQuestions} className="retry-btn">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="question-list">
      {/* View Question Modal */}
      {viewingQuestion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Question Details</h3>
              <button className="close-btn" onClick={handleCloseView}>×</button>
            </div>
            <div className="modal-body">
              <div className="question-detail">
                <div className="detail-row">
                  <label>ID:</label>
                  <span>{viewingQuestion.id}</span>
                </div>
                <div className="detail-row">
                  <label>Category:</label>
                  <span>{viewingQuestion.category}</span>
                </div>
                <div className="detail-row">
                  <label>Difficulty Level:</label>
                  <span>{viewingQuestion.difficultyLevel}</span>
                </div>
                <div className="detail-row">
                  <label>Status:</label>
                  <span className={`status ${viewingQuestion.active ? 'active' : 'inactive'}`}>
                    {viewingQuestion.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="detail-row">
                  <label>Created By:</label>
                  <span>{viewingQuestion.createdBy || 'N/A'}</span>
                </div>
                <div className="detail-row full-width">
                  <label>Question Text:</label>
                  <div className="question-text-full">
                    {viewingQuestion.questionText}
                  </div>
                </div>
                <div className="options-section">
                  <h4>Options:</h4>
                  <div className="options-grid">
                    <div className={`option ${viewingQuestion.correctAnswer === 'A' ? 'correct' : ''}`}>
                      <strong>A:</strong> {viewingQuestion.optionA}
                    </div>
                    <div className={`option ${viewingQuestion.correctAnswer === 'B' ? 'correct' : ''}`}>
                      <strong>B:</strong> {viewingQuestion.optionB}
                    </div>
                    <div className={`option ${viewingQuestion.correctAnswer === 'C' ? 'correct' : ''}`}>
                      <strong>C:</strong> {viewingQuestion.optionC}
                    </div>
                    <div className={`option ${viewingQuestion.correctAnswer === 'D' ? 'correct' : ''}`}>
                      <strong>D:</strong> {viewingQuestion.optionD}
                    </div>
                  </div>
                </div>
                {viewingQuestion.explanation && (
                  <div className="detail-row full-width">
                    <label>Explanation:</label>
                    <div className="explanation">
                      {viewingQuestion.explanation}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button onClick={handleCloseView} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="question-list-header">
        <h2>Manage Questions</h2>
        <div className="bulk-actions">
          {selectedQuestions.length > 0 && (
            <button 
              onClick={handleBulkDelete}
              className="bulk-delete-btn"
            >
              🗑️ Delete Selected ({selectedQuestions.length})
            </button>
          )}
        </div>
      </div>

      {questions.length === 0 ? (
        <p>No questions available. Add some questions to get started.</p>
      ) : (
        <>
          <div className="selection-info">
            <label className="select-all-checkbox">
                <input
                type="checkbox"
                checked={selectedQuestions.length === questions.length && questions.length > 0}
                onChange={handleSelectAll}
              />
              Select All
            </label><br></br>
            <span className="selection-count">
              {selectedQuestions.length} of {questions.length} selected
            </span>
          </div>

          <table>
            <thead>
              <tr>
                <th width="50px">Select</th>
                <th>ID</th>
                <th>Category</th>
                <th>Question</th>
                <th>Difficulty</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map(question => (
                <tr key={question.id} className={selectedQuestions.includes(question.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedQuestions.includes(question.id)}
                      onChange={() => handleSelectQuestion(question.id)}
                    />
                  </td>
                  <td>{question.id}</td>
                  <td>{question.category || 'N/A'}</td>
                  <td className="question-text">
                    {(question.questionText || '').substring(0, 50)}...
                  </td>
                  <td>{question.difficultyLevel || 'N/A'}</td>
                  <td>
                    <span className={`status ${question.active ? 'active' : 'inactive'}`}>
                      {question.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="actions">
                    <button 
                      onClick={() => onEdit(question)}
                      className="edit-btn"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleViewQuestion(question)}
                      className="view-btn"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default QuestionList;