import { useState, useEffect, useRef, useCallback, lazy, Suspense } from 'react'
import { motion, AnimatePresence, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import ArtClownProject from './ArtClownProject'
import AboutPage from './AboutPage'
import EkoProject from './EkoProject'
import PosterProject from './PosterProject'
import './App.css'

const loadLogoProject = () => import('./LogoProject')
const loadThreeDProject = () => import('./ThreeDProject')
const LogoProject = lazy(loadLogoProject)
const ThreeDProject = lazy(loadThreeDProject)

function warmProjectRoute(id) {
  if (id === 'logo') loadLogoProject().catch(() => {})
  if (id === '3d') loadThreeDProject().catch(() => {})
}

function BrandingProjectCard({ className, image, imageAlt, name, tagline, index, onClick }) {
  const cardRef = useRef(null)
  const pointerFrameRef = useRef(null)
  const latestPointerRef = useRef(null)
  const pointerX = useMotionValue(50)
  const pointerY = useMotionValue(50)
  const tiltXTarget = useMotionValue(0)
  const tiltYTarget = useMotionValue(0)
  const tiltX = useSpring(tiltXTarget, { stiffness: 230, damping: 22 })
  const tiltY = useSpring(tiltYTarget, { stiffness: 230, damping: 22 })
  const liquidLight = useMotionTemplate`radial-gradient(circle at ${pointerX}% ${pointerY}%, rgba(255,255,255,0.5), rgba(255,255,255,0.08) 24%, transparent 52%)`

  const handlePointerMove = (event) => {
    if (event.pointerType === 'touch') return
    latestPointerRef.current = { x: event.clientX, y: event.clientY }
    if (pointerFrameRef.current !== null) return
    pointerFrameRef.current = requestAnimationFrame(() => {
      pointerFrameRef.current = null
      const bounds = cardRef.current?.getBoundingClientRect()
      const pointer = latestPointerRef.current
      if (!bounds || !pointer) return
      const x = Math.min(1, Math.max(0, (pointer.x - bounds.left) / bounds.width))
      const y = Math.min(1, Math.max(0, (pointer.y - bounds.top) / bounds.height))
      pointerX.set(x * 100)
      pointerY.set(y * 100)
      tiltXTarget.set((0.5 - y) * 8)
      tiltYTarget.set((x - 0.5) * 10)
    })
  }

  const resetTilt = () => {
    if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current)
    pointerFrameRef.current = null
    latestPointerRef.current = null
    pointerX.set(50)
    pointerY.set(50)
    tiltXTarget.set(0)
    tiltYTarget.set(0)
  }

  useEffect(() => () => {
    if (pointerFrameRef.current !== null) cancelAnimationFrame(pointerFrameRef.current)
  }, [])

  return (
    <motion.button
      ref={cardRef}
      className={`branding-project-card ${className}`}
      type="button"
      onClick={onClick}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetTilt}
      onBlur={resetTilt}
      whileHover={{ y: -8, scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      style={{ rotateX: tiltX, rotateY: tiltY, transformPerspective: 900 }}
    >
      <motion.span className="branding-liquid-light" style={{ background: liquidLight }} aria-hidden="true" />
      <span className="branding-card-index">{index}</span>
      <img src={image} alt={imageAlt} />
      <span className="branding-project-name">{name}</span>
      <small>{tagline}</small>
      <span className="branding-card-action">XEM DỰ ÁN <b>↗</b></span>
    </motion.button>
  )
}

const globalMenuItems = [
  { num: '01', title: 'HOME', destination: 'home' },
  { num: '02', title: 'ABOUT', destination: 'about' },
]

function GlobalMenu({ open, tone, current, locked, hidden, onOpen, onClose, onNavigate }) {
  const reducedMotion = useReducedMotion()
  return (
    <>
      <AnimatePresence>
      {!hidden && !open && !locked && <motion.header key="menu-trigger" className="app-header global-menu-header" exit={{ opacity: 0 }} transition={{ duration: reducedMotion ? 0 : 0.15 }}>
        <motion.button
          className={`menu-trigger is-${tone}`}
          onClick={onOpen}
          aria-label={locked ? 'Hoàn thành thử thách nhặt rác để mở menu' : 'Open Navigation Menu'}
          aria-expanded={open}
          aria-disabled={locked}
          disabled={locked}
          initial={reducedMotion ? false : { opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: reducedMotion ? 0 : 0.65, delay: reducedMotion ? 0 : 0.2, ease: 'easeOut' }}
          whileHover={locked ? undefined : { scale: 1.05 }}
          whileTap={locked ? undefined : { scale: 0.95 }}
        >
          Menu +
        </motion.button>
      </motion.header>}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <div className="menu-container">
            <motion.div
              className="menu-backdrop-left"
              onClick={onClose}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            />

            <motion.div
              className="menu-white-drawer"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <button className="menu-close-btn" onClick={onClose} aria-label="Close Menu" type="button">
                Close X
              </button>

              <nav className="menu-nav-list" aria-label="Điều hướng chính">
                {globalMenuItems.map((item, index) => (
                  <motion.button
                    key={item.num}
                    className={`menu-nav-item${current === item.destination ? ' is-current' : ''}`}
                    type="button"
                    onClick={() => onNavigate(item.destination)}
                    initial={{ opacity: 0, x: 35 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.45, delay: 0.15 + index * 0.07, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <span className="nav-item-num">{item.num}</span>
                    <span className="nav-item-title">{item.title}</span>
                  </motion.button>
                ))}
              </nav>
              <div className="menu-mobile-contact">
                <h2>CONTACT</h2>
                <div className="menu-mobile-contact-line">
                  <a href="mailto:truongquochung2604@gmail.com">truongquochung2604@gmail.com</a>
                  <a href="tel:+84799853984">0799853984</a>
                </div>
                <div className="menu-mobile-socials" aria-label="Social profiles">
                  <span><img src="/assets/contact/discord.svg" alt="Discord" />hugtruog</span>
                  <span><img src="/assets/contact/facebook.svg" alt="Facebook" />Hùng Trương</span>
                  <span><img src="/assets/contact/instagram.svg" alt="Instagram" />04_.hu</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function App() {
  const reducedMotion = useReducedMotion()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [isArtClownOpen, setIsArtClownOpen] = useState(() => window.location.hash.startsWith('#art-clown'))
  const [isAboutOpen, setIsAboutOpen] = useState(() => window.location.hash.startsWith('#about'))
  const [isEkoOpen, setIsEkoOpen] = useState(() => window.location.hash.startsWith('#eko'))
  const [isPosterOpen, setIsPosterOpen] = useState(() => window.location.hash.startsWith('#poster'))
  const [isLogoOpen, setIsLogoOpen] = useState(() => window.location.hash === '#logo')
  const [logoDetailOpen, setLogoDetailOpen] = useState(false)
  const [is3DOpen, setIs3DOpen] = useState(() => window.location.hash === '#3d')
  const [threeDDetailOpen, setThreeDDetailOpen] = useState(false)
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const lotusX = useTransform(mouseX, (value) => value * -16)
  const lotusY = useTransform(mouseY, (value) => value * -10)
  const personX = useTransform(mouseX, (value) => value * 8)
  const flowerX = useTransform(mouseX, (value) => value * 16)
  const flowerY = useTransform(mouseY, (value) => value * 12)
  const lotusTransform = useMotionTemplate`translate(calc(-50% + ${lotusX}px), ${lotusY}px)`
  const personTransform = useMotionTemplate`translateX(calc(-48% + ${personX}px))`
  const flowerTransform = useMotionTemplate`translate(${flowerX}px, ${flowerY}px)`
  const [showCurtain, setShowCurtain] = useState(() => !window.location.search.includes('nocurtain') && !window.location.hash.includes('nocurtain'))
  const [isAboutTransitioning, setIsAboutTransitioning] = useState(false)
  const [projectTransition, setProjectTransition] = useState(null)
  const [isAboutSoundOn, setIsAboutSoundOn] = useState(false)
  const [routeMenuTone, setRouteMenuTone] = useState(() => window.location.hash.startsWith('#poster') ? 'dark' : 'light')
  const [routeNavigationLocked, setRouteNavigationLocked] = useState(false)
  const productScrollPosition = useRef(0)
  const returnToBrandingPicker = useRef(false)
  const aboutTransitionTimer = useRef(null)
  const projectTransitionTimer = useRef(null)
  const aboutAudioRef = useRef(null)
  const aboutAudioFade = useRef(null)
  const aboutAudioRequestedActive = useRef(false)
  const ekoHeroAudioRef = useRef(null)
  const ekoHeroAudioFade = useRef(null)
  const ekoHeroAudioRequestedActive = useRef(false)
  const artClownFireworksAudioRef = useRef(null)
  const artClownCircusAudioRef = useRef(null)
  const artClownCircusAudioFade = useRef(null)
  const artClownCircusAudioRequestedActive = useRef(false)
  const artClownValuesAudioRef = useRef(null)
  const artClownValuesAudioFade = useRef(null)
  const artClownValuesAudioRequestedActive = useRef(false)
  const posterAudioRef = useRef(null)
  const posterAudioFade = useRef(null)
  const posterAudioRequestedActive = useRef(false)

  const fadeAboutAudio = (targetVolume, duration = 800, pauseAfter = false) => {
    const audio = aboutAudioRef.current
    if (!audio) return
    if (aboutAudioFade.current) cancelAnimationFrame(aboutAudioFade.current)
    const startVolume = audio.volume
    const startedAt = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - ((1 - progress) ** 3)
      audio.volume = Math.min(1, Math.max(0, startVolume + ((targetVolume - startVolume) * eased)))
      if (progress < 1) {
        aboutAudioFade.current = requestAnimationFrame(tick)
      } else {
        aboutAudioFade.current = null
        if (pauseAfter) audio.pause()
      }
    }
    aboutAudioFade.current = requestAnimationFrame(tick)
  }

  const startAboutAudio = () => {
    aboutAudioRequestedActive.current = true
    if (!aboutAudioRef.current) {
      const audio = new Audio('/assets/about/relaxation-05.mp3')
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      aboutAudioRef.current = audio
    }
    const audio = aboutAudioRef.current
    audio.play().then(() => {
      if (!aboutAudioRequestedActive.current) return
      setIsAboutSoundOn(true)
      fadeAboutAudio(0.18, 1200)
    }).catch(() => setIsAboutSoundOn(false))
  }

  const stopAboutAudio = () => {
    aboutAudioRequestedActive.current = false
    setIsAboutSoundOn(false)
    fadeAboutAudio(0, 480, true)
  }

  const toggleAboutAudio = () => {
    const audio = aboutAudioRef.current
    if (!audio || audio.paused) {
      startAboutAudio()
      return
    }
    stopAboutAudio()
  }

  const fadeEkoHeroAudio = useCallback((targetVolume, duration = 800, pauseAfter = false) => {
    const audio = ekoHeroAudioRef.current
    if (!audio) return
    if (ekoHeroAudioFade.current) cancelAnimationFrame(ekoHeroAudioFade.current)
    const startVolume = audio.volume
    const startedAt = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - ((1 - progress) ** 3)
      audio.volume = Math.min(1, Math.max(0, startVolume + ((targetVolume - startVolume) * eased)))
      if (progress < 1) {
        ekoHeroAudioFade.current = requestAnimationFrame(tick)
      } else {
        ekoHeroAudioFade.current = null
        if (pauseAfter) audio.pause()
      }
    }
    ekoHeroAudioFade.current = requestAnimationFrame(tick)
  }, [])

  const ensureEkoHeroAudio = useCallback(() => {
    if (!ekoHeroAudioRef.current) {
      const audio = new Audio('/assets/eko/hero-morning-birds.mp3')
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      ekoHeroAudioRef.current = audio
    }
    return ekoHeroAudioRef.current
  }, [])

  const primeEkoHeroAudio = useCallback(() => {
    const audio = ensureEkoHeroAudio()
    audio.volume = 0
    audio.play().catch(() => {})
  }, [ensureEkoHeroAudio])

  const setEkoHeroAudioActive = useCallback((active) => {
    ekoHeroAudioRequestedActive.current = active
    if (!active) {
      fadeEkoHeroAudio(0, 420, true)
      return
    }

    const audio = ensureEkoHeroAudio()
    audio.play()
      .then(() => { if (ekoHeroAudioRequestedActive.current) fadeEkoHeroAudio(0.07, 1800) })
      .catch(() => {})
  }, [ensureEkoHeroAudio, fadeEkoHeroAudio])

  const ensureArtClownFireworksAudio = useCallback(() => {
    if (!artClownFireworksAudioRef.current) {
      const audio = new Audio('/assets/art-clown/source/fireworks-multiple-booms.mp3')
      audio.preload = 'auto'
      audio.volume = 0
      artClownFireworksAudioRef.current = audio
    }
    return artClownFireworksAudioRef.current
  }, [])

  const primeArtClownFireworksAudio = useCallback(() => {
    const audio = ensureArtClownFireworksAudio()
    if (!audio.paused && audio.volume > 0) return
    audio.volume = 0
    audio.play().catch(() => {})
  }, [ensureArtClownFireworksAudio])

  const playArtClownFireworks = useCallback(() => {
    const audio = ensureArtClownFireworksAudio()
    audio.pause()
    audio.currentTime = 0
    audio.volume = 0.88
    audio.play().catch(() => {})
  }, [ensureArtClownFireworksAudio])

  const stopArtClownFireworks = useCallback(() => {
    const audio = artClownFireworksAudioRef.current
    if (!audio) return
    audio.pause()
    audio.currentTime = 0
  }, [])

  const fadeArtClownCircusAudio = useCallback((targetVolume, duration = 700, pauseAfter = false) => {
    const audio = artClownCircusAudioRef.current
    if (!audio) return
    if (artClownCircusAudioFade.current) cancelAnimationFrame(artClownCircusAudioFade.current)
    const startVolume = audio.volume
    const startedAt = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - ((1 - progress) ** 3)
      audio.volume = Math.min(1, Math.max(0, startVolume + ((targetVolume - startVolume) * eased)))
      if (progress < 1) {
        artClownCircusAudioFade.current = requestAnimationFrame(tick)
      } else {
        artClownCircusAudioFade.current = null
        if (pauseAfter) audio.pause()
      }
    }
    artClownCircusAudioFade.current = requestAnimationFrame(tick)
  }, [])

  const ensureArtClownCircusAudio = useCallback(() => {
    if (!artClownCircusAudioRef.current) {
      const audio = new Audio('/assets/art-clown/source/circus-carousel-theme.mp3')
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      artClownCircusAudioRef.current = audio
    }
    return artClownCircusAudioRef.current
  }, [])

  const primeArtClownCircusAudio = useCallback(() => {
    const audio = ensureArtClownCircusAudio()
    audio.volume = 0
    audio.play().catch(() => {})
  }, [ensureArtClownCircusAudio])

  const setArtClownCircusAudioActive = useCallback((active) => {
    artClownCircusAudioRequestedActive.current = active
    if (!active) {
      fadeArtClownCircusAudio(0, 360, true)
      return
    }

    const audio = ensureArtClownCircusAudio()
    if (audio.volume === 0) audio.currentTime = 0
    audio.play()
      .then(() => { if (artClownCircusAudioRequestedActive.current) fadeArtClownCircusAudio(0.22, 950) })
      .catch(() => {})
  }, [ensureArtClownCircusAudio, fadeArtClownCircusAudio])

  const fadeArtClownValuesAudio = useCallback((targetVolume, duration = 850, pauseAfter = false) => {
    const audio = artClownValuesAudioRef.current
    if (!audio) return
    if (artClownValuesAudioFade.current) cancelAnimationFrame(artClownValuesAudioFade.current)
    const startVolume = audio.volume
    const startedAt = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - ((1 - progress) ** 3)
      audio.volume = Math.min(1, Math.max(0, startVolume + ((targetVolume - startVolume) * eased)))
      if (progress < 1) {
        artClownValuesAudioFade.current = requestAnimationFrame(tick)
      } else {
        artClownValuesAudioFade.current = null
        if (pauseAfter) audio.pause()
      }
    }
    artClownValuesAudioFade.current = requestAnimationFrame(tick)
  }, [])

  const ensureArtClownValuesAudio = useCallback(() => {
    if (!artClownValuesAudioRef.current) {
      const audio = new Audio('/assets/art-clown/source/art-clown-values-ambience.mp3')
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      artClownValuesAudioRef.current = audio
    }
    return artClownValuesAudioRef.current
  }, [])

  const primeArtClownValuesAudio = useCallback(() => {
    const audio = ensureArtClownValuesAudio()
    audio.volume = 0
    audio.play().catch(() => {})
  }, [ensureArtClownValuesAudio])

  const setArtClownValuesAudioActive = useCallback((active) => {
    artClownValuesAudioRequestedActive.current = active
    if (!active) {
      fadeArtClownValuesAudio(0, 480, true)
      return
    }

    const audio = ensureArtClownValuesAudio()
    if (audio.paused) audio.currentTime = 0
    audio.play()
      .then(() => {
        if (artClownValuesAudioRequestedActive.current) fadeArtClownValuesAudio(0.5, 1150)
      })
      .catch(() => {})
  }, [ensureArtClownValuesAudio, fadeArtClownValuesAudio])

  const fadePosterAudio = useCallback((targetVolume, duration = 850, pauseAfter = false) => {
    const audio = posterAudioRef.current
    if (!audio) return
    if (posterAudioFade.current) cancelAnimationFrame(posterAudioFade.current)
    const startVolume = audio.volume
    const startedAt = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startedAt) / duration)
      const eased = 1 - ((1 - progress) ** 3)
      audio.volume = Math.min(1, Math.max(0, startVolume + ((targetVolume - startVolume) * eased)))
      if (progress < 1) {
        posterAudioFade.current = requestAnimationFrame(tick)
      } else {
        posterAudioFade.current = null
        if (pauseAfter) audio.pause()
      }
    }
    posterAudioFade.current = requestAnimationFrame(tick)
  }, [])

  const ensurePosterAudio = useCallback(() => {
    if (!posterAudioRef.current) {
      const audio = new Audio('/assets/poster/dreamcore/dreamcore-ambience.m4a')
      audio.loop = true
      audio.preload = 'auto'
      audio.volume = 0
      posterAudioRef.current = audio
    }
    return posterAudioRef.current
  }, [])

  const primePosterAudio = useCallback(() => {
    const audio = ensurePosterAudio()
    audio.volume = 0
    audio.play().catch(() => {})
  }, [ensurePosterAudio])

  const setPosterAudioActive = useCallback((active) => {
    const wasActive = posterAudioRequestedActive.current
    posterAudioRequestedActive.current = active
    if (!active) {
      fadePosterAudio(0, 500, true)
      return
    }

    const audio = ensurePosterAudio()
    if (!wasActive) audio.currentTime = 0
    audio.play()
      .then(() => {
        if (posterAudioRequestedActive.current) fadePosterAudio(0.52, 1200)
      })
      .catch(() => {})
  }, [ensurePosterAudio, fadePosterAudio])

  useEffect(() => {
    if (!isPosterOpen) setPosterAudioActive(false)
  }, [isPosterOpen, setPosterAudioActive])

  // Tự động kéo màn mở đầu sau 1.2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtain(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => () => {
    if (aboutTransitionTimer.current) window.clearTimeout(aboutTransitionTimer.current)
    if (projectTransitionTimer.current) window.clearTimeout(projectTransitionTimer.current)
    if (aboutAudioFade.current) cancelAnimationFrame(aboutAudioFade.current)
    if (ekoHeroAudioFade.current) cancelAnimationFrame(ekoHeroAudioFade.current)
    if (artClownCircusAudioFade.current) cancelAnimationFrame(artClownCircusAudioFade.current)
    if (artClownValuesAudioFade.current) cancelAnimationFrame(artClownValuesAudioFade.current)
    if (posterAudioFade.current) cancelAnimationFrame(posterAudioFade.current)
    aboutAudioRequestedActive.current = false
    ekoHeroAudioRequestedActive.current = false
    artClownCircusAudioRequestedActive.current = false
    artClownValuesAudioRequestedActive.current = false
    posterAudioRequestedActive.current = false
    aboutAudioRef.current?.pause()
    ekoHeroAudioRef.current?.pause()
    artClownFireworksAudioRef.current?.pause()
    artClownCircusAudioRef.current?.pause()
    artClownValuesAudioRef.current?.pause()
    posterAudioRef.current?.pause()
  }, [])

  // Hiệu ứng Parallax 3D tương tác theo chuột (tạm dừng khi menu mở hoặc trên thiết bị cảm ứng)
  useEffect(() => {
    if (reducedMotion || menuOpen || isAboutOpen || isArtClownOpen || isEkoOpen || isPosterOpen || isLogoOpen || is3DOpen) return undefined
    const hero = document.getElementById('hero')
    if (!hero) return undefined
    const hoverQuery = window.matchMedia('(hover: none)')
    let heroVisible = true
    let frame = null
    let pointer = null
    let width = window.innerWidth
    let height = window.innerHeight
    const visibility = new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting })
    visibility.observe(hero)
    const measure = () => { width = window.innerWidth; height = window.innerHeight }
    const update = () => {
      frame = null
      if (!pointer || !heroVisible) return
      mouseX.set((pointer.x - width / 2) / (width / 2))
      mouseY.set((pointer.y - height / 2) / (height / 2))
    }
    const handleMouseMove = (e) => {
      if (!heroVisible || hoverQuery.matches) return
      pointer = { x: e.clientX, y: e.clientY }
      if (frame === null) frame = requestAnimationFrame(update)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', measure, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', measure)
      visibility.disconnect()
      if (frame !== null) cancelAnimationFrame(frame)
    }
  }, [menuOpen, reducedMotion, isAboutOpen, isArtClownOpen, isEkoOpen, isPosterOpen, isLogoOpen, is3DOpen, mouseX, mouseY])

  useEffect(() => {
    if (menuOpen) {
      mouseX.set(0)
      mouseY.set(0)
    }
  }, [menuOpen, mouseX, mouseY])

  useEffect(() => {
    const syncProjectRoute = () => {
      window.clearTimeout(aboutTransitionTimer.current)
      window.clearTimeout(projectTransitionTimer.current)
      setIsAboutTransitioning(false)
      const projectIsOpen = window.location.hash.startsWith('#art-clown')
      const aboutIsOpen = window.location.hash.startsWith('#about')
      const ekoIsOpen = window.location.hash.startsWith('#eko')
      const posterIsOpen = window.location.hash.startsWith('#poster')
      const logoIsOpen = window.location.hash === '#logo'
      const threeDIsOpen = window.location.hash === '#3d'
      setIsArtClownOpen(projectIsOpen)
      setIsAboutOpen(aboutIsOpen)
      setIsEkoOpen(ekoIsOpen)
      setIsPosterOpen(posterIsOpen)
      setIsLogoOpen(logoIsOpen)
      setIs3DOpen(threeDIsOpen)
      setLogoDetailOpen(false)
      setThreeDDetailOpen(false)
      setProjectTransition(null)
      if (!aboutIsOpen) aboutAudioRequestedActive.current = false
      if (!aboutIsOpen && aboutAudioRef.current && !aboutAudioRef.current.paused) {
        if (aboutAudioFade.current) cancelAnimationFrame(aboutAudioFade.current)
        aboutAudioRef.current.pause()
        aboutAudioRef.current.currentTime = 0
        setIsAboutSoundOn(false)
      }
      if (!ekoIsOpen && ekoHeroAudioRef.current) {
        ekoHeroAudioRequestedActive.current = false
        if (ekoHeroAudioFade.current) cancelAnimationFrame(ekoHeroAudioFade.current)
        ekoHeroAudioRef.current.pause()
        ekoHeroAudioRef.current.currentTime = 0
        ekoHeroAudioRef.current.volume = 0
      }
      if (!projectIsOpen) {
        artClownCircusAudioRequestedActive.current = false
        stopArtClownFireworks()
        artClownValuesAudioRequestedActive.current = false
        if (artClownCircusAudioFade.current) cancelAnimationFrame(artClownCircusAudioFade.current)
        if (artClownValuesAudioFade.current) cancelAnimationFrame(artClownValuesAudioFade.current)
        artClownCircusAudioRef.current?.pause()
        artClownValuesAudioRef.current?.pause()
        if (artClownCircusAudioRef.current) {
          artClownCircusAudioRef.current.currentTime = 0
          artClownCircusAudioRef.current.volume = 0
        }
        if (artClownValuesAudioRef.current) {
          artClownValuesAudioRef.current.currentTime = 0
          artClownValuesAudioRef.current.volume = 0
        }
      }
      if (!posterIsOpen && posterAudioRef.current) {
        posterAudioRequestedActive.current = false
        if (posterAudioFade.current) cancelAnimationFrame(posterAudioFade.current)
        posterAudioRef.current.pause()
        posterAudioRef.current.currentTime = 0
        posterAudioRef.current.volume = 0
      }
      if (!projectIsOpen && !ekoIsOpen && returnToBrandingPicker.current) {
        returnToBrandingPicker.current = false
        if (!aboutIsOpen && !posterIsOpen && !logoIsOpen && !threeDIsOpen) setSelectedProject({ id: 'branding' })
      }
      requestAnimationFrame(() => window.scrollTo({
        top: projectIsOpen || aboutIsOpen || ekoIsOpen || posterIsOpen || logoIsOpen || threeDIsOpen
          ? 0
          : (productScrollPosition.current || document.getElementById('product')?.offsetTop || 0),
        behavior: 'auto'
      }))
    }

    window.addEventListener('popstate', syncProjectRoute)
    window.addEventListener('hashchange', syncProjectRoute)
    return () => {
      window.removeEventListener('popstate', syncProjectRoute)
      window.removeEventListener('hashchange', syncProjectRoute)
    }
  }, [stopArtClownFireworks])

  // Danh mục sản phẩm dạng Thẻ Folder
  const folderProjects = [
    {
      id: 'branding',
      tag: 'Identity Design',
      title: 'BRANDING',
      vietnamese: 'BỘ NHẬN DIỆN THƯƠNG HIỆU',
      description: 'Định hình bản sắc thương hiệu qua ngôn ngữ thị giác đương đại: Logo, hệ thống màu sắc, kiểu chữ và bộ quy chuẩn ứng dụng toàn diện.',
      year: '2026'
    },
    {
      id: 'poster',
      tag: 'Poster Design',
      title: 'POSTER',
      vietnamese: 'THIẾT KẾ ÁP PHÍCH',
      description: 'Các thiết kế poster truyền tải ý tưởng qua hình ảnh, bố cục và chữ.',
      year: '2026'
    },
    {
      id: 'logo',
      tag: 'Logo Design',
      title: 'LOGO',
      vietnamese: 'THIẾT KẾ LOGO',
      description: 'Bộ sưu tập logo với những dấu hiệu và bản sắc riêng.',
      year: '2026'
    },
    {
      id: '3d',
      tag: '3D Design',
      title: '3D',
      vietnamese: 'THIẾT KẾ MÔ HÌNH 3D',
      description: 'Khám phá những sản phẩm và không gian ba chiều tương tác.',
      year: '2026'
    }
  ]

  const openArtClownProject = () => {
    if (projectTransition) return
    productScrollPosition.current = window.scrollY
    returnToBrandingPicker.current = true
    setMenuOpen(false)
    setSelectedProject(null)
    primeArtClownFireworksAudio()
    primeArtClownCircusAudio()
    primeArtClownValuesAudio()
    setProjectTransition('art-clown')
    projectTransitionTimer.current = window.setTimeout(() => {
      window.history.pushState({ artClown: true }, '', '#art-clown')
      setIsArtClownOpen(true)
      setIsLogoOpen(false)
      setIsAboutOpen(false)
      setIsEkoOpen(false)
      setIsPosterOpen(false)
      setProjectTransition(null)
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    }, reducedMotion ? 80 : 980)
  }

  const closeArtClownProject = () => {
    stopArtClownFireworks()
    setArtClownCircusAudioActive(false)
    setArtClownValuesAudioActive(false)
    returnToBrandingPicker.current = true
    if (window.history.state?.artClown) {
      window.history.back()
      return
    }

    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
    setIsArtClownOpen(false)
    returnToBrandingPicker.current = false
    setSelectedProject({ id: 'branding' })
    requestAnimationFrame(() => window.scrollTo({ top: productScrollPosition.current || document.getElementById('product')?.offsetTop || 0, behavior: 'auto' }))
  }

  const openAboutPage = () => {
    if (isAboutTransitioning) return
    productScrollPosition.current = window.scrollY
    setMenuOpen(false)
    setSelectedProject(null)
    startAboutAudio()
    setIsAboutTransitioning(true)
    aboutTransitionTimer.current = window.setTimeout(() => {
      window.history.pushState({ about: true }, '', '#about')
      setIsArtClownOpen(false)
      setIsAboutOpen(true)
      setIsLogoOpen(false)
      setIsPosterOpen(false)
      setIsAboutTransitioning(false)
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    }, reducedMotion ? 80 : 1050)
  }

  const closeAboutPage = () => {
    stopAboutAudio()
    if (window.history.state?.about) {
      window.history.back()
      return
    }

    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
    setIsAboutOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: productScrollPosition.current, behavior: 'auto' }))
  }

  const openEkoProject = () => {
    if (projectTransition) return
    productScrollPosition.current = window.scrollY
    returnToBrandingPicker.current = true
    setMenuOpen(false)
    setSelectedProject(null)
    primeEkoHeroAudio()
    setProjectTransition('eko')
    projectTransitionTimer.current = window.setTimeout(() => {
      window.history.pushState({ eko: true }, '', '#eko')
      setIsArtClownOpen(false)
      setIsAboutOpen(false)
      setIsEkoOpen(true)
      setIsLogoOpen(false)
      setIsPosterOpen(false)
      setProjectTransition(null)
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
    }, reducedMotion ? 80 : 980)
  }

  const closeEkoProject = () => {
    setEkoHeroAudioActive(false)
    returnToBrandingPicker.current = true
    if (window.history.state?.eko) {
      window.history.back()
      return
    }

    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
    setIsEkoOpen(false)
    returnToBrandingPicker.current = false
    setSelectedProject({ id: 'branding' })
    requestAnimationFrame(() => window.scrollTo({ top: productScrollPosition.current || document.getElementById('product')?.offsetTop || 0, behavior: 'auto' }))
  }

  const openPosterProject = () => {
    if (projectTransition) return
    productScrollPosition.current = window.scrollY
    setSelectedProject(null)
    setMenuOpen(false)
    setRouteMenuTone('dark')
    primePosterAudio()
    window.history.pushState({ poster: true }, '', '#poster')
    setIsArtClownOpen(false)
    setIsAboutOpen(false)
    setIsEkoOpen(false)
    setIsPosterOpen(true)
    setIsLogoOpen(false)
    setIs3DOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  const closePosterProject = () => {
    setPosterAudioActive(false)
    if (window.history.state?.poster) {
      window.history.back()
      return
    }
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
    setIsPosterOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: productScrollPosition.current, behavior: 'auto' }))
  }

  const openLogoProject = () => {
    if (projectTransition) return
    productScrollPosition.current = window.scrollY
    returnToBrandingPicker.current = false
    setSelectedProject(null)
    setMenuOpen(false)
    window.history.pushState({ logo: true }, '', '#logo')
    setIsLogoOpen(true)
    setLogoDetailOpen(false)
    setIs3DOpen(false)
    setIsArtClownOpen(false)
    setIsAboutOpen(false)
    setIsEkoOpen(false)
    setIsPosterOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  const closeLogoProject = () => {
    setLogoDetailOpen(false)
    if (window.history.state?.logo) {
      window.history.back()
      return
    }
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
    setIsLogoOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: productScrollPosition.current || document.getElementById('product')?.offsetTop || 0, behavior: 'auto' }))
  }

  const open3DProject = () => {
    if (projectTransition) return
    productScrollPosition.current = window.scrollY
    returnToBrandingPicker.current = false
    setSelectedProject(null)
    setMenuOpen(false)
    window.history.pushState({ threeD: true }, '', '#3d')
    setIs3DOpen(true)
    setThreeDDetailOpen(false)
    setIsLogoOpen(false)
    setIsArtClownOpen(false)
    setIsAboutOpen(false)
    setIsEkoOpen(false)
    setIsPosterOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' }))
  }

  const close3DProject = () => {
    setThreeDDetailOpen(false)
    if (window.history.state?.threeD) {
      window.history.back()
      return
    }
    window.history.replaceState({}, '', `${window.location.pathname}${window.location.search}`)
    setIs3DOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: productScrollPosition.current || document.getElementById('product')?.offsetTop || 0, behavior: 'auto' }))
  }

  const navigateFromGlobalMenu = (destination) => {
    if (routeNavigationLocked) return
    setMenuOpen(false)

    if (
      (destination === 'about' && isAboutOpen)
      || (destination === 'art-clown' && isArtClownOpen)
      || (destination === 'eko' && isEkoOpen)
      || (destination === 'poster' && isPosterOpen)
    ) return

    returnToBrandingPicker.current = false

    setIsLogoOpen(false)
    setLogoDetailOpen(false)
    setIs3DOpen(false)
    setThreeDDetailOpen(false)

    stopAboutAudio()
    setEkoHeroAudioActive(false)
    stopArtClownFireworks()
    setArtClownCircusAudioActive(false)
    setArtClownValuesAudioActive(false)
    setPosterAudioActive(false)

    if (destination === 'home' || destination === 'works') {
      window.history.pushState({}, '', `${window.location.pathname}${window.location.search}`)
      setIsArtClownOpen(false)
      setIsAboutOpen(false)
      setIsEkoOpen(false)
      setIsPosterOpen(false)
      setRouteMenuTone('light')
      window.setTimeout(() => {
        document.getElementById(destination === 'works' ? 'product' : 'hero')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' })
      }, 0)
      return
    }

    if (destination === 'about') {
      if (!isArtClownOpen && !isEkoOpen && !isPosterOpen && !isLogoOpen && !is3DOpen) {
        openAboutPage()
        return
      }
      window.history.pushState({ about: true }, '', '#about')
      setIsArtClownOpen(false)
      setIsEkoOpen(false)
      setIsPosterOpen(false)
      setIsAboutOpen(true)
      setRouteMenuTone('dark')
      startAboutAudio()
      return
    }

    if (destination === 'art-clown') {
      window.history.pushState({ artClown: true }, '', '#art-clown')
      setIsAboutOpen(false)
      setIsEkoOpen(false)
      setIsPosterOpen(false)
      setIsArtClownOpen(true)
      setRouteMenuTone('dark')
      primeArtClownFireworksAudio()
      primeArtClownCircusAudio()
      primeArtClownValuesAudio()
      return
    }

    window.history.pushState({ eko: true }, '', '#eko')
    setIsArtClownOpen(false)
    setIsAboutOpen(false)
    setIsPosterOpen(false)
    setIsEkoOpen(true)
    setRouteMenuTone('dark')
    primeEkoHeroAudio()
  }

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isArtClownOpen) closeArtClownProject()
      if (event.key === 'Escape' && isAboutOpen) closeAboutPage()
      if (event.key === 'Escape' && isEkoOpen) closeEkoProject()
    }

    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  })

  const currentMenuPage = is3DOpen ? '3d' : isLogoOpen ? 'logo' : isPosterOpen ? 'poster' : isArtClownOpen ? 'art-clown' : isAboutOpen ? 'about' : isEkoOpen ? 'eko' : 'home'
  const sharedMenu = (
    <GlobalMenu
      open={menuOpen}
      tone={currentMenuPage === 'home' || isLogoOpen || is3DOpen ? 'light' : isAboutOpen ? 'dark' : routeMenuTone}
      current={currentMenuPage}
      locked={routeNavigationLocked}
      hidden={!!selectedProject || isAboutTransitioning || !!projectTransition || logoDetailOpen || threeDDetailOpen}
      onOpen={() => { if (!routeNavigationLocked) setMenuOpen(true) }}
      onClose={() => setMenuOpen(false)}
      onNavigate={navigateFromGlobalMenu}
    />
  )

  if (isArtClownOpen) {
    return (
      <>
        {sharedMenu}
        <ArtClownProject
          onBack={closeArtClownProject}
          onFireworkBoom={playArtClownFireworks}
          onFireworkSoundPrime={primeArtClownFireworksAudio}
          onFireworkSoundStop={stopArtClownFireworks}
          onCircusAudioStateChange={setArtClownCircusAudioActive}
          onValuesAudioStateChange={setArtClownValuesAudioActive}
          onMenuToneChange={setRouteMenuTone}
        />
      </>
    )
  }

  if (isAboutOpen) {
    return <>{sharedMenu}<AboutPage onBack={closeAboutPage} soundOn={isAboutSoundOn} onToggleSound={toggleAboutAudio} /></>
  }

  if (isEkoOpen) {
    return (
      <>
        {sharedMenu}
        <EkoProject
          onBack={closeEkoProject}
          onHeroAudioStateChange={setEkoHeroAudioActive}
          onMenuToneChange={setRouteMenuTone}
          onNavigationLockChange={setRouteNavigationLocked}
        />
      </>
    )
  }

  if (isPosterOpen) {
    return <>{sharedMenu}<PosterProject onBack={closePosterProject} onDreamcoreVisibilityChange={setPosterAudioActive} onMenuToneChange={setRouteMenuTone} /></>
  }

  if (isLogoOpen) {
    return <>{sharedMenu}<Suspense fallback={<div style={{ minHeight: '100svh', background: '#f5f3ed', color: '#24251f', padding: '120px 24px' }}>Đang mở bộ sưu tập Logo…</div>}><LogoProject onBack={closeLogoProject} onDetailOpenChange={setLogoDetailOpen} /></Suspense></>
  }

  if (is3DOpen) {
    return <>{sharedMenu}<Suspense fallback={<div style={{ minHeight: '100svh', background: '#111822', color: '#fff', padding: '120px 24px' }}>Đang mở bộ sưu tập 3D…</div>}><ThreeDProject onBack={close3DProject} onDetailOpenChange={setThreeDDetailOpen} /></Suspense></>
  }

  return (
    <div className="portfolio-app">
      {sharedMenu}
      <AnimatePresence>
        {isAboutTransitioning && (
          <motion.div
            className="about-route-transition"
            initial={{ clipPath: 'circle(0% at 78% 17%)' }}
            animate={{ clipPath: 'circle(150% at 78% 17%)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.92, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.span
              className="about-route-orbit"
              initial={{ scale: 0.3, rotate: -80, opacity: 0 }}
              animate={{ scale: 1, rotate: 18, opacity: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.86, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            />
            <motion.div
              className="about-route-copy"
              initial={{ opacity: 0, y: 34, letterSpacing: '0.35em' }}
              animate={{ opacity: 1, y: 0, letterSpacing: '0.08em' }}
              transition={{ duration: reducedMotion ? 0 : 0.58, delay: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <small>ENTERING / PERSONAL SPACE</small>
              <strong>HELLO.</strong>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {projectTransition && (
          <motion.div
            className={`project-route-transition is-${projectTransition}`}
            initial={projectTransition === 'eko' || projectTransition === 'poster'
              ? { clipPath: 'circle(0% at 50% 50%)' }
              : { clipPath: 'inset(49.8% 0 49.8% 0)' }}
            animate={projectTransition === 'eko' || projectTransition === 'poster'
              ? { clipPath: 'circle(150% at 50% 50%)' }
              : { clipPath: 'inset(0% 0 0% 0)' }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.86, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.span
              className="project-route-shape shape-one"
              initial={{ opacity: 0, scale: 0.45, rotate: -35 }}
              animate={{ opacity: 1, scale: 1, rotate: projectTransition === 'eko' ? 18 : 7 }}
              transition={{ duration: reducedMotion ? 0 : 0.72, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            />
            <motion.span
              className="project-route-shape shape-two"
              initial={{ opacity: 0, scale: 1.5, rotate: 30 }}
              animate={{ opacity: 0.72, scale: 1, rotate: projectTransition === 'eko' ? -12 : -5 }}
              transition={{ duration: reducedMotion ? 0 : 0.78, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
              aria-hidden="true"
            />
            <motion.div
              className="project-route-copy"
              initial={{ opacity: 0, y: 30, scale: 0.92 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: reducedMotion ? 0 : 0.56, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            >
              <img
                src={projectTransition === 'poster' ? '/assets/poster/dreamcore/poster-1.webp' : projectTransition === 'eko' ? '/assets/eko/logo.svg' : '/assets/art-clown/source/logo-white.svg'}
                alt=""
              />
              <small>{projectTransition === 'poster' ? 'FOUR FRAMES / ONE DREAM' : projectTransition === 'eko' ? 'CLEAN EARTH / BRIGHT FUTURE' : 'PLAY / CREATE / BELONG'}</small>
              <strong>{projectTransition === 'poster' ? 'DREAMCORE' : projectTransition === 'eko' ? 'E-KO' : 'ART CLOWN'}</strong>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ================= MÀN MỞ ĐẦU ĐIỆN ẢNH (CINEMATIC INTRO CURTAIN) ================= */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div 
            className="intro-curtain"
            initial={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
          >
            <motion.span 
              className="intro-tag"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              PORTFOLIO • 2026
            </motion.span>
            
            <motion.h1 
              className="intro-headline"
              initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
              animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              FREEDOM DESIGNER
            </motion.h1>

            <motion.p 
              className="intro-sub"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
            >
              The idea becomes visual
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= HERO SECTION ================= */}
      <section className={`hero-section ${menuOpen ? 'menu-active' : ''}`} id="hero">
        {/* Nền tím gradient tràn toàn màn hình */}
        <motion.img 
          src="/assets/purple-glow.png" 
          decoding="async"
          alt="Purple Atmospheric Glow" 
          className="hero-fullscreen-bg"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 1.2 }}
        />

        {/* Tiêu đề góc trái: Bằng hàng với Menu + */}
        <div className="hero-text-left">
          <motion.h1 
            className="title-port"
            initial={reducedMotion ? false : { opacity: 0, y: -25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            PORT
          </motion.h1>
          
          <motion.h2 
            className="title-folio"
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            FOLIO
          </motion.h2>
        </div>

        {/* Cụm Visual Collage giữ chuẩn 100% bố cục gốc & Parallax chuyển động theo chuột mượt mà */}
        <div className="visual-stage">
          {/* Lớp 2: Hoa sen pha lê hồng */}
          <motion.img 
            src="/assets/crystal-lotus.png" 
            decoding="async"
            alt="Pink Iridescent Crystal Lotus" 
            className="visual-layer layer-lotus"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.0, delay: reducedMotion ? 0 : 0.3 }}
            style={{
              transform: lotusTransform
            }}
          />

          {/* Lớp 3: Chân dung chàng trai đứng liền sát đáy */}
          <motion.img 
            src="/assets/person.png" 
            decoding="async"
            fetchPriority="high"
            alt="Young Designer Silhouette Portrait" 
            className="visual-layer layer-person"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.0, delay: reducedMotion ? 0 : 0.4 }}
            style={{
              transform: personTransform
            }}
          />

          {/* Lớp 4: Hoa dâm bụt xanh ôm sát lưng bên trái */}
          <motion.img 
            src="/assets/blue-flower.png" 
            decoding="async"
            alt="Blue Glass Hibiscus Flower" 
            className="visual-layer layer-blue-flower"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.0, delay: reducedMotion ? 0 : 0.5 }}
            style={{
              transform: flowerTransform
            }}
          />

          {/* Lớp 5: Hoa hồng hổ phách ôm sát vạt áo bên phải */}
          <motion.img 
            src="/assets/amber-rose.png" 
            decoding="async"
            alt="Amber Crystal Rose" 
            className="visual-layer layer-amber-rose"
            initial={reducedMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reducedMotion ? 0 : 1.0, delay: reducedMotion ? 0 : 0.55 }}
            style={{
              transform: flowerTransform
            }}
          />
        </div>

        {/* Tiêu đề góc phải */}
        <div className="hero-text-right">
          <motion.h2 
            className="title-freedom"
            initial={reducedMotion ? false : { opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.8, delay: reducedMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            FREEDOM
          </motion.h2>
          
          <motion.h3 
            className="title-designer"
            initial={reducedMotion ? false : { opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, delay: reducedMotion ? 0 : 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            DESIGNER
          </motion.h3>
        </div>

        {/* Dải Marquee Chữ Chạy Vô Tận */}
        <motion.div 
          className="marquee-bar"
          initial={reducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: reducedMotion ? 0 : 1, delay: reducedMotion ? 0 : 0.7 }}
        >
          <div className="marquee-inner">
            <span className="marquee-item">! The idea becomes visual ! !&nbsp;&nbsp;</span>
            <span className="marquee-item">! The idea becomes visual ! !&nbsp;&nbsp;</span>
            <span className="marquee-item">! The idea becomes visual ! !&nbsp;&nbsp;</span>
            <span className="marquee-item">! The idea becomes visual ! !&nbsp;&nbsp;</span>
            <span className="marquee-item">! The idea becomes visual ! !&nbsp;&nbsp;</span>
            <span className="marquee-item">! The idea becomes visual ! !&nbsp;&nbsp;</span>
          </div>
        </motion.div>
      </section>

      {/* ================= PRODUCT SECTION ================= */}
      <section className="product-section" id="product">
        <motion.div 
          className="product-title-group"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="product-main-title">PRODUCT</h2>
          <p className="product-sub-title">SẢN PHẨM</p>
        </motion.div>

        {/* Danh sách thẻ dạng Folder với Motion */}
        <div className="folder-grid">
          {folderProjects.map((project, index) => (
            <motion.button
              key={project.id} 
              className="folder-card-wrapper"
              type="button"
              onPointerEnter={() => warmProjectRoute(project.id)}
              onFocus={() => warmProjectRoute(project.id)}
              onTouchStart={() => warmProjectRoute(project.id)}
              onClick={() => {
                if (project.id === 'poster') openPosterProject()
                else if (project.id === 'logo') openLogoProject()
                else if (project.id === '3d') open3DProject()
                else setSelectedProject(project)
              }}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -8 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Lớp folder tab phía sau: Tab cao bên trái và vai thấp bên phải */}
              <div className="folder-back-layer">
                <svg 
                  className="folder-back-svg" 
                  viewBox="0 0 260 220" 
                  fill="none" 
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <path 
                    d="M 0,220 L 0,20 A 20,20 0 0,1 20,0 L 88,0 C 98,0 102,3 105,7 C 108,11 112,15 120,15 L 242,15 A 18,18 0 0,1 260,33 L 260,202 A 18,18 0 0,1 242,220 L 20,220 A 20,20 0 0,1 0,200 Z" 
                    fill="#F1E7DD"
                  />
                </svg>
              </div>

              {/* Lớp thân thẻ phía trước: Màu kem sáng bo tròn 4 góc 18px */}
              <div className="folder-front-card">
                <h3 className="folder-heading">{project.title}</h3>
                <p className="folder-vietnamese">{project.vietnamese}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Modal chi tiết khi bấm vào Folder Card */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            className="project-modal-backdrop" 
            onClick={() => setSelectedProject(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="project-modal-card" 
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <button 
                className="modal-close" 
                onClick={() => setSelectedProject(null)}
              >
                ✕
              </button>
              {selectedProject.id === 'branding' ? (
                <>
                  <span className="folder-tag">BRANDING PROJECTS • 2026</span>
                  <h3 className="modal-title branding-picker-title">CHỌN DỰ ÁN</h3>
                  <p className="branding-picker-copy">Hai bộ nhận diện, hai thế giới thương hiệu khác nhau.</p>
                  <div className="branding-project-grid">
                    <BrandingProjectCard
                      className="is-art-clown"
                      image="/assets/art-clown/source/logo-white.svg"
                      imageAlt="Art Clown"
                      name="ART CLOWN"
                      tagline="PLAY · CREATE · BELONG"
                      index="01"
                      onClick={openArtClownProject}
                    />
                    <BrandingProjectCard
                      className="is-eko"
                      image="/assets/eko/logo.svg"
                      imageAlt="EKO"
                      name="EKO"
                      tagline="CLEAN EARTH · BRIGHT FUTURE"
                      index="02"
                      onClick={openEkoProject}
                    />
                  </div>
                </>
              ) : (
                <>
                  <span className="folder-tag">{selectedProject.tag} • {selectedProject.year}</span>
                  <h3 className="modal-title">{selectedProject.title}</h3>
                  <h4 className="modal-subtitle">{selectedProject.vietnamese}</h4>
                  <p className="modal-content">{selectedProject.description}</p>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
