import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Code, Zap, Clock, Brain, Sparkles, ChevronRight, Users, Rocket, Award, Cpu } from 'lucide-react';
import Carousel from '../components/Carousel';
import GlowingCard from '../components/GlowingCard';
import FloatingIcons from '../components/FloatingIcons';
import TeamMember from '../components/TeamMember';

const About = () => {
  // Parallax scroll effect
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 300]);
  
  // Team members data
  const teamMembers = [
    {
      name: 'Alex Johnson',
      role: 'Founder & CEO',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Former AI researcher with a passion for making development accessible to everyone.',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
    {
      name: 'Sarah Chen',
      role: 'CTO',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Full-stack developer with 10+ years of experience building scalable applications.',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com'
      }
    },
    {
      name: 'Michael Rodriguez',
      role: 'Lead AI Engineer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Specialized in machine learning and natural language processing systems.',
      social: {
        github: 'https://github.com',
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    },
    {
      name: 'Emily Williams',
      role: 'Product Designer',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
      bio: 'Creates beautiful, intuitive interfaces that make complex tasks simple.',
      social: {
        linkedin: 'https://linkedin.com',
        twitter: 'https://twitter.com'
      }
    }
  ];
  
  // Carousel slides data
  const carouselSlides = [
    {
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Our Mission',
      description: 'To democratize software development by making it accessible to everyone, regardless of technical background.'
    },
    {
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Our Team',
      description: 'A diverse group of engineers, designers, and AI specialists working together to revolutionize development.'
    },
    {
      image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Our Values',
      description: 'Innovation, accessibility, and excellence in everything we build and deliver to our users.'
    },
    {
      image: 'https://images.unsplash.com/photo-1581092335397-9fa73b6c660d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      title: 'Our Technology',
      description: 'Cutting-edge AI and machine learning algorithms that understand your requirements and generate optimal code solutions.'
    }
  ];
  
  // Features data
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white relative overflow-hidden">
      {/* Floating Icons Background */}
      <FloatingIcons />
      
      {/* Hero Section with 3D Effect */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative pt-16 pb-20"
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
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: 'spring',
                stiffness: 200,
                damping: 10
              }}
            >
              Revolutionizing Development
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Transform your ideas into reality with our AI-powered development platform. 
              Create full-stack applications in minutes, not months.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>

      {/* Carousel Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            About Our Company
          </h2>
          <Carousel slides={carouselSlides} />
        </motion.div>
      </div>

      {/* 3D Features Grid */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Our Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <GlowingCard 
              key={index} 
              className="p-8"
              glowColor={index % 2 === 0 ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}
            >
              <motion.div
                variants={itemVariants}
                className="flex items-start space-x-4"
              >
                <motion.div 
                  className="p-3 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-xl"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  {feature.icon}
                </motion.div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-100">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            </GlowingCard>
          ))}
        </div>
      </motion.div>

      {/* Team Section with 3D Cards */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16"
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-10 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
          Meet Our Team
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <TeamMember {...member} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Process Section with 3D Effect */}
      <motion.div 
        style={{ y }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/5 to-transparent z-0"></div>
        <div className="relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-bold mb-16 text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text"
          >
            How It Works
          </motion.h2>
          
          {/* Process Steps with connecting line */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 transform -translate-y-1/2 rounded-full z-0 opacity-30"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
              {[
                { step: '01', title: 'Write Your Prompt', description: 'Describe your project requirements in natural language - no coding skills required', icon: <Brain className="w-8 h-8 text-blue-400" /> },
                { step: '02', title: 'AI Processing', description: 'Our advanced AI analyzes and converts your requirements into clean, efficient code', icon: <Cpu className="w-8 h-8 text-purple-400" /> },
                { step: '03', title: 'Get Your Project', description: 'Receive a complete, production-ready application with all the features you requested', icon: <Rocket className="w-8 h-8 text-pink-400" /> },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative group"
                >
                  <GlowingCard 
                    className="p-8 h-full" 
                    glowColor={
                      index === 0 ? "from-blue-500 to-indigo-500" : 
                      index === 1 ? "from-indigo-500 to-purple-500" : 
                      "from-purple-500 to-pink-500"
                    }
                  >
                    <div className="flex flex-col items-center text-center h-full">
                      {/* Step number with pulsing effect */}
                      <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/30 to-purple-500/30 blur-xl animate-pulse"></div>
                        <div className="text-5xl font-bold bg-gradient-to-br from-purple-400 to-pink-500 text-transparent bg-clip-text mb-4 relative">
                          {item.step}
                        </div>
                      </div>
                      
                      {/* Icon with hover effect */}
                      <motion.div 
                        className="p-4 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full mb-6 shadow-xl relative"
                        whileHover={{ rotate: 10, scale: 1.1 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-md"></div>
                        <div className="relative">
                          {item.icon}
                        </div>
                      </motion.div>
                      
                      {/* Content */}
                      <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                      <p className="text-gray-300">{item.description}</p>
                    </div>
                  </GlowingCard>
                  
                  {/* Connection arrows */}
                  {index < 2 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      viewport={{ once: true }}
                      className="hidden md:flex absolute top-1/2 -right-4 transform -translate-y-1/2 z-20"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <ChevronRight className="w-5 h-5 text-white" />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section with Glow */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center"
      >
        <GlowingCard className="p-12" glowColor="from-blue-500 to-purple-500">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            Ready to Transform Your Development?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of developers who are building the future with AI-powered development.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(124, 58, 237, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-semibold text-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-lg"
          >
            Get Started Now
          </motion.button>
        </GlowingCard>
      </motion.div>
    </div>
  );
};

export default About;
