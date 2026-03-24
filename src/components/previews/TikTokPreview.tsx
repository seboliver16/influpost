"use client";

import { HiHeart, HiChat, HiShare, HiMusicNote } from "react-icons/hi";

interface TikTokPreviewProps {
  videoUrl?: string;
  description: string;
  username: string;
  userAvatar?: string;
  hashtags: string[];
  locationTag?: string;
  soundName?: string;
}

export default function TikTokPreview({
  videoUrl,
  description,
  username,
  userAvatar,
  hashtags,
  locationTag,
  soundName,
}: TikTokPreviewProps) {
  const fullCaption =
    description +
    (hashtags.length > 0 ? " " + hashtags.map((t) => `#${t}`).join(" ") : "");

  return (
    <div className="w-full max-w-[280px] bg-black rounded-xl overflow-hidden shadow-2xl relative" style={{ aspectRatio: "9/16" }}>
      {/* Video Background */}
      <div className="absolute inset-0">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
            controls
            playsInline
            loop
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-900">
            <svg className="w-16 h-16 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        )}
      </div>

      {/* Overlay Content */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Right Side Actions */}
      <div className="absolute right-3 bottom-24 flex flex-col items-center gap-5">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-pink-500 rounded-full border-2 border-white flex items-center justify-center">
            {userAvatar ? (
              <img src={userAvatar} className="w-full h-full rounded-full" alt="" />
            ) : (
              <span className="text-xs font-bold text-white">
                {username[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-white text-[10px] font-bold">+</span>
          </div>
        </div>

        <div className="flex flex-col items-center">
          <HiHeart className="w-7 h-7 text-white" />
          <span className="text-[10px] text-white mt-0.5">0</span>
        </div>

        <div className="flex flex-col items-center">
          <HiChat className="w-7 h-7 text-white" />
          <span className="text-[10px] text-white mt-0.5">0</span>
        </div>

        <div className="flex flex-col items-center">
          <HiShare className="w-7 h-7 text-white" />
          <span className="text-[10px] text-white mt-0.5">0</span>
        </div>

        <div className="w-8 h-8 bg-gray-800 rounded-full border-2 border-gray-600 animate-spin-slow flex items-center justify-center">
          <HiMusicNote className="w-3 h-3 text-white" />
        </div>
      </div>

      {/* Bottom Info */}
      <div className="absolute bottom-4 left-3 right-16">
        <p className="text-sm font-bold text-white">@{username || "username"}</p>
        <p className="text-xs text-white/90 mt-1 line-clamp-3">{fullCaption}</p>
        {locationTag && (
          <p className="text-[10px] text-white/70 mt-1 flex items-center gap-1">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            {locationTag}
          </p>
        )}
        <div className="mt-2 flex items-center gap-2">
          <HiMusicNote className="w-3 h-3 text-white" />
          <div className="overflow-hidden">
            <p className="text-[10px] text-white whitespace-nowrap animate-marquee">
              {soundName || "Original sound"} - {username || "username"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
