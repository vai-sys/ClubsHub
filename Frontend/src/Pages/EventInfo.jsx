


import React from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Tag, 
  Coins, 
  Building, 
  Share2, 
  Download,
  Image as ImageIcon,
  ChevronRight
} from 'lucide-react';
import api from '../api';

const EventInfo = () => {
  const [event, setEvent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const { id } = useParams();

  React.useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${id}`);
        if (response.data.success) {
          setEvent(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch event details');
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch event details');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event.name,
        text: event.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
   
    const datePart = date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

   
    const timePart = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });

    return `${datePart} at ${timePart}`;
  };

  const formatShortDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'UPCOMING':
        return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
      case 'ONGOING':
        return 'bg-green-50 text-green-700 ring-1 ring-green-600/20';
      case 'COMPLETED':
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
      default:
        return 'bg-gray-50 text-gray-700 ring-1 ring-gray-600/20';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl">
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  if (!event) return null;

  console.log("event is",event);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
  
      <div className="relative h-[70vh] bg-gray-900">
        {event.eventBanner ? (
          <img
            src={`http://localhost:3000/${event.eventBanner.replace(/\\/g, '/')}`}
            alt={event.name}
            className="w-full h-full object-cover opacity-80"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <ImageIcon className="w-24 h-24 text-white/30" />
          </div>
        )}
        
     
        <div className="absolute inset-0 bg-black/40 flex flex-col justify-end">
          <div className="max-w-6xl mx-auto px-4 md:px-6 pb-12 w-full">
            <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium mb-4 ${getStatusColor(event.status)}`}>
              {event.status}
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{event.name}</h1>
            
          
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:3000/${event.clubId.clubLogo.replace(/\\/g, '/')}`}
                alt={event.clubId.name}
                className="h-12 w-12 rounded-full object-cover ring-2 ring-white/80"
              />
              <div>
                <h3 className="font-medium text-white">{event.clubId.name}</h3>
                <p className="text-sm text-gray-200">Event Organizer</p>
              </div>
            </div>
          </div>
        </div>
        
        <button
          onClick={handleShare}
          className="absolute top-6 right-6 p-3 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200"
          aria-label="Share event"
        >
          <Share2 className="h-5 w-5 text-white" />
        </button>
      </div>

    
      <div className="max-w-6xl mx-auto px-4 md:px-6 -mt-8 relative z-10 grid gap-6 pb-12">
      
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Calendar, label: 'Date', value: formatShortDate(event.date) },
            { icon: Clock, label: 'Time', value: new Date(event.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }) },
            
            { icon: Coins, label: 'Entry Fee', value: `₹${event.fees}` },
          ].map((item, index) => (
            <div key={index} className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
              <div className="flex items-center space-x-3 mb-2">
                <item.icon className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">{item.label}</span>
              </div>
              <p className="font-semibold text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

     
        <div className="grid md:grid-cols-3 gap-6">
      
          <div className="md:col-span-2 space-y-6">
         
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">About Event</h2>
              <p className="text-gray-700 leading-relaxed mb-6">{event.description}</p>
              
              <div className="space-y-4">
               
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Tag className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Tags</span>
                  </div>
                  {event.tags && event.tags.map((tag, index) => (
  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
    {tag}
  </span>
))}
                </div>
                
             
                <div>
                  <div className="flex items-center space-x-2 mb-3">
                    <Building className="h-4 w-4 text-blue-600" />
                    <span className="font-medium text-gray-900">Departments</span>
                  </div>
                  {event.departmentsAllowed && event.departmentsAllowed.map((dept, index) => (
  <span key={index} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm">
    {typeof dept === 'string' ? dept : dept.type || JSON.stringify(dept)}
  </span>
))}
                </div>
              </div>
            </div>

          
            {event.attachments && event.attachments.length > 0 && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Resources & Documents</h2>
                <div className="grid gap-3">
                  {event.attachments.map((attachment, index) => (
                    <a 
                      key={index}
                      href={`${import.meta.env.VITE_API_URL}/${attachment}`}
                      className="flex items-center justify-between p-4 rounded-lg bg-gray-50 hover:bg-gray-100 group"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-3">
                        <Download className="h-5 w-5 text-blue-600" />
                        <span className="font-medium text-gray-900">Attachment {index + 1}</span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

        
          <div className="space-y-6">
          
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Venue Details</h2>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <span className="font-medium text-gray-900">Location</span>
                    <p className="text-gray-700">{event.venue}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Building className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <span className="font-medium text-gray-900">Mode</span>
                    <p className="text-gray-700">{event.mode}</p>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold mb-4 text-gray-900">Registration</h2>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <span className="text-sm text-gray-600">Registration Deadline</span>
                    <p className="font-medium text-gray-900">{formatDate(event.registrationDeadline)}</p>
                  </div>
                </div>
                
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-medium">
                  Register Now
                </button>
                
                <p className="text-sm text-gray-600 text-center">
                  {event.maxParticipants} spots available
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventInfo;