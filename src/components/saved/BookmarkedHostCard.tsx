import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

interface Props { ip: string; hostname: string; org: string; ports: number[]; onPress: () => void; onRemove: () => void }
export function BookmarkedHostCard({ ip, hostname, org, ports, onPress, onRemove }: Props) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={{ flex: 1 }}>
        <Text variant="mono" color="accent" style={{ fontSize: 14 }}>{ip}</Text>
        {hostname ? <Text variant="caption" color="textMuted" numberOfLines={1}>{hostname}</Text> : null}
        {org ? <Text variant="caption" color="textMuted" numberOfLines={1}>{org}</Text> : null}
        <View style={styles.ports}>
          {ports.slice(0, 5).map((p) => <Badge key={p} label={String(p)} color="accentAlt" size="sm" />)}
          {ports.length > 5 && <Badge label={`+${ports.length - 5}`} color="muted" size="sm" />}
        </View>
      </View>
      <Pressable onPress={onRemove} hitSlop={8} style={{ padding: Spacing.xs }}>
        <Ionicons name="trash-outline" size={16} color={Colors.danger} />
      </Pressable>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, marginBottom: Spacing.xs },
  pressed: { backgroundColor: Colors.surfaceHover },
  ports: { flexDirection: 'row', gap: 4, marginTop: Spacing.xs, flexWrap: 'wrap' },
});
