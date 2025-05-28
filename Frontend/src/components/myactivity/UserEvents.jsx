import React, { useEffect, useState, useContext } from 'react';
import { Users, Calendar, AlertCircle, Loader2, MapPin, Clock, User, Award } from 'lucide-react';
import { AuthContext } from '../../AuthContext';
import api from '../../api';

const UserEvents = () => {
  const { user } = useContext(AuthContext);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipatedEvents = async () => {
     
      if (!user || !user._id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching events for user:', user._id);
        const res = await api.get(`/event/user-events/${user._id}`);
        
        if (res.data && res.data.events) {
          setEvents(res.data.events);
        } else {
          setEvents([]);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again.');
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipatedEvents();
  }, [user]); 

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

  // Show loading while waiting for user context
  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Initializing user session...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600">Loading your events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{error}</span>
        </div>
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Registered Events</h2>
            <p className="text-sm text-gray-600">
              Events you've signed up for ({events.length} total)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Events Yet</h3>
            <p className="text-gray-500">You haven't registered for any events yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => {
              const { date, time } = formatDateTime(event.date);
              const isUpcoming = new Date(event.date) > new Date();
              
              return (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-gray-900 text-sm leading-tight">
                      {event.name}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getEventTypeColor(event.eventType)}`}>
                      {event.eventType}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {event.clubId?.name || 'Unknown Club'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{date} at {time}</span>
                  </div>

                  <div className="flex items-center space-x-2 mb-3">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {event.mode} • {event.venue}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs font-medium text-green-700">Registered</span>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isUpcoming 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {isUpcoming ? 'Upcoming' : 'Completed'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserEvents;