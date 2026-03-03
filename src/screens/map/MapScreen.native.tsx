import React, { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../theme/colors';
import { Radius, Spacing } from '../../theme/spacing';
import { useSearchStore } from '../../stores/searchStore';
import { ShodanHost } from '../../api/types';
import { getHostCoordinate } from '../../utils/coordinates';

type MarkerPayload = {
  ip: string;
  org: string;
  city: string;
  country: string;
  hasVulns: boolean;
  vulnCount: number;
  latitude: number;
  longitude: number;
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function buildMapHtml(markers: MarkerPayload[]): string {
  const markersJson = JSON.stringify(markers).replace(/</g, '\\u003c');

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
    <style>
      html, body, #map { margin: 0; padding: 0; width: 100%; height: 100%; background: ${Colors.background}; }
      .leaflet-container { background: ${Colors.background}; }
      .popup-title { font-weight: 600; font-size: 14px; color: ${Colors.text}; margin-bottom: 4px; }
      .popup-line { font-size: 12px; color: ${Colors.textMuted}; margin-bottom: 4px; }
      .popup-warn { font-size: 12px; color: ${Colors.danger}; }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
    <script>
      const markers = ${markersJson};
      const map = L.map('map', { zoomControl: false }).setView([37.78825, -122.4324], 2);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const leafletMarkers = [];

      markers.forEach((item) => {
        const color = item.hasVulns ? '${Colors.danger}' : '${Colors.accentAlt}';
        const icon = L.divIcon({
          className: 'custom-marker',
          html: '<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><circle cx="10" cy="10" r="7" fill="' + color + '" opacity="0.25"/><circle cx="10" cy="10" r="4.5" fill="' + color + '"/><circle cx="10" cy="10" r="1.8" fill="#fff"/></svg>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        const marker = L.marker([item.latitude, item.longitude], { icon }).addTo(map);

        const popupHtml =
          '<div class="popup-title">' + item.ip + '</div>' +
          (item.org ? '<div class="popup-line">' + item.org + '</div>' : '') +
          (item.city || item.country ? '<div class="popup-line">' + [item.city, item.country].filter(Boolean).join(', ') + '</div>' : '') +
          (item.hasVulns ? '<div class="popup-warn">' + item.vulnCount + ' vulnerabilities</div>' : '');

        marker.bindPopup(popupHtml);
        marker.on('click', () => {
          if (window.ReactNativeWebView) {
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'marker-press', ip: item.ip }));
          }
        });

        leafletMarkers.push(marker);
      });

      if (leafletMarkers.length > 0) {
        const group = L.featureGroup(leafletMarkers);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
      }
    </script>
  </body>
</html>`;
}

export default function MapScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { results } = useSearchStore();

  const markersData = useMemo(
    () =>
      results
        .map((host) => {
          const coordinate = getHostCoordinate(host);
          if (!coordinate) return null;

          const safe: MarkerPayload = {
            ip: escapeHtml(host.ip_str),
            org: escapeHtml(host.org || ''),
            city: escapeHtml(host.city || ''),
            country: escapeHtml(host.country_name || ''),
            hasVulns: (host.vulns?.length ?? 0) > 0,
            vulnCount: host.vulns?.length ?? 0,
            latitude: coordinate.latitude,
            longitude: coordinate.longitude,
          };

          return { host, safe };
        })
        .filter((item): item is { host: ShodanHost; safe: MarkerPayload } => Boolean(item)),
    [results]
  );

  const html = useMemo(() => buildMapHtml(markersData.map((item) => item.safe)), [markersData]);

  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html }}
        style={styles.map}
        javaScriptEnabled
        domStorageEnabled
        onMessage={(event) => {
          try {
            const payload = JSON.parse(event.nativeEvent.data) as { type?: string; ip?: string };
            if (payload.type === 'marker-press' && payload.ip) {
              router.push(`/device/${payload.ip}`);
            }
          } catch {
            // Ignore malformed payloads from webview.
          }
        }}
      />

      {markersData.length > 0 && (
        <View style={[styles.header, { top: insets.top + Spacing.lg }]}>
          <Ionicons name="location-outline" size={16} color={Colors.accentAlt} />
          <Text variant="bodySmall" color="textMuted" style={{ marginLeft: 4 }}>
            {markersData.length} device{markersData.length !== 1 ? 's' : ''}
          </Text>
        </View>
      )}

      {markersData.length === 0 && (
        <View style={styles.emptyContainer}>
          <Text variant="headingMd" color="textMuted" style={{ marginBottom: Spacing.xs }}>
            No devices to display
          </Text>
          <Text variant="bodySmall" color="textMuted" align="center">
            Search for devices to see them on the map
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  map: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: Spacing.md,
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    zIndex: 100,
  },
  emptyContainer: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    alignItems: 'center',
    transform: [{ translateY: -50 }],
    paddingHorizontal: Spacing.lg,
  },
});
