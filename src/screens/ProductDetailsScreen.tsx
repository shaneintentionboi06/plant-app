import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { PlantSpecimen } from '../data/plants';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useZoneStore } from '../store/useZoneStore';

interface ProductDetailsScreenProps {
  plant: PlantSpecimen;
  onBack: () => void;
  onGoToCart: () => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  plant,
  onBack,
  onGoToCart,
}) => {
  const { isDesktop } = useResponsive();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const currentZone = useZoneStore((s) => s.currentZone);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSizeId, setSelectedSizeId] = useState(plant.sizes[1]?.id || plant.sizes[0]?.id);
  const [selectedVesselId, setSelectedVesselId] = useState(plant.vessels[0]?.id);
  const [drainage, setDrainage] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);

  const favorited = isWishlisted(plant.id);
  const selectedSize = plant.sizes.find((s) => s.id === selectedSizeId) || plant.sizes[0];
  const selectedVessel = plant.vessels.find((v) => v.id === selectedVesselId) || plant.vessels[0];

  const currentPrice = plant.price + (selectedSize?.priceDelta || 0) + (selectedVessel?.priceDelta || 0);
  const allImages = [plant.imageUrl, ...(plant.additionalImages || [])];

  const handleAddToCart = () => {
    addItem(plant, selectedSizeId, selectedVesselId, drainage, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  return (
    <View style={styles.screenWrapper}>
      {/* Top Navigation Bar */}
      <View style={[styles.topBar, isDesktop && styles.desktopTopBar]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={onBack}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.primary} />
          {isDesktop && <Text style={styles.backButtonText}>Back to Catalog</Text>}
        </TouchableOpacity>

        <Text style={styles.topBarTitle} numberOfLines={1}>
          {plant.name}
        </Text>

        <View style={styles.topBarActions}>
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => toggleWishlist(plant.id)}
          >
            <Ionicons
              name={favorited ? 'heart' : 'heart-outline'}
              size={22}
              color={favorited ? '#e11d48' : Colors.primary}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.contentLayout, isDesktop && styles.desktopLayout]}>
          {/* Left Column: Visual Showcase Gallery */}
          <View style={[styles.galleryColumn, isDesktop && styles.desktopGallery]}>
            {/* Main Featured Image */}
            <View style={styles.mainImageWrap}>
              <Image
                source={{ uri: allImages[selectedImageIndex] || plant.imageUrl }}
                style={styles.mainImage}
              />
              <View style={styles.overlayBadges}>
                {plant.bestseller && (
                  <View style={styles.bestsellerBadge}>
                    <Ionicons name="sparkles" size={12} color={Colors.primary} />
                    <Text style={styles.bestsellerText}>Bestseller</Text>
                  </View>
                )}
                {plant.petSafe ? (
                  <View style={styles.petSafeBadge}>
                    <Ionicons name="paw" size={12} color={Colors.secondary} />
                    <Text style={styles.petSafeText}>100% Pet Safe</Text>
                  </View>
                ) : (
                  <View style={styles.petWarningBadge}>
                    <Ionicons name="warning-outline" size={12} color="#b45309" />
                    <Text style={styles.petWarningText}>Pet Alert</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.thumbnailStrip}
              >
                {allImages.map((img, idx) => (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.thumbnailBtn,
                      selectedImageIndex === idx && styles.thumbnailBtnActive,
                    ]}
                    onPress={() => setSelectedImageIndex(idx)}
                    activeOpacity={0.8}
                  >
                    <Image source={{ uri: img }} style={styles.thumbnailImage} />
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Right Column: Taxonomy, Specs, Variants & Buy Box */}
          <View style={[styles.infoColumn, isDesktop && styles.desktopInfo]}>
            {/* Classification Header */}
            <View style={styles.taxonomyBlock}>
              <View style={styles.familyRow}>
                <Text style={styles.familyText}>{plant.family}</Text>
                <View style={styles.ratingPill}>
                  <Ionicons name="star" size={13} color="#d97706" />
                  <Text style={styles.ratingScore}>{plant.rating}</Text>
                  <Text style={styles.ratingCount}>({plant.reviewCount})</Text>
                </View>
              </View>

              <Text style={styles.productTitle}>{plant.name}</Text>
              <Text style={styles.botanicalSubtitle}>{plant.botanicalName}</Text>
            </View>

            {/* Pricing Bar */}
            <View style={styles.priceRow}>
              <View style={styles.priceGroup}>
                <Text style={styles.currentPrice}>${currentPrice.toFixed(2)}</Text>
                {plant.originalPrice && (
                  <Text style={styles.originalPrice}>
                    ${(plant.originalPrice + (selectedSize?.priceDelta || 0)).toFixed(2)}
                  </Text>
                )}
                {plant.originalPrice && (
                  <View style={styles.saveBadge}>
                    <Text style={styles.saveBadgeText}>
                      Save ${(plant.originalPrice - plant.price).toFixed(0)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.guaranteeTag}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.secondary} />
                <Text style={styles.guaranteeText}>30-Day Guarantee</Text>
              </View>
            </View>

            {/* Zone Compatibility Banner */}
            <View style={styles.zoneBanner}>
              <View style={styles.zoneBannerLeft}>
                <MaterialCommunityIcons name="leaf" size={18} color={Colors.secondary} />
                <View>
                  <Text style={styles.zoneBannerTitle}>
                    {plant.zoneMatchPercent[currentZone] || 90}% Thriving Match for Zone {currentZone}
                  </Text>
                  <Text style={styles.zoneBannerSub}>{plant.climateTag}</Text>
                </View>
              </View>
            </View>

            {/* Description */}
            <Text style={styles.descriptionText}>{plant.description}</Text>

            {/* Specimen Size Selector */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>
                Specimen Size: <Text style={styles.selectedLabelText}>{selectedSize?.name}</Text>
              </Text>
              <View style={styles.pillRow}>
                {plant.sizes.map((s) => {
                  const isSelected = selectedSizeId === s.id;
                  return (
                    <TouchableOpacity
                      key={s.id}
                      style={[styles.optionPill, isSelected && styles.optionPillActive]}
                      onPress={() => setSelectedSizeId(s.id)}
                      activeOpacity={0.8}
                    >
                      <Text style={[styles.optionPillText, isSelected && styles.optionPillTextActive]}>
                        {s.name}
                      </Text>
                      <Text style={[styles.optionPillSub, isSelected && styles.optionPillSubActive]}>
                        {s.potDiameter}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Vessel / Pot Color Selector */}
            <View style={styles.sectionBlock}>
              <Text style={styles.sectionLabel}>
                Vessel & Finish: <Text style={styles.selectedLabelText}>{selectedVessel?.name}</Text>
              </Text>
              <View style={styles.swatchRow}>
                {plant.vessels.map((v) => {
                  const isSelected = selectedVesselId === v.id;
                  return (
                    <TouchableOpacity
                      key={v.id}
                      style={[styles.swatchBtn, isSelected && styles.swatchBtnActive]}
                      onPress={() => setSelectedVesselId(v.id)}
                      activeOpacity={0.8}
                    >
                      <View style={[styles.colorCircle, { backgroundColor: v.colorHex }]} />
                      <Text style={[styles.swatchText, isSelected && styles.swatchTextActive]}>
                        {v.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Drainage Toggle */}
            <TouchableOpacity
              style={styles.drainageRow}
              activeOpacity={0.8}
              onPress={() => setDrainage(!drainage)}
            >
              <View style={styles.drainageTextWrap}>
                <Ionicons name="water-outline" size={18} color={Colors.primary} />
                <View>
                  <Text style={styles.drainageTitle}>Drainage Hole & Matching Saucer</Text>
                  <Text style={styles.drainageSub}>Prevents root rot and overwatering</Text>
                </View>
              </View>
              <Ionicons
                name={drainage ? 'checkbox' : 'square-outline'}
                size={22}
                color={drainage ? Colors.primary : Colors.outline}
              />
            </TouchableOpacity>

            {/* Botanical Care Specs Grid */}
            <View style={styles.careSection}>
              <Text style={styles.careSectionTitle}>Horticultural Care Protocol</Text>
              <View style={styles.careGrid}>
                <View style={styles.careCard}>
                  <Ionicons name="sunny-outline" size={20} color={Colors.secondary} />
                  <Text style={styles.careCardTitle}>Sunlight</Text>
                  <Text style={styles.careCardDesc}>{plant.care.light}</Text>
                </View>

                <View style={styles.careCard}>
                  <Ionicons name="water-outline" size={20} color={Colors.secondary} />
                  <Text style={styles.careCardTitle}>Water Cadence</Text>
                  <Text style={styles.careCardDesc}>{plant.care.waterFrequency}</Text>
                </View>

                <View style={styles.careCard}>
                  <Ionicons name="thermometer-outline" size={20} color={Colors.secondary} />
                  <Text style={styles.careCardTitle}>Temperature & Humidity</Text>
                  <Text style={styles.careCardDesc}>{plant.care.temperature} • {plant.care.humidity}</Text>
                </View>

                <View style={styles.careCard}>
                  <Ionicons name="shield-outline" size={20} color={Colors.secondary} />
                  <Text style={styles.careCardTitle}>Difficulty & Toxicity</Text>
                  <Text style={styles.careCardDesc}>
                    {plant.care.difficulty} Care • {plant.care.toxicity}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Floating Add to Bag Notification Toast */}
      {addedToast && (
        <View style={styles.toast}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.secondaryContainer} />
          <Text style={styles.toastText}>Added {plant.name} to Botanical Bag!</Text>
          <TouchableOpacity onPress={onGoToCart}>
            <Text style={styles.toastAction}>View Bag</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sticky Bottom Buy Bar */}
      <View style={styles.bottomBar}>
        <View style={[styles.bottomBarInner, isDesktop && styles.desktopBottomBarInner]}>
          {/* Quantity Counter */}
          <View style={styles.quantityCounter}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={16} color={Colors.onSurface} />
            </TouchableOpacity>
            <Text style={styles.qtyText}>{quantity}</Text>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={16} color={Colors.onSurface} />
            </TouchableOpacity>
          </View>

          {/* Price & Add Button */}
          <TouchableOpacity
            style={styles.addToCartBtn}
            activeOpacity={0.85}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartBtnText}>
              Add to Bag • ${(currentPrice * quantity).toFixed(2)}
            </Text>
            <Ionicons name="bag-add-outline" size={20} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenWrapper: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  topBar: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    backgroundColor: Colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceContainer,
    zIndex: 10,
  },
  desktopTopBar: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    paddingHorizontal: Spacing.marginDesktop,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 6,
  },
  backButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.primary,
  },
  topBarTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
    maxWidth: 220,
  },
  topBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionIconBtn: {
    padding: 6,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 110,
  },
  contentLayout: {
    padding: Spacing.marginMobile,
    gap: 20,
  },
  desktopLayout: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 40,
    padding: Spacing.marginDesktop,
  },
  galleryColumn: {
    width: '100%',
    gap: 12,
  },
  desktopGallery: {
    flex: 1,
    position: Platform.OS === 'web' ? ('sticky' as any) : 'relative',
    top: 20,
  },
  mainImageWrap: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
    ...Shadows.md,
  },
  mainImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  overlayBadges: {
    position: 'absolute',
    top: 14,
    left: 14,
    flexDirection: 'row',
    gap: 6,
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    gap: 4,
  },
  bestsellerText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primary,
  },
  petSafeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    gap: 4,
  },
  petSafeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.secondary,
  },
  petWarningBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.full,
    gap: 4,
  },
  petWarningText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#b45309',
  },
  thumbnailStrip: {
    gap: 10,
    paddingVertical: 4,
  },
  thumbnailBtn: {
    width: 68,
    height: 68,
    borderRadius: Radii.md,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
    backgroundColor: Colors.surfaceContainerLow,
  },
  thumbnailBtnActive: {
    borderColor: Colors.primary,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoColumn: {
    width: '100%',
    gap: 20,
  },
  desktopInfo: {
    flex: 1.1,
  },
  taxonomyBlock: {
    gap: 4,
  },
  familyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  familyText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ratingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    gap: 4,
  },
  ratingScore: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  ratingCount: {
    fontSize: 11,
    color: Colors.outline,
  },
  productTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 28,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  botanicalSubtitle: {
    fontSize: 14,
    fontStyle: 'italic',
    color: Colors.onSurfaceVariant,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  priceGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
  },
  currentPrice: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalPrice: {
    fontSize: 16,
    color: Colors.outline,
    textDecorationLine: 'line-through',
  },
  saveBadge: {
    backgroundColor: Colors.secondaryTender,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  saveBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
  },
  guaranteeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  guaranteeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.secondary,
  },
  zoneBanner: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  zoneBannerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  zoneBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  zoneBannerSub: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  descriptionText: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.onSurfaceVariant,
  },
  sectionBlock: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  selectedLabelText: {
    fontWeight: '400',
    color: Colors.onSurfaceVariant,
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionPill: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.md,
  },
  optionPillActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceContainerLow,
  },
  optionPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  optionPillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  optionPillSub: {
    fontSize: 10,
    color: Colors.outline,
    marginTop: 2,
  },
  optionPillSubActive: {
    color: Colors.secondary,
  },
  swatchRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  swatchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: Colors.surfaceContainerHigh,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: Radii.full,
  },
  swatchBtnActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.surfaceContainerLow,
  },
  colorCircle: {
    width: 16,
    height: 16,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  swatchText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  swatchTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  drainageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceContainerLowest,
    padding: 14,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerHigh,
  },
  drainageTextWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  drainageTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  drainageSub: {
    fontSize: 11,
    color: Colors.outline,
  },
  careSection: {
    gap: 12,
    marginTop: 8,
  },
  careSectionTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.primary,
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  careCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.md,
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
    width: '48%',
    gap: 4,
  },
  careCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  careCardDesc: {
    fontSize: 11,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
  },
  toast: {
    position: 'absolute',
    bottom: 84,
    left: 20,
    right: 20,
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    zIndex: 100,
    ...Shadows.md,
  },
  toastText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  toastAction: {
    color: Colors.secondaryContainer,
    fontSize: 13,
    fontWeight: '700',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(251, 249, 245, 0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.surfaceContainer,
    paddingHorizontal: Spacing.marginMobile,
    paddingVertical: 12,
    ...Shadows.lg,
  },
  bottomBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    width: '100%',
  },
  desktopBottomBarInner: {
    maxWidth: 1280,
    alignSelf: 'center',
  },
  quantityCounter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingHorizontal: 8,
    paddingVertical: 6,
    gap: 12,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  addToCartBtn: {
    flex: 1,
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...Shadows.sm,
  },
  addToCartBtnText: {
    color: Colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
});
