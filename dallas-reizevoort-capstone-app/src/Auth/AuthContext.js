import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

function AuthProvider({ children, code }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [authCompleted, setAuthCompleted] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const authenticate = async () => {
      if (!code) {
        setLoading(false);
        setAuthCompleted(true);
        return;
      }

      try {
        console.log("Sending login request with code:", code);
        const response = await axios.post('http://localhost:3001/login', { code }, { withCredentials: true });
        if (response.status === 200) {
          setAuthenticated(true);
          setError(null);
        } else {
          setAuthenticated(false);
          setError("Failed to authenticate");
        }
      } catch (error) {
        console.error("Error during axios.post call to /login:", error);
        setAuthenticated(false);
        setError("Authentication failed");
      } finally {
        setLoading(false);
        setAuthCompleted(true);
      }
    };

    if (!authCompleted) {
      authenticate();
    }
  }, [code, authCompleted]);

  useEffect(() => {
    if (!loading && !authenticated && authCompleted) {
      navigate("/login");
    }
  }, [loading, authenticated, authCompleted, navigate]);

  return (
    <AuthContext.Provider value={{ loading, authenticated, authCompleted, error, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
export default AuthContext;