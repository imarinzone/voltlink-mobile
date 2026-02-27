import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { COLORS, TYPOGRAPHY, SPACING } from '../../utils/theme';
import { useThemeStore } from '../../store/themeStore';

interface SectionHeaderProps {
    title: string;
    actionLabel?: string;
    onActionPress?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
    title,
    actionLabel,
    onActionPress
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight }]}>
                {title}
            </Text>
            {actionLabel && (
                <TouchableOpacity onPress={onActionPress}>
                    <Text style={styles.action}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: SPACING.md,
        paddingHorizontal: SPACING.xs,
    },
    title: {
        ...TYPOGRAPHY.sectionHeader,
    },
    action: {
        ...TYPOGRAPHY.label,
        color: COLORS.brandBlue,
        fontWeight: '600',
    },
});
