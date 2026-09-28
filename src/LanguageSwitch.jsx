import { useTranslation } from 'react-i18next'
import './LanguageSwitch.css'

export default function LanguageSwitch({ tone = 'dark', inMenu = false }) {
  const { t, i18n } = useTranslation()
  const vietnamese = i18n.resolvedLanguage === 'vi'

  return (
    <button
      className={`language-switch is-${tone}${inMenu ? ' in-menu' : ''}`}
      type="button"
      aria-label={t(vietnamese ? 'Switch to English' : 'Switch to Vietnamese')}
      onClick={() => i18n.changeLanguage(vietnamese ? 'en' : 'vi')}
    >
      <span lang="en" className={!vietnamese ? 'is-current' : ''}>EN</span>
      <span aria-hidden="true" className="language-switch-divider">/</span>
      <span lang="vi" className={vietnamese ? 'is-current' : ''}>VI</span>
    </button>
  )
}
