import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as Clipboard from 'expo-clipboard';
import { Ionicons } from '@expo/vector-icons';
import { Text } from '../../src/components/ui/Text';
import { DeviceHeader } from '../../src/components/device/DeviceHeader';
import { BannerCard } from '../../src/components/device/BannerCard';
import { ScreenshotGallery } from '../../src/components/device/ScreenshotGallery';
import { PortList } from '../../src/components/device/PortList';
import { DeviceMetadata } from '../../src/components/device/DeviceMetadata';
import { Colors } from '../../src/theme/colors';
import { Spacing } from '../../src/theme/spacing';
import { getHost } from '../../src/api/shodan';
import { ShodanHost } from '../../src/api/types';
import { parseApiError } from '../../src/api/errors';
import { useSavedStore } from '../../src/stores/savedStore';
import { getHostScreenshots } from '../../src/utils/screenshots';
import { lightTap } from '../../src/utils/haptics';

export default function DeviceDetailScreen() {
    const router = useRouter();
    const { ip } = useLocalSearchParams<{ ip: string }>();
    const [host, setHost] = useState<ShodanHost | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [copiedAll, setCopiedAll] = useState(false);
    const { toggleBookmarkHost, isHostBookmarked } = useSavedStore();
    const isBookmarked = host ? isHostBookmarked(host.ip_str) : false;

    const handleToggleBookmark = () => {
        if (!host) return;
        toggleBookmarkHost({
            ip: host.ip_str,
            hostname: host.hostnames?.[0] || '',
            org: host.org || '',
            ports: host.ports || [],
        });
    };

    const handleCopyAllHostData = async () => {
        if (!host) return;
        const shodanUrl = `https://www.shodan.io/host/${host.ip_str}`;
        const payload = `Shodan URL: ${shodanUrl}\n\nHost JSON:\n${JSON.stringify(host, null, 2)}`;
        await Clipboard.setStringAsync(payload);
        lightTap();
        setCopiedAll(true);
        setTimeout(() => setCopiedAll(false), 2000);
    };

    useEffect(() => {
        if (!ip) return;

        const fetchHost = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const data = await getHost(ip);
                setHost(data);
            } catch (e) {
                setError(parseApiError(e as Error).message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHost();
    }, [ip]);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} hitSlop={8}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </Pressable>
                    <Text variant="headingMd" color="text" style={{ marginLeft: Spacing.md }}>Device Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text variant="bodySmall" color="textMuted" style={{ marginTop: Spacing.md }}>
                        Loading device info...
                    </Text>
                </View>
            </View>
        );
    }

    if (error || !host) {
        return (
            <View style={styles.container}>
                <View style={styles.header}>
                    <Pressable onPress={() => router.back()} hitSlop={8}>
                        <Ionicons name="arrow-back" size={24} color={Colors.text} />
                    </Pressable>
                    <Text variant="headingMd" color="text" style={{ marginLeft: Spacing.md }}>Device Details</Text>
                </View>
                <View style={styles.loadingContainer}>
                    <Ionicons name="alert-circle-outline" size={48} color={Colors.danger} />
                    <Text variant="body" color="danger" style={{ marginTop: Spacing.md }}>
                        {error || 'Failed to load device'}
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => router.back()} hitSlop={8}>
                    <Ionicons name="arrow-back" size={24} color={Colors.text} />
                </Pressable>
                <Text variant="headingMd" color="text" style={{ marginLeft: Spacing.md, flex: 1 }}>Device Details</Text>
                <Pressable onPress={handleToggleBookmark} hitSlop={8}>
                    <Ionicons
                        name={isBookmarked ? "bookmark" : "bookmark-outline"}
                        size={24}
                        color={isBookmarked ? Colors.warning : Colors.text}
                    />
                </Pressable>
                <Pressable onPress={handleCopyAllHostData} hitSlop={8} style={{ marginLeft: Spacing.sm }}>
                    <Ionicons
                        name={copiedAll ? "checkmark-circle" : "copy-outline"}
                        size={22}
                        color={copiedAll ? Colors.accent : Colors.text}
                    />
                </Pressable>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <DeviceHeader host={host} />

                {getHostScreenshots(host).length > 0 && (
                    <View style={styles.section}>
                        <ScreenshotGallery host={host} />
                    </View>
                )}

                {host.data && host.data.length > 0 && (
                    <View style={styles.section}>
                        <Text variant="headingMd" color="text" style={{ marginBottom: Spacing.sm }}>
                            Banners ({host.data.length})
                        </Text>
                        {host.data.map((banner, index) => (
                            <BannerCard key={index} banner={banner} />
                        ))}
                    </View>
                )}

                {host.data && host.data.length > 0 && (
                    <View style={styles.section}>
                        <PortList banners={host.data} />
                    </View>
                )}

                <View style={styles.section}>
                    <DeviceMetadata host={host} />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: Spacing.md,
        paddingTop: Spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: Spacing.md,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    section: {
        marginBottom: Spacing.lg,
    },
});
