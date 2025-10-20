'use client'

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

interface PullToRefreshProps {
  onRefresh: () => Promise<void>;
  children: ReactNode;
  disabled?: boolean;
}

export const PullToRefresh = ({ onRefresh, children, disabled = false }: PullToRefreshProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const y = useMotionValue(0);
  const pullThreshold = 80;

  // Transform pull distance to rotation
  const rotate = useTransform(y, [0, pullThreshold], [0, 360]);
  const opacity = useTransform(y, [0, pullThreshold], [0, 1]);
  const scale = useTransform(y, [0, pullThreshold], [0.5, 1]);

  const handleDragStart = () => {
    if (disabled || isRefreshing) return;

    // Only allow pull-to-refresh if we're at the top of the page
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (scrollTop === 0) {
      setIsPulling(true);
    }
  };

  const handleDragEnd = async () => {
    if (disabled || isRefreshing) return;

    const pullDistance = y.get();

    if (pullDistance >= pullThreshold) {
      setIsRefreshing(true);
      try {
        await onRefresh();
      } catch (error) {
        console.error('Refresh failed:', error);
      } finally {
        setIsRefreshing(false);
        setIsPulling(false);
        y.set(0);
      }
    } else {
      setIsPulling(false);
      y.set(0);
    }
  };

  useEffect(() => {
    if (isRefreshing) {
      y.set(pullThreshold);
    }
  }, [isRefreshing, y]);

  return (
    <div ref={containerRef} className="relative overflow-hidden">
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center pointer-events-none z-50"
        style={{
          height: pullThreshold,
          y: useTransform(y, (value) => Math.min(value - pullThreshold, 0)),
        }}
      >
        <motion.div
          className="flex items-center justify-center w-12 h-12 bg-primary rounded-full shadow-lg"
          style={{ opacity, scale }}
        >
          <motion.div style={{ rotate }}>
            <RefreshCw
              className={`h-6 w-6 text-white ${isRefreshing ? 'animate-spin' : ''}`}
            />
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0.5, bottom: 0 }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ y }}
        className="touch-pan-x"
      >
        {children}
      </motion.div>
    </div>
  );
};
