import { useState, useEffect } from "react";
import axios from "axios";
import { DarkModeToggle } from "./DarkModeToggle";
import { FaLocationDot } from "react-icons/fa6";
import { FiSearch } from "react-icons/fi";
import { LuWind } from "react-icons/lu";
import { MdOutlineWater } from "react-icons/md";

export const Weather = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState("");
  const [notFoundImage, setNotFoundImage] = useState("");
  const [showError, setShowError] = useState(false);
  const [animate, setAnimate] = useState(false);
  const [maxHeight, setMaxHeight] = useState("");

  const fetchWeatherData = async () => {
    setShowError(false);
    setAnimate(false);

    if (!city.trim()) {
      setError("Please enter the city first");
      setWeatherData(null);
      setNotFoundImage("");
      setShowError(true);
      return;
    }

    const apiKey = "332e4f09cc57d6ae2007ca0272e2fd46";
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;

    try {
      const response = await axios.get(apiUrl);
      setWeatherData(response.data); // Simpan data baru
      setError("");
      setNotFoundImage("");
      setAnimate(true);

      // Mengatur max-height untuk konten baru
      setMaxHeight("20rem");

      // Atur animasi setelah data baru diperbarui
      setTimeout(() => setAnimate(true), 100);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError("Oops! Location not found");
        setNotFoundImage("/public/image/404.png");
      } else {
        setError("An error occurred while fetching data");
      }
      setWeatherData(null);
      setShowError(true);
    }
  };

  const getWeatherImage = (main) => {
    switch (main) {
      case "Clear":
        return "../../public/image/clear.png";
      case "Rain":
        return "../../public/image/rain.png";
      case "Snow":
        return "../../public/image/snow.png";
      case "Clouds":
        return "../../public/image/cloud.png";
      case "Mist":
        return "../../public/image/mist.png";
      default:
        return "../../public/image/cloud.png";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      fetchWeatherData();
    }
  };

  useEffect(() => {
    if (weatherData) {
      setMaxHeight("auto");
    } else {
      setMaxHeight("");
    }
  }, [weatherData]);

  return (
    <div className="container mx-auto px-4 lg:max-w-7xl flex items-center justify-center min-h-screen">
      <div className="max-w-3xl relative">
        <div className="absolute top-2 right-2 dark:text-white">
          <DarkModeToggle />
        </div>

        <div className="text-sm text-primary bg-white p-6 rounded-lg shadow-lg dark:bg-dark">
          <div className="text-center text-primary grid gap-5">
            <h1 className="font-bold text-3xl text-primary dark:text-white">
              Weather App
            </h1>

            {/* Search Bar */}
            <div className="relative">
              <FaLocationDot className="absolute left-3 h-5 top-1/2 transform -translate-y-1/2 text-primary dark:text-white" />
              <input
                type="text"
                className="w-72 pl-10 pr-4 py-2.5 text-base font-semibold rounded-lg bg-transparent border border-gray-300 text-primary dark:text-white focus:outline-primary dark:focus:outline-white placeholder:text-primary dark:placeholder:text-white"
                placeholder="Enter Location"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                onClick={fetchWeatherData}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-primary dark:text-white">
                <FiSearch className="w-5 h-5" />
              </button>
            </div>

            {/* Weather Data */}
            <div
              className={`overflow-hidden h-full transition-max-height duration-700 ease-in-out ${maxHeight}`}>
              {/* New Weather Data */}
              {weatherData && (
                <div
                  className={`text-center text-white grid gap-3 transition-transform duration-700 ease-in-out transform ${
                    animate ? "translate-y-0" : "-translate-y-full"
                  }`}>
                  <h2 className="text-xl tracking-[.1em] text-primary dark:text-white font-bold">
                    {weatherData.name.toUpperCase()}
                  </h2>

                  {/* Weather Icon */}
                  <div className="flex justify-center items-center">
                    <img
                      src={getWeatherImage(weatherData.weather[0].main)}
                      alt={weatherData.weather[0].description}
                      className="w-32 h-24"
                    />
                  </div>

                  {/* Temperature */}
                  <h3 className="relative text-4xl text-primary dark:text-white font-bold">
                    {Math.round(weatherData.main.temp)}{" "}
                    <span className="absolute text-sm top-0 ml-1">°C</span>
                  </h3>

                  {/* Weather Description */}
                  <p className="font-semibold text-base capitalize text-primary dark:text-white">
                    {weatherData.weather[0].description}
                  </p>

                  <div className="flex justify-between items-center text-primary dark:text-white space-x-4">
                    <div className="flex justify-center items-center gap-2">
                      <MdOutlineWater className="w-12 h-12" />
                      <div className="grid">
                        <p className="relative text-xl font-bold right-2">
                          {weatherData.main.humidity}
                          <span className="absolute text-sm top-0 ml-1">%</span>
                        </p>
                        <p className="text-sm font-semibold">Humidity</p>
                      </div>
                    </div>
                    <div className="flex justify-center items-center gap-2">
                      <LuWind className="w-10 h-10" />
                      <div className="grid">
                        <p className="relative text-xl font-bold right-5">
                          {weatherData.wind.speed}
                          <span className="absolute text-sm top-0 ml-1">
                            Km/h
                          </span>
                        </p>
                        <p className="text-sm font-semibold">Wind Speed</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Error Handling */}
            {error && (
              <div className="text-center grid gap-2 transition-all duration-500">
                {notFoundImage && (
                  <img
                    src={notFoundImage}
                    alt="Not Found"
                    className="mx-auto mt-2 w-52 transition-all duration-500"
                  />
                )}
                <p className="text-lg font-semibold text-primary dark:text-white">
                  {error}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
