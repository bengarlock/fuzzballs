'use client'

import React from 'react';
import HLSPlayer from './HLSPlayer';

const LiveStream = () => {
    return (
        <div className='flex flex-col bg-gray-800 p-8 min-h-screen'>

            <div className='text-center p-6'>
                <h1 className='mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-400
                md:text-2xl lg:text-4xl dark:text-white'>Welcome to the Chickie Cam!</h1>
                <div>
                    <p>Hello! We are the Lavender Orpington Chicks!</p>
                    <p className='p-2'>Our names are: </p>
                    <p>Claire Ann - <span className={'text-red-600'}>Red</span></p>
                    <p>Annabelle Bronstein - <span className={'text-purple-600'}>Purple</span></p>
                    <p>Bunny MacDougal - <span className={'text-green-600'}>Green</span></p>
                    <p>Magda - <span className={'text-blue-600'}>Blue</span></p>
                </div>
            </div>
            <div className={'bg-grey-1000 '}>
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
