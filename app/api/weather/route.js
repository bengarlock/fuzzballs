import {NextResponse} from 'next/server';

const WEATHER_API_URL =
    process.env.FUZZBALLS_WEATHER_API_URL || 'https://bengarlock.com/api/v1/garden/weather/';

function authHeaders(request) {
    const authorization = request.headers.get('authorization');
    return {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...(authorization ? {Authorization: authorization} : {}),
    };
}

async function jsonResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({message: fallbackMessage}));
    return NextResponse.json(data, {status: response.status});
}

export async function POST(request) {
    let payload;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({message: 'Invalid JSON body.'}, {status: 400});
    }

    const response = await fetch(WEATHER_API_URL, {
        method: 'POST',
        headers: authHeaders(request),
        body: JSON.stringify(payload),
        cache: 'no-store',
    });

    return jsonResponse(response, `Weather request failed with HTTP ${response.status}.`);
}
