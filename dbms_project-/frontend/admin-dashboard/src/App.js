// ============================================================================
// GOVERNMENT SCHEME ADMIN DASHBOARD - MAIN APP
// Complete integration with Oracle backend + Voice queries
// ============================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminDashboard from './components/AdminDashboard';
import './App.css';

const API_URL = 'http://localhost:3000/api/v1';

// ============================================================================
// VOICE QUERY COMPONENT
// ============================================================================

const VoiceQueryInterface = ({ onQuerySubmit }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [queryResult, setQueryResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleVoiceQuery = async () => {
    if (!transcript.trim()) {
      setError('Please enter a query or use voice input');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Example: Check eligibility
      const response = await axios.post(`${API_URL}/voice/query`, {
        text_query: transcript,
        beneficiary_id: '1', // Demo beneficiary
        language_code: 'en-IN',
      });

      setQueryResult(response.data);
      onQuerySubmit?.(response.data);
    } catch (err) {
      setError(`Error: ${err.response?.data?.error || err.message}`);
      console.error('Voice query error:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      // In real app, would stop audio recording and convert to text
      setTranscript('Show me schemes for farmers in Punjab');
    } else {
      setIsRecording(true);
      setTranscript('');
      setError('');
    }
  };

  return (
    <div className="voice-query-container">
      <div className="voice-card">
        <h2>🎤 Voice-Powered Query System</h2>
        <p className="subtitle">Ask questions in natural language to access government schemes information</p>

        <div className="voice-input-section">
          <textarea
            className="voice-textarea"
            placeholder="Enter or say: 'Which schemes am I eligible for?' or 'Show beneficiaries with high gaps'"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            disabled={isRecording}
          />

          <div className="voice-button-group">
            <button
              className={`voice-button ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
            >
              {isRecording ? '⏹️ Stop Recording' : '🎙️ Start Recording'}
            </button>

            <button
              className="submit-button"
              onClick={handleVoiceQuery}
              disabled={loading || !transcript.trim()}
            >
              {loading ? '⏳ Processing...' : '🔍 Execute Query'}
            </button>
          </div>

          {error && <div className="error-message">{error}</div>}
        </div>

        {queryResult && (
          <div className="query-result">
            <h3>Query Result:</h3>
            <pre>{JSON.stringify(queryResult, null, 2)}</pre>
          </div>
        )}

        <div className="example-queries">
          <h4>Example Queries:</h4>
          <ul>
            <li>"Which government schemes is Harjeet Singh eligible for?"</li>
            <li>"Show me beneficiaries with high enrollment gaps in agriculture"</li>
            <li>"List all schemes available in Punjab"</li>
            <li>"What is my eligibility status?"</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// DATABASE STATUS COMPONENT
// ============================================================================

const DatabaseStatus = () => {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkDatabaseStatus = async () => {
      try {
        const response = await axios.get(`${API_URL}/health`);
        setStatus(response.data);
        setError('');
      } catch (err) {
        setError('Database connection failed');
        console.error('Database status check failed:', err);
      } finally {
        setLoading(false);
      }
    };

    checkDatabaseStatus();
    // Poll every 10 seconds
    const interval = setInterval(checkDatabaseStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div className="status-loading">🔄 Checking database connection...</div>;
  }

  return (
    <div className={`database-status ${error ? 'error' : 'connected'}`}>
      <span className="status-dot"></span>
      {error ? (
        <div>
          <strong>⚠️ Database Offline</strong>
          <p>Please ensure Oracle database is running on localhost:1521</p>
        </div>
      ) : (
        <div>
          <strong>✅ Oracle 21c Connected</strong>
          <p>Database: {status?.database || 'XEPDB1'}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// MAIN APP COMPONENT
// ============================================================================

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [metrics, setMetrics] = useState({
    totalBeneficiaries: 12500000,
    totalEnrolled: 4200000,
    awarenessPercent: 56.2,
    gapCount: 8300000,
  });

  useEffect(() => {
    // Fetch metrics from backend
    const fetchMetrics = async () => {
      try {
        const response = await axios.get(`${API_URL}/analytics/metrics`);
        setMetrics(response.data);
      } catch (err) {
        console.log('Using default metrics (backend not available yet)');
        // Use defaults
      }
    };

    fetchMetrics();
  }, []);

  return (
    <div className="app-container">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <h1>🏛️ Government Scheme Administration System</h1>
          <p className="tagline">Oracle-powered analytics with AI voice queries</p>
        </div>
        <DatabaseStatus />
      </header>

      {/* Navigation Tabs */}
      <nav className="app-nav">
        <button
          className={`nav-tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Analytics Dashboard
        </button>
        <button
          className={`nav-tab ${activeTab === 'voice' ? 'active' : ''}`}
          onClick={() => setActiveTab('voice')}
        >
          🎤 Voice Query
        </button>
        <button
          className={`nav-tab ${activeTab === 'info' ? 'active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          ℹ️ System Info
        </button>
      </nav>

      {/* Main Content Area */}
      <main className="app-main">
        {activeTab === 'dashboard' && (
          <div className="tab-content">
            <AdminDashboard metrics={metrics} />
          </div>
        )}

        {activeTab === 'voice' && (
          <div className="tab-content">
            <VoiceQueryInterface onQuerySubmit={(result) => console.log('Query result:', result)} />
          </div>
        )}

        {activeTab === 'info' && (
          <div className="tab-content system-info">
            <div className="info-card">
              <h2>System Architecture</h2>
              <div className="architecture-diagram">
                <div className="component">
                  <h3>Frontend Layer</h3>
                  <ul>
                    <li>React 18.2</li>
                    <li>Recharts Visualizations</li>
                    <li>Voice Query Interface</li>
                    <li>Running on Port 3001</li>
                  </ul>
                </div>

                <div className="arrow">↓</div>

                <div className="component">
                  <h3>Backend Layer</h3>
                  <ul>
                    <li>Express.js REST API</li>
                    <li>5 Microservices</li>
                    <li>15+ Endpoints</li>
                    <li>Running on Port 3000</li>
                  </ul>
                </div>

                <div className="arrow">↓</div>

                <div className="component">
                  <h3>Database Layer</h3>
                  <ul>
                    <li>Oracle 21c Enterprise</li>
                    <li>18 Normalized Tables</li>
                    <li>12 PL/SQL Procedures</li>
                    <li>12 Automated Triggers</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Database Schema</h2>
              <div className="schema-info">
                <div className="schema-item">
                  <h4>Core Tables (18)</h4>
                  <ul>
                    <li>LOCATION - Geographic hierarchy</li>
                    <li>BENEFICIARY - Individual records</li>
                    <li>POLICY_SCHEME - Government schemes</li>
                    <li>ELIGIBILITY_MATCH - Scheme eligibility</li>
                    <li>BENEFICIARY_ENROLLMENT - Enrollment tracking</li>
                    <li>+ 13 more tables</li>
                  </ul>
                </div>

                <div className="schema-item">
                  <h4>Sample Data Loaded</h4>
                  <ul>
                    <li>3 Geographic Locations</li>
                    <li>5 Test Beneficiaries</li>
                    <li>11 Government Schemes</li>
                    <li>Pre-calculated Eligibility Matches</li>
                  </ul>
                </div>

                <div className="schema-item">
                  <h4>Business Logic (PL/SQL)</h4>
                  <ul>
                    <li>6 Stored Procedures</li>
                    <li>6 Functions</li>
                    <li>12 Automated Triggers</li>
                    <li>Audit & Validation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>API Endpoints Available</h2>
              <div className="endpoints-list">
                <div className="endpoint">
                  <code>GET /health</code> - System health check
                </div>
                <div className="endpoint">
                  <code>POST /beneficiary/register</code> - Register new beneficiary
                </div>
                <div className="endpoint">
                  <code>GET /eligibility/schemes</code> - Get eligible schemes
                </div>
                <div className="endpoint">
                  <code>POST /enrollment/apply</code> - Apply for scheme
                </div>
                <div className="endpoint">
                  <code>GET /analytics/metrics</code> - Get dashboard metrics
                </div>
                <div className="endpoint">
                  <code>POST /voice/query</code> - Process voice/text queries
                </div>
              </div>
            </div>

            <div className="info-card">
              <h2>Next Steps to Populate Data</h2>
              <ol className="setup-steps">
                <li>
                  <strong>Run Database Setup Script:</strong>
                  <code>setup_oracle.bat</code>
                  <p>This executes SQL files to create tables, indexes, and load sample data</p>
                </li>
                <li>
                  <strong>Refresh Dashboard:</strong>
                  <p>Press F5 or reload http://localhost:3001</p>
                </li>
                <li>
                  <strong>See Real Data:</strong>
                  <p>KPI cards, heatmaps, and charts will populate with actual database values</p>
                </li>
                <li>
                  <strong>Try Voice Queries:</strong>
                  <p>Click the "Voice Query" tab and ask natural language questions</p>
                </li>
              </ol>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>🏛️ Government Scheme Administration System v1.0</p>
        <p>Backend: http://localhost:3000 | Frontend: http://localhost:3001 | Database: Oracle 21c</p>
      </footer>
    </div>
  );
}
