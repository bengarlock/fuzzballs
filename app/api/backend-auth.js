const LOGIN_API_URL =
    process.env.FUZZBALLS_LOGIN_API_URL ||
    process.env.BENGARLOCK_LOGIN_API_URL ||
    'https://bengarlock.com/api/v1/login/';

let cachedAuthorization = null;
let cachedAt = 0;
const CACHE_TTL_MS = 10 * 60 * 1000;

function credentials() {
    return {
        username:
            process.env.FUZZBALLS_API_USERNAME ||
            process.env.BENGARLOCK_API_USERNAME,
        password:
            process.env.FUZZBALLS_API_PASSWORD ||
            process.env.BENGARLOCK_API_PASSWORD,
    };
}

export async function backendAuthorization() {
    if (cachedAuthorization && Date.now() - cachedAt < CACHE_TTL_MS) {
        return cachedAuthorization;
    }

    const {username, password} = credentials();
    if (!username || !password) {
        throw new Error('Backend API credentials are not configured.');
    }

    const response = await fetch(LOGIN_API_URL, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({username, password}),
        cache: 'no-store',
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data?.token) {
        cachedAuthorization = null;
        cachedAt = 0;
        throw new Error(data?.message || data?.detail || `Backend authorization failed with HTTP ${response.status}.`);
    }

    cachedAuthorization = `Token ${data.token}`;
    cachedAt = Date.now();
    return cachedAuthorization;
}

export function clearBackendAuthorization() {
    cachedAuthorization = null;
    cachedAt = 0;
}

export async function backendAuthHeaders(extra = {}) {
    return {
        Accept: 'application/json',
        Authorization: await backendAuthorization(),
        ...extra,
    };
}
