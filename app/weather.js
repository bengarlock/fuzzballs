'use client'


import {useEffect, useState} from "react";

const Weather = () => {

    const [currentWeather, setCurrentWeather] = useState({})

    useEffect(() => {
        fetchWeather()
    }, []);

    const fetchWeather = () => {
        const myHeaders = new Headers();
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
            .then((response) => response.text())
            .then((result) => setCurrentWeather(result))
            .catch((error) => console.error(error));
    }

    const renderWeather = () => {
        if (currentWeather) {
            console.log(currentWeather.obs)
        }
    }



    return (
        <div>{currentWeather.obs} </div>
    )
}

export default Weather