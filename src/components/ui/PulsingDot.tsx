import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
interface Props { color?: string; size?: number }
export function PulsingDot({ color = '#00FF9D', size = 8 }: Props) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.loop(Animated.parallel([
      Animated.sequence([Animated.timing(scale, { toValue: 1.4, duration: 800, useNativeDriver: true }), Animated.timing(scale, { toValue: 1, duration: 800, useNativeDriver: true })]),
      Animated.sequence([Animated.timing(opacity, { toValue: 0.5, duration: 800, useNativeDriver: true }), Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true })]),
    ]));
    anim.start(); return () => anim.stop();
  }, [scale, opacity]);
  return <Animated.View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: color, transform: [{ scale }], opacity }} />;
}
