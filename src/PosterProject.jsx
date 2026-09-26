import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCreative, Keyboard, Mousewheel } from 'swiper/modules'
import '@fontsource/dela-gothic-one/latin-400.css'
import 'swiper/css'
import 'swiper/css/effect-creative'
import './PosterProject.css'

const base = '/assets/poster/dreamcore'

const posters = [
  {
    number: '01',
    image: `${base}/poster-1.webp`,
    thumbnail: `${base}/thumb-1.webp`,
    background: `${base}/background-1.webp`,
    alt: 'Dreamcore: một người nằm trên đồng cỏ dưới bầu trời xanh',
    caption: 'Một giấc mơ màu nắng',
    note: 'BÌNH YÊN / RỰC RỠ / XA XÔI',
    accent: '#ffd35c',
  },
  {
    number: '02',
    image: `${base}/poster-2.webp`,
    thumbnail: `${base}/thumb-2.webp`,
    background: `${base}/background-2.webp`,
    alt: 'Dreamcore: nhân vật lơ lửng bên rìa thế giới xanh vàng',
    caption: 'Rơi khỏi trọng lực',
    note: 'LƠ LỬNG / KHÔNG THẬT / TỰ DO',
    accent: '#eeef50',
  },
  {
    number: '03',
    image: `${base}/poster-3.webp`,
    thumbnail: `${base}/thumb-3.webp`,
    background: `${base}/background-3.webp`,
    alt: 'Dreamcore: nhân vật cầm bóng bay đỏ trên mặt trăng',
    caption: 'Phía bên kia giấc mơ',
    note: 'MẶT TRĂNG / BÓNG ĐỎ / CHÂN TRỜI',
    accent: '#f871a9',
  },
  {
    number: '04',
    image: `${base}/poster-4.webp`,
    thumbnail: `${base}/thumb-4.webp`,
    background: `${base}/background-4.webp`,
    alt: 'Dreamcore: những nhân vật và con ngựa đỏ giữa đồng hoa siêu thực',
    caption: 'Chạm vào miền không thật',
    note: 'MỘNG MƠ / SẮC MÀU / THẾ GIỚI MỚI',
    accent: '#dc5d69',
  },
]

function PosterProject({ onBack }) {
  const reducedMotion = useReducedMotion()
  const swiperRef = useRef(null)
  const [active, setActive] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)

  const goTo = useCallback((index) => {
    setZoomOpen(false)
    swiperRef.current?.slideTo(index)
  }, [])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (zoomOpen) setZoomOpen(false)
      else onBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [zoomOpen, onBack])

  return (
    <main className="poster-project" aria-label="Bộ sưu tập poster Dreamcore">
      <Swiper
        className="poster-swiper"
        modules={[EffectCreative, Keyboard, Mousewheel]}
        effect="creative"
        creativeEffect={{
          limitProgress: 1,
          prev: { translate: ['-105%', 0, -280], rotate: [0, 0, -7], opacity: 0.25 },
          next: { translate: ['105%', 0, -280], rotate: [0, 0, 7], opacity: 0.25 },
        }}
        speed={reducedMotion ? 0 : 950}
        keyboard={{ enabled: true }}
        mousewheel={{ enabled: true, releaseOnEdges: true, thresholdDelta: 18, thresholdTime: 550 }}
        preventInteractionOnTransition
        grabCursor
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={(swiper) => { setActive(swiper.activeIndex); setZoomOpen(false) }}
      >
        {posters.map((poster, index) => (
          <SwiperSlide key={poster.number}>
            <section className="poster-scene" style={{ '--scene-accent': poster.accent }} aria-label={`Poster ${poster.number} trên 04`}>
              <img className="poster-scene-background" src={poster.background} alt="" aria-hidden="true" />
              <div className="poster-scene-wash" aria-hidden="true" />
              <div className="poster-scene-grain" aria-hidden="true" />

              <div className="poster-scene-copy">
                <motion.span
                  className="poster-eyebrow"
                  initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                  animate={active === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                  transition={{ duration: reducedMotion ? 0 : 0.55, delay: reducedMotion ? 0 : 0.18 }}
                >
                  VISUAL EXPERIMENT / 2026
                </motion.span>
                <motion.h1
                  className="poster-series-title"
                  initial={reducedMotion ? false : { opacity: 0, x: -30 }}
                  animate={active === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.27, ease: [0.16, 1, 0.3, 1] }}
                >
                  DREAM<br /><span>CORE</span><b aria-hidden="true">.</b>
                </motion.h1>
                <motion.div
                  className="poster-scene-caption"
                  initial={reducedMotion ? false : { opacity: 0, y: 26 }}
                  animate={active === index ? { opacity: 1, y: 0 } : { opacity: 0, y: 26 }}
                  transition={{ duration: reducedMotion ? 0 : 0.68, delay: reducedMotion ? 0 : 0.42 }}
                >
                  <span className="poster-chapter">FRAME {poster.number} / 04</span>
                  <p>{poster.caption}</p>
                  <small>{poster.note}</small>
                </motion.div>
              </div>

              <div className="poster-art-stage">
                <span className="poster-portal poster-portal-one" aria-hidden="true" />
                <span className="poster-portal poster-portal-two" aria-hidden="true" />
                <span className="poster-ghost-number" aria-hidden="true">{poster.number}</span>
                <motion.button
                  className="poster-art-button"
                  type="button"
                  aria-label={`Phóng to poster ${poster.number}`}
                  onClick={() => setZoomOpen(true)}
                  initial={reducedMotion ? false : { opacity: 0, scale: 0.9, rotate: 5, clipPath: 'inset(15% 0 15% 0)' }}
                  animate={active === index
                    ? { opacity: 1, scale: 1, rotate: 0, clipPath: 'inset(0% 0 0% 0)' }
                    : { opacity: 0, scale: 0.9, rotate: 5, clipPath: 'inset(15% 0 15% 0)' }}
                  transition={{ duration: reducedMotion ? 0 : 0.85, delay: reducedMotion ? 0 : 0.16, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reducedMotion ? undefined : { y: -12, rotate: -1.1, scale: 1.015 }}
                  whileTap={{ scale: 0.985 }}
                >
                  <img src={poster.image} alt={poster.alt} loading={index < 2 ? 'eager' : 'lazy'} draggable="false" />
                  <span className="poster-art-view">XEM CẬN CẢNH <span aria-hidden="true">↗</span></span>
                </motion.button>
              </div>
            </section>
          </SwiperSlide>
        ))}
      </Swiper>

      <motion.button
        className="poster-back"
        type="button"
        aria-label="Quay về trang sản phẩm"
        onClick={onBack}
        whileHover={reducedMotion ? undefined : { x: -5 }}
        whileTap={{ scale: 0.94 }}
      >
        <span aria-hidden="true">←</span> BACK
      </motion.button>
      <div className="poster-topline" aria-hidden="true"><span>POSTER / DREAMCORE</span><span>VOL. 01 — 04</span></div>

      <div className="poster-bottom-rail">
        <div className="poster-rail-caption">Bốn khung hình<br />một thế giới mơ.</div>
        <nav className="poster-frames" aria-label="Chọn poster">
          {posters.map((poster, index) => (
            <motion.button
              className={`poster-frame-thumb${active === index ? ' is-active' : ''}`}
              type="button"
              key={poster.number}
              aria-label={`Xem poster ${poster.number}`}
              aria-current={active === index ? 'true' : undefined}
              onClick={() => goTo(index)}
              whileHover={reducedMotion ? undefined : { y: -6 }}
              whileTap={{ scale: 0.93 }}
            >
              <img src={poster.thumbnail} alt="" loading="lazy" />
              <span>{poster.number}</span>
            </motion.button>
          ))}
        </nav>
        <div className="poster-rail-actions">
          <span className="poster-current"><strong>{posters[active].number}</strong> / 04</span>
          <button type="button" aria-label="Poster trước" disabled={active === 0} onClick={() => goTo(active - 1)}>←</button>
          <button type="button" aria-label="Poster tiếp theo" disabled={active === posters.length - 1} onClick={() => goTo(active + 1)}>→</button>
        </div>
      </div>

      <AnimatePresence>
        {zoomOpen && (
          <motion.div
            className="poster-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Poster ${posters[active].number} phóng to`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.28 }}
            onClick={() => setZoomOpen(false)}
          >
            <motion.img
              src={posters[active].image}
              alt={posters[active].alt}
              initial={reducedMotion ? false : { scale: 0.87, y: 35, rotate: 2 }}
              animate={{ scale: 1, y: 0, rotate: 0 }}
              exit={{ scale: 0.93, y: 20 }}
              transition={{ duration: reducedMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }}
              onClick={(event) => event.stopPropagation()}
            />
            <button type="button" onClick={() => setZoomOpen(false)} aria-label="Đóng poster phóng to">ĐÓNG ×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default PosterProject
