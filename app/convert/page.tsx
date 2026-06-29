"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CONVERSION_OPTIONS, ConversionCategory, getConversionsByCategory } from "@/utils/formats";
import { FileDropzone } from "@/components/converter/FileDropzone";
import { FormatSelector } from "@/components/converter/FormatSelector";
import { ConversionProgress } from "@/components/converter/ConversionProgress";
import { useConversion } from "@/hooks/useConversion";
import { FileText, Image, Video, Music, Scan, Archive, Cpu } from "lucide-react";
import { cn } from "@/utils/helpers";

const CATEGORY_TABS: { key: ConversionCategory | "all"; label: string; icon: React.ReactNode }[] = [
  { key: "all",      label: "All",       icon: <Cpu size={16} /> },
  { key: "document", label: "Documents", icon: <FileText size={16} /> },
  { key: "image",    label: "Images",    icon: <Image size={16} /> },
  { key: "video",    label: "Video",     icon: <Video size={16} /> },
  { key: "audio",    label: "Audio",     icon: <Music size={16} /> },
  { key: "ocr",      label: "OCR",       icon: <Scan size={16} /> },
  { key: "compress", label: "Compress",  icon: <Archive size={16} /> },
];

function ConvertPageInner() {
  const params = useSearchParams();
  const initialCat = (params.get("category") as ConversionCategory) ?? "all";

  const [activeCategory, setActiveCategory] = useState<ConversionCategory | "all">(initialCat);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [outputFormat, setOutputFormat] = useState<string>("");
  const [inputFormat, setInputFormat] = useState<string>("");

  const { startConversion, job, uploadProgress, isUploading, isConverting, cancel, reset } =
    useConversion();

  const filteredOptions =
    activeCategory === "all"
      ? CONVERSION_OPTIONS
      : getConversionsByCategory(activeCategory);

  const availableOutputs =
    filteredOptions.find((o) => o.from === inputFormat)?.to ?? [];

  const handleFileSelect = (file: File) => {
    reset();
    setSelectedFile(file);
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    setInputFormat(ext);
    setOutputFormat("");
  };

  const handleConvert = async () => {
    if (!selectedFile || !outputFormat) return;
    const cat = filteredOptions.find((o) => o.from === inputFormat)?.category ?? "document";
    await startConversion(selectedFile, outputFormat, cat);
  };

  const showProgress = isUploading || isConverting || !!job;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold mb-2">File Converter</h1>
        <p className="text-muted-foreground mb-8">Upload a file and select output format to begin</p>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveCategory(tab.key)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeCategory === tab.key
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-muted hover:bg-muted/80 text-muted-foreground"
              )}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {showProgress ? (
          <ConversionProgress
            job={job}
            uploadProgress={uploadProgress}
            isUploading={isUploading}
            onCancel={cancel}
            onReset={reset}
          />
        ) : (
          <div className="space-y-6">
            {/* Drop zone */}
            <FileDropzone onFileSelect={handleFileSelect} selectedFile={selectedFile} />

            {/* Format Selector */}
            {selectedFile && (
              <FormatSelector
                inputFormat={inputFormat}
                availableOutputs={availableOutputs}
                outputFormat={outputFormat}
                onOutputChange={setOutputFormat}
              />
            )}

            {/* Convert Button */}
            {selectedFile && outputFormat && (
              <button
                onClick={handleConvert}
                className="w-full bg-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                Convert {inputFormat.toUpperCase()} → {outputFormat.toUpperCase()}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ConvertPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading…</div>}>
      <ConvertPageInner />
    </Suspense>
  );
}
