


import { useParams } from 'react-router-dom';
import { Users, Calendar, Bell, Trophy, Mail, Clock } from "lucide-react";
import { useState, useEffect } from 'react';
import axios from 'axios';

const ClubDetails = () => {
  const { id } = useParams();
  const [club, setClub] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getClubDetails = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:3000/api/club/${id}`, {
        withCredentials: true
      });
      setClub(data.club);
      setError(null);
    } catch (error) {
      setError("Failed to load club details. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClubDetails();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-700 px-6 py-4 rounded-xl">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto px-4 py-12">
      
        <div className="relative mb-16">
          <div className="absolute inset-0 bg-blue-600 rounded-3xl opacity-5"></div>
          <div className="relative flex flex-col md:flex-row gap-8 items-start p-8">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur-lg opacity-20"></div>
              <img
                src={`http://localhost:3000/${club.clubLogo?.replace(/\\/g, '/')}`}
                alt={`${club.name} Logo`}
                className="relative h-40 w-40 rounded-2xl object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-4xl font-bold text-gray-900 mb-4">{club.name}</h1>
                  <div className="flex flex-wrap gap-3">
                    <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-medium border border-blue-100">
                      <Users className="h-4 w-4 text-blue-600 mr-2" />
                      {club.clubMembers?.length || 0} Members
                    </span>
                    {club.isActive && (
                      <span className="inline-flex items-center px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl text-sm font-medium border border-green-100">
                        <Trophy className="h-4 w-4 text-green-600 mr-2" />
                        Active Club
                      </span>
                    )}
                  </div>
                </div>
                <button className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:transform-none text-sm font-medium">
                  Join Club
                </button>
              </div>
              
              <p className="text-gray-600 leading-relaxed text-lg">{club.description}</p>
              
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-xl border border-blue-100">
              
                <Mail className="h-5 w-5 text-blue-600" />

                <a href={`mailto:${club.clubLeadId?.email}`} className="text-blue-600 hover:text-blue-700 font-medium">
                  {club.clubLeadId?.email}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-12">
           
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="group">
                <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 transition-all duration-300 hover:bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">Upcoming Events</h2>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-blue-600/20" />
                      <p className="text-gray-500 text-lg">No upcoming events</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="group">
                <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 transition-all duration-300 hover:bg-white">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
                  <div className="relative">
                    <div className="flex items-center justify-between mb-8">
                      <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
                      <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        View All
                      </button>
                    </div>
                    <div className="text-center py-12">
                      <Bell className="h-16 w-16 mx-auto mb-4 text-blue-600/20" />
                      <p className="text-gray-500 text-lg">No announcements</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
         
            <div className="group">
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 transition-all duration-300 hover:bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="relative">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Club Leadership</h2>
                  <div className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
                    <img
                      src="/api/placeholder/56/56"
                      alt="Club Admin"
                      className="h-14 w-14 rounded-xl object-cover ring-4 ring-white"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900">{club.clubLeadId?.name || "Club Admin"}</h3>
                      <p className="text-gray-500 text-sm">Club Admin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          
            <div className="group">
              <div className="relative p-6 bg-white/80 backdrop-blur-sm rounded-3xl border border-blue-100 transition-all duration-300 hover:bg-white">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-5 transition-opacity"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Club Members</h2>
                    <span className="text-sm text-gray-500">{club.clubMembers?.length || 0} total</span>
                  </div>
                  <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-blue-200 scrollbar-track-transparent">
                    {club.clubMembers?.length > 0 ? (
                      club.clubMembers.map(member => (
                        <div 
                          key={member.student?._id || member._id}
                          className="flex items-center gap-4 p-4 hover:bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl transition-colors"
                        >
                          <img
                            src="/api/placeholder/40/40"
                            alt={member.student?.name || "Member"}
                            className="h-10 w-10 rounded-xl object-cover ring-2 ring-white"
                          />
                          <div>
                            <p className="font-medium text-gray-900">{member.student?.name || "Unknown Member"}</p>
                            <p className="text-sm text-gray-500 capitalize">{member.role}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <Users className="h-16 w-16 mx-auto mb-4 text-blue-600/20" />
                        <p className="text-gray-500 text-lg">No members yet</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClubDetails;