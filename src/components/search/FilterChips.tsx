import React from 'react';
import { ScrollView, Pressable, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Spacing, Radius } from '../../theme/spacing';
import { useColors } from '../../theme/useColors';

const FILTERS = [
  { label: 'Webcams', query: 'webcam' },
  { label: 'Databases', query: 'product:MongoDB || product:MySQL || product:PostgreSQL' },
  { label: 'Industrial', query: 'tag:ics' },
  { label: 'Port 22', query: 'port:22' },
  { label: 'Port 80', query: 'port:80' },
  { label: 'Port 443', query: 'port:443' },
  { label: 'Apache', query: 'product:Apache' },
  { label: 'nginx', query: 'product:nginx' },
  { label: 'SSH', query: 'ssh' },
  { label: 'FTP', query: 'ftp' },
  { label: 'RDP', query: 'port:3389' },
  { label: 'VNC', query: 'vnc' },
];

interface Props { onSelect: (query: string) => void; activeQuery?: string }
export function FilterChips({ onSelect, activeQuery }: Props) {
  const colors = useColors();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.container}>
      {FILTERS.map((f) => {
        const active = activeQuery === f.query;
        return (
          <Pressable key={f.label} onPress={() => onSelect(f.query)}
            style={[
              styles.chip,
              { borderColor: colors.border, backgroundColor: colors.surface },
              active && { borderColor: colors.accent, backgroundColor: colors.surfaceHover },
            ]}>
            <Text variant="caption" style={{ color: active ? colors.accent : colors.textMuted }}>{f.label}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: { paddingHorizontal: Spacing.md, gap: Spacing.xs, paddingVertical: Spacing.xs },
  chip: { paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xxs, borderRadius: Radius.full, borderWidth: 1 },
});
