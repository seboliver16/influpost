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
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Post to platforms
        </label>
        <PlatformSelector
          selected={selectedPlatforms}
          onToggle={togglePlatform}
          connectedPlatforms={connectedPlatforms}
        />
      </div>

      <Input
        label="Title"
        placeholder="Enter video title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          className="w-full px-3.5 py-2.5 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all duration-150 min-h-[100px] resize-y"
          placeholder="Write your post description..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <HiOutlineHashtag className="inline w-4 h-4 mr-1 text-gray-400" />
          Hashtags
        </label>
        <div className="flex flex-wrap gap-1.5 mb-2">
          {hashtags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 px-2.5 py-1 bg-brand-50 text-brand-700 text-xs font-medium rounded-full"
            >
              #{tag}
              <button
                type="button"
                onClick={() => removeHashtag(tag)}
                className="ml-0.5 hover:text-brand-900 cursor-pointer"
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

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <HiOutlineLocationMarker className="inline w-4 h-4 mr-1 text-gray-400" />
          Location Tag
        </label>
        <Input
          placeholder="Add a location"
          value={locationTag}
          onChange={(e) => setLocationTag(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          <HiOutlineLockClosed className="inline w-4 h-4 mr-1 text-gray-400" />
          Privacy
        </label>
        <div className="flex gap-2">
          {(["public", "unlisted", "private"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPrivacy(option)}
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer ${
                privacy === option
                  ? "bg-brand-50 text-brand-700 border border-brand-200"
                  : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Category (optional)"
        placeholder="e.g., Entertainment, Education, Gaming"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />

      <div className="grid grid-cols-2 gap-3">
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
