'use client'

const getIncognitoStatus = (setIncognitoJob, authToken) => {


    const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    const payload = {
        method: 'GET',
        headers: {
            "X-CSRFToken": csrfToken,
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": authToken
        },
        redirect: "follow",
    }
    fetch("https://bengarlock.com/api/v1/competition/job_status/", payload)
        .then(response => response.json())
        .then(results => {
            const incognitoStatus = results.find((i) => i.job_name === "fuzzballs_incognito")
            setIncognitoJob(incognitoStatus)

        })
        .catch((error) => {
            console.log(error)
        })

}

export default getIncognitoStatus;
