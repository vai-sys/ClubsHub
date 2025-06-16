


// import React, { useState, useEffect } from 'react';
// import { AlertCircle, Check, Loader, User, Users, Calendar, X } from 'lucide-react';
// import api from '../api';
// import UserList from './UserList';

// const Card = ({ className = '', children }) => (
//   <div className={`bg-white rounded-lg shadow-sm ${className}`}>
//     {children}
//   </div>
// );

// const SuperAdminDashboard = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);
//   const [remarks, setRemarks] = useState('');
//   const [processingAction, setProcessingAction] = useState(false);
//   const [activeTab, setActiveTab] = useState('events'); // New state for tab management

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const isValidEvent = (event) => {
//     const eventDate = new Date(event.date);
//     const currentDate = new Date();
    
//     if (isNaN(eventDate.getTime())) {
//       return false;
//     }
    
//     const eventDateOnly = new Date(eventDate.setHours(0, 0, 0, 0));
//     const currentDateOnly = new Date(currentDate.setHours(0, 0, 0, 0));
    
//     return eventDateOnly >= currentDateOnly;
//   };

//   const fetchEvents = async () => {
//     try {
//       const response = await api.get('/event/faculty-approved');
//       console.log("Raw events:", response.data.data);
      
//       const validEvents = response.data.data.filter(isValidEvent);
//       setEvents(validEvents);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch events');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprovalAction = async (eventId, isApproved) => {
//     try {
//       setProcessingAction(true);
      
//       await api.put(`/event/${eventId}/super-admin-approval`, { 
//         approved: isApproved === 'approved', 
//         remark: remarks 
//       });
      
//       setEvents(events.filter(event => event._id !== eventId));
//       setSelectedEvent(null);
//       setRemarks('');
//     } catch (err) {
//       console.error('Error updating event status:', err);
//       setError('Failed to update event status. Please try again.');
//     } finally {
//       setProcessingAction(false);
//     }
//   };

//   const formatEventDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   };

//   const getEventTypeDisplay = (type) => {
//     const typeMap = {
//       'WORKSHOP': 'Workshop',
//       'SEMINAR': 'Seminar',
//       'COMPETITION': 'Competition',
//       'MEETUP': 'Meetup',
//       'CULTURAL': 'Cultural Event',
//       'TECHNICAL': 'Technical Event',
//       'OTHER': 'Other Event'
//     };
//     return typeMap[type] || type;
//   };

//   if (loading && activeTab === 'events') {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader className="w-8 h-8 animate-spin text-blue-500" />
//         <p className="ml-2 text-gray-600">Loading events...</p>
//       </div>
//     );
//   }

//   if (error && activeTab === 'events') {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <div className="bg-red-50 p-4 rounded-lg flex items-center">
//           <AlertCircle className="w-6 h-6 text-red-500" />
//           <p className="ml-2 text-red-700">{error}</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="max-w-7xl mx-auto px-4 py-8">
//       {/* Header */}
//       <Card className="p-6 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
//             <p className="text-gray-600 mt-2">Manage events and users across the platform</p>
//           </div>
//           <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//             Super Admin Panel
//           </div>
//         </div>
//       </Card>

     
//       <Card className="p-0 mb-6">
//         <div className="border-b border-gray-200">
//           <nav className="flex">
//             <button
//               onClick={() => setActiveTab('events')}
//               className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === 'events'
//                   ? 'border-blue-500 text-blue-600 bg-blue-50'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <Calendar className="w-4 h-4" />
//                 <span>Event Approvals</span>
//                 {events.length > 0 && (
//                   <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
//                     {events.length}
//                   </span>
//                 )}
//               </div>
//             </button>
//             <button
//               onClick={() => setActiveTab('users')}
//               className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
//                 activeTab === 'users'
//                   ? 'border-blue-500 text-blue-600 bg-blue-50'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
//               }`}
//             >
//               <div className="flex items-center space-x-2">
//                 <Users className="w-4 h-4" />
//                 <span>User Management</span>
//               </div>
//             </button>
//           </nav>
//         </div>
//       </Card>

     
//       {activeTab === 'events' && (
//         <Card className="p-6">
//           <div className="mb-4 border-b border-gray-200 pb-4">
//             <h2 className="text-xl font-bold text-gray-900">Faculty Approved Events</h2>
//             <p className="text-gray-600 mt-1">Total events pending approval: {events.length}</p>
//           </div>
          
//           {events.length === 0 ? (
//             <div className="text-center py-8">
//               <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
//               <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
//               <p className="text-gray-600">No pending events to review</p>
//             </div>
//           ) : (
//             <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
//               {events.map((event) => (
//                 <div
//                   key={event._id}
//                   className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                 >
//                   <h3 className="font-medium text-gray-900 truncate">{event.name}</h3>
                  
//                   <div className="mt-2 space-y-2">
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Calendar className="w-4 h-4 mr-2" />
//                       {formatEventDate(event.date)}
//                     </div>
//                     <div className="flex items-center text-sm text-gray-600">
//                       <Users className="w-4 h-4 mr-2" />
//                       {event.clubId?.name || "Unknown Club"}
//                     </div>
//                     {event.eventType && (
//                       <div className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
//                         {getEventTypeDisplay(event.eventType)}
//                       </div>
//                     )}
//                   </div>
//                   <button
//                     onClick={() => setSelectedEvent(event)}
//                     className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                   >
//                     Review
//                   </button>
//                 </div>
               

//               ))}
               
//             </div>
//           )}
//         </Card>
//       )}

//       {activeTab === 'users' && (
//         <div>
//           <UserList />
//         </div>
//       )}

     
//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-900">Event Review</h2>
//               <button
//                 onClick={() => {
//                   setSelectedEvent(null);
//                   setRemarks('');
//                 }}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//                 disabled={processingAction}
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mb-4 p-4 bg-gray-50 rounded-lg">
//               <h3 className="font-medium text-gray-900">{selectedEvent.name}</h3>
//               <div className="mt-2 space-y-1">
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Club:</span> {selectedEvent.clubId?.name || "Unknown Club"}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Date:</span> {formatEventDate(selectedEvent.date)}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Type:</span> {getEventTypeDisplay(selectedEvent.eventType)}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Mode:</span> {selectedEvent.mode || "Not specified"}
//                 </p>
//                 <p className="text-gray-600 text-sm">
//                   <span className="font-medium">Duration:</span> {selectedEvent.duration} {selectedEvent.duration === 1 ? 'hour' : 'hours'}
//                 </p>
//                 {selectedEvent.venue && (
//                   <p className="text-gray-600 text-sm">
//                     <span className="font-medium">Venue:</span> {selectedEvent.venue}
//                   </p>
//                 )}
//                 {selectedEvent.description && (
//                   <div className="mt-2">
//                     <p className="font-medium text-sm text-gray-700">Description:</p>
//                     <p className="text-gray-600 text-sm mt-1">{selectedEvent.description}</p>
//                   </div>
//                 )}
//                 {selectedEvent.facultyApproval?.remark && (
//                   <div className="mt-2">
//                     <p className="font-medium text-sm text-gray-700">Faculty Remarks:</p>
//                     <p className="text-gray-600 text-sm mt-1">{selectedEvent.facultyApproval.remark}</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Remarks (Optional)
//               </label>
//               <textarea
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//                 rows="3"
//                 placeholder="Enter any remarks about your decision..."
//                 value={remarks}
//                 onChange={(e) => setRemarks(e.target.value)}
//                 disabled={processingAction}
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => handleApprovalAction(selectedEvent._id, 'rejected')}
//                 className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={processingAction}
//               >
//                 {processingAction ? (
//                   <Loader className="w-5 h-5 mr-2 animate-spin" />
//                 ) : (
//                   <X className="w-5 h-5 mr-2" />
//                 )}
//                 Reject
//               </button>
//               <button
//                 onClick={() => handleApprovalAction(selectedEvent._id, 'approved')}
//                 className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
//                 disabled={processingAction}
//               >
//                 {processingAction ? (
//                   <Loader className="w-5 h-5 mr-2 animate-spin" />
//                 ) : (
//                   <Check className="w-5 h-5 mr-2" />
//                 )}
//                 Approved
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default SuperAdminDashboard;


import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Loader, User, Users, Calendar, X, UserPlus } from 'lucide-react';
import api from '../api';
import UserList from './UserList';
import AssignRole from './AssignRole';

const Card = ({ className = '', children }) => (
  <div className={`bg-white rounded-lg shadow-sm ${className}`}>
    {children}
  </div>
);

const SuperAdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [remarks, setRemarks] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const [activeTab, setActiveTab] = useState('events'); // New state for tab management
  const [clubs, setClubs] = useState([]); // For storing clubs for role assignment
  const [selectedClubForRole, setSelectedClubForRole] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchClubs(); // Fetch clubs for role assignment
  }, []);

  const isValidEvent = (event) => {
    const eventDate = new Date(event.date);
    const currentDate = new Date();
    
    if (isNaN(eventDate.getTime())) {
      return false;
    }
    
    const eventDateOnly = new Date(eventDate.setHours(0, 0, 0, 0));
    const currentDateOnly = new Date(currentDate.setHours(0, 0, 0, 0));
    
    return eventDateOnly >= currentDateOnly;
  };

  const fetchEvents = async () => {
    try {
      const response = await api.get('/event/faculty-approved');
      console.log("Raw events:", response.data.data);
      
      const validEvents = response.data.data.filter(isValidEvent);
      setEvents(validEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchClubs = async () => {
    try {
      const response = await api.get('/clubs'); // Adjust endpoint as needed
      setClubs(response.data.data || response.data);
    } catch (err) {
      console.error('Failed to fetch clubs:', err);
    }
  };

  const handleApprovalAction = async (eventId, isApproved) => {
    try {
      setProcessingAction(true);
      
      await api.put(`/event/${eventId}/super-admin-approval`, { 
        approved: isApproved === 'approved', 
        remark: remarks 
      });
      
      setEvents(events.filter(event => event._id !== eventId));
      setSelectedEvent(null);
      setRemarks('');
    } catch (err) {
      console.error('Error updating event status:', err);
      setError('Failed to update event status. Please try again.');
    } finally {
      setProcessingAction(false);
    }
  };

  const formatEventDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getEventTypeDisplay = (type) => {
    const typeMap = {
      'WORKSHOP': 'Workshop',
      'SEMINAR': 'Seminar',
      'COMPETITION': 'Competition',
      'MEETUP': 'Meetup',
      'CULTURAL': 'Cultural Event',
      'TECHNICAL': 'Technical Event',
      'OTHER': 'Other Event'
    };
    return typeMap[type] || type;
  };

  if (loading && activeTab === 'events') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error && activeTab === 'events') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 p-4 rounded-lg flex items-center">
          <AlertCircle className="w-6 h-6 text-red-500" />
          <p className="ml-2 text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage events and users across the platform</p>
          </div>
          <div className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            Super Admin Panel
          </div>
        </div>
      </Card>

      {/* Tab Navigation */}
      <Card className="p-0 mb-6">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('events')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'events'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Event Approvals</span>
                {events.length > 0 && (
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                    {events.length}
                  </span>
                )}
              </div>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'users'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="w-4 h-4" />
                <span>User Management</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                activeTab === 'roles'
                  ? 'border-blue-500 text-blue-600 bg-blue-50'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-2">
                <UserPlus className="w-4 h-4" />
                <span>Assign Roles</span>
              </div>
            </button>
          </nav>
        </div>
      </Card>

     
      {activeTab === 'events' && (
        <Card className="p-6">
          <div className="mb-4 border-b border-gray-200 pb-4">
            <h2 className="text-xl font-bold text-gray-900">Faculty Approved Events</h2>
            <p className="text-gray-600 mt-1">Total events pending approval: {events.length}</p>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
              <p className="text-gray-600">No pending events to review</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <h3 className="font-medium text-gray-900 truncate">{event.name}</h3>
                  
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2" />
                      {formatEventDate(event.date)}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="w-4 h-4 mr-2" />
                      {event.clubId?.name || "Unknown Club"}
                    </div>
                    {event.eventType && (
                      <div className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                        {getEventTypeDisplay(event.eventType)}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    Review
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

     
      {activeTab === 'users' && (
        <div>
          <UserList />
        </div>
      )}

      
      {activeTab === 'roles' && (
        <div className="space-y-6">
          <Card className="p-6">
            <div className="mb-6 border-b border-gray-200 pb-4">
              <h2 className="text-xl font-bold text-gray-900">Assign User Roles</h2>
              <p className="text-gray-600 mt-1">Select a club to assign roles to users</p>
            </div>
            
            {clubs.length > 0 ? (
              <div className="max-w-md">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Club:
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  value={selectedClubForRole}
                  onChange={(e) => setSelectedClubForRole(e.target.value)}
                >
                  <option value="">-- Select a Club --</option>
                  {clubs.map((club) => (
                    <option key={club._id} value={club._id}>
                      {club.name}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900">No Clubs Available</h3>
                <p className="text-gray-600">Create clubs first to assign roles to users</p>
              </div>
            )}
          </Card>
          
          {/* AssignRole Component - Only show when a club is selected */}
          {selectedClubForRole && (
            <AssignRole clubId={selectedClubForRole} />
          )}
        </div>
      )}

      {/* Event Review Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Event Review</h2>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setRemarks('');
                }}
                className="text-gray-500 hover:text-gray-700 transition-colors"
                disabled={processingAction}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium text-gray-900">{selectedEvent.name}</h3>
              <div className="mt-2 space-y-1">
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Club:</span> {selectedEvent.clubId?.name || "Unknown Club"}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Date:</span> {formatEventDate(selectedEvent.date)}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Type:</span> {getEventTypeDisplay(selectedEvent.eventType)}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Mode:</span> {selectedEvent.mode || "Not specified"}
                </p>
                <p className="text-gray-600 text-sm">
                  <span className="font-medium">Duration:</span> {selectedEvent.duration} {selectedEvent.duration === 1 ? 'hour' : 'hours'}
                </p>
                {selectedEvent.venue && (
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Venue:</span> {selectedEvent.venue}
                  </p>
                )}
                {selectedEvent.description && (
                  <div className="mt-2">
                    <p className="font-medium text-sm text-gray-700">Description:</p>
                    <p className="text-gray-600 text-sm mt-1">{selectedEvent.description}</p>
                  </div>
                )}
                {selectedEvent.facultyApproval?.remark && (
                  <div className="mt-2">
                    <p className="font-medium text-sm text-gray-700">Faculty Remarks:</p>
                    <p className="text-gray-600 text-sm mt-1">{selectedEvent.facultyApproval.remark}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows="3"
                placeholder="Enter any remarks about your decision..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                disabled={processingAction}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleApprovalAction(selectedEvent._id, 'rejected')}
                className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processingAction}
              >
                {processingAction ? (
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <X className="w-5 h-5 mr-2" />
                )}
                Reject
              </button>
              <button
                onClick={() => handleApprovalAction(selectedEvent._id, 'approved')}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={processingAction}
              >
                {processingAction ? (
                  <Loader className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Check className="w-5 h-5 mr-2" />
                )}
                Approve
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminDashboard;