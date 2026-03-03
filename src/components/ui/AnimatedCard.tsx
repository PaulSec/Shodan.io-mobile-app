import React, { useEffect, useRef } from 'react';
import { Animated, ViewStyle, Pressable } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { Shadows } from '../../theme/shadows';
interface Props { children: React.ReactNode; index?: number; style?: ViewStyle; onPress?: () => void }
export function AnimatedCard({ children, index = 0, style, onPress }: Props) {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;
  useEffect(() => {
    const delay = index * 80;
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, delay, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 400, delay, useNativeDriver: true }),
    ]).start();
  }, [index, opacity, translateY]);
  const cardStyle = [{ opacity, transform: [{ translateY }], backgroundColor: Colors.surface, borderRadius: Radius.md, borderWidth: 1, borderColor: Colors.border, padding: Spacing.md, ...Shadows.sm }, style];
  if (onPress) return <Animated.View style={cardStyle}><Pressable onPress={onPress}>{children}</Pressable></Animated.View>;
  return <Animated.View style={cardStyle}>{children}</Animated.View>;
}
