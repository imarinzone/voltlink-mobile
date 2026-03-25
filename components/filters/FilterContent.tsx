import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { X } from 'phosphor-react-native';
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

interface FilterContentProps {
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
    onClose: () => void;
    stations: Station[];
    myVehicle?: any;
}

const CONNECTOR_TYPES = ['Type 2', 'CCS2', 'CHAdeMO', 'AC Type 2'];
const POWER_RATINGS = ['AC', 'DC Fast'];

export const FilterContent = ({ currentFilters, onApply, onClose, stations, myVehicle }: FilterContentProps) => {
    const { theme } = useThemeStore();
    const isDark = theme === 'dark';

    const allCpos = Array.from(new Set(stations.map(s => s.cpoName).filter(Boolean)));

    const [filters, setFilters] = useState<FilterState>(currentFilters);

    useEffect(() => {
        if (currentFilters.connectors.length === 0 && myVehicle?.model) {
            let defaultConnectors = ['CCS2'];
            const model = myVehicle.model.toLowerCase();
            if (model.includes('ather') || model.includes('ola') || model.includes('chetak')) {
                defaultConnectors = ['Type 2'];
            }
            setFilters(prev => ({ ...prev, connectors: defaultConnectors }));
        } else {
            setFilters(currentFilters);
        }
    }, [myVehicle, currentFilters]);

    const toggleArrayItem = (array: string[], item: string) => {
        return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
    };

    const textPrimary = isDark ? COLORS.textPrimaryDark : COLORS.textPrimaryLight;
    const textSecondary = isDark ? COLORS.textSecondaryDark : COLORS.textSecondaryLight;
    const borderColor = isDark ? COLORS.cardBorder : 'rgba(0,0,0,0.1)';
    const inputBg = isDark ? COLORS.inputBg : 'rgba(0,0,0,0.05)';

    const renderChip = (label: string, isSelected: boolean, onPress: () => void) => (
        <TouchableOpacity
            onPress={onPress}
            style={[
                styles.chip,
                { backgroundColor: inputBg, borderColor },
                isSelected && { backgroundColor: 'rgba(4,234,170,0.15)', borderColor: COLORS.primaryGreen }
            ]}
        >
            <Text style={[styles.chipText, { color: isSelected ? COLORS.primaryGreen : textPrimary }]}>
                {label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={[styles.header, { borderBottomColor: borderColor }]}>
                <Text style={[styles.title, { color: textPrimary }]}>Filters</Text>
                <TouchableOpacity onPress={onClose} style={[styles.closeBtn, { backgroundColor: isDark ? COLORS.hoverBg : 'rgba(0,0,0,0.05)' }]}>
                    <X weight="duotone" color={textSecondary} size={20} />
                </TouchableOpacity>
            </View>

            <View style={[styles.actionRowTop, { borderBottomColor: borderColor }]}>
                <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: inputBg }]}
                    onPress={() => setFilters({ availableOnly: false, connectors: [], powerRatings: [], cpos: [] })}
                >
                    <Text style={[styles.smallBtnText, { color: textSecondary }]}>Clear All</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.smallBtn, { backgroundColor: COLORS.primaryGreen }]}
                    onPress={() => onApply(filters)}
                >
                    <Text style={[styles.smallBtnText, { color: COLORS.darkBg }]}>Apply Filters</Text>
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}>
                <Text style={[styles.sectionTitle, { color: textSecondary }]}>Status</Text>
                <View style={styles.chipGroup}>
                    {renderChip('Available Now', filters.availableOnly, () => setFilters(f => ({ ...f, availableOnly: !f.availableOnly })))}
                </View>

                <Text style={[styles.sectionTitle, { color: textSecondary, marginTop: SPACING.lg }]}>Power Rating</Text>
                <View style={styles.chipGroup}>
                    {POWER_RATINGS.map(rating =>
                        renderChip(rating, filters.powerRatings.includes(rating), () =>
                            setFilters(f => ({ ...f, powerRatings: toggleArrayItem(f.powerRatings, rating) }))
                        )
                    )}
                </View>

                <Text style={[styles.sectionTitle, { color: textSecondary, marginTop: SPACING.lg }]}>Connector Types</Text>
                <View style={styles.chipGroup}>
                    {CONNECTOR_TYPES.map(type =>
                        renderChip(type, filters.connectors.includes(type), () =>
                            setFilters(f => ({ ...f, connectors: toggleArrayItem(f.connectors, type) }))
                        )
                    )}
                </View>

                {allCpos.length > 0 && (
                    <>
                        <Text style={[styles.sectionTitle, { color: textSecondary, marginTop: SPACING.lg }]}>Brand / CPO</Text>
                        <View style={styles.chipGroup}>
                            {allCpos.map((cpo) =>
                                renderChip(cpo, filters.cpos.includes(cpo), () =>
                                    setFilters(f => ({ ...f, cpos: toggleArrayItem(f.cpos, cpo) }))
                                )
                            )}
                        </View>
                    </>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingVertical: SPACING.md,
        alignItems: 'center',
        borderBottomWidth: 1,
        position: 'relative',
    },
    title: { ...TYPOGRAPHY.sectionHeader, fontSize: 17, fontWeight: '700' },
    closeBtn: {
        position: 'absolute',
        right: SPACING.lg,
        top: SPACING.md,
        padding: 4,
        borderRadius: BORDER_RADIUS.md,
    },
    actionRowTop: {
        flexDirection: 'row',
        padding: SPACING.md,
        paddingHorizontal: SPACING.lg,
        gap: SPACING.md,
        borderBottomWidth: 1,
    },
    smallBtn: {
        flex: 1,
        height: 42,
        borderRadius: BORDER_RADIUS.md,
        justifyContent: 'center',
        alignItems: 'center',
    },
    smallBtnText: {
        ...TYPOGRAPHY.label,
        fontWeight: '700',
        fontSize: 13,
    },
    scroll: { flex: 1 },
    scrollContent: { padding: SPACING.lg, paddingBottom: 100 },
    sectionTitle: { ...TYPOGRAPHY.label, fontWeight: '700', marginBottom: SPACING.sm, letterSpacing: 0.5, fontSize: 11 },
    chipGroup: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm },
    chip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: BORDER_RADIUS.md, borderWidth: 1 },
    chipText: { ...TYPOGRAPHY.body, fontSize: 13, fontWeight: '600' },
});
