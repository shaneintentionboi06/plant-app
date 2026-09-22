import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeroBanner } from '../components/HeroBanner';
import { FilterChips } from '../components/FilterChips';
import { PlantCard } from '../components/PlantCard';
import {
  PlantFinder,
  FinderPreferences,
  EMPTY_FINDER,
} from '../components/PlantFinder';
import {
  SectionHeading,
  ShopByNeed,
  FeaturedPlants,
  PlantJournal,
  GreenhousePreview,
  Newsletter,
  Footer,
} from '../components/HomeSections';
import type { HomeSection } from '../components/Header';
import { PLANTS_DATA, PlantSpecimen } from '../data/plants';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useZoneStore } from '../store/useZoneStore';
import { useWishlistStore } from '../store/useWishlistStore';

export interface SectionRequest {
  section: HomeSection;
  nonce: number;
}

interface HomeScreenProps {
  onSelectPlant: (plant: PlantSpecimen) => void;
  searchQuery?: string;
  sectionRequest?: SectionRequest | null;
  wishlistOnly?: boolean;
  onClearWishlist?: () => void;
  onOpenGreenhouse?: () => void;
  onOpenCart?: () => void;
  onNavigate?: (section: HomeSection) => void;
  onOpenArticle?: (slug: string) => void;
}

function matchesFinder(p: PlantSpecimen, prefs: FinderPreferences): boolean {
  if (prefs.light === 'low' && !p.lowLight) return false;
  if (prefs.light === 'bright' && p.lowLight) return false;
  if (prefs.petFriendly && !p.petSafe) return false;
  if (prefs.easyCare && !p.easyCare) return false;
  if (prefs.airPurifying && !p.airPurifying) return false;
  if (prefs.largePlants && !p.tree) return false;
  return true;
}

function hasPrefs(prefs: FinderPreferences): boolean {
  return (
    prefs.light !== 'any' ||
    prefs.petFriendly ||
    prefs.easyCare ||
    prefs.airPurifying ||
    prefs.largePlants
  );
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onSelectPlant,
  searchQuery = '',
  sectionRequest,
  wishlistOnly,
  onClearWishlist,
  onOpenGreenhouse,
  onOpenCart,
  onNavigate,
  onOpenArticle,
}) => {
  const { isDesktop, numColumns } = useResponsive();
  const { currentZone, currentCity, openZonePicker } = useZoneStore();
  const wishlistIds = useWishlistStore((s) => s.wishlistIds);
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Finder: live draft + applied set (applied on "Find My Plants")
  const [finderDraft, setFinderDraft] = useState<FinderPreferences>({ ...EMPTY_FINDER });
  const [appliedFinder, setAppliedFinder] = useState<FinderPreferences>({ ...EMPTY_FINDER });

  const scrollRef = useRef<ScrollView>(null);
  const sectionY = useRef<Record<string, number>>({});

  const scrollToSection = (section: HomeSection) => {
    const y = sectionY.current[section];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y: Math.max(0, y - 80), animated: true });
    } else if (section === 'top') {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
    }
  };

  useEffect(() => {
    if (sectionRequest) scrollToSection(sectionRequest.section);
  }, [sectionRequest]);

  const recordY = (section: HomeSection) => ({
    onLayout: (e: any) => {
      sectionY.current[section] = e.nativeEvent.layout.y;
    },
  });

  // Live match count for the finder UI (based on draft + zone)
  const draftMatchCount = useMemo(
    () => PLANTS_DATA.filter((p) => matchesFinder(p, finderDraft)).length,
    [finderDraft]
  );

  // Personalized recommendations: applied finder prefs, sorted by zone match
  const recommendations = useMemo(() => {
    const base = hasPrefs(appliedFinder)
      ? PLANTS_DATA.filter((p) => matchesFinder(p, appliedFinder))
      : PLANTS_DATA.filter((p) => (p.zoneMatchPercent[currentZone] || 80) >= 90);
    return [...base]
      .sort(
        (a, b) =>
          (b.zoneMatchPercent[currentZone] || 80) - (a.zoneMatchPercent[currentZone] || 80)
      )
      .slice(0, 4);
  }, [appliedFinder, currentZone]);

  // Catalog grid: search + chips + wishlist + applied finder (reuses one pipeline)
  const filteredPlants = useMemo(() => {
    let list = [...PLANTS_DATA];

    if (wishlistOnly) {
      list = list.filter((p) => wishlistIds.includes(p.id));
    }

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
      if (selectedCategory === 'under-3000') list = list.filter((p) => p.price <= 3000);
      if (selectedCategory === 'trees') list = list.filter((p) => p.tree);
    }

    if (hasPrefs(appliedFinder)) {
      list = list.filter((p) => matchesFinder(p, appliedFinder));
    }

    return list;
  }, [selectedCategory, searchQuery, wishlistOnly, wishlistIds, appliedFinder]);

  const handleApplyFinder = () => {
    setAppliedFinder({ ...finderDraft });
    setSelectedCategory('all');
    requestAnimationFrame(() => scrollToSection('shop'));
  };

  const handleNeedSelect = (id: string) => {
    setSelectedCategory(id);
    setAppliedFinder({ ...EMPTY_FINDER });
    scrollToSection('shop');
  };

  const go = (s: HomeSection) => {
    if (onNavigate) onNavigate(s);
    else scrollToSection(s);
  };

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.innerContent, isDesktop && styles.desktopInner]}>
        <View {...recordY('top')}>
          <HeroBanner
            onExplore={() => go('shop')}
            onFindPlant={() => go('finder')}
            onSelectFeatured={(id) => {
              const plant = PLANTS_DATA.find((p) => p.id === id);
              if (plant) onSelectPlant(plant);
            }}
            onNavigate={(s) => go(s)}
            onOpenCart={() => onOpenCart?.()}
            onOpenGreenhouse={() => onOpenGreenhouse?.()}
          />
        </View>

        {/* Location & Climate Context Bar */}
        <View style={styles.zoneBarWrapper}>
          <TouchableOpacity
            style={styles.zoneBar}
            activeOpacity={0.8}
            onPress={openZonePicker}
            accessibilityRole="button"
            accessibilityLabel={`Growing location ${currentCity}, zone ${currentZone}. Change.`}
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

        {/* Plant Finder */}
        <View style={styles.section} {...recordY('finder')}>
          <PlantFinder
            draft={finderDraft}
            onDraftChange={setFinderDraft}
            onApply={handleApplyFinder}
            matchCount={draftMatchCount}
          />
        </View>

        {/* Personalized recommendations */}
        <View style={styles.section}>
          <SectionHeading
            eyebrow={hasPrefs(appliedFinder) ? 'Matched to you' : `Zone ${currentZone}`}
            title="Plants That Fit Your Space"
            subtitle={
              hasPrefs(appliedFinder)
                ? 'Filtered by your finder preferences and ranked by zone match.'
                : 'Top climate matches for your growing zone.'
            }
            actionLabel="Refine"
            onAction={() => go('finder')}
          />
          {recommendations.length === 0 ? (
            <View style={styles.recoEmpty}>
              <Text style={styles.recoEmptyText}>
                No plants match that combination yet — try clearing a preference.
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setFinderDraft({ ...EMPTY_FINDER });
                  setAppliedFinder({ ...EMPTY_FINDER });
                }}
                accessibilityRole="button"
                accessibilityLabel="Clear finder preferences"
              >
                <Text style={styles.resetButtonText}>Clear Preferences</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={[styles.gridRow, { flexDirection: 'row', flexWrap: 'wrap' }]}>
              {recommendations.map((plant) => (
                <View key={plant.id} style={{ width: `${100 / numColumns}%` as any }}>
                  <PlantCard plant={plant} onPress={onSelectPlant} />
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Shop by need */}
        <View style={styles.section}>
          <ShopByNeed onSelect={handleNeedSelect} />
        </View>

        {/* Catalog grid */}
        <View style={styles.section} {...recordY('shop')}>
          <View style={styles.catalogHeader}>
            <Text style={styles.catalogTitle}>
              {wishlistOnly
                ? `Your Wishlist (${filteredPlants.length})`
                : selectedCategory === 'all'
                  ? 'Shop All Plants'
                  : `Filtered Plants (${filteredPlants.length})`}
            </Text>
            <Text style={styles.catalogCount}>
              {wishlistOnly
                ? 'Everything you have saved.'
                : `Showing ${filteredPlants.length} curated specimens`}
            </Text>
            {wishlistOnly && onClearWishlist ? (
              <TouchableOpacity onPress={onClearWishlist}>
                <Text style={styles.seeAllText}>Show all plants</Text>
              </TouchableOpacity>
            ) : null}
          </View>

          <FilterChips
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
          />

          <View style={[styles.gridRow, { flexDirection: 'row', flexWrap: 'wrap' }]}>
            {filteredPlants.map((plant) => {
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
              <Text style={styles.emptyTitle}>
                {wishlistOnly ? 'Your wishlist is empty' : 'No botanical specimens found'}
              </Text>
              <Text style={styles.emptySubtitle}>
                {wishlistOnly
                  ? 'Tap the heart on any plant to save it here.'
                  : 'Try clearing your search query or adjusting your filters.'}
              </Text>
              <TouchableOpacity
                style={styles.resetButton}
                onPress={() => {
                  setSelectedCategory('all');
                  setAppliedFinder({ ...EMPTY_FINDER });
                  if (wishlistOnly && onClearWishlist) onClearWishlist();
                }}
                accessibilityRole="button"
                accessibilityLabel="Show all plants"
              >
                <Text style={styles.resetButtonText}>Show All Plants</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Featured */}
        <View style={styles.section} {...recordY('featured')}>
          <FeaturedPlants onSelectPlant={onSelectPlant} />
        </View>

        {/* Journal */}
        <View style={styles.section} {...recordY('journal')}>
          <PlantJournal onOpenArticle={(slug) => onOpenArticle?.(slug)} />
        </View>

        {/* Greenhouse */}
        <View style={styles.section} {...recordY('greenhouse')}>
          <GreenhousePreview onOpen={() => onOpenGreenhouse?.()} />
        </View>

        {/* Newsletter */}
        <View style={styles.section} {...recordY('newsletter')}>
          <Newsletter />
        </View>

        {/* Footer */}
        <View style={styles.section}>
          <Footer onNavigate={go} />
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
  section: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.lg,
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
  gridRow: {
    width: '100%',
  },
  catalogHeader: {
    paddingHorizontal: 6,
    marginBottom: 8,
    gap: 2,
  },
  catalogTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 22,
    lineHeight: 28,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  catalogCount: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
  },
  recoEmpty: {
    alignItems: 'center',
    gap: 10,
    paddingVertical: 24,
  },
  recoEmptyText: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
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
