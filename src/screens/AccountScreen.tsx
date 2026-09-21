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
import { useAuthStore } from '../store/useAuthStore';
import { useResponsive } from '../hooks/useResponsive';
import { useWishlistStore } from '../store/useWishlistStore';

export const AccountScreen: React.FC = () => {
  const { isDesktop } = useResponsive();
  const {
    user,
    isAuthenticated,
    adoptedPlants,
    waterAdoptedPlant,
    login,
    register,
    logout,
  } = useAuthStore();
  const wishlistCount = useWishlistStore((s) => s.wishlistIds.length);

  const [activeTab, setActiveTab] = useState<'greenhouse' | 'auth'>('greenhouse');
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signin');
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [passInput, setPassInput] = useState('');

  const handleAuthSubmit = () => {
    if (authMode === 'signin') {
      login(emailInput || 'emma.green@botanical.atelier', passInput || 'password');
    } else {
      register(nameInput || 'New Plant Steward', emailInput || 'steward@botanical.atelier', passInput || 'password');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.innerContent, isDesktop && styles.desktopInner]}>
        {/* Member Sanctuary Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTag}>Member Sanctuary</Text>
            <Text style={styles.headerTitle}>Botanical Atelier & Account Portal</Text>
          </View>
          <View style={styles.cloudSyncPill}>
            <MaterialCommunityIcons name="cloud-check" size={16} color={Colors.secondary} />
            <Text style={styles.cloudSyncText}>Cloud Sync Active</Text>
          </View>
        </View>

        {/* Member Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: user.avatarUrl }} style={styles.avatarImage} />
              <View style={styles.avatarBadge}>
                <MaterialCommunityIcons name="sprout" size={14} color={Colors.surface} />
              </View>
            </View>

            <View style={styles.profileDetails}>
              <View style={styles.nameRow}>
                <Text style={styles.userName}>{user.name}</Text>
                <View style={styles.clubBadge}>
                  <Text style={styles.clubBadgeText}>Club Member</Text>
                </View>
              </View>

              <View style={styles.tierRow}>
                <Ionicons name="shield-checkmark" size={14} color={Colors.secondary} />
                <Text style={styles.tierText}>{user.tier}</Text>
              </View>

              {/* Eco Points Progress Bar */}
              <View style={styles.progressBarTrack}>
                <View
                  style={[
                    styles.progressBarFill,
                    { width: `${(user.ecoPoints / user.nextTierPoints) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.pointsSubtext}>
                {user.ecoPoints} / {user.nextTierPoints} Eco-Points to Master Arborist
              </Text>
            </View>
          </View>

          {/* Stewardship Stats Counter */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{adoptedPlants.length}</Text>
              <Text style={styles.statLabel}>Adopted Plants</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={[styles.statValue, { color: Colors.secondary }]}>
                {user.treesGrown}
              </Text>
              <Text style={styles.statLabel}>Trees Grown</Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statValue}>{wishlistCount}</Text>
              <Text style={styles.statLabel}>Wishlist Items</Text>
            </View>
          </View>
        </View>

        {/* Section Tabs: Greenhouse Collection vs Auth Form */}
        <View style={styles.tabsSegment}>
          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'greenhouse' && styles.tabButtonActive]}
            onPress={() => setActiveTab('greenhouse')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons
              name="greenhouse"
              size={18}
              color={activeTab === 'greenhouse' ? Colors.onPrimary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'greenhouse' && styles.tabButtonTextActive,
              ]}
            >
              My Living Greenhouse
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tabButton, activeTab === 'auth' && styles.tabButtonActive]}
            onPress={() => setActiveTab('auth')}
            activeOpacity={0.8}
          >
            <Ionicons
              name="person-outline"
              size={18}
              color={activeTab === 'auth' ? Colors.onPrimary : Colors.onSurfaceVariant}
            />
            <Text
              style={[
                styles.tabButtonText,
                activeTab === 'auth' && styles.tabButtonTextActive,
              ]}
            >
              Account & Credentials
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab 1: Greenhouse Collection */}
        {activeTab === 'greenhouse' && (
          <View style={styles.greenhouseSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Living Specimens In Your Care</Text>
              <Text style={styles.sectionDesc}>
                Log hydration cadence and monitor health in real time.
              </Text>
            </View>

            <View style={styles.adoptedGrid}>
              {adoptedPlants.map((plant) => (
                <View key={plant.id} style={styles.adoptedCard}>
                  <Image source={{ uri: plant.imageUrl }} style={styles.adoptedImage} />
                  <View style={styles.adoptedInfo}>
                    <View style={styles.adoptedHeaderRow}>
                      <View>
                        <Text style={styles.adoptedName}>{plant.name}</Text>
                        <Text style={styles.adoptedSpecies}>{plant.species}</Text>
                      </View>
                      <View
                        style={[
                          styles.healthBadge,
                          plant.health === 'Ready to Water'
                            ? styles.healthBadgeAlert
                            : styles.healthBadgeOk,
                        ]}
                      >
                        <Text
                          style={[
                            styles.healthBadgeText,
                            plant.health === 'Ready to Water' && { color: Colors.amber },
                          ]}
                        >
                          {plant.health}
                        </Text>
                      </View>
                    </View>

                    <View style={styles.waterInfoRow}>
                      <Ionicons name="time-outline" size={14} color={Colors.outline} />
                      <Text style={styles.waterInfoText}>
                        Last Watered: {plant.lastWatered} (Every {plant.waterCadenceDays}d)
                      </Text>
                    </View>

                    <TouchableOpacity
                      style={styles.waterBtn}
                      activeOpacity={0.8}
                      onPress={() => waterAdoptedPlant(plant.id)}
                    >
                      <Ionicons name="water" size={16} color={Colors.onSecondary} />
                      <Text style={styles.waterBtnText}>Log Watering (+15 pts)</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Tab 2: Authentication / Settings Form */}
        {activeTab === 'auth' && (
          <View style={styles.authSection}>
            <View style={styles.authCard}>
              <View style={styles.authToggle}>
                <TouchableOpacity
                  style={[styles.authToggleBtn, authMode === 'signin' && styles.authToggleBtnActive]}
                  onPress={() => setAuthMode('signin')}
                >
                  <Text
                    style={[
                      styles.authToggleText,
                      authMode === 'signin' && styles.authToggleTextActive,
                    ]}
                  >
                    Sign In
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[styles.authToggleBtn, authMode === 'signup' && styles.authToggleBtnActive]}
                  onPress={() => setAuthMode('signup')}
                >
                  <Text
                    style={[
                      styles.authToggleText,
                      authMode === 'signup' && styles.authToggleTextActive,
                    ]}
                  >
                    Create Account
                  </Text>
                </TouchableOpacity>
              </View>

              {authMode === 'signup' && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>Full Botanical Name</Text>
                  <TextInput
                    style={styles.textInputField}
                    placeholder="e.g. Emma Green"
                    placeholderTextColor={Colors.outline}
                    value={nameInput}
                    onChangeText={setNameInput}
                  />
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Botanical Atelier Email</Text>
                <TextInput
                  style={styles.textInputField}
                  placeholder="steward@botanical.living"
                  placeholderTextColor={Colors.outline}
                  value={emailInput}
                  onChangeText={setEmailInput}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                  style={styles.textInputField}
                  placeholder="••••••••••••"
                  placeholderTextColor={Colors.outline}
                  secureTextEntry
                  value={passInput}
                  onChangeText={setPassInput}
                />
              </View>

              <TouchableOpacity
                style={styles.submitAuthBtn}
                activeOpacity={0.85}
                onPress={handleAuthSubmit}
              >
                <Text style={styles.submitAuthBtnText}>
                  {authMode === 'signin' ? 'Sign In to Atelier' : 'Create Member Account'}
                </Text>
              </TouchableOpacity>

              {/* Logout Button if signed in */}
              {isAuthenticated && (
                <TouchableOpacity
                  style={styles.logoutBtn}
                  onPress={logout}
                  activeOpacity={0.8}
                >
                  <Ionicons name="log-out-outline" size={16} color={Colors.error} />
                  <Text style={styles.logoutBtnText}>Sign Out Current Session</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
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
    gap: 20,
  },
  desktopInner: {
    maxWidth: 960,
    alignSelf: 'center',
    padding: Spacing.marginDesktop,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.secondary,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  headerTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 24,
    fontWeight: '700',
    color: Colors.primary,
    marginTop: 2,
  },
  cloudSyncPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceContainerLow,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.full,
    gap: 6,
  },
  cloudSyncText: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: 20,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
  },
  profileTop: {
    flexDirection: 'row',
    gap: 16,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
  },
  avatarImage: {
    width: 72,
    height: 72,
    borderRadius: Radii.lg,
    resizeMode: 'cover',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.primary,
    width: 24,
    height: 24,
    borderRadius: Radii.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileDetails: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  userName: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primary,
  },
  clubBadge: {
    backgroundColor: Colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.full,
  },
  clubBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primary,
  },
  tierRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tierText: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: Colors.surfaceContainerHigh,
    borderRadius: Radii.full,
    overflow: 'hidden',
    marginTop: 4,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: Radii.full,
  },
  pointsSubtext: {
    fontSize: 10,
    color: Colors.outline,
    marginTop: 2,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingVertical: 12,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  statLabel: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.surfaceContainerHigh,
  },
  tabsSegment: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainer,
    padding: 4,
    borderRadius: Radii.lg,
    gap: 4,
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radii.md,
    gap: 6,
  },
  tabButtonActive: {
    backgroundColor: Colors.primary,
  },
  tabButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  tabButtonTextActive: {
    color: Colors.onPrimary,
  },
  greenhouseSection: {
    gap: 14,
  },
  sectionHeader: {
    gap: 2,
  },
  sectionTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 18,
    fontWeight: '700',
    color: Colors.primary,
  },
  sectionDesc: {
    fontSize: 12,
    color: Colors.onSurfaceVariant,
  },
  adoptedGrid: {
    gap: 12,
  },
  adoptedCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.lg,
    padding: 12,
    flexDirection: 'row',
    gap: 14,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
    alignItems: 'center',
  },
  adoptedImage: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
    resizeMode: 'cover',
  },
  adoptedInfo: {
    flex: 1,
    gap: 6,
  },
  adoptedHeaderRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  adoptedName: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  adoptedSpecies: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.full,
  },
  healthBadgeOk: {
    backgroundColor: Colors.secondaryTender,
  },
  healthBadgeAlert: {
    backgroundColor: '#fef3c7',
  },
  healthBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.secondary,
  },
  waterInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  waterInfoText: {
    fontSize: 11,
    color: Colors.outline,
  },
  waterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radii.md,
    alignSelf: 'flex-start',
    gap: 6,
    marginTop: 2,
  },
  waterBtnText: {
    color: Colors.onSecondary,
    fontSize: 11,
    fontWeight: '700',
  },
  authSection: {
    width: '100%',
  },
  authCard: {
    backgroundColor: Colors.surfaceContainerLowest,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    gap: 16,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.surfaceContainerLow,
  },
  authToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceContainer,
    borderRadius: Radii.md,
    padding: 3,
  },
  authToggleBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radii.sm,
  },
  authToggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  authToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.onSurfaceVariant,
  },
  authToggleTextActive: {
    color: Colors.onPrimary,
  },
  inputGroup: {
    gap: 6,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.onSurface,
  },
  textInputField: {
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.onSurface,
  },
  submitAuthBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radii.md,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  submitAuthBtnText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingTop: 8,
  },
  logoutBtnText: {
    color: Colors.error,
    fontSize: 13,
    fontWeight: '600',
  },
});
