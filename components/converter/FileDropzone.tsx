"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File, X } from "lucide-react";
import { formatFileSize, UPLOAD_LIMIT_BYTES } from "@/utils/formats";
import { cn } from "@/utils/helpers";
import toast from "react-hot-toast";

interface Props {
  onFileSelect: (file: File) => void;
  selectedFile: File | null;
}

export function FileDropzone({ onFileSelect, selectedFile }: Props) {
  const onDrop = useCallback(
    (accepted: File[], rejected: { errors: { code: string }[] }[]) => {
      if (rejected.length > 0) {
        const code = rejected[0]?.errors[0]?.code;
        if (code === "file-too-large") {
          toast.error(`File too large. Max size is ${formatFileSize(UPLOAD_LIMIT_BYTES)}`);
        } else {
          toast.error("File rejected. Please check the format.");
        }
        return;
      }
      if (accepted[0]) onFileSelect(accepted[0]);
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxSize: UPLOAD_LIMIT_BYTES,
    multiple: false,
  });

  if (selectedFile) {
    return (
      <div className="border border-border rounded-xl p-6 flex items-center gap-4 bg-card">
        <div className="bg-primary/10 p-3 rounded-lg">
          <File size={24} className="text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{selectedFile.name}</p>
          <p className="text-sm text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
        </div>
        <button
          onClick={() => onFileSelect(selectedFile)}
          className="text-muted-foreground hover:text-destructive transition-colors"
          title="Remove file"
        >
          <X size={20} />
        </button>
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn("upload-zone", isDragActive && "active")}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-3">
        <div className="bg-primary/10 p-5 rounded-2xl">
          <Upload size={36} className="text-primary" />
        </div>
        <div>
          <p className="font-semibold text-lg">
            {isDragActive ? "Drop your file here" : "Drag & drop your file here"}
          </p>
          <p className="text-muted-foreground text-sm mt-1">
            or click to browse — Max {formatFileSize(UPLOAD_LIMIT_BYTES)}
          </p>
        </div>
      </div>
    </div>
  );
}
