




import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import api from '../api';

const FacultyDashboard = () => {
  const [events, setEvents] = useState([]);
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState({});
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    Promise.all([
      fetchPendingEvents(),
      fetchApprovedEvents()
    ]).finally(() => setLoading(false));
  }, []);

  const isValidDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date) && date > new Date();
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await api.get('/event/pending-faculty');
      if (!response.data) throw new Error('No data received from server');
      
      
      const validEvents = (response.data.data || []).filter(event => isValidDate(event.date));
      setEvents(validEvents);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending events');
    }
  };

  const fetchApprovedEvents = async () => {
    try {
      const startDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).toISOString();
      const endDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).toISOString();
      const response = await api.get(`/event/approved?startDate=${startDate}&endDate=${endDate}`);
      if (response.data?.success) {
        
        const validApprovedEvents = (response.data.data || []).filter(event => isValidDate(event.date));
        setApprovedEvents(validApprovedEvents);
      }
    } catch (err) {
      console.error('Error fetching approved events:', err);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
  }, [selectedDate]);

  const handleApproval = async (eventId, approved) => {
    try {
      setError(null);
      const response = await api.put(`/event/${eventId}/faculty-approval`, {
        approved,
        remark: remarks[eventId] || ''
      });

      if (response.data.success) {
        setEvents(events.filter(event => event._id !== eventId));
        setRemarks(prev => {
          const newRemarks = { ...prev };
          delete newRemarks[eventId];
          return newRemarks;
        });
        fetchApprovedEvents();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process approval');
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1).getDay();
    const weeks = [];
    let days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<td key={`empty-${i}`} className="p-2 border border-gray-200"></td>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const currentDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), day);
      const dayEvents = approvedEvents.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate.getDate() === day && 
               eventDate.getMonth() === currentDate.getMonth() && 
               eventDate.getFullYear() === currentDate.getFullYear();
      });

      days.push(
        <td key={day} className="p-2 border border-gray-200 h-32 align-top">
          <div className="font-medium text-sm mb-2">{day}</div>
          <div className="space-y-1 overflow-y-auto max-h-24">
            {dayEvents.map(event => (
              <div 
                key={event._id}
                className="p-1 text-xs rounded bg-blue-50 border border-blue-100"
              >
                <div className="font-medium truncate">{event.name}</div>
                <div className="text-gray-600">
                  {new Date(event.date).toLocaleTimeString('en-US', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
            ))}
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
        days.push(<td key={`empty-end-${days.length}`} className="p-2 border border-gray-200"></td>);
      }
      weeks.push(<tr key={weeks.length}>{days}</tr>);
    }

    return weeks;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
          <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {events.length} Pending Approvals
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-900">Event Calendar</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      ←
                    </button>
                    <span className="text-lg font-medium">
                      {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </span>
                    <button
                      onClick={() => setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1))}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr>
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                          <th key={day} className="p-2 border border-gray-200 bg-gray-50 text-sm">
                            {day}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {renderCalendar()}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">Pending Approvals</h2>
              </div>
              <div className="p-4 space-y-4">
                {error && (
                  <div className="bg-red-50 text-red-700 p-3 rounded-lg flex items-center gap-2">
                    <AlertCircle className="h-5 w-5" />
                    <p>{error}</p>
                  </div>
                )}
                
                {events.length === 0 ? (
                  <div className="text-center py-6">
                    <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900">All Caught Up!</h3>
                    <p className="mt-2 text-gray-600">No pending approvals</p>
                  </div>
                ) : (
                  events.map((event) => (
                    <div key={event._id} className="p-4 bg-gray-50 rounded-lg space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{event.name}</h3>
                          <p className="text-sm text-gray-600">{event.clubId?.name}</p>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          event.mode === 'ONLINE' ? 'bg-green-100 text-green-800' :
                          event.mode === 'OFFLINE' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {event.mode}
                        </span>
                      </div>
                      <textarea
                        placeholder="Enter remarks..."
                        value={remarks[event._id] || ''}
                        onChange={(e) => setRemarks(prev => ({
                          ...prev,
                          [event._id]: e.target.value
                        }))}
                        className="w-full p-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none h-20"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleApproval(event._id, false)}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => handleApproval(event._id, true)}
                          className="px-3 py-1 text-sm bg-blue-600 text-white hover:bg-blue-700 rounded-lg"
                        >
                          Approve
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;