'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, CheckCircle, AlertCircle } from 'lucide-react';

export default function ContactForm({ isDarkMode }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setResponseMessage('');

    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setResponseMessage(data.message);
        // Clear the form
        setFormData({
          name: '',
          email: '',
          message: ''
        });
      } else {
        setStatus('error');
        setResponseMessage(data.error || 'Failed to send message.');
      }
    } catch (error) {
      setStatus('error');
      setResponseMessage('Network error. Please check your connection and try again.');
    }

    // Reset status after 5 seconds
    setTimeout(() => {
      setStatus('idle');
      setResponseMessage('');
    }, 5000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      className={`backdrop-blur-sm border rounded-xl p-8 transition-all duration-500 ${
        isDarkMode 
          ? 'bg-black/40 border-cyan-500/20 shadow-lg shadow-cyan-500/10'
          : 'bg-white/70 border-blue-500/20 shadow-lg shadow-blue-500/10'
      }`}
    >
      <h3 className={`text-2xl font-bold mb-6 ${
        isDarkMode ? 'text-cyan-400' : 'text-blue-600'
      }`}>
        Send Me a Message
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <label 
            htmlFor="name" 
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Your Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 ${
              isDarkMode 
                ? 'bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
            placeholder="Enter your full name"
            disabled={status === 'sending'}
          />
        </motion.div>

        {/* Email Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <label 
            htmlFor="email" 
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 ${
              isDarkMode 
                ? 'bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
            placeholder="your.email@example.com"
            disabled={status === 'sending'}
          />
        </motion.div>

        {/* Message Field */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label 
            htmlFor="message" 
            className={`block text-sm font-medium mb-2 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}
          >
            Your Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            rows={5}
            className={`w-full px-4 py-3 rounded-lg border transition-colors duration-300 focus:outline-none focus:ring-2 resize-vertical ${
              isDarkMode 
                ? 'bg-black/50 border-gray-600 text-white placeholder-gray-400 focus:ring-cyan-500/50 focus:border-cyan-500'
                : 'bg-white/80 border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500/50 focus:border-blue-500'
            }`}
            placeholder="Tell me about your project or just say hello..."
            disabled={status === 'sending'}
          />
        </motion.div>

        {/* Status Message */}
        {responseMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center gap-3 p-4 rounded-lg ${
              status === 'success'
                ? (isDarkMode ? 'bg-green-500/10 border border-green-500/30 text-green-400' : 'bg-green-50 border border-green-200 text-green-700')
                : (isDarkMode ? 'bg-red-500/10 border border-red-500/30 text-red-400' : 'bg-red-50 border border-red-200 text-red-700')
            }`}
          >
            {status === 'success' ? (
              <CheckCircle size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <p className="text-sm">{responseMessage}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={status === 'sending'}
          whileHover={{ scale: status === 'sending' ? 1 : 1.02 }}
          whileTap={{ scale: status === 'sending' ? 1 : 0.98 }}
          className={`w-full px-8 py-4 rounded-lg font-medium flex items-center justify-center gap-3 transition-all duration-300 ${
            status === 'sending'
              ? (isDarkMode ? 'bg-gray-600 cursor-not-allowed' : 'bg-gray-400 cursor-not-allowed')
              : (isDarkMode 
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 hover:shadow-lg hover:shadow-cyan-500/25'
                  : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-400 hover:to-purple-400 hover:shadow-lg hover:shadow-blue-500/25')
          } text-white text-lg`}
        >
          {status === 'sending' ? (
            <>
              <Loader size={20} className="animate-spin" />
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

    </motion.div>
  );
}
