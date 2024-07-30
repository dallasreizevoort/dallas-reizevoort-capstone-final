import React, { useState, useEffect } from "react";
import axios from "axios";
import SpotifyPlayer from "../SpotifyPlayer/SpotifyPlayer";
import { useLocation } from "react-router-dom";
import "./Playlist.scss";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import Create from "../../assets/images/create_icon.png";
import Save from "../../assets/images/save_icon.png";
import Refresh from "../../assets/images/icons8-refresh-90.png";

function Playlist({setPlayingTrackId}) {
  const [userID, setUserID] = useState();
  const [playlist, setPlaylist] = useState(null);
  const [newPlaylist, setNewPlaylist] = useState(null);
  const [playlistDescription, setPlaylistDescription] = useState("");
  const [playlistCreated, setPlaylistCreated] = useState(false);
  const location = useLocation();
  const [playlistId, setPlaylistId] = useState(null);
  const [playlistName, setPlaylistName] = useState("");

  useEffect(() => {
    setPlaylistCreated(false);
    setNewPlaylist(null);
  }, [location]);

  useEffect(() => {
    axios
      .get("http://localhost:3001/user-profile", { withCredentials: true })
      .then((res) => {
        setUserID(res.data.id);
        console.log("User ID:", res.data.id);
      })
      .catch((err) => {
        console.error("Error", err);
      });
  }, []);
  

  const createPlaylist = async () => {
    try {
      const fetchTopTracks = async (timeRange, limit = 50) => {
        const response = await axios.get(
          "http://localhost:3001/playlist-tracks",
          { params: { time_range: timeRange, limit: limit }, withCredentials: true }
        );
        return response.data;
      };
  
      
      const shortTermTracks = await fetchTopTracks("short_term");
      const mediumTermTracks = await fetchTopTracks("medium_term");
      const longTermTracks = await fetchTopTracks("long_term");
  
      
      const allTracks = [...shortTermTracks, ...mediumTermTracks, ...longTermTracks];
      const trackMap = allTracks.reduce((map, track) => {
        if (!map[track.id]) map[track.id] = { ...track, count: 0 };
        map[track.id].count++;
        return map;
      }, {});

      console.log("Track Map:", trackMap);
  
      const sortedTracks = Object.values(trackMap).sort((a, b) => b.count - a.count);
      const trackIds = sortedTracks.map((track) => track.id);
      const seedTracks = trackIds.slice(0, 5); 
  
      // Get recommendations based on seed tracks
      const recommendationsResponse = await axios.post(
        "http://localhost:3001/get-recommendations",
        {
          seed_tracks: seedTracks,
          target_popularity: 50,
        },
        { withCredentials: true }
      );
      console.log("Recommendations Response:", recommendationsResponse);
  
      if (recommendationsResponse.data && recommendationsResponse.data.length > 0) {
        let tracks = recommendationsResponse.data.map((track) => ({
          uri: track.uri,
          name: track.name,
          artist: track.artists[0].name,
          artwork: track.album.images[0].url,
          id: track.id,
          popularity: track.popularity, // Include popularity for logging or further processing
        }));
  
        // Sort tracks by popularity in descending order
        tracks = tracks.sort((a, b) => b.popularity - a.popularity);
  
        setNewPlaylist({ name: "New Playlist", tracks });
      } else {
        console.error("No tracks found in the recommendations response");
      }
    } catch (err) {
      console.error("Error:", err);
    }
    setPlaylistCreated(true);
  };

  const savePlaylist = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3001/create-playlist",
        {
          name: playlistName,
          public: false,
          description: playlistDescription,
          tracks: newPlaylist.tracks.map((track) => track.uri),
        },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const newPlaylistId = response.data.id;
      setPlaylistId(newPlaylistId);
      setPlaylist(response.data);
      setPlaylistCreated(true);
      window.open(response.data.external_urls.spotify);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  const handlePlay = (trackId) => {
    console.log("Playing track with ID:", trackId);
    setPlayingTrackId(trackId);
  };

  console.log("Rendering... Current playlistId:", playlistId, "Playlist Created:", playlistCreated);

  return (
    <div className="playlists">
      {!newPlaylist || !newPlaylist.tracks || newPlaylist.tracks.length === 0 ? (
        <>
          <h2 className="playlists__header">Create a playlist based on your top songs</h2>
          <div className="playlists__create">
            <button className="playlists__button" onClick={createPlaylist}>
              {" "}
              <img src={Create} className="playlists__icon" alt="create icon"></img>
            </button>
          </div>
        </>
      ) : (
        <>
          <h2 className="playlists__header">
            Try again <img src={Refresh} className="playlists__icon" onClick={createPlaylist}></img>
          </h2>
          <div className="playlists__save">
            <input
              type="text"
              className="playlists__name"
              placeholder="Name your playlist"
              value={playlistName}
              onChange={(e) => setPlaylistName(e.target.value)}
            />
            <button className="playlists__button" alt="playlists button" onClick={savePlaylist}>
              Save to Spotify
              {console.log("Rendering link with playlistId:", playlistId)}
              <img src={Save} className="playlists__icon" alt="playlist save" />
            </button>
          </div>
        </>
      )}
      {newPlaylist && newPlaylist.tracks && newPlaylist.tracks.length > 0 && (
        <>
          {newPlaylist.tracks.map((track, index) => (
            <div key={index} className="playlist">
              <div className="playlist__wrapper">
                <div className="playlist__container--title">
                  <img src={track.artwork} alt={track.name} className="playlist__image" />
                  <span className="playlist__title">{track.name} </span>
                </div>
                <div className="playlist__container">
                  <span className="playlist__artist">{track.artist} </span>
                </div>
                <div className="playlist__link">
                  <button className="playlist__button" onClick={() => handlePlay(track.id)}>
                    <img src={SpotifyPlayIcon} alt="Spotify Play Icon" className="playlist__icon" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </>
      )}
      {!newPlaylist}
    </div>
  );
}

export default Playlist;