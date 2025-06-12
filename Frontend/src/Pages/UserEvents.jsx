import React from 'react';
import { Calendar, Clock, MapPin, ChevronRight, Loader2, AlertCircle, RefreshCw, Plus } from 'lucide-react';

const UserEvents = ({ events, loading, error, viewMode }) => {
  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    const cleanPath = logoPath.replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <span className="text-gray-600 font-medium text-lg">Loading your events...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="flex items-center justify-center text-red-600 mb-6">
          <AlertCircle className="h-10 w-10 mr-3" />
          <span className="text-xl font-medium">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-medium shadow-lg"
        >
          <RefreshCw className="h-5 w-5 mr-2 inline" />
          Retry
        </button>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <Calendar className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Events Yet</h3>
        <p className="text-gray-500 text-lg mb-8">You haven't registered for any events yet. Start exploring amazing events!</p>
        <button className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <Plus className="h-5 w-5 mr-2 inline" />
          Explore Events
        </button>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
      {events.map((event) => {
        const { date, time } = formatDateTime(event.date);
        const isUpcoming = new Date(event.date) > new Date();
        const clubLogo = event.clubId?.clubLogo;
        
        return (
          <div
            key={event._id}
            className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-blue-300 group transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                {clubLogo ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-md">
                    <img
                      src={getLogoUrl(clubLogo)}
                      alt={`${event.clubId?.name} logo`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center" style={{display: 'none'}}>
                      <User className="h-7 w-7 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <User className="h-7 w-7 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {event.clubId?.name || 'Unknown Club'}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${getEventTypeColor(event.eventType)} flex-shrink-0 shadow-sm`}>
                {event.eventType}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Clock className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">{date} at {time}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-4 w-4 text-green-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {event.mode} • {event.venue}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-sm font-bold text-green-700">Registered</span>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-sm px-4 py-2 rounded-full font-bold border-2 ${
                  isUpcoming 
                    ? 'bg-blue-50 text-blue-700 border-blue-200' 
                    : 'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-blue-100 transition-colors group-hover:bg-blue-100">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserEvents;