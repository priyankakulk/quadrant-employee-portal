import React, { useState } from 'react';
import { Search, ChevronDown } from 'lucide-react';

const AssetManagementTable = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [assets] = useState([
    {
      id: 14876,
      name: 'Admin Computer',
      category: 'Tech',
      assignedTo: 'Adam/12345',
      assignedOn: '07/1/2025'
    },
    {
      id: 16745,
      name: 'Ipad',
      category: 'Tech',
      assignedTo: 'Bianca/12345',
      assignedOn: '07/1/2025'
    },
    {
      id: 12345,
      name: 'Desk Mouse',
      category: 'Desk Materials',
      assignedTo: 'Rebecca B./12345',
      assignedOn: '07/16/2025'
    },
    {
      id: 17654,
      name: 'Laptop',
      category: 'Tech',
      assignedTo: 'Sally/12345',
      assignedOn: '01/1/25'
    },
    {
      id: 19876,
      name: 'Monitor',
      category: 'Tech',
      assignedTo: 'Sara/12345',
      assignedOn: '02/3/25'
    },
    {
      id: 11234,
      name: 'Company Computer',
      category: 'Tech',
      assignedTo: 'Bob/12345',
      assignedOn: '09/25/24'
    },
    {
      id: 16382,
      name: 'Computer Charger',
      category: 'Desk Materials',
      assignedTo: 'Peter/12345',
      assignedOn: '09/1/23'
    },
    {
      id: 18362,
      name: 'Monitor Mouse',
      category: 'Desk Materials',
      assignedTo: 'David',
      assignedOn: '04/24/2025'
    }
  ]);

  const filteredAssets = assets.filter(asset =>
    asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    asset.id.toString().includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <div className="max-w-7xl mx-auto">
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
              placeholder="Search for asset name, asset ID"
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
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Asset Category</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Assigned to/EM ID</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Assigned on</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredAssets.map((asset, index) => (
                <tr key={asset.id} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.category}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.assignedTo}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{asset.assignedOn}</td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select className="appearance-none bg-amber-100 border border-amber-200 rounded px-3 py-2 pr-8 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent">
                        <option>Status</option>
                        <option>Active</option>
                        <option>Inactive</option>
                        <option>Maintenance</option>
                      </select>
                      <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
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

export default AssetManagementTable;