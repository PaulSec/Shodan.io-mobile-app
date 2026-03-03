import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Modal, TextInput, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';
import { Spacing, Radius } from '../../src/theme/spacing';
import { FontFamily } from '../../src/theme/typography';
import { useAuthStore } from '../../src/stores/authStore';
import { ScanlineOverlay } from '../../src/components/ui/ScanlineOverlay';
import { Ionicons } from '@expo/vector-icons';
import { parseApiError } from '../../src/api/errors';

export default function WelcomeScreen() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const [showManual, setShowManual] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [manualError, setManualError] = useState('');
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(translateY, { toValue: 0, duration: 800, useNativeDriver: true }),
    ]).start();
  }, []);

  const handleManualLogin = async () => {
    if (!apiKey.trim()) { setManualError('Please enter an API key'); return; }
    try { setManualError(''); await login(apiKey.trim()); setShowManual(false); router.replace('/(tabs)/search'); }
    catch (e) {
      const err = parseApiError(e);
      if (err.isUnauthorized) {
        setManualError('Invalid API key. Check and try again.');
        return;
      }
      setManualError(err.message);
    }
  };

  return (
    <View style={styles.container}>
      <ScanlineOverlay intensity="subtle" />
      <Animated.View style={[styles.content, { opacity, transform: [{ translateY }] }]}>
        <View style={styles.logo}>
          <Ionicons name="eye-outline" size={64} color={Colors.primary} />
        </View>
        <Text variant="displayLg" color="primary" align="center">SHODAN</Text>
        <Text variant="headingMd" color="accent" align="center" style={{ marginTop: 4 }}>MOBILE</Text>
        <Text variant="bodySmall" color="textMuted" align="center" style={{ marginTop: Spacing.xl, maxWidth: 280 }}>
          The search engine for{'\n'}Internet-connected devices
        </Text>
        <View style={styles.buttons}>
          <Button title="Scan QR Code to Login" onPress={() => router.push('/auth/scan')} variant="primary" fullWidth
            icon={<Ionicons name="qr-code-outline" size={20} color={Colors.white} />} />
          <Pressable onPress={() => setShowManual(true)} style={styles.manualBtn}>
            <Text variant="bodySmall" color="accentAlt">Enter API Key Manually</Text>
          </Pressable>
        </View>
      </Animated.View>

      <Modal visible={showManual} transparent animationType="slide">
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text variant="headingMd" color="text">Enter API Key</Text>
              <Pressable onPress={() => setShowManual(false)}><Ionicons name="close" size={24} color={Colors.textMuted} /></Pressable>
            </View>
            <Text variant="bodySmall" color="textMuted" style={{ marginBottom: Spacing.md }}>
              Find your API key at account.shodan.io
            </Text>
            <TextInput
              style={styles.keyInput}
              placeholderTextColor={Colors.textMuted}
              placeholder="Paste your API key"
              value={apiKey}
              onChangeText={setApiKey}
              autoCapitalize="none"
              autoCorrect={false}
              autoComplete="off"
            />
            {manualError ? <Text variant="caption" color="error" style={{ marginTop: Spacing.sm }}>{manualError}</Text> : null}
            <Button
              title={isLoading ? "Logging in..." : "Login"}
              onPress={handleManualLogin}
              variant="primary"
              fullWidth
              style={{ marginTop: Spacing.lg }}
              disabled={isLoading}
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  logo: {
    marginBottom: Spacing.lg,
  },
  buttons: {
    marginTop: Spacing['3xl'],
    width: '100%',
    gap: Spacing.md,
  },
  manualBtn: {
    paddingVertical: Spacing.sm,
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    padding: Spacing.lg,
    paddingBottom: Spacing['2xl'],
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  keyInput: {
    backgroundColor: Colors.backgroundAlt,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    color: Colors.text,
    fontFamily: FontFamily.mono,
    fontSize: 14,
  },
});
