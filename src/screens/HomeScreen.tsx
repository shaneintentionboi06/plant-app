import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeroBanner } from '../components/HeroBanner';
import { FilterChips } from '../components/FilterChips';
import { PlantCard } from '../components/PlantCard';
import { PLANTS_DATA, PlantSpecimen } from '../data/plants';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useZoneStore } from '../store/useZoneStore';
import { useCartStore } from '../store/useCartStore';

interface HomeScreenProps {
  onSelectPlant: (plant: PlantSpecimen) => void;
  searchQuery?: string;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPlant,
  searchQuery = '',
}) => {
  const { isDesktop, numColumns } = useResponsive();
  const { currentZone, currentCity, openZonePicker } = useZoneStore();
  const addItem = useCartStore((s) => s.addItem);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Filter plants based on category and search query
  const filteredPlants = useMemo(() => {
    let list = [...PLANTS_DATA];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.commonName.toLowerCase().includes(q) ||
          p.botanicalName.toLowerCase().includes(q) ||
          p.family.toLowerCase().includes(q)
      );
    }

    if (selectedCategory !== 'all') {
      if (selectedCategory === 'low-light') list = list.filter((p) => p.lowLight);
      if (selectedCategory === 'pet-friendly') list = list.filter((p) => p.petSafe);
      if (selectedCategory === 'air-purifying') list = list.filter((p) => p.airPurifying);
      if (selectedCategory === 'easy-care') list = list.filter((p) => p.easyCare);
      if (selectedCategory === 'under-35') list = list.filter((p) => p.price <= 35);
      if (selectedCategory === 'trees') list = list.filter((p) => p.tree);
    }

    return list;
  }, [selectedCategory, searchQuery]);

  // Top zone-recommended specimens
  const zoneRecommendations = useMemo(() => {
    return [...PLANTS_DATA]
      .filter((p) => (p.zoneMatchPercent[currentZone] || 80) >= 90)
      .slice(0, 4);
  }, [currentZone]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.innerContent, isDesktop && styles.desktopInner]}>
        {/* Editorial Hero Banner */}
        <HeroBanner
          onExplore={() => setSelectedCategory('all')}
          onSelectFeatured={(id) => {
            const plant = PLANTS_DATA.find((p) => p.id === id);
            if (plant) onSelectPlant(plant);
          }}
        />

        {/* Location & Climate Context Bar */}
        <View style={styles.zoneBarWrapper}>
          <TouchableOpacity
            style={styles.zoneBar}
            activeOpacity={0.8}
            onPress={openZonePicker}
          >
            <View style={styles.zoneBarLeft}>
              <Ionicons name="location" size={16} color={Colors.secondary} />
              <Text style={styles.zoneBarText}>
                <Text style={styles.zoneBarMuted}>Thriving in: </Text>
                <Text style={styles.zoneBarBold}>{currentCity} </Text>
                <Text style={styles.zoneBarZone}>(Zone {currentZone})</Text>
              </Text>
            </View>
            <View style={styles.zoneBarRight}>
              <Text style={styles.zoneChangeText}>Change</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.secondary} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Requirement Filter Chips */}
        <FilterChips
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />

        {/* "Thriving in Your Area" Recommended Carousel */}
        {zoneRecommendations.length > 0 && selectedCategory === 'all' && (
          <View style={styles.zoneSection}>
            <View style={styles.sectionHeader}>
              <View>
                <View style={styles.sectionTitleRow}>
                  <Text style={styles.sectionTitle}>Thriving in Your Area</Text>
                  <View style={styles.zoneBadgePill}>
                    <Text style={styles.zoneBadgePillText}>Zone {currentZone}</Text>
                  </View>
                </View>
                <Text style={styles.sectionSubtitle}>
                  Optimized for regional humidity & moderate sun
                </Text>
              </View>
              <TouchableOpacity onPress={openZonePicker}>
                <Text style={styles.seeAllText}>Zone Info</Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.zoneScroll}
            >
              {zoneRecommendations.map((plant) => (
                <TouchableOpacity
                  key={plant.id}
                  style={styles.zoneMiniCard}
                  activeOpacity={0.9}
                  onPress={() => onSelectPlant(plant)}
                >
                  <View style={styles.zoneImageWrap}>
                    <Image source={{ uri: plant.imageUrl }} style={styles.zoneImage} />
                    <View style={styles.zoneMatchTag}>
                      <Text style={styles.zoneMatchTagText}>
                        {plant.zoneMatchPercent[currentZone] || 95}% Match
                      </Text>
                    </View>
                    <View style={styles.climateMiniTag}>
                      <Text style={styles.climateMiniTagText} numberOfLines={1}>
                        {plant.climateTag}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.zoneInfo}>
                    <Text style={styles.zonePlantName} numberOfLines={1}>
                      {plant.name}
                    </Text>
                    <Text style={styles.zoneCommonName} numberOfLines={1}>
                      {plant.botanicalName}
                    </Text>
                    <View style={styles.zonePriceRow}>
                      <Text style={styles.zonePrice}>${plant.price.toFixed(0)}</Text>
                      <TouchableOpacity
                        style={styles.zoneAddBtn}
                        onPress={() => addItem(plant, 'sm', 'sage', true, 1)}
                      >
                        <Ionicons name="add" size={14} color={Colors.onPrimary} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Botanical Catalog Grid */}
        <View style={styles.catalogSection}>
          <View style={styles.catalogHeader}>
            <Text style={styles.catalogTitle}>
              {selectedCategory === 'all'
                ? 'All Botanical Specimens'
                : `Filtered Plants (${filteredPlants.length})`}
            </Text>
            <Text style={styles.catalogCount}>
              Showing {filteredPlants.length} curated specimens
            </Text>
          </View>

          {/* Dynamic Grid */}
          <View style={[styles.gridContainer, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {filteredPlants.map((plant) => {
              // Calculate column percentage based on breakpoint
              const colWidth = `${100 / numColumns}%` as any;
              return (
                <View key={plant.id} style={{ width: colWidth }}>
                  <PlantCard plant={plant} onPress={onSelectPlant} />
                </View>
              );
            })}
          </View>

          {filteredPlants.length === 0 && (
            <View style={styles.emptyState}>
              <Ionicons name="leaf-outline" size={48} color={Colors.outline} />
              <Text style={styles.emptyTitle}>No botanical specimens found</Text>
              <Text style={styles.emptySubtitle}>
                Try clearing your search query or adjusting your filters.
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => setSelectedCategory('all')}
              >
                <Text style={styles.resetButtonText}>Show All Plants</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  innerContent: {
    width: '100%',
  },
  desktopInner: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  zoneBarWrapper: {
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: 4,
  },
  zoneBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(245, 243, 239, 0.9)',
    borderRadius: Radii.full,
    paddingHorizontal: 16,
    paddingVertical: 10,
    ...Shadows.sm,
  },
  zoneBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  zoneBarText: {
    fontSize: 12,
  },
  zoneBarMuted: {
    color: Colors.onSurfaceVariant,
  },
  zoneBarBold: {
    color: Colors.primary,
    fontWeight: '700',
  },
  zoneBarZone: {
    color: Colors.secondary,
    fontWeight: '600',
  },
  zoneBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  zoneChangeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  zoneSection: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    marginBottom: 10,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  zoneBadgePill: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  zoneBadgePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
  },
  zoneScroll: {
    paddingHorizontal: Spacing.marginMobile,
    gap: 12,
    paddingVertical: 6,
  },
  zoneMiniCard: {
    width: 155,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
  },
  zoneImageWrap: {
    width: '100%',
    aspectRatio: 1.1,
    position: 'relative',
    backgroundColor: Colors.surfaceContainerLow,
  },
  zoneImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  zoneMatchTag: {
    position: 'absolute',
    top: 6,
    left: 6,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  zoneMatchTagText: {
    color: Colors.onSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
  climateMiniTag: {
    position: 'absolute',
    bottom: 6,
    left: 6,
    right: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  climateMiniTagText: {
    fontSize: 9,
    color: Colors.onSurface,
    fontWeight: '600',
  },
  zoneInfo: {
    padding: 10,
    gap: 2,
  },
  zonePlantName: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  zoneCommonName: {
    fontSize: 10,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  zonePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  zonePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  zoneAddBtn: {
    width: 24,
    height: 24,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  catalogSection: {
    paddingTop: Spacing.md,
    paddingHorizontal: Spacing.marginMobile - 6,
  },
  catalogHeader: {
    paddingHorizontal: 6,
    marginBottom: 8,
  },
  catalogTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 20,
    fontWeight: '600',
    color: Colors.primary,
  },
  catalogCount: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  gridContainer: {
    width: '100%',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },
  emptyTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  emptySubtitle: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 280,
  },
  resetButton: {
    marginTop: 12,
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: Radii.md,
  },
  resetButtonText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
});
