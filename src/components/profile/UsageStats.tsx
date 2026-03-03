import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../ui/Text';
import { ProgressBar } from '../ui/ProgressBar';
import { Spacing, Radius } from '../../theme/spacing';
import { ApiInfo } from '../../api/types';
import { useColors } from '../../theme/useColors';

interface Props { apiInfo: ApiInfo }
export function UsageStats({ apiInfo }: Props) {
  const colors = useColors();
  const queryLimit = apiInfo.usage_limits.query_credits;
  const scanLimit = apiInfo.usage_limits.scan_credits;
  const monitoredLimit = apiInfo.usage_limits.monitored_ips;
  const hasQueryLimit = queryLimit > 0;
  const hasScanLimit = scanLimit > 0;
  const hasMonitoredLimit = monitoredLimit > 0;
  const queryUsed = hasQueryLimit ? Math.max(0, queryLimit - apiInfo.query_credits) : 0;
  const scanUsed = hasScanLimit ? Math.max(0, scanLimit - apiInfo.scan_credits) : 0;
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <Text variant="headingMd" color="text" style={{ marginBottom: Spacing.md }}>API Usage</Text>
      <View style={styles.stat}>
        <View style={styles.statHeader}>
          <Text variant="bodySmall" color="text">Query Credits</Text>
          <Text variant="mono" color="accent" style={{ fontSize: 13 }}>{apiInfo.query_credits.toLocaleString()}</Text>
        </View>
        {hasQueryLimit ? (
          <>
            <ProgressBar value={apiInfo.query_credits} max={queryLimit} />
            <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
              {queryUsed.toLocaleString()} used of {queryLimit.toLocaleString()}
            </Text>
          </>
        ) : (
          <Text variant="caption" color="textMuted">Unlimited</Text>
        )}
      </View>
      <View style={styles.stat}>
        <View style={styles.statHeader}>
          <Text variant="bodySmall" color="text">Scan Credits</Text>
          <Text variant="mono" color="accent" style={{ fontSize: 13 }}>{apiInfo.scan_credits.toLocaleString()}</Text>
        </View>
        {hasScanLimit ? (
          <>
            <ProgressBar value={apiInfo.scan_credits} max={scanLimit} />
            <Text variant="caption" color="textMuted" style={{ marginTop: 2 }}>
              {scanUsed.toLocaleString()} used of {scanLimit.toLocaleString()}
            </Text>
          </>
        ) : (
          <Text variant="caption" color="textMuted">Unlimited</Text>
        )}
      </View>
      {apiInfo.monitored_ips != null && (
        <View style={styles.stat}>
          <View style={styles.statHeader}>
            <Text variant="bodySmall" color="text">Monitored IPs</Text>
            <Text variant="mono" color="accentAlt" style={{ fontSize: 13 }}>{apiInfo.monitored_ips}</Text>
          </View>
          {hasMonitoredLimit ? (
            <ProgressBar value={apiInfo.monitored_ips} max={monitoredLimit} color={colors.accentAlt} />
          ) : (
            <Text variant="caption" color="textMuted">Unlimited</Text>
          )}
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  card: { borderRadius: Radius.md, borderWidth: 1, padding: Spacing.md },
  stat: { marginBottom: Spacing.md },
  statHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.xxs },
});
