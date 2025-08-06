import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Loader2, AlertCircle } from 'lucide-react';

const AssetManagementTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets, setAssets] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [combinedData, setCombinedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Backend API base URL - adjust this to match your FastAPI server
  const API_BASE_URL = 'http://localhost:8000/api'; // Updated to include /api prefix

  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both assets and assignments concurrently
        const [assetsResponse, assignmentsResponse] = await Promise.all([
          fetch(`${API_BASE_URL}/assets`),
          fetch(`${API_BASE_URL}/assignments`)
        ]);

        if (!assetsResponse.ok || !assignmentsResponse.ok) {
          throw new Error('Failed to fetch data from server');
        }

        const assetsData = await assetsResponse.json();
        const assignmentsData = await assignmentsResponse.json();

        setAssets(assetsData);
        setAssignments(assignmentsData);

        // Combine assets with their assignments
        const combined = assignmentsData.map(assignment => {
          const asset = assetsData.find(a => a.asset_id === assignment.asset_id);
          return {
            id: assignment.assignment_id,
            name: asset ? asset.asset_name : 'Unknown Asset',
            assetId: assignment.asset_id,
            category: asset ? asset.asset_category : 'Unknown',
            assignedTo: `${assignment.employee_name}/${assignment.employee_id}`,
            assignedOn: assignment.assigned_on,
            dueDate: assignment.due_date,
            returnedOn: assignment.returned_on,
            status: assignment.status
          };
        });

        setCombinedData(combined);
      } catch (err) {
        setError(err.message);
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter assets based on search query
  const filteredAssets = combinedData.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assetId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle status update
  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      console.log(`Updating assignment ${assignmentId} to status: ${newStatus}`);
      
      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Server response:', errorText);
        throw new Error(`Failed to update status: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Status update successful:', result);

      // Update local state
      setCombinedData(prev => prev.map(item => 
        item.id === assignmentId ? { ...item, status: newStatus } : item
      ));
    } catch (err) {
      console.error('Error updating status:', err);
      alert(`Failed to update status: ${err.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin text-amber-600" />
          <span className="text-amber-700">Loading assets...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md">
          <div className="flex items-center space-x-2 text-red-600 mb-2">
            <AlertCircle className="h-5 w-5" />
            <span className="font-medium">Error Loading Data</span>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-500 text-white px-4 py-2 rounded-md hover:bg-amber-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Asset Management</h1>
          <p className="text-gray-600">
            Total Assets: {assets.length} | Active Assignments: {assignments.filter(a => a.status !== 'Returned').length}
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col space-y-1">
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                  <div className="w-3 h-0.5 bg-gray-600"></div>
                </div>
              </div>
            </div>
            <input
              type="text"
              placeholder="Search by asset name, ID, or assignee..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-3 bg-white border border-gray-300 rounded-full text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-amber-100 border-b border-amber-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Asset Name</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Asset ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Assigned To</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Assigned On</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssets.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    {searchQuery ? 'No assets found matching your search.' : 'No asset assignments found.'}
                  </td>
                </tr>
              ) : (
                filteredAssets.map((asset, index) => (
                  <tr key={asset.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                    <td className="px-6 py-4 text-sm text-gray-900">{asset.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{asset.assetId}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{asset.category}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{asset.assignedTo}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {new Date(asset.assignedOn).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {asset.dueDate ? new Date(asset.dueDate).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="relative">
                        <select 
                          value={asset.status}
                          onChange={(e) => handleStatusUpdate(asset.id, e.target.value)}
                          className={`appearance-none border rounded px-3 py-2 pr-8 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent ${
                            asset.status === 'Overdue' ? 'bg-red-100 border-red-200 text-red-700' :
                            asset.status === 'Returned' ? 'bg-green-100 border-green-200 text-green-700' :
                            asset.status === 'Pending' ? 'bg-yellow-100 border-yellow-200 text-yellow-700' :
                            'bg-amber-100 border-amber-200 text-gray-700'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Overdue">Overdue</option>
                          <option value="Returned">Returned</option>
                          <option value="Exempt (Backpack)">Exempt (Backpack)</option>
                        </select>
                        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                          <ChevronDown className="h-4 w-4 text-gray-400" />
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetManagementTable;