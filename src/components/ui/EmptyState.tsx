import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from './Text';
import { Spacing } from '../../theme/spacing';
interface Props { icon?: React.ReactNode; title: string; description?: string; action?: React.ReactNode }
export function EmptyState({ icon, title, description, action }: Props) {
  return (
    <View style={styles.container}>
      {icon && <View style={styles.icon}>{icon}</View>}
      <Text variant="headingMd" color="textMuted" align="center">{title}</Text>
      {description && <Text variant="bodySmall" color="textMuted" align="center" style={styles.desc}>{description}</Text>}
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: Spacing['3xl'] },
  icon: { marginBottom: Spacing.xl }, desc: { marginTop: Spacing.xs }, action: { marginTop: Spacing.xl },
});
