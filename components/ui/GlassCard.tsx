import React from 'react';
import { StyleSheet, View, ViewStyle, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store/themeStore';
import { COLORS, BORDER_RADIUS } from '../../utils/theme';

interface GlassCardProps {
    children: React.ReactNode;
    style?: ViewStyle;
    intensity?: number;
}

export const GlassCard: React.FC<GlassCardProps> = ({ children, style, intensity = 20 }) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const cardStyle = [
        styles.card,
        isDark ? styles.cardDark : styles.cardLight,
        style,
    ];

    if (Platform.OS === 'web') {
        return (
            <View style={[cardStyle, {
                backgroundColor: isDark ? COLORS.card : COLORS.glassLight,
            }]}>
                {children}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <BlurView
                intensity={intensity}
                tint={isDark ? 'dark' : 'light'}
                style={cardStyle}
            >
                {children}
            </BlurView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: BORDER_RADIUS.base,
        overflow: 'hidden',
        marginVertical: 8,
    },
    card: {
        padding: 20,
        borderRadius: BORDER_RADIUS.base,
        borderWidth: 1,
    },
    cardDark: {
        backgroundColor: COLORS.card,
        borderColor: COLORS.border,
    },
    cardLight: {
        backgroundColor: 'rgba(255, 255, 255, 0.85)',
        borderColor: 'rgba(0,0,0,0.08)',
    },
});
