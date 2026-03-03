import { ShodanBanner, ShodanHost, ShodanScreenshot } from '../api/types';

export interface HostScreenshot {
  screenshot: ShodanScreenshot;
  banner?: ShodanBanner;
}

function getBannerScreenshot(banner: ShodanBanner): ShodanScreenshot | null {
  const screenshot = banner.opts?.screenshot ?? banner.screenshot ?? null;
  if (!screenshot?.data) return null;
  return screenshot;
}

function getHostLevelScreenshot(host: ShodanHost): ShodanScreenshot | null {
  const maybeHost = host as ShodanHost & {
    screenshot?: ShodanScreenshot;
    opts?: { screenshot?: ShodanScreenshot };
  };
  const screenshot = maybeHost.opts?.screenshot ?? maybeHost.screenshot ?? null;
  if (!screenshot?.data) return null;
  return screenshot;
}

export function getHostScreenshots(host: ShodanHost): HostScreenshot[] {
  const maybeHost = host as ShodanHost & { data?: unknown };
  const banners = Array.isArray(maybeHost.data) ? (maybeHost.data as ShodanBanner[]) : [];
  const fromBanners: HostScreenshot[] = [];
  for (const banner of banners) {
    const screenshot = getBannerScreenshot(banner);
    if (!screenshot) continue;
    fromBanners.push({ screenshot, banner });
  }

  if (fromBanners.length > 0) return fromBanners;

  const hostLevelScreenshot = getHostLevelScreenshot(host);
  if (!hostLevelScreenshot) return [];
  return [{ screenshot: hostLevelScreenshot }];
}

export function getPrimaryHostScreenshot(host: ShodanHost): HostScreenshot | null {
  return getHostScreenshots(host)[0] ?? null;
}

export function toBase64ImageUri(screenshot: ShodanScreenshot): string {
  const mime = screenshot.mime || 'image/jpeg';
  return `data:${mime};base64,${screenshot.data}`;
}
