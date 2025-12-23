'use client'
import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

const HLSPlayer = ({
                       src,
                       autoPlay = true,
                       controls = false,
                       width,
                       height,
                   }) => {
    const videoRef = useRef(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        video.muted = true; // reinforce muted state

        if (Hls.isSupported()) {
            const hls = new Hls({
                autoStartLoad: true,
            });

            hls.loadSource(src);
            hls.attachMedia(video);

            hls.on(Hls.Events.MANIFEST_PARSED, () => {
                if (autoPlay) {
                    video
                        .play()
                        .catch(err => console.warn('Autoplay blocked:', err));
                }
            });

            return () => hls.destroy();
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = src;
            video.addEventListener('loadedmetadata', () => {
                if (autoPlay) {
                    video.play().catch(() => {});
                }
            });
        }
    }, [src, autoPlay]);

    return (
        <video
            ref={videoRef}
            className="rounded-xl"
            muted
            autoPlay={autoPlay}
            playsInline
            controls={controls}
            width={width}
            height={height}
        />
    );
};

export default HLSPlayer;