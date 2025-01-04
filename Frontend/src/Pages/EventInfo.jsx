


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, AlertCircle, Link, Tag, Trophy, Monitor, IndianRupee, CalendarClock } from 'lucide-react';
import api from '../api';

const EventInfo = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${id}`);
        setEvent(response.data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleRegister = async () => {
    try {
    //   await api.post(`/event/${id}/register`)
    //   const response = await api.get(`/event/${id}`);
    //   setEvent(response.data.data);
    console.log("register")
    } catch (err) {
      alert('Registration failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8">
        <div className="bg-white p-6 rounded-lg shadow-sm flex items-center gap-2 text-red-600">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!event) return null;

  const getStatusBadge = (status) => {
    const styles = {
      upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
      ongoing: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      completed: 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return `px-3 py-1 rounded-full text-sm font-medium border ${styles[status] || styles.completed}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isRegistrationOpen = () => {
    const deadline = new Date(event.registrationDeadline);
    return new Date() < deadline;
  };

  const getDeadlineStatus = () => {
    const deadline = new Date(event.registrationDeadline);
    const now = new Date();
    const diffTime = Math.abs(deadline - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (now > deadline) return "Registration closed";
    if (diffDays <= 1) return "Last day to register!";
    return `${diffDays} days left to register`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
       
        {event.eventBanner && (
          <div className="mb-6 rounded-xl overflow-hidden shadow-sm">
            <img 
              src={`http://localhost:3000/${event.eventBanner.replace(/\\/g, '/')}`}
              alt={event.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            <div className="flex flex-col gap-8">
           
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-6">
                  {event.ClubId.clubLogo && (
                    <img 
                      src={`http://localhost:3000/${event.ClubId.clubLogo.replace(/\\/g, '/')}`}
                      alt={`${event.ClubId.name} logo`}
                      className="h-20 w-20 object-contain rounded-lg bg-gray-50 p-2"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">{event.title}</h1>
                    <p className="mt-2 text-gray-500 flex items-center gap-2">
                      by {event.ClubId.name}
                      <span className="text-gray-300">•</span>
                      <span className={getStatusBadge(event.status)}>
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </span>
                    </p>
                  </div>
                </div>
                
                {isRegistrationOpen() && (
                  <button
                    onClick={handleRegister}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    Register Now
                  </button>
                )}
              </div>

             
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-3 text-gray-600">
                  <Trophy className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Event Type</p>
                    <p>{event.eventType}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <Monitor className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Mode</p>
                    <p>{event.mode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-gray-600">
                  <IndianRupee className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Registration Fee</p>
                    <p>₹{event.fees}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-gray-600">
                    <Calendar className="h-5 w-5 text-gray-400" />
                    <span>{formatDate(event.date)}</span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <span>{event.duration / 60} hours</span>
                  </div>

                  <div className="flex items-center gap-3 text-gray-600">
                    <CalendarClock className="h-5 w-5 text-gray-400" />
                    <div>
                      <span className="block">Registration Deadline</span>
                      <span className="text-sm text-blue-600 font-medium">{getDeadlineStatus()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  {event.venue && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <span>{event.venue}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 text-gray-600">
                    <Users className="h-5 w-5 text-gray-400" />
                    <span>
                      {event.registeredParticipants.length} / {event.maxParticipants} participants
                    </span>
                  </div>

                  {event.platformLink && (
                    <div className="flex items-center gap-3 text-gray-600">
                      <Link className="h-5 w-5 text-gray-400" />
                      <a href={event.platformLink} className="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">
                        Join Event Platform
                      </a>
                    </div>
                  )}
                </div>
              </div>

             
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">About the Event</h2>
                <p className="text-gray-600 leading-relaxed">{event.description}</p>
              </div>

             
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">About the Club</h2>
                <p className="text-gray-600 leading-relaxed">{event.ClubId.description}</p>
              </div>

             
              <div className="pt-6 border-t border-gray-100">
                <p className="text-sm text-gray-500 mb-2">Event Organizer</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-gray-600 font-medium">
                      {event.createdBy.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{event.createdBy.name}</p>
                    <p className="text-sm text-gray-500">{event.createdBy.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;

