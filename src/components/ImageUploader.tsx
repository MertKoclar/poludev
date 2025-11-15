import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { supabase } from '../config/supabaseClient';
import { useToast } from '../context/ToastContext';

interface ImageUploaderProps {
  currentImageUrl?: string | null;
  onImageUploaded: (url: string) => void;
  bucket: string;
  folder?: string;
  maxSizeMB?: number;
  accept?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  bucket,
  folder = '',
  maxSizeMB = 5,
  accept = 'image/*',
}) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { success, error } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      await handleFile(e.target.files[0]);
    }
  };

  const handleFile = async (file: File) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      error('Please select an image file');
      return;
    }

    // Validate file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload to Supabase Storage
    setUploading(true);
    try {
      // Check if user is authenticated
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !session) {
        throw new Error('You must be logged in to upload images');
      }

      // Check if user is admin
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (userError || !userData || userData.role !== 'admin') {
        throw new Error('Only admins can upload images');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = folder ? `${folder}/${fileName}` : fileName;

      // Delete old image if exists
      if (currentImageUrl) {
        try {
          // Extract file path from URL
          const urlParts = currentImageUrl.split('/');
          const oldFilePath = urlParts.slice(urlParts.indexOf(bucket) + 1).join('/');
          if (oldFilePath) {
            await supabase.storage
              .from(bucket)
              .remove([oldFilePath]);
          }
        } catch (deleteError) {
          // Ignore delete errors - file might not exist
          console.warn('Could not delete old image:', deleteError);
        }
      }

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error('Upload error details:', uploadError);
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      onImageUploaded(publicUrl);
      success('Image uploaded successfully');
    } catch (err: any) {
      console.error('Error uploading image:', err);
      error(err.message || 'Failed to upload image');
      setPreview(currentImageUrl || null);
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    onImageUploaded('');
  };

  return (
    <div className="space-y-4">
      {preview ? (
        <div className="relative">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-64 object-cover rounded-lg border-2 border-gray-300 dark:border-gray-600"
          />
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          {uploading && (
            <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
      ) : (
        <motion.div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          className={`
            relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
            transition-colors
            ${dragActive 
              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
              : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
            }
          `}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          {uploading ? (
            <div className="flex flex-col items-center">
              <Loader2 className="w-12 h-12 text-blue-600 dark:text-blue-400 animate-spin mb-4" />
              <p className="text-gray-600 dark:text-gray-400">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <ImageIcon className="w-12 h-12 text-gray-400 mb-4" />
              <p className="text-gray-600 dark:text-gray-400 mb-2">
                Drag & drop an image here, or click to select
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500">
                Max size: {maxSizeMB}MB
              </p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

