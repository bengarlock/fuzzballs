'use client';

import Authorize from "@/app/Authorize";
import {globalStore} from "@/app/globalstore";

const getIncognitoStatus = async (setIncognito) => {

    try {
        const token = await Authorize();
        const myHeaders = new Headers();

        // Retrieve CSRF token from cookies
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1]; // Optional chaining for safety

        if (csrfToken) {
            myHeaders.append("X-CSRFToken", csrfToken);
        }

        // Set headers
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Accept", "application/json");
        myHeaders.append("Authorization", `Token ${token}`);

        // Fetch data
        const response = await fetch(
            "https://bengarlock.com/api/v1/competition/job_status/",
            {
                method: "GET",
                headers: myHeaders,
                redirect: "follow",
            }
        );

        const results = await response.json();

        // Extract incognito status
        const incognitoStatus = results.find(
            (i) => i.job_name === "fuzzballs_incognito"
        );

        const status = incognitoStatus?.running ?? false; // Fallback to false
        setIncognito(status); // Update the global store
        return status; // Return the status
    } catch (error) {
        console.error("Error fetching incognito status:", error);
        setIncognito(false); // Default to false on error
        return false; // Return false to indicate failure
    }
};

export default getIncognitoStatus;
