import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet, ViewStyle } from 'react-native';
import { Colors } from '../../theme/colors';
import { Radius } from '../../theme/spacing';
interface Props { width?: number | string; height?: number; radius?: number; style?: ViewStyle }
export function Skeleton({ width = '100%', height = 16, radius = Radius.sm, style }: Props) {
  const opacity = useRef(new Animated.Value(0.3)).current;
  useEffect(() => {
    const anim = Animated.loop(Animated.sequence([
      Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
      Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
    ]));
    anim.start(); return () => anim.stop();
  }, [opacity]);
  return <Animated.View style={[styles.skeleton, { width: width as any, height, borderRadius: radius, opacity }, style]} />;
}
const styles = StyleSheet.create({ skeleton: { backgroundColor: Colors.surfaceHover } });
