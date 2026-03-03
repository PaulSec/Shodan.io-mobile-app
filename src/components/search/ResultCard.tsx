import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import { ShodanHost } from '../../api/types';
import { countryFlag } from '../../utils/formatting';

interface Props { host: ShodanHost; onPress: () => void; index?: number }
export function ResultCard({ host, onPress, index = 0 }: Props) {
  const hostname = host.hostnames?.[0] ?? null;
  const flag = countryFlag(host.country_code);
  const vulnCount = host.vulns?.length ?? 0;
  const displayPorts = host.ports?.slice(0, 6) ?? [];
  const extraPorts = (host.ports?.length ?? 0) - 6;

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text variant="mono" color="accent" style={{ fontSize: 16 }}>{host.ip_str}</Text>
          {hostname && <Text variant="bodySmall" color="textMuted" numberOfLines={1}>{hostname}</Text>}
        </View>
        <Ionicons name="chevron-forward" size={18} color={Colors.textMuted} />
      </View>

      <View style={styles.meta}>
        {host.org && <Text variant="caption" color="textMuted" numberOfLines={1}>{host.org}</Text>}
        {host.country_name && (
          <Text variant="caption" color="textMuted">{flag} {host.country_name}{host.city ? `, ${host.city}` : ''}</Text>
        )}
      </View>

      <View style={styles.ports}>
        {displayPorts.map((port) => (
          <Badge key={port} label={String(port)} color="accentAlt" size="sm" />
        ))}
        {extraPorts > 0 && <Badge label={`+${extraPorts}`} color="muted" size="sm" />}
        {vulnCount > 0 && <Badge label={`${vulnCount} vuln${vulnCount > 1 ? 's' : ''}`} color="danger" size="sm" />}
      </View>

      {host.os && (
        <View style={styles.osRow}>
          <Ionicons name="desktop-outline" size={12} color={Colors.textMuted} />
          <Text variant="caption" color="textMuted" style={{ marginLeft: 4 }}>{host.os}</Text>
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.sm, ...Shadows.sm },
  pressed: { backgroundColor: Colors.surfaceHover },
  header: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' },
  meta: { marginTop: Spacing.xs, gap: 2 },
  ports: { flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginTop: Spacing.sm },
  osRow: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.xs },
});
