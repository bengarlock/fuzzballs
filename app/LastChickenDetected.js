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

export default function LastChickenDetected({authToken}) {
    const [clipPanel, setClipPanel] = useState(null);
    const requestRef = useRef(null);
    const filenameRef = useRef(null);
    const authTokenRef = useRef(authToken);
    const videoRef = useRef(null);

    const eventLabel = useMemo(
        () => formatEventTime(clipPanel?.event?.created_at || clipPanel?.requestedAt),
        [clipPanel?.event?.created_at, clipPanel?.requestedAt],
    );

    useEffect(() => {
        authTokenRef.current = authToken;
    }, [authToken]);

    const requestClipDelete = (filename) => {
        if (!filename) return;

        fetch(LAST_CHICKEN_API, {
            method: 'DELETE',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                ...(authTokenRef.current ? {Authorization: authTokenRef.current} : {}),
            },
            body: JSON.stringify({filename}),
        }).catch(() => {
            // Best effort cleanup; playback should not be interrupted by cleanup failures.
        });
    };

    const handleClose = () => {
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
            requestedAt: null,
            error: null,
        });

        fetch(LAST_CHICKEN_API, {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                ...(authToken ? {Authorization: authToken} : {}),
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

    return (
        <>
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-white/70">
                    Empty frame? Jump to the latest camera motion.
                </p>
                <button
                    type="button"
                    onClick={handleFetchLatest}
                    disabled={clipPanel?.status === 'loading'}
                    className="inline-flex min-h-10 items-center justify-center rounded-full bg-amber-300 px-4 py-2 text-sm font-semibold text-slate-950 shadow-lg shadow-black/20 transition hover:bg-amber-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-100 disabled:cursor-wait disabled:opacity-70"
                >
                    {clipPanel?.status === 'loading' ? 'Finding clip...' : 'Last Chicken Detected'}
                </button>
            </div>

            {clipPanel && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 py-6 backdrop-blur-sm">
                    <div className="w-full max-w-3xl rounded-2xl border border-white/15 bg-slate-950/95 p-4 text-white shadow-2xl">
                        <div className="mb-3 flex items-start justify-between gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wide text-amber-200">
                                    Last Chicken Detected
                                </p>
                                <p className="text-sm text-white/65">{eventLabel}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleClose}
                                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-lg leading-none text-white/75 transition hover:bg-white/20 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-200"
                                aria-label="Close chicken clip"
                            >
                                x
                            </button>
                        </div>

                        {clipPanel.status === 'loading' && (
                            <div className="flex aspect-video items-center justify-center rounded-xl bg-black/50 text-sm text-white/75">
                                Fetching the latest motion clip...
                            </div>
                        )}

                        {clipPanel.status === 'error' && (
                            <div className="rounded-xl border border-red-300/30 bg-red-950/70 p-4 text-sm text-red-100">
                                {clipPanel.error}
                            </div>
                        )}

                        {clipPanel.status === 'ready' && clipPanel.clipUrl && (
                            <video
                                ref={videoRef}
                                key={clipPanel.clipUrl}
                                src={clipPanel.clipUrl}
                                autoPlay
                                controls
                                playsInline
                                preload="metadata"
                                className="aspect-video w-full rounded-xl bg-black"
                            />
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
