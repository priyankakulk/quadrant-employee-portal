
import React, { useState } from 'react';

export default function EmployeeInductionModules() {
  const [documentsExpanded, setDocumentsExpanded] = useState(true);
  const [tutorialsExpanded, setTutorialsExpanded] = useState(false);

  const documentsToFillOut = [
    'Personal Info',
    'Insurance Form',
    'Contract Submission'
  ];

  return (
    <div className="min-h-screen bg-gray-200 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <h1 className="text-2xl font-medium text-gray-800 text-center mb-8">
          Employee Induction Modules
        </h1>

        <div className="flex flex-col gap-4">
          {/* Documents to Fill Out Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => setDocumentsExpanded(!documentsExpanded)}
              className="w-full bg-gray-300 hover:bg-gray-400 p-4 px-6 flex items-center justify-between border-none cursor-pointer text-lg font-medium text-gray-800 transition-colors"
            >
              <span>Documents to Fill Out</span>
              <span className="text-xl">
                {documentsExpanded ? '▼' : '▶'}
              </span>
            </button>

            {/* Expandable Content */}
            {documentsExpanded && (
              <div className="bg-white">
                {documentsToFillOut.map((document, index) => (
                  <div
                    key={index}
                    className={`p-4 px-6 hover:bg-gray-50 cursor-pointer text-base font-medium text-gray-800 transition-colors ${
                      index < documentsToFillOut.length - 1 ? 'border-b border-gray-200' : ''
                    }`}
                  >
                    {document}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Set Up Tutorials Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Section Header */}
            <button
              onClick={() => setTutorialsExpanded(!tutorialsExpanded)}
              className="w-full bg-gray-300 hover:bg-gray-400 p-4 px-6 flex items-center justify-between border-none cursor-pointer text-lg font-medium text-gray-800 transition-colors"
            >
              <span>Set Up Tutorials</span>
              <span className="text-xl">
                {tutorialsExpanded ? '▼' : '▶'}
              </span>
            </button>

            {/* Expandable Content */}
            {tutorialsExpanded && (
              <div className="bg-white p-4 px-6 text-gray-500">
                Tutorial content would go here...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}