
// // import React, { createContext, useState, useEffect, useCallback } from 'react';
// // import axios from './api';

// // export const AuthContext = createContext();

// // export const AuthProvider = ({ children }) => {
// //   const [user, setUser] = useState(null);
// //   const [loading, setLoading] = useState(true);

// //   const login = useCallback(async (email, password) => {
// //     try {
// //       const response = await axios.post('/auth/login', { email, password });
// //       const userData = response.data.user;
// //       setUser(userData);
// //       localStorage.setItem('token', response.data.token);
      
    
// //       return userData;
// //     } catch (error) {
// //       console.error('Login failed:', error.response?.data?.message || error.message);
// //       throw new Error('Login failed. Please check your credentials.');
// //     }
// //   }, []);

// //   const logout = useCallback(async () => {
// //     try {
// //       await axios.post('/auth/logout');
// //     } catch (error) {
// //       console.error('Logout failed:', error.response?.data?.message || error.message);
// //     } finally {
// //       setUser(null);
// //       localStorage.removeItem('token');
// //     }
// //   }, []);

// //   const fetchUserProfile = useCallback(async () => {
// //     const token = localStorage.getItem('token');
// //     if (token) {
// //       try {
// //         const response = await axios.get('/auth/profile', {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setUser(response.data.user);
// //       } catch (error) {
// //         console.error('Failed to fetch profile:', error.response?.data?.message || error.message);
// //         logout();
// //       }
// //     }
// //     setLoading(false);
// //   }, [logout]);

// //   useEffect(() => {
// //     fetchUserProfile();
// //   }, [fetchUserProfile]);

// //   const value = {
// //     user,
// //     login,
// //     logout,
// //     loading,
// //     role: user?.role
// //   };

// //   return (
// //     <AuthContext.Provider value={value}>
// //       {children}
// //     </AuthContext.Provider>
// //   );
// // };



// import React, { createContext, useState, useEffect, useCallback } from 'react';
// import axios from './api';

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const login = useCallback(async (email, password) => {
//     try {
//       const response = await axios.post('/auth/login', { email, password });

//       console.log('Login response:', response.data);

//       const userData = response.data.user;
//       setUser(userData);
//       localStorage.setItem('token', response.data.token);
//       console.log('Token in localStorage after login:', localStorage.getItem('token'));


//       console.log('User set after login:', userData);

//       return userData;
//     } catch (error) {
//       console.error('Login failed:', error.response?.data?.message || error.message);
//       throw new Error('Login failed. Please check your credentials.');
//     }
//   }, []);

//   const logout = useCallback(async () => {
//     try {
//       await axios.post('/auth/logout');
//     } catch (error) {
//       console.error('Logout failed:', error.response?.data?.message || error.message);
//     } finally {
//       setUser(null);
//       localStorage.removeItem('token');
//     }
//   }, []);

//   const fetchUserProfile = useCallback(async () => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       try {
//         const response = await axios.get('/auth/profile', {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         console.log('Profile response:', response.data);

//         setUser(response.data.user);
//         console.log('User set after fetching profile:', response.data.user);
//       } catch (error) {
//         console.error('Failed to fetch profile:', error.response?.data?.message || error.message);
//         logout();
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       console.log('No token found in localStorage');
//       setLoading(false);
//     }
//   }, [logout]);

//   useEffect(() => {
//     fetchUserProfile();
//   }, [fetchUserProfile]);

//   const value = {
//     user,
//     login,
//     logout,
//     loading,
//     role: user?.role,
//   };

//   return (
//     <AuthContext.Provider value={value}>
//       {children}
//     </AuthContext.Provider>
//   );
// };


import React, { createContext, useState, useEffect, useCallback } from 'react';
import axios from './api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useCallback(async (email, password) => {
    try {
      const response = await axios.post('/auth/login', { email, password });
      
      console.log('Login response:', response.data);
      
      const userData = response.data.user;
      const token = response.data.token;
      
      setUser(userData);
      localStorage.setItem('token', token);
      
      // Consider storing the user in localStorage as well for better persistence
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Token in localStorage after login:', localStorage.getItem('token'));
      console.log('User set after login:', userData);

      return userData;
    } catch (error) {
      console.error('Login failed:', error.response?.data?.message || error.message);
      throw new Error('Login failed. Please check your credentials.');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await axios.post('/auth/logout');
    } catch (error) {
      console.error('Logout failed:', error.response?.data?.message || error.message);
    } finally {
      setUser(null);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, []);

  const fetchUserProfile = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const cachedUser = localStorage.getItem('user');
      
      // First try to set user from localStorage if available
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }
      
      if (token) {
        // Then refresh from server
        const response = await axios.get('/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('Profile response:', response.data);

        const userData = response.data.user;
        setUser(userData);
        
        // Update the cached user
        localStorage.setItem('user', JSON.stringify(userData));
        
        console.log('User set after fetching profile:', userData);
      } else {
        console.log('No token found in localStorage');
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error.response?.data?.message || error.message);
      logout();
    } finally {
      // This finally block should be outside the if condition
      setLoading(false);
    }
  }, [logout]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const value = {
    user,
    login,
    logout,
    loading,
    role: user?.role,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};