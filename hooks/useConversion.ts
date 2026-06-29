"use client";

import { useEffect, useState, useCallback } from "react";
import {
  enqueueConversion,
  listenToJob,
  cancelJob,
  ConversionJob,
  ConversionStatus,
} from "@/firebase/rtdb";
import { uploadFile, UploadProgress } from "@/firebase/storage";
import { useAuth } from "./useAuth";
import { getFileExtension, sanitizeFilename } from "@/utils/formats";
import { getErrorMessage } from "@/utils/helpers";
import toast from "react-hot-toast";

interface UseConversionReturn {
  startConversion: (file: File, outputFormat: string, category: string) => Promise<string | null>;
  job: ConversionJob | null;
  uploadProgress: UploadProgress | null;
  isUploading: boolean;
  isConverting: boolean;
  cancel: () => void;
  reset: () => void;
}

export function useConversion(): UseConversionReturn {
  const { user } = useAuth();
  const [job, setJob] = useState<ConversionJob | null>(null);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentJobId, setCurrentJobId] = useState<string | null>(null);

  // Subscribe to live job updates
  useEffect(() => {
    if (!currentJobId) return;
    const unsub = listenToJob(currentJobId, (j) => setJob(j));
    return unsub;
  }, [currentJobId]);

  const startConversion = useCallback(
    async (file: File, outputFormat: string, category: string): Promise<string | null> => {
      const userId = user?.uid ?? "guest";
      try {
        // 1. Upload file
        setIsUploading(true);
        const { url } = await uploadFile(file, userId, setUploadProgress);
        setIsUploading(false);

        // 2. Enqueue job
        const inputFormat = getFileExtension(file.name);
        const jobId = await enqueueConversion({
          userId,
          inputFile: url,
          inputFormat,
          outputFormat,
          status: "queued",
          progress: 0,
          fileSize: file.size,
          category,
        });

        setCurrentJobId(jobId);

        // 3. Call conversion API
        const res = await fetch("/api/convert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            jobId,
            inputUrl: url,
            inputFormat,
            outputFormat,
            category,
            userId,
            originalName: sanitizeFilename(file.name),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: "Conversion failed" }));
          throw new Error(err.error ?? "Conversion failed");
        }

        return jobId;
      } catch (err) {
        setIsUploading(false);
        toast.error(getErrorMessage(err));
        return null;
      }
    },
    [user]
  );

  const cancel = useCallback(() => {
    if (currentJobId) cancelJob(currentJobId);
    reset();
  }, [currentJobId]);

  const reset = useCallback(() => {
    setJob(null);
    setUploadProgress(null);
    setIsUploading(false);
    setCurrentJobId(null);
  }, []);

  const isConverting =
    job?.status === "queued" || job?.status === "processing";

  return { startConversion, job, uploadProgress, isUploading, isConverting, cancel, reset };
}

export type { ConversionStatus };
