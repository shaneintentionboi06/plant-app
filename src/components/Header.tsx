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

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  searchQuery = '',
  onSearchChange,
}) => {
  const { isDesktop, isMobile } = useResponsive();
  const itemCount = useCartStore((s) => s.getItemCount());
  const { currentCity, currentZone, openZonePicker } = useZoneStore();
  const { user, isAuthenticated } = useAuthStore();

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
              <TouchableOpacity
                style={[
                  styles.navItem,
                  currentTab === 'catalog' && styles.navItemActive,
                ]}
                onPress={() => onSelectTab('catalog')}
              >
                <Text
                  style={[
                    styles.navItemText,
                    currentTab === 'catalog' && styles.navItemTextActive,
                  ]}
                >
                  Shop / Plants
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  currentTab === 'care' && styles.navItemActive,
                ]}
                onPress={openZonePicker}
              >
                <Text
                  style={[
                    styles.navItemText,
                    currentTab === 'care' && styles.navItemTextActive,
                  ]}
                >
                  Growing Zones & Care
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.navItem,
                  currentTab === 'greenhouse' && styles.navItemActive,
                ]}
                onPress={() => onSelectTab('account')}
              >
                <Text
                  style={[
                    styles.navItemText,
                    currentTab === 'greenhouse' && styles.navItemTextActive,
                  ]}
                >
                  My Greenhouse
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Center: Search Bar (Desktop) */}
        {isDesktop && (
          <View style={styles.desktopSearchBox}>
            <Ionicons name="search-outline" size={18} color={Colors.outline} style={styles.searchIcon} />
            <TextInput
              style={styles.desktopSearchInput}
              placeholder="Search houseplants, rare aroids, care guides..."
              placeholderTextColor={Colors.outline}
              value={searchQuery}
              onChangeText={onSearchChange}
            />
            <TouchableOpacity
              style={styles.zoneChipInline}
              onPress={openZonePicker}
              activeOpacity={0.7}
            >
              <Ionicons name="location-outline" size={14} color={Colors.secondary} />
              <Text style={styles.zoneChipText}>
                {currentCity} • Zone {currentZone}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Right: Actions (Zone, Cart, Profile) */}
        <View style={styles.actionsRow}>
          {/* Location button for mobile */}
          {!isDesktop && (
            <TouchableOpacity
              style={styles.iconButton}
              onPress={openZonePicker}
              activeOpacity={0.7}
              accessibilityLabel="Open Location & Zone Picker"
            >
              <Ionicons name="location-outline" size={22} color={Colors.onSurfaceVariant} />
            </TouchableOpacity>
          )}

          {/* Cart Trigger */}
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => onSelectTab('cart')}
            activeOpacity={0.8}
            accessibilityLabel="Shopping Cart"
          >
            <Ionicons name="bag-handle-outline" size={22} color={Colors.primary} />
            {itemCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{itemCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Member Profile Avatar */}
          <TouchableOpacity
            style={styles.avatarButton}
            onPress={() => onSelectTab('account')}
            activeOpacity={0.8}
          >
            <Image
              source={{ uri: user.avatarUrl }}
              style={styles.avatarImage}
            />
          </TouchableOpacity>
        </View>
      </View>
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
    height: 60,
    justifyContent: 'center',
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
  },
  navItemActive: {
    backgroundColor: Colors.primaryContainer,
  },
  navItemText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
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
    ...Shadows.sm,
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
});
