import {NextResponse} from 'next/server';
import {backendAuthHeaders, clearBackendAuthorization} from '../backend-auth';

const JOB_STATUS_API_URL =
    process.env.FUZZBALLS_JOB_STATUS_API_URL ||
    'https://bengarlock.com/api/v1/competition/job_status/';
const INCOGNITO_JOB_NAME = process.env.FUZZBALLS_INCOGNITO_JOB_NAME || 'fuzzballs_incognito';

async function readJson(response, fallbackMessage) {
    return response.json().catch(() => ({message: fallbackMessage}));
}

function jobList(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.results)) return data.results;
    return [];
}

async function fetchIncognitoJob() {
    const response = await fetch(JOB_STATUS_API_URL, {
        method: 'GET',
        headers: await backendAuthHeaders(),
        cache: 'no-store',
    });
    const data = await readJson(response, `Job status lookup failed with HTTP ${response.status}.`);

    if (!response.ok) {
        if (response.status === 401 || response.status === 403) clearBackendAuthorization();
        return {response, data, job: null};
    }

    const job = jobList(data).find((item) => item?.job_name === INCOGNITO_JOB_NAME);
    return {response, data, job};
}

export async function GET() {
    try {
        const {response, data, job} = await fetchIncognitoJob();
        if (!response.ok) return NextResponse.json(data, {status: response.status});
        if (!job) {
            return NextResponse.json({message: 'Incognito job was not found.'}, {status: 404});
        }

        return NextResponse.json(job);
    } catch (error) {
        return NextResponse.json({message: error.message || 'Incognito lookup failed.'}, {status: 502});
    }
}

export async function PATCH(request) {
    let payload;
    try {
        payload = await request.json();
    } catch {
        return NextResponse.json({message: 'Invalid JSON body.'}, {status: 400});
    }

    if (typeof payload?.running !== 'boolean') {
        return NextResponse.json({message: 'A boolean running value is required.'}, {status: 400});
    }

    try {
        const {response, data, job} = await fetchIncognitoJob();
        if (!response.ok) return NextResponse.json(data, {status: response.status});
        if (!job?.id) {
            return NextResponse.json({message: 'Incognito job was not found.'}, {status: 404});
        }

        const updateResponse = await fetch(`${JOB_STATUS_API_URL}${job.id}/`, {
            method: 'PATCH',
            headers: await backendAuthHeaders({'Content-Type': 'application/json'}),
            body: JSON.stringify({running: payload.running}),
            cache: 'no-store',
        });
        const updateJson = await readJson(updateResponse, `Incognito update failed with HTTP ${updateResponse.status}.`);

        if (!updateResponse.ok && (updateResponse.status === 401 || updateResponse.status === 403)) {
            clearBackendAuthorization();
        }

        return NextResponse.json(updateJson, {status: updateResponse.status});
    } catch (error) {
        return NextResponse.json({message: error.message || 'Incognito update failed.'}, {status: 502});
    }
}
