import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store/themeStore';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/theme';
import { SquaresFour, Lightning, ClockCounterClockwise, User, MapTrifold, CreditCard } from 'phosphor-react-native';

const { width } = Dimensions.get('window');

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme } = useThemeStore();
    const insets = useSafeAreaInsets();
    const isDark = theme === 'dark';

    const icons: Record<string, any> = {
        dashboard: SquaresFour,
        recommendations: Lightning,
        history: ClockCounterClockwise,
        profile: User,
        discover: MapTrifold,
        credits: CreditCard,
    };

    return (
        <View style={styles.container}>
            <BlurView
                intensity={80}
                tint={isDark ? 'dark' : 'light'}
                style={[
                    styles.tabBar,
                    {
                        backgroundColor: isDark ? COLORS.surfaceBg + 'BF' : 'rgba(255, 255, 255, 0.85)',
                        borderTopColor: isDark ? COLORS.cardBorder : 'rgba(0, 0, 0, 0.1)',
                        paddingBottom: insets.bottom,
                        height: 65 + insets.bottom,
                    }
                ]}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    if (['booking', 'session', 'recommendations', 'profile'].includes(route.name)) return null;
                    const label = options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;
                    const isFocused = state.index === index;

                    const onPress = () => {
                        const event = navigation.emit({
                            type: 'tabPress',
                            target: route.key,
                            canPreventDefault: true,
                        });

                        if (!isFocused && !event.defaultPrevented) {
                            navigation.navigate(route.name);
                        }
                    };

                    const Icon = icons[route.name.toLowerCase()] || SquaresFour;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={[
                                styles.tabItem,
                                isFocused && styles.tabItemActive,
                            ]}
                            activeOpacity={0.7}
                        >
                            <Icon
                                weight="duotone"
                                size={22}
                                color={isFocused ? COLORS.primaryGreen : (isDark ? COLORS.textMutedDark : COLORS.textSecondaryLight)}
                            />
                            {isFocused && (
                                <Text style={[
                                    styles.label,
                                    { color: COLORS.primaryGreen }
                                ]}>
                                    {label as string}
                                </Text>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </BlurView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 0,
        width: width,
        alignItems: 'center',
    },
    tabBar: {
        flexDirection: 'row',
        width: '100%',
        borderTopWidth: 1,
        overflow: 'hidden',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    tabItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 8,
        paddingHorizontal: 14,
        borderRadius: BORDER_RADIUS.md,
    },
    tabItemActive: {
        backgroundColor: 'rgba(4,234,170,0.12)',
    },
    label: {
        marginLeft: 8,
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 0.3,
    },
});
