import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
// import * as Localization from 'expo-localization'
import translations from './Traductions'

type LanguageCode = 'fr' | 'en' | 'es' | 'de'

interface LanguageContextType {
  currentLanguage: LanguageCode
  setLanguage: (lang: LanguageCode) => void
  t: (key: string, options?: Record<string, string>) => string
  availableLanguages: { code: LanguageCode; name: string }[]
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

interface LanguageProviderProps {
  children: ReactNode
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<LanguageCode>('fr')

  const availableLanguages = [
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'de', name: 'Deutsch' },
  ]

  useEffect(() => {
    loadLanguagePreference()
  }, [])

  const loadLanguagePreference = async () => {
    try {
      const savedLanguage = await AsyncStorage.getItem('language_preference')
      if (savedLanguage && ['fr', 'en', 'es', 'de'].includes(savedLanguage)) {
        setCurrentLanguage(savedLanguage as LanguageCode)
      } else {
        // const systemLanguage = Localization.locale.split('-')[0]
        // if (['fr', 'en', 'es', 'de'].includes(systemLanguage)) {
        //   setCurrentLanguage(systemLanguage as LanguageCode)
        // }
        setCurrentLanguage('fr')
      }
    } catch (error) {
      console.error('Error loading language preference:', error)
    }
  }

  const setLanguage = async (lang: LanguageCode) => {
    try {
      await AsyncStorage.setItem('language_preference', lang)
      setCurrentLanguage(lang)
    } catch (error) {
      console.error('Error saving language preference:', error)
    }
  }

  const t = (key: string, options?: Record<string, string>) => {
    const translation =
      translations?.[currentLanguage]?.[key] ?? key

    if (!options) return translation

    return Object.keys(options).reduce((result, k) => {
      return result.replace(new RegExp(`{{${k}}}`, 'g'), options[k])
    }, translation)
  }

  return (
    <LanguageContext.Provider value={{
      currentLanguage,
      setLanguage,
      t,
      availableLanguages
    }}>
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
