import React, { useState, useEffect, useRef } from "react";
import "./Header.scss";
import Settings from "../Settings/Settings";
import { Link } from "react-router-dom";
import spotifyWebApi from "spotify-web-api-node";
import axios from "axios";

function Header( {setPlayingTrackId} ) {
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const blurTimeout = useRef(null);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setIsDropdownVisible(true); // Show dropdown when user types
  };

  const handleBlur = () => {
    // Hide dropdown and clear input after 100ms delay
    blurTimeout.current = setTimeout(() => {
      setIsDropdownVisible(false);
      setSearch("");
      setSearchResults([]); // Clear previous search results
    }, 100);
  };

  const handleDropdownClick = () => {
    // If dropdown is clicked, clear the timeout to prevent hiding
    clearTimeout(blurTimeout.current);
  };

  const handleSongSelect = (track) => {
    const trackId = track.uri.split(':').pop(); // Extract the ID from the URI
    setPlayingTrackId(trackId);
    setIsDropdownVisible(false);
    setSearch("");
    setSearchResults([]);
  };

  const spotifyApi = useRef(
    new spotifyWebApi({
      clientId: process.env.REACT_APP_CLIENT_ID,
    })
  );

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await axios.get('http://localhost:3001/user-profile', {
          withCredentials: true, // Include credentials
        });

        console.log('User profile response:', res); // Debugging line
        if (res.status !== 200) {
          throw new Error('Network response was not ok');
        }

        // Check if the response is JSON
        const contentType = res.headers['content-type'];
        if (!contentType || !contentType.includes('application/json')) {
          throw new TypeError("Oops, we haven't got JSON!");
        }

        const data = res.data;
        console.log('User profile data:', data); // Debugging line
        setUserName(data.display_name);
        if (data.images && data.images.length > 0) {
          const sortedImages = data.images.sort(
            (a, b) => b.width - a.width
          );
          setUserPhoto(sortedImages[0].url);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (!search) {
      setSearchResults([]);
      return;
    }

    let cancel = false;
    const fetchSearchResults = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/search-tracks?query=${encodeURIComponent(search)}`, {
          withCredentials: true, // Include credentials
        });

        console.log('Search tracks response:', res); // Debugging line
        if (cancel) return;
        setSearchResults(
          res.data.map(track => {
            const smallestAlbumImage = track.album.images.reduce(
              (smallest, image) => {
                if (image.height < smallest.height) return image;
                return smallest;
              },
              track.album.images[0]
            );

            return {
              artist: track.artists[0].name,
              title: track.name,
              uri: track.uri,
              albumUrl: smallestAlbumImage.url,
            };
          })
        );
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchSearchResults();

    return () => {
      cancel = true;
    };
  }, [search]);

  return (
    <div className="header">
      <div className="header__wrap-all">
        <div className="header__container">
          <div className="header__settings">
            <div className="header__wrapper">
              <Link to="/login">
                <div
                  className="header__avatar"
                  style={{ backgroundImage: `url(${userPhoto})` }}
                />
              </Link>
              <div className="header__container">
                <h2 className="header__name">Welcome, {userName}</h2>
                <p className="header__text">Let's explore your music</p>
              </div>
            </div>
            <div className="header__settings--mobile">
              <Settings />
            </div>
          </div>
        </div>

        <div className="search">
          <input
            type="text"
            placeholder="Search a song"
            value={search}
            onChange={handleSearchChange}
            onBlur={handleBlur}
            className="search__input"
          />
          {isDropdownVisible && searchResults.length > 0 && (
            <div className="search-dropdown" onMouseDown={handleDropdownClick}>
              {searchResults.map(track => (
                <div
                  key={track.uri}
                  className="search-dropdown__item"
                  onClick={() => handleSongSelect(track)}
                >
                  <div className="search-dropdown__wrapper">
                    <img src={track.albumUrl} style={{ height: "20px", width: "20px" }} alt={track.title} />
                    <div className="search-dropdown__title">{track.title}</div>
                  </div>
                  <div className="search-dropdown__artist">{track.artist}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="header__settings--desktop">
          <Settings />
        </div>
      </div>
    </div>
  );
}

export default Header;