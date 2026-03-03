import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import { Text } from './Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { FontFamily } from '../../theme/typography';

interface Props extends TextInputProps {
  label?: string; error?: string; leftIcon?: React.ReactNode; rightIcon?: React.ReactNode;
}
export function Input({ label, error, leftIcon, rightIcon, style, ...rest }: Props) {
  const [focused, setFocused] = useState(false);
  const borderColor = error ? Colors.danger : focused ? Colors.accent : Colors.border;
  return (
    <View style={styles.container}>
      {label && <Text variant="caption" color="textMuted" style={styles.label}>{label}</Text>}
      <View style={[styles.inputWrap, { borderColor }]}>
        {leftIcon && <View style={styles.icon}>{leftIcon}</View>}
        <TextInput style={[styles.input, style]} placeholderTextColor={Colors.textMuted} selectionColor={Colors.accent}
          onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} {...rest} />
        {rightIcon && <View style={styles.icon}>{rightIcon}</View>}
      </View>
      {error && <Text variant="caption" color="danger" style={styles.error}>{error}</Text>}
    </View>
  );
}
const styles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  label: { marginBottom: Spacing.xxs },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderWidth: 1, borderRadius: Radius.md, paddingHorizontal: Spacing.sm },
  input: { flex: 1, color: Colors.text, fontFamily: FontFamily.sans, fontSize: 15, paddingVertical: Spacing.sm },
  icon: { marginHorizontal: Spacing.xxs },
  error: { marginTop: Spacing.xxs },
});
