


import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import EditAnnouncement from './EditAnnouncement';
import api from '../api';

const ListAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [clubs, setClubs] = useState({});
  const [creators, setCreators] = useState({});
  const { user } = useContext(AuthContext);
  const baseURL = "http://localhost:3000";
  
  const hasAdminAccess = user && (user.role === 'clubAdmin' || user.role === 'superAdmin');

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await api.get('/announcement');
      const announcementsData = res.data.announcements;
      setAnnouncements(announcementsData);
      
      // Extract unique club IDs from announcements
      const clubIds = [...new Set(announcementsData
        .filter(a => a.club)
        .map(a => a.club))];
      
      // Extract creator IDs from announcements
      const creatorIds = [...new Set(announcementsData
        .filter(a => a.createdBy)
        .map(a => a.createdBy))];
      
      console.log("Club IDs:", clubIds);
      console.log("Creator IDs:", creatorIds);
      
      // Fetch club details
      await fetchClubDetails(clubIds);
      
      // Fetch creator details
      await fetchCreatorDetails(creatorIds);
    } catch (err) {
      console.error('Error fetching announcements', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch club details for showing club names
  const fetchClubDetails = async (clubIds) => {
    try {
      // Fetch club details for each club ID
      const clubsData = {};
      
      // Fetch details for each club and store in clubsData object
      for (const clubId of clubIds) {
        try {
          const response = await api.get(`/club/${clubId}`);
          if (response.data && response.data.data) {
            clubsData[clubId] = response.data.data;
          }
        } catch (err) {
          console.error(`Error fetching details for club ID ${clubId}:`, err);
        }
      }
      
      setClubs(clubsData);
    } catch (err) {
      console.error('Error fetching club details', err);
    }
  };

  const fetchCreatorDetails = async (creatorIds) => {
    try {
      const creatorsData = {};
      
      
      for (const creatorId of creatorIds) {
        try {
         
          const response = await api.get(`/club/${creatorId}/clubs-with-admin-status`);
          if (response.data) {
            creatorsData[creatorId] = response.data;
          }
          console.log(`Creator ${creatorId}:`, response.data);
        } catch (err) {
          console.error(`Error fetching details for creator ID ${creatorId}:`, err);
        }
      }
      
      setCreators(creatorsData);
    } catch (err) {
      console.error('Error fetching creator details', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;
    try {
      await api.delete(`/announcement/${id}`);
      console.log("deleted", `${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert('Error deleting announcement');
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

 
  const isCreator = (announcement) => {
    return user && announcement.createdBy && announcement.createdBy === user._id;
  };

 
  const canModify = (announcement) => {
    return isCreator(announcement) || (user && user.role === 'superAdmin');
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  

 
  const getCreatorClubName = (creatorId) => {
    if (!creators[creatorId] || !creators[creatorId].clubs || creators[creatorId].clubs.length === 0) {
      return null;
    }
    
   
    const adminClub = creators[creatorId].clubs.find(club => club.isClubAdmin);
    
    if (adminClub) {
      return adminClub.clubName;
    }
    
    
    return creators[creatorId].clubs[0].clubName;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center">
          <svg className="w-8 h-8 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"></path>
          </svg>
          <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
        </div>
        
        <div className="flex space-x-3">
          {hasAdminAccess && (
            <a href="/create-announcement" className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              New Announcement
            </a>
          )}
          <button 
            onClick={fetchAnnouncements}
            className="flex items-center bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      ) : announcements.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center border border-gray-100">
          <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <p className="text-gray-500 text-lg">No announcements found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {announcements.map((a) => (
            <div key={a._id} className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md border border-gray-100">
              {editingId === a._id ? (
                <div className="p-6">
                  <EditAnnouncement
                    announcementId={a._id}
                    onUpdated={() => {
                      setEditingId(null);
                      fetchAnnouncements();
                    }}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{a.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                       
                        <div className="flex items-center text-sm text-gray-500">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                          </svg>
                          <span>Posted: {formatDate(a.createdAt)}</span>
                        </div>
                        
                      
                        
                        
                        {a.createdBy && (
                          <div className="flex items-center text-sm text-gray-500">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            
                            {creators[a.createdBy] && getCreatorClubName(a.createdBy) ? (
                              <span className="ml-1 font-semibold">
                                {getCreatorClubName(a.createdBy)}
                              </span>
                            ): <p className='font-semibold'>SuperAdmin</p>}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {canModify(a) && (
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingId(a._id)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit announcement"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDelete(a._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete announcement"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-gray-600 mb-6">{a.description}</p>
                  
                  {a.attachments && a.attachments.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {a.attachments.map((file, index) => {
                        const fixedPath = file.replace(/\\/g, '/');
                        const imageURL = `${baseURL}/${fixedPath}`;
                        const fileName = fixedPath.split('/').pop();
                        const isImage = /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(fileName);

                        return (
                          <div key={index} className="relative group">
                            {isImage ? (
                              <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden bg-gray-50">
                                <img
                                  src={imageURL}
                                  alt=""
                                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5JbWFnZSBOb3QgRm91bmQ8L3RleHQ+PC9zdmc+';
                                    e.target.className = 'w-full h-full object-cover transition-transform duration-300 group-hover:scale-105';
                                  }}
                                />
                              </div>
                            ) : (
                              <div className="aspect-w-16 aspect-h-9 rounded-lg bg-gray-50 flex items-center justify-center">
                                <a
                                  href={imageURL}
                                  download
                                  className="flex items-center justify-center w-full h-full text-blue-600 hover:text-blue-700"
                                >
                                  <div className="text-center">
                                    <svg className="w-8 h-8 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                                    </svg>
                                    <span className="text-sm font-medium">Download File</span>
                                  </div>
                                </a>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ListAnnouncement;