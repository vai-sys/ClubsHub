
import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, AlertCircle, Calendar, Users, MapPin, MessageCircle } from 'lucide-react';
import api from '../api';

const STATUS_COLORS = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  FACULTY_APPROVED: 'bg-blue-100 text-blue-800',
  SUPER_ADMIN_APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800'
};

const AdminDashboard = () => {
  const [events, setEvents] = useState({ all: [], categorized: {} });
  const [counts, setCounts] = useState({});
  const [activeTab, setActiveTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkUserRole();
    fetchEventProgress();
  }, []);

  const checkUserRole = async () => {
    try {
      const response = await api.get('/auth/get-user-details');
      setUserRole(response.data.role);
    } catch (err) {
      console.error('Error checking user role:', err);
    }
  };

  const fetchEventProgress = async () => {
    try {
      const response = await api.get('/event/track-progress');
      const { data } = response;
      
      if (data.success) {
        setEvents(data.data);
        setCounts(data.count);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to fetch event progress');
    } finally {
      setLoading(false);
    }
  };

  const TimelineStep = ({ title, status, date, remarks, reviewer, isLast, role }) => {
    const getIcon = () => {
      switch (status) {
        case 'completed':
          return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'rejected':
          return <XCircle className="w-5 h-5 text-red-500" />;
        case 'pending':
          return <Clock className="w-5 h-5 text-yellow-500" />;
        default:
          return <AlertCircle className="w-5 h-5 text-gray-400" />;
      }
    };

    const getStatusColor = () => {
      switch (status) {
        case 'completed':
          return 'border-green-500';
        case 'rejected':
          return 'border-red-500';
        case 'pending':
          return 'border-yellow-500';
        default:
          return 'border-gray-300';
      }
    };

    return (
      <div className="flex items-start">
        <div className="flex flex-col items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 ${getStatusColor()}`}>
            {getIcon()}
          </div>
          {!isLast && <div className="w-0.5 h-24 bg-gray-200" />}
        </div>
        <div className="ml-4 -mt-1 w-full">
          <div className="flex justify-between items-start">
            <h4 className="font-medium text-gray-900">{title}</h4>
            {status !== 'pending' && (
              <span className={`px-3 py-1 rounded-full text-xs ${status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </span>
            )}
          </div>
          {date && (
            <p className="text-sm text-gray-500">
              {new Date(date).toLocaleDateString()} at {new Date(date).toLocaleTimeString()}
            </p>
          )}
          {status !== 'pending' && reviewer && (
            <p className="text-sm text-gray-600 mt-1 flex items-center">
              <Users className="w-4 h-4 mr-1" />
              Reviewed by: <span className="font-medium ml-1">{reviewer}</span>
              {role && <span className="text-gray-500 ml-1">({role})</span>}
            </p>
          )}
          {remarks && (
            <div className="mt-2 bg-gray-50 p-4 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
              <div className="flex items-start space-x-2">
                <MessageCircle className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Remarks from {reviewer || 'Reviewer'}</p>
                  <p className="text-sm text-gray-600">{remarks}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const EventTimelineCard = ({ event }) => {
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
        status: event.progress.facultyApproval.completed 
          ? event.progress.facultyApproval.approved ? 'completed' : 'rejected'
          : 'pending',
        date: event.progress.facultyApproval.date,
        reviewer: event.progress.facultyApproval.reviewer?.name,
        role: 'Faculty',
        remarks: event.progress.facultyApproval.remarks
      },
      {
        title: 'Super Admin Review',
        status: event.progress.superAdminApproval.completed
          ? event.progress.superAdminApproval.approved ? 'completed' : 'rejected'
          : 'pending',
        date: event.progress.superAdminApproval.date,
        reviewer: event.progress.superAdminApproval.reviewer?.name,
        role: 'Super Admin',
        remarks: event.progress.superAdminApproval.remarks
      }
    ];

    return (
      <div className="bg-white rounded-xl shadow-lg mb-6 overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <div className="p-6 pb-4 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
                {event.name}
              </h2>
              <p className="text-gray-600">{event.club?.name}</p>
            </div>
            <span className={`px-4 py-1.5 rounded-full text-sm font-medium ${STATUS_COLORS[event.approvalStatus]}`}>
              {event.approvalStatus.replace(/_/g, ' ')}
            </span>
          </div>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-3 gap-4 mb-8 p-5 bg-gray-50 rounded-xl border border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Event Date</p>
                <p className="font-medium">{new Date(event.date).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-medium">{event.venue}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Participants</p>
                <p className="font-medium">{event.registeredParticipants}</p>
              </div>
            </div>
          </div>

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
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  );
  
  if (error) return (
    <div className="max-w-6xl mx-auto p-8">
      <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
        {error}
      </div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Event Timeline Dashboard</h1>
      
      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <p className="text-gray-600 text-sm">Total Events</p>
          <p className="text-3xl font-bold mt-2">{counts.total}</p>
        </div>
        <div className="bg-yellow-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <p className="text-yellow-600 text-sm">Pending Review</p>
          <p className="text-3xl font-bold mt-2">{counts.pending}</p>
        </div>
        <div className="bg-red-50 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
          <p className="text-red-600 text-sm">Rejected</p>
          <p className="text-3xl font-bold mt-2">{counts.rejected}</p>
        </div>
      </div>

      <div className="flex space-x-4 mb-8">
        {['all', 'pending', 'rejected'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-2.5 rounded-lg transition-all duration-200 font-medium ${
              activeTab === tab 
                ? 'bg-blue-600 text-white shadow-md hover:bg-blue-700' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)} Events
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {activeTab === 'all' 
          ? events.all.map(event => <EventTimelineCard key={event._id} event={event} />)
          : events.categorized[activeTab]?.map(event => <EventTimelineCard key={event._id} event={event} />)
        }
      </div>
    </div>
  );
};

export default AdminDashboard;