import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  Users, 
  Eye, 
  TrendingUp, 
  Calendar, 
  Search, 
  Download, 
  RefreshCw, 
  X, 
  ExternalLink, 
  CheckCircle2, 
  Smartphone, 
  Laptop, 
  Globe, 
  Activity, 
  Filter, 
  ArrowUpDown, 
  Sparkles,
  Database,
  Info
} from 'lucide-react';
import { fetchRegistrations, fetchVisitorLogs, isSupabaseConfigured } from '../lib/supabase';

export default function AnalyticsDashboard({ isOpen, onClose }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('if_admin_unlocked') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isShaking, setIsShaking] = useState(false);

  // Data States
  const [registrations, setRegistrations] = useState([]);
  const [visitorLogs, setVisitorLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [communityFilter, setCommunityFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('registrations'); // 'registrations' | 'telemetry' | 'visitors'
  
  // Selected Attendee for Full Dossier Inspector Modal
  const [selectedAttendee, setSelectedAttendee] = useState(null);

  // The configured admin password from .env or fallback
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || 'innovate2026';

  // Load data when opened and authenticated
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      loadDashboardData();
    }
  }, [isOpen, isAuthenticated]);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [regsResult, logsResult] = await Promise.all([
        fetchRegistrations(),
        fetchVisitorLogs(150)
      ]);
      setRegistrations(regsResult.data || []);
      setVisitorLogs(logsResult.data || []);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password-only authentication
  const handleUnlock = (e) => {
    e.preventDefault();
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('if_admin_unlocked', 'true');
      setAuthError('');
      setPasswordInput('');
    } else {
      setAuthError('Incorrect admin password. Please try again.');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
    }
  };

  // Lock out
  const handleLock = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('if_admin_unlocked');
    setPasswordInput('');
  };

  if (!isOpen) return null;

  // ============================================================================
  // PASSWORD-ONLY LOCK SCREEN VIEW
  // ============================================================================
  if (!isAuthenticated) {
    return (
      <div className="analytics-modal-backdrop" onClick={onClose}>
        <div className="analytics-lock-dialog" onClick={(e) => e.stopPropagation()}>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>

          <div className="lock-icon-circle">
            <Lock size={32} />
          </div>

          <h3 className="lock-title">Organizer Analytics</h3>
          <p className="lock-subtitle">
            Enter your organizer password to assess attendees, registrations, and visitor telemetry.
          </p>

          <form onSubmit={handleUnlock} className={`lock-form ${isShaking ? 'shake-animation' : ''}`}>
            <div className="form-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="admin-pass-input" style={{ fontSize: '0.82rem', fontWeight: 700 }}>
                Admin Password (No username required)
              </label>
              <input 
                id="admin-pass-input"
                type="password"
                required
                autoFocus
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => {
                  setPasswordInput(e.target.value);
                  if (authError) setAuthError('');
                }}
                className={authError ? 'input-error' : ''}
              />
              {authError && (
                <div className="error-message" style={{ marginTop: '0.4rem' }}>
                  <span>{authError}</span>
                </div>
              )}
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              <Unlock size={16} />
              <span>Unlock Dashboard</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ============================================================================
  // CALCULATE AGGREGATED METRICS
  // ============================================================================
  const totalVisitors = visitorLogs.length;
  const registrationViews = visitorLogs.filter(v => v.section_viewed === 'registration_section').length;
  const totalRegistrations = registrations.length;
  const conversionRate = totalVisitors > 0 
    ? ((totalRegistrations / totalVisitors) * 100).toFixed(1) 
    : '0.0';
  const kingsChatSignups = registrations.filter(r => r.registered_with_kingschat).length;

  // OS Aggregations
  const osCounts = {};
  visitorLogs.forEach(v => {
    const name = v.os_name || 'Unknown';
    osCounts[name] = (osCounts[name] || 0) + 1;
  });

  // Browser Aggregations
  const browserCounts = {};
  visitorLogs.forEach(v => {
    const name = v.browser_name || 'Unknown';
    browserCounts[name] = (browserCounts[name] || 0) + 1;
  });

  // Community Aggregations
  const communityCounts = {};
  registrations.forEach(r => {
    const comm = r.community || 'Other';
    communityCounts[comm] = (communityCounts[comm] || 0) + 1;
  });

  // Top Interests Aggregations
  const interestCounts = {};
  registrations.forEach(r => {
    if (Array.isArray(r.interests)) {
      r.interests.forEach(int => {
        interestCounts[int] = (interestCounts[int] || 0) + 1;
      });
    }
  });

  // Filtered registrations
  const filteredRegistrations = registrations.filter(r => {
    const matchesSearch = 
      (r.first_name + ' ' + r.last_name).toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.phone || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.location || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (r.organization || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCommunity = communityFilter === 'ALL' || r.community === communityFilter;
    return matchesSearch && matchesCommunity;
  });

  // CSV Export
  const exportToCSV = () => {
    if (registrations.length === 0) return;

    const headers = [
      "ID",
      "Registration Date (UTC)",
      "First Name",
      "Last Name",
      "Email",
      "Phone",
      "Location",
      "Community",
      "Organization",
      "Motivation (What Brings You)",
      "Other Motivation",
      "Interests",
      "Other Interest",
      "Registered via KingsChat",
      "IP Address",
      "OS",
      "OS Version",
      "Browser",
      "Device Type",
      "Screen Resolution"
    ];

    const rows = registrations.map(r => [
      `"${r.id || ''}"`,
      `"${r.created_at || ''}"`,
      `"${(r.first_name || '').replace(/"/g, '""')}"`,
      `"${(r.last_name || '').replace(/"/g, '""')}"`,
      `"${(r.email || '').replace(/"/g, '""')}"`,
      `"${(r.phone || '').replace(/"/g, '""')}"`,
      `"${(r.location || '').replace(/"/g, '""')}"`,
      `"${(r.community || '').replace(/"/g, '""')}"`,
      `"${(r.organization || '').replace(/"/g, '""')}"`,
      `"${(r.brings_you || '').replace(/"/g, '""')}"`,
      `"${(r.other_brings_you || '').replace(/"/g, '""')}"`,
      `"${(Array.isArray(r.interests) ? r.interests.join(', ') : '').replace(/"/g, '""')}"`,
      `"${(r.other_interest || '').replace(/"/g, '""')}"`,
      r.registered_with_kingschat ? "YES" : "NO",
      `"${r.ip_address || ''}"`,
      `"${r.os_name || ''}"`,
      `"${r.os_version || ''}"`,
      `"${r.browser_name || ''}"`,
      `"${r.device_type || ''}"`,
      `"${r.screen_resolution || ''}"`
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `innovate_forward_attendees_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="analytics-modal-backdrop" onClick={onClose}>
      <div className="analytics-dashboard-dialog" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Navigation Bar */}
        <div className="dashboard-topbar">
          <div className="topbar-left">
            <div className="dashboard-title-group">
              <span className="live-status-badge">
                <span className="pulsing-dot"></span>
                LIVE TELEMETRY
              </span>
              <h2>Innovate Forward 2026 Analytics</h2>
            </div>
            {isSupabaseConfigured ? (
              <span className="db-badge live">
                <Database size={13} />
                <span>Supabase Connected</span>
              </span>
            ) : (
              <span className="db-badge preview" title="Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env for cloud sync">
                <Info size={13} />
                <span>Local Session Store</span>
              </span>
            )}
          </div>

          <div className="topbar-actions">
            <button className="btn-action-small" onClick={loadDashboardData} disabled={isLoading} title="Refresh Live Data">
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
              <span>Refresh</span>
            </button>
            <button className="btn-action-small btn-lock-small" onClick={handleLock} title="Lock Dashboard">
              <Lock size={15} />
              <span>Lock</span>
            </button>
            <button className="modal-close-btn" onClick={onClose} aria-label="Close Dashboard">
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Executive KPI Stat Cards */}
        <div className="dashboard-kpi-grid">
          <div className="kpi-card">
            <div className="kpi-icon-wrap blue">
              <Eye size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Total Unique Visitors</span>
              <h3 className="kpi-value">{totalVisitors}</h3>
              <span className="kpi-sub">{registrationViews} viewed registration section</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap emerald">
              <Users size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Confirmed Registrations</span>
              <h3 className="kpi-value">{totalRegistrations}</h3>
              <span className="kpi-sub">{kingsChatSignups} via KingsChat</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap purple">
              <TrendingUp size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Conversion Rate</span>
              <h3 className="kpi-value">{conversionRate}%</h3>
              <span className="kpi-sub">Visitor to attendee conversion</span>
            </div>
          </div>

          <div className="kpi-card">
            <div className="kpi-icon-wrap cyan">
              <Globe size={20} />
            </div>
            <div className="kpi-info">
              <span className="kpi-label">Top Operating System</span>
              <h3 className="kpi-value">
                {Object.keys(osCounts).length > 0
                  ? Object.entries(osCounts).sort((a, b) => b[1] - a[1])[0][0]
                  : 'N/A'}
              </h3>
              <span className="kpi-sub">Leading visitor platform</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="dashboard-tabs-bar">
          <button 
            className={`dashboard-tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
            onClick={() => setActiveTab('registrations')}
          >
            <Users size={16} />
            <span>Attendee Registrations ({filteredRegistrations.length})</span>
          </button>
          <button 
            className={`dashboard-tab-btn ${activeTab === 'telemetry' ? 'active' : ''}`}
            onClick={() => setActiveTab('telemetry')}
          >
            <Activity size={16} />
            <span>Telemetry & Insights</span>
          </button>
          <button 
            className={`dashboard-tab-btn ${activeTab === 'visitors' ? 'active' : ''}`}
            onClick={() => setActiveTab('visitors')}
          >
            <Globe size={16} />
            <span>Live Visitor Stream ({visitorLogs.length})</span>
          </button>
        </div>

        {/* Tab 1: Attendee Registrations Table */}
        {activeTab === 'registrations' && (
          <div className="tab-pane">
            <div className="table-controls-bar">
              <div className="search-input-wrap">
                <Search size={16} />
                <input 
                  type="text"
                  placeholder="Search by name, email, location, organization..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="table-actions-right">
                <select 
                  className="filter-dropdown"
                  value={communityFilter}
                  onChange={(e) => setCommunityFilter(e.target.value)}
                >
                  <option value="ALL">All Communities</option>
                  <option value="Design">Design</option>
                  <option value="Developers">Developers</option>
                  <option value="AI Thinkers">AI Thinkers</option>
                  <option value="Founders & Entrepreneurs">Founders & Entrepreneurs</option>
                  <option value="Students & Researchers">Students & Researchers</option>
                  <option value="Business & Industry Leaders">Business & Industry</option>
                  <option value="Tech Enthusiasts">Tech Enthusiasts</option>
                </select>

                <button className="btn-export-csv" onClick={exportToCSV} disabled={registrations.length === 0}>
                  <Download size={15} />
                  <span>Export to CSV</span>
                </button>
              </div>
            </div>

            {filteredRegistrations.length === 0 ? (
              <div className="empty-state-card">
                <Users size={36} />
                <h4>No Registrations Found</h4>
                <p>
                  {searchTerm || communityFilter !== 'ALL'
                    ? "No registrations match your search filters."
                    : "No attendees have registered yet. Test submitting the registration form on the page!"}
                </p>
              </div>
            ) : (
              <div className="table-responsive-wrapper">
                <table className="analytics-data-table">
                  <thead>
                    <tr>
                      <th>Attendee</th>
                      <th>Contact</th>
                      <th>Location</th>
                      <th>Community</th>
                      <th>Interests</th>
                      <th>Registered Date</th>
                      <th>Auth</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRegistrations.map((attendee) => {
                      const dateObj = new Date(attendee.created_at);
                      const formattedDate = !isNaN(dateObj)
                        ? dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) +
                          ' ' +
                          dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
                        : 'Recent';

                      return (
                        <tr 
                          key={attendee.id} 
                          onClick={() => setSelectedAttendee(attendee)}
                          className="clickable-row"
                        >
                          <td>
                            <div className="attendee-name-cell">
                              <span className="attendee-name">{attendee.first_name} {attendee.last_name}</span>
                              {attendee.organization && (
                                <span className="attendee-org">{attendee.organization}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="contact-cell">
                              <span className="email-text">{attendee.email}</span>
                              <span className="phone-text">{attendee.phone}</span>
                            </div>
                          </td>
                          <td>
                            <span className="location-pill">{attendee.location}</span>
                          </td>
                          <td>
                            <span className="community-pill">{attendee.community}</span>
                          </td>
                          <td>
                            <div className="interests-pill-preview">
                              {Array.isArray(attendee.interests) && attendee.interests.slice(0, 2).map((int, i) => (
                                <span key={i} className="mini-interest-tag">{int}</span>
                              ))}
                              {Array.isArray(attendee.interests) && attendee.interests.length > 2 && (
                                <span className="mini-interest-tag more">+{attendee.interests.length - 2}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="timestamp-text">{formattedDate}</span>
                          </td>
                          <td>
                            {attendee.registered_with_kingschat ? (
                              <span className="kc-verified-tag" title="Registered via KingsChat">
                                <img src="/kingschat.png" alt="KC" />
                                <span>KC</span>
                              </span>
                            ) : (
                              <span className="direct-tag">Direct</span>
                            )}
                          </td>
                          <td>
                            <button 
                              className="btn-inspect-small"
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedAttendee(attendee);
                              }}
                            >
                              <span>Inspect</span>
                              <ExternalLink size={13} />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Telemetry & Visual Breakdown Insights */}
        {activeTab === 'telemetry' && (
          <div className="tab-pane">
            <div className="insights-grid">
              
              {/* OS Breakdown */}
              <div className="insight-card">
                <h4>Operating System Distribution</h4>
                <div className="breakdown-list">
                  {Object.entries(osCounts).sort((a, b) => b[1] - a[1]).map(([os, count]) => {
                    const pct = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(0) : 0;
                    return (
                      <div key={os} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-name">{os}</span>
                          <span className="breakdown-count">{count} ({pct}%)</span>
                        </div>
                        <div className="breakdown-bar-track">
                          <div className="breakdown-bar-fill blue" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(osCounts).length === 0 && <p className="empty-sub">No visitor logs recorded yet.</p>}
                </div>
              </div>

              {/* Browser Breakdown */}
              <div className="insight-card">
                <h4>Browser Distribution</h4>
                <div className="breakdown-list">
                  {Object.entries(browserCounts).sort((a, b) => b[1] - a[1]).map(([browser, count]) => {
                    const pct = totalVisitors > 0 ? ((count / totalVisitors) * 100).toFixed(0) : 0;
                    return (
                      <div key={browser} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-name">{browser}</span>
                          <span className="breakdown-count">{count} ({pct}%)</span>
                        </div>
                        <div className="breakdown-bar-track">
                          <div className="breakdown-bar-fill purple" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(browserCounts).length === 0 && <p className="empty-sub">No visitor logs recorded yet.</p>}
                </div>
              </div>

              {/* Community Breakdown */}
              <div className="insight-card">
                <h4>Registered Communities</h4>
                <div className="breakdown-list">
                  {Object.entries(communityCounts).sort((a, b) => b[1] - a[1]).map(([comm, count]) => {
                    const pct = totalRegistrations > 0 ? ((count / totalRegistrations) * 100).toFixed(0) : 0;
                    return (
                      <div key={comm} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-name">{comm}</span>
                          <span className="breakdown-count">{count} ({pct}%)</span>
                        </div>
                        <div className="breakdown-bar-track">
                          <div className="breakdown-bar-fill emerald" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(communityCounts).length === 0 && <p className="empty-sub">No attendee registrations yet.</p>}
                </div>
              </div>

              {/* Top Interests */}
              <div className="insight-card">
                <h4>Top Attendee Interests</h4>
                <div className="breakdown-list">
                  {Object.entries(interestCounts).sort((a, b) => b[1] - a[1]).map(([interest, count]) => {
                    const pct = totalRegistrations > 0 ? ((count / totalRegistrations) * 100).toFixed(0) : 0;
                    return (
                      <div key={interest} className="breakdown-item">
                        <div className="breakdown-header">
                          <span className="breakdown-name">{interest}</span>
                          <span className="breakdown-count">{count} ({pct}%)</span>
                        </div>
                        <div className="breakdown-bar-track">
                          <div className="breakdown-bar-fill cyan" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    );
                  })}
                  {Object.keys(interestCounts).length === 0 && <p className="empty-sub">No attendee registrations yet.</p>}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 3: Live Visitor Stream */}
        {activeTab === 'visitors' && (
          <div className="tab-pane">
            <div className="table-responsive-wrapper">
              <table className="analytics-data-table">
                <thead>
                  <tr>
                    <th>Timestamp</th>
                    <th>IP Address</th>
                    <th>Section Viewed</th>
                    <th>Operating System</th>
                    <th>Browser</th>
                    <th>Device</th>
                    <th>Screen</th>
                  </tr>
                </thead>
                <tbody>
                  {visitorLogs.map((log) => {
                    const dateObj = new Date(log.created_at);
                    const formattedDate = !isNaN(dateObj)
                      ? dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', second: '2-digit' }) +
                        ' · ' +
                        dateObj.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
                      : 'Just now';

                    return (
                      <tr key={log.id}>
                        <td><span className="timestamp-text">{formattedDate}</span></td>
                        <td><code className="ip-badge">{log.ip_address}</code></td>
                        <td>
                          <span className={`section-view-tag ${log.section_viewed}`}>
                            {log.section_viewed === 'registration_section' ? 'Registration Section' : 'Landing Page'}
                          </span>
                        </td>
                        <td><span>{log.os_name} {log.os_version}</span></td>
                        <td><span>{log.browser_name} {log.browser_version}</span></td>
                        <td>
                          <span className="device-tag">
                            {log.device_type === 'Mobile' ? <Smartphone size={13} /> : <Laptop size={13} />}
                            <span>{log.device_type}</span>
                          </span>
                        </td>
                        <td><span className="screen-res-text">{log.screen_resolution}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ====================================================================
            ATTENDEE DETAIL INSPECTOR MODAL (100% OF INVITEE DATA)
            ==================================================================== */}
        {selectedAttendee && (
          <div className="attendee-inspector-backdrop" onClick={() => setSelectedAttendee(null)}>
            <div className="attendee-inspector-dialog" onClick={(e) => e.stopPropagation()}>
              <div className="inspector-header">
                <div className="inspector-title-group">
                  <span className="inspector-badge">INVITEE DOSSIER</span>
                  <h3>{selectedAttendee.first_name} {selectedAttendee.last_name}</h3>
                  <span className="inspector-id">ID: {selectedAttendee.id}</span>
                </div>
                <button className="modal-close-btn" onClick={() => setSelectedAttendee(null)}>
                  <X size={20} />
                </button>
              </div>

              <div className="inspector-body">
                {/* Section 1: Contact & Identity */}
                <div className="inspector-section">
                  <h4 className="section-subtitle">Personal & Contact Information</h4>
                  <div className="inspector-grid">
                    <div className="inspector-item">
                      <span className="item-label">Full Name</span>
                      <span className="item-value">{selectedAttendee.first_name} {selectedAttendee.last_name}</span>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Email Address</span>
                      <a href={`mailto:${selectedAttendee.email}`} className="item-value link">{selectedAttendee.email}</a>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Phone Number</span>
                      <a href={`tel:${selectedAttendee.phone}`} className="item-value link">{selectedAttendee.phone}</a>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Location (City, Country)</span>
                      <span className="item-value">{selectedAttendee.location}</span>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Registration Date & Time</span>
                      <span className="item-value">
                        {new Date(selectedAttendee.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Authentication Method</span>
                      <span className="item-value">
                        {selectedAttendee.registered_with_kingschat ? 'KingsChat Quick-Pass' : 'Direct Web Form'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Preferences & Community */}
                <div className="inspector-section">
                  <h4 className="section-subtitle">Symposium Preferences & Community</h4>
                  <div className="inspector-grid">
                    <div className="inspector-item full-span">
                      <span className="item-label">What brings you to a tech conference?</span>
                      <span className="item-value highlight">{selectedAttendee.brings_you}</span>
                      {selectedAttendee.other_brings_you && (
                        <div className="other-detail-box">
                          <span className="other-label">Custom Reason:</span>
                          <span className="other-text">"{selectedAttendee.other_brings_you}"</span>
                        </div>
                      )}
                    </div>

                    <div className="inspector-item full-span">
                      <span className="item-label">Selected Areas of Interest</span>
                      <div className="inspector-pills-wrap">
                        {Array.isArray(selectedAttendee.interests) && selectedAttendee.interests.map((int, i) => (
                          <span key={i} className="inspector-pill">{int}</span>
                        ))}
                      </div>
                      {selectedAttendee.other_interest && (
                        <div className="other-detail-box">
                          <span className="other-label">Custom Specified Interest:</span>
                          <span className="other-text">"{selectedAttendee.other_interest}"</span>
                        </div>
                      )}
                    </div>

                    <div className="inspector-item">
                      <span className="item-label">Selected Community</span>
                      <span className="item-value community-badge">{selectedAttendee.community}</span>
                    </div>

                    <div className="inspector-item">
                      <span className="item-label">Organization / Company</span>
                      <span className="item-value">{selectedAttendee.organization || 'Independent / Not specified'}</span>
                    </div>
                  </div>
                </div>

                {/* Section 3: Visitor Telemetry */}
                <div className="inspector-section">
                  <h4 className="section-subtitle">Visitor Device & Network Telemetry</h4>
                  <div className="inspector-grid">
                    <div className="inspector-item">
                      <span className="item-label">IP Address</span>
                      <code className="ip-badge">{selectedAttendee.ip_address || 'Unavailable'}</code>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Operating System</span>
                      <span className="item-value">{selectedAttendee.os_name} {selectedAttendee.os_version}</span>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Browser & Version</span>
                      <span className="item-value">{selectedAttendee.browser_name} {selectedAttendee.browser_version}</span>
                    </div>
                    <div className="inspector-item">
                      <span className="item-label">Device & Screen</span>
                      <span className="item-value">{selectedAttendee.device_type} ({selectedAttendee.screen_resolution})</span>
                    </div>
                  </div>
                </div>

              </div>

              <div className="inspector-footer">
                <button className="btn-secondary" onClick={() => setSelectedAttendee(null)}>
                  <span>Close Dossier</span>
                </button>
                <a 
                  href={`mailto:${selectedAttendee.email}?subject=Innovate Forward 2026 Confirmation`} 
                  className="btn-primary"
                >
                  <span>Send Confirmation Email</span>
                  <ExternalLink size={15} />
                </a>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
