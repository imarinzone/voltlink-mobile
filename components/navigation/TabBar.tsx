import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Dimensions } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useThemeStore } from '../../store/themeStore';
import { COLORS, SPACING, BORDER_RADIUS } from '../../utils/theme';
import { LayoutDashboard, Zap, History, User, Map, CreditCard } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const icons: Record<string, any> = {
        dashboard: LayoutDashboard,
        recommendations: Zap,
        history: History,
        profile: User,
        discover: Map,
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
                        backgroundColor: isDark ? 'rgba(26, 26, 26, 0.85)' : 'rgba(255, 255, 255, 0.85)',
                        borderColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
                    }
                ]}
            >
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];
                    // Skip non-tab screens — booking/session are navigated to programmatically
                    if (['booking', 'session', 'recommendations'].includes(route.name)) return null;
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

                    const Icon = icons[route.name.toLowerCase()] || LayoutDashboard;

                    return (
                        <TouchableOpacity
                            key={index}
                            onPress={onPress}
                            style={styles.tabItem}
                            activeOpacity={0.7}
                        >
                            <Icon
                                size={24}
                                color={isFocused ? COLORS.brandBlue : (isDark ? COLORS.textMutedDark : COLORS.textSecondaryLight)}
                            />
                            {isFocused && (
                                <Text style={[
                                    styles.label,
                                    { color: COLORS.brandBlue }
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
        bottom: 30,
        width: width,
        alignItems: 'center',
        paddingHorizontal: SPACING.lg,
    },
    tabBar: {
        flexDirection: 'row',
        height: 70,
        width: '100%',
        borderRadius: 35,
        borderWidth: 1,
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
        paddingHorizontal: 12,
        borderRadius: 20,
    },
    label: {
        marginLeft: 8,
        fontSize: 12,
        fontWeight: '600',
    },
});
