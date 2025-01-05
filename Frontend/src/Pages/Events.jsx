
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, ChevronRight, Target, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTags, setSelectedTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  useEffect(() => {
    if (events.length > 0) {
      const tags = new Set();
      events.forEach(event => {
        if (event.tags && event.tags.length > 0) {
          event.tags.forEach(tag => tags.add(tag));
        } else {
          tags.add(event.eventType.toLowerCase());
        }
      });
      setAllTags(Array.from(tags));
    }
  }, [events]);

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:3000/api/event');
      setEvents(response.data.data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return {
      month: date.toLocaleString('default', { month: 'long' }),
      day: date.getDate(),
      year: date.getFullYear(),
      time: date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getRemainingTime = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const difference = deadlineDate - now;
    
    if (difference < 0) return { days: 0, hours: 0, minutes: 0, isExpired: true };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes, isExpired: false };
  };

  const toggleTag = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const filteredEvents = events.filter(event => {
    if (selectedTags.length === 0) return true;
    const eventTags = event.tags && event.tags.length > 0 
      ? event.tags 
      : [event.eventType.toLowerCase()];
    return selectedTags.some(tag => eventTags.includes(tag));
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex flex-col items-center justify-center">
        <div className="text-red-500 text-center">
          <p className="text-xl font-semibold mb-2">{error}</p>
          <button 
            onClick={getEvents}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-8 bg-white rounded-xl shadow p-6">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Filter by Tags</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {allTags.map((tag, index) => (
              <button
                key={index}
                onClick={() => toggleTag(tag)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedTags.includes(tag)
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        
        <div className="space-y-6">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => {
              const { month, day, year, time } = formatDate(event.date);
              const remaining = getRemainingTime(event.registrationDeadline);
              
              return (
                <div key={event._id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <div className="text-sm text-blue-500 font-semibold">{`${month} ${day}, ${year}`}</div>
                        <div className="flex items-center mt-1">
                          <Clock className="w-4 h-4 text-gray-400 mr-1" />
                          <span className="text-gray-600">{time}</span>
                        </div>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                        event.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
                        event.status === 'ongoing' ? 'bg-green-100 text-green-700' :
                        'bg-purple-100 text-purple-700'
                      }`}>
                        {event.status}
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      <img
                        src={`http://localhost:3000/${event.ClubId.clubLogo.replace(/\\/g, '/')}`}
                        alt={event.ClubId.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                      />
                      <span className="text-sm font-medium text-gray-600 ml-2">{event.ClubId.name}</span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors mb-3">
                      {event.name}
                    </h2>

                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags && event.tags.length > 0 ? (
                        event.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium"
                          >
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                          {event.eventType.toLowerCase()}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{event.registeredParticipants.length} participants</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Target className="w-5 h-5 text-red-500" />
                          {remaining.isExpired ? (
                            <span className="ml-2 text-red-500 font-medium">Registration Closed</span>
                          ) : (
                            <div className="ml-4 flex items-center gap-2">
                              <span className="text-gray-600 font-medium">
                                {`${remaining.days}d ${remaining.hours}h ${remaining.minutes}m left`}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <button 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center group"
                        onClick={() => navigate(`/events/${event._id}`)}
                      >
                        Learn More 
                        <ChevronRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center text-gray-500 py-12">
              <p className="text-xl">No events found</p>
              <button 
                onClick={() => {
                  setSelectedTags([]);
                  getEvents();
                }}
                className="mt-4 text-blue-500 hover:text-blue-600"
              >
                Clear Filters & Refresh Events
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Events;