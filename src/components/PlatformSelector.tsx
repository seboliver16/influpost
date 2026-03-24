"use client";

import { Platform } from "@/types";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

interface PlatformSelectorProps {
  selected: Platform[];
  onToggle: (platform: Platform) => void;
  connectedPlatforms?: Platform[];
}

const platforms: { id: Platform; name: string; icon: typeof FaYoutube; color: string; selectedBg: string; selectedBorder: string }[] = [
  {
    id: "youtube",
    name: "YouTube",
    icon: FaYoutube,
    color: "text-red-600",
    selectedBg: "bg-red-50",
    selectedBorder: "border-red-200",
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-600",
    selectedBg: "bg-pink-50",
    selectedBorder: "border-pink-200",
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: FaTiktok,
    color: "text-gray-900",
    selectedBg: "bg-gray-50",
    selectedBorder: "border-gray-300",
  },
];

export default function PlatformSelector({
  selected,
  onToggle,
  connectedPlatforms = ["youtube", "instagram", "tiktok"],
}: PlatformSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {platforms.map((platform) => {
        const isSelected = selected.includes(platform.id);
        const isConnected = connectedPlatforms.includes(platform.id);

        return (
          <button
            key={platform.id}
            onClick={() => isConnected && onToggle(platform.id)}
            disabled={!isConnected}
            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-lg border transition-all duration-150 cursor-pointer ${
              isSelected
                ? `${platform.selectedBg} ${platform.selectedBorder} ${platform.color}`
                : isConnected
                ? "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white"
                : "border-gray-100 text-gray-300 bg-gray-50 cursor-not-allowed"
            }`}
          >
            <platform.icon className={`w-4 h-4 ${isSelected ? platform.color : ""}`} />
            <span className="text-sm font-medium">{platform.name}</span>
            {!isConnected && (
              <span className="text-[10px] text-gray-400">Not connected</span>
            )}
          </button>
        );
      })}
    </div>
  );
}
