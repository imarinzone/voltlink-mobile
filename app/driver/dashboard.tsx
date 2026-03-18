import React, { useCallback, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, RefreshControl, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Route, AlertTriangle, User } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { VehicleCard } from '../../components/vehicle/VehicleCard';
import { MetricCard } from '../../components/ui/MetricCard';
import { RecommendationCard } from '../../components/charging/RecommendationCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { SOSButton } from '../../components/feedback/SOSButton';
import { getVehicleDashboard, getTodayStats } from '../../services/driver.service';
import { getAIRecommendations } from '../../services/stations.service'; // Added
import { useThemeStore } from '../../store/themeStore';
import { Vehicle } from '../../types/vehicle.types';
import { useVehicleStore } from '../../store/vehicleStore';
import { Station } from '../../types/station.types';
import { getDriverProfile, getVehiclesByDriver } from '../../services/driver.service';
import { useRouter } from 'expo-router';
import { useLanguageStore, Language } from '../../store/languageStore';
import { useFocusEffect } from '@react-navigation/native';

const translations = {
    English: {
        greeting: 'Good Morning,',
        stats: "Today's Stats",
        efficiency: 'Efficiency',
        distance: 'Distance',
        energyUsed: 'Energy Used',
        aiRecs: 'AI Recommendations',
        viewAll: 'View All',
        batteryLow: 'Battery critically low',
        tapToSee: 'Tap to see nearest chargers'
    },
    'हिंदी': {
        greeting: 'शुभ प्रभात,',
        stats: "आज के आँकड़े",
        efficiency: 'दक्षता',
        distance: 'दूरी',
        energyUsed: 'ऊर्जा उपयोग',
        aiRecs: 'AI सिफारिशें',
        viewAll: 'सभी देखें',
        batteryLow: 'बैटरी बहुत कम है',
        tapToSee: 'निकटतम चार्जर देखने के लिए टैप करें'
    }
};

const DriverDashboard = () => {
    const { theme } = useThemeStore();
    const { language, setLanguage } = useLanguageStore();
    const isDark = theme === 'dark';
    const router = useRouter();
    const t = translations[language];
    const scrollRef = React.useRef<ScrollView>(null);

    const [refreshing, setRefreshing] = useState(false);
    const [vehicle, setVehicle] = useState<Vehicle | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [recommendations, setRecommendations] = useState<Station[]>([]); // Added
    const [driverProfile, setDriverProfile] = useState<any>(null);

    const { currentVehicleId, setCurrentVehicleId, setMyVehicle } = useVehicleStore();

    const fetchData = async (forceRefresh: boolean = false) => {
        try {
            const profile = await getDriverProfile(undefined, forceRefresh);
            setDriverProfile(profile);

            // Always prioritize the driver's first assigned vehicle from the backend
            const driverVehicles = await getVehiclesByDriver(undefined, forceRefresh);
            const vehicleId = driverVehicles?.[0]?.id;

            if (vehicleId) setCurrentVehicleId(vehicleId);

            if (!vehicleId) return;

            const [vData, sData, rData] = await Promise.all([
                getVehicleDashboard(vehicleId, forceRefresh),
                getTodayStats(vehicleId, forceRefresh),
                getAIRecommendations(vehicleId, forceRefresh)
            ]);
            setVehicle(vData);
            setMyVehicle(vData as any); // Sync globally so Session gets live %
            setStats(sData);
            setRecommendations(rData);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    useEffect(() => { fetchData(); }, []);

    useFocusEffect(
        useCallback(() => {
            fetchData(true);
        }, [])
    );

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchData(true);
        setRefreshing(false);
    };

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    const batteryLow = vehicle ? vehicle.batteryLevel < 20 : false;

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
            <ScrollView
                ref={scrollRef}
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.brandBlue} />}
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerTop}>
                        <View>
                            <Text style={[styles.greeting, { color: textSecondary }]}>{t.greeting}</Text>
                            <Text style={[styles.name, { color: textPrimary }]}>{driverProfile?.name || vehicle?.driverName || 'Driver'}</Text>
                        </View>
                        <View style={styles.headerRight}>
                            <View style={styles.langSwitch}>
                                {(['English', 'हिंदी'] as Language[]).map((l) => (
                                    <TouchableOpacity
                                        key={l}
                                        onPress={() => setLanguage(l)}
                                        style={[
                                            styles.langPill,
                                            language === l && { backgroundColor: COLORS.brandBlue }
                                        ]}
                                    >
                                        <Text style={[styles.langText, { color: language === l ? '#000' : textSecondary }]}>
                                            {l}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                            <TouchableOpacity
                                style={styles.profileAvatar}
                                onPress={() => router.push('/driver/profile' as any)}
                            >
                                <User size={18} color={textPrimary} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {/* Low Battery Alert Banner */}
                {batteryLow && (
                    <TouchableOpacity
                        style={styles.alertBanner}
                        onPress={() => scrollRef.current?.scrollToEnd({ animated: true })}
                        activeOpacity={0.85}
                    >
                        <AlertTriangle size={18} color={COLORS.alertRed} />
                        <Text style={styles.alertText}>
                            {t.batteryLow} ({vehicle?.batteryLevel}%) — {t.tapToSee}
                        </Text>
                    </TouchableOpacity>
                )}

                {vehicle && (
                    <VehicleCard
                        vehicle={vehicle}
                    />
                )}

                <SectionHeader title={t.stats} />
                <View style={styles.statsRow}>
                    <MetricCard label={t.efficiency} value={vehicle?.efficiency || 6.8} unit="km/kWh" icon={<Zap size={16} color={COLORS.brandBlue} />} />
                    <MetricCard label={t.distance} value={230.4} unit="km" icon={<Route size={16} color={COLORS.brandBlue} />} />
                    <MetricCard label={t.energyUsed} value={stats?.kwhConsumed || 0} unit="kWh" icon={<Zap size={16} color={COLORS.successGreen} />} />
                </View>

                <SectionHeader
                    title={t.aiRecs}
                />

                {recommendations.slice(0, 2).map((item, index) => (
                    <RecommendationCard
                        key={item.id}
                        recommendation={{
                            ...(item as any),
                            ...(index === 0
                                ? { distanceKm: 1.8, etaMinutes: 6 }
                                : index === 1
                                    ? { distanceKm: 5.4, etaMinutes: 18 }
                                    : {}),
                        } as any}
                        rank={index + 1}
                        isPrimary={index === 0}
                        onBook={() => router.push({
                            pathname: `/driver/booking`,
                            params: { rank: index + 1, slot: item.slot, stationId: item.station_id || item.id }
                        } as any)}
                    />
                ))}
            </ScrollView>
            <SOSButton />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 120 },
    header: { marginBottom: SPACING.lg },
    greeting: { ...TYPOGRAPHY.label, fontSize: 15 },
    name: { ...TYPOGRAPHY.hero, fontSize: 28 },
    alertBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,68,68,0.12)',
        borderWidth: 1,
        borderColor: 'rgba(255,68,68,0.35)',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        marginBottom: SPACING.md,
        gap: SPACING.sm,
    },
    alertText: { ...TYPOGRAPHY.label, color: COLORS.alertRed, flex: 1, fontWeight: '600', lineHeight: 18 },
    statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginHorizontal: -4 },
    headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    headerRight: { flexDirection: 'row', alignItems: 'center', gap: SPACING.md },
    profileAvatar: {
        width: 36, height: 36,
        borderRadius: 18,
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        backgroundColor: COLORS.inputBg
    },
    langSwitch: { flexDirection: 'row', gap: 4, backgroundColor: COLORS.inputBg, borderRadius: 20, padding: 4 },
    langPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 16 },
    langText: { fontSize: 10, fontWeight: '800' },
});

export default DriverDashboard;
