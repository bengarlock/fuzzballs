'use client';

import {useEffect, useMemo, useRef, useState} from 'react';

const APP_BASE_PATH = process.env.NEXT_PUBLIC_FUZZBALLS_BASE_PATH || '/fuzzballs';
const LAST_CHICKEN_API = `${APP_BASE_PATH}/api/last-chicken-detected`;

function formatEventTime(value) {
    if (!value) return 'Most recent motion event';

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Most recent motion event';

    return new Intl.DateTimeFormat(undefined, {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
    }).format(date);
}

export default function LastChickenDetected({children}) {
    const [clipPanel, setClipPanel] = useState(null);
    const requestRef = useRef(null);
    const filenameRef = useRef(null);
    const videoRef = useRef(null);

    const eventLabel = useMemo(
        () => formatEventTime(clipPanel?.event?.created_at || clipPanel?.requestedAt),
        [clipPanel?.event?.created_at, clipPanel?.requestedAt],
    );

    const requestClipDelete = (filename) => {
        if (!filename) return;

        fetch(LAST_CHICKEN_API, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({filename}),
        }).catch(() => {
            // Best effort cleanup; playback should not be interrupted by cleanup failures.
        });
    };

    const handleBackToLive = () => {
        if (requestRef.current) {
            requestRef.current.abort();
            requestRef.current = null;
        }
        requestClipDelete(filenameRef.current);
        filenameRef.current = null;
        setClipPanel(null);
    };

    const handleFetchLatest = () => {
        if (requestRef.current) {
            requestRef.current.abort();
        }
        requestClipDelete(filenameRef.current);
        filenameRef.current = null;

        const controller = new AbortController();
        requestRef.current = controller;

        setClipPanel({
            status: 'loading',
            clipUrl: null,
            filename: null,
            event: null,
            catchUp: null,
            requestedAt: null,
            error: null,
        });

        fetch(LAST_CHICKEN_API, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
            },
            signal: controller.signal,
        })
            .then(async (res) => {
                const json = await res.json().catch(() => ({}));
                if (!res.ok) {
                    throw new Error(json.message || json.detail || `HTTP ${res.status}`);
                }
                if (!json.clip_url) {
                    throw new Error('Clip response did not include a video URL.');
                }
                return json;
            })
            .then((json) => {
                filenameRef.current = json.filename ?? null;
                setClipPanel({
                    status: 'ready',
                    clipUrl: json.clip_url,
                    filename: json.filename ?? null,
                    event: json.event ?? null,
                    catchUp: json.catch_up ?? null,
                    requestedAt: json.requested_at ?? null,
                    error: null,
                });
            })
            .catch((error) => {
                if (error.name === 'AbortError') return;
                filenameRef.current = null;
                setClipPanel({
                    status: 'error',
                    clipUrl: null,
                    filename: null,
                    event: null,
                    catchUp: null,
                    requestedAt: null,
                    error: error.message ?? String(error),
                });
            })
            .finally(() => {
                if (requestRef.current === controller) {
                    requestRef.current = null;
                }
            });
    };

    useEffect(() => {
        if (clipPanel?.status !== 'ready' || !clipPanel.clipUrl || !videoRef.current) return;

        videoRef.current.play().catch(() => {
            // The browser can require a manual tap; controls remain visible.
        });
    }, [clipPanel?.status, clipPanel?.clipUrl]);

    useEffect(() => {
        return () => {
            if (requestRef.current) {
                requestRef.current.abort();
            }
            requestClipDelete(filenameRef.current);
            filenameRef.current = null;
        };
    }, []);

    const isClipMode = Boolean(clipPanel);

    return (
        <div className="space-y-3">
            <div className="relative aspect-video w-full overflow-hidden rounded-3xl bg-black shadow-xl">
                {!isClipMode && children}

                {clipPanel?.status === 'loading' && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-slate-950 text-center text-white">
                        <div className="h-8 w-8 animate-spin rounded-full border-2 border-amber-200/30 border-t-amber-200"/>
                        <div>
                            <p className="text-sm font-semibold text-amber-100">Finding the latest chicken clip</p>
                            <p className="mt-1 text-xs text-white/55">Checking the most recent camera motion event.</p>
                        </div>
                    </div>
                )}

                {clipPanel?.status === 'error' && (
                    <div className="flex h-full w-full items-center justify-center bg-slate-950 p-6 text-center">
                        <div className="max-w-md rounded-xl border border-red-300/30 bg-red-950/70 p-4 text-sm text-red-100">
                            {clipPanel.error}
                        </div>
                    </div>
                )}

                {clipPanel?.status === 'ready' && clipPanel.clipUrl && (
                    <video
                        ref={videoRef}
                        key={clipPanel.clipUrl}
                        src={clipPanel.clipUrl}
                        autoPlay
                        controls
                        playsInline
                        preload="metadata"
                        onEnded={handleBackToLive}
                        className="h-full w-full bg-black object-contain"
                    />
                )}

                {isClipMode && (
                    <div className="pointer-events-none absolute left-3 top-3 right-3 flex items-start justify-between gap-3">
                        <div className="rounded-xl bg-black/65 px-3 py-2 text-left shadow-lg backdrop-blur">
                            <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200">
                                Last Chicken Detected
                            </p>
                            <p className="text-xs text-white/70">{eventLabel}</p>
                            {clipPanel?.catchUp?.seconds_after > 15 && (
                                <p className="mt-1 text-[11px] text-white/55">
                                    Catching up to live
                                </p>
                            )}
                        </div>
                        <button
                            type="button"
                            onClick={handleBackToLive}
                            className="pointer-events-auto inline-flex min-h-9 items-center justify-center rounded-full bg-white/15 px-3 text-xs font-semibold text-white shadow-lg backdrop-blur transition hover:bg-white/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                        >
                            Live
                        </button>
                    </div>
                )}
            </div>

            <div className="flex justify-center px-1">
                <button
                    type="button"
                    onClick={handleFetchLatest}
                    disabled={clipPanel?.status === 'loading'}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 disabled:cursor-wait disabled:opacity-70"
                >
                    {clipPanel?.status === 'loading' ? 'Finding clip...' : 'Flown the coop? Click Here'}
                </button>
            </div>
        </div>
    );
}
