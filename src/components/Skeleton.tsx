import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
}

export const Skeleton: React.FC<SkeletonProps> = ({ 
  className = '', 
  variant = 'rectangular' 
}) => {
  const baseClasses = 'bg-gray-200 dark:bg-gray-700 animate-pulse';
  
  const variantClasses = {
    text: 'rounded h-4',
    circular: 'rounded-full',
    rectangular: 'rounded',
  };

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    />
  );
};

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <Skeleton className="h-64 w-full" variant="rectangular" />
      <div className="p-6 space-y-4">
        <Skeleton className="h-6 w-3/4" variant="text" />
        <Skeleton className="h-4 w-full" variant="text" />
        <Skeleton className="h-4 w-5/6" variant="text" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-16 rounded-full" variant="rectangular" />
          <Skeleton className="h-6 w-20 rounded-full" variant="rectangular" />
          <Skeleton className="h-6 w-14 rounded-full" variant="rectangular" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonProjectCard: React.FC = () => {
  return <SkeletonCard />;
};

export const SkeletonList: React.FC<{ items?: number }> = ({ items = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4">
          <Skeleton className="h-12 w-12" variant="circular" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-1/4" variant="text" />
            <Skeleton className="h-4 w-3/4" variant="text" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const SkeletonStats: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="text-center">
          <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-2xl" variant="rectangular" />
          <Skeleton className="h-12 w-20 mx-auto mb-2" variant="text" />
          <Skeleton className="h-4 w-24 mx-auto" variant="text" />
        </div>
      ))}
    </div>
  );
};

export const SkeletonText: React.FC<{ lines?: number }> = ({ lines = 3 }) => {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          className={`h-4 ${index === lines - 1 ? 'w-5/6' : 'w-full'}`}
          variant="text"
        />
      ))}
    </div>
  );
};

