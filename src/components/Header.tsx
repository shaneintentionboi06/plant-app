import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useCartStore } from '../store/useCartStore';
import { useZoneStore } from '../store/useZoneStore';
import { useAuthStore } from '../store/useAuthStore';

import { useWishlistStore } from '../store/useWishlistStore';

export type HomeSection = 'shop' | 'finder' | 'featured' | 'journal' | 'greenhouse' | 'newsletter' | 'top';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onNavigate: (section: HomeSection) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
  wishlistActive?: boolean;
  onToggleWishlist?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  onNavigate,
  searchQuery = '',
  onSearchChange,
  wishlistActive,
  onToggleWishlist,
}) => {
  const { isDesktop } = useResponsive();
  const itemCount = useCartStore((s) => s.getItemCount());
  const wishlistCount = useWishlistStore((s) => s.wishlistIds.length);
  const { currentCity, currentZone, openZonePicker } = useZoneStore();
  const { user } = useAuthStore();

  const [hoveredNav, setHoveredNav] = useState<string | null>(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const navItems: { id: string; label: string; section: HomeSection | 'account' }[] = [
    { id: 'shop', label: 'Shop', section: 'shop' },
    { id: 'explore', label: 'Explore', section: 'finder' },
    { id: 'care', label: 'Plant Care', section: 'journal' },
    { id: 'greenhouse', label: 'My Greenhouse', section: 'greenhouse' },
  ];

  return (
    <View style={[styles.headerContainer, isDesktop ? styles.desktopHeader : styles.mobileHeader]}>
      <View style={[styles.innerContent, isDesktop && styles.desktopInner]}>
        {/* Left: Brand & Logo */}
        <View style={styles.brandRow}>
          <TouchableOpacity
            style={styles.logoButton}
            activeOpacity={0.8}
            onPress={() => onSelectTab('catalog')}
          >
            <View style={styles.logoBadge}>
              <MaterialCommunityIcons name="leaf" size={20} color={Colors.surface} />
            </View>
            <Text style={styles.brandTitle}>PLANTS</Text>
          </TouchableOpacity>

          {/* Desktop Navigation Links */}
          {isDesktop && (
            <View style={styles.navLinks}>
              {navItems.map((item) => {
                const active =
                  (item.section === 'shop' && currentTab === 'catalog') ||
                  (item.section === 'greenhouse' && currentTab === 'account');
                const isHovered = hoveredNav === item.id;
                return (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.navItem,
                      active && styles.navItemActive,
                      isHovered && !active && styles.navItemHovered,
                    ]}
                    onPress={() => {
                      if (item.section === 'greenhouse') onSelectTab('account');
                      else onNavigate(item.section as HomeSection);
                    }}
                    activeOpacity={0.8}
                    accessibilityRole="button"
                    accessibilityLabel={item.label}
                    {...(Platform.OS === 'web'
                      ? ({
                          onMouseEnter: () => setHoveredNav(item.id),
                          onMouseLeave: () => setHoveredNav(null),
                        } as any)
                      : {})}
                  >
                    <Text
                      style={[
                        styles.navItemText,
                        active && styles.navItemTextActive,
                        isHovered && !active && styles.navItemTextHovered,
                      ]}
                    >
                      {item.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>

        {/* Center: Search Bar (Desktop) */}
        {isDesktop && (
          <View style={[styles.desktopSearchBox, isSearchFocused && styles.desktopSearchBoxFocused]}>
            <Ionicons
              name="search-outline"
              size={18}
              color={isSearchFocused ? Colors.secondary : Colors.outline}
              style={styles.searchIcon}
            />
            <TextInput
              style={styles.desktopSearchInput}
              placeholder="Search houseplants, rare aroids, care guides..."
              placeholderTextColor={Colors.outline}
              value={searchQuery}
              onChangeText={onSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              accessibilityLabel="Search plants"
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.zoneChipInline}
              onPress={openZonePicker}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel={`Growing zone ${currentZone}, ${currentCity}. Change location.`}
            >
              <Ionicons name="location-outline" size={14} color={Colors.secondary} />
              <Text style={styles.zoneChipText}>
                {currentCity} • Zone {currentZone}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Right: Actions (Zone, Wishlist, Cart, Profile) */}
        <View style={styles.actionsRow}>
          {/* Location button for mobile */}
          {!isDesktop && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={openZonePicker}
              activeOpacity={0.7}
              accessibilityRole="button"
              accessibilityLabel="Open Location and Zone Picker"
            >
              <Ionicons name="location-outline" size={22} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          {/* Wishlist */}
          <TouchableOpacity
            style={[
              styles.cartButton,
              wishlistActive && styles.wishlistActive,
              hoveredBtn === 'wishlist' && styles.cartButtonHovered,
            ]}
            onPress={onToggleWishlist}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Wishlist, ${wishlistCount} saved`}
            {...(Platform.OS === 'web'
              ? ({
                  onMouseEnter: () => setHoveredBtn('wishlist'),
                  onMouseLeave: () => setHoveredBtn(null),
                } as any)
              : {})}
          >
            <Ionicons
              name={wishlistActive ? 'heart' : 'heart-outline'}
              size={22}
              color={wishlistActive ? '#e11d48' : Colors.primary}
            />
            {wishlistCount > 0 && (
              <View
                style={styles.cartBadge}
                {...(Platform.OS === 'web' ? ({ className: 'badge-pulse' } as any) : {})}
              >
                <Text style={styles.cartBadgeText}>{wishlistCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Cart Trigger */}
          <TouchableOpacity
            style={[
              styles.cartButton,
              hoveredBtn === 'cart' && styles.cartButtonHovered,
            ]}
            onPress={() => onSelectTab('cart')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={`Shopping cart, ${itemCount} items`}
            {...(Platform.OS === 'web'
              ? ({
                  onMouseEnter: () => setHoveredBtn('cart'),
                  onMouseLeave: () => setHoveredBtn(null),
                } as any)
              : {})}
          >
            <Ionicons name="bag-handle-outline" size={22} color={Colors.primary} />
            {itemCount > 0 && (
              <View
                style={styles.cartBadge}
                {...(Platform.OS === 'web' ? ({ className: 'badge-pulse' } as any) : {})}
              >
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Member Profile Avatar */}
          <TouchableOpacity
            style={[
              styles.avatarButton,
              hoveredBtn === 'avatar' && styles.avatarButtonHovered,
            ]}
            onPress={() => onSelectTab('account')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="My account and greenhouse"
            {...(Platform.OS === 'web'
              ? ({
                  onMouseEnter: () => setHoveredBtn('avatar'),
                  onMouseLeave: () => setHoveredBtn(null),
                } as any)
              : {})}
          >
            onPress={() => onSelectTab('account')}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel="My account and greenhouse"
          >
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
              accessibilityLabel="Member profile photo"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Mobile search row */}
      {!isDesktop && (
        <View style={styles.mobileSearchRow}>
          <Ionicons name="search-outline" size={18} color={Colors.outline} />
          <TextInput
            style={styles.mobileSearchInput}
            placeholder="Search plants..."
            placeholderTextColor={Colors.outline}
            value={searchQuery}
            onChangeText={onSearchChange}
            accessibilityLabel="Search plants"
            returnKeyType="search"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: 'rgba(251, 249, 245, 0.94)',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceContainer,
    zIndex: 100,
    ...Shadows.sm,
  },
  mobileHeader: {
    minHeight: 60,
    justifyContent: 'center',
    paddingVertical: 8,
  },
  desktopHeader: {
    height: 72,
    justifyContent: 'center',
  },
  innerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.marginMobile,
    width: '100%',
  },
  desktopInner: {
    maxWidth: 1280,
    alignSelf: 'center',
    paddingHorizontal: Spacing.marginDesktop,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  logoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 32,
    height: 32,
    borderRadius: Radii.md,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 1.2,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginLeft: 16,
  },
  navItem: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radii.md,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    transition: Platform.OS === 'web' ? ('background-color 0.2s ease' as any) : undefined,
  },
  navItemHovered: {
    backgroundColor: 'rgba(1, 45, 29, 0.05)',
  },
  navItemActive: {
    backgroundColor: Colors.primaryContainer,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
    transition: Platform.OS === 'web' ? ('color 0.2s ease' as any) : undefined,
  },
  navItemTextHovered: {
    color: Colors.primary,
  },
  navItemTextActive: {
    color: Colors.onPrimary,
  },
  desktopSearchBox: {
    flex: 1,
    maxWidth: 520,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.full,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'transparent',
    ...Shadows.sm,
    transition: Platform.OS === 'web' ? ('border-color 0.25s ease, max-width 0.25s ease, box-shadow 0.25s ease' as any) : undefined,
  },
  desktopSearchBoxFocused: {
    borderColor: Colors.secondary,
    maxWidth: 545,
    ...Shadows.md,
  },
  searchIcon: {
    marginRight: 8,
  },
  desktopSearchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurface,
    paddingVertical: 0,
    outlineWidth: 0 as any,
  },
  zoneChipInline: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.full,
    gap: 4,
  },
  zoneChipText: {
    fontSize: 11,
    color: Colors.secondary,
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLow,
  },
  cartButton: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    transition: Platform.OS === 'web' ? ('transform 0.2s ease, background-color 0.2s ease' as any) : undefined,
  },
  cartButtonHovered: {
    transform: [{ scale: 1.02 }],
  },
  wishlistActive: {
    backgroundColor: '#ffe4e6',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.secondaryTender,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    transition: Platform.OS === 'web' ? ('transform 0.2s ease' as any) : undefined,
  },
  avatarButtonHovered: {
    transform: [{ scale: 1.03 }],
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: Colors.secondary,
    borderRadius: Radii.full,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  cartBadgeText: {
    color: Colors.onSecondary,
    fontSize: 10,
    fontWeight: '700',
  },
  avatarButton: {
    width: 36,
    height: 36,
    borderRadius: Radii.full,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: Colors.secondaryTender,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  mobileSearchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: Spacing.marginMobile,
    marginBottom: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.full,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  mobileSearchInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.onSurface,
    paddingVertical: 0,
  },
});
