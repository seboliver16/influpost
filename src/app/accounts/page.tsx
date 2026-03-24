"use client";

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { ConnectedAccount, Platform } from "@/types";
import AppLayout from "@/components/layout/AppLayout";
import Button from "@/components/ui/Button";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import { HiOutlineTrash, HiOutlinePlus, HiOutlineShieldCheck } from "react-icons/hi";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";

const platformConfig = {
  youtube: {
    name: "YouTube",
    icon: FaYoutube,
    color: "text-red-500",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    gradient: "from-red-500 to-red-600",
    description: "Upload videos to your YouTube channel",
  },
  instagram: {
    name: "Instagram",
    icon: FaInstagram,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    gradient: "from-purple-500 via-pink-500 to-orange-400",
    description: "Share Reels to your Instagram account",
  },
  tiktok: {
    name: "TikTok",
    icon: FaTiktok,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    borderColor: "border-cyan-200",
    gradient: "from-cyan-400 to-pink-500",
    description: "Post videos to your TikTok profile",
  },
};

export default function AccountsPage() {
  const { user } = useAuth();
  const [accounts, setAccounts] = useState<ConnectedAccount[]>([]);
  const [connecting, setConnecting] = useState<Platform | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, "connectedAccounts"),
      where("userId", "==", user.uid)
    );
    const unsub = onSnapshot(q, (snap) => {
      setAccounts(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          connectedAt: d.data().connectedAt?.toDate(),
        })) as ConnectedAccount[]
      );
    });
    return unsub;
  }, [user]);

  const handleConnect = async (platform: Platform) => {
    if (!user) return;
    setConnecting(platform);

    // In production, this would open an OAuth flow for the platform.
    // For demo purposes, we simulate a successful connection.
    try {
      // Simulate OAuth delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const demoAccount: Omit<ConnectedAccount, "id"> = {
        platform,
        username: `${user.displayName?.replace(/\s+/g, "").toLowerCase() || user.email?.split("@")[0] || "user"}_${platform}`,
        displayName: user.displayName || user.email?.split("@")[0] || "User",
        avatarUrl: user.photoURL || "",
        accessToken: uuidv4(), // In production, this comes from OAuth
        connectedAt: new Date(),
        userId: user.uid,
      };

      await addDoc(collection(db, "connectedAccounts"), demoAccount);
      toast.success(`${platformConfig[platform].name} connected!`);
    } catch {
      toast.error(`Failed to connect ${platformConfig[platform].name}`);
    } finally {
      setConnecting(null);
    }
  };

  const handleDisconnect = async (accountId: string, platformName: string) => {
    try {
      await deleteDoc(doc(db, "connectedAccounts", accountId));
      toast.success(`${platformName} disconnected`);
    } catch {
      toast.error("Failed to disconnect account");
    }
  };

  const getConnectedAccount = (platform: Platform) =>
    accounts.find((a) => a.platform === platform);

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connected Accounts</h1>
          <p className="text-gray-500 mt-1">
            Connect your social media accounts to publish content
          </p>
        </div>

        {/* Security note */}
        <div className="flex items-start gap-3 p-4 bg-brand-50 border border-brand-100 rounded-xl">
          <HiOutlineShieldCheck className="w-5 h-5 text-brand-700 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm text-brand-700 font-medium">Secure OAuth Connection</p>
            <p className="text-xs text-gray-500 mt-1">
              We use OAuth 2.0 to securely connect to your accounts. We never store your
              passwords and you can revoke access at any time.
            </p>
          </div>
        </div>

        {/* Platform Cards */}
        <div className="space-y-4">
          {(Object.entries(platformConfig) as [Platform, typeof platformConfig.youtube][]).map(
            ([platform, config]) => {
              const connected = getConnectedAccount(platform);
              const isConnecting = connecting === platform;

              return (
                <div
                  key={platform}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 hover:shadow-md transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 ${config.bgColor} rounded-xl flex items-center justify-center`}
                      >
                        <config.icon className={`w-6 h-6 ${config.color}`} />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">
                          {config.name}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">
                          {config.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      {connected ? (
                        <>
                          <div className="text-right mr-2">
                            <p className="text-sm text-gray-900 font-medium">
                              @{connected.username}
                            </p>
                            <p className="text-xs text-gray-500">
                              Connected {format(connected.connectedAt, "MMM d, yyyy")}
                            </p>
                          </div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                            Connected
                          </span>
                          <button
                            onClick={() =>
                              handleDisconnect(connected.id, config.name)
                            }
                            className="p-2 text-gray-400 hover:text-red-500 rounded-xl hover:bg-red-50 transition cursor-pointer"
                          >
                            <HiOutlineTrash className="w-5 h-5" />
                          </button>
                        </>
                      ) : (
                        <Button
                          onClick={() => handleConnect(platform)}
                          loading={isConnecting}
                          variant="outline"
                        >
                          <HiOutlinePlus className="w-4 h-4 mr-1.5" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>

        {/* Info */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-900 mb-3">How it works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "1",
                title: "Connect",
                desc: "Link your social media accounts securely via OAuth",
              },
              {
                step: "2",
                title: "Upload",
                desc: "Upload your video and set metadata for each platform",
              },
              {
                step: "3",
                title: "Schedule",
                desc: "Pick a time and we'll publish to all selected platforms",
              },
            ].map((item) => (
              <div key={item.step} className="flex items-start gap-3">
                <div className="w-7 h-7 bg-brand-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-brand-700">{item.step}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
