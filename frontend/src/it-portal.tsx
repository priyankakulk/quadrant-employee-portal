import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Briefcase,
  UserPlus,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function EmployeePortal() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Get user information from localStorage
  useEffect(() => {
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const userRole = localStorage.getItem('userRole');
    const userEmail = localStorage.getItem('userEmail');

    if (!userId) {
      // Redirect to login if no session
      navigate('/');
      return;
    }

    setCurrentUser({
      id: userId,
      name: userName || 'User',
      role: userRole || 'Employee',
      email: userEmail || ''
    });
  }, [navigate]);

  // Add navigation handler
  const handleQuickLinkClick = (title) => {
    if (title === "Leave Application") {
      navigate('/leave-application');
    }
    else if (title === "Feedback") {
      navigate('/feedback-form');
    }
    else if (title === "Career Portal") {
      navigate('/job-applications');
    }
    else if (title === "Asset Management") {
      navigate('/asset-management');
    }
    else if (title === "Timesheet") {
      navigate('/timesheet');
    }
    else if (title === "Ticketing") {
      navigate('/ticketing');
    }
    else if (title === "Induction") {
      navigate('/induction-modules');
    }
  };

  const navigationItems = [
    'Home', 'My Work', 'Teams', 'More Apps'
  ];
  
  const quickLinkButtons = [
    {
      icon: <FileText className="w-6 h-6 text-emerald-600" />,
      title: "Leave Application",
      gradient: "from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100",
      borderColor: "border-emerald-200"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-600" />,
      title: "Timesheet",
      gradient: "from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100",
      borderColor: "border-orange-200"
    },
    {
      icon: <User className="w-6 h-6 text-purple-600" />,
      title: "Induction",
      gradient: "from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100",
      borderColor: "border-purple-200"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-blue-600" />,
      title: "Career Portal",
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200"
    },
    {
      icon: <Ticket className="w-6 h-6 text-red-600" />,
      title: "Ticketing",
      gradient: "from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100",
      borderColor: "border-red-200"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-cyan-600" />,
      title: "Feedback",
      gradient: "from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100",
      borderColor: "border-cyan-200"
    },
    {
      icon: <UserPlus className="w-6 h-6 text-indigo-600" />,
      title: "Asset Management",
      gradient: "from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100",
      borderColor: "border-indigo-200"
    }
  ];

  const surveys = [
    {
      title: "Employee Satisfaction",
      category: "General",
      daysRemaining: 15,
      description: "Help us improve workplace culture by sharing your feedback on current policies and work environment.",
      icon: "👥",
      gradient: "from-emerald-500 to-emerald-600"
    },
    {
      title: "IT Infrastructure Review",
      category: "Technology",
      daysRemaining: 8,
      description: "Evaluate our current IT systems and suggest improvements for better productivity.",
      icon: "💻",
      gradient: "from-purple-500 to-purple-600"
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-float opacity-10"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            <Sparkles className="w-4 h-4 text-teal-500" />
          </div>
        ))}
      </div>

      {/* Header Navigation */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-700 shadow-lg relative z-10">
        <div className="px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                  <Diamond className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Quadrant Technologies</span>
              </div>
              
              {/* Navigation Links */}
              <nav className="hidden md:flex space-x-1">
                {navigationItems.map((item, index) => (
                  <a
                    key={index}
                    href="#"
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                      item === 'Home' 
                        ? 'text-white bg-white/20 backdrop-blur-sm shadow-lg' 
                        : 'text-teal-100 hover:text-white hover:bg-white/10'
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
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-teal-300" />
                <input
                  type="text"
                  placeholder="Search this site"
                  className="pl-10 pr-4 py-2 bg-white/10 text-white placeholder-teal-200 border border-white/20 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-transparent backdrop-blur-sm"
                />
              </div>
              <div className="relative">
                <Bell className="w-5 h-5 text-teal-100 hover:text-white cursor-pointer transition-colors" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              </div>
              <span className="text-teal-100 text-sm font-medium">{currentUser?.name?.toUpperCase() || 'USER'}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex relative z-10">
        {/* Main Content Area */}
        <div className="flex-1 p-8">
          {/* Announcement Banner */}
          <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white p-6 rounded-2xl mb-8 flex items-center shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-teal-600/50 to-transparent"></div>
            <div className="w-12 h-12 bg-white/20 rounded-xl mr-4 flex items-center justify-center backdrop-blur-sm relative z-10">
              <Bell className="w-6 h-6" />
            </div>
            <div className="relative z-10">
              <div className="font-semibold mb-1">Latest Update</div>
              <span className="text-sm opacity-90">15 Jan 2025 - We are expanding to a new "Business Location"</span>
            </div>
          </div>

          {/* Hero Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl mb-8 overflow-hidden border border-white/20">
            <div className="relative">
              <div className="h-80 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500/20 to-purple-500/20"></div>
                <div className="text-center text-white p-8 relative z-10">
                  <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-white to-teal-100 bg-clip-text text-transparent">
                    Welcome, {currentUser?.name || 'User'}!
                  </h1>
                  <p className="text-xl opacity-90 max-w-2xl">Your central hub for all workplace resources and tools</p>
                  <div className="mt-4">
                    <span className="inline-flex items-center px-4 py-2 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                      <User className="w-4 h-4 mr-2" />
                      {currentUser?.role || 'Employee'} • {currentUser?.email || ''}
                    </span>
                  </div>
                  <div className="mt-4 flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-teal-200">Portal Q1 updates - Enhanced features and better user experience</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl mb-8 border border-white/20">
            <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-6 rounded-t-3xl">
              <h3 className="text-2xl font-bold flex items-center">
                <div className="w-8 h-8 bg-white/20 rounded-lg mr-3 flex items-center justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>
                Quick Links
              </h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-6">
                {quickLinkButtons.map((button, index) => (
                  <div key={index} className="text-center group">
                    <div 
                      className={`bg-gradient-to-br ${button.bgGradient} border ${button.borderColor} p-6 rounded-2xl cursor-pointer transition-all duration-300 h-32 flex flex-col items-center justify-center group-hover:shadow-xl group-hover:-translate-y-1 group-hover:scale-105`}
                      onClick={() => handleQuickLinkClick(button.title)}
                    >
                      <div className={`w-12 h-12 bg-gradient-to-r ${button.gradient} rounded-xl flex items-center justify-center mb-3 shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                        {button.icon}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 leading-tight text-center">{button.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Sections Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Events */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-8 py-6 rounded-t-3xl">
                <h3 className="text-xl font-bold flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  Upcoming Events
                </h3>
              </div>
              <div className="p-8 space-y-6">
                {events.map((event, index) => (
                  <div key={index} className="flex space-x-4 group">
                    <div className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-center rounded-2xl p-4 min-w-[80px] shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="text-2xl font-bold">{event.date}</div>
                      <div className="text-xs opacity-90">{event.month}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{event.title}</h4>
                      <p className="text-sm text-slate-600 mb-2">{event.time}</p>
                      <div className="flex items-center text-xs text-slate-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Holidays */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
              <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-6 rounded-t-3xl">
                <h3 className="text-xl font-bold flex items-center">
                  <Calendar className="w-6 h-6 mr-3" />
                  Holidays
                </h3>
              </div>
              <div className="p-8 space-y-6">
                {holidays.map((holiday, index) => (
                  <div key={index} className="flex space-x-4 group">
                    <div className="bg-gradient-to-r from-red-500 to-red-600 text-white text-center rounded-2xl p-4 min-w-[80px] shadow-lg group-hover:shadow-xl transition-all duration-300">
                      <div className="text-2xl font-bold">{holiday.date}</div>
                      <div className="text-xs opacity-90">{holiday.month}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{holiday.title}</h4>
                      <p className="text-sm text-slate-600">{holiday.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-96 p-8 space-y-8">
          {/* Surveys */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-8 py-6 rounded-t-3xl">
              <h3 className="text-xl font-bold flex items-center">
                <MessageSquare className="w-6 h-6 mr-3" />
                Active Surveys
              </h3>
            </div>
            <div className="p-8 space-y-6">
              {surveys.map((survey, index) => (
                <div key={index} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{survey.icon}</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-lg mb-1">{survey.title}</h4>
                      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${survey.gradient} text-white mb-2`}>
                        {survey.category}
                      </div>
                      <div className="flex items-center text-xs text-slate-500 mb-3">
                        <Calendar className="w-3 h-3 mr-1" />
                        {survey.daysRemaining} days remaining
                      </div>
                      <p className="text-sm text-slate-600 mb-4">{survey.description}</p>
                      <button className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5">
                        Take Survey
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Company Calendar */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-6 rounded-t-3xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold">Company Calendar</h2>
                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-sm font-medium">December 2024</span>
                  <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="p-8">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-semibold text-slate-500">
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
                      className={`p-2 text-center text-sm h-10 flex items-center justify-center relative transition-all duration-200 ${
                        isCurrentMonth 
                          ? isToday 
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-xl shadow-lg' 
                            : hasEvent 
                              ? 'bg-gradient-to-r from-blue-100 to-blue-200 text-blue-800 rounded-xl font-semibold cursor-pointer hover:from-blue-200 hover:to-blue-300 hover:shadow-md' 
                              : 'text-slate-700 hover:bg-slate-100 rounded-xl cursor-pointer'
                          : 'text-slate-300'
                      }`}
                    >
                      {isCurrentMonth ? day : ''}
                      {hasEvent && !isToday && (
                        <div className="absolute bottom-1 w-1.5 h-1.5 bg-blue-600 rounded-full"></div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Find My Colleague */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20">
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-6 rounded-t-3xl">
              <h3 className="text-xl font-bold flex items-center">
                <Users className="w-6 h-6 mr-3" />
                Find My Colleague
              </h3>
            </div>
            <div className="p-8">
              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search here"
                  className="w-full pl-12 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white/50 backdrop-blur-sm transition-all duration-200"
                />
              </div>
              <div className="space-y-4">
                {colleagues.map((colleague, index) => (
                  <div key={index} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 rounded-2xl border border-slate-200 hover:from-slate-100 hover:to-slate-200 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="w-12 h-12 bg-gradient-to-r from-teal-500 to-teal-600 text-white rounded-2xl flex items-center justify-center text-sm font-bold shadow-lg">
                      {colleague.avatar}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-800 text-sm">{colleague.name}</h4>
                      <p className="text-xs text-slate-600 mb-1">{colleague.role}</p>
                      <p className="text-xs text-slate-500">{colleague.email}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float { animation: float 6s ease-in-out infinite; }
      `}</style>
    </div>
  );
}