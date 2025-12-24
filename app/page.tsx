'use client';

import { useState } from 'react';
import TokenInput from '@/components/TokenInput';
import LoadingScreen from '@/components/LoadingScreen';
import WrapExperience from '@/components/WrapExperience';
import type { WrapData } from '@/lib/types';

export default function Home() {
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<WrapData | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTokenSubmit = async (accessToken: string) => {
    setToken(accessToken);
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/wrap?token=${encodeURIComponent(accessToken)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch data');
      }

      const wrapData: WrapData = await response.json();
      setData(wrapData);
    } catch (err) {
      console.error('Error fetching wrap data:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setToken(null);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gradient-bg px-6">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        
        <div className="relative z-10 text-center">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold mb-4">Oops, something went wrong</h2>
          <p className="text-white/50 mb-8 max-w-md">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setToken(null);
            }}
            className="px-6 py-3 rounded-full bg-gradient-to-r from-violet-500 to-pink-500 text-white font-medium hover:opacity-90 transition-opacity"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!token) {
    return <TokenInput onSubmit={handleTokenSubmit} />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  if (data) {
    return <WrapExperience data={data} />;
  }

  return null;
}
