import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Spacing, Radius } from '../../theme/spacing';
import { useColors } from '../../theme/useColors';

type BadgeColor = 'primary' | 'accent' | 'accentAlt' | 'warning' | 'danger' | 'muted';
interface Props { label: string; color?: BadgeColor; size?: 'sm' | 'md' }
export function Badge({ label, color = 'muted', size = 'sm' }: Props) {
  const colors = useColors();
  const bg: Record<BadgeColor, string> = {
    primary: colors.primaryMuted,
    accent: colors.surfaceHover,
    accentAlt: colors.surfaceHover,
    warning: colors.surfaceHover,
    danger: colors.surfaceHover,
    muted: colors.surfaceHover,
  };
  const fg: Record<BadgeColor, string> = {
    primary: colors.primary,
    accent: colors.accent,
    accentAlt: colors.accentAlt,
    warning: colors.warning,
    danger: colors.danger,
    muted: colors.textMuted,
  };
  return (
    <View style={[styles.badge, { backgroundColor: bg[color], paddingVertical: size === 'sm' ? 2 : 4, paddingHorizontal: size === 'sm' ? 6 : 10 }]}>
      <Text variant={size === 'sm' ? 'caption' : 'bodySmall'} style={{ color: fg[color] }}>{label}</Text>
    </View>
  );
}
const styles = StyleSheet.create({ badge: { borderRadius: Radius.full, alignSelf: 'flex-start' } });
