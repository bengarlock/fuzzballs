'use client'
import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({
                       src,
                       autoPlay = true,
                       muted = true,
                       controls = false,
                       width = '100%',
                       height = 'auto',
                   }) => {
    const videoRef = useRef(null);
    const hlsRef = useRef(null);
    const retryTimeout = useRef(null);

    const [status, setStatus] = useState('loading');
    // loading | playing | stalled | offline

    const startPlayback = async () => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true;

        try {
            await video.play();
            setStatus('playing');
        } catch {
            setStatus('stalled');
        }
    };

    const initHls = () => {
        const video = videoRef.current;
        if (!video) return;

        if (hlsRef.current) {
            hlsRef.current.destroy();
        }

        const hls = new Hls({
            lowLatencyMode: true,
            backBufferLength: 30,
            maxLiveSyncPlaybackRate: 1.5,
        });

        hlsRef.current = hls;

        hls.loadSource(src);
        hls.attachMedia(video);

        hls.on(Hls.Events.MANIFEST_PARSED, startPlayback);

        hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
                setStatus('offline');
                retryTimeout.current = setTimeout(initHls, 3000);
            } else {
                setStatus('stalled');
            }
        });
    };

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        setStatus('loading');

        if (Hls.isSupported()) {
            initHls();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', startPlayback);
        }

        return () => {
            clearTimeout(retryTimeout.current);
            hlsRef.current?.destroy();
        };
    }, [src]);

    return (
        <div className="relative w-full">
            <video
                ref={videoRef}
                muted
                autoPlay={autoPlay}
                playsInline
                controls={controls && status === 'playing'}
                width={width}
                height={height}
                className="rounded-xl bg-black"
            />

            {status !== 'playing' && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-white rounded-xl">
                    {status === 'loading' && 'Loading live stream…'}
                    {status === 'stalled' && 'Reconnecting…'}
                    {status === 'offline' && 'Stream offline — retrying'}
                </div>
            )}
        </div>
    );
};

export default HLSPlayer;