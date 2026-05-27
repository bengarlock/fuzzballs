import {NextResponse} from 'next/server';

const EVENTS_API_URL =
    process.env.FUZZBALLS_UNIFI_EVENTS_API_URL || 'https://bengarlock.com/api/v1/unifi/events/';
const CLIP_API_URL =
    process.env.FUZZBALLS_NVR_CLIPS_API_URL ||
    process.env.GARDEN_NVR_CLIPS_API_URL ||
    'https://bengarlock.com/api/v1/garden/nvr-clips/';
const CLIP_CAMERA_ID =
    process.env.FUZZBALLS_UNIFI_CAMERA_ID ||
    process.env.UNIFI_PROTECT_CAMERA_ID ||
    process.env.NEXT_PUBLIC_FUZZBALLS_CAMERA_ID ||
    '';
const EVENT_CAMERA_ID = process.env.FUZZBALLS_UNIFI_EVENT_CAMERA_ID || CLIP_CAMERA_ID;
const MOTION_EVENT_TYPE = process.env.FUZZBALLS_UNIFI_MOTION_EVENT_TYPE || 'motion';
const CLIP_LIVE_GUARD_MS = 15 * 1000;
const CLIP_CONTEXT_SECONDS = 2;
const MAX_CATCH_UP_SECONDS = 10 * 60;

function authHeaders(request, extra = {}) {
    const authorization = request.headers.get('authorization');
    return {
        Accept: 'application/json',
        ...(authorization ? {Authorization: authorization} : {}),
        ...extra,
    };
}

async function readJson(response, fallbackMessage) {
    return response.json().catch(() => ({message: fallbackMessage}));
}

function eventList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
}

function eventTime(event) {
    const ms = Date.parse(event?.created_at || event?.updated_at || '');
    return Number.isFinite(ms) ? ms : 0;
}

function latestMotionEvent(events) {
    const expectedType = MOTION_EVENT_TYPE.trim().toLowerCase();
    const expectedCamera = EVENT_CAMERA_ID.trim();

    return events
        .filter((event) => {
            const eventType = String(event?.event_type || '').trim().toLowerCase();
            const eventCamera = String(event?.camera_id || '').trim();
            return eventType === expectedType && eventCamera === expectedCamera;
        })
        .sort((a, b) => eventTime(b) - eventTime(a))[0];
}

function safeClipInstant(event) {
    const eventMs = eventTime(event);
    const latestSafeMs = Date.now() - CLIP_LIVE_GUARD_MS;
    return new Date(Math.min(eventMs, latestSafeMs)).toISOString();
}

function catchUpSecondsAfter(event) {
    const eventMs = eventTime(event);
    const latestSafeMs = Date.now() - CLIP_LIVE_GUARD_MS;
    if (!eventMs || eventMs >= latestSafeMs) return 15;

    return Math.max(15, Math.min(MAX_CATCH_UP_SECONDS, Math.ceil((latestSafeMs - eventMs) / 1000)));
}

export async function POST(request) {
    if (!CLIP_CAMERA_ID.trim()) {
        return NextResponse.json(
            {message: 'FUZZBALLS_UNIFI_CAMERA_ID or UNIFI_PROTECT_CAMERA_ID must be set.'},
            {status: 500},
        );
    }
    if (!EVENT_CAMERA_ID.trim()) {
        return NextResponse.json(
            {message: 'FUZZBALLS_UNIFI_EVENT_CAMERA_ID must be set.'},
            {status: 500},
        );
    }

    const eventsResponse = await fetch(EVENTS_API_URL, {
        method: 'GET',
        headers: authHeaders(request),
        cache: 'no-store',
    });
    const eventsJson = await readJson(eventsResponse, `Event lookup failed with HTTP ${eventsResponse.status}.`);

    if (!eventsResponse.ok) {
        return NextResponse.json(eventsJson, {status: eventsResponse.status});
    }

    const event = latestMotionEvent(eventList(eventsJson));
    if (!event) {
        return NextResponse.json(
            {message: 'No recent chicken motion events were found for the configured camera.'},
            {status: 404},
        );
    }

    const requestedAt = safeClipInstant(event);
    const secondsAfter = catchUpSecondsAfter(event);
    const clipResponse = await fetch(CLIP_API_URL, {
        method: 'POST',
        headers: authHeaders(request, {'Content-Type': 'application/json'}),
        body: JSON.stringify({
            at: requestedAt,
            camera_id: CLIP_CAMERA_ID.trim(),
            seconds_before: CLIP_CONTEXT_SECONDS,
            seconds_after: secondsAfter,
        }),
        cache: 'no-store',
    });
    const clipJson = await readJson(clipResponse, `Clip request failed with HTTP ${clipResponse.status}.`);

    if (!clipResponse.ok) {
        return NextResponse.json(clipJson, {status: clipResponse.status});
    }

    return NextResponse.json(
        {
            ...clipJson,
            event: {
                id: event.id,
                event_id: event.event_id,
                event_type: event.event_type,
                camera_id: event.camera_id,
                clip_camera_id: CLIP_CAMERA_ID.trim(),
                created_at: event.created_at,
                event_link: event.event_link,
            },
            catch_up: {
                seconds_before: CLIP_CONTEXT_SECONDS,
                seconds_after: secondsAfter,
                returns_to_live_on_end: true,
            },
        },
        {status: clipResponse.status},
    );
}

export async function DELETE(request) {
    let payload;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({message: 'Invalid JSON body.'}, {status: 400});
    }

    if (!payload?.filename) {
        return NextResponse.json({message: 'A clip filename is required.'}, {status: 400});
    }

    const response = await fetch(CLIP_API_URL, {
        method: 'DELETE',
        headers: authHeaders(request, {'Content-Type': 'application/json'}),
        body: JSON.stringify({filename: payload.filename}),
        cache: 'no-store',
    });
    const json = await readJson(response, `Clip deletion failed with HTTP ${response.status}.`);

    return NextResponse.json(json, {status: response.status});
}
