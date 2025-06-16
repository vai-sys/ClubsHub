import React, { useState, useEffect, useContext } from 'react';
import { Users, Calendar, AlertCircle, Loader2 } from 'lucide-react';
import { AuthContext } from '../../AuthContext';
import api from '../../api';

const UserClubAffiliations = () => {
  const { user } = useContext(AuthContext);
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

 useEffect(() => {
  

  const fetchUserClubs = async () => {
    try {
      setLoading(true);
      setError(null);
      const data=await api.get(`auth/profile`);
      console.log(data.data.user._id);

      const response = await api.get(`club/user-club/${data.data.user._id}`);
      setClubs(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Error fetching user clubs:', err);
      setError('Failed to load club affiliations. Please try again.');
      setClubs([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUserClubs();
}, [user]);


  const getStatusColor = (isActive) => {
    return isActive 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-gray-100 text-gray-600 border-gray-200';
  };

  const getRoleColor = (role) => {
    const colors = {
      'member': 'bg-blue-100 text-blue-800 border-blue-200',
      'clubAdmin': 'bg-purple-100 text-purple-800 border-purple-200',
      'superAdmin': 'bg-red-100 text-red-800 border-red-200',
      'facultyCoordinater': 'bg-amber-100 text-amber-800 border-amber-200',
    };
    return colors[role] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };


  if (!user) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Initializing user session...</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading club affiliations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="flex items-center justify-center text-red-600">
          <AlertCircle className="h-6 w-6 mr-2" />
          <span>{error}</span>
        </div>
        <div className="flex justify-center mt-4">
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
  
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Users className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">My Club Affiliations</h2>
            <p className="text-sm text-gray-600">
              Clubs you're affiliated with ({clubs.length} total)
            </p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {!clubs.length ? (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Club Affiliations</h3>
            <p className="text-gray-600">You haven't joined any clubs yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {clubs.map((affiliation, index) => {
              const club = affiliation.clubId;
              
              return (
                <div
                  key={club?._id || index}
                  className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  {/* Club Header */}
                  <div className="h-32 bg-gradient-to-br from-blue-500 to-purple-600 relative overflow-hidden">
                    {club?.clubLogo ? (
                      <img
                        src={club.clubLogo}
                        alt={`${club.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <Users className="h-12 w-12 text-white opacity-80" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(club?.isActive)}`}>
                        {club?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>

                  {/* Club Details */}
                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {club?.name || 'Unknown Club'}
                      </h3>
                      {club?.clubCategory && (
                        <span className="inline-block px-3 py-1 text-sm font-medium text-blue-600 bg-blue-50 rounded-full border border-blue-200">
                          {club.clubCategory}
                        </span>
                      )}
                    </div>

                    {club?.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                        {club.description}
                      </p>
                    )}

                    {/* Membership Details */}
                    <div className="space-y-3 border-t pt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Role:</span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getRoleColor(affiliation.role)}`}>
                          {affiliation.role || 'Member'}
                        </span>
                      </div>

                      {affiliation.joinedDate && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Joined:</span>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-1" />
                            {formatDate(affiliation.joinedDate)}
                          </div>
                        </div>
                      )}

                      {affiliation.status && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Status:</span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full border ${
                            affiliation.status === 'active' 
                              ? 'bg-green-100 text-green-800 border-green-200'
                              : 'bg-yellow-100 text-yellow-800 border-yellow-200'
                          }`}>
                            {affiliation.status}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserClubAffiliations;