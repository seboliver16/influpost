"use client";

import { useState, useEffect } from "react";
import { HiOutlineHashtag, HiOutlineLocationMarker, HiOutlineLockClosed } from "react-icons/hi";
import Input from "./ui/Input";
import Button from "./ui/Button";
import { PostMetadata, Platform } from "@/types";
import PlatformSelector from "./PlatformSelector";

interface PostFormChangeData {
  title: string;
  description: string;
  hashtags: string[];
  locationTag: string;
}

interface PostFormProps {
  onSubmit: (data: {
    metadata: PostMetadata;
    platforms: Platform[];
    scheduledFor: Date;
  }) => void;
  onChange?: (data: PostFormChangeData) => void;
  loading?: boolean;
  connectedPlatforms?: Platform[];
}

export default function PostForm({ onSubmit, onChange, loading, connectedPlatforms }: PostFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [hashtagInput, setHashtagInput] = useState("");
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [locationTag, setLocationTag] = useState("");
  const [privacy, setPrivacy] = useState<"public" | "private" | "unlisted">("public");
  const [category, setCategory] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<Platform[]>([]);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  useEffect(() => {
    onChange?.({ title, description, hashtags, locationTag });
  }, [title, description, hashtags, locationTag, onChange]);

  const handleAddHashtag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      const tag = hashtagInput.trim().replace(/^#/, "");
      if (tag && !hashtags.includes(tag)) {
        setHashtags([...hashtags, tag]);
      }
      setHashtagInput("");
    }
  };

  const removeHashtag = (tag: string) => {
    setHashtags(hashtags.filter((t) => t !== tag));
  };

  const togglePlatform = (platform: Platform) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform)
        ? prev.filter((p) => p !== platform)
        : [...prev, platform]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!scheduledDate || !scheduledTime || selectedPlatforms.length === 0) return;

    const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);

    onSubmit({
      metadata: {
        title,
        description,
        hashtags,
        locationTag: locationTag || undefined,
        privacy,
        category: category || undefined,
      },
      platforms: selectedPlatforms,
      scheduledFor,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          Post to platforms
        </label>
        <PlatformSelector
          selected={selectedPlatforms}
          onToggle={togglePlatform}
          connectedPlatforms={connectedPlatforms}
        />
      </div>

      {/* Title */}
      <Input
        label="Title"
        placeholder="Enter video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-h-[100px] resize-y"
          placeholder="Write your post description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      {/* Hashtags */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          <HiOutlineHashtag className="inline w-4 h-4 mr-1" />
          Hashtags
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full border border-violet-500/20"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeHashtag(tag)}
                className="ml-0.5 hover:text-white cursor-pointer"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <Input
          placeholder="Type a hashtag and press Enter"
          value={hashtagInput}
          onChange={(e) => setHashtagInput(e.target.value)}
          onKeyDown={handleAddHashtag}
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          <HiOutlineLocationMarker className="inline w-4 h-4 mr-1" />
          Location Tag
        </label>
        <Input
          placeholder="Add a location"
          value={locationTag}
          onChange={(e) => setLocationTag(e.target.value)}
        />
      </div>

      {/* Privacy */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          <HiOutlineLockClosed className="inline w-4 h-4 mr-1" />
          Privacy
        </label>
        <div className="flex gap-2">
          {(["public", "unlisted", "private"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPrivacy(option)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 cursor-pointer ${
                privacy === option
                  ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                  : "bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Category */}
      <Input
        label="Category (optional)"
        placeholder="e.g., Entertainment, Education, Gaming"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      {/* Schedule */}
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Schedule Date"
          type="date"
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          required
        />
        <Input
          label="Schedule Time"
          type="time"
          value={scheduledTime}
          onChange={(e) => setScheduledTime(e.target.value)}
          required
        />
      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        loading={loading}
        disabled={selectedPlatforms.length === 0 || !title || !scheduledDate || !scheduledTime}
      >
        Schedule Post
      </Button>
    </form>
  );
}
