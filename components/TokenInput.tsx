'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface TokenInputProps {
  onSubmit: (token: string) => void;
}

export default function TokenInput({ onSubmit }: TokenInputProps) {
  const [token, setToken] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (token.trim()) {
      onSubmit(token.trim());
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gradient-bg px-6">
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-lg"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-6xl mb-6 text-center"
        >
          📊
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
          <span className="gradient-accent">Outlook Wrap</span>
        </h1>

        <p className="text-white/50 text-center mb-8">
          Enter your Microsoft Graph API access token to see your year in review
        </p>

        <form onSubmit={handleSubmit} className="glass-card p-6">
          <label className="block text-sm text-white/60 mb-2">
            Access Token
          </label>
          <textarea
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your token from Graph Explorer..."
            className="w-full h-32 bg-white/5 border border-white/10 rounded-lg p-4 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 resize-none font-mono text-sm"
          />
          <p className="text-xs text-white/40 mt-2 mb-4">
            Get your token from{' '}
            <a
              href="https://developer.microsoft.com/en-us/graph/graph-explorer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:underline"
            >
              Graph Explorer
            </a>
          </p>
          <button
            type="submit"
            disabled={!token.trim()}
            className="w-full py-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Generate My Wrap
          </button>
        </form>
      </motion.div>

      {/* Footer credit */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-10 text-white/20 text-xs tracking-wide">
        Made with ♥ by Shoaib
      </div>
    </div>
  );
}

