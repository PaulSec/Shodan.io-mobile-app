import { ShodanBanner, ShodanHost, ShodanLocation } from '../api/types';

export interface HostCoordinate {
  latitude: number;
  longitude: number;
}

function toCoordinate(location?: ShodanLocation | null): HostCoordinate | null {
  if (!location) return null;
  const { latitude, longitude } = location;
  if (typeof latitude !== 'number' || typeof longitude !== 'number') return null;
  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) return null;
  return { latitude, longitude };
}

export function getHostCoordinate(host: ShodanHost): HostCoordinate | null {
  if (typeof host.latitude === 'number' && typeof host.longitude === 'number') {
    if (Number.isFinite(host.latitude) && Number.isFinite(host.longitude)) {
      return { latitude: host.latitude, longitude: host.longitude };
    }
  }

  const maybeHost = host as ShodanHost & { location?: ShodanLocation | null; data?: unknown };
  const hostLocation = toCoordinate(maybeHost.location);
  if (hostLocation) return hostLocation;

  if (!Array.isArray(maybeHost.data)) return null;
  for (const banner of maybeHost.data as ShodanBanner[]) {
    const bannerLocation = toCoordinate(banner?.location);
    if (bannerLocation) return bannerLocation;
  }

  return null;
}
