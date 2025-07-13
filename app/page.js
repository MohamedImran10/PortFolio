'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'
import { Code, Terminal, Palette, Zap, Github, ExternalLink, Mail, Download, Sun, Moon, User, MessageSquare, CheckCircle, Send, ArrowRight, Linkedin } from 'lucide-react'

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

const FloatingIcon = ({ icon: Icon, delay = 0, isDarkMode }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ 
        opacity: [0.4, 1, 0.4],
        y: [0, -15, 0],
        rotate: [0, 10, -10, 0],
        scale: [1, 1.2, 1]
      }}
      transition={{
        duration: 4,
        delay,
        repeat: Infinity,
        ease: "easeInOut"
      }}
      className="absolute"
    >
      <div className={`p-3 rounded-full backdrop-blur-sm border transition-colors duration-500 ${
        isDarkMode 
          ? 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30 shadow-lg shadow-cyan-500/20'
          : 'text-blue-600 bg-blue-500/10 border-blue-500/30 shadow-lg shadow-blue-500/20'
      }`}>
        <Icon size={28} />
      </div>
    </motion.div>
  )
}

const ProjectCard = ({ project, index, isDarkMode }) => {
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
      <div className={`backdrop-blur-sm border rounded-xl p-6 h-full overflow-hidden transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/40 border-cyan-500/20 shadow-lg shadow-cyan-500/10'
          : 'bg-white/70 border-blue-500/20 shadow-lg shadow-blue-500/10'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isDarkMode 
            ? 'from-cyan-500/5 to-purple-500/5'
            : 'from-blue-500/5 to-purple-500/5'
        }`} />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-xl font-bold ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>{project.title}</h3>
            <div className="flex gap-2">
              <motion.a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                    : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-600'
                }`}
              >
                <Github size={16} />
              </motion.a>
              {project.hosted ? (
                <motion.a
                  href={project.hosted}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg transition-colors ${
                    isDarkMode 
                      ? 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                      : 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-600'
                  }`}
                  title="View Live Demo"
                >
                  <ExternalLink size={16} />
                </motion.a>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-2 rounded-lg transition-colors opacity-50 cursor-not-allowed ${
                    isDarkMode 
                      ? 'bg-gray-500/20 text-gray-500'
                      : 'bg-gray-400/20 text-gray-400'
                  }`}
                  title="Demo not available"
                  disabled
                >
                  <ExternalLink size={16} />
                </motion.button>
              )}
            </div>
          </div>
          
          <p className={`mb-4 text-sm leading-relaxed ${
            isDarkMode ? 'text-gray-300' : 'text-gray-700'
          }`}>{project.description}</p>
          
          <div className="flex flex-wrap gap-2">
            {project.tech.map((tech, i) => (
              <motion.span
                key={tech}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className={`px-3 py-1 border rounded-full text-xs transition-colors duration-500 ${
                  isDarkMode 
                    ? 'bg-cyan-500/10 border-cyan-500/30 text-cyan-300'
                    : 'bg-blue-500/10 border-blue-500/30 text-blue-700'
                }`}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>

        <motion.div
          className={`absolute -bottom-10 -right-10 w-20 h-20 rounded-full blur-xl ${
            isDarkMode 
              ? 'bg-gradient-to-br from-cyan-500/20 to-purple-500/20'
              : 'bg-gradient-to-br from-blue-500/20 to-purple-500/20'
          }`}
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

const SkillOrb = ({ skill, index, isDarkMode }) => {
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
        boxShadow: isDarkMode 
          ? "0 10px 30px rgba(0, 255, 255, 0.4)" 
          : "0 10px 30px rgba(59, 130, 246, 0.4)"
      }}
      className="relative group cursor-pointer"
    >
      <div className={`backdrop-blur-sm border rounded-full px-6 py-3 text-center transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/60 border-cyan-500/30 shadow-lg shadow-cyan-500/20'
          : 'bg-white/70 border-blue-500/30 shadow-lg shadow-blue-500/20'
      }`}>
        <span className={`font-medium text-sm ${
          isDarkMode ? 'text-cyan-300' : 'text-blue-700'
        }`}>{skill}</span>
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
            isDarkMode 
              ? 'from-cyan-500/20 to-purple-500/20'
              : 'from-blue-500/20 to-purple-500/20'
          }`}
        />
      </div>
    </motion.div>
  )
}

const ContactForm = ({ isDarkMode }) => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Send email using our API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message
        }),
      })
      
      if (response.ok) {
        setIsSubmitting(false)
        setIsSubmitted(true)
        
        // Reset form after showing success message
        setTimeout(() => {
          setIsSubmitted(false)
          setFormData({ name: '', email: '', message: '' })
        }, 3000)
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setIsSubmitting(false)
      // You could add error handling here
      alert('Failed to send message. Please try again or contact me directly at mohamedimranworkmailspace@gmail.com')
    }
  }

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full flex items-center justify-center"
        >
          <CheckCircle size={40} className="text-white" />
        </motion.div>
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className={`text-2xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-900'
          }`}
        >
          Message Sent Successfully!
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}
        >
          Thanks for reaching out! I'll get back to you soon.
        </motion.p>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Name
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 text-white focus:ring-green-500/50 focus:border-green-500'
              : 'bg-gray-50/50 border-gray-300 text-gray-900 focus:ring-green-500/50 focus:border-green-500'
          }`}
          placeholder="Your name"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Email
        </label>
        <motion.input
          whileFocus={{ scale: 1.02 }}
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 text-white focus:ring-green-500/50 focus:border-green-500'
              : 'bg-gray-50/50 border-gray-300 text-gray-900 focus:ring-green-500/50 focus:border-green-500'
          }`}
          placeholder="your.email@example.com"
        />
      </div>

      <div>
        <label className={`block text-sm font-medium mb-2 ${
          isDarkMode ? 'text-gray-300' : 'text-gray-700'
        }`}>
          Message
        </label>
        <motion.textarea
          whileFocus={{ scale: 1.02 }}
          name="message"
          value={formData.message}
          onChange={handleChange}
          required
          rows={5}
          className={`w-full px-4 py-3 rounded-xl border transition-all focus:outline-none focus:ring-2 resize-none ${
            isDarkMode 
              ? 'bg-gray-800/50 border-gray-600 text-white focus:ring-green-500/50 focus:border-green-500'
              : 'bg-gray-50/50 border-gray-300 text-gray-900 focus:ring-green-500/50 focus:border-green-500'
          }`}
          placeholder="Tell me about your project or just say hello!"
        />
      </div>

      <motion.button
        type="submit"
        disabled={isSubmitting}
        whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
        whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
        className={`w-full py-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${
          isSubmitting 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gradient-to-r from-green-500 to-cyan-500 hover:shadow-lg hover:shadow-green-500/25'
        }`}
      >
        {isSubmitting ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Sending...
          </>
        ) : (
          <>
            <Send size={20} />
            Send Message
          </>
        )}
      </motion.button>
    </form>
  )
}

export default function Portfolio() {
  const { scrollYProgress } = useScroll()
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  const [currentSection, setCurrentSection] = useState(0)
  const [isDarkMode, setIsDarkMode] = useState(true)

  const projects = [
    {
      id: '1',
      title: 'Coffee Products Management',
      description: 'Java-based web application for managing coffee product catalog, including CRUD operations and secure backend integration.',
      tech: ['JSP', 'Tomcat', 'MariaDB', 'JDBC'],
      color: 'cyan',
      image: '/api/placeholder/400/300',
      github: 'https://github.com/MohamedImran10/Coffee_Products_Management',
      hosted: null // Add your hosted URL here when available
    },
    {
      id: '2',
      title: 'CSE Admission Query Chatbot',
      description: 'Hybrid chatbot combining predefined JSON-based FAQs with AI-powered real-time answers to assist prospective students.',
      tech: ['Flask', 'Gemini Flash 1.5 API', 'Bootstrap', 'JavaScript'],
      color: 'purple',
      image: '/api/placeholder/400/300',
      github: 'https://github.com/MohamedImran10/Cse-Chatbot',
      hosted: null // Add your hosted URL here when available
    },
    {
      id: '3',
      title: 'Dynamic Query Interface for Hotel Management',
      description: 'Backend system enabling dynamic query handling and efficient record management for hotel staff and customer data.',
      tech: ['Flask', 'MariaDB', 'mysql-connector-python', 'Python'],
      color: 'green',
      image: '/api/placeholder/400/300',
      github: 'https://github.com/MohamedImran10/Hotel_Management',
      hosted: null // Add your hosted URL here when available
    }
  ]

  const skills = [
    // Frontend Technologies
    'HTML5', 'CSS3', 'JavaScript', 'JSP', 'ReactJS', 'Next.js', 'Bootstrap', 'jQuery',
    // Backend Technologies
    'Java', 'Python', 'Django', 'Flask', 'RESTful APIs',
    // Programming Languages
    'J2EE', 'C',
    // Databases
    'MySQL', 'SQLite', 'SQL', 'MongoDB',
    // Developer Tools
    'Git', 'GitHub', 'Eclipse', 'Tomcat', 'VS Code', 'GitHub Copilot'
  ]

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['home', 'about', 'projects', 'skills', 'contact']
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

    // Only add scroll listener, don't call handleScroll immediately
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className={`min-h-screen overflow-x-hidden transition-colors duration-500 ${
      isDarkMode 
        ? 'bg-black text-white' 
        : 'bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900'
    }`}>
      {/* Background Effects */}
      <div className="fixed inset-0 z-0" style={{ width: '100%', height: '100%', top: 0, left: 0 }}>
        {isDarkMode && <CodeRain />}
        {isDarkMode && <ParticleField />}
        <motion.div
          className={`absolute inset-0 w-full ${
            isDarkMode 
              ? 'bg-gradient-to-br from-cyan-900/20 via-black to-purple-900/20'
              : 'bg-gradient-to-br from-blue-100/50 via-white to-purple-100/50'
          }`}
          style={{ 
            y: backgroundY, 
            width: '100vw', 
            height: '300vh',
            top: 0,
            left: 0
          }}
        />
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b transition-colors duration-500 ${
          isDarkMode 
            ? 'bg-black/20 border-cyan-500/20' 
            : 'bg-white/70 border-gray-200'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <GlitchText className={`text-2xl font-bold ${
            isDarkMode ? 'text-cyan-400' : 'text-blue-600'
          }`}>
            &lt;DEV/&gt;
          </GlitchText>
          
          <div className="hidden md:flex space-x-8">
            {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                className={`text-sm font-medium transition-colors ${
                  currentSection === index 
                    ? (isDarkMode ? 'text-cyan-400' : 'text-blue-600')
                    : (isDarkMode ? 'text-gray-300 hover:text-cyan-400' : 'text-gray-600 hover:text-blue-600')
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

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${
                isDarkMode ? 'bg-cyan-500/20' : 'bg-blue-500/20'
              } border ${
                isDarkMode ? 'border-cyan-500/30' : 'border-blue-500/30'
              }`}
            >
              <motion.div
                animate={{ x: isDarkMode ? 24 : 2 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className={`absolute top-1 w-6 h-6 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-cyan-400' : 'bg-blue-600'
                }`}
              >
                {isDarkMode ? (
                  <Moon size={14} className="text-black" />
                ) : (
                  <Sun size={14} className="text-white" />
                )}
              </motion.div>
            </motion.button>

            <motion.a
              href="/Mohamed-Imran-M-Resume.pdf"
              download="Mohamed-Imran-M-Resume.pdf"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              }`}
            >
              Download Resume
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center">
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          {/* Floating Icons */}
          <div className="absolute -top-20 -left-20">
            <FloatingIcon icon={Code} delay={0} isDarkMode={isDarkMode} />
          </div>
          <div className="absolute -top-16 -right-16">
            <FloatingIcon icon={Terminal} delay={1} isDarkMode={isDarkMode} />
          </div>
          <div className="absolute -bottom-20 -left-16">
            <FloatingIcon icon={Palette} delay={2} isDarkMode={isDarkMode} />
          </div>
          <div className="absolute -bottom-16 -right-20">
            <FloatingIcon icon={Zap} delay={3} isDarkMode={isDarkMode} />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="mb-8"
          >
            <GlitchText className={`text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r ${
              isDarkMode 
                ? 'from-cyan-400 via-purple-400 to-cyan-400' 
                : 'from-blue-600 via-purple-600 to-blue-600'
            } bg-clip-text text-transparent`}>
              MOHAMED IMRAN
            </GlitchText>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className={`text-xl md:text-2xl mb-6 ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}
            >
              <span className={isDarkMode ? 'text-cyan-400' : 'text-blue-600'}>Full Stack Web Developer</span> · <span className={isDarkMode ? 'text-purple-400' : 'text-purple-600'}>Gen AI Enthusiast</span> · <span className={isDarkMode ? 'text-green-400' : 'text-green-600'}>Lifelong Learner</span>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className={`text-lg mb-8 max-w-2xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            Crafting digital experiences that blend cutting-edge technology with human-centered design. Let's build the future, one line of code at a time.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <motion.a
              href="#projects"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: isDarkMode 
                  ? "0 0 25px rgba(0, 255, 255, 0.5)" 
                  : "0 0 25px rgba(59, 130, 246, 0.5)"
              }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-lg font-medium flex items-center gap-2 justify-center transition-colors duration-500 ${
                isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
              }`}
            >
              <Zap size={20} />
              View Projects
            </motion.a>
            
            <motion.a
              href="#contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`border px-8 py-3 rounded-lg font-medium transition-colors duration-500 flex items-center gap-2 justify-center ${
                isDarkMode 
                  ? 'border-cyan-500/50 hover:bg-cyan-500/10 text-white'
                  : 'border-blue-500/50 hover:bg-blue-500/10 text-gray-900'
              }`}
            >
              <Mail size={20} />
              Get In Touch
            </motion.a>
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
            className={`w-6 h-10 border-2 rounded-full flex justify-center transition-colors duration-500 ${
              isDarkMode ? 'border-cyan-400' : 'border-blue-500'
            }`}
          >
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className={`w-1 h-3 rounded-full mt-2 transition-colors duration-500 ${
                isDarkMode ? 'bg-cyan-400' : 'bg-blue-500'
              }`}
            />
          </motion.div>
        </motion.div>
      </section>

      {/* About Section */}
      <section id="about" className="relative py-20">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <GlitchText className="text-4xl md:text-5xl font-bold mb-4 text-purple-400">
              About Me
            </GlitchText>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Passionate about creating digital solutions that make a difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Profile */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-6"
            >
              <div className={`backdrop-blur-sm border rounded-xl p-8 transition-all duration-500 ${
                isDarkMode 
                  ? 'bg-black/40 border-cyan-500/20 shadow-lg shadow-cyan-500/10'
                  : 'bg-white/70 border-blue-500/20 shadow-lg shadow-blue-500/10'
              }`}>
                <h3 className={`text-2xl font-bold mb-4 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>Who I Am</h3>
                <p className={`leading-relaxed mb-4 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  I'm Mohamed Imran, a passionate Full Stack Web Developer with a deep fascination for 
                  artificial intelligence and machine learning. My journey in technology started with 
                  curiosity and has evolved into a commitment to creating innovative solutions that 
                  bridge the gap between complex technology and user-friendly experiences.
                </p>
                <p className={`leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  As a lifelong learner, I constantly explore emerging technologies, from modern web 
                  frameworks to cutting-edge AI models, always seeking to expand my knowledge and 
                  apply it to real-world challenges.
                </p>
              </div>
            </motion.div>

            {/* Right Column - Stats & Highlights */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isDarkMode 
                      ? "0 10px 30px rgba(0, 255, 255, 0.3)" 
                      : "0 10px 30px rgba(59, 130, 246, 0.3)"
                  }}
                  className={`backdrop-blur-sm border rounded-xl p-6 text-center transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border-cyan-500/30'
                      : 'bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/30'
                  }`}
                >
                  <div className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                  }`}>2+</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Years of Experience</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isDarkMode 
                      ? "0 10px 30px rgba(168, 85, 247, 0.3)" 
                      : "0 10px 30px rgba(147, 51, 234, 0.3)"
                  }}
                  className={`backdrop-blur-sm border rounded-xl p-6 text-center transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30'
                      : 'bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/30'
                  }`}
                >
                  <div className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-purple-400' : 'text-purple-600'
                  }`}>3</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Projects Completed</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isDarkMode 
                      ? "0 10px 30px rgba(34, 197, 94, 0.3)" 
                      : "0 10px 30px rgba(22, 163, 74, 0.3)"
                  }}
                  className={`backdrop-blur-sm border rounded-xl p-6 text-center transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30'
                      : 'bg-gradient-to-br from-green-500/10 to-emerald-500/10 border-green-500/30'
                  }`}
                >
                  <div className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-green-400' : 'text-green-600'
                  }`}>25</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Technologies Mastered</div>
                </motion.div>
                
                <motion.div
                  whileHover={{ 
                    scale: 1.05,
                    boxShadow: isDarkMode 
                      ? "0 10px 30px rgba(245, 158, 11, 0.3)" 
                      : "0 10px 30px rgba(217, 119, 6, 0.3)"
                  }}
                  className={`backdrop-blur-sm border rounded-xl p-6 text-center transition-all duration-500 ${
                    isDarkMode 
                      ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                      : 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                  }`}
                >
                  <div className={`text-3xl font-bold mb-2 ${
                    isDarkMode ? 'text-yellow-400' : 'text-yellow-600'
                  }`}>24/7</div>
                  <div className={`text-sm ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  }`}>Learning Mode</div>
                </motion.div>
              </div>

              <motion.div
                whileHover={{ 
                  scale: 1.02,
                  boxShadow: isDarkMode 
                    ? "0 15px 40px rgba(0, 255, 255, 0.2)" 
                    : "0 15px 40px rgba(59, 130, 246, 0.2)"
                }}
                className={`backdrop-blur-sm border rounded-xl p-6 transition-all duration-500 ${
                  isDarkMode 
                    ? 'bg-gradient-to-br from-cyan-500/5 to-purple-500/5 border-cyan-500/20'
                    : 'bg-gradient-to-br from-blue-500/5 to-purple-500/5 border-blue-500/20'
                }`}
              >
                <h4 className={`text-xl font-bold mb-4 ${
                  isDarkMode ? 'text-cyan-400' : 'text-blue-600'
                }`}>What Drives Me</h4>
                <ul className={`space-y-3 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.1 }}
                      className={`w-3 h-3 rounded-full ${
                        isDarkMode ? 'bg-cyan-400' : 'bg-blue-500'
                      }`}
                    ></motion.div>
                    Building scalable, efficient web applications
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
                      className={`w-3 h-3 rounded-full ${
                        isDarkMode ? 'bg-purple-400' : 'bg-purple-500'
                      }`}
                    ></motion.div>
                    Exploring AI and machine learning possibilities
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                      className={`w-3 h-3 rounded-full ${
                        isDarkMode ? 'bg-green-400' : 'bg-green-500'
                      }`}
                    ></motion.div>
                    Creating intuitive user experiences
                  </motion.li>
                  <motion.li
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-center gap-3"
                  >
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
                      className={`w-3 h-3 rounded-full ${
                        isDarkMode ? 'bg-yellow-400' : 'bg-yellow-500'
                      }`}
                    ></motion.div>
                    Continuous learning and innovation
                  </motion.li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </div>
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
              <ProjectCard key={project.id} project={project} index={index} isDarkMode={isDarkMode} />
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
              <SkillOrb key={skill} skill={skill} index={index} isDarkMode={isDarkMode} />
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="relative py-20">
        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <GlitchText className="text-4xl md:text-5xl font-bold mb-4 text-green-400">
              Let's Create Something Amazing
            </GlitchText>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Ready to bring your ideas to life? Let's collaborate and build something extraordinary together.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className={`relative backdrop-blur-lg rounded-2xl p-8 border ${
                isDarkMode 
                  ? 'bg-gray-900/50 border-gray-700/50' 
                  : 'bg-white/50 border-gray-300/50'
              }`}>
                <ContactForm isDarkMode={isDarkMode} />
              </div>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-8"
            >
              <div>
                <h3 className={`text-2xl font-bold mb-6 ${
                  isDarkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Get In Touch
                </h3>
                <p className={`text-lg leading-relaxed ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  I'm always excited to work on new projects and collaborate with 
                  passionate people. Whether you have a project in mind or just 
                  want to chat about technology, feel free to reach out!
                </p>
              </div>

              <div className="space-y-6">
                <motion.a
                  href="mailto:mohamedimranworkmailspace@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDarkMode 
                      ? 'border-gray-700/50 hover:border-green-500/50 hover:bg-gray-800/50' 
                      : 'border-gray-300/50 hover:border-green-500/50 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-cyan-500 rounded-xl flex items-center justify-center">
                    <Mail size={24} className="text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Email Me
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Let’s connect and innovate together
                    </p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://linkedin.com/in/mohamed-imran-m-info"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDarkMode 
                      ? 'border-gray-700/50 hover:border-blue-500/50 hover:bg-gray-800/50' 
                      : 'border-gray-300/50 hover:border-blue-500/50 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Linkedin size={24} className="text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      LinkedIn
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Let's connect professionally
                    </p>
                  </div>
                </motion.a>

                <motion.a
                  href="https://github.com/MohamedImran10"
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                    isDarkMode 
                      ? 'border-gray-700/50 hover:border-purple-500/50 hover:bg-gray-800/50' 
                      : 'border-gray-300/50 hover:border-purple-500/50 hover:bg-gray-50/50'
                  }`}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                    <Github size={24} className="text-white" />
                  </div>
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      GitHub
                    </p>
                    <p className={isDarkMode ? 'text-gray-400' : 'text-gray-600'}>
                      Check out my projects
                    </p>
                  </div>
                </motion.a>
              </div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-8"
              >
                <motion.a
                  href="/Mohamed-Imran-M-Resume.pdf"
                  download="Mohamed-Imran-M-Resume.pdf"
                  className="w-full bg-gradient-to-r from-green-500 to-cyan-500 px-8 py-4 rounded-xl font-medium flex items-center gap-2 justify-center text-lg text-white hover:shadow-lg hover:shadow-green-500/25 transition-all"
                >
                  <Download size={24} />
                  Download Resume
                  <ArrowRight size={20} />
                </motion.a>
              </motion.div>
            </motion.div>
          </div>
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
