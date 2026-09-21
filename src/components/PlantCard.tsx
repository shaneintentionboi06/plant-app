import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { PlantSpecimen } from '../data/plants';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useZoneStore } from '../store/useZoneStore';

interface PlantCardProps {
  plant: PlantSpecimen;
  onPress: (plant: PlantSpecimen) => void;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress }) => {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const currentZone = useZoneStore((s) => s.currentZone);

  const favorited = isWishlisted(plant.id);
  const matchPercent = plant.zoneMatchPercent[currentZone] || 90;

  const handleQuickAdd = (e: any) => {
    e.stopPropagation?.();
    addItem(plant, plant.sizes[0]?.id || 'sm', plant.vessels[0]?.id || 'sage', true, 1);
  };

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.92}
      onPress={() => onPress(plant)}
    >
      {/* Image Container */}
      <View style={styles.imageWrap}>
        <Image source={{ uri: plant.imageUrl }} style={styles.image} />

        {/* Top Badges */}
        <View style={styles.badgeRow}>
          {plant.bestseller ? (
            <View style={styles.bestsellerBadge}>
              <Ionicons name="sparkles" size={10} color={Colors.primary} />
              <Text style={styles.bestsellerText}>Bestseller</Text>
            </View>
          ) : (
            <View style={styles.zoneBadge}>
              <Text style={styles.zoneBadgeText}>{matchPercent}% Match</Text>
            </View>
          )}

          {plant.petSafe && (
            <View style={styles.petSafeBadge}>
              <Ionicons name="paw" size={10} color={Colors.secondary} />
              <Text style={styles.petSafeText}>Pet Safe</Text>
            </View>
          )}
        </View>

        {/* Wishlist Heart Button */}
        <TouchableOpacity
          style={styles.wishlistButton}
          activeOpacity={0.8}
          onPress={() => toggleWishlist(plant.id)}
          accessibilityLabel="Save to Wishlist"
        >
          <Ionicons
            name={favorited ? 'heart' : 'heart-outline'}
            size={18}
            color={favorited ? '#e11d48' : Colors.primary}
          />
        </TouchableOpacity>

        {/* Bottom Climate Tag Overlay */}
        {plant.climateTag && (
          <View style={styles.climateTagPill}>
            <Text style={styles.climateTagText} numberOfLines={1}>
              {plant.climateTag}
            </Text>
          </View>
        )}
      </View>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        <View style={styles.titleRow}>
          <Text style={styles.plantTitle} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={styles.commonName} numberOfLines={1}>
            {plant.commonName}
          </Text>
        </View>

        {/* Price & Quick Add Button */}
        <View style={styles.priceRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceText}>${plant.price.toFixed(2)}</Text>
            {plant.originalPrice && (
              <Text style={styles.originalPriceText}>
                ${plant.originalPrice.toFixed(2)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={styles.quickAddButton}
            activeOpacity={0.8}
            onPress={handleQuickAdd}
            accessibilityLabel={`Add ${plant.name} to bag`}
          >
            <Ionicons name="add" size={18} color={Colors.onPrimary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
    flex: 1,
    margin: 6,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  badgeRow: {
    position: 'absolute',
    top: 8,
    left: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    zIndex: 2,
  },
  bestsellerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
    gap: 3,
  },
  bestsellerText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  zoneBadge: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  zoneBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.onSecondary,
  },
  petSafeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 249, 245, 0.9)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radii.full,
    gap: 3,
  },
  petSafeText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.secondary,
  },
  wishlistButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    ...Shadows.sm,
  },
  climateTagPill: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    right: 8,
    backgroundColor: 'rgba(251, 249, 245, 0.92)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  climateTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  infoContainer: {
    padding: Spacing.sm + 2,
    gap: 8,
  },
  titleRow: {
    gap: 2,
  },
  plantTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 15,
    fontWeight: '600',
    color: Colors.primary,
  },
  commonName: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  priceBlock: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 6,
  },
  priceText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  originalPriceText: {
    fontSize: 12,
    color: Colors.outline,
    textDecorationLine: 'line-through',
  },
  quickAddButton: {
    width: 30,
    height: 30,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.sm,
  },
});
