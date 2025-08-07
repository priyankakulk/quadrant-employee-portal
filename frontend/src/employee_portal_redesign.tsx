import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import for navigation
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
  LogOut,
  Home,
  Layers,
  MoreHorizontal,
  Mail,
  Phone
} from 'lucide-react';

export default function EmployeePortal() {
  const navigate = useNavigate(); // Add navigation hook
  const [currentDate, setCurrentDate] = useState(new Date());
  const [userInfo, setUserInfo] = useState({
    id: '',
    name: '',
    email: '',
    role: '',
    avatar: ''
  });
  const [showLogin, setShowLogin] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [notifications, setNotifications] = useState([]);

  // Load user information on component mount
  useEffect(() => {
    try {
      // Check if we're in a browser environment
      if (typeof window !== 'undefined' && window.localStorage) {
        const userId = localStorage.getItem('userId');
        const userName = localStorage.getItem('userName');
        const userEmail = localStorage.getItem('userEmail');
        const userRole = localStorage.getItem('userRole');

        console.log('Loading user data from localStorage:', { userId, userName, userEmail, userRole });

        if (!userId || !userName) {
          console.log('No user data found, redirecting to login');
          setShowLogin(true);
          return;
        }

        setUserInfo({
          id: userId,
          name: userName,
          email: userEmail,
          role: userRole || 'Employee',
          avatar: ''
        });
      } else {
        // For demo purposes when localStorage isn't available
        setUserInfo({
          id: '12345',
          name: 'Demo User',
          email: 'demo@company.com',
          role: 'Employee',
          avatar: ''
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      // Set demo data for development
      setUserInfo({
        id: '12345',
        name: 'Demo User', 
        email: 'demo@company.com',
        role: 'Employee',
        avatar: ''
      });
    }
  }, []);

  // Update current date every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  // Handle logout
  const handleLogout = () => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem('userId');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
      }
      
      console.log('User logged out, localStorage cleared');
      
      setShowLogin(true);
      setUserInfo({ id: '', name: '', email: '', role: '', avatar: '' });
      setActiveTab('Home');

      // Navigate to sign-in page
      navigate('/signin');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Navigation handler for quick links - Updated with React Router
  const handleQuickLinkClick = (title) => {
    const routes = {
      "Leave Application": '/leave-application',
      "Feedback": '/feedback',
      "Career Portal": '/career-portal',
      "Induction": '/induction',
      "Timesheet": '/timesheet',
      "Ticketing": '/ticketing'
    };
    
    if (routes[title]) {
      navigate(routes[title]);
    } else {
      console.log(`Route not found for ${title}`);
      alert(`${title} module is coming soon...`);
    }
  };

  // Get user initials for avatar
  const getUserInitials = (name) => {
    if (!name) return 'U';
    const names = name.split(' ');
    return names.length > 1 
      ? `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
      : names[0].substring(0, 2).toUpperCase();
  };

  // Get personalized greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const navigationItems = [
    { name: 'Home', icon: Home },
    { name: 'My Work', icon: Briefcase },
    { name: 'Teams', icon: Users },
    { name: 'More Apps', icon: MoreHorizontal }
  ];
  
  const quickLinkButtons = [
    {
      icon: <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">LA</div>,
      title: "Leave Application",
      bgColor: "bg-white",
      description: "Apply for time off"
    },
    {
      icon: <Clock className="w-6 h-6 text-orange-500" />,
      title: "Timesheet",
      bgColor: "bg-white",
      description: "Log your hours"
    },
    {
      icon: <User className="w-6 h-6 text-blue-400" />,
      title: "Induction",
      bgColor: "bg-white",
      description: "Training modules"
    },
    {
      icon: <Briefcase className="w-6 h-6 text-green-600" />,
      title: "Career Portal",
      bgColor: "bg-white",
      description: "Job opportunities"
    },
    {
      icon: <Ticket className="w-6 h-6 text-red-500" />,
      title: "Ticketing",
      bgColor: "bg-white",
      description: "IT support requests"
    },
    {
      icon: <MessageSquare className="w-6 h-6 text-blue-600" />,
      title: "Feedback",
      bgColor: "bg-white",
      description: "Share your thoughts"
    }
  ];

  const surveys = [
    {
      id: 1,
      title: "Employee Satisfaction",
      category: "General",
      daysRemaining: 15,
      description: "Help us improve workplace culture by sharing your feedback on current policies and work environment.",
      icon: "👥",
      progress: 0
    },
    {
      id: 2,
      title: "IT Infrastructure Review",
      category: "Technology", 
      daysRemaining: 8,
      description: "Evaluate our current IT systems and suggest improvements for better productivity.",
      icon: "💻",
      progress: 0
    }
  ];

  const events = [
    {
      id: 1,
      date: "15",
      month: "Dec",
      title: "Annual Company Meeting",
      time: "Mon, 15 Dec • 10:00 AM",
      location: "Main Conference Hall",
      type: "meeting"
    },
    {
      id: 2,
      date: "22", 
      month: "Dec",
      title: "Team Building Event",
      time: "Mon, 22 Dec • 2:00 PM",
      location: "Outdoor Activity Center",
      type: "event"
    }
  ];

  const holidays = [
    {
      id: 1,
      date: "25",
      month: "Dec",
      title: "Christmas Day",
      subtitle: "25 December 2024 / Wednesday"
    },
    {
      id: 2,
      date: "01",
      month: "Jan", 
      title: "New Year's Day",
      subtitle: "01 January 2025 / Wednesday"
    }
  ];

  const colleagues = [
    {
      id: 1,
      name: "Sarah Johnson",
      role: "Product Manager",
      email: "sarah.johnson@company.com",
      avatar: "SJ",
      status: "online"
    },
    {
      id: 2,
      name: "David Chen", 
      role: "Engineering Lead",
      email: "david.chen@company.com",
      avatar: "DC",
      status: "busy"
    },
    {
      id: 3,
      name: "Maria Garcia",
      role: "UI/UX Designer", 
      email: "maria.garcia@company.com",
      avatar: "MG",
      status: "away"
    }
  ];

  // Login redirect message for when not authenticated
  if (showLogin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
          <Diamond className="w-16 h-16 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">
            You need to sign in to access the employee portal.
          </p>
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-200 font-medium"
          >
            Go to Sign In
          </button>
          <p className="text-center text-sm text-gray-500 mt-4">
            Please use your company credentials to sign in.
          </p>
        </div>
      </div>
    );
  }

  // Main portal interface
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center cursor-pointer" onClick={() => navigate('/portal')}>
                <Diamond className="w-8 h-8 text-blue-600 mr-2" />
                <span className="text-xl font-bold text-gray-900">Portal</span>
              </div>
              
              <nav className="hidden md:flex space-x-8">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setActiveTab(item.name)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                        activeTab === item.name
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Search and User Menu */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              
              {/* Notifications - Simplified */}
              <div className="relative">
                <button className="p-2 text-gray-400 hover:text-gray-500 relative">
                  <Bell className="w-6 h-6" />
                  <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center">
                    2
                  </span>
                </button>
              </div>

              {/* User Menu */}
              <div className="relative flex items-center space-x-3">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{userInfo.name}</div>
                  <div className="text-xs text-gray-500">{userInfo.role}</div>
                </div>
                <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                  {getUserInitials(userInfo.name)}
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-gray-500"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {getGreeting()}, {userInfo.name.split(' ')[0]}!
          </h1>
          <p className="text-gray-600">
            {formatDate(currentDate)} • Employee ID: {userInfo.id} • Role: {userInfo.role}
          </p>
        </div>

        {/* Quick Links */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickLinkButtons.map((link, index) => (
              <button
                key={index}
                onClick={() => handleQuickLinkClick(link.title)}
                className={`${link.bgColor} p-4 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200 text-center group hover:scale-105 transform`}
              >
                <div className="flex justify-center mb-2">
                  {link.icon}
                </div>
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {link.title}
                </div>
                <div className="text-xs text-gray-500">
                  {link.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pending Surveys */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pending Surveys</h3>
              <div className="space-y-4">
                {surveys.map((survey) => (
                  <div key={survey.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{survey.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{survey.title}</h4>
                          <span className="inline-block px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                            {survey.category}
                          </span>
                        </div>
                      </div>
                      <span className="text-sm text-red-600 font-medium">
                        {survey.daysRemaining} days left
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{survey.description}</p>
                    <button 
                      onClick={() => handleQuickLinkClick(`Survey: ${survey.title}`)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors"
                    >
                      Take Survey →
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div key={event.id} className="flex items-start space-x-4 p-3 hover:bg-gray-50 rounded-lg transition-colors">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{event.date}</div>
                      <div className="text-xs text-gray-500 uppercase">{event.month}</div>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{event.title}</h4>
                      <div className="flex items-center text-sm text-gray-600 mt-1">
                        <Calendar className="w-4 h-4 mr-1" />
                        {event.time}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-1" />
                        {event.location}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Holidays */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Holidays</h3>
              <div className="space-y-3">
                {holidays.map((holiday) => (
                  <div key={holiday.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">{holiday.date}</div>
                      <div className="text-xs text-gray-500 uppercase">{holiday.month}</div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{holiday.title}</h4>
                      <p className="text-xs text-gray-600">{holiday.subtitle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Team Directory */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Directory</h3>
              <div className="space-y-3">
                {colleagues.map((colleague) => (
                  <div key={colleague.id} className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded transition-colors">
                    <div className="relative">
                      <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                        {colleague.avatar}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        colleague.status === 'online' ? 'bg-green-400' :
                        colleague.status === 'busy' ? 'bg-red-400' : 'bg-yellow-400'
                      }`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{colleague.name}</p>
                      <p className="text-xs text-gray-600 truncate">{colleague.role}</p>
                    </div>
                    <div className="flex space-x-1">
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Mail className="w-3 h-3" />
                      </button>
                      <button className="p-1 text-gray-400 hover:text-gray-600 transition-colors">
                        <Phone className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}