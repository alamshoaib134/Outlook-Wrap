'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import AnimatedCounter from './AnimatedCounter';
import type { TaskStats } from '@/lib/types';

interface TasksSlideProps {
  tasks: TaskStats;
}

export default function TasksSlide({ tasks }: TasksSlideProps) {
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (tasks.completionRate / 100) * circumference;

  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-6"
      >
        ✅
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl text-white/60 mb-8 text-center"
      >
        Your task game was strong
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="relative mb-8"
      >
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="80"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="12"
            fill="none"
          />
          <motion.circle
            cx="100"
            cy="100"
            r="80"
            stroke="url(#gradient)"
            strokeWidth="12"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ delay: 0.7, duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="50%" stopColor="#ec4899" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <AnimatedCounter
            value={tasks.completionRate}
            className="text-4xl font-bold text-white"
            suffix="%"
          />
          <p className="text-sm text-white/50">completed</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-4 max-w-md">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <AnimatedCounter
            value={tasks.totalTasks}
            className="text-2xl font-bold text-white block"
          />
          <p className="text-xs text-white/50 mt-1">Total</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <AnimatedCounter
            value={tasks.completedTasks}
            className="text-2xl font-bold text-emerald-400 block"
          />
          <p className="text-xs text-white/50 mt-1">Done</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="glass-card p-4 text-center"
        >
          <AnimatedCounter
            value={tasks.pendingTasks}
            className="text-2xl font-bold text-amber-400 block"
          />
          <p className="text-xs text-white/50 mt-1">Pending</p>
        </motion.div>
      </div>
    </WrapSlide>
  );
}

