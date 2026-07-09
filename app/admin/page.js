'use client'
import {globalStore} from "@/app/globalstore";
import {useEffect} from "react";
import getIncognitoStatus from "@/app/admin/getIncognitoStatus";
import Image from "next/image";
import incognitoImage from "@/public/media/incognito.png";

const APP_BASE_PATH = process.env.NEXT_PUBLIC_FUZZBALLS_BASE_PATH || '/fuzzballs';

const Admin = () => {

    const {incognitoJob, setIncognitoJob} = globalStore()

    useEffect(() => {
        getIncognitoStatus(setIncognitoJob);
    }, [setIncognitoJob]);

    const handleToggle = () => {
        const payload = {
            method: 'PATCH',
            headers: {
                "Accept": "application/json",
                "content-type": "application/json",
            },
            body: JSON.stringify(
                {
                    running: !incognitoJob.running
                }
            )
        }

        let newIncognitoJob = {...incognitoJob}
        newIncognitoJob.running = !newIncognitoJob.running

        fetch(`${APP_BASE_PATH}/api/incognito-status`, payload)
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
