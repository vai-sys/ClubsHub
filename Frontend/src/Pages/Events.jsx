import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, ChevronRight, Loader2, AlertCircle } from 'lucide-react';
import api from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

  const fetchApprovedEvents = async () => {
    try {
      const response = await api.get('/event/approved');
      if (response.data.success) {
        const transformedEvents = response.data.data.map(event => ({
          _id: event._id,
          title: event.name,
          description: event.description,
          date: event.date,
          time: new Date(event.date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          }),
          location: event.venue,
          category: event.eventType,
          organizer: event.clubId.name,
          capacity: event.maxParticipants,
          clubLogo: event.clubId.clubLogo,
          clubName: event.clubId.name
        }));
  
      
        const sortedEvents = transformedEvents.sort((a, b) => new Date(b.date) - new Date(a.date));
  
        setEvents(sortedEvents);
        setError(null);
      } else {
        throw new Error('Failed to fetch approved events');
      }
    } catch (err) {
      setError(
        err.response?.status === 401
          ? 'Unauthorized - Please log in again'
          : err.response?.status === 403
          ? 'You do not have permission to view approved events'
          : 'Failed to fetch approved events'
      );
    } finally {
      setLoading(false);
    }
  };
  

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-3">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <span className="text-gray-600 text-lg">Loading events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen p-8 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-start space-x-3 text-red-600">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Upcoming Events</h1>
          <p className="text-lg text-gray-600">Discover and join exciting events happening around you</p>
        </div>

        {events.length === 0 ? (
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No approved events found at the moment.</p>
            <p className="text-sm text-gray-500 mt-2">Check back later for new events!</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <div 
                key={event._id} 
                className="group bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
              >
                <div className="relative p-6">
                  <div className="absolute top-4 right-4 z-10">
                    {event.clubLogo ? (
                      <img
                        src={`http://localhost:3000/${event.clubLogo.replace(/\\/g, '/')}`}
                        alt={event.clubName}
                        className="w-10 h-10 rounded-full border-2 border-white shadow-md"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Tag className="w-5 h-5 text-blue-600" />
                      </div>
                    )}
                  </div>
                  
                  <span className="inline-flex px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {event.category}
                  </span>

                  <h2 className="text-xl font-bold text-gray-900 mt-4 mb-2 group-hover:text-blue-600 transition-colors">
                    {event.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center text-gray-600">
                      <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <Clock className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm">{event.time}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <MapPin className="w-4 h-4 mr-3 text-blue-600" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    {event.capacity && (
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-3 text-blue-600" />
                        <span className="text-sm">Capacity: {event.capacity}</span>
                      </div>
                    )}
                  </div>

                  <button 
                    onClick={() => window.location.href = `/events/${event._id}`}
                    className="w-full bg-white text-blue-600 border-2 border-blue-600 py-2 px-4 rounded-lg 
                             hover:bg-blue-600 hover:text-white transition-all duration-300 
                             flex items-center justify-center group"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;