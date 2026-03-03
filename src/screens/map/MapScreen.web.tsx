import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Text } from '../../components/ui/Text';
import { Colors } from '../../theme/colors';
import { Spacing, Radius } from '../../theme/spacing';
import { useSearchStore } from '../../stores/searchStore';
import { ShodanHost } from '../../api/types';
import { getHostCoordinate } from '../../utils/coordinates';

delete (L.Icon.Default.prototype as { _getIconUrl?: string })._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createCustomIcon = (hasVulns: boolean) => {
    const color = hasVulns ? Colors.danger : Colors.accentAlt;
    const svgIcon = `
    <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="${color}" opacity="0.2"/>
      <circle cx="12" cy="12" r="5" fill="${color}"/>
      <circle cx="12" cy="12" r="2" fill="white"/>
    </svg>
  `;

    return L.divIcon({
        html: svgIcon,
        className: 'custom-marker',
        iconSize: [24, 24],
        iconAnchor: [12, 12],
    });
};

function FitBounds({ markersData }: { markersData: Array<{ latitude: number; longitude: number }> }) {
    const map = useMap();

    useEffect(() => {
        if (markersData.length > 0) {
            const bounds = L.latLngBounds(markersData.map((coord) => [coord.latitude, coord.longitude]));
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }, [markersData, map]);

    return null;
}

export default function MapScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { results } = useSearchStore();

    useEffect(() => {
        const styleId = 'leaflet-stylesheet';
        if (!document.getElementById(styleId)) {
            const link = document.createElement('link');
            link.id = styleId;
            link.rel = 'stylesheet';
            link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
            document.head.appendChild(link);
        }
    }, []);

    const markersData = results
        .map((host) => {
            const coordinate = getHostCoordinate(host);
            if (!coordinate) return null;
            return { host, coordinate };
        })
        .filter((item): item is { host: ShodanHost; coordinate: { latitude: number; longitude: number } } => Boolean(item));

    const handleMarkerClick = (host: ShodanHost) => {
        router.push(`/device/${host.ip_str}`);
    };

    return (
        <View style={styles.container}>
            {markersData.length > 0 && (
                <View style={[styles.header, { top: insets.top + Spacing.lg }]}>
                    <Ionicons name="location-outline" size={16} color={Colors.accentAlt} />
                    <Text variant="bodySmall" color="textMuted" style={{ marginLeft: 4 }}>
                        {markersData.length} device{markersData.length !== 1 ? 's' : ''}
                    </Text>
                </View>
            )}

            <View style={styles.map as unknown as object}>
                <MapContainer center={[37.78825, -122.4324]} zoom={3} style={{ height: '100%', width: '100%' }} zoomControl={false}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />

                    {markersData.length > 0 && (
                        <FitBounds
                            markersData={markersData.map((host) => ({
                                latitude: host.coordinate.latitude,
                                longitude: host.coordinate.longitude,
                            }))}
                        />
                    )}

                    {markersData.map(({ host, coordinate }, index) => {
                        const hasVulns = (host.vulns?.length ?? 0) > 0;

                        return (
                            <Marker
                                key={`${host.ip_str}-${index}`}
                                position={[coordinate.latitude, coordinate.longitude]}
                                icon={createCustomIcon(hasVulns)}
                                eventHandlers={{
                                    click: () => handleMarkerClick(host),
                                }}
                            >
                                <Popup>
                                    <div style={{ padding: '8px', minWidth: '200px' }}>
                                        <div
                                            style={{
                                                fontWeight: 'bold',
                                                marginBottom: '4px',
                                                color: Colors.text,
                                                fontSize: '14px',
                                            }}
                                        >
                                            {host.ip_str}
                                        </div>
                                        {host.org && (
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: Colors.textMuted,
                                                    marginBottom: '4px',
                                                }}
                                            >
                                                {host.org}
                                            </div>
                                        )}
                                        {host.city && (
                                            <div
                                                style={{
                                                    fontSize: '12px',
                                                    color: Colors.textMuted,
                                                    marginBottom: '4px',
                                                }}
                                            >
                                                {host.city}, {host.country_name}
                                            </div>
                                        )}
                                        {hasVulns && (
                                            <div
                                                style={{
                                                    color: Colors.danger,
                                                    fontSize: '12px',
                                                    marginTop: '4px',
                                                }}
                                            >
                                                ⚠️ {host.vulns?.length} vulnerabilities
                                            </div>
                                        )}
                                    </div>
                                </Popup>
                            </Marker>
                        );
                    })}
                </MapContainer>
            </View>

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

            <style>{`
        .leaflet-container {
          background: ${Colors.background};
        }
        .custom-marker {
          background: transparent;
          border: none;
        }
        .leaflet-popup-content-wrapper {
          background: ${Colors.surface};
          border: 1px solid ${Colors.border};
          border-radius: ${Radius.md}px;
        }
        .leaflet-popup-tip {
          background: ${Colors.surface};
          border: 1px solid ${Colors.border};
        }
      `}</style>
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
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        position: 'absolute',
        top: Spacing.md,
        left: Spacing.md,
        backgroundColor: Colors.surface,
        borderRadius: Radius.md,
        paddingVertical: Spacing.xs,
        paddingHorizontal: Spacing.sm,
        borderWidth: 1,
        borderColor: Colors.border,
        zIndex: 1000,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    emptyContainer: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        alignItems: 'center',
        transform: [{ translateY: -50 }],
    },
});
