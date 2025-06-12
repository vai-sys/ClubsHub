import React, { useState, useEffect } from 'react';
import { Users, UserCheck, Calendar, CreditCard, Trophy, User } from 'lucide-react';
import api from "../api"

const StatusBadge = ({ status }) => {
  const statusStyles = {
    PAID: "bg-green-100 text-green-800 border border-green-200",
    PENDING: "bg-yellow-100 text-yellow-800 border border-yellow-200"
  };

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}>
      {status}
    </span>
  );
};

const ProfileImage = ({ src, name, size = "w-8 h-8" }) => {
  const [imageError, setImageError] = useState(false);
  

  const imageUrl = src ? `${src.startsWith('http') ? src : `http://localhost:3000${src}`}` : null;
  
  if (!imageUrl || imageError) {
    return (
      <div className={`${size} rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium`}>
        {name?.charAt(0)?.toUpperCase() || 'U'}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={`${size} rounded-full object-cover border-2 border-white shadow-sm`}
      onError={() => setImageError(true)}
    />
  );
};

const TeamCard = ({ team, event }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-lg hover:border-gray-200 transition-all duration-300 overflow-hidden">
     
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-1">
              <Trophy className="w-5 h-5" />
              <h3 className="font-semibold text-lg">{team.name}</h3>
            </div>
            <p className="text-blue-100 text-sm">
              {team.members?.length || 0} member{team.members?.length !== 1 ? 's' : ''}
            </p>
          </div>
          <StatusBadge status={team.paymentStatus ? "PAID" : "PENDING"} />
        </div>
      </div>

      <div className="p-5">
      
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-800 mb-3 flex items-center">
            <Users className="w-4 h-4 mr-2 text-gray-600" />
            Team Members
          </h4>
          
          {team.members?.length > 0 ? (
            <div className="space-y-3">
              {team.members.map((member, idx) => (
                <div key={idx} className="flex items-center space-x-3 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                  <ProfileImage 
                    src={member.image} 
                    name={member.name}
                    size="w-10 h-10"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {member.name}
                    </p>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span className="capitalize bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                        {member.role}
                      </span>
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                  <UserCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">
              <User className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p className="text-sm">No members found</p>
            </div>
          )}
        </div>

        
        <div className="space-y-3 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>Registered</span>
            </div>
            <span className="text-gray-900 font-medium">
              {team.registeredAt 
                ? new Date(team.registeredAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })
                : "N/A"
              }
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <Trophy className="w-4 h-4" />
              <span>Event</span>
            </div>
            <span className="text-gray-900 font-medium truncate ml-2">
              {team.event?.name || event?.name || "N/A"}
            </span>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2 text-gray-600">
              <CreditCard className="w-4 h-4" />
              <span>Payment</span>
            </div>
            <span className={`font-medium ${team.paymentStatus ? 'text-green-600' : 'text-yellow-600'}`}>
              {team.paymentStatus ? 'Completed' : 'Pending'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const RegisteredTeam = () => {
  const [teams, setTeams] = useState([]);
  const [clubId, setClubId] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get("/auth/profile");
        const clubId = response.data?.user?.clubAffiliations?.[0]?.clubId;
        console.log("clubId:", clubId);
        setClubId(clubId);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchTeams = async () => {
      if (!clubId) return;

      try {
        setLoading(true);
        const response = await api.get(`/event/teams/${clubId}`);
        console.log("Fetched Teams:", response.data.teams);
        setTeams(Array.isArray(response.data.teams) ? response.data.teams : []);
      } catch (error) {
        console.error("Error fetching teams:", error);
        setTeams([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
  }, [clubId]);

  console.log("teams:", teams);

  if (loading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 flex items-center text-gray-800">
          <Users className="w-7 h-7 mr-3 text-blue-600" />
          Registered Teams
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden animate-pulse">
              <div className="bg-gray-300 h-20"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800 flex items-center">
            <Users className="w-8 h-8 mr-3 text-blue-600" />
            Registered Teams
          </h2>
          <p className="text-gray-600 mt-2">
            Manage and view all registered teams for your events
          </p>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teams registered yet</h3>
            <p className="text-gray-500">Teams will appear here once they register for events</p>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-600">
              Showing {teams.length} team{teams.length !== 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teams.map((team) => {
                console.log("Team Data:", team);
                return (
                  <TeamCard key={team._id} team={team} event={team.event} />
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RegisteredTeam;