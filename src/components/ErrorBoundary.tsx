import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from './ui/Text';
import { Colors } from '../theme/colors';
import { Spacing } from '../theme/spacing';
import { Ionicons } from '@expo/vector-icons';

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };
  static getDerivedStateFromError(error: Error): State { return { hasError: true, error }; }
  componentDidCatch(error: Error, info: ErrorInfo) { console.error('ErrorBoundary:', error, info); }
  handleReset = () => { this.setState({ hasError: false, error: null }); };
  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <View style={styles.container}>
          <Ionicons name="warning-outline" size={48} color={Colors.danger} />
          <Text variant="headingMd" color="text" style={styles.title}>Something went wrong</Text>
          <Text variant="bodySmall" color="textMuted" align="center" style={styles.msg}>{this.state.error?.message}</Text>
          <Pressable onPress={this.handleReset} style={styles.btn}>
            <Text variant="body" color="accent">Try Again</Text>
          </Pressable>
        </View>
      );
    }
    return this.props.children;
  }
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center', padding: Spacing['3xl'] },
  title: { marginTop: Spacing.md }, msg: { marginTop: Spacing.xs }, btn: { marginTop: Spacing.xl, paddingVertical: Spacing.sm, paddingHorizontal: Spacing.xl },
});
