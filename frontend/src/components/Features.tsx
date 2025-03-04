import React from 'react';
import { CheckCircle } from 'lucide-react';

export function Features() {
  const features = [
    {
      title: 'Fast Prototyping',
      description: 'Build prototypes in minutes with our AI-powered builder.',
    },
    {
      title: 'Modern Design',
      description: 'Utilize cutting-edge design trends to build sleek interfaces.',
    },
    {
      title: 'User-Friendly',
      description: 'Intuitive interface that makes website building effortless.',
    },
    {
      title: 'Customizable',
      description: 'Tailor every element to match your brand and vision.',
    },
  ];

  return (
    <div className="py-16 bg-gray-900 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">Features We Offer</h2>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
        {features.map((feature, index) => (
          <div
            key={index}
            className="p-6 bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300"
          >
            <div className="mb-4">
              <CheckCircle className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Features;
