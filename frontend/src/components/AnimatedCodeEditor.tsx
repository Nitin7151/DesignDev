import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Check } from 'lucide-react';

interface AnimatedCodeEditorProps {
  code: string;
  language?: string;
  fileName: string;
  onComplete?: () => void;
}

export const AnimatedCodeEditor: React.FC<AnimatedCodeEditorProps> = ({
  code,
  language = 'typescript',
  fileName,
  onComplete
}) => {
  const [visibleCode, setVisibleCode] = useState('');
  const [isTyping, setIsTyping] = useState(true);
  const [showCheckmark, setShowCheckmark] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    let currentIndex = 0;
    setIsTyping(true);
    setShowCheckmark(false);

    const typeCode = () => {
      if (currentIndex < code.length) {
        setVisibleCode(code.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutRef.current = setTimeout(typeCode, 10); // Adjust speed here
      } else {
        setIsTyping(false);
        setShowCheckmark(true);
        onComplete?.();
      }
    };

    timeoutRef.current = setTimeout(typeCode, 500); // Initial delay

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [code, onComplete]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-900 rounded-lg overflow-hidden shadow-xl"
    >
      {/* File Header */}
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <FileText className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-300">{fileName}</span>
        </div>
        <AnimatePresence>
          {showCheckmark && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="bg-green-500/10 p-1 rounded-full"
            >
              <Check className="w-4 h-4 text-green-500" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm relative">
        <pre className="text-gray-300">
          <code>{visibleCode}</code>
        </pre>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 0.7 }}
            className="absolute bottom-4 right-4 w-2 h-4 bg-blue-500"
          />
        )}
      </div>
    </motion.div>
  );
};
