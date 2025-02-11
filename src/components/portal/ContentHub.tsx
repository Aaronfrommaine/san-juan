import React, { useState } from 'react';
import { Play, Clock, Star, Maximize2, Minimize2 } from 'lucide-react';

const videos = [
  {
    id: 1,
    title: 'Understanding Act 60 Benefits',
    description: 'A comprehensive overview of Puerto Rico\'s tax incentives and how they can benefit investors',
    duration: '13:37',
    videoId: '9WulVe6aKKI',
    featured: true
  },
  {
    id: 2,
    title: 'Property Market Analysis',
    description: 'Deep dive into current market trends and opportunities in Puerto Rico',
    duration: '10:23',
    videoId: '9WulVe6aKKI'
  },
  {
    id: 3,
    title: 'Investment Strategy Workshop',
    description: 'Expert strategies for maximizing your investment returns in Puerto Rico',
    duration: '15:21',
    videoId: 'FugoNJ3CU1o',
    allowFullscreen: true
  }
];

export default function ContentHub() {
  const [expandedVideo, setExpandedVideo] = useState<number | null>(null);

  const toggleExpand = (videoId: number) => {
    setExpandedVideo(expandedVideo === videoId ? null : videoId);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-6">Exclusive Content</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {videos.map((video) => (
          <div 
            key={video.id} 
            className={`group bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden
              ${expandedVideo === video.id ? 'md:col-span-2 lg:col-span-3' : ''}`}
          >
            <div className="relative">
              <div className="relative pt-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${video.videoId}?rel=0`}
                  title={video.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={video.allowFullscreen}
                />
              </div>
              <button
                onClick={() => toggleExpand(video.id)}
                className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/75 rounded-full text-white transition-colors"
              >
                {expandedVideo === video.id ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
            
            <div className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium">{video.title}</h3>
                {video.featured && (
                  <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300 rounded-full flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    Featured
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{video.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="h-4 w-4 mr-1" />
                {video.duration}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}