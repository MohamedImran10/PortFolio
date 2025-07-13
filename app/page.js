'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Code, Terminal, Palette, Zap, Github, ExternalLink, Mail, Download } from 'lucide-react'

const CodeRain = () => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops = []

    for (let i = 0; i < columns; i++) {
      drops[i] = 1
    }

    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#00ff41'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const animate = () => {
      draw()
      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-20"
      style={{ background: 'transparent' }}
    />
  )
}

const ParticleField = () => {
  const canvasRef = useRef(null)
  const particlesRef = useRef([])
  const animationRef = useRef(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initParticles()
    }

    const initParticles = () => {
      particlesRef.current = []
      const particleCount = Math.min(150, Math.floor((canvas.width * canvas.height) / 8000))
      
      for (let i = 0; i < particleCount; i++) {
        particlesRef.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          size: Math.random() * 2 + 1,
          opacity: Math.random() * 0.5 + 0.2,
          color: `hsl(${180 + Math.random() * 60}, 70%, 60%)`
        })
      }
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', handleMouseMove)

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particlesRef.current.forEach((particle, index) => {
        // Mouse interaction
        const dx = mouseRef.current.x - particle.x
        const dy = mouseRef.current.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)
        
        if (distance < 100) {
          const force = (100 - distance) / 100
          particle.vx += (dx / distance) * force * 0.01
          particle.vy += (dy / distance) * force * 0.01
        }

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Boundary check
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1

        // Draw particle
        ctx.save()
        ctx.globalAlpha = particle.opacity
        ctx.fillStyle = particle.color
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
        ctx.restore()

        // Draw connections
        particlesRef.current.slice(index + 1).forEach(otherParticle => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 80) {
            ctx.save()
            ctx.globalAlpha = (80 - distance) / 80 * 0.3
            ctx.strokeStyle = '#00ffff'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.stroke()
            ctx.restore()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 opacity-60"
      style={{ background: 'transparent' }}
    />
  )
}

const GlitchText = ({ children, className = '' }) => {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) {
        setIsGlitching(true)
        setTimeout(() => setIsGlitching(false), 150)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={`relative ${className}`}>
      <div className={`transition-all duration-150 ${isGlitching ? 'transform translate-x-1 text-red-500' : ''}`}>
        {children}
      </div>
      {isGlitching && (
        <>
          <div className="absolute inset-0 text-cyan-400 transform -translate-x-1 opacity-70">
            {children}
          </div>
          <div className="absolute inset-0 text-yellow-400 transform translate-x-0.5 opacity-50">
            {children}
          </div>
        </>
      )}
    </div>
  )
}

const FloatingIcon = ({ icon: Icon, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.3, 0.8, 0.3],
        y: [0, -10, 0],
        rotate: [0, 5, -5, 0]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute text-cyan-400"
    >
      <Icon size={24} />
    </motion.div>
  )
}

const ProjectCard = ({ project, index }) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      whileHover={{ scale: 1.02, rotateY: 5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="relative group"
    >
      <div className="bg-black/40 backdrop-blur-sm border border-cyan-500/20 rounded-xl p-6 h-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">{project.title}</h3>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
              >
                <Github size={16} className="text-cyan-400" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-cyan-500/20 rounded-lg hover:bg-cyan-500/30 transition-colors"
              >
                <ExternalLink size={16} className="text-cyan-400" />
              </motion.button>
            </div>
          </div>
          
          <p className="text-gray-300 mb-4 text-sm leading-relaxed">{project.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="px-3 py-1 bg-cyan-500/10 border border-cyan-500/30 rounded-full text-xs text-cyan-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div
          className="absolute -bottom-10 -right-10 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-purple-500/20 rounded-full blur-xl"
          animate={{
            scale: isHovered ? 1.5 : 1,
            opacity: isHovered ? 0.8 : 0.3
          }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

const SkillOrb = ({ skill, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ 
        duration: 0.5, 
        delay: index * 0.1,
        type: "spring",
        stiffness: 200
      }}
      whileHover={{ 
        scale: 1.1,
        boxShadow: "0 0 20px rgba(0, 255, 255, 0.5)"
      }}
      className="relative group cursor-pointer"
    >
      <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 rounded-full px-6 py-3 text-center">
        <span className="text-cyan-300 font-medium text-sm">{skill}</span>
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 rounded-full opacity-0 group-hover:opacity-100"
          transition={{ duration: 0.3 }}
        />
      </div>
    </motion.div>
  )
}

export default function Portfolio() {
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [currentSection, setCurrentSection] = useState(0)

  const projects = [
    {
      id: '1',
      title: 'Neural Network Visualizer',
      description: 'Interactive 3D visualization of neural networks with real-time training data and dynamic node connections.',
      tech: ['Three.js', 'WebGL', 'TensorFlow.js', 'React'],
      color: 'cyan',
      image: '/api/placeholder/400/300'
    },
    {
      id: '2',
      title: 'Quantum Code Editor',
      description: 'Advanced code editor with quantum computing syntax highlighting and simulation capabilities.',
      tech: ['Monaco Editor', 'WebAssembly', 'Rust', 'TypeScript'],
      color: 'purple',
      image: '/api/placeholder/400/300'
    },
    {
      id: '3',
      title: 'AI-Powered Design System',
      description: 'Generative design system that creates UI components using machine learning algorithms.',
      tech: ['Python', 'OpenAI API', 'Figma API', 'Node.js'],
      color: 'green',
      image: '/api/placeholder/400/300'
    }
  ]

  const skills = [
    'React', 'TypeScript', 'Node.js', 'Python', 'WebGL', 'Three.js',
    'Machine Learning', 'Blockchain', 'WebAssembly', 'GraphQL',
    'Docker', 'Kubernetes', 'AWS', 'Neural Networks'
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'projects', 'skills', 'contact']
      const scrollPosition = window.scrollY + window.innerHeight / 2
      
      let activeSection = 0
      
      sections.forEach((sectionId, index) => {
        const element = document.getElementById(sectionId)
        if (element) {
          const rect = element.getBoundingClientRect()
          const elementTop = rect.top + window.scrollY
          const elementBottom = elementTop + rect.height
          
          if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
            activeSection = index
          }
        }
      })
      
      setCurrentSection(activeSection)
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll() // Call once on mount
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <CodeRain />
        <ParticleField />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20"
          style={{ y: backgroundY }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-cyan-500/20"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <GlitchText className="text-2xl font-bold text-cyan-400">
            &lt;DEV/&gt;
          </GlitchText>
          
          <div className="hidden md:flex space-x-8">
            {['Home', 'Projects', 'Skills', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors hover:text-cyan-400 ${
                  currentSection === index ? 'text-cyan-400' : 'text-gray-300'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.preventDefault()
                  setCurrentSection(index)
                  document.getElementById(item.toLowerCase())?.scrollIntoView({
                    behavior: 'smooth'
                  })
                }}
              >
                {item}
              </motion.a>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-cyan-500 to-purple-500 px-4 py-2 rounded-lg text-sm font-medium"
          >
            Download CV
          </motion.button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Floating Icons */}
          <div className="absolute -top-20 -left-20">
            <FloatingIcon icon={Code} delay={0} />
          </div>
          <div className="absolute -top-16 -right-16">
            <FloatingIcon icon={Terminal} delay={1} />
          </div>
          <div className="absolute -bottom-20 -left-16">
            <FloatingIcon icon={Palette} delay={2} />
          </div>
          <div className="absolute -bottom-16 -right-20">
            <FloatingIcon icon={Zap} delay={3} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <GlitchText className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              MOHAMED IMRAN
            </GlitchText>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="text-xl md:text-2xl text-gray-300 mb-6"
            >
              <span className="text-cyan-400">Full Stack Web Developer</span> · <span className="text-purple-400">Gen AI Enthusiast</span> · <span className="text-green-400">Lifelong Learner</span>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto leading-relaxed"
          >
            Turning ideas into scalable web apps, beautiful interfaces, and intelligent AI-powered experiences.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 255, 0.5)" }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-cyan-500 to-purple-500 px-8 py-3 rounded-lg font-medium flex items-center gap-2 justify-center"
            >
              <Zap size={20} />
              View Projects
            </motion.button>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="border border-cyan-500/50 px-8 py-3 rounded-lg font-medium hover:bg-cyan-500/10 transition-colors flex items-center gap-2 justify-center"
            >
              <Mail size={20} />
              Get In Touch
            </motion.button>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-6 h-10 border-2 border-cyan-400 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-cyan-400 rounded-full mt-2"
            />
          </motion.div>
        </motion.div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="relative py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <GlitchText className="text-4xl md:text-5xl font-bold mb-4 text-cyan-400">
              Featured Projects
            </GlitchText>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Exploring the intersection of cutting-edge technology and creative expression
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ProjectCard key={project.id} project={project} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="relative py-20">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <GlitchText className="text-4xl md:text-5xl font-bold mb-4 text-purple-400">
              Tech Arsenal
            </GlitchText>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Constantly evolving toolkit for building tomorrow's digital experiences
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-4">
            {skills.map((skill, index) => (
              <SkillOrb key={skill} skill={skill} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20">
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <GlitchText className="text-4xl md:text-5xl font-bold mb-8 text-green-400">
              Let's Build Something Amazing
            </GlitchText>
            
            <p className="text-gray-400 text-lg mb-12 max-w-2xl mx-auto">
              Ready to push the boundaries of what's possible? Let's collaborate on your next groundbreaking project.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.button
                whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(0, 255, 0, 0.5)" }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-green-500 to-cyan-500 px-8 py-4 rounded-lg font-medium flex items-center gap-2 justify-center text-lg"
              >
                <Mail size={24} />
                Start a Conversation
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="border border-green-500/50 px-8 py-4 rounded-lg font-medium hover:bg-green-500/10 transition-colors flex items-center gap-2 justify-center text-lg"
              >
                <Download size={24} />
                Download Resume
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-cyan-500/20 py-8">
        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <p className="text-gray-500">
            © 2024 Mohamed Imran. Crafted with passion and cutting-edge technology.
          </p>
        </div>
      </footer>
    </div>
  )
}
