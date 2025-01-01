'use client';

import { create } from 'zustand';

export const globalStore = create((set) => ({
    weather: {},
    setWeather: (weather) => set({ weather }),
    incognito: false,
    setIncognito: (incognito) => set({ incognito }),
}));