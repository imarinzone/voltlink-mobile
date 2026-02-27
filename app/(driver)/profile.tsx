import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ProfileView } from '../../components/profile/ProfileView';
import { COLORS } from '../../utils/theme';
import { useThemeStore } from '../../store/themeStore';

export default function DriverProfile() {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: isDark ? COLORS.darkBg : COLORS.lightBg }]} edges={['top']}>
            <ProfileView
                name="Pavan Kalyan"
                email="pavan162.s@voltlink.com"
                role="driver"
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
