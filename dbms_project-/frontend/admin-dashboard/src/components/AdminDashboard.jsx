// ============================================================================
// STAGE 5: ADMIN DASHBOARD - REACT COMPONENTS
// Government Scheme Analytics & Monitoring
// ============================================================================

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, AreaChart, PieChart, LineChart,
  Bar, Area, Pie, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from 'recharts';
import './AdminDashboard.css';

const API_URL = 'http://localhost:3000/api/v1';

// ============================================================================
// COMPONENT 1: KPI OVERVIEW
// ============================================================================

const KPIOverview = ({ metrics }) => {
  return (
    <div className="kpi-grid">
      <div className="kpi-card">
        <div className="kpi-icon">👥</div>
        <div className="kpi-content">
          <div className="kpi-value">{metrics.totalBeneficiaries?.toLocaleString()}</div>
          <div className="kpi-label">Total Beneficiaries</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">✓</div>
        <div className="kpi-content">
          <div className="kpi-value">{metrics.totalEnrolled?.toLocaleString()}</div>
          <div className="kpi-label">Total Enrolled</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">📢</div>
        <div className="kpi-content">
          <div className="kpi-value">{metrics.awarenessPercent?.toFixed(1)}%</div>
          <div className="kpi-label">Awareness Rate</div>
        </div>
      </div>

      <div className="kpi-card">
        <div className="kpi-icon">📊</div>
        <div className="kpi-content">
          <div className="kpi-value">{metrics.gapCount?.toLocaleString()}</div>
          <div className="kpi-label">Enrollment Gap</div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 2: GEOGRAPHIC HEATMAP
// ============================================================================

const GeographicHeatmap = ({ locationData }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  // Simplified heatmap visualization (would use Leaflet in real app)
  const getHeatColor = (awarenessPercent) => {
    if (awarenessPercent >= 75) return '#28A745'; // Green
    if (awarenessPercent >= 50) return '#FFC107'; // Yellow
    if (awarenessPercent >= 25) return '#FF9800'; // Orange
    return '#DC3545'; // Red (Critical)
  };

  return (
    <div className="heatmap-container">
      <h3>Geographic Awareness Heatmap</h3>
      <div className="legend">
        <span><span style={{ background: '#28A745' }}></span> 75%+ (Good)</span>
        <span><span style={{ background: '#FFC107' }}></span> 50-75% (Fair)</span>
        <span><span style={{ background: '#FF9800' }}></span> 25-50% (Low)</span>
        <span><span style={{ background: '#DC3545' }}></span> &lt;25% (Critical)</span>
      </div>

      <div className="heatmap-grid">
        {locationData?.map((location) => (
          <div
            key={location.location_id}
            className="heatmap-cell"
            style={{
              background: getHeatColor(location.awareness_percent),
            }}
            onClick={() => setSelectedLocation(location)}
            title={`${location.location_name}: ${location.awareness_percent}%`}
          >
            <span className="heatmap-label">
              {location.location_name.slice(0, 3)}
            </span>
          </div>
        ))}
      </div>

      {selectedLocation && (
        <div className="location-details">
          <h4>{selectedLocation.location_name}</h4>
          <p>Awareness: {selectedLocation.awareness_percent}%</p>
          <p>Beneficiaries: {selectedLocation.total_eligible_beneficiaries}</p>
          <p>Enrolled: {selectedLocation.total_enrolled_beneficiaries}</p>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT 3: SCHEME ANALYTICS CHART
// ============================================================================

const SchemeAnalytics = ({ schemeMetrics }) => {
  const data = schemeMetrics?.map((scheme) => ({
    name: scheme.scheme_code,
    enrolled: scheme.total_enrolled,
    eligible: scheme.total_eligible,
    enrollmentRate: scheme.enrollment_rate,
  })) || [];

  return (
    <div className="chart-container">
      <h3>Scheme Enrollment Analytics</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="enrolled" fill="#28A745" name="Enrolled" />
          <Bar dataKey="eligible" fill="#007AFF" name="Eligible" />
        </BarChart>
      </ResponsiveContainer>

      <div className="enrollment-rate-chart">
        <h4>Enrollment Rate by Scheme</h4>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Area
              type="monotone"
              dataKey="enrollmentRate"
              fill="#007AFF"
              stroke="#0056B3"
              name="Enrollment Rate (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT 4: CAMPAIGN TRACKER
// ============================================================================

const CampaignTracker = ({ campaigns }) => {
  return (
    <div className="campaign-container">
      <h3>Active Campaigns & ROI</h3>
      {campaigns?.map((campaign) => (
        <div key={campaign.campaign_id} className="campaign-card">
          <div className="campaign-header">
            <h4>{campaign.campaign_name}</h4>
            <span className={`campaign-status ${campaign.status.toLowerCase()}`}>
              {campaign.status}
            </span>
          </div>

          <div className="campaign-metrics">
            <div className="metric">
              <span className="label">Budget Spent</span>
              <span className="value">
                ₹{(campaign.budget_spent / 100000).toFixed(1)}L
              </span>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width: `${(campaign.budget_spent / campaign.budget_allocated) * 100}%`,
                  }}
                ></div>
              </div>
            </div>

            <div className="metric">
              <span className="label">ROI</span>
              <span className="value">{campaign.roi_percent?.toFixed(1)}%</span>
            </div>

            <div className="metric">
              <span className="label">Enrollments</span>
              <span className="value">{campaign.enrollments_created}</span>
            </div>

            <div className="metric">
              <span className="label">Reach</span>
              <span className="value">{campaign.beneficiaries_reached}</span>
            </div>
          </div>

          <div className="campaign-timeline">
            <span>{campaign.start_date}</span>
            <span>→</span>
            <span>{campaign.end_date || 'Ongoing'}</span>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================================================
// COMPONENT 5: BENEFICIARY SEARCH & FILTER
// ============================================================================

const BeneficiarySearch = ({ onSearch }) => {
  const [filters, setFilters] = useState({
    location: '',
    domain: '',
    gapSize: '',
    awarenessLevel: '',
  });
  const [results, setResults] = useState([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    setSearching(true);
    try {
      // TODO: Implement API call to search beneficiaries
      // const response = await axios.get(`${API_URL}/admin/beneficiaries/search`, { params: filters });
      // setResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="search-container">
      <h3>Search & Filter Beneficiaries</h3>

      <div className="filter-grid">
        <select
          value={filters.location}
          onChange={(e) => setFilters({ ...filters, location: e.target.value })}
          className="filter-input"
        >
          <option value="">Select Location</option>
          <option value="amritsar">Amritsar</option>
          <option value="ludhiana">Ludhiana</option>
          <option value="jalandhar">Jalandhar</option>
        </select>

        <select
          value={filters.domain}
          onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
          className="filter-input"
        >
          <option value="">Select Domain</option>
          <option value="health">Health</option>
          <option value="agriculture">Agriculture</option>
          <option value="pension">Social Security</option>
        </select>

        <select
          value={filters.gapSize}
          onChange={(e) => setFilters({ ...filters, gapSize: e.target.value })}
          className="filter-input"
        >
          <option value="">Gap Size</option>
          <option value="high">High Gap (&gt;5 schemes)</option>
          <option value="medium">Medium Gap (3-5 schemes)</option>
          <option value="low">Low Gap (&lt;3 schemes)</option>
        </select>

        <button onClick={handleSearch} className="search-button" disabled={searching}>
          {searching ? '🔄 Searching...' : '🔍 Search'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="results-container">
          <h4>Priority Beneficiaries for Outreach</h4>
          <table className="results-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Location</th>
                <th>Gap Count</th>
                <th>Priority Score</th>
                <th>Potential Benefit</th>
              </tr>
            </thead>
            <tbody>
              {results.map((beneficiary) => (
                <tr key={beneficiary.beneficiary_id}>
                  <td>{beneficiary.name}</td>
                  <td>{beneficiary.location}</td>
                  <td className="gap-cell">{beneficiary.gap_count}</td>
                  <td className="priority-cell">{beneficiary.priority_score}</td>
                  <td className="benefit-cell">
                    ₹{beneficiary.potential_benefit?.toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// COMPONENT 6: REPORTS EXPORT
// ============================================================================

const ReportsExport = () => {
  const [exporting, setExporting] = useState(false);

  const handleExport = async (format) => {
    setExporting(true);
    try {
      // TODO: Implement API call to generate and download report
      // const response = await axios.get(`${API_URL}/admin/reports/export`, {
      //   params: { format, type: 'comprehensive' }
      // });
      
      // Create download link
      // const link = document.createElement('a');
      // link.href = window.URL.createObjectURL(new Blob([response.data]));
      // link.setAttribute('download', `report.${format}`);
      // document.body.appendChild(link);
      // link.click();

      console.log(`Exporting as ${format}...`);
      alert(`Report exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error('Export error:', error);
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="export-container">
      <h3>Generate Reports</h3>

      <div className="export-options">
        <div className="export-card">
          <h4>📊 Comprehensive Analytics</h4>
          <p>All metrics, schemes, and enrollment data</p>
          <button
            onClick={() => handleExport('pdf')}
            disabled={exporting}
            className="export-button"
          >
            📄 Export as PDF
          </button>
          <button
            onClick={() => handleExport('xlsx')}
            disabled={exporting}
            className="export-button secondary"
          >
            📋 Export as Excel
          </button>
        </div>

        <div className="export-card">
          <h4>🗺️ Geographic Report</h4>
          <p>Village-wise awareness and enrollment data</p>
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            className="export-button"
          >
            📊 Export as CSV
          </button>
        </div>

        <div className="export-card">
          <h4>📈 Campaign Performance</h4>
          <p>Campaign ROI and impact metrics</p>
          <button
            onClick={() => handleExport('xlsx')}
            disabled={exporting}
            className="export-button"
          >
            📊 Export as Excel
          </button>
        </div>
      </div>

      <div className="export-preview">
        <h4>Report Preview</h4>
        <pre>{`Generated: ${new Date().toLocaleString()}
Sections: 
- Executive Summary
- KPI Dashboard
- Scheme Analytics
- Geographic Coverage
- Campaign Reports
- Recommendations
Pages: ~15-20`}
        </pre>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN ADMIN DASHBOARD COMPONENT
// ============================================================================

export const AdminDashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [schemeMetrics, setSchemeMetrics] = useState(null);
  const [campaigns, setCampaigns] = useState(null);
  const [locationData, setLocationData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // TODO: Implement API calls to fetch real data
      // const metricsResponse = await axios.get(`${API_URL}/admin/metrics`);
      // const schemesResponse = await axios.get(`${API_URL}/admin/schemes/metrics`);
      // const campaignsResponse = await axios.get(`${API_URL}/admin/campaigns`);
      // const locationsResponse = await axios.get(`${API_URL}/admin/locations/coverage`);

      // Set mock data for demo
      setMetrics({
        totalBeneficiaries: 12500000,
        totalEnrolled: 4200000,
        awarenessPercent: 56.2,
        gapCount: 8300000,
      });

      setSchemeMetrics([
        {
          scheme_code: 'IGNOAP',
          total_eligible: 2500000,
          total_enrolled: 1800000,
          enrollment_rate: 72,
        },
        {
          scheme_code: 'IGNWPS',
          total_eligible: 800000,
          total_enrolled: 450000,
          enrollment_rate: 56,
        },
        {
          scheme_code: 'PM-KISAN',
          total_eligible: 3000000,
          total_enrolled: 2200000,
          enrollment_rate: 73,
        },
      ]);

      setCampaigns([
        {
          campaign_id: 1,
          campaign_name: 'Senior Citizen Pension Drive',
          status: 'Completed',
          budget_allocated: 5000000,
          budget_spent: 4500000,
          roi_percent: 104,
          enrollments_created: 250000,
          beneficiaries_reached: 850000,
          start_date: '2025-01-15',
          end_date: '2025-03-15',
        },
      ]);

      setLocationData([
        { location_id: 1, location_name: 'Amritsar', awareness_percent: 78 },
        { location_id: 2, location_name: 'Ludhiana', awareness_percent: 45 },
        { location_id: 3, location_name: 'Jalandhar', awareness_percent: 28 },
      ]);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>🏛️ Government Schemes Admin Dashboard</h1>
        <p>Real-time Analytics & Monitoring</p>
      </header>

      <main className="dashboard-main">
        <section className="section">
          <KPIOverview metrics={metrics} />
        </section>

        <section className="section">
          <SchemeAnalytics schemeMetrics={schemeMetrics} />
        </section>

        <section className="section">
          <CampaignTracker campaigns={campaigns} />
        </section>

        <section className="section">
          <GeographicHeatmap locationData={locationData} />
        </section>

        <section className="section">
          <BeneficiarySearch />
        </section>

        <section className="section">
          <ReportsExport />
        </section>
      </main>

      <footer className="dashboard-footer">
        <p>Last Updated: {new Date().toLocaleString()}</p>
        <p>© 2026 Government Schemes System</p>
      </footer>
    </div>
  );
};

export default AdminDashboard;
