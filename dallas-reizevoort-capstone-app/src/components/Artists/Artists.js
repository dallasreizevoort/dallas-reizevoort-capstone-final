import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SpotifyIcon from "../../assets/images/Spotify_Icon_RGB_Green.png";
import "./Artists.scss";
import Loading from "../../assets/images/loading.svg";

function Artists({ selectedTimeRange }) {
  const [isLoading, setIsLoading] = useState([]);
  const [topArtists, setTopArtists] = useState({
    short_term: [],
    medium_term: [],
    long_term: [],
  });


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/top-artists`, {
          withCredentials: true,
        });
        setTopArtists(res.data);
        setIsLoading(false);
      } catch (error) {
        console.error("API request failed:", error); // Log error
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  
  return (
    <div className="artists__container">
    <div className="artists">
      {isLoading ? (
        <img className="artists__loading" src={Loading} alt="Loading..." />
      ) : (
        <>
          {console.log('Selected Time Range:', selectedTimeRange)}
          {console.log('Top Artists:', topArtists)}
          {topArtists[selectedTimeRange] &&
            topArtists[selectedTimeRange].map((artist, index) => {
              console.log('Rendering artist:', artist);
              return (
                <div key={index} className="artist">
                  <div className="artist__container">
                    <span className="artist__rank">{index + 1}</span>
                    <img
                      src={artist.images[0]?.url}
                      alt={artist.name}
                      className="artist__image"
                    />
                  </div>
                  <div className="artist__container-text">
                    <div>
                      <span className="artist__rank--tablet-desktop">{index + 1}.</span>
                      <span className="artist__title">{artist.name}</span>
                    </div>
                    <div className="artist__link">
                      <a
                        href={artist.external_urls.spotify}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="artist__button"
                      >
                        <img
                          className="artist__icon"
                          src={SpotifyIcon}
                          alt="Spotify Icon"
                        />
                      </a>
                    </div>
                  </div>
                </div>
              );
            })}
        </>
      )}
    </div>
  </div>
  );
}

export default Artists;
