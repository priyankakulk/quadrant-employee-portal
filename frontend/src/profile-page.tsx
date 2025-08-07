import React, { useState, useEffect } from 'react';
import { X, Mail, User, Award, MessageCircle, ChevronUp, ChevronDown, RefreshCw, AlertCircle, Building2 } from 'lucide-react';

export default function ProfilePage() {
  const [message, setMessage] = useState('');
  const [superiors, setSuperiors] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentEmployee, setCurrentEmployee] = useState(null);
  
  // API configuration - easily changeable for deployment
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api';

  useEffect(() => {
    // Get current user data from localStorage (set during sign-in)
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId) {
      setError('No user session found. Please sign in again.');
      return;
    }

    setCurrentEmployee({
      id: parseInt(userId),
      firstName: userName ? userName.split(' ')[0] : '',
      lastName: userName ? userName.split(' ').slice(1).join(' ') : '',
      role: userRole || '',
      email: userEmail || ''
    });

    fetchHierarchyData(parseInt(userId));
  }, []);

  const fetchHierarchyData = async (employeeId) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch superiors and subordinates in parallel
      const [superiorsResponse, subordinatesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/superiors?EID=${employeeId}`),
        fetch(`${API_BASE_URL}/subordinates?EID=${employeeId}`)
      ]);

      if (!superiorsResponse.ok || !subordinatesResponse.ok) {
        throw new Error('Failed to fetch hierarchy data');
      }

      const superiorsData = await superiorsResponse.json();
      const subordinatesData = await subordinatesResponse.json();

      setSuperiors(superiorsData || []);
      setSubordinates(subordinatesData || []);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hierarchy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Here you would typically send the message to your messaging system
      console.log('Sending message:', message);
      setMessage('');
      // You could show a success toast here
    }
  };

  const renderHierarchyLevel = (employees) => {
    if (!employees || employees.length === 0) return null;

    return employees.map((employee, index) => (
      <div key={employee.id} className={`flex justify-center ${index > 0 ? 'mt-3' : ''}`}>
        <div className="bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200 px-4 py-3 rounded-xl text-slate-700 font-medium hover:from-slate-100 hover:to-slate-200 hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5">
          <div className="text-sm font-semibold">{employee.firstName} {employee.lastName}</div>
          <div className="text-xs text-slate-500 mt-1">{employee.workEmail}</div>
        </div>
      </div>
    ));
  };

  const renderConnectionLines = (count) => {
    if (count === 0) return null;
    
    return (
      <div className="flex justify-center py-2">
        <div className="w-px h-6 bg-gradient-to-b from-slate-300 to-transparent"></div>
      </div>
    );
  };

  const renderSubordinatesGrid = () => {
    if (!subordinates || subordinates.length === 0) return null;

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
        {subordinates.map((subordinate) => (
          <div 
            key={subordinate.id} 
            className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 px-4 py-3 rounded-xl text-center hover:from-purple-100 hover:to-purple-200 hover:border-purple-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            title={subordinate.workEmail}
          >
            <div className="font-medium text-purple-800">{subordinate.firstName} {subordinate.lastName}</div>
            <div className="text-xs text-purple-600 mt-1">{subordinate.workEmail}</div>
          </div>
        ))}
      </div>
    );
  };

  if (!currentEmployee) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-slate-800 mb-2">Session Error</h2>
          <p className="text-slate-600">Please sign in to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Enhanced Header */}
      <div className="bg-white/80 backdrop-blur-sm shadow-lg border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <User className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white shadow-md"></div>
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                {currentEmployee.firstName} {currentEmployee.lastName}
              </h1>
              <p className="text-lg text-slate-600 mt-1">{currentEmployee.role}</p>
              <div className="flex items-center mt-3 space-x-1">
                <div className="h-1 w-8 bg-purple-500 rounded-full"></div>
                <span className="text-sm font-medium text-purple-600 px-2">Overview</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Left Column - Profile Info */}
          <div className="xl:col-span-3 space-y-6">
            {/* Quick Chat Section */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                Send a Quick Message
              </h2>
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 bg-gradient-to-r from-slate-600 to-slate-700 rounded-xl flex-shrink-0 shadow-md"></div>
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type your message here..."
                      className="w-full p-4 border border-slate-200 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/80 backdrop-blur-sm transition-all duration-200 text-slate-700 placeholder-slate-400"
                      rows="3"
                    />
                    {message && (
                      <button
                        onClick={() => setMessage('')}
                        className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button 
                    onClick={handleSendMessage}
                    className="mt-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-purple-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Send Message
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mr-3">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                Contact Information
              </h2>
              <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                <label className="block text-sm font-medium text-blue-700 mb-2">Email Address</label>
                <p className="text-blue-900 font-medium">{currentEmployee.email}</p>
              </div>
            </div>

            {/* Role Information */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mr-3">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                Role & Position
              </h2>
              <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                <p className="text-green-900 font-medium text-lg">{currentEmployee.role}</p>
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center">
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mr-3">
                  <Award className="w-5 h-5 text-white" />
                </div>
                Certifications & Achievements
              </h2>
              <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-xl p-4 flex items-center space-x-3">
                <div className="w-3 h-3 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full shadow-sm"></div>
                <span className="text-yellow-900 font-medium">Microsoft Azure Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column - Department Structure */}
          <div className="space-y-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 p-6 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-slate-600" />
                  Team Hierarchy
                </h2>
                <button 
                  onClick={() => fetchHierarchyData(currentEmployee.id)}
                  className="flex items-center space-x-2 text-purple-600 hover:text-purple-700 text-sm font-medium transition-colors"
                  disabled={loading}
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>{loading ? 'Loading...' : 'Refresh'}</span>
                </button>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-12">
                  <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-200"></div>
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent absolute top-0"></div>
                  </div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 border border-red-200 rounded-xl p-4 mb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    <p className="text-red-700 font-medium text-sm">Error loading hierarchy</p>
                  </div>
                  <p className="text-red-600 text-sm mb-3">{error}</p>
                  <button 
                    onClick={() => fetchHierarchyData(currentEmployee.id)}
                    className="text-red-700 hover:text-red-800 text-sm font-medium underline transition-colors"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* Hierarchy Display */}
              {!loading && !error && (
                <div className="space-y-4">
                  {/* Superiors */}
                  {superiors.length > 0 && (
                    <>
                      <div className="flex items-center justify-center text-sm font-medium text-slate-500 mb-3">
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Management ({superiors.length})
                      </div>
                      {renderHierarchyLevel(superiors)}
                      {renderConnectionLines(superiors.length)}
                    </>
                  )}

                  {/* Current Employee */}
                  <div className="flex justify-center">
                    <div className="bg-gradient-to-r from-purple-100 to-purple-200 border-2 border-purple-400 px-6 py-4 rounded-xl shadow-md">
                      <div className="text-purple-900 font-semibold text-center">
                        {currentEmployee.firstName} {currentEmployee.lastName}
                      </div>
                      <div className="text-purple-700 text-xs text-center mt-1">You</div>
                    </div>
                  </div>

                  {/* Subordinates */}
                  {subordinates.length > 0 && (
                    <>
                      {renderConnectionLines(subordinates.length)}
                      <div className="flex items-center justify-center text-sm font-medium text-slate-500 mb-3">
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Direct Reports ({subordinates.length})
                      </div>
                      {renderSubordinatesGrid()}
                    </>
                  )}

                  {/* No subordinates message */}
                  {subordinates.length === 0 && superiors.length === 0 && !loading && (
                    <div className="text-center py-8">
                      <Building2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                      <p className="text-slate-500 text-sm">No hierarchy data available</p>
                    </div>
                  )}

                  {subordinates.length === 0 && superiors.length > 0 && !loading && (
                    <div className="text-center text-sm text-slate-500 mt-4 py-4">
                      <div className="bg-slate-100 rounded-lg p-3">
                        No direct reports
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}