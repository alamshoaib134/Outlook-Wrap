'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import type { PeopleStats } from '@/lib/types';

interface CollaboratorsSlideProps {
  people: PeopleStats;
}

export default function CollaboratorsSlide({ people }: CollaboratorsSlideProps) {
  const colors = [
    'from-violet-500 to-purple-600',
    'from-pink-500 to-rose-600',
    'from-cyan-500 to-blue-600',
    'from-amber-500 to-orange-600',
    'from-emerald-500 to-green-600',
    'from-fuchsia-500 to-pink-600',
    'from-indigo-500 to-violet-600',
    'from-red-500 to-pink-600',
  ];

  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-6"
      >
        🤝
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-2 text-center"
      >
        Your Top Collaborators
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-white/50 mb-10 text-center"
      >
        The people you worked with most
      </motion.p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
        {people.topCollaborators.map((person, index) => (
          <motion.div
            key={person.userPrincipalName || person.displayName}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            className="glass-card p-5 text-center flex flex-col items-center"
          >
            <div
              className={`w-16 h-16 rounded-full bg-gradient-to-br ${colors[index % colors.length]} flex items-center justify-center text-xl font-bold mb-3`}
            >
              {person.displayName.charAt(0).toUpperCase()}
            </div>
            <p className="font-medium text-white text-sm truncate w-full">
              {person.displayName.split(' ')[0]}
            </p>
            {person.jobTitle && (
              <p className="text-xs text-white/40 truncate w-full mt-1">
                {person.jobTitle}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </WrapSlide>
  );
}

