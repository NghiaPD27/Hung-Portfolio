import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

// Refresh Swiper-generated labels without resetting the active slide.
export default function useLocalizedSwiperA11y(ref, previous, next, pagination) {
  const { t } = useTranslation()
  useEffect(() => {
    const swiper = ref.current
    if (!swiper || swiper.destroyed || !swiper.params.a11y) return
    Object.assign(swiper.params.a11y, {
      prevSlideMessage: t(previous),
      nextSlideMessage: t(next),
      paginationBulletMessage: t(pagination, { index: '{{index}}' }),
    })
    swiper.emit('paginationUpdate')
  }, [ref, previous, next, pagination, t])
}
