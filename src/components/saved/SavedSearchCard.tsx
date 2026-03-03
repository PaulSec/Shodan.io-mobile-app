import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

interface Props { query: string; resultCount: number; timestamp: number; onPress: () => void; onRemove?: () => void; saved?: boolean }
export function SavedSearchCard({ query, resultCount, timestamp, onPress, onRemove, saved }: Props) {
  const date = new Date(timestamp);
  const dateStr = date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <Ionicons name={saved ? 'star' : 'time-outline'} size={16} color={saved ? Colors.warning : Colors.textMuted} />
      <View style={{ flex: 1, marginLeft: Spacing.sm }}>
        <Text variant="mono" color="text" numberOfLines={1} style={{ fontSize: 13 }}>{query}</Text>
        <Text variant="caption" color="textMuted">{resultCount > 0 ? `${resultCount.toLocaleString()} results` : ''} {dateStr}</Text>
      </View>
      {onRemove && (
        <Pressable onPress={onRemove} hitSlop={8}>
          <Ionicons name="close" size={16} color={Colors.textMuted} />
        </Pressable>
      )}
      <Ionicons name="chevron-forward" size={14} color={Colors.textMuted} style={{ marginLeft: Spacing.xs }} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm, marginBottom: Spacing.xs },
  pressed: { backgroundColor: Colors.surfaceHover },
});
