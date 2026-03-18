import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GlassCard } from './GlassCard';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/theme';
import { useThemeStore } from '../../store/themeStore';

interface MetricCardProps {
    label: string;
    value: string | number;
    unit?: string;
    icon?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({ label, value, unit, icon }) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <GlassCard style={styles.card}>
            <View style={styles.header}>
                {icon}
                <Text style={[styles.label, { color: isDark ? COLORS.textMutedDark : COLORS.textSecondaryLight }]}>
                    {label}
                </Text>
            </View>
            <View style={styles.valueContainer}>
                <Text style={[styles.value, { color: isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight }]}>
                    {value}
                </Text>
                {unit && (
                    <Text style={[styles.unit, { color: isDark ? COLORS.textMutedDark : COLORS.textSecondaryLight }]}>
                        {unit}
                    </Text>
                )}
            </View>
        </GlassCard>
    );
};

const styles = StyleSheet.create({
    card: {
        flex: 1,
        minWidth: 100,
        marginHorizontal: 4,
        padding: SPACING.md,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: SPACING.sm,
    },
    label: {
        ...TYPOGRAPHY.label,
        marginLeft: 6,
        fontSize: 11,
        fontWeight: '500',
        letterSpacing: 0.3,
    },
    valueContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    value: {
        ...TYPOGRAPHY.sectionHeader,
        fontSize: 20,
        fontWeight: '700',
    },
    unit: {
        ...TYPOGRAPHY.label,
        marginLeft: 3,
        fontSize: 11,
    },
});
