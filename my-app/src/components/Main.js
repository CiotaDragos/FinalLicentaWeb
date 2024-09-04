// src/components/Main.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Main.css';

const Main = () => {
  const [activePage, setActivePage] = useState('Find Personality');
  const [text, setText] = useState('');
  const [historyData, setHistoryData] = useState([]);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [resultModal, setResultModal] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  const handleSubmit = async () => {
    if (!text.trim()) {
      setErrorMessage('Text cannot be empty.');
      return;
    }

    try {
      setLoading(true);

      const data1 = {
        textToAnalyze: text,
        email: localStorage.getItem('userEmail'),
      };

      const response = await fetch('http://localhost:8080/api/auth/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data1)
      });

      if (!response.ok) {
        throw new Error('Failed to analyze text.');
      }

      const data = await response.json();
      const result = data.token;
      console.log(data)
      console.log(result)

      setResultModal({ result, text });
      setHistoryData([...historyData, { text, result }]);
      setText(''); // Clear the input after submission
      setErrorMessage(''); // Clear any previous error messages
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHistoryClick = (entry) => {
    setSelectedHistory(entry);
  };

  const handleCloseModal = () => {
    setSelectedHistory(null);
    setResultModal(null);
  };

  const fetchHistory = async () => {
    try {
      setLoading(true);

      const email = localStorage.getItem('userEmail');
      const response = await fetch(`http://localhost:8080/api/auth/history?email=${email}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to retrieve history.');
      }

      const data = await response.json();
      // Convert the list of strings to a list of objects with text and result properties
      const formattedData = data.map((item) => ({ text: item, result: '' }));
      setHistoryData(formattedData); // Update history data with formatted data
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch history when component mounts
  React.useEffect(() => {
    fetchHistory();
  }, []);

  const renderContent = () => {
    switch (activePage) {
      case 'Find Personality':
        return (
          <div className="find-personality-content">
            <textarea
              placeholder="Enter text here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="text-input"
            />
            <button onClick={handleSubmit} className="submit-button" disabled={loading}>
              {loading ? 'Analyzing...' : 'Submit'}
            </button>
            {errorMessage && <div className="error-message">{errorMessage}</div>}
          </div>
        );
      case 'History':
        return (
          <div className="history-content">
            <h3>History</h3>
            <ul className="history-list">
              {historyData.map((entry, index) => (
                <li
                  key={index}
                  className="history-item"
                  onClick={() => handleHistoryClick(entry)}
                >
                  <div className="history-text">{entry.text}</div>
                  <div className="history-result">{entry.result || 'No result'}</div>
                </li>
              ))}
            </ul>
          </div>
        );
      default:
        return <div>Find Personality Content</div>;
    }
  };

  return (
    <div className="main-container">
      <div className="navbar">
        <button onClick={() => setActivePage('Find Personality')} className={`nav-button ${activePage === 'Find Personality' ? 'active' : ''}`}>Find Personality</button>
        <button onClick={() => setActivePage('History')} className={`nav-button ${activePage === 'History' ? 'active' : ''}`}>History</button>
        <button onClick={handleLogout} className="nav-button logout-button">Log out</button>
      </div>
      <div className="content">
        {renderContent()}
      </div>
      {selectedHistory && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <div className="modal-result">Result: {selectedHistory.result}</div>
            <div className="modal-text">{selectedHistory.text}</div>
          </div>
        </div>
      )}
      {resultModal && (
        <div className="modal">
          <div className="modal-content">
            <span className="close-button" onClick={handleCloseModal}>&times;</span>
            <div className="modal-result">Result: {resultModal.result}</div>
            <div className="modal-text">{resultModal.text}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Main;
