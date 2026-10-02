"use client";

import { motion, AnimatePresence, HTMLMotionProps } from 'framer-motion';
import React from 'react';
import { checkReducedMotion } from '@/lib/performance';

export { motion, AnimatePresence };

export interface MotionWrapperProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
}

/**
 * Microinteraction wrapper for hover effects with subtle scale & spring
 */
export function MotionCard({ children, className = '', ...props }: MotionWrapperProps) {
  const isReduced = checkReducedMotion();

  return (
    <motion.div
      whileHover={isReduced ? {} : { y: -4, scale: 1.01 }}
      whileTap={isReduced ? {} : { scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * Microinteraction wrapper for buttons
 */
export function MotionButton({ children, className = '', ...props }: MotionWrapperProps) {
  const isReduced = checkReducedMotion();

  return (
    <motion.div
      whileHover={isReduced ? {} : { scale: 1.03 }}
      whileTap={isReduced ? {} : { scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 500, damping: 20 }}
      className={`inline-block ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/**
 * FadeIn microinteraction for elements/modals/menus
 */
export function FadeIn({ children, delay = 0, duration = 0.4, className = '', ...props }: MotionWrapperProps) {
  const isReduced = checkReducedMotion();

  return (
    <motion.div
      initial={isReduced ? { opacity: 1 } : { opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={isReduced ? { opacity: 0 } : { opacity: 0, y: -10 }}
      transition={{ duration: isReduced ? 0 : duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
