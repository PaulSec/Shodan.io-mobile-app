import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { PulsingDot } from '../ui/PulsingDot';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import { ApiInfo } from '../../api/types';
import { useColors } from '../../theme/useColors';

interface Props { apiInfo: ApiInfo }
export function PlanCard({ apiInfo }: Props) {
  const colors = useColors();
  const planName = apiInfo.plan.charAt(0).toUpperCase() + apiInfo.plan.slice(1);
  const features = [
    { label: 'HTTPS', enabled: apiInfo.https },
    { label: 'Unlocked', enabled: apiInfo.unlocked },
    { label: 'Telnet', enabled: apiInfo.telnet },
  ];
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <View style={[styles.planIcon, { backgroundColor: colors.surfaceHover }]}>
          <Ionicons name="shield-checkmark" size={28} color={colors.accent} />
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.md }}>
          <View style={styles.planRow}>
            <Text variant="headingLg" color="text">{planName}</Text>
            <PulsingDot color={colors.accent} size={8} />
          </View>
          <Text variant="caption" color="textMuted">Active Plan</Text>
        </View>
      </View>
      <View style={[styles.features, { borderTopColor: colors.border }]}>
        {features.map((f) => (
          <View key={f.label} style={styles.feature}>
            <Ionicons name={f.enabled ? 'checkmark-circle' : 'close-circle'} size={14} color={f.enabled ? colors.accent : colors.textMuted} />
            <Text variant="caption" style={{ color: f.enabled ? colors.text : colors.textMuted, marginLeft: 4 }}>{f.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: Radius.lg, borderWidth: 1, padding: Spacing.lg, ...Shadows.md },
  header: { flexDirection: 'row', alignItems: 'center' },
  planIcon: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
  planRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  features: { flexDirection: 'row', gap: Spacing.md, marginTop: Spacing.md, paddingTop: Spacing.md, borderTopWidth: 1 },
  feature: { flexDirection: 'row', alignItems: 'center' },
});
