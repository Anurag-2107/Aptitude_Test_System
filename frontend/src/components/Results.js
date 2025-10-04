import React, { useState, useEffect } from 'react';
import { testService } from '../services/testService';

const Results = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchResults();
    }, []);

    const fetchResults = async () => {
        try {
            const response = await testService.getUserResults();
            setResults(response);
        } catch (error) {
            console.error('Error fetching results:', error);
        } finally {
            setLoading(false);
        }
    };

    const exportMyResults = () => {
        const csvContent = "data:text/csv;charset=utf-8," 
            + "Date,Score,Total Questions,Percentage,Time Taken\n"
            + results.map(result => 
                `${new Date(result.testDate).toLocaleDateString()},${result.score},${result.totalQuestions},${result.percentage?.toFixed(1) || '0'}%,${result.timeTaken}s`
            ).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my_test_results.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) {
        return <div className="loading">Loading results...</div>;
    }

    return (
        <div className="results-container">
            <div className="results-header">
                <h2>My Test Results</h2>
                <button onClick={exportMyResults} className="export-btn">
                    Export My Results
                </button>
            </div>

            {results.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Score</th>
                            <th>Total Questions</th>
                            <th>Percentage</th>
                            <th>Time Taken</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result.id}>
                                <td>{new Date(result.testDate).toLocaleDateString()}</td>
                                <td>{result.score}/{result.totalQuestions}</td>
                                <td>{result.totalQuestions}</td>
                                <td>{result.percentage?.toFixed(1) || '0'}%</td>
                                <td>{result.timeTaken} seconds</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No test results found. Take a test to see your results here!</p>
            )}
        </div>
    );
};

export default Results;