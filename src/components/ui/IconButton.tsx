import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
interface Props { icon: React.ReactNode; onPress: () => void; size?: number; disabled?: boolean }
export function IconButton({ icon, onPress, size = 44, disabled }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled} hitSlop={8}
      style={({ pressed }) => [styles.btn, { width: size, height: size, opacity: pressed ? 0.6 : disabled ? 0.3 : 1 }]}>
      {icon}
    </Pressable>
  );
}
const styles = StyleSheet.create({ btn: { alignItems: 'center', justifyContent: 'center', borderRadius: 9999 } });
