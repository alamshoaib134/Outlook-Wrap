'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import type { UserProfile } from '@/lib/types';
import Image from 'next/image';

interface WelcomSlideProps {
  user: UserProfile;
  year: number;
}

export default function WelcomeSlide({ user, year }: WelcomSlideProps) {
  return (
    <WrapSlide>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.6, type: 'spring' }}
        className="mb-8"
      >
        {user.photo ? (
          <Image
            src={user.photo}
            alt={user.displayName}
            width={120}
            height={120}
            className="rounded-full border-4 border-white/20 shadow-2xl"
          />
        ) : (
          <div className="w-[120px] h-[120px] rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-4xl font-bold">
            {user.displayName.charAt(0)}
          </div>
        )}
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-xl text-white/60 mb-4"
      >
        Hey, {user.displayName.split(' ')[0]}
      </motion.p>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="text-5xl md:text-7xl font-bold text-center mb-6"
      >
        Your <span className="gradient-accent">{year}</span>
        <br />
        Outlook Wrap
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="text-lg text-white/50 text-center max-w-md"
      >
        Let&apos;s look back at your year in emails, meetings, and collaboration
      </motion.p>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-12 flex flex-col items-center gap-2"
      >
        <p className="text-sm text-white/40">Tap or press arrow keys to continue</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="text-2xl text-white/40"
        >
          ↓
        </motion.div>
      </motion.div>
    </WrapSlide>
  );
}

