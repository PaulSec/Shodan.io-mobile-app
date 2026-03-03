import { useState, useEffect } from 'react';
import { AppState } from 'react-native';
export function useNetworkStatus() {
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const check = async () => { try { const r = await fetch('https://api.shodan.io', { method: 'HEAD' }); setIsConnected(r.ok); } catch { setIsConnected(false); } };
    check();
    const sub = AppState.addEventListener('change', (s) => { if (s === 'active') check(); });
    const interval = setInterval(check, 30000);
    return () => { sub.remove(); clearInterval(interval); };
  }, []);
  return { isConnected };
}
