// contexts/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useColorScheme } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { MD3LightTheme, MD3DarkTheme, configureFonts, Provider as PaperProvider } from 'react-native-paper'

type ThemeMode = 'light' | 'dark' | 'auto'

interface ThemeContextType {
  themeMode: ThemeMode
  isDarkMode: boolean
  setThemeMode: (mode: ThemeMode) => void
  theme: typeof MD3LightTheme
}

// Définir des tailles de police plus grandes pour l'accessibilité
const fontConfig = {
  fontFamily: "System",
  fontWeights: {
    regular: "400",
    medium: "500",
    bold: "700",
  },
  sizes: {
    small: 14,
    medium: 16,
    large: 18,
    extraLarge: 22,
  },
}

export const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: "#FF6B00",
    secondary: "#2196F3",
    tertiary: "#4CAF50",
    error: "#FF3B30",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    // Améliorer le contraste pour l'accessibilité
    onBackground: "#121212",
    onSurface: "#121212",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onTertiary: "#FFFFFF",
    onError: "#FFFFFF",
  },
  fonts: configureFonts({ config: fontConfig }),
  // Augmenter la taille des éléments interactifs pour l'accessibilité
  roundness: 8,
}
 

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const lightTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#FF6B00',
    primaryContainer: '#FFE5D1',
    secondary: "#2196F3",
    tertiary: "#4CAF50",
    error: "#FF3B30",
    background: "#F5F5F5",
    surface: "#FFFFFF",
    // Améliorer le contraste pour l'accessibilité
    onBackground: "#121212",
    onSurface: "#121212",
    onPrimary: "#FFFFFF",
    onSecondary: "#FFFFFF",
    onTertiary: "#FFFFFF",
    onError: "#FFFFFF",
  },
}

const darkTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#FF8F00',
    primaryContainer: '#B24A00',
    secondary: '#FFB74D',
    onSurface: '#FF6B00', // pour le texte
    background: '#121212',
    surface: '#1e1e1e',
  },
}

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeModeState] = useState<ThemeMode>('light')
  const systemColorScheme = useColorScheme()

  const isDarkMode = themeMode === 'dark' || (themeMode === 'auto' && systemColorScheme === 'dark')
  const theme = isDarkMode ? darkTheme : lightTheme

  useEffect(() => {
    loadThemePreference()
  }, [])

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme_preference')
      if (savedTheme && ['light', 'dark', 'auto'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode)
      }
    } catch (error) {
      console.error('Error loading theme preference:', error)
    }
  }

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem('theme_preference', mode)
      setThemeModeState(mode)
    } catch (error) {
      console.error('Error saving theme preference:', error)
    }
  }

  return (
    <ThemeContext.Provider value={{ themeMode, isDarkMode, setThemeMode, theme }}>
      <PaperProvider theme={theme}>
        {children}
      </PaperProvider>
    </ThemeContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

