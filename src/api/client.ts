import axios, { type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { ShodanApiError, parseApiError } from './errors';
let _apiKey: string | null = null;
export function setApiKey(key: string | null) { _apiKey = key; }
export function getApiKey(): string { if (!_apiKey) throw new ShodanApiError(401, 'API key not set.'); return _apiKey; }
const client = axios.create({ baseURL: 'https://api.shodan.io', timeout: 15000, headers: { Accept: 'application/json' } });
client.interceptors.request.use((c: InternalAxiosRequestConfig) => { c.params = { ...c.params, key: getApiKey() }; return c; }, (e: AxiosError) => Promise.reject(parseApiError(e)));
client.interceptors.response.use((r: AxiosResponse) => r, (e: AxiosError) => Promise.reject(parseApiError(e)));
export default client;
