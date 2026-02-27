import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../ui/GlassCard';
import { Station } from '../../types/station.types';
import { useThemeStore } from '../../store/themeStore';

interface RecommendationCardProps {
    recommendation: Station;
    rank: number;
    onBook: () => void;
    onRate?: () => void;
    onReport?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation,
    rank,
    onBook,
    onRate,
    onReport
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const borderColor = isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.08)';

    return (
        <GlassCard style={styles.card as any} intensity={25}>
            <View style={styles.header}>
                <View style={styles.rankBadge}>
                    <Text style={styles.rankText}>#{rank}</Text>
                </View>
                <Text style={styles.price}>₹{recommendation.effectivePrice || recommendation.pricePerKwh}/kWh</Text>
            </View>

            <Text style={[styles.name, { color: textPrimary }]}>{recommendation.name}</Text>

            <View style={styles.details}>
                <Text style={[styles.detailText, { color: textSecondary }]}>
                    {recommendation.distanceKm} km • {recommendation.etaMinutes} mins
                </Text>
                <Text style={styles.availability}>
                    {recommendation.availableChargers || 0}/{recommendation.totalChargers || 0} Available
                </Text>
            </View>

            <View style={styles.aiBadge}>
                <Text style={styles.aiText}>AI: {recommendation.aiReason}</Text>
            </View>

            <View style={styles.actionRow}>
                {onRate && (
                    <TouchableOpacity style={[styles.actionBtn, { borderColor }]} onPress={onRate}>
                        <Text style={[styles.actionText, { color: textSecondary }]}>Rate</Text>
                    </TouchableOpacity>
                )}
                {onReport && (
                    <TouchableOpacity style={[styles.actionBtn, { borderColor }]} onPress={onReport}>
                        <Text style={[styles.actionText, { color: COLORS.alertRed }]}>Report</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity style={styles.bookButton} onPress={onBook}>
                    <Text style={styles.bookText}>Book Now</Text>
                </TouchableOpacity>
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        padding: SPACING.lg,
        marginBottom: SPACING.md,
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
        overflow: 'hidden',
    },
    borderColor: { // helper for dynamic borderColor use
        borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    rankBadge: {
        backgroundColor: COLORS.brandBlue,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    rankText: { color: '#000', fontSize: 10, fontWeight: '800' },
    price: { ...TYPOGRAPHY.label, fontWeight: '700', color: COLORS.successGreen },
    // name color is now dynamic — passed as style prop via textPrimary
    name: { ...TYPOGRAPHY.sectionHeader, fontSize: 18, marginBottom: 4 },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    detailText: { ...TYPOGRAPHY.label },
    availability: { ...TYPOGRAPHY.label, color: COLORS.brandBlue, fontWeight: '600' },
    aiBadge: {
        backgroundColor: 'rgba(0, 212, 255, 0.1)',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.md,
    },
    aiText: { ...TYPOGRAPHY.label, color: COLORS.brandBlue, fontSize: 11, fontStyle: 'italic' },
    bookButton: {
        backgroundColor: COLORS.brandBlue,
        paddingVertical: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    bookText: { color: '#000', fontWeight: '700', fontSize: 13 },
    actionRow: {
        flexDirection: 'row',
        gap: SPACING.sm,
    },
    actionBtn: {
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionText: {
        ...TYPOGRAPHY.label,
        fontWeight: '700',
        fontSize: 12,
    },
});
