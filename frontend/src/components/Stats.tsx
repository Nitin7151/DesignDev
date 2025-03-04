import React from 'react';
import { motion } from 'framer-motion';

interface StatProps {
  value: string;
  label: string;
  delay: number;
}

const Stat: React.FC<StatProps> = ({ value, label, delay }) => {
  return (
    <motion.div 
      className="text-center"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
    >
      <motion.div 
        className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500"
        initial={{ scale: 0.5 }}
        whileInView={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 100, delay: delay + 0.2 }}
        viewport={{ once: true }}
      >
        {value}
      </motion.div>
      <p className="text-gray-400 mt-2">{label}</p>
    </motion.div>
  );
};

const Stats: React.FC = () => {
  const stats = [
    { value: "10,000+", label: "Prototypes Generated" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "85%", label: "Time Saved" },
    { value: "24/7", label: "Support Available" }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-r from-gray-900 to-gray-800">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <Stat 
              key={index}
              value={stat.value}
              label={stat.label}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;