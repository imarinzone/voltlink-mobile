import React, { useState } from 'react';
import {
    StyleSheet, View, FlatList, Text, TouchableOpacity, Pressable
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Zap, Clock, MapPin, Star } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../../components/ui/GlassCard';
import { SectionHeader } from '../../components/ui/SectionHeader';
import { useThemeStore } from '../../store/themeStore';

const FILTERS = ['All', 'This Week', 'This Month'];

const MOCK_HISTORY = [
    {
        id: 'h1',
        date: '23 Feb 2026',
        station: 'VoltLink Superhub - Cyber City',
        cpo: 'VoltLink Premium',
        kWh: 28.4,
        cost: 426,
        durationMin: 52,
        creditsEarned: 42,
        rating: 5,
    },
    {
        id: 'h2',
        date: '22 Feb 2026',
        station: 'Tata Power EZ Charge - Sector 44',
        cpo: 'Tata Power',
        kWh: 15.2,
        cost: 334,
        durationMin: 31,
        creditsEarned: 33,
        rating: 4,
    },
    {
        id: 'h3',
        date: '20 Feb 2026',
        station: 'BESCOM Fast Charger - Indiranagar',
        cpo: 'BESCOM',
        kWh: 32.1,
        cost: 514,
        durationMin: 65,
        creditsEarned: 51,
        rating: 3,
    },
    {
        id: 'h4',
        date: '18 Feb 2026',
        station: 'Fortum Charge & Drive - Galleria',
        cpo: 'Fortum',
        kWh: 20.8,
        cost: 416,
        durationMin: 44,
        creditsEarned: 41,
        rating: 5,
    },
    {
        id: 'h5',
        date: '15 Feb 2026',
        station: 'Ather Grid - Koramangala',
        cpo: 'Ather Energy',
        kWh: 18.6,
        cost: 298,
        durationMin: 38,
        creditsEarned: 29,
        rating: 4,
    },
    {
        id: 'h6',
        date: '12 Feb 2026',
        station: 'ChargePoint - HSR Layout',
        cpo: 'ChargePoint',
        kWh: 24.3,
        cost: 388,
        durationMin: 48,
        creditsEarned: 38,
        rating: 4,
    },
];

export default function HistoryScreen() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const [activeFilter, setActiveFilter] = useState('All');
    const [expanded, setExpanded] = useState<string | null>(null);

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    const totalCost = MOCK_HISTORY.reduce((a, s) => a + s.cost, 0);
    const totalKwh = MOCK_HISTORY.reduce((a, s) => a + s.kWh, 0).toFixed(1);
    const totalCredits = MOCK_HISTORY.reduce((a, s) => a + s.creditsEarned, 0);

    const renderItem = ({ item }: { item: typeof MOCK_HISTORY[0] }) => {
        const isExpanded = expanded === item.id;
        return (
            <GlassCard style={styles.sessionCard as any} intensity={20}>
                <Pressable onPress={() => setExpanded(isExpanded ? null : item.id)}>
                    <View style={styles.sessionRow}>
                        <View style={[styles.iconBubble, { backgroundColor: 'rgba(0,212,255,0.1)' }]}>
                            <Zap size={18} color={COLORS.brandBlue} />
                        </View>
                        <View style={styles.sessionInfo}>
                            <Text style={[styles.stationName, { color: textPrimary }]} numberOfLines={1}>
                                {item.station}
                            </Text>
                            <Text style={[styles.sessionDate, { color: textSecondary }]}>{item.date}</Text>
                        </View>
                        <View style={styles.sessionRight}>
                            <Text style={[styles.sessionCost, { color: textPrimary }]}>₹{item.cost}</Text>
                            <Text style={[styles.sessionKwh, { color: COLORS.brandBlue }]}>{item.kWh} kWh</Text>
                        </View>
                    </View>

                    {isExpanded && (
                        <View style={styles.expandedDetail}>
                            <View style={styles.detailGrid}>
                                <View style={styles.detailItem}>
                                    <Clock size={14} color={textSecondary} />
                                    <Text style={[styles.detailLabel, { color: textSecondary }]}>Duration</Text>
                                    <Text style={[styles.detailValue, { color: textPrimary }]}>{item.durationMin} min</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <MapPin size={14} color={textSecondary} />
                                    <Text style={[styles.detailLabel, { color: textSecondary }]}>CPO</Text>
                                    <Text style={[styles.detailValue, { color: textPrimary }]}>{item.cpo}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Zap size={14} color={COLORS.successGreen} />
                                    <Text style={[styles.detailLabel, { color: textSecondary }]}>Credits</Text>
                                    <Text style={[styles.detailValue, { color: COLORS.successGreen }]}>+{item.creditsEarned}</Text>
                                </View>
                                <View style={styles.detailItem}>
                                    <Star size={14} color={COLORS.warningOrange} />
                                    <Text style={[styles.detailLabel, { color: textSecondary }]}>Your Rating</Text>
                                    <Text style={[styles.detailValue, { color: textPrimary }]}>{'★'.repeat(item.rating)}</Text>
                                </View>
                            </View>
                        </View>
                    )}
                </Pressable>
            </GlassCard>
        );
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: bg }]} edges={['top']}>
            <View style={styles.header}>
                <Text style={[styles.title, { color: textPrimary }]}>Charging History</Text>
            </View>

            {/* Summary Cards */}
            <View style={styles.summaryRow}>
                <GlassCard style={styles.summaryCard as any} intensity={20}>
                    <Text style={[styles.summaryValue, { color: textPrimary }]}>₹{totalCost}</Text>
                    <Text style={[styles.summaryLabel, { color: textSecondary }]}>Total Spent</Text>
                </GlassCard>
                <GlassCard style={styles.summaryCard as any} intensity={20}>
                    <Text style={[styles.summaryValue, { color: COLORS.brandBlue }]}>{totalKwh}</Text>
                    <Text style={[styles.summaryLabel, { color: textSecondary }]}>kWh Used</Text>
                </GlassCard>
                <GlassCard style={styles.summaryCard as any} intensity={20}>
                    <Text style={[styles.summaryValue, { color: COLORS.successGreen }]}>{totalCredits}</Text>
                    <Text style={[styles.summaryLabel, { color: textSecondary }]}>Credits Earned</Text>
                </GlassCard>
            </View>

            {/* Filter Pills */}
            <View style={styles.filterRow}>
                {FILTERS.map((f) => (
                    <TouchableOpacity
                        key={f}
                        style={[
                            styles.filterPill,
                            activeFilter === f && { backgroundColor: COLORS.brandBlue }
                        ]}
                        onPress={() => setActiveFilter(f)}
                    >
                        <Text style={[
                            styles.filterText,
                            { color: activeFilter === f ? '#000' : textSecondary }
                        ]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={MOCK_HISTORY}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    header: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.md,
        paddingBottom: SPACING.sm,
    },
    title: { ...TYPOGRAPHY.hero, fontSize: 28 },
    summaryRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    summaryCard: {
        flex: 1,
        padding: SPACING.md,
        alignItems: 'center',
        borderRadius: BORDER_RADIUS.md,
    },
    summaryValue: {
        ...TYPOGRAPHY.sectionHeader,
        fontSize: 18,
        fontWeight: '700',
    },
    summaryLabel: { ...TYPOGRAPHY.label, marginTop: 2, textAlign: 'center' },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: SPACING.lg,
        gap: SPACING.sm,
        marginBottom: SPACING.md,
    },
    filterPill: {
        paddingHorizontal: SPACING.md,
        paddingVertical: 6,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(128,128,128,0.3)',
    },
    filterText: { ...TYPOGRAPHY.label, fontSize: 13, fontWeight: '600' },
    list: { paddingHorizontal: SPACING.lg, paddingBottom: 120 },
    sessionCard: {
        marginBottom: SPACING.sm,
        borderRadius: BORDER_RADIUS.md,
        overflow: 'hidden',
    },
    sessionRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: SPACING.md,
    },
    iconBubble: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.md,
    },
    sessionInfo: { flex: 1, marginRight: SPACING.sm },
    stationName: { ...TYPOGRAPHY.body, fontWeight: '600', fontSize: 14 },
    sessionDate: { ...TYPOGRAPHY.label, marginTop: 2 },
    sessionRight: { alignItems: 'flex-end' },
    sessionCost: { ...TYPOGRAPHY.body, fontWeight: '700' },
    sessionKwh: { ...TYPOGRAPHY.label, marginTop: 2 },
    expandedDetail: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.08)',
        paddingHorizontal: SPACING.md,
        paddingBottom: SPACING.md,
    },
    detailGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.md,
        paddingTop: SPACING.md,
    },
    detailItem: { width: '45%', gap: 4 },
    detailLabel: { ...TYPOGRAPHY.label, marginLeft: 4 },
    detailValue: { ...TYPOGRAPHY.body, fontWeight: '600', marginLeft: 4 },
    warningOrange: { color: '#f97316' },
});
