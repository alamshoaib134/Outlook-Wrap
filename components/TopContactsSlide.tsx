'use client';

import { motion } from 'framer-motion';
import WrapSlide from './WrapSlide';
import type { ContactCount } from '@/lib/types';

interface TopContactsSlideProps {
  title: string;
  subtitle: string;
  contacts: ContactCount[];
  emoji: string;
}

export default function TopContactsSlide({ title, subtitle, contacts, emoji }: TopContactsSlideProps) {
  const maxCount = Math.max(...contacts.map(c => c.count));

  return (
    <WrapSlide>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-6xl mb-6"
      >
        {emoji}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold mb-2 text-center"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="text-lg text-white/50 mb-10 text-center"
      >
        {subtitle}
      </motion.p>

      <div className="w-full max-w-lg space-y-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={contact.email}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.4 }}
            className="glass-card p-4"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 flex items-center justify-center text-sm font-bold">
                  {contact.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-white truncate max-w-[200px]">
                    {contact.name}
                  </p>
                  <p className="text-sm text-white/40 truncate max-w-[200px]">
                    {contact.email}
                  </p>
                </div>
              </div>
              <span className="text-xl font-bold gradient-accent">{contact.count}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${(contact.count / maxCount) * 100}%` }}
                transition={{ delay: 0.7 + index * 0.1, duration: 0.6 }}
                className="h-full gradient-border rounded-full"
              />
            </div>
          </motion.div>
        ))}
      </div>
    </WrapSlide>
  );
}

