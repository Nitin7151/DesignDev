import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
  social?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

const TeamMember: React.FC<TeamMemberProps> = ({ name, role, image, bio, social }) => {
  return (
    <motion.div 
      className="group relative overflow-hidden rounded-2xl bg-gray-800/50 backdrop-blur-sm border border-gray-700 transition-all duration-300 hover:border-blue-500/50"
      whileHover={{ y: -5 }}
    >
      <div className="relative">
        <div className="aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" 
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        {/* Social Icons */}
        {social && (
          <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
            {social.github && (
              <a 
                href={social.github} 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800/80 p-2 text-white hover:bg-blue-500 transition-colors"
              >
                <Github className="h-5 w-5" />
              </a>
            )}
            {social.linkedin && (
              <a 
                href={social.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800/80 p-2 text-white hover:bg-blue-500 transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
            {social.twitter && (
              <a 
                href={social.twitter} 
                target="_blank" 
                rel="noopener noreferrer"
                className="rounded-full bg-gray-800/80 p-2 text-white hover:bg-blue-500 transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white">{name}</h3>
        <p className="text-sm font-medium text-blue-400 mb-3">{role}</p>
        <p className="text-gray-400 text-sm">{bio}</p>
      </div>
    </motion.div>
  );
};

export default TeamMember;
