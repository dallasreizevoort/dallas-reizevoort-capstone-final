import React, { useState, useEffect } from "react";
import { Chart } from "react-google-charts";
import axios from "axios";
import "./Genres.scss";
import Loading from "../../assets/images/loading.svg";

function Genres({ selectedTimeRange }) {
  const [isLoading, setIsLoading] = useState(true);
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
      setChartSize({ width: "375px", height: "500px" });
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
          setIsLoading(false);
        }

        if (medium_term) {
          setTopGenresMedium(medium_term.topGenres);
          setIsLoading(false);
        }

        if (long_term) {
          setTopGenresLong(long_term.topGenres);
          setIsLoading(false);
        }
      } catch (error) {
        console.error("API request failed:", error);
        setIsLoading(false);
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
        {isLoading ? (
          <img className="genres__loading" src={Loading} alt="Loading..." />      
        ) : (
          topGenres && topGenres.length > 0 && (
            <div style={{ height: '1000px', overflow: 'hidden' }}>
              <Chart
                width={chartSize.width}
                height="1000px"
                chartType="BarChart"
                loader={<div>Loading Chart</div>}
                data={getChartData(topGenres)}
                options={{
                  fontSize: fontSize,
                  chartArea: { left: "30%", top: "5%", width: "100%" },
                  hAxis: {
                    textStyle: { color: "#FFF" },
                    gridlines: { color: "transparent" },
                    textPosition: "none",
                  },
                  vAxis: {
                    textStyle: { color: "#FFF" },
                    gridlines: { color: "transparent" },
                    textPosition: "out",
                  },
                  backgroundColor: "#000000",
                  legend: "none",
                  colors: ["#1bd760"],
                  tooltip: { trigger: "none" },
                }}
              />
            </div>
          )
        )}
      </div>
    );
  };


export default Genres;