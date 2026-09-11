import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './App.css'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [showCurtain, setShowCurtain] = useState(true)

  // Tự động kéo màn mở đầu sau 1.2s
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCurtain(false)
    }, 1200)
    return () => clearTimeout(timer)
  }, [])

  // Hiệu ứng Parallax 3D tương tác theo chuột
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      const x = (e.clientX - innerWidth / 2) / (innerWidth / 2)
      const y = (e.clientY - innerHeight / 2) / (innerHeight / 2)
      setMousePos({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

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
      id: 'uiux',
      tag: 'Digital Experience',
      title: 'UI / UX',
      vietnamese: 'TRẢI NGHIỆM GIAO DIỆN SỐ',
      description: 'Thiết kế hệ thống giao diện tối ưu trải nghiệm người dùng trên đa nền tảng, cân bằng giữa thẩm mỹ vị lai và công năng tiện dụng.',
      year: '2025'
    },
    {
      id: 'visual3d',
      tag: '3D & CGI',
      title: '3D ART',
      vietnamese: 'NGHỆ THUẬT HÌNH ẢNH 3D',
      description: 'Chất liệu pha lê, thủy tinh hữu cơ và ánh xạ siêu thực tạo nên các tác phẩm điêu khắc kỹ thuật số đầy cảm hứng.',
      year: '2026'
    },
    {
      id: 'editorial',
      tag: 'Print & Concept',
      title: 'EDITORIAL',
      vietnamese: 'ẤN PHẨM & NGHỆ THUẬT IN ẤN',
      description: 'Sáng tạo layout tạp chí, sách nghệ thuật và bộ nhận diện ấn phẩm đặc biệt với tinh thần phá vỡ giới hạn truyền thống.',
      year: '2025'
    }
  ]

  return (
    <div className="portfolio-app">
      {/* ================= MÀN MỞ ĐẦU ĐIỆN ẢNH (CINEMATIC INTRO CURTAIN) ================= */}
      <AnimatePresence>
        {showCurtain && (
          <motion.div 
            className="intro-curtain"
            initial={{ y: 0 }}
            exit={{ 
              y: '-100%', 
              transition: { duration: 1.1, ease: [0.76, 0, 0.24, 1] } 
            }}
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

      {/* ================= HEADER & MENU ================= */}
      <header className="app-header">
        <motion.button 
          className="menu-trigger" 
          onClick={() => setMenuOpen(true)}
          aria-label="Open Navigation Menu"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2, ease: 'easeOut' }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Menu +
        </motion.button>
      </header>

      {/* Menu Overlay Drawer */}
      <div className={`menu-overlay ${menuOpen ? 'open' : ''}`}>
        <button 
          className="menu-close-btn" 
          onClick={() => setMenuOpen(false)}
          aria-label="Close Menu"
        >
          ✕
        </button>
        <ul className="menu-links">
          <li><a className="menu-link" href="#hero" onClick={() => setMenuOpen(false)}>HOME</a></li>
          <li><a className="menu-link" href="#product" onClick={() => setMenuOpen(false)}>PRODUCT</a></li>
          <li><a className="menu-link" href="#about" onClick={() => setMenuOpen(false)}>ABOUT</a></li>
          <li><a className="menu-link" href="#contact" onClick={() => setMenuOpen(false)}>CONTACT</a></li>
        </ul>
      </div>

      {/* ================= HERO SECTION ================= */}
      <section className="hero-section" id="hero">
        {/* Nền tím gradient tràn màn hình phủ kín từ header đến đáy */}
        <motion.img 
          src="/assets/purple-glow.png" 
          alt="Purple Atmospheric Glow" 
          className="hero-fullscreen-bg"
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.8, delay: 0.4, ease: 'easeOut' }}
        />

        {/* Tiêu đề góc trái: Xuất hiện ấn tượng */}
        <div className="hero-text-left">
          <motion.h1 
            className="title-port"
            initial={{ opacity: 0, x: -70, filter: 'blur(10px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            PORT
          </motion.h1>
          
          <motion.h2 
            className="title-folio"
            initial={{ opacity: 0, y: 35, letterSpacing: '14px' }}
            animate={{ opacity: 1, y: 0, letterSpacing: '6px' }}
            transition={{ duration: 1, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            FOLIO
          </motion.h2>
        </div>

        {/* Cụm Visual Collage với chuyển động từng lớp */}
        <div className="visual-stage">
          {/* Lớp 2: Hoa sen pha lê hồng bung nở sau lưng & vai */}
          <motion.img 
            src="/assets/crystal-lotus.png" 
            alt="Pink Iridescent Crystal Lotus" 
            className="visual-layer layer-lotus"
            initial={{ opacity: 0, scale: 0.65, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate(calc(-50% + ${mousePos.x * -8}px), ${mousePos.y * -6}px)`
            }}
          />

          {/* Lớp 3: Chân dung chàng trai trồi lên vững chãi từ đáy */}
          <motion.img 
            src="/assets/person.png" 
            alt="Young Designer Silhouette Portrait" 
            className="visual-layer layer-person"
            initial={{ opacity: 0, y: 90 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translateX(calc(-48% + ${mousePos.x * 5}px))`
            }}
          />

          {/* Lớp 4: Hoa dâm bụt xanh lướt nhẹ từ góc trái dưới vào */}
          <motion.img 
            src="/assets/blue-flower.png" 
            alt="Blue Glass Hibiscus Flower" 
            className="visual-layer layer-blue-flower"
            initial={{ opacity: 0, scale: 0.7, x: -60, y: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 6}px)`
            }}
          />

          {/* Lớp 5: Hoa hồng hổ phách lướt nhẹ từ góc phải dưới vào */}
          <motion.img 
            src="/assets/amber-rose.png" 
            alt="Amber Crystal Rose" 
            className="visual-layer layer-amber-rose"
            initial={{ opacity: 0, scale: 0.7, x: 60, y: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
            style={{
              transform: `translate(${mousePos.x * 8}px, ${mousePos.y * 6}px)`
            }}
          />
        </div>

        {/* Tiêu đề góc phải: Trượt vào thanh lịch */}
        <div className="hero-text-right">
          <motion.h2 
            className="title-freedom"
            initial={{ opacity: 0, x: 70, filter: 'blur(8px)' }}
            animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.9, delay: 0.9, ease: [0.16, 1, 0.3, 1] }}
          >
            FREEDOM
          </motion.h2>
          
          <motion.h3 
            className="title-designer"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            DESIGNER
          </motion.h3>
        </div>

        {/* Dải Marquee Chữ Chạy Vô Tận */}
        <motion.div 
          className="marquee-bar"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.3, ease: 'easeOut' }}
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
            <motion.div 
              key={project.id} 
              className="folder-card-wrapper"
              onClick={() => setSelectedProject(project)}
              initial={{ opacity: 0, y: 45 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.12 }}
              whileHover={{ y: -12, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="folder-tab"></div>
              <div className="folder-box">
                <span className="folder-tag">{project.tag}</span>
                <h3 className="folder-heading">{project.title}</h3>
                <p className="folder-vietnamese">{project.vietnamese}</p>
              </div>
            </motion.div>
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
              <span className="folder-tag">{selectedProject.tag} • {selectedProject.year}</span>
              <h3 className="modal-title">{selectedProject.title}</h3>
              <h4 className="modal-subtitle">{selectedProject.vietnamese}</h4>
              <p className="modal-content">{selectedProject.description}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App


