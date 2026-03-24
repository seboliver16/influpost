"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { v4 as uuidv4 } from "uuid";
import { HiOutlineCloudUpload, HiOutlineFilm } from "react-icons/hi";

interface VideoUploaderProps {
  onUploadComplete: (videoData: {
    id: string;
    url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
  }) => void;
}

export default function VideoUploader({ onUploadComplete }: VideoUploaderProps) {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

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
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadComplete({
            id: videoId,
            url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
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
            <p className="text-sm text-gray-400 mt-1">{progress}% complete</p>
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
