import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
  FlatList,
  KeyboardAvoidingView,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useResponsive } from '../hooks/useResponsive';
import { useChatStore, ChatMessage } from '../store/useChatStore';

const SUGGESTED_PROMPTS = [
  'Why are my leaves turning yellow?',
  'How often should I water a pothos?',
  'Best low-light plants for an apartment?',
  'How do I repot a rootbound plant?',
];

export const ChatScreen: React.FC = () => {
  const { isDesktop } = useResponsive();
  const {
    messages,
    isOpen,
    isSending,
    isBackendReady,
    closeChat,
    sendMessage,
    checkHealth,
  } = useChatStore();

  const [draft, setDraft] = useState('');
  const listRef = useRef<FlatList<ChatMessage>>(null);

  // Poll health while the panel is open and the backend isn't confirmed ready yet
  // (covers the case where the container is still pulling the Ollama model).
  useEffect(() => {
    if (!isOpen || isBackendReady) return;
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, [isOpen, isBackendReady, checkHealth]);

  useEffect(() => {
    if (isOpen && messages.length > 0) {
      requestAnimationFrame(() => listRef.current?.scrollToEnd({ animated: true }));
    }
  }, [messages.length, isOpen]);

  if (!isOpen) return null;

  const handleSend = () => {
    if (!draft.trim() || isSending) return;
    sendMessage(draft);
    setDraft('');
  };

  const handlePrompt = (prompt: string) => {
    if (isSending) return;
    sendMessage(prompt);
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View
      style={[
        styles.bubbleRow,
        item.role === 'user' ? styles.bubbleRowUser : styles.bubbleRowAssistant,
      ]}
    >
      <View
        style={[
          styles.bubble,
          item.role === 'user' ? styles.bubbleUser : styles.bubbleAssistant,
          item.status === 'error' && styles.bubbleError,
        ]}
      >
        <Text style={item.role === 'user' ? styles.bubbleTextUser : styles.bubbleTextAssistant}>
          {item.text}
        </Text>
      </View>
    </View>
  );

  return (
    <Modal visible={isOpen} transparent animationType="fade" onRequestClose={closeChat}>
      <Pressable style={styles.overlay} onPress={closeChat}>
        <Pressable
          style={[styles.panel, isDesktop ? styles.panelDesktop : styles.panelMobile]}
          onPress={() => {}}
        >
          <KeyboardAvoidingView
            style={styles.flexFill}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerTitleRow}>
                <View style={styles.headerAvatar}>
                  <MaterialCommunityIcons name="leaf" size={18} color={Colors.onPrimary} />
                </View>
                <View>
                  <Text style={styles.headerTitle}>Planty</Text>
                  <Text style={styles.headerSubtitle}>
                    {isBackendReady === false ? 'Waking up…' : 'Plant Care Assistant'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity
                style={styles.closeBtn}
                onPress={closeChat}
                accessibilityLabel="Close chat"
              >
                <Ionicons name="close" size={20} color={Colors.onSurface} />
              </TouchableOpacity>
            </View>

            {isBackendReady === false && (
              <View style={styles.healthBanner}>
                <Ionicons name="time-outline" size={14} color={Colors.amber} />
                <Text style={styles.healthBannerText}>
                  Planty is waking up — this can take a minute on first launch.
                </Text>
              </View>
            )}

            {/* Message list / empty state */}
            {messages.length === 0 ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="sprout" size={40} color={Colors.secondaryLight} />
                <Text style={styles.emptyTitle}>Ask Planty anything about plant care</Text>
                <View style={styles.promptList}>
                  {SUGGESTED_PROMPTS.map((prompt) => (
                    <TouchableOpacity
                      key={prompt}
                      style={styles.promptChip}
                      onPress={() => handlePrompt(prompt)}
                      activeOpacity={0.8}
                    >
                      <Text style={styles.promptChipText}>{prompt}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ) : (
              <FlatList
                ref={listRef}
                data={messages}
                keyExtractor={(item) => item.id}
                renderItem={renderMessage}
                contentContainerStyle={styles.messageList}
                showsVerticalScrollIndicator={false}
              />
            )}

            {isSending && (
              <View style={styles.typingRow}>
                <Text style={styles.typingText}>Planty is thinking…</Text>
              </View>
            )}

            {/* Composer */}
            <View style={styles.composer}>
              <TextInput
                style={styles.input}
                placeholder="Ask about watering, light, pests…"
                placeholderTextColor={Colors.outline}
                value={draft}
                onChangeText={setDraft}
                onSubmitEditing={handleSend}
                editable={!isSending}
                returnKeyType="send"
                multiline
              />
              <TouchableOpacity
                style={[styles.sendBtn, (!draft.trim() || isSending) && styles.sendBtnDisabled]}
                onPress={handleSend}
                disabled={!draft.trim() || isSending}
                accessibilityLabel="Send message"
              >
                <Ionicons name="send" size={16} color={Colors.onPrimary} />
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flexFill: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(1, 45, 29, 0.45)',
  },
  panel: {
    backgroundColor: Colors.surfaceContainerLowest,
    ...Shadows.modal,
  },
  panelMobile: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '85%',
    borderTopLeftRadius: Radii.xl,
    borderTopRightRadius: Radii.xl,
  },
  panelDesktop: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 380,
    height: 560,
    borderRadius: Radii.xl,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.surfaceContainer,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: Platform.OS === 'web' ? 'Playfair Display, serif' : 'System',
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  headerSubtitle: {
    fontSize: 11,
    color: Colors.onSurfaceVariant,
  },
  closeBtn: {
    padding: 4,
  },
  healthBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.amberLight,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
  },
  healthBannerText: {
    fontSize: 11,
    color: Colors.amber,
    flex: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.lg,
    gap: 14,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.onSurface,
    textAlign: 'center',
  },
  promptList: {
    gap: 8,
    width: '100%',
  },
  promptChip: {
    backgroundColor: Colors.secondaryTender,
    borderRadius: Radii.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  promptChipText: {
    fontSize: 12,
    color: Colors.secondary,
    fontWeight: '600',
  },
  messageList: {
    padding: Spacing.md,
    gap: 10,
  },
  bubbleRow: {
    flexDirection: 'row',
  },
  bubbleRowUser: {
    justifyContent: 'flex-end',
  },
  bubbleRowAssistant: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '82%',
    borderRadius: Radii.lg,
    paddingHorizontal: 12,
    paddingVertical: 9,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: Radii.sm,
  },
  bubbleAssistant: {
    backgroundColor: Colors.surfaceContainerLow,
    borderBottomLeftRadius: Radii.sm,
  },
  bubbleError: {
    backgroundColor: Colors.errorContainer,
  },
  bubbleTextUser: {
    color: Colors.onPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
  bubbleTextAssistant: {
    color: Colors.onSurface,
    fontSize: 13,
    lineHeight: 18,
  },
  typingRow: {
    paddingHorizontal: Spacing.md,
    paddingBottom: 4,
  },
  typingText: {
    fontSize: 11,
    color: Colors.outline,
    fontStyle: 'italic',
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
    padding: Spacing.sm,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.surfaceContainer,
  },
  input: {
    flex: 1,
    backgroundColor: Colors.surfaceContainerLow,
    borderRadius: Radii.lg,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.onSurface,
    maxHeight: 100,
  },
  sendBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.full,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnDisabled: {
    backgroundColor: Colors.outlineVariant,
  },
});
