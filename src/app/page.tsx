"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import {
  HiOutlineCloudUpload,
  HiOutlineEye,
  HiOutlineCalendar,
  HiOutlineLightningBolt,
  HiOutlineShieldCheck,
  HiOutlineGlobe,
} from "react-icons/hi";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-lg font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
              influpost
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">Sign In</Button>
            </Link>
            <Link href="/signup">
              <Button size="sm">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 via-transparent to-transparent" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-violet-500/10 rounded-full blur-[120px]" />

        <div className="max-w-4xl mx-auto text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-violet-500/10 border border-violet-500/20 rounded-full text-violet-400 text-sm font-medium mb-8">
            <span className="w-2 h-2 bg-violet-400 rounded-full animate-pulse" />
            Now supporting YouTube, Instagram & TikTok
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
            Upload once,
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
              publish everywhere.
            </span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            Preview exactly how your video will look on each platform, schedule your posts,
            and reach your entire audience — all from one place.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/signup">
              <Button size="lg">
                Start for Free
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Platform icons */}
          <div className="mt-12 flex items-center justify-center gap-8">
            {[
              { icon: FaYoutube, color: "text-red-500", label: "YouTube" },
              { icon: FaInstagram, color: "text-pink-500", label: "Instagram" },
              { icon: FaTiktok, color: "text-cyan-400", label: "TikTok" },
            ].map((p) => (
              <div key={p.label} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-gray-800/50 border border-gray-700/50 rounded-2xl flex items-center justify-center">
                  <p.icon className={`w-7 h-7 ${p.color}`} />
                </div>
                <span className="text-xs text-gray-500">{p.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white">
              Everything you need to go viral
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              One platform to manage all your video content across every major social network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: HiOutlineCloudUpload,
                title: "Upload Once",
                description:
                  "Upload your video file once and distribute it to YouTube, Instagram, and TikTok simultaneously.",
              },
              {
                icon: HiOutlineEye,
                title: "Platform Previews",
                description:
                  "See exactly how your content will appear on each platform before publishing.",
              },
              {
                icon: HiOutlineCalendar,
                title: "Smart Scheduling",
                description:
                  "Schedule posts for the perfect time on each platform with our intuitive calendar.",
              },
              {
                icon: HiOutlineLightningBolt,
                title: "Quality Preservation",
                description:
                  "Your video quality, sound, and metadata are preserved exactly as uploaded. No compression.",
              },
              {
                icon: HiOutlineShieldCheck,
                title: "Secure Connections",
                description:
                  "OAuth 2.0 secure connections to your social accounts. We never store your passwords.",
              },
              {
                icon: HiOutlineGlobe,
                title: "Full Metadata Control",
                description:
                  "Hashtags, location tags, descriptions, privacy settings — control everything from one form.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="p-6 bg-gray-900/50 border border-gray-800 rounded-2xl hover:border-gray-700 transition-all group"
              >
                <div className="w-11 h-11 bg-violet-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-violet-500/20 transition">
                  <feature.icon className="w-5 h-5 text-violet-400" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="p-12 bg-gradient-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-3xl relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/5 to-indigo-500/5" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white">
                Ready to grow your audience?
              </h2>
              <p className="mt-4 text-gray-400 max-w-md mx-auto">
                Join thousands of creators who save hours every week with influpost.
              </p>
              <div className="mt-8">
                <Link href="/signup">
                  <Button size="lg">Get Started Free</Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-md flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-400">influpost</span>
          </div>
          <p className="text-xs text-gray-600">&copy; 2025 influpost. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
