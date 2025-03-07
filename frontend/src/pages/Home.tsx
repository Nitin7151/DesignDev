import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axiosInstance from '../utils/axios';

import Hero from '../components/Hero';
import ReplitStyleDemo from '../components/ReplitStyleDemo';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showHeroImage, setShowHeroImage] = useState(true);
  const [hoveredOption, setHoveredOption] = useState<number | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Preview images for each option
  const previewImages = {
    1: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Todo list
    2: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // E-commerce
    3: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80", // Blog
    default: "https://images.unsplash.com/photo-1618788372246-79faff0c3742?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" // Default
  };
  
  // Check if user was redirected from login
  useEffect(() => {
    const { state } = location;
    if (state && state.fromLogin && state.prompt) {
      setPrompt(state.prompt);
    }
  }, [location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError('Please enter a prompt');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Check if user is logged in
      const token = localStorage.getItem('token');
      if (!token) {
        // Save the prompt and redirect to login
        navigate('/login', { state: { prompt } });
        return;
      }

      // --------------------------------yahan template generate hori hai-------------------------------------------
      console.log('Sending prompt with options:', prompt);
      const response = await axiosInstance.post('/ai/template', { 
        prompt,
        language: 'typescript' 
      });

      // -----------------------------------Navigate to builder with the response data---------------------------
      navigate('/builder', { 
        state: { 
          code: response.data,
          prompt: prompt 
        } 
      });
    } catch (err: any) {
      console.error('API Error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError(err.response?.data?.message || 'Failed to connect to the server. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80')] opacity-10 bg-cover bg-center"></div>
      <div className="relative z-10">
        <main>
          <div className="flex flex-col lg:flex-row">
            <div className="lg:w-3/5">
              <Hero 
                prompt={prompt}
                setPrompt={setPrompt}
                handleSubmit={handleSubmit}
                error={error}
                loading={loading}
                setHoveredOption={setHoveredOption}
              />
            </div>
            
            {showHeroImage && (
              <div className="lg:w-2/5 hidden lg:flex items-center justify-center p-10">
                <div className="relative w-full max-w-md">
                  {/* Dynamic background glow based on hovered option */}
                  {hoveredOption === 1 && (
                    <motion.div 
                      className="absolute -inset-10 bg-gradient-to-r from-yellow-300/50 to-yellow-500/50 rounded-2xl blur-3xl opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  )}
                  {hoveredOption === 2 && (
                    <motion.div 
                      className="absolute -inset-10 bg-gradient-to-r from-green-300/50 to-green-500/50 rounded-2xl blur-3xl opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  )}
                  {hoveredOption === 3 && (
                    <motion.div 
                      className="absolute -inset-10 bg-gradient-to-r from-red-300/50 to-red-500/50 rounded-2xl blur-3xl opacity-70"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    ></motion.div>
                  )}
                  {hoveredOption === null && (
                    <div className="absolute -inset-5 bg-gradient-to-r from-blue-600/40 to-purple-600/40 rounded-2xl blur-3xl opacity-50 animate-pulse"></div>
                  )}
                  <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden shadow-2xl">
                    <div className="p-2 bg-gray-900/80 border-b border-gray-700 flex items-center">
                      <div className="flex space-x-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      </div>
                      <div className="mx-auto text-xs text-gray-400">Preview</div>
                    </div>
                    <div className="p-4 h-96 overflow-hidden">
                      <div className="relative w-full h-full">
                        {Object.entries(previewImages).map(([key, url]) => (
                          <motion.img 
                            key={key}
                            src={url}
                            alt={`Option ${key} preview`}
                            className="w-full h-full object-cover rounded-lg absolute top-0 left-0"
                            initial={{ opacity: 0 }}
                            animate={{ 
                              opacity: hoveredOption === parseInt(key) || (key === 'default' && hoveredOption === null) ? 1 : 0 
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <ReplitStyleDemo />
          
          <HowItWorks />
          
          <Stats />
          
          <Features />
          
          <Testimonials />
        </main>
      </div>
    </div>
  );
}

export default Home;