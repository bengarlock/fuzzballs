'use client'

import React from 'react';
import HLSPlayer from './HLSPlayer';

function daysSince(dateString) {
    const startDate = new Date(dateString);
    const currentDate = new Date();
    const timeDifference = currentDate - startDate;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
}


const LiveStream = () => {
    return (
        <div className="flex flex-col bg-gray-800 p-8 min-h-screen w-full items-center">
            <div className="text-center p-6">
                <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-400 md:text-2xl lg:text-4xl dark:text-white">
                    Welcome to the Chickie Cam!
                </h1>
                <div>
                    <p>Hello! We are the Lavender Orpington Chicks!</p>
                    <p className="p-2">The color of our leg bands helps to identify us.</p>
                    <p>Our names are:</p>
                    <p>
                        Claire Ann - <span className="text-red-600">Red, </span>
                        Annabelle Bronstein - <span className="text-purple-600">Purple, </span>
                        Bunny MacDougal - <span className="text-green-600">Green, </span>
                        and Magda - <span className="text-yellow-600">Yellow</span>
                    </p>
                    <p>We are {daysSince('2024-07-22')} days old</p>
                </div>
            </div>
            <div className="flex flex-col bg-gray-1000 justify-center w-3/4">
                <HLSPlayer
                    src="https://bengarlock.com/live/index.m3u8"
                    autoPlay={true}
                    controls={true}
                    width="100%"
                    height="auto"
                />
            </div>
        </div>

    );
};

export default LiveStream;
