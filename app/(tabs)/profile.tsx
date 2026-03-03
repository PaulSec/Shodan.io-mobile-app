import React from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Linking, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/Text';
import { Button } from '../../src/components/ui/Button';
import { PlanCard } from '../../src/components/profile/PlanCard';
import { UsageStats } from '../../src/components/profile/UsageStats';
import { Colors } from '../../src/theme/colors';
import { Spacing, Radius } from '../../src/theme/spacing';
import { useAuthStore } from '../../src/stores/authStore';
import { useColors } from '../../src/theme/useColors';

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { apiInfo, isLoading, logout } = useAuthStore();
  const colors = useColors();

  const handleLogout = async () => {
    await logout();
    router.replace('/auth');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (!apiInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text variant="body" color="textMuted">No API info available</Text>
        <Button title="Go to Login" onPress={() => router.replace('/auth')} variant="primary" style={{ marginTop: Spacing.md }} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + Spacing.lg }]}
        showsVerticalScrollIndicator={false}
      >
        <PlanCard apiInfo={apiInfo} />

        <View style={styles.section}>
          <UsageStats apiInfo={apiInfo} />
        </View>

        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Pressable
              onPress={() => Linking.openURL('https://github.com/PaulSec/Shodan.io-mobile-app/')}
              style={({ pressed }) => [styles.linkRow, pressed && { opacity: 0.8 }]}
            >
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceHover }]}>
                <Ionicons name="logo-github" size={16} color={colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="headingMd" color="text">Open Source & Support</Text>
                <Text variant="caption" color="textMuted" style={{ marginTop: 4 }}>
                  github.com/PaulSec/Shodan.io-mobile-app
                </Text>
              </View>
              <Ionicons name="open-outline" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[styles.infoCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text variant="headingMd" color="text" style={{ marginBottom: Spacing.md }}>Account Details</Text>

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceHover }]}>
                <Ionicons name="shield-checkmark-outline" size={16} color={colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="textMuted">Plan</Text>
                <Text variant="bodySmall" color="text">{apiInfo.plan || 'Unknown'}</Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceHover }]}>
                <Ionicons name="lock-open-outline" size={16} color={colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="textMuted">Unlocked Searches Left</Text>
                <Text variant="bodySmall" color="text">{apiInfo.unlocked_left.toLocaleString()}</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { marginBottom: 0 }]}>
              <View style={[styles.infoIcon, { backgroundColor: colors.surfaceHover }]}>
                <Ionicons name="code-slash-outline" size={16} color={colors.textMuted} />
              </View>
              <View style={{ flex: 1 }}>
                <Text variant="caption" color="textMuted">API Access</Text>
                <Text variant="bodySmall" color="text">
                  {apiInfo.https ? 'HTTPS enabled' : 'HTTPS disabled'}{apiInfo.telnet ? ' • Telnet enabled' : ''}
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Button
            title="Sign Out"
            onPress={handleLogout}
            variant="danger"
            fullWidth
            icon={<Ionicons name="log-out-outline" size={20} color={Colors.white} />}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Spacing.lg,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  section: {
    marginTop: Spacing.md,
  },
  infoCard: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  infoIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
});
