import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';
import { Spacing, SpacingToken } from '../../theme/spacing';
interface Props { spacing?: SpacingToken }
export function Divider({ spacing = 'md' }: Props) {
  return <View style={[styles.line, { marginVertical: Spacing[spacing] }]} />;
}
const styles = StyleSheet.create({ line: { height: 1, backgroundColor: Colors.border, width: '100%' } });
