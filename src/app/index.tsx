import React, { useState } from 'react';
import { View, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { Header } from '@/components/Header';
import { BottomNav } from '@/components/BottomNav';
import { HomeScreen } from '@/screens/HomeScreen';
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

  const [currentTab, setCurrentTab] = useState<'catalog' | 'cart' | 'account' | 'details'>('catalog');
  const [selectedPlant, setSelectedPlant] = useState<PlantSpecimen | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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
          searchQuery={searchQuery}
          onSearchChange={(q) => {
            setSearchQuery(q);
            if (currentTab !== 'catalog') setCurrentTab('catalog');
          }}
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
          ) : (
            <HomeScreen
              onSelectPlant={handleSelectPlant}
              searchQuery={searchQuery}
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
