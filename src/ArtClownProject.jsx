import { useState, useCallback } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { A11y, Keyboard, Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import './ArtClownProject.css'

const ASSET = '/assets/art-clown/source'

function useImageSkeleton() {
  const [loadedKeys, setLoadedKeys] = useState(() => new Set())

  const markLoaded = useCallback((key) => {
    setLoadedKeys((prev) => {
      if (prev.has(key)) return prev
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])

  const registerRef = useCallback((key) => (element) => {
    if (element && element.complete && element.naturalWidth > 0) {
      setLoadedKeys((prev) => {
        if (prev.has(key)) return prev
        const next = new Set(prev)
        next.add(key)
        return next
      })
    }
  }, [])

  const isLoaded = useCallback((key) => loadedKeys.has(key), [loadedKeys])

  return { isLoaded, markLoaded, registerRef }
}

const burstTransitions = {
  side: {
    opacity: { duration: 4, times: [0, 0.405, 0.4475, 0.8625, 0.95, 1], ease: ['linear', 'easeOut', 'linear', 'easeInOut', 'linear'], repeat: Infinity },
    scaleX: { duration: 4, times: [0, 0.405, 0.4425, 0.5375, 0.8625, 0.95, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
    scaleY: { duration: 4, times: [0, 0.405, 0.4425, 0.5375, 0.8625, 0.95, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
  },
  middle: {
    opacity: { duration: 4, times: [0, 0.3425, 0.385, 0.5875, 0.6625, 1], ease: ['linear', 'easeOut', 'linear', 'easeInOut', 'linear'], repeat: Infinity },
    scaleX: { duration: 4, times: [0, 0.3425, 0.38, 0.475, 0.5875, 0.6625, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
    scaleY: { duration: 4, times: [0, 0.3425, 0.38, 0.475, 0.5875, 0.6625, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
  },
}

const glowTransitions = {
  middle: {
    opacity: { duration: 4, times: [0, 0.305, 0.35, 0.395, 0.5125, 1], ease: ['linear', 'easeOut', 'easeInOut', 'easeIn', 'linear'], repeat: Infinity },
    scaleX: { duration: 4, times: [0, 0.305, 0.35, 0.395, 0.5125, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', [0.5, 0, 0.5, 1]], repeat: Infinity },
    scaleY: { duration: 4, times: [0, 0.305, 0.35, 0.395, 0.5125, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', [0.5, 0, 0.5, 1]], repeat: Infinity },
  },
  side: {
    opacity: { duration: 4, times: [0, 0.3675, 0.4125, 0.4575, 0.575, 1], ease: ['linear', 'easeOut', 'easeInOut', 'easeIn', 'linear'], repeat: Infinity },
    scaleX: { duration: 4, times: [0, 0.3675, 0.4125, 0.4575, 0.575, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', [0.5, 0, 0.5, 1]], repeat: Infinity },
    scaleY: { duration: 4, times: [0, 0.3675, 0.4125, 0.4575, 0.575, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', [0.5, 0, 0.5, 1]], repeat: Infinity },
  },
}

const sparkTransitions = {
  middle: {
    opacity: { duration: 4, times: [0, 0.025, 0.04, 0.34, 0.3675, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'], repeat: Infinity },
    scaleX: { duration: 4, times: [0, 0.025, 0.07, 0.35, 0.3675, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
    scaleY: { duration: 4, times: [0, 0.025, 0.07, 0.35, 0.3675, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
    y: { duration: 4, times: [0, 0.025, 0.35, 0.3675, 1], ease: ['linear', 'easeIn', 'easeOut', 'linear'], repeat: Infinity },
  },
  side: {
    opacity: { duration: 4, times: [0, 0.0875, 0.1025, 0.4025, 0.43, 1], ease: ['linear', 'easeOut', 'linear', 'easeIn', 'linear'], repeat: Infinity },
    scaleX: { duration: 4, times: [0, 0.0875, 0.1325, 0.4125, 0.43, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
    scaleY: { duration: 4, times: [0, 0.0875, 0.1325, 0.4125, 0.43, 1], ease: ['linear', 'easeOut', 'easeOut', 'easeIn', 'linear'], repeat: Infinity },
    y: { duration: 4, times: [0, 0.0875, 0.4125, 0.43, 1], ease: ['linear', 'easeIn', 'easeOut', 'linear'], repeat: Infinity },
  },
}

const burstAnimate = {
  opacity: [0, 0, 1, 1, 0, 0],
  scaleX: [0.12, 0.12, 0.48, 1, 1.08, 1.12, 0.12],
  scaleY: [0.12, 0.12, 0.48, 1, 1.08, 1.12, 0.12],
}

const glowAnimate = {
  opacity: [0, 0, 0.9, 0.55, 0, 0],
  scaleX: [0.25, 0.25, 1.15, 1.65, 2.1, 0.25],
  scaleY: [0.25, 0.25, 1.15, 1.65, 2.1, 0.25],
}

const sparkAnimate = {
  opacity: [0, 0, 1, 1, 0, 0],
  scaleX: [0.55, 0.55, 1, 1.45, 0.4, 0.55],
  scaleY: [0.55, 0.55, 1, 1.45, 0.4, 0.55],
  y: ['14.583cqw', '14.583cqw', '0cqw', '-0.417cqw', '14.583cqw'],
}

function Firework({ className, src, timing, reducedMotion }) {
  return (
    <motion.div
      className={`art-firework ${className}`}
      initial={reducedMotion ? false : { opacity: 0, scaleX: 0.12, scaleY: 0.12 }}
      animate={reducedMotion ? { opacity: 1, scaleX: 1, scaleY: 1 } : burstAnimate}
      transition={reducedMotion ? { duration: 0 } : burstTransitions[timing]}
    >
      <img src={`${ASSET}/${src}`} alt="" />
    </motion.div>
  )
}

function PeakGlow({ className, src, timing, reducedMotion }) {
  return (
    <motion.div
      className={`art-peak-glow ${className}`}
      initial={reducedMotion ? false : { opacity: 0, scaleX: 0.25, scaleY: 0.25 }}
      animate={reducedMotion ? { opacity: 0.7, scaleX: 1, scaleY: 1 } : glowAnimate}
      transition={reducedMotion ? { duration: 0 } : glowTransitions[timing]}
    >
      <img src={`${ASSET}/${src}`} alt="" />
    </motion.div>
  )
}

function LaunchSpark({ className, src, timing, reducedMotion }) {
  return (
    <motion.div
      className={`art-launch-spark ${className}`}
      initial={reducedMotion ? false : { opacity: 0, scaleX: 0.55, scaleY: 0.55, y: '14.583cqw' }}
      animate={reducedMotion ? { opacity: 1, scaleX: 1, scaleY: 1, y: 0 } : sparkAnimate}
      transition={reducedMotion ? { duration: 0 } : sparkTransitions[timing]}
    >
      <img src={`${ASSET}/${src}`} alt="" />
    </motion.div>
  )
}

function ArtClownTitle() {
  return (
    <h1 id="art-clown-title" className="art-hero-title" aria-label="ART CLOWN">
      <span className="art-title-main" aria-hidden="true">ART CLOWN</span>
      {['near', 'far'].map((layer) => (
        <span
          className={`art-title-echo art-title-echo-${layer}`}
          aria-hidden="true"
          key={layer}
        >
          ART CLOWN
        </span>
      ))}
    </h1>
  )
}

function ValuesWordmark({ reducedMotion }) {
  return (
    <motion.div
      className="art-values-wordmark"
      aria-hidden="true"
      initial={reducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ amount: 0.55 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
    >
      <span className="art-values-wordmark-art">ART</span>
      <span className="art-values-wordmark-clown">CLOWN</span>
    </motion.div>
  )
}

const brandValues = [
  {
    className: 'art-value-one',
    title: 'Cảm Xúc Thăng Hoa',
    description: 'Những hành động ngốc nghếch, dáng đi lẩn thẩn của chú hề xưa sẽ mang đến tiếng cười đầy cảm xúc, sống lại trong tương lai.',
  },
  {
    className: 'art-value-two',
    title: <>Trân trọng<br />cảm xúc con người</>,
    label: 'Trân trọng cảm xúc con người',
    description: 'Art Clown tạo không gian vui nhộn, gắn kết cộng đồng và đưa mọi người đến gần hơn với nghề chú hề.',
  },
  {
    className: 'art-value-three',
    title: 'Xây Dựng Đam Mê',
    description: 'Art Clown ra đời để mang lại niềm vui tuổi thơ và không gian giải trí cho mọi thế hệ, từ Gen Z, ông bà, cô chú đến các em nhỏ — những người yêu thích rạp xiếc và chú hề.',
  },
]

const campaignPosters = ['campaign-1.png', 'campaign-2.png', 'campaign-3.png', 'campaign-4.png']
const stationary = ['stationary-new-1.png', 'stationary-new-2.png', 'stationary-new-3.png']

function SlideFrame({ className = '', children }) {
  return <div className={`art-slide-frame ${className}`}>{children}</div>
}

export default function ArtClownProject({ onBack }) {
  const reducedMotion = useReducedMotion()
  const [openValue, setOpenValue] = useState(null)
  const { isLoaded, markLoaded, registerRef } = useImageSkeleton()

  return (
    <main className="art-clown-project" aria-label="Art Clown branding project">
      <button className="art-clown-back" onClick={onBack} type="button" aria-label="Quay về trang portfolio">
        <img src={`${ASSET}/back.svg`} alt="" />
      </button>

      <Swiper
        className="art-clown-swiper"
        modules={[Mousewheel, Keyboard, Pagination, A11y]}
        direction="vertical"
        slidesPerView={1}
        speed={reducedMotion ? 0 : 800}
        preventInteractionOnTransition
        mousewheel={{ forceToAxis: true, releaseOnEdges: false, sensitivity: 1, thresholdDelta: 12, thresholdTime: 800 }}
        keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: true }}
        pagination={{ clickable: true }}
        a11y={{ enabled: true, prevSlideMessage: 'Màn trước', nextSlideMessage: 'Màn tiếp theo', paginationBulletMessage: 'Đi đến màn {{index}}' }}
      >
        <SwiperSlide tag="section" aria-label="Màn 1 trên 8: Hero Art Clown">
          <SlideFrame className="art-slide-hero">
            <section className="art-design-canvas art-hero" aria-labelledby="art-clown-title">
              <div className="art-fireworks" aria-hidden="true">
                <Firework className="art-firework-left" src="firework-gold-stars.png" timing="side" reducedMotion={reducedMotion} />
                <Firework className="art-firework-middle" src="firework-blue-orange.png" timing="middle" reducedMotion={reducedMotion} />
                <Firework className="art-firework-right" src="firework-gold-burst.png" timing="side" reducedMotion={reducedMotion} />
                <PeakGlow className="art-glow-middle" src="peak-middle.svg" timing="middle" reducedMotion={reducedMotion} />
                <PeakGlow className="art-glow-left" src="peak-left.svg" timing="side" reducedMotion={reducedMotion} />
                <PeakGlow className="art-glow-right" src="peak-right.svg" timing="side" reducedMotion={reducedMotion} />
                <LaunchSpark className="art-spark-middle" src="spark-middle.svg" timing="middle" reducedMotion={reducedMotion} />
                <LaunchSpark className="art-spark-left" src="spark-left.svg" timing="side" reducedMotion={reducedMotion} />
                <LaunchSpark className="art-spark-right" src="spark-right.svg" timing="side" reducedMotion={reducedMotion} />
              </div>
              <div className={`art-skeleton art-skeleton-hero art-hero-tent-skeleton ${isLoaded('hero-tent') ? 'is-hidden' : ''}`} aria-hidden="true" />
              <img
                ref={registerRef('hero-tent')}
                className={`art-hero-tent art-img-fade ${isLoaded('hero-tent') ? 'is-loaded' : ''}`}
                src={`${ASSET}/hero-tent.png`}
                alt="Rạp xiếc Art Clown"
                onLoad={() => markLoaded('hero-tent')}
              />
              <ArtClownTitle />
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 2 trên 8: Giá trị thương hiệu">
          <SlideFrame className="art-slide-cream">
            <section className="art-design-canvas art-values" aria-label="Giá trị thương hiệu Art Clown">
              <ValuesWordmark reducedMotion={reducedMotion} />
              {brandValues.map((value, index) => {
                const isOpen = openValue === index
                return (
                  <button
                    className={`art-value ${value.className}${isOpen ? ' is-open' : ''}`}
                    key={value.className}
                    type="button"
                    aria-expanded={isOpen}
                    aria-label={`${value.label || value.title}. ${value.description}`}
                    onClick={() => setOpenValue(isOpen ? null : index)}
                  >
                    <span className="art-value-title">{value.title}</span>
                    <span className="art-value-description">{value.description}</span>
                  </button>
                )
              })}
              <div className={`art-skeleton art-skeleton-cream art-balloons-skeleton ${isLoaded('balloons') ? 'is-hidden' : ''}`} aria-hidden="true" />
              <img
                ref={registerRef('balloons')}
                className={`art-balloons art-img-fade ${isLoaded('balloons') ? 'is-loaded' : ''}`}
                src={`${ASSET}/balloons.png`}
                alt="Chùm bóng bay đỏ"
                onLoad={() => markLoaded('balloons')}
              />
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 3 trên 8: Đồng phục và các dạng logo">
          <SlideFrame className="art-slide-white">
            <section className="art-design-canvas art-logo-system" aria-label="Đồng phục và các dạng logo Art Clown">
              <div className="art-uniform-wrap">
                <div className={`art-skeleton art-skeleton-light ${isLoaded('uniform') ? 'is-hidden' : ''}`} aria-hidden="true" />
                <img
                  ref={registerRef('uniform')}
                  src={`${ASSET}/uniform.png`}
                  alt="Đồng phục Art Clown"
                  loading="lazy"
                  onLoad={() => markLoaded('uniform')}
                  className={`art-img-fade ${isLoaded('uniform') ? 'is-loaded' : ''}`}
                />
              </div>
              <div className="art-marquee" aria-label="Welcome to Art Clown">
                <div className="art-marquee-track">
                  {[0, 1].map((group) => (
                    <div className="art-marquee-group" aria-hidden={group === 1} key={group}>
                      <span>WELCOM TO ARTCLOWN</span><span>WELCOM TO ARTCLOWN</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="art-logo-types">
                <div className="art-logo-tile art-logo-tile-black">
                  <div className={`art-skeleton art-skeleton-dark ${isLoaded('logo-black') ? 'is-hidden' : ''}`} aria-hidden="true" />
                  <img ref={registerRef('logo-black')} src={`${ASSET}/logo-on-black.svg`} alt="Logo Art Clown màu trắng trên nền đen" onLoad={() => markLoaded('logo-black')} className={`art-img-fade ${isLoaded('logo-black') ? 'is-loaded' : ''}`} />
                </div>
                <div className="art-logo-tile art-logo-tile-white">
                  <div className={`art-skeleton art-skeleton-light ${isLoaded('logo-red') ? 'is-hidden' : ''}`} aria-hidden="true" />
                  <img ref={registerRef('logo-red')} src={`${ASSET}/logo-red-standalone.svg`} alt="Logo Art Clown màu đen trên nền trắng" onLoad={() => markLoaded('logo-red')} className={`art-img-fade ${isLoaded('logo-red') ? 'is-loaded' : ''}`} />
                </div>
                <img className="art-logo-standalone" src={`${ASSET}/logo-on-white.svg`} alt="Logo Art Clown màu đỏ" />
              </div>
              <img className="art-logo-types-label" src={`${ASSET}/logo-types-label.svg`} alt="Các dạng logo" />
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 4 trên 8: Logo Applications">
          <SlideFrame className="art-slide-cream">
            <section className="art-design-canvas art-logo-applications" aria-label="Ứng dụng logo Art Clown">
              <div className="art-logo-applications-art">
                <div className={`art-skeleton art-skeleton-cream ${isLoaded('logo-applications') ? 'is-hidden' : ''}`} aria-hidden="true" />
                <img
                  ref={registerRef('logo-applications')}
                  src={`${ASSET}/logo-applications.png`}
                  alt="Các ứng dụng logo Art Clown"
                  loading="lazy"
                  onLoad={() => markLoaded('logo-applications')}
                  className={`art-img-fade ${isLoaded('logo-applications') ? 'is-loaded' : ''}`}
                />
              </div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 5 trên 8: Mascot">
          <SlideFrame className="art-slide-yellow">
            <section className="art-design-canvas art-mascot" aria-labelledby="art-mascot-title">
              <div className="art-mascot-wordmark" aria-hidden="true"><img src={`${ASSET}/mascot-wordmark-top.svg`} alt="" /><img src={`${ASSET}/mascot-wordmark-bottom.svg`} alt="" /></div>
              <h2 id="art-mascot-title">MASCOT</h2>
              <div className={`art-skeleton art-skeleton-yellow art-mascot-main-skeleton ${isLoaded('mascot-main') ? 'is-hidden' : ''}`} aria-hidden="true" />
              <img
                ref={registerRef('mascot-main')}
                className={`art-mascot-main art-hover-character art-img-fade ${isLoaded('mascot-main') ? 'is-loaded' : ''}`}
                src={`${ASSET}/mascot-main.png`}
                alt="Mascot Art Clown chính diện"
                loading="lazy"
                onLoad={() => markLoaded('mascot-main')}
              />
              {[1, 2, 3, 4].map((number) => {
                const key = `mascot-${number}`
                return (
                  <div className={`art-mascot-large art-mascot-large-${number}`} key={number}>
                    <div className={`art-skeleton art-skeleton-yellow ${isLoaded(key) ? 'is-hidden' : ''}`} aria-hidden="true" />
                    <img
                      ref={registerRef(key)}
                      className={`art-hover-character art-img-fade ${isLoaded(key) ? 'is-loaded' : ''}`}
                      src={`${ASSET}/${number === 3 ? 'mascot-3.png' : `mascot-pose-${number}.png`}`}
                      alt={`Mascot Art Clown dáng ${number}`}
                      loading="lazy"
                      onLoad={() => markLoaded(key)}
                    />
                  </div>
                )
              })}
              <div className="art-mascot-small" aria-label="Các tư thế mascot Art Clown">
                {[8, 6, 3, 5, 7].map((number) => {
                  const key = `mascot-small-${number}`
                  return (
                    <img
                      className={`art-hover-character art-img-fade ${isLoaded(key) ? 'is-loaded' : ''}`}
                      key={number}
                      ref={registerRef(key)}
                      src={`${ASSET}/mascot-pose-${number}.png`}
                      alt={`Mascot Art Clown dáng nhỏ ${number}`}
                      loading="lazy"
                      onLoad={() => markLoaded(key)}
                    />
                  )
                })}
              </div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 6 trên 8: Campaign Posters">
          <SlideFrame className="art-slide-white">
            <section className="art-design-canvas art-campaign" aria-labelledby="art-campaign-title">
              <div className="art-campaign-grid">
                {campaignPosters.map((src, index) => {
                  const key = `poster-${src}`
                  return (
                    <div className="art-media-card" key={src}>
                      <div className={`art-skeleton art-skeleton-light ${isLoaded(key) ? 'is-hidden' : ''}`} aria-hidden="true" />
                      <img
                        ref={registerRef(key)}
                        src={`${ASSET}/${src}`}
                        alt={`Campaign poster Art Clown ${index + 1}`}
                        loading="lazy"
                        onLoad={() => markLoaded(key)}
                        className={`art-img-fade ${isLoaded(key) ? 'is-loaded' : ''}`}
                      />
                    </div>
                  )
                })}
              </div>
              <h2 id="art-campaign-title"><span>CAMPAIGN</span><span>POSTERS</span></h2>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 7 trên 8: Stationary">
          <SlideFrame className="art-slide-yellow">
            <section className="art-design-canvas art-stationary" aria-labelledby="stationary-title">
              <h2 id="stationary-title">STATIONARY</h2>
              <div className="art-stationary-grid">
                {stationary.map((src, index) => {
                  const key = `stationary-${src}`
                  return (
                    <div className={`art-stationary-card art-stationary-${index + 1} art-media-card`} key={src}>
                      <div className={`art-skeleton art-skeleton-yellow ${isLoaded(key) ? 'is-hidden' : ''}`} aria-hidden="true" />
                      <img
                        ref={registerRef(key)}
                        src={`${ASSET}/${src}`}
                        alt={`Ứng dụng văn phòng phẩm Art Clown ${index + 1}`}
                        loading="lazy"
                        onLoad={() => markLoaded(key)}
                        className={`art-img-fade ${isLoaded(key) ? 'is-loaded' : ''}`}
                      />
                    </div>
                  )
                })}
              </div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 8 trên 8: Billboard">
          <SlideFrame className="art-slide-billboard">
            <section className="art-design-canvas art-billboard" aria-label="Billboard Art Clown">
              <div className={`art-skeleton art-skeleton-slate ${isLoaded('billboard') ? 'is-hidden' : ''}`} aria-hidden="true" />
              <img
                ref={registerRef('billboard')}
                src={`${ASSET}/billboard-new.png`}
                alt="Billboard Art Clown"
                loading="lazy"
                onLoad={() => markLoaded('billboard')}
                className={`art-img-fade ${isLoaded('billboard') ? 'is-loaded' : ''}`}
              />
            </section>
          </SlideFrame>
        </SwiperSlide>
      </Swiper>
    </main>
  )
}
