'use client'

import React from 'react';
import HLSPlayer from './HLSPlayer';

const LiveStream = () => {
    return (
        <div className='flex-wrap'>
            <HLSPlayer
                src="https://bengarlock.com/live/index.m3u8"
                autoPlay={true}
                controls={false}
                width="80%"
                height="auto"
            />
        </div>

    );
};

export default LiveStream;
