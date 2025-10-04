// import React, { useState, useEffect } from 'react';
// import QuestionList from './components/QuestionList';
// import QuestionForm from './components/QuestionForm';
// import TestComponent from './components/TestComponent';
// import './App.css';

// function App() {
//   const [currentView, setCurrentView] = useState('manage');
//   const [questions, setQuestions] = useState([]);
//   const [editingQuestion, setEditingQuestion] = useState(null);

//   useEffect(() => {
//     fetchQuestions();
//   }, []);

//   const fetchQuestions = async () => {
//     try {
//       const response = await fetch('http://localhost:8080/api/questions');
//       const data = await response.json();
//       setQuestions(data);
//     } catch (error) {
//       console.error('Error fetching questions:', error);
//     }
//   };

//   const handleEdit = (question) => {
//     setEditingQuestion(question);
//     setCurrentView('form');
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm('Are you sure you want to delete this question?')) {
//       try {
//         await fetch(`http://localhost:8080/api/questions/${id}`, {
//           method: 'DELETE'
//         });
//         fetchQuestions();
//       } catch (error) {
//         console.error('Error deleting question:', error);
//       }
//     }
//   };

//   const handleFormSubmit = async (questionData) => {
//     try {
//       const url = editingQuestion 
//         ? `http://localhost:8080/api/questions/${editingQuestion.id}`
//         : 'http://localhost:8080/api/questions';
      
//       const method = editingQuestion ? 'PUT' : 'POST';
      
//       const response = await fetch(url, {
//         method: method,
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(questionData)
//       });
      
//       if (response.ok) {
//         setEditingQuestion(null);
//         setCurrentView('manage');
//         fetchQuestions();
//       }
//     } catch (error) {
//       console.error('Error saving question:', error);
//     }
//   };

//   const handleCancel = () => {
//     setEditingQuestion(null);
//     setCurrentView('manage');
//   };

//   return (
//     <div className="App">
//       <header className="App-header">
//         <h1>Aptitude Test System</h1>
//         <nav>
//           <button 
//             className={currentView === 'manage' ? 'active' : ''} 
//             onClick={() => setCurrentView('manage')}
//           >
//             Manage Questions
//           </button>
//           <button 
//             className={currentView === 'form' ? 'active' : ''} 
//             onClick={() => {
//               setEditingQuestion(null);
//               setCurrentView('form');
//             }}
//           >
//             Add Question
//           </button>
//           <button 
//             className={currentView === 'test' ? 'active' : ''} 
//             onClick={() => setCurrentView('test')}
//           >
//             Take Test
//           </button>
//         </nav>
//       </header>

//       <main>
//         {currentView === 'manage' && (
//           <QuestionList 
//             questions={questions} 
//             onEdit={handleEdit} 
//             onDelete={handleDelete} 
//           />
//         )}
        
//         {currentView === 'form' && (
//           <QuestionForm 
//             question={editingQuestion} 
//             onSubmit={handleFormSubmit} 
//             onCancel={handleCancel} 
//           />
//         )}
        
//         {currentView === 'test' && (
//           <TestComponent questions={questions} />
//         )}
//       </main>
//     </div>
//   );
// }

// export default App;



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