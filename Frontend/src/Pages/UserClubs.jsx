import React from 'react';
import { Users2, CalendarDays, Activity, ChevronRight } from 'lucide-react';

const UserClubs = ({ clubs, loading, error, viewMode }) => {
  const getLogoUrl = (logoPath) => {
    if (!logoPath) return null;
    const cleanPath = logoPath.replace(/\\/g, '/');
    return `http://localhost:3000/${cleanPath}`;
  };

  const getRoleColor = (role) => {
    const colors = {
      'member': 'bg-blue-100 text-blue-800 border-blue-200',
      'clubAdmin': 'bg-purple-100 text-purple-800 border-purple-200',
      'admin': 'bg-purple-100 text-purple-800 border-purple-200',
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-green-600 mx-auto mb-4" />
          <span className="text-gray-600 font-medium text-lg">Loading club affiliations...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <div className="flex items-center justify-center text-red-600 mb-6">
          <AlertCircle className="h-10 w-10 mr-3" />
          <span className="text-xl font-medium">{error}</span>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-medium shadow-lg"
        >
          <RefreshCw className="h-5 w-5 mr-2 inline" />
          Retry
        </button>
      </div>
    );
  }

  if (clubs.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-full w-32 h-32 flex items-center justify-center mx-auto mb-8">
          <Users2 className="h-16 w-16 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">No Club Memberships</h3>
        <p className="text-gray-500 text-lg mb-8">You haven't joined any clubs yet. Explore and join clubs to participate in events!</p>
        <button className="px-8 py-3 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl hover:from-green-700 hover:to-teal-700 transition-all duration-300 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1">
          <Plus className="h-5 w-5 mr-2 inline" />
          Explore Clubs
        </button>
      </div>
    );
  }

  return (
    <div className={viewMode === 'grid' ? 'grid gap-6 md:grid-cols-2 lg:grid-cols-3' : 'space-y-6'}>
      {clubs.map((club) => {
        const memberSince = formatDate(club.joinedAt);
        const isAdmin = club.role === 'clubAdmin' || club.role === 'admin' || club.role === 'superAdmin';
        
        return (
          <div
            key={club._id}
            className="bg-white/80 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 hover:border-green-300 group transform hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-start space-x-4 flex-1">
                {club.clubLogo ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-gray-200 flex-shrink-0 shadow-md">
                    <img
                      src={getLogoUrl(club.clubLogo)}
                      alt={`${club.name} logo`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center" style={{display: 'none'}}>
                      <Users2 className="h-7 w-7 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center flex-shrink-0 shadow-md">
                    <Users2 className="h-7 w-7 text-white" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-lg leading-tight mb-2 group-hover:text-green-600 transition-colors">
                    {club.name}
                  </h3>
                  <p className="text-sm text-gray-600 font-medium">
                    {club.category || 'General Club'}
                  </p>
                </div>
              </div>
              <span className={`px-4 py-2 text-xs font-bold rounded-full border-2 ${getRoleColor(club.role)} flex-shrink-0 shadow-sm`}>
                {club.role === 'clubAdmin' ? 'Admin' : club.role === 'superAdmin' ? 'Super Admin' : 'Member'}
              </span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CalendarDays className="h-4 w-4 text-blue-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">Member since {memberSince}</span>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Activity className="h-4 w-4 text-purple-600" />
                </div>
                <span className="text-sm text-gray-700 font-medium">
                  {club.eventsCount || 0} events • {club.membersCount || 0} members
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
                <span className="text-sm font-bold text-green-700">Active</span>
              </div>
              <div className="flex items-center space-x-3">
                {isAdmin && (
                  <span className="text-sm px-4 py-2 rounded-full font-bold bg-purple-50 text-purple-700 border-2 border-purple-200">
                    Admin Privileges
                  </span>
                )}
                <button className="p-2 rounded-lg bg-gray-100 hover:bg-green-100 transition-colors group-hover:bg-green-100">
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default UserClubs;