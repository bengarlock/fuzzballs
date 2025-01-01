'use client';

import { create } from 'zustand';

export const globalStore = create((set) => ({
    weather: {},
    setWeather: (weather) => set({ weather }),
    incognitoJob: {},
    setIncognitoJob: (incognitoJob) => set({ incognitoJob }),
    authToken: '',
    setAuthToken: (authToken) => set({ authToken }),
}));