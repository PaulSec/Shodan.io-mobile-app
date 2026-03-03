import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

interface Props { cve: string; cvss?: number | null; summary?: string | null; onPress?: () => void }
export function VulnBadge({ cve, cvss, summary, onPress }: Props) {
  const severity = cvss == null ? 'unknown' : cvss >= 9 ? 'critical' : cvss >= 7 ? 'high' : cvss >= 4 ? 'medium' : 'low';
  const severityColor: Record<string, string> = { critical: '#FF0040', high: Colors.danger, medium: Colors.warning, low: Colors.accentAlt, unknown: Colors.textMuted };
  const color = severityColor[severity];
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.badge, { borderColor: color }, pressed && { opacity: 0.7 }]}>
      <View style={styles.header}>
        <Ionicons name="bug-outline" size={12} color={color} />
        <Text variant="mono" style={[styles.cve, { color }]}>{cve}</Text>
        {cvss != null && (
          <View style={[styles.cvss, { backgroundColor: color }]}>
            <Text variant="caption" color="white" style={{ fontSize: 10 }}>{cvss.toFixed(1)}</Text>
          </View>
        )}
      </View>
      {summary && <Text variant="caption" color="textMuted" numberOfLines={2} style={{ marginTop: 2 }}>{summary}</Text>}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  badge: { backgroundColor: Colors.surface, borderWidth: 1, borderRadius: Radius.sm, padding: Spacing.xs, marginBottom: Spacing.xxs },
  header: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cve: { fontSize: 11 },
  cvss: { borderRadius: 4, paddingHorizontal: 4, paddingVertical: 1, marginLeft: 'auto' },
});
