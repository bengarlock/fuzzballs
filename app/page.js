'use client'

import React from 'react';
import HLSPlayer from './HLSPlayer';

const LiveStream = () => {
    return (
        <div className='flex flex-col bg-gray-100 justify-center p-8'>
            <div className={'bg-amber-600'}>
                <HLSPlayer
                    src="https://bengarlock.com/live/index.m3u8"
                    autoPlay={true}
                    controls={false}
                    width="100%"
                    height="auto"
                />
            </div>

        </div>

    );
};

export default LiveStream;
