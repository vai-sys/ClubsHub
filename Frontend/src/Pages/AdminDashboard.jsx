



import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Clock, AlertCircle,  
  Users, MapPin, MessageCircle, ChevronDown, ChevronUp,
  Clock3, IndianRupee, Tag,  Layers, UserPlus,
  UserCheck, UserX,  Mail, Check, X,User,

  Phone,
  Calendar,
  Building,
  GraduationCap,
  ClipboardList,
} from 'lucide-react';
import api from '../api';
import RegisteredTeam from './RegisteredTeam';
import ParticipantsList from './ParticipantsList'
import JoinRequestsList from './JoinRequestList';


const StatusBadge = ({ status }) => {
  const STATUS_COLORS = {
    PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
    FACULTY_APPROVED: 'bg-blue-100 text-blue-800 border border-blue-300',
    SUPER_ADMIN_APPROVED: 'bg-green-100 text-green-800 border border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border border-red-300',
    APPROVED: 'bg-green-100 text-green-800 border border-green-300',
    REQUESTED: 'bg-purple-100 text-purple-800 border border-purple-300'
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
      {status.replace(/_/g, ' ')}
    </span>
  );
};

const EventMetadata = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Icon className="w-4 h-4 text-gray-500" />
    <span className="text-sm text-gray-600">{value}</span>
    {label && <span className="text-xs text-gray-500">({label})</span>}
  </div>
);

const ActionButton = ({ icon: Icon, label, onClick, variant = 'default' }) => {
  const variants = {
    default: 'bg-gray-100 hover:bg-gray-200 text-gray-700',
    primary: 'bg-blue-600 hover:bg-blue-700 text-white',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-green-600 hover:bg-green-700 text-white'
  };

  return (
    <button
      onClick={onClick}
      className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${variants[variant]}`}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </button>
  );
};

const TimelineStep = ({ title, status, date, remarks, reviewer, isLast, role }) => {
  const [isRemarksExpanded, setIsRemarksExpanded] = useState(false);

  const getStatusDetails = () => {
    switch (status) {
      case 'completed':
        return { icon: CheckCircle, color: 'green', text: 'Approved' };
      case 'rejected':
        return { icon: XCircle, color: 'red', text: 'Rejected' };
      case 'pending':
        return { icon: Clock, color: 'yellow', text: 'Pending' };
      default:
        return { icon: AlertCircle, color: 'gray', text: 'Unknown' };
    }
  };

  const { icon: StatusIcon, color, text } = getStatusDetails();

  return (
    <div className="flex items-start group">
      <div className="flex flex-col items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-${color}-500 
          group-hover:shadow-lg transition-shadow`}>
          <StatusIcon className={`w-5 h-5 text-${color}-500`} />
        </div>
        {!isLast && <div className="w-0.5 h-24 bg-gray-200 group-hover:bg-gray-300 transition-colors" />}
      </div>
      
      <div className="ml-4 -mt-1 w-full">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-medium text-gray-900 group-hover:text-gray-700">{title}</h4>
            {date && (
              <p className="text-sm text-gray-500">
                {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
              </p>
            )}
          </div>
          {status !== 'pending' && (
            <span className={`px-3 py-1 rounded-full text-xs font-medium 
              ${status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {text}
            </span>
          )}
        </div>

        {status !== 'pending' && reviewer && (
          <div className="mt-2 flex items-center space-x-2 text-sm text-gray-600">
            <Users className="w-4 h-4" />
            <span>Reviewed by: <span className="font-medium">{reviewer}</span></span>
            {role && <span className="text-gray-500">({role})</span>}
          </div>
        )}

        {remarks && (
          <div className="mt-3">
            <button
              onClick={() => setIsRemarksExpanded(!isRemarksExpanded)}
              className="flex items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{isRemarksExpanded ? 'Hide Remarks' : 'Show Remarks'}</span>
              {isRemarksExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            
            {isRemarksExpanded && (
              <div className="mt-2 p-4 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-sm text-gray-600">{remarks}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const EventTimelineCard = ({ event, isExpanded, onToggle }) => {
  const getEventTypeIcon = (type) => {
    switch (type) {
      case 'SEMINAR': return Layers;
      case 'WORKSHOP': return Building;
      default: return Tag;
    }
  };

  const EventTypeIcon = getEventTypeIcon(event.eventType);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) return `${remainingMinutes} mins`;
    if (remainingMinutes === 0) return `${hours} hrs`;
    return `${hours} hrs ${remainingMinutes} mins`;
  };

  const steps = [
    {
      title: 'Event Created',
      status: 'completed',
      date: event.createdAt,
      reviewer: event.createdBy?.name,
      role: 'Creator',
      remarks: event.description
    },
    {
      title: 'Faculty Review',
      status: event.approvalHistory?.some(h => h.role === 'facultyCoordinator') ? 'completed' : 'pending',
      date: event.approvalHistory?.find(h => h.role === 'facultyCoordinator')?.date,
      reviewer: event.approvalHistory?.find(h => h.role === 'facultyCoordinator')?.approver?.name,
      role: 'Faculty',
      remarks: event.approvalHistory?.find(h => h.role === 'facultyCoordinator')?.remark
    },
    {
      title: 'Super Admin Review',
      status: event.approvalHistory?.some(h => h.role === 'superAdmin') ? 'completed' : 'pending',
      date: event.approvalHistory?.find(h => h.role === 'superAdmin')?.date,
      reviewer: event.approvalHistory?.find(h => h.role === 'superAdmin')?.approver?.name,
      role: 'Super Admin',
      remarks: event.approvalHistory?.find(h => h.role === 'superAdmin')?.remark
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-all">
      <div className="p-6 cursor-pointer hover:bg-gray-50" onClick={onToggle}>
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <EventTypeIcon className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">{event.name}</h2>
              {isExpanded ? 
                <ChevronUp className="w-5 h-5 text-gray-500" /> : 
                <ChevronDown className="w-5 h-5 text-gray-500" />
              }
            </div>
            <p className="text-gray-600">{event.clubId?.name}</p>
          </div>
          <StatusBadge status={event.approvalStatus} />
        </div>

        <div className="grid grid-cols-3 gap-2 mt-6">
          <EventMetadata icon={Calendar} value={new Date(event.date).toLocaleDateString()} />
          <EventMetadata icon={Clock3} value={formatDuration(event.duration)}  />
          <EventMetadata icon={IndianRupee} value={`${event.fees}`}  />
        </div>

        {event.mode === 'OFFLINE' && (
          <div className="mt-4 flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">{event.venue}</span>
          </div>
        )}
      </div>

      {isExpanded && (
        <div className="p-6 border-t border-gray-100 bg-gray-50">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <TimelineStep
                key={step.title}
                {...step}
                isLast={index === steps.length - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// // ==================== Club Join Request Components ====================
// const JoinRequestCard = ({ request, onApprove, onReject }) => {
//   return (
//     <div className="bg-white rounded-lg shadow p-4 hover:shadow-md transition-shadow">
//       <div className="flex justify-between items-start">
//         <div>
//           <h3 className="font-medium text-gray-900">{request.user.name}</h3>
//           <p className="text-sm text-gray-600">{request.user.email}</p>
//           <div className="mt-2 flex items-center space-x-2 text-sm">
//             <UserPlus className="w-4 h-4 text-gray-500" />
//             <span>Requested on: {new Date(request.requestedAt).toLocaleDateString()}</span>
//           </div>
//         </div>
//         <StatusBadge status={request.status} />
//       </div>
      
//       {request.message && (
//         <div className="mt-3 p-3 bg-gray-50 rounded border border-gray-100">
//           <p className="text-sm text-gray-600">{request.message}</p>
//         </div>
//       )}
      
//       <div className="mt-4 flex space-x-2">
//         <ActionButton 
//           icon={Check} 
//           label="Approve" 
//           variant="success" 
//           onClick={() => onApprove(request._id)} 
//         />
//         <ActionButton 
//           icon={X} 
//           label="Reject" 
//           variant="danger" 
//           onClick={() => onReject(request._id)} 
//         />
//       </div>
//     </div>
//   );
// };

// const ClubJoinRequests = () => {
//   // Demo data for club join requests
//   const [requests, setRequests] = useState([
//     {
//       _id: '1',
//       user: { name: 'John Doe', email: 'john@example.com' },
//       requestedAt: '2023-05-15T10:30:00Z',
//       status: 'REQUESTED',
//       message: 'I would like to join this club to participate in events and contribute to activities.'
//     },
//     {
//       _id: '2',
//       user: { name: 'Jane Smith', email: 'jane@example.com' },
//       requestedAt: '2023-05-18T14:45:00Z',
//       status: 'REQUESTED',
//       message: 'Interested in the technical workshops your club organizes.'
//     },
//     {
//       _id: '3',
//       user: { name: 'Robert Johnson', email: 'robert@example.com' },
//       requestedAt: '2023-05-20T09:15:00Z',
//       status: 'REQUESTED'
//     }
//   ]);

//   const handleApprove = (id) => {
//     setRequests(requests.map(req => 
//       req._id === id ? { ...req, status: 'APPROVED' } : req
//     ));
//   };

//   const handleReject = (id) => {
//     setRequests(requests.map(req => 
//       req._id === id ? { ...req, status: 'REJECTED' } : req
//     ));
//   };

//   return (
//     <div className="space-y-4">
//       <h2 className="text-2xl font-bold mb-4 flex items-center">
//         <Mail className="w-6 h-6 mr-2 text-blue-600" />
//         Club Join Requests
//       </h2>
      
//       {requests.length === 0 ? (
//         <p className="text-gray-500">No pending requests</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {requests.filter(r => r.status === 'REQUESTED').map(request => (
//             <JoinRequestCard 
//               key={request._id}
//               request={request}
//               onApprove={handleApprove}
//               onReject={handleReject}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };






const AdminDashboard = () => {
  const [events, setEvents] = useState({ all: [], categorized: {} });
  const [counts, setCounts] = useState({});
  const [activeTab, setActiveTab] = useState('events');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedEvents, setExpandedEvents] = useState(new Set());
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchEventProgress();
  }, []);

  const fetchEventProgress = async () => {
    try {
      const response = await api.get('/event/track-progress');
      if (response.data.success) {
        setEvents(response.data.data);
        setCounts(response.data.count);
      } else {
        setError(response.data.message || 'Failed to fetch events');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const toggleEventExpansion = (eventId) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  const filteredEvents = (events.all || [])
    .filter(event => 
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.clubId?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-8">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
          <p className="font-medium">Error loading dashboard</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Club Admin Dashboard</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        {[
          { id: 'events', label: 'Events', icon: Calendar },
          { id: 'teams', label: 'Registered Teams', icon: Users },
          { id: 'requests', label: 'Join Requests', icon: UserPlus },
          { id: 'participants', label: 'Participants', icon: ClipboardList }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium flex items-center space-x-2 ${
              activeTab === tab.id 
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      <div className="space-y-8">
        {activeTab === 'events' && (
          <>
            <h2 className="text-2xl font-bold mb-4 flex items-center">
              <Calendar className="w-6 h-6 mr-2 text-blue-600" />
              Event Approval Workflow
            </h2>
            
            {filteredEvents.length === 0 ? (
              <p className="text-gray-500">No events found</p>
            ) : (
              <div className="space-y-6">
                {filteredEvents.map(event => (
                  <EventTimelineCard 
                    key={event._id}
                    event={event}
                    isExpanded={expandedEvents.has(event._id)}
                    onToggle={() => toggleEventExpansion(event._id)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'teams' && <RegisteredTeam/>}
        {activeTab === 'requests' && <JoinRequestsList />}
        {activeTab === 'participants' && <ParticipantsList />}
      </div>
    </div>
  );
};

export default AdminDashboard;