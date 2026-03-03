import React, { useEffect, useRef } from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Text } from './ui/Text';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export function NetworkBanner() {
  const { isConnected } = useNetworkStatus();
  const translateY = useRef(new Animated.Value(-60)).current;
  useEffect(() => {
    Animated.timing(translateY, { toValue: isConnected ? -60 : 0, duration: 300, useNativeDriver: true }).start();
  }, [isConnected, translateY]);
  return (
    <Animated.View style={[styles.banner, { transform: [{ translateY }] }]}>
      <Text variant="caption" color="white">No internet connection</Text>
    </Animated.View>
  );
}
const styles = StyleSheet.create({
  banner: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: Colors.danger, paddingVertical: Spacing.xs, paddingHorizontal: Spacing.md, alignItems: 'center', zIndex: 1000 },
});
