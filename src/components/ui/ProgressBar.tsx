import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/spacing';
interface Props { value: number; max: number; label?: string; color?: string; height?: number }
export function ProgressBar({ value, max, label, color, height = 6 }: Props) {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  const fill = color ?? (pct > 0.5 ? Colors.accent : pct > 0.25 ? Colors.warning : Colors.danger);
  const width = useRef(new Animated.Value(0)).current;
  useEffect(() => { Animated.timing(width, { toValue: pct, duration: 600, useNativeDriver: false }).start(); }, [pct, width]);
  return (
    <View>
      {label && <Text variant="caption" color="textMuted" style={{ marginBottom: 4 }}>{label}: {value} / {max}</Text>}
      <View style={[styles.track, { height }]}>
        <Animated.View style={[styles.fill, { height, backgroundColor: fill, width: width.interpolate({ inputRange: [0, 1], outputRange: ['0%', '100%'] }) }]} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  track: { backgroundColor: Colors.surfaceHover, borderRadius: Radius.full, overflow: 'hidden', width: '100%' },
  fill: { borderRadius: Radius.full },
});
