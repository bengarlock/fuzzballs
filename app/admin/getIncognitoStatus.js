'use client'

const APP_BASE_PATH = process.env.NEXT_PUBLIC_FUZZBALLS_BASE_PATH || '/fuzzballs';

const getIncognitoStatus = (setIncognitoJob) => {
    fetch(`${APP_BASE_PATH}/api/incognito-status`, {
        method: 'GET',
        headers: {
            "Accept": "application/json",
        },
        redirect: "follow",
    })
        .then(async (response) => {
            const result = await response.json().catch(() => ({}));
            if (!response.ok) {
                throw new Error(result.message || result.detail || `HTTP ${response.status}`);
            }
            return result;
        })
        .then((incognitoStatus) => {
            setIncognitoJob(incognitoStatus)

        })
        .catch((error) => {
            console.log(error)
        })

}

export default getIncognitoStatus;
