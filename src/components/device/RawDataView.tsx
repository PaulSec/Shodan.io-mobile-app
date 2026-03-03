import React, { useState } from 'react';
import { View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../ui/Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';

interface Props { data: unknown; title?: string }
export function RawDataView({ data, title = 'Raw JSON' }: Props) {
  const [expanded, setExpanded] = useState(false);
  const json = JSON.stringify(data, null, 2);
  return (
    <View style={styles.container}>
      <Pressable onPress={() => setExpanded(!expanded)} style={styles.header}>
        <Ionicons name="code-slash-outline" size={16} color={Colors.accentAlt} />
        <Text variant="bodySmall" color="text" style={{ flex: 1, marginLeft: Spacing.xs }}>{title}</Text>
        <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={16} color={Colors.textMuted} />
      </Pressable>
      {expanded && (
        <ScrollView style={styles.scroll} horizontal={false}>
          <ScrollView horizontal>
            <Text variant="mono" color="text" style={styles.json} selectable>{json}</Text>
          </ScrollView>
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border },
  header: { flexDirection: 'row', alignItems: 'center', padding: Spacing.md },
  scroll: { maxHeight: 400, paddingHorizontal: Spacing.md, paddingBottom: Spacing.md },
  json: { fontSize: 10, lineHeight: 16 },
});
