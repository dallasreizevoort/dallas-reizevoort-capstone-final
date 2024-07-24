# Soundtrack Analyzer

## Overview

My App Soundtrack Analyzer is a personalized music analytics tool that utilizes Spotify's API. Users can log in to access detailed statistics about their music preferences, including insights into their most played songs, albums, and genres over specific time periods. 
This app aims to provide a comprehensive and user-friendly experience for music enthusiasts who want to explore and understand their listening habits in depth.

### Problem

Soundtrack Analyzer addresses a significant gap in the music streaming experience. While platforms like Spotify offer a "wrapped" feature once a year, users are left wanting more frequent and detailed insights into their music habits.
This app is necessary because it provides real-time and customizable analytics, allowing users to access their most played songs, albums, and genres at any given time.

### User Profile

The primary users include individuals who actively use Spotify and are interested in a more detailed and customizable analysis of their music activity.
Users will access the app by logging in with their Spotify credentials, granting Soundtrack Analyzer permission to retrieve their listening data through the Spotify API.
Special considerations should be given to user privacy and data security. Ensure that the app complies with relevant privacy regulations and clearly communicates how user data will be handled. 
Additionally, make the app accessible and inclusive, considering different user preferences and potential accessibility needs.

### Features

User Authentication:
I want to log in to the app using my Spotify credentials.
I want the authentication process to be secure and compliant with privacy regulations.

Dashboard Overview:
I want to see a summary of my music statistics on the dashboard.
I want to view my overall most played songs, albums, and genres.

Customizable Time Periods:
I want to select specific time periods (e.g., week, month, year) for my analytics.
I want the app to dynamically update statistics based on my selected time period.


Album and Genre Insights:
I want to see my top played albums and genres within the selected time period.
I want the ability to explore additional details about each album and genre.

User Settings:
I want to customize app settings, including preferences for analytics display and notification preferences.
I want the option to log out securely from the app.

## Implementation

### Tech Stack

Frontend:
React.j

Backend:
Node.js
Express.js

Database:
mySQL

Styling:
CSS (or SASS/SCSS)

Server Deployment:
Heroku? Possibly another option.


### APIs

Spotify API: To fetch user-specific music data, including play history, top tracks, and user detail

### Sitemap

Login Page:
Allows users to log in to the app using their Spotify credentials.

Dashboard:
Displays a summary of the user's music statistics, including most played songs, albums, and genres. Users can customize the time period for analytics.

Detailed Song Analytics Page:
Description: Provides detailed information about the user's most played songs, including play count, release date, and additional details for each song.

Album Insights Page:
Description: Presents information about the user's top played albums within the selected time period, with the option to explore additional details for each album.

Genre Insights Page:
Description: Shows the user's most played genres, allowing exploration of additional details for each genre.

User Settings Page:
Description: Allows users to customize app settings, including preferences for analytics display and notification settings. Also provides the option to securely log out.

### Mockups

N/A

### Data
```
User -----< UserSong >----- Song
|
v
User -----< UserAlbum >----- Album
|
v
User -----< UserGenre >----- Genre
|
v
User -----< Playlist >----- PlaylistSong -----< Song
|
v
Song -----< SongGenre >----- Genre
```

### Endpoints

Parameters:

username (string): Spotify username.

password (string): Spotify password.

userId (string): User's unique identifier.

timePeriod (string): Time period for analytics (e.g., 'week', 'month', 'year').

User Authentication:

Endpoint: /api/auth/login
Method: POST
Parameters: username, password
```
{
  "token": "your_auth_token",
  "user": {
    "id": "user_id",
    "username": "spotify_username"
  }
}
```

User Data Retrieval:

Endpoint: /api/user/:userId/dashboard
Method: GET
Parameters: userId, timePeriod 
```
{
  "mostPlayedSongs": [...],
  "mostPlayedAlbums": [...],
  "mostPlayedGenres": [...],
  "playlistRecommendations": [...]
}
```
Endpoint: /api/user/:userId/songs
Method: GET
Parameters: userId
```
[
  {
    "songId": "song_id",
    "title": "song_title",
    "artist": "song_artist",
    "album": "song_album",
    "releaseDate": "song_release_date",
    "playCount": 123
  },
  // ... other songs
]
```
Endpoint: /api/user/:userId/albums
Method: GET
Parameters: userId 
```
[
  {
    "albumId": "album_id",
    "title": "album_title",
    "artist": "album_artist",
    "releaseDate": "album_release_date",
    "playCount": 456
  },
  // ... other albums
]
```
Endpoint: /api/user/:userId/genres
Method: GET
Parameters: userId 
```
[
  {
    "genreId": "genre_id",
    "name": "genre_name",
    "playCount": 789
  },
  // ... other genres
]
```
Endpoint: /api/user/:userId/playlists
Method: GET
Parameters: userId 
```
[
  {
    "playlistId": "playlist_id",
    "title": "playlist_title",
    "description": "playlist_description",
    "songs": [...]
  },
  // ... other playlists
]
```
Endpoint: /api/user/:userId/settings
Method: GET
Parameters: userId
```
{
  "notificationPreferences": {
    "email": true,
    "push": false
  },
  "displayPreferences": {
    "darkMode": true,
    "compactView": false
  }
}

```


### Auth

OAuth 2.0: For secure and standardized user authentication using Spotify credentials.

## Roadmap

Week 1: Days 1-3

Setup and Environment Configuration:
Set up the development environment
Configure backend and frontend project structures.
Establish a mySQL database connection.

User Authentication:
Implement user authentication endpoint (/api/auth/login).
Integrate OAuth 2.0 for Spotify login.

User Dashboard API:
Create the /api/user/:userId/dashboard endpoint for fetching user analytics.
Develop sample responses for the dashboard data.

Basic Styling - Header and Footer:
Design and implement basic styling for the header and footer components.

//

Week 1: Days 4-5

Song Analytics API:
Implement the /api/user/:userId/songs endpoint for retrieving user's songs.
Develop sample responses for song data.

Album Analytics API:
Implement the /api/user/:userId/albums endpoint for retrieving user's albums.
Develop sample responses for album data.

Basic Styling - Dashboard:
Apply styling to the dashboard components, ensuring a cohesive and user-friendly layout.

//

Week 2: Days 1-2

Genre Analytics API:
Implement the /api/user/:userId/genres endpoint for retrieving user's genres.
Develop sample responses for genre data.

Playlist Analytics API:
Implement the /api/user/:userId/playlists endpoint for retrieving user's playlists.
Develop sample responses for playlist data.

Basic Styling - Song and Album Lists:
Enhance styling for the song and album lists on the dashboard.

//

Week 2: Days 3-4

User Settings API:
Implement the /api/user/:userId/settings endpoint for fetching user settings.
Develop sample responses for settings data.

User Settings Update API:
Implement the /api/user/:userId/settings endpoint for updating user settings.
Develop sample responses for successful updates.

Basic Styling - Genre and Playlist Sections:
Apply styling to the genre and playlist sections on the dashboard.

//

Week 2: Day 5

Testing:

Write unit tests for key functionalities.
Perform manual testing to ensure endpoints are working as expected.

Documentation:
Document API endpoints, including parameters and sample responses.
Provide setup instructions.

Final Styling Tweaks:
Review and refine styling across the entire application.
(Ensure responsiveness on various devices?)

//

## Nice-to-haves

Playlist Recommendations:
I want the app to suggest playlists based on my most played songs and genres.
I want the option to save or directly create new playlists from the recommended selections.

Playlist Recommendations Page:
Description: Suggests playlists based on the user's most played songs and genres, with options to save or create new playlists directly.

Responsive Design:
I want the app to have a responsive design that works well on various devices, including desktop and mobile.

Accessibility Considerations:
I want the app to be accessible, considering features like text-to-speech and keyboard navigation.
I want clear and concise alt text for images and other non-text elements in the app.
