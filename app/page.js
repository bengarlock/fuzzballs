'use client'
import HLSPlayer from './HLSPlayer';
import Weather from "@/app/weather";
import Age from "@/app/age";
import {globalStore} from "@/app/globalstore";
import Brightness from "@/app/brightness";
import {useEffect} from "react";
import Peckingorder from "@/app/peckingorder";


const LiveStream = () => {

    const {weather} = globalStore()

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://tag.demandbase.com/edfc31da3c22de40.min.js';
        script.async = true;
        script.id = 'demandbase_js_lib';
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);


    const renderURL = () => {
        const hlsUrl = weather.brightness < 15
            ? 'https://bengarlock.com/fuzzballs/roost/index.m3u8'
            : 'https://bengarlock.com/fuzzballs/run/index.m3u8'
        return `${hlsUrl}?t=${new Date().getTime()}`
    }

    return (
        <div className="flex flex-col items-center bg-gray-800 p-8 min-h-screen w-full">
            <div className="flex flex-col justify-evenly items-center text-center w-full md:w-1/2">
                <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight
                    text-gray-400 md:text-2xl lg:text-4xl dark:text-white">
                    Welcome to the Chickie Cam!
                </h1>
                <p>We are Lavender and Buff Orpington chickens</p>

                <div className="m-2">
                    <HLSPlayer src={renderURL()}
                               autoPlay={true}
                               controls={true}
                               width="100%"
                               height="auto"
                    />
                </div>


                <Weather/>

                <div className="flex flex-col md:flex-row w-full justify-around">
                    <div
                        className="flex flex-col bg-purple-900 items-center rounded-xl p-2 flex-1 min-h-[150px] m-2">
                        <h1>Lavenders</h1>
                        <div>Claire Anne - <span className="text-pink-500">Pink, </span></div>
                        <div>Annabelle Bronstein - <span className="text-purple-600">Purple, </span></div>
                        <div>Bunny MacDougal - <span className="text-green-600">Green, </span></div>
                        <div>and Magda - <span className="text-yellow-300">Yellow</span></div>
                        <div>
                            <Age date={'2024-07-22'}/>
                        </div>
                    </div>
                    <div
                        className="flex flex-col bg-amber-600 items-center rounded-xl p-2 flex-1 min-h-[150px] m-2">
                        <h1>Buffs</h1>
                        <div>Carrie - <span className="text-pink-500">Pink, </span></div>
                        <div>Charlotte - <span className="text-purple-600">Purple, </span></div>
                        <div>Samantha - <span className="text-green-600">Green, </span></div>
                        <div>Miranda - <span className="text-red-800">Red</span></div>
                        <div>
                            <Age date={'2023-06-12'}/>
                        </div>
                    </div>
                </div>

                <Peckingorder/>
                <Brightness/>
            </div>

        </div>
    )

}


export default LiveStream;
