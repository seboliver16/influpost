"use client";

import { HiHeart, HiChat, HiPaperAirplane, HiBookmark, HiDotsHorizontal } from "react-icons/hi";

interface InstagramPreviewProps {
  videoUrl?: string;
  description: string;
  username: string;
  userAvatar?: string;
  hashtags: string[];
  locationTag?: string;
}

export default function InstagramPreview({
  videoUrl,
  description,
  username,
  userAvatar,
  hashtags,
  locationTag,
}: InstagramPreviewProps) {
  const fullCaption =
    description +
    (hashtags.length > 0 ? "\n\n" + hashtags.map((t) => `#${t}`).join(" ") : "");

  return (
    <div className="w-full max-w-[420px] bg-white rounded-xl overflow-hidden shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-100">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 rounded-full p-[2px]">
          <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
            {userAvatar ? (
              <img src={userAvatar} className="w-full h-full rounded-full" alt="" />
            ) : (
              <span className="text-xs font-bold text-gray-700">
                {username[0]?.toUpperCase() || "U"}
              </span>
            )}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-900 truncate">
            {username || "username"}
          </p>
          {locationTag && (
            <p className="text-[10px] text-gray-500 truncate">{locationTag}</p>
          )}
        </div>
        <HiDotsHorizontal className="w-5 h-5 text-gray-900" />
      </div>

      {/* Video */}
      <div className="relative w-full aspect-[4/5] bg-black">
        {videoUrl ? (
          <video
            src={videoUrl}
            className="w-full h-full object-cover"
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

      {/* Actions */}
      <div className="px-3 pt-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <HiHeart className="w-6 h-6 text-gray-900 cursor-pointer" />
            <HiChat className="w-6 h-6 text-gray-900 cursor-pointer -scale-x-100" />
            <HiPaperAirplane className="w-6 h-6 text-gray-900 cursor-pointer -rotate-45" />
          </div>
          <HiBookmark className="w-6 h-6 text-gray-900 cursor-pointer" />
        </div>

        <p className="mt-2 text-xs font-semibold text-gray-900">0 likes</p>

        <div className="mt-1">
          <p className="text-xs text-gray-900">
            <span className="font-semibold">{username || "username"}</span>{" "}
            <span className="whitespace-pre-wrap">
              {fullCaption.length > 100
                ? fullCaption.slice(0, 100) + "... more"
                : fullCaption}
            </span>
          </p>
        </div>

        <p className="mt-1.5 text-[10px] text-gray-400 uppercase pb-3">Just now</p>
      </div>
    </div>
  );
}
