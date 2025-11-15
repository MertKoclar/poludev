import React from 'react';
import { motion } from 'framer-motion';
import { User, Camera } from 'lucide-react';

interface ProfileImageProps {
  imageUrl?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  editable?: boolean;
  onImageChange?: (file: File) => void;
}

const sizeClasses = {
  sm: 'w-16 h-16 text-2xl',
  md: 'w-24 h-24 text-3xl',
  lg: 'w-32 h-32 text-4xl',
  xl: 'w-40 h-40 text-5xl',
};

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  name,
  size = 'md',
  className = '',
  editable = false,
  onImageChange,
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onImageChange) {
      onImageChange(file);
    }
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className={`relative inline-block ${className}`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        className={`${sizeClasses[size]} rounded-full overflow-hidden border-4 border-white dark:border-gray-800 shadow-xl`}
      >
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
            {initials || <User className="w-1/2 h-1/2" />}
          </div>
        )}
      </motion.div>

      {editable && (
        <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-lg">
          <Camera className="w-4 h-4 text-white" />
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      )}
    </div>
  );
};

