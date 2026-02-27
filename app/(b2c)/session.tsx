import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Switch
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Svg, { Circle } from 'react-native-svg';
import Animated, {
    useSharedValue, withTiming, useAnimatedProps, withRepeat, withSequence
} from 'react-native-reanimated';
import { Zap, AlertTriangle, Star } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 220;
const STROKE = 16;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const V2G_RATE = 6.5; // ₹ per kWh

export default function B2CSession() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const router = useRouter();

    const [chargePercent, setChargePercent] = useState(22);
    const [kwhDelivered, setKwhDelivered] = useState(0);
    const [elapsed, setElapsed] = useState(0);
    const [sessionEnded, setSessionEnded] = useState(false);
    const [rating, setRating] = useState(0);
    const [ratingSubmitted, setRatingSubmitted] = useState(false);
    const [v2gEnabled, setV2gEnabled] = useState(false);
    const [v2gCredits, setV2gCredits] = useState(0);

    const progress = useSharedValue(0.22);

    useEffect(() => {
        if (sessionEnded) return;
        const timer = setInterval(() => {
            setChargePercent(p => {
                const next = Math.min(p + 1, 100);
                progress.value = withTiming(next / 100, { duration: 2800 });
                return next;
            });
            setKwhDelivered(k => parseFloat((k + 0.45).toFixed(2)));
            setElapsed(e => e + 3);
            if (v2gEnabled) {
                setV2gCredits(c => parseFloat((c + 0.15).toFixed(2)));
            }
        }, 3000);
        return () => clearInterval(timer);
    }, [sessionEnded, v2gEnabled]);

    const animProps = useAnimatedProps(() => ({
        strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
        stroke: progress.value < 0.25 ? COLORS.alertRed
            : progress.value < 0.55 ? COLORS.warningOrange
                : COLORS.successGreen,
    }));

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    const formatTime = (secs: number) => `${Math.floor(secs / 60)}m ${secs % 60 < 10 ? '0' : ''}${secs % 60}s`;
    const estimatedCost = (kwhDelivered * 10).toFixed(0);
    const timeRemainingMin = Math.max(0, Math.round((100 - chargePercent) * 2.8));
    const v2gPotential = ((100 - chargePercent) * 0.45 * V2G_RATE).toFixed(0);

    const handleStop = () => {
        Alert.alert('Stop Charging?', 'End this session now?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Stop', style: 'destructive', onPress: () => setSessionEnded(true) },
        ]);
    };

    if (sessionEnded && !ratingSubmitted) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
                <ScrollView contentContainerStyle={styles.ratingCenter}>
                    <GlassCard style={styles.ratingCard as any} intensity={30}>
                        <Zap size={48} color={COLORS.successGreen} />
                        <Text style={[styles.ratingTitle, { color: textPrimary }]}>Session Complete!</Text>
                        <Text style={[styles.ratingCost, { color: COLORS.brandBlue }]}>₹{estimatedCost} charged</Text>
                        <Text style={[styles.ratingKwh, { color: textSecondary }]}>{kwhDelivered} kWh delivered</Text>
                        {v2gEnabled && (
                            <Text style={styles.v2gEarned}>+{v2gCredits} credits via V2G</Text>
                        )}
                        <Text style={[styles.ratingPrompt, { color: textSecondary }]}>Rate your experience</Text>
                        <View style={styles.starsRow}>
                            {[1, 2, 3, 4, 5].map(n => (
                                <TouchableOpacity key={n} onPress={() => setRating(n)}>
                                    <Star size={36} color={n <= rating ? COLORS.warningOrange : isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.15)'}
                                        fill={n <= rating ? COLORS.warningOrange : 'transparent'} />
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={[styles.submitBtn, { backgroundColor: COLORS.brandBlue }]}
                            onPress={() => { setRatingSubmitted(true); setTimeout(() => router.replace('/(b2c)/dashboard'), 1500); }}
                        >
                            <Text style={{ color: '#000', fontWeight: '700' }}>
                                {rating > 0 ? 'Submit Rating' : 'Done'}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.reportLink}
                            onPress={() => Alert.alert('Reported', 'Station issue reported. Thank you.')}>
                            <AlertTriangle size={14} color={textSecondary} />
                            <Text style={[styles.reportText, { color: textSecondary }]}>Mark station as not working</Text>
                        </TouchableOpacity>
                    </GlassCard>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Header */}
                <View style={styles.sessionHeader}>
                    <Text style={[styles.stationName, { color: textPrimary }]}>DLF Cyber Hub Charging</Text>
                    <View style={styles.livePill}>
                        <View style={styles.liveDot} />
                        <Text style={styles.liveText}>LIVE</Text>
                    </View>
                </View>
                <Text style={[styles.chargerId, { color: textSecondary }]}>Charger ID: VL-CYH-03 · CCS2 DC Fast</Text>

                {/* Arc */}
                <View style={styles.arcContainer}>
                    <Svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
                        <Circle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                            stroke={isDark ? COLORS.darkTertiary : '#e0e0e0'}
                            strokeWidth={STROKE} fill="transparent" />
                        <AnimatedCircle cx={SIZE / 2} cy={SIZE / 2} r={RADIUS}
                            strokeWidth={STROKE} fill="transparent"
                            strokeDasharray={CIRCUMFERENCE}
                            animatedProps={animProps}
                            strokeLinecap="round"
                            rotation="-90" origin={`${SIZE / 2}, ${SIZE / 2}`} />
                    </Svg>
                    <View style={styles.arcCenter}>
                        <Text style={[styles.chargePercent, { color: textPrimary }]}>{chargePercent}%</Text>
                        <Text style={[styles.chargeLabel, { color: textSecondary }]}>Charged</Text>
                    </View>
                </View>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    {[
                        { label: 'kWh', value: `${kwhDelivered}` },
                        { label: 'Cost', value: `₹${estimatedCost}` },
                        { label: 'Elapsed', value: formatTime(elapsed) },
                    ].map(s => (
                        <GlassCard key={s.label} style={styles.statCard as any} intensity={20}>
                            <Text style={[styles.statValue, { color: textPrimary }]}>{s.value}</Text>
                            <Text style={[styles.statLabel, { color: textSecondary }]}>{s.label}</Text>
                        </GlassCard>
                    ))}
                </View>

                {/* ETA */}
                <GlassCard style={styles.etaCard as any} intensity={25}>
                    <Zap size={18} color={COLORS.brandBlue} />
                    <Text style={[styles.etaText, { color: textPrimary }]}>
                        ~{timeRemainingMin} min to full charge
                    </Text>
                </GlassCard>

                {/* V2G Toggle */}
                <GlassCard style={styles.v2gCard as any} intensity={25}>
                    <View style={styles.v2gHeader}>
                        <View style={styles.v2gInfo}>
                            <Text style={[styles.v2gTitle, { color: textPrimary }]}>Sell power back to grid</Text>
                            <Text style={[styles.v2gSub, { color: textSecondary }]}>
                                Current V2G rate: ₹{V2G_RATE}/kWh
                                {v2gEnabled ? `  •  +${v2gCredits} credits earned` : ''}
                            </Text>
                        </View>
                        <Switch
                            value={v2gEnabled}
                            onValueChange={setV2gEnabled}
                            trackColor={{ false: COLORS.darkTertiary, true: COLORS.successGreen }}
                            thumbColor="#FFF"
                        />
                    </View>
                    {!v2gEnabled && (
                        <Text style={[styles.v2gPotential, { color: textSecondary }]}>
                            🌱 Enable to earn ~₹{v2gPotential} more this session
                        </Text>
                    )}
                </GlassCard>

                {/* Stop */}
                <TouchableOpacity style={styles.stopBtn} onPress={handleStop}>
                    <Text style={styles.stopText}>Stop Charging</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.reportLink}
                    onPress={() => Alert.alert('Reported', 'Charger issue sent to VoltLink support.')}>
                    <AlertTriangle size={14} color={textSecondary} />
                    <Text style={[styles.reportText, { color: textSecondary }]}>Mark station as not working</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: SPACING.lg, paddingBottom: 130, alignItems: 'center' },
    sessionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: 4 },
    stationName: { ...TYPOGRAPHY.body, fontWeight: '700', flex: 1, marginRight: SPACING.sm },
    livePill: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(0,255,136,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, gap: 6 },
    liveDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.successGreen },
    liveText: { ...TYPOGRAPHY.label, color: COLORS.successGreen, fontWeight: '800', fontSize: 10 },
    chargerId: { ...TYPOGRAPHY.label, alignSelf: 'flex-start', marginBottom: SPACING.xl },
    arcContainer: { width: SIZE, height: SIZE, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.xl },
    arcCenter: { position: 'absolute', alignItems: 'center' },
    chargePercent: { ...TYPOGRAPHY.hero, fontSize: 44, fontWeight: '800' },
    chargeLabel: { ...TYPOGRAPHY.label },
    statsRow: { flexDirection: 'row', width: '100%', gap: SPACING.sm, marginBottom: SPACING.md },
    statCard: { flex: 1, padding: SPACING.md, alignItems: 'center', borderRadius: BORDER_RADIUS.md },
    statValue: { ...TYPOGRAPHY.sectionHeader, fontSize: 15, fontWeight: '700' },
    statLabel: { ...TYPOGRAPHY.label, marginTop: 2, textAlign: 'center' },
    etaCard: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm, padding: SPACING.md, borderRadius: BORDER_RADIUS.md, width: '100%', marginBottom: SPACING.md },
    etaText: { ...TYPOGRAPHY.body, flex: 1 },
    v2gCard: { padding: SPACING.md, borderRadius: BORDER_RADIUS.lg, width: '100%', marginBottom: SPACING.xl },
    v2gHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    v2gInfo: { flex: 1, marginRight: SPACING.sm },
    v2gTitle: { ...TYPOGRAPHY.body, fontWeight: '700' },
    v2gSub: { ...TYPOGRAPHY.label, marginTop: 2 },
    v2gPotential: { ...TYPOGRAPHY.label, marginTop: SPACING.sm },
    v2gEarned: { ...TYPOGRAPHY.body, color: COLORS.successGreen, fontWeight: '700', marginTop: 4 },
    stopBtn: { width: '100%', height: 52, borderRadius: BORDER_RADIUS.xl, borderWidth: 1.5, borderColor: COLORS.alertRed, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
    stopText: { ...TYPOGRAPHY.body, color: COLORS.alertRed, fontWeight: '700', fontSize: 16 },
    reportLink: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: SPACING.sm },
    reportText: { ...TYPOGRAPHY.label },
    ratingCenter: { padding: SPACING.lg, paddingTop: 60 },
    ratingCard: { padding: SPACING.xl, borderRadius: BORDER_RADIUS.xl, alignItems: 'center' },
    ratingTitle: { ...TYPOGRAPHY.sectionHeader, fontSize: 22, marginTop: SPACING.md },
    ratingCost: { ...TYPOGRAPHY.hero, fontSize: 32, fontWeight: '800', marginTop: SPACING.sm },
    ratingKwh: { ...TYPOGRAPHY.body, marginTop: SPACING.xs },
    ratingPrompt: { ...TYPOGRAPHY.body, marginTop: SPACING.xl, marginBottom: SPACING.md },
    starsRow: { flexDirection: 'row', gap: SPACING.sm, marginBottom: SPACING.xl },
    submitBtn: { width: '100%', height: 50, borderRadius: BORDER_RADIUS.xl, justifyContent: 'center', alignItems: 'center', marginBottom: SPACING.md },
});
