import React from 'react';
import { UserPlus, CheckCircle, XCircle, PendingClock, ChevronRight, Loader2, AlertCircle, RefreshCw, Plus } from 'lucide-react';

const JoinRequests = ({ joinRequests, loading, error }) => {
  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    const cleanPath = logoPath.replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

  const getStatusColor = (status) => {
    const colors = {
      'approved': 'bg-green-100 text-green-800 border-green-200',
      'pending': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'rejected': 'bg-red-100 text-red-800 border-red-200',
      'active': 'bg-green-100 text-green-800 border-green-200',
      'inactive': 'bg-gray-100 text-gray-600 border-gray-200'
    };
    return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'pending':
        return <PendingClock className="h-5 w-5 text-yellow-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-yellow-600 mx-auto mb-4" />
          <span className="text-gray-600 font-medium text-lg">Loading join requests...</span>
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
          className="px-8 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-colors font-medium shadow-lg"
        >
          <RefreshCw className="h-5 w-5 mr-2 inline" />
          Retry
        </button>
      </div>
    );
  }

  if (joinRequests.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <UserPlus className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Join Requests</h3>
        <p className="text-gray-500 text-lg mb-8">You haven't made any club join requests yet.</p>
        <button className="px-8 py-3 bg-gradient-to-r from-yellow-600 to-amber-600 text-white rounded-xl hover:from-yellow-700 hover:to-amber-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <Plus className="h-5 w-5 mr-2 inline" />
          Join a Club
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {joinRequests.map((request) => (
        <div
          key={request._id}
          className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 group"
        >
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-start space-x-4 flex-1">
              {request.clubId?.clubLogo ? (
                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-md">
                  <img
                    src={getLogoUrl(request.clubId.clubLogo)}
                    alt={`${request.clubId.name} logo`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center" style={{display: 'none'}}>
                    <Users2 className="h-7 w-7 text-white" />
                  </div>
                </div>
              ) : (
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-500 to-amber-600 flex items-center justify-center flex-shrink-0 shadow-md">
                  <Users2 className="h-7 w-7 text-white" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2">
                  {request.clubId?.name || 'Unknown Club'}
                </h3>
                <p className="text-sm text-gray-600 font-medium">
                  Requested on {formatDate(request.requestedAt)}
                </p>
              </div>
            </div>
            <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${getStatusColor(request.status)} flex-shrink-0 shadow-sm`}>
              {request.status}
            </span>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                {getStatusIcon(request.status)}
                <span className="ml-2 text-sm font-medium text-gray-700">
                  {request.status === 'pending' 
                    ? 'Waiting for approval' 
                    : request.status === 'approved' 
                      ? 'Request approved' 
                      : 'Request declined'}
                </span>
              </div>
              
              {request.status === 'approved' && (
                <span className="text-sm px-3 py-1 rounded-full font-medium bg-green-50 text-green-700 border border-green-200">
                  Member since {formatDate(request.processedAt)}
                </span>
              )}
            </div>
            
            <button className="p-2 rounded-lg bg-gray-100 hover:bg-yellow-100 transition-colors">
              <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default JoinRequests;