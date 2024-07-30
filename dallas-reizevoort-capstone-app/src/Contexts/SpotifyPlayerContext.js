// import React, { createContext, useState, useEffect, useRef } from 'react';
// import SpotifyWebApi from 'spotify-web-api-js';
// import axios from 'axios';

// const SpotifyPlayerContext = createContext();

// export const SpotifyPlayerProvider = ({ children }) => {
//     const [player, setPlayer] = useState(null);
//     const [deviceId, setDeviceId] = useState(null);
//     const [trackInfo, setTrackInfo] = useState({});
//     const [isPlaying, setIsPlaying] = useState(false);
//     const [position, setPosition] = useState(0);
//     const [duration, setDuration] = useState(0);
//     const [playingTrackId, setPlayingTrackId] = useState(null);
//   const scriptLoaded = useRef(false);
//   const intervalRef = useRef(null);

//   const spotifyApi = useRef(new SpotifyWebApi());

//   useEffect(() => {
//     let playerInstance;

//     const initializePlayer = (accessToken) => {
//       if (!window.Spotify) {
//         console.error('Spotify SDK not loaded');
//         return;
//       }

//       if (playerInstance) {
//         return;
//       }

//       playerInstance = new window.Spotify.Player({
//         name: 'My Web Playback SDK Player',
//         getOAuthToken: (cb) => { cb(accessToken); },
//       });

//       playerInstance.addListener('initialization_error', ({ message }) => { console.error('Initialization error:', message); });
//       playerInstance.addListener('authentication_error', ({ message }) => { console.error('Authentication error:', message); });
//       playerInstance.addListener('account_error', ({ message }) => { console.error('Account error:', message); });
//       playerInstance.addListener('playback_error', ({ message }) => { console.error('Playback error:', message); });

//       playerInstance.addListener('player_state_changed', (state) => {
//         console.log('Player state changed:', state);
//         if (state) {
//           setTrackInfo(state.track_window.current_track);
//           setIsPlaying(!state.paused);
//           setPosition(state.position);
//           setDuration(state.duration);
//         }
//       });

//       playerInstance.addListener('ready', ({ device_id }) => {
//         console.log('Ready with Device ID', device_id);
//         setDeviceId(device_id);

//         intervalRef.current = setInterval(() => {
//           playerInstance.getCurrentState().then(state => {
//             if (state) {
//               setPosition(state.position);
//             }
//           });
//         }, 1000);
//       });

//       playerInstance.addListener('not_ready', ({ device_id }) => {
//         console.log('Device ID has gone offline', device_id);
//       });

//       playerInstance.connect().then(success => {
//         if (success) {
//           console.log('The Web Playback SDK successfully connected to Spotify!');
//         }
//       });

//       setPlayer(playerInstance);
//     };

//     window.onSpotifyWebPlaybackSDKReady = () => {
//       if (spotifyApi.current.getAccessToken()) {
//         initializePlayer(spotifyApi.current.getAccessToken());
//       } else {
//         axios.get('http://localhost:3001/playback', { withCredentials: true })
//           .then((response) => {
//             if (response.status !== 200) {
//               console.error('Error fetching access token:', response.statusText);
//               throw new Error(`Error fetching access token: ${response.statusText}`);
//             }

//             const accessToken = response.data.accessToken;
//             spotifyApi.current.setAccessToken(accessToken);
//             initializePlayer(accessToken);
//           })
//           .catch((error) => console.error('Error in fetching access token or initializing player:', error));
//       }
//     };

//     if (!scriptLoaded.current) {
//       scriptLoaded.current = true;

//       const script = document.createElement('script');
//       script.src = 'https://sdk.scdn.co/spotify-player.js';
//       script.async = true;
//       document.body.appendChild(script);
//     } else {
//       if (window.Spotify) {
//         initializePlayer(spotifyApi.current.getAccessToken());
//       }
//     }

//     return () => {
//       if (playerInstance) {
//         playerInstance.disconnect();
//       }
//       if (intervalRef.current) {
//         clearInterval(intervalRef.current);
//       }
//     };
//   }, []);

//   useEffect(() => {
//     if (playingTrackId && deviceId) {
//       spotifyApi.current.play({
//         device_id: deviceId,
//         uris: [`spotify:track:${playingTrackId}`],
//       }).catch((err) => {
//         console.error('Failed to play track:', err);
//       });
//     }
//   }, [playingTrackId, deviceId]);

//   const handlePlayPause = () => {
//     if (isPlaying) {
//       player.pause().catch((err) => console.error('Failed to pause track:', err));
//     } else {
//       player.resume().catch((err) => console.error('Failed to resume track:', err));
//     }
//     setIsPlaying(!isPlaying);
//   };

//   const handleNextTrack = () => {
//     player.nextTrack().catch((err) => console.error('Failed to skip to next track:', err));
//   };

//   const handlePreviousTrack = () => {
//     player.previousTrack().catch((err) => console.error('Failed to skip to previous track:', err));
//   };

//   const formatTime = (ms) => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = ((ms % 60000) / 1000).toFixed(0);
//     return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
//   };

  
//   return (
//     <SpotifyPlayerContext.Provider value={{
//       player,
//       deviceId,
//       trackInfo,
//       isPlaying,
//       position,
//       duration,
//       playingTrackId, 
//       setPlayer,
//       setDeviceId,
//       setTrackInfo,
//       setIsPlaying,
//       setPosition,
//       setDuration,
//       setPlayingTrackId, 
//       handlePlayPause, 
//       handleNextTrack, 
//       handlePreviousTrack, 
//       formatTime,
//     }}>
//       {children}
//     </SpotifyPlayerContext.Provider>
//   );
// };

// export default SpotifyPlayerContext;