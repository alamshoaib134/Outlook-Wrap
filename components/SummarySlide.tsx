'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import type { WrapData } from '@/lib/types';

interface SummarySlideProps {
  data: WrapData;
}

export default function SummarySlide({ data }: SummarySlideProps) {
  const stats = [
    { label: 'Emails Sent', value: data.email.sent.toLocaleString(), icon: '📤' },
    { label: 'Emails Received', value: data.email.received.toLocaleString(), icon: '📥' },
    { label: 'Meetings', value: data.calendar.totalMeetings.toLocaleString(), icon: '📅' },
    { label: 'Hours in Meetings', value: data.calendar.totalHours.toLocaleString(), icon: '⏰' },
    { label: 'Teams & Groups', value: data.groups.totalGroups.toLocaleString(), icon: '👥' },
    { label: 'Collaborators', value: data.people.topCollaborators.length.toLocaleString(), icon: '🤝' },
  ];

  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-4"
      >
        🎉
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-2 text-center"
      >
        That&apos;s a wrap, {data.user.displayName.split(' ')[0]}!
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-white/50 mb-10 text-center"
      >
        Your {data.year} at a glance
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="glass-card p-8 w-full max-w-lg"
      >
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.4 }}
              className="text-center"
            >
              <span className="text-2xl mb-2 block">{stat.icon}</span>
              <span className="text-2xl font-bold gradient-accent block">{stat.value}</span>
              <span className="text-xs text-white/50">{stat.label}</span>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="mt-10 text-white/40 text-sm text-center"
      >
        Here&apos;s to an even more productive {data.year + 1}! 🚀
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.5 }}
        className="mt-8"
      >
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
        >
          Watch Again
        </button>
      </motion.div>
    </WrapSlide>
  );
}

