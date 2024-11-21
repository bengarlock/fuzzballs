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
        if (weather) {
            const temp_f = (weather.air_temperature * 9 / 5) + 32
            return "Current Weather: " + Math.ceil(temp_f) + "\u00B0" + " F"
        }
    }

    return (
        <div className="m-3">
            {renderWeather()}
        </div>
    );
}


export default Weather