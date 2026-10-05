import { useEffect, useRef, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import * as Dialog from '@radix-ui/react-dialog'
import { MeshGradient } from '@paper-design/shaders-react'
import { AnimatePresence, LayoutGroup, motion, useAnimate, useInView, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import { logoCatalog, logoCategories } from './logoCatalog'
import './LogoProject.css'

function LogoArtwork({ logo, eager = false }) {
  const [x, y, width, height] = logo.bounds
  return (
    <div className="logo-artwork" style={{ aspectRatio: `${width} / ${height}`, '--logo-ratio': width / height }}>
      <img src={logo.src} alt={`Logo ${logo.name}`} loading={eager ? 'eager' : 'lazy'} decoding="async" draggable="false"
        style={{ width: `${1920 / width * 100}%`, height: `${1080 / height * 100}%`, left: `${-x / width * 100}%`, top: `${-y / height * 100}%` }} />
    </div>
  )
}

const featuredLogos = [0, 4, 7, 10, 13].map(index => logoCatalog[index])
const cardAccents = ['#d9ff32', '#ff643d', '#3764ff', '#ffcc33']

function LogoOrbit({ running, reducedMotion }) {
  const [scope, animate] = useAnimate()
  const playback = useRef(null)
  useEffect(() => {
    if (reducedMotion) return
    const controls = animate(scope.current, { rotate: [0, 360] }, { duration: 24, repeat: Infinity, ease: 'linear' })
    controls.pause()
    playback.current = controls
    return () => { controls.stop(); playback.current = null }
  }, [animate, scope, reducedMotion])
  useEffect(() => {
    if (running) playback.current?.play()
    else playback.current?.pause()
  }, [running, reducedMotion])
  return <div ref={scope} className="logo-showcase-orbit" aria-hidden="true"><i /><i /></div>
}

function LogoShowcase({ reducedMotion, paused }) {
  const ref = useRef(null)
  const inView = useInView(ref, { amount: .3 })
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [visible, setVisible] = useState(() => !document.hidden)
  const running = playing && inView && visible && !hovered && !focused && !paused && !reducedMotion
  const orbitRunning = playing && inView && visible && !paused && !reducedMotion
  const logo = featuredLogos[index]

  useEffect(() => {
    const update = () => setVisible(!document.hidden)
    document.addEventListener('visibilitychange', update)
    return () => document.removeEventListener('visibilitychange', update)
  }, [])

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => setIndex(current => (current + 1) % featuredLogos.length), 4200)
    return () => window.clearInterval(timer)
  }, [running])

  const change = direction => {
    setPlaying(false)
    setIndex(current => (current + direction + featuredLogos.length) % featuredLogos.length)
  }

  return (
    <div ref={ref} className="logo-showcase" onPointerEnter={event => { if (event.pointerType === 'mouse') setHovered(true) }} onPointerLeave={() => setHovered(false)} onFocusCapture={() => setFocused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false) }}>
      <div className="logo-showcase-label"><span>MARK IN MOTION</span><span>{String(index + 1).padStart(2, '0')} / {String(featuredLogos.length).padStart(2, '0')}</span></div>
      <motion.div className="logo-showcase-board" animate={{ backgroundColor: logo.background, color: logo.color }} transition={{ duration: reducedMotion ? 0 : .5 }}>
        <span className="logo-register logo-register--tl" aria-hidden="true">+</span><span className="logo-register logo-register--tr" aria-hidden="true">+</span>
        <span className="logo-register logo-register--bl" aria-hidden="true">+</span><span className="logo-register logo-register--br" aria-hidden="true">+</span>
        <LogoOrbit running={orbitRunning} reducedMotion={reducedMotion} />
        <AnimatePresence initial={false}>
          <motion.div className="logo-showcase-art" key={logo.id} style={{ x: '-50%', y: '-50%' }} initial={reducedMotion ? false : { opacity: 0, rotate: -8, scale: .75, clipPath: 'inset(0 100% 0 0)' }} animate={{ opacity: 1, rotate: 0, scale: 1, clipPath: 'inset(0 0% 0 0)' }} exit={reducedMotion ? { opacity: 0 } : { opacity: 0, rotate: 6, scale: .9 }} transition={{ duration: reducedMotion ? 0 : .6, ease: [.22, 1, .36, 1] }}><LogoArtwork logo={logo} eager /></motion.div>
        </AnimatePresence>
        <span className="logo-showcase-coordinate" aria-hidden="true">X / 50 &nbsp; Y / 50</span>
      </motion.div>
      <div className="logo-showcase-caption"><strong>{logo.name}</strong><div className="logo-showcase-controls">
        <button type="button" aria-label="Logo nổi bật trước" onClick={() => change(-1)}>←</button>
        {!reducedMotion && <button type="button" aria-label={playing ? 'Tạm dừng chuyển logo nổi bật' : 'Tự động chuyển logo nổi bật'} aria-pressed={playing} onClick={() => { setPlaying(current => !current); setFocused(false); setHovered(false) }}>{playing ? 'Ⅱ' : '▷'}</button>}
        <button type="button" aria-label="Logo nổi bật tiếp theo" onClick={() => change(1)}>→</button>
      </div></div>
    </div>
  )
}

function LogoCard({ logo, index, onSelect, reducedMotion }) {
  const x = useMotionValue(50), y = useMotionValue(50)
  const guideX = useSpring(x, { stiffness: 220, damping: 28 })
  const guideY = useSpring(y, { stiffness: 220, damping: 28 })
  const artX = useTransform(guideX, [0, 100], [-7, 7])
  const artY = useTransform(guideY, [0, 100], [-7, 7])
  const left = useTransform(guideX, value => `${value}%`)
  const top = useTransform(guideY, value => `${value}%`)
  const reset = () => { x.set(50); y.set(50) }
  const track = event => {
    if (reducedMotion || event.pointerType !== 'mouse') return
    const stage = event.currentTarget.querySelector('.logo-card-stage').getBoundingClientRect()
    x.set(Math.max(8, Math.min(92, (event.clientX - stage.left) / stage.width * 100)))
    y.set(Math.max(8, Math.min(92, (event.clientY - stage.top) / stage.height * 100)))
  }
  return (
    <motion.div className="logo-card-entry" initial={reducedMotion ? false : { opacity: 0, y: 48, rotate: index % 2 ? 2 : -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .65, delay: index % 3 * .07, ease: [.22, 1, .36, 1] }}>
      <Dialog.Trigger asChild>
        <motion.button type="button" className={`logo-card logo-card--${logo.shape}`} style={{ '--logo-panel': logo.background, '--logo-ink': logo.color, '--logo-accent': cardAccents[index % cardAccents.length] }} whileHover={reducedMotion ? undefined : { y: -9, rotate: index % 2 ? 1 : -1 }} whileTap={reducedMotion ? undefined : { scale: .985 }}
          aria-label={`Xem logo ${logo.name}`} onClick={onSelect} onPointerMove={track} onPointerLeave={reset} onBlur={reset}>
          <span className="logo-card-top"><span>IDENTITY / {logo.number}</span><span>{logo.category}</span></span>
          <span className="logo-card-stage">
            <motion.span className="logo-card-guide logo-card-guide--x" style={{ left }} aria-hidden="true" /><motion.span className="logo-card-guide logo-card-guide--y" style={{ top }} aria-hidden="true" />
            <motion.span className="logo-card-art" style={reducedMotion ? undefined : { x: artX, y: artY }}><LogoArtwork logo={logo} eager={index < 3} /></motion.span>
            <span className="logo-card-view" aria-hidden="true">XEM LOGO ↗</span>
          </span>
          <span className="logo-card-bottom"><span><strong>{logo.name}</strong><small>{logo.subtitle}</small></span><span className="logo-card-arrow" aria-hidden="true">↗</span></span>
        </motion.button>
      </Dialog.Trigger>
    </motion.div>
  )
}

export default function LogoProject({ onBack, onDetailOpenChange }) {
  const reducedMotion = useReducedMotion()
  const [compactShader, setCompactShader] = useState(() => window.matchMedia('(max-width: 700px)').matches)
  const introRef = useRef(null)
  const { scrollYProgress } = useScroll({ trackContentSize: true })
  const { scrollYProgress: introProgress } = useScroll({ target: introRef, offset: ['start start', 'end start'] })
  const titleX = useTransform(introProgress, [0, 1], [0, -42])
  const outlineX = useTransform(introProgress, [0, 1], [0, 65])
  const starRotate = useTransform(introProgress, [0, 1], [0, 200])
  const [category, setCategory] = useState('Tất cả')
  const [activeIndex, setActiveIndex] = useState(null)
  const originRef = useRef(null)
  const filtered = logoCatalog.filter(logo => category === 'Tất cả' || logo.category === category)
  const active = activeIndex === null ? null : filtered[activeIndex]
  const changeDetail = open => {
    if (!open) setActiveIndex(null)
    onDetailOpenChange(open)
  }
  const move = direction => setActiveIndex(index => (index + direction + filtered.length) % filtered.length)

  useEffect(() => {
    const media = window.matchMedia('(max-width: 700px)')
    const update = () => setCompactShader(media.matches)
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return (
    <main className="logo-project">
      <div className="logo-atmosphere" aria-hidden="true">
        <MeshGradient
          width="100%"
          height="100%"
          colors={['#1728a8', '#3764ff', '#111629', '#d9ff32', '#ff643d']}
          distortion={0.7}
          swirl={0.32}
          grainOverlay={0.12}
          speed={reducedMotion || compactShader ? 0 : 0.12}
          maxPixelCount={compactShader ? 240000 : 600000}
        />
      </div>
      <div className="logo-topbar">
        <button className="logo-back" type="button" onClick={onBack} aria-label="Quay lại danh mục sản phẩm">← <span>WORKS</span></button>
        <span className="logo-topbar-label">HÙNG TRƯƠNG / VISUAL DESIGN</span>
        <motion.span className="logo-reading-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      </div>
      <header className="logo-intro" ref={introRef}>
        <motion.div className="logo-intro-main" initial={reducedMotion ? false : { y: 28 }} animate={{ y: 0 }} transition={{ duration: .65 }}>
          <p className="logo-eyebrow"><span className="logo-dot" /> VISUAL IDENTITY ARCHIVE / {String(logoCatalog.length).padStart(2, '0')} MARKS</p>
          <h1 aria-label="LOGO INDEX.">
            <motion.span className="logo-title-line" style={reducedMotion ? undefined : { x: titleX }} aria-hidden="true"><span className="logo-title-word">{'LOGO'.split('').map((letter, index) => <motion.span key={index} initial={reducedMotion ? false : { y: '110%', rotate: 8 }} animate={{ y: 0, rotate: 0 }} transition={{ duration: .8, delay: .08 * index, ease: [.22, 1, .36, 1] }}>{letter}</motion.span>)}</span><motion.span className="logo-title-star" style={reducedMotion ? undefined : { rotate: starRotate }}>✳</motion.span></motion.span>
            <motion.span className="logo-title-line logo-title-outline" style={reducedMotion ? undefined : { x: outlineX }} aria-hidden="true">INDEX.</motion.span>
          </h1>
          <p className="logo-intro-micro"><span>FORM / TYPE / IDENTITY</span><span>EST. 2026 &nbsp; ↘</span></p>
        </motion.div>
        <LogoShowcase reducedMotion={reducedMotion} paused={active !== null} />
        <div className="logo-intro-note">
          <motion.span className="logo-edition" initial={reducedMotion ? false : { rotate: 8, scale: .7, opacity: 0 }} animate={{ rotate: -5, scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 180, damping: 14, delay: .35 }}>SIGNAL<br />NOISE<br />IDENTITY</motion.span>
          <p>Mỗi dấu hiệu,<br />một bản sắc riêng.</p>
          <a href="#logo-gallery" className="logo-explore" onClick={event => { event.preventDefault(); document.getElementById('logo-gallery')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }) }}>KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true">↙</span></a>
        </div>
      </header>

      <div className="logo-ticker" aria-hidden="true">
        <motion.div className="logo-ticker-track" animate={reducedMotion ? undefined : { x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>
          {Array.from({ length: 4 }, (_, index) => <span key={index}>IDEAS INTO ICONS <b>✳</b> FORM FOLLOWS FEELING <b>✳</b> {String(logoCatalog.length).padStart(2, '0')} DISTINCT MARKS <b>✳</b></span>)}
        </motion.div>
      </div>

      <section id="logo-gallery" className="logo-gallery" aria-label="Bộ sưu tập logo">
        <div className="logo-gallery-heading"><span>THE COLLECTION / {String(logoCatalog.length).padStart(2, '0')}</span><h2>MAKE A <em>MARK.</em></h2><p>Không chỉ để nhận ra.<br />Để được nhớ đến.</p></div>
        <div className="logo-gallery-toolbar">
          <div className="logo-filters" role="group" aria-label="Lọc logo theo lĩnh vực">
            <LayoutGroup id="logo-filter-pill">{logoCategories.map(item => <motion.button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)} whileTap={reducedMotion ? undefined : { scale: .95 }}>{category === item && <motion.span className="logo-filter-active" layoutId={reducedMotion ? undefined : 'logo-filter-active'} transition={{ type: 'spring', stiffness: 360, damping: 32 }} />}<span className="logo-filter-label">{item}</span></motion.button>)}</LayoutGroup>
          </div>
          <span className="logo-gallery-count">{String(filtered.length).padStart(2, '0')} / {String(logoCatalog.length).padStart(2, '0')}</span>
        </div>
        <Dialog.Root open={active !== null} onOpenChange={changeDetail}>
          <motion.div className="logo-gallery-grid" key={category} style={{ maxWidth: filtered.length === 1 ? 520 : filtered.length === 2 ? 1060 : undefined }} initial={reducedMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 650: Math.min(2, filtered.length), 1080: Math.min(3, filtered.length) }} gutterBreakPoints={{ 0: '16px', 650: '20px', 1080: '24px' }}>
            <Masonry sequential>
              {filtered.map((logo, index) => (
                <LogoCard key={logo.id} logo={logo} index={index} reducedMotion={reducedMotion} onSelect={event => { originRef.current = event.currentTarget; setActiveIndex(index) }} />
              ))}
            </Masonry>
          </ResponsiveMasonry>
          </motion.div>
          <Dialog.Portal>
            <Dialog.Overlay className="logo-dialog-overlay" />
            <Dialog.Content className="logo-dialog" onCloseAutoFocus={event => { event.preventDefault(); originRef.current?.focus({ preventScroll: true }) }}
              onKeyDown={event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { event.preventDefault(); move(event.key === 'ArrowRight' ? 1 : -1) } }}>
              {active && <>
                <div className="logo-dialog-head"><span>IDENTITY / {active.number}</span><Dialog.Close className="logo-dialog-close" aria-label="Đóng xem logo">ĐÓNG <span aria-hidden="true">×</span></Dialog.Close></div>
                <Dialog.Description className="logo-sr-only">Logo gốc {active.name}. Dùng nút trước, tiếp hoặc phím mũi tên để xem logo khác; Escape để đóng.</Dialog.Description>
                <div className="logo-detail-stage" style={{ background: active.background }}>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div className="logo-detail-art" key={active.id} initial={{ opacity: reducedMotion ? 1 : 0, scale: reducedMotion ? 1 : .92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: reducedMotion ? 1 : 0 }} transition={{ duration: reducedMotion ? 0 : .2 }}><LogoArtwork logo={active} eager /></motion.div>
                  </AnimatePresence>
                </div>
                <div className="logo-detail-caption"><div><Dialog.Title>{active.name}</Dialog.Title><p>{active.subtitle} / {active.category}</p></div><span>{String(activeIndex + 1).padStart(2, '0')} / {String(filtered.length).padStart(2, '0')}</span></div>
                <div className="logo-detail-controls"><button type="button" aria-label="Logo trước" disabled={filtered.length < 2} onClick={() => move(-1)}>← <span>TRƯỚC</span></button><span className="logo-detail-hint">MỖI DẤU HIỆU, MỘT BẢN SẮC</span><button type="button" aria-label="Logo tiếp theo" disabled={filtered.length < 2} onClick={() => move(1)}><span>TIẾP</span> →</button></div>
              </>}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      <footer className="logo-footer"><span>END OF INDEX / {String(logoCatalog.length).padStart(2, '0')} MARKS</span><p>Một dấu hiệu nhỏ.<br /><em>Một ấn tượng lớn.</em></p><button type="button" onClick={onBack}>KHÁM PHÁ CÁC DỰ ÁN KHÁC ↗</button></footer>
    </main>
  )
}
