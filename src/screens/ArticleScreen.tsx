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
import { Ionicons } from '@expo/vector-icons';
import { ARTICLES, articleImage, Article } from '../data/articles';
import { PLANTS_DATA, PlantSpecimen } from '../data/plants';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { formatINR } from '../utils/currency';
import { useResponsive } from '../hooks/useResponsive';
import { useCartStore } from '../store/useCartStore';

interface ArticleScreenProps {
  slug: string;
  onBack: () => void;
  onOpenArticle: (slug: string) => void;
  onSelectPlant: (plant: PlantSpecimen) => void;
  onGoToCart: () => void;
}

function resolveRelatedPlant(article: Article): PlantSpecimen {
  if (article.relatedPlantId) {
    const direct = PLANTS_DATA.find((p) => p.id === article.relatedPlantId);
    if (direct) return direct;
  }
  if (article.category === 'Pet Friendly') {
    const safe = PLANTS_DATA.find((p) => p.petSafe);
    if (safe) return safe;
  }
  if (article.category === 'Beginner') {
    const easy = PLANTS_DATA.find((p) => p.easyCare);
    if (easy) return easy;
  }
  if (article.category === 'Home') {
    const low = PLANTS_DATA.find((p) => p.lowLight);
    if (low) return low;
  }
  return PLANTS_DATA[0];
}

export const ArticleScreen: React.FC<ArticleScreenProps> = ({
  slug,
  onBack,
  onOpenArticle,
  onSelectPlant,
  onGoToCart,
}) => {
  const { isDesktop } = useResponsive();
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const article = ARTICLES.find((a) => a.slug === slug) || ARTICLES[0];
  const plant = resolveRelatedPlant(article);
  const related = [
    ...ARTICLES.filter((a) => a.slug !== article.slug && a.category === article.category),
    ...ARTICLES.filter((a) => a.slug !== article.slug && a.category !== article.category),
  ].slice(0, 3);

  const handleAdd = () => {
    addItem(plant, plant.sizes[0]?.id || 'sm', plant.vessels[0]?.id || 'sage', true, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.inner, isDesktop && styles.innerDesktop]}>
        <TouchableOpacity
          style={styles.backRow}
          onPress={onBack}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Back to the plant journal"
        >
          <Ionicons name="arrow-back" size={16} color={Colors.secondary} />
          <Text style={styles.backText}>Journal</Text>
        </TouchableOpacity>

        <Text style={styles.eyebrow}>Botanical Journal</Text>
        <Text style={styles.title}>{article.title}</Text>
        <Text style={styles.intro}>{article.intro}</Text>
        <Text style={styles.meta}>
          {article.readTime} · {article.category}
        </Text>

        <Image
          source={{ uri: articleImage(article) }}
          style={[styles.hero, isDesktop && styles.heroDesktop]}
          accessibilityLabel={article.title}
        />

        {article.sections.map((section) => (
          <View key={section.heading} style={styles.section}>
            <Text style={styles.sectionHeading}>{section.heading}</Text>
            {section.body.map((para, i) => (
              <Text key={i} style={styles.paragraph}>
                {para}
              </Text>
            ))}
          </View>
        ))}

        {article.routine.length > 0 && (
          <View style={styles.routineCard}>
            <Text style={styles.routineTitle}>Care routine</Text>
            {article.routine.map((item) => (
              <View key={item} style={styles.routineRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.secondary} />
                <Text style={styles.routineText}>{item}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Product connection: read → learn → add to cart */}
        <View style={styles.productCard}>
          <Text style={styles.eyebrow}>Ready to grow your own?</Text>
          <TouchableOpacity
            onPress={() => onSelectPlant(plant)}
            activeOpacity={0.9}
            accessibilityRole="button"
            accessibilityLabel={`View ${plant.name} details`}
          >
            <Text style={styles.productName}>{plant.name}</Text>
          </TouchableOpacity>
          <Text style={styles.productPrice}>{formatINR(plant.price)}</Text>
          <View style={styles.productMeta}>
            <Text style={styles.productMetaText}>
              {[plant.lowLight ? 'Low light' : 'Medium light',
                plant.easyCare ? 'Easy care' : plant.care.difficulty,
                plant.petSafe ? 'Pet friendly' : 'Tropical']
                .join('  ·  ')}
            </Text>
          </View>
          <View style={styles.productActions}>
            <TouchableOpacity
              style={[styles.addButton, added && styles.addButtonAdded]}
              onPress={handleAdd}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel={added ? `${plant.name} added to cart` : `Add ${plant.name} to cart`}
            >
              <Ionicons
                name={added ? 'checkmark' : 'bag-handle-outline'}
                size={16}
                color={Colors.onPrimary}
              />
              <Text style={styles.addButtonText}>
                {added ? 'Added!' : 'Add to Cart'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cartLink}
              onPress={onGoToCart}
              accessibilityRole="button"
              accessibilityLabel="Go to cart"
            >
              <Text style={styles.cartLinkText}>Go to Cart →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Related articles */}
        <Text style={styles.relatedTitle}>Keep reading</Text>
        <View style={[styles.relatedGrid, isDesktop && styles.relatedGridDesktop]}>
          {related.map((rel) => (
            <TouchableOpacity
              key={rel.slug}
              style={styles.relatedCard}
              onPress={() => onOpenArticle(rel.slug)}
              activeOpacity={0.9}
              accessibilityRole="button"
              accessibilityLabel={`Read ${rel.title}`}
            >
              <Image
                source={{ uri: articleImage(rel) }}
                style={styles.relatedImage}
                accessibilityLabel={rel.title}
              />
              <View style={styles.relatedBody}>
                <Text style={styles.relatedTag}>
                  {rel.category} · {rel.readTime}
                </Text>
                <Text style={styles.relatedName} numberOfLines={2}>
                  {rel.title}
                </Text>
                <Text style={styles.relatedLink}>Read guide →</Text>
              </View>
            </TouchableOpacity>
          ))}
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
    paddingBottom: 48,
  },
  inner: {
    width: '100%',
    paddingHorizontal: Spacing.marginMobile,
    paddingTop: Spacing.md,
    gap: 12,
  },
  innerDesktop: {
    maxWidth: 800,
    alignSelf: 'center',
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingVertical: 6,
  },
  backText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  title: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 32,
    lineHeight: 40,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.5,
  },
  intro: {
    fontSize: 16,
    lineHeight: 25,
    color: Colors.onSurfaceVariant,
  },
  meta: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: Colors.outline,
  },
  hero: {
    width: '100%',
    aspectRatio: 16 / 10,
    borderRadius: Radii.xl,
    resizeMode: 'cover',
    marginTop: 6,
    backgroundColor: Colors.surfaceContainerLow,
  },
  heroDesktop: {
    aspectRatio: 16 / 8,
  },
  section: {
    gap: 8,
    marginTop: 8,
  },
  sectionHeading: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  paragraph: {
    fontSize: 15,
    lineHeight: 24,
    color: Colors.onSurface,
  },
  routineCard: {
    backgroundColor: Colors.secondaryTender,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    gap: 10,
    marginTop: 8,
  },
  routineTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 17,
    fontWeight: '700',
    color: Colors.primary,
  },
  routineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  routineText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.onSurface,
    flex: 1,
  },
  productCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    padding: Spacing.lg,
    gap: 8,
    marginTop: 12,
    ...Shadows.sm,
  },
  productName: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  productMeta: {},
  productMetaText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  productActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginTop: 6,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: Radii.md,
  },
  addButtonAdded: {
    backgroundColor: Colors.secondary,
  },
  addButtonText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  cartLink: {
    paddingVertical: 8,
  },
  cartLinkText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  relatedTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 22,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 16,
  },
  relatedGrid: {
    gap: 12,
  },
  relatedGridDesktop: {
    flexDirection: 'row',
  },
  relatedCard: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.sm,
  },
  relatedImage: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  relatedBody: {
    padding: Spacing.md,
    gap: 5,
  },
  relatedTag: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  relatedName: {
    fontSize: 15,
    lineHeight: 21,
    fontWeight: '700',
    color: Colors.primary,
  },
  relatedLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 2,
  },
});
