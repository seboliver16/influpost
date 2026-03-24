export type Platform = "youtube" | "instagram" | "tiktok";

export interface ConnectedAccount {
  id: string;
  platform: Platform;
  username: string;
  displayName: string;
  avatarUrl: string;
  accessToken: string;
  refreshToken?: string;
  connectedAt: Date;
  userId: string;
}

export interface VideoFile {
  id: string;
  fileName: string;
  fileSize: number;
  duration?: number;
  width?: number;
  height?: number;
  mimeType: string;
  storageUrl: string;
  thumbnailUrl?: string;
  uploadedAt: Date;
  userId: string;
}

export interface PostMetadata {
  title: string;
  description: string;
  hashtags: string[];
  locationTag?: string;
  privacy: "public" | "private" | "unlisted";
  category?: string;
  thumbnailUrl?: string;
}

export interface ScheduledPost {
  id: string;
  videoId: string;
  videoUrl: string;
  videoFileName: string;
  thumbnailUrl?: string;
  metadata: PostMetadata;
  platforms: Platform[];
  accountIds: string[];
  scheduledFor: Date;
  status: "scheduled" | "publishing" | "published" | "failed";
  publishResults?: {
    platform: Platform;
    status: "success" | "failed";
    postUrl?: string;
    error?: string;
  }[];
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  connectedAccounts: ConnectedAccount[];
  createdAt: Date;
}
