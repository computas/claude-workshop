import React, { createContext, useContext, useState, useEffect } from 'react'
import translations from '../i18n/translations'

const LanguageContext = createContext()

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const saved = localStorage.getItem('language')
    if (saved) return saved

    const browserLang = navigator.language.split('-')[0]
    if (['en', 'no', 'it'].includes(browserLang)) {
      return browserLang
    }
    return 'en'
  })

  useEffect(() => {
    localStorage.setItem('language', currentLanguage)
  }, [currentLanguage])

  const t = (key) => {
    const keys = key.split('.')
    let value = translations[currentLanguage]

    for (const k of keys) {
      if (value && typeof value === 'object') {
        value = value[k]
      } else {
        return key
      }
    }

    return typeof value === 'string' ? value : key
  }

  const value = {
    currentLanguage,
    setLanguage: setCurrentLanguage,
    t
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
