import React, { useState, useMemo, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, Users, ChevronDown, ChevronUp } from 'lucide-react';
import api from '../api'

const Calendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedDate, setExpandedDate] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/event/approved');
     
        setEvents(response.data.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const eventsByDate = useMemo(() => {
    const grouped = {};
    const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

    sortedEvents.forEach((event) => {
      if (!event.date) return;
      const dateKey = new Date(event.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(event);
    });

    return grouped;
  }, [events]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      full: date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      }),
    };
  };

  const getEventTypeStyles = (eventType) => {
    const styles = {
      WORKSHOP: 'bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-400 shadow-sm',
      SEMINAR: 'bg-gradient-to-br from-blue-50 to-blue-100 border-l-4 border-blue-400 shadow-sm',
      COMPETITION: 'bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-400 shadow-sm',
      MEETUP: 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-l-4 border-yellow-400 shadow-sm',
      CULTURAL: 'bg-gradient-to-br from-pink-50 to-pink-100 border-l-4 border-pink-400 shadow-sm',
      TECHNICAL: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-l-4 border-indigo-400 shadow-sm',
      OTHER: 'bg-gradient-to-br from-gray-50 to-gray-100 border-l-4 border-gray-400 shadow-sm',
    };
    return styles[eventType] || styles.OTHER;
  };

  const getStatusStyles = (status) => {
    const styles = {
      UPCOMING: 'text-blue-600 bg-blue-50 ring-1 ring-blue-100',
      ONGOING: 'text-green-600 bg-green-50 ring-1 ring-green-100',
      COMPLETED: 'text-gray-600 bg-gray-50 ring-1 ring-gray-100',
      CANCELLED: 'text-red-600 bg-red-50 ring-1 ring-red-100',
    };
    return styles[status] || styles.COMPLETED;
  };

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-8">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" />
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-100" />
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce delay-200" />
          </div>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg">
        <div className="p-8 text-center">
          <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600">No upcoming events found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="border-b bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white rounded-lg shadow-sm">
            <CalendarIcon className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
            Upcoming Events
          </h1>
        </div>
      </div>

      <div className="divide-y divide-gray-100">
        {Object.entries(eventsByDate).map(([date, dayEvents]) => {
          const isExpanded = expandedDate === date;
          const formattedDate = new Date(date).toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          });

          return (
            <div key={date} className="group">
              <button
                onClick={() => setExpandedDate(isExpanded ? null : date)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
                    <span className="text-2xl font-bold">
                      {new Date(date).getDate()}
                    </span>
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-gray-800">{formattedDate}</h3>
                    <p className="text-sm text-gray-500">
                      {dayEvents.length} event{dayEvents.length !== 1 ? 's' : ''} scheduled
                    </p>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-200">
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
              </button>

              {isExpanded && (
                <div className="p-4 space-y-4 bg-gradient-to-br from-gray-50 to-white">
                  {dayEvents.map((event) => {
                    const formattedEventDate = formatDate(event.date);
                    return (
                      <div
                        key={event._id}
                        className={`rounded-xl p-4 transition-all duration-200 hover:shadow-lg ${getEventTypeStyles(event.eventType)}`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-semibold text-lg text-gray-800">{event.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyles(event.status)}`}>
                            {event.status}
                          </span>
                        </div>

                        <div className="grid gap-3 text-sm">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{formattedEventDate.time} ({event.duration} mins)</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{event.venue}</span>
                          </div>

                          {event.maxParticipants > 0 && (
                            <div className="flex items-center gap-2 text-gray-600">
                              <Users className="w-4 h-4" />
                              <div className="flex items-center gap-3 w-full">
                                <span>{event.registeredParticipants.length}/{event.maxParticipants}</span>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full transition-all duration-300"
                                    style={{
                                      width: `${(event.registeredParticipants.length / event.maxParticipants) * 100}%`,
                                    }}
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;