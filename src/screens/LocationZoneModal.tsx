import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useZoneStore } from '../store/useZoneStore';
import { GROWING_ZONES } from '../data/plants';

export const LocationZoneModal: React.FC = () => {
  const {
    isZonePickerOpen,
    closeZonePicker,
    currentZone,
    currentCity,
    setZone,
  } = useZoneStore();

  const [searchInput, setSearchInput] = useState('');

  const activeZoneData =
    GROWING_ZONES.find((z) => z.zone === currentZone) || GROWING_ZONES[0];

  const handleSelectZone = (z: (typeof GROWING_ZONES)[0]) => {
    setZone(z.zone, z.city, z.zip);
  };

  const handleCustomSearch = () => {
    const q = searchInput.trim().toLowerCase();
    if (!q) return;
    const found = GROWING_ZONES.find(
      (z) => z.zip.includes(q) || z.city.toLowerCase().includes(q) || z.zone.toLowerCase() === q
    );
    if (found) {
      handleSelectZone(found);
      setSearchInput('');
    }
  };

  return (
    <Modal
      visible={isZonePickerOpen}
      transparent
      animationType="fade"
      onRequestClose={closeZonePicker}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <Ionicons name="location" size={20} color={Colors.secondary} />
              <Text style={styles.headerTitle}>Growing Zone & Microclimate</Text>
            </View>
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={closeZonePicker}
              accessibilityRole="button"
              accessibilityLabel="Close modal"
            >
              <Ionicons name="close" size={20} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* Context Subtitle */}
            <Text style={styles.subtitle}>
              We calibrate botanical recommendations to your Indian growing zone, monsoon humidity, and local winter minimums.
            </Text>

            {/* Current Active Zone Banner */}
            <View style={styles.activeZoneCard}>
              <View style={styles.activeZoneHeader}>
                <View>
                  <Text style={styles.activeZoneTag}>Current Region</Text>
                  <Text style={styles.activeZoneCity}>{currentCity}</Text>
                  <Text style={styles.activeZoneCode}>Growing Zone {currentZone}</Text>
                </View>
                <View style={styles.badgeCircle}>
                  <Text style={styles.badgeCircleText}>{currentZone}</Text>
                </View>
              </View>
              <Text style={styles.activeZoneDesc}>{activeZoneData.desc}</Text>
            </View>

            {/* Search Input Bar */}
            <View style={styles.searchSection}>
              <Text style={styles.searchLabel}>Search PIN Code or City</Text>
              <View style={styles.searchRow}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="e.g. 400001 or Mumbai"
                  placeholderTextColor={Colors.outline}
                  value={searchInput}
                  onChangeText={setSearchInput}
                  onSubmitEditing={handleCustomSearch}
                />
                <TouchableOpacity
                  style={styles.searchBtn}
                  onPress={handleCustomSearch}
                  accessibilityRole="button"
                  accessibilityLabel="Search location"
                >
                  <Ionicons name="search" size={16} color={Colors.onPrimary} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Regional Presets */}
            <View style={styles.presetsSection}>
              <Text style={styles.presetsTitle}>Regional Climate Presets</Text>
              <View style={styles.presetsList}>
                {GROWING_ZONES.map((z) => {
                  const isCurrent = currentZone === z.zone;
                  return (
                    <TouchableOpacity
                      key={z.zone}
                      style={[styles.presetItem, isCurrent && styles.presetItemActive]}
                      onPress={() => handleSelectZone(z)}
                      activeOpacity={0.8}
                      accessibilityRole="button"
                      accessibilityLabel={`Select ${z.city}, zone ${z.zone}`}
                      accessibilityState={{ selected: isCurrent }}
                    >
                      <View style={styles.presetLeft}>
                        <View style={[styles.zonePill, isCurrent && styles.zonePillActive]}>
                          <Text style={[styles.zonePillText, isCurrent && styles.zonePillTextActive]}>
                            {z.zone}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.presetCity}>{z.city}</Text>
                          <Text style={styles.presetName}>{z.name}</Text>
                        </View>
                      </View>
                      {isCurrent && (
                        <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Climate Science Note */}
            <View style={styles.scienceCard}>
              <MaterialCommunityIcons name="molecule" size={18} color={Colors.secondary} />
              <Text style={styles.scienceText}>
                Specimens matched to your zone enjoy optimal leaf transpiration, lower dormancy shock, and naturally resilient root systems.
              </Text>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={closeZonePicker}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel="Apply and calibrate catalog"
            >
              <Text style={styles.applyButtonText}>Apply & Calibrate Catalog</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(1, 45, 29, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.marginMobile,
  },
  modalCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    width: '100%',
    maxWidth: 520,
    maxHeight: '90%',
    padding: Spacing.lg,
    ...Shadows.modal,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceContainer,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    paddingTop: Spacing.md,
    gap: 16,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: Colors.onSurfaceVariant,
  },
  activeZoneCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: 14,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  activeZoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  activeZoneTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
  },
  activeZoneCity: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  activeZoneCode: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  badgeCircle: {
    width: 44,
    height: 44,
    borderRadius: Radii.full,
    backgroundColor: Colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeCircleText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  activeZoneDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    lineHeight: 18,
  },
  searchSection: {
    gap: 6,
  },
  searchLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 9,
    fontSize: 13,
    color: Colors.onSurface,
  },
  searchBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presetsSection: {
    gap: 8,
  },
  presetsTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  presetsList: {
    gap: 8,
  },
  presetItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    padding: 10,
  },
  presetItemActive: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.surfaceContainerLow,
  },
  presetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  zonePill: {
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.md,
    minWidth: 40,
    alignItems: 'center',
  },
  zonePillActive: {
    backgroundColor: Colors.primary,
  },
  zonePillText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  zonePillTextActive: {
    color: Colors.onPrimary,
  },
  presetCity: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  presetName: {
    fontSize: 11,
    color: Colors.outline,
  },
  scienceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryTender,
    padding: 12,
    borderRadius: Radii.md,
    gap: 10,
  },
  scienceText: {
    fontSize: 11,
    color: Colors.secondary,
    lineHeight: 16,
    flex: 1,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  applyButtonText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
