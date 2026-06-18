'use client';

import Link from "next/link";
import {useCallback, useEffect, useState} from "react";

const basePath = "/fuzzballs/media/gallery";

const galleryItems = [
    {type: "video", src: "IMG_0156.mp4", poster: "F0005572-76E9-4CA6-B7DA-593D338449BF_1_105_c.jpeg", width: 720, height: 1280, caption: "Found the secret nesting spot", date: "May 2026"},
    {src: "CE7B6447-4E5F-434A-855B-37C984E15E90.PNG.png", width: 1024, height: 1536, caption: "Holiday finest", date: "December 2025"},
    {src: "IMG_2366.jpeg", width: 4032, height: 3024, caption: "A very serious dust bath", date: "September 2025"},
    {src: "IMG_1064.jpeg", width: 1832, height: 2197, caption: "A magnificent molt", date: "November 2024"},
    {type: "video", src: "when-raccoons-attack.mp4", poster: "9463DB64-B2F2-46BE-B041-CE6601A1738B_1_102_o.jpeg", width: 1280, height: 720, caption: "When raccoons attack", date: "October 2024"},
    {src: "IMG_4334.jpeg", width: 3024, height: 4032, caption: "On patrol", date: "February 2024"},
    {src: "IMG_4332.jpeg", width: 3024, height: 4032, caption: "Foraging department", date: "February 2024"},
    {src: "IMG_0315.jpeg", width: 1284, height: 1682, caption: "Garden-party attire", date: "March 2024"},
    {src: "IMG_0586.jpeg", width: 4032, height: 3024, caption: "The hedge committee", date: "May 2024"},
    {src: "IMG_0636.jpeg", width: 1183, height: 1902, caption: "A quiet word", date: "June 2024"},
    {src: "IMG_0701.jpeg", width: 4032, height: 3024, caption: "Deck inspection", date: "July 2024"},
    {src: "IMG_0706.jpeg", width: 4032, height: 3024, caption: "Three-chicken conference", date: "July 2024"},
    {src: "IMG_0743.jpeg", width: 1284, height: 2224, caption: "Yes?", date: "July 2024"},
    {type: "video", src: "IMG_0844.mp4", poster: "IMG_0844-poster.jpg", width: 720, height: 1280, caption: "The flock in motion", date: "August 2024"},
    {type: "video", src: "IMG_0913.mp4", poster: "IMG_0913-poster.jpg", width: 720, height: 1280, caption: "More chicken business", date: "September 2024"},
    {src: "IMG_0962.jpeg", width: 1382, height: 1238, caption: "Everybody in", date: "October 2024"},
    {src: "IMG_1151.jpeg", width: 4032, height: 3024, caption: "A private moment", date: "December 2024"},
    {type: "video", src: "IMG_2430.mp4", poster: "87FE717B-CFA2-46C2-9C23-9262344AE621_1_105_c.jpeg", width: 1280, height: 720, caption: "Backyard rush hour", date: "October 2023"},
    {type: "video", src: "IMG_2407.mp4", poster: "86A57D4D-E17C-4962-8C03-A2B193EEF87C_1_105_c.jpeg", width: 720, height: 1280, caption: "Snacks from the hand", date: "October 2023"},
    {type: "video", src: "IMG_2316.mp4", poster: "2991AAD4-A53F-460F-B392-F010168BB934_1_105_c.jpeg", width: 720, height: 1280, caption: "Settling into the brooder", date: "September 2023"},
    {type: "video", src: "IMG_3721.mp4", poster: "4D124DD3-5455-4937-A366-00BE763C5867_1_105_c.jpeg", width: 720, height: 1280, caption: "Garden path patrol", date: "September 2023"},
    {src: "IMG_2129.jpeg", width: 4032, height: 3024, caption: "A handful of fuzz", date: "July 2023"},
    {type: "video", src: "IMG_3284.mp4", poster: "C3671805-29D6-45C0-A6C0-60C7124B30A5_1_105_c.jpeg", width: 1280, height: 720, caption: "The tiny track meet", date: "June 2023"},
    {src: "IMG_2032.jpeg", width: 4032, height: 3024, caption: "First days outside", date: "July 2023"},
    {src: "IMG_2096.jpeg", width: 1927, height: 833, caption: "The original lineup", date: "July 2023"},
    {src: "IMG_3330.jpg", width: 640, height: 480, caption: "Small but mighty", date: "July 2023"},
    {src: "IMG_3566.jpeg", width: 4032, height: 3024, caption: "Coop reconnaissance", date: "August 2023"},
    {src: "IMG_2281.jpeg", width: 4032, height: 3024, caption: "Good side", date: "September 2023"},
    {src: "IMG_2285.jpeg", width: 4032, height: 3024, caption: "Other good side", date: "September 2023"},
    {src: "IMG_3728.jpeg", width: 4032, height: 3024, caption: "Unexpected company", date: "September 2023"},
    {src: "IMG_2488.jpeg", width: 1284, height: 2256, caption: "Table for one", date: "October 2023"},
    {src: "IMG_2491.jpeg", width: 4032, height: 3024, caption: "No personal space", date: "October 2023"},
    {src: "IMG_2518.jpeg", width: 1284, height: 1984, caption: "Autumn portrait", date: "November 2023"},
    {src: "IMG_2522.jpeg", width: 1284, height: 2195, caption: "The look", date: "November 2023"},
    {src: "IMG_2524.jpeg", width: 1284, height: 2124, caption: "Yard supervisor", date: "November 2023"},
    {src: "IMG_2527.jpeg", width: 1265, height: 2139, caption: "Heart eyes", date: "November 2023"},
    {src: "IMG_2530.jpeg", width: 1284, height: 2242, caption: "Standing tall", date: "November 2023"},
    {src: "IMG_2532.jpeg", width: 1284, height: 2238, caption: "Extreme close-up", date: "November 2023"},
];

const itemUrl = (item, usePoster = false) =>
    `${basePath}/${usePoster && item.poster ? item.poster : item.src}`;

export default function Gallery() {
    const [activeIndex, setActiveIndex] = useState(null);
    const activeItem = activeIndex === null ? null : galleryItems[activeIndex];

    const closeViewer = useCallback(() => setActiveIndex(null), []);
    const showPrevious = useCallback(() => {
        setActiveIndex((current) => (current - 1 + galleryItems.length) % galleryItems.length);
    }, []);
    const showNext = useCallback(() => {
        setActiveIndex((current) => (current + 1) % galleryItems.length);
    }, []);

    useEffect(() => {
        if (activeIndex === null) return;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeViewer();
            if (event.key === "ArrowLeft") showPrevious();
            if (event.key === "ArrowRight") showNext();
        };

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";
        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [activeIndex, closeViewer, showNext, showPrevious]);

    return (
        <main className="gallery-page min-h-screen text-stone-900">
            <div className="gallery-glow gallery-glow-one" aria-hidden="true"/>
            <div className="gallery-glow gallery-glow-two" aria-hidden="true"/>

            <div className="relative z-10 mx-auto max-w-7xl px-5 pb-20 pt-6 sm:px-8 lg:px-10">
                <nav className="mb-16 flex items-center justify-between">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-stone-900/10 backdrop-blur transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-amber-700"
                    >
                        <span aria-hidden="true">←</span>
                        Chickie Cam
                    </Link>
                    <span className="hidden text-xs font-bold uppercase tracking-[0.25em] text-stone-600 sm:block">
                        Fuzzballs archive
                    </span>
                </nav>

                <header className="mb-14 max-w-4xl">
                    <p className="mb-4 text-sm font-bold uppercase tracking-[0.28em] text-amber-700">
                        Portraits & assorted chicken business
                    </p>
                    <h1 className="gallery-title text-6xl font-black leading-[0.88] tracking-[-0.055em] sm:text-7xl lg:text-8xl">
                        The flock,
                        <span className="block text-amber-700">unfiltered.</span>
                    </h1>
                    <p className="mt-7 max-w-xl text-lg leading-relaxed text-stone-600">
                        A growing collection of glamour shots, garden patrols, baby pictures,
                        and moments of profound poultry importance.
                    </p>
                    <div className="mt-7 flex items-center gap-3 text-sm font-semibold text-stone-500">
                        <span className="h-px w-12 bg-stone-400"/>
                        {galleryItems.length} moments from the coop
                    </div>
                </header>

                <section className="gallery-columns" aria-label="Chicken photo gallery">
                    {galleryItems.map((item, index) => (
                        <button
                            type="button"
                            className="gallery-card group"
                            key={item.src}
                            onClick={() => setActiveIndex(index)}
                            aria-label={`Open ${item.caption}${item.type === "video" ? " video" : " photo"}`}
                        >
                            <span className="gallery-image-wrap">
                                <img
                                    src={itemUrl(item, item.type === "video")}
                                    alt={item.caption}
                                    width={item.width}
                                    height={item.height}
                                    loading={index < 4 ? "eager" : "lazy"}
                                />
                                {item.type === "video" && (
                                    <span className="gallery-play" aria-hidden="true">
                                        <svg viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M8 5.5v13l10-6.5z"/>
                                        </svg>
                                    </span>
                                )}
                                <span className="gallery-open" aria-hidden="true">↗</span>
                            </span>
                            <span className="flex items-baseline justify-between gap-4 px-1 pb-1 pt-3 text-left">
                                <span className="font-bold text-stone-800">{item.caption}</span>
                                <span className="shrink-0 text-xs font-semibold uppercase tracking-wider text-stone-500">
                                    {item.date}
                                </span>
                            </span>
                        </button>
                    ))}
                </section>
            </div>

            {activeItem && (
                <div
                    className="gallery-viewer"
                    role="dialog"
                    aria-modal="true"
                    aria-label={activeItem.caption}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) closeViewer();
                    }}
                >
                    <button className="gallery-close" type="button" onClick={closeViewer} aria-label="Close viewer">
                        ×
                    </button>
                    <button className="gallery-arrow gallery-arrow-left" type="button" onClick={showPrevious} aria-label="Previous item">
                        ‹
                    </button>

                    <div className="gallery-viewer-content">
                        {activeItem.type === "video" ? (
                            <video
                                key={activeItem.src}
                                src={itemUrl(activeItem)}
                                poster={itemUrl(activeItem, true)}
                                controls
                                autoPlay
                                playsInline
                            />
                        ) : (
                            <img
                                src={itemUrl(activeItem)}
                                alt={activeItem.caption}
                                width={activeItem.width}
                                height={activeItem.height}
                            />
                        )}
                        <div className="gallery-viewer-caption">
                            <div>
                                <p>{activeItem.caption}</p>
                                <span>{activeItem.date}</span>
                            </div>
                            <span>{activeIndex + 1} / {galleryItems.length}</span>
                        </div>
                    </div>

                    <button className="gallery-arrow gallery-arrow-right" type="button" onClick={showNext} aria-label="Next item">
                        ›
                    </button>
                </div>
            )}
        </main>
    );
}
