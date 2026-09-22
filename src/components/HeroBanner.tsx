import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
  Animated,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { PlantSpecimen } from '../data/plants';
import { usePlantsStore } from '../store/usePlantsStore';

export type HeroMiniSection = 'shop' | 'finder' | 'journal' | 'greenhouse';

interface HeroBannerProps {
  onExplore: () => void;
  onFindPlant: () => void;
  onSelectFeatured: (plantId: string) => void;
  onNavigate?: (section: HeroMiniSection) => void;
  onOpenCart?: () => void;
  onOpenGreenhouse?: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onFindPlant,
  onSelectFeatured,
}) => {
  const { isDesktop, isTablet, isMobile } = useResponsive();
  const isWide = isDesktop || isTablet;
  const plants = usePlantsStore((s) => s.plants);

  // Subtle interactive hover state for web
  const [hoveredCta, setHoveredCta] = useState<'primary' | 'secondary' | null>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [hoveredCardIndex, setHoveredCardIndex] = useState<number | null>(null);
  const [isBottomHovered, setIsBottomHovered] = useState(false);

  // Staggered page-load entrance animation
  const headingAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;
  const copyAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;
  const ctaAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;
  const imageAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;
  const cardsAnim = useRef(new Animated.Value(Platform.OS === 'web' ? 1 : 0)).current;

  useEffect(() => {
    // Smooth, restrained entrance sequence
    Animated.stagger(90, [
      Animated.timing(headingAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(copyAnim, { toValue: 1, duration: 420, useNativeDriver: true }),
      Animated.timing(ctaAnim, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.timing(imageAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
      Animated.timing(cardsAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
    ]).start();
  }, [headingAnim, copyAnim, ctaAnim, imageAnim, cardsAnim]);

  // Featured specimens from live catalog
  const primaryPlant = useMemo<PlantSpecimen>(() => {
    return (
      plants.find((p) => p.id === 'fiddle-leaf-fig') ||
      plants.find((p) => p.id === 'monstera-deliciosa') ||
      plants[0]
    );
  }, [plants]);

  const secondaryPlant = useMemo<PlantSpecimen>(() => {
    return (
      plants.find((p) => p.id === 'calathea-orbifolia') ||
      plants.find((p) => p.id === 'monstera-adansonii') ||
      plants[1]
    );
  }, [plants]);

  return (
    <View style={styles.stage}>
      <View
        style={[
          styles.card,
          isWide && styles.cardDesktop,
          isTablet && styles.cardTablet,
        ]}
      >
        {/* Soft botanical ambient aura in background */}
        <View style={styles.ambientAuraTop} pointerEvents="none" />
        <View style={styles.ambientAuraRight} pointerEvents="none" />

        {/* Main Hero Body */}
        <View
          style={[
            styles.heroBody,
            isWide && styles.heroBodyDesktop,
            isTablet && styles.heroBodyTablet,
          ]}
        >
          {/* LEFT CONTENT AREA */}
          <View
            style={[
              styles.copyColumn,
              isWide && styles.copyColumnDesktop,
              isTablet && styles.copyColumnTablet,
            ]}
          >
            {/* Eyebrow */}
            <Animated.View style={[styles.eyebrowRow, { opacity: headingAnim }]}>
              <MaterialCommunityIcons name="leaf" size={14} color={Colors.secondary} />
              <Text style={styles.eyebrowText}>CURATED FOR YOUR SPACE</Text>
            </Animated.View>

            {/* Main Heading */}
            <Animated.View style={{ opacity: headingAnim }}>
              <Text
                style={[
                  styles.heading,
                  isWide && styles.headingDesktop,
                  isTablet && styles.headingTablet,
                ]}
              >
                Bring Nature&apos;s{'\n'}Beauty <Text style={styles.headingAccent}>Home.</Text>
              </Text>
            </Animated.View>

            {/* Supporting Text */}
            <Animated.View style={{ opacity: copyAnim }}>
              <Text
                style={[
                  styles.supportingText,
                  isWide && styles.supportingTextDesktop,
                  isTablet && styles.supportingTextTablet,
                ]}
              >
                Discover beautiful indoor plants selected for your space, lifestyle and growing conditions.
              </Text>
            </Animated.View>

            {/* Distinct CTAs */}
            <Animated.View style={[styles.ctaRow, { opacity: ctaAnim }]}>
              <TouchableOpacity
                style={[
                  styles.primaryCta,
                  hoveredCta === 'primary' && styles.primaryCtaHovered,
                ]}
                onPress={onExplore}
                activeOpacity={0.9}
                accessibilityRole="button"
                accessibilityLabel="Explore Plants"
                {...(Platform.OS === 'web'
                  ? ({
                      onMouseEnter: () => setHoveredCta('primary'),
                      onMouseLeave: () => setHoveredCta(null),
                    } as any)
                  : {})}
              >
                <Text style={styles.primaryCtaText}>Explore Plants</Text>
                <View
                  style={[
                    styles.primaryCtaArrowBox,
                    hoveredCta === 'primary' && styles.primaryCtaArrowBoxHovered,
                  ]}
                >
                  <Ionicons name="arrow-forward" size={15} color={Colors.onPrimary} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.secondaryCta,
                  hoveredCta === 'secondary' && styles.secondaryCtaHovered,
                ]}
                onPress={onFindPlant}
                activeOpacity={0.82}
                accessibilityRole="button"
                accessibilityLabel="Find My Plant"
                {...(Platform.OS === 'web'
                  ? ({
                      onMouseEnter: () => setHoveredCta('secondary'),
                      onMouseLeave: () => setHoveredCta(null),
                    } as any)
                  : {})}
              >
                <Text style={styles.secondaryCtaText}>Find My Plant</Text>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* RIGHT VISUAL COMPOSITION */}
          <View
            style={[
              styles.visualColumn,
              isWide && styles.visualColumnDesktop,
              isTablet && styles.visualColumnTablet,
            ]}
          >
            <View
              style={[
                styles.visualStage,
                isWide && styles.visualStageDesktop,
                isTablet && styles.visualStageTablet,
              ]}
            >
              {/* Luminous gentle sunlit foliage backlight halo */}
              <View style={styles.foliageBacklight} pointerEvents="none" />

              {/* Dominant Hero Plant Image with gentle botanical breathe */}
              <TouchableOpacity
                style={[
                  styles.mainImageWrapper,
                  isWide && styles.mainImageWrapperDesktop,
                  isTablet && styles.mainImageWrapperTablet,
                  isImageHovered && styles.mainImageHovered,
                  Platform.OS === 'web' && isWide && ({ className: 'botanical-breathe' } as any),
                ]}
                onPress={() => onSelectFeatured(primaryPlant.id)}
                activeOpacity={0.96}
                accessibilityRole="button"
                accessibilityLabel={`Featured plant: ${primaryPlant.name} in modern sunlit living space`}
                {...(Platform.OS === 'web'
                  ? ({
                      onMouseEnter: () => setIsImageHovered(true),
                      onMouseLeave: () => setIsImageHovered(false),
                    } as any)
                  : {})}
              >
                <Image
                  source={{ uri: primaryPlant.imageUrl }}
                  style={[
                    styles.mainImage,
                    isWide && styles.mainImageDesktop,
                    isTablet && styles.mainImageTablet,
                  ]}
                  accessibilityLabel={`${primaryPlant.name} tree in a warm, sunlit modern apartment with natural wood and ceramic planter`}
                />
              </TouchableOpacity>

              {/* Smaller Supporting Botanical Image (Desktop/Tablet) */}
              {isWide && (
                <TouchableOpacity
                  style={[
                    styles.supportingImageWrapper,
                    isTablet && styles.supportingImageWrapperTablet,
                  ]}
                  onPress={() => onSelectFeatured(secondaryPlant.id)}
                  activeOpacity={0.95}
                  accessibilityRole="button"
                  accessibilityLabel={`Botanical detail: ${secondaryPlant.name}`}
                >
                  <Image
                    source={{ uri: secondaryPlant.imageUrl }}
                    style={[
                      styles.supportingImage,
                      isTablet && styles.supportingImageTablet,
                    ]}
                    accessibilityLabel={`${secondaryPlant.name} foliage in a handcrafted ceramic planter with warm ambient light`}
                  />
                </TouchableOpacity>
              )}

              {/* THREE REFINED FLOATING INFORMATION CARDS (Desktop/Tablet) */}
              {isWide && (
                <>
                  {/* Card 1: Easy Care */}
                  <View
                    style={[
                      styles.infoCard,
                      styles.cardTopLeft,
                      isTablet && styles.cardTopLeftTablet,
                      hoveredCardIndex === 0 && styles.infoCardHovered,
                      Platform.OS === 'web' && ({ className: 'card-float-a' } as any),
                    ]}
                    {...(Platform.OS === 'web'
                      ? ({
                          onMouseEnter: () => setHoveredCardIndex(0),
                          onMouseLeave: () => setHoveredCardIndex(null),
                        } as any)
                      : {})}
                  >
                    <View style={styles.cardIconBox}>
                      <Ionicons name="cloud-outline" size={14} color={Colors.secondary} />
                    </View>
                    <View style={styles.cardTextBox}>
                      <Text style={styles.cardTitle}>Easy Care</Text>
                      <Text style={styles.cardSub}>Perfect for beginners</Text>
                    </View>
                  </View>

                  {/* Card 2: Bright Indirect */}
                  <View
                    style={[
                      styles.infoCard,
                      styles.cardTopRight,
                      isTablet && styles.cardTopRightTablet,
                      hoveredCardIndex === 1 && styles.infoCardHovered,
                      Platform.OS === 'web' && ({ className: 'card-float-b' } as any),
                    ]}
                    {...(Platform.OS === 'web'
                      ? ({
                          onMouseEnter: () => setHoveredCardIndex(1),
                          onMouseLeave: () => setHoveredCardIndex(null),
                        } as any)
                      : {})}
                  >
                    <View style={styles.cardIconBox}>
                      <Ionicons name="sunny-outline" size={14} color={Colors.secondary} />
                    </View>
                    <View style={styles.cardTextBox}>
                      <Text style={styles.cardTitle}>Bright Indirect</Text>
                      <Text style={styles.cardSub}>Ideal indoor light</Text>
                    </View>
                  </View>

                  {/* Card 3: Balanced Humidity */}
                  <View
                    style={[
                      styles.infoCard,
                      styles.cardBottomRight,
                      isTablet && styles.cardBottomRightTablet,
                      hoveredCardIndex === 2 && styles.infoCardHovered,
                      Platform.OS === 'web' && ({ className: 'card-float-a' } as any),
                    ]}
                    {...(Platform.OS === 'web'
                      ? ({
                          onMouseEnter: () => setHoveredCardIndex(2),
                          onMouseLeave: () => setHoveredCardIndex(null),
                        } as any)
                      : {})}
                  >
                    <View style={styles.cardIconBox}>
                      <Ionicons name="water-outline" size={14} color={Colors.secondary} />
                    </View>
                    <View style={styles.cardTextBox}>
                      <Text style={styles.cardTitle}>Balanced Humidity</Text>
                      <Text style={styles.cardSub}>Simple weekly care</Text>
                    </View>
                  </View>
                </>
              )}
            </View>
          </View>
        </View>

        {/* MOBILE CARE CARDS (Clean vertical stack below plant photo) */}
        {!isWide && (
          <View style={styles.mobileCardsWrapper}>
            <View style={styles.mobileCard}>
              <View style={styles.cardIconBox}>
                <Ionicons name="cloud-outline" size={14} color={Colors.secondary} />
              </View>
              <View style={styles.cardTextBox}>
                <Text style={styles.cardTitle}>Easy Care</Text>
                <Text style={styles.cardSub}>Perfect for beginners</Text>
              </View>
            </View>

            <View style={styles.mobileCard}>
              <View style={styles.cardIconBox}>
                <Ionicons name="sunny-outline" size={14} color={Colors.secondary} />
              </View>
              <View style={styles.cardTextBox}>
                <Text style={styles.cardTitle}>Bright Indirect</Text>
                <Text style={styles.cardSub}>Ideal indoor light</Text>
              </View>
            </View>

            <View style={styles.mobileCard}>
              <View style={styles.cardIconBox}>
                <Ionicons name="water-outline" size={14} color={Colors.secondary} />
              </View>
              <View style={styles.cardTextBox}>
                <Text style={styles.cardTitle}>Balanced Humidity</Text>
                <Text style={styles.cardSub}>Simple weekly care</Text>
              </View>
            </View>
          </View>
        )}

        {/* HERO BOTTOM: Subtle editorial discovery transition into Plant Finder */}
        <TouchableOpacity
          style={[
            styles.transitionStrip,
            isBottomHovered && styles.transitionStripHovered,
          ]}
          onPress={onFindPlant}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Find your perfect plant - personalized recommendations based on light, space and lifestyle"
          {...(Platform.OS === 'web'
            ? ({
                onMouseEnter: () => setIsBottomHovered(true),
                onMouseLeave: () => setIsBottomHovered(false),
              } as any)
            : {})}
        >
          <View style={styles.transitionDividerLine} />
          <View style={styles.transitionInner}>
            <Text style={styles.transitionEyebrow}>FIND YOUR PERFECT PLANT</Text>
            <Text style={styles.transitionSubtitle}>
              Personalized recommendations based on your light, space and lifestyle.
            </Text>
            <View
              style={[
                styles.transitionArrowWrapper,
                isBottomHovered && styles.transitionArrowWrapperHovered,
              ]}
            >
              <Ionicons name="arrow-down" size={13} color={Colors.secondary} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  stage: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.xs,
    paddingBottom: Spacing.xs,
  },
  card: {
    backgroundColor: '#FAF8F4',
    borderRadius: Radii.xl,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(1, 45, 29, 0.04)',
    ...Shadows.sm,
  },
  cardDesktop: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 30,
    minHeight: 650,
    justifyContent: 'space-between',
  },
  cardTablet: {
    minHeight: 560,
    borderRadius: 24,
  },
  ambientAuraTop: {
    position: 'absolute',
    top: -60,
    left: -40,
    width: 380,
    height: 320,
    borderRadius: 190,
    backgroundColor: 'rgba(216, 243, 220, 0.22)',
    ...(Platform.OS === 'web' ? ({ filter: 'blur(50px)' } as any) : {}),
  },
  ambientAuraRight: {
    position: 'absolute',
    right: -80,
    top: 40,
    width: 500,
    height: 500,
    borderRadius: 250,
    backgroundColor: 'rgba(160, 244, 200, 0.16)',
    ...(Platform.OS === 'web' ? ({ filter: 'blur(70px)' } as any) : {}),
  },
  heroBody: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 20,
    zIndex: 2,
  },
  heroBodyDesktop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 48,
    paddingTop: 32,
    paddingBottom: 16,
    flex: 1,
    gap: 20,
  },
  heroBodyTablet: {
    paddingHorizontal: 28,
    paddingTop: 24,
    gap: 16,
  },
  copyColumn: {
    gap: 14,
  },
  copyColumnDesktop: {
    flex: 1,
    maxWidth: 490,
    paddingRight: 12,
  },
  copyColumnTablet: {
    maxWidth: 370,
    paddingRight: 4,
  },
  eyebrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  eyebrowText: {
    fontFamily: Platform.OS === 'web' ? '"Plus Jakarta Sans", sans-serif' : 'System',
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  heading: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, Georgia, serif' : 'System',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: Colors.onSurface,
    letterSpacing: -0.8,
  },
  headingDesktop: {
    fontSize: 52,
    lineHeight: 60,
    letterSpacing: -1.2,
  },
  headingTablet: {
    fontSize: 38,
    lineHeight: 46,
    letterSpacing: -0.8,
  },
  headingAccent: {
    color: '#0e6c4a',
  },
  supportingText: {
    fontFamily: Platform.OS === 'web' ? '"Plus Jakarta Sans", sans-serif' : 'System',
    fontSize: 14,
    lineHeight: 22,
    color: Colors.onSurfaceVariant,
    maxWidth: 420,
  },
  supportingTextDesktop: {
    fontSize: 15,
    lineHeight: 24,
  },
  supportingTextTablet: {
    fontSize: 13.5,
    lineHeight: 21,
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingTop: 4,
  },
  primaryCta: {
    backgroundColor: Colors.primary,
    paddingLeft: 26,
    paddingRight: 20,
    paddingVertical: 13.5,
    borderRadius: Radii.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    ...Shadows.sm,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    transition: Platform.OS === 'web' ? ('transform 0.2s ease, background-color 0.2s ease' as any) : undefined,
  },
  primaryCtaHovered: {
    backgroundColor: Colors.primaryContainer,
    transform: [{ scale: 1.015 }],
  },
  primaryCtaText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  primaryCtaArrowBox: {
    transition: Platform.OS === 'web' ? ('transform 0.2s ease' as any) : undefined,
  },
  primaryCtaArrowBoxHovered: {
    transform: [{ translateX: 3 }],
  },
  secondaryCta: {
    backgroundColor: 'rgba(1, 45, 29, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(1, 45, 29, 0.15)',
    paddingHorizontal: 22,
    paddingVertical: 12.5,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    transition: Platform.OS === 'web' ? ('background-color 0.2s ease, border-color 0.2s ease' as any) : undefined,
  },
  secondaryCtaHovered: {
    backgroundColor: 'rgba(1, 45, 29, 0.07)',
    borderColor: 'rgba(1, 45, 29, 0.3)',
  },
  secondaryCtaText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },
  visualColumn: {
    width: '100%',
    alignItems: 'center',
    zIndex: 3,
  },
  visualColumnDesktop: {
    flex: 1,
    maxWidth: 560,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  visualColumnTablet: {
    maxWidth: 380,
  },
  visualStage: {
    width: '100%',
    alignItems: 'center',
    position: 'relative',
  },
  visualStageDesktop: {
    width: 520,
    height: 470,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  visualStageTablet: {
    width: 370,
    height: 380,
  },
  foliageBacklight: {
    position: 'absolute',
    top: 20,
    right: 30,
    width: 320,
    height: 380,
    borderRadius: 160,
    backgroundColor: 'rgba(160, 244, 200, 0.24)',
    ...(Platform.OS === 'web' ? ({ filter: 'blur(45px)' } as any) : {}),
  },
  mainImageWrapper: {
    borderRadius: 32,
    ...Shadows.md,
    backgroundColor: Colors.surfaceContainerLow,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    transition: Platform.OS === 'web' ? ('transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)' as any) : undefined,
  },
  mainImageWrapperDesktop: {
    width: 350,
    height: 440,
  },
  mainImageWrapperTablet: {
    width: 260,
    height: 340,
  },
  mainImageHovered: {
    transform: [{ scale: 1.015 }],
  },
  mainImage: {
    width: 290,
    height: 320,
    resizeMode: 'cover',
    borderTopLeftRadius: 140,
    borderTopRightRadius: 140,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    backgroundColor: Colors.surfaceContainerLow,
  },
  mainImageDesktop: {
    width: 350,
    height: 440,
    borderTopLeftRadius: 175,
    borderTopRightRadius: 175,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  mainImageTablet: {
    width: 260,
    height: 340,
    borderTopLeftRadius: 130,
    borderTopRightRadius: 130,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  supportingImageWrapper: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    zIndex: 3,
    borderRadius: 24,
    borderWidth: 3,
    borderColor: '#FAF8F4',
    ...Shadows.lg,
    backgroundColor: Colors.surfaceContainerLow,
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
  },
  supportingImageWrapperTablet: {
    bottom: 4,
    left: 8,
    borderRadius: 18,
    borderWidth: 2,
  },
  supportingImage: {
    width: 170,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 21,
    backgroundColor: Colors.surfaceContainerLow,
  },
  supportingImageTablet: {
    width: 120,
    height: 145,
    borderRadius: 16,
  },
  infoCard: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(1, 45, 29, 0.08)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    ...Shadows.sm,
    zIndex: 4,
    cursor: Platform.OS === 'web' ? ('default' as any) : undefined,
    transition: Platform.OS === 'web' ? ('transform 0.25s ease, box-shadow 0.25s ease' as any) : undefined,
  },
  infoCardHovered: {
    transform: [{ translateY: -2.5 }],
    ...Shadows.md,
  },
  cardTopLeft: {
    top: 28,
    left: -10,
  },
  cardTopLeftTablet: {
    top: 10,
    left: 4,
  },
  cardTopRight: {
    top: 50,
    right: 6,
  },
  cardTopRightTablet: {
    top: 30,
    right: 2,
  },
  cardBottomRight: {
    bottom: 36,
    right: 14,
  },
  cardBottomRightTablet: {
    bottom: 20,
    right: 6,
  },
  cardIconBox: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: 'rgba(14, 108, 74, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextBox: {
    gap: 1,
  },
  cardTitle: {
    fontFamily: Platform.OS === 'web' ? '"Plus Jakarta Sans", sans-serif' : 'System',
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.onSurface,
  },
  cardSub: {
    fontFamily: Platform.OS === 'web' ? '"Plus Jakarta Sans", sans-serif' : 'System',
    fontSize: 10,
    color: Colors.outline,
  },
  mobileCardsWrapper: {
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    gap: 8,
    zIndex: 2,
  },
  mobileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: 'rgba(1, 45, 29, 0.08)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 9,
    ...Shadows.sm,
  },
  transitionStrip: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(1, 45, 29, 0.09)',
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.45)',
    alignItems: 'center',
    cursor: Platform.OS === 'web' ? ('pointer' as any) : undefined,
    zIndex: 2,
  },
  transitionStripHovered: {
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  transitionDividerLine: {
    width: 44,
    height: 2,
    backgroundColor: 'rgba(14, 108, 74, 0.25)',
    borderRadius: 1,
    marginBottom: 8,
  },
  transitionInner: {
    alignItems: 'center',
    gap: 3,
  },
  transitionEyebrow: {
    fontFamily: Platform.OS === 'web' ? '"Plus Jakarta Sans", sans-serif' : 'System',
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 2,
    color: Colors.secondary,
    textTransform: 'uppercase',
  },
  transitionSubtitle: {
    fontFamily: Platform.OS === 'web' ? '"Plus Jakarta Sans", sans-serif' : 'System',
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
  },
  transitionArrowWrapper: {
    marginTop: 3,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(14, 108, 74, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    transition: Platform.OS === 'web' ? ('transform 0.2s ease' as any) : undefined,
  },
  transitionArrowWrapperHovered: {
    transform: [{ translateY: 2 }],
  },
});
