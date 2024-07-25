import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./Genres.scss";

function Genres({ selectedTimeRange }) {
  const [topGenresShort, setTopGenresShort] = useState([]);
  const [topGenresMedium, setTopGenresMedium] = useState([]);
  const [topGenresLong, setTopGenresLong] = useState([]);
  const [chartSize, setChartSize] = useState({
    width: "600px",
    height: "500px",
  });
  const [fontSize, setFontSize] = useState(13);

  useEffect(() => {
    if (window.innerWidth <= 768) {
      setChartSize({ width: "320px", height: "500px" });
      setFontSize(12);
    } else if (window.innerWidth > 768 && window.innerWidth <= 1200) {
      setChartSize({ width: "600px", height: "400px" });
      setFontSize(14);
    } else {
      setChartSize({ width: "900px", height: "500px" });
      setFontSize(18);
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`http://localhost:3001/top-genres`, {
          withCredentials: true,
        });

        const short_term = res.data.find(item => item.timeRange === 'short_term');
        const medium_term = res.data.find(item => item.timeRange === 'medium_term');
        const long_term = res.data.find(item => item.timeRange === 'long_term');

        if (short_term) {
          setTopGenresShort(short_term.topGenres);
        }

        if (medium_term) {
          setTopGenresMedium(medium_term.topGenres);
        }

        if (long_term) {
          setTopGenresLong(long_term.topGenres);
        }
      } catch (error) {
        console.error("API request failed:", error);
      }
    };

    fetchData();
  }, [selectedTimeRange]);

  const getChartData = (topGenres) => {
    return [
      ["Genre", "Count"],
      ...topGenres.map(([genre, count], index) => [`${index + 1}. ${genre}`, count]),
    ];
  };

  let topGenres;
  if (selectedTimeRange === "short_term") {
    topGenres = topGenresShort;
  } else if (selectedTimeRange === "medium_term") {
    topGenres = topGenresMedium;
  } else if (selectedTimeRange === "long_term") {
    topGenres = topGenresLong;
  }

  return (
    <div className="genres">
      {topGenres && topGenres.length > 0 && (
        <div style={{ height: '1000px', overflow: 'auto' }}>
          <Chart
            width={chartSize.width}
            height="1000px"
            chartType="BarChart"
            loader={<div>Loading Chart</div>}
            data={getChartData(topGenres)}
            options={{
              fontSize: fontSize,
              chartArea: { left: "50%", width: "50%" },
              hAxis: {
                textStyle: { color: "#FFF" },
                gridlines: { color: "transparent" },
                textPosition: "none",
              },
              vAxis: {
                textStyle: { color: "#FFF" },
                gridlines: { color: "transparent" },
                textPosition: "out",
                slantedText: true,
                slantedTextAngle: 45,
              },
              backgroundColor: "#000000",
              legend: "none",
              colors: ["#1bd760"],
            }}
          />
        </div>
      )}
    </div>
  );
};


export default Genres;