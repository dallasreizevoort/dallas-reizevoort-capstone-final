import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children, code }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      if (!code) {
        setLoading(false);
        setAuthCompleted(true);
        return;
      }
    

      try {
        const response = await axios.post('http://localhost:3001/login', { code }, { withCredentials: true });
        setAuthenticated(true);
      } catch (error) {
        console.error("Error during axios.post call to /login:", error);
      
      } finally {
        setLoading(false);
        setAuthCompleted(true);
      }
    };

    authenticate();
  }, [code, navigate]);

  return (
    <AuthContext.Provider value={{ loading, authenticated, authCompleted }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;