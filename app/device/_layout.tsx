import { Stack } from 'expo-router';
import { useColors } from '../../src/theme/useColors';

export default function DeviceLayout() {
    const colors = useColors();
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: colors.background },
                animation: 'slide_from_right'
            }}
        />
    );
}
