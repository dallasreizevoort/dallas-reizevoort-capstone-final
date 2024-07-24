import React, { useEffect, useState, useRef } from "react";
import "./Settings.scss";
import SettingsIcon from "../../assets/images/settings_icon_green.png";
import { useNavigate } from "react-router-dom";

function Settings({ accessToken }) {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // need to add logout function
  const handleLogout = () => {
    window.location.reload();
    window.location.href = "/login";
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
          <li onClick={handleSpotifyRedirect}>Go to Spotify</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      )}
    </div>
  );
}

export default Settings;
