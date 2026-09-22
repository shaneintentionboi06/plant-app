import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';

export type LightLevel = 'any' | 'bright' | 'medium' | 'low';

export interface FinderPreferences {
  light: LightLevel;
  petFriendly: boolean;
  easyCare: boolean;
  airPurifying: boolean;
  largePlants: boolean;
}

export const EMPTY_FINDER: FinderPreferences = {
  light: 'any',
  petFriendly: false,
  easyCare: false,
  airPurifying: false,
  largePlants: false,
};

interface PlantFinderProps {
  draft: FinderPreferences;
  onDraftChange: (prefs: FinderPreferences) => void;
  onApply: () => void;
  matchCount: number;
}

const LIGHT_OPTIONS: { id: LightLevel; label: string; icon: string }[] = [
  { id: 'bright', label: 'Bright Light', icon: 'sunny-outline' },
  { id: 'medium', label: 'Medium Light', icon: 'partly-sunny-outline' },
  { id: 'low', label: 'Low Light', icon: 'cloudy-outline' },
];

const PREF_OPTIONS: {
  id: keyof Omit<FinderPreferences, 'light'>;
  label: string;
  icon: string;
}[] = [
  { id: 'petFriendly', label: 'Pet Friendly', icon: 'paw-outline' },
  { id: 'easyCare', label: 'Easy Care', icon: 'water-outline' },
  { id: 'airPurifying', label: 'Air Purifying', icon: 'leaf-outline' },
  { id: 'largePlants', label: 'Large Plants', icon: 'tree' },
];

export const PlantFinder: React.FC<PlantFinderProps> = ({
  draft,
  onDraftChange,
  onApply,
  matchCount,
}) => {
  const { isDesktop } = useResponsive();
  const [focused, setFocused] = useState(false);

  const togglePref = (id: keyof Omit<FinderPreferences, 'light'>) => {
    onDraftChange({ ...draft, [id]: !draft[id] });
  };

  const activePrefCount =
    (draft.light !== 'any' ? 1 : 0) +
    [draft.petFriendly, draft.easyCare, draft.airPurifying, draft.largePlants].filter(
      Boolean
    ).length;

  return (
    <View
      style={[styles.card, isDesktop && styles.cardDesktop]}
      accessible
      accessibilityLabel="Find your perfect plant"
    >
      <View style={styles.headingRow}>
        <View style={styles.headingText}>
          <Text style={styles.eyebrow}>Plant Finder</Text>
          <Text style={styles.title}>Find Your Perfect Plant</Text>
          <Text style={styles.subtitle}>
            Tell us about your space and we will match plants to your light, lifestyle and
            growing zone.
          </Text>
        </View>
        {activePrefCount > 0 && (
          <View style={styles.livePill}>
            <View style={styles.liveDot} />
            <Text style={styles.liveText}>
              {matchCount} {matchCount === 1 ? 'match' : 'matches'}
            </Text>
          </View>
        )}
      </View>

      <Text style={styles.groupLabel}>What&apos;s your space like?</Text>
      <View style={styles.optionRow}>
        {LIGHT_OPTIONS.map((opt) => {
          const selected = draft.light === opt.id;
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, selected && styles.optionSelected]}
              activeOpacity={0.85}
              onPress={() =>
                onDraftChange({ ...draft, light: selected ? 'any' : opt.id })
              }
              accessibilityRole="button"
              accessibilityLabel={`${opt.label} light`}
              accessibilityState={{ selected }}
            >
              <Ionicons
                name={opt.icon as any}
                size={20}
                color={selected ? Colors.onPrimary : Colors.secondary}
              />
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.groupLabel}>What&apos;s important to you?</Text>
      <View style={styles.optionRow}>
        {PREF_OPTIONS.map((opt) => {
          const selected = draft[opt.id];
          return (
            <TouchableOpacity
              key={opt.id}
              style={[styles.option, selected && styles.optionSelected]}
              activeOpacity={0.85}
              onPress={() => togglePref(opt.id)}
              accessibilityRole="button"
              accessibilityLabel={opt.label}
              accessibilityState={{ selected }}
            >
              {opt.icon === 'tree' ? (
                <MaterialCommunityIcons
                  name="tree"
                  size={20}
                  color={selected ? Colors.onPrimary : Colors.secondary}
                />
              ) : (
                <Ionicons
                  name={opt.icon as any}
                  size={20}
                  color={selected ? Colors.onPrimary : Colors.secondary}
                />
              )}
              <Text style={[styles.optionText, selected && styles.optionTextSelected]}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.footerRow}>
        <TouchableOpacity
          style={[styles.cta, focused && styles.ctaFocused]}
          activeOpacity={0.88}
          onPress={onApply}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          accessibilityRole="button"
          accessibilityLabel="Find my plants"
        >
          <Text style={styles.ctaText}>Find My Plants</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.onPrimary} />
        </TouchableOpacity>
        {draft.light !== 'any' ||
        draft.petFriendly ||
        draft.easyCare ||
        draft.airPurifying ||
        draft.largePlants ? (
          <TouchableOpacity
            onPress={() => onDraftChange({ ...EMPTY_FINDER })}
            accessibilityRole="button"
            accessibilityLabel="Clear plant finder selections"
          >
            <Text style={styles.clearText}>Clear all</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    padding: Spacing.lg,
    gap: 14,
    ...Shadows.sm,
  },
  cardDesktop: {
    padding: Spacing.xl,
  },
  headingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headingText: {
    flex: 1,
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  title: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.onSurfaceVariant,
  },
  livePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.secondaryTender,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.full,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.secondary,
  },
  liveText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
  },
  groupLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.onSurfaceVariant,
    marginTop: 4,
  },
  optionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  optionSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  optionTextSelected: {
    color: Colors.onPrimary,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 4,
  },
  cta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: Radii.md,
    ...Shadows.sm,
  },
  ctaFocused: {
    borderWidth: 2,
    borderColor: Colors.secondary,
  },
  ctaText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  clearText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
    textDecorationLine: 'underline',
  },
});
