import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { X, Check } from 'lucide-react-native';
import { GlassCard } from '../ui/GlassCard';
import { GlassButton } from '../ui/GlassButton';
import { useThemeStore } from '../../store/themeStore';
import { COLORS, SPACING, TYPOGRAPHY, BORDER_RADIUS } from '../../utils/theme';
import { Station } from '../../types/station.types';

export interface FilterState {
    availableOnly: boolean;
    connectors: string[];
    powerRatings: string[];
    cpos: string[];
}

interface FilterModalProps {
    visible: boolean;
    onClose: () => void;
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
    stations: Station[];
    myVehicle?: any;
}

const CONNECTOR_TYPES = ['Type 2', 'CCS2', 'CHAdeMO', 'AC Type 2'];
const POWER_RATINGS = ['AC', 'DC Fast'];

export default function FilterModal({ visible, onClose, currentFilters, onApply, stations, myVehicle }: FilterModalProps) {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    // Extract unique CPOs
    const allCpos = Array.from(new Set(stations.map(s => s.cpoName).filter(Boolean)));

    const [filters, setFilters] = useState<FilterState>(currentFilters);

    // Initial default connectors based on vehicle
    useEffect(() => {
        if (visible && currentFilters.connectors.length === 0 && myVehicle?.model) {
            // Rough mapping logic based on model info
            let defaultConnectors = ['CCS2'];
            const model = myVehicle.model.toLowerCase();
            if (model.includes('ather') || model.includes('ola') || model.includes('chetak')) {
                defaultConnectors = ['Type 2'];
            }
            setFilters(prev => ({ ...prev, connectors: defaultConnectors }));
        } else if (visible) {
            setFilters(currentFilters);
        }
    }, [visible, myVehicle, currentFilters]);

    const toggleArrayItem = (array: string[], item: string) => {
        return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
    };

    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const bg = isDark ? COLORS.surfaceDark : COLORS.surfaceLight;
    const borderColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
    const inputBg = isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)';

    const renderChip = (label: string, isSelected: boolean, onPress: () => void) => (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.chip,
                { backgroundColor: inputBg, borderColor },
                isSelected && { backgroundColor: COLORS.brandBlue + '20', borderColor: COLORS.brandBlue }
            ]}
        >
            <Text style={[styles.chipText, { color: isSelected ? COLORS.brandBlue : textPrimary }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <Modal visible={visible} transparent animationType="slide">
            <View style={styles.overlay}>
                <View style={[styles.content, { backgroundColor: bg }]}>
                    <View style={[styles.header, { borderBottomColor: borderColor }]}>
                        <Text style={[styles.title, { color: textPrimary }]}>Filters</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <X color={textSecondary} size={24} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                        {/* Status */}
                        <Text style={[styles.sectionTitle, { color: textSecondary }]}>Status</Text>
                        <View style={styles.chipGroup}>
                            {renderChip('Available Now', filters.availableOnly, () => setFilters(f => ({ ...f, availableOnly: !f.availableOnly })))}
                        </View>

                        {/* Power Rating */}
                        <Text style={[styles.sectionTitle, { color: textSecondary, marginTop: SPACING.lg }]}>Power Rating</Text>
                        <View style={styles.chipGroup}>
                            {POWER_RATINGS.map(rating =>
                                renderChip(rating, filters.powerRatings.includes(rating), () =>
                                    setFilters(f => ({ ...f, powerRatings: toggleArrayItem(f.powerRatings, rating) }))
                                )
                            )}
                        </View>

                        {/* Connector Types */}
                        <Text style={[styles.sectionTitle, { color: textSecondary, marginTop: SPACING.lg }]}>Connector Types</Text>
                        <View style={styles.chipGroup}>
                            {CONNECTOR_TYPES.map(type =>
                                renderChip(type, filters.connectors.includes(type), () =>
                                    setFilters(f => ({ ...f, connectors: toggleArrayItem(f.connectors, type) }))
                                )
                            )}
                        </View>

                        {/* Brands / CPOs */}
                        {allCpos.length > 0 && (
                            <>
                                <Text style={[styles.sectionTitle, { color: textSecondary, marginTop: SPACING.lg }]}>Brand / CPO</Text>
                                <View style={styles.chipGroup}>
                                    {allCpos.map((cpo, idx) =>
                                        renderChip(cpo, filters.cpos.includes(cpo), () =>
                                            setFilters(f => ({ ...f, cpos: toggleArrayItem(f.cpos, cpo) }))
                                        )
                                    )}
                                </View>
                            </>
                        )}
                    </ScrollView>

                    <View style={[styles.footer, { borderTopColor: borderColor }]}>
                        <GlassButton
                            title="Clear All"
                            variant="secondary"
                            style={styles.btn}
                            onPress={() => setFilters({ availableOnly: false, connectors: [], powerRatings: [], cpos: [] })}
                        />
                        <GlassButton
                            title="Show Results"
                            style={styles.btn}
                            onPress={() => onApply(filters)}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    content: { height: '80%', borderTopLeftRadius: 24, borderTopRightRadius: 24 },
    header: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', padding: SPACING.lg, borderBottomWidth: 1 },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 18 },
    closeBtn: { position: 'absolute', right: SPACING.lg },
    scroll: { flex: 1 },
    scrollContent: { padding: SPACING.lg },
    sectionTitle: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.sm, letterSpacing: 0.5 },
    chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
    chipText: { ...TYPOGRAPHY.body, fontSize: 14, fontWeight: '500' },
    footer: { flexDirection: 'row', padding: SPACING.lg, borderTopWidth: 1, gap: SPACING.md, paddingBottom: 40 },
    btn: { flex: 1 }
});
