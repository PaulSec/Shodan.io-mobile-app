import React from 'react';
import { Pressable, ActivityIndicator, StyleSheet, View } from 'react-native';
import { Text } from './Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
interface Props { title: string; onPress: () => void; variant?: Variant; disabled?: boolean; loading?: boolean; icon?: React.ReactNode; fullWidth?: boolean }
const BG: Record<Variant, string> = { primary: Colors.primary, secondary: Colors.surface, ghost: 'transparent', danger: Colors.danger };
const FG: Record<Variant, string> = { primary: Colors.white, secondary: Colors.text, ghost: Colors.text, danger: Colors.white };
const BORDER: Record<Variant, string> = { primary: Colors.primary, secondary: Colors.border, ghost: 'transparent', danger: Colors.danger };
export function Button({ title, onPress, variant = 'primary', disabled, loading, icon, fullWidth }: Props) {
  return (
    <Pressable onPress={onPress} disabled={disabled || loading}
      style={({ pressed }) => [styles.base, { backgroundColor: BG[variant], borderColor: BORDER[variant], opacity: pressed ? 0.8 : disabled ? 0.5 : 1 }, fullWidth && styles.full]}>
      {loading ? <ActivityIndicator size="small" color={FG[variant]} /> : (
        <View style={styles.content}>{icon}{icon && <View style={{ width: 8 }} />}<Text variant="body" style={{ color: FG[variant], fontWeight: '600' }}>{title}</Text></View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  base: { paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl, borderRadius: Radius.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center', minHeight: 48 },
  full: { width: '100%' },
  content: { flexDirection: 'row', alignItems: 'center' },
});
