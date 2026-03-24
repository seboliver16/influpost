"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { HiOutlineCloudUpload, HiOutlineFilm } from "react-icons/hi";

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  if (bytes < 1024 * 1024 * 1024) return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  return (bytes / (1024 * 1024 * 1024)).toFixed(2) + " GB";
}

function generateThumbnail(file: File): Promise<string | undefined> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.muted = true;
      video.playsInline = true;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration / 4);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const ctx = canvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL("image/jpeg", 0.8);
            URL.revokeObjectURL(video.src);
            resolve(dataUrl);
          } else {
            resolve(undefined);
          }
        } catch {
          resolve(undefined);
        }
      };

      video.onerror = () => resolve(undefined);

      video.src = URL.createObjectURL(file);
    } catch {
      resolve(undefined);
    }
  });
}

interface VideoUploaderProps {
  onUploadComplete: (videoData: {
    id: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    thumbnailDataUrl?: string;
  }) => void;
}

export default function VideoUploader({ onUploadComplete }: VideoUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file || !user) return;

      const maxSize = 500 * 1024 * 1024; // 500MB
      if (file.size > maxSize) {
        setError("File size must be under 500MB");
        return;
      }

      setUploading(true);
      setError(null);
      setProgress(0);
      setFileName(file.name);
      setFileSize(file.size);

      // Generate thumbnail in parallel with upload
      const thumbnailPromise = generateThumbnail(file);

      const videoId = uuidv4();
      const storageRef = ref(storage, `videos/${user.uid}/${videoId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: {
          originalName: file.name,
          userId: user.uid,
        },
      });

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgress(pct);
        },
        (err) => {
          setError(err.message);
          setUploading(false);
        },
        async () => {
          const [url, thumbnailDataUrl] = await Promise.all([
            getDownloadURL(uploadTask.snapshot.ref),
            thumbnailPromise,
          ]);
          onUploadComplete({
            id: videoId,
            url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            thumbnailDataUrl,
          });
          setUploading(false);
          setProgress(100);
        }
      );
    },
    [user, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${
        isDragActive
          ? "border-violet-500 bg-violet-500/5"
          : uploading
          ? "border-gray-700 bg-gray-800/30 cursor-default"
          : "border-gray-700 hover:border-violet-500/50 hover:bg-gray-800/20"
      }`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-violet-500/10 rounded-2xl flex items-center justify-center">
            <HiOutlineFilm className="w-8 h-8 text-violet-400" />
          </div>
          <div>
            <p className="text-white font-medium">Uploading video...</p>
            <p className="text-sm text-gray-400 mt-1">
              {fileName} ({formatFileSize(fileSize)})
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{progress}% complete</p>
          </div>
          <div className="w-64 mx-auto bg-gray-800 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-800/50 rounded-2xl flex items-center justify-center group-hover:bg-violet-500/10">
            <HiOutlineCloudUpload className="w-8 h-8 text-gray-400" />
          </div>
          <div>
            <p className="text-white font-medium">
              {isDragActive ? "Drop your video here" : "Drag & drop your video"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse. MP4, MOV, AVI, MKV, WebM up to 500MB
            </p>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
