'use client';
import HLSPlayer from './HLSPlayer';
import Weather from "@/app/weather";
import Age from "@/app/age";
import { globalStore } from "@/app/globalstore";
import Brightness from "@/app/brightness";
import { useEffect } from "react";
import Peckingorder from "@/app/peckingorder";
import Image from 'next/image';
import incognitoImage from '@/public/media/incognito.png';
import getIncognitoStatus from "@/app/admin/getIncognitoStatus";
import Authorize from "@/app/admin/Authorize";

const LiveStream = () => {
    const { weather, incognitoJob, setIncognitoJob, authToken, setAuthToken } = globalStore();

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

    const renderURL = () => {
        const hlsUrl =
            weather.brightness < 15
                ? 'https://bengarlock.com/fuzzballs/roost/index.m3u8'
                : 'https://bengarlock.com/fuzzballs/run/index.m3u8';
        return `${hlsUrl}?t=${new Date().getTime()}`;
    };

    return (
        <div className="relative flex flex-col items-center p-8 min-h-screen w-full">
            {/* Background div with fixed position and opacity */}
            <div
                className="fixed top-0 left-0 w-full h-full bg-cover bg-center opacity-50"
                style={{ backgroundImage: "url('/fuzzballs/media/photos/headerbar.jpeg')" }}
            />

            {/* Content container ensuring it stays on top */}
            <div className="relative z-10 flex flex-col justify-evenly items-center text-center w-full md:w-1/2">
                <div className="flex flex-row">
                    <h1 className="mb-4 text-2xl font-extrabold leading-none tracking-tight text-gray-400 md:text-2xl lg:text-4xl dark:text-white">
                        Welcome to the Chickie Cam!
                    </h1>
                </div>

                {incognitoJob.id ? (
                    incognitoJob.running ? (
                        <>
                            <div className="mt-20 rounded-full overflow-hidden w-[300px] h-[300px]">
                                <Image src={incognitoImage} alt="Incognito" />
                            </div>
                            <p>The Chickie Cam will be back soon!</p>
                        </>
                    ) : (
                        <>
                            <p>We are Lavender and Buff Orpington chickens</p>
                            <div className="m-2">
                                <HLSPlayer src={renderURL()} autoPlay={true} controls={true} width="100%" height="auto" />
                            </div>
                            <Weather />

                            <div className="flex flex-col md:flex-row w-full justify-around">
                                <div className="flex flex-col bg-purple-900 items-center rounded-xl p-2 flex-1 min-h-[150px] m-2">
                                    <h1>Lavenders</h1>
                                    <div>Claire Anne - <span className="text-pink-500">Pink, </span></div>
                                    <div>Annabelle Bronstein - <span className="text-purple-600">Purple, </span></div>
                                    <div>Bunny MacDougal - <span className="text-green-600">Green, </span></div>
                                    <div>and Magda - <span className="text-yellow-300">Yellow</span></div>
                                    <div><Age date={'2024-07-22'} /></div>
                                </div>
                                <div className="flex flex-col bg-amber-600 items-center rounded-xl p-2 flex-1 min-h-[150px] m-2">
                                    <h1>Buffs</h1>
                                    <div>Carrie - <span className="text-pink-500">Pink, </span></div>
                                    <div>Charlotte - <span className="text-purple-600">Purple, </span></div>
                                    <div>Samantha - <span className="text-green-600">Green, </span></div>
                                    <div>Miranda - <span className="text-red-800">Red</span></div>
                                    <div><Age date={'2023-06-12'} /></div>
                                </div>
                            </div>

                            <Peckingorder />
                            <Brightness />
                        </>
                    )
                ) : (
                    <div>
                        <div className="flex items-center justify-center mt-20">
                            <Image className="rounded-full overflow-hidden w-[300px] h-[300px] animate-bounce" src={incognitoImage} alt="Loading" />
                        </div>
                        <div>Loading...</div>
                    </div>
                )}
            </div>
        </div>

    );
};

export default LiveStream;
