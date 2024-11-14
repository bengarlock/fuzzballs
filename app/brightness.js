'use client'
import {globalStore} from "@/app/globalstore";

const Brightness = () => {
    const { weather } = globalStore();


    const renderBrightness = () => {
        if (weather && weather.brightness) {
            return "Brightness: " + weather.brightness
        }
        return "No brightness data available"
    }

    return (
        <div className="text-gray-400 text-xs">
            {renderBrightness()}
        </div>
    )
}

export default Brightness