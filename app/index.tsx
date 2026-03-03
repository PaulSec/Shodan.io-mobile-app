import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/authStore';
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);
  if (isLoading) return null;
  return isAuthenticated ? <Redirect href="/(tabs)/search" /> : <Redirect href="/auth" />;
}
