import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Radii, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useChatStore } from '../store/useChatStore';

export const ChatFab: React.FC = () => {
  const { isDesktop } = useResponsive();
  const isOpen = useChatStore((s) => s.isOpen);
  const toggleChat = useChatStore((s) => s.toggleChat);

  if (isOpen) return null;

  return (
    <TouchableOpacity
      style={[styles.fab, isDesktop ? styles.fabDesktop : styles.fabMobile]}
      onPress={toggleChat}
      activeOpacity={0.85}
      accessibilityLabel="Chat with Planty, the plant-care assistant"
    >
      <Ionicons name="leaf" size={26} color={Colors.onPrimary} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    ...Shadows.lg,
  },
  fabMobile: {
    bottom: 80, // clears the BottomNav bar
  },
  fabDesktop: {
    bottom: 28,
  },
});
