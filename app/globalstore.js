'use client';

import { create } from 'zustand';

export const globalStore = create((set) => ({
    weather: {},
    setWeather: (weather) => set({ weather }),
    incognitoJob: {running: false},
    setIncognitoJob: (incognitoJob) => set({ incognitoJob }),
    authToken: '',
    setAuthToken: (authToken) => set({ authToken }),
}));