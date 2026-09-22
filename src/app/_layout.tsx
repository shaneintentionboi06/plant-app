import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { Colors } from '@/constants/theme';

export default function RootLayout() {
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Inject Google Fonts link dynamically for web rendering
      const linkId = 'botanical-fonts';
      if (!document.getElementById(linkId)) {
        const link = document.createElement('link');
        link.id = linkId;
        link.rel = 'stylesheet';
        link.href =
          'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400..700;1,400..700&family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&display=swap';
        document.head.appendChild(link);
      }

      // Inject refined, understated botanical animation keyframes & CSS
      const styleId = 'botanical-motion-system';
      if (!document.getElementById(styleId)) {
        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
          /* Botanical gentle breathing loop (ultra subtle, 7s duration, 4px displacement) */
          @keyframes botanicalBreathe {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-4px);
            }
          }

          /* Subtle floating motion for editorial cards */
          @keyframes subtleCardFloatA {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-3px);
            }
          }
          @keyframes subtleCardFloatB {
            0%, 100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-2.5px);
            }
          }

          /* Heart micro-interaction */
          @keyframes heartBeat {
            0% { transform: scale(1); }
            35% { transform: scale(1.18); }
            70% { transform: scale(0.97); }
            100% { transform: scale(1); }
          }

          /* Badge pulse on count change */
          @keyframes badgePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.14); }
            100% { transform: scale(1); }
          }

          /* Greenhouse watering pulse */
          @keyframes waterPulse {
            0%, 100% { opacity: 0.85; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.08); }
          }

          /* Utility classes for smooth GPU composition */
          .botanical-breathe {
            animation: botanicalBreathe 7s ease-in-out infinite;
            will-change: transform;
          }
          .card-float-a {
            animation: subtleCardFloatA 6.5s ease-in-out infinite;
            will-change: transform;
          }
          .card-float-b {
            animation: subtleCardFloatB 7.5s ease-in-out infinite 0.8s;
            will-change: transform;
          }
          .heart-pop {
            animation: heartBeat 0.35s cubic-bezier(0.25, 1, 0.5, 1);
          }
          .badge-pulse {
            animation: badgePulse 0.3s cubic-bezier(0.25, 1, 0.5, 1);
          }

          /* Reduced motion preference support */
          @media (prefers-reduced-motion: reduce) {
            .botanical-breathe,
            .card-float-a,
            .card-float-b,
            .heart-pop,
            .badge-pulse {
              animation: none !important;
            }
            *, *::before, *::after {
              transition-duration: 0.01ms !important;
              animation-duration: 0.01ms !important;
            }
          }
        `;
        document.head.appendChild(style);
      }

      // Base body styling
      if (document.body) {
        document.body.style.backgroundColor = Colors.surface;
        document.body.style.margin = '0';
        document.body.style.fontFamily = '"Plus Jakarta Sans", sans-serif';
        document.body.style.webkitFontSmoothing = 'antialiased';
      }

      // Page Title
      document.title = 'Botanical Living | Rare Plants & Handcrafted Vessels';
    }
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.surface },
        }}
      />
    </SafeAreaProvider>
  );
}
