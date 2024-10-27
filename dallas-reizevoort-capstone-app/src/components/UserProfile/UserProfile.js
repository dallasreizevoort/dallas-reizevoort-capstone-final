import React from "react";
import "./UserProfile.scss";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../../Auth/AuthContext";
import { useState, useEffect, useContext } from "react";
import DefaultUser from "../../assets/images/default-user.svg";
import Settings from "../Settings/Settings";
import Footer from "../Footer/Footer";

function UserProfile() {
  const { authCompleted } = useContext(AuthContext);
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (authCompleted) {
      const fetchUserProfile = async () => {
        try {
          const res = await axios.get("http://localhost:3001/user-profile", {
            withCredentials: true,
          });

          console.log("User profile response:", res);
          if (res.status !== 200) {
            console.error("Failed to fetch user profile");
          } else {
            setUserName(res.data.display_name);
            setUserPhoto(res.data.images[0].url);
          }
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };

      fetchUserProfile();
    }
  }, [authCompleted]);

  const handleSpotifyRedirect = () => {
    window.location.href = "https://www.spotify.com/ca-en/account/overview/";
  };


return (
  <div className="user-profile">
    <div className="user-settings">
        <Settings />
    </div>
    <div className="user-info">
      <img src={DefaultUser} alt="User" className="user-info__photo" />
      <h1 className="user-info__name">{userName}</h1>
    </div>
    <div className="user-nav">
        <button
            className="user-nav__button"
            onClick={handleSpotifyRedirect}
            
        > Manage Spotify Account
        </button>
        <button
            className="user-nav__button"
            onClick={() => navigate("/dashboard/medium_term")}
        >
            Privacy Policy
        </button>
        <button
            className="user-nav__button"
            onClick={() => navigate("/dashboard/long_term")}
        >
            Delete Account
        </button>
  </div>
    <Footer />
    </div>
);
};

export default UserProfile;
