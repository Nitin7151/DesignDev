import React from 'react';
import { motion } from 'framer-motion';
import { Wand2 } from 'lucide-react';
import Bubbles from './Bubbles';

interface HeroProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  loading: boolean;
}

const Hero: React.FC<HeroProps> = ({ prompt, setPrompt, handleSubmit, error, loading }) => {
  return (
    <div className="relative min-h-[90vh] flex flex-col items-center justify-center text-center py-24 px-4 overflow-hidden">
      <Bubbles />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-4xl mx-auto"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            delay: 0.2,
            duration: 0.8
          }}
          className="mb-6 inline-block"
        >
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-blue-600 blur-xl opacity-30 animate-pulse"></div>
            <div className="relative bg-gradient-to-br from-blue-600 to-purple-600 p-4 rounded-full">
              <Wand2 className="w-10 h-10 text-white" />
            </div>
          </div>
        </motion.div>
        
        <motion.h1 
          className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-blue-500">
            Convert Your PRD
          </span>
          <span className="block text-white">
            Into Working Prototype
          </span>
          <span className="block text-blue-400">
            In Minutes
          </span>
        </motion.h1>
        
        <motion.p 
          className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          Describe your website, and our AI will transform your words into a fully functional prototype instantly.
        </motion.p>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the website you want to build..."
              className="w-full h-40 p-6 bg-gray-800/80 backdrop-blur-sm text-gray-100 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 shadow-xl"
            />
            <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-blue-600/20 to-purple-600/20 blur-xl opacity-30"></div>
          </div>
          
          {error && (
            <div className="mt-4 text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
              {error}
            </div>
          )}
          
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 ${
              loading ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1'
            }`}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </div>
            ) : (
              'Transform Your Idea Into Reality'
            )}
          </motion.button>
        </motion.form>
        
        <motion.div 
          className="mt-8 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <p>No credit card required • Free to use • Instant results</p>
        </motion.div>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ 
          duration: 0.5, 
          delay: 1.2,
          repeat: Infinity,
          repeatType: "reverse",
          repeatDelay: 0.5
        }}
      >
        <a href="#how-it-works" className="text-gray-400 flex flex-col items-center">
          <span className="mb-2">Scroll to learn more</span>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5V19M12 19L19 12M12 19L5 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </a>
      </motion.div>
    </div>
  );
};

export default Hero;