import React, { useEffect, useState, useRef } from "react";
import "./Settings.scss";
import SettingsIcon from "../../assets/images/settings_icon_green.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Settings({ accessToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  
  const handleLogout = () => {
    axios.post('http://localhost:3001/logout', {}, { withCredentials: true })
      .then(response => {
        if (response.status === 200) {
          navigate('/login');
        } else {
          console.error('Failed to logout');
        }
      })
      .catch(error => {
        console.error('Error logging out:', error);
      });
  };

  const handleSpotifyRedirect = () => {
    window.location.href = "https://open.spotify.com";
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const dropdownRef = useRef (null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }
  , [dropdownRef]);

  return (
    <div className="settings">
      <img
        className="settings__icon"
        onClick={toggleDropdown}
        src={SettingsIcon}
        alt="settings"
      />

      {isOpen && (
        <ul className="settings__dropdown" ref={dropdownRef}>
          <li onClick={handleSpotifyRedirect}>Manage</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      )}
    </div>
  );
}

export default Settings;
