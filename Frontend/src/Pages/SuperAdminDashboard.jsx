


// import React, { useState, useEffect } from 'react';
// import { AlertCircle, Check, Loader, User, Users, Calendar, X, ArrowLeft } from 'lucide-react';
// import api from '../api';

// const SuperAdminDashboard = () => {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedEvent, setSelectedEvent] = useState(null);

//   useEffect(() => {
//     fetchEvents();
//   }, []);

//   const fetchEvents = async () => {
//     try {
//       const response = await api.get('/event/faculty-approved');
//       setEvents(response.data.data);
//     } catch (err) {
//       setError(err.response?.data?.message || 'Failed to fetch events');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleApprovalComplete = (updatedEvent) => {
//     setEvents(events.map(event => 
//       event._id === updatedEvent._id ? updatedEvent : event
//     ));
//     setSelectedEvent(null);
//   };

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen">
//         <Loader className="w-8 h-8 animate-spin text-blue-500" />
//         <p className="ml-2 text-gray-600">Loading events...</p>
//       </div>
//     );
//   }

//   if (error) {
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
//       <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
//         <h1 className="text-3xl font-bold text-gray-900">Faculty Approved Events</h1>
//         <p className="text-gray-600 mt-2">Total events pending super admin approval: {events.length}</p>
//       </div>

//       <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//         {events.map((event) => (
//           <div
//             key={event._id}
//             className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
//           >
//             <div className="p-6">
//               <h2 className="text-xl font-semibold text-gray-900 mb-4">
//                 {event.name}
//               </h2>
              
//               <div className="space-y-3">
//                 <div className="flex items-center text-gray-600">
//                   <Calendar className="w-5 h-5 mr-2" />
//                   <span>{new Date(event.eventDate).toLocaleDateString()}</span>
//                 </div>

//                 <div className="flex items-center text-gray-600">
//                   <User className="w-5 h-5 mr-2" />
//                   <span>Created by: {event.createdBy.name}</span>
//                 </div>

//                 <div className="flex items-center text-gray-600">
//                   <Users className="w-5 h-5 mr-2" />
//                   <span>Club: {event.clubId.name}</span>
//                 </div>

//                 <div className="flex items-center text-green-600">
//                   <Check className="w-5 h-5 mr-2" />
//                   <span>Faculty Approval: {event.facultyApproval.approvedBy.name}</span>
//                 </div>
//               </div>

//               <div className="mt-4 pt-4 border-t border-gray-200">
//                 <h3 className="text-sm font-medium text-gray-900 mb-2">
//                   Registered Participants: {event.registeredParticipants.length}
//                 </h3>
//                 <div className="flex flex-wrap gap-2 mb-4">
//                   {event.registeredParticipants.slice(0, 3).map((participant) => (
//                     <div
//                       key={participant.userId._id}
//                       className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
//                     >
//                       {participant.userId.name}
//                     </div>
//                   ))}
//                   {event.registeredParticipants.length > 3 && (
//                     <div className="text-sm px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
//                       +{event.registeredParticipants.length - 3} more
//                     </div>
//                   )}
//                 </div>

//                 <button
//                   onClick={() => setSelectedEvent(event)}
//                   className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//                 >
//                   Review Event
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {selectedEvent && (
//         <ApprovalModal
//           eventId={selectedEvent._id}
//           onClose={() => setSelectedEvent(null)}
//           onApprovalComplete={handleApprovalComplete}
//         />
//       )}
//     </div>
//   );
// };

// const ApprovalModal = ({ eventId, onClose, onApprovalComplete }) => {
//   const [remark, setRemark] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);

//   const handleApproval = async (approved) => {
//     try {
//       setLoading(true);
//       setError(null);
      
//       const response = await api.put(
//         `/event/${eventId}/super-admin-approval`,
//         { approved, remark }
//       );

     
//       console.log(response)

//       setSuccess(response.data.message);
//       if (onApprovalComplete) {
//         onApprovalComplete(response.data.data);
//       }
//     } catch (err) {
//       setError(err.response?.data?.message || 'An error occurred during approval');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (success) {
//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//         <div className="bg-white rounded-lg max-w-md w-full p-6">
//           <div className="text-center">
//             <div className="bg-green-100 rounded-full p-3 mx-auto w-fit">
//               <Check className="w-6 h-6 text-green-600" />
//             </div>
//             <h2 className="mt-4 text-xl font-semibold text-gray-900">{success}</h2>
//             <button
//               onClick={onClose}
//               className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//       <div className="bg-white rounded-lg max-w-md w-full p-6">
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold text-gray-900">Event Approval</h2>
//           <button
//             onClick={onClose}
//             className="text-gray-500 hover:text-gray-700"
//           >
//             <ArrowLeft className="w-5 h-5" />
//           </button>
//         </div>

//         {error && (
//           <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
//             <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
//             <p>{error}</p>
//           </div>
//         )}

//         <div className="mb-6">
//           <label
//             htmlFor="remark"
//             className="block text-sm font-medium text-gray-700 mb-2"
//           >
//             Remarks (Optional)
//           </label>
//           <textarea
//             id="remark"
//             value={remark}
//             onChange={(e) => setRemark(e.target.value)}
//             className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             rows="4"
//             placeholder="Enter any remarks about your decision..."
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <button
//             onClick={() => handleApproval(false)}
//             disabled={loading}
//             className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
//           >
//             {loading ? (
//               <Loader className="w-5 h-5 animate-spin" />
//             ) : (
//               <>
//                 <X className="w-5 h-5 mr-2" />
//                 Reject
//               </>
//             )}
//           </button>
//           <button
//             onClick={() => handleApproval(true)}
//             disabled={loading}
//             className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//           >
//             {loading ? (
//               <Loader className="w-5 h-5 animate-spin" />
//             ) : (
//               <>
//                 <Check className="w-5 h-5 mr-2" />
//                 Approve
//               </>
//             )}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default SuperAdminDashboard;


import React, { useState, useEffect } from 'react';
import { AlertCircle, Check, Loader, User, Users, Calendar, X, ArrowLeft } from 'lucide-react';
import api from '../api';

const SuperAdminDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/event/faculty-approved');
      setEvents(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const handleApprovalComplete = (updatedEvent) => {
    // Remove the event from the list instead of updating it
    setEvents(events.filter(event => event._id !== updatedEvent._id));
    setSelectedEvent(null);
  };

  // Rest of the dashboard component remains the same...
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader className="w-8 h-8 animate-spin text-blue-500" />
        <p className="ml-2 text-gray-600">Loading events...</p>
      </div>
    );
  }

  if (error) {
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
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Faculty Approved Events</h1>
        <p className="text-gray-600 mt-2">Total events pending super admin approval: {events.length}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
          >
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {event.name}
              </h2>
              
              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-5 h-5 mr-2" />
                  <span>{new Date(event.eventDate).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <User className="w-5 h-5 mr-2" />
                  <span>Created by: {event.createdBy.name}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="w-5 h-5 mr-2" />
                  <span>Club: {event.clubId.name}</span>
                </div>

                <div className="flex items-center text-green-600">
                  <Check className="w-5 h-5 mr-2" />
                  <span>Faculty Approval: {event.facultyApproval.approvedBy.name}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-medium text-gray-900 mb-2">
                  Registered Participants: {event.registeredParticipants.length}
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {event.registeredParticipants.slice(0, 3).map((participant) => (
                    <div
                      key={participant.userId._id}
                      className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full"
                    >
                      {participant.userId.name}
                    </div>
                  ))}
                  {event.registeredParticipants.length > 3 && (
                    <div className="text-sm px-2 py-1 bg-gray-50 text-gray-600 rounded-full">
                      +{event.registeredParticipants.length - 3} more
                    </div>
                  )}
                </div>

                <button
                  onClick={() => setSelectedEvent(event)}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Review Event
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedEvent && (
        <ApprovalModal
          eventId={selectedEvent._id}
          onClose={() => setSelectedEvent(null)}
          onApprovalComplete={handleApprovalComplete}
        />
      )}
    </div>
  );
};

const ApprovalModal = ({ eventId, onClose, onApprovalComplete }) => {
  const [remark, setRemark] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successState, setSuccessState] = useState({ show: false, message: '', isApproved: false });

  const handleApproval = async (approved) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await api.put(
        `/event/${eventId}/super-admin-approval`,
        { approved, remark }
      );

      setSuccessState({
        show: true,
        message: response.data.message,
        isApproved: approved
      });
      
      // Delay the onApprovalComplete callback to allow animation to play
      setTimeout(() => {
        if (onApprovalComplete) {
          onApprovalComplete(response.data.data);
        }
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during approval');
    } finally {
      setLoading(false);
    }
  };

  if (successState.show) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg max-w-md w-full p-8 transform transition-all duration-300 scale-100 opacity-100">
          <div className="text-center">
            <div className={`rounded-full p-4 mx-auto w-fit ${
              successState.isApproved ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {successState.isApproved ? (
                <Check className="w-8 h-8 text-green-600" />
              ) : (
                <X className="w-8 h-8 text-red-600" />
              )}
            </div>
            <h2 className={`mt-6 text-2xl font-semibold ${
              successState.isApproved ? 'text-green-600' : 'text-red-600'
            }`}>
              {successState.isApproved ? 'Event Approved' : 'Event Rejected'}
            </h2>
            <p className="mt-2 text-gray-600">{successState.message}</p>
            <div className="mt-8 w-full h-1 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-blue-600 animate-progress-bar"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6 transform transition-all duration-300">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Event Approval</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <div className="mb-6">
          <label
            htmlFor="remark"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Remarks (Optional)
          </label>
          <textarea
            id="remark"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            rows="4"
            placeholder="Enter any remarks about your decision..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleApproval(false)}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <X className="w-5 h-5 mr-2" />
                Reject
              </>
            )}
          </button>
          <button
            onClick={() => handleApproval(true)}
            disabled={loading}
            className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5 mr-2" />
                Approve
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuperAdminDashboard;