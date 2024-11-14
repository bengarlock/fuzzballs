'use client'
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({ src, autoPlay, controls, width, height }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        if (Hls.isSupported()) {
            const hls = new Hls();
            hls.loadSource(src);
            hls.attachMedia(videoRef.current);
        } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
            videoRef.current.src = src;
        }
    }, [src]);

    return (
        <video className='rounded-xl'
            ref={videoRef}
            autoPlay={autoPlay}
            controls={controls}
            width={width}
            height={height}
        />
    );
};

export default HLSPlayer;