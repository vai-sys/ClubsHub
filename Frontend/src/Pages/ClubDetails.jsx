


import { useParams } from 'react-router-dom';
import { Users, Calendar, Bell, Trophy, Mail } from "lucide-react";
import { useState, useEffect } from 'react';
import api from '../api';

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
    purple: "bg-purple-50 text-purple-700 border-purple-200"
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
  <div className="flex items-center gap-4 p-3 rounded-xl transition-all hover:bg-blue-50/50 hover:scale-102">
    <div className="relative">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl blur-sm opacity-20" />
      <img
        src="/api/placeholder/48/48"
        alt={member.student?.name || "Member"}
        className="relative w-12 h-12 rounded-xl object-cover ring-2 ring-white"
      />
    </div>
    <div>
      <p className="font-medium text-gray-900">{member.student?.name || "Unknown Member"}</p>
      <p className="text-sm text-gray-500 capitalize">{member.role || "Member"}</p>
    </div>
  </div>
);

const ClubDetails = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getClubDetails = async () => {
      if (!id) {
        setError("Club ID is required");
        setIsLoading(false);
        return;
      }
    
      try {
        const response = await api.get(`/club/${id}`);
        const clubs = response.data?.clubs;
    
        if (!clubs || !Array.isArray(clubs)) {
          throw new Error('No club data received or invalid structure');
        }
    
        const clubData = clubs.find(club => club._id === id);
    
        if (!clubData) {
          throw new Error('Club not found');
        }
    
        setClub({
          name: clubData.name || 'Unnamed Club',
          description: clubData.description || '',
          clubLogo: clubData.clubLogo || null,
          clubMembers: clubData.clubMembers || [],
          clubLeadId: clubData.clubLeadId || {},
          isActive: !!clubData.isActive,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load club details");
      } finally {
        setIsLoading(false);
      }
    };

    getClubDetails();
  }, [id]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !club) return <ErrorDisplay message={error || "Club not found"} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
        {/* Hero Section */}
        <div className="relative overflow-hidden rounded-3xl bg-white/90 backdrop-blur-lg border border-blue-100 shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-violet-600/5" />
          <div className="relative p-8 md:p-12">
            <div className="flex flex-col md:flex-row gap-8 items-start">
              {/* Club Logo */}
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
              
              {/* Club Info */}
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
                      {club.isActive && (
                        <Badge icon={Trophy} color="green">
                          Active Club
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <button 
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 text-white rounded-xl hover:from-blue-700 hover:to-violet-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:transform-none text-sm font-medium"
                    onClick={() => console.log("Joining club...")}
                  >
                    Join Club
                  </button>
                </div>
                
                <p className="text-gray-600 leading-relaxed text-lg">
                  {club.description}
                </p>
                
                {club.clubLeadId?.email && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-xl border border-blue-100 transition-colors hover:bg-blue-100">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <a href={`mailto:${club.clubLeadId.email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                      {club.clubLeadId.email}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Content Grid */}
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
                onAction={() => console.log("View all announcements")}
              >
                <div className="flex items-center justify-center py-12">
                  <Bell className="h-16 w-16 text-blue-200" />
                  <p className="text-gray-500 ml-4">No announcements</p>
                </div>
              </Card>
            </div>
          </div>

          <div className="space-y-8">
            <Card title="Club Leadership" gradient={true}>
              <div className="flex items-center gap-4 p-4 rounded-xl bg-blue-50/50">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-violet-400 rounded-xl blur-sm opacity-20" />
                  <img
                    src="/api/placeholder/64/64"
                    alt={club.clubLeadId?.name || "Club Admin"}
                    className="relative h-16 w-16 rounded-xl object-cover ring-4 ring-white"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{club.clubLeadId?.name || "Club Admin"}</h3>
                  <p className="text-gray-500 text-sm">Club Admin</p>
                </div>
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