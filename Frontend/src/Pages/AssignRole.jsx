import React, { useState, useEffect } from 'react';
import { User, UserPlus, Check, AlertCircle, Loader, RefreshCw, Building2 } from 'lucide-react';

// Mock API for demonstration
const api = {
  get: async (url) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (url === '/club') {
      return {
        data: {
          clubs: [
            { _id: '1', name: 'Computer Science Club', description: 'Programming and tech discussions' },
            { _id: '2', name: 'Debate Society', description: 'Public speaking and debates' },
            { _id: '3', name: 'Photography Club', description: 'Capturing moments and learning photography' },
            { _id: '4', name: 'Music Club', description: 'Music appreciation and performances' }
          ]
        }
      };
    }
    
    if (url.includes('/auth/eligible-users')) {
      const clubId = url.split('clubId=')[1];
      return {
        data: {
          eligibleUsers: [
            { _id: 'u1', name: 'John Doe', email: 'john@example.com' },
            { _id: 'u2', name: 'Jane Smith', email: 'jane@example.com' },
            { _id: 'u3', name: 'Mike Johnson', email: 'mike@example.com' },
            { _id: 'u4', name: 'Sarah Wilson', email: 'sarah@example.com' }
          ]
        }
      };
    }
    
    throw new Error('Endpoint not found');
  },
  
  post: async (url, data) => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    if (url === '/club/add-member') {
      // Simulate success
      return {
        data: {
          message: 'Role assigned successfully!'
        }
      };
    }
    
    throw new Error('Endpoint not found');
  }
};

const AssignRole = () => {
  const [clubs, setClubs] = useState([]);
  const [selectedClubId, setSelectedClubId] = useState('');
  const [eligibleUsers, setEligibleUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingClubs, setFetchingClubs] = useState(false);
  const [fetchingUsers, setFetchingUsers] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const validRoles = [
    { value: 'member', label: 'Member', description: 'Basic club membership' },
    { value: 'clubAdmin', label: 'Club Admin', description: 'Manage club activities and members' },
    { value: 'facultyCoordinator', label: 'Faculty Coordinator', description: 'Faculty oversight and guidance' },
    { value: 'superAdmin', label: 'Super Admin', description: 'Full system access and control' }
  ];

  useEffect(() => {
    fetchClubs();
  }, []);

  useEffect(() => {
    if (selectedClubId) {
      fetchEligibleUsers();
      // Reset user and role selection when club changes
      setSelectedUserId('');
      setSelectedRole('');
      setMessage('');
    } else {
      setEligibleUsers([]);
      setSelectedUserId('');
      setSelectedRole('');
    }
  }, [selectedClubId]);

  const fetchClubs = async () => {
    try {
      setFetchingClubs(true);
      setMessage('');
      
      const response = await api.get('/club');
      setClubs(response.data.clubs || []);
      
      if (response.data.clubs?.length === 0) {
        setMessage('No clubs found. Please create a club first.');
        setMessageType('info');
      }
    } catch (err) {
      console.error('Error fetching clubs:', err);
      setMessage('Failed to fetch clubs. Please try again.');
      setMessageType('error');
      setClubs([]);
    } finally {
      setFetchingClubs(false);
    }
  };

  const fetchEligibleUsers = async () => {
    try {
      setFetchingUsers(true);
      setMessage('');
      
      const response = await api.get(`/auth/eligible-users?clubId=${selectedClubId}`);
      setEligibleUsers(response.data.eligibleUsers || []);
      
      if (response.data.eligibleUsers?.length === 0) {
        setMessage('No eligible users found for this club.');
        setMessageType('info');
      }
    } catch (err) {
      console.error('Error fetching eligible users:', err);
      setMessage(err.response?.data?.message || 'Failed to fetch eligible users');
      setMessageType('error');
      setEligibleUsers([]);
    } finally {
      setFetchingUsers(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await api.post('/club/add-member', {
        clubId: selectedClubId,
        userId: selectedUserId,
        role: selectedRole
      });

      setMessage(response.data.message || 'Role assigned successfully!');
      setMessageType('success');
      setSelectedUserId('');
      setSelectedRole('');
      
      // Refresh eligible users list
      fetchEligibleUsers();
    } catch (err) {
      console.error('Error assigning role:', err);
      setMessage(err.response?.data?.message || 'Failed to assign role. Please try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const clearMessage = () => {
    setMessage('');
    setMessageType('');
  };

  const canSubmit = selectedClubId && selectedUserId && selectedRole && !loading && eligibleUsers.length > 0;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="flex items-center mb-8">
        <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mr-4">
          <UserPlus className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assign User Role</h1>
          <p className="text-gray-600">Select a club and assign roles to users</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Club Selection */}
        <div className="space-y-2">
          <label className="block text-sm font-semibold text-gray-700">
            Select Club <span className="text-red-500">*</span>
          </label>
          {fetchingClubs ? (
            <div className="flex items-center justify-center py-4 bg-gray-50 rounded-lg">
              <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
              <span className="text-gray-600">Loading clubs...</span>
            </div>
          ) : (
            <div className="relative">
              <select 
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                value={selectedClubId} 
                onChange={(e) => {
                  setSelectedClubId(e.target.value);
                  clearMessage();
                }} 
                required
                disabled={loading || clubs.length === 0}
              >
                <option value="">Choose a club...</option>
                {clubs.map(club => (
                  <option key={club._id} value={club._id}>
                    {club.name}
                  </option>
                ))}
              </select>
              <Building2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          )}
          {clubs.length === 0 && !fetchingClubs && (
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">No clubs available</p>
              <button
                type="button"
                onClick={fetchClubs}
                className="text-yellow-700 hover:text-yellow-900 text-sm font-medium"
              >
                <RefreshCw className="w-4 h-4 inline mr-1" />
                Retry
              </button>
            </div>
          )}
        </div>

        {/* User Selection */}
        {selectedClubId && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select User <span className="text-red-500">*</span>
            </label>
            {fetchingUsers ? (
              <div className="flex items-center justify-center py-4 bg-gray-50 rounded-lg">
                <Loader className="w-5 h-5 animate-spin text-blue-500 mr-2" />
                <span className="text-gray-600">Loading users...</span>
              </div>
            ) : (
              <div className="relative">
                <select 
                  className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all appearance-none"
                  value={selectedUserId} 
                  onChange={(e) => {
                    setSelectedUserId(e.target.value);
                    clearMessage();
                  }} 
                  required
                  disabled={loading || eligibleUsers.length === 0}
                >
                  <option value="">Choose a user...</option>
                  {eligibleUsers.map(user => (
                    <option key={user._id} value={user._id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                <User className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
            )}
            {eligibleUsers.length === 0 && !fetchingUsers && selectedClubId && (
              <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">No eligible users found</p>
                <button
                  type="button"
                  onClick={fetchEligibleUsers}
                  className="text-yellow-700 hover:text-yellow-900 text-sm font-medium"
                >
                  <RefreshCw className="w-4 h-4 inline mr-1" />
                  Refresh
                </button>
              </div>
            )}
          </div>
        )}

        {/* Role Selection */}
        {selectedUserId && (
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Select Role <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 gap-3">
              {validRoles.map(role => (
                <label key={role.value} className="relative">
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={selectedRole === role.value}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      clearMessage();
                    }}
                    className="sr-only"
                    disabled={loading}
                  />
                  <div className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedRole === role.value
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{role.label}</h3>
                        <p className="text-sm text-gray-600">{role.description}</p>
                      </div>
                      {selectedRole === role.value && (
                        <Check className="w-5 h-5 text-blue-600" />
                      )}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-4">
          <button 
            type="submit" 
            className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              canSubmit
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            disabled={!canSubmit}
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 mr-2 animate-spin" />
                Assigning Role...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5 mr-2" />
                Assign Role
              </>
            )}
          </button>
        </div>
      </form>

      {/* Message Display */}
      {message && (
        <div className={`mt-6 p-4 rounded-lg flex items-start ${
          messageType === 'success' 
            ? 'bg-green-50 border border-green-200' 
            : messageType === 'error'
            ? 'bg-red-50 border border-red-200'
            : 'bg-blue-50 border border-blue-200'
        }`}>
          {messageType === 'success' ? (
            <Check className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
          ) : messageType === 'error' ? (
            <AlertCircle className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
          )}
          <div className="flex-1">
            <p className={`text-sm font-medium ${
              messageType === 'success' 
                ? 'text-green-800' 
                : messageType === 'error'
                ? 'text-red-800'
                : 'text-blue-800'
            }`}>
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignRole;