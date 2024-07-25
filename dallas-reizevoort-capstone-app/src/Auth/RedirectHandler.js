import React, { useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AuthContext from "./AuthContext";

function RedirectHandler({ code }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { error } = useContext(AuthContext);

  useEffect(() => {
    if (code && !error && !location.pathname.startsWith("/dashboard")) {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete('code');
      window.history.replaceState({}, document.title, newUrl.toString());
      navigate(`/dashboard/tracks`, { replace: true });
    }
  }, [navigate, code, location.pathname, error]);

  return null;
}

export default RedirectHandler;