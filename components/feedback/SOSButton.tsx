import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Modal } from 'react-native';
import { AlertCircle, X } from 'lucide-react-native';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { GlassCard } from '../ui/GlassCard';

export const SOSButton: React.FC = () => {
    const [modalVisible, setModalVisible] = useState(false);

    return (
        <>
            <TouchableOpacity
                style={styles.fab}
                onPress={() => setModalVisible(true)}
                activeOpacity={0.8}
            >
                <AlertCircle color="#FFF" size={28} />
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <GlassCard style={styles.modalContent} intensity={60}>
                        <View style={styles.modalHeader}>
                            <Text style={[styles.modalTitle, { color: COLORS.textPrimaryDark }]}>Emergency SOS</Text>
                            <TouchableOpacity onPress={() => setModalVisible(false)}>
                                <X color={COLORS.textPrimaryDark} size={24} />
                            </TouchableOpacity>
                        </View>

                        <View style={styles.alertIconContainer}>
                            <AlertCircle color={COLORS.alertRed} size={64} />
                        </View>

                        <Text style={[styles.modalDescription, { color: COLORS.textSecondaryDark }]}>
                            Are you in an emergency? Proceeding will share your location with VoltLink Support and emergency services.
                        </Text>

                        <View style={styles.buttonRow}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.confirmButton,
                                    { backgroundColor: COLORS.alertRed }
                                ]}
                                onPress={() => {
                                    setModalVisible(false);
                                    alert('SOS Alert Sent!');
                                }}
                            >
                                <Text style={styles.confirmText}>Send SOS</Text>
                            </TouchableOpacity>
                        </View>
                    </GlassCard>
                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 20,
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: COLORS.alertRed,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.lg,
    },
    modalContent: {
        width: '100%',
        padding: SPACING.lg,
        borderRadius: BORDER_RADIUS.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalTitle: {
        ...TYPOGRAPHY.sectionHeader,
        fontWeight: 'bold',
    },
    alertIconContainer: {
        alignItems: 'center',
        marginBottom: SPACING.lg,
    },
    modalDescription: {
        ...TYPOGRAPHY.body,
        textAlign: 'center',
        marginBottom: SPACING.xl,
        lineHeight: 22,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: SPACING.md,
    },
    cancelButton: {
        flex: 1,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        borderWidth: 1,
        borderColor: COLORS.cardBorder,
        alignItems: 'center',
    },
    cancelText: {
        ...TYPOGRAPHY.body,
        color: COLORS.textPrimaryDark,
        fontWeight: '600',
    },
    confirmButton: {
        flex: 2,
        padding: SPACING.md,
        borderRadius: BORDER_RADIUS.md,
        alignItems: 'center',
    },
    confirmText: {
        ...TYPOGRAPHY.body,
        color: '#FFF',
        fontWeight: 'bold',
    },
});
