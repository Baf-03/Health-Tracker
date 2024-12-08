// context/AuthContext.js
import { createContext, useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // User state
  const [loading, setLoading] = useState(true); // Loading state

  useEffect(() => {
    const loadUserFromToken = () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const decoded = jwt_decode(token);
          const currentTime = Date.now() / 1000;
          if (decoded.exp < currentTime) {
            // Token has expired
            setUser(null);
            localStorage.removeItem('token');
          } else {
            // Token is valid
            setUser({ id: decoded.userId, email: decoded.email });
          }
        } catch (error) {
          console.error('Invalid token:', error);
          setUser(null);
          localStorage.removeItem('token');
        }
      }
      setLoading(false); // Loading complete
    };

    loadUserFromToken();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
