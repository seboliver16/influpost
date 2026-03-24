"use client";

import { useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { ScheduledPost, Platform } from "@/types";
import { FaYoutube, FaInstagram, FaTiktok } from "react-icons/fa";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

const platformIcons: Record<Platform, typeof FaYoutube> = {
  youtube: FaYoutube,
  instagram: FaInstagram,
  tiktok: FaTiktok,
};

const platformColors: Record<Platform, string> = {
  youtube: "text-red-600",
  instagram: "text-pink-600",
  tiktok: "text-gray-900",
};

const statusDot: Record<string, string> = {
  scheduled: "bg-amber-500",
  publishing: "bg-blue-500",
  published: "bg-emerald-500",
  failed: "bg-red-500",
};

interface CalendarViewProps {
  posts: ScheduledPost[];
}

export default function CalendarView({ posts }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  const getPostsForDay = (day: Date) =>
    posts.filter((p) => isSameDay(p.scheduledFor, day));

  const selectedPosts = selectedDay ? getPostsForDay(selectedDay) : [];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date())}
            className="px-3 py-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            Today
          </button>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 text-gray-400 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition cursor-pointer"
          >
            <HiChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-px">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-center text-xs font-medium text-gray-400 py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-px bg-gray-200 rounded-xl overflow-hidden border border-gray-200">
        {days.map((day) => {
          const dayPosts = getPostsForDay(day);
          const inMonth = isSameMonth(day, currentMonth);
          const today = isToday(day);
          const selected = selectedDay && isSameDay(day, selectedDay);

          return (
            <button
              key={day.toISOString()}
              onClick={() => setSelectedDay(day)}
              className={`min-h-[80px] p-1.5 text-left transition-all cursor-pointer ${
                inMonth ? "bg-white" : "bg-gray-50"
              } ${
                selected
                  ? "ring-2 ring-brand-500 ring-inset"
                  : "hover:bg-gray-50"
              }`}
            >
              <span
                className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                  today
                    ? "bg-brand-600 text-white"
                    : inMonth
                    ? "text-gray-900"
                    : "text-gray-400"
                }`}
              >
                {format(day, "d")}
              </span>

              {dayPosts.length > 0 && (
                <div className="mt-1 space-y-0.5">
                  {dayPosts.slice(0, 2).map((post) => (
                    <div
                      key={post.id}
                      className="flex items-center gap-1 px-1 py-0.5 rounded bg-gray-100"
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                          statusDot[post.status] || statusDot.scheduled
                        }`}
                      />
                      <span className="text-[9px] text-gray-600 truncate">
                        {post.metadata.title}
                      </span>
                    </div>
                  ))}
                  {dayPosts.length > 2 && (
                    <span className="text-[9px] text-gray-400 px-1">
                      +{dayPosts.length - 2} more
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">
          <h4 className="text-sm font-medium text-gray-900 mb-3">
            {format(selectedDay, "EEEE, MMMM d, yyyy")}
            <span className="text-gray-400 ml-2">
              {selectedPosts.length} post{selectedPosts.length !== 1 ? "s" : ""}
            </span>
          </h4>

          {selectedPosts.length === 0 ? (
            <p className="text-xs text-gray-400">No posts scheduled for this day.</p>
          ) : (
            <div className="space-y-3">
              {selectedPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-xl"
                >
                  <div
                    className={`w-2 h-2 rounded-full flex-shrink-0 ${
                      statusDot[post.status] || statusDot.scheduled
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {post.metadata.title}
                    </p>
                    <p className="text-xs text-gray-400">
                      {format(post.scheduledFor, "h:mm a")} &middot; {post.status}
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
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
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
