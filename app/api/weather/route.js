import {NextResponse} from 'next/server';
import {backendAuthHeaders, clearBackendAuthorization} from '../backend-auth';

const WEATHER_API_URL =
    process.env.FUZZBALLS_WEATHER_API_URL || 'https://bengarlock.com/api/v1/garden/weather/';

async function jsonResponse(response, fallbackMessage) {
    const data = await response.json().catch(() => ({message: fallbackMessage}));
    if (!response.ok && (response.status === 401 || response.status === 403)) {
        clearBackendAuthorization();
    }
    return NextResponse.json(data, {status: response.status});
}

export async function POST(request) {
    let payload;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({message: 'Invalid JSON body.'}, {status: 400});
    }

    let response;
    try {
        response = await fetch(WEATHER_API_URL, {
            method: 'POST',
            headers: await backendAuthHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify(payload),
            cache: 'no-store',
        });
    } catch (error) {
        return NextResponse.json({message: error.message || 'Weather request failed.'}, {status: 502});
    }

    return jsonResponse(response, `Weather request failed with HTTP ${response.status}.`);
}
