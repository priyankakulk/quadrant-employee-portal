import React, { useState, useEffect } from 'react';
import { Search, Filter, X, Calendar, User, MessageSquare, AlertCircle } from 'lucide-react';

const getSeverityFromStatus = (status) => {
  switch (status) {
    case 'Not Completed': return 4;
    case 'Pending': return 3;
    case 'Completed': return 1;
    default: return 4;
  }
};

const TicketModal = ({ ticket, isOpen, onClose, onStatusUpdate }) => {
  if (!isOpen || !ticket) return null;

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 1: return 'text-green-600 bg-green-100';
      case 2: return 'text-blue-600 bg-blue-100';
      case 3: return 'text-yellow-600 bg-yellow-100';
      case 4: return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return 'text-green-800 bg-green-100';
      case 'Pending': return 'text-yellow-800 bg-yellow-100';
      case 'Not Completed': return 'text-red-800 bg-red-100';
      default: return 'text-gray-800 bg-gray-100';
    }
  };

  const severity = getSeverityFromStatus(ticket.status);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-6 h-6 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900">
              Ticket #{ticket.ticket_number}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Status:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(ticket.status)}`}>
                {ticket.status}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium text-gray-600">Severity:</span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(severity)}`}>
                Level {severity}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span>Employee ID</span>
              </div>
              <p className="text-gray-900 font-medium">{ticket.employeeId}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Calendar className="w-4 h-4" />
                <span>Date Submitted</span>
              </div>
              <p className="text-gray-900 font-medium">{ticket.date_submitted || '10/23/25'}</p>
            </div>

            {ticket.handled_by && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <User className="w-4 h-4" />
                  <span>Handled By</span>
                </div>
                <p className="text-gray-900 font-medium">Employee #{ticket.handled_by}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <MessageSquare className="w-4 h-4" />
              <span className="font-medium">Issue Description</span>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 leading-relaxed">{ticket.message}</p>
            </div>
          </div>

          <div className="space-y-3 border-t border-gray-200 pt-6">
            <h3 className="text-sm font-medium text-gray-900">Update Status</h3>
            <div className="flex items-center space-x-3">
              <select
                value={ticket.status}
                onChange={(e) => onStatusUpdate(ticket.ticket_number, e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="Not Completed">Not Completed</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
              <span className="text-sm text-gray-500">
                Current: {ticket.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:ring-purple-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const SubmitTicketForm = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!employeeId || !message) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/it-tickets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user: parseInt(employeeId),
          message: message
        })
      });

      if (response.ok) {
        setEmployeeId('');
        setMessage('');
        alert('Ticket submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting ticket:', error);
      alert('Error submitting ticket. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">Submit New Ticket</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Employee ID
          </label>
          <input
            type="number"
            value={employeeId}
            onChange={(e) => setEmployeeId(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Enter your employee ID"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Issue Description
          </label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            placeholder="Describe your issue..."
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting || !employeeId || !message}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Submitting...' : 'Submit Ticket'}
        </button>
      </div>
    </div>
  );
};

const TicketManagement = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('Ticket Management');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    user: '',
    handled_by: '',
    ticket_number: ''
  });

  const mockTickets = [
    {
      ticket_number: 165427,
      employeeId: 1001,
      status: 'Not Completed',
      message: 'I am having an ongoing issue with my direct manager. They have been consistently micromanaging my work, questioning every decision I make, and creating a hostile work environment. This has been affecting my productivity and mental health. I have tried to address this directly with them, but the situation has not improved. I need HR assistance to resolve this workplace conflict.',
      handled_by: null,
      date_submitted: '10/23/25'
    },
    {
      ticket_number: 165428,
      employeeId: 1002,
      status: 'Pending',
      message: 'Network connectivity problem - Unable to access company servers and shared drives. This is preventing me from completing my daily tasks and accessing important project files.',
      handled_by: 2001,
      date_submitted: '10/23/25'
    },
    {
      ticket_number: 165429,
      employeeId: 1003,
      status: 'Completed',
      message: 'Software installation request for Adobe Creative Suite. Need access to Photoshop, Illustrator, and InDesign for upcoming marketing campaign projects.',
      handled_by: 2002,
      date_submitted: '10/22/25'
    }
  ];

  useEffect(() => {
    setTimeout(() => {
      setTickets(mockTickets);
      setLoading(false);
    }, 1000);
  }, []);

  const fetchTickets = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (filters.user) queryParams.append('user', filters.user);
      if (filters.status) queryParams.append('status', filters.status);
      if (filters.handled_by) queryParams.append('handled_by', filters.handled_by);
      if (filters.ticket_number) queryParams.append('ticket_number', filters.ticket_number);

      const response = await fetch(`/api/it-tickets?${queryParams}`);
      const data = await response.json();
      setTickets(data);
    } catch (error) {
      console.error('Error fetching tickets:', error);
      setTickets(mockTickets);
    }
  };

  const updateTicketStatus = async (ticketNumber, newStatus) => {
    try {
      const response = await fetch('/api/it-tickets/status', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ticket_number: ticketNumber,
          new_status: newStatus
        })
      });

      if (response.ok) {
        const updatedTickets = tickets.map(ticket => 
          ticket.ticket_number === ticketNumber 
            ? { ...ticket, status: newStatus }
            : ticket
        );
        setTickets(updatedTickets);
        
        if (selectedTicket && selectedTicket.ticket_number === ticketNumber) {
          setSelectedTicket({ ...selectedTicket, status: newStatus });
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
    }
  };

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch = ticket.ticket_number.toString().includes(searchTerm) ||
                         ticket.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading tickets...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="flex items-center px-6 py-4">
          <div className="flex items-center space-x-2 mr-8">
            <Filter className="w-6 h-6" />
          </div>
          
          <div className="flex space-x-8 mr-8">
            <button
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'Submit Ticket'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Submit Ticket')}
            >
              Submit Ticket
            </button>
            <button
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'Ticket Management'
                  ? 'border-purple-600 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('Ticket Management')}
            >
              Ticket Management
            </button>
          </div>

          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search for ticket number"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        {activeTab === 'Ticket Management' && (
          <div className="bg-white rounded-lg shadow">
            <div className="grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 text-sm font-medium text-gray-600">
              <div>Ticket Number</div>
              <div>Subject Line</div>
              <div>Severity Level</div>
              <div>Date Submitted</div>
              <div>Ticket Status</div>
              <div>Actions</div>
            </div>

            <div className="divide-y divide-gray-200">
              {filteredTickets.map((ticket) => (
                <div 
                  key={ticket.ticket_number} 
                  className="grid grid-cols-6 gap-4 px-6 py-4 items-center hover:bg-gray-50 cursor-pointer transition-colors"
                  onClick={() => handleTicketClick(ticket)}
                >
                  <div className="text-sm font-medium text-gray-900">
                    Ticket #{ticket.ticket_number}
                  </div>
                  <div className="text-sm text-gray-900 truncate">
                    {ticket.message.length > 50 ? `${ticket.message.substring(0, 50)}...` : ticket.message}
                  </div>
                  <div className="text-sm text-gray-900">
                    Severity: {getSeverityFromStatus(ticket.status)}
                  </div>
                  <div className="text-sm text-gray-900">
                    {ticket.date_submitted || '10/23/25'}
                  </div>
                  <div className="text-sm">
                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      ticket.status === 'Completed' 
                        ? 'bg-green-100 text-green-800'
                        : ticket.status === 'Pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {ticket.status}
                    </span>
                  </div>
                  <div onClick={(e) => e.stopPropagation()}>
                    <select
                      className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      value={ticket.status}
                      onChange={(e) => updateTicketStatus(ticket.ticket_number, e.target.value)}
                    >
                      <option value="Not Completed">Not Completed</option>
                      <option value="Pending">Pending</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {filteredTickets.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No tickets found matching your search criteria.
              </div>
            )}
          </div>
        )}

        {activeTab === 'Submit Ticket' && (
          <SubmitTicketForm />
        )}
      </div>

      <TicketModal 
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={closeModal}
        onStatusUpdate={updateTicketStatus}
      />
    </div>
  );
};

export default TicketManagement;