import React from 'react';

const testimonials = [
  { name: 'Alice', text: 'Amazing service! My prototype was built in minutes.' },
  { name: 'Bob', text: 'Transformed my PRD into a working prototype seamlessly.' },
  { name: 'Charlie', text: 'Highly recommended for anyone looking to innovate fast.' },
  { name: 'Diana', text: 'A game changer in website development.' },
];

export function Testimonials() {
  return (
    <div className="relative overflow-hidden py-10 bg-gray-800">
      {/* Inline styles for marquee animation */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
      <div className="marquee flex space-x-8" style={{ animation: 'marquee 15s linear infinite' }}>
        {testimonials.concat(testimonials).map((testimonial, index) => (
          <div
            key={index}
            className="min-w-[300px] p-6 bg-gray-700 rounded-lg shadow-lg hover:bg-gray-600 transition-colors"
          >
            <p className="italic mb-2">"{testimonial.text}"</p>
            <p className="text-right font-bold">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Testimonials;
