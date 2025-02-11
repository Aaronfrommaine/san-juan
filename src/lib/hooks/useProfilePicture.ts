import { useState } from 'react';
import { supabase } from '../supabase';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function useProfilePicture(userId: string) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadProfilePicture = async (file: File): Promise<string> => {
    try {
      setIsUploading(true);

      // Validate file
      if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Please upload a JPG, PNG, or WebP image');
      }

      if (file.size > MAX_FILE_SIZE) {
        throw new Error('File size must be less than 5MB');
      }

      // Create a unique filename
      const timestamp = Date.now();
      const fileName = `${userId}/avatar-${timestamp}.jpg`;

      // Delete any existing avatars
      const { data: existingFiles } = await supabase.storage
        .from('avatars')
        .list(userId);

      if (existingFiles?.length) {
        await supabase.storage
          .from('avatars')
          .remove(existingFiles.map(f => `${userId}/${f.name}`));
      }

      // Upload new file
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) throw uploadError;

      // Get public URL
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadProfilePicture, isUploading };
}