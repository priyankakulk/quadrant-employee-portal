import React, { useState } from 'react';

export default function FeedbackForm() {
  const [subjectLine, setSubjectLine] = useState('');
  const [sendTo, setSendTo] = useState('');
  const [message, setMessage] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const sendToOptions = [
    'HR Department',
    'IT Support', 
    'Management',
    'Team Lead',
    'General Feedback'
  ];

  const handleSubmit = () => {
    alert(`Subject: ${subjectLine}\nSend To: ${sendTo}\nMessage: ${message}`);
  };

  return (
    <div className="min-h-screen bg-purple-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-2xl font-semibold text-gray-800 text-center mb-8">Feedback Form</h1>
        
        <div className="bg-white border-2 border-gray-400 rounded-lg p-8">
          {/* Subject Line */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject Line
            </label>
            <input
              type="text"
              value={subjectLine}
              onChange={(e) => setSubjectLine(e.target.value)}
              placeholder="Value"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
            />
          </div>

          {/* Send To */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="w-full px-4 py-3 border border-gray-300 rounded-md text-left bg-white flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span className={sendTo ? 'text-gray-900' : 'text-gray-400'}>
                  {sendTo || 'Value'}
                </span>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10">
                  {sendToOptions.map((option, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => {
                        setSendTo(option);
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              rows={6}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Value"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="px-12 py-3 bg-gray-800 text-white rounded-md hover:bg-gray-700 focus:outline-none transition-colors"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}