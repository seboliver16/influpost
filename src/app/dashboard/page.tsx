"use client";

import { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ScheduledPost, ConnectedAccount } from "@/types";
import AppLayout from "@/components/layout/AppLayout";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import Link from "next/link";
import { format } from "date-fns";
import {
  HiOutlineCloudUpload,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineCheckCircle,
  HiOutlineClock,
} from "react-icons/hi";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";

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

export default function DashboardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<ScheduledPost[]>([]);
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);

  useEffect(() => {
    if (!user) return;

    const postsQuery = query(
      collection(db, "scheduledPosts"),
      where("userId", "==", user.uid),
      orderBy("scheduledFor", "asc")
    );

    const unsubPosts = onSnapshot(postsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        scheduledFor: doc.data().scheduledFor?.toDate(),
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate(),
      })) as ScheduledPost[];
      setPosts(data);
    });

    const accountsQuery = query(
      collection(db, "connectedAccounts"),
      where("userId", "==", user.uid)
    );

    const unsubAccounts = onSnapshot(accountsQuery, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        connectedAt: doc.data().connectedAt?.toDate(),
      })) as ConnectedAccount[];
      setAccounts(data);
    });

    return () => {
      unsubPosts();
      unsubAccounts();
    };
  }, [user]);

  const scheduledCount = posts.filter((p) => p.status === "scheduled").length;
  const publishedCount = posts.filter((p) => p.status === "published").length;
  const upcomingPosts = posts
    .filter((p) => p.status === "scheduled")
    .slice(0, 5);

  const stats = [
    {
      label: "Scheduled Posts",
      value: scheduledCount,
      icon: HiOutlineClock,
      color: "text-violet-400",
      bgColor: "bg-violet-500/10",
    },
    {
      label: "Published",
      value: publishedCount,
      icon: HiOutlineCheckCircle,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
    },
    {
      label: "Connected Accounts",
      value: accounts.length,
      icon: HiOutlineUserGroup,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
    },
    {
      label: "Total Posts",
      value: posts.length,
      icon: HiOutlineCalendar,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
    },
  ];

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            <p className="text-gray-400 mt-1">
              Welcome back, {user?.displayName || user?.email?.split("@")[0]}
            </p>
          </div>
          <Link href="/upload">
            <Button>
              <HiOutlineCloudUpload className="w-4 h-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-gray-900/50 border border-gray-800 rounded-2xl p-5"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-white">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Upcoming Posts */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Upcoming Posts</h2>
            <Link href="/schedule" className="text-sm text-violet-400 hover:text-violet-300">
              View all
            </Link>
          </div>
          {upcomingPosts.length === 0 ? (
            <div className="p-12 text-center">
              <HiOutlineCalendar className="w-12 h-12 text-gray-700 mx-auto" />
              <p className="mt-4 text-gray-400">No scheduled posts yet</p>
              <Link href="/upload" className="mt-3 inline-block">
                <Button variant="outline" size="sm">
                  Create your first post
                </Button>
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-gray-800">
              {upcomingPosts.map((post) => (
                <div key={post.id} className="p-4 flex items-center gap-4">
                  <div className="w-16 h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {post.thumbnailUrl ? (
                      <img
                        src={post.thumbnailUrl}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">
                      {post.metadata.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {format(post.scheduledFor, "MMM d, yyyy 'at' h:mm a")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {post.platforms.map((platform) => {
                      const Icon = platformIcons[platform];
                      return (
                        <Icon
                          key={platform}
                          className={`w-4 h-4 ${platformColors[platform]}`}
                        />
                      );
                    })}
                  </div>
                  <Badge
                    variant={
                      post.status === "published"
                        ? "success"
                        : post.status === "failed"
                        ? "danger"
                        : "warning"
                    }
                  >
                    {post.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Connected Accounts */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Connected Accounts</h2>
            <Link href="/accounts" className="text-sm text-violet-400 hover:text-violet-300">
              Manage
            </Link>
          </div>
          {accounts.length === 0 ? (
            <div className="p-12 text-center">
              <HiOutlineUserGroup className="w-12 h-12 text-gray-700 mx-auto" />
              <p className="mt-4 text-gray-400">No connected accounts</p>
              <Link href="/accounts" className="mt-3 inline-block">
                <Button variant="outline" size="sm">
                  Connect an account
                </Button>
              </Link>
            </div>
          ) : (
            <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3">
              {accounts.map((account) => {
                const Icon = platformIcons[account.platform];
                return (
                  <div
                    key={account.id}
                    className="flex items-center gap-3 p-3 bg-gray-800/30 rounded-xl"
                  >
                    <Icon className={`w-5 h-5 ${platformColors[account.platform]}`} />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-white truncate">
                        {account.displayName}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{account.username}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
