import { forwardRef, useCallback, useEffect, useImperativeHandle, useRef } from 'react'
import { gsap } from 'gsap'
import { Observer } from 'gsap/Observer'
import { MeshGradient } from '@paper-design/shaders-react'

gsap.registerPlugin(Observer)

const turns = Math.PI * 2
const rows = [-1, 0, 1]

const JapanSpiralStream = forwardRef(function JapanSpiralStream({ posters, activeIndex, onActiveChange, onOpen, playing, reducedMotion, compact }, ref) {
  const stageRef = useRef(null)
  const cardsRef = useRef([])
  const phaseRef = useRef({ value: 0 })
  const tweenRef = useRef(null)
  const dragRef = useRef({ pressed: false, moved: false })
  const metricsRef = useRef({ width: 800, height: 600 })
  const activeRef = useRef(0)
  const openRef = useRef(onOpen)
  openRef.current = onOpen

  const renderSpiral = useCallback(() => {
    const { width, height } = metricsRef.current
    const orbit = width * (compact ? 0.39 : 0.365)
    const depth = Math.min(width * 0.29, 290)
    const rowGap = height * (compact ? 0.37 : 0.39)
    const count = posters.length
    const phase = phaseRef.current.value

    cardsRef.current.forEach((card, cardIndex) => {
      if (!card) return
      const row = Math.floor(cardIndex / count) - 1
      const posterIndex = cardIndex % count
      const angle = (posterIndex - phase + row * 1.35) * turns / count
      const front = (Math.cos(angle) + 1) / 2
      gsap.set(card, {
        xPercent: -50,
        yPercent: -50,
        x: Math.sin(angle) * orbit + row * width * 0.022,
        y: row * rowGap + Math.sin(angle + row * 0.55) * height * 0.07,
        z: Math.cos(angle) * depth,
        rotationY: -Math.sin(angle) * 76,
        rotationZ: row * 2.2,
        scale: 0.69 + front * 0.32,
        opacity: 0.28 + front * 0.72,
        zIndex: Math.round(front * 100) + (row === 0 ? 2 : 0),
      })
    })

    const nearest = ((Math.round(phase) % count) + count) % count
    if (nearest !== activeRef.current) {
      activeRef.current = nearest
      onActiveChange(nearest)
    }
  }, [compact, onActiveChange, posters.length])

  const goTo = useCallback((index) => {
    const count = posters.length
    const current = phaseRef.current.value
    const base = Math.round(current / count) * count + index
    const destination = [base - count, base, base + count].reduce((closest, candidate) =>
      Math.abs(candidate - current) < Math.abs(closest - current) ? candidate : closest, base)
    tweenRef.current?.kill()
    if (reducedMotion) {
      phaseRef.current.value = destination
      renderSpiral()
      return
    }
    tweenRef.current = gsap.to(phaseRef.current, {
      value: destination,
      duration: 1.05,
      ease: 'power3.inOut',
      onUpdate: renderSpiral,
      onComplete: () => { tweenRef.current = null },
    })
  }, [posters.length, reducedMotion, renderSpiral])

  useImperativeHandle(ref, () => ({
    goTo,
    step: (direction) => goTo((activeRef.current + direction + posters.length) % posters.length),
  }), [goTo, posters.length])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const measure = () => {
      metricsRef.current = { width: stage.clientWidth, height: stage.clientHeight }
      renderSpiral()
    }
    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(stage)
    measure()
    return () => resizeObserver.disconnect()
  }, [renderSpiral])

  useEffect(() => {
    if (!playing || reducedMotion) return undefined
    const tick = () => {
      if (dragRef.current.pressed || tweenRef.current?.isActive()) return
      phaseRef.current.value += gsap.ticker.deltaRatio(60) * 0.0035
      renderSpiral()
    }
    gsap.ticker.add(tick)
    return () => gsap.ticker.remove(tick)
  }, [playing, reducedMotion, renderSpiral])

  useEffect(() => {
    const stage = stageRef.current
    if (!stage) return undefined
    const observer = Observer.create({
      target: stage,
      type: 'pointer,touch',
      lockAxis: true,
      preventDefault: false,
      tolerance: 3,
      onPress: () => {
        tweenRef.current?.kill()
        dragRef.current = { pressed: true, moved: false }
      },
      onDrag: (self) => {
        if (self.axis !== 'x') return
        dragRef.current.moved = true
        phaseRef.current.value -= self.deltaX / Math.max(stage.clientWidth, 1) * posters.length * 1.2
        renderSpiral()
      },
      onRelease: () => {
        dragRef.current.pressed = false
        window.setTimeout(() => { dragRef.current.moved = false }, 100)
      },
    })
    return () => observer.kill()
  }, [posters.length, renderSpiral])

  useEffect(() => () => { tweenRef.current?.kill() }, [])

  return (
    <div className="poster-japan-stream" ref={stageRef} role="group" aria-label="Poster Nhật Bản chuyển động xoắn 3D; kéo ngang để khám phá">
      <div className="poster-japan-stream-shader" aria-hidden="true">
        <MeshGradient
          width="100%"
          height="100%"
          colors={['#f3d78c', '#daa83d', '#ffe5a5', '#eab95c', '#c77c47']}
          distortion={0.45}
          swirl={0.18}
          grainOverlay={0.12}
          speed={playing && !reducedMotion && !compact ? 0.06 : 0}
          maxPixelCount={compact ? 160000 : 400000}
        />
      </div>
      <div className="poster-japan-stream-vignette" aria-hidden="true" />
      {rows.flatMap((row, rowIndex) => posters.map((poster, index) => {
        const cardIndex = rowIndex * posters.length + index
        return (
          <div className={`poster-japan-stream-card${row === 0 ? ' is-interactive' : ''}`} key={`${row}-${poster.number}`} ref={(element) => { cardsRef.current[cardIndex] = element }} aria-hidden={row !== 0 ? 'true' : undefined}>
            {row === 0 ? (
              <button
                type="button"
                className="poster-japan-stream-card-button"
                tabIndex={activeIndex === index ? 0 : -1}
                aria-label={activeIndex === index ? `Phóng to poster ${poster.title}` : `Chọn poster ${poster.title}`}
                onClick={() => {
                  if (dragRef.current.moved) return
                  if (activeRef.current === index) openRef.current(poster)
                  else goTo(index)
                }}
              >
                <img src={poster.image} alt={poster.alt} loading="eager" draggable="false" />
              </button>
            ) : <img src={poster.image} alt="" loading="lazy" draggable="false" />}
          </div>
        )
      }))}
      <div className="poster-japan-stream-caption" aria-hidden="true"><span>SPIRAL STREAM / 五景</span><span>KÉO NGANG ĐỂ XOAY ↔</span></div>
    </div>
  )
})

export default JapanSpiralStream
