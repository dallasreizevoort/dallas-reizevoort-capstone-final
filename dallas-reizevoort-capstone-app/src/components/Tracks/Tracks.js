import React, { useState, useEffect } from "react";
import SpotifyPlayIcon from "../../assets/images/Spotify_Play.png";
import "./Tracks.scss";
import axios from "axios";
import Loading from "../../assets/images/loading.svg";

function Tracks({
  setPlayingTrackId,
  selectedTimeRange,
  setSelectedTimeRange,
  data,
}) {
  console.log("Tracks component rendered");
  console.log("Data prop:", data); 

  const [topTracks, setTopTracks] = useState({
    short_term: [],
    medium_term: [],
    long_term: [],
  });

  const [loading, setLoading] = useState(true);

  const handlePlay = (trackId) => {
    console.log("Playing track with ID:", trackId);
    setPlayingTrackId(trackId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3001/top-tracks", {
          withCredentials: true,
        });
        console.log("API response:", res.data);
        setTopTracks(res.data);
      } catch (error) {
        console.error("API request failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (data) {
      setTopTracks(data); 
    }
  }, [data]);

  useEffect(() => {
    console.log("Tracks component re-rendered due to prop change");
  }, [selectedTimeRange, setSelectedTimeRange, data]);

  console.log("Top Tracks", topTracks);

  if (loading) {
    return <img className="tracks__loading" src={Loading} alt="Loading..."/>
  }

  return (
    <div className="tracks">
      {selectedTimeRange === "short_term" &&
        topTracks.short_term &&
        topTracks.short_term.map((track, index) => (
          <div key={index} className="tracks__wrapper">
            <div className="track__container--title">
              <span className="track__rank">{index + 1}</span>
              <img
                src={track.album?.images?.[0]?.url || ""}
                alt={track.name}
                className="track__image"
              />
              <span className="track__title">{track.name}</span>
            </div>
            <div className="track__container">
              <span className="track__artist">
                {Array.isArray(track.artists)
                  ? track.artists.map((artist) => artist.name).join(", ")
                  : ""}
              </span>
            </div>
            <div className="track__link">
              <button
                className="track__button"
                onClick={() => handlePlay(track.id)}
              >
                <img
                  src={SpotifyPlayIcon}
                  alt="Spotify Play Icon"
                  className="track__icon"
                />
              </button>
            </div>
          </div>
        ))}
      {selectedTimeRange === "medium_term" &&
        topTracks.medium_term.map((track, index) => (
          <div key={index} className="tracks__wrapper">
            <div className="track__container--title">
              <span className="track__rank">{index + 1}</span>
              <img
                src={track.album?.images[0]?.url}
                alt={track.name}
                className="track__image"
              />
              <span className="track__title">{track.name}</span>
            </div>
            <div className="track__container">
              <span className="track__artist">
                {track.artists
                  ? track.artists.map((artist) => artist.name).join(", ")
                  : ""}
              </span>
            </div>
            <div className="track__link">
              <button
                className="track__button"
                onClick={() => handlePlay(track.id)}
              >
                <img
                  src={SpotifyPlayIcon}
                  alt="Spotify Play Icon"
                  className="track__icon"
                />
              </button>
            </div>
          </div>
        ))}
      {selectedTimeRange === "long_term" &&
        topTracks.long_term.map((track, index) => (
          <div key={index} className="tracks__wrapper">
            <div className="track__container--title">
              <span className="track__rank">{index + 1}</span>
              <img
                src={track.album?.images[0]?.url}
                alt={track.name}
                className="track__image"
              />
              <span className="track__title">{track.name}</span>
            </div>
            <div className="track__container">
              <span className="track__artist">
                {track.artists
                  ? track.artists.map((artist) => artist.name).join(", ")
                  : ""}
              </span>
            </div>
            <div className="track__link">
              <button
                className="track__button"
                onClick={() => handlePlay(track.id)}
              >
                <img
                  src={SpotifyPlayIcon}
                  alt="Spotify Play Icon"
                  className="track__icon"
                />
              </button>
            </div>
          </div>
        ))}
    </div>
  );
}

export default Tracks;
