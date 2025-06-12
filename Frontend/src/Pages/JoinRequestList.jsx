import React, { useState, useEffect } from 'react';
import { 
  CheckCircle, 
  XCircle, 
  Mail, 
  Clock, 
  Users,
  Loader2
} from 'lucide-react';
import { useSnackbar } from 'notistack';
import api from '../api';

const JoinRequestsList = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingRequests, setProcessingRequests] = useState(new Set());
  const [clubId, setClubId] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchProfileAndRequests = async () => {
      try {
        const profileResponse = await api.get('/auth/profile');
        const userClubs = profileResponse.data.user.clubAffiliations;
        
        if (userClubs.length === 0) {
          setError("You are not affiliated with any club");
          setLoading(false);
          return;
        }
        
        const clubId = userClubs[0].clubId;
        setClubId(clubId);
        
        const requestsResponse = await api.get(`/club/${clubId}/join-request`);
        setRequests(requestsResponse.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch data');
        enqueueSnackbar(err.response?.data?.message || 'Failed to fetch data', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndRequests();
  }, [enqueueSnackbar]);

  const handleRespond = async (requestId, action) => {
    if (!clubId) return;
    
    setProcessingRequests(prev => new Set(prev).add(requestId));
    
    try {
      const response = await api.post(
        `/club/${clubId}/respond`,
        { requestId, action }
      );

      if (response.data.success) {
        enqueueSnackbar(`Request ${action} successfully`, { variant: 'success' });
        setRequests(requests.map(req =>
          req._id === requestId ? { ...req, status: action, respondedAt: new Date() } : req
        ));
      }
    } catch (err) {
      enqueueSnackbar(err.response?.data?.message || 'Failed to process request', { variant: 'error' });
    } finally {
      setProcessingRequests(prev => {
        const newSet = new Set(prev);
        newSet.delete(requestId);
        return newSet;
      });
    }
  };


  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-gray-600">Loading join requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mt-6">
        <div className="flex items-center space-x-3">
          <XCircle className="w-6 h-6 text-red-600" />
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (!clubId) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 mt-6 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Club Found</h3>
        <p className="text-gray-600">You are not currently an admin of any club.</p>
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 mt-6 text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No Join Requests</h3>
        <p className="text-gray-600">There are currently no pending join requests for your club.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
    
      <div className="mb-8">
        <div className="flex items-center space-x-3 mb-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Join Requests</h1>
        </div>
        <p className="text-gray-600">
          Manage pending membership requests for your club
        </p>
      </div>

     

    
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {requests.map((request, index) => (
          <div
            key={request._id}
            className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 transform hover:-translate-y-1"
            style={{ animationDelay: `${index * 100}ms` }}
          >
          
            <div className="p-6 pb-4">
              <div className="flex items-center space-x-3 mb-4">
                <div className="relative">
                 <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg overflow-hidden">
  {request.userId.image ? (
    <img 
      src={`http://localhost:3000${request.userId.image}`} 
      alt="profile"
      className="w-full h-full "
    />
  ) : (
    request.userId.name.charAt(0).toUpperCase()
  )}
</div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {request.userId.name}
                  </h3>
                   <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {request.userId.department}
                  </h3>
                   <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {request.userId.year}
                  </h3>
                  <div className="flex items-center space-x-1 text-sm text-gray-500">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{request.userId.email}</span>
                  </div>
                </div>
              </div>

         
              <div className="flex items-center justify-between mb-4">
                <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(request.status)}`}>
                  {request.status === 'pending' && <Clock className="w-3 h-3 mr-1" />}
                  {request.status === 'approved' && <CheckCircle className="w-3 h-3 mr-1" />}
                  {request.status === 'rejected' && <XCircle className="w-3 h-3 mr-1" />}
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </span>
              </div>

            
              <div className="flex items-center text-xs text-gray-500 mb-4">
                <Clock className="w-3 h-3 mr-1" />
                <span>Requested {formatDate(request.createdAt || new Date())}</span>
              </div>
            </div>

           
            {request.status === 'pending' && (
              <div className="px-6 pb-6">
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleRespond(request._id, 'approved')}
                    disabled={processingRequests.has(request._id)}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    {processingRequests.has(request._id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        <span>Approve</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleRespond(request._id, 'rejected')}
                    disabled={processingRequests.has(request._id)}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-1"
                  >
                    {processingRequests.has(request._id) ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        <XCircle className="w-4 h-4" />
                        <span>Reject</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          
            {request.status !== 'pending' && request.respondedAt && (
              <div className="px-6 pb-6">
                <div className="text-xs text-gray-500 text-center">
                  Processed on {formatDate(request.respondedAt)}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinRequestsList;