import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCreative, Keyboard } from 'swiper/modules'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
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

const vietnamPosters = [
  { number: '01', image: '/assets/poster/vietnam/1.webp', thumbnail: '/assets/poster/vietnam/1-thumb.webp', alt: 'Poster Nguyễn Huệ với kiến trúc xanh và bầu trời Sài Gòn', title: 'Nguyễn Huệ sau 5 giờ', category: 'ĐÔ THỊ / SÀI GÒN', color: '#075f79' },
  { number: '02', image: '/assets/poster/vietnam/2.webp', thumbnail: '/assets/poster/vietnam/2-thumb.webp', alt: 'Poster cà phê bệt Sài Gòn trên thảm cỏ', title: 'Cà phê bệt Sài Gòn', category: 'ĐỜI SỐNG / VĂN HÓA', color: '#448922' },
  { number: '03', image: '/assets/poster/vietnam/3.webp', thumbnail: '/assets/poster/vietnam/3-thumb.webp', alt: 'Poster Việt Nam Quốc Tự với mái chùa trên nền đỏ', title: 'Việt Nam Quốc Tự', category: 'DI SẢN / KIẾN TRÚC', color: '#bd2e21' },
  { number: '04', image: '/assets/poster/vietnam/4.webp?v=2', thumbnail: '/assets/poster/vietnam/4-thumb.webp?v=2', alt: 'Poster Hương Sắc Việt với trang phục truyền thống, hoa xuân và họa tiết mây', title: 'Hương Sắc Việt', category: 'TRANG PHỤC / VĂN HÓA', color: '#ad5445' },
  { number: '05', image: '/assets/poster/vietnam/5.webp', thumbnail: '/assets/poster/vietnam/5-thumb.webp', alt: 'Poster Hoa Nhiên với áo Nhật Bình thời Nguyễn trên nền xanh và họa tiết mây vàng', title: 'Hoa Nhiên', category: 'ÁO NHẬT BÌNH / TRIỀU NGUYỄN', color: '#176b83' },
]

function PosterProject({ onBack, onDreamcoreVisibilityChange, onMenuToneChange }) {
  const reducedMotion = useReducedMotion()
  const swiperRef = useRef(null)
  const dreamcoreSectionRef = useRef(null)
  const dreamcoreInView = useInView(dreamcoreSectionRef, { amount: 0.5 })
  const vietnamSectionRef = useRef(null)
  const vietnamInView = useInView(vietnamSectionRef, { amount: 0.35 })
  const [active, setActive] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [vietnamZoom, setVietnamZoom] = useState(null)

  useEffect(() => {
    onMenuToneChange?.(vietnamInView ? 'light' : 'dark')
  }, [onMenuToneChange, vietnamInView])

  useEffect(() => {
    onDreamcoreVisibilityChange?.(dreamcoreInView)
  }, [onDreamcoreVisibilityChange, dreamcoreInView])

  const goTo = useCallback((index) => {
    setZoomOpen(false)
    swiperRef.current?.slideTo(index)
  }, [])

  const scrollToSection = useCallback((id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' })
  }, [reducedMotion])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (zoomOpen) setZoomOpen(false)
      else if (vietnamZoom) setVietnamZoom(null)
      else onBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [zoomOpen, vietnamZoom, onBack])

  return (
    <main
      className={`poster-project${zoomOpen || vietnamZoom ? ' has-lightbox' : ''}`}
      aria-label="Bộ sưu tập poster"
    >
      <section className="poster-index" id="poster-index" aria-labelledby="poster-index-title">
        <div className="poster-index-grid" aria-hidden="true" />
        <motion.div className="poster-index-copy" initial={reducedMotion ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
          <span className="poster-index-overline"><i /> VISUAL STORIES / SELECTED POSTERS</span>
          <h1 id="poster-index-title">POSTER<span>.</span></h1>
          <p>Mỗi tấm poster là một thế giới riêng — từ giấc mơ siêu thực đến nhịp sống Việt Nam đương đại.</p>
          <div className="poster-index-meta"><span>02 CHƯƠNG</span><span>{String(posters.length + vietnamPosters.length).padStart(2, '0')} TÁC PHẨM</span><span>2026</span></div>
          <button className="poster-index-enter" type="button" onClick={() => scrollToSection('poster-dreamcore')}>KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true">↓</span></button>
        </motion.div>
        <div className="poster-index-preview" aria-hidden="true">
          <motion.figure className="poster-index-preview-card is-dream" initial={reducedMotion ? false : { opacity: 0, rotate: -15, y: 110 }} animate={{ opacity: 1, rotate: -8, y: 0 }} transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}><img src={posters[0].thumbnail} alt="" /><figcaption>01 / DREAMCORE</figcaption></motion.figure>
          <motion.figure className="poster-index-preview-card is-vietnam" initial={reducedMotion ? false : { opacity: 0, rotate: 17, y: 130 }} animate={{ opacity: 1, rotate: 7, y: 0 }} transition={{ duration: 0.95, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}><img src={vietnamPosters[2].thumbnail} alt="" /><figcaption>02 / VIỆT NAM</figcaption></motion.figure>
          <motion.span className="poster-index-stamp" initial={reducedMotion ? false : { scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: -16 }} transition={{ type: 'spring', stiffness: 180, damping: 15, delay: 0.56 }}>HÌNH ẢNH<br />KỂ CHUYỆN ↗</motion.span>
        </div>
        <span className="poster-index-edge">SCROLL TO EXPLORE ↘</span>
      </section>

      <section className="poster-dreamcore-section" id="poster-dreamcore" ref={dreamcoreSectionRef} aria-label="Chương 1: Dreamcore" onPointerDown={() => onDreamcoreVisibilityChange?.(true)}>
      <Swiper
        className="poster-swiper"
        modules={[EffectCreative, Keyboard]}
        effect="creative"
        creativeEffect={{
          limitProgress: 1,
          prev: { translate: ['-105%', 0, -280], rotate: [0, 0, -7], opacity: 0.25 },
          next: { translate: ['105%', 0, -280], rotate: [0, 0, 7], opacity: 0.25 },
        }}
        speed={reducedMotion ? 0 : 950}
        keyboard={{ enabled: true, onlyInViewport: true }}
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
                <motion.h2
                  className="poster-series-title"
                  initial={reducedMotion ? false : { opacity: 0, x: -30 }}
                  animate={active === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
                  transition={{ duration: reducedMotion ? 0 : 0.7, delay: reducedMotion ? 0 : 0.27, ease: [0.16, 1, 0.3, 1] }}
                >
                  DREAM<br /><span>CORE</span><b aria-hidden="true">.</b>
                </motion.h2>
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
      <div className="poster-topline" aria-hidden="true"><span>POSTER / DREAMCORE</span><span>CHAPTER 01 — 02</span></div>

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
      <button className="poster-next-chapter" type="button" onClick={() => scrollToSection('poster-vietnam')}>TIẾP THEO / VIỆT NAM <span aria-hidden="true">↓</span></button>
      </section>

      <section className="poster-vietnam-section" id="poster-vietnam" ref={vietnamSectionRef} aria-labelledby="poster-vietnam-title">
        <div className="poster-vietnam-topline"><span>TẬP SAN THỊ GIÁC / 02</span><span>ĐẤT NƯỚC · CON NGƯỜI</span></div>
        <motion.header className="poster-vietnam-header" initial={reducedMotion ? false : { opacity: 0, y: 48 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
          <div><span className="poster-vietnam-kicker">NHỮNG LÁT CẮT ĐƯƠNG ĐẠI</span><h2 id="poster-vietnam-title">VIỆT<span> NAM</span></h2></div>
          <p>Nét phố, nếp sống, di sản — Việt Nam trong năm khung hình.</p>
          <div className="poster-vietnam-seal" aria-hidden="true"><strong>{String(vietnamPosters.length).padStart(2, '0')}</strong><span>KHUNG<br />HÌNH</span></div>
        </motion.header>
        <div className="poster-vietnam-gallery">
          <div className="poster-vietnam-guide"><span>NĂM TÁC PHẨM / MỘT HÀNH TRÌNH</span><span>CHẠM VÀO TÁC PHẨM ĐỂ XEM CẬN ↗</span></div>
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 2, 700: 3, 1200: 5 }} gutterBreakPoints={{ 0: '9px', 700: '18px' }}>
            <Masonry className="poster-vietnam-masonry" sequential>
              {vietnamPosters.map((poster, index) => (
                <motion.button className={`poster-vietnam-card${index === vietnamPosters.length - 1 ? ' is-finale' : ''}`} type="button" key={poster.number} style={{ '--vietnam-accent': poster.color }} onClick={() => setVietnamZoom(poster)} initial={reducedMotion ? false : { opacity: 0, y: 34 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : index * 0.1, ease: [0.16, 1, 0.3, 1] }} whileHover={reducedMotion ? undefined : { y: -8 }} whileTap={{ scale: 0.98 }} aria-label={`Phóng to poster ${poster.title}`}>
                  <span className="poster-vietnam-card-top"><span>TÁC PHẨM {poster.number} / {String(vietnamPosters.length).padStart(2, '0')}</span><span>VIỆT NAM</span></span>
                  <img src={poster.image} alt={poster.alt} loading="lazy" draggable="false" />
                  <span className="poster-vietnam-card-foot"><strong>{poster.title}</strong><small>{poster.category}</small></span>
                </motion.button>
              ))}
            </Masonry>
          </ResponsiveMasonry>
          <motion.button className="poster-vietnam-feature" type="button" onClick={() => setVietnamZoom(vietnamPosters[4])} initial={reducedMotion ? false : { opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }} aria-label={`Phóng to poster ${vietnamPosters[4].title}`}>
            <img src={vietnamPosters[4].thumbnail} alt={vietnamPosters[4].alt} loading="lazy" />
            <span className="poster-vietnam-feature-copy"><small>TÁC PHẨM 05 / 05</small><strong>Hoa Nhiên</strong><span>Áo Nhật Bình · Triều Nguyễn</span><em>XEM TÁC PHẨM ↗</em></span>
          </motion.button>
        </div>
        <div className="poster-vietnam-footer"><span>NHỮNG CÂU CHUYỆN TỪ NƠI MÌNH SỐNG</span><button type="button" onClick={() => scrollToSection('poster-index')}>VỀ ĐẦU TRANG ↑</button></div>
      </section>

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
      <AnimatePresence>
        {vietnamZoom && (
          <motion.div className="poster-lightbox" role="dialog" aria-modal="true" aria-label={`Poster ${vietnamZoom.title} phóng to`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.28 }} onClick={() => setVietnamZoom(null)}>
            <motion.img src={vietnamZoom.image} alt={vietnamZoom.alt} initial={reducedMotion ? false : { scale: 0.87, y: 35, rotate: 2 }} animate={{ scale: 1, y: 0, rotate: 0 }} exit={{ scale: 0.93, y: 20 }} transition={{ duration: reducedMotion ? 0 : 0.52, ease: [0.16, 1, 0.3, 1] }} onClick={(event) => event.stopPropagation()} />
            <button type="button" onClick={() => setVietnamZoom(null)} aria-label="Đóng poster phóng to">ĐÓNG ×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default PosterProject
