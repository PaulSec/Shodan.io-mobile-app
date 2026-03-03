import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';
import { parseApiError } from '../../src/api/errors';

function extractApiKey(raw: string): string | null {
  const trimmed = raw.trim();
  if (!trimmed) return null;

  try {
    const parsed = JSON.parse(trimmed) as Record<string, unknown>;
    const maybeKey =
      parsed.apiKey ?? parsed.api_key ?? parsed.shodan_api_key ?? parsed.key ?? parsed.token;
    if (typeof maybeKey === 'string' && maybeKey.trim()) return maybeKey.trim();
  } catch {
    // Not JSON.
  }

  try {
    const url = new URL(trimmed);
    const maybeKey =
      url.searchParams.get('apiKey') ??
      url.searchParams.get('api_key') ??
      url.searchParams.get('shodan_api_key') ??
      url.searchParams.get('key') ??
      url.searchParams.get('token');
    if (maybeKey?.trim()) return maybeKey.trim();
  } catch {
    // Not a URL.
  }

  if (/^[A-Za-z0-9_-]{16,}$/.test(trimmed)) return trimmed;
  return null;
}

export default function ScanScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanningEnabled, setIsScanningEnabled] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canScan = useMemo(
    () => Boolean(permission?.granted) && isScanningEnabled && !isLoggingIn,
    [permission?.granted, isScanningEnabled, isLoggingIn]
  );

  const handleCodeScanned = async ({ data }: { data: string }) => {
    if (!canScan) return;

    const token = extractApiKey(data);
    if (!token) {
      setIsScanningEnabled(false);
      setError('QR code does not contain a valid Shodan API key.');
      return;
    }

    try {
      setError(null);
      setIsScanningEnabled(false);
      setIsLoggingIn(true);
      await login(token);
      router.replace('/(tabs)/search');
    } catch (e) {
      const parsed = parseApiError(e as Error);
      setError(parsed.isUnauthorized ? 'Invalid API key in QR code.' : parsed.message);
      setIsScanningEnabled(true);
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!permission) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centered}>
        <Text variant="headingMd" color="primary">Camera access required</Text>
        <Text variant="bodySmall" color="textMuted" align="center" style={styles.permissionText}>
          Allow camera access to scan your Shodan login QR code.
        </Text>
        <View style={{ marginTop: Spacing.md, width: '100%', maxWidth: 280 }}>
          <Button title="Allow Camera" onPress={() => { requestPermission(); }} variant="primary" fullWidth />
        </View>
        <View style={{ marginTop: Spacing.sm, width: '100%', maxWidth: 280 }}>
          <Button title="Go Back" onPress={() => router.back()} variant="secondary" fullWidth />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFill}
        facing="back"
        barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
        onBarcodeScanned={canScan ? handleCodeScanned : undefined}
      />

      <View style={styles.overlay}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={20} color={Colors.text} />
          </Pressable>
          <Text variant="headingMd" color="text">Scan Login QR</Text>
          <View style={styles.iconSpacer} />
        </View>

        <View style={styles.scanFrameWrap}>
          <View style={styles.scanFrame} />
          {isLoggingIn && (
            <View style={styles.loadingPill}>
              <ActivityIndicator size="small" color={Colors.primary} />
              <Text variant="bodySmall" color="text" style={{ marginLeft: Spacing.xs }}>Logging in...</Text>
            </View>
          )}
        </View>

        <View style={styles.footerCard}>
          <Text variant="caption" color="textMuted" align="center">
            Point your camera at a QR code containing your Shodan API key.
          </Text>
          {error ? <Text variant="caption" color="danger" align="center" style={{ marginTop: Spacing.xs }}>{error}</Text> : null}
          {!isScanningEnabled && !isLoggingIn && (
            <View style={{ marginTop: Spacing.sm }}>
              <Button
                title="Scan Again"
                onPress={() => {
                  setError(null);
                  setIsScanningEnabled(true);
                }}
                variant="secondary"
                fullWidth
              />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centered: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
  },
  permissionText: {
    marginTop: Spacing.sm,
    maxWidth: 320,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(6, 10, 18, 0.4)',
    padding: Spacing.md,
  },
  topBar: {
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.full,
    backgroundColor: 'rgba(17, 24, 39, 0.85)',
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSpacer: {
    width: 40,
  },
  scanFrameWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  scanFrame: {
    width: 260,
    height: 260,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: Colors.accentAlt,
    backgroundColor: 'transparent',
  },
  loadingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  footerCard: {
    backgroundColor: 'rgba(17, 24, 39, 0.9)',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
});
