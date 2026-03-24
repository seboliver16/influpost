import { create } from "zustand";
import { ConnectedAccount, ScheduledPost, Platform } from "@/types";

interface AppState {
  connectedAccounts: ConnectedAccount[];
  scheduledPosts: ScheduledPost[];
  selectedPlatforms: Platform[];
  setConnectedAccounts: (accounts: ConnectedAccount[]) => void;
  addConnectedAccount: (account: ConnectedAccount) => void;
  removeConnectedAccount: (id: string) => void;
  setScheduledPosts: (posts: ScheduledPost[]) => void;
  addScheduledPost: (post: ScheduledPost) => void;
  updateScheduledPost: (id: string, updates: Partial<ScheduledPost>) => void;
  removeScheduledPost: (id: string) => void;
  setSelectedPlatforms: (platforms: Platform[]) => void;
  togglePlatform: (platform: Platform) => void;
}

export const useStore = create<AppState>((set) => ({
  connectedAccounts: [],
  scheduledPosts: [],
  selectedPlatforms: [],

  setConnectedAccounts: (accounts) => set({ connectedAccounts: accounts }),
  addConnectedAccount: (account) =>
    set((state) => ({
      connectedAccounts: [...state.connectedAccounts, account],
    })),
  removeConnectedAccount: (id) =>
    set((state) => ({
      connectedAccounts: state.connectedAccounts.filter((a) => a.id !== id),
    })),

  setScheduledPosts: (posts) => set({ scheduledPosts: posts }),
  addScheduledPost: (post) =>
    set((state) => ({
      scheduledPosts: [...state.scheduledPosts, post],
    })),
  updateScheduledPost: (id, updates) =>
    set((state) => ({
      scheduledPosts: state.scheduledPosts.map((p) =>
        p.id === id ? { ...p, ...updates } : p
      ),
    })),
  removeScheduledPost: (id) =>
    set((state) => ({
      scheduledPosts: state.scheduledPosts.filter((p) => p.id !== id),
    })),

  setSelectedPlatforms: (platforms) => set({ selectedPlatforms: platforms }),
  togglePlatform: (platform) =>
    set((state) => ({
      selectedPlatforms: state.selectedPlatforms.includes(platform)
        ? state.selectedPlatforms.filter((p) => p !== platform)
        : [...state.selectedPlatforms, platform],
    })),
}));
