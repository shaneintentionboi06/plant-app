import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useZoneStore } from '../store/useZoneStore';

interface HeroBannerProps {
  onExplore: () => void;
  onSelectFeatured: (plantId: string) => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onExplore,
  onSelectFeatured,
}) => {
  const { isDesktop } = useResponsive();
  const { openZonePicker } = useZoneStore();

  return (
    <View style={styles.heroWrapper}>
      <View style={[styles.heroCard, isDesktop && styles.desktopHeroCard]}>
        {/* Ambient Overlay Image */}
        <Image
          source={{
            uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCXmSkk3cOR2yR5OFJpxGu9slmY2QQUpBj6ZnbICO6FFfAxwk67lsTq1-b_zrbKXcyhzh7dD1K3Ar7XV3eS3lca8NW1TdeWUtGdbGGBPkvdx0whJ42_A1bmbIG1mfeZbT5sFnNe6bgZLjw7dDCU1mHzKeVls2TBNbC-SEWA7g63N67boUqFPJIDuVk20ppmQYFj5UB768nzXi1xWRZYG9aNI1qlAfuJsANgYz9P6uoSRctjXbkPutfTQA',
          }}
          style={styles.backgroundImage}
          blurRadius={Platform.OS === 'web' ? 2 : 0}
        />
        <View style={styles.scrimOverlay} />

        <View style={[styles.contentLayout, isDesktop && styles.desktopLayout]}>
          {/* Left Column: Editorial Copy */}
          <View style={[styles.textColumn, isDesktop && styles.desktopTextColumn]}>
            <View style={styles.releasePill}>
              <MaterialCommunityIcons name="leaf" size={14} color={Colors.secondaryContainer} />
              <Text style={styles.releasePillText}>Spring Botanical Release • Vol. 04</Text>
            </View>

            <Text style={[styles.heroHeadline, isDesktop && styles.desktopHeadline]}>
              Cultivate Calm in Your Sanctuary.
            </Text>

            <Text style={styles.heroSubtext}>
              20% off rare botanical aroids & handcrafted terracotta vessels. Sustainably nurtured, climate-matched to thrive in your exact living space.
            </Text>

            {/* CTAs */}
            <View style={styles.ctaRow}>
              <TouchableOpacity
                style={styles.primaryButton}
                activeOpacity={0.85}
                onPress={onExplore}
              >
                <Text style={styles.primaryButtonText}>Explore The Drop</Text>
                <Ionicons name="arrow-forward" size={16} color={Colors.onSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.glassButton}
                activeOpacity={0.85}
                onPress={openZonePicker}
              >
                <Ionicons name="location" size={16} color={Colors.surface} />
                <Text style={styles.glassButtonText}>Find My Zone Matches</Text>
              </TouchableOpacity>
            </View>

            {/* Trust Metrics */}
            <View style={styles.trustRow}>
              <View style={styles.trustItem}>
                <Ionicons name="shield-checkmark" size={16} color={Colors.secondaryContainer} />
                <Text style={styles.trustText}>30-Day Guarantee</Text>
              </View>
              <View style={styles.trustDivider} />
              <View style={styles.trustItem}>
                <Ionicons name="leaf" size={16} color={Colors.secondaryContainer} />
                <Text style={styles.trustText}>Carbon-Neutral Shipping</Text>
              </View>
            </View>
          </View>

          {/* Right Column: Curator's Choice Floating Showcase (Desktop) */}
          {isDesktop && (
            <TouchableOpacity
              style={styles.showcaseCard}
              activeOpacity={0.9}
              onPress={() => onSelectFeatured('monstera-deliciosa')}
            >
              <Image
                source={{
                  uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCwy384c8_0J29L2xVqsXySEs4IJy-QmVdz36nZnuBt1j5SC8wpB39RE9vhDJUA9Jr_Xc9gXCipBAsrG9QxXhzdRqRo8Lfjj0ffCyJ1GaolyO7t3JqKkcjO7iUPnyY0oQakqE9muixtvi7DFDHFKBWt7oF1T3UBU0tGRTST8bAiu2p5b81Pdl91tyZh2cnrHmJxEXxHWBsyKW74vvCDMr1TOMDyBKu7gAKyuSaysC_MVk3illqqb8wPiw',
                }}
                style={styles.showcaseImage}
              />
              <View style={styles.showcaseFooter}>
                <View>
                  <Text style={styles.showcaseTag}>Curator's Choice</Text>
                  <Text style={styles.showcaseTitle}>Monstera Deliciosa</Text>
                  <Text style={styles.showcaseNote}>Selected for coastal airflow</Text>
                </View>
                <Text style={styles.showcasePrice}>$42</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.md,
  },
  heroCard: {
    backgroundColor: Colors.primaryContainer,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    position: 'relative',
    ...Shadows.lg,
  },
  desktopHeroCard: {
    maxWidth: 1280,
    alignSelf: 'center',
    width: '100%',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.22,
    resizeMode: 'cover',
  },
  scrimOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(1, 45, 29, 0.65)',
  },
  contentLayout: {
    padding: Spacing.lg,
    zIndex: 10,
  },
  desktopLayout: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.xl * 1.5,
    gap: 40,
  },
  textColumn: {
    gap: 16,
  },
  desktopTextColumn: {
    flex: 1,
    maxWidth: 620,
  },
  releasePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(251, 249, 245, 0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.full,
    gap: 6,
  },
  releasePillText: {
    color: Colors.secondaryContainer,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  heroHeadline: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 26,
    lineHeight: 34,
    fontWeight: '700',
    color: Colors.surface,
    letterSpacing: -0.5,
  },
  desktopHeadline: {
    fontSize: 44,
    lineHeight: 52,
  },
  heroSubtext: {
    fontSize: 14,
    lineHeight: 22,
    color: Colors.inversePrimary,
  },
  ctaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    paddingTop: 8,
  },
  primaryButton: {
    backgroundColor: Colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radii.md,
    gap: 8,
    ...Shadows.sm,
  },
  primaryButtonText: {
    color: Colors.onSecondary,
    fontSize: 14,
    fontWeight: '700',
  },
  glassButton: {
    backgroundColor: 'rgba(251, 249, 245, 0.14)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: Radii.md,
    gap: 8,
  },
  glassButtonText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '600',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    paddingTop: 8,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustDivider: {
    width: 1,
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  trustText: {
    color: Colors.inversePrimary,
    fontSize: 12,
    fontWeight: '500',
  },
  showcaseCard: {
    width: 320,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    backgroundColor: Colors.surfaceContainerLow,
    ...Shadows.md,
  },
  showcaseImage: {
    width: '100%',
    height: 280,
    resizeMode: 'cover',
  },
  showcaseFooter: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(1, 45, 29, 0.88)',
    padding: 12,
    borderRadius: Radii.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  showcaseTag: {
    color: Colors.secondaryContainer,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  showcaseTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 16,
    fontWeight: '600',
    color: Colors.surface,
  },
  showcaseNote: {
    fontSize: 11,
    color: Colors.surfaceContainerHigh,
  },
  showcasePrice: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.secondaryContainer,
  },
});
