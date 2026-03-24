"use client";

import { Platform } from "@/types";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

interface PlatformSelectorProps {
  selected: Platform[];
  onToggle: (platform: Platform) => void;
  connectedPlatforms?: Platform[];
}

const platforms: { id: Platform; name: string; icon: typeof FaYoutube; color: string; bgColor: string; borderColor: string }[] = [
  {
    id: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    color: "text-red-500",
    bgColor: "bg-red-500/10",
    borderColor: "border-red-500/30",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    borderColor: "border-pink-500/30",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "text-cyan-400",
    bgColor: "bg-cyan-400/10",
    borderColor: "border-cyan-400/30",
  },
];

export default function PlatformSelector({
  selected,
  onToggle,
  connectedPlatforms = ["youtube", "instagram", "tiktok"],
}: PlatformSelectorProps) {
  return (
    <div className="flex gap-3">
      {platforms.map((platform) => {
        const isSelected = selected.includes(platform.id);
        const isConnected = connectedPlatforms.includes(platform.id);

        return (
          <button
            key={platform.id}
            onClick={() => isConnected && onToggle(platform.id)}
            disabled={!isConnected}
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
              isSelected
                ? `${platform.bgColor} ${platform.borderColor} ${platform.color}`
                : isConnected
                ? "border-gray-700 text-gray-400 hover:border-gray-600 hover:text-gray-300"
                : "border-gray-800 text-gray-600 opacity-50 cursor-not-allowed"
            }`}
          >
            <platform.icon className={`w-5 h-5 ${isSelected ? platform.color : ""}`} />
            <span className="text-sm font-medium">{platform.name}</span>
            {!isConnected && (
              <span className="text-[10px] bg-gray-800 px-1.5 py-0.5 rounded text-gray-500">
                Not connected
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
