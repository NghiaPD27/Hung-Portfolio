import { motion, useReducedMotion } from 'framer-motion'
import { A11y, Keyboard, Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import './ArtClownProject.css'

const ASSET = '/assets/art-clown/source'

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

function ArtClownTitle({ reducedMotion }) {
  const echoTransition = reducedMotion
    ? { duration: 0 }
    : {
        duration: 4.8,
        times: [0, 0.2917, 0.5, 0.7917, 1],
        ease: ['linear', 'easeOut', 'linear', 'easeOut'],
        repeat: Infinity,
      }

  return (
    <h1 id="art-clown-title" className="art-hero-title" aria-label="ART CLOWN">
      <span className="art-title-main" aria-hidden="true">ART CLOWN</span>
      <motion.span
        className="art-title-echo"
        aria-hidden="true"
        initial={false}
        animate={reducedMotion ? { opacity: 0, y: 0 } : { opacity: [0, 0, 0.63, 0.63, 0], y: ['0cqw', '0cqw', '3.056cqw', '3.056cqw', '0cqw'] }}
        transition={echoTransition}
      >
        ART CLOWN
      </motion.span>
      <motion.span
        className="art-title-echo"
        aria-hidden="true"
        initial={false}
        animate={reducedMotion ? { opacity: 0, y: 0 } : { opacity: [0, 0, 0.63, 0.63, 0], y: ['0cqw', '0cqw', '4.792cqw', '4.792cqw', '0cqw'] }}
        transition={echoTransition}
      >
        ART CLOWN
      </motion.span>
    </h1>
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

const logos = [
  { card: 'white', src: 'logo-black.svg', label: 'Art Clown logo màu đen' },
  { card: 'black', src: 'logo-white.svg', label: 'Art Clown logo màu trắng' },
  { card: 'red', src: 'logo-red.svg', label: 'Art Clown logo màu kem' },
  { card: 'cream', src: 'logo-cream.svg', label: 'Art Clown logo màu đỏ' },
]

const mascots = ['mascot-1.png', 'mascot-2.png', 'mascot-3.png', 'mascot-4.png']
const socialPosts = ['social-1.png', 'social-2.png', 'social-3.png', 'social-4.png']
const stationary = ['stationary-1.png', 'stationary-2.png', 'stationary-3.png', 'stationary-4.png']

export default function ArtClownProject({ onBack }) {
  const reducedMotion = useReducedMotion()

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
        mousewheel={{
          forceToAxis: true,
          releaseOnEdges: false,
          sensitivity: 1,
          thresholdDelta: 12,
          thresholdTime: 800,
        }}
        keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: true }}
        pagination={{ clickable: true }}
        a11y={{
          enabled: true,
          prevSlideMessage: 'Màn trước',
          nextSlideMessage: 'Màn tiếp theo',
          paginationBulletMessage: 'Đi đến màn {{index}}',
        }}
      >
        <SwiperSlide tag="section" aria-label="Màn 1 trên 7: Hero Art Clown">
          <div className="art-slide-frame art-slide-frame-burgundy art-slide-frame-hero">
            <section className="art-design-canvas art-hero" aria-labelledby="art-clown-title">
            <img className="art-hero-sky" src={`${ASSET}/hero-sky.png`} alt="" />
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
            <img className="art-hero-tent" src={`${ASSET}/hero-tent.png`} alt="Rạp xiếc Art Clown" />
            <ArtClownTitle reducedMotion={reducedMotion} />
            </section>
          </div>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 2 trên 7: Giá trị thương hiệu">
          <div className="art-slide-frame art-slide-frame-cream">
            <section className="art-design-canvas art-values" aria-label="Giá trị thương hiệu Art Clown">
              {brandValues.map((value) => (
                <div
                  className={`art-value ${value.className}`}
                  key={value.className}
                  tabIndex={0}
                  aria-label={`${value.label || value.title}. ${value.description}`}
                >
                  <p className="art-value-title">{value.title}</p>
                  <p className="art-value-description">{value.description}</p>
                </div>
              ))}
              <img className="art-balloons" src={`${ASSET}/balloons.png`} alt="Chùm bóng bay đỏ" />
            </section>
          </div>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 3 trên 7: Hệ thống nhận diện">
          <div className="art-slide-frame art-slide-frame-burgundy art-slide-frame-brand">
            <section className="art-design-canvas art-brand-system" aria-label="Hệ thống nhận diện Art Clown">
            <div className="art-uniform-wrap">
              <img src={`${ASSET}/uniform.png`} alt="Đồng phục Art Clown" loading="lazy" />
            </div>
            <div className="art-marquee" aria-label="Welcome to Art Clown">
              <div className="art-marquee-track">
                <span>WELCOM TO ARTCLOWN</span><span>WELCOM TO ARTCLOWN</span><span>WELCOM TO ARTCLOWN</span><span>WELCOM TO ARTCLOWN</span>
              </div>
            </div>
            <div className="art-logo-grid">
              {logos.map((logo) => (
                <div className={`art-logo-card art-logo-${logo.card}`} key={logo.card}>
                  <img src={`${ASSET}/${logo.src}`} alt={logo.label} loading="lazy" />
                </div>
              ))}
            </div>
            <div className="art-mascot-panel">
              <h2>MASCOT ARTCLOWN</h2>
              <div className="art-mascot-row">
                {mascots.map((src, index) => (
                  <img key={src} src={`${ASSET}/${src}`} alt={`Mascot Art Clown dáng ${index + 1}`} loading="lazy" />
                ))}
              </div>
            </div>
            </section>
          </div>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 4 trên 7: Logo Applications">
          <div className="art-slide-frame art-slide-frame-cream">
            <section className="art-design-canvas art-logo-applications-screen" aria-label="Ứng dụng logo Art Clown">
              <div className="art-product-image-card">
                <img src={`${ASSET}/logo-applications.png`} alt="Các ứng dụng logo Art Clown" loading="lazy" />
              </div>
            </section>
          </div>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 5 trên 7: Social">
          <div className="art-slide-frame art-slide-frame-burgundy">
            <section className="art-design-canvas art-social" aria-labelledby="art-social-title">
              <h2 id="art-social-title">SOCIAL</h2>
              <div className="art-social-grid">
                {socialPosts.map((src, index) => (
                  <div className="art-media-card" key={src}>
                    <img src={`${ASSET}/${src}`} alt={`Thiết kế social Art Clown ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 6 trên 7: Billboard">
          <div className="art-slide-frame art-slide-frame-burgundy">
            <section className="art-design-canvas art-billboard-screen" aria-label="Billboard Art Clown">
              <div className="art-billboard art-media-card">
                <img src={`${ASSET}/billboard.png`} alt="Billboard Art Clown" loading="lazy" />
              </div>
            </section>
          </div>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 7 trên 7: Stationary">
          <div className="art-slide-frame art-slide-frame-stationary">
            <section className="art-design-canvas art-stationary" aria-labelledby="stationary-title">
              <h2 id="stationary-title">STATIONARY</h2>
              <div className="art-stationary-grid">
                {stationary.map((src, index) => (
                  <div className={`art-stationary-card art-stationary-${index + 1} art-media-card`} key={src}>
                    <img src={`${ASSET}/${src}`} alt={`Ứng dụng văn phòng phẩm Art Clown ${index + 1}`} loading="lazy" />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </SwiperSlide>
      </Swiper>
    </main>
  )
}
