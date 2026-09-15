import { motion, useReducedMotion } from 'framer-motion'
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
  y: [210, 210, 0, -6, 210],
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
  const layoutScale = Math.min(window.innerWidth, 1440) / 1440
  const launchDistance = 210 * layoutScale
  const launchOvershoot = -6 * layoutScale
  const responsiveSparkAnimate = {
    ...sparkAnimate,
    y: [launchDistance, launchDistance, 0, launchOvershoot, launchDistance],
  }

  return (
    <motion.div
      className={`art-launch-spark ${className}`}
      initial={reducedMotion ? false : { opacity: 0, scaleX: 0.55, scaleY: 0.55, y: launchDistance }}
      animate={reducedMotion ? { opacity: 1, scaleX: 1, scaleY: 1, y: 0 } : responsiveSparkAnimate}
      transition={reducedMotion ? { duration: 0 } : sparkTransitions[timing]}
    >
      <img src={`${ASSET}/${src}`} alt="" />
    </motion.div>
  )
}

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
      <div className="art-clown-canvas">
        <section className="art-hero" aria-labelledby="art-clown-title">
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
          <h1 id="art-clown-title" className="art-hero-title">ART CLOWN</h1>
          <button className="art-clown-back" onClick={onBack} type="button" aria-label="Quay về trang chủ">
            <img src={`${ASSET}/back.svg`} alt="" />
          </button>
        </section>

        <section className="art-values" aria-label="Giá trị thương hiệu Art Clown">
          <p className="art-value art-value-one">Cảm Xúc Thăng Hoa</p>
          <p className="art-value art-value-two">Trân trọng<br />cảm xúc con người</p>
          <p className="art-value art-value-three">Xây Dựng Đam Mê</p>
          <img
            className="art-balloons"
            src={`${ASSET}/balloons.png`}
            alt="Chùm bóng bay đỏ"
          />
        </section>

        <section className="art-brand-system" aria-label="Hệ thống nhận diện Art Clown">
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

        <div className="art-section-gap" aria-hidden="true" />

        <section className="art-showcase" aria-label="Ứng dụng logo và mạng xã hội Art Clown">
          <div className="art-logo-applications">
            <img src={`${ASSET}/logo-applications.png`} alt="Các ứng dụng logo Art Clown" loading="lazy" />
          </div>
          <h2 className="art-social-title">SOCIAL</h2>
          <div className="art-social-grid">
            {socialPosts.map((src, index) => (
              <div className="art-media-card" key={src}>
                <img src={`${ASSET}/${src}`} alt={`Thiết kế social Art Clown ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
          <div className="art-billboard art-media-card">
            <img src={`${ASSET}/billboard.png`} alt="Billboard Art Clown" loading="lazy" />
          </div>
        </section>

        <div className="art-section-gap" aria-hidden="true" />

        <section className="art-stationary" aria-labelledby="stationary-title">
          <h2 id="stationary-title">STATIONARY</h2>
          <div className="art-stationary-grid">
            {stationary.map((src, index) => (
              <div className={`art-stationary-card art-stationary-${index + 1} art-media-card`} key={src}>
                <img src={`${ASSET}/${src}`} alt={`Ứng dụng văn phòng phẩm Art Clown ${index + 1}`} loading="lazy" />
              </div>
            ))}
          </div>
        </section>

        <footer className="art-footer" aria-label="Kết thúc dự án Art Clown" />
      </div>
    </main>
  )
}
