


import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Calendar, 
  AlertCircle, 
  Loader2, 
  MapPin, 
  Clock, 
  User, 
  Award,
  Activity,
  ExternalLink,
  Star,
  ChevronRight,
  UserPlus,
  CheckCircle,
  XCircle,
  Clock as PendingClock,
  TrendingUp,
  BarChart3,
  Target,
  Zap,
  Crown,
  Shield,
  Users2,
  CalendarDays,
  Timer,
  BookOpen,
  Trophy,
  ArrowRight,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  SortAsc,
  RefreshCw,
  Download,
  Bell,
  Settings,
  ChevronDown,
  Plus,
  Grid3X3,
  List,
  X,
  Home,
  Briefcase
} from 'lucide-react';
import api from '../api';

const ActivityDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
 
  

  const [userId, setUserId] = useState(null);
  const [userData, setUserData] = useState(null);
  const [events, setEvents] = useState([]);
  const [clubs, setClubs] = useState([]);
  const [joinRequests, setJoinRequests] = useState([]);
  

  const [profileLoading, setProfileLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [clubsLoading, setClubsLoading] = useState(true);
  const [joinRequestsLoading, setJoinRequestsLoading] = useState(true);
  

  const [eventsError, setEventsError] = useState(null);
  const [clubsError, setClubsError] = useState(null);
  const [joinRequestsError, setJoinRequestsError] = useState(null);

 
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setProfileLoading(true);
        const response = await api.get('auth/profile');
        if (response.data && response.data.user && response.data.user._id) {
          setUserId(response.data.user._id);
          setUserData(response.data.user);
          console.log('User ID fetched:', response.data.user._id);
        }
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setEventsError('Failed to load user profile. Please try again.');
        setClubsError('Failed to load user profile. Please try again.');
        setJoinRequestsError('Failed to load user profile. Please try again.');
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, []);


  useEffect(() => {
    if (!userId) return;

    const fetchParticipatedEvents = async () => {
      try {
        setEventsLoading(true);
        setEventsError(null);
        
        console.log('Fetching events for user:', userId);
        const res = await api.get(`/event/user-events/${userId}`);
        
        if (res.data && res.data.events) {
          setEvents(res.data.events);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setEventsError('Failed to load events. Please try again.');
        setEvents([]);
      } finally {
        setEventsLoading(false);
      }
    };

    fetchParticipatedEvents();
  }, [userId]);

 
  useEffect(() => {
    if (!userId) return;

    const fetchUserClubs = async () => {
      try {
        setClubsLoading(true);
        setClubsError(null);

        const response = await api.get(`club/user-club/${userId}`);
        console.log("club affiliation", response.data.data);
        setClubs(Array.isArray(response.data.data) ? response.data.data : []);
      } catch (err) {
        console.error('Error fetching user clubs:', err);
        setClubsError('Failed to load club affiliations. Please try again.');
        setClubs([]);
      } finally {
        setClubsLoading(false);
      }
    };

    fetchUserClubs();
  }, [userId]);

 
  useEffect(() => {
    if (!userId) return;

    const fetchJoinRequests = async () => {
      try {
        setJoinRequestsLoading(true);
        setJoinRequestsError(null);

        const response = await api.get('/club/join-requests');
        console.log("join requests", response.data);
        
        if (response.data && response.data.success && response.data.data) {
          setJoinRequests(Array.isArray(response.data.data) ? response.data.data : []);
        } else {
          setJoinRequests([]);
        }
      } catch (err) {
        console.error('Error fetching join requests:', err);
        setJoinRequestsError('Failed to load join requests. Please try again.');
        setJoinRequests([]);
      } finally {
        setJoinRequestsLoading(false);
      }
    };

    fetchJoinRequests();
  }, [userId]);

  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    const cleanPath = logoPath.replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

  const getEventTypeColor = (type) => {
    const colors = {
      'workshop': 'bg-blue-100 text-blue-800 border-blue-200',
      'seminar': 'bg-green-100 text-green-800 border-green-200',
      'conference': 'bg-purple-100 text-purple-800 border-purple-200',
      'meetup': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'competition': 'bg-red-100 text-red-800 border-red-200',
      'social': 'bg-pink-100 text-pink-800 border-pink-200',
      'default': 'bg-gray-100 text-gray-800 border-gray-200'
    };
    return colors[type?.toLowerCase()] || colors.default;
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'active': 'bg-green-100 text-green-800 border-green-200',
      'inactive': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getRoleColor = (role) => {
    const colors = {
      'member': 'bg-blue-100 text-blue-800 border-blue-200',
      'clubAdmin': 'bg-purple-100 text-purple-800 border-purple-200',
      'admin': 'bg-purple-100 text-purple-800 border-purple-200',
      'superAdmin': 'bg-red-100 text-red-800 border-red-200',
      'facultyCoordinater': 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <PendingClock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };


  const stats = {
    totalEvents: events.length,
    totalClubs: clubs.length,
    pendingRequests: joinRequests.filter(req => req.status === 'pending').length,
    approvedRequests: joinRequests.filter(req => req.status === 'approved').length,
    upcomingEvents: events.filter(event => new Date(event.date) > new Date()).length,
    completedEvents: events.filter(event => new Date(event.date) <= new Date()).length
  };


  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 h-16 w-16 rounded-full border-4 border-blue-200 animate-pulse"></div>
                <Loader2 className="h-16 w-16 animate-spin text-blue-600" />
              </div>
              <span className="ml-6 text-xl text-gray-700 font-semibold">Loading your activity dashboard...</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (!userId || !userData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-12">
            <div className="text-center">
              <div className="flex items-center justify-center text-red-600 mb-6">
                <AlertCircle className="h-12 w-12 mr-4" />
                <span className="text-2xl font-semibold">Unable to load user profile</span>
              </div>
              <p className="text-gray-600 text-lg mb-8">Please try refreshing the page to continue.</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                <RefreshCw className="h-5 w-5 mr-2 inline" />
                Refresh Page
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderOverview = () => (
    <div className="space-y-8">
      
      
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
       
        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <Calendar className="h-6 w-6 mr-3 text-blue-600" />
              Recent Events
            </h3>
            <button 
              onClick={() => setActiveTab('events')}
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {eventsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
              </div>
            ) : events.slice(0, 3).map((event) => {
              const { date, time } = formatDateTime(event.date);
              const isUpcoming = new Date(event.date) > new Date();
              
              return (
                <div key={event._id} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                    <Calendar className="h-6 w-6 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">{event.name}</h4>
                    <p className="text-sm text-gray-600">{event.clubId?.name}</p>
                    <p className="text-xs text-gray-500">{date} • {time}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                    isUpcoming ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {isUpcoming ? 'Upcoming' : 'Completed'}
                  </span>
                </div>
              );
            })}
            
            {events.length === 0 && !eventsLoading && (
              <div className="text-center py-8 text-gray-500">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No events found</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center">
              <UserPlus className="h-6 w-6 mr-3 text-green-600" />
              Recent Requests
            </h3>
            <button 
              onClick={() => setActiveTab('requests')}
              className="text-green-600 hover:text-green-700 font-medium flex items-center"
            >
              View all <ArrowRight className="h-4 w-4 ml-1" />
            </button>
          </div>
          
          <div className="space-y-4">
            {joinRequestsLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-green-600" />
              </div>
            ) : joinRequests.slice(0, 3).map((request) => (
              <div key={request._id} className="flex items-center space-x-4 p-4 bg-gray-50/50 rounded-xl hover:bg-gray-100/50 transition-colors">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                  {getStatusIcon(request.status)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 truncate">
                    {request.clubId?.name || 'Unknown Club'}
                  </h4>
                  <p className="text-sm text-gray-600">{formatDate(request.requestedAt)}</p>
                </div>
                <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor(request.status)}`}>
                  {request.status}
                </span>
              </div>
            ))}
            
            {joinRequests.length === 0 && !joinRequestsLoading && (
              <div className="text-center py-8 text-gray-500">
                <UserPlus className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No requests found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderEvents = () => {
    if (eventsLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
            <span className="text-gray-600 font-medium text-lg">Loading your events...</span>
          </div>
        </div>
      );
    }

    if (eventsError) {
      return (
        <div className="text-center py-16">
          <div className="flex items-center justify-center text-red-600 mb-6">
            <AlertCircle className="h-10 w-10 mr-3" />
            <span className="text-xl font-medium">{eventsError}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
          >
            <RefreshCw className="h-5 w-5 mr-2 inline" />
            Retry
          </button>
        </div>
      );
    }

    if (events.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
            <Calendar className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Yet</h3>
          <p className="text-gray-500 text-lg mb-8">You haven't registered for any events yet. Start exploring amazing events!</p>
          <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Plus className="h-5 w-5 mr-2 inline" />
            Explore Events
          </button>
        </div>
      );
    }

    return (
      <div className= 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' >
        {events.map((event) => {
          const { date, time } = formatDateTime(event.date);
          const isUpcoming = new Date(event.date) > new Date();
          const clubLogo = event.clubId?.clubLogo;
          
          return (
            <div
              key={event._id}
              className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-300 group transform hover:-translate-y-1"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start space-x-4 flex-1">
                  {clubLogo ? (
                    <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-md">
                      <img
                        src={getLogoUrl(clubLogo)}
                        alt={`${event.clubId?.name} logo`}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" style={{display: 'none'}}>
                        <User className="h-7 w-7 text-white" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                      <User className="h-7 w-7 text-white" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {event.clubId?.name || 'Unknown Club'}
                    </p>
                  </div>
                </div>
                <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${getEventTypeColor(event.eventType)} flex-shrink-0 shadow-sm`}>
                  {event.eventType}
                </span>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{date} at {time}</span>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MapPin className="h-4 w-4 text-green-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    {event.mode} • {event.venue}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                  <span className="text-sm font-bold text-green-700">Registered</span>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-sm px-4 py-2 rounded-full font-bold border-2 ${
                    isUpcoming 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-gray-50 text-gray-600 border-gray-200'
                  }`}>
                    {isUpcoming ? 'Upcoming' : 'Completed'}
                  </span>
                  <button className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors group-hover:bg-blue-100">
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };



  const renderClubs = () => {
  if (clubsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <span className="text-gray-600 font-medium text-lg">Loading club affiliations...</span>
        </div>
      </div>
    );
  }

  if (clubsError) {
    return (
      <div className="text-center py-16">
        <div className="flex items-center justify-center text-red-600 mb-6">
          <AlertCircle className="h-10 w-10 mr-3" />
          <span className="text-xl font-medium">{clubsError}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg"
        >
          <RefreshCw className="h-5 w-5 mr-2 inline" />
          Retry
        </button>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <Users2 className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Club Memberships</h3>
        <p className="text-gray-500 text-lg mb-8">You haven't joined any clubs yet. Explore and join clubs to participate in events!</p>
        <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <Plus className="h-5 w-5 mr-2 inline" />
          Explore Clubs
        </button>
      </div>
    );
  }

  return (
    <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
      {clubs.map((club) => {
        const memberSince = formatDate(club.joinedAt);
        const isAdmin = club.role === 'clubAdmin' || club.role === 'admin' || club.role === 'superAdmin';
        
        return (
          <div
            key={club._id}
            className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-green-300 group transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                {club.clubId?.clubLogo ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-md">
                    <img
                      src={getLogoUrl(club.clubId.clubLogo)}
                      alt={`${club.clubId.name} logo`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center" style={{display: 'none'}}>
                      <Users2 className="h-7 w-7 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Users2 className="h-7 w-7 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-green-600 transition-colors">
                    {club.clubName || club.clubId?.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {club.clubId?.clubCategory || 'General Club'}
                  </p>
                </div>
              </div>
              {/* Role badge */}
              {club.role && (
                <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${getRoleColor(club.role)} flex-shrink-0 shadow-sm`}>
                  {club.role === 'clubAdmin' ? 'Admin' : 
                   club.role === 'superAdmin' ? 'Super Admin' : 
                   club.role === 'facultyCoordinater' ? 'Faculty' : 'Member'}
                </span>
              )}
            </div>

            {/* Club description */}
            {club.clubId?.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600 line-clamp-2">
                  {club.clubId.description}
                </p>
              </div>
            )}

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Member since {memberSince}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  Status: {club.clubId?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full shadow-sm ${
                  club.clubId?.isActive ? 'bg-green-500' : 'bg-gray-400'
                }`}></div>
                <span className={`text-sm font-bold ${
                  club.clubId?.isActive ? 'text-green-700' : 'text-gray-600'
                }`}>
                  {club.clubId?.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <span className="text-sm px-4 py-2 rounded-full font-bold bg-purple-50 text-purple-700 border-2 border-purple-200">
                    Admin Privileges
                  </span>
                )}
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-green-100 transition-colors group-hover:bg-green-100">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

  const renderRequests = () => {
    if (joinRequestsLoading) {
      return (
        <div className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto mb-4" />
            <span className="text-gray-600 font-medium text-lg">Loading join requests...</span>
          </div>
        </div>
      );
    }

    if (joinRequestsError) {
      return (
        <div className="text-center py-16">
          <div className="flex items-center justify-center text-red-600 mb-6">
            <AlertCircle className="h-10 w-10 mr-3" />
            <span className="text-xl font-medium">{joinRequestsError}</span>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="px-8 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium shadow-lg"
          >
            <RefreshCw className="h-5 w-5 mr-2 inline" />
            Retry
          </button>
        </div>
      );
    }

    if (joinRequests.length === 0) {
      return (
        <div className="text-center py-16">
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
            <UserPlus className="h-16 w-16 text-gray-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">No Join Requests</h3>
          <p className="text-gray-500 text-lg mb-8">You haven't made any club join requests yet.</p>
          <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Plus className="h-5 w-5 mr-2 inline" />
            Join a Club
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {joinRequests.map((request) => (
          <div
            key={request._id}
            className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                {request.clubId?.clubLogo ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-md">
                    <img
                      src={getLogoUrl(request.clubId.clubLogo)}
                      alt={`${request.clubId.name} logo`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center" style={{display: 'none'}}>
                      <Users2 className="h-7 w-7 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Users2 className="h-7 w-7 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                    {request.clubId?.name || 'Unknown Club'}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    Requested on {formatDate(request.requestedAt)}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${getStatusColor(request.status)} flex-shrink-0 shadow-sm`}>
                {request.status}
              </span>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  {getStatusIcon(request.status)}
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    {request.status === 'pending' 
                      ? 'Waiting for approval' 
                      : request.status === 'approved' 
                        ? 'Request approved' 
                        : 'Request declined'}
                  </span>
                </div>
                
                {/* {request.status === 'approved' && (
                  <span className="text-sm px-3 py-1 rounded-full font-medium bg-green-50 text-green-700 border border-green-200">
                    Member since {formatDate(request.respondedAt)}
                  </span>
                )} */}
              </div>
              
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-yellow-100 transition-colors">
                <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
      
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Activity Dashboard</h1>
            <p className="text-gray-600">
              {activeTab === 'overview' && 'Your activity summary and recent updates'}
              {activeTab === 'events' && 'All events you have participated in'}
              {activeTab === 'clubs' && 'Your club memberships and affiliations'}
              {activeTab === 'requests' && 'Your club join requests and status'}
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            
          </div>
        </div>
      
        <div className="flex items-center space-x-2 mb-8 overflow-x-auto pb-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              activeTab === 'overview'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <BarChart3 className="h-5 w-5" />
            <span>Overview</span>
          </button>
          
          <button
            onClick={() => setActiveTab('events')}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              activeTab === 'events'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Calendar className="h-5 w-5" />
            <span>Events</span>
            {stats.totalEvents > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                {stats.totalEvents}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('clubs')}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              activeTab === 'clubs'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <Users2 className="h-5 w-5" />
            <span>Clubs</span>
            {stats.totalClubs > 0 && (
              <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">
                {stats.totalClubs}
              </span>
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-6 py-3 rounded-xl font-medium flex items-center space-x-2 transition-colors ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            <UserPlus className="h-5 w-5" />
            <span>Requests</span>
            {stats.pendingRequests > 0 && (
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded-full">
                {stats.pendingRequests}
              </span>
            )}
          </button>
        </div>
        
       
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-white/20 p-8">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'events' && renderEvents()}
          {activeTab === 'clubs' && renderClubs()}
          {activeTab === 'requests' && renderRequests()}
        </div>
      </div>
    </div>
  );
};

export default ActivityDashboard;