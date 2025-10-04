// src/components/TakeTest.js
import React, { useEffect, useState } from "react";

const TakeTest = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:8080/api/questions/active")
      .then(res => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then(data => {
        console.log("Fetched questions:", data); // Debug: check backend response
        setQuestions(data);
      })
      .catch(err => console.error("Error loading questions:", err))
      .finally(() => setLoading(false)); // ✅ Ensure loading is cleared
  }, []);

  if (loading) {
    return <p>Loading questions...</p>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>Take Test</h2>
      {questions.length === 0 ? (
        <p>No active questions available.</p>
      ) : (
        <div>
          {questions.map((q, index) => (
            <div key={q.id} style={{ marginBottom: "20px" }}>
              <p>
                <strong>{index + 1}. {q.questionText}</strong>
              </p>
              <div>
                <label><input type="radio" name={`q-${q.id}`} value="A" /> {q.optionA}</label><br />
                <label><input type="radio" name={`q-${q.id}`} value="B" /> {q.optionB}</label><br />
                <label><input type="radio" name={`q-${q.id}`} value="C" /> {q.optionC}</label><br />
                <label><input type="radio" name={`q-${q.id}`} value="D" /> {q.optionD}</label>
              </div>
            </div>
          ))}
          <button>Submit Test</button>
        </div>
      )}
    </div>
  );
};

export default TakeTest;
