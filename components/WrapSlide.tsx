'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface WrapSlideProps {
  children: ReactNode;
  className?: string;
}

export default function WrapSlide({ children, className = '' }: WrapSlideProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -40 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`flex flex-col items-center justify-center min-h-screen w-full px-6 py-12 relative z-10 ${className}`}
    >
      {children}
    </motion.div>
  );
}

