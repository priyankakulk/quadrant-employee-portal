import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import LeaveApplication  from './leave-application';
import { 
  FileText, 
  Clock, 
  MessageSquare, 
  Key, 
  Target, 
  Ticket,
  Bell,
  User,
  Settings,
  Diamond,
  Search,
  Calendar,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Users,
  Briefcase
} from 'lucide-react';

export default function EmployeePortal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const navigate = useNavigate(); // Add this hook

  // Add navigation handler
  const handleQuickLinkClick = (title) => {
    if (title === "Leave Application") {
      navigate('/leave-application');
    }
    // Add other navigation cases as needed
     else if (title === "Feedback") {
       navigate('/feedback-form');
     }
     else if (title === "Career Portal") {
       navigate('/job-applications');
     }
      else if (title === "Induction") {
       navigate('/induction-modules');
     }
     else if (title === "Timesheet") {
       navigate('/timesheet');
     }
  };

  const navigationItems = [
    'Home', 'My Work', 'Teams', 'More Apps'
  ];
  
  const quickLinkButtons = [
    {
      icon: <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">JI</div>,
      title: "Leave Application",
      bgColor: "bg-white"
    },
    {
      icon: <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center text-white text-xs font-bold">HS</div>,
      title: "Timesheet",
      bgColor: "bg-white"
    },
    {
      icon: <div className="w-8 h-8 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">BB</div>,
      title: "Induction",
      bgColor: "bg-white"
    },
    {
      icon: <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">AT</div>,
      title: "Career Portal",
      bgColor: "bg-white"
    },
    {
      icon: <div className="w-8 h-8 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">PS</div>,
      title: "Ticketing",
      bgColor: "bg-white"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: "Feedback",
      bgColor: "bg-white"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: "Feedback",
      bgColor: "bg-white"
    }
  ];

  const surveys = [
    {
      title: "Employee Satisfaction",
      category: "General",
      daysRemaining: 15,
      description: "Help us improve workplace culture by sharing your feedback on current policies and work environment.",
      icon: "👥"
    },
    {
      title: "IT Infrastructure Review",
      category: "Technology",
      daysRemaining: 8,
      description: "Evaluate our current IT systems and suggest improvements for better productivity.",
      icon: "💻"
    }
  ];

  const events = [
    {
      date: "15",
      month: "Dec",
      title: "Annual Company Meeting",
      time: "Mon, 15 Dec • 10:00 AM",
      location: "Main Conference Hall"
    },
    {
      date: "22",
      month: "Dec",
      title: "Team Building Event",
      time: "Mon, 22 Dec • 2:00 PM",
      location: "Outdoor Activity Center"
    }
  ];

  const holidays = [
    {
      date: "25",
      month: "Dec",
      title: "Christmas Day",
      subtitle: "25 December 2024 / Wednesday"
    },
    {
      date: "01",
      month: "Jan",
      title: "New Year's Day",
      subtitle: "01 January 2025 / Wednesday"
    }
  ];

  const colleagues = [
    {
      name: "Sarah Johnson",
      role: "Product Manager",
      email: "sarah.johnson@company.com",
      avatar: "SJ"
    },
    {
      name: "David Chen",
      role: "Engineering Lead",
      email: "david.chen@company.com",
      avatar: "DC"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header Navigation */}
      <header className="bg-blue-700 shadow-sm">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <Diamond className="w-6 h-6 text-white" />
                <span className="text-lg font-semibold text-white">Quadrant Technologies</span>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-6">
                {navigationItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                      item === 'Home' 
                        ? 'text-white border-b-2 border-white' 
                        : 'text-blue-100 hover:text-white'
                    }`}
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </div>
            
            {/* Right Side */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search this site"
                  className="pl-10 pr-4 py-2 bg-blue-600 text-white placeholder-blue-200 border border-blue-500 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                />
              </div>
              <Bell className="w-5 h-5 text-blue-100 hover:text-white cursor-pointer" />
              <span className="text-blue-100 text-sm font-medium">PEOPLE ONE</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Main Content Area */}
        <div className="flex-1 p-6">
          {/* Announcement Banner */}
          <div className="bg-blue-600 text-white p-4 rounded-lg mb-6 flex items-center">
            <div className="w-6 h-6 bg-white bg-opacity-20 rounded mr-3 flex items-center justify-center">
              <Bell className="w-4 h-4" />
            </div>
            <span className="text-sm">15 Jan 2025 - We are expanding to a new "Business Location"</span>
          </div>

          {/* Hero Section with Image */}
          <div className="bg-white rounded-lg shadow-sm mb-6 overflow-hidden">
            <div className="relative">
              <div className="h-64 bg-gradient-to-r from-gray-800 to-gray-600 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <h1 className="text-3xl font-bold mb-4">Welcome, Jane Doe!</h1>
                  <p className="text-lg opacity-90">Your central hub for all workplace resources and tools</p>
                </div>
              </div>
              <div className="absolute bottom-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                Portal Q1 updates - Enhanced features and better user experience
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white rounded-lg shadow-sm mb-6">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Quick Links</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-4 gap-4">
                {quickLinkButtons.map((button, index) => (
                  <div key={index} className="text-center">
                    <div 
                      className="bg-gray-50 hover:bg-gray-100 p-4 rounded-lg cursor-pointer transition-colors duration-200 border h-20 flex flex-col items-center justify-center"
                      onClick={() => handleQuickLinkClick(button.title)}
                    >
                      <div className="flex justify-center mb-1">
                        {button.icon}
                      </div>
                      <span className="text-xs text-gray-600 font-medium leading-tight text-center">{button.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Events */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Upcoming Events</h3>
              </div>
              <div className="p-6 space-y-4">
                {events.map((event, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="bg-blue-600 text-white text-center rounded p-2 min-w-[60px]">
                      <div className="text-xl font-bold">{event.date}</div>
                      <div className="text-xs">{event.month}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{event.title}</h4>
                      <p className="text-sm text-gray-500">{event.time}</p>
                      <div className="flex items-center text-xs text-gray-400 mt-1">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Holidays */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
                <h3 className="text-lg font-semibold">Holidays</h3>
              </div>
              <div className="p-6 space-y-4">
                {holidays.map((holiday, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="bg-red-500 text-white text-center rounded p-2 min-w-[60px]">
                      <div className="text-xl font-bold">{holiday.date}</div>
                      <div className="text-xs">{holiday.month}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{holiday.title}</h4>
                      <p className="text-sm text-gray-500">{holiday.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 p-6 space-y-6">
          {/* Surveys */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Surveys</h3>
            </div>
            <div className="p-6 space-y-4">
              {surveys.map((survey, index) => (
                <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{survey.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{survey.title}</h4>
                      <p className="text-sm text-blue-600 font-medium">{survey.category}</p>
                      <p className="text-xs text-gray-500 mt-1">📅 {survey.daysRemaining} days Remaining</p>
                      <p className="text-sm text-gray-600 mt-2">{survey.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Calendar */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Company Calendar</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-1 hover:bg-blue-500 rounded">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium">December 2024</span>
                  <button className="p-1 hover:bg-blue-500 rounded">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1">
                {[...Array(35)].map((_, i) => {
                  const day = i - 6; // Adjust for first week
                  const isCurrentMonth = day > 0 && day <= 31;
                  const isToday = day === 15;
                  const hasEvent = [15, 22, 25].includes(day);
                  
                  return (
                    <div
                      key={i}
                      className={`p-2 text-center text-sm h-10 flex items-center justify-center relative ${
                        isCurrentMonth 
                          ? isToday 
                            ? 'bg-blue-600 text-white rounded-full' 
                            : hasEvent 
                              ? 'bg-blue-100 text-blue-800 rounded-full font-medium cursor-pointer hover:bg-blue-200' 
                              : 'text-gray-900 hover:bg-gray-100 rounded-full cursor-pointer'
                          : 'text-gray-300'
                      }`}
                    >
                      {isCurrentMonth ? day : ''}
                      {hasEvent && !isToday && (
                        <div className="absolute bottom-1 w-1 h-1 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Find My Colleague */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="bg-blue-600 text-white px-6 py-4 rounded-t-lg">
              <h3 className="text-lg font-semibold">Find My Colleague</h3>
            </div>
            <div className="p-6">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="space-y-3">
                {colleagues.map((colleague, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                      {colleague.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-sm">{colleague.name}</h4>
                      <p className="text-xs text-gray-500">{colleague.role}</p>
                      <p className="text-xs text-gray-400">{colleague.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}