'use client'
import {useEffect} from "react";
import {globalStore} from "@/app/globalstore";


const Weather = () => {

    const {weather, setWeather} = globalStore()

    useEffect(() => {
        fetchWeather();
    }, []);


    const fetchWeather = () => {
        const myHeaders = new Headers();
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('csrftoken='));
        if (csrfToken) {
            myHeaders.append("X-CSRFToken", csrfToken.split('=')[1]);
        }
        myHeaders.append("Content-Type", "application/json");

        const raw = JSON.stringify({
            "request": "get_weather_data"
        });

        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: raw,
            redirect: "follow"
        };

        fetch("https://bengarlock.com/api/v1/garden/weather/", requestOptions)
            .then((response) => response.json())
            .then((weather) => setWeather(weather.obs[0]))
            .catch((error) => console.error(error));
    }

    const renderWeather = () => {
        if (!weather) return null;

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

    return (
        <div className="items-center w-full">
            <div className="flex flex-row justify-evenly rounded-xl ">
                <span>{renderWeather().currentWeather} </span>
                <span>{renderWeather().winds} </span>
            </div>
        </div>
    )
}


export default Weather