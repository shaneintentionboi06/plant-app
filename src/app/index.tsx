import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Header, HomeSection } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomeScreen, SectionRequest } from '@/screens/HomeScreen';
import { ArticleScreen } from '@/screens/ArticleScreen';
import { ProductDetailsScreen } from '@/screens/ProductDetailsScreen';
import { CartScreen } from '@/screens/CartScreen';
import { AccountScreen } from '@/screens/AccountScreen';
import { LocationZoneModal } from '@/screens/LocationZoneModal';
import { PlantSpecimen, PLANTS_DATA } from '@/data/plants';
import { Colors } from '@/constants/theme';
import { useResponsive } from '@/hooks/useResponsive';
import { useZoneStore } from '@/store/useZoneStore';

export default function BotanicalApp() {
  const { isDesktop } = useResponsive();
  const openZonePicker = useZoneStore((s) => s.openZonePicker);

  const [currentTab, setCurrentTab] = useState<'catalog' | 'cart' | 'account' | 'details' | 'article'>('catalog');
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecimen | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<string>('monstera-care');
  const [searchQuery, setSearchQuery] = useState('');
  const [sectionRequest, setSectionRequest] = useState<SectionRequest | null>(null);
  const [wishlistOnly, setWishlistOnly] = useState(false);

  const handleSelectPlant = (plant: PlantSpecimen) => {
    setSelectedPlant(plant);
    setCurrentTab('details');
  };

  const handleSelectPlantById = (id: string) => {
    const found = PLANTS_DATA.find((p) => p.id === id);
    if (found) {
      setSelectedPlant(found);
      setCurrentTab('details');
    }
  };

  const handleOpenArticle = (slug: string) => {
    setSelectedArticle(slug);
    setCurrentTab('article');
  };

  const handleNavigate = (section: HomeSection) => {
    if (currentTab !== 'catalog') setCurrentTab('catalog');
    setSectionRequest({ section, nonce: Date.now() });
  };

  const handleToggleWishlist = () => {
    const next = !wishlistOnly;
    setWishlistOnly(next);
    if (currentTab !== 'catalog') setCurrentTab('catalog');
    setSectionRequest({ section: 'shop', nonce: Date.now() });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.appContainer}>
        {/* Universal Top Header */}
        <Header
          currentTab={currentTab}
          onSelectTab={(tab) => {
            if (tab === 'catalog' || tab === 'cart' || tab === 'account') {
              setCurrentTab(tab);
            }
          }}
          onNavigate={handleNavigate}
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentTab !== 'catalog') setCurrentTab('catalog');
          }}
          wishlistActive={wishlistOnly}
          onToggleWishlist={handleToggleWishlist}
        />

        {/* Dynamic Screen Switcher */}
        <View style={styles.mainContent}>
          {currentTab === 'details' && selectedPlant ? (
            <ProductDetailsScreen
              plant={selectedPlant}
              onBack={() => setCurrentTab('catalog')}
              onGoToCart={() => setCurrentTab('cart')}
            />
          ) : currentTab === 'cart' ? (
            <CartScreen
              onContinueShopping={() => setCurrentTab('catalog')}
              onSelectPlantById={handleSelectPlantById}
            />
          ) : currentTab === 'account' ? (
            <AccountScreen />
          ) : currentTab === 'article' ? (
            <ArticleScreen
              slug={selectedArticle}
              onBack={() => setCurrentTab('catalog')}
              onOpenArticle={handleOpenArticle}
              onSelectPlant={handleSelectPlant}
              onGoToCart={() => setCurrentTab('cart')}
            />
          ) : (
            <HomeScreen
              onSelectPlant={handleSelectPlant}
              searchQuery={searchQuery}
              sectionRequest={sectionRequest}
              wishlistOnly={wishlistOnly}
              onClearWishlist={() => setWishlistOnly(false)}
              onOpenGreenhouse={() => setCurrentTab('account')}
              onOpenCart={() => setCurrentTab('cart')}
              onNavigate={handleNavigate}
              onOpenArticle={handleOpenArticle}
            />
          )}
        </View>

        {/* Mobile Bottom Navigation (Hidden on Desktop) */}
        {!isDesktop && (
          <BottomNav
            currentTab={currentTab}
            onSelectTab={(tab) => {
              if (tab === 'catalog' || tab === 'cart' || tab === 'account') {
                setCurrentTab(tab);
              }
            }}
            onOpenZonePicker={openZonePicker}
          />
        )}

        {/* Global Growing Zone Modal */}
        <LocationZoneModal />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.surface,
    paddingTop: Platform.OS === 'android' ? 24 : 0,
  },
  appContainer: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  mainContent: {
    flex: 1,
  },
});
