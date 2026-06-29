"use client";

import { CheckCircle2, XCircle, Loader2, Download, RotateCcw } from "lucide-react";
import { ConversionJob } from "@/firebase/rtdb";
import { UploadProgress } from "@/firebase/storage";
import { downloadFile } from "@/utils/helpers";

interface Props {
  job: ConversionJob | null;
  uploadProgress: UploadProgress | null;
  isUploading: boolean;
  onCancel: () => void;
  onReset: () => void;
}

export function ConversionProgress({ job, uploadProgress, isUploading, onCancel, onReset }: Props) {
  const status = job?.status ?? (isUploading ? "uploading" : "queued");
  const progress = isUploading
    ? (uploadProgress?.percentage ?? 0) * 0.3  // upload is 30% of total
    : 30 + ((job?.progress ?? 0) * 0.7);

  const isComplete = status === "completed";
  const isFailed = status === "failed";
  const isActive = !isComplete && !isFailed;

  return (
    <div className="bg-card border border-border rounded-2xl p-8 space-y-6">
      {/* Status Icon */}
      <div className="flex justify-center">
        {isComplete ? (
          <CheckCircle2 size={56} className="text-green-500" />
        ) : isFailed ? (
          <XCircle size={56} className="text-destructive" />
        ) : (
          <Loader2 size={56} className="text-primary animate-spin" />
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-1">
          {isUploading
            ? "Uploading file…"
            : status === "queued"
            ? "Waiting in queue…"
            : status === "processing"
            ? "Converting…"
            : status === "completed"
            ? "Conversion complete!"
            : "Conversion failed"}
        </h2>
        {isFailed && job?.errorMessage && (
          <p className="text-sm text-destructive">{job.errorMessage}</p>
        )}
      </div>

      {/* Progress Bar */}
      {isActive && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>{isUploading ? "Uploading" : `Converting (${job?.inputFormat?.toUpperCase()} → ${job?.outputFormat?.toUpperCase()})`}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3 justify-center">
        {isComplete && job?.outputUrl && (
          <button
            onClick={() => downloadFile(job.outputUrl!, `converted.${job.outputFormat}`)}
            className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            <Download size={18} /> Download File
          </button>
        )}
        <button
          onClick={isActive ? onCancel : onReset}
          className="flex items-center gap-2 border border-border px-6 py-3 rounded-xl font-semibold hover:bg-muted transition-colors"
        >
          <RotateCcw size={18} />
          {isActive ? "Cancel" : "Convert Another"}
        </button>
      </div>
    </div>
  );
}
