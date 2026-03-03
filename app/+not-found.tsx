import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { Text } from '../src/components/ui/Text';
import { useColors } from '../src/theme/useColors';
export default function NotFoundScreen() {
  const colors = useColors();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[s.c, { backgroundColor: colors.background }]}>
        <Text variant="displayLg" color="primary">404</Text>
        <Text variant="mono" color="text">Page not found</Text>
        <Link href="/" style={s.l}>
          <Text variant="body" color="accent">← Return home</Text>
        </Link>
      </View>
    </>
  );
}
const s = StyleSheet.create({ c: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }, l: { marginTop: 32 } });
