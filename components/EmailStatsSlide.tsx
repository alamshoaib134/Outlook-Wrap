'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import AnimatedCounter from './AnimatedCounter';
import type { EmailStats } from '@/lib/types';

interface EmailStatsSlideProps {
  email: EmailStats;
}

export default function EmailStatsSlide({ email }: EmailStatsSlideProps) {
  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-6"
      >
        📧
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl text-white/60 mb-8 text-center"
      >
        Your inbox was busy this year
      </motion.h2>

      <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-12">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="glass-card p-8 text-center"
        >
          <AnimatedCounter
            value={email.sent}
            className="text-6xl md:text-7xl font-bold gradient-accent block"
          />
          <p className="text-xl text-white/60 mt-2">emails sent</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="glass-card p-8 text-center"
        >
          <AnimatedCounter
            value={email.received}
            className="text-6xl md:text-7xl font-bold gradient-accent block"
          />
          <p className="text-xl text-white/60 mt-2">emails received</p>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9, duration: 0.5 }}
        className="text-center"
      >
        <p className="text-lg text-white/50">
          Your busiest day was <span className="text-white font-semibold">{email.busiestDay}</span>
        </p>
        <p className="text-lg text-white/50 mt-2">
          Peak month: <span className="text-white font-semibold">{email.busiestMonth}</span>
        </p>
      </motion.div>
    </WrapSlide>
  );
}

