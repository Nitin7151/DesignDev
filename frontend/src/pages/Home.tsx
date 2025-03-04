import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wand2 } from 'lucide-react';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import Navbar from '../components/Navbar';
import Features from '../components/Features';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import Bubbles from '../components/Bubbles';

export function Home() {
  const [prompt, setPrompt] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);

    try {
      // Test the API connection first
      await axios.get(`${BACKEND_URL}/health`);
      navigate('/builder', { state: { prompt } });
    } catch (err: any) {
      console.error('API Error:', err);
      setError(err.response?.data?.message || 'Failed to connect to the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white relative">
      <Navbar />
      <div className="relative flex flex-col items-center text-center py-24 px-4">
        <Bubbles />
        <Wand2 className="w-16 h-16 text-blue-400 mb-4 animate-pulse" />
        <h1 className="text-5xl font-extrabold leading-tight mb-4">
          Convert Your PRD into Working Prototype in Minutes
        </h1>
        <p className="text-lg max-w-2xl">
          Prompt your website, and we will make it for you.
        </p>
        <form onSubmit={handleSubmit} className="mt-6 w-full max-w-xl">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the website you want to build..."
            className="w-full h-32 p-4 bg-gray-900 text-gray-100 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500"
          />
          {error && (
            <div className="mt-4 text-red-400 text-sm">{error}</div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full mt-4 bg-blue-600 text-gray-100 py-3 px-6 rounded-lg font-medium transition-all ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'}`}
          >
            {loading ? 'Processing...' : 'Convert Your PRD into Prototype'}
          </button>
        </form>
      </div>
      <Testimonials />
      <Features />
      <Footer />
    </div>
  );
}

export default Home;
