import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { PulsingDot } from '../ui/PulsingDot';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { ShodanHost } from '../../api/types';
import { countryFlag } from '../../utils/formatting';
import { useSavedStore } from '../../stores/savedStore';
import { mediumTap } from '../../utils/haptics';

interface Props { host: ShodanHost }
export function DeviceHeader({ host }: Props) {
  const { isHostBookmarked, toggleBookmarkHost } = useSavedStore();
  const bookmarked = isHostBookmarked(host.ip_str);
  const flag = countryFlag(host.country_code);
  const handleBookmark = () => {
    mediumTap();
    toggleBookmarkHost({ ip: host.ip_str, hostname: host.hostnames?.[0] ?? '', org: host.org, ports: host.ports });
  };
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View style={{ flex: 1 }}>
          <View style={styles.ipRow}>
            <PulsingDot color={Colors.accent} size={10} />
            <Text variant="displayLg" color="accent" style={{ marginLeft: Spacing.xs }}>{host.ip_str}</Text>
          </View>
          {host.hostnames?.[0] && <Text variant="body" color="textMuted" style={{ marginTop: 2 }}>{host.hostnames[0]}</Text>}
        </View>
        <Pressable onPress={handleBookmark} hitSlop={12} style={styles.bookmarkBtn}>
          <Ionicons name={bookmarked ? 'bookmark' : 'bookmark-outline'} size={24} color={bookmarked ? Colors.warning : Colors.textMuted} />
        </Pressable>
      </View>
      <View style={styles.infoRow}>
        {host.org && <Text variant="bodySmall" color="text">{host.org}</Text>}
        {host.country_name && <Text variant="bodySmall" color="textMuted">{flag} {host.country_name}{host.city ? `, ${host.city}` : ''}</Text>}
      </View>
      <View style={styles.tags}>
        {host.os && <Badge label={host.os} color="accentAlt" size="md" />}
        <Badge label={`${host.ports?.length ?? 0} ports`} color="accent" size="md" />
        {(host.vulns?.length ?? 0) > 0 && <Badge label={`${host.vulns!.length} vulns`} color="danger" size="md" />}
        {host.tags?.map((t) => <Badge key={t} label={t} color="warning" size="md" />)}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: { padding: Spacing.md, backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  ipRow: { flexDirection: 'row', alignItems: 'center' },
  hostnameRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2, gap: 6 },
  orgRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bookmarkBtn: { padding: Spacing.xs },
  copyBtn: { marginLeft: 6 },
  infoRow: { marginTop: Spacing.xs, gap: 2 },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: Spacing.sm },
});
