import React, { useState, useEffect } from 'react';
import axios from 'axios';

import api from '../api'

const EVENT_TYPES = ['WORKSHOP', 'SEMINAR', 'COMPETITION', 'MEETUP', 'CULTURAL', 'TECHNICAL', 'OTHER'];
const EVENT_MODES = ['ONLINE', 'OFFLINE', 'HYBRID'];

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    clubId: '',
    date: '',
    time: '',
    duration: '',
    venue: '',
    tags: [],
    fees: 0,
    maxParticipants: '',
    registrationDeadline: '',
    platformLink: '',
    eventType: '',
    mode: '',
    departmentsAllowed: [],
    eventBanner: null,
    attachments: []
  });

  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [departments] = useState([
    'Computer Science',
    'Electronics',
    'Mechanical',
    'Civil',
    'Electrical',
    'Information Technology'
  ]);

 
  useEffect(() => {
    const fetchClubs = async () => {
      try {
     
        const response = await api.get('/club');
        setClubs(response.data);
      } catch (error) {
        console.error('Failed to fetch clubs:', error);
        setError('Failed to load clubs');
      }
    };

    fetchClubs();
  }, []);

  const validateForm = () => {
    const validationErrors = [];
    
    const eventDate = new Date(formData.date + ' ' + formData.time);
    const deadline = new Date(formData.registrationDeadline);
    
    if (deadline >= eventDate) {
      validationErrors.push('Registration deadline must be before event date');
    }

    if (parseInt(formData.maxParticipants) <= 0) {
      validationErrors.push('Maximum participants must be greater than 0');
    }

    if (parseInt(formData.duration) <= 0) {
      validationErrors.push('Duration must be greater than 0');
    }

    if (formData.departmentsAllowed.length === 0) {
      validationErrors.push('At least one department must be selected');
    }

    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return false;
    }

    return true;
  };

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;

    if (type === 'file') {
      if (name === 'eventBanner') {
        setFormData(prev => ({
          ...prev,
          eventBanner: files[0]
        }));
      } else if (name === 'attachments') {
        setFormData(prev => ({
          ...prev,
          attachments: Array.from(files)
        }));
      }
    } else if (name === 'tags') {
      setFormData(prev => ({
        ...prev,
        tags: value.split(',').map(tag => tag.trim())
      }));
    } else if (name === 'departmentsAllowed') {
      const options = e.target.options;
      const selectedDepts = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) {
          selectedDepts.push(options[i].value);
        }
      }
      setFormData(prev => ({
        ...prev,
        departmentsAllowed: selectedDepts
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const formPayload = new FormData();
      
     
      const eventDateTime = new Date(`${formData.date} ${formData.time}`);
      
  
      Object.keys(formData).forEach(key => {
        if (key === 'date' || key === 'time') {
          return; 
        }
        
        if (key === 'tags' || key === 'departmentsAllowed') {
          formPayload.append(key, JSON.stringify(formData[key]));
        } else if (key === 'eventBanner') {
          if (formData.eventBanner) {
            formPayload.append('eventBanner', formData.eventBanner);
          }
        } else if (key === 'attachments') {
          formData.attachments.forEach(file => {
            formPayload.append('attachments', file);
          });
        } else {
          formPayload.append(key, formData[key]);
        }
      });

    
      formPayload.append('date', eventDateTime.toISOString());

     
      const response = await api.post('/event', formPayload);
      console.log(response);

      setSuccess('Event created successfully and pending approval!');
      
  
      setFormData({
        name: '',
        description: '',
        clubId: '',
        date: '',
        time: '',
        duration: '',
        venue: '',
        tags: [],
        fees: 0,
        maxParticipants: '',
        registrationDeadline: '',
        platformLink: '',
        eventType: '',
        mode: '',
        departmentsAllowed: [],
        eventBanner: null,
        attachments: []
      });

    } catch (error) {
      console.error('Event creation failed:', error);
      setError(error.response?.data?.message || 'Failed to create event');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Event</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Club
            </label>
            <select
              name="clubId"
              value={formData.clubId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Club</option>
              {clubs.map(club => (
                <option key={club._id} value={club._id}>
                  {club.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              rows="4"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Duration (minutes)
            </label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Type
            </label>
            <select
              name="eventType"
              value={formData.eventType}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Event Type</option>
              {EVENT_TYPES.map(type => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mode
            </label>
            <select
              name="mode"
              value={formData.mode}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              <option value="">Select Mode</option>
              {EVENT_MODES.map(mode => (
                <option key={mode} value={mode}>
                  {mode}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Participants
            </label>
            <input
              type="number"
              name="maxParticipants"
              value={formData.maxParticipants}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Deadline
            </label>
            <input
              type="datetime-local"
              name="registrationDeadline"
              value={formData.registrationDeadline}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Platform Link
            </label>
            <input
              type="url"
              name="platformLink"
              value={formData.platformLink}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Fees (₹)
            </label>
            <input
              type="number"
              name="fees"
              value={formData.fees}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              value={formData.tags.join(', ')}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="e.g., technology, coding, workshop"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Departments Allowed
            </label>
            <select
              name="departmentsAllowed"
              multiple
              value={formData.departmentsAllowed}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              required
            >
              {departments.map(dept => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Banner
            </label>
            <input
              type="file"
              name="eventBanner"
              onChange={handleInputChange}
              accept="image/*"
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Attachments
            </label>
            <input
              type="file"
              name="attachments"
              onChange={handleInputChange}
              multiple
              className="w-full px-3 py-2 border border-gray-300 rounded"
            />
        
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-500 text-white py-3 px-4 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
          
          <button
            type="button"
            onClick={() => {
              setFormData({
                name: '',
                description: '',
                clubId: '',
                date: '',
                time: '',
                duration: '',
                venue: '',
                tags: [],
                fees: 0,
                maxParticipants: '',
                registrationDeadline: '',
                platformLink: '',
                eventType: '',
                mode: '',
                departmentsAllowed: [],
                eventBanner: null,
                attachments: []
              });
              setError('');
              setSuccess('');
            }}
            className="px-6 py-3 border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}