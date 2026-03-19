import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Zap, Clock } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../ui/GlassCard';
import { Station } from '../../types/station.types';
import { useThemeStore } from '../../store/themeStore';
import { useLanguageStore } from '../../store/languageStore';
import { formatSlotRange } from '../../utils/time';

const translations = {
    English: {
        available: 'Available',
        ai: 'AI:',
        rate: 'Rate',
        report: 'Report',
        bookNow: 'Book Now',
        bestMatch: '✓ RECOMMENDED',
    },
    'हिंदी': {
        available: 'उपलब्ध',
        ai: 'AI:',
        rate: 'रेट',
        report: 'रिपोर्ट',
        bookNow: 'अभी बुक करें',
        bestMatch: '✓ RECOMMENDED',
    }
};

interface RecommendationCardProps {
    recommendation: Station;
    rank: number;
    isPrimary?: boolean;
    onBook: () => void;
    onRate?: () => void;
    onReport?: () => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
    recommendation,
    rank,
    isPrimary = false,
    onBook,
    onRate,
    onReport
}) => {
    const { theme } = useThemeStore();
    const { language } = useLanguageStore();
    const isDark = theme === 'dark';
    const t = translations[language];

    const isRank2 = rank === 2;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    return (
        <GlassCard
            style={[
                styles.card,
                isPrimary && styles.primaryCard,
            ] as any}
            intensity={isPrimary ? 40 : 25}
        >
            {isPrimary && (
                <View style={styles.primaryBanner}>
                    <Text style={styles.primaryBannerText}>{t.bestMatch}</Text>
                </View>
            )}

            <View style={styles.header}>
                <View style={[
                    styles.rankBadge, 
                    isPrimary && { backgroundColor: COLORS.primaryGreen }, 
                    isRank2 && { backgroundColor: COLORS.cardBorder }
                ]}>
                    <Text style={[
                        styles.rankText, 
                        isPrimary && { color: COLORS.darkBg }, 
                        isRank2 && { color: COLORS.primaryGreen }
                    ]}>#{rank}</Text>
                </View>
                <Text style={styles.price}>₹{recommendation.effectivePrice || recommendation.pricePerKwh}/kWh</Text>
            </View>

            <Text style={[styles.name, { color: textPrimary }]}>{recommendation.name}</Text>

            <View style={styles.details}>
                <Text style={[styles.detailText, { color: textSecondary }]}>
                    {recommendation.distanceKm || '0'} km • {recommendation.etaMinutes || '0'} mins
                </Text>
                <Text style={styles.availability}>
                    {recommendation.availableChargers ?? 0}/{recommendation.totalChargers ?? 0} {t.available}
                </Text>
            </View>

            {recommendation.aiReason && (
                <View style={styles.aiBadge}>
                    <Text style={styles.aiText}>{t.ai} {recommendation.aiReason}</Text>
                </View>
            )}

            {recommendation.slot && (
                <View style={styles.slotContainer}>
                    <Clock size={12} color={COLORS.primaryGreen} />
                    <Text style={[styles.slotText, { color: textSecondary }]}>
                        Recommended Slot: <Text style={{ color: COLORS.primaryGreen, fontWeight: '700' }}>{formatSlotRange(recommendation.slot)}</Text>
                    </Text>
                </View>
            )}

            <View style={styles.actionRow}>
                {onRate && (
                    <TouchableOpacity style={styles.actionBtn} onPress={onRate}>
                        <Text style={[styles.actionText, { color: textSecondary }]}>{t.rate}</Text>
                    </TouchableOpacity>
                )}
                {onReport && (
                    <TouchableOpacity style={styles.actionBtn} onPress={onReport}>
                        <Text style={[styles.actionText, { color: COLORS.alertRed }]}>{t.report}</Text>
                    </TouchableOpacity>
                )}
                <TouchableOpacity
                    style={[styles.bookButton, isPrimary && { backgroundColor: COLORS.primaryGreen }]}
                    onPress={onBook}
                >
                    <Text style={[styles.bookText, isPrimary && { color: COLORS.darkBg }]}>{t.bookNow}</Text>
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
        borderColor: COLORS.cardBorder,
        overflow: 'hidden',
    },
    primaryCard: {
        borderColor: COLORS.primaryGreen,
        borderWidth: 2,
        backgroundColor: 'rgba(4, 234, 170, 0.06)',
    },
    primaryBanner: {
        backgroundColor: COLORS.primaryGreen,
        marginHorizontal: -SPACING.lg,
        marginTop: -SPACING.lg,
        marginBottom: SPACING.md,
        paddingVertical: 6,
        paddingHorizontal: SPACING.lg,
        alignItems: 'center',
    },
    primaryBannerText: {
        color: COLORS.darkBg,
        fontWeight: '800',
        fontSize: 11,
        letterSpacing: 0.8,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    rankBadge: {
        backgroundColor: COLORS.primaryGreen,
        paddingHorizontal: 10,
        paddingVertical: 3,
        borderRadius: BORDER_RADIUS.sm,
    },
    rankText: { color: COLORS.darkBg, fontSize: 10, fontWeight: '800' },
    price: { ...TYPOGRAPHY.label, fontWeight: '700', color: COLORS.successGreen, fontSize: 13 },
    name: { ...TYPOGRAPHY.sectionHeader, fontSize: 18, marginBottom: 4 },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: SPACING.md,
    },
    detailText: { ...TYPOGRAPHY.label, fontSize: 12 },
    availability: { ...TYPOGRAPHY.label, color: COLORS.primaryGreen, fontWeight: '600', fontSize: 12 },
    aiBadge: {
        backgroundColor: 'rgba(4,234,170,0.1)',
        padding: SPACING.sm,
        borderRadius: BORDER_RADIUS.sm,
        marginBottom: SPACING.md,
    },
    aiText: { ...TYPOGRAPHY.label, color: COLORS.primaryGreen, fontSize: 11, fontStyle: 'italic' },
    actionBtn: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: BORDER_RADIUS.full,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: SPACING.sm,
    },
    bookButton: {
        backgroundColor: COLORS.cardBorder,
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: BORDER_RADIUS.full,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    bookText: { color: COLORS.primaryGreen, fontWeight: '800', fontSize: 13 },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    actionText: {
        ...TYPOGRAPHY.label,
        fontWeight: '700',
        fontSize: 12,
    },
    slotContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.md,
        paddingHorizontal: SPACING.xs,
    },
    slotText: {
        ...TYPOGRAPHY.label,
        fontSize: 12,
        marginLeft: 6,
    },
});
