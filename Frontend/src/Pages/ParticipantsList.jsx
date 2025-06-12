

import React, { useState, useEffect } from 'react';
import {
  CheckCircle, XCircle, Clock, Users, Calendar, 
  ChevronDown, ChevronUp, Mail, Phone, Building,
  GraduationCap, Search, Filter, RefreshCw, Award,
  User, AlertCircle
} from 'lucide-react';

import api from '../api';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    CONFIRMED: {
      icon: CheckCircle,
      color: 'text-green-600 bg-green-50 border-green-200',
      label: 'Confirmed'
    },
    PENDING: {
      icon: Clock,
      color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
      label: 'Pending'
    },
    CANCELLED: {
      icon: XCircle,
      color: 'text-red-600 bg-red-50 border-red-200',
      label: 'Cancelled'
    }
  };

  const config = statusConfig[status] || statusConfig.PENDING;
  const IconComponent = config.icon;

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium border ${config.color}`}>
      <IconComponent className="w-3 h-3 mr-1" />
      {config.label}
    </span>
  );
};

const ParticipantRow = ({ participant, eventName }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="border-b border-gray-100 hover:bg-gray-50">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center space-x-4 flex-1">
         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm overflow-hidden">
  {participant.image == null ? (
    participant.name.split(' ').map(n => n[0]).join('').substring(0, 2)
  ) : (
    <img 
      src={`http://localhost:3000${participant.image}`} 
      alt="profile"
      className="w-full h-full object-cover"
    />
  )}
</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <h4 className="font-medium text-gray-900 truncate">{participant.name}</h4>
              {participant.isTeamLeader && (
                <span className="inline-flex items-center px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded border border-purple-200">
                  <Award className="w-3 h-3 mr-1" />
                  Leader
                </span>
              )}
              <StatusBadge status={participant.status} />
            </div>
            <p className="text-sm text-gray-600 truncate">{participant.email}</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <div className="hidden md:block text-sm text-gray-600">
            {participant.department}
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 bg-gray-50 border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-3">
            <div className="flex items-center text-sm">
              <Mail className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 text-gray-900">{participant.email}</span>
            </div>
            
           
            
           
            
            <div className="flex items-center text-sm">
              <GraduationCap className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Department:</span>
              <span className="ml-2 text-gray-900">{participant.department}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <User className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Year:</span>
              <span className="ml-2 text-gray-900">{participant.year}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="w-4 h-4 mr-2 text-gray-400" />
              <span className="text-gray-600">Registered:</span>
              <span className="ml-2 text-gray-900">
                {new Date(participant.registrationDate).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const EventSection = ({ event, searchTerm, statusFilter }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  

  const filteredParticipants = event.participants?.filter(participant => {
    const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         participant.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (participant.college && participant.college.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  }) || [];

  if (!event.participants || event.participants.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg mb-4">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-gray-400" />
              {event.eventName}
              <span className="ml-2 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                0 participants
              </span>
            </h3>
          </div>
        </div>
        <div className="p-8 text-center text-gray-500">
          <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
          <p className="text-sm">No participants registered</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg mb-4">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-gray-900 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-gray-400" />
            {event.eventName}
            <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
              {filteredParticipants.length} participants
            </span>
            {filteredParticipants.length !== event.participants.length && (
              <span className="ml-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                of {event.participants.length}
              </span>
            )}
          </h3>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 hover:bg-gray-100 rounded transition-colors"
          >
            {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
      
      {!isCollapsed && (
        <div>
          {filteredParticipants.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No participants match your search</p>
            </div>
          ) : (
            <div>
              {filteredParticipants.map(participant => (
                <ParticipantRow
                  key={participant.userId}
                  participant={participant}
                  eventName={event.eventName}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const ParticipantsList = () => {
  const [clubData, setClubData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const fetchParticipants = async (showRefreshLoader = false) => {
    if (showRefreshLoader) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);
    
    try {
      const response = await api.get('/event/participants');
      setClubData(response.data);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setError(error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const getTotalParticipants = () => {
    return clubData?.eventParticipants?.reduce((total, event) => total + (event.participants?.length || 0), 0) || 0;
  };

  const getFilteredTotalParticipants = () => {
    if (!clubData) return 0;
    
    return clubData.eventParticipants.reduce((total, event) => {
      const filtered = event.participants?.filter(participant => {
        const matchesSearch = participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             participant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             participant.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (participant.college && participant.college.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = statusFilter === 'all' || participant.status === statusFilter;
        
        return matchesSearch && matchesStatus;
      }) || [];
      
      return total + filtered.length;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
          <div className="text-gray-600">Loading participants...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-64">
        <div className="text-center bg-white p-6 border border-gray-200 rounded-lg">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h2 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h2>
          <p className="text-gray-600 mb-3">{error}</p>
          <button
            onClick={() => fetchParticipants()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }


  const filteredTotal = getFilteredTotalParticipants();

  return (
    <div className="max-w-6xl mx-auto p-4">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">
              {clubData?.clubName} - Participants
            </h1>
 
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
       
       

     
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by name, email, college, or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Status</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="PENDING">Pending</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>
        </div>

       
        {(searchTerm || statusFilter !== 'all') && (
          <div className="mt-3 text-sm text-blue-700 bg-blue-50 p-2 rounded">
            Showing {filteredTotal} of {getTotalParticipants()} participants
            {searchTerm && ` matching "${searchTerm}"`}
            {statusFilter !== 'all' && ` with status "${statusFilter}"`}
          </div>
        )}
      </div>

   
      <div className="space-y-4">
        {clubData?.eventParticipants?.map(event => (
          <EventSection 
            key={event.eventId} 
            event={event} 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
          />
        ))}
      </div>

      {getTotalParticipants() === 0 && (
        <div className="text-center py-12 bg-white border border-gray-200 rounded-lg">
          <Users className="w-12 h-12 mx-auto text-gray-300 mb-3" />
          <h2 className="text-lg font-medium text-gray-900 mb-1">No Participants Yet</h2>
          <p className="text-gray-500">Participants will appear here once they register for events</p>
        </div>
      )}
    </div>
  );
};

export default ParticipantsList;