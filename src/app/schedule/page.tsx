"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ScheduledPost } from "@/types";
import AppLayout from "@/components/layout/AppLayout";
import CalendarView from "@/components/CalendarView";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { format, isToday, isTomorrow, isThisWeek } from "date-fns";
import {
  HiOutlineCalendar,
  HiOutlineCloudUpload,
  HiOutlineTrash,
  HiOutlineFilter,
  HiOutlinePencil,
} from "react-icons/hi";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import toast from "react-hot-toast";
import EditPostModal from "@/components/EditPostModal";

const platformIcons = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  tiktok: FaTiktok,
};

const platformColors = {
  youtube: "text-red-500",
  instagram: "text-pink-500",
  tiktok: "text-cyan-400",
};

type FilterStatus = "all" | "scheduled" | "published" | "failed";

export default function SchedulePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [filter, setFilter] = useState<FilterStatus>("all");
  const [view, setView] = useState<"list" | "calendar">("list");
  const [editingPost, setEditingPost] = useState<ScheduledPost | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, "scheduledPosts"),
      where("userId", "==", user.uid),
      orderBy("scheduledFor", "asc")
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        scheduledFor: d.data().scheduledFor?.toDate(),
        createdAt: d.data().createdAt?.toDate(),
        updatedAt: d.data().updatedAt?.toDate(),
      })) as ScheduledPost[];
      setPosts(data);
    });

    return unsub;
  }, [user]);

  const filteredPosts =
    filter === "all" ? posts : posts.filter((p) => p.status === filter);

  const handleDelete = async (postId: string) => {
    try {
      await deleteDoc(doc(db, "scheduledPosts", postId));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  const groupPosts = (posts: ScheduledPost[]) => {
    const groups: { label: string; posts: ScheduledPost[] }[] = [];
    const today: ScheduledPost[] = [];
    const tomorrow: ScheduledPost[] = [];
    const thisWeek: ScheduledPost[] = [];
    const later: ScheduledPost[] = [];
    const past: ScheduledPost[] = [];

    posts.forEach((post) => {
      const d = post.scheduledFor;
      if (d < new Date() && post.status !== "scheduled") {
        past.push(post);
      } else if (isToday(d)) {
        today.push(post);
      } else if (isTomorrow(d)) {
        tomorrow.push(post);
      } else if (isThisWeek(d)) {
        thisWeek.push(post);
      } else {
        later.push(post);
      }
    });

    if (today.length) groups.push({ label: "Today", posts: today });
    if (tomorrow.length) groups.push({ label: "Tomorrow", posts: tomorrow });
    if (thisWeek.length) groups.push({ label: "This Week", posts: thisWeek });
    if (later.length) groups.push({ label: "Later", posts: later });
    if (past.length) groups.push({ label: "Past", posts: past });

    return groups;
  };

  const groups = groupPosts(filteredPosts);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Scheduled Posts</h1>
            <p className="text-gray-400 mt-1">
              {posts.length} total post{posts.length !== 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-gray-800/50 rounded-xl border border-gray-700 p-1">
              <button
                onClick={() => setView("list")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  view === "list" ? "bg-gray-700 text-white" : "text-gray-400"
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView("calendar")}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer ${
                  view === "calendar" ? "bg-gray-700 text-white" : "text-gray-400"
                }`}
              >
                Calendar
              </button>
            </div>
            <Link href="/upload">
              <Button size="sm">
                <HiOutlineCloudUpload className="w-4 h-4 mr-1.5" />
                New Post
              </Button>
            </Link>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <HiOutlineFilter className="w-4 h-4 text-gray-500" />
          {(["all", "scheduled", "published", "failed"] as FilterStatus[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer ${
                  filter === f
                    ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    : "text-gray-400 border border-gray-800 hover:border-gray-700"
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
                {f !== "all" && (
                  <span className="ml-1.5 text-gray-600">
                    {posts.filter((p) => p.status === f).length}
                  </span>
                )}
              </button>
            )
          )}
        </div>

        {/* Calendar View */}
        {view === "calendar" && (
          <CalendarView posts={filteredPosts} />
        )}

        {/* List View */}
        {view === "list" && (filteredPosts.length === 0 ? (
          <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-16 text-center">
            <HiOutlineCalendar className="w-16 h-16 text-gray-700 mx-auto" />
            <h3 className="mt-4 text-lg font-medium text-white">No posts found</h3>
            <p className="mt-2 text-gray-400">
              {filter === "all"
                ? "Upload a video to create your first scheduled post"
                : `No ${filter} posts`}
            </p>
            <Link href="/upload" className="mt-4 inline-block">
              <Button>Upload Video</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {groups.map((group) => (
              <div key={group.label}>
                <h3 className="text-sm font-medium text-gray-500 mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
                  {group.label}
                </h3>
                <div className="space-y-3">
                  {group.posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all"
                    >
                      <div className="flex items-start gap-4">
                        <div className="w-24 h-16 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0">
                          {post.thumbnailUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={post.thumbnailUrl}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-semibold text-white truncate">
                                {post.metadata.title}
                              </h4>
                              <p className="text-xs text-gray-500 mt-0.5">
                                {format(post.scheduledFor, "EEEE, MMMM d, yyyy 'at' h:mm a")}
                              </p>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <Badge
                                variant={
                                  post.status === "published"
                                    ? "success"
                                    : post.status === "failed"
                                    ? "danger"
                                    : post.status === "publishing"
                                    ? "warning"
                                    : "default"
                                }
                              >
                                {post.status}
                              </Badge>
                              {post.status === "scheduled" && (
                                <>
                                  <button
                                    onClick={() => setEditingPost(post)}
                                    className="p-1.5 text-gray-500 hover:text-violet-400 rounded-lg hover:bg-violet-500/10 transition cursor-pointer"
                                  >
                                    <HiOutlinePencil className="w-4 h-4" />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(post.id)}
                                    className="p-1.5 text-gray-500 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition cursor-pointer"
                                  >
                                    <HiOutlineTrash className="w-4 h-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </div>

                          {post.metadata.description && (
                            <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                              {post.metadata.description}
                            </p>
                          )}

                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              {post.platforms.map((platform) => {
                                const Icon = platformIcons[platform];
                                return (
                                  <Icon
                                    key={platform}
                                    className={`w-3.5 h-3.5 ${platformColors[platform]}`}
                                  />
                                );
                              })}
                            </div>

                            {post.metadata.hashtags.length > 0 && (
                              <div className="flex items-center gap-1">
                                {post.metadata.hashtags.slice(0, 3).map((tag) => (
                                  <span
                                    key={tag}
                                    className="text-[10px] text-violet-400/70"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                                {post.metadata.hashtags.length > 3 && (
                                  <span className="text-[10px] text-gray-500">
                                    +{post.metadata.hashtags.length - 3}
                                  </span>
                                )}
                              </div>
                            )}

                            {post.metadata.locationTag && (
                              <span className="text-[10px] text-gray-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                {post.metadata.locationTag}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {editingPost && (
        <EditPostModal
          post={editingPost}
          onClose={() => setEditingPost(null)}
        />
      )}
    </AppLayout>
  );
}
