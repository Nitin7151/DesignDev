import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Clock, Brain, Sparkles, ChevronRight } from 'lucide-react';

const About = () => {
  const features = [
    {
      icon: <Brain className="w-6 h-6" />,
      title: 'AI-Powered Development',
      description: 'Transform your Product Requirements into working prototypes within minutes using advanced AI technology.',
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: 'Lightning Fast',
      description: 'Generate full-stack projects instantly, saving weeks of development time and resources.',
    },
    {
      icon: <Code className="w-6 h-6" />,
      title: 'Production Ready',
      description: 'Get clean, maintainable code that follows best practices and modern development standards.',
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: 'Rapid Iteration',
      description: 'Quickly iterate and refine your projects with simple prompts and real-time updates.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative overflow-hidden pt-16 pb-32"
      >
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 mix-blend-multiply" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
              Revolutionizing Development
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto">
              Transform your ideas into reality with our AI-powered development platform. 
              Create full-stack applications in minutes, not months.
            </p>
          </motion.div>
        </div>
      </motion.div>

      {/* Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-blue-500/50 transition-all duration-300 group"
            >
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors duration-300">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Process Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Write Your Prompt', description: 'Describe your project requirements in natural language' },
            { step: '02', title: 'AI Processing', description: 'Our AI analyzes and converts your requirements into code' },
            { step: '03', title: 'Get Your Project', description: 'Receive a complete, production-ready application' },
          ].map((item, index) => (
            <motion.div
              key={index}
              whileHover={{ y: -5 }}
              className="relative group"
            >
              <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
                <div className="text-5xl font-bold text-purple-500/20 group-hover:text-purple-500/30 transition-colors duration-300 mb-4">
                  {item.step}
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
              {index < 2 && (
                <ChevronRight className="hidden md:block absolute top-1/2 -right-6 w-6 h-6 text-gray-600 transform -translate-y-1/2" />
              )}
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
      >
        <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-12 rounded-3xl backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Development?</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building the future with AI-powered development.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300"
          >
            Get Started Now
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Elements */}
      <div className="fixed top-1/4 left-10 animate-pulse">
        <Sparkles className="w-6 h-6 text-blue-500/20" />
      </div>
      <div className="fixed bottom-1/4 right-10 animate-pulse delay-150">
        <Sparkles className="w-6 h-6 text-purple-500/20" />
      </div>
    </div>
  );
};

export default About;
