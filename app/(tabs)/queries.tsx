import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, FlatList, NativeScrollEvent, NativeSyntheticEvent, Pressable, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { SearchBar } from '../../src/components/search/SearchBar';
import { Text } from '../../src/components/ui/Text';
import { searchCommunityQueries, getCommunityQueries } from '../../src/api/shodan';
import { CommunityQuery } from '../../src/api/types';
import { parseApiError, withRetry } from '../../src/api/errors';
import { Colors } from '../../src/theme/colors';
import { Radius, Spacing } from '../../src/theme/spacing';
import { FontFamily } from '../../src/theme/typography';
import { timeAgo } from '../../src/utils/formatting';
import { useSearchStore } from '../../src/stores/searchStore';

type SortMode = 'votes' | 'timestamp';

const FALLBACK_QUERIES: CommunityQuery[] = [
  { votes: 1852, title: 'Webcams', description: 'Find public webcam interfaces', timestamp: '2025-11-21T12:00:00.000Z', tags: ['camera'], query: 'webcamxp' },
  { votes: 1430, title: 'Open SSH', description: 'Hosts exposing SSH', timestamp: '2026-01-18T11:10:00.000Z', tags: ['ssh'], query: 'port:22' },
  { votes: 1214, title: 'RDP', description: 'Remote Desktop services', timestamp: '2026-02-01T09:30:00.000Z', tags: ['rdp'], query: 'port:3389' },
  { votes: 1026, title: 'MongoDB', description: 'MongoDB instances', timestamp: '2026-02-16T10:15:00.000Z', tags: ['mongodb'], query: 'product:MongoDB' },
  { votes: 995, title: 'Elasticsearch', description: 'Elasticsearch nodes', timestamp: '2026-02-24T08:50:00.000Z', tags: ['elastic'], query: 'port:9200 product:Elasticsearch' },
];

function toTimestamp(value: string): number {
  const t = new Date(value).getTime();
  return Number.isFinite(t) ? t : 0;
}

function sortQueries(data: CommunityQuery[], mode: SortMode): CommunityQuery[] {
  const copy = [...data];
  if (mode === 'timestamp') {
    return copy.sort((a, b) => toTimestamp(b.timestamp) - toTimestamp(a.timestamp));
  }
  return copy.sort((a, b) => (b.votes ?? 0) - (a.votes ?? 0));
}

export default function QueriesScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { setQuery, search } = useSearchStore();

  const [term, setTerm] = useState('');
  const [activeTerm, setActiveTerm] = useState('');
  const [sort, setSort] = useState<SortMode>('votes');
  const [items, setItems] = useState<CommunityQuery[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const lastPaginationAt = useRef(0);
  const pageRef = useRef(1);
  const isLoadingRef = useRef(false);
  const viewportHeightRef = useRef(0);

  const runLoad = useCallback(
    async (requestedPage: number, reset: boolean, requestedTerm?: string, requestedSort?: SortMode) => {
      const nextTerm = (requestedTerm ?? activeTerm).trim();
      const nextSort = requestedSort ?? sort;
      setIsLoading(true);
      setError(null);
      try {
        const data = nextTerm
          ? await withRetry(() => searchCommunityQueries(nextTerm, requestedPage))
          : await withRetry(() => getCommunityQueries(requestedPage, nextSort));
        setItems((prev) => (reset ? data.matches : [...prev, ...data.matches]));
        setTotal(data.total);
        setPage(requestedPage);
      } catch (e) {
        const parsed = parseApiError(e as Error);
        if (parsed.status === 503 && reset) {
          setItems(sortQueries(FALLBACK_QUERIES, nextSort));
          setTotal(FALLBACK_QUERIES.length);
          setPage(1);
          setError('Community queries are temporarily unavailable (503). Showing fallback queries.');
        } else {
          setError(parsed.message);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [activeTerm, sort]
  );

  useEffect(() => {
    runLoad(1, true, '', 'votes');
  }, [runLoad]);

  useEffect(() => {
    pageRef.current = page;
  }, [page]);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  const onSubmitQuerySearch = () => {
    const next = term.trim();
    setActiveTerm(next);
    runLoad(1, true, next, sort);
  };

  const onPressSort = (nextSort: SortMode) => {
    if (sort === nextSort) return;
    setSort(nextSort);
    runLoad(1, true, activeTerm, nextSort);
  };

  const onPressQuery = (item: CommunityQuery) => {
    setQuery(item.query);
    search(item.query);
    router.push('/(tabs)/search');
  };

  const displayedItems = useMemo(() => sortQueries(items, sort), [items, sort]);

  const loadMore = () => {
    if (isLoadingRef.current || items.length >= total) return;
    const now = Date.now();
    if (now - lastPaginationAt.current < 600) return;
    lastPaginationAt.current = now;
    runLoad(pageRef.current + 1, false);
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    if (layoutMeasurement.height + contentOffset.y >= contentSize.height - 200) {
      loadMore();
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + Spacing.lg }]}>
      <Text variant="headingMd" color="primary">Community Queries</Text>
      <Text variant="caption" color="textMuted" style={{ marginTop: Spacing.xxs }}>
        Browse proven Shodan queries or search by keyword.
      </Text>
      <View style={{ marginTop: Spacing.md }}>
        <SearchBar
          value={term}
          onChangeText={setTerm}
          onSubmit={onSubmitQuerySearch}
          placeholder="Search query library..."
        />
      </View>
      <View style={styles.sortRow}>
        <Pressable
          onPress={() => onPressSort('votes')}
          style={({ pressed }) => [styles.sortChip, sort === 'votes' && styles.sortChipActive, pressed && styles.sortChipPressed]}
        >
          <Text variant="caption" color={sort === 'votes' ? 'textInverse' : 'textMuted'}>Top voted</Text>
        </Pressable>
        <Pressable
          onPress={() => onPressSort('timestamp')}
          style={({ pressed }) => [styles.sortChip, sort === 'timestamp' && styles.sortChipActive, pressed && styles.sortChipPressed]}
        >
          <Text variant="caption" color={sort === 'timestamp' ? 'textInverse' : 'textMuted'}>Latest</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.empty}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text variant="bodySmall" color="textMuted" style={{ marginTop: Spacing.sm }}>Loading queries...</Text>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.empty}>
          <Text variant="body" color="danger" align="center">{error}</Text>
        </View>
      );
    }
    return (
      <View style={styles.empty}>
        <Text variant="body" color="textMuted">No queries found.</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!isLoading || items.length === 0) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={Colors.primary} />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={displayedItems}
        keyExtractor={(item, index) => `${item.query}-${index}`}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        onLayout={(event) => {
          viewportHeightRef.current = event.nativeEvent.layout.height;
        }}
        onContentSizeChange={(_, contentHeight) => {
          if (contentHeight <= viewportHeightRef.current + 16) {
            loadMore();
          }
        }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <Pressable onPress={() => onPressQuery(item)} style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}>
            <View style={styles.cardHeader}>
              <Text variant="headingMd" color="text">{item.title || item.query}</Text>
              <View style={styles.meta}>
                <Ionicons name="arrow-up" size={12} color={Colors.warning} />
                <Text variant="caption" color="warning">{item.votes.toString()}</Text>
              </View>
            </View>
            {item.description ? (
              <Text variant="bodySmall" color="textMuted" style={{ marginTop: Spacing.xs }}>
                {item.description}
              </Text>
            ) : null}
            {item.tags?.length ? (
              <View style={styles.tagsRow}>
                {item.tags.slice(0, 3).map((tag) => (
                  <View key={`${item.query}-${tag}`} style={styles.tag}>
                    <Text variant="caption" color="textMuted">{tag}</Text>
                  </View>
                ))}
              </View>
            ) : null}
            <Text variant="caption" color="accentAlt" style={styles.queryText}>
              {item.query}
            </Text>
            <View style={styles.cardFooter}>
              <Text variant="caption" color="textMuted">{timeAgo(item.timestamp)}</Text>
              <Text variant="caption" color="primary">Tap to search</Text>
            </View>
          </Pressable>
        )}
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
  listContent: {
    paddingBottom: Spacing['3xl'],
  },
  sortRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  sortChip: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.surface,
  },
  sortChipActive: {
    backgroundColor: Colors.accentAlt,
    borderColor: Colors.accentAlt,
  },
  sortChipPressed: {
    opacity: 0.85,
  },
  card: {
    marginHorizontal: Spacing.md,
    marginTop: Spacing.sm,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.surface,
  },
  cardPressed: {
    backgroundColor: Colors.surfaceHover,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  queryText: {
    marginTop: Spacing.sm,
    fontFamily: FontFamily.mono,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  tag: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.xs,
    paddingVertical: 2,
    backgroundColor: Colors.backgroundAlt,
  },
  cardFooter: {
    marginTop: Spacing.sm,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    padding: Spacing['3xl'],
    alignItems: 'center',
  },
  footer: {
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
});
