'use client';

import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { WrapData } from '@/lib/types';
import WelcomeSlide from './WelcomeSlide';
import EmailStatsSlide from './EmailStatsSlide';
import TopContactsSlide from './TopContactsSlide';
import CalendarStatsSlide from './CalendarStatsSlide';
import GroupsStatsSlide from './GroupsStatsSlide';
import CollaboratorsSlide from './CollaboratorsSlide';
import SummarySlide from './SummarySlide';

interface WrapExperienceProps {
  data: WrapData;
}

export default function WrapExperience({ data }: WrapExperienceProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    <WelcomeSlide key="welcome" user={data.user} year={data.year} />,
    <EmailStatsSlide key="email" email={data.email} />,
    ...(data.email.topRecipients.length > 0
      ? [
          <TopContactsSlide
            key="recipients"
            title="Top Recipients"
            subtitle="People you emailed the most"
            contacts={data.email.topRecipients}
            emoji="📤"
          />,
        ]
      : []),
    ...(data.email.topSenders.length > 0
      ? [
          <TopContactsSlide
            key="senders"
            title="Top Senders"
            subtitle="People who emailed you the most"
            contacts={data.email.topSenders}
            emoji="📥"
          />,
        ]
      : []),
    <CalendarStatsSlide key="calendar" calendar={data.calendar} />,
    ...(data.calendar.topAttendees.length > 0
      ? [
          <TopContactsSlide
            key="attendees"
            title="Meeting Buddies"
            subtitle="People you met with the most"
            contacts={data.calendar.topAttendees}
            emoji="🤝"
          />,
        ]
      : []),
    <GroupsStatsSlide key="groups" groups={data.groups} />,
    ...(data.people.topCollaborators.length > 0
      ? [<CollaboratorsSlide key="collaborators" people={data.people} />]
      : []),
    <SummarySlide key="summary" data={data} />,
  ];

  const totalSlides = slides.length;

  const goToNext = useCallback(() => {
    setCurrentSlide((prev) => Math.min(prev + 1, totalSlides - 1));
  }, [totalSlides]);

  const goToPrev = useCallback(() => {
    setCurrentSlide((prev) => Math.max(prev - 1, 0));
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') {
        e.preventDefault();
        goToNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        goToPrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [goToNext, goToPrev]);

  // Touch/swipe navigation
  useEffect(() => {
    let touchStartY = 0;
    let touchStartX = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
      touchStartX = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const touchEndX = e.changedTouches[0].clientX;
      const diffY = touchStartY - touchEndY;
      const diffX = touchStartX - touchEndX;

      // Determine if it's a horizontal or vertical swipe
      if (Math.abs(diffY) > Math.abs(diffX)) {
        if (diffY > 50) goToNext();
        else if (diffY < -50) goToPrev();
      } else {
        if (diffX > 50) goToNext();
        else if (diffX < -50) goToPrev();
      }
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchend', handleTouchEnd);
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [goToNext, goToPrev]);

  return (
    <div className="min-h-screen gradient-bg overflow-hidden relative">
      {/* Background orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Slide indicators */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              index === currentSlide
                ? 'bg-white scale-125'
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Navigation buttons */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-4">
        <button
          onClick={goToPrev}
          disabled={currentSlide === 0}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Previous slide"
        >
          ←
        </button>
        <button
          onClick={goToNext}
          disabled={currentSlide === totalSlides - 1}
          className="w-12 h-12 rounded-full glass-card flex items-center justify-center text-white/60 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          aria-label="Next slide"
        >
          →
        </button>
      </div>

      {/* Click navigation areas */}
      <div
        className="fixed left-0 top-0 w-1/3 h-full z-20 cursor-pointer"
        onClick={goToPrev}
      />
      <div
        className="fixed right-0 top-0 w-1/3 h-full z-20 cursor-pointer"
        onClick={goToNext}
      />

      {/* Slides */}
      <AnimatePresence mode="wait">
        <motion.div key={currentSlide}>{slides[currentSlide]}</motion.div>
      </AnimatePresence>

      {/* Footer credit */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-10 text-white/20 text-xs tracking-wide">
        Made with ♥ by Shoaib
      </div>
    </div>
  );
}

