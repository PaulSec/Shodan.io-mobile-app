import { create } from 'zustand';
import { ApiInfo } from '../api/types';
import { getApiInfo } from '../api/shodan';
import { setApiKey } from '../api/client';
import { getToken, setToken, deleteToken } from '../utils/secureStorage';
import { parseApiError } from '../api/errors';

interface AuthState {
  token: string | null; apiInfo: ApiInfo | null; isAuthenticated: boolean; isLoading: boolean; error: string | null;
  hydrate: () => Promise<void>; login: (token: string) => Promise<void>; logout: () => Promise<void>; refreshApiInfo: () => Promise<void>;
}
export const useAuthStore = create<AuthState>((set, get) => ({
  token: null, apiInfo: null, isAuthenticated: false, isLoading: true, error: null,
  hydrate: async () => {
    set({ isLoading: true, error: null });
    try {
      const token = await getToken();
      if (!token) { set({ isLoading: false }); return; }
      setApiKey(token);
      const apiInfo = await getApiInfo();
      set({ token, apiInfo, isAuthenticated: true, isLoading: false });
    } catch (e) { set({ isLoading: false, error: parseApiError(e as Error).message }); }
  },
  login: async (token: string) => {
    set({ isLoading: true, error: null });
    try {
      setApiKey(token);
      const apiInfo = await getApiInfo();
      await setToken(token);
      set({ token, apiInfo, isAuthenticated: true, isLoading: false });
    } catch (e) { setApiKey(null); set({ isLoading: false, error: parseApiError(e as Error).message }); throw e; }
  },
  logout: async () => {
    await deleteToken(); setApiKey(null);
    set({ token: null, apiInfo: null, isAuthenticated: false, error: null });
  },
  refreshApiInfo: async () => {
    try { const apiInfo = await getApiInfo(); set({ apiInfo }); } catch (e) { set({ error: parseApiError(e as Error).message }); }
  },
}));
