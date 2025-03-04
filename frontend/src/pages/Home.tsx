import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/axios';

import Hero from '../components/Hero';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Stats from '../components/Stats';
import Footer from '../components/Footer';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
        navigate('/login');
        return;
      }

      // Make the API call to generate template
      const response = await axiosInstance.post('/ai/template', { 
        prompt,
        language: 'typescript' // Adding required language parameter
      });

      // Navigate to builder with the response data
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
          <Hero 
            prompt={prompt}
            setPrompt={setPrompt}
            handleSubmit={handleSubmit}
            error={error}
            loading={loading}
          />
          
          <HowItWorks />
          
          <Stats />
          
          <Features />
          
          <Testimonials />
        </main>
        
        <Footer />
      </div>
    </div>
  );
}

export default Home;