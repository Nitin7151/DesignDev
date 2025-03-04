import React, { useRef } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Mail, Lock, UserPlus, LogIn } from 'lucide-react';

interface ModelProps {
  icon: 'login' | 'signup' | 'email' | 'password';
  rotate?: boolean;
  scale?: number;
}

function renderIcon(icon: 'login' | 'signup' | 'email' | 'password') {
  switch (icon) {
    case 'login':
      return <LogIn className="h-6 w-6" />;
    case 'signup':
      return <UserPlus className="h-6 w-6" />;
    case 'email':
      return <Mail className="h-6 w-6" />;
    case 'password':
      return <Lock className="h-6 w-6" />;
    default:
      return null;
  }
}

const IconModel: React.FC<ModelProps> = ({ icon, rotate = true, scale = 1 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current && rotate) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }
  });



  return (
    <mesh ref={meshRef} scale={[scale, scale, scale]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={icon === 'login' ? '#3b82f6' : icon === 'signup' ? '#10b981' : '#6366f1'} />
    </mesh>
  );
};

const ThreeDIcon: React.FC<ModelProps> = ({ icon, rotate, scale }) => {
  return (
    <motion.div
      className="w-16 h-16 relative"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <IconModel icon={icon} rotate={rotate} scale={scale} />
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        {renderIcon(icon)}
      </div>
    </motion.div>
  );
};



// Fallback component for environments where WebGL might not be available
export const FallbackIcon: React.FC<{ icon: 'login' | 'signup' | 'email' | 'password' }> = ({ icon }) => {
  return (
    <motion.div
      className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600 rounded-full"
      whileHover={{ scale: 1.1 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    >
      {renderIcon(icon)}
    </motion.div>
  );
};

export default ThreeDIcon;