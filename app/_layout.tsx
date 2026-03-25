import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Platform } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useThemeStore } from '../store/themeStore';
import { useRoleStore } from '../store/roleStore';
import { COLORS } from '../utils/theme';
import * as Font from 'expo-font';
import {
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';

function injectWebFonts() {
    if (Platform.OS !== 'web') return;
    if (document.getElementById('montserrat-fonts')) return;

    const link = document.createElement('link');
    link.id = 'montserrat-fonts';
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
}

export default function RootLayout() {
    const { theme } = useThemeStore();
    const { activeRole } = useRoleStore();
    const segments = useSegments();
    const router = useRouter();
    const isDark = theme === 'dark';
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (Platform.OS === 'web') {
            injectWebFonts();
        } else {
            Font.loadAsync({
                'Montserrat-Regular': Montserrat_400Regular,
                'Montserrat-Medium': Montserrat_500Medium,
                'Montserrat-SemiBold': Montserrat_600SemiBold,
                'Montserrat-Bold': Montserrat_700Bold,
            }).catch(() => {});
        }
    }, []);

    useEffect(() => {
        setIsReady(true);
    }, []);

    useEffect(() => {
        if (!isReady) return;

        const inDriverGroup = segments[0] === 'driver';
        const inB2CGroup = segments[0] === 'b2c';

        if (!activeRole && (inDriverGroup || inB2CGroup)) {
            router.replace('/');
        } else if (activeRole && !inDriverGroup && !inB2CGroup) {
            router.replace(activeRole === 'driver' ? '/driver/dashboard' : '/b2c/dashboard');
        } else if (activeRole === 'driver' && inB2CGroup) {
            router.replace('/driver/dashboard');
        } else if (activeRole === 'b2c' && inDriverGroup) {
            router.replace('/b2c/dashboard');
        }
    }, [activeRole, segments, isReady]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={[styles.container, { backgroundColor: isDark ? COLORS.darkBg : COLORS.lightBg }]}>
                <StatusBar style={isDark ? 'light' : 'dark'} />
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: {
                            backgroundColor: isDark ? COLORS.darkBg : COLORS.lightBg,
                        },
                        animation: 'fade',
                    }}
                >
                    <Stack.Screen name="index" />
                    <Stack.Screen name="driver" options={{ headerShown: false }} />
                    <Stack.Screen name="b2c" options={{ headerShown: false }} />
                </Stack>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
