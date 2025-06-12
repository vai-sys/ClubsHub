


import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../AuthContext';
import { Menu, X, Bell, User, LogOut, Calendar, Users, Newspaper, Activity, BookOpen } from 'lucide-react';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { logout, user } = useContext(AuthContext); 


  const baseNavItems = [
    { name: 'Events', icon: <Calendar className="w-5 h-5" />, path: '/events' },
    { name: 'Clubs', icon: <Users className="w-5 h-5" />, path: '/clubs' },
    { name: 'Announcements', icon: <Newspaper className="w-5 h-5" />, path: '/announcements' },
  ];


  const studentNavItems = [
    { name: 'My Activity', icon: <Activity className="w-5 h-5" />, path: '/my-activity' },
  ];

 
  const navItems = [
    ...baseNavItems,
   
    ...( user?.role === 'member' ? studentNavItems : [])
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between h-16">
           
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-indigo-600">ClubsHub</span>
              </div>

              
              <div className="hidden md:flex md:ml-6 md:space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50 rounded-md transition-colors duration-200"
                  >
                    {item.icon}
                    <span className="ml-2">{item.name}</span>
                  </Link>
                ))}
              </div>
            </div>

         
            <div className="flex items-center">
              <button className="p-2 text-gray-600 hover:text-indigo-600 rounded-full hover:bg-gray-100">
                <Bell className="h-6 w-6" />
              </button>

            
              <div className="ml-3 relative">
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center p-2 border-2 border-transparent rounded-full hover:bg-gray-100"
                >
                  <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={logout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>

         
              <div className="flex items-center md:hidden ml-4">
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="p-2 rounded-md text-gray-600 hover:text-indigo-600 hover:bg-gray-100"
                >
                  {isMobileMenuOpen ? (
                    <X className="h-6 w-6" />
                  ) : (
                    <Menu className="h-6 w-6" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

   
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center px-4 py-2 text-base font-medium text-gray-700 hover:text-indigo-600 hover:bg-gray-50"
                >
                  {item.icon}
                  <span className="ml-2">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      
      </div>
    </>
  );
};

export default Navbar;