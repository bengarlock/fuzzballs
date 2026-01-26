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
    const badgeDelayTimeout = useRef(null);

    const [status, setStatus] = useState('loading');
    // loading | playing | stalled | offline
    const [showStatusBadge, setShowStatusBadge] = useState(false);

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
        // Hide immediately when playing; delay showing for transient hiccups.
        if (status === 'playing') {
            setShowStatusBadge(false);
            clearTimeout(badgeDelayTimeout.current);
            return;
        }

        clearTimeout(badgeDelayTimeout.current);
        badgeDelayTimeout.current = setTimeout(() => {
            setShowStatusBadge(true);
        }, 900);

        return () => clearTimeout(badgeDelayTimeout.current);
    }, [status]);

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

            {status !== 'playing' && showStatusBadge && (
                <div className="absolute bottom-2 right-2 flex justify-end pointer-events-none">
                    <span className="text-[10px] sm:text-xs text-white/70 bg-black/25 backdrop-blur-sm px-2 py-0.5 rounded-full opacity-80">
                        {status === 'loading' && 'Loading…'}
                        {status === 'stalled' && 'Reconnecting…'}
                        {status === 'offline' && 'Offline — retrying'}
                    </span>
                </div>
            )}
        </div >
    );
};

export default HLSPlayer;