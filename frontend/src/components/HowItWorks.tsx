import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Code2, Laptop, Rocket } from 'lucide-react';

interface StepProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  step: number;
  delay: number;
}

const Step: React.FC<StepProps> = ({ icon, title, description, step, delay }) => {
  return (
    <motion.div 
      className="flex flex-col md:flex-row items-center md:items-start gap-6"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <div className="flex-shrink-0">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400/20 to-blue-600/20 flex items-center justify-center text-yellow-400 relative shadow-lg shadow-yellow-400/10">
          {icon}
          <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-gray-900 flex items-center justify-center text-sm font-bold shadow-md">
            {step}
          </div>
        </div>
      </div>
      <div className="text-center md:text-left">
        <h3 className="text-xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-100">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </motion.div>
  );
};

const HowItWorks: React.FC = () => {
  const steps = [
    {
      icon: <FileText size={24} />,
      title: "Describe Your Product",
      description: "Start by describing your product requirements in natural language. Be as detailed as you want."
    },
    {
      icon: <Code2 size={24} />,
      title: "AI Generates Code",
      description: "Our advanced AI analyzes your requirements and generates clean, production-ready code."
    },
    {
      icon: <Laptop size={24} />,
      title: "Preview Your Prototype",
      description: "Instantly see a working prototype of your product that you can interact with."
    },
    {
      icon: <Rocket size={24} />,
      title: "Deploy or Export",
      description: "Deploy your prototype to the web or export the code to continue development."
    }
  ];

  return (
    <section id="how-it-works" className="py-20 px-4 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-blue-600/10 opacity-50 transform -skew-y-6"></div>
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      <div className="max-w-7xl mx-auto relative">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-blue-500">
            How It Works
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Our simple 4-step process takes you from idea to working prototype in minutes.
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
          {steps.map((step, index) => (
            <Step 
              key={index}
              icon={step.icon}
              title={step.title}
              description={step.description}
              step={index + 1}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;