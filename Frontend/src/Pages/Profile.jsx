

import React, { useEffect, useState, useRef } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Camera, LogOut, User, Book, Calendar, Shield, Users, Check, X } from 'lucide-react';

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    department: '',
    year: ''
  });
  const navigate = useNavigate();

  const years = ['First Year', 'Second Year', 'Third Year', 'Fourth Year'];
  const departments = [
    'Computer Science',
    'Information Technology',
    'Computer Science and Business System',
    'Electronic and Telecommunication',
    'Mechanical',
    'Civil',
    'Electrical',
    'Automation Robotics'
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        console.log(response);
        setProfile(response.data.user);
        setFormData({
          name: response.data.user.name || '',
          department: response.data.user.department || '',
          year: response.data.user.year || ''
        });
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/login');
        } else {
          setError('Failed to fetch profile. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await api.put('/auth/update-profile', formData);
      setProfile(response.data.user);
    

      setIsEditing(false);
    } catch (err) {
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleProfilePictureClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
   
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!validTypes.includes(file.type)) {
      setError('Please select a valid image file (JPEG, PNG)');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setError('Image size should be less than 2MB');
      return;
    }
    
    setUploadingImage(true);
    
    try {
      const formData = new FormData();
      formData.append('profilePicture', file);
      
      const response = await api.post('/auth/update-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      
      setProfile(prev => ({
        ...prev,
        image: response.data.user.image
      }));

      console.log("profile",profile)
      
      
      setError('');
    } catch (err) {
      setError('Failed to upload profile picture. Please try again.');
      console.error('Upload failed:', err);
    } finally {
      setUploadingImage(false);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-100">
        <div className="flex flex-col items-center gap-4 bg-white/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl">
          <div className="animate-spin h-8 w-8 text-blue-600">
            <svg className="w-full h-full" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <span className="text-xl font-medium text-blue-600">Loading your profile...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-100 p-4">
        <div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl max-w-md w-full shadow-lg">
          <p className="font-bold text-lg mb-2">Error</p>
          <p>{error}</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gradient-to-tr from-purple-100 via-blue-100 to-pink-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden">
          <div className="relative h-48 bg-white">
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2">
              <div className="relative">
                <div className="w-32 h-32 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                 
                  {profile?.image ? (
                    <img 
                    src={`http://localhost:3000${profile.image}?t=${new Date().getTime()}`} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                  
                  ) : (
                    <User className="w-16 h-16 text-white" />
                  )}
                </div>
                <button 
                  onClick={handleProfilePictureClick}
                  disabled={uploadingImage}
                  className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-50 transition-colors"
                >
                  {uploadingImage ? (
                    <div className="animate-spin w-5 h-5 text-gray-600">
                      <svg className="w-full h-full" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    </div>
                  ) : (
                    <Camera className="w-5 h-5 text-gray-600" />
                  )}
                </button>
                {/* Hidden file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/jpeg,image/png,image/jpg"
                  className="hidden"
                />
              </div>
            </div>
          </div>

          <div className="mt-20 px-8 pb-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900">{profile?.name || 'Welcome!'}</h1>
              <p className="text-gray-500 mt-2">{profile?.email}</p>
            </div>

            {isEditing ? (
              <div className="space-y-6 bg-white/50 rounded-2xl p-6 backdrop-blur-sm">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Department</label>
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-2">Year</label>
                  <select
                    name="year"
                    value={formData.year}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select Year</option>
                    {years.map((year) => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        name: profile.name || '',
                        department: profile.department || '',
                        year: profile.year || ''
                      });
                    }}
                    className="flex-1 bg-gray-100 text-gray-700 px-6 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Book className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Department</p>
                      <p className="font-medium text-gray-900">{profile?.department || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Year</p>
                      <p className="font-medium text-gray-900">{profile?.year || 'Not set'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Role</p>
                      <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                        {profile?.role}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 rounded-2xl p-6 backdrop-blur-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-sm text-gray-500">Club Affiliations</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {profile?.clubAffiliations?.length > 0 ? (
                          profile.clubAffiliations.map((club) => (
                            <span key={club._id || club.clubId} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                              {club.clubName} 
                            </span>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">No club affiliations</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${profile?.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                    <div>
                      <p className="text-sm text-gray-500">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                        profile?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {profile?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex gap-4">
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
                  >
                    Edit Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;