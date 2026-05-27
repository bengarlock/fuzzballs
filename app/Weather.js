'use client'
import {useEffect, useState} from "react";
import {globalStore} from "@/app/globalstore";

const APP_BASE_PATH = process.env.NEXT_PUBLIC_FUZZBALLS_BASE_PATH || '/fuzzballs';
const WEATHER_API = `${APP_BASE_PATH}/api/weather`;

const Weather = () => {

    const {weather, setWeather, authToken} = globalStore()
    const [error, setError] = useState('');

    useEffect(() => {
        if (!authToken) return;
        fetchWeather();
    }, [authToken]);


    const fetchWeather = () => {
        const myHeaders = new Headers();
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", authToken);

        const raw = JSON.stringify({
            "request": "get_weather_data"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch(WEATHER_API, requestOptions)
            .then(async (response) => {
                const weather = await response.json().catch(() => ({}));
                if (!response.ok) {
                    throw new Error(weather.message || weather.detail || `HTTP ${response.status}`);
                }
                if (!weather?.obs?.[0]) {
                    throw new Error('Weather response did not include an observation.');
                }
                return weather;
            })
            .then((weather) => {
                setError('');
                setWeather(weather.obs[0]);
            })
            .catch((error) => {
                setError(error.message ?? String(error));
                console.error(error);
            });
    }

    const renderWeather = () => {
        if (!weather?.air_temperature) return null;

        const temp_f = (weather.air_temperature * 9 / 5) + 32;

        const windDirection = (() => {
            if (weather.wind_direction <= 90) {
                return "NE"
            } else if (weather.wind_direction >= 91 && weather.wind_direction < 180) {
                return "SE"
            } else if (weather.wind_direction >= 181 && weather.wind_direction < 270) {
                return "SW"
            } else {
                return "NW"
            }
        })()


        return {
            currentWeather: Math.ceil(temp_f) + "\u00B0" + " F",
            winds: "Winds: " + String(weather.wind_avg) + " MPH " + windDirection
        }
    }

    const currentWeather = renderWeather();

    return (
        <div className="items-center w-full">
            <div className="flex flex-row justify-evenly rounded-xl ">
                {currentWeather ? (
                    <>
                        <span>{currentWeather.currentWeather} </span>
                        <span>{currentWeather.winds} </span>
                    </>
                ) : (
                    <span className="text-sm text-white/60">
                        {error ? 'Weather unavailable' : 'Loading weather...'}
                    </span>
                )}
            </div>
        </div>
    )
}


export default Weather
