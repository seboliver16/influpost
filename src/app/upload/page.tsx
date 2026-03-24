"use client";

import { useState, useEffect, useCallback } from "react";
import { collection, addDoc, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Platform, PostMetadata, ConnectedAccount } from "@/types";
import AppLayout from "@/components/layout/AppLayout";
import VideoUploader from "@/components/VideoUploader";
import PostForm from "@/components/PostForm";
import YouTubePreview from "@/components/previews/YouTubePreview";
import InstagramPreview from "@/components/previews/InstagramPreview";
import TikTokPreview from "@/components/previews/TikTokPreview";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { HiOutlineEye } from "react-icons/hi";

export default function UploadPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [videoData, setVideoData] = useState<{
    id: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    thumbnailDataUrl?: string;
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [previewTab, setPreviewTab] = useState<Platform>("youtube");

  // Live form state for previews
  const [previewTitle, setPreviewTitle] = useState("My Amazing Video");
  const [previewDescription, setPreviewDescription] = useState("");
  const [previewHashtags, setPreviewHashtags] = useState<string[]>([]);
  const [previewLocation, setPreviewLocation] = useState("");

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "connectedAccounts"), where("userId", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      setAccounts(snap.docs.map((d) => ({ id: d.id, ...d.data() } as ConnectedAccount)));
    });
    return unsub;
  }, [user]);

  const connectedPlatforms = [...new Set(accounts.map((a) => a.platform))] as Platform[];

  const handleSchedule = async (data: {
    metadata: PostMetadata;
    platforms: Platform[];
    scheduledFor: Date;
  }) => {
    if (!user || !videoData) return;
    setSaving(true);
    try {
      await addDoc(collection(db, "scheduledPosts"), {
        videoId: videoData.id,
        videoUrl: videoData.url,
        videoFileName: videoData.fileName,
        thumbnailUrl: videoData.thumbnailDataUrl || null,
        metadata: data.metadata,
        platforms: data.platforms,
        accountIds: accounts
          .filter((a) => data.platforms.includes(a.platform))
          .map((a) => a.id),
        scheduledFor: data.scheduledFor,
        status: "scheduled",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: user.uid,
      });
      toast.success("Post scheduled successfully!");
      router.push("/schedule");
    } catch {
      toast.error("Failed to schedule post");
    } finally {
      setSaving(false);
    }
  };

  const handleFormChange = useCallback((data: {
    title: string;
    description: string;
    hashtags: string[];
    locationTag: string;
  }) => {
    setPreviewTitle(data.title || "My Amazing Video");
    setPreviewDescription(data.description);
    setPreviewHashtags(data.hashtags);
    setPreviewLocation(data.locationTag);
  }, []);

  const userAccountName = accounts.length > 0
    ? accounts[0].displayName
    : user?.displayName || user?.email?.split("@")[0] || "Creator";

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Upload & Schedule</h1>
          <p className="text-gray-400 mt-1">
            Upload your video, preview across platforms, and schedule your post
          </p>
        </div>

        {!videoData ? (
          <VideoUploader onUploadComplete={setVideoData} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left - Form */}
            <div className="space-y-6">
              <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  {videoData.thumbnailDataUrl ? (
                    <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={videoData.thumbnailDataUrl}
                        alt="Video thumbnail"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-white">Video uploaded</p>
                    <p className="text-xs text-gray-500">{videoData.fileName}</p>
                  </div>
                </div>
                <PostForm
                  onSubmit={handleSchedule}
                  onChange={handleFormChange}
                  loading={saving}
                  connectedPlatforms={connectedPlatforms}
                />
              </div>
            </div>

            {/* Right - Preview */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <HiOutlineEye className="w-5 h-5 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-300">Platform Preview</h3>
              </div>

              {/* Preview tabs */}
              <div className="flex gap-2">
                {(["youtube", "instagram", "tiktok"] as Platform[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPreviewTab(p)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                      previewTab === p
                        ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                        : "text-gray-400 hover:text-white border border-transparent"
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>

              {/* Preview content */}
              <div className="flex justify-center p-6 bg-gray-900/30 border border-gray-800 rounded-2xl min-h-[500px]">
                {previewTab === "youtube" && (
                  <YouTubePreview
                    videoUrl={videoData.url}
                    title={previewTitle}
                    description={previewDescription}
                    channelName={userAccountName}
                    hashtags={previewHashtags}
                  />
                )}
                {previewTab === "instagram" && (
                  <InstagramPreview
                    videoUrl={videoData.url}
                    description={previewDescription}
                    username={userAccountName.replace(/\s+/g, "").toLowerCase()}
                    hashtags={previewHashtags}
                    locationTag={previewLocation}
                  />
                )}
                {previewTab === "tiktok" && (
                  <TikTokPreview
                    videoUrl={videoData.url}
                    description={previewDescription}
                    username={userAccountName.replace(/\s+/g, "").toLowerCase()}
                    hashtags={previewHashtags}
                    locationTag={previewLocation}
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
