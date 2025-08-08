import React, { useState, useEffect } from 'react';
import {
  Diamond,
  Send,
  AlertCircle,
  User,
  MessageSquare,
  Hash,
  Ticket,
  Search,
  Bell,
  LogOut,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  Calendar,
  Eye,
  X,
} from 'lucide-react';

const API_BASE = 'http://localhost:8000/api'; // Adjust as needed

const EmployeeTicketPortal = () => {
  // --- States ---
  const [activeTab, setActiveTab] = useState('create'); // 'create', 'view', 'hrManagement', 'itManagement'
  const [activeSection, setActiveSection] = useState('hr'); // 'hr' or 'it' for create/view tabs
  const [userInfo, setUserInfo] = useState({ id: '', name: '', email: '', role: '' });

  const [formData, setFormData] = useState({
    severity: '', // Only for HR tickets in 'create'
    subject: '',
    name: '',
    message: ''
  });

  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketDetail, setTicketDetail] = useState(null); // Detailed ticket including AI summary
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');

  // --- Load user info from localStorage on mount ---
  useEffect(() => {
    const id = localStorage.getItem('userId');
    const name = localStorage.getItem('userName');
    const email = localStorage.getItem('userEmail');
    const role = (localStorage.getItem('userRole') || '').toLowerCase();

    if (!id || !name) {
      window.location.href = '/signin';
      return;
    }

    setUserInfo({
      id,
      name,
      email: email || '',
      role: role || 'employee'
    });
    setFormData(prev => ({ ...prev, name }));
  }, []);

  // --- Role flags ---
  const isAdmin = userInfo.role === 'admin';
  const isHR = userInfo.role === 'hr' || isAdmin;
  const isIT = userInfo.role === 'it' || isAdmin;

  // --- Helper: Extract subject from message ---
  const extractSubject = (message) => {
    if (!message) return 'No Subject';
    const match = message.match(/^Subject:\s*(.*)$/m);
    if (match && match[1]) return match[1].trim();
    const firstLine = message.split('\n')[0];
    return firstLine.length > 80 ? firstLine.slice(0, 80) + '...' : firstLine;
  };

  // --- Helper: severity and status color classes ---
  const getSeverityColor = (sev) => {
    if (!sev) return 'text-gray-600 bg-gray-50 border-gray-200';
    switch (sev.toLowerCase()) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low': return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  const getStatusColor = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'not completed':
      case 'incomplete': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };
  const getStatusIcon = (status) => {
    const s = (status || '').toLowerCase();
    switch (s) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'not completed':
      case 'incomplete': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // --- Fetch tickets based on active tab/section ---
  const fetchTickets = async () => {
    setError('');
    setTickets([]);
    setIsLoading(true);

    try {
      let url = '';

      switch (activeTab) {
        case 'view':
          url = activeSection === 'hr'
            ? `${API_BASE}/tickets?user=${userInfo.id}`
            : `${API_BASE}/it-tickets?user=${userInfo.id}`;
          break;

        case 'hrManagement':
          if (!isHR) {
            setError('Access denied');
            setIsLoading(false);
            return;
          }
          url = `${API_BASE}/tickets`; // Fetch all HR tickets - adjust if needed
          // Note: If you have a specific summarized-hr-tickets endpoint, use that.
          // If so, use:
          // url = `${API_BASE}/summarized-hr-tickets`;
          break;

        case 'itManagement':
          if (!isIT) {
            setError('Access denied');
            setIsLoading(false);
            return;
          }
          url = `${API_BASE}/it-tickets`; // Fetch all IT tickets - adjust if needed
          // Or use summarized IT tickets endpoint:
          // url = `${API_BASE}/summarized-it-tickets`;
          break;

        default:
          setIsLoading(false);
          return;
      }

      const resp = await fetch(url);
      if (!resp.ok) {
        const errData = await resp.json().catch(() => ({}));
        throw new Error(errData.error || `Error fetching tickets: ${resp.status}`);
      }
      const data = await resp.json();
      setTickets(data);
    } catch (e) {
      setError(e.message || 'Failed to load tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // --- Fetch tickets when tab or section or user changes ---
  useEffect(() => {
    if (activeTab !== 'create') fetchTickets();
  }, [activeTab, activeSection, userInfo.id]);

  // --- Open modal: show full ticket and fetch AI summary ---
  const openTicketModal = async (ticket) => {
    setSelectedTicket(ticket);
    setTicketDetail(null);
    setIsModalOpen(true);

    try {
      // Fetch AI summary for selected ticket (by ticket_number)
      let summaryUrl = '';
      const ticketNumber = ticket.ticket_number || ticket.ticketNumber;

      if (activeTab === 'hrManagement' || (activeTab === 'view' && activeSection === 'hr')) {
        summaryUrl = `${API_BASE}/summarized-hr-tickets?ticket_number=${ticketNumber}`;
      } else if (activeTab === 'itManagement' || (activeTab === 'view' && activeSection === 'it')) {
        summaryUrl = `${API_BASE}/summarized-it-tickets?ticket_number=${ticketNumber}`;
      }

      const summaryResp = await fetch(summaryUrl);
      let summaryData = null;
      if (summaryResp.ok) {
        const json = await summaryResp.json();
        summaryData = json && json.length > 0 ? json[0].summary : null;
      }

      // Use full ticket data from list, append AI summary
      setTicketDetail({
        ...ticket,
        summary: summaryData,
      });
    } catch (e) {
      // On error, just show ticket without summary
      setTicketDetail(ticket);
    }
  };

  // --- Close modal ---
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
    setTicketDetail(null);
  };

  // --- Handle form changes ---
  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // --- Submit new ticket ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const fullMessage = `Subject: ${formData.subject}\n${formData.message}`;

      if (activeSection === 'hr') {
        if (!formData.severity) {
          setError('Please select a severity for HR tickets.');
          setIsSubmitting(false);
          return;
        }
        const params = new URLSearchParams({
          user: userInfo.id,
          severity: formData.severity,
          message: fullMessage,
          from_date: new Date().toISOString().split('T')[0]
        });
        const resp = await fetch(`${API_BASE}/addTicket?${params}`);
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to submit HR ticket');
        }
        const result = await resp.json();
        setSubmitSuccess(result);
      } else {
        const resp = await fetch(`${API_BASE}/it-tickets`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ user: parseInt(userInfo.id), message: fullMessage }),
        });
        if (!resp.ok) {
          const errData = await resp.json().catch(() => ({}));
          throw new Error(errData.error || 'Failed to submit IT ticket');
        }
        const result = await resp.json();
        setSubmitSuccess(result);
      }

      setTimeout(() => {
        setSubmitSuccess(false);
        setFormData({ severity: '', subject: '', name: userInfo.name, message: '' });
      }, 3000);

      // Refresh tickets if viewing user tickets
      if (activeTab === 'view') fetchTickets();
    } catch (e) {
      setError(e.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- Logout ---
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/signin';
  };

  // --- Filter tickets by search ---
  const filteredTickets = tickets.filter(ticket => {
    const number = ticket.ticket_number || ticket.ticketNumber || '';
    const subj = extractSubject(ticket.original_message || ticket.message || '');
    return number.toString().includes(searchTerm) || subj.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // --- Form validation ---
  const isFormValid = Boolean(
    formData.subject.trim() &&
    formData.name.trim() &&
    formData.message.trim() &&
    (activeSection === 'hr' ? formData.severity : true)
  );

  // --- Initials for avatar ---
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length > 1) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return parts[0].slice(0, 2).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <Diamond className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Support Tickets</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="w-6 h-6 text-gray-500" />
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{userInfo.name}</div>
                <div className="text-xs text-gray-500">{userInfo.role}</div>
              </div>
              <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                {getUserInitials(userInfo.name)}
              </div>
              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-gray-500" title="Logout">
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs Navigation */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6 max-w-7xl mx-auto px-6">
        <nav className="flex space-x-8 border-b border-gray-200 py-4">
          <button
            onClick={() => { setActiveTab('create'); setActiveSection('hr'); }}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'create' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Create Ticket
          </button>

          <button
            onClick={() => setActiveTab('view')}
            className={`py-2 px-1 text-sm font-medium border-b-2 ${
              activeTab === 'view' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            My Tickets
          </button>

          {isHR && (
            <button
              onClick={() => setActiveTab('hrManagement')}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'hrManagement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              HR Management
            </button>
          )}

          {isIT && (
            <button
              onClick={() => setActiveTab('itManagement')}
              className={`py-2 px-1 text-sm font-medium border-b-2 ${
                activeTab === 'itManagement' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              IT Management
            </button>
          )}
        </nav>

        {/* Department switch only relevant for Create and My Tickets */}
        {(activeTab === 'create' || activeTab === 'view') && (
          <div className="border-b border-gray-200 py-4 flex space-x-4">
            <button
              onClick={() => setActiveSection('hr')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'hr' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              HR Tickets
            </button>
            <button
              onClick={() => setActiveSection('it')}
              className={`px-4 py-2 rounded-lg font-medium text-sm ${
                activeSection === 'it' ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              IT Tickets
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">

        {/* Create Ticket Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
            {activeSection === 'hr' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  Severity
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  {['low', 'medium', 'high', 'critical'].map(sev => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => handleInputChange('severity', sev)}
                      className={`p-3 border-2 rounded-lg text-left transition-colors ${
                        formData.severity === sev ? getSeverityColor(sev) : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium capitalize">{sev}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <User className="inline w-4 h-4 mr-1" />
                Your Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Hash className="inline w-4 h-4 mr-1" />
                Subject Line
              </label>
              <input
                type="text"
                value={formData.subject}
                onChange={e => handleInputChange('subject', e.target.value)}
                placeholder={`Brief description of your ${activeSection.toUpperCase()} request`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="inline w-4 h-4 mr-1" />
                Description
              </label>
              <textarea
                rows={6}
                value={formData.message}
                onChange={e => handleInputChange('message', e.target.value)}
                placeholder={`Please provide detailed information about your ${activeSection.toUpperCase()} request...`}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div className="flex justify-end">
              <button
                disabled={!isFormValid || isSubmitting}
                type="submit"
                className={`px-8 py-3 rounded-lg font-medium flex items-center space-x-2 ${
                  isFormValid && !isSubmitting ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Submit Ticket</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tickets Table for My Tickets or Management */}
        {(activeTab === 'view' || activeTab === 'hrManagement' || activeTab === 'itManagement') && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                {(activeTab === 'view' ? `My ${activeSection.toUpperCase()}` : activeTab === 'hrManagement' ? 'HR' : 'IT') + ' Tickets'}
              </h3>
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search tickets by number or subject..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                  />
                </div>
                <button
                  onClick={fetchTickets}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-16 text-gray-600">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                Loading tickets...
              </div>
            ) : error ? (
              <div className="text-red-600 text-center py-8">{error}</div>
            ) : filteredTickets.length > 0 ? (
              <div className="bg-white rounded-lg shadow border border-gray-200 overflow-auto max-h-[60vh]">
                <div className={`grid ${activeSection === 'hr' || activeTab === 'hrManagement' ? 'grid-cols-7' : 'grid-cols-6'} gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600`}>
                  <div>Ticket Number</div>
                  <div className="whitespace-pre-wrap break-words">Subject</div>
                  {(activeSection === 'hr' || activeTab === 'hrManagement') && <div>Severity</div>}
                  <div>Date</div>
                  <div>Status</div>
                  {(activeTab === 'hrManagement' || activeTab === 'itManagement') && <div>Handled By</div>}
                  <div>Actions</div>
                </div>

                <div className="divide-y divide-gray-200">
                  {filteredTickets.map(ticket => {
                    const ticketNumber = ticket.ticket_number || ticket.ticketNumber;
                    const subject = extractSubject(ticket.original_message || ticket.message || '');
                    const severity = ticket.severity || '';
                    const date = ticket.startDate || ticket.date_submitted || new Date().toISOString();
                    const status = ticket.status || ticket.ticket_status || '';
                    const handledBy = ticket.handled_by || '';

                    return (
                      <div
                        key={ticketNumber}
                        className={`cursor-pointer grid px-6 py-4 gap-4 hover:bg-gray-50 transition-colors ${activeSection === 'hr' || activeTab === 'hrManagement' ? 'grid-cols-7' : 'grid-cols-6'}`}
                        onClick={() => openTicketModal(ticket)}
                      >
                        <div className="text-blue-600 font-semibold text-sm">#{ticketNumber}</div>
                        <div className="text-sm whitespace-pre-wrap break-words text-gray-900">{subject}</div>
                        {(activeSection === 'hr' || activeTab === 'hrManagement') && (
                          <div>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(severity)}`}>
                              {severity ? severity.charAt(0).toUpperCase() + severity.slice(1) : 'Unknown'}
                            </span>
                          </div>
                        )}
                        <div className="text-sm text-gray-900">{new Date(date).toLocaleDateString()}</div>
                        <div className={`flex items-center space-x-1 text-sm font-medium border px-2 py-1 rounded-full ${getStatusColor(status)}`}>
                          {getStatusIcon(status)}
                          <span>{status || 'Unknown'}</span>
                        </div>
                        {(activeTab === 'hrManagement' || activeTab === 'itManagement') && (
                          <div className="text-sm text-gray-700">{handledBy ? `Employee #${handledBy}` : 'Unassigned'}</div>
                        )}
                        <div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openTicketModal(ticket);
                            }}
                            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            aria-label="View Ticket"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View</span>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-16 text-gray-600">No tickets found.</div>
            )}
          </div>
        )}

      </main>

      {/* Ticket Details Modal */}
      {isModalOpen && ticketDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative">

            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="p-6 space-y-6">
              <h2 className="text-2xl font-semibold">Ticket #{ticketDetail.ticket_number || ticketDetail.ticketNumber}</h2>

              {/* AI Summary */}
              {ticketDetail.summary && (
                <section className="border-l-4 border-blue-600 bg-blue-50 p-4 rounded mb-6">
                  <h3 className="font-semibold mb-1 text-blue-700">AI Summary</h3>
                  <p className="whitespace-pre-wrap text-gray-800">{ticketDetail.summary}</p>
                </section>
              )}

              {/* Subject */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <Hash className="w-4 h-4" />
                  <span>Subject:</span>
                </div>
                <p className="text-gray-900 font-medium whitespace-pre-wrap break-words">
                  {extractSubject(ticketDetail.original_message || ticketDetail.message)}
                </p>
              </div>

              {/* Severity if HR tickets */}
              {(activeTab === 'hrManagement' || activeSection === 'hr') && ticketDetail.severity && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
                  <AlertCircle className="w-4 h-4" />
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(ticketDetail.severity)}`}>
                    Severity: {ticketDetail.severity.charAt(0).toUpperCase() + ticketDetail.severity.slice(1)}
                  </span>
                </div>
              )}

              {/* Status */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span>Status:</span>
                  <span className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(ticketDetail.status || ticketDetail.ticket_status)}`}>
                    {getStatusIcon(ticketDetail.status || ticketDetail.ticket_status)}
                    <span>{ticketDetail.status || ticketDetail.ticket_status || 'Unknown'}</span>
                  </span>
                </div>
              </div>

              {/* Other meta info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <User className="w-4 h-4" />
                    <span>Employee ID</span>
                  </div>
                  <p className="text-gray-900 font-medium">{ticketDetail.employeeId || ticketDetail.employeeID || 'Unknown'}</p>
                </div>
                <div>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                    <Calendar className="w-4 h-4" />
                    <span>Date Submitted</span>
                  </div>
                  <p className="text-gray-900 font-medium">
                    {ticketDetail.startDate
                      ? new Date(ticketDetail.startDate).toLocaleDateString()
                      : ticketDetail.date_submitted || new Date().toLocaleDateString()}
                  </p>
                </div>
                {ticketDetail.handled_by && (
                  <div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <User className="w-4 h-4" />
                      <span>Handled By</span>
                    </div>
                    <p className="text-gray-900 font-medium">Employee #{ticketDetail.handled_by}</p>
                  </div>
                )}
              </div>

              {/* Full description */}
              <div>
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                  <MessageSquare className="w-4 h-4" />
                  <span className="font-medium">Issue Description</span>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 whitespace-pre-wrap text-gray-900 leading-relaxed">
                  {(ticketDetail.original_message || ticketDetail.message || '').replace(/^Subject:.*\n?/, '').trim() || 'No description'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeTicketPortal;
