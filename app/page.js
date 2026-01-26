'use client';

import {motion} from "framer-motion";
import HLSPlayer from "./HLSPlayer";
import Weather from "@/app/Weather";
import Brightness from "@/app/brightness";
import PeckingOrder from "@/app/PeckingOrder";
import StatusPill from "./StatusPill";
import ChickenCard from "./ChickenCard";
import Image from "next/image";
import incognitoImage from "@/public/media/incognito.png";
import {globalStore} from "@/app/globalstore";
import getIncognitoStatus from "@/app/admin/getIncognitoStatus";
import Authorize from "@/app/admin/Authorize";
import {useEffect} from "react";

export default function LiveStream() {
    const {
        weather,
        incognitoJob,
        setIncognitoJob,
        authToken,
        setAuthToken
    } = globalStore();

    const isDay = weather.brightness >= 11;

    useEffect(() => {
        const run = async () => {
            if (!authToken) {
                const token = await Authorize();
                setAuthToken(token);
                if (token) await getIncognitoStatus(setIncognitoJob, token);
            }
        };
        run();
    }, [authToken, setAuthToken, setIncognitoJob]);

    const streamUrl = () =>
        `${
            isDay
                ? "https://bengarlock.com/fuzzballs/run/index.m3u8"
                : "https://bengarlock.com/fuzzballs/roost/index.m3u8"
        }?t=${Date.now()}`;

    return (
        <div className="relative min-h-screen overflow-hidden">
            {/* Background */}
            <div
                className="absolute inset-0 bg-cover bg-center scale-110"
                style={{
                    backgroundImage:
                        "url('/fuzzballs/media/photos/headerbar.jpeg')",
                    position: "fixed"
                }}
            />
            <div
                className={`absolute inset-0 ${
                    isDay ? "bg-black/30" : "bg-black/60"
                }`}
            />

            {/* Content */}
            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 text-white">
                <motion.div
                    initial={{opacity: 0, y: 20}}
                    animate={{opacity: 1, y: 0}}
                    transition={{duration: 0.8}}
                    className="backdrop-blur-xl bg-white/10 rounded-[32px] p-8 shadow-2xl"
                >
                    {/* Header */}
                    <div className="flex flex-col items-center mb-8">
                        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2">
                            Chickie Cam
                        </h1>
                        <StatusPill active={isDay}/>
                    </div>

                    {/* Stream */}
                    {incognitoJob?.running ? (
                        <div className="flex flex-col items-center py-20">
                            <Image
                                src={incognitoImage}
                                alt="Sleeping"
                                className="w-64 h-64 rounded-full"
                            />
                            <p className="mt-4 text-white/70">
                                The flock is resting 💤
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex flex-col gap-2 items-stretch">
                                {/* Stream */}
                                <motion.div
                                    initial={{opacity: 0}}
                                    animate={{opacity: 1}}
                                    transition={{delay: 0.3}}
                                    className="rounded-3xl overflow-hidden shadow-xl mb-6"
                                >
                                    <HLSPlayer
                                        src={streamUrl()}
                                        autoPlay
                                        muted
                                        controls
                                        width="100%"
                                    />
                                </motion.div>

                                <Weather/>

                                {/* Chickens */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                    <ChickenCard
                                        title="Lavenders"
                                        bg="bg-purple-900/70"
                                        birthDate="2024-07-22"
                                        chickens={[
                                            {name: "Claire Anne", color: "Pink", ringColor: "text-pink-400"},
                                            {
                                                name: "Annabelle Bronstein",
                                                color: "Purple",
                                                ringColor: "text-purple-400"
                                            },
                                            {name: "Bunny MacDougal", color: "Green", ringColor: "text-green-400"},
                                            {name: "Magda", color: "Yellow", ringColor: "text-yellow-300"},
                                        ]}
                                    />

                                    <ChickenCard
                                        title="Buffs"
                                        bg="bg-amber-600/80"
                                        birthDate="2023-06-12"
                                        chickens={[
                                            {name: "Carrie", color: "Pink", ringColor: "text-pink-400"},
                                            {name: "Charlotte", color: "Purple", ringColor: "text-purple-400"},
                                            {name: "Samantha", color: "Green", ringColor: "text-green-400"},
                                            {name: "Miranda", color: "Red", ringColor: "text-red-300"},
                                        ]}
                                    />
                                </div>

                                <PeckingOrder/>
                                <Brightness/>
                            </div>
                        </>
                    )}
                </motion.div>
            </div>
        </div>
    );
}