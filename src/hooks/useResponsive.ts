// Hook to provide cross-platform responsive layout data
import { useWindowDimensions } from 'react-native';

export interface ResponsiveInfo {
  width: number;
  height: number;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  numColumns: number;
  contentMaxWidth: number;
}

export function useResponsive(): ResponsiveInfo {
  const { width, height } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isDesktop = width >= 1024;

  const numColumns = isDesktop ? 4 : isTablet ? 3 : 2;
  const contentMaxWidth = isDesktop ? 1280 : isTablet ? 900 : width;

  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    numColumns,
    contentMaxWidth,
  };
}
