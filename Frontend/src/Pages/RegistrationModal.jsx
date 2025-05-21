
    




import { useState, useEffect } from 'react';
import api from '../api';

export default function RegistrationModal({ 
  isOpen, 
  onClose, 
  eventId, 
  competitionId, 
  isCompetition,
  eventName
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [teamName, setTeamName] = useState('');
  const [teamMembers, setTeamMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isTeamCompetition, setIsTeamCompetition] = useState(false);
  const [competitionDetails, setCompetitionDetails] = useState(null);

  useEffect(() => {
    if (isCompetition && competitionId) {
      fetchCompetitionDetails();
    }
  }, [competitionId, isCompetition]);

  const fetchCompetitionDetails = async () => {
    try {
      setLoading(true);
      
      const response = await api.get(`/competition/${competitionId}`);
      
      if (response.data && response.data.success) {
        setCompetitionDetails(response.data.data);
        setIsTeamCompetition(response.data.data.teamAllowed);
      } else {
        setError(response.data?.message || 'Failed to fetch competition details');
      }
    } catch (err) {
      setError('Error fetching competition details');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    if (!query.trim() || query.length < 3) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await api.get(`/auth/search?query=${query}`);
      
      if (response.data && response.data.success) {
        setSearchResults(response.data.data || []);
      } else {
        console.error('Failed to search users:', response.data?.message);
      }
    } catch (err) {
      console.error('Error searching users:', err);
    }
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
   
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };

  const addTeamMember = (user) => {
   
    if (competitionDetails?.teamSizeLimit && 
        teamMembers.length >= competitionDetails.teamSizeLimit - 1) {
      setError(`Team size cannot exceed ${competitionDetails.teamSizeLimit} members (including you)`);
      return;
    }
    
    // Check if user is already in team
    if (teamMembers.some(member => member._id === user._id)) {
      return;
    }
    
    setTeamMembers([...teamMembers, user]);
    setSearchQuery('');
    setSearchResults([]);
  };

  const removeTeamMember = (userId) => {
    setTeamMembers(teamMembers.filter(member => member._id !== userId));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      let url;
      let body = {};

      if (isCompetition) {
        url = `/competition/${competitionId}/register`;

        if (isTeamCompetition) {
          if (!teamName.trim()) {
            setError('Team name is required');
            setLoading(false);
            return;
          }

          // Validate team size
          if (competitionDetails?.teamSizeLimit && 
              teamMembers.length > (competitionDetails.teamSizeLimit - 1)) {
            setError(`Team size cannot exceed ${competitionDetails.teamSizeLimit} members (including you)`);
            setLoading(false);
            return;
          }

          body = {
            teamName,
            teamMembers: teamMembers.map(member => member._id)
          };
        }
      } else {
        url = `/event/${eventId}/register`;
      }

      console.log(`Registering for ${isCompetition ? 'competition' : 'event'} with URL: ${url}`);
      console.log('Request body:', body);

      const response = await api.post(url, body);
      
      console.log('Registration response:', response);

      if (response.data && response.data.success) {
        setSuccess(response.data.message || 'Registration successful!');
        setTimeout(() => onClose(), 2000);
      } else {
        setError(response.data?.message || 'Registration failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Registration failed');
      } else {
        setError('Error processing registration');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            Register for {eventName || (isCompetition ? 'Competition' : 'Event')}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {loading && !competitionDetails && (
          <div className="text-center py-4">Loading...</div>
        )}

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

        <div>
          {isCompetition && isTeamCompetition && (
            <>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Team Name *
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Enter team name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Add Team Members {competitionDetails?.teamSizeLimit ? `(Max: ${competitionDetails.teamSizeLimit - 1})` : ''}
                </label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="Search users by name or email (min 3 characters)"
                />
                
                {searchResults.length > 0 && (
                  <div className="mt-2 border rounded max-h-40 overflow-y-auto">
                    {searchResults.map(user => (
                      <div 
                        key={user._id}
                        className="p-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
                        onClick={() => addTeamMember(user)}
                      >
                        <span>{user.name}</span>
                        <button 
                          type="button"
                          className="text-blue-500 hover:text-blue-700"
                        >
                          Add
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {searchResults.length === 0 && searchQuery.length >= 3 && (
                  <div className="mt-2 text-gray-500">No users found</div>
                )}

                {teamMembers.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-gray-700 text-sm font-bold mb-2">Selected Team Members:</h3>
                    <div className="space-y-2">
                      {teamMembers.map(member => (
                        <div 
                          key={member._id}
                          className="flex justify-between items-center bg-gray-100 p-2 rounded"
                        >
                          <span>{member.name}</span>
                          <button 
                            type="button"
                            onClick={() => removeTeamMember(member._id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div className="mt-6 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Processing...' : 'Register'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}