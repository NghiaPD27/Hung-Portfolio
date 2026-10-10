import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import BackButton from './BackButton'
import * as Dialog from '@radix-ui/react-dialog'
import { Swiper, SwiperSlide } from 'swiper/react'
import { EffectCreative, Navigation, Pagination } from 'swiper/modules'
import { ModelViewerElement } from '@google/model-viewer'
import 'swiper/css'
import 'swiper/css/effect-creative'
import 'swiper/css/pagination'
import './ThreeDProject.css'

ModelViewerElement.dracoDecoderLocation = '/assets/3d/draco/'

const asset = '/assets/3d/'
const projects = [
  {
    id: 'can', number: '01', name: 'CAN STUDY', subtitle: 'A study in metal and light',
    type: 'PRODUCT / MATERIAL', color: '#c7f45f', ink: '#171e2b', model: `${asset}models/can.glb`,
    poster: `${asset}renders/can_hero.webp`,
    images: [`${asset}renders/can_hero.webp`, `${asset}renders/01_left_three_quarter.webp`, `${asset}renders/02_right_three_quarter.webp`, `${asset}renders/03_low_rear_angle.webp`, `${asset}renders/can_lid_detail.webp`],
    description: 'Một chiếc lon quen thuộc, nhìn lại qua bề mặt nhôm, đường viền và ánh sáng xanh cobalt.',
    initialOrbit: '35deg 72deg auto',
  },
  {
    id: 'bottle', number: '02', name: 'GLASS & BOTTLE', subtitle: 'Transparency in dialogue',
    type: 'STILL LIFE / FORM', color: '#fd7965', ink: '#171e2b', model: `${asset}models/bottle.glb?glass=3`,
    poster: `${asset}renders/01_original.webp`,
    images: [`${asset}renders/01_original.webp`, `${asset}renders/02_orbit_left.webp`, `${asset}renders/03_orbit_right.webp`, `${asset}renders/04_high_angle.webp`, `${asset}renders/05_low_angle.webp`],
    description: 'Thủy tinh, sắc xanh lá và những lớp phản chiếu tạo nên một cuộc đối thoại về hình khối.',
    initialOrbit: '55deg 55deg auto',
  },
  {
    id: 'house', number: '03', name: 'MODERN HOUSE', subtitle: 'Architecture with a life inside',
    type: 'ARCHITECTURE / INTERIOR', color: '#a7c9ff', ink: '#171e2b', model: `${asset}models/house.glb`,
    poster: `${asset}renders/House_Cinematic_01_Hero_Front_Left.webp`,
    images: [
      `${asset}renders/House_Cinematic_01_Hero_Front_Left.webp`,
      `${asset}renders/House_Cinematic_02_Front_Right.webp`,
      `${asset}renders/House_Cinematic_03_Garden_Rear.webp`,
      `${asset}renders/House_Cinematic_04_Roof_Terrace.webp`,
      `${asset}renders/House_Cinematic_05_Living_Room.webp`,
      `${asset}renders/House_Cinematic_06_Dining_Room.webp`,
      `${asset}renders/House_Cinematic_07_Kitchen.webp`,
      `${asset}renders/House_Cinematic_08_West_Bedroom.webp`,
      `${asset}renders/House_Cinematic_09_East_Bedroom.webp`,
      `${asset}renders/House_Cinematic_10_Bathroom.webp`,
    ],
    description: 'Kiến trúc hiện đại không chỉ để nhìn từ bên ngoài. Phóng gần để bước vào phòng khách, bếp và phòng ngủ.',
    initialOrbit: '35deg 70deg auto',
  },
]

const houseViews = [
  { id: 'outside', label: 'TOÀN CẢNH', target: 'auto auto auto', orbit: '35deg 70deg auto' },
  { id: 'living', label: 'PHÒNG KHÁCH', target: '-0.68m 1.46m 6.48m', orbit: '46deg 81deg 1.5m' },
  { id: 'kitchen', label: 'NHÀ BẾP', target: '5.315m 1.565m 3.82m', orbit: '23deg 85deg 1.5m' },
  { id: 'bedroom', label: 'PHÒNG NGỦ', target: '4.74m 5.43m -0.43m', orbit: '33deg 80deg 1.5m' },
]

const galleryModules = [EffectCreative, Navigation, Pagination]
const galleryCreativeEffect = {
  prev: { translate: ['-105%', 0, -250], rotate: [0, 0, -5] },
  next: { translate: ['105%', 0, -250], rotate: [0, 0, 5] },
}
const galleryControls = Object.fromEntries(projects.map(project => [project.id, {
  navigation: { prevEl: `.three-d-prev-${project.id}`, nextEl: `.three-d-next-${project.id}` },
  pagination: { clickable: true, el: `.three-d-pagination-${project.id}` },
}]))

const ProjectGallery = memo(function ProjectGallery({ project, onOpen, reducedMotion }) {
  const holdTimer = useRef(null)
  const pressPoint = useRef(null)
  const cancelHold = () => {
    window.clearTimeout(holdTimer.current)
    holdTimer.current = null
    pressPoint.current = null
  }
  useEffect(() => () => window.clearTimeout(holdTimer.current), [])

  const startHold = event => {
    if (event.target.closest('button')) return
    if (event.pointerType === 'mouse' && event.button !== 0) return
    cancelHold()
    pressPoint.current = { x: event.clientX, y: event.clientY }
    holdTimer.current = window.setTimeout(() => { cancelHold(); onOpen(project) }, 420)
  }
  const moveHold = event => {
    if (!pressPoint.current) return
    if (Math.hypot(event.clientX - pressPoint.current.x, event.clientY - pressPoint.current.y) > 8) cancelHold()
  }

  return (
    <motion.article className={`three-d-project three-d-project--${project.id}`} style={{ '--object-accent': project.color, '--object-ink': project.ink }}
      initial={reducedMotion ? false : { opacity: 0, y: 65 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .12 }} transition={{ duration: .8, ease: [.2, .8, .2, 1] }}>
      <div className="three-d-project-copy">
        <span className="three-d-project-index">{project.number} / 03 <i /> {project.type}</span>
        <h2>{project.name}</h2>
        <p className="three-d-project-subtitle">{project.subtitle}</p>
        <p className="three-d-project-description">{project.description}</p>
        <button type="button" onClick={() => onOpen(project)} className="three-d-open">KHÁM PHÁ MÔ HÌNH <span aria-hidden="true">↗</span></button>
        <span className="three-d-project-gesture">GIỮ ẢNH ĐỂ MỞ 3D &nbsp; / &nbsp; KÉO ĐỂ XEM THÊM</span>
      </div>
      <div className="three-d-gallery" onPointerDown={startHold} onPointerMove={moveHold} onPointerUp={cancelHold} onPointerCancel={cancelHold} onPointerLeave={cancelHold}>
        <span className="three-d-gallery-corner" aria-hidden="true">VIEW STUDY — {project.number}</span>
        <Swiper
          modules={galleryModules}
          effect={reducedMotion ? 'slide' : 'creative'}
          creativeEffect={galleryCreativeEffect}
          navigation={galleryControls[project.id].navigation}
          pagination={galleryControls[project.id].pagination}
          grabCursor
          className="three-d-swiper"
        >
          {project.images.map((src, index) => <SwiperSlide key={src}><img src={src} alt={`${project.name} — góc nhìn ${index + 1}`} loading={index === 0 ? 'eager' : 'lazy'} decoding="async" draggable="false" /></SwiperSlide>)}
        </Swiper>
        <div className="three-d-gallery-controls"><button type="button" className={`three-d-prev-${project.id}`} aria-label={`Ảnh ${project.name} trước`}>←</button><div className={`three-d-pagination three-d-pagination-${project.id}`} /><button type="button" className={`three-d-next-${project.id}`} aria-label={`Ảnh ${project.name} tiếp theo`}>→</button></div>
      </div>
    </motion.article>
  )
})

const ThreeDHero = memo(function ThreeDHero({ reducedMotion }) {
  const [heroIndex, setHeroIndex] = useState(0)
  const heroProject = projects[heroIndex]
  const changeHero = direction => setHeroIndex(index => (index + direction + projects.length) % projects.length)
  return <header className="three-d-hero">
    <div className="three-d-hero-copy"><p>SELECTED 3D WORKS &nbsp; / &nbsp; 2026</p><h1>FORM<br /><em>IN</em> MOTION<span>.</span></h1><div className="three-d-hero-bottom"><p>Ba thế giới, ba chất liệu.<br />Chạm để bước vào từng mô hình.</p><a href="#three-d-collection">KHÁM PHÁ TÁC PHẨM ↓</a></div></div>
    <div className="three-d-hero-stage" style={{ '--hero-accent': heroProject.color }}>
      <motion.div className={`three-d-hero-model three-d-hero-model--${heroProject.id}`} animate={reducedMotion ? undefined : { y: [0, -13, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
        <AnimatePresence mode="wait">
          <motion.div key={heroProject.id} className="three-d-hero-view" initial={{ opacity: 0, scale: .85, rotate: -7 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} exit={{ opacity: 0, scale: 1.08, rotate: 7 }} transition={{ duration: .38, ease: [.22, 1, .36, 1] }}>
            <model-viewer src={heroProject.model} alt={`${heroProject.name} 3D lơ lửng`} auto-rotate rotation-per-second="10deg" camera-controls disable-zoom disable-pan interaction-prompt="none" environment-image={heroProject.id === 'bottle' ? `${asset}white_studio_06_1k.hdr` : 'neutral'} exposure="1.45" shadow-intensity="0" camera-orbit={heroProject.initialOrbit} loading="eager" />
          </motion.div>
        </AnimatePresence>
        <span className="three-d-hero-model-label">{heroProject.number} / {heroProject.type}</span>
      </motion.div>
      <div className="three-d-hero-selector" aria-label="Chọn mô hình 3D"><button type="button" onClick={() => changeHero(-1)} aria-label="Mô hình trước">←</button>{projects.map((project, index) => <button key={project.id} type="button" className="three-d-hero-option" aria-pressed={index === heroIndex} onClick={() => setHeroIndex(index)}><span>{project.number}</span>{project.name}</button>)}<button type="button" onClick={() => changeHero(1)} aria-label="Mô hình tiếp">→</button></div>
    </div>
    <span className="three-d-hero-orbit" aria-hidden="true">◎</span>
  </header>
})

function ModelExperience({ project, reducedMotion }) {
  const [view, setView] = useState('outside')
  const [loadError, setLoadError] = useState(false)
  const currentView = houseViews.find(item => item.id === view) || houseViews[0]
  return <div className="three-d-experience">
    <div className={`three-d-viewer-wrap three-d-viewer-wrap--${project.id}`}>
      <model-viewer
        key={project.id}
        src={project.model}
        poster={project.poster}
        alt={`Mô hình 3D tương tác của ${project.name}`}
        camera-controls
        touch-action="none"
        auto-rotate={reducedMotion || (project.id === 'house' && view !== 'outside') ? undefined : ''}
        auto-rotate-delay="0"
        rotation-per-second="8deg"
        camera-orbit={project.id === 'house' ? currentView.orbit : project.initialOrbit}
        camera-target={project.id === 'house' ? currentView.target : 'auto auto auto'}
        min-camera-orbit="auto auto 0.1m"
        max-camera-orbit="auto auto 300%"
        interpolation-decay="160"
        zoom-sensitivity={project.id === 'house' ? '.18' : '.42'}
        shadow-intensity=".55"
        environment-image={project.id === 'bottle' ? `${asset}white_studio_06_1k.hdr` : 'neutral'}
        exposure={project.id === 'house' ? '1.65' : '1.35'}
        loading="eager"
        reveal="auto"
        onError={() => setLoadError(true)}
      />
      {loadError && <div className="three-d-load-error">Không tải được mô hình 3D. Vui lòng thử tải lại trang.</div>}
      <span className="three-d-axis" aria-hidden="true">X ↗ &nbsp; Y ↑ &nbsp; Z ↖</span>
    </div>
    <div className="three-d-viewer-bottom">
      <p><strong>{project.name}</strong><span>{project.type}</span></p>
      <p className="three-d-control-tip">KÉO ĐỂ XOAY · CUỘN / CHỤM HAI NGÓN ĐỂ PHÓNG GẦN · NHẤP PHẢI / HAI NGÓN ĐỂ DI CHUYỂN</p>
    </div>
    {project.id === 'house' && <div className="three-d-room-nav" role="group" aria-label="Chọn góc nhìn ngôi nhà">
      {houseViews.map(item => <button key={item.id} type="button" aria-pressed={view === item.id} onClick={() => setView(item.id)}>{item.label}</button>)}
    </div>}
  </div>
}

export default function ThreeDProject({ onBack, onDetailOpenChange }) {
  const reducedMotion = useReducedMotion()
  const [active, setActive] = useState(null)
  const [introVisible, setIntroVisible] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  useEffect(() => {
    if (reducedMotion) return
    const timer = window.setTimeout(() => setIntroVisible(false), 1450)
    return () => window.clearTimeout(timer)
  }, [reducedMotion])
  const openModel = useCallback(project => { setActive(project); onDetailOpenChange?.(true) }, [onDetailOpenChange])
  const changeOpen = open => { if (!open) setActive(null); onDetailOpenChange?.(open) }
  return <main className="three-d-page">
    <AnimatePresence>
      {introVisible && <motion.div className="three-d-intro" initial={{ opacity: 1 }} exit={{ opacity: 0, scale: 1.08, filter: 'blur(16px)' }} transition={{ duration: .55, ease: [.22, 1, .36, 1] }} aria-label="Đang mở bộ sưu tập 3D">
        <motion.div className="three-d-intro-mark" initial={{ rotate: -35, scale: .5, opacity: 0 }} animate={{ rotate: 0, scale: 1, opacity: 1 }} transition={{ duration: .95, type: 'spring', stiffness: 90, damping: 16 }}>3D<span>✳</span></motion.div>
        <motion.p initial={{ y: 24, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: .35, duration: .55 }}>OBJECT STUDIES / FORM IN MOTION</motion.p>
        <button type="button" onClick={() => setIntroVisible(false)} aria-label="Bỏ qua intro">BỎ QUA ↗</button>
      </motion.div>}
    </AnimatePresence>
    <nav className="three-d-topbar" aria-label="Điều hướng trang 3D"><BackButton className="three-d-back" onClick={onBack} ariaLabel="Quay lại danh mục sản phẩm" reducedMotion={reducedMotion} /><span>HÙNG TRƯƠNG / OBJECT STUDIES</span></nav>
    <ThreeDHero reducedMotion={reducedMotion} />
    <section id="three-d-collection" className="three-d-collection" aria-label="Bộ sưu tập tác phẩm 3D">
      <div className="three-d-section-heading"><span>THE COLLECTION / 03</span><p>FROM STILL IMAGE<br />TO LIVING OBJECT</p></div>
      {projects.map(project => <ProjectGallery key={project.id} project={project} onOpen={openModel} reducedMotion={reducedMotion} />)}
    </section>
    <footer className="three-d-footer"><span>END OF OBJECT STUDIES</span><strong>THERE IS MORE<br />THAN ONE SIDE.</strong><button type="button" onClick={onBack}>XEM CÁC DỰ ÁN KHÁC ↗</button></footer>
    <Dialog.Root open={active !== null} onOpenChange={changeOpen}>
      <AnimatePresence>
        {active && <Dialog.Portal forceMount><Dialog.Overlay className="three-d-dialog-overlay" /><Dialog.Content className="three-d-dialog" aria-describedby="three-d-dialog-description">
          <div className="three-d-dialog-head"><span>OBJECT STUDY / {active.number}</span><Dialog.Close aria-label="Đóng mô hình 3D">ĐÓNG <b>×</b></Dialog.Close></div>
          <Dialog.Title className="three-d-dialog-title">{active.name}</Dialog.Title>
          <Dialog.Description id="three-d-dialog-description" className="three-d-sr-only">Kéo để xoay mô hình. Cuộn chuột hoặc chụm hai ngón để phóng gần. Nhấn Escape để đóng.</Dialog.Description>
          <ModelExperience project={active} reducedMotion={reducedMotion} />
        </Dialog.Content></Dialog.Portal>}
      </AnimatePresence>
    </Dialog.Root>
  </main>
}
