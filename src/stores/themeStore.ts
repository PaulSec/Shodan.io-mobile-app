import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

const THEME_STORAGE_KEY = '@shodan_theme_mode';

export type ThemeMode = 'light' | 'dark';

interface ThemeStore {
    mode: ThemeMode;
    isLoading: boolean;
    setMode: (mode: ThemeMode) => Promise<void>;
    toggleMode: () => Promise<void>;
    hydrate: () => Promise<void>;
}

export const useThemeStore = create<ThemeStore>((set, get) => ({
    mode: 'dark',
    isLoading: true,

    setMode: async (mode: ThemeMode) => {
        try {
            await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
            set({ mode });
        } catch (error) {
            console.error('Failed to save theme mode:', error);
        }
    },

    toggleMode: async () => {
        const currentMode = get().mode;
        const newMode: ThemeMode = currentMode === 'dark' ? 'light' : 'dark';
        await get().setMode(newMode);
    },

    hydrate: async () => {
        try {
            const stored = await AsyncStorage.getItem(THEME_STORAGE_KEY);
            if (stored === 'light' || stored === 'dark') {
                set({ mode: stored, isLoading: false });
            } else {
                set({ isLoading: false });
            }
        } catch (error) {
            console.error('Failed to load theme mode:', error);
            set({ isLoading: false });
        }
    },
}));
