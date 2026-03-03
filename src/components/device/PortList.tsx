import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Spacing, Radius } from '../../theme/spacing';
import { ShodanBanner } from '../../api/types';
import { lightTap } from '../../utils/haptics';
import { useColors } from '../../theme/useColors';

interface Props { banners: ShodanBanner[]; onSelectBanner?: (banner: ShodanBanner) => void }
export function PortList({ banners, onSelectBanner }: Props) {
  const colors = useColors();
  const [copiedPort, setCopiedPort] = useState<number | null>(null);
  const sorted = [...banners].sort((a, b) => a.port - b.port);

  const handleCopyPort = async (port: number, event: any) => {
    event.stopPropagation();
    await Clipboard.setStringAsync(port.toString());
    lightTap();
    setCopiedPort(port);
    setTimeout(() => setCopiedPort(null), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text variant="headingMd" color="text" style={[styles.title, { borderBottomColor: colors.border }]}>
        <Ionicons name="git-network-outline" size={18} color={colors.accentAlt} /> Services ({banners.length})
      </Text>
      {sorted.map((b, i) => (
        <Pressable key={`${b.port}-${b.transport}-${i}`} onPress={() => onSelectBanner?.(b)}
          style={({ pressed }) => [
            styles.row,
            pressed && { backgroundColor: colors.surfaceHover },
            i < sorted.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
          ]}>
          <View style={styles.portBadgeContainer}>
            <View style={[styles.portBadge, { backgroundColor: colors.surfaceHover }]}>
              <Text variant="mono" style={{ color: colors.accent, fontSize: 14 }}>{b.port}</Text>
            </View>
            <Pressable onPress={(e) => handleCopyPort(b.port, e)} hitSlop={6} style={styles.portCopyBtn}>
              <Ionicons
                name={copiedPort === b.port ? 'checkmark-circle' : 'copy-outline'}
                size={14}
                color={copiedPort === b.port ? colors.accent : colors.textMuted}
              />
            </Pressable>
          </View>
          <View style={{ flex: 1, marginLeft: Spacing.sm }}>
            <View style={styles.protoRow}>
              <Text variant="bodySmall" color="text">{b.product || b.protocol || b.transport}</Text>
              {b.version && <Text variant="caption" color="textMuted"> v{b.version}</Text>}
            </View>
            {b.title && <Text variant="caption" color="textMuted" numberOfLines={1}>{b.title}</Text>}
          </View>
          <Text variant="caption" color="textMuted">{b.transport.toUpperCase()}</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginLeft: 4 }} />
        </Pressable>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { borderRadius: Radius.md, borderWidth: 1, overflow: 'hidden' },
  title: { padding: Spacing.md, borderBottomWidth: 1 },
  row: { flexDirection: 'row', alignItems: 'center', padding: Spacing.sm, paddingHorizontal: Spacing.md },
  portBadgeContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  portBadge: { borderRadius: Radius.sm, paddingHorizontal: 8, paddingVertical: 2, minWidth: 52, alignItems: 'center' },
  portCopyBtn: { padding: 2 },
  protoRow: { flexDirection: 'row', alignItems: 'baseline' },
});
