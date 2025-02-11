import React, { useRef, useState } from 'react';
import { Camera, Loader2 } from 'lucide-react';
import { useProfilePicture } from '../../../lib/hooks/useProfilePicture';
import { Profile } from '../../../lib/types/profile';

interface ProfilePictureUploaderProps {
  profile: Profile;
  onUpdate: (url: string) => Promise<void>;
}

export default function ProfilePictureUploader({ profile, onUpdate }: ProfilePictureUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const { uploadProfilePicture, isUploading } = useProfilePicture(profile.id);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadProfilePicture(file);
      await onUpdate(url);
      
      // Clear input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      alert('Failed to upload profile picture. Please try again.');
    }
  };

  const getInitials = () => {
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  return (
    <div 
      className="relative w-32 h-32 mx-auto mb-6"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {profile.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={`${profile.first_name} ${profile.last_name}`}
          className="w-32 h-32 rounded-full object-cover ring-2 ring-yellow-500 ring-offset-2"
        />
      ) : (
        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/30 dark:to-yellow-800/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 text-4xl font-bold ring-2 ring-yellow-500 ring-offset-2">
          {getInitials()}
        </div>
      )}

      <button
        onClick={() => fileInputRef.current?.click()}
        className={`absolute inset-0 w-full h-full rounded-full flex items-center justify-center bg-black/50 transition-opacity duration-200 ${
          isHovering || isUploading ? 'opacity-100' : 'opacity-0'
        }`}
        disabled={isUploading}
      >
        {isUploading ? (
          <Loader2 className="h-6 w-6 text-white animate-spin" />
        ) : (
          <Camera className="h-6 w-6 text-white" />
        )}
      </button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}