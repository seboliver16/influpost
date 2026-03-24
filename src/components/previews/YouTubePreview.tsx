"use client";

import { HiThumbUp, HiThumbDown, HiShare, HiDotsHorizontal } from "react-icons/hi";

interface YouTubePreviewProps {
  videoUrl?: string;
  title: string;
  description: string;
  channelName: string;
  channelAvatar?: string;
  hashtags: string[];
}

export default function YouTubePreview({
  videoUrl,
  title,
  description,
  channelName,
  channelAvatar,
  hashtags,
}: YouTubePreviewProps) {
  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl overflow-hidden shadow-2xl">
      {/* Video Player Area */}
      <div className="relative w-full aspect-video bg-black">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            playsInline
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Video Info */}
      <div className="p-3">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-tight">
          {title || "Video Title"}
        </h3>

        <div className="mt-1 flex items-center text-xs text-gray-500">
          <span>0 views</span>
          <span className="mx-1">&middot;</span>
          <span>Just now</span>
        </div>

        {hashtags.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {hashtags.slice(0, 3).map((tag, i) => (
              <span key={i} className="text-xs text-blue-600 font-medium">
                #{tag}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {channelAvatar ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={channelAvatar} className="w-full h-full rounded-full" alt="" />
            ) : (
              channelName[0]?.toUpperCase() || "C"
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{channelName || "Channel Name"}</p>
            <p className="text-xs text-gray-500">0 subscribers</p>
          </div>
          <button className="px-3 py-1.5 bg-black text-white text-xs font-medium rounded-full">
            Subscribe
          </button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <div className="flex items-center bg-gray-100 rounded-full">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-200 rounded-l-full">
              <HiThumbUp className="w-4 h-4" /> 0
            </button>
            <div className="w-px h-5 bg-gray-300" />
            <button className="px-3 py-1.5 text-xs text-gray-700 hover:bg-gray-200 rounded-r-full">
              <HiThumbDown className="w-4 h-4" />
            </button>
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 rounded-full text-xs font-medium text-gray-700">
            <HiShare className="w-4 h-4" /> Share
          </button>
          <button className="p-1.5 bg-gray-100 rounded-full text-gray-700">
            <HiDotsHorizontal className="w-4 h-4" />
          </button>
        </div>

        {description && (
          <div className="mt-3 p-2.5 bg-gray-100 rounded-xl">
            <p className="text-xs text-gray-700 line-clamp-3 whitespace-pre-wrap">{description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
