'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import AnimatedCounter from './AnimatedCounter';
import type { CalendarStats } from '@/lib/types';

interface CalendarStatsSlideProps {
  calendar: CalendarStats;
}

export default function CalendarStatsSlide({ calendar }: CalendarStatsSlideProps) {
  // Convert hours to days for perspective
  const daysInMeetings = Math.round(calendar.totalHours / 8);

  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-6"
      >
        📅
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl text-white/60 mb-8 text-center"
      >
        Your calendar was packed
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card p-10 text-center mb-8"
      >
        <AnimatedCounter
          value={calendar.totalMeetings}
          className="text-7xl md:text-8xl font-bold gradient-accent block"
        />
        <p className="text-2xl text-white/60 mt-2">meetings attended</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="glass-card p-6 text-center"
        >
          <AnimatedCounter
            value={calendar.totalHours}
            className="text-4xl font-bold text-cyan-400 block"
            suffix=" hrs"
          />
          <p className="text-sm text-white/50 mt-1">total time</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="glass-card p-6 text-center"
        >
          <AnimatedCounter
            value={calendar.averageMeetingDuration}
            className="text-4xl font-bold text-pink-400 block"
            suffix=" min"
          />
          <p className="text-sm text-white/50 mt-1">avg. duration</p>
        </motion.div>
      </div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-lg text-white/40 text-center"
      >
        That&apos;s like <span className="text-white font-semibold">{daysInMeetings} full workdays</span> spent in meetings!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="mt-6 text-center"
      >
        <p className="text-white/50">
          Busiest day: <span className="text-white">{calendar.busiestDay}</span>
        </p>
      </motion.div>
    </WrapSlide>
  );
}

