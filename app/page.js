'use client'

import React from 'react';
import HLSPlayer from './HLSPlayer';

const LiveStream = () => {
    return (
        <div className='flex-wrap bg-gray-100 justify-center p-8'>
            <HLSPlayer
                src="https://bengarlock.com/live/index.m3u8"
                autoPlay={true}
                controls={false}
                // width="100%"
                height="auto"
            />
        </div>

    );
};

export default LiveStream;
