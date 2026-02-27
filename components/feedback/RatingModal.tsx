import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Star, X } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { useThemeStore } from '../../store/themeStore';

interface RatingModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (rating: number, comment: string) => void;
    stationName: string;
}

export default function RatingModal({ visible, onClose, onSubmit, stationName }: RatingModalProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    const handleSubmit = () => {
        if (rating === 0) return;
        onSubmit(rating, comment);
        setRating(0);
        setComment('');
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <GlassCard style={styles.modalContent} intensity={60}>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, { color: textPrimary }]}>Rate Station</Text>
                            <Text style={[styles.subtitle, { color: textSecondary }]}>{stationName}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <View style={styles.starsRow}>
                        {[1, 2, 3, 4, 5].map((s) => (
                            <TouchableOpacity key={s} onPress={() => setRating(s)}>
                                <Star
                                    size={36}
                                    fill={s <= rating ? COLORS.warningOrange : 'transparent'}
                                    color={s <= rating ? COLORS.warningOrange : textSecondary}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
                        placeholder="Tell us about your experience..."
                        placeholderTextColor={isDark ? COLORS.textMutedDark : 'rgba(0,0,0,0.4)'}
                        value={comment}
                        onChangeText={setComment}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.actions}>
                        <GlassButton title="Cancel" variant="secondary" style={{ flex: 1 }} onPress={onClose} />
                        <GlassButton
                            title="Submit Rating"
                            style={{ flex: 2 }}
                            onPress={handleSubmit}
                            disabled={rating === 0}
                        />
                    </View>
                </GlassCard>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        padding: SPACING.xl,
    },
    modalContent: {
        padding: SPACING.xl,
        borderRadius: BORDER_RADIUS.xl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: SPACING.lg,
    },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 22, fontWeight: '800' },
    subtitle: { ...TYPOGRAPHY.label, fontSize: 13, marginTop: 2 },
    starsRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING.md,
        marginVertical: SPACING.xl,
    },
    input: {
        borderRadius: BORDER_RADIUS.lg,
        borderWidth: 1,
        padding: SPACING.md,
        minHeight: 100,
        textAlignVertical: 'top',
        marginBottom: SPACING.xl,
        ...TYPOGRAPHY.body,
        fontSize: 14,
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.md,
    }
});
