import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle, View, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY, SHADOWS } from '../../utils/theme';
import { useThemeStore } from '../../store/themeStore';

interface GlassButtonProps {
    title: string;
    onPress: () => void;
    variant?: 'primary' | 'secondary' | 'ghost';
    style?: ViewStyle;
    textStyle?: TextStyle;
    disabled?: boolean;
}

export const GlassButton: React.FC<GlassButtonProps> = ({
    title,
    onPress,
    variant = 'primary',
    style,
    textStyle,
    disabled = false
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const getTextColor = () => {
        if (variant === 'primary') return COLORS.darkBg;
        if (variant === 'ghost' && title.toLowerCase().includes('stop')) return COLORS.alertRed;
        return isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                activeOpacity={0.8}
                disabled={disabled}
                style={[disabled && { opacity: 0.5 }]}
            >
                <LinearGradient
                    colors={[COLORS.gradientStart, COLORS.gradientEnd]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, styles.primaryButton, style, SHADOWS.button]}
                >
                    <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                        {title}
                    </Text>
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    const getButtonStyle = () => {
        switch (variant) {
            case 'secondary':
                return {
                    backgroundColor: 'transparent',
                    borderColor: 'rgba(255,255,255,0.15)',
                    borderWidth: 1,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                };
        }
    };

    return (
        <TouchableOpacity
            style={[styles.button, getButtonStyle(), style, disabled && { opacity: 0.5 }]}
            onPress={onPress}
            activeOpacity={0.8}
            disabled={disabled}
        >
            <Text style={[styles.text, { color: getTextColor() }, textStyle]}>
                {title}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        paddingVertical: 14,
        paddingHorizontal: 24,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    primaryButton: {
        borderRadius: BORDER_RADIUS.md,
    },
    text: {
        ...TYPOGRAPHY.body,
        fontWeight: '700',
        fontSize: 15,
    },
});
