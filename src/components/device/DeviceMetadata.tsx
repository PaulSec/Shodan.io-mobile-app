import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Spacing, Radius } from '../../theme/spacing';
import { ShodanHost } from '../../api/types';
import { timeAgo } from '../../utils/formatting';
import { lightTap } from '../../utils/haptics';
import { useColors } from '../../theme/useColors';

interface MetaItem { icon: string; label: string; value: string; copyable?: boolean }
interface Props { host: ShodanHost }
export function DeviceMetadata({ host }: Props) {
  const colors = useColors();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const items: MetaItem[] = [
    { icon: 'business-outline', label: 'ISP', value: host.isp || 'Unknown', copyable: !!host.isp },
    { icon: 'code-slash-outline', label: 'ASN', value: host.asn || 'N/A', copyable: !!host.asn },
    { icon: 'desktop-outline', label: 'OS', value: host.os || 'Unknown', copyable: !!host.os },
    { icon: 'time-outline', label: 'Updated', value: host.last_update ? timeAgo(host.last_update) : 'N/A', copyable: false },
    { icon: 'globe-outline', label: 'Domains', value: host.domains?.length ? host.domains.slice(0, 3).join(', ') : 'None', copyable: !!host.domains?.length },
    { icon: 'location-outline', label: 'Region', value: host.region_code || 'N/A', copyable: !!host.region_code },
  ];

  const handleCopy = async (value: string, label: string) => {
    await Clipboard.setStringAsync(value);
    lightTap();
    setCopiedField(label);
    setTimeout(() => setCopiedField(null), 2000);
  };

  return (
    <View style={styles.grid}>
      {items.map((item) => (
        <View key={item.label} style={[styles.item, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={[styles.iconWrap, { backgroundColor: colors.surfaceHover }]}>
            <Ionicons name={item.icon as any} size={14} color={colors.accentAlt} />
          </View>
          <View style={{ flex: 1 }}>
            <Text variant="caption" color="textMuted">{item.label}</Text>
            <View style={styles.valueRow}>
              <Text variant="bodySmall" color="text" numberOfLines={1} style={{ flex: 1 }}>{item.value}</Text>
              {item.copyable && (
                <Pressable onPress={() => handleCopy(item.value, item.label)} hitSlop={6}>
                  <Ionicons
                    name={copiedField === item.label ? 'checkmark-circle' : 'copy-outline'}
                    size={12}
                    color={copiedField === item.label ? colors.accent : colors.textMuted}
                  />
                </Pressable>
              )}
            </View>
          </View>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.xs },
  item: { flexDirection: 'row', alignItems: 'center', width: '48%', borderRadius: Radius.sm, borderWidth: 1, padding: Spacing.sm, gap: Spacing.xs },
  iconWrap: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  valueRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
});
