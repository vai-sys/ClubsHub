import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, Tag, ChevronRight, Loader2, AlertCircle, Filter } from 'lucide-react';
import api from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [filteredEvents, setFilteredEvents] = useState([]);

  useEffect(() => {
    fetchApprovedEvents();
  }, []);

 
  useEffect(() => {
    filterEvents(activeFilter);
  }, [events, activeFilter]);

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
          clubName: event.clubId.name,
          registrationDeadline: event.registrationDeadline,
         
        }));
  
       
        const sortedEvents = transformedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
  
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

  const filterEvents = (filter) => {
    const now = new Date();
    
    let filtered;
    switch (filter) {
      case 'upcoming':
       
        filtered = events.filter(event => {
          const eventDate = new Date(event.date);
          const deadlineDate = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
          return eventDate > now && (!deadlineDate || deadlineDate > now);
        });
        break;
      case 'ongoing':
       
        filtered = events.filter(event => {
          const eventDate = new Date(event.date);
         
          const isToday = eventDate.toDateString() === now.toDateString();
          return isToday ;
        });
        break;
      case 'past':
        
        filtered = events.filter(event => {
          const eventDate = new Date(event.date);
          const deadlineDate = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
          return (deadlineDate && deadlineDate < now) || eventDate < now || event.status === 'COMPLETED';
        });
        break;
      case 'all':
      default:
        filtered = events;
     
        filtered = events.map(event => {
          const eventDate = new Date(event.date);
          const deadlineDate = event.registrationDeadline ? new Date(event.registrationDeadline) : null;
          const isToday = eventDate.toDateString() === now.toDateString();
          
          let eventStatus = 'upcoming';
          if ((deadlineDate && deadlineDate < now) || eventDate < now ) {
            eventStatus = 'past';
          } else if (isToday ) {
            eventStatus = 'ongoing';
          }
          
          return { ...event, eventStatus };
        });
    }
    
    setFilteredEvents(filtered);
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
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Events</h1>
          <p className="text-lg text-gray-600">Discover and join exciting events happening around you</p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-10">
          <div className="inline-flex rounded-xl border border-gray-200 bg-white p-1.5 shadow-md">
            <button
              onClick={() => setActiveFilter('all')}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'all'
                  ? 'bg-gradient-to-r from-indigo-500 to-blue-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Tag className="w-4 h-4" />
              All Events
            </button>

            <button
              onClick={() => setActiveFilter('upcoming')}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'upcoming'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Upcoming
            </button>

            <button
              onClick={() => setActiveFilter('ongoing')}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'ongoing'
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Clock className="w-4 h-4" />
              Ongoing
            </button>

            <button
              onClick={() => setActiveFilter('past')}
              className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                activeFilter === 'past'
                  ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-lg'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              <Filter className="w-4 h-4" />
              Past
            </button>
          </div>
        </div>

        {filteredEvents.length === 0 ? (
          <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-8 text-center">
            <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg font-semibold">No {activeFilter} events found.</p>
            <p className="text-gray-500 mt-2">Try selecting a different filter!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {filteredEvents.map((event) => {
              
              const eventStatus = activeFilter === 'all' ? event.eventStatus : activeFilter;
              
           
              let statusStyles = '';
              let statusText = '';
              
              if (eventStatus === 'ongoing') {
                statusStyles = 'bg-green-100 text-green-800 border-green-200';
                statusText = 'Happening Now';
              } else if (eventStatus === 'past') {
                statusStyles = 'bg-gray-100 text-gray-700 border-gray-200';
                statusText = 'Registration Closed';
              } else {
                statusStyles = 'bg-blue-100 text-blue-800 border-blue-200';
                statusText = 'Upcoming';
              }
              
              return (
                <div 
                  key={event._id} 
                  className={`group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden ${
                    eventStatus === 'past' ? 'opacity-80' : ''
                  }`}
                >
                 
                  <div className={`h-3 w-full ${
                    eventStatus === 'ongoing' ? 'bg-gradient-to-r from-green-400 to-green-600' : 
                    eventStatus === 'past' ? 'bg-gradient-to-r from-gray-400 to-gray-600' :
                    'bg-gradient-to-r from-blue-400 to-indigo-500'
                  }`}></div>
                  
                  <div className="relative p-6">
                  
                  
                    <div className="absolute top-4 right-4 z-10">
                      {event.clubLogo ? (
                        <img
                          src={`http://localhost:3000/${event.clubLogo.replace(/\\/g, '/')}`}
                          alt={event.clubName}
                          className="w-12 h-12 rounded-full border-2 border-white shadow-md object-cover"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center shadow-md">
                          <Tag className="w-6 h-6 text-blue-600" />
                        </div>
                      )}
                    </div>
                    
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="inline-flex px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-sm font-medium">
                        {event.category}
                      </span>
                      
                      {(activeFilter === 'all' || activeFilter === 'ongoing' || activeFilter === 'past') && 
                        eventStatus !== 'upcoming' && (
                        <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium border ${statusStyles}`}>
                          {statusText}
                        </span>
                      )}
                    </div>

                    
                    <h2 className="text-xl font-bold text-gray-900 mt-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {event.title}
                    </h2>
                    <p className="text-gray-600 mb-5 line-clamp-2">{event.description}</p>

                   
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="w-5 h-5 mr-3 text-blue-600" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-5 h-5 mr-3 text-blue-600" />
                        <span>{event.location}</span>
                      </div>
                      {event.capacity && (
                        <div className="flex items-center text-gray-700">
                          <Users className="w-5 h-5 mr-3 text-blue-600" />
                          <span>Capacity: {event.capacity}</span>
                        </div>
                      )}
                      {event.registrationDeadline && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="w-5 h-5 mr-3 text-red-500" />
                          <span>
                            Register by: {formatDate(event.registrationDeadline)}
                          </span>
                        </div>
                      )}
                    </div>

                    <button 
                      onClick={() => window.location.href = `/events/${event._id}`}
                      className={`w-full py-2.5 px-4 rounded-lg transition-all duration-300 flex items-center justify-center font-medium shadow-sm ${
                        eventStatus === 'past'
                          ? 'bg-gray-100 text-gray-600 border-2 border-gray-300 hover:bg-gray-200'
                          : eventStatus === 'ongoing'
                          ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                          : 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {eventStatus === 'past' ? 'View Details' : eventStatus === 'ongoing' ? 'Join Now' : 'Register Now'}
                      <ChevronRight className="w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
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

export default Events;