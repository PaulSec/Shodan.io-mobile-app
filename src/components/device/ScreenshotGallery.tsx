import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, View, Pressable } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { ShodanHost } from '../../api/types';
import { getHostScreenshots, toBase64ImageUri } from '../../utils/screenshots';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { Text } from '../ui/Text';
import { lightTap } from '../../utils/haptics';
import { useColors } from '../../theme/useColors';

interface Props {
  host: ShodanHost;
}

export function ScreenshotGallery({ host }: Props) {
  const colors = useColors();
  const screenshots = getHostScreenshots(host);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  if (screenshots.length === 0) return null;

  const handleCopyImage = async (base64Image: string, mime?: string | null, index?: number) => {
    try {
      await Clipboard.setImageAsync(base64Image);
    } catch {
      const imageUri = `data:${mime || 'image/jpeg'};base64,${base64Image}`;
      await Clipboard.setStringAsync(imageUri);
    }
    lightTap();
    if (typeof index === 'number') {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 2000);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text variant="headingMd" color="text" style={styles.title}>
        Screenshots ({screenshots.length})
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {screenshots.map(({ screenshot, banner }, index) => (
          <View key={`${host.ip_str}-${banner?.port ?? 'host'}-${index}`} style={[styles.card, { borderColor: colors.border, backgroundColor: colors.background }]}>
            <Image source={{ uri: toBase64ImageUri(screenshot) }} style={[styles.image, { backgroundColor: colors.surfaceHover }]} resizeMode="cover" />
            <View style={styles.meta}>
              <View style={styles.metaRow}>
                <Text variant="caption" color="textMuted">
                  {banner?.port != null ? `Port ${banner.port}` : host.ip_str}
                </Text>
                <Pressable
                  onPress={() => handleCopyImage(screenshot.data, screenshot.mime, index)}
                  hitSlop={6}
                  style={styles.copyBtn}
                >
                  <Ionicons
                    name={copiedIndex === index ? 'checkmark-circle' : 'copy-outline'}
                    size={14}
                    color={copiedIndex === index ? Colors.accent : Colors.textMuted}
                  />
                </Pressable>
              </View>
              {screenshot.labels?.length ? (
                <Text variant="caption" color="accentAlt" numberOfLines={1}>
                  {screenshot.labels.slice(0, 3).join(', ')}
                </Text>
              ) : null}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    paddingVertical: Spacing.md,
  },
  title: {
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.sm,
  },
  row: {
    paddingHorizontal: Spacing.md,
    gap: Spacing.sm,
  },
  card: {
    width: 260,
    borderRadius: Radius.sm,
    overflow: 'hidden',
    borderWidth: 1,
  },
  image: {
    width: '100%',
    aspectRatio: 16 / 10,
  },
  meta: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    gap: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  copyBtn: {
    padding: 2,
  },
});
