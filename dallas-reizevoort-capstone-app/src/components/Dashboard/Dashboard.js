import React, { useContext, useState, useEffect } from "react";
import { useLocation, Routes, Route, Link } from "react-router-dom";
import AuthContext from "../../Auth/AuthContext";
import "./Dashboard.scss";
import Artists from "../Artists/Artists";
import axios from "axios";
import Tracks from "../Tracks/Tracks";
import Genres from "../Genres/Genres";
import RecentlyPlayed from "../RecentlyPlayed/RecentlyPlayed";
import Header from "../Header/Header";
import Playlist from "../Playlist/Playlist";
import Mood from "../Mood/Mood";
import UserMood from "../../assets/images/user_mood.png";
import UserPlaylist from "../../assets/images/add_playlist.png";
import UserStats from "../../assets/images/user_stats.png";
import Footer from "../../components/Footer/Footer";

function Dashboard() {
  const { accessToken } = useContext(AuthContext);
  const [selectedTimeRange, setSelectedTimeRange] = useState("short_term");
  const location = useLocation();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isStatsOptionSelected, setIsStatsOptionSelected] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('http://localhost:3001/top-tracks', { withCredentials: true });
        setData(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = () => {
    setDropdownVisible(!isDropdownVisible);
  };

  const hideDropdown = () => {
    setDropdownVisible(false);
  };

  const handleStatsOptionClick = (option) => {
    setIsStatsOptionSelected(true);
    setSelectedTimeRange(option);
  };

  return (
    <div className="dashboard">
      <Header accessToken={accessToken} />
      <div className="dashboard__content">
        <div className="dashboard__nav">
          <div className="dashboard__icons--container">
            <ul className="dashboard__dropdown-wrapper" onClick={toggleDropdown}>
              <img className="dashboard__icons" src={UserStats} alt="user stats" />
              <li className="dashboard__nav-list">
                Stats <span className="dashboard__nav-list--arrow">&#x25BE;</span>{" "}
              </li>

              {isDropdownVisible && (
                <ul className={`dropdown ${isDropdownVisible ? "active" : ""}`}>
                  <Link to="/dashboard/tracks" onClick={() => handleStatsOptionClick("short_term")}>
                    <li className="dashboard__dropdown--item">Top Tracks</li>
                  </Link>
                  <Link to="/dashboard/artists" onClick={() => handleStatsOptionClick("short_term")}>
                    <li className="dashboard__dropdown--item">Top Artists</li>
                  </Link>
                  <Link to="/dashboard/genres" onClick={() => handleStatsOptionClick("short_term")}>
                    <li className="dashboard__dropdown--item">Top Genres</li>
                  </Link>
                  <Link to="/dashboard/recent">
                    <li className="dashboard__dropdown--item">Recently Played</li>
                  </Link>
                </ul>
              )}
            </ul>
          </div>

          <Link to="/dashboard/mood" onClick={hideDropdown}>
            <div className="dashboard__icons--container">
              <img className="dashboard__icons" src={UserMood} alt="user mood" />
              <li className="dashboard__nav-list">Your Mood</li>
            </div>
          </Link>
          <Link to="/dashboard/playlist" onClick={hideDropdown}>
            <div className="dashboard__icons--container">
              <img className="dashboard__icons" src={UserPlaylist} alt="user playlist" />
              <li className="dashboard__nav-list">Create a Playlist</li>
            </div>
          </Link>
        </div>

        {[
          "/dashboard/tracks",
          "/dashboard/artists",
          "/dashboard/genres",
        ].includes(location.pathname) && (
          <div className="dashboard__btn-wrapper">
            <button
              className={`dashboard__selected-btn ${selectedTimeRange === "short_term" ? "active" : ""}`}
              onClick={() => setSelectedTimeRange("short_term")}
            >
              Past 4 weeks
            </button>
            <button
              className={`dashboard__selected-btn ${selectedTimeRange === "medium_term" ? "active" : ""}`}
              onClick={() => setSelectedTimeRange("medium_term")}
            >
              Past 6 months
            </button>
            <button
              className={`dashboard__selected-btn ${selectedTimeRange === "long_term" ? "active" : ""}`}
              onClick={() => setSelectedTimeRange("long_term")}
            >
              All time
            </button>
          </div>
        )}

        <div className="dashboard__pages">
          <Routes>
            <Route
              path="artists"
              element={<Artists selectedTimeRange={selectedTimeRange} setSelectedTimeRange={setSelectedTimeRange} data={data} />}
            />
            <Route
              path="tracks"
              element={<Tracks selectedTimeRange={selectedTimeRange} setSelectedTimeRange={setSelectedTimeRange} data={data} />}
            />
            <Route
              path="genres"
              element={<Genres selectedTimeRange={selectedTimeRange} setSelectedTimeRange={setSelectedTimeRange} data={data} />}
            />
            <Route
              path="recent"
              element={<RecentlyPlayed data={data} />}
            />
            <Route
              path="playlist"
              element={<Playlist data={data} />}
            />
            <Route
              path="mood"
              element={<Mood data={data} />}
            />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;