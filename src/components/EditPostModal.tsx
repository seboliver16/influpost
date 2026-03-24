"use client";

import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ScheduledPost, Platform } from "@/types";
import Button from "./ui/Button";
import Input from "./ui/Input";
import PlatformSelector from "./PlatformSelector";
import { HiOutlineX, HiOutlineHashtag, HiOutlineLocationMarker } from "react-icons/hi";
import toast from "react-hot-toast";
import { format } from "date-fns";

interface EditPostModalProps {
  post: ScheduledPost;
  onClose: () => void;
  connectedPlatforms?: Platform[];
}

export default function EditPostModal({ post, onClose, connectedPlatforms }: EditPostModalProps) {
  const [title, setTitle] = useState(post.metadata.title);
  const [description, setDescription] = useState(post.metadata.description);
  const [hashtags, setHashtags] = useState<string[]>(post.metadata.hashtags);
  const [hashtagInput, setHashtagInput] = useState("");
  const [locationTag, setLocationTag] = useState(post.metadata.locationTag || "");
  const [privacy, setPrivacy] = useState(post.metadata.privacy);
  const [platforms, setPlatforms] = useState<Platform[]>(post.platforms);
  const [scheduledDate, setScheduledDate] = useState(format(post.scheduledFor, "yyyy-MM-dd"));
  const [scheduledTime, setScheduledTime] = useState(format(post.scheduledFor, "HH:mm"));
  const [saving, setSaving] = useState(false);

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
    setPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  const handleSave = async () => {
    if (!title || !scheduledDate || !scheduledTime || platforms.length === 0) return;
    setSaving(true);
    try {
      const scheduledFor = new Date(`${scheduledDate}T${scheduledTime}`);
      await updateDoc(doc(db, "scheduledPosts", post.id), {
        metadata: {
          ...post.metadata,
          title,
          description,
          hashtags,
          locationTag: locationTag || undefined,
          privacy,
        },
        platforms,
        scheduledFor,
        updatedAt: new Date(),
      });
      toast.success("Post updated!");
      onClose();
    } catch {
      toast.error("Failed to update post");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-800 sticky top-0 bg-gray-900 rounded-t-2xl z-10">
          <h2 className="text-lg font-semibold text-white">Edit Post</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition cursor-pointer"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <div className="p-5 space-y-5">
          {/* Platforms */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Platforms</label>
            <PlatformSelector
              selected={platforms}
              onToggle={togglePlatform}
              connectedPlatforms={connectedPlatforms}
            />
          </div>

          {/* Title */}
          <Input
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Description</label>
            <textarea
              className="w-full px-4 py-2.5 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 min-h-[80px] resize-y"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
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
              value={locationTag}
              onChange={(e) => setLocationTag(e.target.value)}
              placeholder="Add a location"
            />
          </div>

          {/* Privacy */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Privacy</label>
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

          {/* Schedule */}
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              required
            />
            <Input
              label="Time"
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t border-gray-800 sticky bottom-0 bg-gray-900 rounded-b-2xl">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            loading={saving}
            disabled={!title || platforms.length === 0 || !scheduledDate || !scheduledTime}
          >
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}
