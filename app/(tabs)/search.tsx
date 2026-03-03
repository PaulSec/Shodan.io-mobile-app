import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Pressable, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/Text';
import { SearchBar } from '../../src/components/search/SearchBar';
import { ResultCard } from '../../src/components/search/ResultCard';
import { ScreenshotResultCard } from '../../src/components/search/ScreenshotResultCard';
import { Colors } from '../../src/theme/colors';
import { Spacing, Radius } from '../../src/theme/spacing';
import { useSearchStore } from '../../src/stores/searchStore';
import { useSavedStore } from '../../src/stores/savedStore';
import { ShodanHost } from '../../src/api/types';
import { getPrimaryHostScreenshot } from '../../src/utils/screenshots';

export default function SearchScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [screenshotsOnly, setScreenshotsOnly] = useState(false);
  const { query, results, total, isLoading, error, setQuery, search, nextPage, loadSuggestions } = useSearchStore();
  const { toggleSaveSearch, isSearchSaved } = useSavedStore();
  const screenshotResults = useMemo(
    () => results.filter((host) => getPrimaryHostScreenshot(host)),
    [results]
  );
  const lastPaginationAt = useRef(0);

  const buildSearchQuery = (baseQuery: string, includeScreenshots: boolean) => {
    const trimmed = baseQuery.trim();
    if (!includeScreenshots) return trimmed;
    if (!trimmed) return 'has_screenshot:true';
    if (trimmed.includes('has_screenshot:true')) return trimmed;
    return `${trimmed} has_screenshot:true`;
  };
  const saveQuery = buildSearchQuery(query, screenshotsOnly);
  const isSaved = saveQuery ? isSearchSaved(saveQuery) : false;

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleSaveSearch = () => {
    if (!saveQuery) return;
    toggleSaveSearch(saveQuery, total);
  };

  const handleResultPress = (host: ShodanHost) => {
    router.push(`/device/${host.ip_str}`);
  };

  const renderEmpty = () => {
    if (isLoading && results.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text variant="bodySmall" color="textMuted" style={{ marginTop: Spacing.md }}>
            Searching...
          </Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="danger">{error}</Text>
        </View>
      );
    }
    const emptyCount = screenshotsOnly ? screenshotResults.length : results.length;
    if (query && emptyCount === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="body" color="textMuted">
            {screenshotsOnly ? 'No screenshot results found' : 'No results found'}
          </Text>
        </View>
      );
    }
    return (
      <View style={styles.emptyContainer}>
        <Text variant="headingMd" color="primary" style={{ marginBottom: Spacing.xs }}>Search Shodan</Text>
        <Text variant="bodySmall" color="textMuted" align="center">
          {screenshotsOnly
            ? 'Enter a query to search for hosts with screenshots'
            : 'Enter a query to search for internet-connected devices'}
        </Text>
      </View>
    );
  };

  const renderHeader = () => {
    const resultCount = screenshotsOnly ? screenshotResults.length : results.length;
    if (resultCount === 0) return null;
    return (
      <View style={styles.resultsHeader}>
        <Text variant="bodySmall" color="textMuted">
          {total.toLocaleString()} results found
          {screenshotsOnly ? ` (${resultCount} with screenshots loaded)` : ''}
        </Text>
        {saveQuery && (
          <Pressable onPress={handleSaveSearch} hitSlop={8} style={styles.saveButton}>
            <Ionicons
              name={isSaved ? "star" : "star-outline"}
              size={20}
              color={isSaved ? Colors.warning : Colors.textMuted}
            />
            <Text variant="caption" color={isSaved ? "warning" : "textMuted"} style={{ marginLeft: 4 }}>
              {isSaved ? "Saved" : "Save"}
            </Text>
          </Pressable>
        )}
      </View>
    );
  };

  const renderFooter = () => {
    const currentCount = screenshotsOnly ? screenshotResults.length : results.length;
    if (!isLoading || currentCount === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  const searchExampleGroups = [
    {
      title: 'Web & HTTPS',
      items: [
        { label: 'HTTP Strict-Transport-Security', query: 'http.securitytxt:"strict-transport-security"', icon: 'lock-closed-outline' as const },
        { label: 'Apache web servers', query: 'product:Apache', icon: 'server-outline' as const },
        { label: 'Heading includes Apache', query: 'Apache', icon: 'search-outline' as const },
        { label: 'Hostname google/facebook', query: 'hostname:google.com,facebook.com', icon: 'globe-outline' as const },
      ],
    },
    {
      title: 'HTTP',
      items: [
        { label: 'HTML contains Apache', query: 'http.html:Apache', icon: 'code-outline' as const },
        { label: 'Uses Bootstrap', query: 'http.component:bootstrap', icon: 'layers-outline' as const },
      ],
    },
    {
      title: 'SSL/TLS',
      items: [
        { label: 'Supports TLS 1.3', query: 'ssl.version:tlsv1.3 HTTP', icon: 'shield-checkmark-outline' as const },
        { label: 'SSLv2 and no TLS', query: 'ssl.version:sslv2 -ssl.version:tlsv1,tlsv1.2,tlsv1.3', icon: 'warning-outline' as const },
        { label: 'Cert for google.com (non-HTTP)', query: 'ssl.cert.subject.cn:google.com -HTTP', icon: 'document-text-outline' as const },
        { label: 'Supports HTTP/2', query: 'ssl.alpn:h2', icon: 'swap-horizontal-outline' as const },
        { label: 'SSL cert for google.com', query: 'ssl.cert.subject.cn:google.com', icon: 'shield-outline' as const },
      ],
    },
    {
      title: 'SSH',
      items: [
        { label: 'SSH on 22 or 3333', query: 'ssh port:22,3333', icon: 'terminal-outline' as const },
        { label: 'SSH on non-standard ports', query: 'ssh -port:22', icon: 'git-branch-outline' as const },
      ],
    },
    {
      title: 'Screenshots',
      items: [
        { label: 'VNC behind 80/443', query: 'has_screenshot:true rfb disabled port:80,443', icon: 'image-outline' as const },
        { label: 'ICS screenshot labels', query: 'screenshot.label:ics', icon: 'construct-outline' as const },
        { label: 'Ransomware OCR hints', query: 'has_screenshot:true encrypted attention', icon: 'alert-circle-outline' as const },
      ],
    },
    {
      title: 'Restricted / Vulns',
      items: [
        { label: 'ICS services', query: 'tag:ics', icon: 'hardware-chip-outline' as const },
        { label: 'Heartbleed', query: 'vuln:CVE-2014-0160', icon: 'bug-outline' as const },
        { label: 'Citrix CVE-2019-19781 (DE/CH/FR)', query: 'vuln:CVE-2019-19781 country:DE,CH,FR', icon: 'flag-outline' as const },
      ],
    },
  ];

  const handleExamplePress = (exampleQuery: string) => {
    setQuery(exampleQuery);
    setTimeout(() => search(buildSearchQuery(exampleQuery, screenshotsOnly)), 100);
  };

  const maybeLoadNextPage = () => {
    const loadedCount = screenshotsOnly ? screenshotResults.length : results.length;
    if (loadedCount >= total || isLoading) return;

    const now = Date.now();
    if (now - lastPaginationAt.current < 600) return;
    lastPaginationAt.current = now;
    nextPage();
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) {
      maybeLoadNextPage();
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <View style={styles.searchRow}>
          <View style={styles.searchBarContainer}>
            <SearchBar
              value={query}
              onChangeText={setQuery}
              onSubmit={() => search(buildSearchQuery(query, screenshotsOnly))}
              placeholder={screenshotsOnly ? "Search screenshots..." : "Search devices..."}
            />
          </View>
        </View>
        <View style={styles.modeRow}>
          <Pressable
            onPress={() => setScreenshotsOnly(false)}
            style={({ pressed }) => [
              styles.modeChip,
              !screenshotsOnly && styles.modeChipActive,
              pressed && styles.modeChipPressed,
            ]}
          >
            <Ionicons name="list-outline" size={14} color={!screenshotsOnly ? Colors.textInverse : Colors.textMuted} />
            <Text variant="caption" color={!screenshotsOnly ? "textInverse" : "textMuted"} style={{ marginLeft: 4 }}>
              Hosts
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setScreenshotsOnly(true)}
            style={({ pressed }) => [
              styles.modeChip,
              screenshotsOnly && styles.modeChipActive,
              pressed && styles.modeChipPressed,
            ]}
          >
            <Ionicons name="image-outline" size={14} color={screenshotsOnly ? Colors.textInverse : Colors.textMuted} />
            <Text variant="caption" color={screenshotsOnly ? "textInverse" : "textMuted"} style={{ marginLeft: 4 }}>
              Screenshots
            </Text>
          </Pressable>
        </View>
        {!query && results.length === 0 && (
          <View style={styles.examplesContainer}>
            <Text variant="caption" color="textMuted" style={{ marginBottom: Spacing.xs }}>Try searching:</Text>
            {searchExampleGroups.map((group) => (
              <View key={group.title} style={styles.groupSection}>
                <Text variant="caption" color="accentAlt" style={styles.groupTitle}>{group.title}</Text>
                <View style={styles.examplesRow}>
                  {group.items.map((example) => (
                    <Pressable
                      key={`${group.title}-${example.label}`}
                      onPress={() => handleExamplePress(example.query)}
                      style={({ pressed }) => [
                        styles.exampleChip,
                        pressed && styles.exampleChipPressed,
                      ]}
                    >
                      <Ionicons name={example.icon} size={14} color={Colors.accentAlt} />
                      <Text variant="caption" color="text" style={{ marginLeft: 4 }}>{example.label}</Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
      <FlatList
        key={screenshotsOnly ? 'screenshots' : 'hosts'}
        data={screenshotsOnly ? screenshotResults : results}
        keyExtractor={(item, index) => `${item.ip_str}-${index}`}
        renderItem={({ item, index }) => (
          screenshotsOnly ? (
            <ScreenshotResultCard host={item} onPress={() => handleResultPress(item)} />
          ) : (
            <ResultCard host={item} onPress={() => handleResultPress(item)} index={index} />
          )
        )}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContent}
        onEndReached={maybeLoadNextPage}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  searchBarContainer: {
    flex: 1,
  },
  examplesContainer: {
    marginTop: Spacing.md,
  },
  groupSection: {
    marginTop: Spacing.xs,
  },
  groupTitle: {
    marginTop: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  modeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  modeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  modeChipActive: {
    backgroundColor: Colors.accentAlt,
    borderColor: Colors.accentAlt,
  },
  modeChipPressed: {
    opacity: 0.85,
  },
  examplesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  exampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
  },
  exampleChipPressed: {
    backgroundColor: Colors.surfaceHover,
  },
  listContent: {
    padding: Spacing.md,
    flexGrow: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: Spacing['3xl'],
  },
  resultsHeader: {
    marginBottom: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xxs,
    paddingHorizontal: Spacing.xs,
  },
  footer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
});
