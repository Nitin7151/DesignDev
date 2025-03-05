import React from 'react';
import { motion } from 'framer-motion';
import { Code, Zap, Shield, Sparkles, Layers, Repeat } from 'lucide-react';

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}> = ({ icon, title, description, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-gradient-to-br from-gray-800/90 to-gray-900/90 p-6 rounded-xl border border-gray-700 hover:border-yellow-400/50 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20 backdrop-blur-sm relative overflow-hidden group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-blue-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400/20 to-blue-600/20 text-yellow-400 mb-4 shadow-inner shadow-yellow-400/10 group-hover:shadow-yellow-400/30 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100 group-hover:from-yellow-400 group-hover:to-yellow-200 transition-all duration-300">{title}</h3>
        <p className="text-gray-300 group-hover:text-gray-200 transition-colors duration-300">{description}</p>
      </div>
    </motion.div>
  );
};

const Features: React.FC = () => {
  const features = [
    {
      icon: <Code size={24} />,
      title: "Clean Code Generation",
      description: "Our AI generates clean, maintainable code that follows best practices and modern standards."
    },
    {
      icon: <Zap size={24} />,
      title: "Lightning Fast",
      description: "Get your prototype in minutes, not days. Save time and focus on what matters most."
    },
    {
      icon: <Shield size={24} />,
      title: "Secure By Design",
      description: "All generated code follows security best practices to keep your applications safe."
    },
    {
      icon: <Sparkles size={24} />,
      title: "AI-Powered",
      description: "Leveraging cutting-edge AI to understand your requirements and create perfect prototypes."
    },
    {
      icon: <Layers size={24} />,
      title: "Customizable",
      description: "Easily modify and extend the generated code to fit your specific needs and requirements."
    },
    {
      icon: <Repeat size={24} />,
      title: "Iterative Development",
      description: "Refine your prototype through multiple iterations with simple prompt adjustments."
    }
  ];

  return (
    <section id="features" className="py-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-blue-600/10 opacity-40"></div>
      <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse opacity-60"></div>
      <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-500">
            Powerful Features
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our platform offers everything you need to transform your ideas into working prototypes quickly and efficiently.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard 
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;