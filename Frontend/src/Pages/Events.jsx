
import React, { useState, useEffect } from 'react';
import { Calendar, Users, Clock, ChevronRight, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getEvents();
  }, []);

  const getEvents = async () => {
    try {
      setLoading(true);
      const response = await api.get('http://localhost:3000/api/event');
      setEvents(response.data.data || []);
      console.log(response.data.data)
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
      month: date.toLocaleString('default', { month: 'short' }),
      day: date.getDate(),
      time: date.toLocaleString('en-US', { hour: '2-digit', minute: '2-digit' })
    };
  };

  const getRemainingTime = (deadline) => {
    const now = new Date();
    const deadlineDate = new Date(deadline);
    const difference = deadlineDate - now;
    
    if (difference < 0) return { days: 0, hours: 0, minutes: 0 };

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    return { days, hours, minutes };
  };

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
      <div className="max-w-4xl mx-auto space-y-8">
        {events && events.length > 0 ? (
          events.map((event) => {
            const { month, day, time } = formatDate(event.date);
            const remaining = getRemainingTime(event.registrationDeadline);
            
            return (
              <div
                key={event._id}
                className="group relative pl-8 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-1 before:bg-gradient-to-b before:from-blue-500 before:via-purple-500 before:to-pink-500"
              >
             
                <div className="absolute -left-6 top-4 bg-white rounded-full p-3 border-2 border-blue-500 shadow-lg">
                  <div className="text-center">
                    <div className="text-sm font-bold text-blue-500">{month}</div>
                    <div className="text-xl font-bold text-gray-800">{day}</div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden transform hover:-translate-y-1">
                  <div className="p-6">
                  
                    <div className="flex justify-end mb-2">
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

                 
                    <h2 className="text-2xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors mb-3">
                      {event.name}
                    </h2>

                    
                    <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    
                    <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{time}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2 text-blue-500" />
                        <span className="font-medium">{event.registeredParticipants.length} participants</span>
                      </div>
                    </div>

                    
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-4">
                        <Target className="w-5 h-5 text-red-500" />
                        <div className="grid grid-flow-col gap-3 text-center auto-cols-max">
                          <div className="flex flex-col bg-gray-50 px-3 py-1 rounded-lg">
                            <span className="text-2xl font-bold text-gray-800">{remaining.days}</span>
                            <span className="text-xs text-gray-500">days</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-400 mx-1">:</span>
                          <div className="flex flex-col bg-gray-50 px-3 py-1 rounded-lg">
                            <span className="text-2xl font-bold text-gray-800">{remaining.hours}</span>
                            <span className="text-xs text-gray-500">hours</span>
                          </div>
                          <span className="text-2xl font-bold text-gray-400 mx-1">:</span>
                          <div className="flex flex-col bg-gray-50 px-3 py-1 rounded-lg">
                            <span className="text-2xl font-bold text-gray-800">{remaining.minutes}</span>
                            <span className="text-xs text-gray-500">min</span>
                          </div>
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
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 py-12">
            <p className="text-xl">No events found</p>
            <button 
              onClick={getEvents}
              className="mt-4 text-blue-500 hover:text-blue-600"
            >
              Refresh Events
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;