
import { useState, useEffect } from "react";
import { Users, User, ArrowRight, Search, Activity, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Clubs = () => {
  const [clubs, setClubs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [hoveredCard, setHoveredCard] = useState(null);
  const navigate = useNavigate();

  const getAllClubs = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/club', {
        credentials: 'include'
      });
      const data = await response.json();
      setClubs(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching clubs:", error);
      setError("Failed to load clubs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getAllClubs();
  }, []);

  const filteredClubs = clubs.filter(club =>
    club.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleClubClick = (clubId) => {
    navigate(`/club/${clubId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 animate-pulse">Discovering amazing clubs...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
        <div className="bg-white/80 backdrop-blur-sm border border-red-100 rounded-xl p-6 shadow-lg">
          <div className="flex items-center text-red-500">
            <AlertCircle className="w-6 h-6 mr-2" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center mb-16">
          <div className="flex items-center gap-3 mb-4 relative">
            <Sparkles className="w-8 h-8 text-blue-600 animate-pulse" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campus Clubs
            </h1>
          </div>
          <p className="text-gray-600 mb-12 text-center max-w-2xl text-lg">
            Discover extraordinary communities, forge lasting friendships, and make your campus journey unforgettable
          </p>
          <div className="relative w-full max-w-2xl group">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search clubs by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-5 rounded-2xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all text-lg bg-white/70 backdrop-blur-sm"
            />
          </div>
        </div>

        {filteredClubs.length === 0 ? (
          <div className="text-center text-gray-500 py-16 bg-white/50 backdrop-blur-sm rounded-2xl">
            <Search className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-xl">No clubs found matching your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredClubs.map((club, index) => (
              <div
                key={index}
                className="group bg-white/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 cursor-pointer"
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => handleClubClick(club._id)}
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={`http://localhost:3000/${club.clubLogo.replace(/\\/g, '/')}`}
                    alt={`${club.name} banner`}
                    className="w-full h-full object-cover transform transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-90"></div>
                  <div className="absolute bottom-6 left-6 right-6">
                    <h2 className="text-2xl font-bold text-white mb-3">{club.name}</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center text-white/90 backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">
                        <Users className="h-4 w-4 mr-2" />
                        <span className="text-sm">{club.clubMembers?.length || 0} members</span>
                      </div>
                      {club.isActive && (
                        <span className="px-3 py-1 rounded-full bg-green-500/30 backdrop-blur-sm text-green-400 text-sm font-medium">
                          Active
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-8">
                  <p className="text-gray-600 mb-8 line-clamp-3 text-lg">
                    {club.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <User className="h-5 w-5" />
                      <div className="flex flex-col">
                        <span className="text-gray-400">Club Admin</span>
                        <span className="font-medium text-gray-700">
                          {club.clubLeadId?.name || "No lead assigned"}
                        </span>
                      </div>
                    </div>
                    
                    <button 
                      className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 group relative overflow-hidden"
                      onClick={(e) => {
                        e.stopPropagation(); 
                        /* Add your join logic here */
                      }}
                    >
                      <span className="relative z-10">Join Club</span>
                      <ArrowRight className="h-4 w-4 ml-2 transform group-hover:translate-x-1 transition-transform relative z-10" />
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Clubs;