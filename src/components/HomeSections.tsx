import React, { useMemo, useState } from 'react';
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
import { PlantSpecimen } from '../data/plants';
import { ARTICLES, ARTICLE_CATEGORIES, ArticleCategory, articleImage } from '../data/articles';
import type { HomeSection } from './Header';
import { PlantCard } from './PlantCard';
import { useAuthStore } from '../store/useAuthStore';
import { usePlantsStore } from '../store/usePlantsStore';

// ---------- Shared section heading ----------

export const SectionHeading: React.FC<{
  eyebrow: string;
  title: string;
  subtitle?: string;
  actionLabel?: string;
  onAction?: () => void;
}> = ({ eyebrow, title, subtitle, actionLabel, onAction }) => (
  <View style={styles.heading}>
    <View style={styles.headingMain}>
      <Text style={styles.eyebrow}>{eyebrow}</Text>
      <Text style={styles.headingTitle}>{title}</Text>
      {subtitle ? <Text style={styles.headingSubtitle}>{subtitle}</Text> : null}
    </View>
    {actionLabel ? (
      <TouchableOpacity
        onPress={onAction}
        accessibilityRole="button"
        accessibilityLabel={actionLabel}
      >
        <Text style={styles.headingAction}>{actionLabel}</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

// ---------- Shop by need ----------

const NEEDS: {
  id: string;
  label: string;
  note: string;
  icon: string;
  iconType: 'ion' | 'mat';
}[] = [
  { id: 'low-light', label: 'Low Light', note: 'Thrives in shade', icon: 'cloudy-outline', iconType: 'ion' },
  { id: 'pet-friendly', label: 'Pet Friendly', note: 'Safe for paws', icon: 'paw-outline', iconType: 'ion' },
  { id: 'easy-care', label: 'Easy Care', note: 'Forgiving & hardy', icon: 'water-outline', iconType: 'ion' },
  { id: 'air-purifying', label: 'Air Purifying', note: 'Fresher rooms', icon: 'leaf-outline', iconType: 'ion' },
  { id: 'trees', label: 'Large Plants', note: 'Statement pieces', icon: 'tree', iconType: 'mat' },
  { id: 'under-3000', label: 'Beginner Friendly', note: 'Under ₹3,000', icon: 'sparkles-outline', iconType: 'ion' },
];

export const ShopByNeed: React.FC<{ onSelect: (id: string) => void }> = ({
  onSelect,
}) => {
  const { isDesktop } = useResponsive();
  return (
    <View>
      <SectionHeading
        eyebrow="Collections"
        title="Shop by Need"
        subtitle="Curated groupings for every kind of home and keeper."
      />
      <View style={[styles.needGrid, isDesktop && styles.needGridDesktop]}>
        {NEEDS.map((need) => (
          <TouchableOpacity
            key={need.id}
            style={[styles.needCard, isDesktop && styles.needCardDesktop]}
            activeOpacity={0.88}
            onPress={() => onSelect(need.id)}
            accessibilityRole="button"
            accessibilityLabel={`Shop ${need.label}`}
          >
            <View style={styles.needIconWrap}>
              {need.iconType === 'ion' ? (
                <Ionicons name={need.icon as any} size={22} color={Colors.primary} />
              ) : (
                <MaterialCommunityIcons name={need.icon as any} size={22} color={Colors.primary} />
              )}
            </View>
            <Text style={styles.needLabel}>{need.label}</Text>
            <Text style={styles.needNote}>{need.note}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// ---------- Featured plants ----------

type FeaturedTab = 'new' | 'best' | 'rare' | 'beginner';

const TABS: { id: FeaturedTab; label: string }[] = [
  { id: 'new', label: 'New Arrivals' },
  { id: 'best', label: 'Best Sellers' },
  { id: 'rare', label: 'Rare Plants' },
  { id: 'beginner', label: 'Beginner Plants' },
];

export const FeaturedPlants: React.FC<{
  onSelectPlant: (p: PlantSpecimen) => void;
}> = ({ onSelectPlant }) => {
  const { isDesktop, numColumns } = useResponsive();
  const [tab, setTab] = useState<FeaturedTab>('best');
  const allPlants = usePlantsStore((s) => s.plants);

  const plants = useMemo(() => {
    switch (tab) {
      case 'best':
        return allPlants.filter((p) => p.bestseller).concat(
          allPlants.filter((p) => !p.bestseller)
        ).slice(0, 4);
      case 'rare':
        return [...allPlants].sort((a, b) => b.rating - a.rating).slice(0, 4);
      case 'beginner':
        return allPlants.filter((p) => p.easyCare).slice(0, 4);
      case 'new':
      default:
        return [...allPlants].reverse().slice(0, 4);
    }
  }, [allPlants, tab]);

  return (
    <View>
      <SectionHeading
        eyebrow="The Edit"
        title="Featured Plants"
        subtitle="Larger specimens, stronger imagery, hand-picked by our growers."
      />
      <View style={styles.tabRow}>
        {TABS.map((t) => {
          const active = tab === t.id;
          return (
            <TouchableOpacity
              key={t.id}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setTab(t.id)}
              activeOpacity={0.85}
              accessibilityRole="button"
              accessibilityLabel={t.label}
              accessibilityState={{ selected: active }}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {t.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      <View
        style={[
          styles.featuredGrid,
          isDesktop && styles.featuredGridDesktop,
          { flexDirection: 'row', flexWrap: 'wrap' },
        ]}
      >
        {plants.map((plant) => (
          <View key={plant.id} style={{ width: `${100 / numColumns}%` as any }}>
            <PlantCard plant={plant} onPress={onSelectPlant} large />
          </View>
        ))}
      </View>
    </View>
  );
};

// ---------- Plant journal ----------

// ---------- Plant journal ----------

export const PlantJournal: React.FC<{ onOpenArticle: (slug: string) => void }> = ({
  onOpenArticle,
}) => {
  const { isDesktop } = useResponsive();
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState<'All' | ArticleCategory>('All');
  const [hovered, setHovered] = useState<string | null>(null);

  const featured = ARTICLES[0];
  const rest = useMemo(() => {
    const pool = ARTICLES.slice(1).filter(
      (a) => category === 'All' || a.category === category
    );
    return expanded ? pool : pool.slice(0, 2);
  }, [expanded, category]);

  const hoverProps = (slug: string) =>
    Platform.OS === 'web'
      ? {
          onMouseEnter: () => setHovered(slug),
          onMouseLeave: () => setHovered(null),
        }
      : {};

  return (
    <View>
      <SectionHeading
        eyebrow="Botanical Journal"
        title="The Plant Journal"
        subtitle="Thoughtful guides, practical care tips, and botanical inspiration to help your plants thrive."
        actionLabel="View all guides →"
        onAction={() => setExpanded(true)}
      />

      {/* Featured article */}
      <TouchableOpacity
        style={[styles.journalLead, hovered === featured.slug && styles.journalLeadHovered]}
        activeOpacity={0.94}
        onPress={() => onOpenArticle(featured.slug)}
        accessibilityRole="button"
        accessibilityLabel={`Read the full guide: ${featured.title}`}
        {...(hoverProps(featured.slug) as object)}
      >
        <Image
          source={{ uri: articleImage(featured) }}
          style={[styles.journalLeadImage, hovered === featured.slug && styles.journalImageHovered]}
          accessibilityLabel={featured.title}
        />
        <View style={styles.journalLeadBody}>
          <Text style={styles.journalTag}>{featured.category}</Text>
          <Text style={styles.journalLeadTitle}>{featured.title}</Text>
          <Text style={styles.journalDesc} numberOfLines={2}>
            {featured.description}
          </Text>
          <Text style={styles.journalMeta}>
            {featured.readTime} · {featured.category}
          </Text>
          <Text style={styles.journalLink}>Read the full guide →</Text>
        </View>
      </TouchableOpacity>

      {/* Category filter (visible once browsing all guides) */}
      {expanded && (
        <View style={styles.journalCats}>
          {(['All', ...ARTICLE_CATEGORIES] as const).map((c) => {
            const active = category === c;
            return (
              <TouchableOpacity
                key={c}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setCategory(c)}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={`Filter guides by ${c}`}
                accessibilityState={{ selected: active }}
              >
                <Text style={[styles.tabText, active && styles.tabTextActive]}>{c}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Secondary articles */}
      <View style={[styles.journalGrid, isDesktop && styles.journalGridDesktop]}>
        {rest.map((a) => (
          <TouchableOpacity
            key={a.slug}
            style={[styles.journalCard, hovered === a.slug && styles.journalCardHovered]}
            activeOpacity={0.9}
            onPress={() => onOpenArticle(a.slug)}
            accessibilityRole="button"
            accessibilityLabel={`Read guide: ${a.title}`}
            {...(hoverProps(a.slug) as object)}
          >
            <Image
              source={{ uri: articleImage(a) }}
              style={[styles.journalImage, hovered === a.slug && styles.journalImageHovered]}
              accessibilityLabel={a.title}
            />
            <View style={styles.journalBody}>
              <Text style={styles.journalTag}>{a.category}</Text>
              <Text style={styles.journalTitle} numberOfLines={2}>
                {a.title}
              </Text>
              <Text style={styles.journalDesc} numberOfLines={2}>
                {a.description}
              </Text>
              <Text style={styles.journalMeta}>{a.readTime}</Text>
              <Text style={styles.journalLink}>Read guide →</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {!expanded ? (
        <TouchableOpacity
          style={styles.viewAllBtn}
          onPress={() => setExpanded(true)}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="View all guides"
        >
          <Text style={styles.viewAllText}>View all guides →</Text>
        </TouchableOpacity>
      ) : (
        <Text style={styles.journalCount}>
          Showing {rest.length} {rest.length === 1 ? 'guide' : 'guides'}
          {category !== 'All' ? ` in ${category}` : ''}
        </Text>
      )}
    </View>
  );
};

// ---------- Greenhouse preview ----------

export const GreenhousePreview: React.FC<{ onOpen: () => void }> = ({
  onOpen,
}) => {
  const { adoptedPlants, user } = useAuthStore();
  const preview = adoptedPlants.slice(0, 3);
  return (
    <View style={styles.greenhouseCard}>
      <View style={styles.greenhouseCopy}>
        <Text style={styles.eyebrow}>My Greenhouse</Text>
        <Text style={styles.greenhouseTitle}>
          {user.name.split(' ')[0]}&apos;s plants are {preview.length ? 'thriving' : 'waiting'}
        </Text>
        <Text style={styles.greenhouseSub}>
          Watering reminders, plant health and your next care activity — all in one calm
          place.
        </Text>
        <TouchableOpacity
          style={styles.greenhouseCta}
          onPress={onOpen}
          activeOpacity={0.88}
          accessibilityRole="button"
          accessibilityLabel="Open my greenhouse"
        >
          <Text style={styles.greenhouseCtaText}>Open My Greenhouse</Text>
          <Ionicons name="arrow-forward" size={16} color={Colors.surface} />
        </TouchableOpacity>
      </View>
      <View style={styles.greenhouseList}>
        {preview.length === 0 ? (
          <Text style={styles.greenhouseEmpty}>
            Adopt your first plant and it will appear here.
          </Text>
        ) : (
          preview.map((p) => (
            <View key={p.id} style={styles.greenhouseRow}>
              <Image
                source={{ uri: p.imageUrl }}
                style={styles.greenhouseThumb}
                accessibilityLabel={p.species}
              />
              <View style={styles.greenhouseRowText}>
                <Text style={styles.greenhousePlant} numberOfLines={1}>
                  {p.name} · {p.species}
                </Text>
                <Text
                  style={[
                    styles.greenhouseStatus,
                    p.health !== 'Thriving' && styles.greenhouseStatusWarn,
                  ]}
                >
                  {p.health === 'Thriving'
                    ? `Water in ${p.waterCadenceDays} days`
                    : p.health}
                </Text>
              </View>
              <Ionicons
                name={p.health === 'Thriving' ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={p.health === 'Thriving' ? Colors.secondary : Colors.amber}
              />
            </View>
          ))
        )}
      </View>
    </View>
  );
};

// ---------- Newsletter ----------

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState('');

  const submit = () => {
    const clean = email.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
      setError('Please enter a valid email address.');
      return;
    }
    setError('');
    setJoined(true);
  };

  return (
    <View style={styles.newsCard}>
      <Text style={styles.eyebrow}>The Journal Letter</Text>
      <Text style={styles.newsTitle}>Grow something beautiful.</Text>
      <Text style={styles.newsSub}>
        Plant care tips, new arrivals and botanical inspiration. Once a month, never
        noisy.
      </Text>
      {joined ? (
        <View style={styles.newsSuccess}>
          <Ionicons name="checkmark-circle" size={20} color={Colors.secondary} />
          <Text style={styles.newsSuccessText}>
            Welcome in — your first letter is on its way.
          </Text>
        </View>
      ) : (
        <View>
          <View style={styles.newsRow}>
            <TextInput
              style={styles.newsInput}
              placeholder="you@example.com"
              placeholderTextColor={Colors.outline}
              value={email}
              onChangeText={(t) => {
                setEmail(t);
                if (error) setError('');
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              accessibilityLabel="Email address"
              onSubmitEditing={submit}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={styles.newsButton}
              onPress={submit}
              activeOpacity={0.88}
              accessibilityRole="button"
              accessibilityLabel="Join the journal"
            >
              <Text style={styles.newsButtonText}>Join the Journal</Text>
            </TouchableOpacity>
          </View>
          {error ? <Text style={styles.newsError}>{error}</Text> : null}
        </View>
      )}
    </View>
  );
};

// ---------- Footer ----------

export const Footer: React.FC<{ onNavigate: (s: HomeSection) => void }> = ({
  onNavigate,
}) => {
  const cols: { title: string; links: { label: string; target: HomeSection }[] }[] = [
    {
      title: 'Shop',
      links: [
        { label: 'All Plants', target: 'shop' },
        { label: 'New Arrivals', target: 'featured' },
        { label: 'Best Sellers', target: 'featured' },
        { label: 'Plant Finder', target: 'finder' },
      ],
    },
    {
      title: 'Plant Care',
      links: [
        { label: 'Find My Plant', target: 'finder' },
        { label: 'Growing Zones', target: 'finder' },
        { label: 'My Greenhouse', target: 'greenhouse' },
        { label: 'Journal', target: 'journal' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', target: 'top' },
        { label: 'Contact', target: 'newsletter' },
        { label: 'Privacy', target: 'top' },
        { label: 'Terms', target: 'top' },
      ],
    },
  ];

  return (
    <View style={styles.footer}>
      <View style={styles.footerBrand}>
        <View style={styles.footerLogoRow}>
          <View style={styles.footerLogoBadge}>
            <MaterialCommunityIcons name="leaf" size={18} color={Colors.surface} />
          </View>
          <Text style={styles.footerBrandText}>PLANTS</Text>
        </View>
        <Text style={styles.footerTagline}>
          A premium plant studio for calm, green homes.
        </Text>
        <View style={styles.socialRow}>
          {['logo-instagram', 'logo-pinterest', 'logo-twitter'].map((icon) => (
            <TouchableOpacity
              key={icon}
              style={styles.socialBtn}
              activeOpacity={0.8}
              accessibilityRole="button"
              accessibilityLabel={icon.replace('logo-', '')}
            >
              <Ionicons name={icon as any} size={18} color={Colors.surface} />
            </TouchableOpacity>
          ))}
        </View>
      </View>
      {cols.map((col) => (
        <View key={col.title} style={styles.footerCol}>
          <Text style={styles.footerColTitle}>{col.title}</Text>
          {col.links.map((l) => (
            <TouchableOpacity
              key={l.label}
              onPress={() => onNavigate(l.target)}
              accessibilityRole="button"
              accessibilityLabel={l.label}
            >
              <Text style={styles.footerLink}>{l.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <Text style={styles.footerLegal}>
        © 2026 Botanical Living Studio · Privacy · Terms
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  heading: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    gap: 12,
    marginBottom: 14,
  },
  headingMain: {
    flex: 1,
    gap: 5,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  headingTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  headingSubtitle: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.onSurfaceVariant,
  },
  headingAction: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
  },
  needGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  needGridDesktop: {
    gap: 12,
  },
  needCard: {
    width: '48%',
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    padding: Spacing.md,
    gap: 4,
    ...Shadows.sm,
  },
  needCardDesktop: {
    width: '32%',
  },
  needIconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Colors.secondaryTender,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  needLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  needNote: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  tabRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: Radii.full,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    backgroundColor: Colors.surface,
  },
  tabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  tabTextActive: {
    color: Colors.onPrimary,
  },
  featuredGrid: {
    width: '100%',
  },
  featuredGridDesktop: {},
  journalGrid: {
    gap: 12,
  },
  journalGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  journalLead: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    marginBottom: 12,
    ...Shadows.sm,
  },
  journalLeadHovered: {
    borderColor: Colors.outlineVariant,
    ...Shadows.md,
  },
  journalLeadImage: {
    width: '100%',
    height: 220,
    resizeMode: 'cover',
  },
  journalLeadBody: {
    padding: Spacing.lg,
    gap: 7,
  },
  journalLeadTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: -0.3,
  },
  journalCats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  journalCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
    ...Shadows.sm,
  },
  journalCardHovered: {
    borderColor: Colors.outlineVariant,
    ...Shadows.md,
  },
  journalImage: {
    width: '100%',
    height: 190,
    resizeMode: 'cover',
  },
  journalImageHovered: {
    transform: [{ scale: 1.04 }],
  },
  journalBody: {
    padding: Spacing.md,
    gap: 6,
  },
  journalTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.secondary,
  },
  journalTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    lineHeight: 24,
    fontWeight: '600',
    color: Colors.primary,
  },
  journalLink: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.secondary,
    marginTop: 2,
  },
  journalDesc: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.onSurfaceVariant,
  },
  journalMeta: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
    color: Colors.outline,
  },
  viewAllBtn: {
    alignSelf: 'center',
    marginTop: 14,
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: Radii.full,
    paddingHorizontal: 24,
    paddingVertical: 11,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primary,
  },
  journalCount: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 12,
  },
  greenhouseCard: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: 18,
    ...Shadows.lg,
  },
  greenhouseCopy: {
    gap: 8,
  },
  greenhouseTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: Colors.surface,
  },
  greenhouseSub: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.inversePrimary,
  },
  greenhouseCta: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 8,
    backgroundColor: Colors.secondary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: Radii.md,
    marginTop: 4,
  },
  greenhouseCtaText: {
    color: Colors.surface,
    fontSize: 14,
    fontWeight: '700',
  },
  greenhouseList: {
    gap: 10,
  },
  greenhouseEmpty: {
    color: Colors.inversePrimary,
    fontSize: 13,
  },
  greenhouseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: 'rgba(251, 249, 245, 0.1)',
    borderRadius: Radii.lg,
    padding: 10,
  },
  greenhouseThumb: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  greenhouseRowText: {
    flex: 1,
    gap: 2,
  },
  greenhousePlant: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.surface,
  },
  greenhouseStatus: {
    fontSize: 12,
    color: Colors.secondaryContainer,
  },
  greenhouseStatusWarn: {
    color: Colors.amberLight,
    fontWeight: '700',
  },
  newsCard: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    gap: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.surfaceContainer,
  },
  newsTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '700',
    color: Colors.primary,
    textAlign: 'center',
  },
  newsSub: {
    fontSize: 14,
    lineHeight: 21,
    color: Colors.onSurfaceVariant,
    textAlign: 'center',
    maxWidth: 480,
  },
  newsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
    maxWidth: 520,
    marginTop: 8,
  },
  newsInput: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.outlineVariant,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: Colors.onSurface,
  },
  newsButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingHorizontal: 18,
    justifyContent: 'center',
  },
  newsButtonText: {
    color: Colors.onPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  newsError: {
    fontSize: 12,
    color: Colors.error,
    marginTop: 8,
  },
  newsSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.secondaryTender,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: Radii.md,
    marginTop: 8,
  },
  newsSuccessText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.primary,
  },
  footer: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
  },
  footerBrand: {
    width: '100%',
    gap: 10,
  },
  footerLogoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerLogoBadge: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.primaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerBrandText: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: Colors.surface,
  },
  footerTagline: {
    fontSize: 13,
    lineHeight: 19,
    color: Colors.inversePrimary,
    maxWidth: 320,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 8,
  },
  socialBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(251, 249, 245, 0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerCol: {
    minWidth: 120,
    flex: 1,
    gap: 8,
  },
  footerColTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: Colors.secondaryContainer,
    marginBottom: 2,
  },
  footerLink: {
    fontSize: 13,
    color: Colors.surface,
    paddingVertical: 3,
  },
  footerLegal: {
    width: '100%',
    fontSize: 11,
    color: Colors.inversePrimary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(251, 249, 245, 0.16)',
    paddingTop: 12,
    marginTop: 4,
  },
});
