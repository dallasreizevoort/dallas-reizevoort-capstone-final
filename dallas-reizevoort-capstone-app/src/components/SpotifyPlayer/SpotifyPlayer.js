import React, { useEffect, useState, useRef } from "react";
import SpotifyWebApi from "spotify-web-api-js";
import axios from "axios";
import "./SpotifyPlayer.scss";
import PlayIcon from "../../assets/images/play_arrow_50dp_E3E3E3.svg";
import PauseIcon from "../../assets/images/pause_50dp_E3E3E3.svg";
import NextIcon from "../../assets/images/skip_next_50dp_E3E3E3.svg";
import PreviousIcon from "../../assets/images/skip_previous_50dp_E3E3E3.svg";

const spotifyApi = new SpotifyWebApi();

function SpotifyPlayer({ trackId, handleClose }) {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const [trackInfo, setTrackInfo] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);
  const scriptLoaded = useRef(false);
  const intervalRef = useRef(null);


  useEffect(() => {
    let playerInstance;

    const initializePlayer = (accessToken) => {
      if (!window.Spotify) {
        console.error("Spotify SDK not loaded");
        return;
      }

      if (playerInstance) {
        return;
      }

      playerInstance = new window.Spotify.Player({
        name: "My Web Playback SDK Player",
        getOAuthToken: (cb) => { cb(accessToken); },
      });

      // Error handling
      playerInstance.addListener("initialization_error", ({ message }) => { console.error("Initialization error:", message); });
      playerInstance.addListener("authentication_error", ({ message }) => { console.error("Authentication error:", message); });
      playerInstance.addListener("account_error", ({ message }) => { console.error("Account error:", message); });
      playerInstance.addListener("playback_error", ({ message }) => { console.error("Playback error:", message); });

      // Playback status updates
      playerInstance.addListener("player_state_changed", (state) => {
        console.log("Player state changed:", state);
        if (state) {
          setTrackInfo(state.track_window.current_track);
          setIsPlaying(!state.paused);
          setPosition(state.position);
          setDuration(state.duration);
        }
      });

      // Ready
      playerInstance.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        setDeviceId(device_id);

        intervalRef.current = setInterval(() => {
          playerInstance.getCurrentState().then(state => {
            if (state) {
              setPosition(state.position);
            }
          });
        }, 1000);
      });

      // Not ready
      playerInstance.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      playerInstance.connect().then(success => {
        if (success) {
          console.log('The Web Playback SDK successfully connected to Spotify!');
        }
      });

      setPlayer(playerInstance);
    };

    // Define the onSpotifyWebPlaybackSDKReady function before loading the script
    window.onSpotifyWebPlaybackSDKReady = () => {
      if (spotifyApi.getAccessToken()) {
        initializePlayer(spotifyApi.getAccessToken());
      } else {
        axios.get("http://localhost:3001/playback", { withCredentials: true })
          .then((response) => {
            if (response.status !== 200) {
              console.error("Error fetching access token:", response.statusText);
              throw new Error(`Error fetching access token: ${response.statusText}`);
            }

            const accessToken = response.data.accessToken;
            spotifyApi.setAccessToken(accessToken);
            initializePlayer(accessToken);
          })
          .catch((error) => console.error("Error in fetching access token or initializing player:", error));
      }
    };

    // Load the Spotify Web Playback SDK script only once
    if (!scriptLoaded.current) {
      scriptLoaded.current = true;

      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      document.body.appendChild(script);
    } else {
      if (window.Spotify) {
        initializePlayer(spotifyApi.getAccessToken());
      }
    }

    return () => {
      if (playerInstance) {
        playerInstance.disconnect();
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (trackId && deviceId) {
      spotifyApi.play({
        device_id: deviceId,
        uris: [`spotify:track:${trackId}`],
      }).catch((err) => {
        console.error("Failed to play track:", err);
      });
    }
  }, [trackId, deviceId]);

  const handlePlayPause = () => {
    if (isPlaying) {
      player.pause().catch((err) => console.error("Failed to pause track:", err));
    } else {
      player.resume().catch((err) => console.error("Failed to resume track:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleNextTrack = () => {
    player.nextTrack().catch((err) => console.error("Failed to skip to next track:", err));
  };

  const handlePreviousTrack = () => {
    player.previousTrack().catch((err) => console.error("Failed to skip to previous track:", err));
  };

  const formatTime = (ms) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  if (!trackId) {
    return null;
  }

  return (
    <div className="spotify-player">
     
      <div className="spotify-player__info">
      <div className="spotify-player__details">
        {trackInfo.album && (
          <img src={trackInfo.album.images[0].url} alt={trackInfo.name} className="spotify-player__album-art" />
        )}
           <div className="spotify-player__details--text">
          <h3 className="spotify-player__details--track">{trackInfo.name}</h3>
          <p className="spotify-player__details--artist">{trackInfo.artists && trackInfo.artists.map(artist => artist.name).join(", ")}</p>
        </div>
        </div>
        <div className="spotify-player__close">
        <button className="spotify-player__close--button" onClick={handleClose}>
        X
      </button>
      </div>
      
      </div>
      <div className="spotify-player__controls">
        <button onClick={handlePreviousTrack} className="spotify-player__controls--button">
          <img className="spotify-player__controls--icon" src={PreviousIcon} alt="Previous" />
        </button>
        <button onClick={handlePlayPause} className="spotify-player__controls--button">
          <img className="spotify-player__controls--icon" src={isPlaying ? PauseIcon : PlayIcon} alt="Play/Pause" />
        </button>
        <button onClick={handleNextTrack} className="spotify-player__controls--button">
          <img className="spotify-player__controls--icon" src={NextIcon} alt="Next" />
        </button>
      </div>
      <div className="spotify-player__progress">
        <span className="spotify-player__progress--duration">{formatTime(position)}</span>
        <div className="spotify-player__progress-bar">
          <div
            className="spotify-player__progress-bar-fill"
            style={{ width: `${(position / duration) * 100}%` }}
          />
        </div>
        <span className= "spotify-player__progress-bar-fill--duration">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

export default SpotifyPlayer;