import React, { useState, useEffect } from 'react';
import { X, Mail, User, Award, MessageCircle, ChevronUp, ChevronDown } from 'lucide-react';

export default function ProfilePage() {
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [message, setMessage] = useState('');
  const [superiors, setSuperiors] = useState([]);
  const [subordinates, setSubordinates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // This should be dynamic based on the current user
  const currentEmployeeId = 94381; // Replace with actual employee ID
  const currentEmployee = {
    firstName: "John",
    lastName: "Smith",
    role: "IT Developer",
    email: "jsmith@quadranttechnologies.com"
  };

  // API base URL - adjust this to match your FastAPI server
  const API_BASE_URL = `http://localhost:8000/api/superiors?EID=${currentEmployeeId}`;
  fetch(API_BASE_URL)
    .then(response => {
      if(!response.ok){
        throw new Error('HTTP error!');
      }
      return response.json();
    })
    .then(data=> {
      console.log('Supeirors:', data);
    })
    .catch(error => {
      console.error('error fetching superiors:', error);
    });

  useEffect(() => {
    fetchHierarchyData();
  }, []);

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch superiors and subordinates in parallel
      const [superiorsResponse, subordinatesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/superiors?EID=${currentEmployeeId}`),
        fetch(`${API_BASE_URL}/subordinates?EID=${currentEmployeeId}`)
      ]);

      if (!superiorsResponse.ok || !subordinatesResponse.ok) {
        throw new Error('Failed to fetch hierarchy data');
      }

      const superiorsData = await superiorsResponse.json();
      const subordinatesData = await subordinatesResponse.json();

      setSuperiors(superiorsData);
      setSubordinates(subordinatesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching hierarchy data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderHierarchyLevel = (employees, level = 0) => {
    if (!employees || employees.length === 0) return null;

    return employees.map((employee, index) => (
      <div key={employee.id} className={`flex justify-center ${index > 0 ? 'mt-2' : ''}`}>
        <div className="bg-gray-300 px-4 py-2 rounded text-gray-800 font-medium hover:bg-gray-400 transition-colors cursor-pointer">
          {employee.firstName} {employee.lastName}
        </div>
      </div>
    ));
  };

  const renderConnectionLines = (count) => {
    if (count === 0) return null;
    
    return (
      <div className="flex justify-center">
        <div className="w-px h-8 bg-gray-300"></div>
      </div>
    );
  };

  const renderSubordinatesGrid = () => {
    if (!subordinates || subordinates.length === 0) return null;

    return (
      <div className="grid grid-cols-2 gap-3 mt-6">
        {subordinates.map((subordinate) => (
          <div 
            key={subordinate.id} 
            className="bg-gray-300 px-3 py-2 rounded text-gray-800 text-center hover:bg-gray-400 transition-colors cursor-pointer"
            title={subordinate.workEmail}
          >
            {subordinate.firstName}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-purple-200 rounded-full flex items-center justify-center">
              <User className="w-10 h-10 text-purple-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {currentEmployee.firstName} {currentEmployee.lastName}
              </h1>
              <p className="text-gray-600">{currentEmployee.role}</p>
              <nav className="mt-2">
                <button className="text-purple-600 border-b-2 border-purple-600 pb-1 px-1 font-medium">
                  Overview
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Chat Section */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-purple-600" />
                Send a Quick Chat
              </h2>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-gray-800 rounded flex-shrink-0"></div>
                <div className="flex-1">
                  <div className="relative">
                    <textarea
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Message"
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      rows="3"
                    />
                    {message && (
                      <button
                        onClick={() => setMessage('')}
                        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  <button className="mt-3 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                    Send Message
                  </button>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Mail className="w-5 h-5 mr-2 text-purple-600" />
                Contact Information
              </h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-900">{currentEmployee.email}</p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Role
              </h2>
              <p className="text-gray-900">{currentEmployee.role}</p>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="w-5 h-5 mr-2 text-purple-600" />
                Certifications
              </h2>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-gray-900">Microsoft Azure Certified</span>
              </div>
            </div>
          </div>

          {/* Right Column - Department Structure */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Department Hierarchy</h2>
                <button 
                  onClick={fetchHierarchyData}
                  className="text-purple-600 hover:text-purple-700 text-sm"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Refresh'}
                </button>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                </div>
              )}

              {/* Error State */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-600 text-sm">Error: {error}</p>
                  <button 
                    onClick={fetchHierarchyData}
                    className="mt-2 text-red-700 hover:text-red-800 text-sm underline"
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
                      <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                        <ChevronUp className="w-4 h-4 mr-1" />
                        Superiors
                      </div>
                      {renderHierarchyLevel(superiors)}
                      {renderConnectionLines(superiors.length)}
                    </>
                  )}

                  {/* Current Employee */}
                  <div className="flex justify-center">
                    <div className="bg-purple-100 border-2 border-purple-400 px-4 py-2 rounded text-purple-800 font-medium">
                      {currentEmployee.firstName} {currentEmployee.lastName}
                    </div>
                  </div>

                  {/* Subordinates */}
                  {subordinates.length > 0 && (
                    <>
                      {renderConnectionLines(subordinates.length)}
                      <div className="flex items-center justify-center text-sm text-gray-500 mb-2">
                        <ChevronDown className="w-4 h-4 mr-1" />
                        Team Members ({subordinates.length})
                      </div>
                      {renderSubordinatesGrid()}
                    </>
                  )}

                  {/* No subordinates message */}
                  {subordinates.length === 0 && !loading && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                      No direct reports
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