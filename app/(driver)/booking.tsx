import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Zap, Clock, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';

const TIME_SLOTS = [
    { id: 's1', time: '2:30 PM', available: true, price: 15 },
    { id: 's2', time: '3:00 PM', available: true, price: 15 },
    { id: 's3', time: '3:30 PM', available: false, price: 15 },
    { id: 's4', time: '4:00 PM', available: true, price: 12 },
    { id: 's5', time: '4:30 PM', available: true, price: 12 },
    { id: 's6', time: '5:00 PM', available: true, price: 14 },
    { id: 's7', time: '5:30 PM', available: false, price: 14 },
    { id: 's8', time: '6:00 PM', available: true, price: 16 },
];

const MOCK_STATION = {
    name: 'VoltLink Superhub — Cyber City',
    cpo: 'VoltLink Premium',
    distanceKm: 2.4,
    etaMin: 8,
    pricePerKwh: 15,
    chargerType: 'CCS2 DC Fast',
};

export default function DriverBooking() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const router = useRouter();

    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [confirmed, setConfirmed] = useState(false);

    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    const estimatedKwh = 28;
    const selectedPrice = TIME_SLOTS.find(s => s.id === selectedSlot)?.price || MOCK_STATION.pricePerKwh;
    const estimatedCost = estimatedKwh * selectedPrice;
    const creditsEarned = Math.round(estimatedCost * 0.1);

    const handleConfirm = () => {
        if (!selectedSlot) {
            Alert.alert('Select a Slot', 'Please pick an available time slot first.');
            return;
        }
        scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
        setConfirmed(true);
        setTimeout(() => {
            router.replace('/(driver)/session');
        }, 1800);
    };

    if (confirmed) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg, justifyContent: 'center', alignItems: 'center' }]}>
                <CheckCircle size={80} color={COLORS.successGreen} />
                <Text style={[styles.confirmedTitle, { color: textPrimary }]}>Booking Confirmed!</Text>
                <Text style={[styles.confirmedSub, { color: textSecondary }]}>
                    Navigating to session…
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

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Station Hero */}
                <GlassCard style={styles.stationCard as any} intensity={30}>
                    <Text style={[styles.stationName, { color: textPrimary }]}>{MOCK_STATION.name}</Text>
                    <Text style={[styles.cpoName, { color: COLORS.brandBlue }]}>{MOCK_STATION.cpo}</Text>
                    <View style={styles.stationMeta}>
                        <View style={styles.metaItem}>
                            <MapPin size={14} color={textSecondary} />
                            <Text style={[styles.metaText, { color: textSecondary }]}>{MOCK_STATION.distanceKm} km away</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Clock size={14} color={textSecondary} />
                            <Text style={[styles.metaText, { color: textSecondary }]}>{MOCK_STATION.etaMin} min ETA</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Zap size={14} color={COLORS.successGreen} />
                            <Text style={[styles.metaText, { color: textSecondary }]}>{MOCK_STATION.chargerType}</Text>
                        </View>
                    </View>
                </GlassCard>

                {/* Slot Picker */}
                <Text style={[styles.sectionLabel, { color: textSecondary }]}>Select Time Slot</Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.slotScroll}
                >
                    {TIME_SLOTS.map((slot) => {
                        const isSelected = selectedSlot === slot.id;
                        return (
                            <TouchableOpacity
                                key={slot.id}
                                onPress={() => slot.available && setSelectedSlot(slot.id)}
                                style={[
                                    styles.slotCard,
                                    !slot.available && styles.slotUnavailable,
                                    isSelected && { backgroundColor: COLORS.brandBlue, borderColor: COLORS.brandBlue },
                                    !isSelected && slot.available && {
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                                    }
                                ]}
                                activeOpacity={slot.available ? 0.7 : 1}
                            >
                                <Text style={[
                                    styles.slotTime,
                                    { color: isSelected ? '#000' : slot.available ? textPrimary : textSecondary }
                                ]}>
                                    {slot.time}
                                </Text>
                                <Text style={[
                                    styles.slotPrice,
                                    { color: isSelected ? '#000' : slot.available ? COLORS.successGreen : textSecondary }
                                ]}>
                                    {slot.available ? `₹${slot.price}/kWh` : 'Booked'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Cost Estimate */}
                <Text style={[styles.sectionLabel, { color: textSecondary }]}>Cost Estimate</Text>
                <GlassCard style={styles.estimateCard as any} intensity={25}>
                    <View style={styles.estimateRow}>
                        <Text style={[styles.estimateLabel, { color: textSecondary }]}>Estimated kWh needed</Text>
                        <Text style={[styles.estimateValue, { color: textPrimary }]}>{estimatedKwh} kWh</Text>
                    </View>
                    <View style={styles.estimateRow}>
                        <Text style={[styles.estimateLabel, { color: textSecondary }]}>Rate</Text>
                        <Text style={[styles.estimateValue, { color: textPrimary }]}>₹{selectedPrice}/kWh</Text>
                    </View>
                    <View style={[styles.estimateRow, styles.estimateDivider]}>
                        <Text style={[styles.estimateLabel, { color: textSecondary }]}>Estimated cost</Text>
                        <Text style={[styles.estimateTotal, { color: textPrimary }]}>₹{estimatedCost}</Text>
                    </View>
                    <View style={styles.estimateRow}>
                        <Text style={[styles.estimateLabel, { color: textSecondary }]}>VoltCredits to earn</Text>
                        <Text style={[styles.creditsEarned]}>+{creditsEarned} credits</Text>
                    </View>
                </GlassCard>

                {/* Confirm Button — inside scroll so it's always reachable */}
                <Animated.View style={animStyle}>
                    <TouchableOpacity
                        style={[
                            styles.confirmBtn,
                            { backgroundColor: selectedSlot ? COLORS.brandBlue : 'rgba(255,255,255,0.1)' }
                        ]}
                        onPress={handleConfirm}
                        activeOpacity={0.85}
                    >
                        <Text style={[
                            styles.confirmText,
                            { color: selectedSlot ? '#000' : COLORS.textMutedDark }
                        ]}>
                            Confirm Booking
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
    },
    backBtn: { padding: 4, width: 40 },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 20, flex: 1, textAlign: 'center' },
    content: { paddingHorizontal: SPACING.lg, paddingBottom: 120 },
    stationCard: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: SPACING.xl,
    },
    stationName: { ...TYPOGRAPHY.sectionHeader, fontSize: 18, marginBottom: 4 },
    cpoName: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.md },
    stationMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { ...TYPOGRAPHY.label },
    sectionLabel: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.md, marginTop: SPACING.sm },
    slotScroll: { paddingBottom: SPACING.xl, gap: SPACING.sm },
    slotCard: {
        width: 90,
        paddingVertical: SPACING.md,
        paddingHorizontal: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        alignItems: 'center',
    },
    slotUnavailable: {
        opacity: 0.4,
        borderColor: 'rgba(255,255,255,0.08)',
        backgroundColor: 'transparent',
    },
    slotTime: { ...TYPOGRAPHY.body, fontWeight: '700', fontSize: 14 },
    slotPrice: { ...TYPOGRAPHY.label, marginTop: 4 },
    estimateCard: {
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
        marginBottom: SPACING.lg,
    },
    estimateRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: SPACING.sm,
    },
    estimateDivider: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
        marginTop: SPACING.sm,
        paddingTop: SPACING.md,
    },
    estimateLabel: { ...TYPOGRAPHY.body },
    estimateValue: { ...TYPOGRAPHY.body, fontWeight: '600' },
    estimateTotal: { ...TYPOGRAPHY.hero, fontSize: 22, fontWeight: '700' },
    creditsEarned: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.successGreen },
    confirmBtn: {
        height: 56, marginTop: SPACING.md, marginBottom: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
        justifyContent: 'center', alignItems: 'center',
    },
    confirmText: { ...TYPOGRAPHY.body, fontSize: 16, fontWeight: '700' },
    confirmedTitle: { ...TYPOGRAPHY.hero, fontSize: 28, marginTop: SPACING.xl, textAlign: 'center' },
    confirmedSub: { ...TYPOGRAPHY.body, marginTop: SPACING.sm, textAlign: 'center' },
});
