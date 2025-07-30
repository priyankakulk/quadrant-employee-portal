import React, { useState } from 'react';
import { X, Mail, User, Award, MessageCircle } from 'lucide-react';

export default function ProfilePage() {
  const [showQuickChat, setShowQuickChat] = useState(false);
  const [message, setMessage] = useState('');

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
              <h1 className="text-2xl font-bold text-gray-900">Jane Doe</h1>
              <p className="text-gray-600">Software Developer</p>
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
                  <p className="text-gray-900">j-jdoe@quadranttechnologies.com</p>
                </div>
              </div>
            </div>

            {/* Role */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User className="w-5 h-5 mr-2 text-purple-600" />
                Role
              </h2>
              <p className="text-gray-900">Software Developer</p>
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
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Department</h2>
              
              {/* Department Tree */}
              <div className="space-y-4">
                {/* CEO Level */}
                <div className="flex justify-between">
                  <div className="bg-gray-300 px-4 py-2 rounded text-gray-800 font-medium">
                    CEO
                  </div>
                  <div className="bg-gray-300 px-4 py-2 rounded text-gray-800 font-medium">
                    VP
                  </div>
                </div>

                {/* Connection Line */}
                <div className="flex justify-center">
                  <div className="w-px h-8 bg-gray-300"></div>
                </div>

                {/* Jane Doe Level */}
                <div className="flex justify-center">
                  <div className="bg-gray-300 px-4 py-2 rounded text-gray-800 font-medium border-2 border-gray-400">
                    Jane Doe
                  </div>
                </div>

                {/* Description */}
                <div className="text-center text-sm text-gray-600 mt-4">
                  Jane Doe works with...
                </div>

                {/* Team Members */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-gray-300 px-3 py-2 rounded text-gray-800 text-center">
                    John
                  </div>
                  <div className="bg-gray-300 px-3 py-2 rounded text-gray-800 text-center">
                    Sally
                  </div>
                  <div className="bg-gray-300 px-3 py-2 rounded text-gray-800 text-center">
                    Jim
                  </div>
                  <div className="bg-gray-300 px-3 py-2 rounded text-gray-800 text-center">
                    Mia
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}