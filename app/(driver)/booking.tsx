import React, { useState, useEffect } from 'react';
import {
    StyleSheet, View, Text, TouchableOpacity, ScrollView, Alert,
    Modal, TextInput, Linking, KeyboardAvoidingView, Platform
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, MapPin, Zap, Clock, CheckCircle, Navigation } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
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
    lat: 28.4945,
    lng: 77.1855,
};

// First available slot is auto-selected
const DEFAULT_SLOT = TIME_SLOTS.find(s => s.available)!;

export default function DriverBooking() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const router = useRouter();
    const params = useLocalSearchParams<{ rank?: string }>();
    const isOption2 = params.rank === '2';

    // Slot is auto-selected — first available slot
    const selectedSlot = DEFAULT_SLOT.id;

    const [confirmed, setConfirmed] = useState(false);
    const [showReasonModal, setShowReasonModal] = useState(false);
    const [reason, setReason] = useState('');

    const scale = useSharedValue(1);
    const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const inputBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.04)';
    const borderClr = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.1)';

    const selectedPrice = DEFAULT_SLOT.price;
    const estimatedKwh = 28;
    const estimatedCost = estimatedKwh * selectedPrice;
    const creditsEarned = Math.round(estimatedCost * 0.1);

    const openGoogleMaps = () => {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${MOCK_STATION.lat},${MOCK_STATION.lng}&travelmode=driving`;
        Linking.canOpenURL(url).then(ok => {
            if (ok) Linking.openURL(url);
            else Linking.openURL(`https://maps.google.com/?q=${MOCK_STATION.lat},${MOCK_STATION.lng}`);
        });
    };

    const proceedToConfirm = () => {
        scale.value = withSpring(0.95, {}, () => { scale.value = withSpring(1); });
        setConfirmed(true);
    };

    const handleConfirm = () => {
        if (isOption2) {
            // Show reason modal first
            setShowReasonModal(true);
        } else {
            proceedToConfirm();
        }
    };

    const handleReasonSubmit = () => {
        if (!reason.trim()) {
            Alert.alert('Add Reason', 'Please enter a reason for booking this option.');
            return;
        }
        setShowReasonModal(false);
        proceedToConfirm();
    };

    // Booking Confirmed screen
    if (confirmed) {
        return (
            <SafeAreaView style={[styles.container, { backgroundColor: bg }]}>
                <ScrollView contentContainerStyle={styles.confirmedContent}>
                    <CheckCircle size={80} color={COLORS.successGreen} />
                    <Text style={[styles.confirmedTitle, { color: textPrimary }]}>Booking Confirmed!</Text>
                    <Text style={[styles.confirmedSub, { color: textSecondary }]}>
                        {MOCK_STATION.name}
                    </Text>
                    <Text style={[styles.confirmedSlot, { color: textSecondary }]}>
                        Slot: {DEFAULT_SLOT.time} · ₹{selectedPrice}/kWh
                    </Text>

                    {/* Navigate to station */}
                    <TouchableOpacity style={styles.mapsBtn} onPress={openGoogleMaps} activeOpacity={0.85}>
                        <Navigation size={20} color="#000" />
                        <Text style={styles.mapsBtnText}>Navigate in Google Maps</Text>
                    </TouchableOpacity>

                    {/* Start Charging */}
                    <TouchableOpacity
                        style={styles.startChargingBtn}
                        onPress={() => router.replace('/(driver)/session')}
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
            {/* Add Reason Modal for Option 2 */}
            <Modal visible={showReasonModal} transparent animationType="slide">
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.modalOverlay}
                >
                    <GlassCard style={styles.modalCard} intensity={60}>
                        <Text style={[styles.modalTitle, { color: textPrimary }]}>Add Reason</Text>
                        <Text style={[styles.modalSub, { color: textSecondary }]}>
                            Why are you choosing this option?
                        </Text>
                        <TextInput
                            style={[styles.reasonInput, { backgroundColor: inputBg, borderColor: borderClr, color: textPrimary }]}
                            placeholder="e.g. Closer to my route, cheaper rate…"
                            placeholderTextColor={textSecondary}
                            value={reason}
                            onChangeText={setReason}
                            multiline
                            numberOfLines={3}
                            autoFocus
                        />
                        <View style={styles.modalActions}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.modalBtnCancel, { borderColor: borderClr }]}
                                onPress={() => setShowReasonModal(false)}
                            >
                                <Text style={[styles.modalBtnText, { color: textSecondary }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalBtn, { backgroundColor: COLORS.brandBlue }]}
                                onPress={handleReasonSubmit}
                            >
                                <Text style={[styles.modalBtnText, { color: '#000' }]}>Confirm</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                </KeyboardAvoidingView>
            </Modal>

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

                {/* Selected Slot (auto-selected — shown as info, not picker) */}
                <View style={styles.selectedSlotRow}>
                    <Text style={[styles.sectionLabel, { color: textSecondary }]}>Selected Slot</Text>
                    <View style={styles.selectedSlotBadge}>
                        <Clock size={14} color={COLORS.brandBlue} />
                        <Text style={styles.selectedSlotTime}>{DEFAULT_SLOT.time}</Text>
                        <Text style={styles.selectedSlotPrice}>· ₹{DEFAULT_SLOT.price}/kWh</Text>
                    </View>
                </View>

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
                        <Text style={styles.creditsEarned}>+{creditsEarned} credits</Text>
                    </View>
                </GlassCard>

                {/* Confirm Button */}
                <Animated.View style={animStyle}>
                    <TouchableOpacity
                        style={[styles.confirmBtn, { backgroundColor: COLORS.brandBlue }]}
                        onPress={handleConfirm}
                        activeOpacity={0.85}
                    >
                        <Text style={[styles.confirmText, { color: '#000' }]}>
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
    sectionLabel: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.sm },
    selectedSlotRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: SPACING.lg,
    },
    selectedSlotBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(0,212,255,0.1)',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(0,212,255,0.3)',
    },
    selectedSlotTime: { ...TYPOGRAPHY.body, fontWeight: '700', color: COLORS.brandBlue, fontSize: 14 },
    selectedSlotPrice: { ...TYPOGRAPHY.label, color: COLORS.successGreen },
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
    // Reason Modal
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
        padding: SPACING.lg,
        paddingBottom: SPACING.xl,
    },
    modalCard: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
    },
    modalTitle: { ...TYPOGRAPHY.sectionHeader, fontSize: 20, fontWeight: '700', marginBottom: 6 },
    modalSub: { ...TYPOGRAPHY.body, marginBottom: SPACING.lg },
    reasonInput: {
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.md,
        ...TYPOGRAPHY.body,
        fontSize: 14,
        minHeight: 90,
        textAlignVertical: 'top',
        marginBottom: SPACING.lg,
    },
    modalActions: { flexDirection: 'row', gap: SPACING.md },
    modalBtn: {
        flex: 1, height: 50, borderRadius: BORDER_RADIUS.xl,
        justifyContent: 'center', alignItems: 'center',
    },
    modalBtnCancel: { borderWidth: 1 },
    modalBtnText: { ...TYPOGRAPHY.body, fontWeight: '700', fontSize: 15 },
});
