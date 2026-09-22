import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing } from '../constants/theme';

export interface FilterChipOption {
  id: string;
  label: string;
  iconName: string;
  iconType: 'ionicons' | 'material';
}

const CHIPS: FilterChipOption[] = [
  { id: 'all', label: 'All Plants', iconName: 'leaf', iconType: 'material' },
  { id: 'low-light', label: 'Low Light', iconName: 'cloudy-outline', iconType: 'ionicons' },
  { id: 'pet-friendly', label: 'Pet Friendly', iconName: 'paw-outline', iconType: 'ionicons' },
  { id: 'air-purifying', label: 'Air Purifying', iconName: 'weather-windy', iconType: 'material' },
  { id: 'easy-care', label: 'Easy Care', iconName: 'water-outline', iconType: 'ionicons' },
  { id: 'under-3000', label: 'Under ₹3,000', iconName: 'pricetag-outline', iconType: 'ionicons' },
  { id: 'trees', label: 'Large Trees', iconName: 'tree', iconType: 'material' },
];

interface FilterChipsProps {
  selectedCategory: string;
  onSelectCategory: (id: string) => void;
}

export const FilterChips: React.FC<FilterChipsProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CHIPS.map((chip) => {
          const isSelected = selectedCategory === chip.id;
          return (
            <TouchableOpacity
              key={chip.id}
              style={[styles.chip, isSelected && styles.chipActive]}
              onPress={() => onSelectCategory(chip.id)}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={`Filter by ${chip.label}`}
              accessibilityState={{ selected: isSelected }}
            >
              {chip.iconType === 'ionicons' ? (
                <Ionicons
                  name={chip.iconName as any}
                  size={15}
                  color={isSelected ? Colors.onPrimary : Colors.secondary}
                />
              ) : (
                <MaterialCommunityIcons
                  name={chip.iconName as any}
                  size={15}
                  color={isSelected ? Colors.onPrimary : Colors.secondary}
                />
              )}
              <Text
                style={[styles.chipText, isSelected && styles.chipTextActive]}
              >
                {chip.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: Spacing.sm,
  },
  scrollContent: {
    paddingHorizontal: Spacing.marginMobile,
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.full,
    gap: 6,
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  chipTextActive: {
    color: Colors.onPrimary,
  },
});
