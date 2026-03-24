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
      video.onloadeddata = () => { video.currentTime = Math.min(1, video.duration / 4); };
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
          } else { resolve(undefined); }
        } catch { resolve(undefined); }
      };
      video.onerror = () => resolve(undefined);
      video.src = URL.createObjectURL(file);
    } catch { resolve(undefined); }
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
      const maxSize = 500 * 1024 * 1024;
      if (file.size > maxSize) { setError("File size must be under 500MB"); return; }
      setUploading(true);
      setError(null);
      setProgress(0);
      setFileName(file.name);
      setFileSize(file.size);
      const thumbnailPromise = generateThumbnail(file);
      const videoId = uuidv4();
      const storageRef = ref(storage, `videos/${user.uid}/${videoId}/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
        customMetadata: { originalName: file.name, userId: user.uid },
      });
      uploadTask.on(
        "state_changed",
        (snapshot) => { setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100)); },
        (err) => { setError(err.message); setUploading(false); },
        async () => {
          const [url, thumbnailDataUrl] = await Promise.all([
            getDownloadURL(uploadTask.snapshot.ref),
            thumbnailPromise,
          ]);
          onUploadComplete({ id: videoId, url, fileName: file.name, fileSize: file.size, mimeType: file.type, thumbnailDataUrl });
          setUploading(false);
          setProgress(100);
        }
      );
    },
    [user, onUploadComplete]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".avi", ".mkv", ".webm"] },
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <div
      {...getRootProps()}
      className={`relative border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all duration-200 ${
        isDragActive
          ? "border-brand-500 bg-brand-50"
          : uploading
          ? "border-gray-200 bg-gray-50 cursor-default"
          : "border-gray-300 hover:border-brand-400 hover:bg-gray-50"
      }`}
    >
      <input {...getInputProps()} />

      {uploading ? (
        <div className="space-y-4">
          <div className="w-14 h-14 mx-auto bg-brand-50 rounded-xl flex items-center justify-center">
            <HiOutlineFilm className="w-7 h-7 text-brand-600" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold">Uploading video...</p>
            <p className="text-sm text-gray-500 mt-1">{fileName} ({formatFileSize(fileSize)})</p>
            <p className="text-xs text-gray-400 mt-0.5">{progress}% complete</p>
          </div>
          <div className="w-64 mx-auto bg-gray-200 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-brand-600 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="w-14 h-14 mx-auto bg-gray-100 rounded-xl flex items-center justify-center">
            <HiOutlineCloudUpload className="w-7 h-7 text-gray-400" />
          </div>
          <div>
            <p className="text-gray-900 font-semibold">
              {isDragActive ? "Drop your video here" : "Drag & drop your video"}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              or click to browse &middot; MP4, MOV, AVI, MKV, WebM up to 500MB
            </p>
          </div>
        </div>
      )}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
    </div>
  );
}
