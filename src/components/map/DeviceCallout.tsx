import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { ShodanHost } from '../../api/types';

interface Props { host: ShodanHost }
export function DeviceCallout({ host }: Props) {
  return (
    <View style={styles.callout}>
      <Text variant="mono" style={{ color: Colors.accent, fontSize: 13 }}>{host.ip_str}</Text>
      {host.hostnames?.[0] && <Text variant="caption" color="textMuted" numberOfLines={1}>{host.hostnames[0]}</Text>}
      <Text variant="caption" color="text" numberOfLines={1} style={{ marginTop: 2 }}>{host.org}</Text>
      <View style={styles.ports}>
        {host.ports?.slice(0, 4).map((p) => <Badge key={p} label={String(p)} color="accentAlt" size="sm" />)}
        {(host.ports?.length ?? 0) > 4 && <Badge label={`+${host.ports.length - 4}`} color="muted" size="sm" />}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  callout: { padding: Spacing.sm, minWidth: 180, maxWidth: 250 },
  ports: { flexDirection: 'row', flexWrap: 'wrap', gap: 3, marginTop: Spacing.xxs },
});
