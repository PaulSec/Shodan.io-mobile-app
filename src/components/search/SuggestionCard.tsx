import React from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Badge } from '../ui/Badge';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { CommunityQuery } from '../../api/types';

interface Props { item: CommunityQuery; onPress: (query: string) => void }
export function SuggestionCard({ item, onPress }: Props) {
  return (
    <Pressable onPress={() => onPress(item.query)} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <Ionicons name="flash-outline" size={14} color={Colors.warning} />
        <View style={styles.votes}>
          <Ionicons name="arrow-up" size={12} color={Colors.accent} />
          <Text variant="caption" color="accent">{item.votes}</Text>
        </View>
      </View>
      <Text variant="bodySmall" color="text" numberOfLines={1} style={{ marginTop: 4 }}>{item.title}</Text>
      <Text variant="caption" color="textMuted" numberOfLines={1} style={{ marginTop: 2 }}>{item.description || item.query}</Text>
      {item.tags.length > 0 && (
        <View style={styles.tags}>
          {item.tags.slice(0, 3).map((t) => <Badge key={t} label={t} color="muted" size="sm" />)}
        </View>
      )}
    </Pressable>
  );
}
const styles = StyleSheet.create({
  card: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.sm, width: 220, marginRight: Spacing.sm },
  pressed: { backgroundColor: Colors.surfaceHover },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  votes: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  tags: { flexDirection: 'row', gap: 4, marginTop: Spacing.xs },
});
