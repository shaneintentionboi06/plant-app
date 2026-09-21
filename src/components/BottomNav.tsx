import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';

interface BottomNavProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenZonePicker: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onSelectTab,
  onOpenZonePicker,
}) => {
  const itemCount = useCartStore((s) => s.getItemCount());

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('catalog')}
        activeOpacity={0.8}
      >
        <MaterialCommunityIcons
          name="leaf"
          size={22}
          color={currentTab === 'catalog' ? Colors.primary : Colors.outline}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'catalog' && styles.navLabelActive,
          ]}
        >
          Shop
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={onOpenZonePicker}
        activeOpacity={0.8}
      >
        <Ionicons
          name="location"
          size={22}
          color={currentTab === 'zone' ? Colors.primary : Colors.outline}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'zone' && styles.navLabelActive,
          ]}
        >
          Zone Care
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('cart')}
        activeOpacity={0.8}
      >
        <View style={styles.cartIconWrap}>
          <Ionicons
            name="bag-handle"
            size={22}
            color={currentTab === 'cart' ? Colors.primary : Colors.outline}
          />
          {itemCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{itemCount}</Text>
            </View>
          )}
        </View>
        <Text
          style={[
            styles.navLabel,
            currentTab === 'cart' && styles.navLabelActive,
          ]}
        >
          Cart
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.navItem}
        onPress={() => onSelectTab('account')}
        activeOpacity={0.8}
      >
        <Ionicons
          name="person"
          size={22}
          color={currentTab === 'account' ? Colors.primary : Colors.outline}
        />
        <Text
          style={[
            styles.navLabel,
            currentTab === 'account' && styles.navLabelActive,
          ]}
        >
          Sanctuary
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    height: 64,
    backgroundColor: 'rgba(251, 249, 245, 0.96)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.surfaceContainer,
    paddingBottom: Platform.OS === 'ios' ? 14 : 6,
    ...Shadows.md,
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 3,
  },
  navLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.outline,
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  cartIconWrap: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    backgroundColor: Colors.secondary,
    borderRadius: Radii.full,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: Colors.onSecondary,
    fontSize: 9,
    fontWeight: '700',
  },
});
