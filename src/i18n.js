import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from './locales/messages.js'

export const LANGUAGE_STORAGE_KEY = 'hung-portfolio-language'
export function initialLanguage() {
  try { return localStorage.getItem(LANGUAGE_STORAGE_KEY) === 'vi' ? 'vi' : 'en' }
  catch { return 'en' }
}

function rememberLanguage(language) {
  document.documentElement.lang = language
  try { localStorage.setItem(LANGUAGE_STORAGE_KEY, language) } catch { /* Storage may be disabled. */ }
}

i18n.use(initReactI18next).init({
  resources,
  lng: initialLanguage(),
  fallbackLng: 'en',
  supportedLngs: ['en', 'vi'],
  keySeparator: false,
  nsSeparator: false,
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
})
rememberLanguage(i18n.language)
i18n.on('languageChanged', rememberLanguage)

export default i18n
