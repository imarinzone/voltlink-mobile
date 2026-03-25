import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
import { COLORS, BORDER_RADIUS, TYPOGRAPHY } from '../../utils/theme';
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

    const getButtonStyle = () => {
        switch (variant) {
            case 'primary':
                return {
                    backgroundColor: COLORS.ecoGreen,
                };
            case 'secondary':
                return {
                    backgroundColor: 'transparent',
                    borderColor: COLORS.divider,
                    borderWidth: 1,
                };
            case 'ghost':
                return {
                    backgroundColor: 'transparent',
                    borderColor: 'transparent',
                };
        }
    };

    const getTextColor = () => {
        if (variant === 'primary') return COLORS.background;
        if (variant === 'ghost' && title.toLowerCase().includes('stop')) return COLORS.error;
        return isDark ? COLORS.textPrimary : COLORS.textPrimaryLight;
    };

    return (
        <TouchableOpacity
            style={[styles.button, getButtonStyle(), style, disabled && { opacity: 0.5 }]}
            onPress={onPress}
            activeOpacity={0.9}
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
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: BORDER_RADIUS.base,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
    },
    text: {
        ...TYPOGRAPHY.body,
        fontWeight: '600',
        fontSize: 14,
    },
});
