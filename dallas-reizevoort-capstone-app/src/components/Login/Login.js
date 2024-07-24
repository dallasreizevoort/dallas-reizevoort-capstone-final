import React from "react";
import SpotifyIcon from "../../assets/images/Spotify_Icon_RGB_Green.png";
import "./Login.scss";

const scopes = [
  "user-top-read",
  "streaming",
  "user-read-email",
  "user-read-private",
  "user-library-read",
  "user-library-modify",
  "user-read-playback-state",
  "user-modify-playback-state",
  "user-read-recently-played",
  "playlist-modify-public",
  "playlist-modify-private",
];
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUri = process.env.REACT_APP_REDIRECT_URI;

const state =
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15);


const AUTH_URL = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${encodeURIComponent(
  scopes.join(" ")
)}&state=${state}&show_dialog=true`;

function Login() {
  return (
    <div className="login">
      <h1 className="login__header">Trackify</h1>
      <h2 className="login__text">insights into your music taste</h2>
      <div className="login__icon-container">
        <a className="login__link" href={AUTH_URL}>
         <p>Login with Spotify</p>
          <img className="login__icon" src={SpotifyIcon} alt="Spotify Icon" />
        </a>
        </div>
      </div>
    
  );
}

export default Login;
