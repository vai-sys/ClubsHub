


// import React, { useState, useEffect } from 'react';
// import { AlertCircle, Check, Loader, User, Users, Calendar, X, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
// import api from '../api';

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
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [calendarEvents, setCalendarEvents] = useState([]);

//   useEffect(() => {
//     fetchEvents();
//     fetchCalendarEvents();
//   }, [selectedDate]);

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

//   const fetchCalendarEvents = async () => {
//     try {
//       const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString();
//       const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString();
//       const response = await api.get(`/event/approved?startDate=${startDate}&endDate=${endDate}`);
//       if (response.data?.success) {
//         setCalendarEvents(response.data.data || []);
//       }
//     } catch (err) {
//       console.error('Error fetching calendar events:', err);
//     }
//   };

//   const handleApprovalComplete = (updatedEvent) => {
//     setEvents(events.filter(event => event._id !== updatedEvent._id));
//     setSelectedEvent(null);
//     fetchCalendarEvents();
//   };

//   const renderCalendar = () => {
//     const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
//     const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
//     const weeks = [];
//     let days = [];

//     for (let i = 0; i < firstDayOfMonth; i++) {
//       days.push(<td key={`empty-${i}`} className="p-2 border border-gray-100"></td>);
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
//       const dayEvents = calendarEvents.filter(event => {
//         const eventDate = new Date(event.date);
//         return eventDate.getDate() === day &&
//           eventDate.getMonth() === currentDate.getMonth() &&
//           eventDate.getFullYear() === currentDate.getFullYear();
//       });

//       const isToday = new Date().toDateString() === currentDate.toDateString();

//       days.push(
//         <td key={day} className="p-2 border border-gray-100 h-28 align-top">
//           <div className="relative group">
//             <div className={`font-medium text-sm mb-2 ${isToday ? 'text-red-600' : ''}`}>
//               {day}
            
//             </div>
//             <div className="space-y-1 overflow-y-auto max-h-20">
//               {dayEvents.map(event => (
//                 <div
//                   key={event._id}
//                   className="p-1.5 text-xs rounded bg-blue-50 border border-blue-100 transition-colors hover:bg-blue-100"
//                 >
//                   <div className="font-medium truncate">{event.name}</div>
//                   <div className="text-gray-600 text-xs">
//                     {new Date(event.date).toLocaleTimeString('en-US', {
//                       hour: '2-digit',
//                       minute: '2-digit'
//                     })}
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         </td>
//       );

//       if (days.length === 7) {
//         weeks.push(<tr key={weeks.length}>{days}</tr>);
//         days = [];
//       }
//     }

//     if (days.length > 0) {
//       while (days.length < 7) {
//         days.push(<td key={`empty-end-${days.length}`} className="p-2 border border-gray-100"></td>);
//       }
//       weeks.push(<tr key={weeks.length}>{days}</tr>);
//     }

//     return weeks;
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
//       <Card className="p-6 mb-6">
//         <div className="flex justify-between items-center">
//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">Faculty Approved Events</h1>
//             <p className="text-gray-600 mt-2">Total events pending super admin approval: {events.length}</p>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
//               {calendarEvents.length} Approved Events
//             </span>
//           </div>
//         </div>
//       </Card>

//       <div className="grid gap-6 lg:grid-cols-12">
//         <div className="lg:col-span-8">
//           <Card>
//             <div className="p-4 border-b border-gray-200">
//               <div className="flex items-center justify-between">
//                 <h2 className="text-xl font-bold text-gray-900">Event Calendar</h2>
//                 <div className="flex items-center gap-4">
//                   <button
//                     onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
//                     className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                   >
//                     <ChevronLeft className="w-5 h-5" />
//                   </button>
//                   <span className="text-lg font-medium">
//                     {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
//                   </span>
//                   <button
//                     onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
//                     className="p-2 rounded-full hover:bg-gray-100 transition-colors"
//                   >
//                     <ChevronRight className="w-5 h-5" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//             <div className="p-4">
//               <table className="w-full border-collapse">
//                 <thead>
//                   <tr>
//                     {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                       <th key={day} className="p-2 border border-gray-100 bg-gray-50 text-sm font-medium">
//                         {day}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>{renderCalendar()}</tbody>
//               </table>
//             </div>
//           </Card>
//         </div>

//         <div className="lg:col-span-4">
//           <Card className="h-full">
//             <div className="p-4 border-b border-gray-200">
//               <h2 className="text-xl font-bold text-gray-900">Pending Events</h2>
//             </div>
//             <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
//               {events.length === 0 ? (
//                 <div className="text-center py-8">
//                   <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
//                   <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
//                   <p className="text-gray-600">No pending events to review</p>
//                 </div>
//               ) : (
//                 events.map((event) => (
//                   <div
//                     key={event._id}
//                     className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
//                   >
//                     <h3 className="font-medium text-gray-900">{event.name}</h3>
//                     <div className="mt-2 space-y-2">
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Calendar className="w-4 h-4 mr-2" />
//                         {new Date(event.eventDate).toLocaleDateString()}
//                       </div>
//                       <div className="flex items-center text-sm text-gray-600">
//                         <Users className="w-4 h-4 mr-2" />
//                         {event.clubId.name}
//                       </div>
//                     </div>
//                     <button
//                       onClick={() => setSelectedEvent(event)}
//                       className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
//                     >
//                       Review
//                     </button>
//                   </div>
//                 ))
//               )}
//             </div>
//           </Card>
//         </div>
//       </div>

//       {selectedEvent && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//           <div className="bg-white rounded-lg max-w-md w-full p-6">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-semibold text-gray-900">Event Approval</h2>
//               <button
//                 onClick={() => setSelectedEvent(null)}
//                 className="text-gray-500 hover:text-gray-700 transition-colors"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <div className="mb-4">
//               <h3 className="font-medium text-gray-900">{selectedEvent.name}</h3>
//               <p className="text-gray-600 mt-1">{selectedEvent.clubId.name}</p>
//               <p className="text-gray-600">
//                 {new Date(selectedEvent.eventDate).toLocaleDateString()}
//               </p>
//             </div>

//             <div className="mb-6">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Remarks (Optional)
//               </label>
//               <textarea
//                 className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
//                 rows="4"
//                 placeholder="Enter any remarks about your decision..."
//               />
//             </div>

//             <div className="grid grid-cols-2 gap-4">
//               <button
//                 onClick={() => handleApprovalComplete(selectedEvent)}
//                 className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all"
//               >
//                 <X className="w-5 h-5 mr-2" />
//                 Reject
//               </button>
//               <button
//                 onClick={() => handleApprovalComplete(selectedEvent)}
//                 className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
//               >
//                 <Check className="w-5 h-5 mr-2" />
//                 Approve
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
import { AlertCircle, Check, Loader, User, Users, Calendar, X, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../api';

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
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    fetchEvents();
    fetchCalendarEvents();
  }, [selectedDate]);

  const isValidEvent = (event) => {
    const eventDate = new Date(event.eventDate);
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
     
      const validEvents = response.data.data.filter(isValidEvent);
      setEvents(validEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString();
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString();
      const response = await api.get(`/event/approved?startDate=${startDate}&endDate=${endDate}`);
      if (response.data?.success) {
      
        const validCalendarEvents = (response.data.data || []).filter(event => {
          const eventDate = new Date(event.date);
          return !isNaN(eventDate.getTime());
        });
        setCalendarEvents(validCalendarEvents);
      }
    } catch (err) {
      console.error('Error fetching calendar events:', err);
    }
  };

  const handleApprovalComplete = (updatedEvent) => {
    setEvents(events.filter(event => event._id !== updatedEvent._id));
    setSelectedEvent(null);
    fetchCalendarEvents();
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="p-2 border border-gray-100"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dayEvents = calendarEvents.filter(event => {
        const eventDate = new Date(event.date);
        return !isNaN(eventDate.getTime()) && 
          eventDate.getDate() === day &&
          eventDate.getMonth() === currentDate.getMonth() &&
          eventDate.getFullYear() === currentDate.getFullYear();
      });

      const isToday = new Date().toDateString() === currentDate.toDateString();

      days.push(
        <td key={day} className="p-2 border border-gray-100 h-28 align-top">
          <div className="relative group">
            <div className={`font-medium text-sm mb-2 ${isToday ? 'text-red-600' : ''}`}>
              {day}
            </div>
            <div className="space-y-1 overflow-y-auto max-h-20">
              {dayEvents.map(event => (
                <div
                  key={event._id}
                  className="p-1.5 text-xs rounded bg-blue-50 border border-blue-100 transition-colors hover:bg-blue-100"
                >
                  <div className="font-medium truncate">{event.name}</div>
                  <div className="text-gray-600 text-xs">
                    {new Date(event.date).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </td>
      );

      if (days.length === 7) {
        weeks.push(<tr key={weeks.length}>{days}</tr>);
        days = [];
      }
    }

    if (days.length > 0) {
      while (days.length < 7) {
        days.push(<td key={`empty-end-${days.length}`} className="p-2 border border-gray-100"></td>);
      }
      weeks.push(<tr key={weeks.length}>{days}</tr>);
    }

    return weeks;
  };

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
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Approved Events</h1>
            <p className="text-gray-600 mt-2">Total events pending super admin approval: {events.length}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {calendarEvents.length} Approved Events
            </span>
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <Card>
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Event Calendar</h2>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-lg font-medium">
                    {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                    className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
            <div className="p-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <th key={day} className="p-2 border border-gray-100 bg-gray-50 text-sm font-medium">
                        {day}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>{renderCalendar()}</tbody>
              </table>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-4">
          <Card className="h-full">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Pending Events</h2>
            </div>
            <div className="p-4 space-y-4 max-h-[600px] overflow-y-auto">
              {events.length === 0 ? (
                <div className="text-center py-8">
                  <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900">All Caught Up!</h3>
                  <p className="text-gray-600">No pending events to review</p>
                </div>
              ) : (
                events.map((event) => (
                  <div
                    key={event._id}
                    className="p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <h3 className="font-medium text-gray-900">{event.name}</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        {new Date(event.eventDate).toLocaleDateString()}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        {event.clubId.name}
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="mt-3 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Review
                    </button>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>
      </div>

      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Event Approval</h2>
              <button
                onClick={() => setSelectedEvent(null)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4">
              <h3 className="font-medium text-gray-900">{selectedEvent.name}</h3>
              <p className="text-gray-600 mt-1">{selectedEvent.clubId.name}</p>
              <p className="text-gray-600">
                {new Date(selectedEvent.eventDate).toLocaleDateString()}
              </p>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Remarks (Optional)
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                rows="4"
                placeholder="Enter any remarks about your decision..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleApprovalComplete(selectedEvent)}
                className="flex items-center justify-center px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-all"
              >
                <X className="w-5 h-5 mr-2" />
                Reject
              </button>
              <button
                onClick={() => handleApprovalComplete(selectedEvent)}
                className="flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all"
              >
                <Check className="w-5 h-5 mr-2" />
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
