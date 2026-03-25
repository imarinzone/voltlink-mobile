import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Zap, Clock, CheckCircle, Banknote } from 'lucide-react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';
import { getStationSlots, SlotInfo, ConnectorSlots } from '../../services/session.service';
import { createBooking } from '../../services/booking.service';
import { useVehicleStore } from '../../store/vehicleStore';
import { getStationById, getAIRecommendations } from '../../services/stations.service';
import { generate30MinSlot, formatSlotRange } from '../../utils/time';

const DEFAULT_DRIVER_ID = parseInt(process.env.EXPO_PUBLIC_DEFAULT_DRIVER_ID ?? '4', 10);

export default function DriverBooking() {
    const { theme } = useThemeStore();
    const { currentVehicleId } = useVehicleStore();
    const isDark = theme === 'dark';
    const router = useRouter();
    const params = useLocalSearchParams<{ stationId?: string, rank?: string, slot?: string }>();
    const rank = params.rank;

    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [station, setStation] = useState<any>(null);
    const [connectorSlots, setConnectorSlots] = useState<ConnectorSlots[]>([]);
    const [allSlots, setAllSlots] = useState<(SlotInfo & { id: string })[]>([]);
    const [selectedConnectorId, setSelectedConnectorId] = useState<string>('');
    const [reason, setReason] = useState('');
    const [showReasonScreen, setShowReasonScreen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [autoError, setAutoError] = useState(false);
    const [firstRecommendation, setFirstRecommendation] = useState<any>(null);
    const [thisRecommendation, setThisRecommendation] = useState<any>(null);
    const fetchSeqRef = useRef(0);
    const navTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const borderColor = isDark ? COLORS.cardBorder : 'rgba(0,0,0,0.08)';

    const resetBookingState = useCallback(() => {
        setConfirmed(false);
        setLoading(true);
        setSubmitting(false);
        setAutoError(false);
        setShowReasonScreen(false);
        setReason('');
        setSelectedSlot(null);
        setSelectedConnectorId('');
        setStation(null);
        setConnectorSlots([]);
        setAllSlots([]);
        setFirstRecommendation(null);
        setThisRecommendation(null);
        if (navTimeoutRef.current) {
            clearTimeout(navTimeoutRef.current);
            navTimeoutRef.current = null;
        }
    }, []);



    const fetchData = useCallback(async () => {
        const seq = ++fetchSeqRef.current;
        setLoading(true);
        try {
            const stationId = params.stationId || '1';

            // Clear previous station immediately to avoid showing stale name/slots.
            setStation(null);
            setConnectorSlots([]);
            setAllSlots([]);
            setSelectedConnectorId('');
            setSelectedSlot(null);

            const [stationData, slotsData] = await Promise.all([
                getStationById(stationId),
                getStationSlots(stationId),
            ]);

            if (seq !== fetchSeqRef.current) return;

            setStation(stationData);
            setConnectorSlots(slotsData);

            // Flatten slots with unique IDs for the picker
            const flat = slotsData.flatMap((cs: ConnectorSlots, ci: number) =>
                cs.slots.map((s: SlotInfo, si: number) => ({
                    ...s,
                    id: `${ci}-${si}`,
                    _connectorId: cs.connector_id,
                }))
            );
            setAllSlots(flat as any);
            if (slotsData.length > 0) {
                setSelectedConnectorId(slotsData[0].connector_id);

                // Auto-select first available slot for any rank in driver flow
                if (flat.length > 0) {
                    setSelectedSlot(flat[0].id);
                }
            }

            if (currentVehicleId) {
                const recs = await getAIRecommendations(currentVehicleId);
                if (seq !== fetchSeqRef.current) return;

                if (recs.length > 0) setFirstRecommendation(recs[0]);

                if (rank) {
                    const rankIndex = parseInt(rank as string, 10) - 1;
                    if (recs.length > rankIndex && rankIndex >= 0) {
                        setThisRecommendation(recs[rankIndex]);
                    }
                }
            }
        } catch (error) {
            console.error('Error fetching booking data:', error);
            Alert.alert('Error', 'Failed to load station info.');
        } finally {
            if (seq === fetchSeqRef.current) setLoading(false);
        }
    }, [params.stationId, rank, currentVehicleId]);

    useFocusEffect(
        useCallback(() => {
            // Always start booking from a clean slate (prevents skipping to success screen).
            resetBookingState();
            fetchData();
            return () => {
                if (navTimeoutRef.current) {
                    clearTimeout(navTimeoutRef.current);
                    navTimeoutRef.current = null;
                }
            };
        }, [resetBookingState, fetchData])
    );

    // Auto-confirm if rank=1 and slot is selected
    useEffect(() => {
        if (rank === '1' && !loading && !confirmed && !submitting && !autoError) {
            if (selectedSlot && station) {
                handleConfirm();
            } else if (station && !selectedSlot) {
                // API loaded but no available slots found! Show normal details so user can see it's full.
                setAutoError(true);
            }
        }
    }, [rank, loading, confirmed, submitting, selectedSlot, station, autoError]);

    // Get the first connector's data for display
    const connector = connectorSlots[0];
    const displaySlots = connector?.slots.map((s, i) => ({ ...s, id: `0-${i}` })) || [];

    // Keep booking header distance/ETA consistent with the dashboard recommendation cards.
    // These are UI-only display values.
    const displayDistanceKm =
        rank === '1' ? 1.8 : rank === '2' ? 5.4 : (station?.distanceKm ?? station?.distance_km);
    const displayEtaMinutes =
        rank === '1' ? 6 : rank === '2' ? 18 : (station?.etaMinutes ?? station?.eta_minutes);

    const estimatedKwh = thisRecommendation?.predictedKwh || 28;
    const selectedPrice = displaySlots.find(s => s.id === selectedSlot)?.price_per_kwh
        || station?.pricePerKwh || 15;
    const estimatedCost = thisRecommendation?.predictedCost || (estimatedKwh * selectedPrice);
    const creditsEarned = Math.round(estimatedCost * 0.1);

    const handleConfirm = async () => {
        if (!selectedSlot || submitting) {
            if (!selectedSlot) Alert.alert('Select a Slot', 'Please pick an available time slot first.');
            return;
        }

        // If rank=2 and reason is empty, alert (though button should be disabled)
        if (rank === '2' && !reason.trim()) {
            Alert.alert('Reason Required', 'Please provide a reason for choosing this station.');
            return;
        }

        setSubmitting(true);
        scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });

        try {
            if (!currentVehicleId) throw new Error('No vehicle selected');

            let bookingTime = new Date();
            if (params.slot) {
                const [startTime] = params.slot.split('-');
                const [hrs, mins] = startTime.split(':');
                bookingTime.setHours(parseInt(hrs), parseInt(mins), 0, 0);
            } else {
                const slot = displaySlots.find(s => s.id === selectedSlot);
                let timeStr = slot?.time || "12:00";
                let [hours, minutes] = timeStr.split(':');
                hours = hours || "12";
                minutes = minutes?.substring(0, 2) || "00";

                if (timeStr.toLowerCase().includes('pm') && parseInt(hours) < 12) {
                    hours = (parseInt(hours) + 12).toString();
                } else if (timeStr.toLowerCase().includes('am') && parseInt(hours) === 12) {
                    hours = "00";
                }
                bookingTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            }

            await createBooking({
                connector_id: selectedConnectorId || connector?.connector_id || '',
                vehicle_id: parseInt(currentVehicleId || '0', 10),
                user_id: DEFAULT_DRIVER_ID,
                booking_time: bookingTime.toISOString(),
            });
            setConfirmed(true);
            setSubmitting(false); // Reset to allow future bookings

            // Navigation watchdog: never leave user stuck on success screen.
            if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
            navTimeoutRef.current = setTimeout(() => {
                router.replace({
                    pathname: '/driver/history',
                    params: { refresh: Date.now().toString(), filter: 'active' }
                });
            }, 6000);

            setTimeout(() => {
                router.replace({
                    pathname: '/driver/history',
                    params: { refresh: Date.now().toString(), filter: 'active' }
                });
            }, 1500);
        } catch (error) {
            console.error('Error creating session:', error);
            Alert.alert('Error', 'Failed to start session. Please try again.');
            setSubmitting(false); // Reset submitting on error
            setAutoError(true); // Escape the auto-booking loading screen
        }
    };

    if (loading || (rank === '1' && !confirmed && !autoError)) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.brandBlue} />
                {rank === '1' && !loading && (
                    <Text style={[styles.confirmedSub, { color: textSecondary, marginTop: 16 }]}>
                        Securing recommended slot...
                    </Text>
                )}
            </SafeAreaView>
        );
    }

    if (confirmed) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
                <CheckCircle size={80} color={COLORS.successGreen} />
                <Text style={[styles.confirmedTitle, { color: textPrimary }]}>Booking Confirmed!</Text>
                <Text style={[styles.confirmedSub, { color: textSecondary, marginTop: 12 }]}>
                    Redirecting to History Screen...
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textPrimary }]}>Book a Slot</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.contentContainer} showsVerticalScrollIndicator={false} bounces={false}>
                <View style={styles.content}>
                    {/* Station Hero */}
                    <GlassCard style={styles.stationCard as any} intensity={30}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
                            <View style={{flex: 1, paddingRight: 8}}>
                                <Text style={[styles.stationName, { color: textPrimary }]}>{thisRecommendation?.station_name || station?.name || 'Charging Station'}</Text>
                                <Text style={styles.cpoName}>{station?.cpoName || 'VoltLink Partner'}</Text>
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
                               <Text style={[styles.metaText, { color: textSecondary }]}>{displayDistanceKm ?? '?'} km away</Text>
                               <Text style={[styles.metaText, { color: textSecondary }]}>{displayEtaMinutes ?? '?'} min ETA</Text>
                               <Text style={styles.metaHighlight}>
                                    {connector?.connector_type || 'CCS2'} {connector?.power_kw ? `${connector.power_kw}kW` : ''}
                               </Text>
                            </View>
                        </View>
                    </GlassCard>

                    {/* Rank 2 Specific UI */}
                    {rank === '2' && (
                        <View style={{ marginBottom: SPACING.xs }}>
                            <Text style={[styles.sectionTitle, { color: textSecondary }]}>Potential Loss Summary</Text>
                            <View style={styles.lossBlocksContainer}>
                                <View style={[styles.lossBlock, { backgroundColor: isDark ? 'rgba(255,68,68,0.1)' : 'rgba(255,68,68,0.05)' }]}>
                                    <Banknote size={20} color={COLORS.alertRed} />
                                    <Text style={[styles.lossLabel, { color: textSecondary }]}>Higher Price</Text>
                                    <Text style={styles.lossValue}>
                                        {thisRecommendation?.predictedRevenueLoss !== undefined 
                                            ? `+₹${thisRecommendation.predictedRevenueLoss}` 
                                            : `+₹${((station?.pricePerKwh ?? 0) - (firstRecommendation?.pricePerKwh ?? 0) > 0) ? ((station?.pricePerKwh ?? 0) - (firstRecommendation?.pricePerKwh ?? 0)).toFixed(2) : '0.00'}`}
                                    </Text>
                                </View>
                                <View style={[styles.lossBlock, { backgroundColor: isDark ? 'rgba(255,68,68,0.1)' : 'rgba(255,68,68,0.05)' }]}>
                                    <MapPin size={20} color={COLORS.alertRed} />
                                    <Text style={[styles.lossLabel, { color: textSecondary }]}>Further Dist.</Text>
                                    <Text style={styles.lossValue}>+{((station?.distanceKm ?? 0) - (firstRecommendation?.distanceKm ?? 0) > 0) ? ((station?.distanceKm ?? 0) - (firstRecommendation?.distanceKm ?? 0)).toFixed(1) : '0.0'} km</Text>
                                </View>
                                <View style={[styles.lossBlock, { backgroundColor: isDark ? 'rgba(255,68,68,0.1)' : 'rgba(255,68,68,0.05)' }]}>
                                    <Clock size={20} color={COLORS.alertRed} />
                                    <Text style={[styles.lossLabel, { color: textSecondary }]}>Longer Wait</Text>
                                    <Text style={styles.lossValue}>+{thisRecommendation?.predictedWaitTime ?? 15} min</Text>
                                </View>
                            </View>

                            <Text style={[styles.sectionTitle, { color: textSecondary }]}>Reason for Selection</Text>
                            <TextInput
                                style={[styles.reasonInput, { color: textPrimary, backgroundColor: isDark ? COLORS.inputBg : 'rgba(0,0,0,0.03)', borderColor: borderColor }]}
                                placeholder="Enter reason to enable booking..."
                                placeholderTextColor={textSecondary}
                                value={reason}
                                onChangeText={setReason}
                                multiline
                                numberOfLines={3}
                            />
                        </View>
                    )}

                    {/* Booking Details */}
                    <Text style={[styles.sectionTitle, { color: textSecondary }]}>Booking Details</Text>
                    <GlassCard style={styles.detailsCard as any} intensity={15}>
                        <View style={styles.detailsRow}>
                             <View style={styles.detailCol}>
                                <Text style={[styles.detailTitle, { color: textSecondary }]}>Selected Slot</Text>
                                <Text style={styles.detailValueBlue}>
                                    {params.slot ? formatSlotRange(params.slot) : (selectedSlot ? generate30MinSlot(displaySlots.find(s => s.id === selectedSlot)?.time || 'Auto') : 'Auto')}
                                </Text>
                             </View>
                             <View style={styles.detailCol}>
                                <Text style={[styles.detailTitle, { color: textSecondary }]}>Est. kWh</Text>
                                <Text style={[styles.detailValue, {color: textPrimary}]}>{estimatedKwh} kWh</Text>
                             </View>
                             <View style={styles.detailColRight}>
                                 <Text style={[styles.detailTitle, { color: textSecondary }]}>Estimated Cost</Text>
                                 <Text style={[styles.costValue, {color: textPrimary}]}>₹{estimatedCost}</Text>
                             </View>
                        </View>
                    </GlassCard>

                    {/* Spacer to push button to bottom */}
                    <View style={{ flex: 1, minHeight: SPACING.md }} />

                    {/* Confirm Button */}
                    <Animated.View style={animStyle}>
                        <TouchableOpacity
                            style={[
                                styles.confirmBtn,
                                {
                                    backgroundColor: (selectedSlot && (rank !== '2' || reason.trim().length > 0))
                                        ? COLORS.brandBlue
                                        : (isDark ? COLORS.inputBg : 'rgba(0,0,0,0.05)')
                                }
                            ]}
                            onPress={handleConfirm}
                            activeOpacity={0.85}
                            disabled={submitting || !selectedSlot || (rank === '2' && !reason.trim())}
                        >
                            {submitting ? (
                                <ActivityIndicator color="#000" />
                            ) : (
                                <Text style={[
                                    styles.confirmText,
                                    { color: (selectedSlot && (rank !== '2' || reason.trim().length > 0)) ? '#000' : textSecondary }
                                ]}>
                                    Confirm and Book
                                </Text>
                            )}
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.md,
        paddingVertical: 12,
    },
    backBtn: { padding: 4, width: 40 },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 18, flex: 1, textAlign: 'center' },
    
    contentContainer: { flexGrow: 1 },
    content: { flex: 1, paddingHorizontal: SPACING.md, paddingBottom: 110 },
    
    stationCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.sm },
    stationName: { ...TYPOGRAPHY.sectionHeader, fontSize: 16, marginBottom: 4 },
    cpoName: { ...TYPOGRAPHY.label, color: COLORS.brandBlue, fontWeight: '700' },
    metaText: { ...TYPOGRAPHY.body, fontSize: 12, marginBottom: 2 },
    metaHighlight: { ...TYPOGRAPHY.body, fontSize: 12, color: COLORS.successGreen, fontWeight: '700', marginTop: 2 },
    
    sectionTitle: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: 6, marginTop: SPACING.xs },
    
    lossBlocksContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: SPACING.sm, marginHorizontal: -4 },
    lossBlock: { flex: 1, borderRadius: BORDER_RADIUS.md, padding: 8, alignItems: 'center', marginHorizontal: 4, paddingVertical: 10 },
    lossLabel: { ...TYPOGRAPHY.label, fontSize: 10, marginTop: 6, textAlign: 'center' },
    lossValue: { ...TYPOGRAPHY.label, fontSize: 13, fontWeight: '700', color: COLORS.alertRed, marginTop: 2 },
    
    reasonInput: { height: 80, borderRadius: BORDER_RADIUS.md, borderWidth: 1, padding: SPACING.md, textAlignVertical: 'top', ...TYPOGRAPHY.body, marginBottom: SPACING.xs },
    
    detailsCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.xs },
    detailsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    detailCol: { flex: 1 },
    detailColRight: { flex: 1.2, alignItems: 'flex-end' },
    detailTitle: { ...TYPOGRAPHY.label, marginBottom: 2 },
    detailValueBlue: { ...TYPOGRAPHY.body, color: COLORS.brandBlue, fontWeight: '700', fontSize: 15 },
    detailValue: { ...TYPOGRAPHY.body, fontWeight: '700', fontSize: 15 },
    costValue: { ...TYPOGRAPHY.display, fontSize: 20 },
    
    confirmBtn: { height: 50, borderRadius: BORDER_RADIUS.xl, justifyContent: 'center', alignItems: 'center', width: '100%' },
    confirmText: { ...TYPOGRAPHY.body, fontSize: 16, fontWeight: '700' },
    confirmedTitle: { ...TYPOGRAPHY.hero, fontSize: 24, marginTop: SPACING.xl, textAlign: 'center' },
    confirmedSub: { ...TYPOGRAPHY.body, marginTop: SPACING.sm, textAlign: 'center' },
});
