import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wand2, Sparkles, Code, Lightbulb } from 'lucide-react';
import Bubbles from './Bubbles';

interface HeroProps {
  prompt: string;
  setPrompt: (value: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  error: string | null;
  loading: boolean;
  setHoveredOption: (id: number | null) => void;
}

const Hero: React.FC<HeroProps> = ({ prompt, setPrompt, handleSubmit, error, loading, setHoveredOption }) => {
  const [showTextArea, setShowTextArea] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [showOptions, setShowOptions] = useState(false);
  const [optionDarkMode, setOptionDarkMode] = useState(false);
  const [optionResponsive, setOptionResponsive] = useState(false);
  const [optionAccessibility, setOptionAccessibility] = useState(false);
  
  // Predefined prompt options
  const promptOptions = [
    {
      id: 1,
      title: "Todo List App",
      description: "Create a prototype of a todo list application with tasks, categories, and reminders",
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 2,
      title: "E-commerce Website",
      description: "Build a modern e-commerce website with product listings, cart, and checkout",
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 3,
      title: "Blog Platform",
      description: "Design a blog with articles, categories, and comment system",
      icon: <Lightbulb className="w-5 h-5" />
    }
  ];
  
  const handlePromptOptionClick = (description: string) => {
    setSelectedPrompt(description);
    setPrompt(description);
    setShowTextArea(true);
  };
  
  const handleCustomPromptClick = () => {
    setSelectedPrompt(null);
    setShowTextArea(true);
  };
  return (
    <div id="prompt-section" className="relative min-h-[90vh] flex flex-col items-center justify-center text-center py-24 px-4 overflow-hidden">
      <Bubbles />
      
      {/* Add subtle yellow glow effect */}
      <div className="absolute top-20 left-20 w-96 h-96 bg-yellow-300/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-blue-600/15 rounded-full blur-3xl"></div>
      
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
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-300/40 to-blue-600/40 blur-xl opacity-40 animate-pulse"></div>
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
          <span className="block bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-blue-400 to-blue-500">
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
        
        <motion.div 
          className="w-full max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          {!showTextArea ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {promptOptions.map((option) => {
                // Define different colors for each option
                const colors = {
                  1: {
                    hover: 'from-yellow-300/40 to-yellow-500/40',
                    icon: 'from-yellow-300 to-yellow-500',
                    shadow: '0 10px 30px -5px rgba(234, 179, 8, 0.5)'
                  },
                  2: {
                    hover: 'from-green-300/40 to-green-500/40',
                    icon: 'from-green-300 to-green-500',
                    shadow: '0 10px 30px -5px rgba(34, 197, 94, 0.5)'
                  },
                  3: {
                    hover: 'from-red-300/40 to-red-500/40',
                    icon: 'from-red-300 to-red-500',
                    shadow: '0 10px 30px -5px rgba(239, 68, 68, 0.5)'
                  }
                };
                
                return (
                  <motion.div
                    key={option.id}
                    onClick={() => handlePromptOptionClick(option.description)}
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-xl p-6 cursor-pointer transition-all group relative overflow-hidden"
                    whileHover={{ 
                      scale: 1.02,
                      boxShadow: colors[option.id as keyof typeof colors].shadow
                    }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-r ${colors[option.id as keyof typeof colors].hover} opacity-0 group-hover:opacity-100 transition-all duration-300`}></div>
                    {/* Additional glow effect for stronger visibility */}
                    <div className={`absolute -inset-1 bg-gradient-to-r ${colors[option.id as keyof typeof colors].hover} opacity-0 group-hover:opacity-100 blur-md transition-all duration-300`}></div>
                    <div className={`flex items-center justify-center mb-3 bg-gradient-to-r ${colors[option.id as keyof typeof colors].icon} w-10 h-10 rounded-full`}>
                      {option.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{option.title}</h3>
                    <p className="text-gray-400 text-sm">{option.description}</p>
                  </motion.div>
                );
              })}
            </div>
          ) : null}
          
          <AnimatePresence>
            {!showTextArea ? (
              <motion.div 
                className="flex justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.button
                  onClick={handleCustomPromptClick}
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-blue-900/20 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Wand2 className="w-4 h-4" />
                  <span>Enter prompt manually</span>
                </motion.button>
              </motion.div>
            ) : null}
          </AnimatePresence>
          
          <AnimatePresence>
            {showTextArea && (
              <motion.form 
                onSubmit={handleSubmit}
                className="w-full"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <div className="relative">
                  {selectedPrompt && (
                    <motion.div 
                      className="absolute top-0 left-0 w-full flex justify-center"
                      initial={{ y: -50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30, delay: 0.1 }}
                    >
                      <div className="bg-blue-600/30 backdrop-blur-sm text-blue-200 py-2 px-4 rounded-t-lg text-sm">
                        Selected template: {promptOptions.find(opt => opt.description === selectedPrompt)?.title}
                      </div>
                    </motion.div>
                  )}
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
                
                <div className="flex gap-4 mt-6">
                  <motion.button
                    type="button"
                    onClick={() => {
                      setShowTextArea(false);
                      setSelectedPrompt(null);
                    }}
                    className="flex-1 bg-gray-800 text-white py-4 px-8 rounded-xl font-medium transition-all border border-gray-700"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Back
                  </motion.button>
                  
                  <motion.button
                    type="button"
                    onClick={() => setShowOptions(!showOptions)}
                    disabled={loading}
                    className={`flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 ${
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
                </div>
                
                <AnimatePresence>
                  {showOptions && (
                    <motion.div 
                      className="mt-8 relative"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      {/* Background glow effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300/15 to-blue-600/20 rounded-xl blur-xl -z-10"></div>
                      
                      <div className="p-8 bg-gray-800/90 backdrop-blur-sm border border-gray-700 rounded-xl shadow-2xl relative overflow-hidden">
                        {/* Decorative elements */}
                        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-600/10 to-purple-600/10 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-600/10 to-purple-600/10 rounded-full blur-3xl -z-10"></div>
                        
                        <motion.h3 
                          className="text-xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-blue-500 flex items-center"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <Sparkles className="w-5 h-5 mr-2 text-yellow-300" />
                          Customize Your Project
                        </motion.h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <motion.div 
                            className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-lg border border-gray-800 hover:border-yellow-400/30 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                          >
                            <div className="absolute inset-0 bg-yellow-300/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
                            <div className="absolute -inset-1 bg-yellow-300/5 opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 rounded-lg"></div>
                            <motion.div 
                              className="flex flex-col space-y-3 h-full" 
                              onClick={() => setOptionDarkMode(!optionDarkMode)}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className="relative flex items-center justify-center w-5 h-5 cursor-pointer"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <div className="absolute inset-0 bg-gray-700 rounded border border-gray-600"></div>
                                  {optionDarkMode && (
                                    <motion.div 
                                      className="absolute inset-0 bg-yellow-400 rounded flex items-center justify-center"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </motion.div>
                                <span className="text-gray-200 font-medium cursor-pointer">Dark Mode</span>
                              </div>
                              <p className="text-gray-400 text-sm mt-auto">Create a dark-themed UI for better eye comfort</p>
                            </motion.div>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-lg border border-gray-800 hover:border-green-400/30 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                          >
                            <div className="absolute inset-0 bg-green-300/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
                            <div className="absolute -inset-1 bg-green-300/5 opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 rounded-lg"></div>
                            <motion.div 
                              className="flex flex-col space-y-3 h-full" 
                              onClick={() => setOptionResponsive(!optionResponsive)}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className="relative flex items-center justify-center w-5 h-5 cursor-pointer"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <div className="absolute inset-0 bg-gray-700 rounded border border-gray-600"></div>
                                  {optionResponsive && (
                                    <motion.div 
                                      className="absolute inset-0 bg-green-400 rounded flex items-center justify-center"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </motion.div>
                                <span className="text-gray-200 font-medium cursor-pointer">Responsive Design</span>
                              </div>
                              <p className="text-gray-400 text-sm mt-auto">Optimize for all screen sizes and devices</p>
                            </motion.div>
                          </motion.div>
                          
                          <motion.div 
                            className="bg-gray-900/50 backdrop-blur-sm p-5 rounded-lg border border-gray-800 hover:border-red-400/30 transition-all"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                          >
                            <div className="absolute inset-0 bg-red-300/10 opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-lg"></div>
                            <div className="absolute -inset-1 bg-red-300/5 opacity-0 group-hover:opacity-100 blur-md transition-all duration-300 rounded-lg"></div>
                            <motion.div 
                              className="flex flex-col space-y-3 h-full" 
                              onClick={() => setOptionAccessibility(!optionAccessibility)}
                              whileTap={{ scale: 0.98 }}
                            >
                              <div className="flex items-center space-x-3">
                                <motion.div 
                                  className="relative flex items-center justify-center w-5 h-5 cursor-pointer"
                                  whileTap={{ scale: 0.9 }}
                                >
                                  <div className="absolute inset-0 bg-gray-700 rounded border border-gray-600"></div>
                                  {optionAccessibility && (
                                    <motion.div 
                                      className="absolute inset-0 bg-red-400 rounded flex items-center justify-center"
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                    >
                                      <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-gray-900" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    </motion.div>
                                  )}
                                </motion.div>
                                <span className="text-gray-200 font-medium cursor-pointer">Accessibility</span>
                              </div>
                              <p className="text-gray-400 text-sm mt-auto">Include features for better accessibility</p>
                            </motion.div>
                          </motion.div>
                        </div>
                        
                        <motion.button
                          type="submit"
                          onClick={(e) => {
                            e.preventDefault();
                            // Add options to the prompt if selected
                            let finalPrompt = prompt;
                            const options = [];
                            
                            if (optionDarkMode) options.push('dark mode');
                            if (optionResponsive) options.push('responsive design');
                            if (optionAccessibility) options.push('accessibility features');
                            
                            if (options.length > 0) {
                              finalPrompt += " with " + options.join(", ");
                              setPrompt(finalPrompt);
                              console.log('Updated prompt with options:', finalPrompt);
                            }
                            
                            // Submit the form with a slight delay to ensure prompt is updated
                            setTimeout(() => {
                              handleSubmit(e);
                            }, 100);
                          }}
                          className="mt-8 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-medium transition-all shadow-lg shadow-blue-600/20 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-1"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 }}
                        >
                          <span className="flex items-center justify-center">
                            <Wand2 className="w-5 h-5 mr-2" />
                            Generate Now
                          </span>
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.form>
            )}
          </AnimatePresence>
        </motion.div>
        
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