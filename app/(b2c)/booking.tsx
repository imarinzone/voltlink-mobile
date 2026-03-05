import React, { useState } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert, Linking
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Zap, Clock, Navigation, CheckCircle } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { useThemeStore } from '../../store/themeStore';

const TIME_SLOTS = [
    { id: 's1', time: '3:00 PM', available: true, price: 10 },
    { id: 's2', time: '3:30 PM', available: true, price: 10 },
    { id: 's3', time: '4:00 PM', available: false, price: 10 },
    { id: 's4', time: '4:30 PM', available: true, price: 8 },
    { id: 's5', time: '5:00 PM', available: true, price: 8 },
    { id: 's6', time: '5:30 PM', available: false, price: 12 },
    { id: 's7', time: '6:00 PM', available: true, price: 12 },
    { id: 's8', time: '6:30 PM', available: true, price: 12 },
];

const STATION = {
    name: 'DLF Cyber Hub Charging',
    cpo: 'VoltLink Premium',
    distanceKm: 1.2,
    etaMin: 5,
    chargerType: 'CCS2 DC Fast',
    lat: 28.4945,
    lng: 77.0887,
};

export default function B2CBooking() {
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

    const slotData = TIME_SLOTS.find(s => s.id === selectedSlot);
    const estimatedKwh = 24;
    const ratePerKwh = slotData?.price || 10;
    const estimatedCost = estimatedKwh * ratePerKwh;
    const creditsEarned = Math.round(estimatedCost * 0.1);

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${STATION.lat},${STATION.lng}&travelmode=driving`;
        Linking.canOpenURL(url).then(ok => {
            if (ok) Linking.openURL(url);
            else Linking.openURL(`https://maps.google.com/?q=${STATION.lat},${STATION.lng}`);
        });
    };

    const handleConfirm = () => {
        if (!selectedSlot) {
            Alert.alert('Select a Slot', 'Please pick a time slot first.');
            return;
        }
        scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
        setConfirmed(true);
    };

    // Booking Confirmed screen
    if (confirmed) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
                <ScrollView contentContainerStyle={styles.confirmedContent}>
                    <CheckCircle size={80} color={COLORS.successGreen} />
                    <Text style={[styles.confirmedTitle, { color: textPrimary }]}>Booking Confirmed!</Text>
                    <Text style={[styles.confirmedSub, { color: textSecondary }]}>
                        {STATION.name}
                    </Text>
                    <Text style={[styles.confirmedSlot, { color: textSecondary }]}>
                        Slot: {slotData?.time} · ₹{slotData?.price}/kWh
                    </Text>

                    {/* Navigate to station */}
                    <TouchableOpacity style={styles.mapsBtn} onPress={openGoogleMaps} activeOpacity={0.85}>
                        <Navigation size={20} color="#000" />
                        <Text style={styles.mapsBtnText}>Navigate in Google Maps</Text>
                    </TouchableOpacity>

                    {/* Start Charging */}
                    <TouchableOpacity
                        style={styles.startChargingBtn}
                        onPress={() => router.replace('/(b2c)/session')}
                        activeOpacity={0.85}
                    >
                        <Zap size={20} color="#000" />
                        <Text style={styles.startChargingText}>Start Charging</Text>
                    </TouchableOpacity>
                </ScrollView>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <ArrowLeft size={24} color={textPrimary} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: textPrimary }]}>Book Charging</Text>
                <View style={{ width: 40 }} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                {/* Station Hero */}
                <GlassCard style={styles.stationCard as any} intensity={30}>
                    <Text style={[styles.stationName, { color: textPrimary }]}>{STATION.name}</Text>
                    <Text style={[styles.cpoName, { color: COLORS.brandBlue }]}>{STATION.cpo}</Text>
                    <View style={styles.metaRow}>
                        <View style={styles.metaItem}><MapPin size={14} color={textSecondary} /><Text style={[styles.metaText, { color: textSecondary }]}>{STATION.distanceKm} km</Text></View>
                        <View style={styles.metaItem}><Clock size={14} color={textSecondary} /><Text style={[styles.metaText, { color: textSecondary }]}>{STATION.etaMin} min ETA</Text></View>
                        <View style={styles.metaItem}><Zap size={14} color={COLORS.successGreen} /><Text style={[styles.metaText, { color: textSecondary }]}>{STATION.chargerType}</Text></View>
                    </View>
                </GlassCard>

                {/* Cancellation Policy Note */}
                <View style={[styles.policyNote, { backgroundColor: 'rgba(249,115,22,0.1)', borderColor: 'rgba(249,115,22,0.3)' }]}>
                    <Text style={styles.policyText}>
                        ⚠️  Cancellation within 15 min of slot: ₹20 penalty. No-show: full session cost charged.
                    </Text>
                </View>

                {/* Slot Picker */}
                <Text style={[styles.sectionLabel, { color: textSecondary }]}>Select Time Slot</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.slotScroll}>
                    {TIME_SLOTS.map(slot => {
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
                                        backgroundColor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)',
                                        borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)',
                                    }
                                ]}
                                activeOpacity={slot.available ? 0.7 : 1}
                            >
                                <Text style={[styles.slotTime, { color: isSelected ? '#000' : slot.available ? textPrimary : textSecondary }]}>{slot.time}</Text>
                                <Text style={[styles.slotPrice, { color: isSelected ? '#000' : slot.available ? COLORS.successGreen : textSecondary }]}>
                                    {slot.available ? `₹${slot.price}/kWh` : 'Booked'}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                {/* Cost Estimate */}
                <Text style={[styles.sectionLabel, { color: textSecondary }]}>Cost Estimate</Text>
                <GlassCard style={styles.estimateCard as any} intensity={25}>
                    {[
                        { label: 'Est. kWh needed', value: `${estimatedKwh} kWh` },
                        { label: 'Rate', value: `₹${ratePerKwh}/kWh` },
                    ].map(row => (
                        <View key={row.label} style={styles.estimateRow}>
                            <Text style={[styles.estimateLabel, { color: textSecondary }]}>{row.label}</Text>
                            <Text style={[styles.estimateValue, { color: textPrimary }]}>{row.value}</Text>
                        </View>
                    ))}
                    <View style={[styles.estimateRow, styles.divider]}>
                        <Text style={[styles.estimateLabel, { color: textSecondary }]}>Estimated Total</Text>
                        <Text style={[styles.estimateTotal, { color: textPrimary }]}>₹{estimatedCost}</Text>
                    </View>
                    <View style={styles.estimateRow}>
                        <Text style={[styles.estimateLabel, { color: textSecondary }]}>Credits you'll earn</Text>
                        <Text style={styles.creditsText}>+{creditsEarned} credits</Text>
                    </View>
                </GlassCard>

                {/* Confirm Button */}
                <Animated.View style={animStyle}>
                    <TouchableOpacity
                        style={[styles.confirmBtn, { backgroundColor: selectedSlot ? COLORS.brandBlue : 'rgba(255,255,255,0.1)' }]}
                        onPress={handleConfirm}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.confirmText, { color: selectedSlot ? '#000' : COLORS.textMutedDark }]}>
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
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: SPACING.lg, paddingVertical: SPACING.md },
    backBtn: { padding: 4, width: 40 },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 20, flex: 1, textAlign: 'center' },
    content: { paddingHorizontal: SPACING.lg, paddingBottom: 120 },
    stationCard: { padding: SPACING.lg, borderRadius: BORDER_RADIUS.xl, marginBottom: SPACING.md },
    stationName: { ...TYPOGRAPHY.sectionHeader, fontSize: 18, marginBottom: 4 },
    cpoName: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.md },
    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.md },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaText: { ...TYPOGRAPHY.label },
    policyNote: { borderWidth: 1, borderRadius: BORDER_RADIUS.md, padding: SPACING.md, marginBottom: SPACING.lg },
    policyText: { ...TYPOGRAPHY.label, color: COLORS.warningOrange, lineHeight: 18 },
    sectionLabel: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.sm },
    slotScroll: { paddingBottom: SPACING.xl, gap: SPACING.sm, marginBottom: SPACING.xl },
    slotCard: { width: 90, paddingVertical: SPACING.md, borderRadius: BORDER_RADIUS.md, borderWidth: 1, alignItems: 'center' },
    slotUnavailable: { opacity: 0.35, borderColor: 'rgba(255,255,255,0.06)', backgroundColor: 'transparent' },
    slotTime: { ...TYPOGRAPHY.body, fontWeight: '700', fontSize: 13 },
    slotPrice: { ...TYPOGRAPHY.label, marginTop: 4 },
    estimateCard: { padding: SPACING.lg, borderRadius: BORDER_RADIUS.lg, marginBottom: SPACING.lg },
    estimateRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: SPACING.sm },
    divider: { borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: SPACING.sm, paddingTop: SPACING.md },
    estimateLabel: { ...TYPOGRAPHY.body },
    estimateValue: { ...TYPOGRAPHY.body, fontWeight: '600' },
    estimateTotal: { ...TYPOGRAPHY.hero, fontSize: 22, fontWeight: '700' },
    creditsText: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.successGreen },
    confirmBtn: {
        height: 56, marginTop: SPACING.md, marginBottom: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl, justifyContent: 'center', alignItems: 'center',
    },
    confirmText: { ...TYPOGRAPHY.body, fontSize: 16, fontWeight: '700' },
    // Confirmed screen
    confirmedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        paddingTop: 80,
    },
    confirmedTitle: { ...TYPOGRAPHY.hero, fontSize: 28, marginTop: SPACING.xl, textAlign: 'center' },
    confirmedSub: { ...TYPOGRAPHY.body, marginTop: SPACING.sm, textAlign: 'center', fontWeight: '600' },
    confirmedSlot: { ...TYPOGRAPHY.label, marginTop: 6, textAlign: 'center' },
    mapsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: COLORS.brandBlue,
        borderRadius: BORDER_RADIUS.xl,
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginTop: SPACING.xl * 1.5,
        width: '100%',
        justifyContent: 'center',
    },
    mapsBtnText: { ...TYPOGRAPHY.body, color: '#000', fontWeight: '700', fontSize: 15 },
    startChargingBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        backgroundColor: COLORS.successGreen,
        borderRadius: BORDER_RADIUS.xl,
        paddingVertical: 16,
        paddingHorizontal: 32,
        marginTop: SPACING.md,
        width: '100%',
        justifyContent: 'center',
    },
    startChargingText: { ...TYPOGRAPHY.body, color: '#000', fontWeight: '700', fontSize: 15 },
});
