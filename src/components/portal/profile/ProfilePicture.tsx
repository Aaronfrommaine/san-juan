import React from 'react';
import { Camera } from 'lucide-react';
import { Profile } from '../../../lib/types/profile';

interface ProfilePictureProps {
  profile: Profile | null;
  size?: 'sm' | 'md' | 'lg';
  editable?: boolean;
  onUpload?: (file: File) => Promise<void>;
}

export default function ProfilePicture({ profile, size = 'md', editable = false, onUpload }: ProfilePictureProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);

  const sizeClasses = {
    sm: 'w-12 h-12',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUpload) {
      await onUpload(file);
    }
  };

  const getInitials = () => {
    if (!profile) return '?';
    return `${profile.first_name[0]}${profile.last_name[0]}`.toUpperCase();
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {profile?.avatar_url ? (
        <img
          src={profile.avatar_url}
          alt={`${profile.first_name} ${profile.last_name}`}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold text-2xl`}>
          {getInitials()}
        </div>
      )}

      {editable && (
        <>
          <button
            onClick={() => inputRef.current?.click()}
            className="absolute bottom-0 right-0 p-2 bg-yellow-500 text-black rounded-full hover:bg-yellow-400 transition-colors"
          >
            <Camera className="h-4 w-4" />
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}