// import React from 'react';
// import { useParams } from 'react-router-dom';
// import { 
//   Calendar, 
//   Clock, 
//   MapPin, 
//   Tag, 
//   Coins, 
//   Building, 
//   Share2, 
//   Download,
//   Image as ImageIcon,
//   ChevronRight,
//   Users,
//   ArrowRight,
//   Calendar as CalendarIcon,
//   Info
// } from 'lucide-react';
// import api from '../api';

// const EventInfo = () => {
//   const [event, setEvent] = React.useState(null);
//   const [loading, setLoading] = React.useState(true);
//   const [error, setError] = React.useState(null);
//   const { id } = useParams();

//   React.useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const response = await api.get(`/event/${id}`);
//         if (response.data.success) {
//           setEvent(response.data.data);
//         } else {
//           setError(response.data.message || 'Failed to fetch event details');
//         }
//       } catch (err) {
//         setError(err.response?.data?.message || 'Failed to fetch event details');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEvent();
//   }, [id]);

//   const handleShare = () => {
//     if (navigator.share) {
//       navigator.share({
//         title: event.name,
//         text: event.description,
//         url: window.location.href,
//       });
//     } else {
//       navigator.clipboard.writeText(window.location.href);
//       alert('Link copied to clipboard!');
//     }
//   };

//   const formatDate = (dateString) => {
//     const date = new Date(dateString);
    
//     const datePart = date.toLocaleDateString('en-US', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//     });
    
//     const timePart = date.toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: true
//     });

//     return `${datePart} at ${timePart}`;
//   };

//   const formatShortDate = (dateString) => {
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', {
//       month: 'long',
//       day: 'numeric'
//     });
//   };

 
  
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gray-50">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="max-w-2xl mx-auto mt-8 p-6 bg-red-50 border border-red-200 text-red-700 rounded-xl">
//         <p className="font-medium">{error}</p>
//       </div>
//     );
//   }

//   if (!event) return null;

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Hero Banner */}
//       <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
//         {event.eventBanner ? (
//           <img
//             src={`http://localhost:3000/${event.eventBanner.replace(/\\/g, '/')}`}
//             alt={event.name}
//             className="w-full h-full object-cover"
//           />
//         ) : (
//           <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
//             <ImageIcon className="w-20 h-20 text-white/40" />
//           </div>
//         )}
        
//         {/* Overlay Gradient */}
//         <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        
//         {/* Share Button */}
//         <button
//           onClick={handleShare}
//           className="absolute top-6 right-6 p-2.5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200"
//           aria-label="Share event"
//         >
//           <Share2 className="h-5 w-5 text-white" />
//         </button>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20">
//         {/* Event Header Card */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
//           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
//             <div className="flex-1">
//               <div className="flex items-center gap-3 mb-3">
                
//                 <span className="text-sm font-medium text-gray-500">{formatDate(event.date)}</span>
//               </div>
//               <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
              
//               <div className="flex items-center space-x-4">
//                 <img
//                   src={`http://localhost:3000/${event.clubId.clubLogo.replace(/\\/g, '/')}`}
//                   alt={event.clubId.name}
//                   className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
//                 />
//                 <div>
//                   <h3 className="font-medium text-gray-900">{event.clubId.name}</h3>
//                   <p className="text-sm text-gray-500">Event Organizer</p>
//                 </div>
//               </div>
//             </div>
            
//             <div className="flex flex-col">
//               <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2">
//                 Register Now <ArrowRight className="h-4 w-4" />
//               </button>
//               <p className="text-sm text-gray-500 text-center mt-2">
//                 {event.maxParticipants} spots available
//               </p>
//             </div>
//           </div>
//         </div>
        
//         {/* Event Details Grid */}
//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           {/* Left Column: About & Resources */}
//           <div className="lg:col-span-2 space-y-8">
//             {/* About Section */}
//             <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
//               <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
//                 <Info className="h-5 w-5 text-indigo-600" />
//                 About Event
//               </h2>
//               <p className="text-gray-700 leading-relaxed mb-8">{event.description}</p>
              
//               {/* Tags & Departments */}
//               <div className="space-y-8">
//                 {event.tags && event.tags.length > 0 && (
//                   <div>
//                     <div className="flex items-center space-x-2 mb-4">
//                       <Tag className="h-5 w-5 text-indigo-600" />
//                       <span className="font-medium text-lg text-gray-900">Tags</span>
//                     </div>
//                     <div className="flex flex-wrap gap-3">
//                       {event.tags.flatMap((tag, tagIndex) => 
//                         tag.split(',').map((word, wordIndex) => (
//                           <div 
//                             key={`${tagIndex}-${wordIndex}`} 
//                             className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
//                           >
//                             {word.trim()}
//                           </div>
//                         ))
//                       )}
//                     </div>
//                   </div>
//                 )}
                
//                {event.departmentsAllowed && event.departmentsAllowed.length > 0 && (
//   <div className="pt-2">
//     <div className="flex items-center space-x-2 mb-4">
//       <Building className="h-5 w-5 text-indigo-600" />
//       <span className="font-medium text-lg text-gray-900">Departments</span>
//     </div>
//     <div className="flex flex-wrap gap-3">
//       {event.departmentsAllowed.flatMap((dept, index) =>
//         dept.split(",").map((word, idx) => (
//           <div
//             key={`${index}-${idx}`}
//             className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
//           >
//             {word.trim()}
//           </div>
//         ))
//       )}
//     </div>
//   </div>
// )}
//               </div>
//             </div>

//             {/* Resources Section */}
//             {event.attachments && event.attachments.length > 0 && (
//               <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
//                 <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
//                   <Download className="h-5 w-5 text-indigo-600" />
//                   Resources & Documents
//                 </h2>
//                 <div className="grid gap-3">
//                   {event.attachments.map((attachment, index) => (
//                     <a 
//                       key={index}
//                       href={`${import.meta.env.VITE_API_URL}/${attachment}`}
//                       className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 group transition-all"
//                       target="_blank"
//                       rel="noopener noreferrer"
//                     >
//                       <div className="flex items-center space-x-3">
//                         <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
//                           <Download className="h-4 w-4" />
//                         </div>
//                         <span className="font-medium text-gray-900">Attachment {index + 1}</span>
//                       </div>
//                       <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
//                     </a>
//                   ))}
//                 </div>
//               </div>
//             )}
//           </div>
          
//           {/* Right Column: Event Details */}
//           <div className="space-y-8">
//             {/* Key Details Card */}
//             <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
//               <h2 className="text-xl font-bold mb-6 text-gray-900">Event Details</h2>
              
//               <div className="space-y-6">
//                 {/* Date & Time */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
//                     <CalendarIcon className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Date & Time</h3>
//                     <p className="text-gray-600">{formatDate(event.date)}</p>
//                   </div>
//                 </div>
                
//                 {/* Location */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
//                     <MapPin className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Location</h3>
//                     <p className="text-gray-600">{event.venue}</p>
//                     <p className="text-sm text-indigo-600 font-medium mt-1">{event.mode}</p>
//                   </div>
//                 </div>
                
//                 {/* Entry Fee */}
//                 <div className="flex items-start gap-4">
//                   <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
//                     <Coins className="h-5 w-5" />
//                   </div>
//                   <div>
//                     <h3 className="font-medium text-gray-900">Entry Fee</h3>
//                     <p className="text-gray-600">₹{event.fees}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
            
//             {/* Registration Card */}
//             <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-lg p-6 md:p-8">
//               <h2 className="text-xl font-bold mb-6">Registration</h2>
              
//               <div className="space-y-6">
//                 <div className="flex items-center gap-3">
//                   <Calendar className="h-5 w-5 text-indigo-200" />
//                   <div>
//                     <p className="text-sm text-indigo-200">Registration Deadline</p>
//                     <p className="font-medium">{formatDate(event.registrationDeadline)}</p>
//                   </div>
//                 </div>
                
//                 <div className="flex items-center gap-3">
//                   <Users className="h-5 w-5 text-indigo-200" />
//                   <div>
//                     <p className="text-sm text-indigo-200">Participants</p>
//                     <p className="font-medium">{event.maxParticipants} spots available</p>
//                   </div>
//                 </div>
                
//                 <button className="w-full bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 shadow-sm">
//                   Register Now <ArrowRight className="h-4 w-4" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EventInfo;



import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Tag, 
  Coins, 
  Building, 
  Share2, 
  Download,
  Image as ImageIcon,
  ChevronRight,
  Users,
  ArrowRight,
  Calendar as CalendarIcon,
  Info
} from 'lucide-react';
import api from '../api';
import RegistrationModal from '../Pages/RegistrationModal'; 

const EventInfo = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [competition, setCompetition] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/event/${id}`);
        
        if (response.data.success) {
          setEvent(response.data.data);
          
         
          if (response.data.data.eventType === 'COMPETITION') {
            try {
              
              const compResponse = await api.get(`/competition/event/${id}`);
              console.log("competition",compResponse)
              if (compResponse.data.success) {
                setCompetition(compResponse.data.data);
              }
            } catch (compErr) {
              console.error("Failed to fetch competition details:", compErr);
            }
          }
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
    if (!dateString) return 'Date not specified';
    
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
    if (!dateString) return 'Date not specified';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric'
    });
  };

  const openRegistrationModal = () => {
    setIsModalOpen(true);
  };

  const closeRegistrationModal = () => {
    setIsModalOpen(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
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

  const isCompetition = event.eventType === 'COMPETITION';
 
  const competitionId = isCompetition ? competition._id : null;
  console.log("competitionId",competitionId)
  
  const getImageUrl = (path) => {
    if (!path) return null;
    // Remove backslashes and handle potential URL construction issues
    const cleanPath = path.replace(/\\/g, '/');
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/${cleanPath}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden">
        {event.eventBanner ? (
          <img
            src={getImageUrl(event.eventBanner)}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600">
            <ImageIcon className="w-20 h-20 text-white/40" />
          </div>
        )}
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30"></div>
        
        {/* Share Button */}
        <button
          onClick={handleShare}
          className="absolute top-6 right-6 p-2.5 bg-white/10 backdrop-blur-md rounded-full hover:bg-white/20 transition-all duration-200"
          aria-label="Share event"
        >
          <Share2 className="h-5 w-5 text-white" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 pb-20">
        {/* Event Header Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-gray-500">{formatDate(event.date)}</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
              
              {event.clubId && (
                <div className="flex items-center space-x-4">
                  {event.clubId.clubLogo ? (
                    <img
                      src={getImageUrl(event.clubId.clubLogo)}
                      alt={event.clubId.name}
                      className="h-10 w-10 rounded-full object-cover ring-2 ring-gray-100"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center ring-2 ring-gray-100">
                      <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium text-gray-900">{event.clubId.name}</h3>
                    <p className="text-sm text-gray-500">Event Organizer</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex flex-col">
              <button 
                onClick={openRegistrationModal} 
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-2"
              >
                Register Now <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-sm text-gray-500 text-center mt-2">
                {event.maxParticipants} spots available
              </p>
            </div>
          </div>
        </div>
        
        {/* Event Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: About & Resources */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                <Info className="h-5 w-5 text-indigo-600" />
                About Event
              </h2>
              <p className="text-gray-700 leading-relaxed mb-8">{event.description}</p>
              
              {/* Competition Details Section - Added for competition events */}
              {isCompetition && competition && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900">Competition Details</h3>
                  
                  {/* Team Information */}
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Team Information</h4>
                    <p className="text-gray-700">
                      {competition.teamAllowed 
                        ? `Teams of up to ${competition.teamSizeLimit} members are allowed` 
                        : "This is an individual competition"}
                    </p>
                  </div>
                  
                  {/* Rounds */}
                  {competition.rounds && competition.rounds.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Competition Rounds</h4>
                      <div className="space-y-3">
                        {competition.rounds.map((round, index) => (
                          <div key={round._id} className="p-3 bg-gray-50 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <h5 className="font-medium text-gray-900">{round.name}</h5>
                                <p className="text-sm text-gray-600">{round.description}</p>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{formatDate(round.date)}</p>
                                <p className="text-xs text-gray-500">Duration: {round.duration} mins</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Prizes */}
                  {competition.prizes && competition.prizes.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Prizes</h4>
                      <div className="grid gap-3 md:grid-cols-3">
                        {competition.prizes.map((prize) => (
                          <div key={prize._id} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                            <p className="text-sm font-medium text-indigo-600">
                              {prize.position === 1 ? "1st Place" : 
                               prize.position === 2 ? "2nd Place" : 
                               prize.position === 3 ? "3rd Place" : 
                               `${prize.position}th Place`}
                            </p>
                            <p className="text-base font-medium text-gray-900">{prize.reward}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Rules */}
                  {competition.rules && competition.rules.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Rules</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {competition.rules.map((rule, index) => (
                          <li key={index} className="text-gray-700">{rule}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Judges */}
                  {competition.judges && competition.judges.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium text-gray-800 mb-2">Judges</h4>
                      <div className="space-y-3">
                        {competition.judges.map((judge, index) => (
                          <div key={judge._id || index} className="flex items-center space-x-3">
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                              {judge.name.charAt(0)}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{judge.name}</p>
                              <p className="text-sm text-gray-600">{judge.profile}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Evaluation Criteria */}
                  {competition.evaluationCriteria && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2">Evaluation Criteria</h4>
                      <p className="text-gray-700">{competition.evaluationCriteria}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Tags & Departments */}
              <div className="space-y-8">
                {event.tags && event.tags.length > 0 && (
                  <div>
                    <div className="flex items-center space-x-2 mb-4">
                      <Tag className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-lg text-gray-900">Tags</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {event.tags.flatMap((tag, tagIndex) => 
                        typeof tag === 'string' ? 
                          tag.split(',').map((word, wordIndex) => (
                            <div 
                              key={`${tagIndex}-${wordIndex}`} 
                              className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
                            >
                              {word.trim()}
                            </div>
                          ))
                        : null
                      ).filter(Boolean)}
                    </div>
                  </div>
                )}
                
                {event.departmentsAllowed && event.departmentsAllowed.length > 0 && (
                  <div className="pt-2">
                    <div className="flex items-center space-x-2 mb-4">
                      <Building className="h-5 w-5 text-indigo-600" />
                      <span className="font-medium text-lg text-gray-900">Departments</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {event.departmentsAllowed.flatMap((dept, index) =>
                        typeof dept === 'string' ?
                          dept.split(",").map((word, idx) => (
                            <div
                              key={`${index}-${idx}`}
                              className="flex items-center px-4 py-2 bg-indigo-50 text-indigo-700 rounded-full text-sm font-medium shadow-sm hover:shadow transition-all"
                            >
                              {word.trim()}
                            </div>
                          ))
                        : null
                      ).filter(Boolean)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Resources Section */}
            {event.attachments && event.attachments.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
                  <Download className="h-5 w-5 text-indigo-600" />
                  Resources & Documents
                </h2>
                <div className="grid gap-3">
                  {event.attachments.map((attachment, index) => (
                    <a 
                      key={index}
                      href={getImageUrl(attachment)}
                      className="flex items-center justify-between p-4 rounded-xl bg-gray-50 hover:bg-gray-100 group transition-all"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-indigo-100 rounded-lg text-indigo-700">
                          <Download className="h-4 w-4" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {attachment.split('/').pop() || `Attachment ${index + 1}`}
                        </span>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-indigo-600 transition-colors" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          {/* Right Column: Event Details */}
          <div className="space-y-8">
            {/* Key Details Card */}
            <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Event Details</h2>
              
              <div className="space-y-6">
                {/* Date & Time */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                    <CalendarIcon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Date & Time</h3>
                    <p className="text-gray-600">{formatDate(event.date)}</p>
                  </div>
                </div>
                
                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Location</h3>
                    <p className="text-gray-600">{event.venue || 'Not specified'}</p>
                    <p className="text-sm text-indigo-600 font-medium mt-1">{event.mode || 'In-person'}</p>
                  </div>
                </div>
                
                {/* Entry Fee */}
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-indigo-50 rounded-xl text-indigo-700">
                    <Coins className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">Entry Fee</h3>
                    <p className="text-gray-600">₹{event.fees || '0'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Registration Card */}
            <div className="bg-gradient-to-br from-indigo-600 to-violet-600 text-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-xl font-bold mb-6">Registration</h2>
              
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-indigo-200" />
                  <div>
                    <p className="text-sm text-indigo-200">Registration Deadline</p>
                    <p className="font-medium">{formatDate(event.registrationDeadline)}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-indigo-200" />
                  <div>
                    <p className="text-sm text-indigo-200">Participants</p>
                    <p className="font-medium">{event.maxParticipants} spots available</p>
                  </div>
                </div>
                
                <button 
                  onClick={openRegistrationModal}
                  className="w-full bg-white text-indigo-700 hover:bg-indigo-50 px-6 py-3 rounded-xl transition-colors font-medium flex items-center justify-center gap-2 shadow-sm"
                >
                  Register Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      <RegistrationModal
        isOpen={isModalOpen}
        onClose={closeRegistrationModal}
        eventId={id}
        competitionId={competitionId}
        isCompetition={isCompetition}
        eventName={event.name}
      />
    </div>
  );
};

export default EventInfo;