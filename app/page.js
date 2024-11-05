'use client'
import HLSPlayer from './HLSPlayer';
import Weather from "@/app/weather";
import {useState, useEffect} from "react";


const LiveStream = () => {

        const [videoUrl, setVideoUrl] = useState('');

        useEffect(() => {
            const hlsUrl = 'https://bengarlock.com/live/index.m3u8';
            const uniqueUrl = `${hlsUrl}?t=${new Date().getTime()}`;
            setVideoUrl(uniqueUrl);
        }, []);

        const daysSince = (dateString) => {
            const timeDifference = new Date() - new Date(dateString);
            return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        }

        const formatDays = (days) => {
            const years = Math.floor(days / 365);
            const remainingDaysAfterYears = days % 365;
            const months = Math.floor(remainingDaysAfterYears / 30);
            const remainingDays = remainingDaysAfterYears % 30;

            if (years > 1) {
                return `We are ${years} years, ${months} months, and ${remainingDays} days old.`
            } else if (years === 1) {
                return `We are ${years} year, ${months} months, and ${remainingDays} days old.`
            } else {
                return `We are ${months} months and ${remainingDays} days old.`
            }
        }

        console.log(formatDays(daysSince('2024-07-22')))
        console.log(formatDays(daysSince('2023-06-12')))

        return (

            <div className="flex flex-col bg-gray-800 p-8 min-h-screen justify-center items-center">
                <div className="text-center p-6">
                    <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-400 md:text-2xl lg:text-4xl dark:text-white">
                        Welcome to the Chickie Cam!
                    </h1>
                    <Weather />
                    <p className="p-2">We are Lavender and Buff Orpington chickens</p>
                    <HLSPlayer
                        src={videoUrl}
                        autoPlay={true}
                        controls={true}
                        width="100%"
                        height="auto"
                    />

                </div>
                <div className='flex flex-col w-full md:flex-row md:w-2/3 items-center justify-evenly'>
                    <div className='flex flex-col bg-purple-900 p-2 m-2 items-center rounded-xl w-full'>
                        <h1>Lavenders</h1>
                        <div>Claire Anne - <span className="text-pink-500">Pink, </span></div>
                        <div>Annabelle Bronstein - <span className="text-purple-600">Purple, </span></div>
                        <div>Bunny MacDougal - <span className="text-green-600">Green, </span></div>
                        <div>and Magda - <span className="text-yellow-300">Yellow</span></div>
                        <div><p>We are {daysSince('2024-07-22')} days old</p></div>
                    </div>
                    <div className='flex flex-col bg-amber-600 p-2 m-2 items-center rounded-xl w-full'>
                        <h1>Buffs</h1>
                        <div>Carrie - <span className="text-pink-500">Pink, </span></div>
                        <div>Charlotte - <span className="text-purple-600">Purple, </span></div>
                        <div>Samantha - <span className="text-green-600">Green, </span></div>
                        <div>Miranda - <span className="text-red-800">Red</span></div>
                        <div>We are {daysSince('2023-06-12')} days old</div>
                    </div>
                </div>
            </div>

        );
    }
;

export default LiveStream;
