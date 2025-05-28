

import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../AuthContext';
import EditAnnouncement from './EditAnnouncement';
import api from '../api';
import { 
  Megaphone, 
  Plus, 
  RefreshCw, 
  Edit2, 
  Trash2, 
  Calendar, 
  User, 
  Download, 
  Frown 
} from 'lucide-react';

const ListAnnouncement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState(null);
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
      
      
      const clubIds = [...new Set(announcementsData
        .filter(a => a.club)
        .map(a => a.club))];
      
      
      const creatorIds = [...new Set(announcementsData
        .filter(a => a.createdBy)
        .map(a => a.createdBy))];
      
      console.log("Club IDs:", clubIds);
      console.log("Creator IDs:", creatorIds);
      
     
      await fetchClubDetails(clubIds);
      
      
      await fetchCreatorDetails(creatorIds);
    } catch (err) {
      console.error('Error fetching announcements', err);
    } finally {
      setLoading(false);
    }
  };

 
  const fetchClubDetails = async (clubIds) => {
    try {
     
      const clubsData = {};
      
      
      for (const clubId of clubIds) {
        try {
          const response = await api.get(`/club`);
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

  const handleEdit = (announcement) => {
    setEditingId(announcement._id);
    setEditingData(announcement);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingData(null);
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
          <Megaphone className="w-8 h-8 mr-3 text-blue-600" />
          <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
        </div>
        
        <div className="flex space-x-3">
          {hasAdminAccess && (
            <a href="/create-announcement" className="flex items-center bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md">
              <Plus className="w-5 h-5 mr-2" />
              New Announcement
            </a>
          )}
          <button 
            onClick={fetchAnnouncements}
            className="flex items-center bg-white hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md border border-gray-200"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
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
          <Frown className="w-16 h-16 mx-auto text-gray-300 mb-4" />
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
                    initialData={editingData}
                    onUpdated={() => {
                      setEditingId(null);
                      setEditingData(null);
                      fetchAnnouncements();
                    }}
                    onCancel={handleCancelEdit}
                  />
                </div>
              ) : (
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">{a.title}</h3>
                      <div className="flex flex-wrap gap-3 mt-2">
                       
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>Posted: {formatDate(a.createdAt)}</span>
                        </div>
                        
                        {a.createdBy && (
                          <div className="flex items-center text-sm text-gray-500">
                            <User className="w-4 h-4 mr-1" />
                            
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
                          onClick={() => handleEdit(a)} 
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit announcement"
                        >
                          <Edit2 className="w-5 h-5" />
                        </button>
                        <button 
                          onClick={() => handleDelete(a._id)} 
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete announcement"
                        >
                          <Trash2 className="w-5 h-5" />
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
                                    <Download className="w-8 h-8 mx-auto mb-2 text-gray-400" />
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