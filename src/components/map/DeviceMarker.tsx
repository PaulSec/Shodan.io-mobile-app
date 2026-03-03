import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface Props { hasVulns?: boolean; size?: number }
export function DeviceMarker({ hasVulns = false, size = 14 }: Props) {
  const color = hasVulns ? Colors.danger : Colors.accent;
  return (
    <View style={[styles.outer, { width: size + 8, height: size + 8, borderRadius: (size + 8) / 2, borderColor: color }]}>
      <View style={[styles.inner, { width: size, height: size, borderRadius: size / 2, backgroundColor: color }]} />
    </View>
  );
}
const styles = StyleSheet.create({
  outer: { borderWidth: 2, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)' },
  inner: {},
});
