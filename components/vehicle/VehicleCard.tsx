import React, { useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';
import Animated, {
    useAnimatedProps,
    useSharedValue,
    withTiming,
    interpolateColor
} from 'react-native-reanimated';
import { COLORS, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../ui/GlassCard';
import { Vehicle } from '../../types/vehicle.types';
import { useThemeStore } from '../../store/themeStore';

const AnimatedPath = Animated.createAnimatedComponent(Path);

interface BatteryIndicatorProps {
    percentage: number;
    size?: number;
}

export const BatteryIndicator: React.FC<BatteryIndicatorProps> = ({
    percentage,
    size = 150
}) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const strokeWidth = 12;
    const radius = (size - strokeWidth) / 2;
    const center = size / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = useSharedValue(0);

    const targetColor = percentage <= 20 ? COLORS.alertRed
        : percentage <= 40 ? COLORS.warningOrange
        : COLORS.successGreen;

    useEffect(() => {
        progress.value = withTiming(percentage / 100, { duration: 1500 });
    }, [percentage]);

    const animatedProps = useAnimatedProps(() => ({
        strokeDashoffset: circumference * (1 - progress.value),
    }));

    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const trackColor = isDark ? COLORS.divider : '#e0e0e0';

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
                <Circle
                    cx={center} cy={center} r={radius}
                    stroke={trackColor} strokeWidth={strokeWidth} fill="transparent"
                />
                <AnimatedPath
                    d={`M ${center} ${center - radius} A ${radius} ${radius} 0 1 1 ${center} ${center + radius} A ${radius} ${radius} 0 1 1 ${center} ${center - radius}`}
                    stroke={targetColor} strokeWidth={strokeWidth} fill="transparent"
                    strokeDasharray={circumference}
                    animatedProps={animatedProps}
                    strokeLinecap="round"
                />
            </Svg>
            <View style={styles.textContainer}>
                <Text style={[styles.percentage, { color: textPrimary }]}>{Math.round(percentage)}%</Text>
                <Text style={[styles.label, { color: textSecondary }]}>Battery</Text>
            </View>
        </View>
    );
};

export const VehicleCard: React.FC<{ vehicle: Vehicle; onPress?: () => void }> = ({ vehicle, onPress }) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;

    return (
        <TouchableOpacity onPress={onPress}>
            <GlassCard style={styles.card as any} intensity={30}>
                <BatteryIndicator percentage={vehicle.batteryLevel} size={100} />
                <View style={styles.cardInfo}>
                    <Text style={[styles.vehicleName, { color: textPrimary }]}>
                        {[vehicle.make, vehicle.model].filter(Boolean).join(' ') || 'Unknown Vehicle'}
                    </Text>
                    <Text style={[styles.vehicleDetail, { color: textSecondary }]}>
                        {vehicle.licensePlate || 'License Plate N/A'}
                    </Text>
                    <Text style={[styles.vehicleDetail, { color: COLORS.primaryGreen }]}>
                        Range: {vehicle.rangeKm} km remaining
                    </Text>
                </View>
            </GlassCard>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: { alignItems: 'center', justifyContent: 'center' },
    textContainer: { position: 'absolute', alignItems: 'center' },
    percentage: { ...TYPOGRAPHY.display, fontSize: 28 },
    label: { ...TYPOGRAPHY.label, marginTop: -4, fontSize: 11 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        borderRadius: BORDER_RADIUS.xl,
        marginBottom: 16,
    },
    cardInfo: { marginLeft: 20, flex: 1 },
    vehicleName: { ...TYPOGRAPHY.sectionHeader, fontSize: 18, fontWeight: '600' },
    vehicleDetail: { ...TYPOGRAPHY.body, marginTop: 4, fontSize: 14 },
});
