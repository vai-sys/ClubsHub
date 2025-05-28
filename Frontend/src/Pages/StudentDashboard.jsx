// import React, { useState, useEffect } from 'react';
// import { 
//   Bell, 
//   Calendar, 
//   Trophy, 
//   Users, 
//   Mail, 
//   FileText, 
//   Settings, 
//   BarChart3,
//   Clock,
//   MapPin,
//   Tag,
//   User,
//   CheckCircle,
//   XCircle,
//   Eye,
//   Edit,
//   Trash2,
//   Download,
//   Upload,
//   Star,
//   Loader2,
//   Plus,
//   Filter,
//   Search,
//   ChevronRight,
//   ExternalLink,
//   Award,
//   CalendarDays
// } from 'lucide-react';

// import api from '../api'


// const StudentDashboard = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [token, setToken] = useState(localStorage.getItem('token'));
  
//   // Data states
//   const [announcements, setAnnouncements] = useState([]);
//   const [events, setEvents] = useState([]);
//   const [userClubs, setUserClubs] = useState([]);
//   const [joinRequests, setJoinRequests] = useState([]);
//   const [clubDetails,setClubDetail]=useState('');


//   // Loading states
//   const [loadingStates, setLoadingStates] = useState({
//     announcements: false,
//     events: false,
//     clubs: false,
//     joinRequests: false
//   });

//   // Fetch user profile using the real API
//   const fetchUserProfile = async () => {
//     try {
//       if (!token) {
//         throw new Error('No authentication token found');
//       }
//       const userData = await api.get('/auth/profile');
      
//       setUser(userData.data.user);
//     } catch (error) {
//       console.error('Failed to fetch user profile:', error);
//       setError('Failed to fetch user profile. Please log in again.');
//       // Clear invalid token
//       localStorage.removeItem('token');
//       setToken(null);
//     }
//   };

//   // Fetch announcements using the real API
//   const fetchAnnouncements = async () => {
//     setLoadingStates(prev => ({ ...prev, announcements: true }));
//     try {
//       const response = await api.get('/announcement');
//       // // Sort by creation date and take the latest 5
//       const data=response.data.announcements;
//       const sortedAnnouncements = data.sort((a, b) => 
//         new Date(b.createdAt) - new Date(a.createdAt)
//       );
//       console.log("announcemnt",sortedAnnouncements);
//       const clubId=
//       setAnnouncements(sortedAnnouncements.slice(0, 5));
//     } catch (error) {
//       console.error('Failed to fetch announcements:', error);
//       setAnnouncements([]);
//     } finally {
//       setLoadingStates(prev => ({ ...prev, announcements: false }));
//     }
//   };

//   // Fetch approved events using the real API
//   const fetchEvents = async () => {
//     setLoadingStates(prev => ({ ...prev, events: true }));
//     try {
//       const data = await api.get('/events/approved', token);
//       const today = new Date();
//       // Filter events that are still open for registration
//       const upcomingEvents = data.filter(event => 
//         new Date(event.registrationDeadline) >= today
//       );
//       // Sort by event date and take the next 6
//       const sortedEvents = upcomingEvents.sort((a, b) => 
//         new Date(a.eventDate) - new Date(b.eventDate)
//       );
//       setEvents(sortedEvents.slice(0, 6));
//     } catch (error) {
//       console.error('Failed to fetch events:', error);
//       setEvents([]);
//     } finally {
//       setLoadingStates(prev => ({ ...prev, events: false }));
//     }
//   };

//   // Fetch user's clubs using the real API
//   const fetchUserClubs = async () => {
//     if (!user?.id) return;
    
//     setLoadingStates(prev => ({ ...prev, clubs: true }));
//     try {
//       const data = await api.get(`/clubs/${user.id}/clubs-with-admin-status`, token);
//       setUserClubs(data);
//     } catch (error) {
//       console.error('Failed to fetch user clubs:', error);
//       setUserClubs([]);
//     } finally {
//       setLoadingStates(prev => ({ ...prev, clubs: false }));
//     }
//   };

//   // Fetch join requests for user using the real API
//   const fetchJoinRequests = async () => {
//     setLoadingStates(prev => ({ ...prev, joinRequests: true }));
//     try {
//       const data = await api.get('/clubs/join-requests', token);
//       setJoinRequests(data);
//     } catch (error) {
//       console.error('Failed to fetch join requests:', error);
//       setJoinRequests([]);
//     } finally {
//       setLoadingStates(prev => ({ ...prev, joinRequests: false }));
//     }
//   };

//   // Event registration handler using the real API
//   const handleEventRegistration = async (eventId) => {
//     try {
//       await api.post(`/events/${eventId}/register`, {}, token);
//       alert('Successfully registered for the event!');
//       // Refresh events to update registration status
//       fetchEvents();
//     } catch (error) {
//       console.error('Failed to register for event:', error);
//       alert('Failed to register for event. Please try again.');
//     }
//   };

//   // Initial data fetch
//   useEffect(() => {
//     const initializeDashboard = async () => {
//       setLoading(true);
//       try {
//         if (!token) {
//           setError('Please log in to access the dashboard');
//           return;
//         }
//         await fetchUserProfile();
//       } catch (error) {
//         setError('Failed to initialize dashboard');
//       } finally {
//         setLoading(false);
//       }
//     };

//     initializeDashboard();
//   }, [token]);

//   // Fetch data when user is loaded
//   useEffect(() => {
//     if (user && token) {
//       fetchAnnouncements();
//       fetchEvents();
//       fetchUserClubs();
//       fetchJoinRequests();
//     }
//   }, [user, token]);

//   const getRoleColor = (role) => {
//     const colors = {
//       'member': 'bg-gradient-to-r from-blue-500 to-blue-600 text-white',
//       'clubAdmin': 'bg-gradient-to-r from-purple-500 to-purple-600 text-white',
//       'facultyCoordinator': 'bg-gradient-to-r from-green-500 to-green-600 text-white',
//       'superAdmin': 'bg-gradient-to-r from-red-500 to-red-600 text-white'
//     };
//     return colors[role] || 'bg-gradient-to-r from-gray-500 to-gray-600 text-white';
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
//       'approved': 'bg-green-100 text-green-800 border-green-200',
//       'rejected': 'bg-red-100 text-red-800 border-red-200',
//       'CONFIRMED': 'bg-green-100 text-green-800 border-green-200',
//       'PENDING': 'bg-yellow-100 text-yellow-800 border-yellow-200'
//     };
//     return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
//   };

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric'
//     });
//   };

//   const formatDateTime = (dateString) => {
//     return new Date(dateString).toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   // Handle login redirect
//   const handleLogin = () => {
//     // Redirect to login page or show login modal
//     window.location.href = '/login';
//   };

//   if (!token) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <User className="h-16 w-16 text-blue-600 mx-auto mb-4" />
//           <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
//           <p className="text-gray-600 mb-6">Please log in to access your dashboard</p>
//           <button 
//             onClick={handleLogin}
//             className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//           >
//             Go to Login
//           </button>
//         </div>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-12 w-12 text-blue-600 animate-spin mx-auto mb-4" />
//           <p className="text-gray-600 text-lg">Loading your dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
//         <div className="text-center">
//           <XCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
//           <p className="text-red-600 text-lg mb-4">{error}</p>
//           <div className="space-x-4">
//             <button 
//               onClick={() => window.location.reload()} 
//               className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Retry
//             </button>
//             <button 
//               onClick={handleLogin}
//               className="px-6 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
//             >
//               Login Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
//       {/* Header */}
//       <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-50">
//         <div className="max-w-7xl mx-auto px-6 py-4">
//           <div className="flex items-center justify-between">
//             <div>
//               <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
//                 Student Dashboard
//               </h1>
//               <p className="text-gray-600 mt-1">Welcome back, {user?.name}!</p>
//             </div>
//             <div className="flex items-center space-x-4">
//               <span className={`px-4 py-2 rounded-full text-sm font-medium ${getRoleColor(user?.role)} shadow-lg`}>
//                 {user?.role === 'member' ? 'Student' : 
//                  user?.role === 'clubAdmin' ? 'Club Admin' :
//                  user?.role === 'facultyCoordinator' ? 'Faculty Coordinator' :
//                  user?.role === 'superAdmin' ? 'Super Admin' : user?.role}
//               </span>
//               <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
//                 <User className="h-5 w-5 text-white" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//      <div className="max-w-7xl mx-auto px-6 py-8">
//         <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
//           {/* Main Content - Left Column */}
//           <div className="xl:col-span-3 space-y-8">
//             {/* Recent Announcements */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
//                     <Bell className="h-6 w-6 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-900 ml-4">Recent Announcements</h2>
//                 </div>
//                 <button className="text-blue-600 hover:text-blue-700 flex items-center text-sm font-medium">
//                   View All <ChevronRight className="h-4 w-4 ml-1" />
//                 </button>
//               </div>
              
//               {loadingStates.announcements ? (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
//                 </div>
//               ) : announcements.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500">
//                   <Bell className="h-12 w-12 mx-auto mb-4 opacity-30" />
//                   <p>No announcements available</p>
//                 </div>
//               ) : (
//                 <div className="space-y-4">
//                   {announcements.map((announcement) => (
//                     <div key={announcement.id} className="group p-6 bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-blue-100 hover:shadow-lg transition-all duration-300">
//                       <div className="flex items-start justify-between">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">
//                             {announcement.title}
//                           </h3>
//                           <p className="text-gray-600 mt-2 leading-relaxed">{announcement.description}</p>
                          
//                           <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
//                             <div className="flex items-center">
//                               <Users className="h-4 w-4 mr-1" />
//                               {announcement.club?.clubName || announcement.clubName || 'General'}
//                             </div>
//                             <div className="flex items-center">
//                               <Clock className="h-4 w-4 mr-1" />
//                               {formatDate(announcement.createdAt)}
//                             </div>
//                           </div>

//                           {announcement.attachments?.length > 0 && (
//                             <div className="mt-3 flex flex-wrap gap-2">
//                               {announcement.attachments.map((file, idx) => (
//                                 <span key={idx} className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium hover:bg-blue-200 cursor-pointer transition-colors">
//                                   <Download className="h-3 w-3 mr-1" />
//                                   {file}
//                                 </span>
//                               ))}
//                             </div>
//                           )}
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Upcoming Events */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
//               <div className="flex items-center justify-between mb-6">
//                 <div className="flex items-center">
//                   <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
//                     <Calendar className="h-6 w-6 text-white" />
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-900 ml-4">Upcoming Events</h2>
//                 </div>
//                 <button className="text-green-600 hover:text-green-700 flex items-center text-sm font-medium">
//                   View All <ChevronRight className="h-4 w-4 ml-1" />
//                 </button>
//               </div>

//               {loadingStates.events ? (
//                 <div className="flex items-center justify-center py-12">
//                   <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
//                 </div>
//               ) : events.length === 0 ? (
//                 <div className="text-center py-12 text-gray-500">
//                   <Calendar className="h-12 w-12 mx-auto mb-4 opacity-30" />
//                   <p>No upcoming events available for registration</p>
//                 </div>
//               ) : (
//                 <div className="grid md:grid-cols-2 gap-6">
//                   {events.map((event) => (
//                     <div key={event.id} className="group bg-gradient-to-br from-white to-green-50/50 rounded-xl border border-green-100 p-6 hover:shadow-lg transition-all duration-300">
//                       <div className="flex items-start justify-between mb-4">
//                         <div className="flex-1">
//                           <h3 className="font-semibold text-gray-900 text-lg group-hover:text-green-700 transition-colors">
//                             {event.eventName || event.name}
//                           </h3>
//                           <div className="flex items-center space-x-2 mt-2">
//                             <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
//                               {event.eventType || event.type}
//                             </span>
//                             {event.category && (
//                               <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
//                                 {event.category}
//                               </span>
//                             )}
//                           </div>
//                         </div>
//                       </div>

//                       <div className="space-y-2 text-sm text-gray-600 mb-4">
//                         <div className="flex items-center">
//                           <CalendarDays className="h-4 w-4 mr-2 text-green-600" />
//                           {formatDateTime(event.eventDate || event.date)}
//                         </div>
//                         <div className="flex items-center">
//                           <MapPin className="h-4 w-4 mr-2 text-green-600" />
//                           {event.venue}
//                         </div>
//                         <div className="flex items-center">
//                           <Users className="h-4 w-4 mr-2 text-green-600" />
//                           {event.club?.clubName || event.clubName}
//                         </div>
//                         <div className="flex items-center">
//                           <Clock className="h-4 w-4 mr-2 text-green-600" />
//                           Registration deadline: {formatDate(event.registrationDeadline)}
//                         </div>
//                       </div>

//                       <div className="flex items-center justify-between">
//                         <div className="text-xs text-gray-500">
//                           {event.maxParticipants && (
//                             <span>Max: {event.maxParticipants} participants</span>
//                           )}
//                         </div>
//                         <button 
//                           onClick={() => handleEventRegistration(event.id)}
//                           className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 text-sm font-medium shadow-md"
//                         >
//                           Register
//                         </button>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Sidebar - Right Column */}
//           <div className="space-y-6">
//             {/* Your Club Memberships */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
//               <div className="flex items-center mb-6">
//                 <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg shadow-lg">
//                   <Users className="h-5 w-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 ml-3">Your Clubs</h2>
//               </div>

//               {loadingStates.clubs ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
//                 </div>
//               ) : userClubs.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <Users className="h-8 w-8 mx-auto mb-3 opacity-30" />
//                   <p className="text-sm">No clubs joined yet</p>
//                   <button className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium">
//                     Explore Clubs
//                   </button>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {userClubs.map((club) => (
//                     <div key={club.id} className="flex items-center space-x-3 p-4 bg-gradient-to-r from-white to-indigo-50/50 rounded-xl border border-indigo-100 hover:shadow-md transition-all duration-200">
//                       <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl flex items-center justify-center">
//                         <Users className="h-6 w-6 text-white" />
//                       </div>
//                       <div className="flex-1">
//                         <h3 className="font-medium text-gray-900">{club.clubName || club.name}</h3>
//                         <div className="flex items-center space-x-2 mt-1">
//                           <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                             club.isAdmin ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
//                           }`}>
//                             {club.isAdmin ? 'Admin' : 'Member'}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Join Requests Status */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
//               <div className="flex items-center mb-6">
//                 <div className="p-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg shadow-lg">
//                   <Mail className="h-5 w-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 ml-3">Join Requests</h2>
//               </div>

//               {loadingStates.joinRequests ? (
//                 <div className="flex items-center justify-center py-8">
//                   <Loader2 className="h-6 w-6 text-orange-600 animate-spin" />
//                 </div>
//               ) : joinRequests.length === 0 ? (
//                 <div className="text-center py-8 text-gray-500">
//                   <Mail className="h-8 w-8 mx-auto mb-3 opacity-30" />
//                   <p className="text-sm">No pending requests</p>
//                 </div>
//               ) : (
//                 <div className="space-y-3">
//                   {joinRequests.map((request) => (
//                     <div key={request.id} className="p-4 bg-gradient-to-r from-white to-orange-50/50 rounded-xl border border-orange-100">
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <h3 className="font-medium text-gray-900">{request.club?.clubName || request.clubName}</h3>
//                           <p className="text-sm text-gray-600">
//                             {formatDate(request.requestDate || request.createdAt)}
//                           </p>
//                         </div>
//                         <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
//                           {request.status}
//                         </span>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             {/* Quick Actions */}
//             <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
//               <div className="flex items-center mb-6">
//                 <div className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-lg">
//                   <Star className="h-5 w-5 text-white" />
//                 </div>
//                 <h2 className="text-xl font-bold text-gray-900 ml-3">Quick Actions</h2>
//               </div>

//               <div className="space-y-3">
//                 <button className="w-full p-4 text-left bg-gradient-to-r from-white to-blue-50/50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 group">
//                   <div className="flex items-center">
//                     <Search className="h-5 w-5 text-blue-600 mr-3" />
//                     <span className="font-medium text-gray-900">Explore Events</span>
//                   </div>
//                 </button>
                
//                 <button className="w-full p-4 text-left bg-gradient-to-r from-white to-green-50/50 rounded-xl border border-green-100 hover:shadow-md transition-all duration-200 group">
//                   <div className="flex items-center">
//                     <Users className="h-5 w-5 text-green-600 mr-3" />
//                     <span className="font-medium text-gray-900">Browse Clubs</span>
//                   </div>
//                 </button>
                
//                 <button className="w-full p-4 text-left bg-gradient-to-r from-white to-purple-50/50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200 group">
//                   <div className="flex items-center">
//                     <Trophy className="h-5 w-5 text-purple-600 mr-3" />
//                     <span className="font-medium text-gray-900">View Competitions</span>
//                   </div>
//                 </button>
                
//                 <button className="w-full p-4 text-left bg-gradient-to-r from-white to-orange-50/50 rounded-xl border border-orange-100 hover:shadow-md transition-all duration-200 group">
//                   <div className="flex items-center">
//                     <Settings className="h-5 w-5 text-orange-600 mr-3" />
//                     <span className="font-medium text-gray-900">Update Profile</span>
//                   </div>
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;




import React from 'react'

const StudentDashboard = () => {
  return (
    <div>
      dashboard
    </div>
  )
}

export default StudentDashboard
