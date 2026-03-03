import React from 'react';
import { ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
interface Props { children: React.ReactNode; edges?: ('top' | 'bottom' | 'left' | 'right')[]; style?: ViewStyle }
export function SafeScreen({ children, edges = ['top'], style }: Props) {
  return (
    <SafeAreaView edges={edges} style={[{ flex: 1, backgroundColor: Colors.background }, style]}>
      <StatusBar style="light" />{children}
    </SafeAreaView>
  );
}
