import { useState, useEffect } from 'react';
import { Calendar, User, Mail, MessageSquare, Clock, AlertCircle, CheckCircle, Loader } from 'lucide-react';

export default function LeaveApplication() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    leave_type: '',
    start_date: '',
    days_gone: '',
    reason: ''
  });

  const [leaveBalances, setLeaveBalances] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Mock logged-in user data - replace with actual auth context
  const currentUser = {
    employee_id: 94381 // This would come from your authentication system
  };

  // Backend configuration
  const API_BASE_URL = 'http://localhost:8000/api'; // Adjust this to your FastAPI server URL

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // Fetch leave balances
  const fetchLeaveBalances = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/leave/balances/${currentUser.employee_id}`);
      if (response.ok) {
        const balances = await response.json();
        setLeaveBalances(balances);
      } else {
        console.error('Failed to fetch leave balances:', response.status);
      }
    } catch (error) {
      console.error('Error fetching leave balances:', error);
    }
  };

  // Submit leave application
  const handleSubmit = async () => {
    if (!formData.leave_type || !formData.start_date || !formData.days_gone || !formData.reason) {
      showMessage('error', 'Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/leave/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employee_id: currentUser.employee_id,
          leave_type: formData.leave_type,
          start_date: formData.start_date,
          days_gone: parseInt(formData.days_gone),
          reason: formData.reason
        }),
      });

      if (response.ok) {
        showMessage('success', 'Leave application submitted successfully');
        setFormData({
          ...formData,
          leave_type: '',
          start_date: '',
          days_gone: '',
          reason: ''
        });
        await fetchLeaveBalances();
      } else {
        const error = await response.json();
        showMessage('error', error.detail || 'Failed to submit leave application');
      }
    } catch (error) {
      showMessage('error', 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchLeaveBalances();
  }, []);

  const leaveTypes = [
    'Vacation',
    'Sick Leave',
    'Personal Leave',
    'Maternity Leave',
    'Paternity Leave'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Application</h1>
          <p className="text-gray-600">Submit your leave request for approval</p>
        </div>

        {/* Message Display */}
        {message.text && (
          <div className={`mb-6 p-4 rounded-lg flex items-center ${
            message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {message.type === 'success' ? 
              <CheckCircle className="w-5 h-5 mr-2" /> : 
              <AlertCircle className="w-5 h-5 mr-2" />
            }
            {message.text}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              {/* Name and Email Fields */}
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <User className="w-4 h-4 mr-2 text-purple-600" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Mail className="w-4 h-4 mr-2 text-purple-600" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Leave Type */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    Leave Type
                  </label>
                  <select
                    name="leave_type"
                    value={formData.leave_type}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  >
                    <option value="">Select leave type</option>
                    {leaveTypes.map((type) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Start Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    Start Date
                  </label>
                  <input
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* Number of Days */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    Number of Days
                  </label>
                  <input
                    type="number"
                    name="days_gone"
                    value={formData.days_gone}
                    onChange={handleChange}
                    min="1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Enter number of days"
                    required
                  />
                </div>
              </div>

              {/* Message Field */}
              <div className="mt-6 space-y-2">
                <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                  <MessageSquare className="w-4 h-4 mr-2 text-purple-600" />
                  Additional Message
                </label>
                <textarea
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                  placeholder="Provide any additional details about your leave request..."
                />
              </div>

              {/* Submit Button */}
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 flex items-center"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin mr-2" /> : null}
                  Submit For Approval
                </button>
              </div>
            </div>
          </div>

          {/* Leave Status Sidebar */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-6 h-fit">
              <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Current Leave Status</h3>
              
              {/* Leave Balance Table */}
              <div className="space-y-3">
                {Object.keys(leaveBalances).length > 0 ? (
                  Object.entries(leaveBalances).map(([type, days]) => (
                    <div key={type} className="flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-b-0">
                      <span className="font-medium text-gray-700">{type}</span>
                      <span className="font-bold text-gray-900">{days} days</span>
                    </div>
                  ))
                ) : (
                  <div className="py-4 text-center">
                    <Loader className="w-6 h-6 animate-spin mx-auto mb-2 text-gray-400" />
                    <p className="text-gray-500 text-sm">Loading leave balances...</p>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2">Quick Tips</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Submit requests at least 2 weeks in advance</li>
                  <li>• Check team calendar for conflicts</li>
                  <li>• Coordinate with your manager</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}