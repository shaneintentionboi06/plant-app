import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useCartStore } from '../store/useCartStore';
import { useResponsive } from '../hooks/useResponsive';

interface CartScreenProps {
  onContinueShopping: () => void;
  onSelectPlantById: (plantId: string) => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onContinueShopping,
  onSelectPlantById,
}) => {
  const { isDesktop } = useResponsive();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    applyPromo,
    removePromo,
    promoCode,
    promoError,
    getSubtotal,
    getDiscount,
    getShippingFee,
    getAmountToFreeShipping,
    getShippingProgress,
    getTotal,
    getItemCount,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = getShippingFee();
  const amountToFree = getAmountToFreeShipping();
  const progressPercent = getShippingProgress();
  const total = getTotal();
  const itemCount = getItemCount();

  const handleApplyCode = () => {
    if (couponInput.trim()) {
      applyPromo(couponInput.trim());
      setCouponInput('');
    }
  };

  const handleCheckout = () => {
    setCheckoutSuccess(true);
  };

  if (checkoutSuccess) {
    return (
      <View style={styles.successWrapper}>
        <View style={styles.successCard}>
          <View style={styles.successIconBadge}>
            <MaterialCommunityIcons name="leaf" size={40} color={Colors.surface} />
          </View>
          <Text style={styles.successTitle}>Botanical Order Confirmed!</Text>
          <Text style={styles.successSubtitle}>
            Order #PL-89241 has been securely placed. Your specimens are being gently packaged in 100% biodegradable cushioned wrapping.
          </Text>
          <View style={styles.successMetricBox}>
            <Ionicons name="sparkles" size={18} color={Colors.secondary} />
            <Text style={styles.successMetricText}>
              +45 Eco-Stewardship Points Earned & 1 Tree Planted
            </Text>
          </View>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => {
              clearCart();
              setCheckoutSuccess(false);
              onContinueShopping();
            }}
          >
            <Text style={styles.continueBtnText}>Return to Sanctuary Shop</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (items.length === 0) {
    return (
      <View style={styles.emptyWrapper}>
        <Ionicons name="bag-handle-outline" size={64} color={Colors.outline} />
        <Text style={styles.emptyTitle}>Your Botanical Bag is Empty</Text>
        <Text style={styles.emptySub}>
          Discover lush specimens curated for your regional climate and interior lighting.
        </Text>
        <TouchableOpacity
          style={styles.exploreBtn}
          onPress={onContinueShopping}
        >
          <Text style={styles.exploreBtnText}>Explore Plants</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.onPrimary} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.innerContent, isDesktop && styles.desktopInner]}>
        {/* Cart Title & Clear All */}
        <View style={styles.cartHeader}>
          <View>
            <Text style={styles.cartTitle}>Botanical Cart</Text>
            <View style={styles.itemCountRow}>
              <View style={styles.activeDot} />
              <Text style={styles.itemCountText}>
                {itemCount} living specimen{itemCount > 1 ? 's' : ''} selected
              </Text>
            </View>
          </View>

          <TouchableOpacity onPress={clearCart} activeOpacity={0.7}>
            <Text style={styles.clearAllText}>Clear all</Text>
          </TouchableOpacity>
        </View>

        {/* Free Shipping Progress Meter */}
        <View style={styles.shippingCard}>
          <View style={styles.shippingHeader}>
            <View style={styles.shippingHeaderLeft}>
              <Ionicons name="car-outline" size={18} color={Colors.secondary} />
              <Text style={styles.shippingTitle}>Eco-Friendly Shipping</Text>
            </View>
            <Text style={styles.shippingGoalText}>
              {amountToFree > 0
                ? `Add $${amountToFree.toFixed(2)} for Free Shipping`
                : 'Free Shipping Unlocked!'}
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${progressPercent}%` },
              ]}
            />
          </View>

          <View style={styles.shippingFooter}>
            <MaterialCommunityIcons name="compost" size={14} color={Colors.secondary} />
            <Text style={styles.shippingFooterText}>
              100% biodegradable cushioned protective packaging
            </Text>
          </View>
        </View>

        {/* Layout split on Desktop */}
        <View style={[styles.mainLayout, isDesktop && styles.desktopLayout]}>
          {/* Left Column: Cart Items List */}
          <View style={[styles.itemsColumn, isDesktop && styles.desktopItems]}>
            {items.map((item) => (
              <View key={item.id} style={styles.itemCard}>
                {/* Item Thumbnail */}
                <TouchableOpacity
                  style={styles.itemImageWrap}
                  onPress={() => onSelectPlantById(item.plantId)}
                  activeOpacity={0.85}
                >
                  <Image
                    source={{ uri: item.plant.imageUrl }}
                    style={styles.itemImage}
                  />
                  <View style={styles.livePlantTag}>
                    <MaterialCommunityIcons name="leaf" size={10} color={Colors.secondary} />
                    <Text style={styles.livePlantTagText}>Live Plant</Text>
                  </View>
                </TouchableOpacity>

                {/* Item Details */}
                <View style={styles.itemDetails}>
                  <View style={styles.itemTopRow}>
                    <TouchableOpacity
                      onPress={() => onSelectPlantById(item.plantId)}
                      style={{ flex: 1 }}
                    >
                      <Text style={styles.itemName} numberOfLines={1}>
                        {item.plant.name}
                      </Text>
                      <Text style={styles.itemVariant} numberOfLines={1}>
                        {item.sizeName} • {item.vesselName}
                      </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.removeBtn}
                      onPress={() => removeItem(item.id)}
                      accessibilityLabel="Remove item"
                    >
                      <Ionicons name="close" size={18} color={Colors.outline} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.guaranteePill}>
                    <Ionicons name="shield-checkmark" size={11} color={Colors.secondary} />
                    <Text style={styles.guaranteePillText}>30-Day Guarantee</Text>
                  </View>

                  {/* Price & Quantity Adjuster */}
                  <View style={styles.itemBottomRow}>
                    <Text style={styles.itemPrice}>
                      ${(item.unitPrice * item.quantity).toFixed(2)}
                    </Text>

                    <View style={styles.quantityControls}>
                      <TouchableOpacity
                        style={styles.qtyControlBtn}
                        onPress={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Ionicons name="remove" size={14} color={Colors.onSurface} />
                      </TouchableOpacity>
                      <Text style={styles.qtyValueText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.qtyControlBtn}
                        onPress={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Ionicons name="add" size={14} color={Colors.onSurface} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Right Column: Promo Code & Order Summary */}
          <View style={[styles.summaryColumn, isDesktop && styles.desktopSummary]}>
            {/* Promo Code Input Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.cardHeaderTitle}>Promotional Atelier Code</Text>
              <View style={styles.promoInputRow}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter code (e.g. SPRING20)"
                  placeholderTextColor={Colors.outline}
                  value={couponInput}
                  onChangeText={setCouponInput}
                  autoCapitalize="characters"
                />
                <TouchableOpacity
                  style={styles.applyBtn}
                  onPress={handleApplyCode}
                  activeOpacity={0.8}
                >
                  <Text style={styles.applyBtnText}>Apply</Text>
                </TouchableOpacity>
              </View>

              {promoCode && (
                <View style={styles.promoActiveBanner}>
                  <Ionicons name="checkmark-circle" size={14} color={Colors.secondary} />
                  <Text style={styles.promoActiveText}>
                    Code <Text style={{ fontWeight: '700' }}>{promoCode}</Text> applied (20% Off)
                  </Text>
                  <TouchableOpacity onPress={removePromo}>
                    <Ionicons name="close-circle" size={16} color={Colors.outline} />
                  </TouchableOpacity>
                </View>
              )}

              {promoError && (
                <Text style={styles.promoErrorText}>{promoError}</Text>
              )}
            </View>

            {/* Financial Order Breakdown */}
            <View style={styles.summaryCard}>
              <Text style={styles.cardHeaderTitle}>Order Summary</Text>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Subtotal</Text>
                <Text style={styles.summaryLineValue}>${subtotal.toFixed(2)}</Text>
              </View>

              {discount > 0 && (
                <View style={styles.summaryLine}>
                  <Text style={[styles.summaryLineLabel, { color: Colors.secondary }]}>
                    Eco-Promotion Discount
                  </Text>
                  <Text style={[styles.summaryLineValue, { color: Colors.secondary }]}>
                    -${discount.toFixed(2)}
                  </Text>
                </View>
              )}

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Carbon-Neutral Shipping</Text>
                <Text style={styles.summaryLineValue}>
                  {shipping === 0 ? (
                    <Text style={{ color: Colors.secondary, fontWeight: '700' }}>FREE</Text>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </Text>
              </View>

              <View style={styles.summaryLine}>
                <Text style={styles.summaryLineLabel}>Estimated CA Sales Tax (8.5%)</Text>
                <Text style={styles.summaryLineValue}>
                  ${((subtotal - discount) * 0.085).toFixed(2)}
                </Text>
              </View>

              <View style={styles.summaryDivider} />

              <View style={styles.totalLine}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
              </View>

              {/* Checkout CTA Button */}
              <TouchableOpacity
                style={styles.checkoutBtn}
                activeOpacity={0.85}
                onPress={handleCheckout}
              >
                <Text style={styles.checkoutBtnText}>
                  Proceed to Climate Checkout
                </Text>
                <Ionicons name="shield-checkmark" size={18} color={Colors.onPrimary} />
              </TouchableOpacity>

              <View style={styles.secureBadgeRow}>
                <Ionicons name="lock-closed" size={12} color={Colors.outline} />
                <Text style={styles.secureBadgeText}>
                  256-Bit SSL Encrypted • Nursery Plant Health Guarantee
                </Text>
              </View>
            </View>
          </View>
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
    paddingBottom: 60,
  },
  innerContent: {
    width: '100%',
    padding: Spacing.marginMobile,
    gap: 16,
  },
  desktopInner: {
    maxWidth: 1280,
    alignSelf: 'center',
    padding: Spacing.marginDesktop,
  },
  cartHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  cartTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 26,
    fontWeight: '700',
    color: Colors.primary,
  },
  itemCountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: Radii.full,
    backgroundColor: Colors.secondary,
  },
  itemCountText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  clearAllText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.secondary,
  },
  shippingCard: {
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.lg,
    padding: 14,
    gap: 8,
  },
  shippingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  shippingHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shippingTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  shippingGoalText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.surfaceContainerHighest,
    borderRadius: Radii.full,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: Radii.full,
  },
  shippingFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shippingFooterText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  mainLayout: {
    gap: 20,
  },
  desktopLayout: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 32,
  },
  itemsColumn: {
    gap: 12,
  },
  desktopItems: {
    flex: 1.2,
  },
  itemCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    padding: 12,
    flexDirection: 'row',
    gap: 12,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
  },
  itemImageWrap: {
    width: 90,
    height: 105,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceContainerLow,
    position: 'relative',
    overflow: 'hidden',
  },
  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  livePlantTag: {
    position: 'absolute',
    bottom: 4,
    left: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: Radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  livePlantTagText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primary,
  },
  itemDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  itemTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  itemName: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.primary,
  },
  itemVariant: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  removeBtn: {
    padding: 4,
  },
  guaranteePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.secondaryTender,
    alignSelf: 'flex-start',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.full,
    marginTop: 4,
  },
  guaranteePillText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
  },
  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingHorizontal: 6,
    paddingVertical: 3,
    gap: 10,
  },
  qtyControlBtn: {
    padding: 4,
  },
  qtyValueText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  summaryColumn: {
    gap: 16,
  },
  desktopSummary: {
    flex: 0.9,
  },
  summaryCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    padding: 18,
    gap: 12,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
  },
  cardHeaderTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primary,
  },
  promoInputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  promoInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.onSurface,
  },
  applyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  applyBtnText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  promoActiveBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.secondaryTender,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radii.md,
  },
  promoActiveText: {
    fontSize: 12,
    color: Colors.secondary,
    flex: 1,
    marginLeft: 6,
  },
  promoErrorText: {
    fontSize: 12,
    color: Colors.error,
  },
  summaryLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLineLabel: {
    fontSize: 13,
    color: Colors.onSurfaceVariant,
  },
  summaryLineValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.surfaceContainer,
    marginVertical: 4,
  },
  totalLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  totalValue: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  checkoutBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 6,
    ...Shadows.sm,
  },
  checkoutBtnText: {
    color: Colors.onPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  secureBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 4,
  },
  secureBadgeText: {
    fontSize: 10,
    color: Colors.outline,
  },
  emptyWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: 12,
    minHeight: 400,
  },
  emptyTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  emptySub: {
    fontSize: 14,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 320,
  },
  exploreBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: Radii.md,
    gap: 8,
    marginTop: 8,
  },
  exploreBtnText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  successWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    minHeight: 450,
  },
  successCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    textAlign: 'center',
    maxWidth: 440,
    gap: 16,
    ...Shadows.md,
  },
  successIconBadge: {
    width: 72,
    height: 72,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  successTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  successMetricBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondaryTender,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: Radii.full,
    gap: 8,
  },
  successMetricText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.secondary,
  },
  continueBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: Radii.md,
  },
  continueBtnText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
});
