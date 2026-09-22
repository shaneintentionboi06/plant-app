import { create } from 'zustand';
import { ApiService } from '../services/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  status: 'sending' | 'sent' | 'error';
  createdAt: number;
}

interface ChatState {
  messages: ChatMessage[];
  isOpen: boolean;
  isSending: boolean;
  isBackendReady: boolean | null; // null = unknown / not checked yet

  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (text: string) => Promise<void>;
  checkHealth: () => Promise<void>;
  resetChat: () => void;
}

let messageCounter = 0;
const nextId = () => `msg-${Date.now()}-${messageCounter++}`;

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isSending: false,
  isBackendReady: null,

  openChat: () => {
    set({ isOpen: true });
    get().checkHealth();
  },

  closeChat: () => set({ isOpen: false }),

  toggleChat: () => {
    const willOpen = !get().isOpen;
    set({ isOpen: willOpen });
    if (willOpen) get().checkHealth();
  },

  sendMessage: async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || get().isSending) return;

    const userMessage: ChatMessage = {
      id: nextId(),
      role: 'user',
      text: trimmed,
      status: 'sent',
      createdAt: Date.now(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isSending: true,
    }));

    try {
      const reply = await ApiService.sendChatMessage(trimmed);
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: nextId(),
            role: 'assistant',
            text: reply,
            status: 'sent',
            createdAt: Date.now(),
          },
        ],
        isSending: false,
        isBackendReady: true,
      }));
    } catch (err) {
      console.warn('Chatbot request failed:', err);
      set((state) => ({
        messages: [
          ...state.messages,
          {
            id: nextId(),
            role: 'assistant',
            text: "Planty isn't available right now. Please try again in a moment.",
            status: 'error',
            createdAt: Date.now(),
          },
        ],
        isSending: false,
        isBackendReady: false,
      }));
    }
  },

  checkHealth: async () => {
    const ready = await ApiService.getChatbotHealth();
    set({ isBackendReady: ready });
  },

  resetChat: () => set({ messages: [] }),
}));
