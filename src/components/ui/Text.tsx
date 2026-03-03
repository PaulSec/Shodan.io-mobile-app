import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';
import { TextStyles, TextStyleToken } from '../../theme/typography';
import { Colors, ColorToken } from '../../theme/colors';

interface Props extends TextProps {
  variant?: TextStyleToken;
  color?: ColorToken;
  align?: 'left' | 'center' | 'right';
}
export function Text({ variant = 'body', color = 'text', align, style, children, ...rest }: Props) {
  return <RNText style={[TextStyles[variant], { color: Colors[color] }, align ? { textAlign: align } : undefined, style]} {...rest}>{children}</RNText>;
}
