'use client'

import React from 'react';
import HLSPlayer from './HLSPlayer';

const LiveStream = () => {
    return (
        <HLSPlayer
            src="https://bengarlock.com/live/index.m3u8"
            autoPlay={true}
            controls={true}
            width="100%"
            height="auto"
        />
    );
};

export default LiveStream;
