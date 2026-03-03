import { create } from 'zustand';
import { ShodanHost, SearchFacet, CommunityQuery } from '../api/types';
import { searchHosts, getCommunityQueries } from '../api/shodan';
import { withRetry, parseApiError } from '../api/errors';

interface SearchState {
  query: string; results: ShodanHost[]; total: number; page: number;
  activeQuery: string;
  facets: Record<string, SearchFacet[]>; isLoading: boolean; error: string | null; suggestions: CommunityQuery[];
  setQuery: (q: string) => void; search: (queryOverride?: string) => Promise<void>; nextPage: () => Promise<void>;
  resetSearch: () => void; loadSuggestions: () => Promise<void>;
}
export const useSearchStore = create<SearchState>((set, get) => ({
  query: '', results: [], total: 0, page: 1, activeQuery: '', facets: {}, isLoading: false, error: null, suggestions: [],
  setQuery: (query) => set({ query }),
  search: async (queryOverride) => {
    const { query } = get();
    const requestQuery = (queryOverride ?? query).trim();
    if (!requestQuery) return;
    set({ isLoading: true, error: null, page: 1, results: [], activeQuery: requestQuery });
    try {
      const data = await withRetry(() => searchHosts({ query: requestQuery, page: 1, minify: false }));
      set({ results: data.matches, total: data.total, facets: data.facets, isLoading: false });
    } catch (e) { set({ isLoading: false, error: parseApiError(e as Error).message }); }
  },
  nextPage: async () => {
    const { query, activeQuery, page, results, total, isLoading } = get();
    const requestQuery = activeQuery || query;
    if (isLoading || results.length >= total) return;
    const nextP = page + 1; set({ isLoading: true });
    try {
      const data = await withRetry(() => searchHosts({ query: requestQuery, page: nextP, minify: false }));
      set({ results: [...results, ...data.matches], page: nextP, isLoading: false });
    } catch (e) { set({ isLoading: false, error: parseApiError(e as Error).message }); }
  },
  resetSearch: () => set({ query: '', results: [], total: 0, page: 1, activeQuery: '', facets: {}, error: null }),
  loadSuggestions: async () => {
    try { const d = await getCommunityQueries(); set({ suggestions: d.matches }); } catch {}
  },
}));
