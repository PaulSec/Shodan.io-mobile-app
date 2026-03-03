import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, View } from 'react-native';
interface Props { intensity?: 'subtle' | 'medium'; animated?: boolean }
export function ScanlineOverlay({ intensity = 'subtle', animated = true }: Props) {
  const scanY = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (!animated) return;
    const anim = Animated.loop(Animated.timing(scanY, { toValue: 1, duration: 4000, useNativeDriver: true }));
    anim.start(); return () => anim.stop();
  }, [animated, scanY]);
  const opacity = intensity === 'subtle' ? 0.03 : 0.06;
  return (
    <View style={[StyleSheet.absoluteFill, { pointerEvents: 'none' }]}>
      <View style={[StyleSheet.absoluteFill, { opacity }]}>
        {Array.from({ length: 200 }).map((_, i) => <View key={i} style={{ height: 1, backgroundColor: '#fff', marginBottom: 3 }} />)}
      </View>
      {animated && <Animated.View style={[styles.scanBeam, { transform: [{ translateY: scanY.interpolate({ inputRange: [0, 1], outputRange: [0, 800] }) }] }]} />}
    </View>
  );
}
const styles = StyleSheet.create({ scanBeam: { position: 'absolute', left: 0, right: 0, height: 2, backgroundColor: '#00FF9D', opacity: 0.15 } });
