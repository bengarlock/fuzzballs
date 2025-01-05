'use client'
import {globalStore} from "@/app/globalstore";
import {useEffect} from "react";
import getIncognitoStatus from "@/app/admin/getIncognitoStatus";
import Authorize from "@/app/admin/Authorize";
import Image from "next/image";
import incognitoImage from "@/public/media/incognito.png";

const Admin = () => {

    const {incognitoJob, setIncognitoJob, authToken, setAuthToken} = globalStore()

    useEffect(() => {
        const fetchAuthAndStatus = async () => {
            if (!authToken) {
                try {
                    const token = await Authorize();
                    setAuthToken(token);
                    if (token) {
                        await getIncognitoStatus(setIncognitoJob, token);
                    }
                } catch (error) {
                    console.error("Error during authorization or fetching status:", error);
                }
            }
        };

        fetchAuthAndStatus();
    }, [authToken, setAuthToken, setIncognitoJob]);

    const handleToggle = () => {
        const csrfToken = document.cookie
            .split('; ')
            .find(row => row.startsWith('csrftoken='))
            ?.split('=')[1];

        const payload = {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "content-type": "application/json",
                "Authorization": authToken,
                "X-CSRFToken": csrfToken,
            },
            body: JSON.stringify(
                {
                    running: !incognitoJob.running
                }
            )
        }

        let newIncognitoJob = {...incognitoJob}
        newIncognitoJob.running = !newIncognitoJob.running

        fetch("https://bengarlock.com/api/v1/competition/job_status/" + incognitoJob.id + "/", payload)
            .then(res => res.json())
            .then(() => setIncognitoJob(newIncognitoJob))
            .catch(err => console.log(err))

    };

    return (
        <>
            {incognitoJob.id ? (
                <div className="flex flex-col items-center bg-gray-800 p-8 min-h-screen w-full">
                    <h1>ADMIN</h1>
                    <h2 className="text-xl font-semibold mb-4">Incognito Mode</h2>
                    <label className="inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            className="hidden"
                            checked={incognitoJob.running}
                            onChange={handleToggle}
                        />

                        <div className="relative">
                            <div
                                className={`w-14 h-8 rounded-full shadow-inner transition-colors ${
                                    incognitoJob.running ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                            ></div>
                            <div
                                className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-transform ${
                                    incognitoJob.running ? 'transform translate-x-7' : 'transform translate-x-0'
                                }`}
                            ></div>
                        </div>
                    </label>
                    <div className='m-3'>
                        <a href='https://bengarlock.com/fuzzballs/'>Home</a>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center bg-gray-800 p-8 min-h-screen w-full">
                    <div className="flex items-center justify-center mt-20">
                        <Image
                            className="rounded-full overflow-hidden w-[300px] h-[300px] animate-bounce"
                            src={incognitoImage}
                            alt="Loading"
                        />
                    </div>
                    <div>
                        Loading...
                    </div>
                </div>
            )
            }
        </>
    )
}

export default Admin