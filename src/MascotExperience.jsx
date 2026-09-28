import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import './MascotExperience.css'

gsap.registerPlugin(useGSAP)

const poses = [
  { src: 'mascot-main.png', label: 'Xin chào!', scale: 0.91 },
  { src: 'mascot-pose-1.png', label: 'Cùng vui nào!', scale: 1.52 },
  { src: 'mascot-pose-2.png', label: 'Sắc màu sáng tạo', scale: 1.39 },
  { src: 'mascot-pose-3.png', label: 'Một chút tinh nghịch', scale: 0.88 },
  { src: 'mascot-pose-4.png', label: 'Tada! Nghệ thuật đây', scale: 1.58 },
  { src: 'mascot-pose-5.png', label: 'Niềm vui bật nhảy', scale: 0.93 },
  { src: 'mascot-pose-6.png', label: 'Nụ cười lan tỏa', scale: 0.96 },
  { src: 'mascot-pose-7.png', label: 'Một lời chào thật đẹp', scale: 0.91 },
  { src: 'mascot-pose-8.png', label: 'Ý tưởng tiếp theo?', scale: 0.89 },
]

export default function MascotExperience({ reducedMotion, active }) {
  const root = useRef(null)
  const previousIndex = useRef(0)
  const [index, setIndex] = useState(0)
  const [playing, setPlaying] = useState(true)
  const autoplay = active && playing && !reducedMotion

  useEffect(() => {
    if (!autoplay) return undefined
    const timer = window.setInterval(() => setIndex((value) => (value + 1) % poses.length), 4800)
    return () => window.clearInterval(timer)
  }, [autoplay])

  useGSAP(() => {
    const images = gsap.utils.toArray('.circus-pose')
    const curtains = gsap.utils.toArray('.circus-curtain')
    gsap.set(images, { autoAlpha: 0 })
    if (!active || reducedMotion) {
      gsap.set(images[index], { autoAlpha: 1 })
      gsap.set(curtains, { xPercent: (i) => i === 0 ? -102 : 102 })
      previousIndex.current = index
      return
    }
    gsap.set(images[previousIndex.current], { autoAlpha: 1 })
    // Close, change the act behind the curtain, then unveil it. The hook
    // reverts its scoped timeline when changing slides or unmounting.
    gsap.timeline()
      .fromTo(curtains, { xPercent: (i) => i === 0 ? -102 : 102 }, { xPercent: 0, duration: 0.28, ease: 'power2.inOut' })
      .set(images, { autoAlpha: 0 })
      .set(images[index], { autoAlpha: 1 })
      .to(curtains, { xPercent: (i) => i === 0 ? -102 : 102, duration: 0.85, ease: 'power3.inOut' }, '+=0.12')
    previousIndex.current = index
  }, { scope: root, dependencies: [index, active, reducedMotion], revertOnUpdate: true })

  const change = (step) => {
    setPlaying(false)
    setIndex((value) => (value + step + poses.length) % poses.length)
  }

  return (
    <section ref={root} className="art-circus" aria-labelledby="art-mascot-title">
      <div className="circus-ticket">
        <header className="circus-ticket-header"><span>ART CLOWN / 05</span><span>THE CHARACTER SHOW</span></header>
        <div className="circus-copy">
          <p className="circus-eyebrow">BRAND / COMPANION</p>
          <h2 id="art-mascot-title">MAS<span>COT</span></h2>
          <p className="circus-description">Một người bạn tinh nghịch, hài hước, luôn đồng hành để lan tỏa niềm vui và giúp Art Clown trở nên gần gũi, đáng nhớ hơn.</p>
          <div className="circus-stamp" aria-hidden="true">MORE ART.<br />MORE SMILES.<span>✦</span></div>
        </div>
        <div className="circus-show">
          <div className="circus-stage">
            <div className="circus-stage-rays" aria-hidden="true" />
            <span className="circus-star circus-star-one" aria-hidden="true">✦</span>
            <span className="circus-star circus-star-two" aria-hidden="true">✧</span>
            <span className="circus-stage-label">THE ART OF JOY</span>
            <div className="circus-cast">
              {poses.map((pose, i) => <img key={pose.src} className="circus-pose" src={`/assets/art-clown/source/${pose.src}`} style={{ '--pose-scale': pose.scale }} alt={i === index ? `Mascot Art Clown — ${pose.label}` : ''} aria-hidden={i !== index} draggable="false" />)}
            </div>
            <div className="circus-curtain circus-curtain-left" aria-hidden="true" />
            <div className="circus-curtain circus-curtain-right" aria-hidden="true" />
            <div className="circus-footlights" aria-hidden="true" />
          </div>
          <div className="circus-act"><span>ACT {String(index + 1).padStart(2, '0')}</span><p aria-live={autoplay ? 'off' : 'polite'}>{poses[index].label}</p><button type="button" onClick={() => setPlaying((value) => !value)} aria-label={autoplay ? 'Dừng tự chuyển Mascot' : 'Bật tự chuyển Mascot'} disabled={reducedMotion} aria-pressed={autoplay}>{autoplay ? 'Ⅱ' : '▷'}</button></div>
          <nav className="circus-controls" aria-label="Các tư thế Mascot">
            <button type="button" onClick={() => change(-1)} aria-label="Mascot trước">← PREV</button>
            <span>{String(index + 1).padStart(2, '0')} / 09</span>
            <button type="button" onClick={() => change(1)} aria-label="Mascot tiếp theo">NEXT →</button>
          </nav>
        </div>
        <footer className="circus-ticket-footer"><span>ONE LITTLE CLOWN. A WORLD OF JOY.</span><span>ADMIT ONE ✦</span></footer>
      </div>
    </section>
  )
}
