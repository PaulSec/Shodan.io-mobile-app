import React from 'react';
import { View, Pressable, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius, SpacingToken } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';

interface Props { children: React.ReactNode; onPress?: () => void; style?: ViewStyle; padding?: SpacingToken }
export function Card({ children, onPress, style, padding = 'md' }: Props) {
  const inner = [styles.card, { padding: Spacing[padding] }, Shadows.sm, style];
  if (onPress) return <Pressable onPress={onPress} style={({ pressed }) => [...inner, pressed && styles.pressed]}>{children}</Pressable>;
  return <View style={inner}>{children}</View>;
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  pressed: { backgroundColor: Colors.surfaceHover },
});
