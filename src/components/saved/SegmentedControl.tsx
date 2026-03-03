import React from 'react';
import { View, Pressable, StyleSheet, Animated } from 'react-native';
import { Text } from '../ui/Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

interface Segment { key: string; label: string; count?: number }
interface Props { segments: Segment[]; activeKey: string; onChange: (key: string) => void }
export function SegmentedControl({ segments, activeKey, onChange }: Props) {
  return (
    <View style={styles.container}>
      {segments.map((s) => {
        const active = s.key === activeKey;
        return (
          <Pressable key={s.key} onPress={() => onChange(s.key)} style={[styles.segment, active && styles.active]}>
            <Text variant="bodySmall" style={{ color: active ? Colors.accent : Colors.textMuted }}>{s.label}</Text>
            {s.count != null && s.count > 0 && (
              <View style={[styles.countBadge, active && styles.countBadgeActive]}>
                <Text variant="caption" style={{ color: active ? Colors.background : Colors.textMuted, fontSize: 10 }}>{s.count}</Text>
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: 3 },
  segment: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, paddingVertical: Spacing.xs, borderRadius: Radius.sm },
  active: { backgroundColor: Colors.surfaceHover },
  countBadge: { minWidth: 18, height: 18, borderRadius: 9, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  countBadgeActive: { backgroundColor: Colors.accent },
});
