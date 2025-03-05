import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, Paperclip, Zap, ArrowUp, Code, Layout, Palette } from 'lucide-react';
import './starAnimation.css';

const ReplitStyleDemo: React.FC = () => {
  const [prompt, setPrompt] = useState('Build a booking website where clients can see my availability and schedule appointments. Send confirmation emails and reminders.');

  return (
    <div className="py-20 px-4 bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 overflow-hidden relative">
      {/* Animated background stars */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 100 }).map((_, i) => (
          <div 
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.2,
              animation: `twinkle ${Math.random() * 5 + 2}s infinite`
            }}
          />
        ))}
      </div>
      
      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-yellow-300/15 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/3 -right-20 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute top-2/3 left-1/3 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl animate-pulse"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Left side - Text content */}
          <motion.div 
            className="lg:w-1/2 text-left"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400">Design</span>
              <span className="text-white"> + </span>
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-blue-600">Development</span>
              <span className="text-white"> made simple</span>
            </h2>
            
            <p className="text-gray-300 text-xl mb-8 leading-relaxed">
              Transform your ideas into reality with DesignDev, your AI-powered design and development assistant.
            </p>
            
            <div className="space-y-4 mb-8">
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center">
                  <Code className="text-white" size={20} />
                </div>
                <span className="text-white font-medium">Generate clean, production-ready code</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <Layout className="text-white" size={20} />
                </div>
                <span className="text-white font-medium">Build responsive, modern interfaces</span>
              </motion.div>
              
              <motion.div 
                className="flex items-center space-x-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                  <Palette className="text-white" size={20} />
                </div>
                <span className="text-white font-medium">Create stunning visual designs</span>
              </motion.div>
            </div>
            
            <motion.a 
              href="#prompt-section"
              className="bg-gradient-to-r from-yellow-200 via-blue-200 to-yellow-300 hover:from-yellow-300 hover:via-blue-300 hover:to-yellow-400 text-gray-800 font-bold py-3 px-8 rounded-lg shadow-lg transform transition-all hover:scale-105 hover:shadow-xl inline-block relative overflow-hidden"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              animate={{
                boxShadow: [
                  '0 10px 15px -3px rgba(252, 211, 77, 0.3), 0 4px 6px -2px rgba(252, 211, 77, 0.1)',
                  '0 10px 15px -3px rgba(96, 165, 250, 0.3), 0 4px 6px -2px rgba(96, 165, 250, 0.1)',
                  '0 10px 15px -3px rgba(252, 211, 77, 0.3), 0 4px 6px -2px rgba(252, 211, 77, 0.1)'
                ]
              }}
              transition={{
                boxShadow: {
                  repeat: Infinity,
                  duration: 2
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                const promptSection = document.getElementById('prompt-section');
                if (promptSection) {
                  promptSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            >
              <span className="relative z-10">Start Building Now</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-200/50 via-blue-200/50 to-yellow-300/50"
                animate={{ x: ['100%', '-100%'] }}
                transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
              />
            </motion.a>
          </motion.div>
          
          {/* Right side - Interactive demo */}
          <motion.div 
            className="lg:w-1/2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-300 to-blue-600 rounded-2xl blur opacity-20 animate-pulse"></div>
              <div className="relative bg-gray-800/90 backdrop-blur-sm p-6 rounded-2xl border border-gray-700 shadow-2xl overflow-hidden">
                <div className="p-2 bg-gray-900/80 border-b border-gray-700 flex items-center rounded-t-lg mb-4">
                  <div className="flex space-x-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <div className="mx-auto text-xs text-gray-400">design-dev.ai</div>
                </div>
                
                <div className="flex items-center mb-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-300 to-blue-600 flex items-center justify-center mr-4">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 17L12 22L22 17" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <h3 className="text-xl text-white font-medium">What do you want to build today?</h3>
                </div>

                <div className="bg-gray-900/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-gray-800">
                  <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="w-full bg-transparent text-white border-none outline-none resize-none"
                    rows={4}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-wrap gap-2">
                    <motion.button 
                      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg transition-colors"
                      whileHover={{ y: -2, backgroundColor: 'rgba(55, 65, 81, 1)' }}
                    >
                      <Mic size={16} />
                      <span>Voice</span>
                    </motion.button>
                    <motion.button 
                      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg transition-colors"
                      whileHover={{ y: -2, backgroundColor: 'rgba(55, 65, 81, 1)' }}
                    >
                      <Paperclip size={16} />
                      <span>Attach</span>
                    </motion.button>
                    <motion.button 
                      className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 text-gray-300 py-2 px-3 rounded-lg transition-colors"
                      whileHover={{ y: -2, backgroundColor: 'rgba(55, 65, 81, 1)' }}
                    >
                      <Zap size={16} />
                      <span>Enhance</span>
                    </motion.button>
                  </div>
                  <motion.button 
                    className="bg-gradient-to-r from-yellow-300 to-blue-600 hover:from-yellow-400 hover:to-blue-700 text-white p-2 rounded-lg"
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ArrowUp size={20} />
                  </motion.button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ReplitStyleDemo;
