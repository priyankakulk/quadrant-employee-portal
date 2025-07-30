import React, { useState } from 'react';

export default function TimesheetForm() {
  const [hours, setHours] = useState({
    email: '',
    monday: '',
    tuesday: '',
    wednesday: '',
    thursday: '',
    friday: '',
    saturday: '',
    sunday: ''
  });

  const handleInputChange = (field, value) => {
    setHours(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const calculateTotalHours = () => {
    const dailyHours = [
      hours.monday, hours.tuesday, hours.wednesday, hours.thursday,
      hours.friday, hours.saturday, hours.sunday
    ];
    return dailyHours.reduce((total, day) => {
      const dayHours = parseFloat(day) || 0;
      return total + dayHours;
    }, 0);
  };

  const calculateOvertimeThisWeek = () => {
    const total = calculateTotalHours();
    return Math.max(0, total - 40);
  };

  const handleSubmit = () => {
    console.log('Submitting timesheet:', hours);
    // Handle form submission logic here
  };

  return (
    console.log('Rendering TimesheetForm'),
    <div className="min-h-screen bg-purple-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-lg font-medium text-center text-gray-800 mb-8">
          Enter the number of hours you have worked each day this week.
        </h1>

        <div className="flex gap-8">
          {/* Left Form Section */}
          <div className="flex-1 bg-white border-2 border-gray-400 rounded-lg p-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Email Field */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={hours.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Monday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Monday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.monday}
                  onChange={(e) => handleInputChange('monday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Thursday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Thursday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.thursday}
                  onChange={(e) => handleInputChange('thursday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Tuesday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tuesday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.tuesday}
                  onChange={(e) => handleInputChange('tuesday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Friday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Friday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.friday}
                  onChange={(e) => handleInputChange('friday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Wednesday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Wednesday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.wednesday}
                  onChange={(e) => handleInputChange('wednesday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Saturday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Saturday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.saturday}
                  onChange={(e) => handleInputChange('saturday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              {/* Sunday */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sunday
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={hours.sunday}
                  onChange={(e) => handleInputChange('sunday', e.target.value)}
                  placeholder="Enter # of Hours Worked"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="mt-8 flex justify-center">
              <button
                onClick={handleSubmit}
                className="bg-purple-700 hover:bg-purple-800 text-white font-medium py-3 px-8 rounded-md transition-colors duration-200"
              >
                Submit Timesheet
              </button>
            </div>
          </div>

          {/* Right Summary Section */}
          <div className="w-80 bg-white border-2 border-gray-400 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 italic text-center mb-6">
              Hours Worked
            </h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Hours Worked This Week:</span>
                <span className="font-semibold text-lg">{calculateTotalHours().toFixed(1)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Hours of Overtime This Week:</span>
                <span className="font-semibold text-lg">{calculateOvertimeThisWeek().toFixed(1)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700">Total Hours of Overtime Worked:</span>
                <span className="font-semibold text-lg">45</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}