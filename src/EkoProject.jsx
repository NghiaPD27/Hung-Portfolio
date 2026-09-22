import { useCallback, useEffect, useRef, useState } from 'react'
import { DragDropProvider, useDraggable, useDroppable } from '@dnd-kit/react'
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'
import { A11y, Keyboard, Mousewheel, Pagination } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import './EkoProject.css'

const ASSET = '/assets/eko'
const TOTAL_SLIDES = 15

const trashItems = [
  { id: 'trash-1', src: 'trash-1.png', label: 'Mảnh rác thứ nhất', className: 'eko-trash-one' },
  { id: 'trash-2', src: 'trash-2.png', label: 'Mảnh rác thứ hai', className: 'eko-trash-two' },
  { id: 'trash-3', src: 'trash-3.png', label: 'Mảnh rác thứ ba', className: 'eko-trash-three' },
  { id: 'trash-4', src: 'trash-4.png', label: 'Mảnh rác thứ tư', className: 'eko-trash-four' },
]

const signs = [
  { src: 'sign-4.png', caption: 'TÍNH BỎ RÁC Ở ĐÂU ?' },
  { src: 'sign-1.png', caption: 'TÍNH XẢ RÁC HẢ ?' },
  { src: 'sign-3.png', caption: 'BẢO VỆ LÁ PHỔI XANH' },
  { src: 'sign-2.png', caption: 'THẤY THÌ LỤM BỎ' },
]

const outdoorPosters = [
  { src: 'outdoor-poster.png', alt: 'Poster EKO ứng dụng ngoài trời số 1', eyebrow: 'ỨNG DỤNG NGOÀI TRỜI', title: 'Hành động nhỏ, thay đổi lớn' },
  { src: 'outdoor-poster-2.png', alt: 'Poster EKO ứng dụng ngoài trời số 2', eyebrow: 'NHẬN DIỆN TRONG ĐỜI SỐNG', title: 'Đưa EKO đến gần cộng đồng' },
  { src: 'outdoor-poster-3.png', alt: 'Poster EKO ứng dụng ngoài trời số 3', eyebrow: 'TRUYỀN THÔNG XANH', title: 'Thông điệp dễ thấy, hành động dễ làm' },
  { src: 'outdoor-poster-4.png', alt: 'Poster EKO ứng dụng ngoài trời số 4', eyebrow: 'LAN TỎA THÓI QUEN TỐT', title: 'Mỗi điểm chạm là một lời nhắc' },
  { src: 'outdoor-poster-5.png', alt: 'Poster EKO ứng dụng ngoài trời số 5', eyebrow: 'CÙNG EKO HÀNH ĐỘNG', title: 'Vì một thành phố xanh hơn' },
]

function SlideFrame({ children, className = '' }) {
  return <div className={`eko-slide-frame ${className}`}>{children}</div>
}

function Reveal({ active, children, className = '', delay = 0 }) {
  const reducedMotion = useReducedMotion()

  return (
    <motion.div
      className={className}
      initial={false}
      animate={active || reducedMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: reducedMotion ? 0 : 0.72, delay: reducedMotion ? 0 : delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

function EkoHero({ active, reducedMotion }) {
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 90, damping: 24, mass: 0.7 })
  const smoothY = useSpring(pointerY, { stiffness: 90, damping: 24, mass: 0.7 })
  const backgroundX = useTransform(smoothX, [-1, 1], [-18, 18])
  const backgroundY = useTransform(smoothY, [-1, 1], [-12, 12])
  const grassY = useTransform(smoothY, [-1, 1], [5, -5])
  const logoX = useTransform(smoothX, [-1, 1], [-9, 9])
  const logoY = useTransform(smoothY, [-1, 1], [-7, 7])

  const updatePointer = (event) => {
    if (reducedMotion || event.pointerType === 'touch') return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width - 0.5) * 2)
    pointerY.set(((event.clientY - bounds.top) / bounds.height - 0.5) * 2)
  }

  const resetPointer = () => {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <section
      className="eko-design-canvas eko-hero eko-hero-canvas"
      aria-label="EKO - bảo vệ môi trường"
      onPointerMove={updatePointer}
      onPointerLeave={resetPointer}
    >
      <motion.img
        className="eko-hero-background"
        src={`${ASSET}/hero-background.png`}
        alt="Phong cảnh thiên nhiên xanh"
        style={{ x: backgroundX, y: backgroundY }}
      />
      <motion.img
        className="eko-hero-wave"
        src={`${ASSET}/hero-wave.png`}
        alt=""
        style={{ y: grassY }}
      />
      <div className="eko-hero-logo-anchor">
        <motion.img
          className="eko-hero-logo"
          src={`${ASSET}/logo.svg`}
          alt="EKO"
          style={{ x: logoX, y: logoY }}
          initial={false}
          animate={active ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.75, rotate: -10 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>
    </section>
  )
}

function DraggableTrash({ item, collected, onKeyboardCollect }) {
  const { ref, isDragging } = useDraggable({ id: item.id, disabled: collected })

  if (collected) return null

  return (
    <button
      ref={ref}
      type="button"
      className={`eko-trash-piece swiper-no-swiping ${item.className} ${isDragging ? 'is-dragging' : ''}`}
      aria-label={`${item.label}. Kéo vào thùng rác; nhấn Enter để bỏ nhanh.`}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onKeyboardCollect(item.id)
        }
      }}
    >
      <span className="eko-trash-crop">
        <img src={`${ASSET}/${item.src}`} alt="" draggable="false" />
      </span>
    </button>
  )
}

function TrashBin({ complete }) {
  const { ref, isDropTarget } = useDroppable({ id: 'eko-bin' })

  return (
    <motion.div
      ref={ref}
      className={`eko-trash-bin ${isDropTarget ? 'is-targeted' : ''} ${complete ? 'is-complete' : ''}`}
      animate={complete ? { rotate: [0, -2, 2, 0], scale: [1, 1.035, 1] } : { rotate: 0, scale: 1 }}
      transition={{ duration: 0.65 }}
    >
      <img src={`${ASSET}/trash-bin.png`} alt="Thùng rác EKO" draggable="false" />
      <span>{isDropTarget ? 'THẢ VÀO ĐÂY' : complete ? 'SẠCH RỒI!' : 'DROP ZONE'}</span>
    </motion.div>
  )
}

function CleanupGame({ active, onDraggingChange, onCompleteChange }) {
  const [collected, setCollected] = useState([])
  const complete = collected.length === trashItems.length

  useEffect(() => {
    onCompleteChange(complete)
  }, [complete, onCompleteChange])

  const collect = (id) => {
    setCollected((current) => (current.includes(id) ? current : [...current, id]))
  }

  const handleDragEnd = (event) => {
    onDraggingChange(false)
    if (event.canceled) return
    if (event.operation.target?.id === 'eko-bin') collect(String(event.operation.source?.id))
  }

  return (
    <DragDropProvider onDragStart={() => onDraggingChange(true)} onDragEnd={handleDragEnd}>
      <section className="eko-cleanup eko-full-canvas" aria-labelledby="eko-cleanup-title">
        <div className="eko-artboard-inner eko-cleanup-inner">
          <Reveal active={active} className="eko-cleanup-heading">
            <h2 id="eko-cleanup-title">Lụm rác bỏ vô chứ nhìn cái gì!</h2>
            <span>Kéo từng mảnh rác vào thùng · {collected.length}/4</span>
          </Reveal>

          <TrashBin complete={complete} />

          <div className="eko-trash-field" aria-live="polite">
            {trashItems.map((item) => (
              <DraggableTrash
                item={item}
                collected={collected.includes(item.id)}
                onKeyboardCollect={collect}
                key={item.id}
              />
            ))}
          </div>

          {complete && (
            <motion.div
              className="eko-cleanup-complete"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 240, damping: 18 }}
            >
              <strong>KHU VỰC ĐÃ SẠCH</strong>
              <button type="button" onClick={() => setCollected([])}>CHƠI LẠI ↻</button>
            </motion.div>
          )}
        </div>

        <div className="eko-pattern-marquee" aria-hidden="true">
          <div className="eko-pattern-track">
            <img src={`${ASSET}/pattern-strip.png`} alt="" />
            <img src={`${ASSET}/pattern-strip.png`} alt="" />
          </div>
        </div>
      </section>
    </DragDropProvider>
  )
}

function OutdoorPosterCarousel({ active, reducedMotion }) {
  const [[posterIndex, direction], setPoster] = useState([0, 1])

  const movePoster = useCallback((nextDirection) => {
    setPoster(([current]) => [
      (current + nextDirection + outdoorPosters.length) % outdoorPosters.length,
      nextDirection,
    ])
  }, [])

  useEffect(() => {
    if (!active || reducedMotion) return undefined
    const timer = window.setInterval(() => movePoster(1), 3200)
    return () => window.clearInterval(timer)
  }, [active, movePoster, reducedMotion])

  const currentPoster = outdoorPosters[posterIndex]

  return (
    <section className="eko-outdoor-carousel" aria-label="Bộ ảnh poster EKO ngoài trời">
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          className="eko-outdoor-backdrop"
          src={`${ASSET}/${currentPoster.src}`}
          alt=""
          aria-hidden="true"
          key={`background-${currentPoster.src}`}
          initial={reducedMotion ? false : { opacity: 0, scale: 1.08 }}
          animate={{ opacity: 0.25, scale: 1.03 }}
          exit={reducedMotion ? undefined : { opacity: 0, scale: 1 }}
          transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
        />
      </AnimatePresence>

      <div className="eko-outdoor-stage swiper-no-swiping">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            className="eko-outdoor-poster"
            src={`${ASSET}/${currentPoster.src}`}
            alt={currentPoster.alt}
            key={currentPoster.src}
            custom={direction}
            initial={reducedMotion ? false : { opacity: 0, x: direction > 0 ? '18%' : '-18%', scale: 0.94, rotateY: direction > 0 ? -7 : 7 }}
            animate={{ opacity: 1, x: 0, scale: 1, rotateY: 0 }}
            exit={reducedMotion ? undefined : { opacity: 0, x: direction > 0 ? '-18%' : '18%', scale: 0.96, rotateY: direction > 0 ? 7 : -7 }}
            transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
            drag={reducedMotion ? false : 'x'}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.16}
            onDragEnd={(_, info) => {
              if (Math.abs(info.offset.x) < 60) return
              movePoster(info.offset.x < 0 ? 1 : -1)
            }}
          />
        </AnimatePresence>
      </div>

      <div className="eko-outdoor-controls">
        <span>{String(posterIndex + 1).padStart(2, '0')} / {String(outdoorPosters.length).padStart(2, '0')}</span>
        <div className="eko-outdoor-dots" role="group" aria-label="Chọn ảnh poster">
          {outdoorPosters.map((poster, index) => (
            <button
              type="button"
              className={index === posterIndex ? 'is-active' : ''}
              aria-label={`Xem ảnh ${index + 1}`}
              aria-current={index === posterIndex ? 'true' : undefined}
              onClick={() => setPoster([index, index >= posterIndex ? 1 : -1])}
              key={poster.src}
            />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          className="eko-outdoor-story"
          key={`story-${currentPoster.src}`}
          initial={reducedMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, y: -12 }}
          transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.16, 1, 0.3, 1] }}
        >
          <span>{currentPoster.eyebrow}</span>
          <strong>{currentPoster.title}</strong>
          <p>Chuỗi hình ảnh chiến dịch biến nhận diện EKO thành lời mời hành động trong không gian công cộng.</p>
        </motion.div>
      </AnimatePresence>
    </section>
  )
}

export default function EkoProject({ onBack }) {
  const reducedMotion = useReducedMotion()
  const swiperRef = useRef(null)
  const gameCompleteRef = useRef(false)
  const [activeSlide, setActiveSlide] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [gameDragging, setGameDraggingState] = useState(false)
  const navigationLocked = activeSlide === 1 && !gameComplete

  useEffect(() => {
    const previousOverflow = document.body.style.overflow
    const previousOverscroll = document.body.style.overscrollBehavior
    document.body.style.overflow = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    return () => {
      document.body.style.overflow = previousOverflow
      document.body.style.overscrollBehavior = previousOverscroll
    }
  }, [])

  const handleGameComplete = useCallback((complete) => {
    gameCompleteRef.current = complete
    setGameComplete(complete)
  }, [])

  const setGameDragging = (dragging) => setGameDraggingState(dragging)

  useEffect(() => {
    const swiper = swiperRef.current
    if (!swiper) return

    const allowNavigation = !navigationLocked
    swiper.allowSlideNext = allowNavigation
    swiper.allowSlidePrev = allowNavigation
    swiper.allowTouchMove = allowNavigation && !gameDragging

    if (allowNavigation) {
      swiper.keyboard?.enable()
      swiper.mousewheel?.enable()
    } else {
      swiper.keyboard?.disable()
      swiper.mousewheel?.disable()
    }
  }, [gameDragging, navigationLocked])

  return (
    <main className={`eko-project ${navigationLocked ? 'is-navigation-locked' : ''}`} aria-label="Dự án nhận diện EKO">
      <motion.button
        className={`eko-back ${navigationLocked ? 'is-locked' : ''}`}
        onClick={() => { if (!navigationLocked) onBack() }}
        type="button"
        aria-label={navigationLocked ? 'Hãy lụm hết rác trước khi quay về' : 'Quay về trang portfolio'}
        disabled={navigationLocked}
        whileHover={reducedMotion || navigationLocked ? undefined : { scale: 1.045, x: -3 }}
        whileTap={reducedMotion || navigationLocked ? undefined : { scale: 0.96 }}
        transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      >
        <span className="eko-back-icon" aria-hidden="true"><img src={`${ASSET}/arrow-left.svg`} alt="" /></span>
        <span className="eko-back-label">BACK</span>
      </motion.button>

      <div className="eko-progress" aria-live="polite">
        <span>{String(activeSlide + 1).padStart(2, '0')}</span>
        <i />
        <span>{String(TOTAL_SLIDES).padStart(2, '0')}</span>
      </div>

      <Swiper
        className="eko-swiper"
        modules={[Mousewheel, Keyboard, Pagination, A11y]}
        direction="vertical"
        slidesPerView={1}
        speed={reducedMotion ? 0 : 850}
        preventInteractionOnTransition
        noSwiping
        noSwipingClass="swiper-no-swiping"
        mousewheel={{ forceToAxis: true, releaseOnEdges: false, sensitivity: 1, thresholdDelta: 18, thresholdTime: 650 }}
        keyboard={{ enabled: true, onlyInViewport: true, pageUpDown: true }}
        pagination={{ clickable: true }}
        a11y={{ enabled: true, prevSlideMessage: 'Màn EKO trước', nextSlideMessage: 'Màn EKO tiếp theo', paginationBulletMessage: 'Đi đến màn {{index}}' }}
        onSwiper={(swiper) => { swiperRef.current = swiper }}
        onSlideChange={(swiper) => {
          setActiveSlide(swiper.activeIndex)
          if (swiper.activeIndex === 1 && !gameCompleteRef.current) {
            swiper.allowSlideNext = false
            swiper.allowSlidePrev = false
            swiper.allowTouchMove = false
            swiper.keyboard?.disable()
            swiper.mousewheel?.disable()
          }
        }}
      >
        <SwiperSlide tag="section" aria-label="Màn 1 trên 15: EKO Hero">
          <SlideFrame className="eko-hero-frame">
            <EkoHero active={activeSlide === 0} reducedMotion={reducedMotion} />
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 2 trên 15: Trò chơi nhặt rác">
          <SlideFrame className="eko-white-frame">
            <CleanupGame
              active={activeSlide === 1}
              onDraggingChange={setGameDragging}
              onCompleteChange={handleGameComplete}
            />
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 3 trên 15: Logo EKO">
          <SlideFrame className="eko-black-frame">
            <section className="eko-logo-stage eko-full-canvas">
              <img className="eko-brand-pattern" src={`${ASSET}/brand-pattern.png`} alt="" />
              <div className="eko-artboard-inner eko-logo-inner">
                <motion.img
                  className="eko-logo-type"
                  src={`${ASSET}/logo-type.svg`}
                  alt="LOGO"
                  initial={false}
                  animate={activeSlide === 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
                  transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
                />
                <motion.img
                  className="eko-logo-render"
                  src={`${ASSET}/logo-render.png`}
                  alt="Biểu tượng EKO"
                  initial={false}
                  animate={activeSlide === 2 ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0.8, rotate: 8 }}
                  transition={{ duration: reducedMotion ? 0 : 0.9, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
                />
              </div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 4 trên 15: Ý nghĩa logo">
          <SlideFrame className="eko-white-frame">
            <section className="eko-design-canvas eko-logo-meaning">
              <Reveal active={activeSlide === 3} className="eko-meaning-content">
                <h2>Ý NGHĨA LOGO</h2>
                <div className="eko-meaning-list">
                  <p><strong>“Chiếc khiên trắng”</strong> tượng trưng cho sự bảo vệ, thuần khiết và trong sạch.</p>
                  <p><strong>“Giọt xanh lá và xanh biển”</strong> đại diện cho đất và nước — hai yếu tố tự nhiên thiết yếu.</p>
                  <p><strong>“Cánh quạt lớn”</strong> ở giữa ẩn dụ cho gió và điện, biểu trưng cho năng lượng và chuyển động.</p>
                </div>
              </Reveal>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 5 trên 15: Tên gọi EKO">
          <SlideFrame className="eko-white-frame">
            <section className="eko-design-canvas eko-name-story">
              <Reveal active={activeSlide === 4} className="eko-name-copy">
                <h2><span>E-K</span><em>O</em></h2>
                <p>Chúng tôi chọn <strong>‘E-KO’</strong> thay cho <strong>‘ECO’</strong> vừa quen thuộc, vừa là cách chơi chữ sáng tạo. Chữ <strong>‘O’</strong> là biểu tượng Trái Đất, và khi sạch Trái Đất sẽ xanh.</p>
              </Reveal>
              <motion.div
                className="eko-globe-orbit"
                initial={false}
                animate={activeSlide === 4 && !reducedMotion ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              >
                <img src={`${ASSET}/eko-globe.png`} alt="Trái Đất EKO" />
              </motion.div>
              <div className="eko-globe-arrows" aria-hidden="true">
                <span>↓</span>
                <span>↑</span>
              </div>
              <div className="eko-o-mark">o</div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 6 trên 15: Logo âm dương">
          <SlideFrame className="eko-image-frame">
            <motion.img
              className="eko-full-art"
              src={`${ASSET}/mockup-9.png`}
              alt="Hệ thống logo EKO âm dương"
              initial={false}
              animate={activeSlide === 5 ? { opacity: 1, scale: 1 } : { opacity: 0.6, scale: 1.035 }}
              transition={{ duration: reducedMotion ? 0 : 0.9 }}
            />
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 7 trên 15: Chi tiết nhận dạng">
          <SlideFrame className="eko-white-frame">
            <section className="eko-identity eko-full-canvas">
              <Reveal active={activeSlide === 6} className="eko-identity-title">
                <h2>CHI TIẾT NHẬN DẠNG</h2>
              </Reveal>
              <motion.div
                className="eko-identity-pattern"
                initial={false}
                animate={activeSlide === 6 && !reducedMotion ? { x: ['0%', '-50%'] } : { x: 0 }}
                transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
              >
                <span><img src={`${ASSET}/brand-pattern.png`} alt="Họa tiết nhận diện EKO" /></span>
                <span aria-hidden="true"><img src={`${ASSET}/brand-pattern.png`} alt="" /></span>
              </motion.div>
              <img className="eko-identity-strip" src={`${ASSET}/identity-strip.png`} alt="" />
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 8 trên 15: Hệ thống biển báo">
          <SlideFrame className="eko-green-frame">
            <section className="eko-design-canvas eko-signs">
              <Reveal active={activeSlide === 7} className="eko-signs-title">
                <h2>NHÌN BIỂN BÁO, HÀNH ĐỘNG ĐẸP!</h2>
              </Reveal>
              <div className="eko-sign-grid">
                {signs.map((sign, index) => (
                  <motion.article
                    className="eko-sign-card"
                    initial={false}
                    animate={activeSlide === 7 ? { opacity: 1, y: 0 } : { opacity: 0, y: 42 }}
                    transition={{ duration: reducedMotion ? 0 : 0.65, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    key={sign.src}
                  >
                    <span>{sign.caption}</span>
                    <div className="eko-sign-image">
                      <img src={`${ASSET}/${sign.src}`} alt={sign.caption} />
                    </div>
                  </motion.article>
                ))}
              </div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 9 trên 15: EKO ở mọi nơi">
          <SlideFrame className="eko-black-frame">
            <section className="eko-design-canvas eko-reminders">
              <Reveal active={activeSlide === 8} className="eko-reminder-title">
                <span>PRESENCE / 09</span>
                <h2>TÔI CÓ MẶT Ở MỌI NƠI</h2>
              </Reveal>
              <div className="eko-reminder-grid">
                {['reminder-1.png', 'reminder-2.png', 'reminder-3.png'].map((src, index) => (
                  <motion.img
                    src={`${ASSET}/${src}`}
                    alt={`Ứng dụng biển nhắc nhở EKO ${index + 1}`}
                    initial={false}
                    animate={activeSlide === 8 ? { opacity: 1, y: index * 10, rotate: (index - 1) * 2.5 } : { opacity: 0, y: 70, rotate: 0 }}
                    transition={{ duration: reducedMotion ? 0 : 0.75, delay: 0.12 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    key={src}
                  />
                ))}
              </div>
              <motion.p initial={false} animate={activeSlide === 8 ? { opacity: 1, x: 0 } : { opacity: 0, x: 60 }}>ĐỂ NHẮC NHỞ !!!</motion.p>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 10 trên 15: Tổng kết EKO">
          <SlideFrame className="eko-image-frame">
            <motion.img
              className="eko-full-art"
              src={`${ASSET}/mockup-12.png`}
              alt="Tổng kết nhận diện EKO"
              initial={false}
              animate={activeSlide === 9 ? { opacity: 1, scale: 1 } : { opacity: 0.62, scale: 1.04 }}
              transition={{ duration: reducedMotion ? 0 : 0.9 }}
            />
            <div className="eko-end-note">EKO · CLEAN EARTH / BRIGHT FUTURE</div>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 11 trên 15: Tuyên truyền và hành động">
          <SlideFrame className="eko-white-frame">
            <section className="eko-design-canvas eko-campaign">
              <img className="eko-campaign-background" src={`${ASSET}/campaign-background.png`} alt="" />
              <motion.h2
                initial={false}
                animate={activeSlide === 10 ? { opacity: 1, y: 0 } : { opacity: 0, y: -24 }}
                transition={{ duration: reducedMotion ? 0 : 0.72, ease: [0.16, 1, 0.3, 1] }}
              >
                TUYÊN TRUYỀN, HÀNH ĐỘNG
              </motion.h2>
              <div className="eko-campaign-stands">
                {[
                  ['campaign-stand-left.png', 'Standee bảo vệ môi trường'],
                  ['campaign-stand-middle.png', 'Standee phân loại rác'],
                  ['campaign-stand-right.png', 'Standee giảm nhựa'],
                ].map(([src, alt], index) => (
                  <motion.img
                    src={`${ASSET}/${src}`}
                    alt={alt}
                    initial={false}
                    animate={activeSlide === 10 ? { opacity: 1, y: 0 } : { opacity: 0, y: 52 }}
                    transition={{ duration: reducedMotion ? 0 : 0.78, delay: reducedMotion ? 0 : 0.1 + index * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={reducedMotion ? undefined : { y: -14, scale: 1.025, rotate: (index - 1) * 1.2 }}
                    key={src}
                  />
                ))}
              </div>
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 12 trên 15: Vì mái nhà xanh">
          <SlideFrame className="eko-white-frame">
            <section className="eko-design-canvas eko-green-home">
              <motion.div
                className="eko-green-home-title"
                initial={false}
                animate={activeSlide === 11 ? { opacity: 1, x: 0 } : { opacity: 0, x: -42 }}
                transition={{ duration: reducedMotion ? 0 : 0.78, ease: [0.16, 1, 0.3, 1] }}
              >
                <span>VÌ</span><span>MÁI</span><span>NHÀ</span><span>XANH</span>
              </motion.div>
              <motion.img
                src={`${ASSET}/green-home.png`}
                alt="Vì mái nhà xanh"
                initial={false}
                animate={activeSlide === 11 ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.035 }}
                transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
              />
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 13 trên 15: Ứng dụng poster ngoài trời">
          <SlideFrame className="eko-white-frame">
            <OutdoorPosterCarousel active={activeSlide === 12} reducedMotion={reducedMotion} />
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 14 trên 15: Bộ poster chiến dịch EKO">
          <SlideFrame className="eko-poster-frame">
            <section className="eko-design-canvas eko-poster-pair">
              {[
                ['poster-future.png', 'EKO — Mang bình, mang tương lai'],
                ['poster-brandboard.png', 'Bộ nhận diện thương hiệu EKO'],
              ].map(([src, alt], index) => (
                <motion.img
                  src={`${ASSET}/${src}`}
                  alt={alt}
                  initial={false}
                  animate={activeSlide === 13 ? { opacity: 1, y: 0 } : { opacity: 0, y: 44 }}
                  transition={{ duration: reducedMotion ? 0 : 0.82, delay: reducedMotion ? 0 : index * 0.12, ease: [0.16, 1, 0.3, 1] }}
                  whileHover={reducedMotion ? undefined : { y: -16, scale: 1.025, rotate: index === 0 ? -1 : 1 }}
                  key={src}
                />
              ))}
            </section>
          </SlideFrame>
        </SwiperSlide>

        <SwiperSlide tag="section" aria-label="Màn 15 trên 15: Lời cảm ơn">
          <SlideFrame className="eko-white-frame">
            <section className="eko-design-canvas eko-thank-you">
              <motion.div
                className="eko-thank-logo"
                initial={false}
                animate={activeSlide === 14 ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 36, scale: 0.94 }}
                transition={{ duration: reducedMotion ? 0 : 0.8, ease: [0.16, 1, 0.3, 1] }}
              >
                <img src={`${ASSET}/thank-you-logo.png`} alt="Biểu tượng EKO" />
              </motion.div>
              <motion.p
                initial={false}
                animate={activeSlide === 14 ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 }}
                transition={{ duration: reducedMotion ? 0 : 0.75, delay: reducedMotion ? 0 : 0.14, ease: [0.16, 1, 0.3, 1] }}
              >
                Cảm ơn những người đã, đang và sẽ cùng chung tay bảo vệ môi trường. Mỗi hành động nhỏ hôm nay đều góp phần tạo nên một tương lai xanh hơn.
              </motion.p>
            </section>
          </SlideFrame>
        </SwiperSlide>
      </Swiper>
    </main>
  )
}
