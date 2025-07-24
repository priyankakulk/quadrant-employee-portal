import { useState } from 'react';
import { Calendar, User, Mail, MessageSquare, Clock } from 'lucide-react';

export default function LeaveApplication() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    reason: '',
    startDate: '',
    endDate: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = () => {
    console.log('Leave application submitted:', formData);
  };

  const leaveTypes = [
    'Vacation',
    'Sick Leave',
    'Personal Leave',
    'Maternity Leave',
    'Paternity Leave',
    'Emergency Leave'
  ];

  const currentLeaveStatus = [
    { type: 'Vacation', days: 12 },
    { type: 'Sick Leave', days: 4 },
    { type: 'Maternity Leave', days: 58 },
    { type: 'Paternity Leave', days: 0 }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Leave Application</h1>
          <p className="text-gray-600">Submit your leave request for approval</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Form */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Name Field */}
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

                {/* Email Field */}
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

                {/* Reason Field */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Clock className="w-4 h-4 mr-2 text-purple-600" />
                    Leave Type
                  </label>
                  <select
                    name="reason"
                    value={formData.reason}
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
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    required
                  />
                </div>

                {/* End Date */}
                <div className="space-y-2">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-2">
                    <Calendar className="w-4 h-4 mr-2 text-purple-600" />
                    End Date
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
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
                  name="message"
                  value={formData.message}
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
                  className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
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
                {currentLeaveStatus.map((leave, index) => (
                  <div key={index} className="flex items-center justify-between py-3 px-4 border-b border-gray-100 last:border-b-0">
                    <span className="font-medium text-gray-700">{leave.type}</span>
                    <span className="font-bold text-gray-900">{leave.days} days</span>
                  </div>
                ))}
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