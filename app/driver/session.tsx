import React, { useState, useEffect, useCallback } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue, withTiming, useAnimatedProps, withRepeat, withSequence, useAnimatedStyle
} from 'react-native-reanimated';
import { PanGestureHandler, GestureHandlerRootView, TouchableOpacity as GHTouchableOpacity } from 'react-native-gesture-handler';
import { Lightning, Warning, ThumbsUp, ThumbsDown, CaretRight, CaretDoubleRight } from 'phosphor-react-native';
import { useRouter, useFocusEffect, useLocalSearchParams } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';
import { createSession, getVehicleActiveSession, stopSession, rateSession, getSession } from '../../services/session.service';
import { useVehicleStore } from '../../store/vehicleStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 220;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const DEFAULT_DRIVER_ID = process.env.EXPO_PUBLIC_DEFAULT_DRIVER_ID ?? '4';
const POLL_INTERVAL = Number(process.env.EXPO_PUBLIC_SESSION_POLL_INTERVAL ?? 30000); // Default to 30 seconds

export default function SessionScreen() {
    const { theme } = useThemeStore();
    const { currentVehicleId } = useVehicleStore();
    const isDark = theme === 'dark';
    const router = useRouter();
    const { sessionId: initialSessionId, bookingId, connectorId: paramConnectorId, vehicleId: paramVehicleId, batteryLevel: paramBatteryLevel } = useLocalSearchParams<{
        sessionId?: string;
        bookingId?: string;
        connectorId?: string;
        vehicleId?: string;
        batteryLevel?: string;
    }>();

    const [sessionId, setSessionId] = useState<string | undefined>(initialSessionId);
    const { myVehicle } = useVehicleStore();
    const paramsString = JSON.stringify({ initialSessionId, bookingId, paramConnectorId, paramVehicleId, paramBatteryLevel });

    const parsedBattery = paramBatteryLevel != null ? Number(paramBatteryLevel) : NaN;
    // VERY IMPORTANT: Initialize dynamically. myVehicle is available here
    const [chargePercent, setChargePercent] = useState(() => {
        if (Number.isFinite(parsedBattery)) return Math.min(100, Math.max(0, parsedBattery));
        if (myVehicle?.batteryLevel != null) return myVehicle.batteryLevel;
        return 72; // match B2C logic explicitly
    });
    
    // Store the initial reading so ETA calculations remain relative
    const [initialBattery, setInitialBattery] = useState(chargePercent);

    const [isCharging, setIsCharging] = useState(false);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [stationRating, setStationRating] = useState(0);
    const [appRating, setAppRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    // Frontend-only charging simulation state (must not use backend values)
    const [elapsed, setElapsed] = useState(0);
    const [initialEstimatedTime, setInitialEstimatedTime] = useState<number | null>(null);
    const [simKwh, setSimKwh] = useState(0);
    const [simCost, setSimCost] = useState(0);
    const [actionLoading, setActionLoading] = useState(false);
    const [sessionData, setSessionData] = useState<any>(null);
    const [sessionLoading, setSessionLoading] = useState(true);
    const simIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);

    const PRICE_PER_KWH = 12;

    const progress = useSharedValue(chargePercent / 100);
    const sliderPos = useSharedValue(0);
    const SLIDER_WIDTH = 320;
    const SLIDER_BTN_SIZE = 56;
    const pulseOpacity = useSharedValue(1);

    // Completely clear feedback screen state whenever the route parameters fundamentally change
    // This solves the persistent feedback screen bug. We do not do this across re-renders for the *same* session.
    useEffect(() => {
        setSessionId(initialSessionId); // Keep ID in sync with the param
        setSessionEnded(false);
        setRatingSubmitted(false);
        setIsCharging(false);
        setElapsed(0);
        setSimKwh(0);
        setSimCost(0);
        setStationRating(0);
        setAppRating(0);
        setSessionData(null);
        sliderPos.value = 0;
    }, [paramsString]);

    // Track vehicle battery updates and sync to local state IF we were waiting for it and are not currently overriding
    // it by having an active (charging) session tracking real percentage.
    useEffect(() => {
        if (myVehicle?.batteryLevel != null && !isCharging && (chargePercent === 72 || chargePercent === 20)) {
            setChargePercent(myVehicle.batteryLevel);
            setInitialBattery(myVehicle.batteryLevel);
            progress.value = myVehicle.batteryLevel / 100;
        }
    }, [myVehicle?.batteryLevel]);

    // Fetch session on mount — auto-start if already live
    useEffect(() => {
        if (!sessionId) { setSessionLoading(false); return; }
        (async () => {
            try {
                const data = await getSession(sessionId);
                setSessionData(data);
                if (data?.current_soc) {
                    setChargePercent(data.current_soc);
                    progress.value = data.current_soc / 100;
                }
                if (data?.is_live) {
                    setIsCharging(true);
                }
            } catch (err: any) {
                console.error('[Driver] getSession API failed.', {
                    endpoint: `GET /sessions/${sessionId}`,
                    error: err?.response?.data || err?.message,
                });
            } finally {
                setSessionLoading(false);
            }
        })();
    }, [sessionId]);

    // Pulse ring animation
    useEffect(() => {
        pulseOpacity.value = withRepeat(
            withSequence(withTiming(0.4, { duration: 900 }), withTiming(1, { duration: 900 })),
            -1,
            true
        );
    }, []);

    useEffect(() => {
        if (isCharging && initialEstimatedTime === null) {
            setInitialEstimatedTime(Math.max(0, 100 - chargePercent) * 2);
        }
    }, [isCharging]);

    // Realistic charging simulation (frontend only, 1-second ticks, tapering rate)
    useEffect(() => {
        if (!isCharging) {
            if (simIntervalRef.current) {
                clearInterval(simIntervalRef.current);
                simIntervalRef.current = null;
            }
            return;
        }

        if (simIntervalRef.current) return; // prevent duplicate timers

        simIntervalRef.current = setInterval(() => {
            setElapsed((prevElapsed) => {
                const nextElapsed = prevElapsed + 1;

                let delta = 0.02;
                if (prevElapsed < 120) delta = 0.05;
                else if (prevElapsed < 300) delta = 0.035;

                // Battery % simulation (keep prior behavior: +1% every 2 seconds)
                // This drives the ring + color thresholds.
                if (nextElapsed % 2 === 0) {
                    setChargePercent((prevPct) => {
                        const nextPct = Math.min(prevPct + 1, 100);
                        progress.value = withTiming(nextPct / 100, { duration: 1000 });
                        if (nextPct === 100) {
                            setIsCharging(false);
                            setSessionEnded(true);
                        }
                        return nextPct;
                    });
                }

                setSimKwh((prevKwh) => {
                    const nextKwh = Math.round((prevKwh + delta) * 100) / 100;
                    setSimCost(Math.round(nextKwh * PRICE_PER_KWH * 100) / 100);
                    return nextKwh;
                });

                return nextElapsed;
            });
        }, 1000);

        return () => {
            if (simIntervalRef.current) {
                clearInterval(simIntervalRef.current);
                simIntervalRef.current = null;
            }
        };
    }, [isCharging]);

    const sliderBtnStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: sliderPos.value }],
    }));

    const sliderTrackStyle = useAnimatedStyle(() => ({
        width: sliderPos.value + SLIDER_BTN_SIZE,
    }));

    const handleSlideEnd = async (e: any) => {
        if (e.nativeEvent.translationX > 180) {
            sliderPos.value = withTiming(320 - 56 - 16);
            setActionLoading(true);
            try {
                let activeSessionId = sessionId;
                if (!activeSessionId && bookingId && paramConnectorId) {
                    try {
                        const vId = paramVehicleId ? parseInt(paramVehicleId, 10) : (currentVehicleId ? parseInt(String(currentVehicleId), 10) : (myVehicle?.id ? parseInt(String(myVehicle.id), 10) : 0));
                        const created = await createSession({
                            connector_id: paramConnectorId,
                            vehicle_id: vId,
                            user_id: parseInt(DEFAULT_DRIVER_ID, 10),
                            booking_id: bookingId,
                            session_type: 'charging',
                        });
                        activeSessionId = String(created.id);
                        setSessionId(activeSessionId);
                        setSessionData(created);
                    } catch (createErr: any) {
                        console.error('[Driver] createSession API failed. Starting local charging simulation.', {
                            endpoint: 'POST /sessions',
                            payload: { connector_id: paramConnectorId, booking_id: bookingId },
                            error: createErr?.response?.data || createErr?.message,
                        });
                    }
                }
                setIsCharging(true);
            } catch (err) {
                console.error('[Driver] Unexpected session error:', err);
                setIsCharging(true);
            } finally {
                setActionLoading(false);
            }
        } else {
            sliderPos.value = withTiming(0);
        }
    };

    const strokeColor = chargePercent <= 20 ? COLORS.alertRed : chargePercent <= 40 ? COLORS.warningOrange : COLORS.successGreen;

    const animProps = useAnimatedProps(() => {
        return {
            strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
        };
    });

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    // Display-only fields (must not use backend for kWh/cost/elapsed)
    const stationName = sessionData?.station_name || 'Charging Station';
    const connectorId = sessionData?.connector_id || '';
    const connectorType = sessionData?.connector_type || '';
    const kwhDelivered = simKwh;
    const estimatedCost = simCost;
    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const elapsedMinutes = elapsed / 60;
    const timeRemainingMin = initialEstimatedTime !== null
        ? Math.max(0, Math.round((initialEstimatedTime - elapsedMinutes) * 10) / 10)
        : Math.max(0, 100 - chargePercent) * 2;

    const handleStop = async () => {
        if (actionLoading) return;
        setActionLoading(true);
        try {
            if (sessionId) {
                // MUST call backend stop API, but do not use response metrics for UI.
                await stopSession(sessionId);
            }
        } catch (err: any) {
            console.error('[Driver] stopSession API failed. Stopping locally.', {
                endpoint: `PATCH /sessions/${sessionId}/stop`,
                error: err?.response?.data || err?.message,
            });
        } finally {
            setActionLoading(false);
        }
        setIsCharging(false);
        setTimeout(() => setSessionEnded(true), 100);
    };

    const handleRatingSubmit = async () => {
        try {
            if (chargePercent > 0 && (stationRating > 0 || appRating > 0)) {
                // Feedback simulation
            }
            setRatingSubmitted(true);
            setTimeout(() => {
                router.replace('/driver/dashboard');
                // Defer wiping the state so the screen animates out cleanly
                setTimeout(() => {
                    setSessionEnded(false);
                    setRatingSubmitted(false);
                    setSessionId(undefined);
                    setSessionData(null);
                }, 500);
            }, 1000);
        } catch (error) {
            console.error('Error submitting rating:', error);
            Alert.alert('Error', 'Failed to submit feedback. Taking you to dashboard.');
            router.replace('/driver/dashboard');
        }
    };


    if (sessionLoading) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.brandBlue} />
            </SafeAreaView>
        );
    }

    if (sessionEnded && !ratingSubmitted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
                <ScrollView contentContainerStyle={styles.ratingCenter}>
                    <View style={styles.ratingCard}>
                        <GlassCard style={styles.ratingInner as any} intensity={30}>
                            <Lightning weight="duotone" size={48} color={COLORS.successGreen} />
                            <Text style={[styles.ratingTitle, { color: textPrimary }]}>Session Complete</Text>
                            <Text style={[styles.ratingCost, { color: COLORS.brandBlue }]}>₹{estimatedCost} charged</Text>
                            <Text style={[styles.ratingKwh, { color: textSecondary }]}>{typeof kwhDelivered === 'number' ? kwhDelivered.toFixed(2) : kwhDelivered} kWh delivered</Text>

                            <Text style={[styles.ratingPrompt, { color: textSecondary }]}>Rate your charging experience</Text>

                            <View style={styles.ratingSection}>
                                <View style={styles.ratingRowCategory}>
                                    <Text style={[styles.categoryLabel, { color: textSecondary }]}>Station</Text>
                                    <View style={styles.thumbsRow}>
                                        <TouchableOpacity onPress={() => setStationRating(1)} style={[styles.thumbBtn, stationRating === 1 && { borderColor: COLORS.alertRed, backgroundColor: COLORS.alertRed + '15' }]}>
                                            <ThumbsDown weight="duotone" size={24} color={stationRating === 1 ? COLORS.alertRed : textSecondary} fill={stationRating === 1 ? COLORS.alertRed : 'transparent'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setStationRating(5)} style={[styles.thumbBtn, stationRating === 5 && { borderColor: COLORS.successGreen, backgroundColor: COLORS.successGreen + '15' }]}>
                                            <ThumbsUp weight="duotone" size={24} color={stationRating === 5 ? COLORS.successGreen : textSecondary} fill={stationRating === 5 ? COLORS.successGreen : 'transparent'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>

                                <View style={styles.ratingRowCategory}>
                                    <Text style={[styles.categoryLabel, { color: textSecondary }]}>App</Text>
                                    <View style={styles.thumbsRow}>
                                        <TouchableOpacity onPress={() => setAppRating(1)} style={[styles.thumbBtn, appRating === 1 && { borderColor: COLORS.alertRed, backgroundColor: COLORS.alertRed + '15' }]}>
                                            <ThumbsDown weight="duotone" size={24} color={appRating === 1 ? COLORS.alertRed : textSecondary} fill={appRating === 1 ? COLORS.alertRed : 'transparent'} />
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => setAppRating(5)} style={[styles.thumbBtn, appRating === 5 && { borderColor: COLORS.successGreen, backgroundColor: COLORS.successGreen + '15' }]}>
                                            <ThumbsUp weight="duotone" size={24} color={appRating === 5 ? COLORS.successGreen : textSecondary} fill={appRating === 5 ? COLORS.successGreen : 'transparent'} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </View>

                            <TouchableOpacity
                                style={[styles.submitBtn, { backgroundColor: (stationRating > 0 && appRating > 0) ? COLORS.brandBlue : COLORS.cardBorder }]}
                                onPress={handleRatingSubmit}
                            >
                                <Text style={{ color: (stationRating > 0 && appRating > 0) ? '#000' : COLORS.textMutedDark, fontWeight: '700' }}>
                                    {(stationRating > 0 && appRating > 0) ? 'Submit Feedback' : 'Skip'}
                                </Text>
                            </TouchableOpacity>
                        </GlassCard>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (ratingSubmitted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={[styles.ratingTitle, { color: textPrimary }]}>Thanks for your feedback! 🎉</Text>
            </SafeAreaView>
        );
    }

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
                <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                    {/* Station Info */}
                    <View style={styles.sessionHeader}>
                        <Text style={[styles.stationName, { color: textPrimary }]}>{stationName}</Text>
                        <View style={[styles.livePill, { backgroundColor: 'rgba(0,255,136,0.15)' }]}>
                            <View style={styles.liveDot} />
                            <Text style={styles.liveText}>LIVE</Text>
                        </View>
                    </View>
                    <Text style={[styles.chargerId, { color: textSecondary }]}>
                        Charger: {connectorId ? connectorId.slice(0, 8) : 'N/A'} · {connectorType}
                    </Text>

                    {/* Progress Arc */}
                    <View style={styles.arcContainer}>
                        <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                            <Circle
                                cx={SIZE / 2}
                                cy={SIZE / 2}
                                r={RADIUS}
                                stroke={isDark ? COLORS.darkTertiary : '#e0e0e0'}
                                strokeWidth={STROKE}
                                fill="transparent"
                            />
                            <AnimatedCircle
                                cx={SIZE / 2}
                                cy={SIZE / 2}
                                r={RADIUS}
                                stroke={strokeColor}
                                strokeWidth={STROKE}
                                fill="transparent"
                                strokeDasharray={CIRCUMFERENCE}
                                animatedProps={animProps}
                                strokeLinecap="round"
                                rotation="-90"
                                origin={`${SIZE / 2}, ${SIZE / 2}`}
                            />
                        </Svg>
                        <View style={styles.arcCenter}>
                            <Text style={[styles.chargePercent, { color: textPrimary }]}>{chargePercent}%</Text>
                            <Text style={[styles.chargeLabel, { color: textSecondary }]}>Charged</Text>
                        </View>
                    </View>

                    {/* Stats Row */}
                    <View style={styles.statsRow}>
                        <GlassCard style={styles.statCard as any} intensity={20}>
                            <Text style={[styles.statValue, { color: textPrimary }]}>{kwhDelivered.toFixed(2)}</Text>
                            <Text style={[styles.statLabel, { color: textSecondary }]}>kWh</Text>
                        </GlassCard>
                        <GlassCard style={styles.statCard as any} intensity={20}>
                            <Text style={[styles.statValue, { color: textPrimary }]}>₹{estimatedCost}</Text>
                            <Text style={[styles.statLabel, { color: textSecondary }]}>Cost</Text>
                        </GlassCard>
                        <GlassCard style={styles.statCard as any} intensity={20}>
                            <Text style={[styles.statValue, { color: textPrimary }]}>{formatTime(elapsed)}</Text>
                            <Text style={[styles.statLabel, { color: textSecondary }]}>Elapsed</Text>
                        </GlassCard>
                    </View>

                    {/* ETA */}
                    <GlassCard style={styles.etaCard as any} intensity={25}>
                        <Lightning weight="duotone" size={18} color={COLORS.brandBlue} />
                        <Text style={[styles.etaText, { color: textPrimary }]}>
                            Est. {timeRemainingMin} min remaining to full charge
                        </Text>
                    </GlassCard>

                    {/* Charging Control */}
                    {!isCharging && !sessionEnded ? (
                        <View style={styles.sliderWrapper}>
                            <View style={[styles.sliderContainer, { backgroundColor: COLORS.brandBlue }]}>
                                <Animated.View style={[styles.sliderFill, sliderTrackStyle]} />
                                <View style={styles.sliderLabelContainer}>
                                    <Text style={styles.sliderText} numberOfLines={1}>Swipe to start charging</Text>
                                    <CaretDoubleRight weight="duotone" size={24} color={COLORS.textMutedDark} />
                                </View>
                                <PanGestureHandler
                                    activeOffsetX={[-10, 10]}
                                    onGestureEvent={(e) => {
                                        sliderPos.value = Math.max(0, Math.min(320 - 56 - 16, e.nativeEvent.translationX));
                                    }}
                                    onEnded={handleSlideEnd}
                                >
                                    <Animated.View style={[styles.sliderBtn, sliderBtnStyle]}>
                                        <View style={styles.sliderBtnInner}>
                                            <CaretRight weight="duotone" size={32} color={COLORS.brandBlue} />
                                        </View>
                                    </Animated.View>
                                </PanGestureHandler>
                            </View>
                            <View style={styles.sliderHint}>
                                <Text style={[styles.hintText, { color: textSecondary }]}>Est: {timeRemainingMin} mins remaining</Text>
                            </View>
                        </View>
                    ) : !sessionEnded ? (
                        <GHTouchableOpacity
                            style={styles.stopBtn}
                            onPress={handleStop}
                            activeOpacity={0.6}
                        >
                            <View style={styles.stopBtnContent}>
                                <View style={styles.stopIconCircle}>
                                    <View style={styles.stopSquare} />
                                </View>
                                {actionLoading ? (
                                    <ActivityIndicator color={COLORS.alertRed} />
                                ) : (
                                    <Text style={styles.stopText}>STOP CHARGING</Text>
                                )}
                            </View>
                        </GHTouchableOpacity>
                    ) : null}

                    {/* Report Issue */}
                    <TouchableOpacity style={styles.reportLink} onPress={() =>
                        Alert.alert('Report Sent', 'Charger issue reported to VoltLink support.')}>
                        <Warning weight="duotone" size={14} color={textSecondary} />
                        <Text style={[styles.reportText, { color: textSecondary }]}>Mark station as not working</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: SPACING.lg, paddingBottom: 130, alignItems: 'center' },
    sessionHeader: {
        flexDirection: 'row', alignItems: 'center',
        justifyContent: 'space-between', width: '100%', marginBottom: 4,
    },
    stationName: { ...TYPOGRAPHY.body, fontWeight: '700', flex: 1, marginRight: SPACING.sm },
    livePill: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 10, paddingVertical: 4,
        borderRadius: 12,
    },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.successGreen },
    liveText: { ...TYPOGRAPHY.label, color: COLORS.successGreen, fontWeight: '700', fontSize: 10, marginLeft: 6 },
    chargerId: { ...TYPOGRAPHY.label, alignSelf: 'flex-start', marginBottom: SPACING.xl },
    arcContainer: {
        width: SIZE, height: SIZE,
        justifyContent: 'center', alignItems: 'center',
        marginBottom: SPACING.xl,
    },
    arcCenter: { position: 'absolute', alignItems: 'center' },
    chargePercent: { ...TYPOGRAPHY.display, fontSize: 44 },
    chargeLabel: { ...TYPOGRAPHY.label },
    statsRow: { flexDirection: 'row', marginBottom: SPACING.md, marginHorizontal: -4, alignItems: 'stretch' },
    statCard: { flex: 1, padding: 12, alignItems: 'center', borderRadius: BORDER_RADIUS.md, marginHorizontal: 4, minWidth: 0 },
    statValue: { ...TYPOGRAPHY.display, fontSize: 16 },
    statLabel: { ...TYPOGRAPHY.label, marginTop: 2, textAlign: 'center' },
    etaCard: {
        flexDirection: 'row', alignItems: 'center',
        padding: SPACING.md, borderRadius: BORDER_RADIUS.md,
        width: '100%', marginBottom: SPACING.sm,
    },
    etaText: { ...TYPOGRAPHY.body, flex: 1, marginLeft: SPACING.sm },
    stopBtn: {
        width: '100%', height: 68, borderRadius: BORDER_RADIUS.xl,
        borderWidth: 1.5, borderColor: COLORS.alertRed + '30',
        backgroundColor: COLORS.alertRed + '08',
        justifyContent: 'center', alignItems: 'center',
        marginVertical: SPACING.lg, padding: 6,
    },
    stopBtnContent: {
        flexDirection: 'row', alignItems: 'center',
        paddingHorizontal: 20, width: '100%'
    },
    stopIconCircle: { width: 40, height: 40, borderRadius: 20, backgroundColor: COLORS.alertRed, justifyContent: 'center', alignItems: 'center' },
    stopSquare: { width: 14, height: 14, backgroundColor: '#fff', borderRadius: 3 },
    stopText: { ...TYPOGRAPHY.body, color: COLORS.alertRed, fontWeight: '700', fontSize: 18, letterSpacing: 0.5, marginLeft: 14 },

    reportLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: SPACING.sm },
    reportText: { ...TYPOGRAPHY.label, marginLeft: 6 },
    ratingCenter: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: SPACING.lg, paddingBottom: 100 },
    ratingCard: { width: '100%' },
    ratingInner: { padding: SPACING.xl, borderRadius: BORDER_RADIUS.xl, alignItems: 'center' },
    ratingTitle: { ...TYPOGRAPHY.sectionHeader, fontSize: 22, marginTop: SPACING.md },
    ratingCost: { ...TYPOGRAPHY.display, fontSize: 32, marginTop: SPACING.sm },
    ratingKwh: { ...TYPOGRAPHY.body, marginTop: SPACING.xs },
    ratingPrompt: { ...TYPOGRAPHY.body, marginTop: SPACING.lg, marginBottom: SPACING.md },
    ratingSection: { width: '100%', marginBottom: SPACING.xl },
    ratingRowCategory: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: SPACING.md },
    categoryLabel: { ...TYPOGRAPHY.label, fontWeight: '600', fontSize: 13 },
    thumbsRow: { flexDirection: 'row' },
    thumbBtn: { width: 48, height: 48, borderRadius: 24, borderWidth: 1, borderColor: COLORS.cardBorder, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.inputBg, marginLeft: SPACING.lg },
    submitBtn: { width: '100%', height: 50, borderRadius: BORDER_RADIUS.xl, justifyContent: 'center', alignItems: 'center' },

    sliderWrapper: { width: '100%', marginTop: SPACING.sm, marginBottom: SPACING.lg, alignItems: 'center' },
    sliderContainer: { width: '100%', height: 72, borderRadius: 36, justifyContent: 'center', padding: 8, overflow: 'hidden' },
    sliderFill: { position: 'absolute', left: 0, top: 0, bottom: 0, backgroundColor: COLORS.hoverBg },
    sliderLabelContainer: { position: 'absolute', width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingLeft: 70 },
    sliderBtn: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center', zIndex: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 3 },
    sliderBtnInner: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
    sliderText: { ...TYPOGRAPHY.body, color: '#fff', fontWeight: '600', fontSize: 16 },
    sliderHint: { marginTop: 12 },
    hintText: { ...TYPOGRAPHY.label, fontSize: 12, opacity: 0.7, fontWeight: '600' },
});
