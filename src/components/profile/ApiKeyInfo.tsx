import React, { useState } from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import { Text } from '../ui/Text';
import { Spacing, Radius } from '../../theme/spacing';
import { maskKey } from '../../utils/formatting';
import { success as hapticSuccess } from '../../utils/haptics';
import { useColors } from '../../theme/useColors';

interface Props { apiKey: string }
export function ApiKeyInfo({ apiKey }: Props) {
  const colors = useColors();
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(apiKey);
    hapticSuccess();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.header}>
        <Ionicons name="key-outline" size={18} color={colors.warning} />
        <Text variant="bodySmall" color="text" style={{ marginLeft: Spacing.xs, flex: 1 }}>API Key</Text>
        <Pressable onPress={() => setRevealed(!revealed)} hitSlop={8}>
          <Ionicons name={revealed ? 'eye-off-outline' : 'eye-outline'} size={18} color={colors.textMuted} />
        </Pressable>
      </View>
      <View style={[styles.keyRow, { backgroundColor: colors.background }]}>
        <Text variant="mono" color="textMuted" style={{ flex: 1, fontSize: 12 }} selectable={revealed}>
          {revealed ? apiKey : maskKey(apiKey)}
        </Text>
        <Pressable onPress={handleCopy} hitSlop={8} style={styles.copyBtn}>
          <Ionicons name={copied ? 'checkmark' : 'copy-outline'} size={16} color={copied ? colors.accent : colors.textMuted} />
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md },
  header: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.sm },
  keyRow: { flexDirection: 'row', alignItems: 'center', borderRadius: Radius.sm, padding: Spacing.sm },
  copyBtn: { padding: Spacing.xxs, marginLeft: Spacing.xs },
});
