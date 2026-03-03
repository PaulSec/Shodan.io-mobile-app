import * as SecureStore from 'expo-secure-store';
const KEY = 'shodan_api_key';
export async function getToken(): Promise<string | null> { return SecureStore.getItemAsync(KEY); }
export async function setToken(token: string): Promise<void> { await SecureStore.setItemAsync(KEY, token); }
export async function deleteToken(): Promise<void> { await SecureStore.deleteItemAsync(KEY); }
