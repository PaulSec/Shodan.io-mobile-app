import React, { useState } from 'react';
import { View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Divider } from '../ui/Divider';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { ShodanBanner } from '../../api/types';

interface Props { banner: ShodanBanner }
export function BannerCard({ banner }: Props) {
  const [expanded, setExpanded] = useState(false);
  const vulns = banner.vulns ? Object.entries(banner.vulns) : [];
  return (
    <View style={styles.card}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
        <View style={styles.portWrap}>
          <Text variant="mono" style={{ color: Colors.accent, fontSize: 16 }}>{banner.port}</Text>
          <Text variant="caption" color="textMuted">/{banner.transport}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: Spacing.sm }}>
          <Text variant="body" color="text">{banner.product || banner.protocol || 'Unknown'}</Text>
          {banner.version && <Text variant="caption" color="textMuted">v{banner.version}</Text>}
        </View>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={Colors.textMuted} />
      </Pressable>

      {expanded && (
        <View style={styles.body}>
          <Divider spacing="xs" />
          {banner.title && <Text variant="bodySmall" color="text" style={{ marginBottom: Spacing.xs }}>Title: {banner.title}</Text>}
          {banner.http && (
            <View style={styles.httpInfo}>
              <Badge label={`HTTP ${banner.http.status}`} color={banner.http.status < 400 ? 'accent' : 'danger'} size="sm" />
              {banner.http.server && <Badge label={banner.http.server} color="muted" size="sm" />}
            </View>
          )}
          {banner.ssl && (
            <View style={{ marginTop: Spacing.xs }}>
              <Text variant="caption" color="accentAlt">SSL/TLS</Text>
              <Text variant="caption" color="textMuted">Cipher: {banner.ssl.cipher?.name}</Text>
              <Text variant="caption" color="textMuted">Versions: {banner.ssl.versions?.join(', ')}</Text>
            </View>
          )}
          {vulns.length > 0 && (
            <View style={{ marginTop: Spacing.xs }}>
              <Text variant="caption" color="danger" style={{ marginBottom: 4 }}>Vulnerabilities</Text>
              <View style={styles.vulnRow}>
                {vulns.slice(0, 5).map(([cve, info]) => (
                  <Badge key={cve} label={`${cve}${info.cvss ? ` (${info.cvss})` : ''}`} color="danger" size="sm" />
                ))}
                {vulns.length > 5 && <Badge label={`+${vulns.length - 5} more`} color="muted" size="sm" />}
              </View>
            </View>
          )}
          {banner.data && (
            <View style={styles.rawData}>
              <Text variant="caption" color="textMuted" style={{ marginBottom: 4 }}>Raw Banner</Text>
              <ScrollView horizontal style={styles.rawScroll}>
                <Text variant="mono" color="text" style={{ fontSize: 11 }}>{banner.data.slice(0, 1000)}</Text>
              </ScrollView>
            </View>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, marginBottom: Spacing.sm },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  portWrap: { flexDirection: 'row', alignItems: 'baseline' },
  body: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  httpInfo: { flexDirection: 'row', gap: 4 },
  vulnRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  rawData: { marginTop: Spacing.sm, backgroundColor: Colors.background, borderRadius: Radius.sm, padding: Spacing.sm },
  rawScroll: { maxHeight: 200 },
});
