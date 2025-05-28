import { useParams, useNavigate } from 'react-router-dom';
import { Users, Calendar, Bell, Trophy, Mail, BookOpen, Tag, Clock } from "lucide-react";
import { useState, useEffect, useContext } from 'react';
import { toast } from 'react-toastify';
import { AuthContext } from "../AuthContext.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../api';
import axios from 'axios';

const LoadingSpinner = () => (
  <div className="flex items-center justify-center h-screen bg-gradient-to-br from-violet-50 to-blue-50">
    <div className="relative w-16 h-16">
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 animate-pulse"></div>
      <div className="absolute top-0 left-0 w-full h-full rounded-full border-t-4 border-blue-600 animate-spin"></div>
    </div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-blue-50 p-4">
    <div className="max-w-md w-full bg-white/90 backdrop-blur-lg rounded-2xl p-8 shadow-xl border border-red-100">
      <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <span className="text-2xl">⚠️</span>
      </div>
      <p className="text-center text-red-600 font-medium">{message}</p>
    </div>
  </div>
);

const Badge = ({ icon: Icon, children, color = "blue" }) => {
  const colors = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    green: "bg-emerald-50 text-emerald-700 border-emerald-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200"
  };

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium border ${colors[color]} transition-all hover:scale-105`}>
      <Icon className="h-4 w-4 mr-2" />
      {children}
    </span>
  );
};

const Card = ({ children, title, actionLabel, onAction, gradient = false }) => (
  <div className={`relative overflow-hidden rounded-2xl bg-white/90 backdrop-blur-lg border border-blue-100 shadow-lg transition-all duration-300 hover:shadow-xl ${gradient ? 'bg-gradient-to-br from-blue-50/50 to-violet-50/50' : ''}`}>
    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5 opacity-0 transition-opacity group-hover:opacity-100" />
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
          {title}
        </h2>
        {actionLabel && (
          <button 
            onClick={onAction}
            className="text-blue-600 hover:text-violet-600 text-sm font-medium transition-colors"
          >
            {actionLabel}
          </button>
        )}
      </div>
      {children}
    </div>
  </div>
);

const ClubMemberCard = ({ member }) => (
  <div className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-blue-50/50">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl blur-sm opacity-20" />
      <img
        src="/api/placeholder/48/48"
        alt={member.student?.name || "Member"}
        className="relative w-12 h-12 rounded-xl object-cover ring-2 ring-white"
      />
    </div>
    <div className="flex-1">
      <p className="font-medium text-gray-900">{member.student?.name || "Unknown Member"}</p>
      <div className="flex items-center gap-2">
        <p className="text-sm text-gray-500 capitalize">{member.role || "Member"}</p>
        <span className="text-gray-300">•</span>
        <p className="text-sm text-gray-500">
          Joined {new Date(member.joinedAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  </div>
);

const LeadershipCard = ({ title, user }) => (
  <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl blur-sm opacity-20" />
      <img
        src="/api/placeholder/48/48"
        alt={user?.name || title}
        className="relative h-16 w-16 rounded-xl object-cover ring-4 ring-white"
      />
    </div>
    <div>
      <h3 className="font-semibold text-gray-900">{user?.name || "Not Assigned"}</h3>
      <p className="text-gray-500 text-sm">{title}</p>
      {user?.email && (
        <a href={`mailto:${user.email}`} className="text-blue-600 hover:text-blue-700 text-sm">
          {user.email}
        </a>
      )}
    </div>
  </div>
);

const AnnouncementCard = ({ announcement }) => {
  
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="p-4 rounded-xl bg-white border border-blue-100 hover:shadow-md transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="flex-shrink-0">
          <Bell className="h-5 w-5 text-blue-500" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{announcement.title}</h3>
          <p className="text-xs text-gray-500">
            {formatDate(announcement.createdAt || announcement.updatedAt)}
            {announcement.createdBy?.name ? ` • By ${announcement.createdBy.name}` : ''}
          </p>
        </div>
      </div>
      <p className="text-gray-600 text-sm line-clamp-3">{announcement.description}</p>
    </div>
  );
};

const ClubDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [club, setClub] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [error, setError] = useState(null);
  const [joinRequestStatus, setJoinRequestStatus] = useState('idle');
  const { user } = useContext(AuthContext);
  const [isMember, setIsMember] = useState(false);

  const getUserIdfromMail = async (email) => {
    try {
      const response = await api.get('/auth/get-user-details');
      return response.data?.user._id || null;
    } catch (error) {
      console.error("Error fetching user details:", error);
      return null;
    }
  };

  useEffect(() => {
    const getClubDetails = async () => {
      if (!id) {
        setError("Club ID is required");
        setIsLoading(false);
        return;
      }
    
      try {
        const response = await api.get(`/club`);
        console.log("club data",response)
        const clubs = response.data;
    
        if (!clubs || !Array.isArray(clubs)) {
          throw new Error('No club data received or invalid structure');
        }
    
        const clubData = clubs.find(club => club._id === id);
    
        if (!clubData) {
          throw new Error('Club not found');
        }
    
        setClub({
          _id: clubData._id,
          name: clubData.name || 'Unnamed Club',
          description: clubData.description || '',
          clubLogo: clubData.clubLogo || null,
          clubMembers: clubData.clubMembers || [],
          clubLeadId: clubData.clubLeadId || {},
          facultyCoordinater: clubData.facultyCoordinater || {},
          isActive: !!clubData.isActive,
          clubCategory: clubData.clubCategory || 'Uncategorized',
          createdAt: clubData.createdAt || new Date().toISOString(),
        });

        
        if (user) {
          const userId = await getUserIdfromMail(user.email);
          setIsMember(clubData.clubMembers?.some(member => member._id === userId));
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load club details");
      } finally {
        setIsLoading(false);
      }
    };

    getClubDetails();
  }, [id, user]);


  useEffect(() => {
    const fetchAnnouncements = async () => {
      if (!id) return;
      
      setIsLoadingAnnouncements(true);
      try {
       
        const response = await api.get(`/announcement/club/${id}`);
        console.log(response)
        
       
        if (response.data && response.data.data) {
          setAnnouncements(response.data.data);
          
    
          console.log("Fetched announcements:", response.data.data);
        } else {
          console.log("No announcements found in response:", response.data);
          setAnnouncements([]);
        }
      } catch (err) {
        console.error("Failed to fetch announcements:", err);
        toast.error("Failed to load announcements");
        setAnnouncements([]);
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };

    if (club) {
      fetchAnnouncements();
    }
  }, [id, club]);

  const handleJoinRequest = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (isMember) {
      toast.info("You are already a member of this club!");
      return;
    }

    try {
      setJoinRequestStatus('pending');
      const userId = await getUserIdfromMail(user.email);
      
      const response = await api.post(`/club/${id}/join-request`, {
        userId
      });

      if (response.data.success) {
        setJoinRequestStatus('success');
        toast.success("Join request sent successfully!");
      }
    } catch (error) {
      console.error('Error sending join request:', error);
      if (error.response?.status === 409) {
        setJoinRequestStatus('error');
        toast.warning("You have already sent a join request to this club.");
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to send join request';
        setJoinRequestStatus('error');
        toast.error(errorMessage);
      }
    }
  };

  const getJoinButtonState = () => {
    if (isMember) {
      return {
        text: 'Member',
        disabled: true,
        className: 'bg-green-500'
      };
    }

    switch (joinRequestStatus) {
      case 'pending':
        return {
          text: 'Sending Request...',
          disabled: true,
          className: 'bg-gray-400'
        };
      case 'success':
        return {
          text: 'Request Sent',
          disabled: true,
          className: 'bg-green-500'
        };
      case 'error':
        return {
          text: 'Try Again',
          disabled: false,
          className: 'bg-red-500 hover:bg-red-600'
        };
      default:
        return {
          text: 'Join Club',
          disabled: false,
          className: 'bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700'
        };
    }
  };

  const viewAllAnnouncements = () => {
   navigate("/announcement")
  };

  if (isLoading) return <LoadingSpinner />;
  if (error || !club) return <ErrorDisplay message={error || "Club not found"} />;

  const buttonState = getJoinButtonState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-lg border border-blue-100 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5" />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {club?.clubLogo && (
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-400 rounded-2xl blur-lg opacity-20 transition-opacity group-hover:opacity-30" />
                  <img
                    src={`http://localhost:3000/${club.clubLogo?.replace(/\\/g, '/')}`}
                    alt={`${club.name} Logo`}
                    className="relative h-40 w-40 rounded-2xl object-cover ring-4 ring-white shadow-lg transition-transform group-hover:scale-105"
                    onError={(e) => {
                      e.target.src = '/api/placeholder/160/160';
                      e.target.alt = 'Default Club Logo';
                    }}
                  />
                </div>
              )}
              
              <div className="flex-1 space-y-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-violet-600 bg-clip-text text-transparent">
                      {club.name}
                    </h1>
                    <div className="flex flex-wrap gap-3">
                      <Badge icon={Users} color="blue">
                        {club.clubMembers?.length || 0} Members
                      </Badge>
                      <Badge icon={Tag} color="purple">
                        {club.clubCategory}
                      </Badge>
                      {club.isActive && (
                        <Badge icon={Trophy} color="green">
                          Active Club
                        </Badge>
                      )}
                      <Badge icon={Clock} color="orange">
                        Created {new Date(club.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  
                  <button 
                    className={`px-8 py-4 text-white rounded-xl transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:transform-none text-sm font-medium ${buttonState.className}`}
                    onClick={handleJoinRequest}
                    disabled={buttonState.disabled}
                  >
                    {buttonState.text}
                  </button>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {club.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card 
                title="Upcoming Events"
                actionLabel="View All"
                onAction={() => console.log("View all events")}
              >
                <div className="flex items-center justify-center py-12">
                  <Calendar className="h-16 w-16 text-blue-200" />
                  <p className="text-gray-500 ml-4">No upcoming events</p>
                </div>
              </Card>

              <Card 
                title="Announcements"
                actionLabel="View All"
                onAction={viewAllAnnouncements}
              >
                {isLoadingAnnouncements ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
                  </div>
                ) : announcements && announcements.length > 0 ? (
                  <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                    {announcements.map(announcement => (
                      <AnnouncementCard 
                        key={announcement._id} 
                        announcement={announcement} 
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-12">
                    <Bell className="h-16 w-16 text-blue-200" />
                    <p className="text-gray-500 ml-4">No announcements</p>
                  </div>
                )}
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card title="Club Leadership" gradient={true}>
              <div className="space-y-6">
                <LeadershipCard 
                  title="Club Lead"
                  user={club.clubLeadId}
                />
                <LeadershipCard 
                  title="Faculty Coordinator"
                  user={club.facultyCoordinater}
                />
              </div>
            </Card>

            <Card title="Club Members">
              {club.clubMembers?.length > 0 ? (
                <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                  {club.clubMembers.map(member => (
                    <ClubMemberCard 
                      key={member.student?._id || member._id}
                      member={member}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <Users className="h-16 w-16 text-blue-200" />
                  <p className="text-gray-500 ml-4">No members yet</p>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;