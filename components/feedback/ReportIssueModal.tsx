import React, { useState } from 'react';
import { StyleSheet, View, Text, Modal, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { AlertCircle, ZapOff, ShieldAlert, CreditCard, MessageSquare, X } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { useThemeStore } from '../../store/themeStore';

const ISSUE_TYPES = [
    { id: 'not_working', label: 'Not Working', icon: ZapOff, color: COLORS.alertRed },
    { id: 'safety', label: 'Safety Hazard', icon: ShieldAlert, color: COLORS.warningOrange },
    { id: 'billing', label: 'Billing Issue', icon: CreditCard, color: COLORS.brandBlue },
    { id: 'other', label: 'Other Issue', icon: MessageSquare, color: COLORS.textMutedDark },
];

interface ReportIssueModalProps {
    visible: boolean;
    onClose: () => void;
    onSubmit: (issueType: string, description: string) => void;
    stationName: string;
}

export default function ReportIssueModal({ visible, onClose, onSubmit, stationName }: ReportIssueModalProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';
    const [selectedType, setSelectedType] = useState<string>('');
    const [description, setDescription] = useState('');

    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';
    const borderColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)';

    const handleSubmit = () => {
        if (!selectedType || !description) return;
        onSubmit(selectedType, description);
        setSelectedType('');
        setDescription('');
    };

    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <GlassCard style={styles.modalContent} intensity={60}>
                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.title, { color: textPrimary }]}>Report Issue</Text>
                            <Text style={[styles.subtitle, { color: textSecondary }]}>{stationName}</Text>
                        </View>
                        <TouchableOpacity onPress={onClose}>
                            <X size={24} color={textPrimary} />
                        </TouchableOpacity>
                    </View>

                    <Text style={[styles.sectionLabel, { color: textSecondary }]}>WHAT'S THE ISSUE?</Text>
                    <View style={styles.typesRow}>
                        {ISSUE_TYPES.map((type) => {
                            const Icon = type.icon;
                            const isSelected = selectedType === type.id;
                            return (
                                <TouchableOpacity
                                    key={type.id}
                                    style={[
                                        styles.typeCard,
                                        { backgroundColor: inputBg, borderColor },
                                        isSelected && { borderColor: type.color, backgroundColor: `${type.color}15` }
                                    ]}
                                    onPress={() => setSelectedType(type.id)}
                                >
                                    <Icon size={20} color={isSelected ? type.color : textSecondary} />
                                    <Text style={[styles.typeLabel, { color: isSelected ? textPrimary : textSecondary }]}>
                                        {type.label}
                                    </Text>
                                </TouchableOpacity>
                            );
                        })}
                    </View>

                    <TextInput
                        style={[styles.input, { backgroundColor: inputBg, borderColor, color: textPrimary }]}
                        placeholder="Provide more details..."
                        placeholderTextColor={isDark ? COLORS.textMutedDark : 'rgba(0,0,0,0.4)'}
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />

                    <View style={styles.actions}>
                        <GlassButton title="Cancel" variant="secondary" style={{ flex: 1 }} onPress={onClose} />
                        <GlassButton
                            title="Submit Report"
                            variant="primary"
                            style={{ flex: 2 }}
                            onPress={handleSubmit}
                            disabled={!selectedType || !description}
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
        marginBottom: SPACING.xl,
    },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 22, fontWeight: '800' },
    subtitle: { ...TYPOGRAPHY.label, fontSize: 13, marginTop: 2 },
    sectionLabel: { ...TYPOGRAPHY.label, fontSize: 10, fontWeight: '800', marginBottom: SPACING.md, letterSpacing: 1 },
    typesRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginBottom: SPACING.xl,
    },
    typeCard: {
        width: '48%',
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1.5,
    },
    typeLabel: { ...TYPOGRAPHY.label, fontSize: 12, fontWeight: '700' },
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
