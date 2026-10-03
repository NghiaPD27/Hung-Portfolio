import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCreative, EffectFade, Keyboard } from 'swiper/modules'
import '@fontsource/dela-gothic-one/latin-400.css'
import 'swiper/css'
import 'swiper/css/effect-creative'
import 'swiper/css/effect-fade'
import './PosterProject.css'

gsap.registerPlugin(Observer, ScrollToPlugin)

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

const japanPosters = [
  { number: '01', image: '/assets/poster/japan/1.webp', title: 'Yōmeimon', subtitle: 'NIKKŌ / DI SẢN', japanese: '陽明門', alt: 'Poster Yōmeimon với cổng đền Nikkō Tōshō-gū dưới bầu trời xanh' },
  { number: '02', image: '/assets/poster/japan/2.webp', title: 'Wa no Bi', subtitle: 'TRANG PHỤC / THẨM MỸ', japanese: '和の美', alt: 'Poster Wa no Bi với trang phục Nhật trên nền đỏ son' },
  { number: '03', image: '/assets/poster/japan/3.webp', title: 'Subway Girl', subtitle: 'TOKYO / NHỊP SỐNG', japanese: '東京駅', alt: 'Poster Subway Girl với ô đỏ và cô gái ở ga tàu Tokyo' },
  { number: '04', image: '/assets/poster/japan/4.webp', title: 'Sushi', subtitle: 'ẨM THỰC / ĐƯƠNG ĐẠI', japanese: 'すし', alt: 'Poster sushi rực rỡ với cuộn tôm và đôi đũa trên nền vàng cam' },
  { number: '05', image: '/assets/poster/japan/5.webp', title: 'Daishi Nakamise', subtitle: 'KAWASAKI / PHỐ XƯA', japanese: '大師仲見世', alt: 'Poster phố Daishi Nakamise với cửa hàng và cổng đỏ ở Kawasaki' },
]

const JAPAN_INTRO_MS = 1400
const VIETNAM_INTRO_MS = 1400
const vietnamIntroGrains = Array.from({ length: 20 }, (_, index) => {
  const foreground = index % 3 === 0
  return {
    id: index,
    image: `/assets/poster/vietnam/intro/grain-${(index % 14) + 1}.png`,
    foreground,
    size: foreground ? 44 + ((index * 11) % 26) : 22 + ((index * 7) % 18),
    left: -18 - ((index * 13) % 52),
    top: -28 + ((index * 23) % 92),
    drop: 65 + ((index * 9) % 47),
    rotation: (index * 43) % 360,
    delay: (index % 8) * 0.025,
    duration: 1.04 + ((index * 5) % 7) * 0.04,
  }
})
const japanIntroPetals = Array.from({ length: 20 }, (_, index) => {
  const foreground = index % 3 === 0
  return {
    id: index,
    image: `/assets/poster/japan/intro/petal-${(index % 16) + 1}.webp`,
    foreground,
    size: foreground ? 38 + ((index * 13) % 34) : 18 + ((index * 11) % 23),
    left: 105 + ((index * 17) % 48),
    top: -30 + ((index * 29) % 94),
    drop: 70 + ((index * 7) % 46),
    rotation: (index * 37) % 360,
    delay: (index % 8) * 0.02,
    duration: 1.05 + ((index * 3) % 7) * 0.04,
  }
})

function PosterProject({ onBack, onDreamcoreVisibilityChange, onMenuToneChange }) {
  const reducedMotion = useReducedMotion()
  const swiperRef = useRef(null)
  const vietnamSwiperRef = useRef(null)
  const japanSwiperRef = useRef(null)
  const japanIntroAudioRef = useRef(null)
  const vietnamIntroAudioRef = useRef(null)
  const introPreloadsRef = useRef([])
  const scrollTweenRef = useRef(null)
  const wheelCooldownRef = useRef(0)
  const dreamcoreSectionRef = useRef(null)
  const dreamcoreInView = useInView(dreamcoreSectionRef, { amount: 0.5 })
  const vietnamSectionRef = useRef(null)
  const vietnamIntroRef = useRef(null)
  const vietnamInView = useInView(vietnamSectionRef, { amount: 0.35 })
  const japanSectionRef = useRef(null)
  const japanInView = useInView(japanSectionRef, { amount: 0.3 })
  const posterProjectRef = useRef(null)
  const [active, setActive] = useState(0)
  const [zoomOpen, setZoomOpen] = useState(false)
  const [vietnamZoom, setVietnamZoom] = useState(null)
  const [japanZoom, setJapanZoom] = useState(null)
  const [vietnamActive, setVietnamActive] = useState(0)
  const [vietnamCanPrev, setVietnamCanPrev] = useState(false)
  const [vietnamCanNext, setVietnamCanNext] = useState(true)
  const [vietnamPaperAtTop, setVietnamPaperAtTop] = useState(false)
  const [japanActive, setJapanActive] = useState(0)
  const [vietnamIntroComplete, setVietnamIntroComplete] = useState(false)
  const [japanIntroComplete, setJapanIntroComplete] = useState(false)
  const [introReadySection, setIntroReadySection] = useState(null)
  const vietnamIntroReady = introReadySection === 'poster-vietnam'
  const japanIntroReady = introReadySection === 'poster-japan'

  useEffect(() => {
    if (reducedMotion) return
    introPreloadsRef.current = ['/assets/poster/vietnam/intro/umbrella.png', ...new Set(vietnamIntroGrains.map((grain) => grain.image)), '/assets/poster/japan/intro/umbrella.webp', ...new Set(japanIntroPetals.map((petal) => petal.image))].map((source) => {
      const image = new Image()
      image.fetchPriority = source.includes('/umbrella.') ? 'high' : 'low'
      image.src = source
      return image
    })
    return () => { introPreloadsRef.current = [] }
  }, [reducedMotion])

  useEffect(() => {
    if (reducedMotion || !vietnamIntroReady || vietnamIntroComplete) return undefined
    const timer = window.setTimeout(() => setVietnamIntroComplete(true), VIETNAM_INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [vietnamIntroReady, vietnamIntroComplete, reducedMotion])

  useEffect(() => {
    if (reducedMotion || !japanIntroReady || japanIntroComplete) return undefined
    const timer = window.setTimeout(() => setJapanIntroComplete(true), JAPAN_INTRO_MS)
    return () => window.clearTimeout(timer)
  }, [japanIntroReady, japanIntroComplete, reducedMotion])

  useEffect(() => {
    const audio = vietnamIntroAudioRef.current
    if (!audio || reducedMotion || !vietnamIntroReady || vietnamIntroComplete) return undefined
    audio.pause()
    audio.currentTime = 0
    audio.volume = 0.55
    audio.play().catch(() => {})
    const fade = gsap.to(audio, { volume: 0, duration: VIETNAM_INTRO_MS / 1000, ease: 'none' })
    return () => {
      fade.kill()
      audio.pause()
      audio.currentTime = 0
    }
  }, [vietnamIntroReady, vietnamIntroComplete, reducedMotion])

  useEffect(() => {
    const audio = japanIntroAudioRef.current
    if (!audio || reducedMotion || !japanIntroReady || japanIntroComplete) return undefined
    audio.pause()
    audio.currentTime = 0
    audio.volume = 0.7
    audio.play().catch(() => {})
    const fade = gsap.to(audio, { volume: 0, duration: JAPAN_INTRO_MS / 1000, ease: 'none' })
    return () => {
      fade.kill()
      audio.pause()
      audio.currentTime = 0
    }
  }, [japanIntroReady, japanIntroComplete, reducedMotion])

  useEffect(() => {
    onMenuToneChange?.(vietnamInView && !vietnamPaperAtTop ? 'light' : 'dark')
  }, [onMenuToneChange, vietnamInView, vietnamPaperAtTop])

  useEffect(() => {
    const container = posterProjectRef.current
    const intro = vietnamIntroRef.current
    if (!container || !intro) return undefined
    const updateMenuSurface = () => {
      const onPaper = intro.getBoundingClientRect().bottom <= 70
      setVietnamPaperAtTop((current) => current === onPaper ? current : onPaper)
    }
    container.addEventListener('scroll', updateMenuSurface, { passive: true })
    window.addEventListener('resize', updateMenuSurface)
    updateMenuSurface()
    return () => {
      container.removeEventListener('scroll', updateMenuSurface)
      window.removeEventListener('resize', updateMenuSurface)
    }
  }, [])

  useEffect(() => {
    onDreamcoreVisibilityChange?.(dreamcoreInView)
  }, [onDreamcoreVisibilityChange, dreamcoreInView])

  const goTo = useCallback((index) => {
    setZoomOpen(false)
    swiperRef.current?.slideTo(index)
  }, [])

  const scrollToSection = useCallback((id, fromWheel = false) => {
    const container = posterProjectRef.current
    const section = document.getElementById(id)
    if (!container || !section) return
    if (fromWheel && (scrollTweenRef.current?.isActive() || performance.now() < wheelCooldownRef.current)) return
    scrollTweenRef.current?.kill()
    setIntroReadySection(null)
    if (reducedMotion) {
      container.scrollTop = section.offsetTop
      setIntroReadySection(id)
      wheelCooldownRef.current = performance.now() + 300
      return
    }
    scrollTweenRef.current = gsap.to(container, {
      scrollTo: { y: section.offsetTop, autoKill: false },
      duration: 0.68,
      ease: 'power2.inOut',
      onComplete: () => {
        scrollTweenRef.current = null
        setIntroReadySection(id)
        wheelCooldownRef.current = performance.now() + 300
      },
    })
  }, [reducedMotion])

  useEffect(() => {
    const container = posterProjectRef.current
    if (!container) return undefined
    let settleTimer
    const markSettledSection = () => {
      window.clearTimeout(settleTimer)
      settleTimer = window.setTimeout(() => {
        if (scrollTweenRef.current?.isActive()) return
        const sections = [...container.querySelectorAll('.poster-index, .poster-dreamcore-section, .poster-vietnam-section, .poster-japan-section')]
        const settled = sections.find((section) => Math.abs(section.offsetTop - container.scrollTop) < 8)
        setIntroReadySection(settled?.id ?? null)
      }, 100)
    }
    container.addEventListener('scroll', markSettledSection, { passive: true })
    container.addEventListener('scrollend', markSettledSection)
    markSettledSection()
    return () => {
      window.clearTimeout(settleTimer)
      container.removeEventListener('scroll', markSettledSection)
      container.removeEventListener('scrollend', markSettledSection)
    }
  }, [])

  useEffect(() => {
    const container = posterProjectRef.current
    if (!container) return undefined
    const media = gsap.matchMedia()
    media.add('(pointer: fine)', () => {
      const sections = [...container.querySelectorAll('section[id^="poster-"]')]
      const step = (direction) => {
        const current = sections.reduce((closest, section, index) =>
          Math.abs(section.offsetTop - container.scrollTop) < Math.abs(sections[closest].offsetTop - container.scrollTop) ? index : closest, 0)
        const next = Math.min(sections.length - 1, Math.max(0, current + direction))
        if (next !== current) scrollToSection(sections[next].id, true)
      }
      const observer = Observer.create({
        target: container,
        type: 'wheel',
        preventDefault: true,
        tolerance: 12,
        ignore: '.poster-lightbox',
        onDown: () => step(1),
        onUp: () => step(-1),
      })
      return () => observer.kill()
    })
    return () => {
      media.revert()
      scrollTweenRef.current?.kill()
    }
  }, [scrollToSection])

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return
      if (zoomOpen) setZoomOpen(false)
      else if (vietnamZoom) setVietnamZoom(null)
      else if (japanZoom) setJapanZoom(null)
      else onBack()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [zoomOpen, vietnamZoom, japanZoom, onBack])

  return (
    <main
      ref={posterProjectRef}
      className={`poster-project${zoomOpen || vietnamZoom || japanZoom ? ' has-lightbox' : ''}`}
      aria-label="Bộ sưu tập poster"
    >
      <section className="poster-index" id="poster-index" aria-labelledby="poster-index-title">
        <div className="poster-index-grid" aria-hidden="true" />
        <motion.div className="poster-index-copy" initial={reducedMotion ? false : { opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}>
          <span className="poster-index-overline"><i /> VISUAL STORIES / SELECTED POSTERS</span>
          <h1 id="poster-index-title">POSTER<span>.</span></h1>
          <p>Mỗi tấm poster là một thế giới riêng — từ giấc mơ siêu thực, nhịp sống Việt Nam đến những lát cắt Nhật Bản.</p>
          <div className="poster-index-meta"><span>03 CHƯƠNG</span><span>{String(posters.length + vietnamPosters.length + japanPosters.length).padStart(2, '0')} TÁC PHẨM</span><span>2026</span></div>
          <button className="poster-index-enter" type="button" onClick={() => scrollToSection('poster-dreamcore')}>KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true">↓</span></button>
        </motion.div>
        <div className="poster-index-preview" aria-hidden="true">
          <motion.figure className="poster-index-preview-card is-dream" initial={reducedMotion ? false : { opacity: 0, rotate: -15, y: 110 }} animate={{ opacity: 1, rotate: -8, y: 0 }} transition={{ duration: 0.95, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}><img src={posters[0].thumbnail} alt="" /><figcaption>01 / DREAMCORE</figcaption></motion.figure>
          <motion.figure className="poster-index-preview-card is-vietnam" initial={reducedMotion ? false : { opacity: 0, rotate: 17, y: 130 }} animate={{ opacity: 1, rotate: 7, y: 0 }} transition={{ duration: 0.95, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}><img src={vietnamPosters[2].thumbnail} alt="" /><figcaption>02 / VIỆT NAM</figcaption></motion.figure>
          <motion.figure className="poster-index-preview-card is-japan" initial={reducedMotion ? false : { opacity: 0, rotate: 9, x: 90 }} animate={{ opacity: 1, rotate: -3, x: 0 }} transition={{ duration: 0.95, delay: 0.46, ease: [0.16, 1, 0.3, 1] }}><img src={japanPosters[2].image} alt="" /><figcaption>03 / NHẬT BẢN</figcaption></motion.figure>
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
        <audio ref={vietnamIntroAudioRef} src="/assets/poster/vietnam/intro/dan-bau.mp3" preload="auto" aria-hidden="true" />
        <AnimatePresence>
          {!reducedMotion && vietnamIntroReady && !vietnamIntroComplete && (
            <motion.div className="poster-vietnam-umbrella-intro" key="vietnam-intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} aria-label="Đang mở đầu chương Việt Nam">
              <div className="poster-vietnam-umbrella-halo" aria-hidden="true" />
              {vietnamIntroGrains.map((grain) => (
                <motion.img
                  key={grain.id}
                  className={`poster-vietnam-intro-grain ${grain.foreground ? 'is-front' : 'is-back'}`}
                  src={grain.image}
                  alt=""
                  draggable="false"
                  style={{ left: `${grain.left}%`, top: `${grain.top}%`, width: grain.size }}
                  initial={{ x: '0vw', y: '-12vh', rotate: grain.rotation, opacity: 0 }}
                  animate={{ x: '165vw', y: `${grain.drop}vh`, rotate: grain.rotation + 420, opacity: [0, grain.foreground ? 0.94 : 0.58, grain.foreground ? 0.94 : 0.58, 0] }}
                  transition={{
                    x: { duration: grain.duration, delay: grain.delay, ease: 'linear' },
                    y: { duration: grain.duration, delay: grain.delay, ease: [0.38, 0, 0.28, 1] },
                    rotate: { duration: grain.duration, delay: grain.delay, ease: 'linear' },
                    opacity: { duration: grain.duration, delay: grain.delay, times: [0, 0.14, 0.78, 1] },
                  }}
                />
              ))}
              <motion.img
                className="poster-vietnam-intro-umbrella"
                src="/assets/poster/vietnam/intro/umbrella.png"
                alt=""
                draggable="false"
                fetchPriority="high"
                initial={{ rotate: 24, scale: 0.58, opacity: 0 }}
                animate={{ rotate: -480, scale: 3.5, opacity: 1 }}
                exit={{ rotate: -516, scale: 3.9, transition: { duration: 0.1, ease: 'linear' } }}
                transition={{
                  rotate: { duration: 1.4, ease: 'linear' },
                  scale: { duration: 1.4, ease: [0.72, 0, 0.78, 0.58] },
                  opacity: { duration: 0.15, ease: 'easeOut' },
                }}
              />
              <motion.span className="poster-vietnam-umbrella-label" initial={{ x: '-50%', opacity: 0, y: 14 }} animate={{ x: '-50%', opacity: [0, 1, 1, 0], y: [14, 0, 0, -12] }} transition={{ duration: 1.3, times: [0, 0.18, 0.72, 1] }}>HẠT GẠO QUÊ HƯƠNG · BƯỚC VÀO VIỆT NAM</motion.span>
              <button className="poster-vietnam-umbrella-skip" type="button" onClick={() => setVietnamIntroComplete(true)}>BỎ QUA ↗</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="poster-vietnam-masthead"><span>CHƯƠNG 02 / BỘ SƯU TẬP POSTER</span><span>VIỆT NAM · 2026</span></div>
        <div className="poster-vietnam-layout">
          <motion.header ref={vietnamIntroRef} className="poster-vietnam-intro" initial={reducedMotion ? false : { opacity: 0, x: -38 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div className="poster-vietnam-intro-copy">
              <span className="poster-vietnam-kicker">NĂM LÁT CẮT, MỘT DÁNG HÌNH ĐẤT NƯỚC</span>
              <h2 id="poster-vietnam-title"><span>VIỆT</span><span>NAM</span></h2>
              <p>Từ nhịp phố đến nét xưa — những sắc màu thân thuộc kể câu chuyện Việt Nam hôm nay.</p>
            </div>
            <div className="poster-vietnam-intro-foot"><span>ĐẤT NƯỚC / CON NGƯỜI</span><strong>✦</strong><span>01 — 05</span></div>
          </motion.header>
          <div className="poster-vietnam-exhibition">
            <div className="poster-vietnam-exhibition-head"><span>HÌNH ẢNH KỂ CHUYỆN</span><span>CHỌN MỘT TÁC PHẨM ĐỂ XEM CẬN ↗</span></div>
            <div className="poster-vietnam-display" aria-label="Năm poster Việt Nam">
              <Swiper
                className="poster-vietnam-swiper"
                modules={[Keyboard]}
                keyboard={{ enabled: true, onlyInViewport: true }}
                slidesPerView={1.16}
                spaceBetween={12}
                breakpoints={{ 700: { slidesPerView: 2.2, spaceBetween: 16 }, 1100: { slidesPerView: 3.2, spaceBetween: 18 }, 1600: { slidesPerView: 4.1, spaceBetween: 20 } }}
                onSwiper={(swiper) => { vietnamSwiperRef.current = swiper; setVietnamCanNext(!swiper.isEnd) }}
                onSlideChange={(swiper) => { setVietnamActive(swiper.activeIndex); setVietnamCanPrev(!swiper.isBeginning); setVietnamCanNext(!swiper.isEnd) }}
              >
                {vietnamPosters.map((poster, index) => (
                  <SwiperSlide key={poster.number}>
                    <button className="poster-vietnam-print" type="button" style={{ '--vietnam-accent': poster.color }} onClick={() => setVietnamZoom(poster)} aria-label={`Phóng to poster ${poster.title}`}>
                      <span className="poster-vietnam-print-index">{poster.number} / 05</span>
                      <span className="poster-vietnam-print-art">
                        <img src={poster.thumbnail} alt={poster.alt} loading="lazy" draggable="false" />
                        {vietnamInView && vietnamActive === index && !reducedMotion && <motion.span className="poster-vietnam-ink-pass" initial={{ x: '-105%' }} animate={{ x: '105%' }} transition={{ duration: 0.76, ease: [0.76, 0, 0.24, 1] }} aria-hidden="true" />}
                      </span>
                      <span className="poster-vietnam-print-caption"><strong>{poster.title}</strong><small>{poster.category}</small></span>
                      {vietnamInView && vietnamActive === index && <motion.span className="poster-vietnam-seal" initial={reducedMotion ? false : { opacity: 0, scale: 1.7, rotate: -24 }} animate={{ opacity: 1, scale: 1, rotate: -8 }} transition={{ type: 'spring', stiffness: 210, damping: 17, delay: reducedMotion ? 0 : 0.36 }} aria-hidden="true">✦</motion.span>}
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div className="poster-vietnam-exhibition-foot">
              <button className="poster-vietnam-next" type="button" onClick={() => scrollToSection('poster-japan')}>TIẾP THEO / NHẬT BẢN ↓</button>
              <div className="poster-vietnam-controls"><span>{String(vietnamActive + 1).padStart(2, '0')} / 05</span><button type="button" aria-label="Poster Việt Nam trước" disabled={!vietnamCanPrev} onClick={() => vietnamSwiperRef.current?.slidePrev()}>←</button><button type="button" aria-label="Poster Việt Nam tiếp theo" disabled={!vietnamCanNext} onClick={() => vietnamSwiperRef.current?.slideNext()}>→</button></div>
            </div>
          </div>
        </div>
      </section>

      <section className="poster-japan-section" id="poster-japan" ref={japanSectionRef} aria-labelledby="poster-japan-title">
        <audio ref={japanIntroAudioRef} src="/assets/poster/japan/intro/janpan.mp3" preload="auto" aria-hidden="true" />
        <AnimatePresence>
          {!reducedMotion && japanIntroReady && !japanIntroComplete && (
            <motion.div className="poster-japan-intro" key="japan-intro" initial={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.1 }} aria-label="Đang mở đầu chương Nhật Bản">
              <div className="poster-japan-intro-sun" aria-hidden="true" />
              {japanIntroPetals.map((petal) => (
                <motion.img
                  key={petal.id}
                  className={`poster-japan-intro-petal ${petal.foreground ? 'is-front' : 'is-back'}`}
                  src={petal.image}
                  alt=""
                  draggable="false"
                  style={{ left: `${petal.left}%`, top: `${petal.top}%`, width: petal.size }}
                  initial={{ x: '0vw', y: '-16vh', rotate: petal.rotation, opacity: 0 }}
                  animate={{ x: '-165vw', y: `${petal.drop}vh`, rotate: petal.rotation - 540, opacity: [0, petal.foreground ? 0.9 : 0.52, petal.foreground ? 0.9 : 0.52, 0] }}
                  transition={{
                    x: { duration: petal.duration, delay: petal.delay, ease: 'linear' },
                    y: { duration: petal.duration, delay: petal.delay, ease: [0.38, 0, 0.28, 1] },
                    rotate: { duration: petal.duration, delay: petal.delay, ease: 'linear' },
                    opacity: { duration: petal.duration, delay: petal.delay, times: [0, 0.16, 0.76, 1] },
                  }}
                />
              ))}
              <motion.img
                className="poster-japan-intro-umbrella"
                src="/assets/poster/japan/intro/umbrella.webp"
                alt=""
                draggable="false"
                initial={{ rotate: -24, scale: 0.58, opacity: 0 }}
                animate={{ rotate: 480, scale: 3.5, opacity: 1 }}
                exit={{ rotate: 516, scale: 3.9, transition: { duration: 0.1, ease: 'linear' } }}
                transition={{
                  rotate: { duration: 1.4, ease: 'linear' },
                  scale: { duration: 1.4, ease: [0.72, 0, 0.78, 0.58] },
                  opacity: { duration: 0.15, ease: 'easeOut' },
                }}
              />
              <motion.span className="poster-japan-intro-label" initial={{ x: '-50%', opacity: 0, y: 14 }} animate={{ x: '-50%', opacity: [0, 1, 1, 0], y: [14, 0, 0, -12] }} transition={{ duration: 1.3, times: [0, 0.18, 0.72, 1] }}>日本へ · BƯỚC VÀO NHẬT BẢN</motion.span>
              <button className="poster-japan-intro-skip" type="button" onClick={() => setJapanIntroComplete(true)}>BỎ QUA ↗</button>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="poster-japan-sun" aria-hidden="true" />
        <div className="poster-japan-topline"><span>CHƯƠNG 03 / BỘ SƯU TẬP POSTER</span><span>日本 · JAPAN</span></div>
        <div className="poster-japan-layout">
          <div className="poster-japan-story">
            <span className="poster-japan-eyebrow">MỞ CÁNH CỬA / BƯỚC VÀO NHẬT BẢN</span>
            <h2 id="poster-japan-title"><span lang="ja">日本</span><strong>JAPAN<span>.</span></strong></h2>
            <p>Từ sắc son đền cổ đến bảng hiệu ga tàu và nhịp phố hôm nay — năm góc nhìn cùng mở ra một Nhật Bản nhiều lớp.</p>
            <div className="poster-japan-stations" role="group" aria-label="Chọn poster Nhật Bản">
              {japanPosters.map((poster, index) => (
                <button className={`poster-japan-station${japanActive === index ? ' is-active' : ''}`} type="button" aria-pressed={japanActive === index} key={poster.number} onClick={() => japanSwiperRef.current?.slideTo(index)}>
                  {japanActive === index && <motion.span className="poster-japan-station-marker" layoutId="japan-station-marker" transition={{ type: 'spring', stiffness: 350, damping: 32 }} aria-hidden="true" />}
                  <span>{poster.number}</span><strong>{poster.title}</strong><small lang="ja">{poster.japanese}</small>
                </button>
              ))}
            </div>
          </div>
          <div className="poster-japan-gallery">
            <div className="poster-japan-gallery-head"><span>一枚ずつ / TỪNG TẤM MỘT</span><span>{japanPosters[japanActive].subtitle}</span></div>
            <div className="poster-japan-frame" id="poster-japan-stage">
              <Swiper className="poster-japan-swiper" modules={[EffectFade, Keyboard]} effect="fade" fadeEffect={{ crossFade: true }} speed={reducedMotion ? 0 : 600} keyboard={{ enabled: true, onlyInViewport: true }} onSwiper={(swiper) => { japanSwiperRef.current = swiper }} onSlideChange={(swiper) => setJapanActive(swiper.activeIndex)}>
                {japanPosters.map((poster) => (
                  <SwiperSlide key={poster.number}>
                    <button className="poster-japan-art" type="button" onClick={() => setJapanZoom(poster)} aria-label={`Phóng to poster ${poster.title}`}>
                      <img src={poster.image} alt={poster.alt} loading="eager" draggable="false" />
                      <span>XEM TÁC PHẨM ↗</span>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
              <AnimatePresence>
                {japanInView && !reducedMotion && <motion.div className="poster-japan-shoji" key={japanActive} aria-hidden="true">
                  <motion.span className="is-left" initial={{ x: 0 }} animate={{ x: '-104%' }} transition={{ duration: 1, delay: 0.06, ease: [0.76, 0, 0.24, 1] }} />
                  <motion.span className="is-right" initial={{ x: 0 }} animate={{ x: '104%' }} transition={{ duration: 1, delay: 0.13, ease: [0.76, 0, 0.24, 1] }} />
                </motion.div>}
              </AnimatePresence>
            </div>
            <div className="poster-japan-gallery-foot">
              <div><strong>{japanPosters[japanActive].number}</strong><span> / 05</span><i /> <span>{japanPosters[japanActive].title}</span></div>
              <div className="poster-japan-actions"><button type="button" aria-label="Poster Nhật Bản trước" disabled={japanActive === 0} onClick={() => japanSwiperRef.current?.slidePrev()}>←</button><button type="button" aria-label="Poster Nhật Bản tiếp theo" disabled={japanActive === japanPosters.length - 1} onClick={() => japanSwiperRef.current?.slideNext()}>→</button></div>
            </div>
          </div>
        </div>
        <div className="poster-japan-footer"><span>FIVE VIEWS, ONE JAPAN · 2026</span><button type="button" onClick={() => scrollToSection('poster-index')}>VỀ ĐẦU BỘ SƯU TẬP ↑</button></div>
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
      <AnimatePresence>
        {japanZoom && (
          <motion.div className="poster-lightbox" role="dialog" aria-modal="true" aria-label={`Poster ${japanZoom.title} phóng to`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.28 }} onClick={() => setJapanZoom(null)}>
            <motion.img src={japanZoom.image} alt={japanZoom.alt} initial={reducedMotion ? false : { scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} transition={{ duration: reducedMotion ? 0 : 0.4 }} onClick={(event) => event.stopPropagation()} />
            <button type="button" onClick={() => setJapanZoom(null)} aria-label="Đóng poster phóng to">ĐÓNG ×</button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

export default PosterProject
