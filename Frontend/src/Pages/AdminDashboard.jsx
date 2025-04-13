


import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, XCircle, Clock, AlertCircle, Calendar, 
  Users, MapPin, MessageCircle, ChevronDown, ChevronUp,
  Clock3, IndianRupee, Tag, Building, Layers
} from 'lucide-react';
import api from '../api';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
  FACULTY_APPROVED: 'bg-blue-100 text-blue-800 border border-blue-300',
  SUPER_ADMIN_APPROVED: 'bg-green-100 text-green-800 border border-green-300',
  REJECTED: 'bg-red-100 text-red-800 border border-red-300'
};

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[status]}`}>
    {status.replace(/_/g, ' ')}
  </span>
);

const EventMetadata = ({ icon: Icon, label, value, className = '' }) => (
  <div className={`flex items-center space-x-2 ${className}`}>
    <Icon className="w-4 h-4 text-gray-500" />
    <span className="text-sm text-gray-600">{value}</span>
    {label && <span className="text-xs text-gray-500">({label})</span>}
  </div>
);

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
  // console.log("daaata",event.approvalHistory?.find(h => h.role === 'superAdmin')?.approver?.name)

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

const AdminDashboard = () => {
  const [events, setEvents] = useState({ all: [], categorized: {} });
  const [counts, setCounts] = useState({});
  const [activeTab, setActiveTab] = useState('all');
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

  const filteredEvents = (activeTab === 'all' ? events.all : events.categorized[activeTab] || [])
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
          <p className="font-medium">Error loading events</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Event Timeline Dashboard</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <p className="text-gray-600 text-sm">Total Events</p>
          <p className="text-3xl font-bold mt-2">{counts.total || 0}</p>
        </div>
        <div className="bg-blue-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <p className="text-blue-600 text-sm">Faculty Approved</p>
          <p className="text-3xl font-bold mt-2">{counts.facultyApproved || 0}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <p className="text-yellow-600 text-sm">Pending Review</p>
          <p className="text-3xl font-bold mt-2">{counts.pending || 0}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-all">
          <p className="text-red-600 text-sm">Rejected</p>
          <p className="text-3xl font-bold mt-2">{counts.rejected || 0}</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        {['all', 'pending', 'facultyApproved', 'superAdminApproved', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tab.split(/(?=[A-Z])/).join(' ')}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {filteredEvents.map(event => (
          <EventTimelineCard 
            key={event._id}
            event={event}
            isExpanded={expandedEvents.has(event._id)}
            onToggle={() => toggleEventExpansion(event._id)}
          />
        ))}
        
        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
           <p className="text-gray-500">No events found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;