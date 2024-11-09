'use client'
import HLSPlayer from './HLSPlayer';
import Weather from "@/app/weather";
import Age from "@/app/age";
import {globalStore} from "@/app/globalstore";


const LiveStream = () => {

        const {weather} = globalStore()

        const renderURL = () => {
            const hlsUrl = weather.brightness <= 1
                ? 'https://bengarlock.com/fuzzballs/roost/index.m3u8'
                : 'https://bengarlock.com/fuzzballs/run/index.m3u8'
            return `${hlsUrl}?t=${new Date().getTime()}`
        }

        return (
            <div className="flex flex-col bg-gray-800 p-8 min-h-screen justify-center items-center">
                <div className="text-center p-6">
                    <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight
                    text-gray-400 md:text-2xl lg:text-4xl dark:text-white">
                        Welcome to the Chickie Cam!
                    </h1>

                    <p className="p-2">We are Lavender and Buff Orpington chickens</p>
                    <HLSPlayer
                        src={renderURL()}
                        autoPlay={true}
                        controls={true}
                        width="100%"
                        height="auto"
                    />
                </div>

                <Weather/>

                <div className='flex flex-col w-full md:flex-row md:w-2/3 items-center justify-evenly'>

                    <div className='flex flex-col bg-purple-900 p-2 m-2 items-center rounded-xl w-full'>
                        <h1>Lavenders</h1>
                        <div>Claire Anne - <span className="text-pink-500">Pink, </span></div>
                        <div>Annabelle Bronstein - <span className="text-purple-600">Purple, </span></div>
                        <div>Bunny MacDougal - <span className="text-green-600">Green, </span></div>
                        <div>and Magda - <span className="text-yellow-300">Yellow</span></div>
                        <div>
                            <Age date={'2024-07-22'}/>
                        </div>
                    </div>
                    <div className='flex flex-col bg-amber-600 p-2 m-2 items-center rounded-xl w-full'>
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
            </div>

        );
    }
;

export default LiveStream;
