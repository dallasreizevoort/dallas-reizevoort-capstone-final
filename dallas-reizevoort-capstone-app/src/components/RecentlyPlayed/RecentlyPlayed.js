import React, { useState, useEffect } from "react";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import "./RecentlyPlayed.scss";
import axios from "axios";

function RecentlyPlayed( {setPlayingTrackId}) {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);

  console.log(setPlayingTrackId);
 

  const handlePlay = (trackId) => {
    console.log("Playing track with ID:", trackId);
    setPlayingTrackId(trackId);
  };

  

  useEffect(() => {
    axios
      .get("http://localhost:3001/recently-played", {
        withCredentials: true,
      })
      .then((res) => {
        const items = Array.isArray(res.data) ? res.data : [];
        const uniqueTracks = items
          .filter((item, index, self) =>
            index === self.findIndex((t) => t.track.id === item.track.id)
          )
          .map((item, index) => ({
            ...item,
            id: index,
          }));
        setRecentlyPlayed(uniqueTracks);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    console.log("Recently played tracks:", recentlyPlayed);
  }, [recentlyPlayed]);

  return (
    <div className="recents">

      {recentlyPlayed.map((track, index) => (
        <div key={index} className="recents__wrapper">
          <div className="recent__container--title">
            <span className="recent__rank">{index + 1}</span>
            <img
              src={track.track.album.images[0].url}
              alt={track.track.name}
              className="recent__image"
            />
            <span className="recent__title">{track.track.name}</span>
          </div>
          <div className="recent__container">
            <span className="recent__artist">
              {" "}
              {track.track.artists.map((artist) => artist.name).join(", ")}
            </span>
          </div>
          <div className="recent__link">
            <button
              className="recent__button"
              onClick={() => handlePlay(track.track.id)}
            >
              <img
                src={SpotifyPlayIcon}
                alt="Spotify Play Icon"
                className="recent__icon"
              />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default RecentlyPlayed;
