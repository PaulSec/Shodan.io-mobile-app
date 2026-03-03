import { getColors } from './colors';
import { useThemeStore } from '../stores/themeStore';

export function useColors() {
    const mode = useThemeStore((state) => state.mode);
    return getColors(mode);
}
