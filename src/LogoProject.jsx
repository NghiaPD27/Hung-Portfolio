import { useRef, useState } from 'react'
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
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

export default function LogoProject({ onBack, onDetailOpenChange }) {
  const reducedMotion = useReducedMotion()
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

  return (
    <main className="logo-project">
      <div className="logo-topbar">
        <button className="logo-back" type="button" onClick={onBack} aria-label="Quay lại danh mục sản phẩm">← <span>WORKS</span></button>
        <span className="logo-topbar-label">HÙNG TRƯƠNG / VISUAL DESIGN</span>
      </div>
      <header className="logo-intro">
        <motion.div className="logo-intro-main" initial={reducedMotion ? false : { opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65 }}>
          <p className="logo-eyebrow"><span className="logo-dot" /> SELECTED IDENTITIES / {String(logoCatalog.length).padStart(2, '0')} MARKS</p>
          <h1>LOGO<span className="logo-title-star" aria-hidden="true">✳</span><br /><span className="logo-title-outline">INDEX.</span></h1>
        </motion.div>
        <div className="logo-intro-note">
          <span className="logo-edition">BỘ SƯU TẬP<br />THIẾT KẾ LOGO</span>
          <p>Mỗi dấu hiệu,<br />một bản sắc riêng.</p>
          <a href="#logo-gallery" className="logo-explore" onClick={event => { event.preventDefault(); document.getElementById('logo-gallery')?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth' }) }}>KHÁM PHÁ BỘ SƯU TẬP <span aria-hidden="true">↙</span></a>
        </div>
      </header>

      <section id="logo-gallery" className="logo-gallery" aria-label="Bộ sưu tập logo">
        <div className="logo-gallery-toolbar">
          <div className="logo-filters" role="group" aria-label="Lọc logo theo lĩnh vực">
            {logoCategories.map(item => <button type="button" key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>)}
          </div>
          <span className="logo-gallery-count">{String(filtered.length).padStart(2, '0')} / {String(logoCatalog.length).padStart(2, '0')}</span>
        </div>
        <Dialog.Root open={active !== null} onOpenChange={changeDetail}>
          <ResponsiveMasonry columnsCountBreakPoints={{ 0: 1, 650: 2, 1080: 3 }} gutterBreakPoints={{ 0: '16px', 650: '20px', 1080: '24px' }}>
            <Masonry sequential>
              {filtered.map((logo, index) => (
                <motion.div className="logo-card-entry" key={logo.id} initial={reducedMotion ? false : { opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .5 }}>
                  <Dialog.Trigger asChild>
                    <button type="button" className={`logo-card logo-card--${logo.shape}`} style={{ '--logo-panel': logo.background, '--logo-ink': logo.color }}
                      aria-label={`Xem logo ${logo.name}`} onClick={event => { originRef.current = event.currentTarget; setActiveIndex(index) }}>
                      <span className="logo-card-top"><span>({logo.number})</span><span>{logo.category}</span></span>
                      <span className="logo-card-stage"><LogoArtwork logo={logo} eager={index < 3} /></span>
                      <span className="logo-card-bottom"><span><strong>{logo.name}</strong><small>{logo.subtitle}</small></span><span className="logo-card-arrow" aria-hidden="true">↗</span></span>
                    </button>
                  </Dialog.Trigger>
                </motion.div>
              ))}
            </Masonry>
          </ResponsiveMasonry>
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
                <div className="logo-detail-controls"><button type="button" aria-label="Logo trước" onClick={() => move(-1)}>← <span>TRƯỚC</span></button><span className="logo-detail-hint">MỖI DẤU HIỆU, MỘT BẢN SẮC</span><button type="button" aria-label="Logo tiếp theo" onClick={() => move(1)}><span>TIẾP</span> →</button></div>
              </>}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </section>

      <footer className="logo-footer"><span>END OF INDEX / {String(logoCatalog.length).padStart(2, '0')} MARKS</span><p>Một dấu hiệu nhỏ.<br /><em>Một ấn tượng lớn.</em></p><button type="button" onClick={onBack}>KHÁM PHÁ CÁC DỰ ÁN KHÁC ↗</button></footer>
    </main>
  )
}
