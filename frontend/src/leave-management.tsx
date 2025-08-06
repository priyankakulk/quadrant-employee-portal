
import React, { useState } from 'react';
import { Search, Filter } from 'lucide-react';

const LeaveManagementPanel = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('management');
  const [leaveApplications] = useState([
    {
      id: 1,
      approvedBy: 'by John Doe',
      applicantName: 'Jane Doe',
      workEmail: 'i-blah',
      reasonForLeave: 'Sick',
      startDate: '08/31/24',
      endDate: '09/22/24',
      approved: true
    },
    {
      id: 2,
      approvedBy: 'by John Doe',
      applicantName: 'Jane Doe',
      workEmail: 'i-blah',
      reasonForLeave: 'Paternity',
      startDate: '08/31/24',
      endDate: '09/22/24',
      approved: true
    },
    {
      id: 3,
      approvedBy: 'by John Doe',
      applicantName: 'Jane Doe',
      workEmail: 'i-blah',
      reasonForLeave: 'Sick',
      startDate: '08/31/24',
      endDate: '09/22/24',
      approved: true
    },
    {
      id: 4,
      approvedBy: 'by John Doe',
      applicantName: 'Jane Doe',
      workEmail: 'i-blah',
      reasonForLeave: 'Maternity',
      startDate: '08/31/24',
      endDate: '09/22/24',
      approved: true
    },
    {
      id: 5,
      approvedBy: 'by John Doe',
      applicantName: 'Jane Doe',
      workEmail: 'i-blah',
      reasonForLeave: 'Maternity',
      startDate: '08/31/24',
      endDate: '09/22/24',
      approved: true
    },
    {
      id: 6,
      approvedBy: 'by John Doe',
      applicantName: 'Jane Doe',
      workEmail: 'i-blah',
      reasonForLeave: 'Sick',
      startDate: '08/31/24',
      endDate: '09/22/24',
      approved: true
    }
  ]);

  const filteredApplications = leaveApplications.filter(app =>
    app.applicantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.reasonForLeave.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.workEmail.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-amber-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              <div className="flex items-center">
                <Filter className="h-6 w-6 text-gray-800 mr-2" />
              </div>
              <nav className="flex space-x-8">
                <button
                  onClick={() => setActiveTab('submit')}
                  className={`px-1 py-2 text-sm font-medium border-b-2 ${
                    activeTab === 'submit'
                      ? 'text-gray-900 border-gray-900'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Submit for Leave
                </button>
                <button
                  onClick={() => setActiveTab('management')}
                  className={`px-1 py-2 text-sm font-medium border-b-2 ${
                    activeTab === 'management'
                      ? 'text-coral-400 border-coral-400'
                      : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
                  }`}
                  style={{ 
                    color: activeTab === 'management' ? '#FF7F7F' : '',
                    borderBottomColor: activeTab === 'management' ? '#FF7F7F' : ''
                  }}
                >
                  Leave Application Management
                </button>
              </nav>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <div className="flex flex-col space-y-1">
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                </div>
              </div>
              <input
                type="text"
                placeholder="Search for subject line"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="p-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Approved by Manager?</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Applicant Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Work Email</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Reason for Leave</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Start Date - End Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-600">Approved by HR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredApplications.map((application, index) => (
                <tr key={application.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-800 rounded flex items-center justify-center mr-2">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-900">{application.approvedBy}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{application.applicantName}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{application.workEmail}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{application.reasonForLeave}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{application.startDate} - {application.endDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center mr-3">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-sm text-gray-900 font-medium">Send to Leave Log</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LeaveManagementPanel;