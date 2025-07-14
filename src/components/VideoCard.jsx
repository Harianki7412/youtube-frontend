import React from 'react';
import { Link } from 'react-router-dom';

function VideoCard({ video }) {
  if (!video) {
    return null;
  }
  const channelName = video.channel?.channelName || video.uploader?.username || 'Unknown Channel';
  const channelAvatar = video.channel?.channelAvatar || video.uploader?.avatar || 'https://i.pravatar.cc/40?img=1';
  const thumbnailUrl = video.thumbnailUrl || 'https://placehold.co/480x270/2d3748/e2e8f0?text=No+Thumbnail';

  return (
    <Link
      to={`/video/${video._id}`}
      className="video-card block rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gray-800 text-white transform hover:scale-105"
    >
      <div className="relative w-full pb-[56.25%] overflow-hidden rounded-t-lg">
        <img
          src={thumbnailUrl}
          alt={video.title}
          className="absolute inset-0 w-full h-full object-cover"
          onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/480x270/2d3748/e2e8f0?text=Error+Loading'; }}
        />
      </div>

      <div className="p-3 md:p-4">
        <h3 className="text-base md:text-lg font-semibold mb-2 line-clamp-2">{video.title}</h3>
        <div className="flex items-start mt-2">
          <img
            src={channelAvatar}
            alt={`${channelName} Avatar`}
            className="w-8 h-8 md:w-9 md:h-9 rounded-full mr-2 flex-shrink-0"
          />
          <div>
            <p className="text-sm md:text-base text-gray-400">{channelName}</p>
            <p className="text-xs text-gray-500">{video.views} views</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default VideoCard;