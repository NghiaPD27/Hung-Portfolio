import { useTranslation } from 'react-i18next'

// Only the four requested sign artworks have English variants.
// All other artwork intentionally stays in its original language.
export const englishAssets = {
  '/assets/eko/sign-1-opt.jpg': '/assets/locales/en/eko/sign-1.png',
  '/assets/eko/sign-2-opt.jpg': '/assets/locales/en/eko/sign-2.png',
  '/assets/eko/sign-3-opt.jpg': '/assets/locales/en/eko/sign-3.png',
  '/assets/eko/sign-4-opt.jpg': '/assets/locales/en/eko/sign-4.png',
  '/assets/eko/mobile-figma/sign-primary.png': '/assets/locales/en/eko/sign-4.png',
}

export function localizedAsset(source, language) {
  return language === 'en' ? englishAssets[source] ?? source : source
}

export function useLocalizedAsset() {
  const { i18n } = useTranslation()
  return (source) => localizedAsset(source, i18n.resolvedLanguage)
}
