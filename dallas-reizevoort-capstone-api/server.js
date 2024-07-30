import express from "express";
import SpotifyWebApi from "spotify-web-api-node";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const checkToken = async (req, res, next) => {
  console.log("Checking token...");
  const accessToken = req.cookies.accessToken;
  const refreshToken = req.cookies.refreshToken;

  console.log("Access Token:", accessToken);
  console.log("Refresh Token:", refreshToken);

  if (!accessToken || !refreshToken) {
    console.log("Access token or refresh token not found");
    return res
      .status(401)
      .json({ error: "Access token or refresh token not found" });
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi.setAccessToken(accessToken);

  try {
    console.log("Trying to get user profile...");
    await spotifyApi.getMe();
    console.log("User profile retrieved successfully");
    next();
  } catch (err) {
    console.log("Error while getting user profile:", err);
    if (err.statusCode === 401) {
      try {
        console.log("Trying to refresh access token...");
        const data = await spotifyApi.refreshAccessToken();
        console.log("Access token refreshed successfully");
        res.cookie("accessToken", data.body["access_token"], {
          httpOnly: true,
          secure: false,
          sameSite: "lax",
        });

        spotifyApi.setAccessToken(data.body["access_token"]);
        next();
      } catch (err) {
        console.error("Error refreshing access token:", err);
        return res.status(500).json({ error: err.toString() });
      }
    } else {
      console.error("Error getting user profile:", err);
      return res.status(500).json({ error: err.toString() });
    }
  }
};

//login and /refresh routes are handled without token check
app.post("/login", (req, res) => {
  const code = req.body.code;
  console.log("Received code:", code);

  if (!code) {
    console.log("Code is missing");
    return res.status(400).json({ error: "Code is required" });
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      console.log("Spotify API response:", data);

      const accessToken = data.body.access_token;
      const refreshToken = data.body.refresh_token;

      if (!accessToken || !refreshToken) {
        console.log("Failed to retrieve tokens from Spotify");
        return res
          .status(400)
          .json({ error: "Failed to retrieve tokens from Spotify" });
      }

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      console.log("Access token cookie set");

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      console.log("Refresh token cookie set");

      res.json({
        expiresIn: data.body.expires_in,
      });
    })
    .catch((err) => {
      console.error("Spotify authorization error:", err.message);
      console.error(err);
      res.status(400).json({ error: "Failed to authorize code" });
    });
});

app.post("/refresh", (req, res) => {
  const refreshToken = req.cookies.refreshToken;
  console.log("Refresh token from request:", refreshToken);
  if (!refreshToken) {
    return res.status(401).json({ error: "Refresh token not found" });
  }

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken,
  });

  spotifyApi
    .refreshAccessToken()
    .then((data) => {
      console.log("Access token from Spotify:", data.body["access_token"]);
      res.cookie("accessToken", data.body["access_token"], {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      });
      console.log("Access token cookie set");
      res.json({
        expiresIn: data.body["expires_in"],
      });
    })
    .catch((err) => {
      console.error("Error refreshing access token:", err);
      res.status(500).json({ error: err.toString() });
    });
});

app.use((req, res, next) => {
  if (["/login", "/refresh"].includes(req.path)) {
    return next();
  } else {
    return checkToken(req, res, next);
  }
});

app.get("/search-tracks", checkToken, async (req, res) => {
  const { query } = req.query;
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.searchTracks(query, { limit: 5 });
    res.json(data.body.tracks.items);
  } catch (err) {
    console.error("Error searching tracks:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/top-tracks", checkToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log("Access token from request:", accessToken);
  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const timeRanges = ["short_term", "medium_term", "long_term"];
    const topTracks = {};

    for (let timeRange of timeRanges) {
      const data = await spotifyApi.getMyTopTracks({ time_range: timeRange });
      topTracks[timeRange] = data.body.items;
    }

    res.json(topTracks);
  } catch (err) {
    console.error("Error getting top tracks:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/top-artists", checkToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log("Access token from request:", accessToken);
  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const timeRanges = ["short_term", "medium_term", "long_term"];
    const topArtists = {};

    for (let timeRange of timeRanges) {
      const data = await spotifyApi.getMyTopArtists({
        time_range: timeRange,
        limit: 50,
      });
      topArtists[timeRange] = data.body.items;
    }

    res.json(topArtists);
  } catch (err) {
    console.error("Error getting top artists:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/top-genres", checkToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log("Access token:", accessToken);
  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const timeRanges = ["short_term", "medium_term", "long_term"];
    const promises = timeRanges.map((timeRange) =>
      spotifyApi.getMyTopArtists({ time_range: timeRange, limit: 50 })
    );
    const results = await Promise.all(promises);
    console.log("Spotify API results:", results);

    const topGenres = results.map((result, i) => {
      const genreCounts = {};

      result.body.items.forEach((artist) => {
        artist.genres.forEach((genre) => {
          genreCounts[genre] = (genreCounts[genre] || 0) + 1;
        });
      });

      const sortedGenres = Object.entries(genreCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 20);

      return {
        timeRange: timeRanges[i],
        topGenres: sortedGenres,
      };
    });

    res.json(topGenres);
  } catch (error) {
    console.error("Failed to fetch top artists:", error);
    res.status(500).json({ error: "Failed to fetch top artists" });
  }
});

app.get("/recently-played", checkToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log("Access token from request:", accessToken);
  if (!accessToken) {
    return res.status(401).json({ error: "Access token not found" });
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getMyRecentlyPlayedTracks({ limit: 50 });
    res.json(data.body.items);
  } catch (err) {
    console.error("Error getting recently played tracks:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/mood", checkToken, (req, res) => {
  const accessToken = req.cookies["accessToken"];
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  spotifyApi
    .getMyRecentlyPlayedTracks({ limit: 30 })
    .then((response) => {
      const trackIds = response.body.items.map((item) => item.track.id);
      return spotifyApi.getAudioFeaturesForTracks(trackIds);
    })
    .then((response) => {
      res.json(response.body);
    })
    .catch((err) => {
      console.error("Error:", err.message);
      res.status(500).json({ error: err.message });
    });
});

app.get("/user-profile", checkToken, async (req, res) => {
  const accessToken = req.cookies.accessToken;
  console.log("Access token from request:", accessToken);
  if (!accessToken) {
    res.status(401).json({ error: "Access token not found" });
    return;
  }

  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const data = await spotifyApi.getMe();
    res.json(data.body);
  } catch (err) {
    console.error("Error getting user profile:", err);
    res.status(500).json({ error: err.toString() });
  }
});

app.get("/playlist-tracks", checkToken, async (req, res) => {
  const { time_range } = req.query;
  const accessToken = req.cookies["accessToken"];
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const response = await spotifyApi.getMyTopTracks({ time_range });
    res.json(response.body.items);
  } catch (err) {
    console.error("Error fetching top tracks:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/get-recommendations", checkToken, async (req, res) => {
  const { seed_tracks } = req.body;
  const accessToken = req.cookies["accessToken"];
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const response = await spotifyApi.getRecommendations({
      seed_tracks: seed_tracks.join(","),
      limit: 20,
    });
    res.json(response.body.tracks);
  } catch (err) {
    console.error("Error fetching recommendations:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.post("/create-playlist", checkToken, async (req, res) => {
  const { name, isPublic, description, tracks } = req.body;
  const accessToken = req.cookies["accessToken"];
  const spotifyApi = new SpotifyWebApi();
  spotifyApi.setAccessToken(accessToken);

  try {
    const playlistResponse = await spotifyApi.createPlaylist(name, {
      public: isPublic,
      description: description,
    });
    const playlistId = playlistResponse.body.id;

    await spotifyApi.addTracksToPlaylist(playlistId, tracks);

    const playlistData = await spotifyApi.getPlaylist(playlistId);

    res.json(playlistData.body);
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.get("/playback", checkToken, (req, res) => {
  const accessToken = req.cookies["accessToken"];
  if (!accessToken) {
    console.log("Access token not found");
    return res.status(401).json({ error: "Access token not found" });
  }

  console.log("Access token found:", accessToken);
  res.json({ accessToken });
});

app.post("/logout", (req, res) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
});

app.listen(3001, () => {
  console.log("Server is running on port 3001");
});
