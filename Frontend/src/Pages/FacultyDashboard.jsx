import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Users, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import api from '../api';

const FacultyDashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState({});

  useEffect(() => {
    fetchPendingEvents();
  }, []);

  const fetchPendingEvents = async () => {
    try {
      const response = await api.get('/event/pending-faculty');
      
      if (!response.data) {
        throw new Error('No data received from server');
      }

      setEvents(response.data.data || []);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch pending events');
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (eventId, approved) => {
    try {
      setError(null);
      const response = await api.put(
        `http://localhost:3000/api/event/${eventId}/faculty-approval`,
        {
          approved,
          remark: remarks[eventId] || ''
        }
      );

      if (response.data.success) {
        setEvents(events.filter(event => event._id !== eventId));
        setRemarks(prev => {
          const newRemarks = { ...prev };
          delete newRemarks[eventId];
          return newRemarks;
        });
      } else {
        throw new Error(response.data.message || 'Failed to process approval');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process approval');
    }
  };

  const formatDateTime = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (err) {
      return 'Invalid date';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="max-w-4xl mx-auto mt-6">
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <h3 className="text-xl font-semibold mb-2">No Pending Events</h3>
          <p className="text-gray-500">There are no events waiting for your approval.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Pending Events</h2>
        <span className="px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
          {events.length} Events Pending
        </span>
      </div>

      {events.map((event) => (
        <div key={event._id} className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-2xl font-bold">{event.name}</h3>
                <p className="text-lg text-gray-600 mt-2">{event.clubId?.name}</p>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <span className="px-3 py-1 text-sm bg-yellow-100 text-yellow-800 rounded-full">
                  {event.approvalStatus}
                </span>
                <span className="px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full">
                  {event.mode}
                </span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                <span>{formatDateTime(event.date)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <span>Duration: {event.duration} minutes</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-500" />
                <span>{event.venue || event.platformLink || 'Venue not specified'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-500" />
                <span>{event.maxParticipants} Max Participants</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{event.description}</p>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Departments Allowed:</h4>
                <p className="text-gray-700">{event.departmentsAllowed.join(', ')}</p>
              </div>
              
              <div className="mt-4">
                <h4 className="font-semibold mb-1">Registration Deadline:</h4>
                <p className="text-gray-700">{formatDateTime(event.registrationDeadline)}</p>
              </div>
              
              {event.fees > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-1">Registration Fee:</h4>
                  <p className="text-gray-700">₹{event.fees}</p>
                </div>
              )}
            </div>

            <div className="text-sm text-gray-500">
              Created by: {event.createdBy?.name} ({event.createdBy?.email})
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Approval Remarks</h3>
              <textarea
                placeholder="Enter your remarks here..."
                value={remarks[event._id] || ''}
                onChange={(e) => {
                  setRemarks(prev => ({
                    ...prev,
                    [event._id]: e.target.value
                  }));
                }}
                className="w-full min-h-[100px] p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <div className="flex gap-4 justify-end">
                <button
                  onClick={() => handleApproval(event._id, false)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                  Reject
                </button>
                <button
                  onClick={() => handleApproval(event._id, true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                >
                  <CheckCircle className="h-5 w-5" />
                  Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FacultyDashboard;