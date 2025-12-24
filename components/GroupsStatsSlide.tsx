'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import AnimatedCounter from './AnimatedCounter';
import type { GroupStats } from '@/lib/types';

interface GroupsStatsSlideProps {
  groups: GroupStats;
}

export default function GroupsStatsSlide({ groups }: GroupsStatsSlideProps) {
  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-6"
      >
        👥
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-2xl text-white/60 mb-2 text-center"
      >
        You&apos;re part of
      </motion.h2>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mb-8"
      >
        <AnimatedCounter
          value={groups.totalGroups}
          className="text-8xl md:text-9xl font-bold gradient-accent"
        />
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="text-2xl text-white/60 text-center mt-2"
        >
          teams & groups
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <p className="text-sm text-white/40 mb-4 text-center">Some of your teams:</p>
        <div className="flex flex-wrap justify-center gap-2">
          {groups.groups.slice(0, 8).map((group, index) => (
            <motion.span
              key={group.id}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.9 + index * 0.05, duration: 0.3 }}
              className="px-4 py-2 glass-card text-sm text-white/80 hover:text-white transition-colors"
            >
              {group.displayName}
            </motion.span>
          ))}
        </div>
      </motion.div>
    </WrapSlide>
  );
}

