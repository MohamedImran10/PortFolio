'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mail, User, MessageSquare, Send, Check, X, Loader } from 'lucide-react';
import { sendToTelegram } from '@/app/actions/contact';

export default function ContactForm({ isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    // Puter.js will be loaded dynamically during form submission
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      console.log('📤 Starting form submission...');
      console.log('   Name:', formData.name);
      console.log('   Email:', formData.email);
      console.log('   Message length:', formData.message.length);

      // Simple default analysis
      let analysis = `Message from ${formData.name}`;
      
      // Try AI analysis but don't block
      try {
        console.log('🤖 Attempting AI analysis...');
        const { default: puter } = await import('@heyputer/puter.js');
        
        if (puter?.ai?.chat) {
          const response = await puter.ai.chat(`Analyze: "${formData.message.substring(0, 100)}"`);

          // Extract response
          let text = '';
          if (typeof response === 'string') text = response;
          else if (response?.message?.content) text = response.message.content;
          else if (response?.text) text = response.text;
          else if (response?.content) text = response.content;

          if (text?.trim()) {
            analysis = text.trim();
            console.log('✅ AI Analysis:', analysis);
          }
        }
      } catch (aiError) {
        console.warn('⚠️ AI unavailable:', aiError.message);
      }

      console.log('📤 Sending to server with analysis:', analysis);
      const result = await sendToTelegram({
        name: formData.name,
        email: formData.email,
        message: formData.message,
        analysis: analysis
      });

      console.log('📥 Server response:', result);

      if (result.success) {
        console.log('✅ Form submission successful!');
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setSubmitStatus(null), 5000);
      } else {
        console.error('❌ Form submission failed:', result.error);
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('❌ Form error:', error.message);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className="w-full max-w-lg"
    >
      <div className={`backdrop-blur-sm border rounded-xl p-8 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/40 border-cyan-500/20 shadow-lg shadow-cyan-500/10'
          : 'bg-white/70 border-blue-500/20 shadow-lg shadow-blue-500/10'
      }`}>
        <h3 className={`text-2xl font-bold mb-6 ${
          isDarkMode ? 'text-cyan-400' : 'text-blue-600'
        }`}>Send Message</h3>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Name</label>
            <div className="relative">
              <User size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                } focus:outline-none`}
                placeholder="Your name"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Email</label>
            <div className="relative">
              <Mail size={20} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-300 ${
                  isDarkMode 
                    ? 'bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                } focus:outline-none`}
                placeholder="your.email@example.com"
              />
            </div>
          </div>

          <div>
            <label htmlFor="message" className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>Message</label>
            <div className="relative">
              <MessageSquare size={20} className={`absolute left-3 top-3 ${
                isDarkMode ? 'text-gray-400' : 'text-gray-500'
              }`} />
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={5}
                className={`w-full pl-11 pr-4 py-3 rounded-lg border transition-all duration-300 resize-none ${
                  isDarkMode 
                    ? 'bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20'
                    : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20'
                } focus:outline-none`}
                placeholder="Tell me about your project or just say hello!"
              />
            </div>
          </div>

          <motion.button
            type="submit"
            disabled={isSubmitting}
            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
            className={`w-full py-3 rounded-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 ${
              isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:shadow-lg'
            } ${
              isDarkMode 
                ? 'bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:shadow-cyan-500/25'
                : 'bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:shadow-blue-500/25'
            }`}
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
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

        {submitStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-4 p-4 rounded-lg flex items-center gap-3 ${
              submitStatus === 'success'
                ? (isDarkMode 
                    ? 'bg-green-500/20 border border-green-500/30 text-green-400'
                    : 'bg-green-500/20 border border-green-500/30 text-green-700'
                  )
                : (isDarkMode 
                    ? 'bg-red-500/20 border border-red-500/30 text-red-400'
                    : 'bg-red-500/20 border border-red-500/30 text-red-700'
                  )
            }`}
          >
            {submitStatus === 'success' ? (
              <>
                <Check size={20} />
                <span>Message sent successfully! I'll get back to you soon.</span>
              </>
            ) : (
              <>
                <X size={20} />
                <span>Failed to send. Please try again or contact me directly.</span>
              </>
            )}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
