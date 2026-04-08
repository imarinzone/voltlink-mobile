import React, { useState } from 'react';
import { StyleSheet, View, Text, Animated, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { GlassButton } from '../components/ui/GlassButton';
import { useRoleStore } from '../store/roleStore';
import { useAuthStore } from '../store/authStore';
import { useThemeStore } from '../store/themeStore';
import { COLORS, TYPOGRAPHY, SPACING, BORDER_RADIUS } from '../utils/theme';
import { Lightning, Eye, EyeSlash } from 'phosphor-react-native';
import { apiClient } from '../services/api.service';

export default function LoginScreen() {
    const router = useRouter();
    const { setRole } = useRoleStore();
    const { login } = useAuthStore();
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const fadeAnim = React.useRef(new Animated.Value(0)).current;
    const transformY = React.useRef(new Animated.Value(40)).current;

    React.useEffect(() => {
        Animated.parallel([
            Animated.timing(transformY, {
                toValue: 0,
                duration: 700,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }),
        ]).start();
    }, []);

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            setError('Please enter both email and password');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await apiClient.post('/auth/login', {
                email: email.trim().toLowerCase(),
                password,
            });

            const userData = response.data;
            login(userData);

            // Map backend role to mobile role
            if (userData.role === 'DRIVER') {
                setRole('driver');
                router.replace('/driver/dashboard');
            } else if (userData.role === 'B2C_CUSTOMER') {
                setRole('b2c');
                router.replace('/b2c/dashboard');
            } else {
                setError('This account is not authorized for the mobile app');
                setIsLoading(false);
                return;
            }
        } catch (err: any) {
            const message = err?.response?.data?.error || 'Invalid email or password';
            setError(message);
        } finally {
            setIsLoading(false);
        }
    };

    const bg = isDark ? COLORS.darkBg : COLORS.lightBg;
    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const inputBg = isDark ? COLORS.inputBg : 'rgba(0,0,0,0.04)';
    const inputBorder = isDark ? COLORS.cardBorder : 'rgba(0,0,0,0.1)';

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: bg }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Background glow */}
                <View style={styles.bgGlow} />

                <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
                    <View style={styles.logoContainer}>
                        <Lightning weight="duotone" color={COLORS.primaryGreen} size={40} />
                    </View>
                    <Text style={[styles.title, { color: textPrimary }]}>VoltLink</Text>
                    <Text style={[styles.tagline, { color: textSecondary }]}>
                        Future of EV Intelligence
                    </Text>
                </Animated.View>

                <Animated.View style={[styles.formContainer, { transform: [{ translateY: transformY }], opacity: fadeAnim }]}>
                    <Text style={[styles.signInLabel, { color: textSecondary }]}>SIGN IN</Text>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: textSecondary }]}>Email</Text>
                        <TextInput
                            style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textPrimary }]}
                            placeholder="Enter your email"
                            placeholderTextColor={isDark ? COLORS.textMutedDark : '#999'}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                            autoCorrect={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={[styles.inputLabel, { color: textSecondary }]}>Password</Text>
                        <View style={{ position: 'relative' }}>
                            <TextInput
                                style={[styles.input, { backgroundColor: inputBg, borderColor: inputBorder, color: textPrimary, paddingRight: 40 }]}
                                placeholder="Enter your password"
                                placeholderTextColor={isDark ? COLORS.textMutedDark : '#999'}
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                                autoComplete="password"
                            />
                            <TouchableOpacity 
                                style={{ position: 'absolute', right: 12, top: 12 }} 
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? (
                                    <EyeSlash color={isDark ? COLORS.textMutedDark : '#999'} size={24} />
                                ) : (
                                    <Eye color={isDark ? COLORS.textMutedDark : '#999'} size={24} />
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {error ? (
                        <View style={styles.errorContainer}>
                            <Text style={styles.errorText}>{error}</Text>
                        </View>
                    ) : null}

                    {isLoading ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={COLORS.primaryGreen} />
                            <Text style={[styles.loadingText, { color: textSecondary }]}>Signing in...</Text>
                        </View>
                    ) : (
                        <GlassButton title="Sign In →" onPress={handleLogin} style={styles.button} />
                    )}
                </Animated.View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: SPACING.lg,
    },
    bgGlow: {
        position: 'absolute',
        top: -100,
        left: '50%',
        marginLeft: -150,
        width: 300,
        height: 300,
        borderRadius: 150,
        backgroundColor: 'rgba(4, 234, 170, 0.04)',
    },
    header: {
        alignItems: 'center',
        marginBottom: SPACING.xxl,
    },
    logoContainer: {
        width: 64,
        height: 64,
        borderRadius: 20,
        backgroundColor: 'rgba(4, 234, 170, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: SPACING.md,
    },
    title: {
        ...TYPOGRAPHY.hero,
        fontSize: 34,
        fontWeight: '700',
        letterSpacing: -0.5,
    },
    tagline: {
        ...TYPOGRAPHY.body,
        fontSize: 15,
        marginTop: 4,
    },
    formContainer: {
        width: '100%',
    },
    signInLabel: {
        ...TYPOGRAPHY.label,
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 1.5,
        textAlign: 'center',
        marginBottom: SPACING.lg,
    },
    inputGroup: {
        marginBottom: SPACING.md,
    },
    inputLabel: {
        ...TYPOGRAPHY.label,
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 6,
    },
    input: {
        height: 48,
        borderWidth: 1,
        borderRadius: BORDER_RADIUS.md,
        paddingHorizontal: SPACING.md,
        fontSize: 15,
    },
    errorContainer: {
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 1,
        borderColor: 'rgba(239, 68, 68, 0.2)',
        borderRadius: BORDER_RADIUS.md,
        padding: SPACING.sm,
        marginBottom: SPACING.md,
    },
    errorText: {
        color: '#ef4444',
        fontSize: 13,
        textAlign: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        height: 54,
        gap: 8,
    },
    loadingText: {
        fontSize: 14,
    },
    button: {
        width: '100%',
        height: 54,
        borderRadius: BORDER_RADIUS.lg,
        marginTop: SPACING.sm,
    },
});
