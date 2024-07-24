import React, { useState, useEffect, useRef } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./Genres.scss";

function Genres({ selectedTimeRange }) {
  const [topGenresShort, setTopGenresShort] = useState([]);
  const [topGenresMedium, setTopGenresMedium] = useState([]);
  const [topGenresLong, setTopGenresLong] = useState([]);
  const [totalGenreCount, setTotalGenreCount] = useState(0);
  const [chartSize, setChartSize] = useState({ width: '600px', height: '300px' });
  const [fontSize, setFontSize] = useState(13);

 

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setChartSize({ width: '320px', height: '350px' });
      setFontSize(12);
    } else if (window.innerWidth > 768 && window.innerWidth <= 1200) {
      setChartSize({ width: '600px', height: '400px' });
      setFontSize(14);
    } else {
      setChartSize({ width: '900px', height: '500px' });
      setFontSize(18);
    }
  }, []);

  const calculateTopGenres = (artists) => {
    const allGenres = artists.flatMap((artist) => Array.isArray(artist.genres) ? artist.genres : []);
    console.log("All genres:", allGenres);

    const genreCounts = allGenres.reduce((counts, genre) => {
      counts[genre] = (counts[genre] || 0) + 1;
      return counts;
    }, {});
    console.log("Genre counts:", genreCounts);

    setTotalGenreCount(allGenres.length);

    return Object.entries(genreCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/top-genres`, {
          withCredentials: true,
        });

        const { short_term, medium_term, long_term } = res.data;

        console.log('API response:', res.data);

        if (short_term) {
          console.log('Short term data:', short_term);
          const topGenresShort = calculateTopGenres(short_term);
          console.log('Calculated Short term top genres:', topGenresShort);
          setTopGenresShort(topGenresShort);
        } else {
          console.log('No short_term data');
        }

        if (medium_term) {
          console.log('Medium term data:', medium_term);
          const topGenresMedium = calculateTopGenres(medium_term);
          console.log('Calculated Medium term top genres:', topGenresMedium);
          setTopGenresMedium(topGenresMedium);
        } else {
          console.log('No medium_term data');
        }

        if (long_term) {
          console.log('Long term data:', long_term);
          const topGenresLong = calculateTopGenres(long_term);
          console.log('Calculated Long term top genres:', topGenresLong);
          setTopGenresLong(topGenresLong);
        } else {
          console.log('No long_term data');
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    };

    fetchData();
  }, []);

  const getChartData = (topGenres) => {
    return [
      ['Genre', 'Count'],
      ...topGenres.map(([genre, count], index) => [`${index + 1}. ${genre}`, count])
    ];
  };

  return (
    <div className="genres">
      {selectedTimeRange === "short_term" && topGenresShort.length > 0 && (
        <Chart
          width={chartSize.width}
          height={chartSize.height}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={getChartData(topGenresShort)}
          options={{
            fontSize: fontSize,
            chartArea: { left: '50%', width: '50%' },
            hAxis: {
              textStyle: { color: '#FFF' },
              gridlines: { color: 'transparent' },
              textPosition: 'none'
            },
            vAxis: {
              textStyle: { color: '#FFF' },
              gridlines: { color: 'transparent' },
              textPosition: 'out',
            },
            backgroundColor: '#000000',
            legend: 'none',
            colors: ['#1bd760'],
          }}
        />
      )}
      {selectedTimeRange === "medium_term" && topGenresMedium.length > 0 && (
        <Chart
          width={chartSize.width}
          height={chartSize.height}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={getChartData(topGenresMedium)}
          options={{
            fontSize: fontSize,
            chartArea: { left: '50%', width: '50%' },
            hAxis: {
              textStyle: { color: '#FFF' },
              gridlines: { color: 'transparent' },
              textPosition: 'none',
            },
            vAxis: {
              textStyle: { color: '#FFF' },
              gridlines: { color: 'transparent' },
              textPosition: 'out',
            },
            backgroundColor: '#000000',
            legend: 'none',
            colors: ['#1bd760'],
          }}
        />
      )}
      {selectedTimeRange === "long_term" && topGenresLong.length > 0 && (
        <Chart
          width={chartSize.width}
          height={chartSize.height}
          chartType="BarChart"
          loader={<div>Loading Chart</div>}
          data={getChartData(topGenresLong)}
          options={{
            fontSize: fontSize,
            chartArea: { left: '50%', width: '50%' },
            hAxis: {
              textStyle: { color: '#FFF' },
              gridlines: { color: 'transparent' },
              textPosition: 'none'
            },
            vAxis: {
              textStyle: { color: '#FFF' },
              gridlines: { color: 'transparent' },
            },
            backgroundColor: '#000000',
            legend: 'none',
            colors: ['#1bd760'],
          }}
        />
      )}
      <p className="genres__subtitle">
        {totalGenreCount} total genres listened to
      </p>
    </div>
  );
}

export default Genres;