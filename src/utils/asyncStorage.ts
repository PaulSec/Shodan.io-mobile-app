import AsyncStorage from '@react-native-async-storage/async-storage';
export async function getJSON<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key); return raw ? JSON.parse(raw) as T : null;
}
export async function setJSON<T>(key: string, value: T): Promise<void> { await AsyncStorage.setItem(key, JSON.stringify(value)); }
export async function removeItem(key: string): Promise<void> { await AsyncStorage.removeItem(key); }
