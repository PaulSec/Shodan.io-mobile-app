import { create } from 'zustand';
import { getJSON, setJSON } from '../utils/asyncStorage';

interface RecentSearch { query: string; timestamp: number; resultCount: number }
interface BookmarkedHost { ip: string; hostname: string; org: string; ports: number[]; timestamp: number }
interface SavedState {
  recentSearches: RecentSearch[]; savedSearches: RecentSearch[]; bookmarkedHosts: BookmarkedHost[];
  addRecent: (query: string, resultCount: number) => void;
  toggleSaveSearch: (query: string, resultCount?: number) => void; toggleBookmarkHost: (host: Omit<BookmarkedHost, 'timestamp'>) => void;
  isSearchSaved: (query: string) => boolean; isHostBookmarked: (ip: string) => boolean;
  clearRecent: () => void; hydrate: () => Promise<void>;
}
const KEYS = { recent: 'shodan_recent_searches', saved: 'shodan_saved_searches', hosts: 'shodan_bookmarked_hosts' };
const persist = (state: SavedState) => {
  setJSON(KEYS.recent, state.recentSearches); setJSON(KEYS.saved, state.savedSearches); setJSON(KEYS.hosts, state.bookmarkedHosts);
};
export const useSavedStore = create<SavedState>((set, get) => ({
  recentSearches: [], savedSearches: [], bookmarkedHosts: [],
  addRecent: (query, resultCount) => {
    const s = get(); const filtered = s.recentSearches.filter(r => r.query !== query);
    const updated = [{ query, timestamp: Date.now(), resultCount }, ...filtered].slice(0, 50);
    set({ recentSearches: updated }); persist({ ...get(), recentSearches: updated });
  },
  toggleSaveSearch: (query, resultCount = 0) => {
    const s = get(); const exists = s.savedSearches.some(r => r.query === query);
    const updated = exists ? s.savedSearches.filter(r => r.query !== query) : [...s.savedSearches, { query, timestamp: Date.now(), resultCount }];
    set({ savedSearches: updated }); persist({ ...get(), savedSearches: updated });
  },
  toggleBookmarkHost: (host) => {
    const s = get(); const exists = s.bookmarkedHosts.some(h => h.ip === host.ip);
    const updated = exists ? s.bookmarkedHosts.filter(h => h.ip !== host.ip) : [...s.bookmarkedHosts, { ...host, timestamp: Date.now() }];
    set({ bookmarkedHosts: updated }); persist({ ...get(), bookmarkedHosts: updated });
  },
  isSearchSaved: (query) => get().savedSearches.some(r => r.query === query),
  isHostBookmarked: (ip) => get().bookmarkedHosts.some(h => h.ip === ip),
  clearRecent: () => { set({ recentSearches: [] }); persist(get()); },
  hydrate: async () => {
    const [recent, saved, hosts] = await Promise.all([
      getJSON<RecentSearch[]>(KEYS.recent), getJSON<RecentSearch[]>(KEYS.saved), getJSON<BookmarkedHost[]>(KEYS.hosts),
    ]);
    set({ recentSearches: recent ?? [], savedSearches: saved ?? [], bookmarkedHosts: hosts ?? [] });
  },
}));
