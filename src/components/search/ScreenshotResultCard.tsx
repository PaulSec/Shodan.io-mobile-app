import React, { useMemo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { ShodanHost } from '../../api/types';
import { getPrimaryHostScreenshot, toBase64ImageUri } from '../../utils/screenshots';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
import { Text } from '../ui/Text';
import { lightTap } from '../../utils/haptics';
import { useColors } from '../../theme/useColors';

interface Props {
  host: ShodanHost;
  onPress: () => void;
}

export function ScreenshotResultCard({ host, onPress }: Props) {
  const colors = useColors();
  const primary = getPrimaryHostScreenshot(host);
  const imageUri = useMemo(
    () => (primary ? toBase64ImageUri(primary.screenshot) : null),
    [primary]
  );

  if (!primary || !imageUri) return null;

  const handleCopyImage = async () => {
    try {
      await Clipboard.setImageAsync(primary.screenshot.data);
    } catch {
      await Clipboard.setStringAsync(imageUri);
    }
    lightTap();
  };

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, { backgroundColor: colors.surface, borderColor: colors.border }, pressed && { backgroundColor: colors.surfaceHover }]}>
      <Image source={{ uri: imageUri }} style={[styles.image, { backgroundColor: colors.surfaceHover }]} resizeMode="cover" />
      <View style={styles.footer}>
        <View style={{ flex: 1 }}>
          <Text variant="mono" color="accent" numberOfLines={1}>
            {host.ip_str}
          </Text>
          <Text variant="caption" color="textMuted" numberOfLines={1}>
            {host.org || 'Unknown org'}
          </Text>
        </View>
        <Pressable
          onPress={(event) => {
            event.stopPropagation();
            handleCopyImage();
          }}
          hitSlop={6}
          style={styles.copyBtn}
        >
          <Ionicons name="copy-outline" size={16} color={Colors.textMuted} />
        </Pressable>
        <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: Spacing.sm,
    ...Shadows.sm,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    gap: Spacing.xs,
  },
  copyBtn: {
    padding: 2,
  },
});
