import React, { useState } from 'react';
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
import { formatINR } from '../utils/currency';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import { useZoneStore } from '../store/useZoneStore';

interface PlantCardProps {
  plant: PlantSpecimen;
  onPress: (plant: PlantSpecimen) => void;
  large?: boolean;
}

export const PlantCard: React.FC<PlantCardProps> = ({ plant, onPress, large }) => {
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const addItem = useCartStore((s) => s.addItem);
  const currentZone = useZoneStore((s) => s.currentZone);
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const favorited = isWishlisted(plant.id);
  const matchPercent = plant.zoneMatchPercent[currentZone] || 90;

  const handleQuickAdd = (e: any) => {
    e.stopPropagation?.();
    addItem(plant, plant.sizes[0]?.id || 'sm', plant.vessels[0]?.id || 'sage', true, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const hoverProps =
    Platform.OS === 'web'
      ? {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        }
      : {};

  return (
    <View
      style={[styles.card, hovered && styles.cardHovered]}
      {...(hoverProps as object)}
    >
      {/* Image Container — opens product details */}
      <TouchableOpacity
        style={[styles.imageWrap, large && styles.imageWrapLarge]}
        activeOpacity={0.94}
        onPress={() => onPress(plant)}
        accessibilityRole="button"
        accessibilityLabel={`${plant.name}, ${plant.botanicalName}, ${formatINR(plant.price)}`}
      >
        <Image
          source={{ uri: plant.imageUrl }}
          style={[styles.image, hovered && styles.imageHovered]}
          accessibilityLabel={`${plant.name} photo`}
        />

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

        {/* Bottom Climate Tag Overlay */}
        {plant.climateTag && (
          <View style={styles.climateTagPill}>
            <Text style={styles.climateTagText} numberOfLines={1}>
              {plant.climateTag}
            </Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Wishlist Heart Button (sibling overlay — avoids nested buttons) */}
      <TouchableOpacity
        style={styles.wishlistButton}
        activeOpacity={0.8}
        onPress={() => toggleWishlist(plant.id)}
        accessibilityRole="button"
        accessibilityLabel={favorited ? `Remove ${plant.name} from wishlist` : `Save ${plant.name} to wishlist`}
        accessibilityState={{ selected: favorited }}
      >
        <Ionicons
          name={favorited ? 'heart' : 'heart-outline'}
          size={18}
          color={favorited ? '#e11d48' : Colors.primary}
        />
      </TouchableOpacity>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        <TouchableOpacity
          style={styles.titleRow}
          activeOpacity={0.9}
          onPress={() => onPress(plant)}
          accessibilityRole="button"
          accessibilityLabel={`View ${plant.name} details`}
        >
          <Text style={styles.plantTitle} numberOfLines={1}>
            {plant.name}
          </Text>
          <Text style={styles.scientificName} numberOfLines={1}>
            {plant.botanicalName}
          </Text>
        </TouchableOpacity>

        {/* Care metadata */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Ionicons name="sunny-outline" size={12} color={Colors.secondary} />
            <Text style={styles.metaText} numberOfLines={1}>
              {plant.lowLight ? 'Low Light' : 'Medium Light'}
            </Text>
          </View>
          <Text style={styles.metaDot}>·</Text>
          <Text style={styles.metaText} numberOfLines={1}>
            {plant.care.difficulty}
          </Text>
          {plant.petSafe ? (
            <>
              <Text style={styles.metaDot}>·</Text>
              <View style={styles.metaItem}>
                <Ionicons name="paw" size={12} color={Colors.secondary} />
                <Text style={styles.metaText}>Pet Safe</Text>
              </View>
            </>
          ) : null}
        </View>

        {/* Price & Quick Add Button */}
        <View style={styles.priceRow}>
          <View style={styles.priceBlock}>
            <Text style={styles.priceText}>{formatINR(plant.price)}</Text>
            {plant.originalPrice && (
              <Text style={styles.originalPriceText}>
                {formatINR(plant.originalPrice)}
              </Text>
            )}
          </View>

          <TouchableOpacity
            style={[styles.quickAddButton, added && styles.quickAddButtonAdded]}
            activeOpacity={0.8}
            onPress={handleQuickAdd}
            accessibilityRole="button"
            accessibilityLabel={added ? `${plant.name} added to bag` : `Add ${plant.name} to bag`}
          >
            <Ionicons
              name={added ? 'checkmark' : 'add'}
              size={18}
              color={Colors.onPrimary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    flex: 1,
    margin: 6,
  },
  cardHovered: {
    borderColor: Colors.outlineVariant,
    ...Shadows.md,
  },
  imageWrap: {
    width: '100%',
    aspectRatio: 0.92,
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
    overflow: 'hidden',
  },
  imageWrapLarge: {
    aspectRatio: 1.05,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageHovered: {
    transform: [{ scale: 1.05 }],
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
  scientificName: {
    fontSize: 12,
    lineHeight: 16,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  metaDot: {
    fontSize: 11,
    color: Colors.outline,
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
  quickAddButtonAdded: {
    backgroundColor: Colors.secondary,
  },
});
