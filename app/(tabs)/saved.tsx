import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '../../src/components/ui/Text';
import { SegmentedControl } from '../../src/components/saved/SegmentedControl';
import { BookmarkedHostCard } from '../../src/components/saved/BookmarkedHostCard';
import { SavedSearchCard } from '../../src/components/saved/SavedSearchCard';
import { Colors } from '../../src/theme/colors';
import { Spacing } from '../../src/theme/spacing';
import { useSavedStore } from '../../src/stores/savedStore';
import { useSearchStore } from '../../src/stores/searchStore';

export default function SavedScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'hosts' | 'searches'>('hosts');
  const { bookmarkedHosts, savedSearches, toggleBookmarkHost, toggleSaveSearch, hydrate } = useSavedStore();
  const { setQuery, search } = useSearchStore();

  useEffect(() => {
    hydrate();
  }, []);

  const handleHostPress = (ip: string) => {
    router.push(`/device/${ip}`);
  };

  const handleSearchPress = (query: string) => {
    setQuery(query);
    router.push('/(tabs)/search');
    setTimeout(() => search(), 100);
  };

  const segments = [
    { key: 'hosts', label: 'Hosts', count: bookmarkedHosts.length },
    { key: 'searches', label: 'Searches', count: savedSearches.length },
  ];

  const renderEmptyHosts = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headingMd" color="textMuted" style={{ marginBottom: Spacing.xs }}>No bookmarked hosts</Text>
      <Text variant="bodySmall" color="textMuted" align="center">Bookmark devices from search results or device details</Text>
    </View>
  );

  const renderEmptySearches = () => (
    <View style={styles.emptyContainer}>
      <Text variant="headingMd" color="textMuted" style={{ marginBottom: Spacing.xs }}>No saved searches</Text>
      <Text variant="bodySmall" color="textMuted" align="center">Save your favorite searches for quick access</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
        <SegmentedControl
          segments={segments}
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key as 'hosts' | 'searches')}
        />
      </View>

      {activeTab === 'hosts' ? (
        <FlatList
          data={bookmarkedHosts}
          keyExtractor={(item) => item.ip}
          renderItem={({ item }) => (
            <BookmarkedHostCard
              ip={item.ip}
              hostname={item.hostname}
              org={item.org}
              ports={item.ports}
              onPress={() => handleHostPress(item.ip)}
              onRemove={() => toggleBookmarkHost(item)}
            />
          )}
          ListEmptyComponent={renderEmptyHosts}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <FlatList
          data={savedSearches}
          keyExtractor={(item) => item.query}
          renderItem={({ item }) => (
            <SavedSearchCard
              query={item.query}
              resultCount={item.resultCount}
              timestamp={item.timestamp}
              onPress={() => handleSearchPress(item.query)}
              onRemove={() => toggleSaveSearch(item.query)}
              saved
            />
          )}
          ListEmptyComponent={renderEmptySearches}
          contentContainerStyle={styles.listContent}
        />
      )}
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
});
